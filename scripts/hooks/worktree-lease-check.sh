#!/usr/bin/env bash
# worktree-lease-check — enforce worktree lease before git branch operations
# Trigger: git pre-commit or pre-checkout (custom)
# Fail-closed: block if lease held by another session
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
LEASE="$ROOT/.agents/artifacts/WORKTREE-LEASE.md"
COUPLER="$ROOT/scripts/worktree-lease.ts"

[ ! -f "$LEASE" ] && exit 0

# If coupling-router lease probe exists, use it; otherwise warn
if [ -f "$COUPLER" ] && command -v bun >/dev/null 2>&1; then
  RESULT=$(bun "$COUPLER" probe 2>&1 || true)
  echo "$RESULT"
else
  echo "[hooks] WARN: worktree lease present but probe unavailable"
fi

exit 0
