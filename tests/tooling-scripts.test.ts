import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const run = (script: string, args: string[]) =>
  spawnSync("bun", [script, ...args], { cwd: ROOT, encoding: "utf8", timeout: 120_000 });

describe("verify — one command for every gate", () => {
  test("--list exposes every gate, and the network gate is opt-in", () => {
    const result = run("scripts/verify.ts", ["--list"]);
    expect(result.status).toBe(0);
    const gates = JSON.parse(result.stdout) as Array<{ name: string; network: boolean }>;
    expect(gates.length).toBeGreaterThan(12);
    expect(gates.filter((gate) => gate.network).map((gate) => gate.name)).toEqual(["deps"]);
    for (const name of ["lint", "type-check", "test", "routing-matrix", "ledger", "secret-scan"]) {
      expect(gates.map((gate) => gate.name)).toContain(name);
    }
  }, 30_000);

  test("skipping every gate is a clean no-op rather than a false pass", () => {
    const gates = [
      "lint",
      "type-check",
      "test",
      "surface",
      "harness",
      "install",
      "routing-matrix",
      "routing-coverage",
      "routing-docs",
      "routing-signals",
      "ledger",
      "hygiene",
      "secret-scan",
      "docs-commands",
      "mcp",
    ];
    const args = ["--json"];
    for (const gate of gates) args.push("--skip", gate);
    const result = run("scripts/verify.ts", args);
    const parsed = JSON.parse(result.stdout) as { skipped: string[]; results: unknown[] };
    expect(parsed.results).toEqual([]);
    expect(parsed.skipped).toEqual(gates);
    expect(result.status).toBe(0);
  }, 60_000);

  test("an unknown --skip gate fails instead of silently passing", () => {
    const result = run("scripts/verify.ts", ["--skip", "not-a-gate", "--json"]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Unknown gate");
  }, 30_000);
});

describe("cut-release — refuses rather than guessing", () => {
  test("checks dependency freshness before creating the release branch", () => {
    const source = readFileSync(join(ROOT, "scripts", "cut-release.ts"), "utf8");
    const deps = source.indexOf('step(state, "deps"');
    const branch = source.indexOf('step(state, "branch"');
    expect(deps).toBeGreaterThan(-1);
    expect(deps).toBeLessThan(branch);
    expect(source).toContain("check:deps");
    expect(source).toContain("refresh pins before cutting");
  });

  test("requires a version argument", () => {
    const result = run("scripts/cut-release.ts", []);
    expect(result.status).not.toBe(0);
    expect(`${result.stdout}${result.stderr}`).toContain("--major");
  }, 30_000);
});

describe("branch guard", () => {
  const guard = (branch: string, env: Record<string, string> = {}) =>
    spawnSync("sh", ["scripts/hooks/branch-guard-pre-commit.sh"], {
      cwd: ROOT,
      encoding: "utf8",
      env: { ...process.env, MUSE_BRANCH_GUARD_BRANCH: branch, ...env },
    });

  test("refuses an ordinary commit on an integration branch", () => {
    for (const branch of ["main", "dev", "master", "trunk", "develop"]) {
      const result = guard(branch);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("Refusing to commit");
    }
  });

  test("allows feature branches and an explicit override", () => {
    expect(guard("feat/x").status).toBe(0);
    expect(guard("main", { MUSE_ALLOW_INTEGRATION_COMMIT: "1" }).status).toBe(0);
  });
});

describe("cut-release resume", () => {
  test("refuses to resume without an interrupted release", () => {
    const result = spawnSync("bun", ["scripts/cut-release.ts", "--resume"], {
      cwd: ROOT,
      encoding: "utf8",
      env: { ...process.env, MUSE_RELEASE_CUT_STATE: join(ROOT, ".git", "does-not-exist.json") },
      timeout: 60_000,
    });
    expect(result.status).not.toBe(0);
    expect(`${result.stdout}${result.stderr}`).toContain("no interrupted release");
    expect(result.status).not.toBe(0);
  }, 30_000);
});
