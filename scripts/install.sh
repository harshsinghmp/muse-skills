#!/usr/bin/env bash
# install.sh — Interactive & Remote Installer for Muse Skills (v8.7.1)
# Usage (pinned tag, not a mutable branch):
#   curl -fsSL https://raw.githubusercontent.com/harshsinghmp/muse-skills/v8.7.1/scripts/install.sh | bash
#
# Supply-chain overrides:
#   MUSE_SKILLS_REF=<tag>     install from this git tag (default: the latest release)
#   MUSE_SKILLS_COMMIT=<sha>  require the checkout to match this commit
#   MUSE_SKILLS_ALLOW_UNVERIFIED=1  proceed when a release has no checksum asset (not recommended)
#
# Flags (for non-interactive / CI automation):
#   --all                 Install all 46 skills & native slash commands (default)
#   --skills-only         Install 46 skills only
#   --commands-only       Export slash commands only
#   --sync-agents         Automatically run updateagents to modernize workspace context
#   --new-project [dir]   Automatically launch new-project scaffolder in specified directory
#   --project             Target current project (./.agents/skills) instead of global (~/.agents/skills)
#   --global              Target global (~/.agents/skills)
#   --non-interactive     Skip prompts and use defaults

set -euo pipefail

ORIGINAL_PWD="$(pwd)"

# Default to the LATEST published release; PINNED_REF is only the fallback when
# the releases API is unreachable, and is the version this installer was cut
# from. Whichever tag is chosen is still verified against that release's
# checksums asset, so "latest" never means "unverified".
PINNED_REF="v8.7.1"
LATEST_REF=""
if [ -z "${MUSE_SKILLS_REF:-}" ]; then
  LATEST_REF="$(curl -fsSL --max-time 10 \
    https://api.github.com/repos/harshsinghmp/muse-skills/releases/latest 2>/dev/null \
    | sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1 || true)"
fi
MUSE_SKILLS_REF="${MUSE_SKILLS_REF:-${LATEST_REF:-$PINNED_REF}}"
MUSE_SKILLS_COMMIT="${MUSE_SKILLS_COMMIT:-}"
if [ "$MUSE_SKILLS_REF" = "v8.3.0" ] && [ -z "$MUSE_SKILLS_COMMIT" ]; then
  MUSE_SKILLS_COMMIT="5c91a309d64f568c1e957110832a38d471ee568e"
fi

# ─── Terminal Styling ────────────────────────────────────────────────────────
BOLD="\033[1m"
GREEN="\033[32m"
BLUE="\033[34m"
YELLOW="\033[33m"
CYAN="\033[36m"
RESET="\033[0m"

echo -e "${BOLD}${BLUE}🏛️  Muse Skills Universal Installer (v8.7.1)${RESET}"
echo -e "Curated suite of 46 universal AI agent skills. MIT License."
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

  # nameref assignment — never eval user input (hostile tty strings are code otherwise)
  printf -v "$__resultvar" '%s' "$user_val"
}

# ─── 3. Parse CLI Flags or Prompt Interactively ──────────────────────────────
MODE="all"
TARGET="global"
IS_INTERACTIVE=true
SYNC_FLAG=false
ONBOARD_FLAG=false
DO_NEW_PROJECT_FLAG=false
NEW_PROJECT_ARG=""

while [ $# -gt 0 ]; do
  case "$1" in
    --all) MODE="all"; shift ;;
    --skills-only) MODE="skills"; shift ;;
    --commands-only) MODE="commands"; shift ;;
    --sync-agents) SYNC_FLAG=true; shift ;;
    --onboard) ONBOARD_FLAG=true; shift ;;
    --new-project)
      DO_NEW_PROJECT_FLAG=true
      if [ $# -gt 1 ] && [[ "$2" != --* ]]; then
        NEW_PROJECT_ARG="$2"
        shift 2
      else
        NEW_PROJECT_ARG="./my-agent-app"
        shift
      fi
      ;;
    --new-project=*)
      DO_NEW_PROJECT_FLAG=true
      NEW_PROJECT_ARG="${1#*=}"
      shift
      ;;
    --project) TARGET="project"; shift ;;
    --global) TARGET="global"; shift ;;
    --non-interactive|-y) IS_INTERACTIVE=false; shift ;;
    *) shift ;;
  esac
done

if [ "$IS_INTERACTIVE" = true ] && ([ -t 0 ] || [ -e /dev/tty ]); then
  echo -e "\n${BOLD}Select installation mode:${RESET}"
  echo -e "  ${GREEN}1) Everything (Skills + Native Slash Commands) [Recommended]${RESET}"
  echo "     → Installs all 46 Skills + Native Slash Commands for detected IDEs"
  echo "     → 100% agent & IDE native (zero PATH pollution, zero binaries)"
  echo "  2) All 46 Skills only"
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

echo -e "\n📥 Fetching Muse Skills engine ${MUSE_SKILLS_REF} (ephemeral, pinned)..."
git clone --depth 1 --branch "${MUSE_SKILLS_REF}" --quiet https://github.com/harshsinghmp/muse-skills.git "${TMP_DIR}"

ACTUAL_COMMIT="$(git -C "${TMP_DIR}" rev-parse HEAD)"
if [ -z "${MUSE_SKILLS_COMMIT}" ]; then
  # Verify against the release's checksums asset. The asset is generated by
  # release.yml from the tagged commit, so it is not self-referential.
  CHECKSUMS_URL="https://github.com/harshsinghmp/muse-skills/releases/download/${MUSE_SKILLS_REF}/checksums.txt"
  MUSE_SKILLS_COMMIT="$(curl -fsSL "${CHECKSUMS_URL}" 2>/dev/null | awk '$2 == "source-commit" { print $1; exit }' || true)"
fi
if [ -n "${MUSE_SKILLS_COMMIT}" ] && [ "${ACTUAL_COMMIT}" != "${MUSE_SKILLS_COMMIT}" ]; then
  echo -e "❌ Refusing to run: ${MUSE_SKILLS_REF} resolved to ${ACTUAL_COMMIT}, expected ${MUSE_SKILLS_COMMIT}." >&2
  exit 1
fi
if [ -z "${MUSE_SKILLS_COMMIT}" ]; then
  if [ "${MUSE_SKILLS_ALLOW_UNVERIFIED:-}" != "1" ]; then
    echo -e "❌ No checksum asset found for ${MUSE_SKILLS_REF}; refusing to run an unverified tag." >&2
    echo -e "   Set MUSE_SKILLS_COMMIT=<sha> or MUSE_SKILLS_ALLOW_UNVERIFIED=1 to override." >&2
    exit 1
  fi
  echo -e "⚠️  No checksum verified for ${MUSE_SKILLS_REF}; proceeding at ${ACTUAL_COMMIT} (override)." >&2
fi

# Pinned TypeScript runner for the Node fallback (never a floating npx package).
run_ts() {
  if [ "${RUNTIME}" = "bun" ]; then
    bun "$@"
  else
    npx --yes tsx@4.19.2 "$@"
  fi
}

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

if ! run_ts scripts/export-commands.ts "${EXPORT_ARGS[@]}"; then
  echo -e "❌ Setup engine failed. Aborting; no success message was printed." >&2
  exit 1
fi

# 5.1 Verify what was just installed, and repair what the check can repair.
# Running this here means an install never finishes "successfully" with a
# surface that does not resolve.
echo -e "\n🩺 Verifying the install…"
if run_ts skills/core-engine/updateagents/scripts/doctor.ts --fix; then
  echo -e "✅ Install verified."
else
  echo -e "⚠️  Doctor reported problems it could not repair — run it again for details:"
  echo -e "   bun skills/core-engine/updateagents/scripts/doctor.ts"
fi

# ─── 5.5 Optional Global Identity Onboarding ─────────────────────────────────
DO_ONBOARD=false
if [ "$ONBOARD_FLAG" = true ]; then
  DO_ONBOARD=true
elif [ "$IS_INTERACTIVE" = true ] && [ ! -f "${HOME}/.agents/identity/user.md" ] && ([ -t 0 ] || [ -e /dev/tty ]); then
  echo ""
  echo -e "${BOLD}${BLUE}🧭 Global Agent Identity & Vision Onboarding (~/.agents/identity/)${RESET}"
  echo "----------------------------------------------------------------"
  echo "Would you like to initialize your Global Agent Identity & Strategic Vision?"
  echo "  • Establishes principal superpowers, communication style, and assistant stance"
  echo "  • Calibrates your Strategic Vision (Current State ➔ Target Vision ➔ 90-Day Milestones)"
  echo "  • Inherited by all projects automatically via Progressive Disclosure DOX"
  echo ""
  read_input "Run global identity onboarding now? [y/N] (default: n): " "n" ONBOARD_PROMPT

  case "$ONBOARD_PROMPT" in
    [yY]|[yY][eE][sS]) DO_ONBOARD=true ;;
    *) DO_ONBOARD=false ;;
  esac
fi

if [ "$DO_ONBOARD" = true ]; then
  echo -e "\n⚡ ${CYAN}Launching Global Identity Onboarding Wizard...${RESET}\n"
  if ! run_ts "${TMP_DIR}/skills/core-engine/updateagents/scripts/updateagents.ts" --onboard --global; then
    echo -e "❌ Global identity onboarding failed." >&2
    exit 1
  fi
fi

# ─── 6. Optional Agent Context Modernization (updateagents) ──────────────────
DO_SYNC=false

if [ "$SYNC_FLAG" = true ]; then
  DO_SYNC=true
elif [ "$IS_INTERACTIVE" = true ] && ([ -t 0 ] || [ -e /dev/tty ]); then
  echo ""
  echo -e "${BOLD}${BLUE}🧠 Agent Context & Repository Modernization (updateagents)${RESET}"
  echo "----------------------------------------------------------------"
  echo "Would you like to modernize your workspace's agent instructions via 'updateagents'?"
  echo "  • Preserves 100% of your existing AGENTS.md rules & custom constraints"
  echo "  • Upgrades to Progressive Disclosure DOX architecture (.agents/context/ & standards/)"
  echo "  • Synchronizes 17 canonical engineering rulebooks from updateagents templates"
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
  if ! run_ts "${TMP_DIR}/skills/core-engine/updateagents/scripts/updateagents.ts" "${ORIGINAL_PWD}"; then
    echo -e "❌ Agent context synchronization failed." >&2
    exit 1
  fi
  echo -e "\n✅ ${GREEN}Agent context synchronized & rules preserved!${RESET}"
fi

# ─── 7. Optional New Project Scaffolding (new-project) ───────────────────────
DO_NEW_PROJECT=false
NEW_PROJECT_DIR=""

if [ "$DO_NEW_PROJECT_FLAG" = true ]; then
  DO_NEW_PROJECT=true
  NEW_PROJECT_DIR="${NEW_PROJECT_ARG:-./my-agent-app}"
elif [ "$IS_INTERACTIVE" = true ] && ([ -t 0 ] || [ -e /dev/tty ]); then
  echo ""
  echo -e "${BOLD}${BLUE}🚀 Purpose-First Project Scaffolding (new-project)${RESET}"
  echo "----------------------------------------------------------------"
  echo "Would you like to scaffold a new project to start afresh with 'new-project'?"
  echo "  • Purpose-First decision engine (Next.js 16, Astro, Expo, WordPress, HTML)"
  echo "  • Complete Agent Engine DOX rail (AGENTS.md, .agents/ standards & context)"
  echo "  • Modern design tokens (wide-gamut OKLCH + clamp) & client intake brief"
  echo ""
  read_input "Scaffold a new project now? [y/N] (default: n): " "n" NEW_PROJECT_PROMPT

  case "$NEW_PROJECT_PROMPT" in
    [yY]|[yY][eE][sS])
      DO_NEW_PROJECT=true
      read_input "Enter target directory for the new project (default: ./my-agent-app): " "./my-agent-app" NEW_PROJECT_DIR
      ;;
    *) DO_NEW_PROJECT=false ;;
  esac
fi

if [ "$DO_NEW_PROJECT" = true ] && [ -n "$NEW_PROJECT_DIR" ]; then
  if [[ "$NEW_PROJECT_DIR" = /* ]]; then
    RESOLVED_PROJECT_DIR="$NEW_PROJECT_DIR"
  else
    RESOLVED_PROJECT_DIR="${ORIGINAL_PWD}/${NEW_PROJECT_DIR}"
  fi

  case "$RESOLVED_PROJECT_DIR" in
    "$ORIGINAL_PWD"|"$ORIGINAL_PWD"/*) ;;
    *)
      echo "Error: --new-project must stay inside ${ORIGINAL_PWD}." >&2
      exit 1
      ;;
  esac

  echo -e "\n⚡ ${CYAN}Launching new-project interactive scaffolder...${RESET}\n"
  if ! run_ts "${TMP_DIR}/skills/core-engine/new-project/scripts/new-project.ts" "$RESOLVED_PROJECT_DIR"; then
    echo -e "❌ New project scaffolding failed." >&2
    exit 1
  fi
  echo -e "\n✅ ${GREEN}New project scaffolded successfully at: ${RESOLVED_PROJECT_DIR}${RESET}"
fi

echo -e "\n${GREEN}${BOLD}🎉 Installation complete!${RESET}"
echo -e "👉 Your agent harnesses (OpenCode, Antigravity, Cursor, Windsurf) are ready."
echo -e "👉 Start typing '/' in your agent to trigger any of the 46 departments!"
