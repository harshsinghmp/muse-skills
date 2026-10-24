---
name: sync-engine-safety
description: "Use when editing a scaffolder/sync engine's re-run writes."
version: 1.1.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [scaffolding, idempotency, generators, sync, safety, maintenance]
    related_skills: [systematic-debugging, updateagents, new-project, updatedocs]
---

# Sync-Engine Safety

For the class of task: **changing a scaffolder / synchronizer / provisioner that writes into a project it does not own** — `updateagents`, `new-project`, a dotfile installer, a codegen/migration CLI, a config-sync tool. Such an engine runs many times over a project's life, so every write must be classified as *first run* or *re-run* before it happens.

Running one of these tools is a different skill (e.g. `updateagents`). This one governs **editing** it. Extending the generated surface such an engine produces (new modes/references/commands across a corpus) has its own procedure and pitfalls: [references/mode-surface-extension.md](references/mode-surface-extension.md).

## When to Use

- You are changing the write/skip logic of a scaffolder, provisioner, or sync CLI that runs repeatedly against a project it does not own.
- A re-run of such a tool recreates, overwrites, or re-ingests something it should have left alone.
- You widened a guard and pre-existing tests went red.
- The unit suite is green but you need proof the shipped behaviour actually changed.

## The Four Invariants

### 1. Additive assets belong to the first run, not to every run
Community/governance files, changelogs, example configs, boilerplate templates: provision them when the project is **new**, and never re-provision them into an established project. A plain re-run must never recreate a file the user deliberately deleted.

- Gate on `explicit-scaffold-flag || <fresh container>`, not on the flag alone. Flag-only gating breaks the legitimate case the tests encode: a brand-new project provisioned by a plain first sync.
- Pass the decision to the write site as an explicit hint (e.g. `communityAssets?: boolean`) rather than letting the write site guess.
- Thread that hint through **every** call site of that write function — grep the function name, not the line you were reading. A hint passed to the primary path but not to the interactive/retry/fallback path leaves the second path silently on the old default.

### 2. Curated output outranks canon
When the engine ships a *canonical* copy of a file the project is expected to own and edit (standards, rulebooks, config):

- container does not exist yet → materialize the full canon;
- container exists, file exists and differs → **report the divergence, write nothing**;
- container exists, canon file missing → skip unless explicitly scaffolding, so unrelated canon (WordPress/fintech guidance in a project using neither) is never injected;
- explicit `--force` → overwrite, with an explicit modification log.

Silently overwriting a curated file is unrecoverable data loss, not a sync. Report with distinct counters (`N curated`, `N not applicable`, `N written`) so the user can see what was respected.

### 3. Never let a generated file become an input
A file the engine itself writes into a project is a **destination**, never a source to re-ingest. Importing it duplicates itself: the copy then masquerades as user-authored content and leaves byte-identical snapshots in the archive.

- Classify via *any* marker the engine installs — a hand-edited file loses the explicit marker but keeps the sentinels the engine injected, so checking only the explicit marker re-imports it on every run.
- Do not ship an escape hatch (`--force`, `includeManagedRoot`) that reclassifies managed output as legacy input. Delete the flag rather than defaulting it off; a defaulted-off flag gets re-wired later.
- Hand-written files with no engine marker *are* genuine legacy sources and must still be migrated. Check both directions with a real fixture for each.

### 4. Key freshness on PRE-RUN state
Capture `exists()` results once, during discovery, and use those constants everywhere downstream. An `existsSync` evaluated at the point of use sees directories the same run just created: a fresh project then looks established and the engine provisions nothing — while a test that scaffolds an empty directory can still pass because it asserts a different path.

## Procedure

1. **Read the tests as the spec first.** Existing tests encode the contracts the guards must preserve (fresh-project provisioning, legacy-file migration, idempotent second runs). Widen a guard only after you know which behaviours they pin.
2. **Establish a clean-tree baseline.** Before attributing red tests to your change: `git stash push -m wip-baseline-probe && <the failing tests>; git stash pop`. Red on the clean tree = inherited failure, not yours; green = you broke a contract, so the guard is too broad. Never weaken the test to match new behaviour.
3. **Find the write site, then the classification it needs.** Grep for the copy/write call and ask what distinguishes first-run from re-run there. Remove dead flags and dead parameters in the same change so the old path cannot be re-created.
4. **Verify on the real CLI, not only in unit tests.** A green suite can coexist with a broken engine. Run the binary against throwaway directories covering three shapes — fresh, established, established-after-a-hand-edit — and read the artifacts on disk (`scripts/probe-engine-reruns.sh` is a starting harness).
5. **Run a negative control.** Stash your edits, reproduce the pre-fix behaviour in a second temp dir, `git stash pop`. This proves the change moved the outcome instead of the bug having been absent already.
6. **Make reported numbers real — and pin them to the generator.** Derive published counts from writes actually performed; never compute a displayed "N written" by subtracting unrelated list lengths. A count or claim a human maintains beside a generated artifact (catalog totals, per-item mode counts) drifts the moment the generator or its input changes: add a test asserting `claim === generatorOutput` (both reading the same source) so drift fails CI instead of shipping.

## Pitfalls

- **A guard that is too broad reads as "the tests are wrong".** It is not: the tests are the contract. Re-read them before accepting that a pre-existing test must change.
- **Fixture shape ≠ live shape.** Run the classifier against the real artifact it must classify, not only against fixtures: import the exported predicate and print its verdict on the live file **and** on a synthetic counter-example, in both directions (`bun -e 'import {isManaged} from "<engine>"; console.log(isManaged(readFileSync("<live-file>","utf8")), isManaged("# hand-written fixture"))'`). Fixtures drift toward the shape the classifier already handles — the live root file carried the engine's router sentinels but not the explicit managed marker while every fixture carried the marker, so the gap was invisible to the suite.
- **The same asset is usually written by two paths.** Scaffold-time and sync-time (first-run and retrofit) each tend to grow their own copy loop for the same destination directory. Grep for the **destination**, not the function you were reading, and fix every writer — the one you did not open still runs on the path you did not test.
- **State created earlier in the same run is not "pre-existing".** Verify freshness constants are captured before the first write.
- **Idempotency is a symmetry property: test the second run, not just the first.** Most of these regressions only appear on run #2.
- **Enumerate a definition's coverage before making it authoritative.** Before changing what a generator treats as X (a mode, an asset, a managed file), check the new definition against every input, not the samples you opened: a rule that held for everything you read was absent from over a third of the corpus, and enforcing it converted working entries into regressions.
- **A regenerate-and-compare drift gate proves byte-sync only.** When the gate rebuilds the artifact from its own source and diffs, both sides share the generator's definition, so it stays green while two consumers disagree about what the term means. Gate against an independent definition (the consuming contract) or state plainly that the gate covers byte-sync alone.
- **Reconcile counts against the artifact, not a proxy.** A directory listing, a curated table, and a published claim are three different hypotheses about the same corpus; before editing from any of them, read the actual artifact behind each mismatch and classify it — alternate row formats (leading double pipe, backticked cells) turn parser false negatives into phantom mismatches.
- **Bulk-normalizing authored docs: restrict the transform to provably lossless operations.** Rewriting table bodies across a corpus (merging rows, appending links, demoting sections) fabricated dead links and duplicated rows within two iterations even with per-run verification; a transform limited to renaming one heading line and inserting generated sections into files that lacked them is idempotent and lossless by construction. Ship the conservative version; leave per-file enrichment to per-file authored changes.
- **Word-boundary every content-matching selector.** A heading regex matching `mode` also matches `Model` and singular `Mode A:` subsections — match `\bmodes?\b` against real corpus headings and print every match it fires on before writing anything.
- **Verify a mass transform with an independent pass, not by rerunning it.** After the transform, run a separate read-only checker (phantom links, duplicate rows, frontmatter integrity, sentinel lines still present) over the result; the transform reporting success proves nothing — its own parser shares its own bugs.
- **Verify the current branch before any write, amend, or push.** `git checkout` can silently fall through to `dev` when the target is missing; confirm with `git branch --show-current` immediately before committing, amending, or pushing. A merge/amend/tag created on the wrong branch is recoverable but wastes a release cycle; an annotated tag push also carries the tagger's email, so the committer identity rule (noreply) applies to tags too.

## Verification

```bash
# three shapes + artifact readout (adapt the artifact paths inside for your engine)
bash scripts/probe-engine-reruns.sh path/to/engine.ts
```

Success criteria: fresh dir fully provisioned; second run on an established dir rewrites nothing and reports divergence; curated files byte-identical afterwards; generated files absent from the engine's own input manifest; every published count matches what is on disk.
