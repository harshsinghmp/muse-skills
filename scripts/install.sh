#!/usr/bin/env bash
# install.sh — Interactive & Remote Installer for Muse Skills (v6.0.0)
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/harshsinghmp/muse-skills/main/scripts/install.sh | bash
#
# Flags (for non-interactive / CI automation):
#   --all               Install all 47 skills & native slash commands (default)
#   --skills-only       Install 47 skills only
#   --commands-only     Export slash commands only
#   --sync-agents       Automatically run updateagents to modernize workspace context
#   --project           Target current project (./.agents/skills) instead of global (~/.agents/skills)
#   --global            Target global (~/.agents/skills)
#   --non-interactive   Skip prompts and use defaults

set -euo pipefail

ORIGINAL_PWD="$(pwd)"

# ─── Terminal Styling ────────────────────────────────────────────────────────
BOLD="\033[1m"
GREEN="\033[32m"
BLUE="\033[34m"
YELLOW="\033[33m"
CYAN="\033[36m"
RESET="\033[0m"

echo -e "${BOLD}${BLUE}🏛️  Muse Skills Universal Installer (v6.0.0)${RESET}"
echo -e "Curated suite of 47 universal AI agent skills. MIT License."
echo "================================================================"

# ─── 1. Verify Runtime (Bun preferred, Node fallback) ────────────────────────
RUNTIME=""
if command -v bun >/dev/null 2>&1; then
  RUNTIME="bun"
elif command -v node >/dev/null 2>&1; then
  RUNTIME="node"
else
  echo -e "❌ ${YELLOW}Error:${RESET} Neither 'bun' nor 'node' was found in your PATH."
  echo "👉 Please install Bun (https://bun.sh) or Node.js to run the setup engine."
  exit 1
fi

# ─── 2. Interactive Input Helper (Reads /dev/tty even across curl pipes) ────
read_input() {
  local prompt="$1"
  local default_val="$2"
  local __resultvar="$3"
  local user_val=""

  if [ -t 0 ]; then
    read -r -p "$prompt" user_val || true
  elif [ -e /dev/tty ]; then
    read -r -p "$prompt" user_val < /dev/tty || true
  else
    user_val=""
  fi

  if [ -z "$user_val" ]; then
    user_val="$default_val"
  fi

  eval "$__resultvar=\"$user_val\""
}

# ─── 3. Parse CLI Flags or Prompt Interactively ──────────────────────────────
MODE="all"
TARGET="global"
IS_INTERACTIVE=true
SYNC_FLAG=false

for arg in "$@"; do
  case "$arg" in
    --all) MODE="all" ;;
    --skills-only) MODE="skills" ;;
    --commands-only) MODE="commands" ;;
    --sync-agents) SYNC_FLAG=true ;;
    --project) TARGET="project" ;;
    --global) TARGET="global" ;;
    --non-interactive|-y) IS_INTERACTIVE=false ;;
  esac
done

if [ "$IS_INTERACTIVE" = true ] && ([ -t 0 ] || [ -e /dev/tty ]); then
  echo -e "\n${BOLD}Select installation mode:${RESET}"
  echo -e "  ${GREEN}1) Everything (Skills + Native Slash Commands) [Recommended]${RESET}"
  echo "     → Installs all 47 Skills + Native Slash Commands for detected IDEs"
  echo "     → 100% agent & IDE native (zero PATH pollution, zero binaries)"
  echo "  2) All 47 Skills only"
  echo "     → Install skills to ~/.agents/skills/ (or project) for conversational use"
  echo "  3) Native Slash Commands only"
  echo "     → Export native slash commands for detected agent harnesses"
  echo ""

  read_input "Choose an option [1-3] (default: 1): " "1" CHOICE

  case "$CHOICE" in
    1|"") MODE="all" ;;
    2) MODE="skills" ;;
    3) MODE="commands" ;;
    *) echo "Invalid option, defaulting to Everything."; MODE="all" ;;
  esac

  # Target directory prompt if installing skills
  if [ "$MODE" = "all" ] || [ "$MODE" = "skills" ]; then
    echo -e "\n${BOLD}Where should skills be installed?${RESET}"
    echo -e "  ${GREEN}1) Global (~/.agents/skills)${RESET} — Available across all projects on your machine"
    echo "  2) Local project (./.agents/skills) — Scoped only to current working directory"
    echo ""
    read_input "Select target [1-2] (default: 1): " "1" TARGET_CHOICE
    if [ "$TARGET_CHOICE" = "2" ]; then
      TARGET="project"
    else
      TARGET="global"
    fi
  fi
fi

# ─── 4. Ephemeral Sandbox Setup ──────────────────────────────────────────────
TMP_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t 'museskills-setup')"
cleanup() {
  rm -rf "${TMP_DIR}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo -e "\n📥 Fetching latest Muse Skills engine (ephemeral)..."
git clone --depth 1 --quiet https://github.com/harshsinghmp/muse-skills.git "${TMP_DIR}"

# ─── 5. Prepare Flags & Execute Setup Engine ─────────────────────────────────
EXPORT_ARGS=()

if [ "$MODE" = "skills" ]; then
  EXPORT_ARGS+=("--skills-only")
elif [ "$MODE" = "commands" ]; then
  EXPORT_ARGS+=("--commands-only")
fi

if [ "$TARGET" = "project" ]; then
  EXPORT_ARGS+=("--skills-dest" "${ORIGINAL_PWD}/.agents/skills")
else
  EXPORT_ARGS+=("--skills-dest" "${HOME}/.agents/skills")
fi

cd "${TMP_DIR}"
echo -e "⚡ ${CYAN}Running setup engine...${RESET}\n"

if [ "${RUNTIME}" = "bun" ]; then
  bun scripts/export-commands.ts "${EXPORT_ARGS[@]}"
else
  npx ts-node scripts/export-commands.ts "${EXPORT_ARGS[@]}" 2>/dev/null || node -e "
    console.log('⚠️ Running in Node.js fallback mode.');
  "
fi

# ─── 6. Optional Agent Context Modernization (updateagents) ──────────────────
DO_SYNC=false

if [ "$SYNC_FLAG" = true ]; then
  DO_SYNC=true
elif [ "$IS_INTERACTIVE" = true ] && ([ -t 0 ] || [ -e /dev/tty ]); then
  echo ""
  echo -e "${BOLD}${BLUE}🧠 Agent Context & Repository Modernization${RESET}"
  echo "----------------------------------------------------------------"
  echo "Would you like to modernize your workspace's agent instructions via 'updateagents'?"
  echo "  • Preserves 100% of your existing AGENTS.md rules & custom constraints"
  echo "  • Upgrades to Progressive Disclosure DOX architecture (.agents/context/ & standards/)"
  echo "  • Synchronizes 17 canonical engineering rulebooks from ai-ready templates"
  echo "  • Wires the central Secretary agency router into your workspace"
  echo ""
  read_input "Run agent synchronization on current project now? [y/N] (default: n): " "n" SYNC_PROMPT

  case "$SYNC_PROMPT" in
    [yY]|[yY][eE][sS]) DO_SYNC=true ;;
    *) DO_SYNC=false ;;
  esac
fi

if [ "$DO_SYNC" = true ]; then
  echo -e "\n⚡ ${CYAN}Running updateagents context synchronization (preserving all rules)...${RESET}\n"
  if [ "${RUNTIME}" = "bun" ]; then
    bun "${TMP_DIR}/updateagents/scripts/updateagents.ts" "${ORIGINAL_PWD}" || true
  else
    npx ts-node "${TMP_DIR}/updateagents/scripts/updateagents.ts" "${ORIGINAL_PWD}" 2>/dev/null || true
  fi
  echo -e "\n✅ ${GREEN}Agent context synchronized & rules preserved!${RESET}"
fi

echo -e "\n${GREEN}${BOLD}🎉 Installation complete!${RESET}"
echo -e "👉 Your agent harnesses (OpenCode, Antigravity, Cursor, Windsurf) are ready."
echo -e "👉 Start typing '/' in your agent to trigger any of the 47 departments!"
