import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
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
    expect(JSON.parse(result.stdout).results).toEqual([]);
    expect(result.status).toBe(0);
  }, 60_000);
});

describe("cut-release — refuses rather than guessing", () => {
  test("requires a version argument", () => {
    const result = run("scripts/cut-release.ts", []);
    expect(result.status).not.toBe(0);
    expect(`${result.stdout}${result.stderr}`).toContain("--major");
  }, 30_000);
});
