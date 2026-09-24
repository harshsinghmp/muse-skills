# 🛡️ muse-skills Safety & Continuity Hooks

> **The PAS Framework for Agent Guardrails**: Problem, Agitation, and Definitive Solution.

Autonomous AI coding agents operate at superhuman speed, but without strict environmental guardrails, speed turns into liability. These 15 lightweight, zero-dependency shell hooks provide the passive safety net your coding agents need to build fearlessly.

---

## ⚠️ The Problem & Agitation

### The Problem
When autonomous agents run in production repositories without guardrails, four catastrophic failure modes routinely occur:
1. **Accidental Credential Exposure**: An agent casually commits `.env`, private keys, or API tokens (`sk-*`, `ghp_*`) into public or shared git history.
2. **Worktree Race Conditions**: Two parallel agent sessions in the same clone mutate branches and stashes simultaneously, clobbering uncommitted work.
3. **Context Eviction on Crash**: An agent terminal crashes or closes mid-task, wiping active progress and forcing the developer to reconstruct context manually.
4. **Silent Manifest Drift**: Skills or modes are added, but manifests (`skills.json`, `llms.txt`, `dispatch.md`) are never updated, blinding downstream agents.

### The Agitation
A single leaked secret can trigger security revocations, cloud bills, and client breaches. A clobbered branch destroys hours of engineering effort. And an agent claiming code works without running tests pushes broken builds straight to CI.

---

## ⚡ The Solution: 15 Fail-Closed Safety Hooks

The `muse-skills` hook suite runs passively at the git and agent harness lifecycle layers. 

**Operating Principles**:
- **Fail-Closed & Advisory**: Hooks log high-visibility warnings and reminders without forcibly crashing or freezing the agent.
- **Zero External Dependencies**: Pure POSIX/Bash scripts—no Node/Python runtime required for git-level hooks.
- **Vendor-Neutral Portability**: Installs automatically into any detected harness (.git, OpenCode, Antigravity, Cursor, Windsurf, Hermes, Claude Code).

---

## 📋 Complete Hooks Catalog (15 Total)

| # | Hook | Trigger Event | Target Layer | Deterministic Behavior |
|:---|:---|:---|:---|:---|
| 1 | `gen-repo-report-on-close.sh` | session end | all | Automatically archives session HTML report into `.agents/archive/reports/` |
| 2 | `secret-scan-pre-commit.sh` | git pre-commit | git-native | Scans staged diffs for credential patterns (`sk-*`, `ghp_*`, private keys) and warns before commit |
| 3 | `worktree-lease-check.sh` | git branch ops | git-native + coupling-router | Probes `WORKTREE-LEASE.md` before branch switches to prevent multi-agent collisions |
| 4 | `audit-quick-on-skill-use.sh` | post-skill execution | all | Verifies the invoked skill's `SKILL.md` contains an executable `## Verification` section |
| 5 | `sync-registry-on-skill-add.sh` | post-skill-install | all | Runs `sync_registry.py` and `sync-dispatch.ts` to sync `skills.json`, `llms.txt`, `README.md`, `dispatch.md`, and harness commands |
| 6 | `stale-frontmatter-check.sh` | post-merge, post-commit | git-native | Audits byte-parity and frontmatter drift between `SKILL.md` and `skills.json` |
| 7 | `pre-push-test-gate.sh` | git pre-push | git-native | Verifies that `bun test` is green before pushing to remote branches |
| 8 | `session-resume-probe.sh` | session start / entry | all | Probes `HANDOFF.md` for `relay` ambient continuity and displays previous session state |
| 9 | `context-switch-snapshot.sh` | context-anchor switch | all | Prompts the agent to snapshot anchor state before switching workstreams |
| 10 | `evidence-decision-sync.sh` | evidence-ledger commit | all | Recommends running `updatedocs change` if a recorded decision impacts documentation |
| 11 | `gauntlet-closeout.sh` | gauntlet-loop close | all | Confirms `ACCEPTANCE_PACKET.md` exists and prints final gauntlet verification score |
| 12 | `dead-letter-nightly.sh` | scheduled / manual | all | Scans unhandled failure logs and recommends running `dead-letter status` |
| 13 | `cache-pressure-check.sh` | periodic / pre-build | all | Monitors disk pressure and triggers `clean-system-cache` when disk space < 10GB |
| 14 | `taste-observer.sh` | session end / feedback | all | Passively extracts user corrections and stylistic preferences into the Taste Engine |
| 15 | `install-hooks.sh` | manual install | all | Detects active agent runtimes and installs hooks into existing harness directories |

## Auto-detection table

The install script detects these harness directories and installs hooks into existing ones only (never creates new dirs):

| Harness | Detected directory | Hook install target | Config format |
|:---|:---|:---|:---|
| **Git** | `.git/` | `.git/hooks/` | native (no config) |
| **Claude Code** | `.claude/` | `.claude/hooks/` | JSON (`settings.json`) |
| **Codex** | `.codex/` | `.codex/hooks/` | native |
| **OpenCode** | `.opencode/` | `.opencode/hooks/` | YAML |
| **Gemini CLI** | `.gemini/` | `.gemini/hooks/` | YAML |
| **Cursor** | `.cursor/` | `.cursor/hooks/` | native |
| **Windsurf** | `.windsurf/` | `.windsurf/hooks/` | native |
| **Aider** | `.aider/` | `.aider/hooks/` | native |
| **Cline** | `.cline/` | `.cline/hooks/` | native |
| **Trae** | `.trae/` | `.trae/hooks/` | native |
| **Continue** | `.continue/` | `.continue/hooks/` | JSON |
| **Omo** | `.omo/` | `.omo/hooks/` | native |
| **Crush** | `.crush/` | `.crush/hooks/` | native |
| **Antigravity** | `.antigravity/` | `.antigravity/hooks/` | native |
| **OpenClaw** | `.openclaw/` | skill-level YAML `hooks:` block | YAML |
| **Hermes** | `~/.hermes/config.yaml` | config-based (manual) | YAML config |

## Install

```bash
# from repo root
bash scripts/hooks/install-hooks.sh
```

Idempotent — safe to re-run. **Never creates harness directories.** Only installs into directories that already exist.

**Claude is optional.** The hooks are plain bash — no Claude API, no Anthropic SDK. Claude Code hooks only install when `.claude/` is detected. On systems without Claude, that section is skipped entirely.

## Per-harness config (copy-paste)

### Git (automatic — no config needed)

Hooks install into `.git/hooks/` automatically. No configuration required.

### Hermes — `~/.hermes/config.yaml`

```yaml
hooks:
  events:
    - name: session-close
      matcher: "session.end"
      command: "bash scripts/hooks/gen-repo-report-on-close.sh"
      timeout: 10
    - name: pre-push-gate
      matcher: "git.pre-push"
      command: "bash scripts/hooks/pre-push-test-gate.sh"
      timeout: 30
    - name: secret-scan
      matcher: "git.pre-commit"
      command: "bash scripts/hooks/secret-scan-pre-commit.sh"
      timeout: 5
    - name: session-resume
      matcher: "session.start"
      command: "bash scripts/hooks/session-resume-probe.sh"
      timeout: 5
    - name: taste-observer
      matcher: "session.end"
      command: "bash scripts/hooks/taste-observer.sh"
      timeout: 10
```

Adjust `matcher` names to your installed Hermes version's event vocabulary.

### OpenClaw — skill-level YAML or `.openclaw/` config

```yaml
hooks:
  events:
    - name: session-close
      handler: gen-repo-report-on-close
      events: ["session.end"]
    - name: pre-push-gate
      handler: pre-push-test-gate
      events: ["git.pre-push"]
    - name: secret-scan
      handler: secret-scan-pre-commit
      events: ["git.pre-commit"]
    - name: session-resume
      handler: session-resume-probe
      events: ["session.start"]
    - name: taste-observer
      handler: taste-observer
      events: ["session.end"]
```

Handler values map to `scripts/hooks/<handler>.sh`.

### Claude Code — `.claude/settings.json` (if present)

```json
{
  "hooks": {
    "events": [
      {
        "name": "session-close",
        "matcher": "session.end",
        "command": "bash scripts/hooks/gen-repo-report-on-close.sh",
        "timeout": 10
      },
      {
        "name": "pre-push-gate",
        "matcher": "git.pre-push",
        "command": "bash scripts/hooks/pre-push-test-gate.sh",
        "timeout": 30
      },
      {
        "name": "secret-scan",
        "matcher": "git.pre-commit",
        "command": "bash scripts/hooks/secret-scan-pre-commit.sh",
        "timeout": 5
      }
    ]
  }
}
```

### Codex / Cursor / Windsurf / Aider / Cline / Trae / Omo / Crush / Antigravity — native (no config)

These harnesses detect hooks by their presence in the hooks directory. Bash hooks install and self-register. No configuration file needed.

### Continue — `.claude/settings.json` or Continue config

```json
{
  "hooks": {
    "events": [
      {
        "name": "session-close",
        "matcher": "session.end",
        "command": "bash scripts/hooks/gen-repo-report-on-close.sh",
        "timeout": 10
      },
      {
        "name": "pre-push-gate",
        "matcher": "git.pre-push",
        "command": "bash scripts/hooks/pre-push-test-gate.sh",
        "timeout": 30
      },
      {
        "name": "secret-scan",
        "matcher": "git.pre-commit",
        "command": "bash scripts/hooks/secret-scan-pre-commit.sh",
        "timeout": 5
      }
    ]
  }
}
```

### OpenCode — `.opencode/hooks.yaml` (or config file)

```yaml
hooks:
  events:
    - name: session-close
      handler: gen-repo-report-on-close
      events: ["session.end"]
    - name: pre-push-gate
      handler: pre-push-test-gate
      events: ["git.pre-push"]
    - name: secret-scan
      handler: secret-scan-pre-commit
      events: ["git.pre-commit"]
    - name: session-resume
      handler: session-resume-probe
      events: ["session.start"]
    - name: dead-letter-nightly
      handler: dead-letter-nightly
      events: ["cron.nightly"]
    - name: cache-pressure-check
      handler: cache-pressure-check
      events: ["cron.weekly"]

Handler values map to `scripts/hooks/<handler>.sh`.

### Gemini CLI — `.gemini/hooks.yaml` (or config file)

Same format as OpenCode above. Gemini CLI detects hooks via YAML config with handler → script mapping.

Handler values map to `scripts/hooks/<handler>.sh`.

### Cron-based hooks (all harnesses)

```bash
# dead-letter nightly sweep
0 22 * * * cd /path/to/repo && bash scripts/hooks/dead-letter-nightly.sh

# cache pressure check (weekly)
0 3 * * 0 cd /path/to/repo && bash scripts/hooks/cache-pressure-check.sh
```

## Token-efficiency note

Hooks are thin wrappers. They print a one-line command or read the relevant skill `SKILL.md` and follow it — they do not embed full skill logic. Token cost per hook fire: one read + one command (negligible). The agent loads the skill reference only when the hook context demands it.

## Uninstall

```bash
rm -f .git/hooks/pre-commit-muse-skills .git/hooks/pre-push-muse-skills
rm -rf .claude/hooks/ .opencode/hooks/ .codex/hooks/ .gemini/hooks/
rm -rf .cursor/hooks/ .windsurf/hooks/ .aider/hooks/ .cline/hooks/
rm -rf .trae/hooks/ .continue/hooks/ .omo/hooks/ .crush/hooks/ .antigravity/hooks/
# Hermes: remove hooks from ~/.hermes/config.yaml
```

## Adding a new hook

1. Create `scripts/hooks/<name>.sh` with `set -euo pipefail`
2. Make it executable (`chmod +x`)
3. The install script picks it up automatically
4. If the new hook needs config-based registration, add a section above
5. Document it in this README
