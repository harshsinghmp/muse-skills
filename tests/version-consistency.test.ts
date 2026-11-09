import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(REPO_ROOT, file), "utf8");
const pkg = JSON.parse(read("package.json")) as { version: string };
const version = pkg.version;

describe("release version consistency", () => {
  test("package, README badge, and installer pin the same version", () => {
    const readme = read("README.md");
    expect(readme).toContain(`Version-${version}-blue`);
    expect(readme).toContain(`/v${version}/scripts/install.sh`);

    const installer = read("scripts/install.sh");
    expect(installer).toContain(`raw.githubusercontent.com/harshsinghmp/muse-skills/v${version}/scripts/install.sh`);
    expect(installer).toContain(`MUSE_SKILLS_REF="\${MUSE_SKILLS_REF:-v${version}}"`);
  });

  test("the current version has a curated release-notes section", () => {
    const notes = read("RELEASE_NOTES.md");
    const escaped = version.replace(/\./g, "\\.");
    expect(new RegExp(`^# .*Muse Skills v${escaped} — `, "m").test(notes)).toBe(true);
    expect(notes).toContain(`...v${version}`);
  });

  test("the docs ledger is stamped for this version", () => {
    const ledger = JSON.parse(read(".docs-ledger.json")) as { watermark?: { releaseTag?: string } };
    expect(ledger.watermark?.releaseTag).toBe(`v${version}`);
  });

  test("the installer verifies against a release checksum asset", () => {
    const installer = read("scripts/install.sh");
    expect(installer).toMatch(/releases\/download\/\$\{MUSE_SKILLS_REF\}\/checksums\.txt/);
    expect(installer).toContain("source-commit");
    expect(installer).toContain("MUSE_SKILLS_ALLOW_UNVERIFIED");

    const release = read(".github/workflows/release.yml");
    expect(release).toContain("checksums.txt");
    expect(release).toContain("printf '%s  source-commit");
    expect(release).toContain("files: checksums.txt");
  });
});
