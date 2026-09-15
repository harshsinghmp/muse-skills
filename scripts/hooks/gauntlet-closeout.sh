#!/usr/bin/env bash
# gauntlet-closeout — auto-generate acceptance packet when gauntlet-loop terminates
# Trigger: gauntlet-loop completes (pass/plateau/regression/max-iter)
# Advisory: prints termination reason + acceptance packet path
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
GAUNTLET="$ROOT/.agents/artifacts/GAUNTLET_JOB_CONTRACT.md"
ACCEPT="$ROOT/.agents/artifacts/ACCEPTANCE_PACKET.md"

if [ -f "$GAUNTLET" ]; then
  echo "[hooks] gauntlet job contract found"
  if [ -f "$ACCEPT" ]; then
    echo "[hooks] acceptance packet exists — review before next iteration"
    head -10 "$ACCEPT"
  else
    echo "[hooks] no ACCEPTANCE_PACKET.md — run gauntlet-loop to generate"
  fi
else
  echo "[hooks] no gauntlet job contract — skip"
fi
exit 0
