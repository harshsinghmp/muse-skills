#!/usr/bin/env bash
# harness-hygiene-pre-push — block internal agent state from reaching a public remote
# Trigger: git pre-push
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
cd "$ROOT"

for p in \
  "skills/core-engine/updateagents/scripts/updateagents.ts" \
  ".agents/skills/updateagents/scripts/updateagents.ts" \
  "$HOME/.agents/skills/updateagents/scripts/updateagents.ts"; do
  if [ -f "$p" ] && command -v bun >/dev/null 2>&1; then
    if ! bun "$p" . --hygiene --check-public; then
      echo "[hooks] ❌ Push blocked: agent/harness artifacts are tracked."
      echo "[hooks] Fix: git rm -r --cached <path>; updateagents --install-excludes"
      exit 1
    fi
    exit 0
  fi
done

echo "[hooks] updateagents not found — skipping public-surface check"
exit 0
