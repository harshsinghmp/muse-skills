import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const NOTES_PATH = path.join(REPO_ROOT, "RELEASE_NOTES.md");
const RELEASE_WORKFLOW = path.join(REPO_ROOT, ".github/workflows/release.yml");
const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8")) as { version: string };

describe("release notes publication", () => {
  test("the current version has a curated release-notes section", () => {
    const notes = fs.readFileSync(NOTES_PATH, "utf8");
    const version = pkg.version.replace(/\./g, "\\.");
    const heading = new RegExp(`^# .*Muse Skills v${version} — `, "m");

    expect(heading.test(notes)).toBe(true);
    expect(notes).toContain(`...v${pkg.version}`);
  });

  test("the release workflow publishes RELEASE_NOTES through body_path", () => {
    const workflow = fs.readFileSync(RELEASE_WORKFLOW, "utf8");

    expect(workflow).toContain("Extract release notes for this version");
    expect(workflow).toContain("body_path: release-body.md");
    expect(workflow).not.toContain("body: |");
  });
});
