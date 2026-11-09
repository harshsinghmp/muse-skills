import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(REPO_ROOT, file), "utf8");

describe("skill documentation consistency (#380)", () => {
  test("lease window, layer count, packet sections, and database caps agree", () => {
    expect(read("skills/context-orchestration/coupling-router/scripts/worktree-federation.ts")).not.toContain(
      "300 * 1000",
    );
    expect(read("skills/design-interface/designscope/SKILL.md")).not.toContain("5 analysis layers");
    expect(read("skills/design-interface/designscope/references/analysis-framework.md")).not.toContain(
      "5 analysis layers",
    );

    const relay =
      read("skills/context-orchestration/relay/SKILL.md") + read("skills/context-orchestration/relay/README.md");
    expect(relay).not.toContain("7-section");
    expect(relay).not.toContain("7 outbound");
    expect(relay).not.toContain("All 7");
    expect(relay).not.toContain("/handoff");

    const database = read("skills/agency-delivery/database/SKILL.md");
    expect(database).not.toContain("100 rows × 10 cols");
    expect(database).toContain("10,000-row cap");
  });

  test("updatedocs and updateagents report the real step/asset counts", () => {
    const updatedocs = read("skills/core-engine/updatedocs/SKILL.md") + read("skills/core-engine/updatedocs/README.md");
    expect(updatedocs).not.toContain("20-Step");
    expect(updatedocs).not.toContain("All 20");
    expect(updatedocs).not.toContain("all 20");

    const updateagents = read("skills/core-engine/updateagents/README.md");
    expect(updateagents).not.toContain("13-Asset");
    expect(updateagents).toContain("14-Asset");
  });

  test("ordered procedures have unique step numbers", () => {
    const steps = (file: string) =>
      read(file)
        .split("\n")
        .map((line) => line.match(/^(\d+)\.\s/))
        .filter(Boolean)
        .map((match) => Number(match?.[1]));
    for (const file of [
      "skills/agency-delivery/paidads/references/audit.md",
      "skills/agency-delivery/sales-enablement/references/demo.md",
    ]) {
      const numbers = steps(file);
      expect(numbers.length).toBeGreaterThan(3);
      expect(new Set(numbers).size).toBe(numbers.length);
    }
    expect(read("skills/agency-delivery/paidads/references/audit.md")).toContain("## Severity & routing");
  });

  test("no dated, host-specific, or internal-batch claims in shipped docs", () => {
    expect(read("skills/reflection-maintenance/clean-system-cache/SKILL.md")).not.toContain("2026-10-08");
    const mobile = [
      "skills/agency-delivery/mobile/SKILL.md",
      "skills/agency-delivery/mobile/README.md",
      "skills/agency-delivery/mobile/references/expo.md",
      "skills/agency-delivery/mobile/scripts/expo-scaffold.ts",
    ]
      .map(read)
      .join("\n");
    expect(mobile).not.toContain("SDK 52");
    expect(mobile).not.toContain("~52.0.0");

    const gtm = read("skills/agency-delivery/gtm/SKILL.md") + read("skills/quality-review/pua/SKILL.md");
    expect(gtm).not.toContain("lane-a-");
    expect(gtm).not.toContain("lane-d-");

    const ledger = read("skills/context-orchestration/evidence-ledger/SKILL.md");
    expect(ledger).not.toContain("Post-hook**: `handoff`");
    expect(ledger).not.toContain("invoke `handoff`");
  });

  test("gtm does not claim the qa-launch trigger", () => {
    const gtm = read("skills/agency-delivery/gtm/SKILL.md");
    expect(gtm).not.toContain('"launch audit"');
    expect(gtm).toContain('"gtm launch audit"');
  });
});
