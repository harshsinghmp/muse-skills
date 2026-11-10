import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderRoutingTable } from "../scripts/sync-routing-docs";

const REPO_ROOT = join(import.meta.dir, "..");

describe("README routing table", () => {
  test("is generated from the routing baseline and stays in sync", () => {
    const readme = readFileSync(join(REPO_ROOT, "README.md"), "utf8");
    const start = readme.indexOf("<!-- routing-matrix:start -->");
    const end = readme.indexOf("<!-- routing-matrix:end -->");
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    expect(readme.slice(start, end)).toContain(renderRoutingTable().split("\n")[0]);

    const check = spawnSync("bun", ["scripts/sync-routing-docs.ts", "--check"], { cwd: REPO_ROOT, encoding: "utf8" });
    expect(check.status).toBe(0);
    expect(check.stdout).toContain("matches routing-baseline.json");
  });

  test("every distribution in the baseline appears, tuned first", () => {
    const baseline = JSON.parse(readFileSync(join(REPO_ROOT, "routing-baseline.json"), "utf8")) as {
      distributions: Record<string, unknown>;
    };
    const table = renderRoutingTable();
    for (const name of Object.keys(baseline.distributions)) {
      const label = name === "training" ? "training (tuned)" : name;
      expect(table).toContain(`\`${label}\``);
    }
    const trainingRow = table.indexOf("training (tuned)");
    const firstUnseen = table.indexOf("| `v5`");
    expect(trainingRow).toBeLessThan(firstUnseen);
  });
});
