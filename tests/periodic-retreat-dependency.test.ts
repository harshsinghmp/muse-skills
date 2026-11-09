import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const SHIM = path.join(REPO_ROOT, "skills/reflection-maintenance/periodic-retreat/scripts/wisdom-updater.ts");

describe("periodic-retreat coach dependency", () => {
  test("fails with an actionable install hint when coach is absent", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "periodic-retreat-"));
    try {
      const scripts = path.join(dir, "periodic-retreat", "scripts");
      fs.mkdirSync(scripts, { recursive: true });
      fs.copyFileSync(SHIM, path.join(scripts, "wisdom-updater.ts"));

      const res = spawnSync("bun", [path.join(scripts, "wisdom-updater.ts")], { encoding: "utf8" });
      expect(res.status).toBe(1);
      expect(res.stderr).toContain("requires the coach skill");
      expect(res.stderr).toContain("npx skills add harshsinghmp/muse-skills --skill coach");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
