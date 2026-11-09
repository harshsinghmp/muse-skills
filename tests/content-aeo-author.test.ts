import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const SCRIPT = path.join(REPO_ROOT, "skills/agency-delivery/content/scripts/aeo-schema.ts");

function schema(args: string[]): { author?: { name?: string } } {
  const res = spawnSync("bun", [SCRIPT, "--generate-schema", "article", ...args], { encoding: "utf8" });
  expect(res.status, res.stderr).toBe(0);
  const start = res.stdout.indexOf("{");
  const end = res.stdout.lastIndexOf("}");
  return JSON.parse(res.stdout.slice(start, end + 1)) as { author?: { name?: string } };
}

describe("content AEO article author", () => {
  test("defaults to Organization instead of a personal name", () => {
    const result = schema(["--title", "Architecture Guide"]);
    expect(result.author?.name).toBe("Organization");
  });

  test("honours the documented --author flag", () => {
    const result = schema(["--title", "Architecture Guide", "--author", "Acme Inc"]);
    expect(result.author?.name).toBe("Acme Inc");
  });

  test("never emits the previous hardcoded personal name", () => {
    const res = spawnSync("bun", [SCRIPT, "--generate-schema", "article"], { encoding: "utf8" });
    expect(res.stdout).not.toContain("Harsh Singh");
  });
});
