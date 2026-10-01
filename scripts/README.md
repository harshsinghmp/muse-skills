# 🛠️ Internal Engineering & Reporting Tooling

A curated suite of development utilities, synchronization scripts, and interactive HTML report generators supporting the `muse-skills` ecosystem.

---

## 📊 1. Agency Report Generation Tooling

All reporting scripts in this directory are active tools for producing standalone, interactive HTML deliverables, executive shift summaries, and client audit presentations.

| Script | Output / Flavor | Execution Command | Description |
|:---|:---|:---|:---|
| `gen-report-template.ts` | Clean Canonical HTML Work Report | `bun scripts/gen-report-template.ts` | Standard single-file HTML report with dark mode, collapsible milestones, and verification checklists. |
| `gen-clay-interactive.ts` | Clay Design System Interactive Report | `bun scripts/gen-clay-interactive.ts` | Interactive tactile report with live filtering, metric charts, and reactive milestone cards. |
| `gen-clay-hybrid.ts` | Hybrid Executive Summary + Deep-Dive | `bun scripts/gen-clay-hybrid.ts` | Dual-audience view: executive KPI summary up front with full technical audit logs below. |
| `gen-clay-presets.ts` | Multi-theme Clay UI Presets | `bun scripts/gen-clay-presets.ts` | Generates thematic styling variations (Obsidian, Midnight, Slate, Emerald). |
| `gen-report-variants.ts` | Variant Theme Generator | `bun scripts/gen-report-variants.ts` | Generates branded variations for client-tailored report delivery. |

> 📖 **Delivery Contracts**: See [`skills/core-engine/git/references/report-template.md`](../skills/core-engine/git/references/report-template.md) for full report formatting contracts and HTML delivery standards.

---

## ⚙️ 2. Core Repository Utilities

| Script | Purpose | Execution Command |
|:---|:---|:---|
| `export-commands.ts` | Exports slash commands to OpenCode, Antigravity, Windsurf, and Cursor | `bun scripts/export-commands.ts` |
| `sync-dispatch.ts` | Synchronizes `secretary/references/dispatch.md` with `skills.json` | `bun scripts/sync-dispatch.ts` |
| `secret-scan.ts` | Scans workspace for potential credential leaks and raw tokens | `bun scripts/secret-scan.ts` |
| `extract-skill.ts` | Extracts and packages modular skills according to RFC standards | `bun scripts/extract-skill.ts` |
