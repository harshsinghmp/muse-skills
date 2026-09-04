# 🐙 Git Skill — Autonomous End-to-End Release & GitHub Lifecycle Engine

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey.svg)](#)

> **Autonomous, vendor-neutral Git and GitHub release orchestrator.** Replaces fragmented, manual scripts with a deterministic 11-phase pipeline: 9-tier anti-slop issue triage, strict 4-phase branching, automated doc sync, GitHub SEO tuning, production release cuts, and branch cleanup.

---

## 📑 Overview

Most AI coding assistants handle git operations naively: committing directly to `master`, creating sloppy unverified pull requests, omitting changelogs, leaving orphaned branches, and ignoring GitHub discoverability.

The **`git`** skill enforces an uncompromising engineering workflow:

```
[ 📋 Issues ] ──► [ 🌿 feat/* ] ──► [ 🧪 Test & Sync ] ──► [ 🔀 PR (dev) ] ──► [ 🚀 release/v* ] ──► [ 🏷️ Tag & Cleanup ]
```

### Key Highlights

- **9-Tier Anti-Slop Triage**: Automatically classify issues (`actionable-bug`, `actionable-feature`, `duplicate`, `generated-slop`, etc.) before writing code.
- **Strict 4-Phase Branch Model**: Protects `master` (production). All work stems from `dev` (`staging`), merges to `dev`, stages via `release/vX.Y.Z`, and back-merges after release.
- **Automated Doc & Changelog Sync**: Triggers `updatedocs` and bumps `CHANGELOG.md` unreleased sections prior to opening PRs.
- **GitHub SEO & Presentation Pass**: Automatically synchronizes repository topics, description, and homepage via `gh repo edit`, while polishing README visual hierarchy.
- **Deterministic Release Cuts**: Bumps SemVer in `package.json`, cuts annotated git tags, drafts GitHub releases, and deletes merged feature branches.

---

## ⚡ Quick Start

Trigger the skill in your AI assistant:

```text
# Run end-to-end release lifecycle for an issue
"Execute git workflow for issue #5"

# Triage incoming issues
"Triage open issues with anti-slop gate"

# Prepare and open PR
"Prepare PR against dev for current branch"

# Cut production release
"Cut production release v1.9.0"

# Sync GitHub SEO and topics
"Sync github topics and repository description"
```

---

## 🏛️ The 11-Phase Lifecycle

1. **Issue Intake & Anti-Slop Triage**: Filter out ungrounded slop or duplicates; capture verifiable reproducer steps.
2. **Feature Branch Creation**: Branch strictly from `dev` (`feat/<issue-id>-<slug>`).
3. **Surgical Implementation & Local Gate**: Apply minimal changes, run `bun test`, static typing, and secret scans.
4. **Documentation Synchronization**: Run `updatedocs` and update `CHANGELOG.md`.
5. **GitHub SEO & Presentation**: Audit topics (`gh repo edit --add-topic`), description, and Open Graph banner.
6. **PR Creation & Review Gate**: Open PR against `dev` with test receipts.
7. **Staging Integration**: Verify CI and merge to `dev`.
8. **Release Preparation**: Cut `release/vX.Y.Z` from `dev`, bump `package.json`, and stamp `CHANGELOG.md`.
9. **Production Merge & Tagging**: Merge into `master` (`--no-ff`), create annotated tag `vX.Y.Z`, and create GitHub release.
10. **Back-Merge**: Merge `master` back into `dev` to keep staging synchronized.
11. **Cleanup**: Delete merged branches locally and remotely; close resolved issues with release receipts.

---

## 📚 References

- [Anti-Slop Issue & PR Triage Guide](references/anti-slop-triage.md)
- [GitHub SEO & Presentation Standards](references/github-seo-and-presentation.md)
- [Branching & Release Matrix](references/branching-and-release-matrix.md)

---

## 📜 License

MIT License. Free to use across all AI coding assistants and agent runtimes.
