import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, readdirSync, readFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const REPO_ROOT = join(import.meta.dir, "..");
const AI_READY_TEMPLATES = join(REPO_ROOT, "ai-ready/templates");
const AI_READY_SCRIPT = join(REPO_ROOT, "ai-ready/scripts/ai-ready.ts");
const NEW_PROJECT_SCRIPT = join(REPO_ROOT, "new-project/scripts/new-project.ts");
const UPDATEAGENTS_SCRIPT = join(REPO_ROOT, "updateagents/scripts/updateagents.ts");
const TEST_SANDBOX = join("/tmp", "agent-engine-test-sandbox-" + Date.now());

describe("🏛️ Agent Engine & Multi-Skill Synergy", () => {
  beforeEach(() => {
    rmSync(TEST_SANDBOX, { recursive: true, force: true });
    mkdirSync(TEST_SANDBOX, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_SANDBOX, { recursive: true, force: true });
  });

  describe("Part A: ai-ready as Canonical Home of Agent Engine", () => {
    it("ai-ready/templates exists and houses master templates", () => {
      expect(existsSync(AI_READY_TEMPLATES)).toBe(true);
      expect(existsSync(join(AI_READY_TEMPLATES, "AGENTS.md"))).toBe(true);
      expect(existsSync(join(AI_READY_TEMPLATES, "gitignore.template"))).toBe(true);
      expect(existsSync(join(AI_READY_TEMPLATES, ".agents/standards"))).toBe(true);
      expect(existsSync(join(AI_READY_TEMPLATES, ".agents/brand"))).toBe(true);
      expect(existsSync(join(AI_READY_TEMPLATES, ".agents/context"))).toBe(true);
    });

    it("ai-ready/templates contains all 13 modular standards including backend-wordpress.md", () => {
      const standardsDir = join(AI_READY_TEMPLATES, ".agents/standards");
      const files = readdirSync(standardsDir);
      expect(files.length).toBe(13);
      expect(files).toContain("backend-wordpress.md");
      expect(files).toContain("backend-workers-hono.md");
      expect(files).toContain("frontend-nextjs.md");
      expect(files).toContain("frontend-astro.md");
      expect(files).toContain("tech-stacks.md");

      const wpContent = readFileSync(join(standardsDir, "backend-wordpress.md"), "utf8");
      expect(wpContent).toContain("Roots Bedrock");
      expect(wpContent).toContain("WP-CLI");
      expect(wpContent).toContain("Late Escaping");

      const techContent = readFileSync(join(standardsDir, "tech-stacks.md"), "utf8");
      expect(techContent).toContain("Direction 4: Modern WordPress");
    });

    it("ai-ready CLI script supports --audit and --scaffold", () => {
      // 1. Audit on empty sandbox should report missing assets
      const auditRes = spawnSync("bun", [AI_READY_SCRIPT, TEST_SANDBOX, "--audit"], { encoding: "utf8" });
      expect(auditRes.status).toBe(0);
      expect(auditRes.stdout).toContain("AI-READY AUDIT REPORT");

      // 2. Scaffold on sandbox should provision the full Agent Engine
      const scaffoldRes = spawnSync("bun", [AI_READY_SCRIPT, TEST_SANDBOX, "--scaffold"], { encoding: "utf8" });
      expect(scaffoldRes.status).toBe(0);
      expect(scaffoldRes.stdout).toContain("Agent Engine successfully provisioned");

      expect(existsSync(join(TEST_SANDBOX, "AGENTS.md"))).toBe(true);
      expect(existsSync(join(TEST_SANDBOX, ".agents/standards/backend-wordpress.md"))).toBe(true);
      expect(existsSync(join(TEST_SANDBOX, ".agents/brand/tokens"))).toBe(true);
    });
  });

  describe("Part B: new-project Framework Creation & Intent-First Configurator", () => {
    it("new-project copies Agent Engine from ai-ready/templates and supports wordpress archetype", () => {
      const target = join(TEST_SANDBOX, "wp-agency");
      const res = spawnSync("bun", [NEW_PROJECT_SCRIPT, target, "--non-interactive", "-t", "wordpress", "--dry-run"], {
        encoding: "utf8",
      });

      expect(res.status).toBe(0);
      expect(res.stdout).toContain("Initializing Agent Governance & Progressive Disclosure DOX (from ai-ready/templates)");
      expect(res.stdout).toContain("Archetype:          WORDPRESS");
      expect(res.stdout).toContain("Synced: ./.agents/standards/ (13 standards, including WordPress)");
    });

    it("supports 1-Click Agency Presets (powerhouse, visual, instatic, mobile)", () => {
      // 1. Powerhouse preset
      const targetPower = join(TEST_SANDBOX, "power-test");
      const resPower = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetPower, "--non-interactive", "--preset=powerhouse", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resPower.status).toBe(0);
      expect(resPower.stdout).toContain("Framework:         `NEXTJS`");
      expect(resPower.stdout).toContain("Styling:           `HYBRID`");
      expect(resPower.stdout).toContain("CMS:               `PAYLOAD + PUCK VISUAL BUILDER`");
      expect(resPower.stdout).toContain("Database:          `NEON`");

      // 2. Visual preset (Aria Builder)
      const targetVisual = join(TEST_SANDBOX, "visual-test");
      const resVisual = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetVisual, "--non-interactive", "--preset=visual", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resVisual.status).toBe(0);
      expect(resVisual.stdout).toContain("Framework:         `ASTRO`");
      expect(resVisual.stdout).toContain("CMS:               `ARIABUILDER`");
      expect(resVisual.stdout).toContain("E-Commerce:        `FASTRR`");

      // 3. Instatic preset
      const targetInstatic = join(TEST_SANDBOX, "instatic-test");
      const resInstatic = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetInstatic, "--non-interactive", "--preset=instatic", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resInstatic.status).toBe(0);
      expect(resInstatic.stdout).toContain("Framework:         `INSTATIC`");
      expect(resInstatic.stdout).toContain("Styling:           `BEM`");

      // 4. Mobile preset (Expo)
      const targetMobile = join(TEST_SANDBOX, "mobile-test");
      const resMobile = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetMobile, "--non-interactive", "--preset=mobile", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resMobile.status).toBe(0);
      expect(resMobile.stdout).toContain("Framework:         `EXPO`");
      expect(resMobile.stdout).toContain("Mobile:            `EXPO`");

      // 5. Astro Mobile preset (Astro + Ionic Capacitor + NanoStores)
      const targetAstroMobile = join(TEST_SANDBOX, "astro-mobile-test");
      const resAstroMobile = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetAstroMobile, "--non-interactive", "--preset=astro-mobile", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resAstroMobile.status).toBe(0);
      expect(resAstroMobile.stdout).toContain("Framework:         `ASTRO`");
      expect(resAstroMobile.stdout).toContain("State:             `NANOSTORES`");
      expect(resAstroMobile.stdout).toContain("Mobile:            `CAPACITOR`");
    });

    it("supports granular intent-first companion composition including NanoStores and Capacitor", () => {
      const targetCustom = join(TEST_SANDBOX, "custom-ecommerce");
      const res = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetCustom,
        "--non-interactive",
        "--intent=ecommerce",
        "--type=nextjs",
        "--styling=hybrid",
        "--animation=motion",
        "--state=nanostores",
        "--mobile=capacitor",
        "--cms=payload",
        "--puck",
        "--ecommerce=medusa",
        "--db=postgres",
        "--auth=better-auth",
        "--dry-run"
      ], { encoding: "utf8" });

      expect(res.status).toBe(0);
      expect(res.stdout).toContain("Intent:            `ECOMMERCE`");
      expect(res.stdout).toContain("Framework:         `NEXTJS`");
      expect(res.stdout).toContain("Styling:           `HYBRID`");
      expect(res.stdout).toContain("Animations:        `MOTION`");
      expect(res.stdout).toContain("State:             `NANOSTORES`");
      expect(res.stdout).toContain("Mobile:            `CAPACITOR`");
      expect(res.stdout).toContain("CMS:               `PAYLOAD`");
      expect(res.stdout).toContain("E-Commerce:        `MEDUSA`");
      expect(res.stdout).toContain("Database:          `POSTGRES`");
    });
  });

  describe("Part C: updateagents Scaffolding, Merging & Reporting", () => {
    it("updateagents scaffolds fresh Agent Engine on empty directory", () => {
      const target = join(TEST_SANDBOX, "fresh-project");
      mkdirSync(target, { recursive: true });

      const res = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target], { encoding: "utf8" });
      expect(res.status).toBe(0);
      expect(res.stdout).toContain("Step 4A: No agent files detected — Scaffolding fresh Agent Engine DOX container");
      expect(res.stdout).toContain("UPDATEAGENTS SYNCHRONIZATION REPORT");
      expect(res.stdout).toContain("SCAFFOLDED ASSETS");

      expect(existsSync(join(target, "AGENTS.md"))).toBe(true);
      expect(existsSync(join(target, ".agents/standards/backend-wordpress.md"))).toBe(true);
    });

    it("updateagents parses custom legacy files, maps context intelligently, and archives original", () => {
      const target = join(TEST_SANDBOX, "legacy-project");
      mkdirSync(target, { recursive: true });

      // Create a legacy CLAUDE.md with custom content
      writeFileSync(
        join(target, "CLAUDE.md"),
        `# Project Context
## Overview
Custom billing engine for healthcare providers.

## Commands
- npm run test:unit to run test suite
- npm run deploy:prod

## Architectural Decisions
- Mandatory HIPAA compliance audit.
- No direct SQL queries.
`,
        "utf8"
      );

      const res = spawnSync("bun", [UPDATEAGENTS_SCRIPT, target], { encoding: "utf8" });
      expect(res.status).toBe(0);
      expect(res.stdout).toContain("Step 4B: Custom agent files detected — Extracting and intelligently placing context");
      expect(res.stdout).toContain("Merged custom content into ./.agents/context/product.md");
      expect(res.stdout).toContain("Merged custom content into ./.agents/context/architecture.md");
      expect(res.stdout).toContain("Merged custom content into ./.agents/context/decisions.md");
      expect(res.stdout).toContain("Archived CLAUDE.md");

      // Verify custom content exists in context files
      const productContent = readFileSync(join(target, ".agents/context/product.md"), "utf8");
      expect(productContent).toContain("Custom billing engine for healthcare providers");

      const archContent = readFileSync(join(target, ".agents/context/architecture.md"), "utf8");
      expect(archContent).toContain("npm run test:unit");

      const decisionsContent = readFileSync(join(target, ".agents/context/decisions.md"), "utf8");
      expect(decisionsContent).toContain("Mandatory HIPAA compliance audit");

      // Verify CLAUDE.md was moved to archive and not in root
      expect(existsSync(join(target, "CLAUDE.md"))).toBe(false);
      const archiveFiles = readdirSync(join(target, ".agents/archive"));
      expect(archiveFiles.some((f) => f.startsWith("CLAUDE.legacy-"))).toBe(true);
    });
  });

  describe("Part D: handoff & gauntlet-loop Upgrades", () => {
    it("handoff contains session resumption and zero .claude references", () => {
      const handoffContent = readFileSync(join(REPO_ROOT, "handoff/SKILL.md"), "utf8");
      expect(handoffContent).toContain("Inbound Session Resumption");
      expect(handoffContent).toContain("where were we");
      expect(handoffContent).toContain("directory-boundary");
      expect(handoffContent).not.toContain(".claude/");
      expect(existsSync(join(REPO_ROOT, "handoff/references/resumption-protocol.md"))).toBe(true);
    });

    it("gauntlet-loop contains 'The Bar is the Whole Trick' and blind A/B critique", () => {
      const gauntletContent = readFileSync(join(REPO_ROOT, "gauntlet-loop/SKILL.md"), "utf8");
      expect(gauntletContent).toContain("The Bar is the Whole Trick");
      expect(gauntletContent).toContain("Blind A/B");
      expect(gauntletContent).toContain("Prompt Synthesizer Mode");
      expect(existsSync(join(REPO_ROOT, "gauntlet-loop/references/bar-selection-and-blind-critique.md"))).toBe(true);
    });
  });
});
