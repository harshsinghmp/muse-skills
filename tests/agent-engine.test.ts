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

      // 6. Astro Commerce preset (Astro + Aria Builder + Medusa v2)
      const targetAstroComm = join(TEST_SANDBOX, "astro-comm-test");
      const resAstroComm = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetAstroComm, "--non-interactive", "--preset=astro-commerce", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resAstroComm.status).toBe(0);
      expect(resAstroComm.stdout).toContain("Framework:         `ASTRO`");
      expect(resAstroComm.stdout).toContain("CMS:               `ARIABUILDER`");
      expect(resAstroComm.stdout).toContain("E-Commerce:        `MEDUSA`");

      // 7. Astro Blog preset (Astro + StudioCMS)
      const targetAstroBlog = join(TEST_SANDBOX, "astro-blog-test");
      const resAstroBlog = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetAstroBlog, "--non-interactive", "--preset=astro-blog", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resAstroBlog.status).toBe(0);
      expect(resAstroBlog.stdout).toContain("Framework:         `ASTRO`");
      expect(resAstroBlog.stdout).toContain("CMS:               `STUDIOCMS`");

      // 8. Astro Emdash preset (Astro + Emdash CMS)
      const targetAstroEmdash = join(TEST_SANDBOX, "astro-emdash-test");
      const resAstroEmdash = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetAstroEmdash, "--non-interactive", "--preset=astro-emdash", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resAstroEmdash.status).toBe(0);
      expect(resAstroEmdash.stdout).toContain("Framework:         `ASTRO`");
      expect(resAstroEmdash.stdout).toContain("CMS:               `EMDASH`");

      // 9. Pure HTML preset
      const targetPureHtml = join(TEST_SANDBOX, "pure-html-test");
      const resPureHtml = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetPureHtml, "--non-interactive", "--preset=pure-html", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resPureHtml.status).toBe(0);
      expect(resPureHtml.stdout).toContain("Framework:         `HTML`");
      expect(resPureHtml.stdout).toContain("Styling:           `BEM`");

      // 10. Next Commerce preset
      const targetNextComm = join(TEST_SANDBOX, "next-comm-test");
      const resNextComm = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetNextComm, "--non-interactive", "--preset=next-commerce", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resNextComm.status).toBe(0);
      expect(resNextComm.stdout).toContain("Framework:         `NEXTJS`");
      expect(resNextComm.stdout).toContain("CMS:               `PAYLOAD + PUCK VISUAL BUILDER`");
      expect(resNextComm.stdout).toContain("E-Commerce:        `PAYLOAD`");
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

    it("provisions complete end-to-end implementations for Drizzle, Better Auth, Stripe, Payload, and Puck", () => {
      const target = join(TEST_SANDBOX, "fullbaked-showcase");
      const res = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        target,
        "--non-interactive",
        "--name=Fullstack Powerhouse",
        "--author=Enterprise Systems",
        "--intent=app",
        "--type=none",
        "--styling=hybrid",
        "--db=postgres",
        "--auth=better-auth",
        "--ecommerce=stripe",
        "--cms=payload",
        "--puck",
        "--skip-install"
      ], { encoding: "utf8" });

      expect(res.status).toBe(0);

      // 1. Drizzle ORM typed schema & client
      expect(existsSync(join(target, "src/lib/schema.ts"))).toBe(true);
      const schemaContent = readFileSync(join(target, "src/lib/schema.ts"), "utf8");
      expect(schemaContent).toContain("pgTable('users'");
      expect(schemaContent).toContain("pgTable('posts'");

      expect(existsSync(join(target, "src/lib/db.ts"))).toBe(true);
      const dbContent = readFileSync(join(target, "src/lib/db.ts"), "utf8");
      expect(dbContent).toContain("export * from './schema'");

      expect(existsSync(join(target, "drizzle.config.ts"))).toBe(true);

      // 2. Local PostgreSQL Docker Compose
      expect(existsSync(join(target, "docker-compose.yml"))).toBe(true);
      const composeContent = readFileSync(join(target, "docker-compose.yml"), "utf8");
      expect(composeContent).toContain("postgres:16-alpine");

      // 3. Better Auth server and client SDK
      expect(existsSync(join(target, "src/lib/auth.ts"))).toBe(true);
      const authContent = readFileSync(join(target, "src/lib/auth.ts"), "utf8");
      expect(authContent).toContain("drizzleAdapter");

      expect(existsSync(join(target, "src/lib/auth-client.ts"))).toBe(true);
      const authClientContent = readFileSync(join(target, "src/lib/auth-client.ts"), "utf8");
      expect(authClientContent).toContain("createAuthClient");

      // 4. Stripe SDK
      expect(existsSync(join(target, "src/lib/stripe.ts"))).toBe(true);

      // 5. Payload CMS 3.0 & Collections
      expect(existsSync(join(target, "src/payload.config.ts"))).toBe(true);
      const payloadConfig = readFileSync(join(target, "src/payload.config.ts"), "utf8");
      expect(payloadConfig).toContain("buildConfig");
      expect(existsSync(join(target, "src/collections/Users.ts"))).toBe(true);
      expect(existsSync(join(target, "src/collections/Media.ts"))).toBe(true);
      expect(existsSync(join(target, "src/collections/Pages.ts"))).toBe(true);

      // 6. Puck Visual Builder
      expect(existsSync(join(target, "src/lib/puck.config.tsx"))).toBe(true);

      // 7. Environment companions
      expect(existsSync(join(target, ".env.example"))).toBe(true);
      const envExample = readFileSync(join(target, ".env.example"), "utf8");
      expect(envExample).toContain("PAYLOAD_SECRET");
      expect(envExample).toContain("BETTER_AUTH_SECRET");
      expect(envExample).toContain("STRIPE_SECRET_KEY");
      expect(envExample).toContain("DATABASE_URL");

      // 8. start-here.md guide recipes
      const startHereContent = readFileSync(join(target, "start-here.md"), "utf8");
      expect(startHereContent).toContain("Database Migrations (Drizzle ORM)");
      expect(startHereContent).toContain("Authentication (Better Auth)");
      expect(startHereContent).toContain("Managing Payload CMS 3.0");
      expect(startHereContent).toContain("Visual Page Building (Puck)");
      expect(startHereContent).toContain("E-Commerce Checkout & Webhooks (Stripe)");
    });

    it("provisions starter dashboard, deployment artifacts, test suite, pre-commit hook, and dynamic ADRs", () => {
      const target = join(TEST_SANDBOX, "production-showcase");
      const res = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        target,
        "--non-interactive",
        "--name=Nebula Cloud",
        "--author=Nebula Inc",
        "--intent=webapp",
        "--type=nextjs",
        "--styling=hybrid",
        "--deploy=docker",
        "--db=neon",
        "--auth=better-auth",
        "--skip-install"
      ], { encoding: "utf8" });

      expect(res.status).toBe(0);

      // 1. Day-1 Starter Dashboard
      expect(existsSync(join(target, "src/app/page.tsx"))).toBe(true);
      const pageContent = readFileSync(join(target, "src/app/page.tsx"), "utf8");
      expect(pageContent).toContain("Nebula Cloud");
      expect(pageContent).toContain("Drizzle ORM");
      expect(pageContent).toContain("BETTER-AUTH");

      expect(existsSync(join(target, "src/app/layout.tsx"))).toBe(true);

      // 2. Production Deployment & CI/CD
      expect(existsSync(join(target, ".github/workflows/ci.yml"))).toBe(true);
      const ciContent = readFileSync(join(target, ".github/workflows/ci.yml"), "utf8");
      expect(ciContent).toContain("Vibeguard Secret Audit");

      expect(existsSync(join(target, "Dockerfile"))).toBe(true);
      expect(existsSync(join(target, ".dockerignore"))).toBe(true);

      // 3. Testing & Biome
      expect(existsSync(join(target, "tests/health.test.ts"))).toBe(true);
      expect(existsSync(join(target, "biome.json"))).toBe(true);

      // 4. Vibeguard Pre-Commit Hook
      expect(existsSync(join(target, "scripts/pre-commit.sh"))).toBe(true);
      const precommitContent = readFileSync(join(target, "scripts/pre-commit.sh"), "utf8");
      expect(precommitContent).toContain("Vibeguard: Inspecting staged files");

      // 5. Dynamic ADRs in decisions.md & product.md
      expect(existsSync(join(target, ".agents/context/decisions.md"))).toBe(true);
      const decisionsContent = readFileSync(join(target, ".agents/context/decisions.md"), "utf8");
      expect(decisionsContent).toContain("ADR-001: Intent & Framework Architecture");
      expect(decisionsContent).toContain("ADR-002: Persistence & Data Layer Strategy");
      expect(decisionsContent).toContain("ADR-003: Sovereign Identity & Authentication Engine");
      expect(decisionsContent).toContain("ADR-004: Design Tokens & Fluid BEM Styling System");
      expect(decisionsContent).toContain("ADR-005: Production Deployment & Infrastructure Target");
      expect(decisionsContent).toContain("ADR-006: Automated Quality Gates & Vibeguard Secret Defense");

      expect(existsSync(join(target, ".agents/context/product.md"))).toBe(true);
      const productContent = readFileSync(join(target, ".agents/context/product.md"), "utf8");
      expect(productContent).toContain("Nebula Cloud");

      // 6. One-Command Setup Script in package.json
      expect(existsSync(join(target, "package.json"))).toBe(true);
      const pkg = JSON.parse(readFileSync(join(target, "package.json"), "utf8"));
      expect(pkg.scripts["setup"]).toBeDefined();
      expect(pkg.scripts["test"]).toBe("bun test");
      expect(pkg.scripts["lint"]).toBeDefined();
      expect(pkg.scripts["precommit"]).toBe("bash scripts/pre-commit.sh");
    });

    it("provisions complete modular implementations for Aria Builder, Medusa, StudioCMS, Emdash, and Payload E-Commerce", () => {
      // 1. Astro + Aria Builder + MedusaJS
      const targetAria = join(TEST_SANDBOX, "aria-medusa-showcase");
      const resAria = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetAria,
        "--non-interactive",
        "--intent=ecommerce",
        "--type=none",
        "--cms=ariabuilder",
        "--ecommerce=medusa",
        "--styling=hybrid",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resAria.status).toBe(0);
      expect(existsSync(join(targetAria, "aria.config.mjs"))).toBe(true);
      expect(existsSync(join(targetAria, "astro.config.ts"))).toBe(true);
      expect(existsSync(join(targetAria, "aria/integration.ts"))).toBe(true);
      expect(existsSync(join(targetAria, "aria/pages/admin.astro"))).toBe(true);
      expect(existsSync(join(targetAria, "src/components/AriaHero.astro"))).toBe(true);
      expect(existsSync(join(targetAria, "src/components/AriaMedusaProductGrid.astro"))).toBe(true);
      expect(existsSync(join(targetAria, "src/components/AriaCartDrawer.astro"))).toBe(true);
      expect(existsSync(join(targetAria, "src/lib/medusa.ts"))).toBe(true);
      expect(existsSync(join(targetAria, "backend/package.json"))).toBe(true);
      expect(existsSync(join(targetAria, "backend/docker-compose.yml"))).toBe(true);
      const ariaPkg = JSON.parse(readFileSync(join(targetAria, "package.json"), "utf8"));
      expect(ariaPkg.scripts["dev"]).toContain("aria/scripts/project-command.ts dev");

      // 2. Astro + StudioCMS
      const targetStudio = join(TEST_SANDBOX, "studiocms-showcase");
      const resStudio = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetStudio,
        "--non-interactive",
        "--intent=content",
        "--type=astro",
        "--cms=studiocms",
        "--styling=hybrid",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resStudio.status).toBe(0);
      expect(existsSync(join(targetStudio, "studiocms.config.mjs"))).toBe(true);
      const studioCfg = readFileSync(join(targetStudio, "studiocms.config.mjs"), "utf8");
      expect(studioCfg).toContain("from 'studiocms/config'");
      expect(existsSync(join(targetStudio, "astro.config.mjs"))).toBe(true);
      const astroCfg = readFileSync(join(targetStudio, "astro.config.mjs"), "utf8");
      expect(astroCfg).toContain("from 'studiocms'");
      expect(astroCfg).toContain("from '@astrojs/node'");
      expect(astroCfg).toContain('output: "server"');
      expect(astroCfg).toContain("studioCMS()");
      const studioPkg = JSON.parse(readFileSync(join(targetStudio, "package.json"), "utf8"));
      expect(studioPkg.dependencies["studiocms"]).toBeDefined();
      expect(studioPkg.dependencies["@studiocms/core"]).toBeUndefined();
      expect(studioPkg.dependencies["@astrojs/node"]).toBeDefined();

      // 3. Astro + Emdash CMS
      const targetEmdash = join(TEST_SANDBOX, "emdash-showcase");
      const resEmdash = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetEmdash,
        "--non-interactive",
        "--intent=content",
        "--type=astro",
        "--cms=emdash",
        "--styling=hybrid",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resEmdash.status).toBe(0);
      expect(existsSync(join(targetEmdash, "emdash.config.ts"))).toBe(true);
      expect(existsSync(join(targetEmdash, "src/content/blog/welcome.md"))).toBe(true);
      expect(existsSync(join(targetEmdash, "src/pages/blog/index.astro"))).toBe(true);
      expect(existsSync(join(targetEmdash, "astro.config.mjs"))).toBe(true);
      const emdashAstroCfg = readFileSync(join(targetEmdash, "astro.config.mjs"), "utf8");
      expect(emdashAstroCfg).toContain("emdash()");

      // 4. Next.js + Payload E-Commerce + Puck
      const targetPayloadEcom = join(TEST_SANDBOX, "payload-ecom-showcase");
      const resPayloadEcom = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetPayloadEcom,
        "--non-interactive",
        "--intent=ecommerce",
        "--type=nextjs",
        "--cms=payload",
        "--ecommerce=payload",
        "--puck",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resPayloadEcom.status).toBe(0);
      expect(existsSync(join(targetPayloadEcom, "src/payload.config.ts"))).toBe(true);
      const payloadCfg = readFileSync(join(targetPayloadEcom, "src/payload.config.ts"), "utf8");
      expect(payloadCfg).toContain("Products, Orders, Customers");
      expect(existsSync(join(targetPayloadEcom, "src/collections/Products.ts"))).toBe(true);
      expect(existsSync(join(targetPayloadEcom, "src/collections/Orders.ts"))).toBe(true);
      expect(existsSync(join(targetPayloadEcom, "src/collections/Customers.ts"))).toBe(true);
      expect(existsSync(join(targetPayloadEcom, "src/app/api/payload-checkout/route.ts"))).toBe(true);
      expect(existsSync(join(targetPayloadEcom, "src/lib/puck.config.tsx"))).toBe(true);
      expect(existsSync(join(targetPayloadEcom, "next.config.mjs"))).toBe(true);
      const nextCfg = readFileSync(join(targetPayloadEcom, "next.config.mjs"), "utf8");
      expect(nextCfg).toContain("withPayload");
      expect(existsSync(join(targetPayloadEcom, "src/app/(payload)/layout.tsx"))).toBe(true);
      expect(existsSync(join(targetPayloadEcom, "src/app/(payload)/admin/[[...segments]]/page.tsx"))).toBe(true);

      // 5. Pure HTML / CSS
      const targetHtml = join(TEST_SANDBOX, "pure-html-showcase");
      const resHtml = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetHtml,
        "--non-interactive",
        "--preset=pure-html",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resHtml.status).toBe(0);
      expect(existsSync(join(targetHtml, "index.html"))).toBe(true);
      const htmlDoc = readFileSync(join(targetHtml, "index.html"), "utf8");
      expect(htmlDoc).toContain("PURE HTML/CSS • ZERO BUILD STEP");
      expect(htmlDoc).toContain("src/styles/tokens.css");
      expect(existsSync(join(targetHtml, "package.json"))).toBe(true);
      const htmlPkg = JSON.parse(readFileSync(join(targetHtml, "package.json"), "utf8"));
      expect(htmlPkg.scripts["dev"]).toContain("serve");
    }, 30000);

    it("provisions enhanced brand guardian onboarding and supports --no-cache latest fetch mode", () => {
      const targetNoCache = join(TEST_SANDBOX, "brand-guardian-showcase");
      const res = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetNoCache,
        "--non-interactive",
        "--intent=content",
        "--type=none",
        "--no-cache",
        "--name=Aura Luxury Retail",
        "--desc=High-end sustainable apparel and luxury lifestyle collection",
        "--author=Aura Collective",
        "--audience=Discerning high-net-worth consumers seeking ethical luxury",
        "--problem=Mass-produced fast fashion lacks soul, longevity, and sustainability",
        "--features=Curated drops, Digital provenance certificates, Bespoke tailoring",
        "--industry=Luxury Fashion & Sustainable Lifestyle",
        "--offerings=Signature Silk Coats, Artisanal Linen Suits, Lifetime Care Membership",
        "--tone=Understated, sophisticated, sensory, and discerning",
        "--palette=amber",
        "--skip-install"
      ], { encoding: "utf8" });

      expect(res.status).toBe(0);

      // 1. Verify Complete Agency Brand Guardian Suite
      const brandDir = join(targetNoCache, "Onboarding/01-Brand");
      expect(existsSync(join(brandDir, "brand-identity.md"))).toBe(true);
      expect(existsSync(join(brandDir, "visual-direction.md"))).toBe(true);
      expect(existsSync(join(brandDir, "voice-and-tone.md"))).toBe(true);
      expect(existsSync(join(brandDir, "brand-guardrails.md"))).toBe(true);
      expect(existsSync(join(brandDir, "brand-assets-intake.md"))).toBe(true);

      const identityDoc = readFileSync(join(brandDir, "brand-identity.md"), "utf8");
      expect(identityDoc).toContain("## Brand Purpose");
      expect(identityDoc).toContain("## Brand Vision");
      expect(identityDoc).toContain("## Brand Mission");
      expect(identityDoc).toContain("## Core Values");
      expect(identityDoc).toContain("## Brand Promise");

      const voiceDoc = readFileSync(join(brandDir, "voice-and-tone.md"), "utf8");
      expect(voiceDoc).toContain("## Voice & Tone Pillars");
      expect(voiceDoc).toContain("## Vocabulary & Copywriting Guidelines");

      const guardrailsDoc = readFileSync(join(brandDir, "brand-guardrails.md"), "utf8");
      expect(guardrailsDoc).toContain("## Brand Asset & IP Protection");
      expect(guardrailsDoc).toContain("## Clear Space & Minimum Sizing");

      const brandAssetsDoc = readFileSync(join(brandDir, "brand-assets-intake.md"), "utf8");
      expect(brandAssetsDoc).toContain("## Vector Brand Marks & Logo Assets");
      expect(brandAssetsDoc).toContain("## Typography & Font Licensing");
      expect(brandAssetsDoc).toContain("## Photography & Media Library Assets");

      // 2. Verify Business Strategy & Market Discovery
      const bizDir = join(targetNoCache, "Onboarding/02-Business");
      expect(existsSync(join(bizDir, "business-model.md"))).toBe(true);
      expect(existsSync(join(bizDir, "audience-persona.md"))).toBe(true);
      expect(existsSync(join(bizDir, "competitor-benchmark.md"))).toBe(true);
      expect(existsSync(join(bizDir, "client-goals-kpis.md"))).toBe(true);

      const compDoc = readFileSync(join(bizDir, "competitor-benchmark.md"), "utf8");
      expect(compDoc).toContain("## Key Competitors");
      expect(compDoc).toContain("## Competitive Differentiation & Unfair Advantage");

      const kpiDoc = readFileSync(join(bizDir, "client-goals-kpis.md"), "utf8");
      expect(kpiDoc).toContain("## Primary Business Objectives");
      expect(kpiDoc).toContain("## Target Launch Timeline & Milestones");
      expect(kpiDoc).toContain("## Key Conversion Metrics & KPIs");

      // 3. Verify Products, Services & Offerings (renamed from 03-Menu)
      const offeringsDir = join(targetNoCache, "Onboarding/03-Offerings");
      expect(existsSync(join(offeringsDir, "offerings-catalog.md"))).toBe(true);
      expect(existsSync(join(offeringsDir, "scope-deliverables.md"))).toBe(true);

      const offeringsDoc = readFileSync(join(offeringsDir, "offerings-catalog.md"), "utf8");
      expect(offeringsDoc).toContain("## Offerings & Deliverables Matrix");
      expect(offeringsDoc).toContain("## Pricing Architecture & Commercial Models");

      const scopeDoc = readFileSync(join(offeringsDir, "scope-deliverables.md"), "utf8");
      expect(scopeDoc).toContain("## Scope Boundaries & Phasing");
      expect(scopeDoc).toContain("## Phase 1 (MVP Shipped Deliverables)");
      expect(scopeDoc).toContain("## Explicitly Out-of-Scope");

      // 4. Verify Technical Intake & Integrations
      const techDir = join(targetNoCache, "Onboarding/04-Technical-Intake");
      expect(existsSync(join(techDir, "access-and-credentials.md"))).toBe(true);
      expect(existsSync(join(techDir, "integrations-matrix.md"))).toBe(true);

      const accessDoc = readFileSync(join(techDir, "access-and-credentials.md"), "utf8");
      expect(accessDoc).toContain("## Domain & DNS Management");
      expect(accessDoc).toContain("## Code Repository & Deployment Infrastructure");
      expect(accessDoc).toContain("## Secure Credential Transfer Protocol");

      const integrationsDoc = readFileSync(join(techDir, "integrations-matrix.md"), "utf8");
      expect(integrationsDoc).toContain("## Third-Party Platform Integrations");
      expect(integrationsDoc).toContain("## Marketing, Analytics & Tag Management");
      expect(integrationsDoc).toContain("## Compliance & Legal Prerequisites");
    }, 15000);

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
