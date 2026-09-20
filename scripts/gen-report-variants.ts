import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VARIANTS_DIR = join(process.cwd(), ".agents/reports/variants");
mkdirSync(VARIANTS_DIR, { recursive: true });

interface DesignTheme {
  id: string;
  name: string;
  category: string;
  tagline: string;
  fontsUrl: string;
  cssTokens: string;
  customCss: string;
  kickerClass?: string;
  buttonClass?: string;
}

const commonContent = {
  title: "Skill Mining & Multi-Vendor Corpus Intake",
  date: "2026-09-20",
  lede: "Comprehensive ingestion of 120+ vendor and community skill repositories across Google Cloud, Red Hat, Cypress, Qdrant, and specialized developer/marketing domains, locked into the agency context.",
  stats: [
    { num: "120+", label: "Skills Ingested & Logged" },
    { num: "53 / 0", label: "Tests Passing / Failing" },
    { num: "4", label: "Official Vendor Foundations" },
    { num: "5", label: "New Skill Proposals" },
    { num: "100%", label: "Research Mode Policy Locked" },
    { num: "43", label: "Skills Suite Baseline" },
  ],
  intakeItems: [
    {
      title: "Google Cloud Ecosystem",
      desc: "Gemini API SDK, Interactions API, GKE Autopilot golden paths, Network Observability, Recipe Auth/Onboarding, and all 6 Well-Architected Framework pillars (Cost, Ops, Performance, Reliability, Security, Sustainability).",
      status: "INGESTED",
    },
    {
      title: "Red Hat SRE & Security",
      desc: "CVE Skillpack diagnostics & classification, SRE fleet remediation via Ansible + Lightspeed, and OpenShift cluster / virtualization management.",
      status: "INGESTED",
    },
    {
      title: "Cypress & Qdrant Platforms",
      desc: "Official Cypress E2E/component test authoring, plus Qdrant production vector search, payload indexing, model migration, scaling, and multi-language SDK patterns.",
      status: "INGESTED",
    },
    {
      title: "Cognitive Gates & Quality Filters",
      desc: "Kilo-Kit (C4 workflow gates, ToT DAG), Perfectify (DAGx kernel), Aegis, Unslop, Sepia, and Simple-Man quality verification benchmarks.",
      status: "INGESTED",
    },
  ],
  matrixLevels: [
    {
      level: "Level 1: Root Repository",
      pattern: 'Target: fd -g "SKILL.md" --max-depth 2',
      desc: "Directly located at root /SKILL.md or named single directory /<skill-name>/SKILL.md. Standard layout for standalone single-purpose skills.",
    },
    {
      level: "Level 2: Standard Hub",
      pattern: 'Target: fd -g "SKILL.md" --max-depth 3',
      desc: "Found under standard skill directories: /skills/<skill-name>/SKILL.md or /.agents/skills/<skill-name>/SKILL.md.",
    },
    {
      level: "Level 3: Nested Monorepos",
      pattern: 'Target: fd -g "SKILL.md" (recursive full sweep)',
      desc: "Nested within monorepo packages, plugin folders, or agent trees: /packages/skills/<cat>/<skill>/SKILL.md or /plugins/<plugin>/skills/<skill>/SKILL.md.",
    },
  ],
  proposals: [
    {
      name: "n8n-automator",
      type: "PROPOSED",
      lead: "Sol (Automation)",
      desc: "Full lifecycle n8n workflow builder, expression validator ({{ $json }}), MCP connectors, and research mode.",
    },
    {
      name: "postiz-scheduler",
      type: "PROPOSED",
      lead: "Jasper (Growth)",
      desc: "Autonomous multi-platform social dispatch & scheduling via self-hosted Postiz API.",
    },
    {
      name: "vector-qdrant",
      type: "PROPOSED",
      lead: "Sol (Product Architect)",
      desc: "Vector embeddings, payload indexing, hybrid search, and RAG integration.",
    },
    {
      name: "cve-security-audit",
      type: "PROPOSED",
      lead: "Nexus (Quality Gate)",
      desc: "Automated CVE lookup, SAST/SCA diagnostics, and MITRE ATT&CK mitigation workflows.",
    },
    {
      name: "cloud-waf-architect",
      type: "PROPOSED",
      lead: "Nexus (Technical Director)",
      desc: "GCP & Cloudflare Well-Architected Framework audits for Cost, Security, and Reliability.",
    },
    {
      name: "git, code-review, new-project, database",
      type: "ENRICH",
      lead: "All Divisions",
      desc: "Poka-Yoke templates, C4 execution gates, Varlock zero-secret handling, and dedicated research mode.",
    },
  ],
  handoffPrompt: `Activate the deepwork skill to execute the Skill Improvement Plan recorded in .agents/artifacts/skill-mining-intake/:

Phase 1: Deep Discovery & Mining
- Run recursive searches (fd -g "SKILL.md") across the vendor/community corpus in .agents/artifacts/skill-mining-intake/corpus-raw.md to handle 1-, 2-, and 3-layer deep monorepo structures.

Phase 2: Existing Skill Enrichment & Research Mode Addition
- Enrich existing skills (git, code-review, new-project, database, marketing/seo) with the high-value mechanisms cataloged in .agents/artifacts/skill-mining-intake/mined-catalog-and-plan.md.
- Ensure every eligible skill implements a dedicated research mode alongside its operational/audit modes.

Phase 3: New Agency Skill Scaffolding
- Review and scaffold the proposed agency skills aligned with the principal stack:
  1. n8n-automator (workflow creation, node expression validation, MCP connectors)
  2. postiz-scheduler (multi-platform social dispatch & queue management)
  3. vector-qdrant (vector embeddings, payload indexing, hybrid search)
  4. cve-security-audit (CVE diagnostics, SAST/SCA, MITRE ATT&CK mitigation)
  5. cloud-waf-architect (GCP & Cloudflare Well-Architected Framework audits)

Phase 4: Conformance & Reporting
- Verify all skills pass bun test (53+ pass, 0 fail).
- Sync skills.json, llms.txt, and README.md.`,
};

const themes: DesignTheme[] = [
  {
    id: "01-audemars-piguet",
    name: "Audemars Piguet",
    category: "Haute Horlogerie Luxury",
    tagline: "Ultra-thin 100 sans + Times italic 250 serif, warm off-white canvas, sharp 0px geometry",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&family=Playfair+Display:ital,wght@1,400;1,500;1,600&family=JetBrains+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #ffffff;
      --bg-subtle: #f6f5f3;
      --surface: #ffffff;
      --text: #000000;
      --text-muted: #757575;
      --accent: #02291f;
      --accent-green: #456148;
      --gold: #c9b586;
      --border: #bfbfbf;
      --border-light: #e7e4df;
      --font-display: "Inter", sans-serif;
      --font-serif: "Playfair Display", Georgia, serif;
      --font-body: "Inter", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 0px;
      --radius-pill: 0px;
    `,
    customCss: `
      body { font-weight: 300; background: var(--bg-subtle); color: var(--text); }
      .hero { background: var(--bg); border-bottom: 1px solid var(--border); padding: 72px 0 48px; }
      .hero h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 100; letter-spacing: -1.5px; margin-bottom: 20px; text-transform: uppercase; }
      .hero .lede { font-family: var(--font-serif); font-style: italic; font-size: 1.25rem; font-weight: 400; color: var(--text-muted); }
      .kicker { font-family: var(--font-display); font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text-muted); display: inline-block; margin-bottom: 16px; border: 1px solid var(--border); padding: 4px 12px; }
      .stat b { font-family: var(--font-display); font-weight: 200; font-size: 2.4rem; letter-spacing: -1px; }
      .badge { border-radius: 0px; font-weight: 500; font-size: 11px; letter-spacing: 1.5px; padding: 4px 10px; text-transform: uppercase; }
      .badge.shipped { background: #000; color: #fff; }
      .badge.indev { background: var(--bg-subtle); color: #000; border: 1px solid var(--border); }
      .badge.queued { background: transparent; color: var(--text-muted); border: 1px dashed var(--border); }
    `,
  },
  {
    id: "02-mintlify",
    name: "Mintlify",
    category: "Developer Documentation",
    tagline: "Atmospheric sky gradient hero + crisp 3-column developer surfaces, signature mint #00d4a4",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap",
    cssTokens: `
      --bg: #fafafa;
      --bg-subtle: #f3f4f6;
      --surface: #ffffff;
      --text: #09090b;
      --text-muted: #71717a;
      --accent: #00d4a4;
      --accent-hover: #00be92;
      --accent-ink: #042f24;
      --border: #e4e4e7;
      --border-light: #f4f4f5;
      --font-display: "Inter", sans-serif;
      --font-body: "Inter", sans-serif;
      --font-mono: "Geist Mono", monospace;
      --radius: 10px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: radial-gradient(1000px 400px at 50% 0%, rgba(0, 212, 164, 0.15) 0%, rgba(250, 250, 250, 0) 100%), #ffffff; border-bottom: 1px solid var(--border); padding: 72px 0 48px; }
      .hero h1 { font-size: clamp(34px, 4.5vw, 56px); font-weight: 700; letter-spacing: -1.8px; margin-bottom: 16px; }
      .hero .lede { font-size: 1.15rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 600; color: var(--accent-ink); background: rgba(0, 212, 164, 0.16); border: 1px solid rgba(0, 212, 164, 0.35); padding: 6px 14px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 18px; }
      .stat { background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); }
      .stat b { font-family: var(--font-mono); font-weight: 600; font-size: 2rem; color: var(--text); }
      .badge.shipped { background: rgba(0, 212, 164, 0.15); color: #065f46; border: 1px solid rgba(0, 212, 164, 0.4); }
      .badge.indev { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
      .badge.queued { background: #f4f4f5; color: #52525b; border: 1px solid #e4e4e7; }
    `,
  },
  {
    id: "03-mongodb",
    name: "MongoDB",
    category: "Enterprise Infrastructure",
    tagline: "Deep forest teal #001e2b hero, vivid green #00ed64 pill CTAs, Euclid Circular A precision",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #ffffff;
      --bg-subtle: #f9fbfa;
      --surface: #ffffff;
      --text: #001e2b;
      --text-muted: #5c6c75;
      --accent: #00ed64;
      --accent-dark: #001e2b;
      --accent-ink: #001e2b;
      --border: #e8edeb;
      --border-light: #f0f4f2;
      --font-display: "Plus Jakarta Sans", sans-serif;
      --font-body: "Plus Jakarta Sans", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 12px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg-subtle); color: var(--text); }
      .hero { background: #001e2b; color: #ffffff; border-bottom: 4px solid var(--accent); padding: 76px 0 52px; }
      .hero h1 { font-size: clamp(34px, 4.5vw, 56px); font-weight: 800; letter-spacing: -1.5px; color: #ffffff; margin-bottom: 16px; }
      .hero .lede { font-size: 1.18rem; color: #b8c4c2; }
      .kicker { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #00ed64; background: rgba(0, 237, 100, 0.12); border: 1px solid rgba(0, 237, 100, 0.3); padding: 6px 14px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; }
      .stat { background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); }
      .stat b { font-weight: 800; font-size: 2.1rem; color: #001e2b; }
      .hero .stat { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.12); color: #fff; }
      .hero .stat b { color: #00ed64; }
      .hero .stat span { color: #8fa09d; }
      .badge.shipped { background: #001e2b; color: #00ed64; border: 1px solid #00ed64; }
      .badge.indev { background: #eafaf1; color: #00684a; border: 1px solid #a3e9c4; }
      .badge.queued { background: #f0f4f2; color: #5c6c75; }
    `,
  },
  {
    id: "04-modal",
    name: "Modal",
    category: "Serverless Compute & AI Infra",
    tagline: "Operator console near-black #231c1c, pale-green ink #ddffdc, radioactive lime #7fee64 pill CTA",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
    cssTokens: `
      --bg: #231c1c;
      --bg-subtle: #191414;
      --surface: #2d2424;
      --surface-raised: #382e2e;
      --text: #ddffdc;
      --text-muted: #8b9c8a;
      --accent: #7fee64;
      --accent-ink: #111e0e;
      --border: rgba(127, 238, 100, 0.22);
      --border-light: rgba(255, 255, 255, 0.08);
      --font-display: "Space Grotesk", sans-serif;
      --font-body: "Space Grotesk", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 8px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: var(--bg-subtle); border-bottom: 1px solid var(--border); padding: 72px 0 48px; }
      .hero h1 { font-size: clamp(34px, 4.5vw, 54px); font-weight: 700; letter-spacing: -1.2px; color: #ffffff; margin-bottom: 16px; }
      .hero .lede { font-size: 1.15rem; color: var(--text-muted); font-family: var(--font-mono); }
      .kicker { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--accent); background: rgba(127, 238, 100, 0.12); border: 1px solid var(--accent); padding: 5px 14px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 18px; }
      .stat { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius); }
      .stat b { font-family: var(--font-mono); font-weight: 600; font-size: 2.1rem; color: var(--accent); }
      .card, .release, .table-wrap { background: var(--surface); border-color: var(--border-light); }
      .badge.shipped { background: var(--accent); color: var(--accent-ink); font-weight: 700; }
      .badge.indev { background: rgba(255, 217, 102, 0.15); color: #ffd966; border: 1px solid #ffd966; }
      .badge.queued { background: rgba(255, 255, 255, 0.08); color: var(--text-muted); }
      code { background: #191414; color: var(--accent); border: 1px solid rgba(127, 238, 100, 0.25); }
      .topnav { background: rgba(25, 20, 20, 0.95); border-bottom-color: var(--border-light); }
      .topnav a { color: var(--text); }
      .topnav a:hover { background: var(--surface); color: var(--accent); }
      th { background: var(--surface-raised); color: var(--text); }
      td { border-bottom-color: var(--border-light); }
    `,
  },
  {
    id: "05-bun",
    name: "Bun",
    category: "Developer Tool & Runtime",
    tagline: "Matte charcoal #282a36, hot pink #f472b6 pill CTAs, pure white hairlines, JetBrains Mono",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
    cssTokens: `
      --bg: #282a36;
      --bg-subtle: #1e1f29;
      --surface: #343746;
      --surface-raised: #3f4255;
      --text: #f8f8f2;
      --text-muted: #9ba1b8;
      --accent: #f472b6;
      --accent-hover: #ec4899;
      --accent-ink: #1e1f29;
      --border: rgba(255, 255, 255, 0.14);
      --border-light: rgba(255, 255, 255, 0.08);
      --font-display: "Inter", sans-serif;
      --font-body: "Inter", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 10px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: radial-gradient(900px 360px at 50% -10%, rgba(244, 114, 182, 0.18) 0%, transparent 100%), var(--bg-subtle); border-bottom: 1px solid var(--border); padding: 72px 0 48px; }
      .hero h1 { font-size: clamp(34px, 4.5vw, 56px); font-weight: 800; letter-spacing: -1.6px; margin-bottom: 16px; }
      .hero .lede { font-size: 1.15rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 700; color: var(--accent); background: rgba(244, 114, 182, 0.15); border: 1px solid var(--accent); padding: 5px 14px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 18px; }
      .stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
      .stat b { font-family: var(--font-mono); font-weight: 700; font-size: 2.1rem; color: var(--accent); }
      .card, .release, .table-wrap { background: var(--surface); border-color: var(--border); }
      .badge.shipped { background: var(--accent); color: var(--accent-ink); font-weight: 700; }
      .badge.indev { background: #ffeaa7; color: #2d3436; font-weight: 600; }
      .badge.queued { background: rgba(255, 255, 255, 0.1); color: var(--text-muted); }
      code { background: #1e1f29; color: #ff79c6; border: 1px solid rgba(244, 114, 182, 0.2); }
      .topnav { background: rgba(30, 31, 41, 0.95); border-bottom-color: var(--border); }
      .topnav a { color: var(--text); }
      .topnav a:hover { background: var(--surface); color: var(--accent); }
      th { background: var(--surface-raised); color: var(--text); }
      td { border-bottom-color: var(--border-light); }
    `,
  },
  {
    id: "06-roblox",
    name: "Roblox",
    category: "Gaming & Platform",
    tagline: "Pure-black floor #000000, high contrast white cards #f7f7f8, Builder Sans, bold 8px geometry",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #000000;
      --bg-subtle: #111113;
      --surface: #1c1c1f;
      --surface-card: #f7f7f8;
      --text: #ffffff;
      --text-dark: #000000;
      --text-muted: #8e8e93;
      --accent: #00a2ff;
      --accent-ink: #ffffff;
      --border: rgba(255, 255, 255, 0.16);
      --border-light: rgba(255, 255, 255, 0.08);
      --font-display: "Inter", sans-serif;
      --font-body: "Inter", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 8px;
      --radius-pill: 8px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: linear-gradient(180deg, #18181b 0%, #000000 100%); border-bottom: 2px solid var(--border); padding: 76px 0 48px; }
      .hero h1 { font-size: clamp(34px, 4.5vw, 56px); font-weight: 900; letter-spacing: -1.5px; text-transform: uppercase; margin-bottom: 16px; }
      .hero .lede { font-size: 1.15rem; color: #a1a1aa; }
      .kicker { font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #ffffff; background: #27272a; border: 1px solid var(--border); padding: 6px 14px; border-radius: 4px; display: inline-block; margin-bottom: 20px; }
      .stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
      .stat b { font-weight: 900; font-size: 2.2rem; color: #ffffff; }
      .card, .release, .table-wrap { background: var(--surface); border-color: var(--border); }
      .badge.shipped { background: #ffffff; color: #000000; font-weight: 800; }
      .badge.indev { background: #3f3f46; color: #ffffff; }
      .badge.queued { background: transparent; color: #71717a; border: 1px solid #3f3f46; }
      code { background: #111113; color: #00a2ff; border: 1px solid #27272a; }
      .topnav { background: rgba(0, 0, 0, 0.95); border-bottom-color: var(--border); }
      .topnav a { color: var(--text); }
      .topnav a:hover { background: var(--surface); }
      th { background: #27272a; color: #fff; }
      td { border-bottom-color: var(--border-light); }
    `,
  },
  {
    id: "07-riot-games",
    name: "Riot Games",
    category: "Esports & Gaming",
    tagline: "Warm near-black #2b2a29, crimson red #d1363a voltage, heavy Riot Sans display",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #2b2a29;
      --bg-subtle: #1f1e1d;
      --surface: #363433;
      --surface-raised: #444140;
      --text: #f5f5f5;
      --text-muted: #a6a3a0;
      --accent: #d1363a;
      --accent-hover: #b02a2e;
      --accent-ink: #ffffff;
      --border: rgba(255, 255, 255, 0.12);
      --border-accent: rgba(209, 54, 58, 0.4);
      --font-display: "Cinzel", serif;
      --font-body: "Inter", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 2px;
      --radius-pill: 2px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: linear-gradient(180deg, #1c1b1a 0%, #2b2a29 100%); border-bottom: 2px solid var(--accent); padding: 76px 0 52px; }
      .hero h1 { font-family: var(--font-display); font-size: clamp(32px, 4.2vw, 52px); font-weight: 900; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; color: #ffffff; }
      .hero .lede { font-size: 1.15rem; color: var(--text-muted); }
      .kicker { font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #ffffff; background: var(--accent); border: none; padding: 6px 14px; border-radius: 0px; display: inline-block; margin-bottom: 20px; }
      .stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); border-left: 3px solid var(--accent); }
      .stat b { font-family: var(--font-display); font-weight: 800; font-size: 2.1rem; color: #ffffff; }
      .card, .release, .table-wrap { background: var(--surface); border-color: var(--border); }
      .badge.shipped { background: var(--accent); color: #ffffff; font-weight: 800; letter-spacing: 1px; }
      .badge.indev { background: #444140; color: #f5f5f5; border: 1px solid var(--border); }
      .badge.queued { background: transparent; color: var(--text-muted); border: 1px dashed var(--border); }
      code { background: #1c1b1a; color: #ff8588; border: 1px solid rgba(209, 54, 58, 0.3); }
      .topnav { background: rgba(28, 27, 26, 0.95); border-bottom-color: var(--border); }
      .topnav a { color: var(--text); text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
      .topnav a:hover { background: var(--surface); color: var(--accent); }
      th { background: var(--surface-raised); color: #fff; }
      td { border-bottom-color: rgba(255, 255, 255, 0.06); }
    `,
  },
  {
    id: "08-clay",
    name: "Clay",
    category: "GTM & AI Orchestration",
    tagline: "Warm cream #fffaf0 canvas, Plain Black rounded display, saturated pastel feature cards",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #fffaf0;
      --bg-subtle: #f7f1e3;
      --surface: #ffffff;
      --text: #1d1c1a;
      --text-muted: #6b675e;
      --accent: #2e62ff;
      --accent-ink: #ffffff;
      --card-pink: #fdf0f4;
      --card-teal: #eef8f6;
      --card-lavender: #f2effd;
      --card-peach: #fff2ea;
      --border: #e8ded1;
      --border-light: #f0e7dc;
      --font-display: "Fraunces", Georgia, serif;
      --font-body: "Plus Jakarta Sans", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 18px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: radial-gradient(1000px 420px at 50% 0%, #fcedd8 0%, rgba(255, 250, 240, 0) 100%), var(--bg); border-bottom: 1px solid var(--border); padding: 76px 0 52px; }
      .hero h1 { font-family: var(--font-display); font-size: clamp(36px, 4.8vw, 60px); font-weight: 800; letter-spacing: -1.2px; margin-bottom: 16px; }
      .hero .lede { font-size: 1.2rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 700; color: #1d1c1a; background: #fae2cc; border: 1px solid #eec4a0; padding: 6px 16px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; }
      .stat { background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
      .stat b { font-family: var(--font-display); font-weight: 800; font-size: 2.2rem; color: #1d1c1a; }
      .card { background: var(--card-teal); border-color: #d1ebe5; border-radius: var(--radius); }
      .card:nth-child(2) { background: var(--card-lavender); border-color: #ded7fa; }
      .card:nth-child(3) { background: var(--card-peach); border-color: #fcd9c5; }
      .release { background: #ffffff; border-radius: var(--radius); border-color: var(--border); }
      .badge.shipped { background: #d7f0e8; color: #0d5945; font-weight: 700; border: 1px solid #b2e2d3; }
      .badge.indev { background: #fae6d9; color: #873e13; border: 1px solid #f2c7ac; }
      .badge.queued { background: #eae6df; color: #5a554d; }
      .topnav { background: rgba(255, 250, 240, 0.95); border-bottom-color: var(--border); }
      .topnav a { color: var(--text); }
      .topnav a:hover { background: var(--bg-subtle); }
      th { background: #f3ebdE; color: var(--text); font-weight: 700; }
      td { border-bottom-color: var(--border-light); }
    `,
  },
  {
    id: "09-krea",
    name: "Krea",
    category: "Generative AI Suite",
    tagline:
      "Near-black floor #0b0f15, pure-white pill CTA as brightest accent, Suisse Intl, binary 8px / pill geometry",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #0b0f15;
      --bg-subtle: #121820;
      --surface: #18202b;
      --surface-raised: #202b3a;
      --text: #ffffff;
      --text-muted: #8f9ca8;
      --accent: #ffffff;
      --accent-ink: #0b0f15;
      --border: rgba(255, 255, 255, 0.08);
      --border-light: rgba(255, 255, 255, 0.05);
      --font-display: "Plus Jakarta Sans", sans-serif;
      --font-body: "Plus Jakarta Sans", sans-serif;
      --font-mono: "Geist Mono", monospace;
      --radius: 8px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: radial-gradient(900px 380px at 50% -10%, #1a2330 0%, var(--bg) 100%); border-bottom: 1px solid var(--border); padding: 76px 0 52px; }
      .hero h1 { font-size: clamp(34px, 4.6vw, 58px); font-weight: 700; letter-spacing: -1.6px; margin-bottom: 16px; }
      .hero .lede { font-size: 1.15rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 500; color: #ffffff; background: #1c2634; border: 1px solid var(--border); padding: 6px 14px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; }
      .stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
      .stat b { font-weight: 700; font-size: 2.1rem; color: #ffffff; }
      .card, .release, .table-wrap { background: var(--surface); border-color: var(--border); border-radius: 16px; }
      .badge.shipped { background: #ffffff; color: #0b0f15; font-weight: 600; }
      .badge.indev { background: #263345; color: #ffffff; border: 1px solid var(--border); }
      .badge.queued { background: transparent; color: var(--text-muted); border: 1px dashed var(--border); }
      code { background: #10151c; color: #c4d3e3; border: 1px solid var(--border); }
      .topnav { background: rgba(11, 15, 21, 0.95); border-bottom-color: var(--border); }
      .topnav a { color: var(--text); }
      .topnav a:hover { background: var(--surface); }
      th { background: var(--surface-raised); color: #fff; }
      td { border-bottom-color: var(--border-light); }
    `,
  },
  {
    id: "10-dub",
    name: "Dub",
    category: "Traffic & Link Infrastructure",
    tagline: "Crisp white canvas, hairline elevation borders #e5e5e5, royal blue #2563eb, Inter + Geist Mono",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap",
    cssTokens: `
      --bg: #ffffff;
      --bg-subtle: #fafafa;
      --surface: #ffffff;
      --text: #0a0a0a;
      --text-muted: #525252;
      --accent: #2563eb;
      --accent-hover: #1d4ed8;
      --accent-ink: #ffffff;
      --border: #e5e5e5;
      --border-light: #f0f0f0;
      --font-display: "Inter", sans-serif;
      --font-body: "Inter", sans-serif;
      --font-mono: "Geist Mono", monospace;
      --radius: 12px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg-subtle); color: var(--text); }
      .hero { background: var(--bg); border-bottom: 1px solid var(--border); padding: 76px 0 52px; }
      .hero h1 { font-size: clamp(34px, 4.5vw, 56px); font-weight: 700; letter-spacing: -1.5px; margin-bottom: 16px; }
      .hero .lede { font-size: 1.15rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 600; color: #1d4ed8; background: #eff6ff; border: 1px solid #bfdbfe; padding: 6px 14px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; }
      .stat { background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); }
      .stat b { font-family: var(--font-mono); font-weight: 700; font-size: 2rem; color: var(--text); }
      .card, .release, .table-wrap { background: #ffffff; border-color: var(--border); border-radius: var(--radius); box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
      .badge.shipped { background: #eff6ff; color: #1d4ed8; font-weight: 600; border: 1px solid #bfdbfe; }
      .badge.indev { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
      .badge.queued { background: #f5f5f5; color: #737373; border: 1px solid #e5e5e5; }
      code { background: #f5f5f5; color: #09090b; border: 1px solid #e5e5e5; }
      .topnav { background: rgba(255, 255, 255, 0.95); border-bottom-color: var(--border); }
      .topnav a { color: var(--text); }
      .topnav a:hover { background: #f5f5f5; color: var(--accent); }
      th { background: #f9fafb; color: var(--text); font-weight: 600; }
      td { border-bottom-color: var(--border-light); }
    `,
  },
  {
    id: "11-pitch",
    name: "Pitch",
    category: "Presentations & Visual Decks",
    tagline: "Vivid purple canvas #6b53ff, Mark Pro heavy display, mustard yellow accent chips #ffd02c",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #6b53ff;
      --bg-subtle: #5842e3;
      --surface: #ffffff;
      --surface-dark: #5842e3;
      --text: #ffffff;
      --text-dark: #141416;
      --text-muted: rgba(255, 255, 255, 0.8);
      --accent: #ffd02c;
      --accent-ink: #141416;
      --border: rgba(255, 255, 255, 0.18);
      --border-light: #e6e8ec;
      --font-display: "Plus Jakarta Sans", sans-serif;
      --font-body: "Inter", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 16px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: #f7f7fa; color: #141416; }
      .hero { background: var(--bg); color: #ffffff; border-bottom: 1px solid var(--border); padding: 76px 0 52px; }
      .hero h1 { font-family: var(--font-display); font-size: clamp(36px, 4.8vw, 60px); font-weight: 800; letter-spacing: -1.2px; margin-bottom: 16px; color: #ffffff; }
      .hero .lede { font-size: 1.18rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 800; color: #141416; background: #ffd02c; border: none; padding: 6px 16px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; }
      .hero .stat { background: rgba(255, 255, 255, 0.12); border: 1px solid var(--border); border-radius: var(--radius); color: #fff; }
      .hero .stat b { font-family: var(--font-display); font-weight: 800; font-size: 2.2rem; color: #ffd02c; }
      .hero .stat span { color: rgba(255, 255, 255, 0.85); }
      .card, .release, .table-wrap { background: #ffffff; border-color: #e6e8ec; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
      .badge.shipped { background: #6b53ff; color: #ffffff; font-weight: 700; }
      .badge.indev { background: #ffd02c; color: #141416; font-weight: 700; }
      .badge.queued { background: #f0f0f5; color: #777e90; }
      code { background: #f0f0f5; color: #6b53ff; font-weight: 500; }
      .topnav { background: rgba(107, 83, 255, 0.96); border-bottom-color: var(--border); }
      .topnav a { color: #ffffff; }
      .topnav a:hover { background: rgba(255, 255, 255, 0.18); }
      th { background: #f7f7fa; color: #141416; font-weight: 700; }
      td { border-bottom-color: #f0f0f5; }
    `,
  },
  {
    id: "12-spline",
    name: "Spline",
    category: "3D WebGL Platform",
    tagline: "Absolute pure-black floor #000000, glowing electric cobalt #0062ff pill, Spline Sans 500",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #000000;
      --bg-subtle: #0a0a0c;
      --surface: #121216;
      --surface-raised: #1c1c22;
      --text: #ffffff;
      --text-muted: #9e9ea7;
      --accent: #0062ff;
      --accent-hover: #2979ff;
      --accent-ink: #ffffff;
      --border: rgba(255, 255, 255, 0.08);
      --border-glow: rgba(0, 98, 255, 0.4);
      --font-display: "Plus Jakarta Sans", sans-serif;
      --font-body: "Plus Jakarta Sans", sans-serif;
      --font-mono: "Geist Mono", monospace;
      --radius: 16px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: radial-gradient(1000px 420px at 50% 0%, rgba(0, 98, 255, 0.22) 0%, transparent 100%), var(--bg); border-bottom: 1px solid var(--border); padding: 76px 0 52px; }
      .hero h1 { font-size: clamp(34px, 4.6vw, 58px); font-weight: 700; letter-spacing: -1.6px; margin-bottom: 16px; }
      .hero .lede { font-size: 1.15rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 600; color: #ffffff; background: #0062ff; border: none; padding: 6px 16px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; box-shadow: 0 0 16px rgba(0, 98, 255, 0.5); }
      .stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
      .stat b { font-weight: 700; font-size: 2.1rem; color: #ffffff; }
      .card, .release, .table-wrap { background: var(--surface); border-color: var(--border); border-radius: var(--radius); }
      .badge.shipped { background: #0062ff; color: #ffffff; font-weight: 600; box-shadow: 0 0 12px rgba(0, 98, 255, 0.35); }
      .badge.indev { background: #1c1c22; color: #9e9ea7; border: 1px solid var(--border); }
      .badge.queued { background: transparent; color: #5d5d67; border: 1px dashed var(--border); }
      code { background: #0a0a0c; color: #82b1ff; border: 1px solid rgba(0, 98, 255, 0.2); }
      .topnav { background: rgba(0, 0, 0, 0.95); border-bottom-color: var(--border); }
      .topnav a { color: var(--text); }
      .topnav a:hover { background: var(--surface); color: #2979ff; }
      th { background: var(--surface-raised); color: #fff; }
      td { border-bottom-color: rgba(255, 255, 255, 0.05); }
    `,
  },
  {
    id: "13-crunchyroll",
    name: "Crunchyroll",
    category: "Anime & Entertainment",
    tagline: "Dual-canvas dark hero #141519 to white funnel #ffffff, Crunchyroll Orange #ff5e00, 48px capsules",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@800;900&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #ffffff;
      --bg-dark: #141519;
      --surface: #ffffff;
      --text: #141519;
      --text-muted: #606060;
      --accent: #ff5e00;
      --accent-hover: #ff7626;
      --accent-ink: #000000;
      --border: #e0e0e0;
      --border-light: #f0f0f0;
      --font-display: "Cabinet Grotesk", -apple-system, sans-serif;
      --font-body: "DM Sans", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 12px;
      --radius-pill: 48px;
    `,
    customCss: `
      body { background: #f8f8f9; color: var(--text); }
      .hero { background: var(--bg-dark); color: #ffffff; border-bottom: 4px solid var(--accent); padding: 76px 0 52px; }
      .hero h1 { font-family: var(--font-display); font-size: clamp(36px, 4.8vw, 60px); font-weight: 900; letter-spacing: -1px; text-transform: uppercase; margin-bottom: 16px; color: #ffffff; }
      .hero .lede { font-size: 1.18rem; color: #a0a0a0; }
      .kicker { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #000000; background: var(--accent); border: none; padding: 6px 18px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; }
      .hero .stat { background: #23252b; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: var(--radius); color: #fff; }
      .hero .stat b { font-family: var(--font-display); font-weight: 900; font-size: 2.2rem; color: var(--accent); }
      .hero .stat span { color: #a0a0a0; }
      .card, .release, .table-wrap { background: #ffffff; border-color: var(--border); border-radius: 16px; }
      .badge.shipped { background: var(--accent); color: #000000; font-weight: 800; border-radius: var(--radius-pill); }
      .badge.indev { background: #fff0e6; color: #c44900; font-weight: 700; border-radius: var(--radius-pill); }
      .badge.queued { background: #f0f0f0; color: #606060; border-radius: var(--radius-pill); }
      code { background: #f0f0f0; color: #ff5e00; font-weight: 600; }
      .topnav { background: rgba(20, 21, 25, 0.96); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      .topnav a { color: #ffffff; }
      .topnav a:hover { background: #23252b; color: var(--accent); }
      th { background: #f0f0f2; color: var(--text); font-weight: 700; }
      td { border-bottom-color: var(--border-light); }
    `,
  },
  {
    id: "14-beehiiv",
    name: "Beehiiv",
    category: "Creator & Newsletter Publishing",
    tagline:
      "Dark violet floor #060419, Clash Grotesk uppercase display, Satoshi body, indigo #2f39ba + magenta highlights",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #060419;
      --bg-subtle: #0e0a2b;
      --surface: #141038;
      --surface-raised: #1c184c;
      --text: #ffffff;
      --text-muted: #a5a0c8;
      --accent: #2f39ba;
      --accent-magenta: #ff5ec4;
      --accent-ink: #ffffff;
      --border: rgba(255, 255, 255, 0.1);
      --border-light: rgba(255, 255, 255, 0.06);
      --font-display: "Plus Jakarta Sans", sans-serif;
      --font-body: "Inter", sans-serif;
      --font-mono: "Geist Mono", monospace;
      --radius: 16px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: radial-gradient(1000px 420px at 50% 0%, rgba(255, 94, 196, 0.2) 0%, transparent 100%), var(--bg-subtle); border-bottom: 1px solid var(--border); padding: 76px 0 52px; }
      .hero h1 { font-family: var(--font-display); font-size: clamp(34px, 4.6vw, 58px); font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 16px; background: linear-gradient(135deg, #ffffff 60%, #ff5ec4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .hero .lede { font-size: 1.15rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #ffffff; background: linear-gradient(135deg, #ff5ec4 0%, #2f39ba 100%); border: none; padding: 6px 16px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; }
      .stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
      .stat b { font-family: var(--font-display); font-weight: 800; font-size: 2.1rem; color: #ffffff; }
      .card, .release, .table-wrap { background: var(--surface); border-color: var(--border); border-radius: var(--radius); }
      .badge.shipped { background: var(--accent); color: #ffffff; font-weight: 700; border: 1px solid rgba(255, 94, 196, 0.4); }
      .badge.indev { background: rgba(255, 94, 196, 0.15); color: #ff5ec4; border: 1px solid #ff5ec4; }
      .badge.queued { background: rgba(255, 255, 255, 0.06); color: var(--text-muted); }
      code { background: #0e0a2b; color: #ff5ec4; border: 1px solid rgba(255, 94, 196, 0.25); }
      .topnav { background: rgba(6, 4, 25, 0.95); border-bottom-color: var(--border); }
      .topnav a { color: var(--text); }
      .topnav a:hover { background: var(--surface); color: #ff5ec4; }
      th { background: var(--surface-raised); color: #fff; }
      td { border-bottom-color: var(--border-light); }
    `,
  },
];

function generateVariantHtml(theme: DesignTheme): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Muse Skills — Work Report · ${theme.name} Edition</title>
<meta name="description" content="Milestone work report rendered using the ${theme.name} DESIGN.md specification with Better-UI & Better-Type principles.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${theme.fontsUrl}" rel="stylesheet">
<style>
:root {
  ${theme.cssTokens}
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
.skip { position: absolute; left: -9999px; top: 0; background: #000; color: #fff; padding: 8px 16px; z-index: 99; }
.skip:focus { left: 8px; top: 8px; }

/* Navigation */
.topnav { position: sticky; top: 0; z-index: 50; backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }
.topnav .wrap { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; padding-bottom: 12px; }
.nav-brand { font-weight: 700; font-size: 14px; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px; }
.nav-links { display: flex; gap: 6px; flex-wrap: wrap; }
.topnav a { text-decoration: none; font-weight: 600; font-size: 0.9rem; padding: 6px 14px; border-radius: var(--radius-pill); transition: all 0.2s ease; }

/* Hero */
.hero { border-bottom: 1px solid var(--border); }
.hero-inner { padding: 64px 0 44px; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-top: 36px; }
.stat { padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
.stat b { display: block; line-height: 1; margin-bottom: 6px; }
.stat span { font-size: 0.85rem; color: var(--text-muted); }

/* Blocks */
section.block { padding: 48px 0 12px; }
.sec-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 6px; }
.sec-head h2 { font-family: var(--font-display); font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; letter-spacing: -0.5px; }
.sec-head .n { font-family: var(--font-mono); font-size: 0.95rem; font-weight: 600; color: var(--text-muted); }
.sec-sub { color: var(--text-muted); max-width: 72ch; margin-bottom: 24px; font-size: 1rem; }

/* Cards & Releases */
.release { border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 26px; margin-bottom: 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.release h3 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
.release .meta { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px; }
.release ul { margin: 0.5em 0 0.5em 1.2em; padding: 0; }
.release li { margin-bottom: 0.4em; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.card { border: 1px solid var(--border); border-radius: var(--radius); padding: 22px 24px; display: flex; flex-direction: column; gap: 10px; }
.card h3 { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; justify-content: space-between; }
.card p { font-size: 0.95rem; line-height: 1.55; }
.card .files { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); border-top: 1px dashed var(--border); padding-top: 10px; margin-top: 4px; }

/* Table */
.table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 18px; }
table { border-collapse: collapse; width: 100%; font-size: 0.94rem; }
th, td { text-align: left; padding: 14px 18px; border-bottom: 1px solid var(--border); vertical-align: middle; }
th { font-size: 0.82rem; letter-spacing: 0.05em; text-transform: uppercase; font-family: var(--font-display); }
tr:last-child td { border-bottom: 0; }

/* Handoff Box */
.handoff-box { border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 30px; margin-top: 16px; }
.handoff-box h3 { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
.code-box { background: #0a0a0e; color: #e6f3ee; padding: 18px 20px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.88rem; white-space: pre-wrap; line-height: 1.55; margin-top: 14px; border: 1px solid rgba(255,255,255,0.12); }

/* Badges & Code */
.badge { display: inline-block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; padding: 3px 10px; border-radius: var(--radius-pill); vertical-align: middle; }
code { font-family: var(--font-mono); font-size: 0.88em; padding: 2px 6px; border-radius: 4px; }

/* Switcher Banner */
.template-banner { background: #111; color: #fff; padding: 8px 24px; font-size: 13px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.15); }
.template-banner a { color: #58a6ff; text-decoration: none; font-weight: 600; }
.template-banner a:hover { text-decoration: underline; }

footer { border-top: 1px solid var(--border); margin-top: 56px; padding: 28px 0 64px; color: var(--text-muted); font-size: 0.88rem; }

${theme.customCss}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<div class="template-banner">
  <div><strong>Design Variant:</strong> ${theme.name} (${theme.category}) — <em>${theme.tagline}</em></div>
  <div><a href="gallery.html">← Back to All 14 Templates Gallery</a></div>
</div>

<header class="hero">
  <div class="wrap hero-inner">
    <span class="kicker">Milestone work report · ${commonContent.date}</span>
    <h1>${commonContent.title}</h1>
    <p class="lede">${commonContent.lede}</p>
    <div class="stats" role="list" aria-label="Headline numbers">
      ${commonContent.stats.map((s) => `<div class="stat" role="listitem"><b>${s.num}</b><span>${s.label}</span></div>`).join("\n      ")}
    </div>
  </div>
</header>

<nav class="topnav" aria-label="Report sections">
  <div class="wrap">
    <div class="nav-brand"><span>Muse Skills</span> · <span>${theme.name}</span></div>
    <div class="nav-links">
      <a href="#intake">Corpus Intake</a>
      <a href="#matrix">Discovery Matrix</a>
      <a href="#enrichments">Enrichment & Candidates</a>
      <a href="#handoff">Next Agent Handoff</a>
    </div>
  </div>
</nav>

<main id="main" class="wrap">

  <!-- INTAKE SUMMARY -->
  <section class="block" id="intake" aria-labelledby="intake-h">
    <div class="sec-head"><span class="n">01</span><h2 id="intake-h">Corpus Intake Summary</h2></div>
    <p class="sec-sub">Systematic logging of high-signal official and community skill repositories into durable artifacts.</p>

    <article class="release">
      <h3>Official Vendor Foundations <span class="badge shipped">INGESTED</span></h3>
      <div class="meta">Recorded in <code>.agents/artifacts/skill-mining-intake/corpus-raw.md</code></div>
      <ul>
        <li><strong>Google Cloud:</strong> Gemini API SDK, Interactions API, GKE Autopilot golden path, Network Observability, Recipe Auth/Onboarding, and all 6 Well-Architected Framework pillars (Cost, Ops, Performance, Reliability, Security, Sustainability).</li>
        <li><strong>Red Hat:</strong> CVE Skillpack diagnostics & classification, SRE fleet remediation via Ansible + Lightspeed, and OpenShift cluster / virtualization management.</li>
        <li><strong>Cypress.io:</strong> Official E2E/component test authoring, explainers, and documentation extractors.</li>
        <li><strong>Qdrant:</strong> Production vector search, payload indexing, model migration, scaling, and multi-language SDK patterns.</li>
      </ul>
    </article>

    <article class="release">
      <h3>Community & High-Leverage Ecosystems <span class="badge shipped">INGESTED</span></h3>
      <div class="meta">Categorized across Marketing, Productivity, Development, Context Engineering, and Specialized Domains</div>
      <ul>
        <li><strong>Cognitive Gates:</strong> Kilo-Kit (C4 workflow gates, ToT DAG), Perfectify (DAGx kernel), Aegis, and Itqan full lifecycle engineering.</li>
        <li><strong>Anti-Slop & Quality Filters:</strong> Unslop, Beautiful Prose, Sepia, and Simple-Man (1,793 benchmarked test calls).</li>
        <li><strong>Automation & Tooling:</strong> Postiz Agent, Nutrient DWS, Taisly, and comprehensive n8n expert workflow modules.</li>
        <li><strong>Context & Memory:</strong> Karpathy LLM Wiki pattern, graph-based memory, and token-aware context doctoring.</li>
      </ul>
    </article>
  </section>

  <!-- DISCOVERY MATRIX -->
  <section class="block" id="matrix" aria-labelledby="matrix-h">
    <div class="sec-head"><span class="n">02</span><h2 id="matrix-h">Multi-Level Discovery Matrix</h2></div>
    <p class="sec-sub">Rules for subagents to navigate nested repository structures and locate canonical <code>SKILL.md</code> files.</p>

    <div class="grid">
      ${commonContent.matrixLevels
        .map(
          (m) => `
      <article class="card">
        <h3>${m.level} <span class="badge shipped">PATTERNS</span></h3>
        <p>${m.desc}</p>
        <div class="files">${m.pattern}</div>
      </article>`,
        )
        .join("")}
    </div>
  </section>

  <!-- ENRICHMENTS & CANDIDATES -->
  <section class="block" id="enrichments" aria-labelledby="enrichments-h">
    <div class="sec-head"><span class="n">03</span><h2 id="enrichments-h">Enrichments &amp; New Skill Proposals</h2></div>
    <p class="sec-sub">Proposals aligned with the principal's agency stack and fallback doctrines.</p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Target Skill</th>
            <th>Type</th>
            <th>Division / Lead</th>
            <th>Enriched Capabilities &amp; Modes</th>
          </tr>
        </thead>
        <tbody>
          ${commonContent.proposals
            .map(
              (p) => `
          <tr>
            <td><strong>${p.name}</strong></td>
            <td><span class="badge ${p.type === "PROPOSED" ? "indev" : "shipped"}">${p.type}</span></td>
            <td>${p.lead}</td>
            <td>${p.desc}</td>
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </section>

  <!-- NEXT AGENT HANDOFF -->
  <section class="block" id="handoff" aria-labelledby="handoff-h">
    <div class="sec-head"><span class="n">04</span><h2 id="handoff-h">Next Agent Handoff</h2></div>
    <p class="sec-sub">Copy-paste prompt to launch the phased improvement work in future sessions.</p>

    <div class="handoff-box">
      <h3>Phase Execution Prompt <span class="badge queued">READY FOR LAUNCH</span></h3>
      <p>Provide this instruction to the incoming agent to execute the phased improvements:</p>
      <div class="code-box">${commonContent.handoffPrompt}</div>
    </div>
  </section>

</main>

<footer>
  <div class="wrap">
    <div>Muse Skills Agency Suite · Milestone Report (${theme.name} Design Spec) · Generated 2026-09-20</div>
  </div>
</footer>

</body>
</html>`;
}

function generateGalleryHtml(allThemes: DesignTheme[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Muse Skills — Milestone Report Design System Gallery (14 Variants)</title>
<meta name="description" content="Interactive visual gallery and switcher for 14 brand design system report templates.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  background: #090a0f;
  color: #f0f3f8;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
header {
  padding: 36px 32px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: #0e1017;
}
.header-top {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}
.header-top h1 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.header-top p {
  color: #94a3b8;
  font-size: 15px;
  margin-top: 4px;
  max-width: 700px;
}
.badge-count {
  background: #2563eb;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 9999px;
  display: inline-block;
}

.gallery-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  flex: 1;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

.sidebar {
  border-right: 1px solid rgba(255,255,255,0.1);
  padding: 20px 16px;
  background: #0b0d13;
  overflow-y: auto;
  height: calc(100vh - 120px);
  position: sticky;
  top: 0;
}
.sidebar-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #64748b;
  margin: 8px 12px 14px;
}

.theme-card-btn {
  width: 100%;
  text-align: left;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 8px;
  color: #f0f3f8;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.theme-card-btn:hover {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.16);
}
.theme-card-btn.active {
  background: #1e293b;
  border-color: #3b82f6;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.3);
}
.theme-card-btn .btn-title {
  font-size: 15px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.theme-card-btn .btn-cat {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.theme-card-btn .btn-tag {
  font-size: 12px;
  color: #64748b;
  line-height: 1.35;
  margin-top: 2px;
}

.preview-pane {
  display: flex;
  flex-direction: column;
  background: #050608;
  height: calc(100vh - 120px);
}
.preview-toolbar {
  padding: 12px 24px;
  background: #0e1017;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.preview-info {
  font-size: 14px;
}
.preview-info strong {
  color: #fff;
  font-weight: 700;
}
.preview-actions {
  display: flex;
  gap: 10px;
}
.btn-open {
  background: #2563eb;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  transition: background 0.15s ease;
}
.btn-open:hover {
  background: #1d4ed8;
}

iframe {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
}

@media (max-width: 900px) {
  .gallery-layout { grid-template-columns: 1fr; }
  .sidebar { height: auto; position: static; }
  .preview-pane { height: 600px; }
}
</style>
</head>
<body>

<header>
  <div class="header-top">
    <div>
      <h1>Muse Skills — Milestone Report Design System Gallery</h1>
      <p>Compare the same milestone report rendered across 14 distinctive, production-grade brand design systems with full typographic and token fidelity.</p>
    </div>
    <div>
      <span class="badge-count">14 Templates Available</span>
    </div>
  </div>
</header>

<div class="gallery-layout">
  <aside class="sidebar">
    <div class="sidebar-title">Select Design Variant</div>
    ${allThemes
      .map(
        (t, idx) => `
    <button class="theme-card-btn ${idx === 0 ? "active" : ""}" onclick="selectTheme('${t.id}', '${t.name}', '${t.category}', '${t.tagline}', this)">
      <div class="btn-title">
        <span>${idx + 1}. ${t.name}</span>
      </div>
      <div class="btn-cat">${t.category}</div>
      <div class="btn-tag">${t.tagline}</div>
    </button>`,
      )
      .join("")}
  </aside>

  <main class="preview-pane">
    <div class="preview-toolbar">
      <div class="preview-info" id="preview-meta">
        <strong>${allThemes[0].name}</strong> — <span>${allThemes[0].tagline}</span>
      </div>
      <div class="preview-actions">
        <a id="btn-open-tab" href="report-${allThemes[0].id}.html" target="_blank" class="btn-open">Open Standalone Tab ↗</a>
      </div>
    </div>
    <iframe id="preview-frame" src="report-${allThemes[0].id}.html" title="Report Preview"></iframe>
  </main>
</div>

<script>
function selectTheme(id, name, category, tagline, btnEl) {
  document.querySelectorAll('.theme-card-btn').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  const filename = 'report-' + id + '.html';
  document.getElementById('preview-frame').src = filename;
  document.getElementById('btn-open-tab').href = filename;
  document.getElementById('preview-meta').innerHTML = '<strong>' + name + '</strong> (' + category + ') — <span>' + tagline + '</span>';
}
</script>

</body>
</html>`;
}

// Generate all 14 variant HTML files
for (const theme of themes) {
  const filePath = join(VARIANTS_DIR, `report-${theme.id}.html`);
  writeFileSync(filePath, generateVariantHtml(theme), "utf8");
  console.log(`Generated: ${filePath}`);
}

// Generate Master Gallery Switcher
const galleryPath = join(VARIANTS_DIR, "gallery.html");
writeFileSync(galleryPath, generateGalleryHtml(themes), "utf8");
console.log(`Generated Gallery Switcher: ${galleryPath}`);
