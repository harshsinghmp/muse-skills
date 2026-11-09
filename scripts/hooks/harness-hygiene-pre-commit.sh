#!/usr/bin/env bash
# harness-hygiene-pre-commit — block internal agent state from being committed
# Trigger: git pre-commit
# Blocks only tracked/staged agent paths; ignored local dirs do not block.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
cd "$ROOT"

INTERNAL='(^|/)\.agents/|(^|/)\.memory/|(^|/)\.claude/|(^|/)\.cursor/|(^|/)\.codex/|(^|/)\.gemini/|(^|/)\.opencode/|(^|/)\.commandcode/|(^|/)\.windsurf/|(^|/)\.continue/|(^|/)\.roo/|(^|/)\.hermes/|(^|/)\.omo/|(^|/)\.omh/|(^|/)\.omp/|(^|/)\.crush/|(^|/)transcripts/|(^|/)chat-logs/|(^|/)session-logs/|(^|/)agent-transcripts/|\.transcript\.jsonl$|\.trajectory\.jsonl$|\.chat\.json$|\.scratchpad\.md$'

STAGED="$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || true)"
BAD="$(echo "$STAGED" | grep -E "$INTERNAL" || true)"
if [ -n "$BAD" ]; then
  echo "[hooks] ❌ Agent state must stay internal; staged paths:"
  echo "$BAD" | sed 's/^/[hooks]    /'
  echo "[hooks] Fix: git restore --staged <path>; run updateagents --install-excludes"
  exit 1
fi

# Also fail when the index already tracks internal paths (legacy leak).
CHECKER_FOUND=0
for p in \
  "skills/core-engine/updateagents/scripts/updateagents.ts" \
  ".agents/skills/updateagents/scripts/updateagents.ts" \
  "$HOME/.agents/skills/updateagents/scripts/updateagents.ts"; do
  if [ -f "$p" ] && command -v bun >/dev/null 2>&1; then
    CHECKER_FOUND=1
    bun "$p" . --hygiene --check-public >/dev/null 2>&1 || {
      echo "[hooks] ❌ Tracked agent artifacts detected. Run: updateagents . --hygiene --check-public"
      exit 1
    }
    break
  fi
done

if [ "$CHECKER_FOUND" -eq 0 ]; then
  if [ "${MUSE_HYGIENE_SKIP:-0}" = "1" ]; then
    echo "[hooks] hygiene checker unavailable; skipping (MUSE_HYGIENE_SKIP=1)"
    exit 0
  fi
  echo "[hooks] ❌ Hygiene checker unavailable; refusing to pass. Set MUSE_HYGIENE_SKIP=1 to override." >&2
  exit 1
fi

exit 0
