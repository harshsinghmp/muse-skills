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

  describe("Part E: Interactive Onboarding & Clean Template Invariants", () => {
    it("new-project dynamically injects onboarding parameters into DOX files and brand tokens", () => {
      const target = join(TEST_SANDBOX, "acme-health");
      const res = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        target,
        "--non-interactive",
        "--name=Acme Health",
        "--author=Acme Corp",
        "--tagline=HIPAA-compliant patient intake portal",
        "--audience=Hospitals and regional clinics",
        "--problem=Manual paper intake bottlenecks",
        "--features=Intake Automation, EHR Sync, Secure Chat",
        "--tone=Medical-Grade, Authoritative, Empathetic",
        "--palette=emerald",
        "--first-milestone=Implement EHR webhook listener",
        "--planned-milestones=Patient onboarding flow, HIPAA audit log",
        "--agent-name=Sentinel",
        "--agent-role=Lead Healthcare Architect",
        "--constraint=Zero client-side PHI storage",
        "--intent=app",
        "--type=none"
      ], { encoding: "utf8" });

      expect(res.status).toBe(0);

      // Verify AGENTS.md
      const agentsMd = readFileSync(join(target, "AGENTS.md"), "utf8");
      expect(agentsMd).toContain("Acme Health");
      expect(agentsMd).toContain("HIPAA-compliant patient intake portal");
      expect(agentsMd).toContain("Sentinel");
      expect(agentsMd).toContain("Lead Healthcare Architect");

      // Verify .agents/context/product.md
      const productMd = readFileSync(join(target, ".agents/context/product.md"), "utf8");
      expect(productMd).toContain("Hospitals and regional clinics");
      expect(productMd).toContain("Manual paper intake bottlenecks");
      expect(productMd).toContain("Intake Automation");

      // Verify .agents/context/brand.md
      const brandMd = readFileSync(join(target, ".agents/context/brand.md"), "utf8");
      expect(brandMd).toContain("Medical-Grade, Authoritative, Empathetic");
      expect(brandMd).toContain("EMERALD");

      // Verify .agents/context/roadmap.md
      const roadmapMd = readFileSync(join(target, ".agents/context/roadmap.md"), "utf8");
      expect(roadmapMd).toContain("Implement EHR webhook listener");
      expect(roadmapMd).toContain("Patient onboarding flow");

      // Verify .agents/brand/tokens/colors.json has emerald palette
      const colorsJson = JSON.parse(readFileSync(join(target, ".agents/brand/tokens/colors.json"), "utf8"));
      expect(colorsJson.color.primary.default.$value).toBe("oklch(0.55 0.18 150)");

      // Verify .memory/CURRENT.md
      const currentMd = readFileSync(join(target, ".memory/CURRENT.md"), "utf8");
      expect(currentMd).toContain("Zero client-side PHI storage");
      expect(currentMd).toContain("Sentinel");
      expect(currentMd).toContain("Implement EHR webhook listener");

      // Verify start-here.md and Onboarding
      expect(existsSync(join(target, "start-here.md"))).toBe(true);
      expect(existsSync(join(target, "Onboarding/01-Brand/brand-identity.md"))).toBe(true);
      expect(existsSync(join(target, "Onboarding/02-Business/business-model.md"))).toBe(true);
      expect(existsSync(join(target, "Onboarding/03-Menu/offerings.md"))).toBe(true);
    });

    it("provisions beginner-friendly start-here.md, Onboarding suite, fluid tokens, and BEM semantic classes", () => {
      const target = join(TEST_SANDBOX, "ecommerce-showcase");
      const res = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        target,
        "--non-interactive",
        "--name=Sovereign Store",
        "--author=Acme Retail",
        "--intent=ecommerce",
        "--type=none",
        "--styling=hybrid",
        "--animation=css",
        "--state=nanostores",
        "--ecommerce=medusa",
        "--palette=indigo",
        "--first-milestone=Setup Medusa v2 SDK",
        "--industry=Direct to Consumer Apparel",
        "--offerings=Signature Denim, Classic Hoodies, Oxford Shirts"
      ], { encoding: "utf8" });

      expect(res.status).toBe(0);

      // 1. Verify start-here.md exists and contains all 7 sections
      const startHerePath = join(target, "start-here.md");
      expect(existsSync(startHerePath)).toBe(true);
      const startHereContent = readFileSync(startHerePath, "utf8");
      expect(startHereContent).toContain("1. Welcome & Architecture Snapshot");
      expect(startHereContent).toContain("2. Prerequisites & Quick Start");
      expect(startHereContent).toContain("3. Project Structure Tour");
      expect(startHereContent).toContain("4. How Styling & Design Tokens Work");
      expect(startHereContent).toContain("5. Working with AI Agents");
      expect(startHereContent).toContain("6. Common Tasks & Recipes");
      expect(startHereContent).toContain("7. Verification & Definition of Done");

      // 2. Verify Onboarding 3-folder structure and artifacts
      expect(existsSync(join(target, "Onboarding/01-Brand/brand-identity.md"))).toBe(true);
      expect(existsSync(join(target, "Onboarding/01-Brand/visual-direction.md"))).toBe(true);
      expect(existsSync(join(target, "Onboarding/02-Business/business-model.md"))).toBe(true);
      expect(existsSync(join(target, "Onboarding/02-Business/audience-persona.md"))).toBe(true);
      expect(existsSync(join(target, "Onboarding/03-Menu/offerings.md"))).toBe(true);

      const brandIdentity = readFileSync(join(target, "Onboarding/01-Brand/brand-identity.md"), "utf8");
      expect(brandIdentity).toContain("Sovereign Store");
      expect(brandIdentity).toContain("Direct to Consumer Apparel");

      const offeringsMd = readFileSync(join(target, "Onboarding/03-Menu/offerings.md"), "utf8");
      expect(offeringsMd).toContain("Signature Denim");

      // 3. Verify OKLCH tokens and fluid clamp scales in src/styles/tokens.css
      const tokensCssPath = join(target, "src/styles/tokens.css");
      expect(existsSync(tokensCssPath)).toBe(true);
      const tokensCss = readFileSync(tokensCssPath, "utf8");
      expect(tokensCss).toContain("oklch(");
      expect(tokensCss).toContain("--font-size-base: clamp(");
      expect(tokensCss).toContain("--spacing-md: clamp(");

      // 4. Verify Semantic BEM classes in src/styles/semantic.css
      const semanticCssPath = join(target, "src/styles/semantic.css");
      expect(existsSync(semanticCssPath)).toBe(true);
      const semanticCss = readFileSync(semanticCssPath, "utf8");
      expect(semanticCss).toContain(".c-button");
      expect(semanticCss).toContain(".c-button--primary");
      expect(semanticCss).toContain(".c-card");
      expect(semanticCss).toContain(".c-product-grid");
      expect(semanticCss).toContain(".c-product-card");
      expect(semanticCss).toContain(".c-cart-drawer");

      // 5. Verify auto-wired config files
      expect(existsSync(join(target, "uno.config.ts"))).toBe(true);
      expect(existsSync(join(target, "src/lib/medusa.ts"))).toBe(true);
      expect(existsSync(join(target, ".env.example"))).toBe(true);
      const envExample = readFileSync(join(target, ".env.example"), "utf8");
      expect(envExample).toContain("MEDUSA_BACKEND_URL");

      // 6. Verify Medusa 2.0 full sovereign backend engine
      expect(existsSync(join(target, "backend/medusa-config.ts"))).toBe(true);
      expect(existsSync(join(target, "backend/docker-compose.yml"))).toBe(true);
      expect(existsSync(join(target, "backend/package.json"))).toBe(true);
      expect(existsSync(join(target, "backend/tsconfig.json"))).toBe(true);
      expect(existsSync(join(target, "backend/.env.example"))).toBe(true);
      expect(existsSync(join(target, "backend/src/api/index.ts"))).toBe(true);

      const medusaConfig = readFileSync(join(target, "backend/medusa-config.ts"), "utf8");
      expect(medusaConfig).toContain("defineConfig");
      expect(medusaConfig).toContain("databaseUrl");

      const backendPkg = JSON.parse(readFileSync(join(target, "backend/package.json"), "utf8"));
      expect(backendPkg.dependencies["@medusajs/medusa"]).toBeDefined();
      expect(backendPkg.dependencies["@medusajs/framework"]).toBeDefined();

      const dockerCompose = readFileSync(join(target, "backend/docker-compose.yml"), "utf8");
      expect(dockerCompose).toContain("postgres:16-alpine");
      expect(dockerCompose).toContain("redis:7-alpine");

      expect(startHereContent).toContain("E-Commerce Sovereign Backend (Medusa 2.0) Setup");
      expect(startHereContent).toContain("Managing the Medusa E-Commerce Backend");
    });

    it("verifies zero personal details or agency leaks remain in ai-ready/templates", () => {
      const prohibited = [
        "Harsh",
        "harshsinghmp",
        "Agency Council",
        "Kameli",
        "/home/harsh",
        "~/.config/LIFEOS"
      ];

      function scanDir(dir: string) {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          if (entry.isDirectory()) {
            scanDir(fullPath);
          } else if (entry.isFile()) {
            const content = readFileSync(fullPath, "utf8");
            for (const word of prohibited) {
              expect(content.includes(word)).toBe(
                false
              );
            }
          }
        }
      }

      scanDir(AI_READY_TEMPLATES);
    });
  });
});
