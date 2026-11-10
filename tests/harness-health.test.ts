import { describe, expect, test } from "bun:test";
import { checkHarnessHealth, detectRetirementSignals } from "../scripts/check-harness-health";
import { type Harness, loadHarnessRegistry } from "../scripts/harness-registry";

const registry = loadHarnessRegistry();
const gemini = registry.harnesses.find((harness) => harness.id === "gemini") as Harness;
const qwen = registry.harnesses.find((harness) => harness.id === "qwen") as Harness;

describe("harness retirement detection", () => {
  test("catches the real Gemini retirement announcement", () => {
    const html = `<html><body><h1>An important update</h1>
      <p>Announcement for the sunsetting of Gemini CLI in favor of Antigravity CLI, a more robust, agent-first platform.</p>
      <p>Gemini CLI will also remain accessible via paid API keys.</p></body></html>`;
    const signals = detectRetirementSignals(html, gemini);
    expect(signals.length).toBeGreaterThan(0);
    expect(signals[0]).toContain("sunsetting");
  });

  test("catches a signal that exists only in meta tags", () => {
    // The real Gemini blog rendered its announcement client-side; the only
    // server-side copy lived in <title> and <meta description>.
    const html = `<html><head><title>An important update: Transitioning Gemini CLI to Antigravity CLI</title>
      <meta name="description" content="Announcement for the sunsetting of Gemini CLI in favor of Antigravity CLI." /></head>
      <body><div id="root"></div></body></html>`;
    const signals = detectRetirementSignals(html, gemini);
    expect(signals.length).toBeGreaterThan(0);
    expect(signals.join(" ")).toContain("sunsetting");
  });

  test("does not read a deprecated file format as a retired harness", () => {
    // Qwen Code's docs say TOML is deprecated; the harness itself is fine.
    const html = `<html><body><h1>Commands</h1>
      <p>Custom commands now use Markdown format. TOML format is deprecated but still supported for backwards compatibility.</p>
      <p>Qwen Code commands are triggered through specific prefixes.</p></body></html>`;
    expect(detectRetirementSignals(html, qwen)).toEqual([]);
  });

  test("ignores retirement language that names a different product", () => {
    const html = "<p>We are retiring the old dashboard in favour of the new one.</p>";
    expect(detectRetirementSignals(html, qwen)).toEqual([]);
  });

  test("offline mode reports every active harness without fetching", async () => {
    const findings = await checkHarnessHealth({ offline: true });
    expect(findings.length).toBe(registry.harnesses.filter((harness) => harness.status === "active").length);
    expect(findings.every((finding) => finding.signal === "ok")).toBe(true);
    expect(findings.every((finding) => finding.status === "active")).toBe(true);
  });

  test("--all includes legacy and skills-only harnesses", async () => {
    const findings = await checkHarnessHealth({ offline: true, includeAll: true });
    expect(findings.map((finding) => finding.harness)).toContain("codex");
    expect(findings.map((finding) => finding.harness)).toContain("gemini");
  });
});
