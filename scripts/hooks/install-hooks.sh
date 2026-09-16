#!/usr/bin/env bash
# install-hooks.sh — detect agent runtimes and register muse-skills hooks
# Usage: bash scripts/hooks/install-hooks.sh [--repo-root <path>]
# Idempotent: safe to run multiple times
# NEVER creates harness-level directories (.claude/, .codex/, etc.) — only installs into existing ones
set -euo pipefail

REPO_ROOT="$(pwd)"
HOOKS_DIR="$REPO_ROOT/scripts/hooks"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-root) REPO_ROOT="$2"; shift 2 ;;
    *) shift ;;
  esac
done

[ ! -d "$HOOKS_DIR" ] && { echo "hooks dir not found: $HOOKS_DIR"; exit 1; }

INSTALLED=0
DETECTED=""

# ─── Detection table ───────────────────────────────────────────────────────
# Each entry: dir_name∶hook_install_subdir∶config_format
# dir_name = presence-detected directory within REPO_ROOT
# hook_install_subdir = subdir within the harness where bash hooks go
# config_format = "native" (no config, just files) | "yaml" | "json" | "config" (manual)

declare -A HOOK_SUBDIR
declare -A HOOK_CONFIG

# Read harness detection table from agent-dirs.conf (kept external so hook
# logic never hardcodes harness directory names — see SECURITY.md).
CONF="$HOOKS_DIR/agent-dirs.conf"
if [ -f "$CONF" ]; then
  while IFS=':' read -r dir subdir fmt; do
    [ -z "$dir" ] && continue
    HOOK_SUBDIR["$dir"]="$subdir"
    HOOK_CONFIG["$dir"]="$fmt"
  done < "$CONF"
else
  echo "[hooks] MISSING agent-dirs.conf — hooks install may be incomplete"
fi

# Hermes uses ~/.hermes/config.yaml — detected separately
HERMES_CONFIG="$HOME/.hermes/config.yaml"
[ -f "$HERMES_CONFIG" ] && DETECTED="${DETECTED}hermes(config) "

# OpenClaw uses skill-level YAML hooks block
OPENCLAW_CONFIG="$REPO_ROOT/.openclaw"
[ -d "$OPENCLAW_CONFIG" ] && DETECTED="${DETECTED}openclaw(dir) "

# ─── Auto-install into present harnesses ───────────────────────────────────
for harness in "${!HOOK_SUBDIR[@]}"; do
  harness_path="$REPO_ROOT/$harness"
  [ ! -d "$harness_path" ] && continue

  hook_dest="$harness_path/${HOOK_SUBDIR[$harness]}"
  mkdir -p "$hook_dest"

  for f in "$HOOKS_DIR"/*.sh "$HOOKS_DIR"/agent-dirs.conf; do
    name=$(basename "$f")
    test -f "$f" || continue
    cp -f "$f" "$hook_dest/$name"
    chmod +x "$hook_dest/$name"
  done

  hook_count=$(ls -1 "$hook_dest"/*.sh 2>/dev/null | wc -l)
  echo "[hooks] $harness: installed ${hook_count} hook(s) → ${harness}/${HOOK_SUBDIR[$harness]}/"
  DETECTED="${DETECTED}${harness}(files) "
  INSTALLED=$((INSTALLED + 1))
done

# ─── Cron hook registration ────────────────────────────────────────────────
# Cron hooks (dead-letter-nightly, cache-pressure-check) have no event to hook
# into — they need a scheduler. Register them with crontab if available.
CRON_HOOKS=(
  "0 22 * * * cd $HOOKS_DIR/../.. && bash scripts/hooks/dead-letter-nightly.sh"
  "0 3 * * 0 cd $HOOKS_DIR/../.. && bash scripts/hooks/cache-pressure-check.sh"
)

if command -v crontab >/dev/null 2>&1; then
  INSTALLED_CRON=0
  for entry in "${CRON_HOOKS[@]}"; do
    if ! crontab -l 2>/dev/null | grep -qF "$entry"; then
      (crontab -l 2>/dev/null; echo "$entry") | crontab - 2>/dev/null && INSTALLED_CRON=$((INSTALLED_CRON + 1))
    fi
  done
  if [ "$INSTALLED_CRON" -gt 0 ]; then
    echo "[hooks] cron: registered $INSTALLED_CRON cron hook(s) (dead-letter-nightly, cache-pressure-check)"
    echo "[hooks] cron: verify with: crontab -l"
  else
    echo "[hooks] cron: hooks already registered (verify: crontab -l)"
  fi
else
  echo "[hooks] cron: crontab not available — cron hooks not auto-registered"
  echo "[hooks] cron: add manually: crontab -e"
  for entry in "${CRON_HOOKS[@]}"; do
    echo "[hooks] cron:   $entry"
  done
fi

# ─── Manual registration instructions for config-based harnesses ───────────
echo ""
echo "─── Manual registration required for config-based harnesses ───"
echo ""

if echo "$DETECTED" | grep -q "hermes"; then
  cat <<'HERMES_DOCS'
Hermes (~/.hermes/config.yaml)
Add a hooks section like this:

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

Adjust matcher names to your installed Hermes version's event vocabulary.
HERMES_DOCS
  echo ""
fi

# ─── OpenClaw hooks config (YAML) ──────────────────────────────────────────
OPENCLAW_DIR="$REPO_ROOT/.openclaw"
if [ -d "$OPENCLAW_DIR" ]; then
  OPENCLAW_CONFIG="$OPENCLAW_DIR/hooks.yaml"
  if [ ! -f "$OPENCLAW_CONFIG" ]; then
    cat > "$OPENCLAW_CONFIG" <<'OPENCLAW_YAML'
# OpenClaw hooks configuration
# Handler values map to scripts/hooks/<handler>.sh
# Each script reads its skill reference and executes.

hooks:
  events:
    - name: gen-repo-report-on-close
      handler: gen-repo-report-on-close
      events: ["session.end"]
    - name: pre-push-test-gate
      handler: pre-push-test-gate
      events: ["git.pre-push"]
    - name: secret-scan-pre-commit
      handler: secret-scan-pre-commit
      events: ["git.pre-commit"]
    - name: session-resume-probe
      handler: session-resume-probe
      events: ["session.start"]
    - name: sync-registry-on-skill-add
      handler: sync-registry-on-skill-add
      events: ["skill.installed"]
    - name: stale-frontmatter-check
      handler: stale-frontmatter-check
      events: ["git.post-merge"]
    - name: dead-letter-nightly
      handler: dead-letter-nightly
      events: ["cron.nightly"]
    - name: cache-pressure-check
      handler: cache-pressure-check
      events: ["cron.weekly"]
OPENCLAW_YAML
    echo "[hooks] openclaw: created hooks config at .openclaw/hooks.yaml"
    INSTALLED=$((INSTALLED + 1))
  else
    echo "[hooks] openclaw: hooks config already exists at .openclaw/hooks.yaml"
  fi
fi

# ─── OpenCode hooks config (YAML) ──────────────────────────────────────────
OPENCODE_CONFIG="$REPO_ROOT/.opencode/hooks.yaml"
if [ -d "$REPO_ROOT/.opencode" ] && [ ! -f "$OPENCODE_CONFIG" ]; then
  cat > "$OPENCODE_CONFIG" <<'OPENCODE_YAML'
# OpenCode hooks configuration
# Handler values map to scripts/hooks/<handler>.sh

hooks:
  events:
    - name: gen-repo-report-on-close
      handler: gen-repo-report-on-close
      events: ["session.end"]
    - name: pre-push-test-gate
      handler: pre-push-test-gate
      events: ["git.pre-push"]
    - name: secret-scan-pre-commit
      handler: secret-scan-pre-commit
      events: ["git.pre-commit"]
    - name: session-resume-probe
      handler: session-resume-probe
      events: ["session.start"]
    - name: sync-registry-on-skill-add
      handler: sync-registry-on-skill-add
      events: ["skill.installed"]
    - name: stale-frontmatter-check
      handler: stale-frontmatter-check
      events: ["git.post-merge"]
    - name: dead-letter-nightly
      handler: dead-letter-nightly
      events: ["cron.nightly"]
    - name: cache-pressure-check
      handler: cache-pressure-check
      events: ["cron.weekly"]
OPENCODE_YAML
  echo "[hooks] opencode: created hooks config at .opencode/hooks.yaml"
  INSTALLED=$((INSTALLED + 1))
fi

# ─── Gemini CLI hooks config (YAML) ────────────────────────────────────────
GEMINI_CONFIG="$REPO_ROOT/.gemini/hooks.yaml"
if [ -d "$REPO_ROOT/.gemini" ] && [ ! -f "$GEMINI_CONFIG" ]; then
  [ -f "$OPENCODE_CONFIG" ] && cp -f "$OPENCODE_CONFIG" "$GEMINI_CONFIG" || cat > "$GEMINI_CONFIG" <<'GEMINI_YAML'
# Gemini CLI hooks configuration
# Handler values map to scripts/hooks/<handler>.sh

hooks:
  events:
    - name: gen-repo-report-on-close
      handler: gen-repo-report-on-close
      events: ["session.end"]
    - name: pre-push-test-gate
      handler: pre-push-test-gate
      events: ["git.pre-push"]
    - name: secret-scan-pre-commit
      handler: secret-scan-pre-commit
      events: ["git.pre-commit"]
    - name: session-resume-probe
      handler: session-resume-probe
      events: ["session.start"]
    - name: sync-registry-on-skill-add
      handler: sync-registry-on-skill-add
      events: ["skill.installed"]
    - name: stale-frontmatter-check
      handler: stale-frontmatter-check
      events: ["git.post-merge"]
    - name: dead-letter-nightly
      handler: dead-letter-nightly
      events: ["cron.nightly"]
    - name: cache-pressure-check
      handler: cache-pressure-check
      events: ["cron.weekly"]
GEMINI_YAML
  echo "[hooks] gemini: created hooks config at .gemini/hooks.yaml"
  INSTALLED=$((INSTALLED + 1))
fi

# ─── Continue hooks config (JSON) ──────────────────────────────────────────
CONTINUE_CONFIG="$REPO_ROOT/.continue/settings.json"
if [ -d "$REPO_ROOT/.continue" ] && [ ! -f "$CONTINUE_CONFIG" ]; then
  cat > "$CONTINUE_CONFIG" <<'CONTINUE_JSON'
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
CONTINUE_JSON
  echo "[hooks] continue: created hooks config at .continue/settings.json"
  INSTALLED=$((INSTALLED + 1))
fi

# Informational for harnesses where bash hooks alone may not be sufficient
# (only print if no auto-config exists for the harness)
for harness in "${!HOOK_CONFIG[@]}"; do
  [ "${HOOK_CONFIG[$harness]}" = "native" ] && continue
  [ "${HOOK_CONFIG[$harness]}" = "yaml" ] && continue
  # Skip json configs we auto-create (claude, continue)
  [ "$harness" = ".claude" ] && [ ! -f "$REPO_ROOT/.claude/settings.json" ] && continue
  [ "$harness" = ".continue" ] && [ ! -f "$REPO_ROOT/.continue/settings.json" ] && continue
  echo "[hooks] $harness: bash hooks installed — check your harness docs for hook registration"
done

echo ""
echo "Detected: ${DETECTED:-none}"
echo "Auto-installed into: $INSTALLED harness(es)"
echo "Run this script again after installing new harnesses (e.g., bun, uv, pipx)."
exit 0
