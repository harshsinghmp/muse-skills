# 📜 Changelog Policy & Versioning Standards

Rules for updating, structuring, and maintaining project changelogs without introducing historical distortion or commit noise.

---

## 1. Core Principles

- **Human-Curated Summaries**: A changelog is written for humans, not machines. It must describe the functional and consumer-facing impact of changes, not echo raw Git commit logs.
- **Strict Historical Preservation**: Never edit, rewrite, reorder, or delete past release sections. History remains immutable once tagged.
- **No Fabricated Metadata**: Never guess or invent upcoming version numbers, release dates, release tags, or GitHub release URLs without explicit evidence or confirmation.
- **Documentation Sync Boundary**: Documentation synchronization does NOT itself imply a changelog entry. Only document changes that represent meaningful project changes according to the changelog policy. Avoid changelog noise from routine documentation-only corrections unless the project explicitly tracks documentation changes.
- **Release-State Awareness**:
  - **Working Tree / Unreleased Changes**: Must always be placed under an `## [Unreleased]` header.
  - **Tagged Releases**: Only move items from `[Unreleased]` into a concrete version header (`## [1.2.0] - YYYY-MM-DD`) when executing a confirmed release.

---

## 2. Standard Changelog Categories

Categorize all notable changes using these standard Keep a Changelog categories in this exact order:

```markdown
### Added
- For new user-facing features, endpoints, components, or CLI commands.

### Changed
- For changes in existing functionality, modified API contracts, updated defaults, or upgraded dependencies.

### Deprecated
- For soon-to-be-removed features or APIs to notify consumers in advance.

### Removed
- For now-removed features, dropped configurations, or deleted legacy endpoints.

### Fixed
- For any bug fix, error resolution, or regression remediation.

### Security
- For vulnerability fixes, updated encryption, credential isolation improvements, or security boundary enhancements.
```

---

## 3. Entry Structure & Writing Rules

Every bullet in a changelog section should follow this format:

```markdown
- **<Scope / Feature Name>**: <Concise imperative summary explaining the change and why it matters to consumers>. [Optional link to issue/PR/spec].
```

### Good vs. Bad Changelog Entries:

| ❌ Anti-Pattern (Raw Git Noise) | ✅ High-Signal Entry |
|:---|:---|
| `- fix typo in utils.ts (3fa49b1)` | *(Omit entirely if internal / no consumer impact)* |
| `- update stuff` | `- **Auth Middleware**: Fixed token expiration handling to return 401 Unauthorized instead of 500.` |
| `- added new flags and refactored everything` | `- **CLI**: Added \`--dry-run\` and \`--json\` output flags for automated CI pipelines.` |
| `- bump version to 2.0.0 (unreleased)` | *(Leave under \`## [Unreleased]\` until formal release)* |
| `- Updated docs / Fixed typo in README` | *(Omit documentation-only noise unless project explicitly tracks doc changes)* |
