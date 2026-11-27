/**
 * release-notes — turn pending docs-ledger points into release-note bullets.
 *
 * The cut already knows what changed: the ledger has one point per commit with
 * the PR summary, type, and scope. Generating the bullets from that data leaves
 * only the human title, blurb, and test counts for the release manager.
 */

export interface ReleaseNotePoint {
  id: string;
  shortCommit: string;
  type: string;
  scope?: string;
  summary: string;
  shipped?: boolean;
}

export function draftReleaseNoteBullets(points: ReleaseNotePoint[]): string[] {
  return points
    .filter((point) => !point.shipped)
    .map((point) => {
      const scope = point.scope ? `(${point.scope})` : "";
      return `- **${point.summary}** (\`${point.shortCommit}\`, ${point.type}${scope}): see the CHANGELOG entry for the detailed evidence.`;
    });
}
