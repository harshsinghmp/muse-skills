import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_JSON_PATH = path.join(REPO_ROOT, "skills.json");
const PACKAGE_JSON_PATH = path.join(REPO_ROOT, "package.json");
const LLMS_TXT_PATH = path.join(REPO_ROOT, "llms.txt");
const README_PATH = path.join(REPO_ROOT, "README.md");

const REQUIRED_SECTIONS = ["## When to Use", "## Quick Reference", "## Procedure", "## Pitfalls", "## Verification"];

const REQUIRED_FRONTMATTER_KEYS = ["name", "description", "version", "author", "license", "platforms", "metadata"];

const EXPECTED_ORDERED_SKILLS = [
  "updatedocs",
  "updateagents",
  "git",
  "code-review",
  "new-project",
  "relay",
  "context-anchor",
  "gauntlet-loop",
  "refactor",
  "designscope",
  "coupling-router",
  "secretary",
  "evidence-ledger",
  "dead-letter",
  "pua",
  "coach",
  "audit",
  "periodic-retreat",
  "clean-system-cache",
  "humanize",
  "animate",
  "design",
  "paidads",
  "seo",
  "webdev",
  "mobile",
  "smm",
  "content",
  "analytics",
  "automation",
  "devops",
  "ops",
  "growth",
  "qa-launch",
  "client-comms",
  "gtm",
  "incident-response",
  "database",
  "telegram",
  "research",
  "sales-enablement",
  "retain",
  "muse-security",
  "accounts",
  "brand",
  "crm",
];

describe("Muse Skills Registry & Catalog Integrity (TDD)", () => {
  test("skills.json exists and is valid JSON", () => {
    expect(fs.existsSync(SKILLS_JSON_PATH)).toBe(true);
    const content = fs.readFileSync(SKILLS_JSON_PATH, "utf8");
    const parsed = JSON.parse(content);
    expect(parsed).toHaveProperty("skills");
    expect(Array.isArray(parsed.skills)).toBe(true);
  });

  test("package.json exists and is valid JSON", () => {
    expect(fs.existsSync(PACKAGE_JSON_PATH)).toBe(true);
    const content = fs.readFileSync(PACKAGE_JSON_PATH, "utf8");
    const parsed = JSON.parse(content);
    expect(parsed).toHaveProperty("name", "@harshsinghmp/muse-skills");
  });

  test("skills.json preserves canonical ordering (updatedocs through crm)", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
    expect(skills.length).toBe(46);
    for (let i = 0; i < EXPECTED_ORDERED_SKILLS.length; i++) {
      expect(skills[i].name).toBe(EXPECTED_ORDERED_SKILLS[i]);
    }
  });

  test("skills.json contains all 46 total skills categorized across 6 divisions", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
    expect(skills.length).toBe(46);

    const skillNames = skills.map((s: { name: string }) => s.name);
    for (const skill of EXPECTED_ORDERED_SKILLS) {
      expect(skillNames).toContain(skill);
    }

    const categories = new Set(skills.map((s: { category: string }) => s.category));
    expect(categories.has("core-engine")).toBe(true);
    expect(categories.has("quality-review")).toBe(true);
    expect(categories.has("context-orchestration")).toBe(true);
    expect(categories.has("design-interface")).toBe(true);
    expect(categories.has("reflection-maintenance")).toBe(true);
    expect(categories.has("agency-delivery")).toBe(true);
  });

  test("every skill defined in skills.json exists and conforms to Hermes, OpenClaw, and RFC agent specifications", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));

    for (const skill of skills) {
      const skillPath = path.join(REPO_ROOT, skill.path);
      expect(fs.existsSync(skillPath)).toBe(true);

      const content = fs.readFileSync(skillPath, "utf8");
      expect(content.startsWith("---")).toBe(true);

      const parts = content.split("---");
      expect(parts.length).toBeGreaterThanOrEqual(3);

      const frontmatter = parts[1];
      for (const key of REQUIRED_FRONTMATTER_KEYS) {
        expect(frontmatter).toContain(`${key}:`);
      }

      // Check Hermes & OpenClaw metadata standards
      expect(frontmatter).toContain("category:");
      expect(frontmatter).toContain("priority:");
      expect(frontmatter).toContain("suggested_skills:");
      expect(frontmatter).toContain("hermes:");
      expect(frontmatter).toContain("openclaw:");

      // Check required markdown sections
      for (const section of REQUIRED_SECTIONS) {
        expect(content).toContain(section);
      }

      // Check companion files: README.md and agents/openai.yaml
      const skillDir = path.dirname(skillPath);
      const skillReadme = path.join(skillDir, "README.md");
      const skillOpenAiYaml = path.join(skillDir, "agents", "openai.yaml");

      expect(fs.existsSync(skillReadme)).toBe(true);
      expect(fs.existsSync(skillOpenAiYaml)).toBe(true);

      const openAiYamlContent = fs.readFileSync(skillOpenAiYaml, "utf8");
      expect(openAiYamlContent).toContain(`name: ${skill.name}`);
      expect(openAiYamlContent).toContain("tools:");
      expect(openAiYamlContent).toContain("instructions:");
    }
  });

  test("llms.txt registers all skills in priority order", () => {
    expect(fs.existsSync(LLMS_TXT_PATH)).toBe(true);
    const llmsContent = fs.readFileSync(LLMS_TXT_PATH, "utf8");
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));

    for (const skill of skills) {
      expect(llmsContent).toContain(`- [${skill.name}](${skill.path})`);
    }
  });

  test("README.md registers all skills in tables and tree", () => {
    expect(fs.existsSync(README_PATH)).toBe(true);
    const readmeContent = fs.readFileSync(README_PATH, "utf8");
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));

    for (const skill of skills) {
      expect(readmeContent).toContain(skill.name);
    }
  });
});

describe("Invocation UX & conventions", () => {
  test("every skills.json skill's SKILL.md frontmatter contains argument-hint and user-invocable: true", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));

    for (const skill of skills) {
      const skillPath = path.join(REPO_ROOT, skill.path);
      const content = fs.readFileSync(skillPath, "utf8");
      const frontmatter = content.split("---")[1];
      expect(frontmatter).toContain("argument-hint:");
      expect(frontmatter).toContain("user-invocable: true");
    }
  });

  test("every agency-delivery skill body carries a Modes table", () => {
    const { skills } = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, "utf8"));
    const agencySkills = skills.filter((s: { category: string }) => s.category === "agency-delivery");
    expect(agencySkills.length).toBeGreaterThan(0);

    for (const skill of agencySkills) {
      const skillPath = path.join(REPO_ROOT, skill.path);
      const content = fs.readFileSync(skillPath, "utf8");
      const body = content.split("---").slice(2).join("---");
      expect(body).toMatch(/\| Mode \|/);
    }
  });

  test("secretary/references/dispatch.md stays in zero-drift synchronization with skills.json and reference modes", () => {
    const res = spawnSync("bun", ["scripts/sync-dispatch.ts", "--check"], { encoding: "utf8", cwd: REPO_ROOT });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("perfect sync");
  });

  test("secretary/references/orchestration.md exists and encodes delegation, fast-path, and message contracts", () => {
    const orchPath = path.join(REPO_ROOT, "skills/context-orchestration/secretary/references/orchestration.md");
    expect(fs.existsSync(orchPath)).toBe(true);
    const content = fs.readFileSync(orchPath, "utf8");
    expect(content).toContain("Sub-Token Heuristic Fast-Path");
    expect(content).toContain("Dynamic Confidence-Scored Semantic Router");
    expect(content).toContain("Typed JSON Schema Message Bus");
    expect(content).toContain("TaskContract");
    expect(content).toContain("TeachbackResponse");
    expect(content).toContain("ReviewVerdict");
    expect(content).toContain("Blast-Radius Scoring & Reversible Git Checkpoints");
    expect(content).toContain("Morning Briefing & Session Wakeup Protocol");
    expect(content).toContain("Follow-The-Sun Twilight Handover Protocol");
    expect(content).toContain("Global Timezone Overlap & Regional Holiday Invariant");
    expect(content).toContain("The 3-Tier Founder Unblocking Delegation Matrix");
  });

  test("secretary CLI supports --triage, --briefing, and --switch flags", () => {
    const scriptPath = "skills/context-orchestration/secretary/scripts/secretary.ts";
    const helpRes = spawnSync("bun", [scriptPath, "--help"], { encoding: "utf8", cwd: REPO_ROOT });
    expect(helpRes.status).toBe(0);
    expect(helpRes.stdout).toContain("--triage");
    expect(helpRes.stdout).toContain("--briefing");
    expect(helpRes.stdout).toContain("--switch");
    expect(helpRes.stdout).toContain("--checkpoint");

    // Test triage fast-path
    const triageRes = spawnSync("bun", [scriptPath, "--triage", "checkout with stripe payments"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(triageRes.status).toBe(0);
    expect(triageRes.stdout).toContain("FAST-PATH");
    expect(triageRes.stdout).toContain("webdev");
    expect(triageRes.stdout).toContain("funnel");

    // Test switch mode
    const switchRes = spawnSync("bun", [scriptPath, "--switch", "smm:carousel"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(switchRes.status).toBe(0);
    expect(switchRes.stdout).toContain("Mode Hot-Swapped Successfully");
    expect(switchRes.stdout).toContain("Jasper");

    // Test morning briefing
    const briefRes = spawnSync("bun", [scriptPath, "--briefing"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(briefRes.status).toBe(0);
    expect(briefRes.stdout).toContain("Secretary Morning Briefing");

    // Test twilight handover
    const handoverRes = spawnSync("bun", [scriptPath, "--twilight-handover", "Asia/Europe:Americas"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(handoverRes.status).toBe(0);
    expect(handoverRes.stdout).toContain("Follow-The-Sun Twilight Handover Brief");
    expect(handoverRes.stdout).toContain("Asia/Europe");
    expect(handoverRes.stdout).toContain("Americas");

    // Test timezone overlap
    const overlapRes = spawnSync("bun", [scriptPath, "--check-overlap", "EST:IST"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(overlapRes.status).toBe(0);
    expect(overlapRes.stdout).toContain("Global Timezone Overlap Analysis");
    expect(overlapRes.stdout).toContain("EST");
    expect(overlapRes.stdout).toContain("IST");
  });

  test("client-comms feedback and status modes encode translation matrix and client changelogs", () => {
    const feedbackPath = path.join(REPO_ROOT, "skills/agency-delivery/client-comms/references/feedback.md");
    const statusPath = path.join(REPO_ROOT, "skills/agency-delivery/client-comms/references/status.md");
    expect(fs.existsSync(feedbackPath)).toBe(true);
    expect(fs.existsSync(statusPath)).toBe(true);

    const feedbackContent = fs.readFileSync(feedbackPath, "utf8");
    expect(feedbackContent).toContain("The Non-Technical Feedback Translation Matrix");
    expect(feedbackContent).toContain("Make it pop");
    expect(feedbackContent).toContain("Strict Anti-Drift Boundary");
    expect(feedbackContent).toContain("The Typed Feedback Translation Contract");
    expect(feedbackContent).toContain("The Diplomatic Scope Shield & Script Matrix");
    expect(feedbackContent).toContain("Just One Quick Tweak");
    expect(feedbackContent).toContain("The Blocking Asset Ghosting Sequence");
    expect(feedbackContent).toContain("Stakeholder Contradiction Freeze Protocol");
    expect(feedbackContent).toContain("Direct-Ping Boundary Reinforcement");
    expect(feedbackContent).toContain("Post-Launch Bug Warranty vs Paid Retainer SLA");

    const statusContent = fs.readFileSync(statusPath, "utf8");
    expect(statusContent).toContain("Automated Non-Technical Client Changelog Protocol");
    expect(statusContent).toContain("Jargon Sanitizer Rules");
  });

  test("client-comms CLI supports --translate-feedback and --changelog", () => {
    const scriptPath = "skills/agency-delivery/client-comms/scripts/client-comms.ts";
    const res = spawnSync(
      "bun",
      [scriptPath, "--translate-feedback", "The mobile header feels clunky and make it pop", "--json"],
      {
        encoding: "utf8",
        cwd: REPO_ROOT,
      },
    );
    expect(res.status).toBe(0);
    const parsed = JSON.parse(res.stdout);
    expect(parsed.translation.intent).toBeDefined();
    expect(parsed.translation.antiDriftBoundary).toContain("Do NOT");
    expect(parsed.assignedLead).toBeDefined();

    const changelogRes = spawnSync("bun", [scriptPath, "--changelog"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(changelogRes.status).toBe(0);
    expect(changelogRes.stdout).toContain("Staging Deployment Update");
    expect(changelogRes.stdout).toContain("New & Visual Updates");

    // Test --draft-pushback CLI
    const tweakRes = spawnSync("bun", [scriptPath, "--draft-pushback", "quick-tweak", "--client", "Alpha Co"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(tweakRes.status).toBe(0);
    expect(tweakRes.stdout).toContain("Alpha Co");
    expect(tweakRes.stdout).toContain("Change Order");

    const contradictionRes = spawnSync(
      "bun",
      [scriptPath, "--draft-pushback", "contradiction", "--details", "Hero CTA placement"],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(contradictionRes.status).toBe(0);
    expect(contradictionRes.stdout).toContain("Hero CTA placement");
    expect(contradictionRes.stdout).toContain("frozen development");
  });

  test("webdev backend and onboard modes encode webhook guardian and brownfield shield", () => {
    const backendPath = path.join(REPO_ROOT, "skills/agency-delivery/webdev/references/backend.md");
    const onboardPath = path.join(REPO_ROOT, "skills/agency-delivery/webdev/references/onboard.md");
    expect(fs.existsSync(backendPath)).toBe(true);
    expect(fs.existsSync(onboardPath)).toBe(true);

    const backendContent = fs.readFileSync(backendPath, "utf8");
    expect(backendContent).toContain("Webhook Guardian & Idempotency Architecture");
    expect(backendContent).toContain("Raw Body Preservation");
    expect(backendContent).toContain("crypto.timingSafeEqual");
    expect(backendContent).toContain("Atomic Idempotency De-duplication");

    const onboardContent = fs.readFileSync(onboardPath, "utf8");
    expect(onboardContent).toContain("The Brownfield Shield & Zero-Modernization Boundary");
    expect(onboardContent).toContain("Never Change Package Manager");
    expect(onboardContent).toContain("Zero Collateral Refactoring");
  });

  test("webdev CLI supports --brownfield-scan, --webhook-scaffold, --form-shield-scaffold, --migration-check, and --edge-scan", () => {
    const scriptPath = "skills/agency-delivery/webdev/scripts/webdev.ts";
    const scanRes = spawnSync("bun", [scriptPath, "--brownfield-scan"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(scanRes.status).toBe(0);
    expect(scanRes.stdout).toContain("Brownfield Environment Scan");
    expect(scanRes.stdout).toContain("Classification");

    const scaffoldRes = spawnSync("bun", [scriptPath, "--webhook-scaffold", "stripe"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(scaffoldRes.status).toBe(0);
    expect(scaffoldRes.stdout).toContain("handleStripeWebhook");
    expect(scaffoldRes.stdout).toContain("stripe.webhooks.constructEvent");
    expect(scaffoldRes.stdout).toContain("Duplicate event ignored");

    // Test form shield scaffold
    const formShieldRes = spawnSync("bun", [scriptPath, "--form-shield-scaffold", "turnstile"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(formShieldRes.status).toBe(0);
    expect(formShieldRes.stdout).toContain("website_url_hp");
    expect(formShieldRes.stdout).toContain("turnstileToken");
    expect(formShieldRes.stdout).toContain("challenges.cloudflare.com/turnstile/v0/siteverify");

    // Test migration check
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "webdev-test-"));
    const safeSqlPath = path.join(tempDir, "safe_migration.sql");
    fs.writeFileSync(safeSqlPath, "ALTER TABLE users ADD COLUMN bio TEXT DEFAULT '';", "utf8");
    const safeRes = spawnSync("bun", [scriptPath, "--migration-check", safeSqlPath], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(safeRes.status).toBe(0);
    expect(safeRes.stdout).toContain("SAFE (Expand-Contract Compliant)");

    const riskySqlPath = path.join(tempDir, "risky_migration.sql");
    fs.writeFileSync(riskySqlPath, "DROP TABLE old_leads; ALTER TABLE users DROP COLUMN legacy_id;", "utf8");
    const riskyRes = spawnSync("bun", [scriptPath, "--migration-check", riskySqlPath], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(riskyRes.status).toBe(1);
    expect(riskyRes.stdout).toContain("RISKY");
    expect(riskyRes.stdout).toContain("DROP TABLE");
    expect(riskyRes.stdout).toContain("DROP COLUMN");

    // Test edge scan
    const edgeScanRes = spawnSync("bun", [scriptPath, "--edge-scan", "skills/agency-delivery/webdev"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(edgeScanRes.status).toBe(0);
    expect(edgeScanRes.stdout).toContain("Edge Runtime Boundary Scan");

    // Test check pooling
    const unpooledFile = path.join(tempDir, "api/route.ts");
    fs.mkdirSync(path.join(tempDir, "api"), { recursive: true });
    fs.writeFileSync(
      unpooledFile,
      "export async function GET() { const pool = new Pool(); return Response.json({ ok: true }); }",
      "utf8",
    );
    const poolRes = spawnSync("bun", [scriptPath, "--check-pooling", tempDir, "--json"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(poolRes.status).toBe(0);
    const poolReport = JSON.parse(poolRes.stdout);
    expect(poolReport.safe).toBe(false);
    expect(poolReport.violations.length).toBe(1);
    expect(poolReport.violations[0].message).toContain("Direct unpooled DB client");

    // Test presigned upload scaffold
    const presignedRes = spawnSync("bun", [scriptPath, "--presigned-upload-scaffold", "s3"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(presignedRes.status).toBe(0);
    expect(presignedRes.stdout).toContain("PutObjectCommand");
    expect(presignedRes.stdout).toContain("ALLOWED_MIME_TYPES");
    expect(presignedRes.stdout).toContain("MAX_FILE_SIZE_BYTES");

    // Test widget scaffold
    const widgetRes = spawnSync("bun", [scriptPath, "--widget-scaffold", "client-feedback-widget"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(widgetRes.status).toBe(0);
    expect(widgetRes.stdout).toContain('attachShadow({ mode: "open" })');
    expect(widgetRes.stdout).toContain("ClientFeedbackWidget");
    expect(widgetRes.stdout).toContain("all: initial");

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("webdev cms, backend, and migrations reference modes encode CMS cohesion, spam shield, and non-destructive migrations", () => {
    const cmsPath = path.join(REPO_ROOT, "skills/agency-delivery/webdev/references/cms.md");
    const backendPath = path.join(REPO_ROOT, "skills/agency-delivery/webdev/references/backend.md");
    const migrationsPath = path.join(REPO_ROOT, "skills/agency-delivery/webdev/references/migrations.md");
    const frontendPath = path.join(REPO_ROOT, "skills/agency-delivery/webdev/references/frontend.md");

    const cmsContent = fs.readFileSync(cmsPath, "utf8");
    expect(cmsContent).toContain("The CMS-First Cohesion Invariant");
    expect(cmsContent).toContain("Zero Hardcoding & CMS Cohesion");
    expect(cmsContent).toContain("Pre-Execution User Escalation Gate");

    const backendContent = fs.readFileSync(backendPath, "utf8");
    expect(backendContent).toContain("Form Spam Defense & Lead Flood Protection");
    expect(backendContent).toContain("Zero-Friction Client CAPTCHA (Cloudflare Turnstile)");
    expect(backendContent).toContain("Edge vs. Node Runtime Boundary Guard");
    expect(backendContent).toContain("Singleton Connection Pool & Serverless Starvation Guard");
    expect(backendContent).toContain("Atomic Multi-Table Transaction Invariant");
    expect(backendContent).toContain("Hardened Direct-to-Storage Presigned Upload Standard");
    expect(backendContent).toContain("Idempotent Webhook Processing Standard");

    const frontendContent = fs.readFileSync(frontendPath, "utf8");
    expect(frontendContent).toContain("Isolated Widget Standard (Shadow DOM & CSS Scoping for Embeddables)");

    const migrationsContent = fs.readFileSync(migrationsPath, "utf8");
    expect(migrationsContent).toContain("The Non-Destructive Database Migration Protocol");
    expect(migrationsContent).toContain("Phase 1: Expand (Additive Only)");
    expect(migrationsContent).toContain("Phase 3: Contract (Deprecate & Drop)");
  });

  test("designscope token-extraction mode and token_fence CLI enforce design token fence and bracket filter", () => {
    const tokenExtPath = path.join(REPO_ROOT, "skills/design-interface/designscope/references/token-extraction.md");
    expect(fs.existsSync(tokenExtPath)).toBe(true);
    const content = fs.readFileSync(tokenExtPath, "utf8");
    expect(content).toContain("The Design Token Fence & Strict Arbitrary Bracket Filter");
    expect(content).toContain("The 4-Tier Token Snapping Invariant");
    expect(content).toContain("The Fluid Typography & Spacing Fallback");

    const scriptPath = "skills/design-interface/designscope/scripts/token_fence.ts";
    const tempFile = path.join(REPO_ROOT, "tmp-test-bracket.html");
    try {
      fs.writeFileSync(tempFile, '<div class="w-[375px] bg-[#1e293b] p-[17px] rounded-[7px]">Test</div>', "utf8");
      const res = spawnSync("bun", [scriptPath, "--scan", tempFile, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(res.status).toBe(0);
      const report = JSON.parse(res.stdout);
      expect(report.totalViolations).toBeGreaterThanOrEqual(4);
      expect(report.violations.some((v: { category: string }) => v.category === "color")).toBe(true);
      expect(report.violations.some((v: { category: string }) => v.category === "dimension")).toBe(true);
      expect(report.violations.some((v: { category: string }) => v.category === "radius")).toBe(true);
    } finally {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }

    // Verify Asset Weight, CLS, and a11y documentation
    expect(content).toContain("Asset Weight Budget & Cumulative Layout Shift (CLS) Immunization");
    expect(content).toContain("The Zero-CLS Layout Contract");
    expect(content).toContain("Accessible Semantic Keyboard & Focus Invariants (WCAG 2.1 AA)");
    expect(content).toContain("The Zero-Clickable-`<div>` Ban");

    // Test --audit-media and --audit-a11y CLI capabilities
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "designscope-test-"));
    const badCodePath = path.join(tempDir, "bad-ui.tsx");
    fs.writeFileSync(
      badCodePath,
      `export function BadComponent() {
        return (
          <div onClick={() => console.log('click')}>
            <img src="/hero.png" />
            <button className="outline-none">Click me</button>
          </div>
        );
      }`,
      "utf8",
    );

    const mediaRes = spawnSync("bun", [scriptPath, "--audit-media", tempDir, "--json"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(mediaRes.status).toBe(0);
    const mediaReport = JSON.parse(mediaRes.stdout);
    expect(mediaReport.violations.some((v: { type: string }) => v.type === "cls-dimension")).toBe(true);

    const a11yRes = spawnSync("bun", [scriptPath, "--audit-a11y", tempDir, "--json"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(a11yRes.status).toBe(0);
    const a11yReport = JSON.parse(a11yRes.stdout);
    expect(a11yReport.violations.some((v: { type: string }) => v.type === "clickable-div")).toBe(true);
    expect(a11yReport.violations.some((v: { type: string }) => v.type === "suppressed-outline")).toBe(true);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("accounts client-pnl mode and token-ledger CLI attribute AI compute costs", () => {
    const pnlPath = path.join(REPO_ROOT, "skills/agency-delivery/accounts/references/client-pnl.md");
    expect(fs.existsSync(pnlPath)).toBe(true);
    const content = fs.readFileSync(pnlPath, "utf8");
    expect(content).toContain("The Client AI Compute & Token Ledger Protocol");
    expect(content).toContain("Per-Client Token Attribution Rule");
    expect(content).toContain("Compute Budget Guardrails");
    expect(content).toContain("Sliding Window Token Budget & Context Window Governor Standard");
    expect(content).toContain("Sliding Time-Window Budget & Circuit-Breaker");
    expect(content).toContain("Context Window Pruning & Compaction Invariant");

    const scriptPath = "skills/agency-delivery/accounts/scripts/token-ledger.ts";
    const tempContextFile = path.join(REPO_ROOT, "tmp-test-context.json");
    try {
      const recordRes = spawnSync(
        "bun",
        [scriptPath, "--record", "client-acme", "claude-3-7-sonnet", "100000", "20000", "Build Checkout API"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(recordRes.status).toBe(0);
      expect(recordRes.stdout).toContain("Recorded AI Compute for Client: client-acme");
      expect(recordRes.stdout).toContain("Billable to Client");

      // Test --check-budget CLI
      const budgetOkRes = spawnSync("bun", [scriptPath, "--check-budget", "client-acme", "10.00", "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(budgetOkRes.status).toBe(0);
      const budgetOk = JSON.parse(budgetOkRes.stdout);
      expect(budgetOk.status).toBe("OK");
      expect(budgetOk.circuitBreakerTripped).toBe(false);

      const budgetExceededRes = spawnSync("bun", [scriptPath, "--check-budget", "client-acme", "0.20", "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(budgetExceededRes.status).toBe(0);
      const budgetExceeded = JSON.parse(budgetExceededRes.stdout);
      expect(budgetExceeded.status).toBe("EXCEEDED");
      expect(budgetExceeded.circuitBreakerTripped).toBe(true);

      // Test --prune-context CLI
      const sampleMessages = [
        { role: "system", content: "You are an autonomous agency assistant." },
        { role: "user", content: `Turn 1: ${"a".repeat(400)}` },
        { role: "assistant", content: `Turn 1 reply: ${"b".repeat(800)}` },
        { role: "user", content: `Turn 2: ${"c".repeat(400)}` },
        { role: "assistant", content: `Turn 2 reply: ${"d".repeat(800)}` },
        { role: "user", content: "Turn 3 latest prompt: please summarize." },
      ];
      fs.writeFileSync(tempContextFile, JSON.stringify(sampleMessages), "utf8");

      const pruneRes = spawnSync(
        "bun",
        [scriptPath, "--prune-context", tempContextFile, "--max-tokens", "300", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(pruneRes.status).toBe(0);
      const pruneData = JSON.parse(pruneRes.stdout);
      expect(pruneData.prunedCount).toBeGreaterThan(0);
      expect(pruneData.prunedMessages[0].role).toBe("system");
      expect(pruneData.prunedMessages.some((m: { content: string }) => m.content.includes("[Context Pruned:"))).toBe(
        true,
      );

      // Verify invoicing reference standards
      const invoicePath = path.join(REPO_ROOT, "skills/agency-delivery/accounts/references/invoicing.md");
      expect(fs.existsSync(invoicePath)).toBe(true);
      const invoiceContent = fs.readFileSync(invoicePath, "utf8");
      expect(invoiceContent).toContain("The Deposit-Before-Code Invariant");
      expect(invoiceContent).toContain("7-Day Deemed Acceptance Clause");
      expect(invoiceContent).toContain("Automated Retainer Overage Meter");
      expect(invoiceContent).toContain("Cross-Border Tax Zero-Rating & Withholding Shield");

      // Test --retainer-status CLI
      const retainerRes = spawnSync("bun", [scriptPath, "--retainer-status", "client-acme", "100.00", "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(retainerRes.status).toBe(0);
      const retainerData = JSON.parse(retainerRes.stdout);
      expect(retainerData.status).toBeDefined();
      expect(retainerData.percentUsed).toBeDefined();
      expect(retainerData.monthlyAllowanceUsd).toBe(100);
    } finally {
      if (fs.existsSync(path.join(REPO_ROOT, ".agents/context/token-ledger.json"))) {
        fs.unlinkSync(path.join(REPO_ROOT, ".agents/context/token-ledger.json"));
      }
      if (fs.existsSync(tempContextFile)) {
        fs.unlinkSync(tempContextFile);
      }
    }
  });

  test("ops multi-client mode and multi-client CLI verify boundaries and context switches", () => {
    const multiClientPath = path.join(REPO_ROOT, "skills/agency-delivery/ops/references/multi-client.md");
    expect(fs.existsSync(multiClientPath)).toBe(true);
    const content = fs.readFileSync(multiClientPath, "utf8");
    expect(content).toContain("Two-Tier Memory Isolation Standard");
    expect(content).toContain("The 5-Checkpoint Cross-Client Context Firewall");
    expect(content).toContain("The 5-Line Context Switch Audit Log");

    const scriptPath = "skills/agency-delivery/ops/scripts/multi-client.ts";
    const boundaryRes = spawnSync("bun", [scriptPath, "--verify-boundary", REPO_ROOT, "--json"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(boundaryRes.status).toBe(0);
    const report = JSON.parse(boundaryRes.stdout);
    expect(report.scannedFilesCount).toBeGreaterThan(0);

    const switchRes = spawnSync("bun", [scriptPath, "--switch-context", "client-alpha", "client-beta"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(switchRes.status).toBe(0);
    expect(switchRes.stdout).toContain("5-Line Cross-Client Context Switch Handover");
    expect(switchRes.stdout).toContain("client-alpha");
    expect(switchRes.stdout).toContain("client-beta");

    // Verify Staging vs Production URL Contamination Firewall
    expect(content).toContain("Staging vs. Production URL Contamination Firewall");
    expect(content).toContain("The Dual-Environment URL Invariant");

    // Test --check-urls CLI
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ops-url-test-"));
    try {
      const contaminatedPath = path.join(tempDir, "config.ts");
      fs.writeFileSync(
        contaminatedPath,
        `export const API = "http://localhost:3000/api";
         export const STAGING_URL = "https://app.staging.client.com";
         export const TUNNEL = "https://abc.ngrok-free.app";
         export const STRIPE_KEY = "pk_test_51Mz000000000000000000000";`,
        "utf8",
      );

      const urlRes = spawnSync("bun", [scriptPath, "--check-urls", tempDir, "--env", "prod", "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(urlRes.status).toBe(0);
      const urlReport = JSON.parse(urlRes.stdout);
      expect(urlReport.isClean).toBe(false);
      expect(urlReport.violations.length).toBeGreaterThanOrEqual(4);

      // Verify Graceful Shutdown & Liveness Probe Standard
      expect(content).toContain("Graceful Shutdown & Liveness Probe Standard");
      expect(content).toContain("Dual Liveness & Readiness Probes");

      const nextRes = spawnSync("bun", [scriptPath, "--scaffold-health", "nextjs"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(nextRes.status).toBe(0);
      expect(nextRes.stdout).toContain("Next.js App Router Health Check Endpoint");
      expect(nextRes.stdout).toContain("/api/health/route.ts");

      const expressRes = spawnSync("bun", [scriptPath, "--scaffold-health", "express"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(expressRes.status).toBe(0);
      expect(expressRes.stdout).toContain("Express.js Health Check & Graceful Termination Handler");
      expect(expressRes.stdout).toContain("SIGTERM");

      // Verify Credential Vaulting, Asset Versioning, and Handover standards
      expect(content).toContain("Shared Credential & MFA Vaulting Standard");
      expect(content).toContain("Canonical Asset Versioning & Remote WIP Push Invariant");
      expect(content).toContain("Post-Launch Handover Package Protocol");

      const handoverRes = spawnSync(
        "bun",
        [scriptPath, "--scaffold-handover", "Beta Client", "--domain", "https://beta.com"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(handoverRes.status).toBe(0);
      expect(handoverRes.stdout).toContain("Client Project Handover Package — Beta Client");
      expect(handoverRes.stdout).toContain("Recorded Loom Walkthrough Video");
      expect(handoverRes.stdout).toContain("https://beta.com");

      // Test --audit-assets CLI
      const assetAuditRes = spawnSync("bun", [scriptPath, "--audit-assets", tempDir, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(assetAuditRes.status).toBe(0);
      const assetAudit = JSON.parse(assetAuditRes.stdout);
      expect(assetAudit.totalScanned).toBeGreaterThan(0);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("qa-launch regression mode and visual-audit CLI verify multi-viewport safety", () => {
    const regrPath = path.join(REPO_ROOT, "skills/agency-delivery/qa-launch/references/regression.md");
    expect(fs.existsSync(regrPath)).toBe(true);
    const content = fs.readFileSync(regrPath, "utf8");
    expect(content).toContain("Multi-Viewport Visual Regression & Layout Overflow Protocol");
    expect(content).toContain("The 3-Tier Viewport Verification Standard");
    expect(content).toContain("Zero Horizontal Layout Shift (X-Overflow)");

    const scriptPath = "skills/agency-delivery/qa-launch/scripts/visual-audit.ts";
    const tempHtml = path.join(REPO_ROOT, "tmp-test-overflow.html");
    try {
      fs.writeFileSync(tempHtml, '<div class="w-[600px] z-[99999]"><button class="h-4">Click</button></div>', "utf8");
      const res = spawnSync("bun", [scriptPath, "--check-markup", tempHtml, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(res.status).toBe(0);
      const report = JSON.parse(res.stdout);
      expect(report.isPassing).toBe(false);
      expect(report.totalDefects).toBeGreaterThanOrEqual(2);
      expect(report.defects.some((d: { severity: string }) => d.severity === "BLOCKING")).toBe(true);
    } finally {
      if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
    }
  });

  test("content studio aeo-schema CLI generates JSON-LD and audits AEO quotability", () => {
    const scriptPath = "skills/agency-delivery/content/scripts/aeo-schema.ts";

    // Test --generate-schema faq
    const faqRes = spawnSync(
      "bun",
      [scriptPath, "--generate-schema", "faq", "--title", "What is Muse?", "--desc", "Autonomous agency orchestrator."],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(faqRes.status).toBe(0);
    expect(faqRes.stdout).toContain('"@type": "FAQPage"');
    expect(faqRes.stdout).toContain("What is Muse?");
    expect(faqRes.stdout).toContain("Autonomous agency orchestrator.");

    // Test --audit-quotability
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "content-aeo-"));
    try {
      const goodFile = path.join(tempDir, "good.md");
      fs.writeFileSync(
        goodFile,
        '# Muse Overview\n\n<script type="application/ld+json">{"@context": "https://schema.org", "@type": "Article"}</script>\n\n## Architecture\nMuse coordinates autonomous agency agents across specialized divisions with strict verification.\n',
        "utf8",
      );
      const goodRes = spawnSync("bun", [scriptPath, "--audit-quotability", goodFile, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(goodRes.status).toBe(0);
      const goodReport = JSON.parse(goodRes.stdout);
      expect(goodReport.hasSchema).toBe(true);
      expect(goodReport.score).toBe(100);
      expect(goodReport.violations.length).toBe(0);

      const badFile = path.join(tempDir, "bad.md");
      fs.writeFileSync(
        badFile,
        "# Unoptimized Blog\n\n## Section One\nThis is a dangling pronoun sentence that fails standalone quotability.\n",
        "utf8",
      );
      const badRes = spawnSync("bun", [scriptPath, "--audit-quotability", badFile, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(badRes.status).toBe(0);
      const badReport = JSON.parse(badRes.stdout);
      expect(badReport.hasSchema).toBe(false);
      expect(badReport.violations.some((v: { type: string }) => v.type === "dangling-pronoun")).toBe(true);
      expect(badReport.violations.some((v: { type: string }) => v.type === "missing-schema")).toBe(true);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("content studio frontmatter-guard CLI detects YAML mapping separator collisions and auto-fixes them", () => {
    const scriptPath = "skills/agency-delivery/content/scripts/frontmatter-guard.ts";
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "content-fm-"));

    try {
      const badFile = path.join(tempDir, "post-bad.md");
      const badContent = `---
title: System Architecture: Deep Dive into Micro-frontends
description: The 80: 20 rule in modern software
author: Jane Doe
tags: [ai, dev]
---
# Content here
`;
      fs.writeFileSync(badFile, badContent, "utf8");

      // Test --lint with --json
      const lintRes = spawnSync("bun", [scriptPath, "--lint", badFile, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(lintRes.status).toBe(1);
      const lintReport = JSON.parse(lintRes.stdout);
      expect(lintReport.filesScanned).toBe(1);
      expect(lintReport.totalIssues).toBeGreaterThan(0);
      expect(lintReport.results[0].issues.some((i: { field: string }) => i.field === "title")).toBe(true);

      // Test --fix
      const fixRes = spawnSync("bun", [scriptPath, "--fix", badFile], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(fixRes.status).toBe(0);
      expect(fixRes.stdout).toContain("Fixed");

      // Verify file content was fixed
      const fixedContent = fs.readFileSync(badFile, "utf8");
      expect(fixedContent).toContain('title: "System Architecture: Deep Dive into Micro-frontends"');
      expect(fixedContent).toContain('description: "The 80: 20 rule in modern software"');

      // Now --lint should pass
      const reLintRes = spawnSync("bun", [scriptPath, "--lint", badFile], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(reLintRes.status).toBe(0);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("seo onpage mode and og-audit CLI enforce OpenGraph metadata and detect placeholder cards", () => {
    const onpagePath = path.join(REPO_ROOT, "skills/agency-delivery/seo/references/onpage.md");
    expect(fs.existsSync(onpagePath)).toBe(true);
    const content = fs.readFileSync(onpagePath, "utf8");
    expect(content).toContain("OpenGraph & Social Share Preview Invariant");
    expect(content).toContain("Strictly ban any `og:image` pointing to unverified placeholder URLs");

    const scriptPath = "skills/agency-delivery/seo/scripts/og-audit.ts";

    // Test --generate-meta
    const metaRes = spawnSync(
      "bun",
      [
        scriptPath,
        "--generate-meta",
        "--title",
        "Test Product",
        "--desc",
        "High quality agency platform",
        "--url",
        "https://example.com/product",
        "--image",
        "https://example.com/product/og.png",
      ],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(metaRes.status).toBe(0);
    expect(metaRes.stdout).toContain('property="og:title" content="Test Product"');
    expect(metaRes.stdout).toContain('name="twitter:card" content="summary_large_image"');

    // Test --audit
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "seo-og-test-"));
    try {
      const goodHtml = path.join(tempDir, "index.html");
      fs.writeFileSync(
        goodHtml,
        '<html><head><meta property="og:title" content="Clean" /><meta property="og:image" content="https://cdn.agency.com/og.webp" /><meta name="twitter:card" content="summary_large_image" /></head><body></body></html>',
        "utf8",
      );
      const goodRes = spawnSync("bun", [scriptPath, "--audit", goodHtml, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(goodRes.status).toBe(0);
      const goodReport = JSON.parse(goodRes.stdout);
      expect(goodReport.safe).toBe(true);
      expect(goodReport.violations.length).toBe(0);

      const placeholderHtml = path.join(tempDir, "bad.html");
      fs.writeFileSync(
        placeholderHtml,
        '<html><head><meta property="og:title" content="Bad" /><meta property="og:image" content="https://example.com/placeholder.png" /><meta name="twitter:card" content="summary_large_image" /></head><body></body></html>',
        "utf8",
      );
      const badRes = spawnSync("bun", [scriptPath, "--audit", placeholderHtml, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(badRes.status).toBe(0);
      const badReport = JSON.parse(badRes.stdout);
      expect(badReport.safe).toBe(false);
      expect(badReport.violations.some((v: { type: string }) => v.type === "placeholder-image")).toBe(true);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("seo technical mode and breadcrumb-schema CLI generate BreadcrumbList JSON-LD and normalize trailing slashes", () => {
    const techPath = path.join(REPO_ROOT, "skills/agency-delivery/seo/references/technical.md");
    expect(fs.existsSync(techPath)).toBe(true);
    const content = fs.readFileSync(techPath, "utf8");
    expect(content).toContain("Trailing-Slash Normalization & BreadcrumbList Schema");
    expect(content).toContain("breadcrumb-schema.ts");

    const scriptPath = "skills/agency-delivery/seo/scripts/breadcrumb-schema.ts";
    const helpRes = spawnSync("bun", [scriptPath, "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(helpRes.status).toBe(0);
    expect(helpRes.stdout).toContain("Breadcrumb JSON-LD & Trailing-Slash Normalizer");

    // 1. Breadcrumb JSON-LD Generation
    const bcRes = spawnSync(
      "bun",
      [scriptPath, "--breadcrumb", "https://agency.com/services/web-dev/ecommerce/", "--json"],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(bcRes.status).toBe(0);
    const bcData = JSON.parse(bcRes.stdout);
    expect(bcData["@type"]).toBe("BreadcrumbList");
    expect(bcData.itemListElement.length).toBe(4);
    expect(bcData.itemListElement[0].name).toBe("Home");
    expect(bcData.itemListElement[1].name).toBe("Services");
    expect(bcData.itemListElement[2].name).toBe("Web Dev");
    expect(bcData.itemListElement[3].name).toBe("Ecommerce");
    expect(bcData.itemListElement[3].item).toBe("https://agency.com/services/web-dev/ecommerce/");

    // 2. Trailing Slash Normalization
    const normRes = spawnSync(
      "bun",
      [scriptPath, "--normalize", "http://AGENCY.com/services//web-dev", "--trailing-slash", "--json"],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(normRes.status).toBe(0);
    const normData = JSON.parse(normRes.stdout);
    expect(normData.normalized).toBe("https://agency.com/services/web-dev/");

    // 3. Trailing Slash Policy Audit
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "seo-bc-test-"));
    try {
      const urlFile = path.join(tempDir, "urls.txt");
      fs.writeFileSync(
        urlFile,
        "https://agency.com/services/\nhttps://agency.com/about\nhttps://agency.com/contact/\n",
        "utf8",
      );
      const auditRes = spawnSync("bun", [scriptPath, "--audit", urlFile, "--trailing-slash", "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      const auditData = JSON.parse(auditRes.stdout);
      expect(auditData.consistent).toBe(false);
      expect(auditData.violations.length).toBe(1);
      expect(auditData.violations[0].url).toBe("https://agency.com/about");
      expect(auditData.violations[0].expected).toBe("https://agency.com/about/");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("smm carousel mode and aspect-ratio-guard CLI enforce 9:16 vs 1:1 and mobile UI safe zones", () => {
    const carouselPath = path.join(REPO_ROOT, "skills/agency-delivery/smm/references/carousel.md");
    expect(fs.existsSync(carouselPath)).toBe(true);
    const content = fs.readFileSync(carouselPath, "utf8");
    expect(content).toContain("Aspect Ratio Enforcement & Mobile UI Safe Zone Guard");
    expect(content).toContain("aspect-ratio-guard.ts");

    const scriptPath = "skills/agency-delivery/smm/scripts/aspect-ratio-guard.ts";
    const helpRes = spawnSync("bun", [scriptPath, "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(helpRes.status).toBe(0);
    expect(helpRes.stdout).toContain("SMM Aspect Ratio & Safe Zone Validator");

    // 1. Valid 9:16 for TikTok
    const validTiktokRes = spawnSync(
      "bun",
      [scriptPath, "--width", "1080", "--height", "1920", "--platform", "tiktok", "--json"],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(validTiktokRes.status).toBe(0);
    const validTiktokData = JSON.parse(validTiktokRes.stdout);
    expect(validTiktokData.valid).toBe(true);
    expect(validTiktokData.ratioType).toBe("9:16");

    // 2. Invalid 1:1 for TikTok (must fail)
    const invalidTiktokRes = spawnSync(
      "bun",
      [scriptPath, "--width", "1080", "--height", "1080", "--platform", "tiktok", "--json"],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(invalidTiktokRes.status).toBe(1);
    const invalidTiktokData = JSON.parse(invalidTiktokRes.stdout);
    expect(invalidTiktokData.valid).toBe(false);
    expect(invalidTiktokData.ratioType).toBe("1:1");

    // 3. Valid 1:1 for Instagram Feed
    const validFeedRes = spawnSync(
      "bun",
      [scriptPath, "--width", "1080", "--height", "1080", "--platform", "instagram-feed", "--json"],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(validFeedRes.status).toBe(0);
    const validFeedData = JSON.parse(validFeedRes.stdout);
    expect(validFeedData.valid).toBe(true);
    expect(validFeedData.ratioType).toBe("1:1");

    // 4. Safe zone calculator
    const szRes = spawnSync(
      "bun",
      [scriptPath, "--safe-zone", "--height", "1920", "--platform", "tiktok", "--json"],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(szRes.status).toBe(0);
    const szData = JSON.parse(szRes.stdout);
    expect(szData.platform).toBe("tiktok");
    expect(szData.topForbiddenZone).toContain("15%");
    expect(szData.bottomForbiddenZone).toContain("20%");
  });

  test("analytics tracking mode and utm-sanitizer CLI build canonical URLs and scrub PII", () => {
    const trackingPath = path.join(REPO_ROOT, "skills/agency-delivery/analytics/references/tracking.md");
    expect(fs.existsSync(trackingPath)).toBe(true);
    const content = fs.readFileSync(trackingPath, "utf8");
    expect(content).toContain("UTM Parameter Hygiene & Anti-Fragmentation Standards");
    expect(content).toContain("utm-sanitizer.ts");

    const scriptPath = "skills/agency-delivery/analytics/scripts/utm-sanitizer.ts";
    const helpRes = spawnSync("bun", [scriptPath, "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(helpRes.status).toBe(0);
    expect(helpRes.stdout).toContain("UTM Tag Sanitizer & Campaign Link Builder");

    // 1. Build canonical campaign URL
    const buildRes = spawnSync(
      "bun",
      [
        scriptPath,
        "--build",
        "--url",
        "https://agency.com/services",
        "--source",
        "LinkedIn",
        "--medium",
        "Organic-Social",
        "--campaign",
        "Q4 Growth",
        "--json",
      ],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(buildRes.status).toBe(0);
    const buildData = JSON.parse(buildRes.stdout);
    expect(buildData.url).toBe(
      "https://agency.com/services?utm_source=linkedin&utm_medium=organic-social&utm_campaign=q4-growth",
    );

    // 2. Sanitize raw URL with casing issues and PII leak
    const sanitizeRes = spawnSync(
      "bun",
      [
        scriptPath,
        "--sanitize",
        "https://agency.com/page?utm_source=Twitter &utm_medium=Social_Post&email=ceo@client.com",
        "--json",
      ],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(sanitizeRes.status).toBe(0);
    const sanitizeData = JSON.parse(sanitizeRes.stdout);
    expect(sanitizeData.strippedPii).toContain("email=ceo@client.com");
    expect(sanitizeData.sanitizedUrl).not.toContain("ceo@client.com");
    expect(sanitizeData.cleanUtms.utm_source).toBe("twitter");
    expect(sanitizeData.cleanUtms.utm_medium).toBe("social-post");

    // 3. Audit file with internal UTM link trap
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "analytics-utm-test-"));
    try {
      const urlFile = path.join(tempDir, "links.txt");
      fs.writeFileSync(
        urlFile,
        "https://agency.com/pricing?utm_source=nav\nhttps://google.com?utm_source=newsletter&utm_medium=email&utm_campaign=launch\n",
        "utf8",
      );
      const auditRes = spawnSync(
        "bun",
        [scriptPath, "--audit", urlFile, "--site-host", "agency.com", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      const auditData = JSON.parse(auditRes.stdout);
      expect(auditData.internalUtmTraps).toBe(1);
      expect(auditData.invalid).toBeGreaterThanOrEqual(1);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("devops hosting mode and docker-audit CLI enforce multi-stage builds and layer cache order", () => {
    const hostingPath = path.join(REPO_ROOT, "skills/agency-delivery/devops/references/hosting.md");
    expect(fs.existsSync(hostingPath)).toBe(true);
    const content = fs.readFileSync(hostingPath, "utf8");
    expect(content).toContain("Multi-Stage Zero-DevDep Docker Pattern & Layer Cache Invariant");
    expect(content).toContain("Deterministic Layer Cache Ordering");
    expect(content).toContain("Mandatory `.dockerignore`");

    const scriptPath = "skills/agency-delivery/devops/scripts/docker-audit.ts";

    // Test --scaffold
    const scaffoldRes = spawnSync("bun", [scriptPath, "--scaffold", "bun"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(scaffoldRes.status).toBe(0);
    expect(scaffoldRes.stdout).toContain("FROM oven/bun:1 AS base");
    expect(scaffoldRes.stdout).toContain("FROM base AS deps");
    expect(scaffoldRes.stdout).toContain("FROM oven/bun:1-slim AS runner");
    expect(scaffoldRes.stdout).toContain("USER bun");

    // Test --audit on bad Dockerfile (cache invalidation order: COPY . . before install)
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "devops-docker-test-"));
    try {
      const dockerfile = path.join(tempDir, "Dockerfile");
      fs.writeFileSync(
        dockerfile,
        'FROM node:20\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]\n',
        "utf8",
      );
      const auditRes = spawnSync("bun", [scriptPath, "--audit", dockerfile, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(auditRes.status).toBe(0);
      const report = JSON.parse(auditRes.stdout);
      expect(report.safe).toBe(false);
      expect(report.violations.some((v: { type: string }) => v.type === "cache-invalidation")).toBe(true);
      expect(report.violations.some((v: { type: string }) => v.type === "missing-dockerignore")).toBe(true);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("devops cloudflare mode and living-deliverable CLI scaffold workerd preview containers and client review links", () => {
    const cfRefPath = path.join(REPO_ROOT, "skills/agency-delivery/devops/references/cloudflare.md");
    expect(fs.existsSync(cfRefPath)).toBe(true);
    const content = fs.readFileSync(cfRefPath, "utf8");
    expect(content).toContain("Cloudflare OS Living Deliverables & Ephemeral Client Review Tunnels");
    expect(content).toContain("`workerd` Runtime");
    expect(content).toContain("Ephemeral Quick Tunnels with Token Gating");

    const scriptPath = "skills/agency-delivery/devops/scripts/living-deliverable.ts";
    const helpRes = spawnSync("bun", [scriptPath, "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(helpRes.status).toBe(0);
    expect(helpRes.stdout).toContain("Cloudflare OS Living Deliverables Engine");

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "muse-deliverable-test-"));
    try {
      const scaffoldRes = spawnSync(
        "bun",
        [
          scriptPath,
          tempDir,
          "--scaffold",
          "client-preview-flow",
          "--client",
          "ACME-Corp",
          "--target-port",
          "3000",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(scaffoldRes.status).toBe(0);
      const data = JSON.parse(scaffoldRes.stdout);
      expect(data.success).toBe(true);
      expect(data.metadata.client).toBe("ACME-Corp");
      expect(data.metadata.token).toBeDefined();
      expect(data.metadata.token.length).toBe(32);
      expect(data.metadata.expired).toBe(false);

      const deliverableDir = path.join(tempDir, ".agents/deliverables/client-preview-flow");
      expect(fs.existsSync(path.join(deliverableDir, "metadata.json"))).toBe(true);
      expect(fs.existsSync(path.join(deliverableDir, "wrangler.jsonc"))).toBe(true);
      expect(fs.existsSync(path.join(deliverableDir, "worker.ts"))).toBe(true);

      const workerCode = fs.readFileSync(path.join(deliverableDir, "worker.ts"), "utf8");
      expect(workerCode).toContain("REVIEW_TOKEN");
      expect(workerCode).toContain("Mobile (390px)");
      expect(workerCode).toContain("/__deliverable/feedback");

      const expiryRes = spawnSync(
        "bun",
        [scriptPath, tempDir, "--check-expiry", "client-preview-flow", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(expiryRes.status).toBe(0);
      const expiryData = JSON.parse(expiryRes.stdout);
      expect(expiryData.expired).toBe(false);
      expect(expiryData.hoursRemaining).toBeGreaterThanOrEqual(47);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("gauntlet-loop protocol and anti-drift CLI detect duplicate utilities and scope expansion", () => {
    const protoPath = path.join(REPO_ROOT, "skills/quality-review/gauntlet-loop/references/gauntlet-protocol.md");
    expect(fs.existsSync(protoPath)).toBe(true);
    const content = fs.readFileSync(protoPath, "utf8");
    expect(content).toContain("Anti-Drift Architecture & Duplicate Utility Guard");
    expect(content).toContain("Zero Duplicate Helpers");
    expect(content).toContain("Refactor Scope Boundary (The Rule of 3 Files)");

    const scriptPath = "skills/quality-review/gauntlet-loop/scripts/anti-drift.ts";
    const tempDir = fs.mkdtempSync(path.join(REPO_ROOT, "tmp-test-drift-"));
    try {
      fs.writeFileSync(path.join(tempDir, "a.ts"), "export function cn(...args: any[]) { return ''; }\n", "utf8");
      fs.writeFileSync(path.join(tempDir, "b.ts"), "export function cn(...inputs: any[]) { return ''; }\n", "utf8");

      const dupRes = spawnSync("bun", [scriptPath, "--scan-duplicates", tempDir, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(dupRes.status).toBe(0);
      const report = JSON.parse(dupRes.stdout);
      expect(report.isPassing).toBe(false);
      expect(report.duplicateCount).toBe(1);
      expect(report.duplicates[0].functionName).toBe("cn");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    // Verify 6 Resilience & Hygiene Gates in protocol
    expect(content).toContain("The 6 Resilience & Hygiene Quality Gates");
    expect(content).toContain("The Loud Failure Invariant (Zero Swallowed Errors)");
    expect(content).toContain("The Deterministic Testing Standard (Zero Flaky Sleeps)");
    expect(content).toContain("The Zero-Redundancy Dependency Diet");
    expect(content).toContain("The Client-Side Hydration & Timezone Desync Shield");
    expect(content).toContain("The CMS-Cohesion & Hardcoded Copy Linter");
    expect(content).toContain("The Verified Deploy Gate (Zero Unverified Preview Claims)");

    // Test --scan-silent-catches, --scan-flaky-tests, --audit-deps, --scan-hydration-risks, --scan-cms-cohesion, and --verify-deploy
    const tempDir2 = fs.mkdtempSync(path.join(os.tmpdir(), "gauntlet-resilience-"));
    try {
      // 1. Silent catch test
      fs.writeFileSync(
        path.join(tempDir2, "silent.ts"),
        "export function fetchData() { try { return fetch('/api'); } catch (e) {} }\n",
        "utf8",
      );
      const catchRes = spawnSync("bun", [scriptPath, "--scan-silent-catches", tempDir2, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(catchRes.status).toBe(0);
      const catchReport = JSON.parse(catchRes.stdout);
      expect(catchReport.violations.length).toBeGreaterThanOrEqual(1);

      // 2. Flaky test sleep test
      fs.writeFileSync(
        path.join(tempDir2, "flaky.test.ts"),
        "test('flaky', async () => { await sleep(2000); page.waitForTimeout(1000); });\n",
        "utf8",
      );
      const flakyRes = spawnSync("bun", [scriptPath, "--scan-flaky-tests", tempDir2, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(flakyRes.status).toBe(0);
      const flakyReport = JSON.parse(flakyRes.stdout);
      expect(flakyReport.violations.length).toBe(2);

      // 3. Dependency diet test
      const badPkgPath = path.join(tempDir2, "package.json");
      fs.writeFileSync(
        badPkgPath,
        JSON.stringify({ dependencies: { "is-odd": "^3.0.1", axios: "^1.6.0", moment: "^2.30.1" } }, null, 2),
        "utf8",
      );
      const depRes = spawnSync("bun", [scriptPath, "--audit-deps", badPkgPath, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(depRes.status).toBe(0);
      const depReport = JSON.parse(depRes.stdout);
      expect(depReport.violations.length).toBe(3);
      expect(depReport.violations.some((v: { package: string }) => v.package === "axios")).toBe(true);

      // 4. Hydration risk test
      fs.writeFileSync(
        path.join(tempDir2, "component.tsx"),
        "export function Header() { return <div>{new Date().toLocaleDateString()}</div>; }\n",
        "utf8",
      );
      const hydRes = spawnSync("bun", [scriptPath, "--scan-hydration-risks", tempDir2, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(hydRes.status).toBe(0);
      const hydReport = JSON.parse(hydRes.stdout);
      expect(hydReport.violations.length).toBe(1);
      expect(hydReport.violations[0].pattern).toContain("new Date().toLocaleDateString()");

      // 5. CMS-Cohesion test
      fs.writeFileSync(path.join(tempDir2, "payload.config.ts"), "export default { collections: [] };\n", "utf8");
      fs.writeFileSync(
        path.join(tempDir2, "Landing.tsx"),
        "export function Hero() { return <div style={{ color: '#ff0000', fontSize: '16px' }}><p>Welcome to our world-class digital agency where we build custom software that scales across continents effortlessly.</p></div>; }\n",
        "utf8",
      );
      const cmsRes = spawnSync("bun", [scriptPath, "--scan-cms-cohesion", tempDir2, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(cmsRes.status).toBe(0);
      const cmsReport = JSON.parse(cmsRes.stdout);
      expect(cmsReport.cmsDetected).toBe(true);
      expect(cmsReport.violations.length).toBeGreaterThanOrEqual(1);

      // 6. Deploy verification test
      const deployRes = spawnSync("bun", [scriptPath, "--verify-deploy", "https://example.com", "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(deployRes.status).toBe(0);
      const deployReport = JSON.parse(deployRes.stdout);
      expect(deployReport.ok).toBe(true);
      expect(deployReport.status).toBe(200);
    } finally {
      fs.rmSync(tempDir2, { recursive: true, force: true });
    }
  });
});

describe("Two-Tier Identity Onboarding, Strategic Vision (vision.md) Convention & CREDITS.md Integrity (TDD)", () => {
  test("root CREDITS.md exists and contains open-source attributions", () => {
    const creditsPath = path.join(REPO_ROOT, "CREDITS.md");
    expect(fs.existsSync(creditsPath)).toBe(true);
    const content = fs.readFileSync(creditsPath, "utf8");
    expect(content).toContain("Daniel Miessler");
    expect(content).toContain("Refactoring UI");
    expect(content).toContain("Linus Torvalds");
    expect(content).toContain("Astro");
    expect(content).toContain("UnoCSS");
    expect(content).toContain("Bun");
    expect(content).toContain("Biome");
  });

  test("updateagents AGENTS.md template encodes Two-Tier Identity Cascade and vision.md", () => {
    const templatePath = path.join(REPO_ROOT, "skills/core-engine/updateagents/templates/AGENTS.md");
    const content = fs.readFileSync(templatePath, "utf8");
    expect(content).toContain("Two-Tier Identity & Context Resolution Cascade");
    expect(content).toContain("~/.agents/identity/");
    expect(content).toContain("vision.md");
  });

  test("updateagents and secretary onboard references exist", () => {
    const updateagentsOnboard = path.join(REPO_ROOT, "skills/core-engine/updateagents/references/onboard.md");
    const secretaryOnboard = path.join(REPO_ROOT, "skills/context-orchestration/secretary/references/onboard.md");
    expect(fs.existsSync(updateagentsOnboard)).toBe(true);
    expect(fs.existsSync(secretaryOnboard)).toBe(true);
  });

  test("updateagents CLI supports --onboard and --global flags", () => {
    const res = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("--onboard");
    expect(res.stdout).toContain("--global");
  });

  test("stack.md Golden Stack Fence template exists with allowlist, blacklist, and Council Lead", () => {
    const stackTemplatePath = path.join(
      REPO_ROOT,
      "skills/core-engine/updateagents/templates/.agents/context/stack.md",
    );
    expect(fs.existsSync(stackTemplatePath)).toBe(true);
    const content = fs.readFileSync(stackTemplatePath, "utf8");
    expect(content).toContain("Approved Tech Stack & Package Allowlist");
    expect(content).toContain("Primary Council Lead");
    expect(content).toContain("Approved Libraries (Allowlist)");
    expect(content).toContain("Forbidden Dependencies (Blacklist)");
    expect(content).toContain("Zero-Drift Dependency Invariant");
  });

  test("context index.md template references stack.md and global identity baseline", () => {
    const indexTemplatePath = path.join(
      REPO_ROOT,
      "skills/core-engine/updateagents/templates/.agents/context/index.md",
    );
    const content = fs.readFileSync(indexTemplatePath, "utf8");
    expect(content).toContain("stack.md");
    expect(content).toContain("Global Identity Baseline");
    expect(content).toContain("~/.agents/identity/");
  });

  test("updateagents CLI supports --stack-guard, --closeout, and --check flags", () => {
    const res = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("--stack-guard");
    expect(res.stdout).toContain("--closeout");
    expect(res.stdout).toContain("--check");
  });

  test("checkStackDrift passes on clean repository", () => {
    const res = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--stack-guard"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Stack Drift Guard Passed");
  });

  test("anti-patterns.md and visual-inspection.md standards templates exist with required invariants", () => {
    const standardsDir = path.join(REPO_ROOT, "skills/core-engine/updateagents/templates/.agents/standards");
    const antiPatternsPath = path.join(standardsDir, "anti-patterns.md");
    const visualInspectionPath = path.join(standardsDir, "visual-inspection.md");

    expect(fs.existsSync(antiPatternsPath)).toBe(true);
    expect(fs.existsSync(visualInspectionPath)).toBe(true);

    const antiPatterns = fs.readFileSync(antiPatternsPath, "utf8");
    expect(antiPatterns).toContain("Negative Constraints & Architectural Anti-Patterns");
    expect(antiPatterns).toContain("Universal Agent Anti-Patterns");
    expect(antiPatterns).toContain("Verification Gate Before Commit");

    const visual = fs.readFileSync(visualInspectionPath, "utf8");
    expect(visual).toContain("Visual Context & Multimodal UI Verification");
    expect(visual).toContain("Screenshot Storage Invariant");
    expect(visual).toContain("./.agents/brand/screenshots/");
  });

  test("updateagents CLI supports --budget, --install-hook, --subapp, and --lint-context flags", () => {
    const res = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("--budget");
    expect(res.stdout).toContain("--install-hook");
    expect(res.stdout).toContain("--subapp");
    expect(res.stdout).toContain("--lint-context");
    expect(res.stdout).toContain("--sync-ide");
    expect(res.stdout).toContain("--lint-rules");
    expect(res.stdout).toContain("--archive-sprints");
  });

  test("anti-patterns.md contains code-fenced Anti-Deltas", () => {
    const antiPatternsPath = path.join(
      REPO_ROOT,
      "skills/core-engine/updateagents/templates/.agents/standards/anti-patterns.md",
    );
    const content = fs.readFileSync(antiPatternsPath, "utf8");
    expect(content).toContain("Anti-Delta: Client-Side Data Fetching vs Server Component");
    expect(content).toContain("Anti-Delta: Unsized Image vs Layout-Stable Media");
    expect(content).toContain("Anti-Delta: Unvalidated Payload vs Structured Zod Envelope");
    expect(content).toContain("Anti-Delta: SQL Injection vs Parameterized Queries");
    expect(content).toContain("// ❌ DON'T:");
    expect(content).toContain("// ✅ DO:");
  });

  test("lintContextLinks and lintRulesAgainstDependencies pass on repository context", () => {
    const res = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--lint-context"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("Context Lint Passed");

    const rulesRes = spawnSync("bun", ["skills/core-engine/updateagents/scripts/updateagents.ts", "--lint-rules"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(rulesRes.status).toBe(0);
    expect(rulesRes.stdout).toContain("Rule-to-Dependency Lint Passed");
  });

  test("auditContextBudget, installGitPreCommitHook, and sliceSubAppContext work in sandbox", () => {
    const tempDir = fs.mkdtempSync(path.join(REPO_ROOT, "tmp-test-suite-"));
    try {
      fs.mkdirSync(path.join(tempDir, "apps/web-portal"), { recursive: true });

      // 1. Test sliceSubAppContext
      const sliceRes = spawnSync(
        "bun",
        ["skills/core-engine/updateagents/scripts/updateagents.ts", tempDir, "--subapp", "web-portal"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(sliceRes.status).toBe(0);
      expect(fs.existsSync(path.join(tempDir, "apps/web-portal/.agents/context/index.md"))).toBe(true);

      // 2. Test auditContextBudget on subapp
      const budgetRes = spawnSync(
        "bun",
        ["skills/core-engine/updateagents/scripts/updateagents.ts", path.join(tempDir, "apps/web-portal"), "--budget"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(budgetRes.status).toBe(0);
      expect(budgetRes.stdout).toContain("HEALTHY");

      // 3. Test installGitPreCommitHook
      fs.mkdirSync(path.join(tempDir, ".git"), { recursive: true });
      const hookRes = spawnSync(
        "bun",
        ["skills/core-engine/updateagents/scripts/updateagents.ts", tempDir, "--install-hook"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(hookRes.status).toBe(0);
      expect(fs.existsSync(path.join(tempDir, ".git/hooks/pre-commit"))).toBe(true);

      // 4. Test syncIdeAdapters
      const ideRes = spawnSync(
        "bun",
        ["skills/core-engine/updateagents/scripts/updateagents.ts", tempDir, "--sync-ide"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(ideRes.status).toBe(0);
      expect(fs.existsSync(path.join(tempDir, ".cursor/rules/frontend-nextjs.mdc"))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, ".github/copilot-instructions.md"))).toBe(true);

      // 5. Test archiveHistoricalSprints
      fs.mkdirSync(path.join(tempDir, ".agents/context"), { recursive: true });
      fs.writeFileSync(
        path.join(tempDir, ".agents/context/current.md"),
        "## 1. Live Reality\n- Task\n\n## 2. Verified Shipped Reality\n1. **Aged Item** (2025-01-01):\n   - Old work\n",
        "utf8",
      );
      const archiveRes = spawnSync(
        "bun",
        ["skills/core-engine/updateagents/scripts/updateagents.ts", tempDir, "--archive-sprints"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(archiveRes.status).toBe(0);
      expect(archiveRes.stdout).toContain("Archived 1 milestone");
      // 6. Test generateWorkReportHtml via --report-html
      const reportHtmlPath = path.join(tempDir, "custom-report.html");
      const reportRes = spawnSync(
        "bun",
        [
          "skills/core-engine/updateagents/scripts/updateagents.ts",
          tempDir,
          "--report-html",
          "--report-out",
          reportHtmlPath,
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(reportRes.status).toBe(0);
      expect(fs.existsSync(reportHtmlPath)).toBe(true);
      const htmlContent = fs.readFileSync(reportHtmlPath, "utf8");
      expect(htmlContent).toContain("Work Report");
      expect(htmlContent).toContain("Agency Council");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("new-project provisions CONTENT_MAP.md and supports --cms-contract", () => {
    const blueprintDoc = fs.readFileSync(
      path.join(REPO_ROOT, "skills/core-engine/new-project/references/integration-blueprints.md"),
      "utf8",
    );
    expect(blueprintDoc).toContain("Zero-Hardcoded-Strings CMS Hand-Off Blueprint");
    expect(blueprintDoc).toContain("CONTENT_MAP.md");

    const templateContentMap = path.join(
      REPO_ROOT,
      "skills/core-engine/updateagents/templates/.agents/brand/CONTENT_MAP.md",
    );
    expect(fs.existsSync(templateContentMap)).toBe(true);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "muse-cms-contract-"));
    try {
      const res = spawnSync(
        "bun",
        ["skills/core-engine/new-project/scripts/new-project.ts", tempDir, "--cms-contract"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(res.status).toBe(0);
      const generatedMap = path.join(tempDir, ".agents/brand/CONTENT_MAP.md");
      expect(fs.existsSync(generatedMap)).toBe(true);
      const content = fs.readFileSync(generatedMap, "utf8");
      expect(content).toContain("Zero-Hardcoded-Strings Invariant");
      expect(content).toContain("Content Mapping Matrix");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("updatedocs CLI supports --audit, --check, --env-audit, --link-lint, and client handoffs", () => {
    const helpRes = spawnSync("bun", ["skills/core-engine/updatedocs/scripts/updatedocs.ts", "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(helpRes.status).toBe(0);
    expect(helpRes.stdout).toContain("updatedocs — Documentation Synchronization");
    expect(helpRes.stdout).toContain("--env-audit");
    expect(helpRes.stdout).toContain("--link-lint");

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "muse-updatedocs-"));
    try {
      // 1. Setup mock repo in tempDir
      fs.writeFileSync(
        path.join(tempDir, "package.json"),
        JSON.stringify({ name: "mock-app", dependencies: { "lucide-react": "^1.0.0" } }),
        "utf8",
      );
      fs.writeFileSync(path.join(tempDir, ".env.example"), "DATABASE_URL=postgres://...\nAPI_KEY=xxx\n", "utf8");
      fs.mkdirSync(path.join(tempDir, "src"), { recursive: true });
      fs.writeFileSync(
        path.join(tempDir, "src/index.ts"),
        "const db = process.env.DATABASE_URL;\nconst secret = process.env.API_KEY;\n",
        "utf8",
      );
      fs.writeFileSync(
        path.join(tempDir, "README.md"),
        '# Mock App\n\nEnv: DATABASE_URL, API_KEY\n\n```json\n{"status": "ok"}\n```\n[Valid Link](#mock-app)\n',
        "utf8",
      );

      // 2. Test --env-audit
      const envRes = spawnSync("bun", ["skills/core-engine/updatedocs/scripts/updatedocs.ts", tempDir, "--env-audit"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(envRes.status).toBe(0);
      expect(envRes.stdout).toContain("Env Var Health Score:        100%");

      // 3. Test --link-lint
      const linkRes = spawnSync(
        "bun",
        ["skills/core-engine/updatedocs/scripts/updatedocs.ts", tempDir, "--link-lint"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(linkRes.status).toBe(0);
      expect(linkRes.stdout).toContain("Link Integrity Score:        100%");

      // 4. Test --client-manual
      const manualRes = spawnSync(
        "bun",
        ["skills/core-engine/updatedocs/scripts/updatedocs.ts", tempDir, "--client-manual"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(manualRes.status).toBe(0);
      expect(fs.existsSync(path.join(tempDir, "CLIENT_HANDOFF.md"))).toBe(true);

      // 5. Test --credits-sync
      const creditsRes = spawnSync(
        "bun",
        ["skills/core-engine/updatedocs/scripts/updatedocs.ts", tempDir, "--credits-sync"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(creditsRes.status).toBe(0);
      expect(fs.existsSync(path.join(tempDir, "CREDITS.md"))).toBe(true);
      expect(fs.readFileSync(path.join(tempDir, "CREDITS.md"), "utf8")).toContain("lucide-react");

      // 6. Test --audit & fast-skip
      const auditRes = spawnSync("bun", ["skills/core-engine/updatedocs/scripts/updatedocs.ts", tempDir, "--audit"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(auditRes.status).toBe(0);
      expect(fs.existsSync(path.join(tempDir, ".docs.hash"))).toBe(true);

      // 7. Test --client-changelog
      const changelogPath = path.join(tempDir, "CLIENT_CHANGELOG.md");
      const changelogRes = spawnSync(
        "bun",
        ["skills/core-engine/updatedocs/scripts/updatedocs.ts", tempDir, `--client-changelog=${changelogPath}`],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(changelogRes.status).toBe(0);
      expect(fs.existsSync(changelogPath)).toBe(true);
      expect(fs.readFileSync(changelogPath, "utf8")).toContain("Client Delivery Release Notes");

      // 8. Test --html-report
      const htmlReportPath = path.join(tempDir, "CLIENT_WORK_REPORT.html");
      const htmlRes = spawnSync(
        "bun",
        ["skills/core-engine/updatedocs/scripts/updatedocs.ts", tempDir, `--html-report=${htmlReportPath}`],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(htmlRes.status).toBe(0);
      expect(fs.existsSync(htmlReportPath)).toBe(true);
      expect(fs.readFileSync(htmlReportPath, "utf8")).toContain("Executive Delivery Report");

      // 9. Test --check-freshness
      const freshRes = spawnSync(
        "bun",
        ["skills/core-engine/updatedocs/scripts/updatedocs.ts", tempDir, "--check-freshness"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(freshRes.status).toBe(0);
      expect(freshRes.stdout).toContain("Documentation Freshness Gate");
      expect(freshRes.stdout).toContain("CACHE_HIT");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("git pre-flight gate CLI supports --preflight-check and --preflight-run with token-saving skip", () => {
    const helpRes = spawnSync("bun", ["skills/core-engine/git/scripts/git-preflight.ts", "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(helpRes.status).toBe(0);
    expect(helpRes.stdout).toContain("git-preflight — Git Pre-Flight Context & Doc Freshness Gate");
    expect(helpRes.stdout).toContain("--preflight-check");
    expect(helpRes.stdout).toContain("--preflight-run");

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "muse-git-preflight-"));
    try {
      // 1. Initial check on unrecorded tempDir (should report sync required, exit 1)
      const checkRes = spawnSync(
        "bun",
        ["skills/core-engine/git/scripts/git-preflight.ts", tempDir, "--preflight-check", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(checkRes.status).toBe(1);
      const checkData = JSON.parse(checkRes.stdout);
      expect(checkData.canSkip).toBe(false);

      // 2. Run preflight (should succeed and write receipts)
      const runRes = spawnSync(
        "bun",
        ["skills/core-engine/git/scripts/git-preflight.ts", tempDir, "--preflight-run", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(runRes.status).toBe(0);
      const runData = JSON.parse(runRes.stdout);
      expect(runData.success).toBe(true);
      expect(fs.existsSync(path.join(tempDir, ".agents/artifacts/.context_fresh"))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, ".agents/artifacts/.docs_fresh"))).toBe(true);

      // 3. Second check immediately after run (should be CACHE_HIT, exit 0)
      const secondCheckRes = spawnSync(
        "bun",
        ["skills/core-engine/git/scripts/git-preflight.ts", tempDir, "--preflight-check", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(secondCheckRes.status).toBe(0);
      const secondCheckData = JSON.parse(secondCheckRes.stdout);
      expect(secondCheckData.canSkip).toBe(true);
      expect(secondCheckData.reason).toContain("CACHE_HIT");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("context-anchor CLI supports --drop, --park, --switch, --list, --pin, and --verify (ghost task detection)", () => {
    const helpRes = spawnSync("bun", ["skills/context-orchestration/context-anchor/scripts/anchor.ts", "--help"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(helpRes.status).toBe(0);
    expect(helpRes.stdout).toContain("anchor.ts — Context Anchor Engine");
    expect(helpRes.stdout).toContain("--drop");
    expect(helpRes.stdout).toContain("--park");
    expect(helpRes.stdout).toContain("--switch");
    expect(helpRes.stdout).toContain("--pin");
    expect(helpRes.stdout).toContain("--verify");

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "muse-anchor-test-"));
    try {
      // 1. Drop anchor
      const dropRes = spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--drop",
          "--workstream",
          "billing-engine",
          "--next",
          "src/billing/service.ts:42 — implement Stripe payment intent",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(dropRes.status).toBe(0);
      const dropData = JSON.parse(dropRes.stdout);
      expect(dropData.success).toBe(true);
      expect(fs.existsSync(path.join(tempDir, ".agents/anchor.md"))).toBe(true);

      const anchorContent = fs.readFileSync(path.join(tempDir, ".agents/anchor.md"), "utf8");
      expect(anchorContent).toContain("workstream: billing-engine");
      expect(anchorContent.split("\n").filter((l) => l.trim().length > 0).length).toBeLessThanOrEqual(15);

      // 2. Park workstream
      const parkRes = spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--park",
          "client-acme-flow",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(parkRes.status).toBe(0);
      expect(fs.existsSync(path.join(tempDir, ".agents/anchors/client-acme-flow.md"))).toBe(true);

      // 3. List anchors
      const listRes = spawnSync(
        "bun",
        ["skills/context-orchestration/context-anchor/scripts/anchor.ts", tempDir, "--list", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(listRes.status).toBe(0);
      const listData = JSON.parse(listRes.stdout);
      expect(listData.length).toBeGreaterThanOrEqual(2);
      expect(
        listData.some((a: { slug: string; type: string }) => a.slug === "billing-engine" && a.type === "active"),
      ).toBe(true);
      expect(
        listData.some((a: { slug: string; type: string }) => a.slug === "client-acme-flow" && a.type === "parked"),
      ).toBe(true);

      // 4. Switch workstream
      const switchRes = spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--switch",
          "client-acme-flow",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(switchRes.status).toBe(0);
      const switchData = JSON.parse(switchRes.stdout);
      expect(switchData.success).toBe(true);
      expect(switchData.slug).toBe("client-acme-flow");
      expect(switchData.reEntryBlock).toContain("resuming client-acme-flow");

      // 5. AST Attention Pinning
      fs.mkdirSync(path.join(tempDir, "src/auth"), { recursive: true });
      fs.writeFileSync(
        path.join(tempDir, "src/auth/types.ts"),
        `export interface SessionEnvelope {\n  sessionId: string;\n  userId: string;\n  roles: string[];\n  expiresAt: number;\n}\n\nexport function verifySession(token: string): boolean {\n  return token.length > 0;\n}\n`,
      );

      const pinRes = spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--pin",
          "src/auth/types.ts:SessionEnvelope",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(pinRes.status).toBe(0);
      const pinData = JSON.parse(pinRes.stdout);
      expect(pinData.success).toBe(true);
      expect(pinData.pinSnippet).toContain("// [PIN: src/auth/types.ts#L1-L6]");
      expect(pinData.pinSnippet).toContain("export interface SessionEnvelope");

      // Verify active anchor contains pinned section
      const updatedAnchor = fs.readFileSync(path.join(tempDir, ".agents/anchor.md"), "utf8");
      expect(updatedAnchor).toContain("## Pinned Attention Context");
      expect(updatedAnchor).toContain("// [PIN: src/auth/types.ts#L1-L6]");

      // 6. Ghost Task Verification — failure on non-existent file
      spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--drop",
          "--next",
          "src/phantom/service.ts:99 — do phantom work",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      const ghostRes = spawnSync(
        "bun",
        ["skills/context-orchestration/context-anchor/scripts/anchor.ts", tempDir, "--verify", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(ghostRes.status).toBe(1);
      const ghostData = JSON.parse(ghostRes.stdout);
      expect(ghostData.ghostTask).toBe(true);
      expect(ghostData.reason).toContain("does not exist on disk");

      // 7. Ghost Task Verification — success when file exists and has git modifications
      spawnSync("git", ["init"], { cwd: tempDir });
      fs.mkdirSync(path.join(tempDir, "src/real"), { recursive: true });
      fs.writeFileSync(path.join(tempDir, "src/real/code.ts"), "export const verified = true;\n");
      spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--drop",
          "--next",
          "src/real/code.ts:1 — implement verified task",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      // Touch file after anchor drop
      fs.appendFileSync(path.join(tempDir, "src/real/code.ts"), "// verified modification\n");

      const successRes = spawnSync(
        "bun",
        ["skills/context-orchestration/context-anchor/scripts/anchor.ts", tempDir, "--verify", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(successRes.status).toBe(0);
      const successData = JSON.parse(successRes.stdout);
      expect(successData.ghostTask).toBe(false);
      expect(successData.success).toBe(true);

      // 8. Observation Masking — offloads >=15 lines to disk and returns 2-line receipt
      const longOutput = Array.from({ length: 25 }, (_, i) => `log line ${i}: test step execution passed`).join("\n");
      const maskRes = spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--mask-output",
          "--cmd",
          "bun test",
          "--raw",
          longOutput,
          "--exit",
          "0",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(maskRes.status).toBe(0);
      const maskData = JSON.parse(maskRes.stdout);
      expect(maskData.masked).toBe(true);
      expect(maskData.receipt).toContain("[OBSERVATION MASKED]: 25 lines offloaded to");
      expect(fs.existsSync(path.join(tempDir, maskData.logPath))).toBe(true);

      // 9. Prompt-Cache-Aware Partitioning — creates static prefix and dynamic tail
      const partRes = spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--partition",
          "--workstream",
          "billing-migration",
          "--next",
          "src/billing.ts:1 — finalize invoices",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(partRes.status).toBe(0);
      const partData = JSON.parse(partRes.stdout);
      expect(partData.success).toBe(true);
      expect(fs.existsSync(path.join(tempDir, ".agents/anchor-static.md"))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, ".agents/anchor-dynamic.md"))).toBe(true);
      const staticContent = fs.readFileSync(path.join(tempDir, ".agents/anchor-static.md"), "utf8");
      expect(staticContent).toContain("# Invariant Anchor State (Cache-Stable Prefix)");

      // 10. Deadlock Breaker — halts on 3 consecutive failures and supports rollback
      spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--record-outcome",
          "--cmd",
          "bun test",
          "--success",
          "false",
          "--summary",
          "Failure 1",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--record-outcome",
          "--cmd",
          "bun test",
          "--success",
          "false",
          "--summary",
          "Failure 2",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      const deadlockRes = spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--record-outcome",
          "--cmd",
          "bun test",
          "--success",
          "false",
          "--summary",
          "Failure 3",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(deadlockRes.status).toBe(1);
      const deadlockData = JSON.parse(deadlockRes.stdout);
      expect(deadlockData.deadlockDetected).toBe(true);
      expect(deadlockData.consecutiveFailures).toBe(3);

      // Verify rollback resets failure streak
      const rollbackRes = spawnSync(
        "bun",
        ["skills/context-orchestration/context-anchor/scripts/anchor.ts", tempDir, "--rollback", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(rollbackRes.status).toBe(0);
      const rollbackData = JSON.parse(rollbackRes.stdout);
      expect(rollbackData.rolledBack).toBe(true);

      const checkAfterRollback = spawnSync(
        "bun",
        ["skills/context-orchestration/context-anchor/scripts/anchor.ts", tempDir, "--deadlock-check", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(checkAfterRollback.status).toBe(0);
      const checkData = JSON.parse(checkAfterRollback.stdout);
      expect(checkData.deadlockDetected).toBe(false);
      expect(checkData.consecutiveFailures).toBe(0);

      // 10. Interruption Recovery & Task Stashing
      const stashRes = spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--stash-task",
          "billing-migration",
          "--goal",
          "Migrate user auth to JWT",
          "--next-step",
          "Verify JWT signature middleware",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(stashRes.status).toBe(0);
      const stashData = JSON.parse(stashRes.stdout);
      expect(stashData.taskId).toBe("billing-migration");
      expect(stashData.goal).toBe("Migrate user auth to JWT");
      expect(stashData.nextStep).toBe("Verify JWT signature middleware");
      expect(fs.existsSync(path.join(tempDir, ".agents/artifacts/task-stashes/billing-migration.json"))).toBe(true);

      // 11. Unstash Task
      const unstashRes = spawnSync(
        "bun",
        [
          "skills/context-orchestration/context-anchor/scripts/anchor.ts",
          tempDir,
          "--unstash-task",
          "billing-migration",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(unstashRes.status).toBe(0);
      const unstashData = JSON.parse(unstashRes.stdout);
      expect(unstashData.success).toBe(true);
      expect(unstashData.reEntryBrief).toContain("Migrate user auth to JWT");
      expect(unstashData.reEntryBrief).toContain("Verify JWT signature middleware");

      // 12. Context Health Check
      const healthRes = spawnSync(
        "bun",
        ["skills/context-orchestration/context-anchor/scripts/anchor.ts", tempDir, "--health-check", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      const healthData = JSON.parse(healthRes.stdout);
      expect(healthData.activeStashes).toBe(1);
      expect(healthData.stashSlugs).toContain("billing-migration");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("🎨 design skill: brand immersion & asset scaffolding engine", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "brand-assets-test-"));
    try {
      // 1. Initial audit should fail on empty project
      const auditFailRes = spawnSync(
        "bun",
        ["skills/agency-delivery/design/scripts/brand-assets.ts", "--project-dir", tempDir, "--audit", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(auditFailRes.status).toBe(1);
      const auditFailData = JSON.parse(auditFailRes.stdout);
      expect(auditFailData.score).toBeLessThan(100);
      expect(auditFailData.pass).toBe(false);

      // 2. Full scaffold creates css, favicon svg, and site.webmanifest
      const scaffoldRes = spawnSync(
        "bun",
        [
          "skills/agency-delivery/design/scripts/brand-assets.ts",
          "--project-dir",
          tempDir,
          "--scaffold",
          "--name",
          "Acme Corp",
          "--short-name",
          "Acme",
          "--primary-color",
          "#4f46e5",
          "--theme-color",
          "#0f172a",
          "--json",
        ],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(scaffoldRes.status).toBe(0);
      const scaffoldData = JSON.parse(scaffoldRes.stdout);
      expect(scaffoldData.success).toBe(true);
      expect(scaffoldData.filesCreated.length).toBe(3);

      // Verify files exist on disk and have expected contents
      const cssPath = path.join(tempDir, "styles/brand-immersion.css");
      const faviconPath = path.join(tempDir, "public/favicon.svg");
      const manifestPath = path.join(tempDir, "public/site.webmanifest");

      expect(fs.existsSync(cssPath)).toBe(true);
      expect(fs.existsSync(faviconPath)).toBe(true);
      expect(fs.existsSync(manifestPath)).toBe(true);

      const cssContent = fs.readFileSync(cssPath, "utf8");
      expect(cssContent).toContain("::selection");
      expect(cssContent).toContain(":focus-visible");
      expect(cssContent).toContain("scrollbar-width");

      const faviconContent = fs.readFileSync(faviconPath, "utf8");
      expect(faviconContent).toContain("prefers-color-scheme: dark");
      expect(faviconContent).toContain("<svg");

      const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      expect(manifestContent.name).toBe("Acme Corp");
      expect(manifestContent.short_name).toBe("Acme");

      // 3. Post-scaffold audit should pass with 100/100
      const auditPassRes = spawnSync(
        "bun",
        ["skills/agency-delivery/design/scripts/brand-assets.ts", "--project-dir", tempDir, "--audit", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(auditPassRes.status).toBe(0);
      const auditPassData = JSON.parse(auditPassRes.stdout);
      expect(auditPassData.score).toBe(100);
      expect(auditPassData.pass).toBe(true);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("🛠️ webdev skill: hydration polish suite (anti-FOUC, zero-CLS, print styles, anchor offset)", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "webdev-polish-test-"));
    try {
      // 1. Initial audit on empty project should fail with < 100 score
      const auditFailRes = spawnSync(
        "bun",
        ["skills/agency-delivery/webdev/scripts/webdev.ts", "--polish-audit", tempDir, "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(auditFailRes.status).toBe(1);
      const auditFailData = JSON.parse(auditFailRes.stdout);
      expect(auditFailData.score).toBeLessThan(100);
      expect(auditFailData.pass).toBe(false);

      // 2. Individual CLI generators verify exact contracts
      const foucRes = spawnSync(
        "bun",
        ["skills/agency-delivery/webdev/scripts/webdev.ts", "--anti-fouc-scaffold", "app-theme", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(foucRes.status).toBe(0);
      const foucData = JSON.parse(foucRes.stdout);
      expect(foucData.inlineJs).toContain("app-theme");
      expect(foucData.htmlTag).toContain("<script>");

      const fontRes = spawnSync(
        "bun",
        ["skills/agency-delivery/webdev/scripts/webdev.ts", "--font-metric-override", "Inter", "Arial", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(fontRes.status).toBe(0);
      const fontData = JSON.parse(fontRes.stdout);
      expect(fontData.sizeAdjust).toBe("107.5%");
      expect(fontData.ascentOverride).toBe("89.6%");
      expect(fontData.css).toContain("@font-face");

      const printRes = spawnSync(
        "bun",
        ["skills/agency-delivery/webdev/scripts/webdev.ts", "--print-css-scaffold", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(printRes.status).toBe(0);
      const printData = JSON.parse(printRes.stdout);
      expect(printData.css).toContain("@media print");
      expect(printData.css).toContain("page-break-inside: avoid");

      const anchorRes = spawnSync(
        "bun",
        ["skills/agency-delivery/webdev/scripts/webdev.ts", "--anchor-offset-scaffold", "5rem", "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(anchorRes.status).toBe(0);
      const anchorData = JSON.parse(anchorRes.stdout);
      expect(anchorData.css).toContain("scroll-padding-top");

      // 3. Full scaffold suite writes styles and hydrator
      const scaffoldRes = spawnSync(
        "bun",
        ["skills/agency-delivery/webdev/scripts/webdev.ts", "--scaffold-polish-suite", tempDir, "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(scaffoldRes.status).toBe(0);
      const scaffoldData = JSON.parse(scaffoldRes.stdout);
      expect(scaffoldData.success).toBe(true);
      expect(scaffoldData.filesCreated.length).toBe(2);

      const cssPath = path.join(tempDir, "styles/hydration-polish.css");
      const hydratorPath = path.join(tempDir, "theme-hydrator.html");
      expect(fs.existsSync(cssPath)).toBe(true);
      expect(fs.existsSync(hydratorPath)).toBe(true);

      // 4. Post-scaffold audit passes with 100/100
      const auditPassRes = spawnSync(
        "bun",
        ["skills/agency-delivery/webdev/scripts/webdev.ts", "--polish-audit", tempDir, "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(auditPassRes.status).toBe(0);
      const auditPassData = JSON.parse(auditPassRes.stdout);
      expect(auditPassData.score).toBe(100);
      expect(auditPassData.pass).toBe(true);
      expect(auditPassData.checks.antiFoucHeadScript).toBe(true);
      expect(auditPassData.checks.fontMetricOverrides).toBe(true);
      expect(auditPassData.checks.printStylesheet).toBe(true);
      expect(auditPassData.checks.anchorScrollPadding).toBe(true);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("🛠️ webdev skill: technical resilience (port probe, package guard, SSR boundary scan)", () => {
    // 1. Port probe checks default ports
    const portRes = spawnSync("bun", ["skills/agency-delivery/webdev/scripts/webdev.ts", "--port-check", "--json"], {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    expect(portRes.status).toBe(0);
    const portData = JSON.parse(portRes.stdout);
    expect(Array.isArray(portData.ports)).toBe(true);
    expect(portData.ports.length).toBeGreaterThanOrEqual(4);

    // 2. Package verification handles genuine, hallucinated, and typosquatted dependencies
    const validPkgRes = spawnSync(
      "bun",
      ["skills/agency-delivery/webdev/scripts/webdev.ts", "--verify-package", "drizzle-orm", "--json"],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(validPkgRes.status).toBe(0);
    const validPkgData = JSON.parse(validPkgRes.stdout);
    expect(validPkgData.valid).toBe(true);

    const hallucinatedPkgRes = spawnSync(
      "bun",
      ["skills/agency-delivery/webdev/scripts/webdev.ts", "--verify-package", "drizzle-orm-pg", "--json"],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(hallucinatedPkgRes.status).toBe(1);
    const hallucinatedPkgData = JSON.parse(hallucinatedPkgRes.stdout);
    expect(hallucinatedPkgData.valid).toBe(false);
    expect(hallucinatedPkgData.isHallucination).toBe(true);
    expect(hallucinatedPkgData.suggestedFix).toContain("drizzle-orm pg");

    const typosquatPkgRes = spawnSync(
      "bun",
      ["skills/agency-delivery/webdev/scripts/webdev.ts", "--verify-package", "lodahs", "--json"],
      { encoding: "utf8", cwd: REPO_ROOT },
    );
    expect(typosquatPkgRes.status).toBe(1);
    const typosquatPkgData = JSON.parse(typosquatPkgRes.stdout);
    expect(typosquatPkgData.valid).toBe(false);
    expect(typosquatPkgData.isTyposquat).toBe(true);

    // 3. SSR boundary scan catches unquarantined window access
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ssr-boundary-test-"));
    try {
      fs.writeFileSync(
        path.join(tempDir, "BadComponent.tsx"),
        "export function BadComponent() {\n  const width = window.innerWidth;\n  return <div>{width}</div>;\n}\n",
      );
      fs.writeFileSync(
        path.join(tempDir, "GoodComponent.tsx"),
        "export function GoodComponent() {\n  useEffect(() => {\n    const width = window.innerWidth;\n  }, []);\n  return <div>OK</div>;\n}\n",
      );

      const ssrRes = spawnSync(
        "bun",
        ["skills/agency-delivery/webdev/scripts/webdev.ts", "--ssr-boundary-scan", tempDir, "--json"],
        { encoding: "utf8", cwd: REPO_ROOT },
      );
      expect(ssrRes.status).toBe(1);
      const ssrData = JSON.parse(ssrRes.stdout);
      expect(ssrData.violations.length).toBe(1);
      expect(ssrData.violations[0].globalUsed).toBe("window");
      expect(ssrData.violations[0].file).toContain("BadComponent.tsx");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("🐙 git skill: gitignore-audit CLI detects parent directory traps and audits tracked-ignored files", () => {
    const scriptPath = "skills/core-engine/git/scripts/gitignore-audit.ts";
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "git-ignore-test-"));

    try {
      const gitignorePath = path.join(tempDir, ".gitignore");
      const badContent = `
# Faulty gitignore with parent directory trap
logs/
!logs/important.log
dist
build/
`;
      fs.writeFileSync(gitignorePath, badContent, "utf8");

      // 1. Audit detects the parent directory trap and missing trailing slash
      const auditRes = spawnSync("bun", [scriptPath, "--audit", gitignorePath, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(auditRes.status).toBe(1);
      const auditData = JSON.parse(auditRes.stdout);
      expect(auditData.isValid).toBe(false);
      expect(auditData.violations.some((v: { type: string }) => v.type === "parent-directory-trap")).toBe(true);
      expect(auditData.violations.some((v: { type: string }) => v.type === "missing-trailing-slash")).toBe(true);

      // 2. Auto-fix rewrites logs/ to logs/*
      const fixRes = spawnSync("bun", [scriptPath, "--fix", gitignorePath, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(fixRes.status).toBe(0);
      const fixData = JSON.parse(fixRes.stdout);
      expect(fixData.fixed).toBe(true);

      const fixedContent = fs.readFileSync(gitignorePath, "utf8");
      expect(fixedContent).toContain("logs/*");
      expect(fixedContent).toContain("!logs/important.log");

      // 3. Re-audit has no fatal parent-directory-trap errors
      const reAuditRes = spawnSync("bun", [scriptPath, "--audit", gitignorePath, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(reAuditRes.status).toBe(0);
      const reAuditData = JSON.parse(reAuditRes.stdout);
      expect(reAuditData.isValid).toBe(true);
      expect(reAuditData.violations.some((v: { type: string }) => v.type === "parent-directory-trap")).toBe(false);

      // 4. Tracked files check works on clean repo
      const trackedRes = spawnSync("bun", [scriptPath, "--check-tracked", REPO_ROOT, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(trackedRes.status).toBe(0);
      const trackedData = JSON.parse(trackedRes.stdout);
      expect(trackedData.count).toBe(0);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("🐧 code-review skill: senior auditor CLI audits EDR safety, runtime pitfalls, and Conventional Comments", () => {
    const scriptPath = "skills/quality-review/code-review/scripts/code-review.ts";
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "code-review-test-"));

    try {
      // 1. EDR Safety Audit catches dynamic eval and /tmp script drops
      const badScript = path.join(tempDir, "unsafe.ts");
      fs.writeFileSync(
        badScript,
        'const result = eval("2 + 2");\nfs.writeFileSync("/tmp/payload.sh", "#!/bin/sh\\necho hi");\n',
        "utf8",
      );
      const edrRes = spawnSync("bun", [scriptPath, "--audit-edr-safety", tempDir, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(edrRes.status).toBe(1);
      const edrData = JSON.parse(edrRes.stdout);
      expect(edrData.passed).toBe(false);
      expect(edrData.violations.some((v: { type: string }) => v.type === "dynamic-code-eval")).toBe(true);
      expect(edrData.violations.some((v: { type: string }) => v.type === "tmp-script-drop")).toBe(true);

      // 2. Runtime pitfalls audit catches Math.random() in token generation and float currency math
      const tokenScript = path.join(tempDir, "token-service.ts");
      fs.writeFileSync(
        tokenScript,
        "export function generateToken() {\n  return Math.random().toString(36);\n}\nconst fee = price * 0.15;\n",
        "utf8",
      );
      const runtimeRes = spawnSync("bun", [scriptPath, "--audit-runtime-pitfalls", tempDir, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(runtimeRes.status).toBe(1);
      const runtimeData = JSON.parse(runtimeRes.stdout);
      expect(runtimeData.passed).toBe(false);
      expect(runtimeData.violations.some((v: { type: string }) => v.type === "weak-pseudo-random")).toBe(true);
      expect(runtimeData.violations.some((v: { type: string }) => v.type === "float-currency-math")).toBe(true);

      // 3. Conventional Comments Audit
      const reviewDoc = path.join(tempDir, "REVIEW.md");
      fs.writeFileSync(
        reviewDoc,
        "- blocker: Database transaction missing rollback handler on error.\n- nitpick: Rename variable to improve clarity.\n- Please rewrite this whole function.\n",
        "utf8",
      );
      const commentRes = spawnSync("bun", [scriptPath, "--audit-conventional-comments", reviewDoc, "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      const commentData = JSON.parse(commentRes.stdout);
      expect(commentData.totalComments).toBe(3);
      expect(commentData.compliantComments).toBe(2);
      expect(commentData.nonCompliant.length).toBe(1);

      // 4. Lockfile audit checks package-lock.json in repo
      const lockRes = spawnSync("bun", [scriptPath, "--audit-lockfile", "package.json", "--json"], {
        encoding: "utf8",
        cwd: REPO_ROOT,
      });
      expect(lockRes.status).toBe(0);
      const lockData = JSON.parse(lockRes.stdout);
      expect(lockData.passed).toBe(true);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
