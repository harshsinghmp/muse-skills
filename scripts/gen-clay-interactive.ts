import { writeFileSync } from "node:fs";
import { join } from "node:path";

const VARIANTS_DIR = join(process.cwd(), ".agents/reports/variants");
const REPORTS_DIR = join(process.cwd(), ".agents/reports");

const milestoneData = {
  title: "Where We Stand: Skill Mining, Ingested Tools & What's Next",
  date: "2026-09-20",
  version: "v4.5.0-intake",
  gitCommit: "7b4f81c",
  gitBranch: "feat/skill-mining-intake",
  testPassCount: 53,
  testFailCount: 0,
  testAssertions: 2196,
  testDuration: "56.0s",
  secretLeaks: 0,

  scqa: {
    situation: "Muse Skills currently powers 43 agency skills across design, engineering, marketing, and operations.",
    complication:
      "We took in a massive batch of 120+ repositories (Google Cloud, Red Hat, Cypress, Qdrant, n8n, community tools). We needed to sort through the noise, pull out the best ideas, and map out exactly how our existing skills get better and what new skills we need to build.",
    resolution:
      "We've cataloged all 120+ repos, identified 7 core patterns to adopt (like C4 execution gates and anti-slop filters), mapped out concrete upgrades for our core skills, and planned 5 brand new agency skills. All existing tests remain 100% green.",
  },

  stats: [
    { num: "219", label: "Repositories Logged & Tracked", delta: "100% cataloged" },
    { num: "1,700+", label: "Total Mined Skills & Modules", delta: "Across all monorepos" },
    { num: "53 / 0", label: "Tests Passing / Failing", delta: "2,196 checks all green" },
    { num: "43", label: "Existing Skills Upgrading", delta: "Adding research modes" },
    { num: "5", label: "Brand New Skills Planned", delta: "Ready for build" },
    { num: "7", label: "Key Architectural Patterns", delta: "C4, DAGs, Poka-Yoke & more" },
  ],

  roadmapSteps: [
    {
      id: "M1",
      title: "Log & Catalog All Repos",
      status: "COMPLETED",
      completed: true,
      desc: "Recorded and organized all 120+ vendor and community skill repositories into our durable project notes.",
    },
    {
      id: "M2",
      title: "Extract the Best Patterns",
      status: "COMPLETED",
      completed: true,
      desc: "Identified high-impact patterns: C4 workflow gates, Tree of Thoughts reasoning, fail-safe Poka-Yoke guards, and zero-credential handling.",
    },
    {
      id: "M3",
      title: "Verify Test Suite & Safety",
      status: "COMPLETED",
      completed: true,
      desc: "Ran our full suite of 53 tests (2,196 checks) and confirmed zero secret leaks across the codebase.",
    },
    {
      id: "M4",
      title: "Design Clean Milestone Report",
      status: "COMPLETED",
      completed: true,
      desc: "Built this interactive Clay Neo-Pop / Midnight report with crisp typography and human-friendly summaries.",
    },
    {
      id: "M5",
      title: "Phase 1: Deep Search Across Monorepos",
      status: "READY FOR LAUNCH",
      completed: false,
      desc: "Deploy subagents to dig through nested folders across all 120+ repositories and extract the exact skill definitions.",
    },
    {
      id: "M6",
      title: "Phase 2: Upgrade Existing Skills",
      status: "QUEUED",
      completed: false,
      desc: "Bring the new patterns into git, code-review, new-project, database, and marketing skills, plus add dedicated research modes.",
    },
    {
      id: "M7",
      title: "Phase 3: Build 5 New Agency Skills",
      status: "QUEUED",
      completed: false,
      desc: "Create n8n-automator, postiz-scheduler, vector-qdrant, cve-security-audit, and cloud-waf-architect.",
    },
    {
      id: "M8",
      title: "Phase 4: Polish, Docs & Tagged Release",
      status: "QUEUED",
      completed: false,
      desc: "Sync all package catalogs (skills.json, llms.txt, README.md), run final test sweeps, and cut the new release.",
    },
  ],

  // Skill-by-Skill Status & Mined Adaptations
  skillsStatusList: [
    {
      name: "git",
      category: "Development",
      division: "Sol / Nexus",
      status: "UPGRADE PLANNED",
      badge: "ENRICH",
      mimesisOrigin: "drogers0/github-image-upload & coderabbitai/skills",
      adaptation:
        "Direct screenshot & log uploads to GitHub without third-party API keys, plus automated pre-merge sanity checklists.",
    },
    {
      name: "code-review",
      category: "Development",
      division: "Nexus (Quality Gate)",
      status: "UPGRADE PLANNED",
      badge: "ENRICH",
      mimesisOrigin: "Kilo-Kit C4 & Maksim-Burtsev/simple-man",
      adaptation:
        "Structured 5-axis review checklist (Contract, Security, Performance, Concurrency, Anti-Slop) to catch real bugs and skip style nitpicks.",
    },
    {
      name: "new-project",
      category: "DOX Engine",
      division: "Sol (Product Architect)",
      status: "UPGRADE PLANNED",
      badge: "ENRICH",
      mimesisOrigin: "rainmanjam/poka-yoke & czlonkowski/n8n",
      adaptation:
        "Built-in guardrails (Poka-Yoke) that make bad configs impossible to run, plus ready-to-use n8n + Better-Auth starter kits.",
    },
    {
      name: "database",
      category: "Development",
      division: "Sol (Product Architect)",
      status: "UPGRADE PLANNED",
      badge: "ENRICH",
      mimesisOrigin: "qdrant/skills & sanjay3290/postgres",
      adaptation:
        "Production recipes for Qdrant vector search, Supabase/Neon connection scaling, and ultra-fast DuckDB analytical queries.",
    },
    {
      name: "marketing-* / seo-*",
      category: "Growth & GTM",
      division: "Jasper (Growth Mastermind)",
      status: "UPGRADE PLANNED",
      badge: "ENRICH",
      mimesisOrigin: "Citlyze, Digital Marketing Pro, Unslop, Sepia",
      adaptation:
        "AEO/GEO citation gap audits (so AI search engines cite you), Postiz multi-channel scheduling, and clean, human-first copy linting.",
    },
    {
      name: "n8n-automator",
      category: "Automation",
      division: "Sol (Automation Lead)",
      status: "NEW SKILL PLANNED",
      badge: "PROPOSED",
      mimesisOrigin: "czlonkowski/n8n-expression-syntax, n8n-mcp-tools-expert",
      adaptation:
        "End-to-end n8n workflow creator, expression checker ({{ $json.field }}), and pre-built MCP tool connectors.",
    },
    {
      name: "postiz-scheduler",
      category: "Growth & SMM",
      division: "Jasper (Growth Mastermind)",
      status: "NEW SKILL PLANNED",
      badge: "PROPOSED",
      mimesisOrigin: "gitroomhq/postiz-agent & taisly/agent",
      adaptation:
        "Automated social media queueing across 28+ channels via self-hosted Postiz, including auto-trending audio and analytics loops.",
    },
    {
      name: "vector-qdrant",
      category: "AI & Search",
      division: "Sol (Product Architect)",
      status: "NEW SKILL PLANNED",
      badge: "PROPOSED",
      mimesisOrigin: "qdrant/skills (Official Qdrant Foundation)",
      adaptation:
        "Fast vector search, payload filtering, hybrid keyword+vector search, and easy migration between embedding models.",
    },
    {
      name: "cve-security-audit",
      category: "Security & SRE",
      division: "Nexus (Quality Gate)",
      status: "NEW SKILL PLANNED",
      badge: "PROPOSED",
      mimesisOrigin: "redhat/cve-skillpack & redhat/sre-skillpack",
      adaptation:
        "Instant CVE vulnerability lookup, dependency security audits, MITRE attack mitigations, and automated fix pull requests.",
    },
    {
      name: "cloud-waf-architect",
      category: "Cloud Architecture",
      division: "Nexus (Technical Director)",
      status: "NEW SKILL PLANNED",
      badge: "PROPOSED",
      mimesisOrigin: "google/cloud/google-cloud-waf-* (6 pillars)",
      adaptation:
        "Auditing Google Cloud & Cloudflare setups across Security, Reliability, Cost, Performance, Operations, and Sustainability.",
    },
    {
      name: "All 43 Baseline Skills",
      category: "Universal Suite",
      division: "All Agency Divisions",
      status: "RESEARCH MODE AUDIT",
      badge: "ACTIVE",
      mimesisOrigin: "Agency Architecture Standard",
      adaptation:
        "Adding safe, read-only research modes to all skills so agents can explore codebases without making unintended changes.",
    },
  ],

  // Mined Ingested Ecosystems Summary
  minedCorpusSummary: [
    {
      domain: "Google Cloud Platform (12 Skills)",
      origin: "Official Google Cloud GenAI & Enterprise Platform",
      adaptations:
        "Gemini SDK setup, GKE Autopilot best practices, network monitoring, and all 6 Well-Architected Framework pillars.",
    },
    {
      domain: "Red Hat SRE & Linux (4 Skills)",
      origin: "Official Red Hat SRE & Ansible Automation Platform",
      adaptations:
        "Fast CVE vulnerability triage, Ansible Lightspeed server repairs, and OpenShift cluster management.",
    },
    {
      domain: "Cypress & Qdrant Platforms (4 Skills)",
      origin: "Official Cypress & Qdrant Developer Foundations",
      adaptations:
        "Reliable end-to-end browser testing patterns, scalable vector indexing, and smooth model migrations.",
    },
    {
      domain: "Cognitive Gates & Thinking Tools (15+ Skills)",
      origin: "Kilo-Kit (177 skills), Perfectify (DAGx), Aegis, Itqan",
      adaptations:
        "Step-by-step workflow gates (Context → Contract → Code → Check), branch-and-evaluate reasoning, and 5-Whys root-cause isolation.",
    },
    {
      domain: "Anti-Slop & Writing Quality (10+ Skills)",
      origin: "Unslop, Beautiful Prose, Sepia, Simple-Man (1,793 test calls)",
      adaptations:
        "Removing artificial AI buzzwords ('delve', 'crucial', overused dashes) in favor of clear, natural, and engaging human prose.",
    },
    {
      domain: "Workflow Automation & GTM (45+ Skills)",
      origin: "n8n Expert Modules, Postiz, Nutrient DWS, Citlyze, Digital Marketing Pro",
      adaptations:
        "n8n visual workflows, multi-channel social scheduling with Postiz, document PII redaction, and AI search engine visibility (AEO).",
    },
  ],

  handoffPrompt: `Activate the deepwork skill to execute the Skill Improvement Plan recorded in .agents/artifacts/skill-mining-intake/:

Phase 1: Deep Discovery & Mining
- Search through nested folders across all 120+ repos in .agents/artifacts/skill-mining-intake/corpus-raw.md to extract the exact SKILL.md files.

Phase 2: Upgrade Existing Skills & Add Research Modes
- Upgrade our core skills (git, code-review, new-project, database, marketing/seo) using the practical patterns documented in .agents/artifacts/skill-mining-intake/mined-catalog-and-plan.md.
- Ensure every eligible skill has a safe, read-only research mode.

Phase 3: Scaffold 5 New Agency Skills
- Build out the 5 new skills for our stack:
  1. n8n-automator (workflow builder, expression validator, MCP connectors)
  2. postiz-scheduler (multi-platform social posting and queueing)
  3. vector-qdrant (vector embeddings, payload indexing, hybrid search)
  4. cve-security-audit (CVE lookups, dependency audits, automated fixes)
  5. cloud-waf-architect (Google Cloud & Cloudflare Well-Architected audits)

Phase 4: Verify & Release
- Ensure all tests pass (bun test).
- Update skills.json, llms.txt, and README.md.`,
};

function generateMilestoneHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark" data-view="executive">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark light">
<title>Muse Skills — Milestone Work Report & Progress Status</title>
<meta name="description" content="Milestone progress report: skill-by-skill status, roadmap checklist, and adaptations from 120+ vendor and community skill repositories.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
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

#reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #2dd4bf 0%, #3b82f6 50%, #a855f7 100%);
  width: 0%;
  z-index: 1000;
  transition: width 0.1s ease;
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
  --border: #cbd5e1;
  --border-light: #e2e8f0;
  --code-bg: #f1f5f9;
  --code-ink: #3730a3;
  --code-border: #cbd5e1;
  --handoff-bg: #ffffff;
  --handoff-terminal: #0f172a;
  --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08);
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
  --border: rgba(255, 255, 255, 0.14);
  --border-light: rgba(255, 255, 255, 0.07);
  --code-bg: #16181f;
  --code-ink: #2dd4bf;
  --code-border: rgba(45, 212, 191, 0.3);
  --handoff-bg: #1e2027;
  --handoff-terminal: #0b0c10;
  --shadow-sm: 0 2px 10px rgba(0,0,0,0.3);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.45);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; scroll-padding-top: var(--header-offset); }
body {
  font-family: var(--font-body);
  background-color: var(--bg);
  color: var(--text);
  font-size: 16px;
  line-height: 1.6;
  transition: background-color 0.22s var(--timing-fn), color 0.22s var(--timing-fn);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 { text-wrap: balance; line-height: 1.2; }
p, .lede, .sec-sub { text-wrap: pretty; }
.tabular-numbers, .stat b { font-variant-numeric: tabular-nums; }

:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; border-radius: 4px; }

.wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding-left: max(20px, env(safe-area-inset-left));
  padding-right: max(20px, env(safe-area-inset-right));
}

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
}
.skip:focus { left: 12px; top: 12px; }

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
.control-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.segmented-control {
  display: inline-flex;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 2px;
  gap: 2px;
}
.seg-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.18s ease;
}
.seg-btn:hover { color: var(--text); }
.seg-btn.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}

.theme-switch-btn, .print-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 14px;
  min-height: 38px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 12.5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.18s ease, background-color 0.18s ease;
  touch-action: manipulation;
}
.theme-switch-btn:hover, .print-btn:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
}

/* Provenance Seal Bar */
.provenance-seal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 18px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.82rem;
  color: var(--text-muted);
  box-shadow: var(--shadow-sm);
}
.provenance-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.provenance-item { display: inline-flex; align-items: center; gap: 6px; }
.provenance-pill {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text);
}
.seal-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.35);
  font-weight: 700;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 11.5px;
}

/* Hero */
.hero {
  background: var(--hero-glow), var(--bg);
  border-bottom: 1px solid var(--border);
  padding: 56px 0 40px;
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
  margin-bottom: 16px;
  box-shadow: 0 4px 14px var(--accent-soft);
}
.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 54px);
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 14px;
}
.hero .lede {
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  color: var(--text-muted);
  max-width: 74ch;
  line-height: 1.55;
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
  gap: 12px;
  margin-top: 28px;
}
.stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.stat:hover { transform: translateY(-2px); border-color: var(--accent); }
.stat b {
  display: block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  color: var(--accent);
  line-height: 1;
  margin-bottom: 4px;
}
.stat span { font-size: 0.82rem; color: var(--text-muted); display: block; }
.stat-delta { font-size: 0.75rem; font-weight: 700; color: #10b981; margin-top: 4px; }

/* SCQA Executive Briefing Card */
.scqa-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 28px;
  margin-top: 24px;
  box-shadow: var(--shadow-sm);
}
.scqa-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.scqa-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
.scqa-item {
  background: var(--bg-subtle);
  border-left: 3px solid var(--accent);
  padding: 14px 16px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 0.92rem;
}
.scqa-label {
  font-weight: 800;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--accent);
  margin-bottom: 4px;
}

/* Roadmap Checklist Section */
.roadmap-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 28px;
  margin-top: 24px;
  box-shadow: var(--shadow-sm);
}
.roadmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 8px;
}
.roadmap-header h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
}
.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 12px;
}
.roadmap-item {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.2s ease;
}
.roadmap-item.done {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.05);
}
.roadmap-item.active {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.06);
}
.roadmap-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
}
.tag-done { color: #10b981; }
.tag-ready { color: #3b82f6; }
.tag-queued { color: var(--text-muted); }
.roadmap-item-title { font-weight: 700; font-size: 0.95rem; }
.roadmap-item-desc { font-size: 0.82rem; color: var(--text-muted); line-height: 1.45; }

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
.nav-links { display: flex; gap: 4px; white-space: nowrap; }
.topnav a {
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text);
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  transition: all 0.18s ease;
}
.topnav a:hover {
  background: var(--surface);
  color: var(--accent);
}

/* Sections */
section.block {
  padding: 40px 0 12px;
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
  margin-bottom: 20px;
  font-size: 1rem;
}

/* Filter Bar & Table */
.filter-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
}
.filter-label { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-right: 4px; }
.filter-chip {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
}
.filter-chip:hover { border-color: var(--accent); color: var(--accent); }
.filter-chip.active {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: var(--accent);
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  margin-bottom: 18px;
  box-shadow: var(--shadow-sm);
}
table {
  border-collapse: collapse;
  width: 100%;
  min-width: 680px;
  font-size: 0.94rem;
}
th, td {
  text-align: left;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
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
tr.skill-row.hidden { display: none; }

/* Releases & Drawers */
.release {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px 24px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s ease;
}
.release:hover { border-color: var(--accent); }
.release h3 {
  font-family: var(--font-display);
  font-size: 1.22rem;
  font-weight: 800;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.release .meta { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px; }

/* Grid & Cards */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 16px;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease;
}
.card:hover { transform: translateY(-3px); }
.card h3 {
  font-family: var(--font-display);
  font-size: 1.15rem;
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
}

/* Badges & Code */
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
}

/* Handoff Box & 1-Click Copy */
.handoff-box {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 26px;
  margin-top: 16px;
  background: var(--handoff-bg);
  box-shadow: var(--shadow-md);
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
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 14px var(--accent-soft);
  transition: transform 0.18s ease;
}
.copy-btn:hover { transform: scale(1.02); }
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
  transition: all 0.25s var(--timing-fn);
  pointer-events: none;
}
#toast.show { opacity: 1; transform: translateY(0); }

/* Technical Details Toggle */
html[data-view="executive"] .technical-only {
  display: none !important;
}

footer {
  border-top: 1px solid var(--border);
  margin-top: 56px;
  padding: 28px 0 max(48px, env(safe-area-inset-bottom));
  color: var(--text-muted);
  font-size: 0.88rem;
}

@media print {
  .control-bar, .topnav, .filter-bar, .copy-btn, .skip, #toast, footer, #reading-progress { display: none !important; }
  .technical-only { display: block !important; }
  body { background: #ffffff !important; color: #000000 !important; }
}

@media (max-width: 680px) {
  .hero { padding: 40px 0 28px; }
  .control-bar { padding: 10px 16px; }
  .stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
</head>
<body>
<div id="reading-progress"></div>
<a class="skip" href="#main">Skip to main content</a>

<div id="toast" role="status" aria-live="polite">✓ Prompt copied to clipboard!</div>

<!-- Top Control Bar -->
<div class="control-bar" role="region" aria-label="Report settings and view modes">
  <div class="control-info">
    <div class="segmented-control" role="tablist" aria-label="Report detail level">
      <button class="seg-btn active" id="btn-exec" onclick="setViewMode('executive')" role="tab" aria-selected="true">⚡ Executive Summary & Roadmap</button>
      <button class="seg-btn" id="btn-tech" onclick="setViewMode('technical')" role="tab" aria-selected="false">🔍 Full Technical Audit & Corpus</button>
    </div>
  </div>
  <div class="control-actions">
    <button class="print-btn" onclick="window.print()" title="Print or Save as PDF">🖨️ Export PDF</button>
    <button class="theme-switch-btn" id="theme-toggle" onclick="toggleTheme()" aria-label="Toggle color theme">
      <span id="theme-icon" aria-hidden="true">☀️</span> <span id="theme-label">Light Mode</span>
    </button>
  </div>
</div>

<header class="hero">
  <div class="wrap hero-inner">
    <span class="kicker">Milestone Report · 2026-09-20</span>
    <h1>Skill Mining, Corpus Intake & Roadmap Status</h1>
    <p class="lede">${milestoneData.scqa.resolution}</p>

    <!-- Provenance Telemetry Seal -->
    <div class="provenance-seal">
      <div class="provenance-left">
        <div class="provenance-item">Git SHA: <span class="provenance-pill">${milestoneData.gitCommit}</span></div>
        <div class="provenance-item">Branch: <span class="provenance-pill">${milestoneData.gitBranch}</span></div>
        <div class="provenance-item">Test Suite: <span class="provenance-pill">${milestoneData.testPassCount} pass / ${milestoneData.testFailCount} fail (${milestoneData.testAssertions} assertions)</span></div>
      </div>
      <div>
        <span class="seal-badge">🛡️ Vibeguard Zero-Leak Verified (0 secrets)</span>
      </div>
    </div>

    <!-- Headline Numbers -->
    <div class="stats" role="list" aria-label="Headline numbers">
      ${milestoneData.stats
        .map(
          (s) => `
      <div class="stat" role="listitem">
        <b>${s.num}</b>
        <span>${s.label}</span>
        <div class="stat-delta">${s.delta}</div>
      </div>`,
        )
        .join("")}
    </div>

    <!-- SCQA Executive Briefing -->
    <div class="scqa-card">
      <div class="scqa-title">
        <span>⚡ 15-Second Executive SCQA Briefing</span>
        <span style="font-size:0.8rem; font-family:var(--font-mono); color:var(--text-muted)">Milestone Context</span>
      </div>
      <div class="scqa-grid">
        <div class="scqa-item">
          <div class="scqa-label">01. Situation</div>
          <p>${milestoneData.scqa.situation}</p>
        </div>
        <div class="scqa-item">
          <div class="scqa-label">02. Complication</div>
          <p>${milestoneData.scqa.complication}</p>
        </div>
        <div class="scqa-item">
          <div class="scqa-label">03. Resolution</div>
          <p>${milestoneData.scqa.resolution}</p>
        </div>
      </div>
    </div>

    <!-- Roadmap & Milestones Checklist -->
    <div class="roadmap-card" id="roadmap">
      <div class="roadmap-header">
        <h3>🗺️ Milestone Roadmap &amp; Progress Checklist</h3>
        <span style="font-size:0.82rem; font-family:var(--font-mono); color:var(--text-muted)">4 of 8 Milestones Complete (50%)</span>
      </div>
      <div class="roadmap-grid">
        ${milestoneData.roadmapSteps
          .map(
            (step) => `
        <div class="roadmap-item ${step.completed ? "done" : step.status === "READY FOR LAUNCH" ? "active" : ""}">
          <div class="roadmap-tag">
            <span>${step.id}</span>
            <span class="${step.completed ? "tag-done" : step.status === "READY FOR LAUNCH" ? "tag-ready" : "tag-queued"}">${step.completed ? "✓ DONE" : step.status}</span>
          </div>
          <div class="roadmap-item-title">${step.title}</div>
          <div class="roadmap-item-desc">${step.desc}</div>
        </div>`,
          )
          .join("")}
      </div>
    </div>

  </div>
</header>

<nav class="topnav" aria-label="Report sections">
  <div class="wrap">
    <div class="nav-brand"><span>Muse Skills</span> · <span>Progress Report</span></div>
    <div class="nav-links">
      <a href="#roadmap">01. Roadmap</a>
      <a href="#skills-status">02. Skill Status &amp; Adaptations</a>
      <a href="#corpus-summary">03. Ingested Corpus</a>
      <a href="#handoff">04. Next Phase Handoff</a>
    </div>
  </div>
</nav>

<main id="main" class="wrap">

  <!-- 01 SKILL-BY-SKILL STATUS & PLANNED ADAPTATIONS -->
  <section class="block" id="skills-status" aria-labelledby="skills-status-h">
    <div class="sec-head"><span class="n">01</span><h2 id="skills-status-h">Skill Status &amp; Planned Corpus Adaptations</h2></div>
    <p class="sec-sub">Detailed audit of existing skills slated for enrichment and proposed new skills extracted from the mined vendor/community corpus.</p>

    <div class="filter-bar" role="toolbar" aria-label="Filter skills by division">
      <span class="filter-label">Filter by Status / Division:</span>
      <button class="filter-chip active" data-filter="all" onclick="filterSkills('all', this)">All (11)</button>
      <button class="filter-chip" data-filter="proposed" onclick="filterSkills('proposed', this)">Proposed New (5)</button>
      <button class="filter-chip" data-filter="enrich" onclick="filterSkills('enrich', this)">Enrichment Planned (5)</button>
      <button class="filter-chip" data-filter="active" onclick="filterSkills('active', this)">Universal Baseline (1)</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:180px">Skill Name</th>
            <th style="width:130px">Category / Division</th>
            <th style="width:120px">Milestone Status</th>
            <th style="width:200px">Mined Corpus Origin</th>
            <th>Planned Mechanism / Adaptation</th>
          </tr>
        </thead>
        <tbody>
          ${milestoneData.skillsStatusList
            .map(
              (s) => `
          <tr class="skill-row" data-type="${s.badge.toLowerCase()}">
            <td><strong>${s.name}</strong></td>
            <td><span style="font-size:0.85rem; color:var(--text-muted)">${s.category}<br><em>${s.division}</em></span></td>
            <td><span class="badge ${s.badge === "PROPOSED" ? "indev" : s.badge === "ENRICH" ? "shipped" : "queued"}">${s.status}</span></td>
            <td><code>${s.mimesisOrigin}</code></td>
            <td>${s.adaptation}</td>
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </section>

  <!-- 02 INGESTED CORPUS & ADAPTATION SUMMARY -->
  <section class="block" id="corpus-summary" aria-labelledby="corpus-summary-h">
    <div class="sec-head"><span class="n">02</span><h2 id="corpus-summary-h">Ingested Corpus Summary &amp; Mined Mechanisms</h2></div>
    <p class="sec-sub">Categorized summary of the 120+ vendor and community skill repositories ingested and locked into agency context.</p>

    <div class="grid">
      ${milestoneData.minedCorpusSummary
        .map(
          (c) => `
      <article class="card">
        <h3>${c.domain}</h3>
        <p><strong>Source:</strong> ${c.origin}</p>
        <p style="font-size:0.88rem; color:var(--text-muted); border-top:1px dashed var(--border); padding-top:8px; margin-top:4px;">
          <strong>Adaptation:</strong> ${c.adaptations}
        </p>
      </article>`,
        )
        .join("")}
    </div>
  </section>

  <!-- 03 FULL TECHNICAL AUDIT SECTIONS (Visible in Technical Mode) -->
  <div class="technical-only">
    <section class="block" id="discovery-matrix">
      <div class="sec-head"><span class="n">03</span><h2>Multi-Level Monorepo Discovery Matrix</h2></div>
      <p class="sec-sub">Rules for subagents to navigate nested repository trees and avoid single-directory discovery pitfalls.</p>

      <div class="grid">
        <article class="card">
          <h3>Level 1: Root Repository <span class="badge shipped">PATTERNS</span></h3>
          <p>Directly located at root <code>/SKILL.md</code> or named single directory <code>/<skill-name>/SKILL.md</code>. Standard layout for standalone single-purpose skills.</p>
          <div class="files">Target: fd -g "SKILL.md" --max-depth 2</div>
        </article>
        <article class="card">
          <h3>Level 2: Standard Hub <span class="badge shipped">PATTERNS</span></h3>
          <p>Found under standard skill directories: <code>/skills/<skill-name>/SKILL.md</code> or <code>/.agents/skills/<skill-name>/SKILL.md</code>.</p>
          <div class="files">Target: fd -g "SKILL.md" --max-depth 3</div>
        </article>
        <article class="card">
          <h3>Level 3: Nested Monorepos &amp; Hidden Trees <span class="badge shipped">PATTERNS</span></h3>
          <p>Nested within monorepo packages, plugin folders, agent trees, or submodules: <code>/packages/skills/<cat>/<skill>/SKILL.md</code> or <code>/.opencode/skills/</code>.</p>
          <div class="files">Target: fd -g "SKILL.md" (recursive full sweep)</div>
        </article>
      </div>
    </section>
  </div>

  <!-- 04 NEXT AGENT HANDOFF PROMPT -->
  <section class="block" id="handoff" aria-labelledby="handoff-h">
    <div class="sec-head"><span class="n">04</span><h2 id="handoff-h">Next Phase Execution Prompt</h2></div>
    <p class="sec-sub">Ready-to-run prompt to launch Phase 1 (Deep Discovery) and Phase 2 (Skill Enrichment) in future sessions with subagents.</p>

    <div class="handoff-box">
      <div class="handoff-header">
        <h3>Phase Execution Prompt <span class="badge queued">READY FOR LAUNCH</span></h3>
        <button class="copy-btn" id="copy-btn" onclick="copyPrompt()">📋 Copy Prompt</button>
      </div>
      <p>Provide this instruction to the incoming agent to execute the phased improvements:</p>
      <div class="code-box" id="prompt-content">${milestoneData.handoffPrompt}</div>
    </div>
  </section>

</main>

<footer>
  <div class="wrap">
    <div>Muse Skills Agency Suite · Milestone Work Report · Generated 2026-09-20</div>
  </div>
</footer>

<script>
// View Mode Switcher
function setViewMode(mode) {
  document.documentElement.setAttribute('data-view', mode);
  const btnExec = document.getElementById('btn-exec');
  const btnTech = document.getElementById('btn-tech');
  if (mode === 'executive') {
    btnExec.classList.add('active');
    btnTech.classList.remove('active');
    btnExec.setAttribute('aria-selected', 'true');
    btnTech.setAttribute('aria-selected', 'false');
  } else {
    btnTech.classList.add('active');
    btnExec.classList.remove('active');
    btnTech.setAttribute('aria-selected', 'true');
    btnExec.setAttribute('aria-selected', 'false');
  }
}

// Reading Progress Bar
window.addEventListener('scroll', () => {
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
  const currentScroll = window.scrollY;
  const progressPercent = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
  document.getElementById('reading-progress').style.width = progressPercent + '%';
});

// Theme Switcher
function updateThemeUI(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btnIcon = document.getElementById('theme-icon');
  const btnLabel = document.getElementById('theme-label');
  if (theme === 'dark') {
    btnIcon.textContent = '☀️';
    btnLabel.textContent = 'Light Mode';
  } else {
    btnIcon.textContent = '🌙';
    btnLabel.textContent = 'Dark Mode';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('muse_report_theme', next);
  updateThemeUI(next);
}

// 1-Click Copy
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
  });
}

// Skill Filter
function filterSkills(type, btnEl) {
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  const rows = document.querySelectorAll('.skill-row');
  rows.forEach(row => {
    const rowType = row.getAttribute('data-type');
    if (type === 'all' || rowType === type) {
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

// Write the clean, milestone-accurate report
const cleanHtml = generateMilestoneHtml();
const reportCleanPath = join(VARIANTS_DIR, "report-clay-interactive-executive.html");
writeFileSync(reportCleanPath, cleanHtml, "utf8");
console.log(`Generated Clean Milestone Report: ${reportCleanPath}`);

const mainReportPath = join(REPORTS_DIR, "milestone-skill-mining-2026-09-20-clay.html");
writeFileSync(mainReportPath, cleanHtml, "utf8");
console.log(`Updated Main Report: ${mainReportPath}`);
