#!/usr/bin/env bash
# context-switch-snapshot — snapshot working state before switching workstreams
# Trigger: context-anchor park/switch
# Advisory: prints reminder to update anchor
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
ANCHOR="$ROOT/.agents/anchor.md"

echo "[hooks] context-switch detected (context-anchor)"
if [ -f "$ANCHOR" ]; then
  echo "[hooks] existing anchor: $ANCHOR"
  echo "[hooks] update before switching: workstream, branch, what's-true, next-action"
else
  echo "[hooks] no anchor found — create one with: context-anchor"
fi
exit 0
