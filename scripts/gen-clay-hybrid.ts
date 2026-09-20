import { writeFileSync } from "node:fs";
import { join } from "node:path";

const VARIANTS_DIR = join(process.cwd(), ".agents/reports/variants");
const REPORTS_DIR = join(process.cwd(), ".agents/reports");

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
      lead: "Official Vendor Foundation",
      badge: "INGESTED",
      desc: "Gemini API SDK, Interactions API, GKE Autopilot golden paths, Network Observability, Recipe Auth/Onboarding, and all 6 Well-Architected Framework pillars (Cost, Ops, Performance, Reliability, Security, Sustainability).",
      details:
        "Raw source: google-cloud/skills & vertex-ai/tools • Mapped into: .agents/artifacts/skill-mining-intake/corpus-raw.md • Integration priority: High",
    },
    {
      title: "Red Hat SRE & Security",
      lead: "Enterprise DevOps & CVE Fleet",
      badge: "INGESTED",
      desc: "CVE Skillpack diagnostics & classification, SRE fleet remediation via Ansible + Lightspeed, and OpenShift cluster / virtualization management.",
      details:
        "Raw source: redhat-community/ansible-skills • Diagnostic accuracy: Verified • Automated remediation targets: Linux/RHEL/OpenShift",
    },
    {
      title: "Cypress & Qdrant Platforms",
      lead: "Testing & Vector Search",
      badge: "INGESTED",
      desc: "Official Cypress E2E/component test authoring, plus Qdrant production vector search, payload indexing, model migration, scaling, and multi-language SDK patterns.",
      details:
        "Vector DB endpoints: Qdrant self-hosted & Cloud • E2E harnesses: Cypress 13+ component test runners • Status: Ready for pipeline extraction",
    },
    {
      title: "Cognitive Gates & Quality Filters",
      lead: "Community Quality Harness",
      badge: "INGESTED",
      desc: "Kilo-Kit (C4 workflow gates, ToT DAG), Perfectify (DAGx kernel), Aegis, Unslop, Sepia, and Simple-Man quality verification benchmarks.",
      details:
        "Verified tests: 1,793 benchmark calls • Target skills for enrichment: git, code-review, new-project • Anti-slop rules: Active",
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
      division: "sol",
      lead: "Sol (Automation)",
      desc: "Full lifecycle n8n workflow builder, expression validator ({{ $json }}), MCP connectors, and research mode.",
    },
    {
      name: "postiz-scheduler",
      type: "PROPOSED",
      division: "jasper",
      lead: "Jasper (Growth)",
      desc: "Autonomous multi-platform social dispatch & scheduling via self-hosted Postiz API.",
    },
    {
      name: "vector-qdrant",
      type: "PROPOSED",
      division: "sol",
      lead: "Sol (Product Architect)",
      desc: "Vector embeddings, payload indexing, hybrid search, and RAG integration.",
    },
    {
      name: "cve-security-audit",
      type: "PROPOSED",
      division: "nexus",
      lead: "Nexus (Quality Gate)",
      desc: "Automated CVE lookup, SAST/SCA diagnostics, and MITRE ATT&CK mitigation workflows.",
    },
    {
      name: "cloud-waf-architect",
      type: "PROPOSED",
      division: "nexus",
      lead: "Nexus (Technical Director)",
      desc: "GCP & Cloudflare Well-Architected Framework audits for Cost, Security, and Reliability.",
    },
    {
      name: "git, code-review, new-project, database",
      type: "ENRICH",
      division: "all",
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

function generateEnhancedDualModeHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark light">
<title>Muse Skills — Work Report · Clay Neo-Pop / Midnight Edition</title>
<meta name="description" content="Milestone work report rendered with Clay Design System, Bricolage Grotesque display, Plus Jakarta Sans body, and JetBrains Mono code.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --font-display: "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-body: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --radius: 18px;
  --radius-sm: 8px;
  --radius-pill: 9999px;
  --header-offset: 76px;
  --timing-fn: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Light Theme: Clay Neo-Pop */
html[data-theme="light"] {
  --bg: #fcfcfe;
  --bg-subtle: #f4f4fa;
  --surface: #ffffff;
  --surface-raised: #f8fafc;
  --text: #0f172a;
  --text-muted: #475569;
  --text-faint: #94a3b8;
  --accent: #4338ca;
  --accent-hover: #3730a3;
  --accent-ink: #ffffff;
  --accent-soft: rgba(67, 56, 202, 0.12);
  --hero-glow: radial-gradient(1000px 420px at 50% 0%, #e0e7ff 0%, rgba(252, 252, 254, 0) 100%);
  --card-1: #dcfce7; --card-1-border: #86efac; --card-1-ink: #14532d;
  --card-2: #ede9fe; --card-2-border: #c4b5fd; --card-2-ink: #3b0764;
  --card-3: #ffedd5; --card-3-border: #fdba74; --card-3-ink: #7c2d12;
  --card-4: #e0f2fe; --card-4-border: #7dd3fc; --card-4-ink: #0c4a6e;
  --border: #cbd5e1;
  --border-light: #e2e8f0;
  --code-bg: #f1f5f9;
  --code-ink: #3730a3;
  --code-border: #cbd5e1;
  --handoff-bg: #ffffff;
  --handoff-terminal: #0f172a;
  --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08);
  --card-hover-shadow: 0 12px 28px -4px rgba(67, 56, 202, 0.16);
}

/* Dark Theme: Clay Midnight Ceramic */
html[data-theme="dark"] {
  --bg: #121316;
  --bg-subtle: #181a1f;
  --surface: #1e2027;
  --surface-raised: #252833;
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --text-faint: #64748b;
  --accent: #2dd4bf;
  --accent-hover: #14b8a6;
  --accent-ink: #042f2e;
  --accent-soft: rgba(45, 212, 191, 0.16);
  --hero-glow: radial-gradient(1000px 420px at 50% 0%, rgba(45, 212, 191, 0.18) 0%, rgba(18, 19, 22, 0) 100%);
  --card-1: #152423; --card-1-border: rgba(45, 212, 191, 0.35); --card-1-ink: #ccfbf1;
  --card-2: #1e1b2e; --card-2-border: rgba(167, 139, 250, 0.35); --card-2-ink: #ede9fe;
  --card-3: #261f18; --card-3-border: rgba(251, 191, 36, 0.35); --card-3-ink: #fef3c7;
  --card-4: #18202c; --card-4-border: rgba(96, 165, 250, 0.35); --card-4-ink: #e0f2fe;
  --border: rgba(255, 255, 255, 0.14);
  --border-light: rgba(255, 255, 255, 0.07);
  --code-bg: #16181f;
  --code-ink: #2dd4bf;
  --code-border: rgba(45, 212, 191, 0.3);
  --handoff-bg: #1e2027;
  --handoff-terminal: #0b0c10;
  --shadow-sm: 0 2px 10px rgba(0,0,0,0.3);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.45);
  --card-hover-shadow: 0 14px 32px -4px rgba(45, 212, 191, 0.22);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html {
  scroll-behavior: smooth;
  scroll-padding-top: var(--header-offset);
}
body {
  font-family: var(--font-body);
  background-color: var(--bg);
  color: var(--text);
  font-size: 16px;
  line-height: 1.6;
  transition: background-color 0.22s var(--timing-fn), color 0.22s var(--timing-fn);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Typography Rules */
h1, h2, h3, h4 {
  text-wrap: balance;
  line-height: 1.2;
}
p, .lede, .sec-sub {
  text-wrap: pretty;
}
.tabular-numbers, .stat b {
  font-variant-numeric: tabular-nums;
}

/* Focus Visible */
:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Safe Layout Wrap */
.wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding-left: max(20px, env(safe-area-inset-left));
  padding-right: max(20px, env(safe-area-inset-right));
}

/* Skip Link */
.skip {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--text);
  color: var(--bg);
  padding: 10px 18px;
  font-weight: 700;
  z-index: 1000;
  border-radius: var(--radius-sm);
  transition: left 0.15s ease;
}
.skip:focus {
  left: 12px;
  top: 12px;
}

/* Control Bar */
.control-bar {
  background: var(--surface-raised);
  border-bottom: 1px solid var(--border);
  padding: 8px max(20px, env(safe-area-inset-right)) 8px max(20px, env(safe-area-inset-left));
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.control-info { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.badge-stack {
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid var(--accent);
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}
.control-actions { display: flex; align-items: center; gap: 8px; }
.theme-switch-btn, .print-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 14px;
  min-height: 40px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 12.5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
  text-decoration: none;
  touch-action: manipulation;
}
.theme-switch-btn:hover, .print-btn:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
}
.theme-switch-btn:active, .print-btn:active {
  transform: translateY(0);
}

/* Navigation */
.topnav {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background: rgba(var(--bg), 0.85);
  border-bottom: 1px solid var(--border);
}
.topnav .wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.nav-brand {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  margin-right: 16px;
}
.nav-links {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
  white-space: nowrap;
}
.topnav a {
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text);
  padding: 8px 14px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-pill);
  transition: background-color 0.18s ease, color 0.18s ease;
}
.topnav a:hover {
  background: var(--surface);
  color: var(--accent);
}

/* Hero */
.hero {
  background: var(--hero-glow), var(--bg);
  border-bottom: 1px solid var(--border);
  padding: 64px 0 44px;
  transition: background-color 0.22s var(--timing-fn);
}
.kicker {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--accent-ink);
  background: var(--accent);
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  display: inline-block;
  margin-bottom: 20px;
  box-shadow: 0 4px 14px var(--accent-soft);
}
.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(32px, 5.5vw, 60px);
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 16px;
}
.hero .lede {
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  color: var(--text-muted);
  max-width: 74ch;
  line-height: 1.55;
}

/* Typography Chips */
.type-spec {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 24px;
}
.type-chip {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.84rem;
  color: var(--text-muted);
  box-shadow: var(--shadow-sm);
}
.type-chip strong { color: var(--text); }

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
  gap: 12px;
  margin-top: 32px;
}
.stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s var(--timing-fn), border-color 0.2s ease;
}
.stat:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}
.stat b {
  display: block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  color: var(--accent);
  line-height: 1;
  margin-bottom: 6px;
}
.stat span { font-size: 0.85rem; color: var(--text-muted); }

/* Blocks */
section.block {
  padding: 44px 0 12px;
  scroll-margin-top: var(--header-offset);
}
.sec-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 6px; }
.sec-head h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.5px;
}
.sec-head .n {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
}
.sec-sub {
  color: var(--text-muted);
  max-width: 72ch;
  margin-bottom: 24px;
  font-size: 1rem;
}

/* Releases & Collapsible Evidence Drawers */
.release {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px 24px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.release:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
}
.release h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.release .meta { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px; }
.release ul { margin: 0.5em 0 0.5em 1.2em; padding: 0; }
.release li { margin-bottom: 0.4em; }

/* Interactive Evidence Drawer */
details.evidence-drawer {
  margin-top: 14px;
  border-top: 1px dashed var(--border);
  padding-top: 12px;
}
details.evidence-drawer summary {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent);
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  user-select: none;
  -webkit-user-select: none;
}
details.evidence-drawer summary::-webkit-details-marker { display: none; }
details.evidence-drawer summary::before {
  content: "▶";
  font-size: 0.72rem;
  transition: transform 0.2s ease;
  display: inline-block;
}
details.evidence-drawer[open] summary::before {
  transform: rotate(90deg);
}
.drawer-content {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 8px;
  line-height: 1.5;
  word-break: break-word;
}

/* Discovery Matrix Cards */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 16px;
}
.card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s var(--timing-fn), box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--card-hover-shadow);
}
.card:nth-child(1) { background: var(--card-1); border-color: var(--card-1-border); }
.card:nth-child(2) { background: var(--card-2); border-color: var(--card-2-border); }
.card:nth-child(3) { background: var(--card-3); border-color: var(--card-3-border); }
.card:nth-child(4) { background: var(--card-4); border-color: var(--card-4-border); }
.card h3 {
  font-family: var(--font-display);
  font-size: 1.18rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card p { font-size: 0.95rem; line-height: 1.55; }
.card .files {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  border-top: 1px dashed var(--border);
  padding-top: 10px;
  margin-top: 4px;
  word-break: break-all;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 18px;
}
.filter-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-right: 4px;
}
.filter-chip {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 8px 16px;
  min-height: 40px;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  touch-action: manipulation;
}
.filter-chip:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.filter-chip.active {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: var(--accent);
  box-shadow: 0 2px 10px var(--accent-soft);
}

/* Table */
.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  margin-bottom: 18px;
  box-shadow: var(--shadow-sm);
}
table {
  border-collapse: collapse;
  width: 100%;
  min-width: 580px;
  font-size: 0.94rem;
}
th, td {
  text-align: left;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
th {
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: var(--font-display);
  background: var(--surface-raised);
  font-weight: 800;
}
tr:last-child td { border-bottom: 0; }
tr.proposal-row { transition: opacity 0.2s ease; }
tr.proposal-row.hidden { display: none; }

/* Badges */
.badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  vertical-align: middle;
  white-space: nowrap;
}
.badge.shipped { background: var(--accent); color: var(--accent-ink); }
.badge.indev { background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent); }
.badge.queued { background: var(--surface-raised); color: var(--text-muted); border: 1px solid var(--border); }

code {
  font-family: var(--font-mono);
  font-size: 0.88em;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--code-bg);
  color: var(--code-ink);
  border: 1px solid var(--code-border);
  word-break: break-word;
}

/* Handoff Box & 1-Click Copy */
.handoff-box {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 26px;
  margin-top: 16px;
  background: var(--handoff-bg);
  box-shadow: var(--shadow-md);
  position: relative;
}
.handoff-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
}
.handoff-box h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
}
.copy-btn {
  background: var(--accent);
  color: var(--accent-ink);
  border: none;
  padding: 10px 18px;
  min-height: 42px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 14px var(--accent-soft);
  transition: transform 0.18s ease, opacity 0.18s ease, background-color 0.18s ease;
  touch-action: manipulation;
}
.copy-btn:hover {
  transform: scale(1.02);
  opacity: 0.96;
}
.copy-btn:active {
  transform: scale(0.98);
}
.code-box {
  background: var(--handoff-terminal);
  color: #e6f3ee;
  padding: 18px 20px;
  border-radius: 12px;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  white-space: pre-wrap;
  line-height: 1.55;
  border: 1px solid rgba(255,255,255,0.12);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Toast Notification */
#toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #10b981;
  color: #ffffff;
  padding: 12px 20px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.25s var(--timing-fn), transform 0.25s var(--timing-fn);
  pointer-events: none;
}
#toast.show {
  opacity: 1;
  transform: translateY(0);
}

footer {
  border-top: 1px solid var(--border);
  margin-top: 56px;
  padding: 28px 0 max(48px, env(safe-area-inset-bottom));
  color: var(--text-muted);
  font-size: 0.88rem;
}

/* Print Stylesheet */
@media print {
  .control-bar, .topnav, .filter-bar, .copy-btn, .skip, #toast, footer, details summary { display: none !important; }
  body { background: #ffffff !important; color: #000000 !important; font-size: 12pt !important; }
  .hero { background: none !important; padding: 10px 0 !important; border-bottom: 2px solid #000 !important; }
  .hero h1 { font-size: 24pt !important; }
  .stat, .release, .card, .table-wrap, .handoff-box {
    box-shadow: none !important;
    border: 1px solid #999 !important;
    background: #fff !important;
    color: #000 !important;
    page-break-inside: avoid;
  }
  .code-box { background: #f8f8f8 !important; color: #000 !important; border: 1px solid #ccc !important; font-size: 10pt !important; }
  .card:nth-child(n) { background: #fdfdfd !important; }
  .badge { border: 1px solid #444 !important; background: #eee !important; color: #000 !important; }
}

/* Mobile Responsiveness Fine-Tuning */
@media (max-width: 680px) {
  .hero { padding: 40px 0 28px; }
  .control-bar { padding: 10px 16px; }
  .handoff-box { padding: 18px 16px; }
  .code-box { padding: 14px 14px; font-size: 0.82rem; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .stat b { font-size: 1.8rem; }
  #toast { left: 16px; right: 16px; bottom: 16px; justify-content: center; }
}

@media (max-width: 420px) {
  .stats { grid-template-columns: 1fr; }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to main content</a>

<div id="toast" role="status" aria-live="polite">✓ Prompt copied to clipboard!</div>

<div class="control-bar" role="region" aria-label="Quick actions and theme switcher">
  <div class="control-info">
    <span class="badge-stack">CLAY DUAL-MODE</span>
    <strong>Clay Design System</strong> — <em>Bricolage Grotesque + Plus Jakarta Sans + JetBrains Mono</em>
  </div>
  <div class="control-actions">
    <button class="print-btn" onclick="window.print()" title="Print or Save as PDF" aria-label="Export or print document as PDF">🖨️ <span class="btn-text">Export PDF</span></button>
    <button class="theme-switch-btn" id="theme-toggle" onclick="toggleTheme()" aria-label="Toggle color theme between light and dark">
      <span id="theme-icon" aria-hidden="true">☀️</span> <span id="theme-label">Light Mode (Neo-Pop)</span>
    </button>
  </div>
</div>

<header class="hero">
  <div class="wrap hero-inner">
    <span class="kicker">Milestone work report · ${commonContent.date}</span>
    <h1>${commonContent.title}</h1>
    <p class="lede">${commonContent.lede}</p>

    <div class="type-spec" aria-label="Active typographic specifications">
      <div class="type-chip">Display: <strong>Bricolage Grotesque (800)</strong></div>
      <div class="type-chip">Body: <strong>Plus Jakarta Sans (400/500/600)</strong></div>
      <div class="type-chip">Code: <strong>JetBrains Mono (500)</strong></div>
    </div>

    <div class="stats" role="list" aria-label="Headline numbers">
      ${commonContent.stats.map((s) => `<div class="stat" role="listitem"><b>${s.num}</b><span>${s.label}</span></div>`).join("\n      ")}
    </div>
  </div>
</header>

<nav class="topnav" aria-label="Report sections">
  <div class="wrap">
    <div class="nav-brand"><span>Muse Skills</span> · <span>Clay Edition</span></div>
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

    ${commonContent.intakeItems
      .map(
        (item) => `
    <article class="release">
      <h3>${item.title} <span class="badge shipped">${item.badge}</span></h3>
      <div class="meta">${item.lead}</div>
      <p>${item.desc}</p>
      <details class="evidence-drawer">
        <summary>View Verification Evidence & Source Paths</summary>
        <div class="drawer-content">${item.details}</div>
      </details>
    </article>`,
      )
      .join("")}
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

    <div class="filter-bar" role="toolbar" aria-label="Filter proposals by agency division">
      <span class="filter-label">Filter by Division:</span>
      <button class="filter-chip active" data-filter="all" onclick="filterDivision('all', this)">All (6)</button>
      <button class="filter-chip" data-filter="sol" onclick="filterDivision('sol', this)">Sol: Automation & Infra (2)</button>
      <button class="filter-chip" data-filter="jasper" onclick="filterDivision('jasper', this)">Jasper: Growth (1)</button>
      <button class="filter-chip" data-filter="nexus" onclick="filterDivision('nexus', this)">Nexus: Quality Gate (2)</button>
    </div>

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
          <tr class="proposal-row" data-division="${p.division}">
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
      <div class="handoff-header">
        <h3>Phase Execution Prompt <span class="badge queued">READY FOR LAUNCH</span></h3>
        <button class="copy-btn" id="copy-btn" onclick="copyPrompt()" aria-label="Copy execution prompt to clipboard">📋 Copy Prompt</button>
      </div>
      <p>Provide this instruction to the incoming agent to execute the phased improvements:</p>
      <div class="code-box" id="prompt-content">${commonContent.handoffPrompt}</div>
    </div>
  </section>

</main>

<footer>
  <div class="wrap">
    <div>Muse Skills Agency Suite · Milestone Report (Clay Neo-Pop / Midnight Edition) · Generated 2026-09-20</div>
  </div>
</footer>

<script>
// Theme Switcher with localStorage
function updateThemeUI(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btnIcon = document.getElementById('theme-icon');
  const btnLabel = document.getElementById('theme-label');
  if (theme === 'dark') {
    btnIcon.textContent = '☀️';
    btnLabel.textContent = 'Light Mode (Neo-Pop)';
  } else {
    btnIcon.textContent = '🌙';
    btnLabel.textContent = 'Dark Mode (Midnight)';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('muse_report_theme', next);
  updateThemeUI(next);
}

// 1-Click Copy with Animated Toast
function copyPrompt() {
  const text = document.getElementById('prompt-content').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('toast');
    const copyBtn = document.getElementById('copy-btn');
    toast.classList.add('show');
    copyBtn.innerHTML = '✓ Copied!';
    copyBtn.style.background = '#10b981';
    setTimeout(() => {
      toast.classList.remove('show');
      copyBtn.innerHTML = '📋 Copy Prompt';
      copyBtn.style.background = '';
    }, 2500);
  }).catch(() => {
    // Fallback if clipboard API is restricted
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.innerHTML = 'Select & Copy';
  });
}

// Division Filter
function filterDivision(division, btnEl) {
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  const rows = document.querySelectorAll('.proposal-row');
  rows.forEach(row => {
    const rowDiv = row.getAttribute('data-division');
    if (division === 'all' || rowDiv === division || rowDiv === 'all') {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

// Initialize Theme
(function() {
  const saved = localStorage.getItem('muse_report_theme') || 'dark';
  updateThemeUI(saved);
})();
</script>

</body>
</html>`;
}

// Write the updated report files
const enhancedHtml = generateEnhancedDualModeHtml();
const reportDualModePath = join(VARIANTS_DIR, "report-clay-dual-mode.html");
writeFileSync(reportDualModePath, enhancedHtml, "utf8");
console.log(`Generated Mobile-Responsive Dual-Mode: ${reportDualModePath}`);

const mainReportPath = join(REPORTS_DIR, "milestone-skill-mining-2026-09-20-clay.html");
writeFileSync(mainReportPath, enhancedHtml, "utf8");
console.log(`Updated Main Report: ${mainReportPath}`);
