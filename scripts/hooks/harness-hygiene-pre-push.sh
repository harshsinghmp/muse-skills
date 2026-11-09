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

if [ "${MUSE_HYGIENE_SKIP:-0}" = "1" ]; then
  echo "[hooks] updateagents not found — skipping public-surface check (MUSE_HYGIENE_SKIP=1)"
  exit 0
fi

echo "[hooks] ❌ updateagents/bun not found; refusing to pass the public-surface gate." >&2
echo "[hooks] Install Bun and the updateagents skill, or set MUSE_HYGIENE_SKIP=1 to override." >&2
exit 1
