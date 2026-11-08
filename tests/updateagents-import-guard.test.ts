import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const UPDATEAGENTS_SCRIPT = path.join(REPO_ROOT, "skills/core-engine/updateagents/scripts/updateagents.ts");

function makeSandbox(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "updateagents-import-"));
}

function anyFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else out.push(path.relative(dir, full));
    }
  };
  walk(dir);
  return out.sort();
}

describe("updateagents entry-point guard", () => {
  test("importing the module has no side effects in the working directory", () => {
    const sandbox = makeSandbox();
    try {
      const script = `const mod = await import(${JSON.stringify(UPDATEAGENTS_SCRIPT)});
        console.log("IS_ENTRY_POINT=" + mod.IS_ENTRY_POINT);
        console.log("router=" + typeof mod.ensureSecretaryRouter);
        console.log("hash=" + typeof mod.computeContextHash);`;
      const res = spawnSync("bun", ["-e", script], { cwd: sandbox, encoding: "utf8" });

      expect(res.status).toBe(0);
      expect(res.stdout).toContain("IS_ENTRY_POINT=false");
      expect(res.stdout).toContain("router=function");
      expect(res.stdout).toContain("hash=function");
      expect(res.stdout).not.toContain("Project Agent Context Synchronization");
      expect(res.stderr).not.toContain("Project Agent Context Synchronization");
      expect(anyFiles(sandbox)).toEqual([]);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test("importing never rewrites curated standards", () => {
    const sandbox = makeSandbox();
    try {
      const standardsDir = path.join(sandbox, ".agents", "standards");
      fs.mkdirSync(standardsDir, { recursive: true });
      const curatedPath = path.join(standardsDir, "execution-kernel.md");
      fs.writeFileSync(curatedPath, "# Curated kernel\n\nKeep this exact text.\n", "utf8");

      const script = `await import(${JSON.stringify(UPDATEAGENTS_SCRIPT)});`;
      const res = spawnSync("bun", ["-e", script], { cwd: sandbox, encoding: "utf8" });

      expect(res.status).toBe(0);
      expect(fs.readFileSync(curatedPath, "utf8")).toBe("# Curated kernel\n\nKeep this exact text.\n");
      expect(anyFiles(sandbox)).toEqual([path.join(".agents", "standards", "execution-kernel.md")]);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test("running the file as the entry point still executes the CLI", () => {
    const res = spawnSync("bun", [UPDATEAGENTS_SCRIPT, "--help"], { encoding: "utf8" });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("updateagents — Universal Agent Context Synchronization");
    expect(res.stdout).toContain("--check-canon");
  });
});
