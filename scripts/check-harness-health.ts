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

import fs from "node:fs";
import path from "node:path";
import { type Harness, loadHarnessRegistry } from "./harness-registry";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const BASELINE_PATH = path.join(REPO_ROOT, "harness-health.baseline.json");

export interface Baseline {
  generatedAt: string;
  harnesses: Record<string, { matched: string[]; signals: string[] }>;
}

export function readBaseline(file = BASELINE_PATH): Baseline | null {
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as Baseline;
  } catch {
    return null;
  }
}

/** Signals this run found that the baseline did not record (docs grew). */
export function growthSignals(baseline: Baseline | null, findings: HealthFinding[]): Record<string, string[]> {
  const growth: Record<string, string[]> = {};
  for (const finding of findings) {
    if (!finding.matched || finding.matched.length === 0) continue;
    const known = baseline?.harnesses[finding.harness]?.matched ?? [];
    const added = finding.matched.filter((signal) => !known.includes(signal));
    if (added.length > 0) growth[finding.harness] = added;
  }
  return growth;
}

/** Signals the baseline recorded that this run no longer finds. */
export function droppedSignals(baseline: Baseline | null, harnessId: string, matched: string[]): string[] {
  const before = baseline?.harnesses[harnessId]?.matched ?? [];
  return before.filter((signal) => !matched.includes(signal));
}

const DEATH_SIGNAL =
  /\b(retired?|retiring|retirement|sunset(?:ting)?|deprecated|end[ -]of[ -]life|eol|shut(?:ting)? down|no longer (?:supported|available)|replaced by|transitioning)\b/i;

/** Words too generic to identify a harness inside a sentence. */
const GENERIC = new Set(["cli", "code", "the", "custom", "commands"]);

export interface HealthFinding {
  harness: string;
  status: Harness["status"];
  /** retired: announcement wording. surface-changed: docs no longer mention the path we write. */
  signal: "retired" | "surface-changed" | "regressed" | "moved" | "unreachable" | "ok";
  evidence?: string;
  /** Signals found on the page this run (used to refresh the baseline). */
  matched?: string[];
}

/** Strip tags once, for both the sentence and the surface checks. */
function pageText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The docs page must still mention at least one path we write to. This catches a
 * surface change even when the vendor never says "retired" — the Codex case.
 * A short page (a login wall, a JS shell) is inconclusive, never a failure.
 */
export function checkSurfaceSignals(html: string, harness: Harness): { ok: boolean; text: string; matched: string[] } {
  const signals = harness.docsSignals ?? [];
  if (signals.length === 0) return { ok: true, text: "", matched: [] };
  const text = pageText(html).toLowerCase();
  const matched = signals.filter((signal) => text.includes(signal.toLowerCase()));
  const substantial = text.length > 2000;
  if (!substantial) return { ok: true, text, matched };
  return { ok: matched.length > 0, text, matched };
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

async function fetchDocs(url: string): Promise<{ html: string; finalUrl: string } | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "muse-skills harness-health" },
      redirect: "follow",
    });
    if (!response.ok) return null;
    return { html: await response.text(), finalUrl: response.url };
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
    const page = await fetchDocs(harness.docs);
    if (page === null) {
      findings.push({ harness: harness.id, status: harness.status, signal: "unreachable", evidence: harness.docs });
      continue;
    }
    const signals = detectRetirementSignals(page.html, harness);
    if (signals.length > 0) {
      findings.push({ harness: harness.id, status: harness.status, signal: "retired", evidence: signals[0] });
      continue;
    }
    const surface = checkSurfaceSignals(page.html, harness);
    if (!surface.ok) {
      findings.push({
        harness: harness.id,
        status: harness.status,
        signal: "surface-changed",
        evidence: `docs no longer mention any of: ${(harness.docsSignals ?? []).join(", ")}`,
      });
      continue;
    }
    // A rewritten page can keep one signal while dropping another; compare
    // against the pinned baseline so a removal is still visible.
    const baseline = readBaseline();
    const dropped = droppedSignals(baseline, harness.id, surface.matched);
    if (dropped.length > 0) {
      findings.push({
        harness: harness.id,
        status: harness.status,
        signal: "regressed",
        evidence: `documented signal(s) disappeared: ${dropped.join(", ")} (baseline ${baseline?.generatedAt ?? "unknown"})`,
      });
      continue;
    }

    const moved = page.finalUrl.replace(/\/$/, "") !== harness.docs.replace(/\/$/, "");
    findings.push({
      harness: harness.id,
      status: harness.status,
      signal: moved ? "moved" : "ok",
      evidence: moved ? `redirected to ${page.finalUrl}` : surface.matched[0],
      matched: surface.matched,
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
      if (args.includes("--update-baseline")) {
        const baseline: Baseline = {
          generatedAt: new Date().toISOString().slice(0, 10),
          harnesses: Object.fromEntries(
            findings
              .filter((finding) => finding.matched && finding.matched.length > 0)
              .map((finding) => [finding.harness, { matched: finding.matched as string[], signals: [] }]),
          ),
        };
        fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`, "utf8");
        console.log(`✅ harness-health baseline updated (${Object.keys(baseline.harnesses).length} harnesses)`);
        process.exit(0);
      }

      if (json) {
        const baseline = readBaseline();
        console.log(JSON.stringify({ findings, growth: growthSignals(baseline, findings) }, null, 2));
      } else {
        console.log("🩺 Harness health — docs pages scanned for retirement\n");
        for (const finding of findings) {
          const icon =
            finding.signal === "retired" || finding.signal === "surface-changed" || finding.signal === "regressed"
              ? "❌"
              : finding.signal === "unreachable" || finding.signal === "moved"
                ? "⚠️ "
                : "✅";
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
      const regressed = findings.filter((finding) => finding.signal === "regressed" && finding.status === "active");
      if (regressed.length > 0) {
        console.error(
          `\n❌ ${regressed.length} active harness(es) lost a documented signal: ${regressed.map((f) => f.harness).join(", ")}`,
        );
        console.error("   Re-check the docs page, then run with --update-baseline once the surface is confirmed.");
        process.exit(strict ? 1 : 0);
      }
      const growth = growthSignals(readBaseline(), findings);
      if (Object.keys(growth).length > 0) {
        console.log(
          `\n📈 Baseline growth: ${Object.entries(growth)
            .map(([harness, signals]) => `${harness} (${signals.join(", ")})`)
            .join("; ")} — run with --update-baseline to record it.`,
        );
      }
      const moved = findings.filter((finding) => finding.signal === "moved");
      if (moved.length > 0) {
        console.log(
          `\n⚠️  ${moved.length} docs URL(s) redirect elsewhere: ${moved.map((f) => f.harness).join(", ")} — check whether the surface still exists.`,
        );
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
