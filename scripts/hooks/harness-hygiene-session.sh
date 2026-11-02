#!/usr/bin/env bash
# harness-hygiene-session — advisory clean-root check at session start
# Trigger: session start / workspace entry
# Never writes, never blocks.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
cd "$ROOT"

find_updateagents() {
  for p in \
    "skills/core-engine/updateagents/scripts/updateagents.ts" \
    ".agents/skills/updateagents/scripts/updateagents.ts" \
    "$HOME/.agents/skills/updateagents/scripts/updateagents.ts"; do
    if [ -f "$p" ]; then
      echo "$p"
      return 0
    fi
  done
  return 1
}

UA="$(find_updateagents || true)"
if [ -n "$UA" ] && command -v bun >/dev/null 2>&1; then
  bun "$UA" . --hygiene 2>/dev/null | sed 's/^/[hooks] /' || true
else
  # Lightweight fallback: report common root clutter without writing.
  for d in .claude .cursor .codex .gemini .opencode .commandcode .windsurf .continue .roo .hermes; do
    [ -d "$ROOT/$d" ] && echo "[hooks] harness dir present: $d (run updateagents --hygiene --consolidate)"
  done
fi

exit 0
