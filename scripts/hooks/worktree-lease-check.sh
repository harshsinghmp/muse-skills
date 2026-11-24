#!/usr/bin/env bash
# worktree-lease-check — enforce worktree lease before git branch operations
# Trigger: git pre-commit or pre-checkout (custom)
# Fail-closed: block if lease held by another session
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
LEASE="$ROOT/.agents/artifacts/WORKTREE-LEASE.md"
COUPLER="$ROOT/skills/context-orchestration/coupling-router/scripts/worktree-lease.ts"

[ ! -f "$LEASE" ] && exit 0

if [ -f "$COUPLER" ] && command -v bun >/dev/null 2>&1; then
  # --dry-run never writes a lease; exit 1 means a fresh foreign lease is held.
  if ! RESULT=$(bun "$COUPLER" probe --owner "pre-commit-hook" --dry-run 2>&1); then
    echo "$RESULT"
    echo "[hooks] Blocked: worktree lease held by another session. Use a separate worktree or wait."
    exit 1
  fi
  echo "$RESULT"
else
  echo "[hooks] Blocked: worktree lease present but the probe is unavailable (fail-closed)."
  exit 1
fi

exit 0
