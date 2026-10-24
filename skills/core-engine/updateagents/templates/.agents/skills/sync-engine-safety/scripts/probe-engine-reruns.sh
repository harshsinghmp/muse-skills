#!/usr/bin/env bash
# Probe a scaffolder/sync engine's re-run safety on throwaway projects.
#
# Usage:  bash probe-engine-reruns.sh <path/to/engine.ts> [extra engine args...]
#         bash probe-engine-reruns.sh path/to/engine.ts --no-github
#
# Asserts nothing and touches nothing outside its own temp dirs. It prints the
# observable artifacts so a human (or agent) can see whether run #2 was a no-op.
# ARTIFACT PATHS below are set for the muse-skills `updateagents` engine; change
# them for your engine (that is the only engine-specific part of this script).
set -uo pipefail

ENGINE="${1:?usage: probe-engine-reruns.sh <engine.ts> [args...]}"; shift || true
ENGINE="$(cd "$(dirname "$ENGINE")" && pwd)/$(basename "$ENGINE")"
ENGINE_ARGS=("$@")

STANDARDS=".agents/standards"
MANIFEST=".agents/archive/agent-instructions/manifest.json"
IMPORTED=".agents/context/imported-agent-instructions.md"
COMMUNITY=".github/SECURITY.md"
CHANGELOG="CHANGELOG.md"

run() { printf '  $ bun %s %s\n' "$(basename "$ENGINE")" "$*"; bun "$ENGINE" "$@" >/dev/null 2>&1; printf '    exit=%s\n' "$?"; }
count() { find "$1" -type f 2>/dev/null | wc -l | tr -d ' '; }

trap 'printf "\nTemp dirs kept for inspection:\n  %s\n  %s\n" "$FRESH" "$EST"' EXIT
FRESH=$(mktemp -d /tmp/probe-fresh.XXXXXX)
EST=$(mktemp -d /tmp/probe-est.XXXXXX)
for d in "$FRESH" "$EST"; do
  ( cd "$d" && git init -q && git remote add origin git@github.com:example/probe.git ) >/dev/null 2>&1
  printf '# probe\nlocal rules\n' > "$d/AGENTS.md"
  ( cd "$d" && rm -f AGENTS.md )
done

printf '\n=== SHAPE 1: fresh container ===\n'
run "$FRESH" --scaffold "${ENGINE_ARGS[@]}"
printf '  standards files: %s\n' "$(count "$FRESH/$STANDARDS")"
printf '  community/changelog present: %s / %s\n' \
  "$([ -f "$FRESH/$COMMUNITY" ] && echo yes || echo NO)" \
  "$([ -f "$FRESH/$CHANGELOG" ] && echo yes || echo NO)"

printf '\n=== SHAPE 2: established container, curated edits, plain re-run ===\n'
SAMPLE=$(ls "$FRESH/$STANDARDS" 2>/dev/null | head -1)
VICTIM=$(ls "$FRESH/$STANDARDS" 2>/dev/null | sed -n 2p)
if [ -n "$SAMPLE" ]; then printf '# curated by the project\n' > "$FRESH/$STANDARDS/$SAMPLE"; fi
[ -n "$VICTIM" ] && rm -f "$FRESH/$STANDARDS/$VICTIM"
rm -f "$FRESH/$COMMUNITY" "$FRESH/$CHANGELOG"
printf '# drift\n' > "$FRESH/.cursorrules"    # forces a full run instead of a fast-skip exit
BEFORE=$(find "$FRESH/$STANDARDS" -type f -exec sha256sum {} + 2>/dev/null | sort | sha256sum)
run "$FRESH" "${ENGINE_ARGS[@]}"
AFTER=$(find "$FRESH/$STANDARDS" -type f -exec sha256sum {} + 2>/dev/null | sort | sha256sum)
printf '  curated standard still project-owned: %s\n' "$([ "$(head -1 "$FRESH/$STANDARDS/$SAMPLE" 2>/dev/null)" = '# curated by the project' ] && echo yes || echo NO)"
printf '  deleted canon re-injected: %s   deleted community file restored: %s\n' \
  "$([ -n "$VICTIM" ] && [ -f "$FRESH/$STANDARDS/$VICTIM" ] && echo YES || echo no)" \
  "$([ -f "$FRESH/$COMMUNITY" ] && echo YES || echo no)"
printf '  standards tree unchanged by re-run: %s\n' "$([ "$BEFORE" = "$AFTER" ] && echo yes || echo NO)"

printf '\n=== SHAPE 3: generated files must not appear as engine inputs ===\n'
if [ -f "$FRESH/$MANIFEST" ]; then
  bun -e 'const fs=require("fs"),c=require("crypto");const m=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));const root=fs.readFileSync(process.argv[2],"utf8");const h=c.createHash("sha256").update(root).digest("hex");console.log("  archived sources: "+JSON.stringify((m.sources||[]).map(s=>s.sourcePath)));console.log("  byte-identical snapshot of the generated root file: "+((m.sources||[]).some(s=>s.sha256===h)?"YES — it re-ingested its own output":"no"));' \
    "$FRESH/$MANIFEST" "$FRESH/AGENTS.md" 2>/dev/null || echo '  (manifest present but not in the expected shape for this engine)'
else
  printf '  no manifest at %s (not applicable to this engine)\n' "$MANIFEST"
fi
printf '  imported-instructions file exists: %s\n' "$([ -f "$FRESH/$IMPORTED" ] && echo yes || echo no)"

printf '\n=== SHAPE 4: explicit overwrite path ===\n'
run "$FRESH" --force "${ENGINE_ARGS[@]}"
printf '  curated standard after --force: %s\n' "$([ "$(head -1 "$FRESH/$STANDARDS/$SAMPLE" 2>/dev/null)" = '# curated by the project' ] && echo preserved || echo overwritten-by-explicit-force)"
