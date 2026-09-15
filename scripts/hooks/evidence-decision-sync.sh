#!/usr/bin/env bash
# evidence-decision-sync — sync evidence-ledger decisions to updatedocs
# Trigger: evidence-ledger decide command completes
# Advisory: prints sync recommendation
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
LEDGER="$ROOT/.agents/artifacts/evidence-ledger.md"
UPDATEDOCS="$ROOT/scripts/sync_registry.py"

if [ -f "$LEDGER" ]; then
  echo "[hooks] evidence-ledger updated"
  echo "[hooks] if decision affects docs, run: updatedocs change"
else
  echo "[hooks] no evidence-ledger.md found"
fi
exit 0
