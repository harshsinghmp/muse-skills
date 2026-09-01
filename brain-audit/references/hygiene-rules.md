# Knowledge Hygiene Rules Reference

## Core Referential Rules

1. **Explicit Relative Paths**: Prefer relative links (`../docs/guide.md`) over absolute paths to ensure portability across different host environments.
2. **Anchor Consistency**: Section anchors (`#when-to-use`) must match GitHub header slugification (lowercase, hyphens, no special characters).
3. **Zero Orphan Invariant**: Every knowledge document in a subfolder must be reachable starting from `README.md`, `llms.txt`, or `.agents/context/index.md`.
4. **Secret Scrubbing**: Zero `sk-*`, `ghp_*`, `npm_*`, or private key tokens in any markdown file or commit message.
