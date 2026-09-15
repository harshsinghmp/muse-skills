#!/usr/bin/env bash
# session-resume-probe — probe HANDOFF.md + auto-archive stale session reports
# Trigger: session start / workspace entry
# Advisory: prints resumption block + archives any unarchived session HTML
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
HANDOFF="$ROOT/.agents/artifacts/HANDOFF.md"
DRAFTS="$ROOT/.agents/artifacts/drafts"
ARCHIVE="$ROOT/.agents/archive/reports"

if [ -f "$HANDOFF" ]; then
  echo "[hooks] HANDOFF.md found — relay will resume from:"
  head -5 "$HANDOFF"
  echo "[hooks] run 'relay resume' for full context restore"
else
  echo "[hooks] no HANDOFF.md — fresh workspace"
fi

# Auto-archive: if latest session-history HTML exists but not archived → archive it
# This catches abrupt closes (Ctrl+C, kill -9, crash) where session-close hook never fired
HTML=$(ls -t "$DRAFTS"/session-history-*.html 2>/dev/null | head -1 || true)
if [ -n "$HTML" ]; then
  BASENAME=$(basename "$HTML")
  SESSION_ID="${BASENAME#session-history-}"
  SESSION_ID="${SESSION_ID%.html}"
  DEST="$ARCHIVE/session-${SESSION_ID}--$(date +%Y-%m-%d).html"
  if [ ! -f "$DEST" ]; then
    mkdir -p "$ARCHIVE"
    cp -f "$HTML" "$DEST"
    echo "[hooks] auto-archived stale report: $DEST"
  fi
fi
exit 0
