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

if echo "$DETECTED" | grep -q "openclaw"; then
  cat <<'OPENCLAW_DOCS'
OpenClaw (.openclaw or skill-level YAML hooks block)
Add to your agent config YAML:

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

Handler values map to scripts/hooks/<handler>.sh.
OPENCLAW_DOCS
  echo ""
fi

# Informational for harnesses where bash hooks alone may not be sufficient
for harness in "${!HOOK_CONFIG[@]}"; do
  [ "${HOOK_CONFIG[$harness]}" = "native" ] && continue
  [ "${HOOK_CONFIG[$harness]}" = "yaml" ] && continue
  echo "[hooks] $harness: bash hooks installed — check your harness docs for hook registration"
done

echo ""
echo "Detected: ${DETECTED:-none}"
echo "Auto-installed into: $INSTALLED harness(es)"
echo "Run this script again after installing new harnesses (e.g., bun, uv, pipx)."
exit 0
