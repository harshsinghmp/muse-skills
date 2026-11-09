#!/usr/bin/env bun
/**
 * check-deps — dependency smoke gate.
 *
 * Fails when a direct dependency is behind the registry, or when the pinned
 * musememory MCP runtime cannot report its version.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const pkg = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8")) as {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
const direct = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);

const outdated = spawnSync("bun", ["outdated"], { cwd: REPO_ROOT, encoding: "utf8", timeout: 60_000 });
if (outdated.status !== 0 && outdated.status !== null) {
  console.error(outdated.stdout || outdated.stderr);
  console.error("❌ bun outdated failed; cannot verify the dependency surface.");
  process.exit(1);
}

const rows = `${outdated.stdout ?? ""}`
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith("| ") && !line.includes("---") && !line.startsWith("| Package"))
  .map((line) =>
    line
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim()),
  )
  .filter((cells) => cells.length === 4)
  .map(([name, current, update, latest]) => ({ name: name.replace(/ \(dev\)$/, ""), current, update, latest }));

const directOutdated = rows.filter((row) => direct.has(row.name));
if (directOutdated.length > 0) {
  console.error("❌ Direct dependencies are behind the registry:");
  for (const row of directOutdated) {
    console.error(`   - ${row.name}: ${row.current} -> ${row.latest}`);
  }
  console.error("   Run `bun update` and re-run the suite, or document a pin rationale.");
  process.exit(1);
}

const musememory = join(REPO_ROOT, "node_modules/.bin/musememory");
if (!existsSync(musememory)) {
  console.error("❌ musememory binary is missing; run `bun install`.");
  process.exit(1);
}
const version = spawnSync(musememory, ["--version"], { encoding: "utf8", timeout: 15_000 });
if (version.status !== 0) {
  console.error(`❌ musememory MCP runtime failed to start: ${version.stderr || version.stdout}`);
  process.exit(1);
}

console.log(`✅ dependencies current; ${version.stdout.trim() || "musememory"} starts cleanly.`);
