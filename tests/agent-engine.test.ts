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

    it("supports 1-Click Agency Presets (powerhouse, visual, instatic, mobile, atomic-payload)", () => {
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

      // 11. Atomic Payload preset (isolated official website-builder scaffold)
      const targetAtomic = join(TEST_SANDBOX, "atomic-preset-test");
      const resAtomic = spawnSync("bun", [NEW_PROJECT_SCRIPT, targetAtomic, "--non-interactive", "--preset=atomic-payload", "--dry-run"], {
        encoding: "utf8",
      });
      expect(resAtomic.status).toBe(0);
      expect(resAtomic.stdout).toContain("Framework:         `NEXTJS`");
      expect(resAtomic.stdout).toContain("CMS:               `ATOMIC-PAYLOAD`");
      expect(resAtomic.stdout).toContain("Styling:           `NONE`");
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

      // Verify Client-Intake brief (intake docs are agent-produced post-scaffold)
      const briefPath = join(target, "Client-Intake/00-Intake-Brief.md");
      expect(existsSync(briefPath)).toBe(true);
      const brief = readFileSync(briefPath, "utf8");
      expect(brief).toContain("Employee Checklist");
      expect(brief).toContain("Agent Instructions");
    });

    it("provisions Client-Intake brief, fluid tokens, and BEM semantic classes", () => {
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

      // 1. Verify Client-Intake brief exists with pre-filled scaffold answers
      const briefPath = join(target, "Client-Intake/00-Intake-Brief.md");
      expect(existsSync(briefPath)).toBe(true);
      const brief = readFileSync(briefPath, "utf8");
      expect(brief).toContain("Sovereign Store");
      expect(brief).toContain("Direct to Consumer Apparel");
      expect(brief).toContain("Signature Denim");
      expect(brief).toContain("Employee Checklist");
      expect(brief).toContain("Agent Instructions");
      expect(brief).toContain("01-Brand/");
      expect(brief).toContain("04-Technical-Intake/");

      // 2. Verify the 4-pillar intake folders exist (docs agent-produced post-scaffold)
      expect(existsSync(join(target, "Client-Intake/01-Brand"))).toBe(true);
      expect(existsSync(join(target, "Client-Intake/02-Business"))).toBe(true);
      expect(existsSync(join(target, "Client-Intake/03-Offerings"))).toBe(true);
      expect(existsSync(join(target, "Client-Intake/04-Technical-Intake"))).toBe(true);
      expect(existsSync(join(target, "start-here.md"))).toBe(false);

      // 3. Verify OKLCH tokens and fluid clamp scales in src/styles/tokens.css
      const tokensCssPath = join(target, "src/styles/tokens.css");
      expect(existsSync(tokensCssPath)).toBe(true);
      const tokensCss = readFileSync(tokensCssPath, "utf8");
      expect(tokensCss).toContain("oklch(");
      expect(tokensCss).toContain("--font-size-base: clamp(");
      expect(tokensCss).toContain("--space-md: clamp(");
      expect(tokensCss).toContain("--spacing-md: var(--space-md);");

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

      expect(readFileSync(join(target, "Client-Intake/00-Intake-Brief.md"), "utf8")).toContain("medusa");
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

      // 8. Intake brief carries stack-specific agent instructions
      const briefContent = readFileSync(join(target, "Client-Intake/00-Intake-Brief.md"), "utf8");
      expect(briefContent).toContain("package.json");
      expect(briefContent).toContain("src/styles/tokens.css");
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

    it("provisions complete modular implementations for isolated Aria Builder, Atomic Payload, StudioCMS, Emdash, and Payload E-Commerce", () => {
      // 1. Aria Builder (isolated official scaffold — extras skipped even when requested)
      const targetAria = join(TEST_SANDBOX, "aria-showcase");
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
      expect(resAria.stdout).toContain("admin/setup");
      // Official upstream markers (present via clone and offline fallback).
      expect(existsSync(join(targetAria, "package.json"))).toBe(true);
      expect(existsSync(join(targetAria, "astro.config.ts"))).toBe(true);
      expect(existsSync(join(targetAria, "uno.user.config.ts"))).toBe(true);
      expect(readFileSync(join(targetAria, "uno.user.config.ts"), "utf8")).toContain("presetWind4");
      // Engine governance still provisioned.
      expect(existsSync(join(targetAria, "AGENTS.md"))).toBe(true);
      expect(existsSync(join(targetAria, "Client-Intake/00-Intake-Brief.md"))).toBe(true);
      // Isolation: no engine-invented extras despite medusa+hybrid requested.
      expect(existsSync(join(targetAria, "aria.config.mjs"))).toBe(false);
      expect(existsSync(join(targetAria, "src/components/AriaHero.astro"))).toBe(false);
      expect(existsSync(join(targetAria, "src/components/AriaMedusaProductGrid.astro"))).toBe(false);
      expect(existsSync(join(targetAria, "src/components/AriaCartDrawer.astro"))).toBe(false);
      expect(existsSync(join(targetAria, "src/lib/medusa.ts"))).toBe(false);
      expect(existsSync(join(targetAria, "backend/package.json"))).toBe(false);
      expect(existsSync(join(targetAria, "backend/docker-compose.yml"))).toBe(false);

      // 1b. Atomic Payload (isolated official website-builder scaffold — extras skipped even when requested)
      const targetAtomic = join(TEST_SANDBOX, "atomic-showcase");
      const resAtomic = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetAtomic,
        "--non-interactive",
        "--intent=content",
        "--type=nextjs",
        "--cms=atomic-payload",
        "--db=postgres",
        "--styling=hybrid",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resAtomic.status).toBe(0);
      expect(resAtomic.stdout).toContain("localhost:42100/admin");
      expect(resAtomic.stdout).toContain("Atomic Payload is fully isolated");
      // Official upstream markers (present via both the npm-pack merge and the offline fallback).
      expect(existsSync(join(targetAtomic, "package.json"))).toBe(true);
      expect(JSON.parse(readFileSync(join(targetAtomic, "package.json"), "utf8")).name).toBe("atomic-payload");
      expect(existsSync(join(targetAtomic, "next.config.ts"))).toBe(true);
      expect(readFileSync(join(targetAtomic, "next.config.ts"), "utf8")).toContain("withPayload");
      expect(existsSync(join(targetAtomic, "src/payload.config.ts"))).toBe(true);
      const atomicPayloadCfg = readFileSync(join(targetAtomic, "src/payload.config.ts"), "utf8");
      expect(atomicPayloadCfg).toContain("buildConfig");
      expect(atomicPayloadCfg).toContain("mongooseAdapter");
      // Engine governance still provisioned.
      expect(existsSync(join(targetAtomic, "AGENTS.md"))).toBe(true);
      expect(existsSync(join(targetAtomic, "Client-Intake/00-Intake-Brief.md"))).toBe(true);
      // Isolation: no engine extras despite postgres+hybrid requested.
      expect(existsSync(join(targetAtomic, "src/styles/tokens.css"))).toBe(false);
      expect(existsSync(join(targetAtomic, "uno.config.ts"))).toBe(false);
      expect(existsSync(join(targetAtomic, "src/lib/db.ts"))).toBe(false);
      expect(existsSync(join(targetAtomic, "drizzle.config.ts"))).toBe(false);
      expect(existsSync(join(targetAtomic, "docker-compose.yml"))).toBe(false);
      expect(existsSync(join(targetAtomic, ".github/workflows/ci.yml"))).toBe(false);
      expect(existsSync(join(targetAtomic, "src/lib/auth.ts"))).toBe(false);

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
      expect(existsSync(join(targetEmdash, "emdash-env.d.ts"))).toBe(true);
      expect(existsSync(join(targetEmdash, "seed/seed.json"))).toBe(true);
      expect(existsSync(join(targetEmdash, "src/live.config.ts"))).toBe(true);
      expect(existsSync(join(targetEmdash, "src/pages/admin.astro"))).toBe(true);
      expect(existsSync(join(targetEmdash, "tests/emdash.test.ts"))).toBe(true);
      expect(existsSync(join(targetEmdash, "src/content/blog/welcome.md"))).toBe(true);
      expect(existsSync(join(targetEmdash, "src/pages/blog/index.astro"))).toBe(true);
      expect(existsSync(join(targetEmdash, "astro.config.mjs"))).toBe(true);
      const emdashAstroCfg = readFileSync(join(targetEmdash, "astro.config.mjs"), "utf8");
      expect(emdashAstroCfg).toContain("emdash(");
      expect(emdashAstroCfg).toContain("react()");

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
    }, 120000);

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

      // 1. Verify Client-Intake brief with pre-filled agency answers
      const briefPath = join(targetNoCache, "Client-Intake/00-Intake-Brief.md");
      expect(existsSync(briefPath)).toBe(true);
      const brief = readFileSync(briefPath, "utf8");
      expect(brief).toContain("Employee Checklist");
      expect(brief).toContain("Agent Instructions");
      expect(brief).toContain("Pre-Filled From Scaffold");
      expect(brief).toContain("01-Brand/");
      expect(brief).toContain("02-Business/");
      expect(brief).toContain("03-Offerings/");
      expect(brief).toContain("04-Technical-Intake/");
      expect(brief).toContain("start-here.md");
      expect(brief).toContain("Zero secrets");

      // 2. Verify the 4-pillar intake folders exist (docs agent-produced post-scaffold)
      expect(existsSync(join(targetNoCache, "Client-Intake/01-Brand"))).toBe(true);
      expect(existsSync(join(targetNoCache, "Client-Intake/02-Business"))).toBe(true);
      expect(existsSync(join(targetNoCache, "Client-Intake/03-Offerings"))).toBe(true);
      expect(existsSync(join(targetNoCache, "Client-Intake/04-Technical-Intake"))).toBe(true);
      expect(existsSync(join(targetNoCache, "start-here.md"))).toBe(false);
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

  /* ========================================================================= */
  /* PART F: Simplified Setup, Progressive Pipeline & 37 OKLCH Palettes (TDD)   */
  /* ========================================================================= */
  describe("Part F: Simplified Setup, Progressive Pipeline & 37 OKLCH Palettes", () => {
    it("provisions all 37 OKLCH color palettes from oklch.fyi with exact tokens and UnoCSS Wind 4 integration", () => {
      // Test sunset-vibes curated theme (plain-astro keeps engine token injection;
      // Aria presets are isolated official clones without engine tokens)
      const targetSunset = join(TEST_SANDBOX, "sunset-vibes-showcase");
      const resSunset = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetSunset,
        "--non-interactive",
        "--preset=plain-astro",
        "--palette=sunset-vibes",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resSunset.status).toBe(0);
      expect(existsSync(join(targetSunset, "src/styles/tokens.css"))).toBe(true);
      const tokensCss = readFileSync(join(targetSunset, "src/styles/tokens.css"), "utf8");
      expect(tokensCss).toContain("oklch(0.3 0.15 25)");
      expect(tokensCss).toContain("SUNSET-VIBES");

      const colorsJsonPath = join(targetSunset, ".agents/brand/tokens/colors.json");
      expect(existsSync(colorsJsonPath)).toBe(true);
      const colorsJson = JSON.parse(readFileSync(colorsJsonPath, "utf8"));
      expect(colorsJson.color.primary.default.$value).toBe("oklch(0.3 0.15 25)");

      // Test deep-sea curated theme (same: plain-astro keeps engine tokens)
      const targetDeepSea = join(TEST_SANDBOX, "deep-sea-showcase");
      const resDeepSea = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetDeepSea,
        "--non-interactive",
        "--preset=plain-astro",
        "--palette=deep-sea",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resDeepSea.status).toBe(0);
      const deepSeaTokens = readFileSync(join(targetDeepSea, "src/styles/tokens.css"), "utf8");
      expect(deepSeaTokens).toContain("oklch(0.48 0.14 255)");
      expect(deepSeaTokens).toContain("DEEP-SEA");
    }, 60000);

    it("provisions project-scoped oklch-skill strictly inside target project with zero global pollution", () => {
      const targetProject = join(TEST_SANDBOX, "oklch-skill-showcase");
      const res = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetProject,
        "--non-interactive",
        "--preset=instatic",
        "--palette=ocean-breeze",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(res.status).toBe(0);

      const skillDir = join(targetProject, ".agents/skills/oklch-skill");
      expect(existsSync(skillDir)).toBe(true);
      expect(existsSync(join(skillDir, "SKILL.md"))).toBe(true);
      expect(existsSync(join(skillDir, "palettes.json"))).toBe(true);
      expect(existsSync(join(skillDir, "accessibility-contrast.md"))).toBe(true);
      expect(existsSync(join(skillDir, "gamut-and-tailwind.md"))).toBe(true);

      const palettesData = JSON.parse(readFileSync(join(skillDir, "palettes.json"), "utf8"));
      expect(Object.keys(palettesData).length).toBe(37);
      expect(palettesData).toHaveProperty("sunset-vibes");
      expect(palettesData).toHaveProperty("ocean-breeze");
      expect(palettesData).toHaveProperty("forest");
      expect(palettesData).toHaveProperty("neon-nights");
      expect(palettesData).toHaveProperty("slate");
      expect(palettesData).toHaveProperty("indigo");
    }, 30000);

    it("simplifies Astro setup to Plain Astro (zero React) vs Aria Builder vs Plain Astro + CMS (Emdash / Git-based)", () => {
      // 1. Plain Astro (zero React)
      const targetPlainAstro = join(TEST_SANDBOX, "plain-astro-showcase");
      const resPlain = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetPlainAstro,
        "--non-interactive",
        "--framework=astro",
        "--cms=none",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resPlain.status).toBe(0);
      const plainPkg = JSON.parse(readFileSync(join(targetPlainAstro, "package.json"), "utf8"));
      expect(plainPkg.dependencies).not.toHaveProperty("react");
      expect(plainPkg.dependencies).not.toHaveProperty("react-dom");
      expect(plainPkg.dependencies).not.toHaveProperty("@astrojs/react");
      const plainAstroCfg = readFileSync(join(targetPlainAstro, "astro.config.mjs"), "utf8");
      expect(plainAstroCfg).not.toContain("react()");

      // 2. Astro + Git-based CMS
      const targetGitCms = join(TEST_SANDBOX, "astro-git-cms-showcase");
      const resGit = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetGitCms,
        "--non-interactive",
        "--framework=astro",
        "--cms=git",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resGit.status).toBe(0);
      expect(existsSync(join(targetGitCms, "src/content/config.ts"))).toBe(true);
      expect(existsSync(join(targetGitCms, "src/content/blog/first-post.md"))).toBe(true);
      expect(existsSync(join(targetGitCms, "src/pages/rss.xml.ts"))).toBe(true);
    }, 30000);

    it("simplifies HTML setup to Plain HTML vs Instatic Builder and establishes AI-Ready harness first", () => {
      const targetHtml = join(TEST_SANDBOX, "html-harness-first");
      const res = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetHtml,
        "--non-interactive",
        "--preset=pure-html",
        "--palette=forest",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(res.status).toBe(0);

      // AI-ready DOX harness first
      expect(existsSync(join(targetHtml, "AGENTS.md"))).toBe(true);
      expect(existsSync(join(targetHtml, ".agents/standards/tech-stacks.md"))).toBe(true);
      expect(existsSync(join(targetHtml, ".agents/context/index.md"))).toBe(true);
      expect(existsSync(join(targetHtml, ".memory/CURRENT.md"))).toBe(true);

      // Client Intake brief before completion
      expect(existsSync(join(targetHtml, "Client-Intake/00-Intake-Brief.md"))).toBe(true);
      expect(existsSync(join(targetHtml, "Client-Intake/01-Brand"))).toBe(true);
      expect(existsSync(join(targetHtml, "Client-Intake/04-Technical-Intake"))).toBe(true);
    }, 30000);

    it("supports simplified presets plain-astro and git-cms", () => {
      const targetPlain = join(TEST_SANDBOX, "preset-plain-astro");
      const resPlain = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetPlain,
        "--non-interactive",
        "--preset=plain-astro",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resPlain.status).toBe(0);
      const pkg = JSON.parse(readFileSync(join(targetPlain, "package.json"), "utf8"));
      expect(pkg.dependencies).not.toHaveProperty("react");
      expect(pkg.dependencies).not.toHaveProperty("@astrojs/react");

      const targetGit = join(TEST_SANDBOX, "preset-git-cms");
      const resGit = spawnSync("bun", [
        NEW_PROJECT_SCRIPT,
        targetGit,
        "--non-interactive",
        "--preset=git-cms",
        "--skip-install"
      ], { encoding: "utf8" });
      expect(resGit.status).toBe(0);
      expect(existsSync(join(targetGit, "src/content/config.ts"))).toBe(true);
    }, 30000);
  });
});

