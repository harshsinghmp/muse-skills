#!/usr/bin/env bash
# dead-letter-nightly — sweep and cluster open dead-letter records
# Trigger: scheduled (cron) or manual invocation
# Advisory: prints clustered failure summary
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
DL_DIR="$ROOT/.agents/artifacts"

echo "[hooks] dead-letter sweep"
if [ -d "$DL_DIR" ]; then
  if command -v fd >/dev/null 2>&1; then
    OPEN=$(fd -t f 'dead-letter-*.md' "$DL_DIR" 2>/dev/null | wc -l | tr -d ' ')
  else
    OPEN=0
  fi
  case "$OPEN" in ''|*[!0-9]*) OPEN=0 ;; esac
  echo "[hooks] open dead-letter records: $OPEN"
  if [ "$OPEN" -gt 0 ]; then
    echo "[hooks] run: dead-letter status"
  fi
else
  echo "[hooks] no artifacts dir — skip"
fi
exit 0
