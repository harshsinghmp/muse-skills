#!/usr/bin/env bash
# ruff-check.sh — run Astral's ruff over the repository's Python scripts.
#
# Modern-tool primacy (see AGENTS.md): prefer `uvx`, fall back to a system
# `ruff`, then to `pipx`. `exec` is used so the linter's exit code is
# propagated verbatim — a chained `||` would mask real findings behind a
# "command not found" from the fallback branch.
set -euo pipefail

if command -v uvx >/dev/null 2>&1; then
  exec uvx ruff check scripts/
fi

if command -v ruff >/dev/null 2>&1; then
  exec ruff check scripts/
fi

if command -v pipx >/dev/null 2>&1; then
  exec pipx run ruff ruff check scripts/
fi

cat >&2 <<'EOF'
ruff not found. Install it with one of:
  uv tool install ruff      # preferred
  pipx install ruff
  pip install ruff
EOF
exit 127
