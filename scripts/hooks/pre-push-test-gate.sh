#!/usr/bin/env bash
# pre-push-test-gate — warn if bun test is not green before push
# Trigger: git pre-push hook
# Advisory: warns and shows failing test count, does not block
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
cd "$ROOT"

if command -v bun >/dev/null 2>&1; then
  RESULT=$(bun test 2>&1 | grep -E "^[0-9]+ (pass|fail)" | tail -2 || true)
  FAIL_COUNT=$(echo "$RESULT" | grep -oE '[0-9]+ fail' | grep -oE '^[0-9]+' || echo "0")
  if [ "$FAIL_COUNT" != "0" ]; then
    echo "[hooks] WARN: $FAIL_COUNT test(s) failing — consider fixing before push"
  else
    echo "[hooks] tests green — safe to push"
  fi
else
  echo "[hooks] bun not available — skipping test gate"
fi
exit 0
