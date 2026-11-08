---
name: clean-system-cache
aliases: ["clean-cache","purge-cache","cache-cleaner","disk-cleanup"]
description: "Cross-platform developer, designer, and browser cache cleaner for Windows, Linux, and macOS. Safely purges only unreferenced, dangling, and disposable caches from package managers (uv, npm, bun, pip, pnpm, yarn, cargo, go, dotnet, composer, gradle, brew), IDEs and compilers (xcode, android, vscode, cursor, cypress), containers (docker, podman), creative suites (adobe media cache, photoshop temp, figma, blender, electron), and web browsers (chrome, chromium, brave, edge, firefox, zen, vivaldi, safari). Enforces active running session protection and strict cache-only isolation with zero external runtimes (pure Bash on POSIX, native CMD on Windows)."
argument-hint: "clean cache, free disk space, purge build layers"
user-invocable: true
version: 1.0.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
category: reflection-maintenance
metadata:
  category: reflection-maintenance
  priority: 20
  aliases: ["clean-cache","purge-cache","cache-cleaner","disk-cleanup"]
  suggested_skills: ["audit","periodic-retreat","code-review","gauntlet-loop"]
  hermes:
    tags: [cache, cleanup, disk-space, maintenance, devtools, designer-tools, browser, chrome, firefox, zen, brave, edge, safari, xcode, docker, adobe, figma, blender, windows, linux, macos, bash, cmd]
    related_skills: [audit, periodic-retreat, code-review, gauntlet-loop]
    suggested_skills: [audit, periodic-retreat, code-review, gauntlet-loop]
    requires_tools: [bash, run_command, view_file, write_to_file]
  openclaw:
    category: reflection-maintenance
    suggested_skills: [audit, periodic-retreat, code-review, gauntlet-loop]
    primary_triggers: ["clean system cache","purge developer caches","free up disk space","clean browser cache","purge build cache"]
    requires_tools: [bash, run_command, view_file, write_to_file]
  compatibility: [hermes, openclaw, claude-code, codex, cursor, gemini-cli, opencode]
---

# 🧹 Clean System Cache — Cross-Platform Developer, Designer & Browser Cache Cleaner

> **Aliases**: `clean-cache` | `purge-cache` | `cache-cleaner` | `disk-cleanup`

Safely reclaim tens of gigabytes of disk space by purging **only unreferenced, dangling, and disposable caches** produced by installed developer, designer, and web browser toolchains across **Windows, Linux, and macOS**.

Requires **zero external runtimes** (no Python, no Node, no dependencies):
- **Linux & macOS**: Pure Bash / POSIX (`scripts/clean-cache.sh`)
- **Windows**: Native Command Prompt batch script (`scripts/clean-cache.cmd`)

---

## Modes

Every invocation resolves to exactly one mode. Load **only** the matched reference:

| Mode | Trigger phrases | Behavior | Reference |
| :--- | :--- | :--- | :--- |
| **`audit`** | "cache audit", "inventory caches", "pre-purge audit" | Classify purge candidates safe/protected/ask-first with du-verified reclaim estimates; dry-run only. | [references/audit.md](references/audit.md) |

## When to Use

### Trigger Conditions
Execute this skill when:
1. **Low Disk Space Warnings**: Disk capacity drops below comfortable working thresholds due to accumulated build layers, package archives, or scratch media files.
2. **Dangling Build Layers**: Docker BuildKit layers, Xcode DerivedData, Android build-cache, or Go/Cargo build artifacts consume tens of gigabytes without active references.
3. **Bloated Web Browser Caches**: Google Chrome, Mozilla Firefox, Zen, Brave, or Microsoft Edge disk caches grow to multiple gigabytes of stale HTTP responses.
4. **Stale Designer Scratch Files**: Adobe Premiere, After Effects, Audition (`.cfa` / `.pek` audio peak caches), or Figma desktop app caches lock up storage.
5. **Dormant `node_modules` Directories**: Old, abandoned repository folders hog dozens of gigabytes across user project directories.
6. **Host Vitals & Machine Inventory (`host-vitals`)**: Deterministically inspecting hardware vitals (CPU cores, GPU PCIe bus, kernel version, display resolution, RAM) via `bun skills/reflection-maintenance/clean-system-cache/scripts/host-vitals.ts`.

### Anti-Triggers
Do **NOT** use this skill for:
- Wiping active project code, git histories, or working repository files.
- Cleaning browser cookies, logins, saved passwords, bookmarks, or user profiles (the skill strictly protects them).
- Purging virtual environments (`.venv`) or active Docker containers and volumes.
- Deleting global binary installations (`~/.cargo/bin`, `~/.nvm`, etc.).
- Purging capability-coupled agent caches while sessions are active or offline without rehydration access.

---

## Quick Reference

### 12-Point Cache Architecture Matrix

```
┌─────────────────────────┬────────────────────────────────────────────────────────┐
│ Suite / Category        │ Targeted Cache Layers (Disposable Only)                │
├─────────────────────────┼────────────────────────────────────────────────────────┤
│ 1. Package Managers     │ uv, npm (_npx, _logs), bun, pip, pnpm store, cargo, go │
│ 2. Language Ecosystems  │ dotnet (NuGet locals), composer, gradle, brew cleanup  │
│ 3. Mobile & Apple       │ Xcode DerivedData (macOS), Android build-cache         │
│ 4. IDE Workspace Caches │ VS Code & Cursor stale workspaceStorage audits         │
│ 5. Testing Frameworks   │ Cypress browser binary download cache                  │
│ 6. Containers           │ Docker BuildKit layers (prune -f), Podman build-cache  │
│ 7. Creative Media       │ Adobe Media Cache (.cfa, .pek), Photoshop temp files   │
│ 8. Design Applications  │ Figma desktop asset cache, Blender shader/preview cache│
│ 9. App Frameworks       │ Electron prebuilt binary download caches               │
│ 10. Web Browsers        │ Chrome, Firefox, Zen, Brave, Edge, Vivaldi, Safari     │
│ 11. Agent Toolchains    │ OpenCode, Claude Code, Cursor, Codex, Gemini, Continue │
│ 12. Project Audits      │ Dormant node_modules scanner across project trees      │
└─────────────────────────┴────────────────────────────────────────────────────────┘
```

### Three-Tier Cache Classification

| Tier | Classification | Policy & Invariants |
| :--- | :--- | :--- |
| **T1** | **Regenerable Build Artifacts** | Pure download archives, build layers, compiler caches, and HTTP caches (uv wheels, npm download tarballs, cargo crates, browser cache2). **Safe to purge silently.** |
| **T2** | **Capability-Coupled Caches** | Caches that back live agent capabilities, installed plugin packages, language server binaries, and remote skill payloads (e.g. `~/.cache/opencode/packages`, `~/.cache/opencode/npm`, `~/.cache/claude`, `~/.continue/cache`). **PRESERVED BY DEFAULT.** Purging removes working functionality until network rehydration. Purged ONLY with explicit `--include-coupled` / `/include-coupled` opt-in, and never without emitting a deterministic Rehydration Manifest. |
| **T3** | **Irreplaceable State & Auth** | Session databases, auth/credential stores, configurations, agent cognitive memory (`.memory/**`), sovereign configs (`~/.memory/` and `~/.config/muse/`), and git repositories. **NEVER TOUCHED UNDER ANY CIRCUMSTANCES.** |

### Confirmation-Gated Risk Categories (Class A vs. Class B)

Confirmation-gated candidates are explicitly partitioned into two risk classes before any interactive prompt or deletion:

| Risk Class | Description & Consequence | Candidates & Examples | Policy & Automation |
| :--- | :--- | :--- | :--- |
| **Class A: Regenerable System & Tool Caches (Moderate Risk)** | Safe to delete; toolchains will automatically regenerate or re-download assets on demand. | Dormant project builds (`.next`, `.turbo`, `__pycache__` / `pycache`), package archives (`/var/cache/pacman/pkg`, `/var/cache/apt/archives`), Go modcache (`$GOPATH/pkg/mod`), stale `/tmp` entries, Flatpak HTTP caches. | Sequential interactive confirmation (`[Y]es / [N]o / [S]kip / [B]rowse`). Decisions (`allow` / `deny`) can be recorded in `learned.conf` to avoid repetitive prompts on future runs. |
| **Class B: HIGH-RISK / Non-Regenerative User Data (CRITICAL DANGER)** | **Permanent data loss.** Cannot be rebuilt by compilers, package managers, or browser caches. Deleting permanently destroys unrecoverable personal files, transcripts, or state. | **Downloads** (`~/Downloads` / `%USERPROFILE%\Downloads`), **Local Assistant Sessions & Cognitive State** (`token-optimizer/sessions`, `opencode/snapshot`, undo trees, checkpoint databases), **Trash / Recycle Bin** (`~/.local/share/Trash`, `$Recycle.Bin`), **Config Backups & Sovereign State** (`*-backup*` profile lowerdirs, state dumps). | **Strictly manual on every run.** Agent & CLI default to "KEEP". Never bundled into default sweeps. NEVER recorded in `learned.conf`. Requires mandatory hazard alert. |

#### Mandatory Hazard Alert for Class B Items
Whenever presenting Class B items in interactive CLI or agent dialogue, the following warning must be printed:

> ⚠️ **CRITICAL: IRREVERSIBLE DATA LOSS**
> This path contains non-regenerative user data. Deleting it will permanently destroy your files/transcripts with no recovery mechanism. This cannot be rebuilt by compilers, package managers, or browser caches.

### Safety & Running Session Protection Contracts

| Protected Area | Skill Invariant |
| :--- | :--- |
| **Active Browser Sessions & Live Tabs** | **PROTECTED.** Process detection checks if any browser is running (`pgrep` / `tasklist`). Active sessions are skipped in execution mode so running tabs and websockets are never disrupted. |
| **Active Agent Runtime Sessions** | **PROTECTED.** Process detection checks running agents (`opencode`, `claude`, `cursor`, `code`, `gemini`, `codex`, `continue`, `aider`). Running agent sessions are skipped in execution mode to prevent dropping live tools or skills mid-task. |
| **T2 Capability-Coupled Caches** | **PRESERVED BY DEFAULT.** Plugin packages, language servers, MCP schemas, and downloaded skill trees are preserved. Only purged with explicit `--include-coupled` / `/include-coupled` opt-in and an accompanying Rehydration Manifest. |
| **T3 Agent Memory, Auth & State** | **NEVER TOUCHED.** Credentials (`~/.claude/settings.json`, `~/.gemini/settings.json`), session databases, agent memory (`.memory/**`), sovereign configs (`~/.memory/USER.md`, `~/.config/muse/`), and conversation histories are strictly forbidden. |
| **Browser Cookies, Passwords & History** | **NEVER TOUCHED.** Purges purely disposable HTTP cache (`Cache_Data`, `cache2/entries`). User profiles, cookies, logins, and bookmarks remain 100% intact. |
| **Project Repositories & Source Code** | **NEVER TOUCHED.** Does not alter active git working directories or files. |
| **Virtual Environments (`.venv`)** | **PRESERVED.** Cleans package download wheels only; never touches virtual environments. |
| **Active Containers & Volumes** | **PRESERVED.** Prunes dangling build layers only; active containers, images, and volumes are untouched. |
| **Installed Global Binaries** | **PRESERVED.** Binaries in `~/.cargo/bin`, `~/.nvm`, `%APPDATA%`, etc. are never touched. |

---

## Interactive Confirmation & Risk Tiering Protocol

### 1. Interactive Selection UX (Agent & CLI)
- **Multi-Select or Sequential Confirmation**:
  - In agent-driven environments (e.g., ACP, T3, Claude, Gemini, Cursor, OpenCode), the skill must either present items in a structured multi-select prompt or sequentially iterate through candidates one by one with a clear `[Y]es / [N]o / [S]kip / [B]rowse` choice.
  - The agent must NEVER assume consent, bundle non-cache items into a default sweep, or present a bulk "delete all" toggle for confirmation-gated items.
  - The CLI interactive mode (`--interactive` / `/interactive`) must display clear risk tiers before prompting for confirmation.
- **Action Options**:
  - `[Y]es`: Proceed with item removal.
  - `[N]o`: Reject and skip item.
  - `[S]kip`: Pass without decision (remains for next run).
  - `[B]rowse`: Inspect directory or file contents before making a decision.

### 2. Agent Protocol & Invariants
AI agents running this skill must strictly enforce:
1. **Default to "KEEP" for all Class B non-regenerative items**: Never suggest, pre-select, or default to deleting Downloads, assistant sessions, Trash, or config backups.
2. **Quote exact paths, sizes, and explicit consequences for every item before prompting**: Never generalize with "clean temporary files". Quote the exact path (e.g. `~/Downloads`), the du-verified size (e.g. `2.4 GB`), and the consequence.
3. **Proactively warn users before touching any directory outside standard disposable cache patterns**: Any path outside standard disposable cache patterns (`~/.cache/*` or app-specific `Cache_Data`/`GPUCache`) requires proactive hazard disclosure.
4. **Record user choices (`allow` / `deny`) in `learned.conf` only for regenerable caches**: Record choices in `~/.config/clean-system-cache/learned.conf` strictly for Class A items. Keep dangerous Class B non-regenerative items strictly manual on every run.

---

## Procedure

### Phase 1: Pre-Flight Inspection & Capability Inventory (Dry Run)
Before modifying disk contents, run an inspection to calculate reclaimable space and verify live capability counts:

- **Linux & macOS**:
  ```bash
  clean-system-cache/scripts/clean-cache.sh --dry-run
  ```
- **Windows CMD**:
  ```cmd
  clean-system-cache\scripts\clean-cache.cmd /dry-run
  ```

### Phase 2: Safe Default Cache Execution (T1 Only)
Execute full cleanup across all installed tools. T2 capability-coupled caches are automatically preserved:

- **Linux & macOS**:
  ```bash
  clean-system-cache/scripts/clean-cache.sh
  ```
- **Windows CMD**:
  ```cmd
  clean-system-cache\scripts\clean-cache.cmd
  ```

### Phase 3: Opt-in Capability Purge (`--include-coupled`)
When disk capacity requires purging capability-coupled caches, use the explicit opt-in flag. Running sessions remain guarded, and a deterministic Rehydration Manifest is printed:

- **Linux & macOS**:
  ```bash
  clean-system-cache/scripts/clean-cache.sh --include-coupled
  ```
- **Windows CMD**:
  ```cmd
  clean-system-cache\scripts\clean-cache.cmd /include-coupled
  ```

### Phase 4: Targeted Subsystem Purging
Target specific subsystems (e.g. only browsers, agent runtimes, or package managers):

- **Web Browsers Only**:
  ```bash
  clean-system-cache/scripts/clean-cache.sh --tool browser
  ```
- **Agent Runtimes Only**:
  ```bash
  clean-system-cache/scripts/clean-cache.sh --tool agents
  ```
- **Specific Tools**:
  ```bash
  clean-system-cache/scripts/clean-cache.sh --tool uv,npm,firefox,zen,docker,adobe
  ```

### Phase 5: Dormant `node_modules` Audit
Scan project directories for abandoned node_modules folders consuming massive disk space:

- **Linux & macOS**:
  ```bash
  clean-system-cache/scripts/clean-cache.sh --scan-node-modules ~/Projects
  ```
- **Windows CMD**:
  ```cmd
  clean-system-cache\scripts\clean-cache.cmd /scan-node-modules C:\Projects
  ```

### Phase 6: Interactive Confirmation & Risk-Gated Purging (`--interactive`)
Interactively review and confirm confirmation-gated candidates with risk tiering (Class A & Class B) and `learned.conf` preference tracking:

- **Linux & macOS**:
  ```bash
  clean-system-cache/scripts/clean-cache.sh --interactive
  ```
- **Windows CMD**:
  ```cmd
  clean-system-cache\scripts\clean-cache.cmd /interactive
  ```

---

## Pitfalls

- **The 2026-10-08 OpenCode Capability Loss Incident**: Purging `~/.cache/opencode/packages/*` and `~/.cache/opencode/npm/*` reclaimed ~2.5 GB, but deleted installed plugin payloads and language servers, stripping skills (`simplify`, `codemap`, `deepwork`, etc.) mid-session until an unannounced 550 MB re-download. Reinstallable $\neq$ disposable. The cleaner must preserve T2 capability caches by default, guard active runtimes, and provide explicit rehydration manifests.
- **Never Clean Caches of Actively Running Browsers or Agents**: Attempting to purge active browser or agent files can crash open tabs, invalidate websockets, or kill language servers mid-session. The script automatically guards against this by checking running processes.
- **Never Touch Profile or State Directories**: Cookies, sessions, bookmarks, passwords, and agent cognitive memories live in `~/.mozilla`, `~/.config`, `~/.claude`, `.memory/**`, `%APPDATA%`, and `~/Library/Application Support/`. Never delete these directories.
- **Never Assume Python or External Interpreters**: Developer machines may have corrupted Python or node runtimes; cache cleaners must run on native shell (`bash` on POSIX, `cmd` on Windows).
- **Never Prune Active Docker Images or Named Volumes**: Only prune dangling build layers (`docker builder prune -f`), never containers or database volumes.

---

## Verification

Before marking cleanup complete, verify:
1. `clean-cache.sh --dry-run` or `clean-cache.cmd /dry-run` executes without errors.
2. Only disposable cache directories were targeted; T2 capability caches were preserved unless `--include-coupled` was explicitly passed.
3. **Capability Inventory Snapshot & Diff Contract**: Capability count before and after default cleanup matches identically (`count_after == count_before`), guaranteeing zero skill regressions.
4. Active browser and agent sessions were protected and skipped if running.
5. User cookies, credentials, agent memory, and repository code remain 100% intact.
6. Disk free space increased as reported by `df -h` or `dir`.
7. Interactive confirmation mechanism was honored: Class B non-regenerative items defaulted to KEEP with high-visibility hazard alerts.
8. User choices (`allow` / `deny`) recorded in `learned.conf` strictly for Class A regenerable caches, while Class B items remained strictly manual on every run.
9. Confirmation-gated candidates were never bundled into default non-interactive cache sweeps.
