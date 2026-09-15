#!/usr/bin/env bash
# gen-repo-report-on-close — archive session HTML report into .agents/archive/reports/
# Trigger: session end / project close
# Fail-closed: log and continue (never blocks)
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
DRAFTS="$ROOT/.agents/artifacts/drafts"
ARCHIVE="$ROOT/.agents/archive/reports"

mkdir -p "$ARCHIVE"

# Find latest session-history HTML
HTML=$(ls -t "$DRAFTS"/session-history-*.html 2>/dev/null | head -1 || true)
[ -z "$HTML" ] && { echo "[hooks] no session-history HTML found"; exit 0; }

# Extract session ID
BASENAME=$(basename "$HTML")
SESSION_ID=$(echo "$BASENAME" | sed -E 's/session-history-([0-9-]+)\.html/\1/')
DEST="$ARCHIVE/session-${SESSION_ID}--$(date +%Y-%m-%d).html"

cp -f "$HTML" "$DEST"
echo "[hooks] report archived: $DEST ($(wc -c < "$DEST") bytes)"
