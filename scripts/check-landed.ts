#!/usr/bin/env bun
// check-landed: Landing Gate verifier.
// Post-merge mode: is HEAD reachable from origin/<branch>?  -> LANDED / LOCAL
// Pre-review mode: is <head> pushed with an open, green PR?      -> REVIEWABLE / NOT REVIEWABLE
import { spawnSync } from "node:child_process";

type Mode = "post-merge" | "pre-review";

const args = new Map<string, string>();
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([^=]+)=(.*)$/);
  if (m) args.set(m[1], m[2]);
  else if (a.startsWith("--")) args.set(a.slice(2), "true");
}

const mode = (args.get("mode") ?? "post-merge") as Mode;
const branch = args.get("branch") ?? process.env.INTEGRATION_BRANCH ?? "dev";
const head = args.get("head") ?? process.env.GITHUB_HEAD_REF ?? "";
const prNumber = args.get("pr") ?? process.env.PR_NUMBER ?? "";

function run(cmd: string, args: string[], env?: Record<string, string>): { code: number; out: string } {
  const r = spawnSync(cmd, args, { encoding: "utf8", env: { ...process.env, ...env } });
  return { code: r.status ?? 1, out: (r.stdout ?? "") + (r.stderr ?? "") };
}

function sha(ref: string): string {
  const r = run("git", ["rev-parse", "--short", ref]);
  return r.code === 0 ? r.out.trim() : "unknown";
}

function table(rows: [string, string][]) {
  console.log("| Field | Value |");
  console.log("| :--- | :--- |");
  for (const [k, v] of rows) console.log(`| ${k} | ${v} |`);
}

if (mode === "post-merge") {
  run("git", ["fetch", "origin", branch, "--quiet"]);
  const headSha = sha("HEAD");
  const intSha = sha(`origin/${branch}`);
  const ancestor = run("git", ["merge-base", "--is-ancestor", "HEAD", `origin/${branch}`]);
  const unpushed = run("git", ["rev-list", "--count", `origin/${branch}..HEAD`]);
  const unpushedCount = unpushed.code === 0 ? unpushed.out.trim() : "?";
  const landed = ancestor.code === 0 && intSha !== "unknown";
  // The PR that most recently carried work onto the integration branch
  // (the state this post-merge gate is judging). `gh pr view <branch>`
  // resolves to an arbitrary head-branch PR — the stale-#146 bug.
  // `gh pr list` feeds jq an array, so the template must iterate with `.[]`.
  const pr = run("gh", [
    "pr",
    "list",
    "--state",
    "merged",
    "--base",
    branch,
    "--limit",
    "1",
    "--json",
    "number,state",
    "-q",
    '.[] | "#\\(.number) \\(.state)"',
  ]);
  table([
    ["Branch + sha", `${process.env.GITHUB_REF_NAME ?? branch} @ ${headSha}`],
    ["Integration branch + sha", `${branch} @ ${intSha}`],
    [
      "Landed? (exact command + exit code)",
      `${landed ? "LANDED" : "LOCAL"} — git merge-base --is-ancestor HEAD origin/${branch} (exit ${ancestor.code})`,
    ],
    ["PR number + state", pr.code === 0 && pr.out.trim() ? pr.out.trim() : "none"],
    ["Unpushed count", unpushedCount],
    ["Gate result", landed ? "LANDED" : "LOCAL"],
  ]);
  process.exit(landed ? 0 : 1);
} else {
  // pre-review
  const requestedHead = head || process.argv.find((a) => a.startsWith("--head="))?.slice(7) || "";
  if (!requestedHead && !prNumber) {
    console.error("pre-review mode requires --pr=<number>, --head=<branch>, or GITHUB_HEAD_REF");
    process.exit(2);
  }
  const ghEnv = { GH_TOKEN: process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "" };
  // Resolve by PR number when supplied: head branch names are ambiguous across forks.
  const prJson = prNumber
    ? run("gh", ["pr", "view", prNumber, "--json", "number,state,headRefName,headRefOid,statusCheckRollup"], ghEnv)
    : run(
        "gh",
        ["pr", "view", requestedHead, "--json", "number,state,headRefName,headRefOid,statusCheckRollup"],
        ghEnv,
      );
  let prState = "none";
  let checksGreen = false;
  let headRef = requestedHead;
  let headSha = "";
  if (prJson.code === 0) {
    try {
      const j = JSON.parse(prJson.out.trim());
      prState = `#${j.number} ${j.state}`;
      headRef = String(j.headRefName ?? requestedHead);
      headSha = String(j.headRefOid ?? "");
      const rollup = Array.isArray(j.statusCheckRollup) ? j.statusCheckRollup : [];
      // Only judge checks that have already concluded; ignore in-progress ones
      // (including this gate's own job) so the gate can run after the others.
      const concluded = rollup.filter((c: Record<string, unknown>) => c.conclusion);
      checksGreen =
        concluded.length > 0 &&
        concluded.every((c: Record<string, unknown>) => {
          const conclusion = String(c.conclusion ?? "").toUpperCase();
          return ["SUCCESS", "NEUTRAL", "SKIPPED"].includes(conclusion);
        }) &&
        concluded.some((c: Record<string, unknown>) => String(c.conclusion ?? "").toUpperCase() === "SUCCESS");
    } catch {
      prState = "parse-error";
    }
  }
  const pushed = headRef ? run("git", ["ls-remote", "--heads", "origin", headRef]) : { code: 1, out: "" };
  const isPushed = pushed.code === 0 && pushed.out.trim().length > 0 && (!headSha || pushed.out.includes(headSha));
  const open = prState.includes("OPEN");
  const reviewable = isPushed && open && checksGreen;
  const headShaDisplay = headSha ? headSha.slice(0, 7) : sha(`origin/${headRef}`);
  table([
    ["Branch + sha", `${headRef || "unknown"} @ ${headShaDisplay}`],
    ["Integration branch + sha", `${branch} @ ${sha(`origin/${branch}`)}`],
    [
      "Landed? (exact command + exit code)",
      `${reviewable ? "REVIEWABLE" : "NOT REVIEWABLE"} — git ls-remote --heads origin ${headRef} (exit ${pushed.code})`,
    ],
    ["PR number + state", prState],
    ["Unpushed count", isPushed ? "0 (pushed)" : "unpushed"],
    ["Gate result", reviewable ? "REVIEWABLE" : "NOT REVIEWABLE"],
  ]);
  process.exit(reviewable ? 0 : 1);
}
