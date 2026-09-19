#!/usr/bin/env bash
# secret-scan-pre-commit — block commits that leak credentials
# Trigger: git pre-commit hook
# Fail-open with warning for staged files (non-blocking advisory)
#
# Audit-gate options (additive; defaults preserve existing behavior):
#   --severity-threshold <critical|high|medium|low>  (default: low = show all)
#   --format <text|json|sarif>                       (default: text)
#   --rules-file <path>  extra ERE patterns, one per line (# comments OK;
#     *.yaml/*.yml reads `patterns:` list). See audit-rules.example.yaml for
#     the 3-layer merge sketch (defaults < repo < local/explicit, doc-only).
#   --output <path>      write formatted payload to file instead of stdout
#   --fail-on-findings   exit 1 when findings at/above threshold (opt-in;
#     default stays advisory exit 0)
# Pattern: runkids/skillshare `audit` flags --threshold/--format/--output
# (MIT, pattern-only; no skillshare code vendored).
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
PATTERN='(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{30,}|glpat-[a-zA-Z0-9-]{20,}|-----BEGIN (RSA|OPENSSH|PGP) PRIVATE KEY-----)'
CRIT_PATTERN='-----BEGIN (RSA|OPENSSH|PGP) PRIVATE KEY-----'
THRESHOLD="low"
FORMAT="text"
RULES_FILE=""
OUTPUT=""
FAIL_ON_FINDINGS=0
FOUND=0

while [ $# -gt 0 ]; do
  case "$1" in
    --severity-threshold) THRESHOLD="${2:-low}"; shift 2 ;;
    --format) FORMAT="${2:-text}"; shift 2 ;;
    --rules-file) RULES_FILE="${2:-}"; shift 2 ;;
    --output) OUTPUT="${2:-}"; shift 2 ;;
    --fail-on-findings) FAIL_ON_FINDINGS=1; shift ;;
    -h|--help) sed -n '1,/^set /p' "$0"; exit 0 ;;
    *) shift ;;
  esac
done

sev_rank() { case "$1" in critical) echo 4;; high) echo 3;; medium) echo 2;; *) echo 1;; esac; }
THRESH_RANK=$(sev_rank "$THRESHOLD")
EXTRA_PATTERN=""
if [ -n "$RULES_FILE" ] && [ -f "$RULES_FILE" ]; then
  case "$RULES_FILE" in
    *.yaml|*.yml) EXTRA_PATTERN=$(sed -n 's/^[[:space:]]*-[[:space:]]*//p' "$RULES_FILE" | sed 's/^["'\'']//;s/["'\'']$//' | grep -v '^#' | grep -v '^$' | paste -sd'|' - || true) ;;
    *) EXTRA_PATTERN=$(grep -v '^#' "$RULES_FILE" | grep -v '^$' | paste -sd'|' - || true) ;;
  esac
fi
[ -n "$EXTRA_PATTERN" ] && PATTERN="($PATTERN|$EXTRA_PATTERN)"
FINDINGS=""

# Scan staged files only
while IFS= read -r file; do
  [ -z "$file" ] && continue
  [ -f "$file" ] || continue
  MATCH=$(grep -oE "$PATTERN" "$file" 2>/dev/null | head -1 || true)
  [ -z "$MATCH" ] && continue
  if echo "$MATCH" | grep -qE "$CRIT_PATTERN"; then SEV="critical"; else SEV="high"; fi
  # Custom-rules matches that are not built-in severities fall to medium
  if [ -n "$EXTRA_PATTERN" ] && echo "$MATCH" | grep -qE "$EXTRA_PATTERN" && ! echo "$MATCH" | grep -qE '(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{30,}|glpat-|-----BEGIN)'; then SEV="medium"; fi
  [ "$(sev_rank "$SEV")" -lt "$THRESH_RANK" ] && continue
  FOUND=1
  FINDINGS="$FINDINGS$file|$SEV|$MATCH
"
done < <(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || true)

emit_text() {
  printf '%s' "$FINDINGS" | while IFS='|' read -r f s m; do
    [ -z "$f" ] && continue
    echo "[hooks] SECRET LEAK WARNING: $f matches credential pattern (severity: $s)"
  done
  if [ "$FOUND" -eq 1 ]; then
    echo "[hooks] Review staged files above before committing."
    # skill-spector-ignore: advisory-only hook; --no-verify is the real git escape hatch, never used by this script
    echo "[hooks] To bypass: git commit --no-verify"
  fi
}
emit_json() {
  printf '{"tool":"secret-scan-pre-commit","threshold":"%s","findings":[' "$THRESHOLD"
  FIRST=1
  printf '%s' "$FINDINGS" | while IFS='|' read -r f s m; do
    [ -z "$f" ] && continue
    m_esc=$(printf '%s' "$m" | sed 's/\\/\\\\/g;s/"/\\"/g' | cut -c1-64)
    [ "$FIRST" -eq 0 ] && printf ','
    printf '{"file":"%s","severity":"%s","match":"%s"}' "$f" "$s" "$m_esc"
    FIRST=0
  done
  COUNT=$(printf '%s' "$FINDINGS" | grep -c . || true)
  printf '],"count":%s}\n' "$COUNT"
}
emit_sarif() {
  {
  echo '{"$schema":"https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json","version":"2.1.0","runs":[{"tool":{"driver":{"name":"secret-scan-pre-commit","informationUri":"https://github.com/harshsinghmp/muse-skills","rules":[{"id":"credential-leak","shortDescription":{"text":"Credential pattern match"}}]}},"results":['
  FIRST=1
  printf '%s' "$FINDINGS" | while IFS='|' read -r f s m; do
    [ -z "$f" ] && continue
    case "$s" in critical) LV="error";; high) LV="error";; medium) LV="warning";; *) LV="note";; esac
    [ "$FIRST" -eq 0 ] && printf ','
    printf '{"ruleId":"credential-leak","level":"%s","message":{"text":"Credential pattern match (severity %s)"},"locations":[{"physicalLocation":{"artifactLocation":{"uri":"%s"},"region":{"startLine":1}}}]}' "$LV" "$s" "$f"
    FIRST=0
  done
  echo "]}]}"
  }
}

case "$FORMAT" in
  json) OUT=$(emit_json) ;;
  sarif) OUT=$(emit_sarif) ;;
  *) OUT=$(emit_text) ;;
esac
if [ -n "$OUTPUT" ]; then printf '%s\n' "$OUT" > "$OUTPUT"; echo "[hooks] secret-scan wrote $FORMAT to $OUTPUT"; else printf '%s\n' "$OUT"; fi

if [ "$FAIL_ON_FINDINGS" -eq 1 ] && [ "$FOUND" -eq 1 ]; then exit 1; fi

exit 0
