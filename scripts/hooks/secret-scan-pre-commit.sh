#!/usr/bin/env bash
# secret-scan-pre-commit — block commits that leak credentials
# Trigger: git pre-commit hook
# Fail-open with warning for staged files (non-blocking advisory)
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
PATTERN='(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{30,}|glpat-[a-zA-Z0-9-]{20,}|-----BEGIN (RSA|OPENSSH|PGP) PRIVATE KEY-----)'
FOUND=0

# Scan staged files only
while IFS= read -r file; do
  if grep -qE "$PATTERN" "$file" 2>&1; then
    echo "[hooks] SECRET LEAK WARNING: $file matches credential pattern"
    FOUND=1
  elif [ $? -ne 0 ]; then
    echo "[hooks] SCAN ERROR: $file (grep exit $?)"
    FOUND=1
  fi
done < <(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || true)

if [ "$FOUND" -eq 1 ]; then
  echo "[hooks] Review staged files above before committing."
  echo "[hooks] To bypass: git commit --no-verify"
fi

exit 0
