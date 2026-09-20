#!/usr/bin/env bash
# taste-observer — passive observation hook for Native Taste Engine
# Trigger: session closeout, prompt/conversation input, or explicit invocation
# Behavior: extracts user corrections & preferences, sanitizes secrets/paths, and forwards to taste-engine.ts
# Fail-closed / silent: gracefully exits 0 on empty, invalid, or unparseable input
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
TASTE_ENGINE="$ROOT/scripts/taste-engine.ts"

# If taste-engine.ts is missing or bun is unavailable, exit silently
[ -f "$TASTE_ENGINE" ] || exit 0
command -v bun >/dev/null 2>&1 || exit 0

# ─── Argument parsing ────────────────────────────────────────────────────────
EXPLICIT_SIGNAL=""
RAW_INPUT=""
HAS_ARGS=false

if [ $# -gt 0 ]; then
  HAS_ARGS=true
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --signal=*)
      EXPLICIT_SIGNAL="${1#--signal=}"
      shift
      ;;
    --signal)
      EXPLICIT_SIGNAL="${2:-}"
      shift 2 2>/dev/null || shift
      ;;
    --input=*)
      RAW_INPUT="${1#--input=}"
      shift
      ;;
    --input)
      RAW_INPUT="${2:-}"
      shift 2 2>/dev/null || shift
      ;;
    *)
      if [ -z "$RAW_INPUT" ]; then
        RAW_INPUT="$1"
      else
        RAW_INPUT="$RAW_INPUT $1"
      fi
      shift
      ;;
  esac
done

# If arguments were provided but empty/blank, exit silently
if [ "$HAS_ARGS" = true ]; then
  COMBINED_ARGS="${EXPLICIT_SIGNAL}${RAW_INPUT}"
  TRIMMED_ARGS="$(echo "$COMBINED_ARGS" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  if [ -z "$TRIMMED_ARGS" ]; then
    exit 0
  fi
fi

# If no argument was passed, check standard input (if piped)
if [ "$HAS_ARGS" = false ]; then
  if [ ! -t 0 ]; then
    RAW_INPUT="$(cat - 2>/dev/null || true)"
    TRIMMED_STDIN="$(echo "$RAW_INPUT" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
    if [ -z "$TRIMMED_STDIN" ]; then
      exit 0
    fi
  else
    # Stdin is a TTY and no args passed: check session closeout artifacts
    DRAFTS="$ROOT/.agents/artifacts/drafts"
    HANDOFF="$ROOT/.agents/artifacts/HANDOFF.md"

    if [ -f "$HANDOFF" ]; then
      RAW_INPUT="$(cat "$HANDOFF" 2>/dev/null || true)"
    elif [ -d "$DRAFTS" ]; then
      LATEST_REPORT="$(ls -t "$DRAFTS"/session-history-*.html 2>/dev/null | head -1 || true)"
      if [ -n "$LATEST_REPORT" ] && [ -f "$LATEST_REPORT" ]; then
        RAW_INPUT="$(cat "$LATEST_REPORT" 2>/dev/null || true)"
      fi
    fi
  fi
fi

# If raw input is empty, exit silently
[ -z "${EXPLICIT_SIGNAL}${RAW_INPUT}" ] && exit 0

# ─── Sanitization helper ─────────────────────────────────────────────────────
# Never exposes host-specific paths or secrets
sanitize_text() {
  local str="$1"

  # Strip secret tokens & credentials
  str=$(echo "$str" | sed -E \
    -e 's/sk-[a-zA-Z0-9_-]{20,}/[REDACTED]/g' \
    -e 's/ghp_[a-zA-Z0-9]{30,}/[REDACTED]/g' \
    -e 's/glpat-[a-zA-Z0-9-]{20,}/[REDACTED]/g' \
    -e 's/npm_[a-zA-Z0-9]{36,}/[REDACTED]/g' \
    -e 's/Bearer [a-zA-Z0-9_.-]{20,}/Bearer [REDACTED]/g' \
    -e 's/AKIA[0-9A-Z]{16}/[REDACTED]/g' \
    -e 's/xox[baprs]-[0-9a-zA-Z-]{10,72}/[REDACTED]/g' \
    -e 's/-----BEGIN [A-Z ]+ PRIVATE KEY-----/[REDACTED]/g' \
    -e 's/(password|secret|token|api_key)=[^[:space:]&]+/\\1=[REDACTED]/gi')

  # Strip host-specific absolute paths
  if [ -n "${HOME:-}" ]; then
    str=$(echo "$str" | sed "s|${HOME}|~|g")
  fi
  str=$(echo "$str" | sed -E \
    -e 's#/home/[a-zA-Z0-9_.-]+#~#g' \
    -e 's#/Users/[a-zA-Z0-9_.-]+#~#g')

  # Strip local loopback IPs and ports
  str=$(echo "$str" | sed -E 's#https?://localhost(:[0-9]+)?#http://localhost#g')

  echo "$str"
}

# ─── Observation execution helper ────────────────────────────────────────────
observe_signal() {
  local sig="$1"
  # Trim leading/trailing whitespace
  sig=$(echo "$sig" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')

  # Fail gracefully if signal is empty, too short (< 8 chars), or too long (> 300 chars)
  [ -z "$sig" ] && return 0
  [ "${#sig}" -lt 8 ] && return 0
  [ "${#sig}" -gt 300 ] && return 0

  # Sanitize
  local sanitized
  sanitized="$(sanitize_text "$sig")"
  [ -z "$sanitized" ] && return 0

  # Forward to taste-engine.ts observe
  local out
  out="$(bun "$TASTE_ENGINE" observe --signal="$sanitized" 2>&1 || true)"
  if [ -n "$out" ]; then
    echo "[hooks] taste-observer: observed signal '$sanitized'"
  fi
}

# ─── Process explicit signal or extract candidate cues ────────────────────────
if [ -n "$EXPLICIT_SIGNAL" ]; then
  observe_signal "$EXPLICIT_SIGNAL"
  exit 0
fi

# Strip HTML tags if HTML
CLEAN_INPUT="$(echo "$RAW_INPUT" | sed -E 's/<[^>]+>/ /g')"

# Correction / steering pattern regex
# Captures explicit user guidance, corrections, preferences, and negative constraints
CUE_REGEX="([Aa]lways|[Nn]ever|[Dd]on't|[Dd]o not|[Ss]top|[Pp]refer|[Ww]e use|[Ww]e don't use|[Ww]e do not use|[Mm]ake sure to|[Rr]emember to|[Cc]orrection:|[Pp]reference:|[Rr]ule:|[Ii]nvariant:|[Ii]nstead of|[Aa]void|[Ss]trictly|[Zz]ero-)"

# If input is a single line, check if it directly expresses a preference/cue
LINE_COUNT=$(echo "$CLEAN_INPUT" | grep -c . || echo "0")
if [ "$LINE_COUNT" -eq 1 ] && [ "${#CLEAN_INPUT}" -le 200 ]; then
  TRIMMED="$(echo "$CLEAN_INPUT" | sed -E -e 's/^[[:space:]]*(User|Human|Operator):[[:space:]]*//i' -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  if echo "$TRIMMED" | grep -qE "$CUE_REGEX"; then
    observe_signal "$TRIMMED"
    exit 0
  fi
fi

# Extract candidate matching lines (from conversation, handoff, or multi-line prompt)
MATCHES=$(echo "$CLEAN_INPUT" | grep -E "$CUE_REGEX" || true)
[ -z "$MATCHES" ] && exit 0

# Limit to at most 5 observed signals per batch to avoid flooding
COUNT=0
while IFS= read -r line; do
  [ -z "$line" ] && continue

  # Clean leading markdown bullets/numbering or user labels
  line=$(echo "$line" | sed -E \
    -e 's/^[[:space:]]*([-*+]|[0-9]+\.)[[:space:]]+//' \
    -e 's/^[[:space:]]*(User|Human|Operator|Assistant):[[:space:]]*//i' \
    -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')

  [ -z "$line" ] && continue

  observe_signal "$line"
  COUNT=$((COUNT + 1))
  [ "$COUNT" -ge 5 ] && break
done <<< "$MATCHES"

exit 0
