#!/usr/bin/env bun
/**
 * webdev CLI: Brownfield legacy environment scanner & idempotent webhook handler generator.
 *
 * Usage:
 *   bun webdev.ts --brownfield-scan [dir]
 *   bun webdev.ts --webhook-scaffold <stripe|shopify|generic>
 */

import fs from "node:fs";
import path from "node:path";

export interface BrownfieldReport {
  isBrownfield: boolean;
  markers: string[];
  recommendedPackageManager: string;
  lockedInvariants: string[];
  riskRating: "LOW" | "MEDIUM" | "HIGH";
}

export function scanBrownfield(targetDir = process.cwd()): BrownfieldReport {
  const markers: string[] = [];
  const lockedInvariants: string[] = [];

  // 1. Check WordPress / PHP markers
  if (fs.existsSync(path.join(targetDir, "wp-content")) || fs.existsSync(path.join(targetDir, "wp-config.php"))) {
    markers.push("WordPress Core / PHP Theme");
    lockedInvariants.push("Do NOT replace PHP with Node/SSR without signed migration SOW.");
  }

  // 2. Check Package Manager
  let pm = "npm";
  if (fs.existsSync(path.join(targetDir, "yarn.lock"))) {
    pm = "yarn";
    lockedInvariants.push("Lock package manager to yarn; do not run npm/bun install.");
  } else if (fs.existsSync(path.join(targetDir, "pnpm-lock.yaml"))) {
    pm = "pnpm";
    lockedInvariants.push("Lock package manager to pnpm; do not introduce npm/bun.");
  } else if (fs.existsSync(path.join(targetDir, "package-lock.json"))) {
    pm = "npm";
    lockedInvariants.push("Lock package manager to npm; do not introduce alternative package managers.");
  }

  // 3. Inspect package.json
  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

      if (allDeps["react-scripts"]) {
        markers.push("Create-React-App (react-scripts)");
        lockedInvariants.push("Do NOT migrate to Vite or Next.js in a feature PR.");
      }
      if (allDeps.webpack && !allDeps.next) {
        markers.push("Custom Webpack Configuration");
        lockedInvariants.push("Preserve Webpack build aliases and polyfills.");
      }
      if (allDeps.next && fs.existsSync(path.join(targetDir, "pages"))) {
        markers.push("Next.js Pages Router");
        lockedInvariants.push("Do NOT mass-migrate Pages Router to App Router.");
      }
      if (pkg.type !== "module") {
        markers.push("CommonJS Repository (type != module)");
        lockedInvariants.push("Do NOT convert CommonJS require/exports to ESM.");
      }
    } catch {
      // Ignored
    }
  }

  const isBrownfield = markers.length > 0;
  const riskRating = markers.length >= 2 ? "HIGH" : markers.length === 1 ? "MEDIUM" : "LOW";

  return {
    isBrownfield,
    markers,
    recommendedPackageManager: pm,
    lockedInvariants,
    riskRating,
  };
}

export function scaffoldWebhook(provider: "stripe" | "shopify" | "generic"): string {
  if (provider === "stripe") {
    return `// Production-Grade Idempotent Stripe Webhook Handler
import Stripe from "stripe";
import crypto from "node:crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

// Dedicated in-memory or Redis/DB event dedup cache (24hr TTL)
const processedEventCache = new Set<string>();

export async function handleStripeWebhook(req: Request): Promise<Response> {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), { status: 400 });
  }

  // 1. Raw body capture (MUST be arrayBuffer/text, never pre-parsed JSON)
  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  // 2. Atomic Idempotency Check
  if (processedEventCache.has(event.id)) {
    console.log(\`[Stripe Webhook] Duplicate event ignored: \${event.id}\`);
    return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
  }

  // 3. Mark in progress & process
  processedEventCache.add(event.id);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Offload or process business logic
        console.log(\`Payment completed for session: \${session.id}\`);
        break;
      }
      default:
        console.log(\`Unhandled event type: \${event.type}\`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    // Quarantine failure and remove from cache to allow legitimate retry if transient
    processedEventCache.delete(event.id);
    console.error(\`Failed to process event \${event.id}:\`, err);
    return new Response(JSON.stringify({ error: "Processing failed" }), { status: 500 });
  }
}
`;
  }

  if (provider === "shopify") {
    return `// Production-Grade Idempotent Shopify Webhook Handler
import crypto from "node:crypto";

const processedEventCache = new Set<string>();

export async function handleShopifyWebhook(req: Request): Promise<Response> {
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
  const webhookId = req.headers.get("x-shopify-webhook-id");
  const topic = req.headers.get("x-shopify-topic");

  if (!hmacHeader || !webhookId) {
    return new Response("Missing required Shopify headers", { status: 400 });
  }

  const rawBody = await req.text();
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET!;
  const generatedHash = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");

  // Constant-time comparison
  const isValid = crypto.timingSafeEqual(Buffer.from(generatedHash), Buffer.from(hmacHeader));
  if (!isValid) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (processedEventCache.has(webhookId)) {
    return new Response(JSON.stringify({ status: "duplicate", webhookId }), { status: 200 });
  }
  processedEventCache.add(webhookId);

  console.log(\`Processed Shopify webhook [\${topic}]: \${webhookId}\`);
  return new Response("OK", { status: 200 });
}
`;
  }

  return `// Production-Grade Generic Webhook Handler with HMAC & Idempotency
import crypto from "node:crypto";

export function verifyGenericWebhook(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
`;
}

export function scaffoldFormShield(provider = "turnstile"): string {
  return `// Production-Grade Anti-Spam Form Shield (${provider.toUpperCase()} + Honeypot + Zod)
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().email("Invalid email format").max(254),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
  // 1. Honeypot field (hidden from legitimate users, auto-filled by bots)
  website_url_hp: z.string().max(0, "Bot detected").optional().or(z.literal("")),
  // 2. Cloudflare Turnstile token
  turnstileToken: z.string().min(1, "Turnstile verification required"),
});

export async function handleContactSubmission(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  // 1. Validate boundary with Zod & Honeypot
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    // If honeypot failed, silently return fake 200 OK to discard bot submission
    const isBot = parsed.error.issues.some((i) => i.path.includes("website_url_hp"));
    if (isBot) {
      console.warn("[FormShield] Spam bot trapped in honeypot. Discarding silently.");
      return new Response(JSON.stringify({ success: true, message: "Thank you for reaching out!" }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }), { status: 400 });
  }

  const { name, email, phone, message, turnstileToken } = parsed.data;

  // 2. Cloudflare Turnstile Verification
  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: turnstileToken,
      remoteip: req.headers.get("x-forwarded-for") || "",
    }),
  });

  const turnstileData = (await verifyRes.json()) as { success: boolean; "error-codes"?: string[] };
  if (!turnstileData.success) {
    console.error("[FormShield] Turnstile challenge failed:", turnstileData["error-codes"]);
    return new Response(JSON.stringify({ error: "CAPTCHA challenge failed. Please retry." }), { status: 403 });
  }

  // 3. Process Verified Lead (Database insertion, CRM webhook, or Notification)
  console.log(\`[FormShield] Verified lead from \${email} (\${name})\`);

  return new Response(
    JSON.stringify({ success: true, message: "Submission received and verified." }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
`;
}

export interface MigrationSafetyReport {
  safe: boolean;
  violations: string[];
  recommendations: string[];
}

export function checkMigrationSafety(sqlOrMigrationContent: string): MigrationSafetyReport {
  const violations: string[] = [];
  const recommendations: string[] = [];

  const upper = sqlOrMigrationContent.toUpperCase();

  if (/\bDROP\s+TABLE\b/i.test(upper)) {
    violations.push("Destructive 'DROP TABLE' detected.");
    recommendations.push("Archive table to backup schema or deprecate before dropping.");
  }

  if (/\bDROP\s+COLUMN\b/i.test(upper)) {
    violations.push("Destructive 'DROP COLUMN' detected.");
    recommendations.push(
      "Follow 3-Phase Expand-Contract: Deprecate column reads, verify 0 queries in logs, then drop in separate release.",
    );
  }

  if (/\bRENAME\s+COLUMN\b/i.test(upper)) {
    violations.push("Breaking 'RENAME COLUMN' detected.");
    recommendations.push(
      "Add new column, dual-write in backend, backfill data, and switch reads rather than atomic in-place rename.",
    );
  }

  if (/\bALTER\s+COLUMN\b.*?\bTYPE\b/i.test(upper) || /\bMODIFY\s+COLUMN\b/i.test(upper)) {
    violations.push("In-place column TYPE change detected.");
    recommendations.push("Create a new typed column, dual-write, and run batched backfill off the hot path.");
  }

  if (/\bADD\s+COLUMN\b.*?\bNOT\s+NULL\b/i.test(upper) && !/\bDEFAULT\b/i.test(upper)) {
    violations.push("Adding NOT NULL column without DEFAULT value.");
    recommendations.push(
      "Add column as NULLABLE or provide DEFAULT value to prevent table lock and migration failure.",
    );
  }

  return {
    safe: violations.length === 0,
    violations,
    recommendations,
  };
}

export interface EdgeScanViolation {
  file: string;
  importName: string;
  reason: string;
  fix: string;
}

export interface EdgeScanReport {
  totalFilesScanned: number;
  edgeFilesFound: number;
  violations: EdgeScanViolation[];
}

const FORBIDDEN_EDGE_IMPORTS = [
  {
    match: /\b(?:import|require)\s*\(?['"](?:node:)?fs(?:\/promises)?['"]\)?/g,
    name: "node:fs",
    reason: "Filesystem access unsupported in V8 Edge isolates.",
    fix: "Use Cloudflare KV, R2, or remote object storage.",
  },
  {
    match: /\b(?:import|require)\s*\(?['"](?:node:)?child_process['"]\)?/g,
    name: "node:child_process",
    reason: "Process spawning unsupported in Edge isolates.",
    fix: "Offload shell/process tasks to dedicated Node workers.",
  },
  {
    match: /\b(?:import|require)\s*\(?['"](?:node:)?net['"]\)?/g,
    name: "node:net",
    reason: "Raw TCP net sockets unsupported directly in Edge isolates.",
    fix: "Use WebSocket, HTTP, or Neon/Cloudflare TCP socket bridges.",
  },
  {
    match: /\b(?:import|require)\s*\(?['"](?:node:)?tls['"]\)?/g,
    name: "node:tls",
    reason: "Native TLS module unsupported in Edge isolates.",
    fix: "Use standard fetch with HTTPS.",
  },
  {
    match: /\b(?:import|require)\s*\(?['"]bcrypt['"]\)?/g,
    name: "bcrypt",
    reason: "Native C++ bcrypt binary incompatible with Edge isolates.",
    fix: "Use 'bcryptjs' or Web Crypto API (SubtleCrypto).",
  },
  {
    match: /\b(?:import|require)\s*\(?['"]sharp['"]\)?/g,
    name: "sharp",
    reason: "Native C++ sharp binary incompatible with Edge isolates.",
    fix: "Use Cloudflare/Vercel Image Optimization or WebAssembly image encoders.",
  },
  {
    match: /\b(?:import|require)\s*\(?['"]canvas['"]\)?/g,
    name: "canvas",
    reason: "Native C++ canvas binary incompatible with Edge isolates.",
    fix: "Use Satori, SVG generation, or remote rendering service.",
  },
];

export function scanEdgeRuntimeBoundaries(targetPath = process.cwd()): EdgeScanReport {
  let totalFiles = 0;
  let edgeFiles = 0;
  const violations: EdgeScanViolation[] = [];

  function walk(currentPath: string) {
    if (!fs.existsSync(currentPath)) return;
    const stat = fs.statSync(currentPath);
    if (stat.isDirectory()) {
      if (currentPath.includes("node_modules") || currentPath.includes(".git") || currentPath.includes(".agents"))
        return;
      const files = fs.readdirSync(currentPath);
      for (const file of files) {
        walk(path.join(currentPath, file));
      }
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(currentPath)) {
      totalFiles++;
      const content = fs.readFileSync(currentPath, "utf8");
      // Check if designated as edge
      const isEdge =
        /runtime\s*=\s*['"]edge['"]/.test(content) ||
        /export\s+const\s+edge\s*=\s*true/.test(content) ||
        currentPath.includes("edge-runtime");

      if (isEdge) {
        edgeFiles++;
        for (const rule of FORBIDDEN_EDGE_IMPORTS) {
          if (rule.match.test(content)) {
            violations.push({
              file: path.relative(process.cwd(), currentPath),
              importName: rule.name,
              reason: rule.reason,
              fix: rule.fix,
            });
          }
        }
      }
    }
  }

  walk(targetPath);

  return {
    totalFilesScanned: totalFiles,
    edgeFilesFound: edgeFiles,
    violations,
  };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  if (args.includes("--brownfield-scan")) {
    const idx = args.indexOf("--brownfield-scan");
    const target = args[idx + 1] && !args[idx + 1].startsWith("-") ? args[idx + 1] : process.cwd();
    const report = scanBrownfield(target);
    console.log(`\n🛡️ Brownfield Environment Scan: ${target}`);
    console.log(`  Classification: ${report.isBrownfield ? "BROWNFIELD LEGACY" : "GREENFIELD MODERN"}`);
    console.log(`  Risk Rating: ${report.riskRating}`);
    console.log(`  Package Manager: ${report.recommendedPackageManager}`);
    console.log(`  Detected Markers: ${report.markers.length > 0 ? report.markers.join(", ") : "None (Clean Modern)"}`);
    console.log("  Locked Invariants:");
    for (const inv of report.lockedInvariants) {
      console.log(`    - 🔒 ${inv}`);
    }
  } else if (args.includes("--webhook-scaffold")) {
    const idx = args.indexOf("--webhook-scaffold");
    const provider = (args[idx + 1] || "stripe") as "stripe" | "shopify" | "generic";
    console.log(scaffoldWebhook(provider));
  } else if (args.includes("--form-shield-scaffold")) {
    const idx = args.indexOf("--form-shield-scaffold");
    const provider = args[idx + 1] && !args[idx + 1].startsWith("-") ? args[idx + 1] : "turnstile";
    console.log(scaffoldFormShield(provider));
  } else if (args.includes("--migration-check")) {
    const idx = args.indexOf("--migration-check");
    const target = args[idx + 1];
    if (!target || !fs.existsSync(target)) {
      console.error("Error: Please provide a valid SQL migration file path.");
      process.exit(1);
    }
    const sqlContent = fs.readFileSync(target, "utf8");
    const report = checkMigrationSafety(sqlContent);
    console.log(`\n🧱 Database Migration Safety Check: ${target}`);
    console.log(
      `  Status: ${report.safe ? "✅ SAFE (Expand-Contract Compliant)" : "❌ RISKY (Destructive Operations Detected)"}`,
    );
    if (!report.safe) {
      console.log("  Violations:");
      for (const v of report.violations) {
        console.log(`    - ⚠️  ${v}`);
      }
      console.log("  Recommendations:");
      for (const r of report.recommendations) {
        console.log(`    - 💡 ${r}`);
      }
      process.exit(1);
    }
  } else if (args.includes("--edge-scan")) {
    const idx = args.indexOf("--edge-scan");
    const target = args[idx + 1] && !args[idx + 1].startsWith("-") ? args[idx + 1] : process.cwd();
    const report = scanEdgeRuntimeBoundaries(target);
    console.log(`\n⚡ Edge Runtime Boundary Scan: ${target}`);
    console.log(`  Scanned Files: ${report.totalFilesScanned}`);
    console.log(`  Edge Files Identified: ${report.edgeFilesFound}`);
    console.log(`  Violations Found: ${report.violations.length}`);
    if (report.violations.length > 0) {
      for (const v of report.violations) {
        console.log(`    - ❌ [${v.file}] Forbidden import '${v.importName}': ${v.reason} (Fix: ${v.fix})`);
      }
      process.exit(1);
    } else {
      console.log("  ✅ Zero Edge runtime boundary violations detected.");
    }
  } else {
    console.log(
      "Usage: bun webdev.ts [--brownfield-scan [dir]] [--webhook-scaffold <stripe|shopify|generic>] [--form-shield-scaffold [provider]] [--migration-check <file>] [--edge-scan [dir]]",
    );
  }
}
