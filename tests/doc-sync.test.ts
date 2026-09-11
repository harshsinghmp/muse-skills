/**
 * Doc-Sync Parity Check — new-project CMS flag list
 *
 * Guards against documentation drift for the `-c, --cms <cms>` flag.
 * The script's usage/help text declares the canonical enumeration of CMS
 * values; `new-project/SKILL.md` and `new-project/README.md` must list the
 * exact same set, and every listed value must be honored by the script —
 * either via a `config.cms === "<value>"` provisioning branch or via the
 * `OFFICIAL_SETUP_CMS` post-scaffold official-setup notice.
 *
 * Run via `bun test` (included in the default suite).
 */
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const SCRIPT_PATH = join(REPO_ROOT, "new-project/scripts/new-project.ts");
const SKILL_PATH = join(REPO_ROOT, "new-project/SKILL.md");
const README_PATH = join(REPO_ROOT, "new-project/README.md");

/** Values declared in the script's help text: `-c, --cms <cms>  CMS: a | b | ...` */
function extractScriptDeclaredCms(source: string): string[] {
  const helpMatch = source.match(/-c,\s*--cms <cms>\s+CMS:\s*([a-z| -]+)/);
  if (!helpMatch) return [];
  return helpMatch[1]
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean)
    .sort();
}

/** Values listed in a doc's `-c, --cms <cms>` flag table row. */
function extractDocCmsValues(docSource: string): string[] {
  // Capture the whole row (cell content contains escaped pipes `\|`).
  const flagRowMatch = docSource.match(
    /^\|\s*`-c,\s*--cms <cms>`\s*\|\s*String\s*\|(.+)\|\s*$/m,
  );
  if (!flagRowMatch) return [];
  return [...flagRowMatch[1].matchAll(/`([a-z-]+)`/g)]
    .map((m) => m[1])
    .sort();
}

function diff(a: string[], b: string[]): string[] {
  return a.filter((v) => !b.includes(v));
}

describe("📄 Doc-Sync Parity — new-project CMS flag list", () => {
  const scriptSource = readFileSync(SCRIPT_PATH, "utf8");
  const skillMd = readFileSync(SKILL_PATH, "utf8");
  const readmeMd = readFileSync(README_PATH, "utf8");
  const declared = extractScriptDeclaredCms(scriptSource);

  it("script help text declares a non-empty CMS enumeration", () => {
    expect(declared.length).toBeGreaterThan(0);
  });

  it("SKILL.md CMS list exactly matches the script's declared enumeration", () => {
    const docValues = extractDocCmsValues(skillMd);
    expect(docValues.length).toBeGreaterThan(0);
    expect(diff(declared, docValues)).toEqual([]);
    expect(diff(docValues, declared)).toEqual([]);
  });

  it("README.md CMS list exactly matches the script's declared enumeration", () => {
    const docValues = extractDocCmsValues(readmeMd);
    expect(docValues.length).toBeGreaterThan(0);
    expect(diff(declared, docValues)).toEqual([]);
    expect(diff(docValues, declared)).toEqual([]);
  });

  it("every declared CMS value is honored by the script (wired branch or official-setup notice)", () => {
    const wired = new Set(
      [...scriptSource.matchAll(/config\.cms === "([a-z-]+)"/g)].map((m) => m[1]),
    );
    const officialSetup = scriptSource.match(
      /const OFFICIAL_SETUP_CMS[^=]*=\s*\{([\s\S]*?)\}/,
    );
    const officialKeys = new Set(
      officialSetup
        ? [...officialSetup[1].matchAll(/^\s*([a-z-]+):/gm)].map((m) => m[1])
        : [],
    );
    const unhandled = declared.filter(
      (v) => !wired.has(v) && !officialKeys.has(v) && v !== "custom" && v !== "none",
    );
    expect(unhandled).toEqual([]);
  });

  it("docs never reference removed CMS integrations (sitepins/pagescms)", () => {
    expect(/sitepins/i.test(skillMd)).toBe(false);
    expect(/pagescms/i.test(skillMd)).toBe(false);
    expect(/sitepins/i.test(readmeMd)).toBe(false);
    expect(/pagescms/i.test(readmeMd)).toBe(false);
  });
});
