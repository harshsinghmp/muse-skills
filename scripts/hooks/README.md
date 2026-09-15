# muse-skills hooks

Shell hooks that improve workflow safety, accuracy, and session continuity. Install alongside skills via `bash scripts/hooks/install-hooks.sh`. Each hook is fail-closed (log + continue, never blocks the agent).

## Hooks (14 total)

| # | Hook | Trigger | Agent | Behavior |
|:---|:---|:---|:---|:---|
| 1 | `gen-repo-report-on-close.sh` | session end | all | Copies latest `session-history-*.html` from drafts into `.agents/archive/reports/session-<id>--<date>.html` |
| 2 | `secret-scan-pre-commit.sh` | git pre-commit | git-native | Scans staged files for credential patterns (`sk-*`, `ghp_*`, `glpat-*`, private keys). Warns only |
| 3 | `worktree-lease-check.sh` | git branch ops | git-native + coupling-router | Probes `WORKTREE-LEASE.md` before branch mutations; warns if another session holds the lease |
| 4 | `audit-quick-on-skill-use.sh` | post-skill execution | all | Checks that the executed skill's `SKILL.md` has a `## Verification` section; prints reminder |
| 5 | `sync-registry-on-skill-add.sh` | post-skill-install | all | Runs `scripts/sync_registry.py` to sync `skills.json` + `llms.txt` + `README.md` |
| 6 | `stale-frontmatter-check.sh` | post-merge, post-commit | git-native | Runs `sync_registry.py` to detect frontmatter drift between SKILL.md and skills.json |
| 7 | `pre-push-test-gate.sh` | git pre-push | git-native | Warns if `bun test` is not green before push. Advisory only |
| 8 | `session-resume-probe.sh` | session start / workspace entry | all | Probes `HANDOFF.md` for relay ambient continuity; prints resumption block |
| 9 | `context-switch-snapshot.sh` | context-anchor park/switch | all | Reminds to update anchor before switching workstreams |
| 10 | `evidence-decision-sync.sh` | evidence-ledger decide completes | all | Recommends `updatedocs change` if decision affects docs |
| 11 | `gauntlet-closeout.sh` | gauntlet-loop terminates | all | Checks for ACCEPTANCE_PACKET.md; prints termination status |
| 12 | `dead-letter-nightly.sh` | scheduled (cron) or manual | all | Counts open dead-letter records; recommends `dead-letter status` |
| 13 | `cache-pressure-check.sh` | periodic (cron) or pre-build | all | Warns when disk space < 10GB; recommends `clean-system-cache` |
| 14 | `install-hooks.sh` | manual / post-skill-install | all | Detects agent runtimes, installs hooks into correct directories |

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

### OpenCode / Gemini CLI — YAML config

For harnesses using YAML-based hook configs, add entries matching the OpenClaw format above.

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
