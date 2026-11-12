#!/usr/bin/env bun
/**
 * cut-release — the mechanical half of a release, in one command.
 *
 * The checklist in CONTRIBUTING has nine steps and three of them are pure
 * bookkeeping that has already been missed twice (the installer header still
 * pointing at the previous tag, and a tag cut before `origin/main` had been
 * fetched). This automates everything except judgement:
 *
 *   version bump → changelog stamp → release-notes skeleton → ledger stamp →
 *   gate run → branch, commit, push, PR against main.
 *
 * It stops before the tag: `bun run check:release-ready` guards that step,
 * because the tag must point at the merge on `main`, not at the release branch.
 *
 *   bun run release:cut --minor
 *   bun run release:cut --patch
 *   bun run release:cut --version 9.0.0
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const args = process.argv.slice(2);

function fail(message: string): never {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function run(cmd: string, cmdArgs: string[], allowFail = false): string {
  const result = Bun.spawnSync([cmd, ...cmdArgs], { cwd: ROOT, stdout: "pipe", stderr: "pipe" });
  const out = `${result.stdout.toString()}${result.stderr.toString()}`.trim();
  if (!result.success && !allowFail) fail(`${cmd} ${cmdArgs.join(" ")} failed:\n${out}`);
  return out;
}

function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function write(rel: string, text: string): void {
  fs.writeFileSync(path.join(ROOT, rel), text, "utf8");
}

interface CutState {
  version: string;
  previous: string;
  branch: string;
  done: string[];
}

const STATE_PATH = path.join(ROOT, ".git", "muse-release-cut.json");

function loadState(): CutState | null {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8")) as CutState;
  } catch {
    return null;
  }
}

function saveState(state: CutState): void {
  fs.writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

/**
 * Runs a step once. A failed release keeps its progress, so `--resume` picks up
 * where it stopped instead of rewriting six files from the top — the v8.6.1 cut
 * aborted at the ledger stage with a half-finished tree.
 */
function step<T>(state: CutState, name: string, run: () => T): T {
  if (state.done.includes(name)) {
    console.log(`↩︎  ${name} (already done)`);
    return undefined as T;
  }
  console.log(`▶︎  ${name}`);
  const result = run();
  state.done.push(name);
  saveState(state);
  return result;
}

function bump(version: string, kind: "major" | "minor" | "patch"): string {
  const [major, minor, patch] = version.split(".").map(Number);
  if (kind === "major") return `${major + 1}.0.0`;
  if (kind === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

// ── 0. Arguments and preconditions ───────────────────────────────────────────
const resume = args.includes("--resume");
const existing = resume ? loadState() : null;
if (resume && !existing) fail("no interrupted release to resume (.git/muse-release-cut.json is missing)");
const explicit = args.includes("--version") ? args[args.indexOf("--version") + 1] : "";
const kind = args.includes("--major")
  ? "major"
  : args.includes("--minor")
    ? "minor"
    : args.includes("--patch")
      ? "patch"
      : "";
if (!explicit && !kind && !resume) fail("pass --major, --minor, --patch, or --version X.Y.Z");

if (!resume && run("git", ["status", "--porcelain"]).length > 0) fail("working tree is not clean");
const branch = run("git", ["branch", "--show-current"]);
if (branch !== "dev") fail(`release must be cut from dev (on '${branch}')`);
run("git", ["fetch", "origin", "dev", "--quiet"]);
if (run("git", ["rev-parse", "HEAD"]) !== run("git", ["rev-parse", "origin/dev"])) {
  fail("local dev is not origin/dev — pull or push first");
}

const pkgPath = "package.json";
const pkg = JSON.parse(read(pkgPath)) as { version: string };
const previous = existing?.previous ?? pkg.version;
const version = existing?.version ?? (explicit || bump(pkg.version, kind as "major" | "minor" | "patch"));
if (!/^\d+\.\d+\.\d+$/.test(version)) fail(`'${version}' is not X.Y.Z`);
const tag = `v${version}`;
if (!resume && run("git", ["tag", "-l", tag]) === tag) fail(`tag ${tag} already exists locally`);

const today = new Date().toISOString().slice(0, 10);
const compare = `**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v${previous}...${tag}`;
console.log(`Cutting ${tag} (was v${previous}) on ${today}\n`);

const state: CutState = existing ?? { version, previous, branch: `release/${tag}`, done: [] };
saveState(state);

// ── 1. Branch ────────────────────────────────────────────────────────────────
step(state, "branch", () => {
  if (run("git", ["branch", "--show-current"]) !== `release/${tag}`) {
    run("git", ["checkout", "-b", `release/${tag}`, "dev"], true);
    if (run("git", ["branch", "--show-current"]) !== `release/${tag}`) fail(`could not switch to release/${tag}`);
  }
});

// ── 2. Version surfaces ──────────────────────────────────────────────────────
step(state, "version", () => {
  pkg.version = version;
  write(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  // The installer carries the version in its header, its usage line, and the
  // offline fallback. Replacing the old version everywhere catches all three.
  const installer = read("scripts/install.sh").replaceAll(previous, version);
  write("scripts/install.sh", installer);

  const readme = read("README.md")
    .replaceAll(`Version-${previous}-blue`, `Version-${version}-blue`)
    .replaceAll(`/v${previous}/scripts/install.sh`, `/${tag}/scripts/install.sh`);
  write("README.md", readme);
});

// ── 3. Changelog stamp ───────────────────────────────────────────────────────
step(state, "changelog", () => {
  const changelog = read("CHANGELOG.md");
  if (!changelog.includes("## [Unreleased]")) fail("CHANGELOG.md has no '## [Unreleased]' block");
  const compare = `**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v${previous}...${tag}`;
  const stamped = changelog
    .replace("## [Unreleased]\n", `## [Unreleased]\n\n## [${version}] - ${today}\n`)
    .replace(`\n## [${previous}]`, `\n${compare}\n\n## [${previous}]`);
  write("CHANGELOG.md", stamped);
});

// ── 4. Release notes skeleton ────────────────────────────────────────────────
step(state, "notes", () => {
  const notes = read("RELEASE_NOTES.md");
  const skeleton = `# 🏛️ Muse Skills ${tag} — <one line for humans>

> **<Patch|Minor> release: <what changed and why it matters>.** <N> automated tests. <F> test files. 46 production-grade skills. 462 slash commands per harness. Zero failures. Zero credential leaks.

---

## 🛠️ What Changed in ${tag}

- **<headline>**: <what changed, and the evidence.>

## 📊 Verification

| Metric | v${previous} | ${tag} |
|:---|:---|:---|
| Automated Tests | <n> | **<n>** |
| Test Files | <n> | **<n>** |
| Test Failures | 0 | **0** |
| Secret Leaks | 0 | **0** |

## 🚀 Install

\`\`\`bash
npx skills add harshsinghmp/muse-skills
\`\`\`

${compare}

`;
  write("RELEASE_NOTES.md", skeleton + notes);
});

// ── 5. Docs ledger ───────────────────────────────────────────────────────────
step(state, "ledger", () => {
  const ledger = run("bun", ["skills/core-engine/updatedocs/scripts/updatedocs.ts", ".", "--release", tag], true);
  if (ledger.includes("still owe docs")) {
    // Fail before the slow gate run: an unstamped ledger fails check:ledger and
    // wastes the whole suite. Print exactly what to do instead.
    fail(
      [
        "the docs ledger has pending points — document and mark them, then re-run with --resume:",
        ...ledger.split("\n").filter((line) => line.includes("DP-")),
        "  bun skills/core-engine/updatedocs/scripts/updatedocs.ts . --mark DP-XXXX --audience all --docs CHANGELOG.md,.agents/context/current.md",
        "  bun skills/core-engine/updatedocs/scripts/updatedocs.ts . --release <tag>",
      ].join("\n"),
    );
  }
  // updatedocs writes JSON in its own style; the repo lints with biome.
  run("bunx", ["biome", "check", "--write", ".docs-ledger.json"]);
  console.log("✅ docs ledger stamped");
});

// ── 6. Gates ─────────────────────────────────────────────────────────────────
step(state, "gates", () => {
  console.log("\nRunning gates (this is the slow part)…");
  run("bun", ["run", "verify", "--skip", "deps"]);
  console.log("✅ all gates passed");
});

// ── 7. Commit, push, PR ──────────────────────────────────────────────────────
step(state, "commit", () => {
  run("git", ["add", "-A"]);
  run("git", [
    "commit",
    "-m",
    `chore(release): ${tag}\n\nVersion surfaces pinned across package.json, README badge, installer pin, and\nrelease notes; ledger stamped for ${tag}.`,
    "-m",
    "Co-authored-by: CommandCodeBot <noreply@commandcode.ai>",
  ]);
});

step(state, "push", () => run("git", ["push", "-u", "origin", `release/${tag}`]));

const prBody = `## Release ${tag}

Version pinned across \`package.json\`, README badge, installer fallback ref, and release notes; docs ledger stamped for \`${tag}\`.

**Fill in \`RELEASE_NOTES.md\` before merging** — the skeleton is committed with placeholders, and the tag workflow publishes that section verbatim.

### After the merge

\`\`\`bash
git checkout main && git pull
bun run check:release-ready        # refuses unless HEAD == origin/main and docs agree
git tag -a ${tag} -m "release: ${tag}"
git push origin ${tag}             # the Release workflow attaches checksums.txt
gh release create ${tag} --title "${tag}" --notes-file <(sed -n '/${tag}/,/^# /p' RELEASE_NOTES.md)
bun run release:smoke
\`\`\``;

const pr = step(state, "pr", () =>
  run("gh", ["pr", "create", "--base", "main", "--title", `Release ${tag}`, "--body", prBody]),
);
console.log(`\n${pr}`);
fs.rmSync(STATE_PATH, { force: true });
console.log(`\nNext: fill in RELEASE_NOTES.md, then merge. check:release-ready guards the tag.`);
