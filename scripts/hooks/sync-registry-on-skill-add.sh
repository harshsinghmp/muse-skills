#!/usr/bin/env bash
# sync-registry-on-skill-add — sync llms.txt + README when a new skill directory appears
# Trigger: post-skill-install (npx skills add)
# Fail-closed: warn but don't block
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
SKILLS_JSON="$ROOT/skills.json"
LLMS_TXT="$ROOT/llms.txt"

[ ! -f "$SKILLS_JSON" ] && { echo "[hooks] no skills.json found"; exit 0; }

# Check if sync script exists
SYNC="$ROOT/scripts/sync_registry.py"
if [ -f "$SYNC" ]; then
  python3 "$SYNC" 2>&1 | tail -3
else
  echo "[hooks] sync_registry.py not found — run manually after adding a skill"
fi

# Auto-sync secretary dispatch directory & multi-harness commands
SYNC_DISPATCH="$ROOT/scripts/sync-dispatch.ts"
if [ -f "$SYNC_DISPATCH" ] && command -v bun >/dev/null 2>&1; then
  bun "$SYNC_DISPATCH" 2>&1 | tail -3
fi

exit 0
