import { describe, expect, test } from "bun:test";
import { checkReleaseReady, type ReleaseFacts } from "../scripts/check-release-ready";

const GREEN: ReleaseFacts = {
  tag: "v9.0.0",
  head: "a1b2c3d4e5f6",
  main: "a1b2c3d4e5f6",
  localTagExists: false,
  remoteTagExists: false,
  packageVersion: "9.0.0",
  changelogHeading: true,
  notesHeading: true,
  notesCompareLink: true,
  ledgerTag: "v9.0.0",
};

describe("release preflight", () => {
  test("a consistent release passes", () => {
    expect(checkReleaseReady(GREEN)).toEqual([]);
  });

  test("a tag on a commit that is not origin/main is refused", () => {
    // The v8.6.0 mistake: the tag was created against a stale origin/main.
    const issues = checkReleaseReady({ ...GREEN, head: "ffffffffffff" });
    expect(issues).toHaveLength(1);
    expect(issues[0]).toContain("not origin/main");
  });

  test("an existing tag is refused on either side", () => {
    expect(checkReleaseReady({ ...GREEN, localTagExists: true })[0]).toContain("locally");
    expect(checkReleaseReady({ ...GREEN, remoteTagExists: true })[0]).toContain("remote");
  });

  test("version surfaces must agree", () => {
    expect(checkReleaseReady({ ...GREEN, packageVersion: "8.6.0" })[0]).toContain("package.json");
    expect(checkReleaseReady({ ...GREEN, ledgerTag: "v8.6.0" })[0]).toContain("docs ledger");
    expect(checkReleaseReady({ ...GREEN, changelogHeading: false })[0]).toContain("CHANGELOG");
    expect(checkReleaseReady({ ...GREEN, notesHeading: false })[0]).toContain("RELEASE_NOTES");
    expect(checkReleaseReady({ ...GREEN, notesCompareLink: false })[0]).toContain("compare link");
  });

  test("the tag must be semver", () => {
    expect(checkReleaseReady({ ...GREEN, tag: "9.0.0" })[0]).toContain("vMAJOR.MINOR.PATCH");
  });

  test("an unresolved remote ref is reported rather than assumed", () => {
    expect(checkReleaseReady({ ...GREEN, main: "" })[0]).toContain("git fetch");
  });
});
