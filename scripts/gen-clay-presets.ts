import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VARIANTS_DIR = join(process.cwd(), ".agents/reports/variants");
mkdirSync(VARIANTS_DIR, { recursive: true });

interface ClayPreset {
  id: string;
  name: string;
  category: string;
  tagline: string;
  displayFontName: string;
  bodyFontName: string;
  monoFontName: string;
  fontsUrl: string;
  cssTokens: string;
  customCss: string;
  isDualMode?: boolean;
}

const _commonContent = {
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

const presets: ClayPreset[] = [
  {
    id: "clay-dual-mode",
    name: "⭐ Custom Match: Dual-Mode (Neo-Pop / Midnight)",
    category: "Interactive ☀️ Light / 🌙 Dark",
    tagline: "Bricolage Grotesque Display + Plus Jakarta Sans Body + JetBrains Mono Code",
    displayFontName: "Bricolage Grotesque (Expressive)",
    bodyFontName: "Plus Jakarta Sans (Geometric)",
    monoFontName: "JetBrains Mono (Precision Code)",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
    isDualMode: true,
    cssTokens: ``,
    customCss: ``,
  },
  {
    id: "clay-03-neo-pop",
    name: "Neo-Pop Electric (Standalone Light)",
    category: "High-Energy Tech Agency",
    tagline: "Crisp Canvas · High-Saturate Pastel Cards · Electric Indigo Accent",
    displayFontName: "Bricolage Grotesque (Expressive)",
    bodyFontName: "Plus Jakarta Sans (Geometric)",
    monoFontName: "JetBrains Mono (Code)",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #fcfcfe;
      --bg-subtle: #f4f4fa;
      --surface: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --accent: #4f46e5;
      --accent-ink: #ffffff;
      --card-1: #dcfce7; --card-1-border: #bbf7d0;
      --card-2: #ede9fe; --card-2-border: #ddd6fe;
      --card-3: #ffedd5; --card-3-border: #fed7aa;
      --card-4: #e0f2fe; --card-4-border: #bae6fd;
      --border: #e2e8f0;
      --border-light: #f1f5f9;
      --font-display: "Bricolage Grotesque", sans-serif;
      --font-body: "Plus Jakarta Sans", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 16px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg-subtle); color: var(--text); }
      .hero { background: radial-gradient(1000px 420px at 50% 0%, #e0e7ff 0%, rgba(252, 252, 254, 0) 100%), #ffffff; border-bottom: 2px solid var(--border); padding: 76px 0 52px; }
      .hero h1 { font-family: var(--font-display); font-size: clamp(36px, 4.8vw, 60px); font-weight: 800; letter-spacing: -1px; margin-bottom: 16px; }
      .hero .lede { font-size: 1.18rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 700; color: #ffffff; background: #4f46e5; border: none; padding: 6px 16px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }
      .stat { background: #ffffff; border: 2px solid var(--border); border-radius: var(--radius); }
      .stat b { font-family: var(--font-display); font-weight: 800; font-size: 2.2rem; color: #4f46e5; }
      .card:nth-child(1) { background: var(--card-1); border-color: var(--card-1-border); }
      .card:nth-child(2) { background: var(--card-2); border-color: var(--card-2-border); }
      .card:nth-child(3) { background: var(--card-3); border-color: var(--card-3-border); }
      .card:nth-child(4) { background: var(--card-4); border-color: var(--card-4-border); }
      .card, .release, .table-wrap { border-width: 2px; }
      .badge.shipped { background: #4f46e5; color: #ffffff; font-weight: 700; }
      .badge.indev { background: #ffedd5; color: #9a3412; font-weight: 700; border: 1px solid #fed7aa; }
      .badge.queued { background: #f1f5f9; color: #475569; }
      .topnav { background: rgba(255, 255, 255, 0.95); border-bottom: 2px solid var(--border); }
      th { background: #f8fafc; color: var(--text); font-weight: 700; }
    `,
  },
  {
    id: "clay-06-midnight-dark",
    name: "Midnight Ceramic (Standalone Dark)",
    category: "Luminous Night Edition",
    tagline: "Obsidian Canvas · Tinted Midnight Containers · Glowing Luminous Cyan Accent",
    displayFontName: "Bricolage Grotesque (Expressive)",
    bodyFontName: "Plus Jakarta Sans (Geometric)",
    monoFontName: "JetBrains Mono (Code)",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #121316;
      --bg-subtle: #181a1f;
      --surface: #1e2027;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #2dd4bf;
      --accent-ink: #042f2e;
      --card-1: #152423; --card-1-border: rgba(45, 212, 191, 0.25);
      --card-2: #1e1b2e; --card-2-border: rgba(167, 139, 250, 0.25);
      --card-3: #261f18; --card-3-border: rgba(251, 191, 36, 0.25);
      --card-4: #18202c; --card-4-border: rgba(96, 165, 250, 0.25);
      --border: rgba(255, 255, 255, 0.1);
      --border-light: rgba(255, 255, 255, 0.05);
      --font-display: "Bricolage Grotesque", sans-serif;
      --font-body: "Plus Jakarta Sans", sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 18px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: radial-gradient(1000px 420px at 50% 0%, rgba(45, 212, 191, 0.15) 0%, transparent 100%), var(--bg); border-bottom: 1px solid var(--border); padding: 76px 0 52px; }
      .hero h1 { font-family: var(--font-display); font-size: clamp(36px, 4.8vw, 60px); font-weight: 800; letter-spacing: -1px; margin-bottom: 16px; color: #ffffff; }
      .hero .lede { font-size: 1.18rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 700; color: #2dd4bf; background: rgba(45, 212, 191, 0.12); border: 1px solid rgba(45, 212, 191, 0.3); padding: 6px 16px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; }
      .stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
      .stat b { font-family: var(--font-display); font-weight: 800; font-size: 2.2rem; color: #2dd4bf; }
      .card:nth-child(1) { background: var(--card-1); border-color: var(--card-1-border); }
      .card:nth-child(2) { background: var(--card-2); border-color: var(--card-2-border); }
      .card:nth-child(3) { background: var(--card-3); border-color: var(--card-3-border); }
      .card:nth-child(4) { background: var(--card-4); border-color: var(--card-4-border); }
      .release, .table-wrap { background: var(--surface); border-color: var(--border); }
      .badge.shipped { background: #2dd4bf; color: #042f2e; font-weight: 700; }
      .badge.indev { background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); }
      .badge.queued { background: rgba(255, 255, 255, 0.08); color: var(--text-muted); }
      code { background: #16181f; color: #2dd4bf; border: 1px solid rgba(45, 212, 191, 0.25); }
      .topnav { background: rgba(18, 19, 22, 0.95); border-bottom-color: var(--border); }
      .topnav a { color: var(--text); }
      .topnav a:hover { background: var(--surface); color: #2dd4bf; }
      th { background: #181a20; color: #fff; }
      td { border-bottom-color: var(--border-light); }
    `,
  },
  {
    id: "clay-01-signature-warm",
    name: "Signature Warm Pastels (Original)",
    category: "The Clay Original",
    tagline: "Warm Cream Canvas · Multi-Hue Pastel Feature Cards · Royal Blue CTAs",
    displayFontName: "Fraunces (Editorial Display Serif)",
    bodyFontName: "Plus Jakarta Sans (Crisp UI Sans)",
    monoFontName: "JetBrains Mono (Data & Code)",
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
      --card-1: #eef8f6; --card-1-border: #d1ebe5;
      --card-2: #f2effd; --card-2-border: #ded7fa;
      --card-3: #fff2ea; --card-3-border: #fcd9c5;
      --card-4: #fff9db; --card-4-border: #faeeb2;
      --border: #e8ded1;
      --border-light: #f0e7dc;
      --font-display: "Fraunces", Georgia, serif;
      --font-body: "Plus Jakarta Sans", -apple-system, sans-serif;
      --font-mono: "JetBrains Mono", monospace;
      --radius: 18px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: radial-gradient(1000px 420px at 50% 0%, #fcedd8 0%, rgba(255, 250, 240, 0) 100%), var(--bg); border-bottom: 1px solid var(--border); padding: 76px 0 52px; }
      .hero h1 { font-family: var(--font-display); font-size: clamp(36px, 4.8vw, 60px); font-weight: 800; letter-spacing: -1.2px; margin-bottom: 16px; color: #1d1c1a; }
      .hero .lede { font-size: 1.2rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 700; color: #1d1c1a; background: #fae2cc; border: 1px solid #eec4a0; padding: 6px 16px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; }
      .stat { background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
      .stat b { font-family: var(--font-display); font-weight: 800; font-size: 2.2rem; color: #1d1c1a; }
      .card:nth-child(1) { background: var(--card-1); border-color: var(--card-1-border); }
      .card:nth-child(2) { background: var(--card-2); border-color: var(--card-2-border); }
      .card:nth-child(3) { background: var(--card-3); border-color: var(--card-3-border); }
      .card:nth-child(4) { background: var(--card-4); border-color: var(--card-4-border); }
      .badge.shipped { background: #d7f0e8; color: #0d5945; font-weight: 700; border: 1px solid #b2e2d3; }
      .badge.indev { background: #fae6d9; color: #873e13; border: 1px solid #f2c7ac; }
      .badge.queued { background: #eae6df; color: #5a554d; }
      .topnav { background: rgba(255, 250, 240, 0.95); border-bottom-color: var(--border); }
      th { background: #f3ebde; color: var(--text); font-weight: 700; }
    `,
  },
  {
    id: "clay-02-ceramic-studio",
    name: "Ceramic Studio (Sage & Terracotta)",
    category: "Organic Earth & Craft",
    tagline: "Linen Oat Canvas · Sage & Terracotta Tones · Deep Cypress Green Accent",
    displayFontName: "Newsreader (Optical Serif Display)",
    bodyFontName: "Inter (Modern Clear Neutral)",
    monoFontName: "Geist Mono (Engineered Code)",
    fontsUrl:
      "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,600;0,6..72,700;1,6..72,400&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
    cssTokens: `
      --bg: #faf8f4;
      --bg-subtle: #f2ede4;
      --surface: #ffffff;
      --text: #1a201c;
      --text-muted: #5e6862;
      --accent: #1b4332;
      --accent-ink: #ffffff;
      --card-1: #edf5ee; --card-1-border: #d2e5d5;
      --card-2: #faece6; --card-2-border: #f0d3c6;
      --card-3: #f3eee4; --card-3-border: #e2d7c4;
      --card-4: #eaf1f7; --card-4-border: #cbdeee;
      --border: #e4dcce;
      --border-light: #ece5d9;
      --font-display: "Newsreader", Georgia, serif;
      --font-body: "Inter", sans-serif;
      --font-mono: "Geist Mono", monospace;
      --radius: 20px;
      --radius-pill: 9999px;
    `,
    customCss: `
      body { background: var(--bg); color: var(--text); }
      .hero { background: radial-gradient(1000px 420px at 50% 0%, #e8efe9 0%, rgba(250, 248, 244, 0) 100%), var(--bg); border-bottom: 1px solid var(--border); padding: 76px 0 52px; }
      .hero h1 { font-family: var(--font-display); font-size: clamp(38px, 5vw, 64px); font-weight: 700; letter-spacing: -0.8px; margin-bottom: 16px; color: var(--accent); }
      .hero .lede { font-size: 1.18rem; color: var(--text-muted); }
      .kicker { font-size: 12px; font-weight: 700; color: #1b4332; background: #e0eee4; border: 1px solid #c2ded0; padding: 6px 16px; border-radius: var(--radius-pill); display: inline-block; margin-bottom: 20px; }
      .stat { background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); box-shadow: 0 4px 18px rgba(0,0,0,0.02); }
      .stat b { font-family: var(--font-display); font-weight: 700; font-size: 2.3rem; color: #1b4332; }
      .card:nth-child(1) { background: var(--card-1); border-color: var(--card-1-border); }
      .card:nth-child(2) { background: var(--card-2); border-color: var(--card-2-border); }
      .card:nth-child(3) { background: var(--card-3); border-color: var(--card-3-border); }
      .card:nth-child(4) { background: var(--card-4); border-color: var(--card-4-border); }
      .badge.shipped { background: #1b4332; color: #ffffff; font-weight: 600; }
      .badge.indev { background: #faece6; color: #8c3b1a; border: 1px solid #f0d3c6; }
      .badge.queued { background: #ece5d9; color: #5e6862; }
      .topnav { background: rgba(250, 248, 244, 0.95); border-bottom-color: var(--border); }
      th { background: #f0e9dd; color: var(--text); font-weight: 700; }
    `,
  },
];

function generateClayGalleryHtml(allPresets: ClayPreset[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clay Design System — Presets & Font Pairings Gallery</title>
<meta name="description" content="Interactive switcher to compare Clay report color presets and typography pairings.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0d0f14;
  color: #f1f5f9;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
header {
  padding: 30px 32px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: #12151c;
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
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.header-top p {
  color: #94a3b8;
  font-size: 14.5px;
  margin-top: 4px;
  max-width: 750px;
}
.badge-count {
  background: #3b82f6;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 9999px;
  display: inline-block;
}

.gallery-layout {
  display: grid;
  grid-template-columns: 370px 1fr;
  flex: 1;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

.sidebar {
  border-right: 1px solid rgba(255,255,255,0.1);
  padding: 20px 16px;
  background: #0f1218;
  overflow-y: auto;
  height: calc(100vh - 110px);
  position: sticky;
  top: 0;
}
.sidebar-title {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #64748b;
  margin: 8px 12px 14px;
}

.preset-card-btn {
  width: 100%;
  text-align: left;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
  color: #f1f5f9;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.preset-card-btn:hover {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.2);
}
.preset-card-btn.active {
  background: #1e293b;
  border-color: #3b82f6;
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.35);
}
.preset-card-btn .btn-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
}
.preset-card-btn .btn-cat {
  font-size: 11px;
  font-weight: 600;
  color: #38bdf8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.preset-card-btn .btn-fonts {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.4;
  background: rgba(0,0,0,0.25);
  padding: 4px 8px;
  border-radius: 6px;
}

.preview-pane {
  display: flex;
  flex-direction: column;
  background: #08090c;
  height: calc(100vh - 110px);
}
.preview-toolbar {
  padding: 12px 24px;
  background: #12151c;
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
  background: #3b82f6;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  transition: background 0.15s ease;
}
.btn-open:hover {
  background: #2563eb;
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
      <h1>Clay Design System — Presets & Font Pairings</h1>
      <p>Compare Clay report variations featuring Bricolage Grotesque, Plus Jakarta Sans, and JetBrains Mono with interactive dual-mode support.</p>
    </div>
    <div>
      <span class="badge-count">${allPresets.length} Options Available</span>
    </div>
  </div>
</header>

<div class="gallery-layout">
  <aside class="sidebar">
    <div class="sidebar-title">Select Preset</div>
    ${allPresets
      .map(
        (p, idx) => `
    <button class="preset-card-btn ${idx === 0 ? "active" : ""}" onclick="selectPreset('${p.id}', '${p.name}', '${p.category}', '${p.tagline}', this)">
      <div class="btn-title">${p.name}</div>
      <div class="btn-cat">${p.category}</div>
      <div class="btn-fonts">🔤 ${p.displayFontName.split(" ")[0]} + ${p.bodyFontName.split(" ")[0]}</div>
    </button>`,
      )
      .join("")}
  </aside>

  <main class="preview-pane">
    <div class="preview-toolbar">
      <div class="preview-info" id="preview-meta">
        <strong>${allPresets[0].name}</strong> — <span>${allPresets[0].tagline}</span>
      </div>
      <div class="preview-actions">
        <a id="btn-open-tab" href="report-${allPresets[0].id}.html" target="_blank" class="btn-open">Open Standalone Tab ↗</a>
      </div>
    </div>
    <iframe id="preview-frame" src="report-${allPresets[0].id}.html" title="Preset Preview"></iframe>
  </main>
</div>

<script>
function selectPreset(id, name, category, tagline, btnEl) {
  document.querySelectorAll('.preset-card-btn').forEach(b => b.classList.remove('active'));
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

// Generate Clay Gallery
const galleryPath = join(VARIANTS_DIR, "clay-gallery.html");
writeFileSync(galleryPath, generateClayGalleryHtml(presets), "utf8");
console.log(`Generated Clay Gallery: ${galleryPath}`);

// Copy gallery to gallery.html
writeFileSync(join(VARIANTS_DIR, "gallery.html"), generateClayGalleryHtml(presets), "utf8");
