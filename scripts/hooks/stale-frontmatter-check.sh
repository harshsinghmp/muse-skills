#!/usr/bin/env bash
# stale-frontmatter-check — warn when SKILL.md frontmatter drifts from skills.json
# Trigger: post-merge, post-commit (git hook context)
# Advisory: prints drift report, does not block
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
SYNC="$ROOT/scripts/sync_registry.py"

[ ! -f "$SYNC" ] && { echo "[hooks] sync_registry.py not found"; exit 0; }

echo "[hooks] checking frontmatter drift..."
python3 "$SYNC" 2>&1 | tail -5
echo "[hooks] if drift found above, run: python3 $SYNC"
exit 0
