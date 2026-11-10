#!/usr/bin/env bun
/**
 * check-harness-health — watches every documented harness for retirement.
 *
 * `harness.json` promises that a harness reads our files. Vendors break that
 * promise on their own schedule: Gemini CLI was retired in 2026 and Codex
 * removed its custom-prompts subsystem, both discovered by accident. This scans
 * each harness's docs page for a death sentence that names the harness.
 *
 *   bun scripts/check-harness-health.ts            # report, exit 0
 *   bun scripts/check-harness-health.ts --strict   # exit 1 when an ACTIVE harness looks retired
 *   bun scripts/check-harness-health.ts --offline  # skip fetching (tests, no network)
 *   bun scripts/check-harness-health.ts --all      # also check legacy/skills-only entries
 */

import { type Harness, loadHarnessRegistry } from "./harness-registry";

const DEATH_SIGNAL =
  /\b(retired?|retiring|retirement|sunset(?:ting)?|deprecated|end[ -]of[ -]life|eol|shut(?:ting)? down|no longer (?:supported|available)|replaced by|transitioning)\b/i;

/** Words too generic to identify a harness inside a sentence. */
const GENERIC = new Set(["cli", "code", "the", "custom", "commands"]);

export interface HealthFinding {
  harness: string;
  status: Harness["status"];
  signal: "retired" | "unreachable" | "ok";
  evidence?: string;
}

export function harnessNames(harness: Harness): string[] {
  return [harness.id, ...harness.label.split(/\s+/)]
    .map((name) => name.trim())
    .filter((name) => name.length >= 3 && !GENERIC.has(name.toLowerCase()));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Returns sentences that both signal retirement and name this harness. Requiring
 * the name in the same sentence is what keeps "TOML is deprecated" (Qwen's
 * format note) from being read as "Qwen Code is deprecated".
 */
export function detectRetirementSignals(html: string, harness: Harness): string[] {
  // Titles and descriptions are the densest signal on a page — and on several
  // vendor blogs the announcement text exists ONLY there (the body is rendered
  // client-side), so collect them before stripping tags.
  const headlines: string[] = [];
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1];
  if (title) headlines.push(title);
  for (const tag of html.match(/<meta[^>]*>/gi) ?? []) {
    const name = /(?:name|property)=["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase();
    const content = /content=["']([^"']+)["']/i.exec(tag)?.[1];
    if (!name || !content) continue;
    if (/description|og:title|twitter:title|og:description|twitter:description/.test(name)) headlines.push(content);
  }

  const text = [
    headlines.join(". "),
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " "),
  ].join(". ");

  const names = harnessNames(harness).map(escapeRegExp);
  if (names.length === 0) return [];
  const mentions = new RegExp(`\\b(?:${names.join("|")})\\b`, "i");

  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20 && sentence.length < 400)
    .filter((sentence) => DEATH_SIGNAL.test(sentence) && mentions.test(sentence));
}

async function fetchDocs(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "muse-skills harness-health" },
      redirect: "follow",
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

export async function checkHarnessHealth(
  options: { offline?: boolean; includeAll?: boolean } = {},
): Promise<HealthFinding[]> {
  const registry = loadHarnessRegistry();
  const findings: HealthFinding[] = [];
  for (const harness of registry.harnesses) {
    if (!options.includeAll && harness.status !== "active") continue;
    if (options.offline) {
      findings.push({ harness: harness.id, status: harness.status, signal: "ok", evidence: "offline: not fetched" });
      continue;
    }
    const html = await fetchDocs(harness.docs);
    if (html === null) {
      findings.push({ harness: harness.id, status: harness.status, signal: "unreachable", evidence: harness.docs });
      continue;
    }
    const signals = detectRetirementSignals(html, harness);
    findings.push({
      harness: harness.id,
      status: harness.status,
      signal: signals.length > 0 ? "retired" : "ok",
      evidence: signals[0],
    });
  }
  return findings;
}

function main(): void {
  const args = Bun.argv.slice(2);
  const strict = args.includes("--strict");
  const offline = args.includes("--offline");
  const includeAll = args.includes("--all");
  const json = args.includes("--json");

  checkHarnessHealth({ offline, includeAll })
    .then((findings) => {
      if (json) {
        console.log(JSON.stringify({ findings }, null, 2));
      } else {
        console.log("🩺 Harness health — docs pages scanned for retirement\n");
        for (const finding of findings) {
          const icon = finding.signal === "retired" ? "❌" : finding.signal === "unreachable" ? "⚠️ " : "✅";
          const suffix = finding.status === "active" ? "" : ` (${finding.status})`;
          console.log(`   ${icon} ${finding.harness.padEnd(14)}${suffix} ${finding.signal}`);
          if (finding.evidence) console.log(`      ${finding.evidence.slice(0, 220)}`);
        }
      }

      const retired = findings.filter((finding) => finding.signal === "retired" && finding.status === "active");
      const unreachable = findings.filter((finding) => finding.signal === "unreachable");
      if (retired.length > 0) {
        console.error(
          `\n❌ ${retired.length} active harness(es) look retired upstream: ${retired.map((f) => f.harness).join(", ")}`,
        );
        console.error("   Update harness.json status and the affected exporter before the surface breaks silently.");
        process.exit(strict ? 1 : 0);
      }
      if (unreachable.length > 0) {
        // Network flakiness must not fail the gate; it is reported instead.
        console.log(`\n⚠️  ${unreachable.length} docs page(s) unreachable — not treated as a retirement signal.`);
      }
      console.log("\n✅ No retirement signals found for active harnesses.");
      process.exit(0);
    })
    .catch((error) => {
      console.error(`❌ harness health check failed: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(2);
    });
}

if (import.meta.main) main();
