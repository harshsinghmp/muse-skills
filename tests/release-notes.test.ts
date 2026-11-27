import { describe, expect, test } from "bun:test";
import { draftReleaseNoteBullets, type ReleaseNotePoint } from "../scripts/release-notes";

const points: ReleaseNotePoint[] = [
  {
    id: "DP-1",
    shortCommit: "aaaaaaa",
    type: "feat",
    scope: "new-project",
    summary: "retry transient clone fetches (#511)",
  },
  {
    id: "DP-2",
    shortCommit: "bbbbbbb",
    type: "fix",
    summary: "already shipped (#500)",
    shipped: true,
  },
];

describe("release note drafting", () => {
  test("drafts pending points and skips shipped points", () => {
    const bullets = draftReleaseNoteBullets(points);
    expect(bullets).toHaveLength(1);
    expect(bullets[0]).toContain("retry transient clone fetches (#511)");
    expect(bullets[0]).toContain("aaaaaaa");
    expect(bullets[0]).toContain("feat(new-project)");
    expect(bullets.join("\n")).not.toContain("already shipped");
  });

  test("returns no bullets when every point is shipped", () => {
    expect(draftReleaseNoteBullets(points.filter((point) => point.shipped))).toEqual([]);
  });
});
