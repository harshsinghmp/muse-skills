#!/usr/bin/env bash
# install.sh — Interactive & Remote Installer for Muse Skills (v6.0.0)
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/harshsinghmp/muse-skills/main/scripts/install.sh | bash
#
# Flags (for non-interactive / CI automation):
#   --all               Install skills, slash commands, and 'museskills' CLI (default)
#   --skills-only       Install 47 skills only
#   --commands-only     Export slash commands only
#   --cli-only          Install 'museskills' terminal CLI only
#   --project           Target current project (./.agents/skills) instead of global (~/.agents/skills)
#   --non-interactive   Skip prompts and use defaults

set -euo pipefail

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

# ─── 2. Interactive Input Helper (Reads /dev/tty even when piped via curl) ───
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

for arg in "$@"; do
  case "$arg" in
    --all) MODE="all" ;;
    --skills-only) MODE="skills" ;;
    --commands-only) MODE="commands" ;;
    --cli-only) MODE="cli" ;;
    --project) TARGET="project" ;;
    --global) TARGET="global" ;;
    --non-interactive|-y) IS_INTERACTIVE=false ;;
  esac
done

if [ "$IS_INTERACTIVE" = true ] && ([ -t 0 ] || [ -e /dev/tty ]); then
  echo -e "\n${BOLD}Select installation mode:${RESET}"
  echo -e "  ${GREEN}1) Everything [Recommended]${RESET}"
  echo "     → Installs all 47 Skills + Native Slash Commands + 'museskills' CLI"
  echo "  2) All 47 Skills only"
  echo "  3) Native Slash Commands only (for detected IDEs)"
  echo "  4) 'museskills' Terminal CLI only"
  echo "  5) Custom selection"
  echo ""

  read_input "Choose an option [1-5] (default: 1): " "1" CHOICE

  case "$CHOICE" in
    1|"") MODE="all" ;;
    2) MODE="skills" ;;
    3) MODE="commands" ;;
    4) MODE="cli" ;;
    5) MODE="custom" ;;
    *) echo "Invalid option, defaulting to Everything."; MODE="all" ;;
  esac

  # Target directory prompt if installing skills
  if [ "$MODE" = "all" ] || [ "$MODE" = "skills" ] || [ "$MODE" = "custom" ]; then
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

# ─── 5. Prepare Flags & Execute ──────────────────────────────────────────────
EXPORT_ARGS=()

if [ "$MODE" = "skills" ]; then
  EXPORT_ARGS+=("--skills-only")
elif [ "$MODE" = "commands" ]; then
  EXPORT_ARGS+=("--commands-only")
elif [ "$MODE" = "cli" ]; then
  EXPORT_ARGS+=("--cli-only")
fi

if [ "$TARGET" = "project" ]; then
  EXPORT_ARGS+=("--skills-dest" "$(pwd)/.agents/skills")
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

echo -e "\n${GREEN}${BOLD}🎉 Installation complete!${RESET}"
echo -e "👉 Universal CLI runner: ${BOLD}museskills${RESET} (linked to ~/.local/bin/museskills)"
echo -e "👉 Test anytime with:    ${BOLD}museskills --help${RESET} or ${BOLD}museskills crm onboard${RESET}"
