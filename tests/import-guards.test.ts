import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");

const IMPORT_CLEAN = [
  "skills/core-engine/updatedocs/scripts/updatedocs.ts",
  "skills/core-engine/new-project/scripts/new-project.ts",
  "skills/agency-delivery/devops/scripts/tunnel.ts",
  "skills/agency-delivery/research/scripts/sample-size.ts",
];

describe("import-safe script entry points", () => {
  for (const script of IMPORT_CLEAN) {
    test(`importing ${script} has no side effects`, () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "import-guard-"));
      try {
        const absolute = path.join(REPO_ROOT, script);
        const result = spawnSync("bun", ["-e", `await import(${JSON.stringify(absolute)})`], {
          cwd: dir,
          encoding: "utf8",
          timeout: 20_000,
          env: { ...process.env, HOME: dir },
        });
        expect(result.status).toBe(0);
        expect((result.stdout ?? "").trim()).toBe("");
        expect(fs.readdirSync(dir).filter((entry) => ![".bun", "node_modules"].includes(entry))).toEqual([]);
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
  }

  test("helpers remain exported for programmatic use", async () => {
    const sample = await import(path.join(REPO_ROOT, "skills/agency-delivery/research/scripts/sample-size.ts"));
    expect(typeof sample.sampleSize).toBe("function");
    expect(sample.sampleSize(0.5, 0.05, 1.96, 0)).toBeGreaterThanOrEqual(380);
  });
});
