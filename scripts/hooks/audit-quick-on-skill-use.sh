#!/usr/bin/env bash
# audit-quick-on-skill-use — run quick-tier Verification after skill mode executes
# Trigger: post-skill-execution (hook context)
# Advisory only: prints whether skill Verification section was found
set -euo pipefail

SKILL_DIR="${1:-}"
[ -z "$SKILL_DIR" ] && { echo "[hooks] usage: audit-quick-on-skill-use <skill-dir>"; exit 0; }

SKILL_MD="$SKILL_DIR/SKILL.md"
[ ! -f "$SKILL_MD" ] && { echo "[hooks] no SKILL.md at $SKILL_DIR"; exit 0; }

if grep -qE '^## Verification' "$SKILL_MD"; then
  echo "[hooks] skill $(basename "$SKILL_DIR"): Verification section present — run the checklist"
else
  echo "[hooks] skill $(basename "$SKILL_DIR"): no ## Verification section found"
fi

exit 0
