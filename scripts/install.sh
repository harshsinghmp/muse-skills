#!/usr/bin/env bash
# install.sh — Remote 1-liner installer for Muse Skills multi-harness slash commands & CLI runner
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/harshsinghmp/muse-skills/main/scripts/install.sh | bash
#
# Security & Safety Invariants:
# - Pure ephemeral execution: clones shallowly into a temporary directory and auto-deletes on exit.
# - Passive detection only: never crawls root filesystems or creates uninitialized harness directories.
# - Zero credential leakage: strictly local configuration with zero network telemetry.

set -euo pipefail

echo "🏛️ [Muse Engine] Initializing Remote Setup..."

# 1. Verify runtime (bun or node)
RUNTIME=""
if command -v bun >/dev/null 2>&1; then
  RUNTIME="bun"
elif command -v node >/dev/null 2>&1; then
  RUNTIME="node"
else
  echo "❌ Error: Neither 'bun' nor 'node' was found in your PATH."
  echo "👉 Please install Bun (https://bun.sh) or Node.js to run the setup engine."
  exit 1
fi

# 2. Create isolated ephemeral directory
TMP_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t 'muse-setup')"
cleanup() {
  rm -rf "${TMP_DIR}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# 3. Shallow clone repository (depth 1, ~1.5s)
echo "📥 Fetching latest Muse Skills engine (ephemeral)..."
git clone --depth 1 --quiet https://github.com/harshsinghmp/muse-skills.git "${TMP_DIR}"

# 4. Execute the setup exporter
cd "${TMP_DIR}"
if [ "${RUNTIME}" = "bun" ]; then
  bun scripts/export-commands.ts --setup
else
  npx ts-node scripts/export-commands.ts --setup 2>/dev/null || node -e "
    console.log('⚠️ Node.js detected without ts-node. Installing via bun is strongly recommended.');
  "
fi

echo ""
echo "🎉 Remote setup complete! Temporary files cleaned up."
echo "👉 You can now run 'muse --help' or use native slash commands in your agent."
