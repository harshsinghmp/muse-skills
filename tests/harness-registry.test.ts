import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import {
  commandDestinations,
  harnessesByStatus,
  loadHarnessRegistry,
  validateHarnessRegistry,
} from "../scripts/harness-registry";

const REPO_ROOT = join(import.meta.dir, "..");

describe("harness registry", () => {
  test("harness.json is valid and every harness is fully specified", () => {
    const registry = loadHarnessRegistry();
    expect(validateHarnessRegistry(registry)).toEqual([]);
    expect(registry.harnesses.length).toBeGreaterThanOrEqual(10);
    for (const harness of registry.harnesses) {
      expect(harness.docs.startsWith("https://")).toBe(true);
      expect(harness.skills.length).toBeGreaterThan(0);
    }
  });

  test("command destinations carry the extension their format requires", () => {
    const registry = loadHarnessRegistry();
    const destinations = commandDestinations(registry, { home: "/home/test", workspace: "/work" });
    expect(destinations.length).toBeGreaterThanOrEqual(15);
    for (const destination of destinations) {
      expect(destination.extension).toMatch(/^\.(md|toml|prompt|prompt\.md)$/);
      expect(destination.gate).toBe(join(destination.dir, ".."));
      expect(destination.dir.startsWith("/home/test") || destination.dir.startsWith("/work")).toBe(true);
    }
  });

  test("retired and skills-only surfaces are declared, not implied", () => {
    const registry = loadHarnessRegistry();
    const codex = registry.harnesses.find((harness) => harness.id === "codex");
    expect(codex?.status).toBe("skills-only");
    expect(codex?.commands).toBeNull();
    expect(codex?.retiredPaths).toContain("~/.codex/prompts");

    const gemini = registry.harnesses.find((harness) => harness.id === "gemini");
    expect(gemini?.status).toBe("legacy");
    expect(gemini?.commands?.format).toBe("toml");

    expect(harnessesByStatus(registry, "active").length).toBeGreaterThanOrEqual(8);
    expect(
      harnessesByStatus(registry, "skills-only")
        .map((h) => h.id)
        .sort(),
    ).toEqual(["amp", "antigravity", "codex"]);
  });

  test("the README harness table is generated from the registry", () => {
    const result = spawnSync("bun", ["scripts/sync-harness-docs.ts", "--check"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    expect(result.stdout + result.stderr).toContain("matches harness.json");
    expect(result.status).toBe(0);
  });
});
