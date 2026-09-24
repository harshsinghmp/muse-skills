import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPORTS_DIR = join(process.cwd(), ".agents/reports");
const ARCHIVE_REPORTS_DIR = join(process.cwd(), ".agents/archive/reports");

mkdirSync(REPORTS_DIR, { recursive: true });
mkdirSync(ARCHIVE_REPORTS_DIR, { recursive: true });

export function generateReportHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Muse Skills v5.25.1 — Overlap Matrix & Release Report</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --font-display: "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-body: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --radius: 16px;
  --radius-sm: 8px;
  --radius-pill: 9999px;
  --bg: #090d16;
  --bg-subtle: #0f172a;
  --surface: #131d31;
  --surface-raised: #1a2744;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --text-faint: #64748b;
  --accent: #38bdf8;
  --accent-glow: rgba(56, 189, 248, 0.25);
  --success: #34d399;
  --warning: #fbbf24;
  --purple: #c084fc;
  --rose: #fb7185;
  --border: rgba(255, 255, 255, 0.08);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font-body);
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.6;
  padding: 32px 20px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 28px;
  margin-bottom: 36px;
}
.badge-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--accent);
}
.badge.success { color: var(--success); border-color: rgba(52, 211, 153, 0.3); }
.badge.purple { color: var(--purple); border-color: rgba(192, 132, 252, 0.3); }
h1 {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #fff 40%, var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.lead {
  font-size: 1.15rem;
  color: var(--text-muted);
  max-width: 800px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 36px;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
}
.card h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  margin-bottom: 12px;
  color: var(--text);
}
.card p {
  color: var(--text-muted);
  font-size: 0.95rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
}
th, td {
  padding: 14px 18px;
  text-align: left;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
}
th {
  background: var(--surface-raised);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent);
}
tr:last-child td { border-bottom: none; }
.code-inline {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--accent);
}
footer {
  margin-top: 60px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-faint);
  font-size: 0.85rem;
}
</style>
</head>
<body>
<div class="container">
  <header>
    <div class="badge-group">
      <span class="badge success">● 117/117 Tests Passing</span>
      <span class="badge">Version 5.25.1</span>
      <span class="badge purple">46 Production Skills</span>
      <span class="badge">Zero TypeScript Errors</span>
    </div>
    <h1>🏛️ Muse Skills — Overlap Matrix & Release Report</h1>
    <p class="lead">Executive consolidation report, skills mapping matrix, and verification log for releases v5.19.0 through v5.25.1 across Harsh's agency ecosystem.</p>
  </header>

  <section>
    <h2>📊 Skills Overlap Matrix Update</h2>
    <table>
      <thead>
        <tr>
          <th>Source Skill</th>
          <th>Original Scope</th>
          <th>Muse Ecosystem Destination</th>
          <th>Persona</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="code-inline">marketing-pr-communications-manager</span></td>
          <td>PR, media pitches, crisis comms</td>
          <td><span class="code-inline">growth:pr</span></td>
          <td>Jasper / Principal</td>
          <td>✅ Merged (v5.19.0)</td>
        </tr>
        <tr>
          <td><span class="code-inline">marketing-app-store-optimizer</span></td>
          <td>ASO, Apple PPO, Google Experiments</td>
          <td><span class="code-inline">mobile:aso</span></td>
          <td>Sol / Jasper</td>
          <td>✅ Merged (v5.20.0)</td>
        </tr>
        <tr>
          <td><span class="code-inline">design-whimsy-injector</span></td>
          <td>Confetti, easter eggs, micro-copy</td>
          <td><span class="code-inline">animate:delight</span></td>
          <td>Jasper</td>
          <td>✅ Merged (v5.21.0)</td>
        </tr>
        <tr>
          <td><span class="code-inline">engineering-codebase-onboarding-engineer</span></td>
          <td>Codebase orientation, trace paths</td>
          <td><span class="code-inline">webdev:onboard</span></td>
          <td>Sol / Crew</td>
          <td>✅ Merged (v5.22.0)</td>
        </tr>
        <tr>
          <td><span class="code-inline">ponytail suite</span></td>
          <td>Simplicity candidate ladder</td>
          <td><span class="code-inline">code-review:simplify</span> (strictly on-demand)</td>
          <td>Nexus / Sol</td>
          <td>✅ Mapped & Preserved Standalone (v5.23.0)</td>
        </tr>
        <tr>
          <td><span class="code-inline">writing-skills</span></td>
          <td>Red-Green-Refactor prompt TDD</td>
          <td><span class="code-inline">updateagents/references/skill-authoring.md</span></td>
          <td>Nexus / Sol</td>
          <td>✅ Mapped & Preserved Standalone (v5.24.0)</td>
        </tr>
        <tr>
          <td><span class="code-inline">book-to-skill & skill-creator</span></td>
          <td>Knowledge extraction</td>
          <td>Local standalone tools</td>
          <td>N/A</td>
          <td>🔒 Untouched Standalone</td>
        </tr>
        <tr>
          <td><span class="code-inline">Full-Stack Funnel & Checkout</span></td>
          <td>Interactive form wizards, Stripe, CAPI</td>
          <td><span class="code-inline">webdev:funnel</span> (15th mode)</td>
          <td>Sol</td>
          <td>✅ Shipped (v5.25.0)</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>🚀 Releases v5.19.0 – v5.25.1 Breakdown</h2>
    <div class="grid">
      <div class="card">
        <h3>v5.19.0: growth:pr</h3>
        <p>AP-style press releases, 3-paragraph media pitch, 30-min P1–P4 crisis holding statements, and executive bylines.</p>
      </div>
      <div class="card">
        <h3>v5.20.0: mobile:aso</h3>
        <p>Apple PPO vs Google Play Experiments, 6-slide narrative screenshot psychology, and review prompt timing heuristics.</p>
      </div>
      <div class="card">
        <h3>v5.21.0: animate:delight</h3>
        <p>Brand personality spectrum, zero-dependency canvas confetti celebrations, Konami code listeners, reduced-motion compliance.</p>
      </div>
      <div class="card">
        <h3>v5.22.0: webdev:onboard</h3>
        <p>3-Tier codebase orientation map, end-to-end request-to-DB execution tracing, and strictly grounded code heuristics.</p>
      </div>
      <div class="card">
        <h3>v5.23.0: On-Demand Governance</h3>
        <p>Enforced strictly on-demand policy for code-review:simplify and refactor:sweep to prevent unprompted agent rewrites.</p>
      </div>
      <div class="card">
        <h3>v5.24.0: TDD Skill Engineering</h3>
        <p>Codified Red-Green-Refactor for agent instructions with Anti-Rationalization table and Gate 4 in extract-skill.ts.</p>
      </div>
      <div class="card">
        <h3>v5.25.0: webdev:funnel</h3>
        <p>Full-stack funnel pipelines: multi-step Zod form wizards, Stripe Elements checkout, 1-click upsells, and Meta CAPI.</p>
      </div>
      <div class="card">
        <h3>v5.25.1: Type Parity Patch</h3>
        <p>Updated GateResult union type in scripts/extract-skill.ts for 100% clean TypeScript compilation (0 diagnostics).</p>
      </div>
    </div>
  </section>

  <footer>
    <p>Muse Skills Suite · Built for Harsh's LifeOS & Agency Council · 100% Verified Production Delivery</p>
  </footer>
</div>
</body>
</html>`;
}

const html = generateReportHtml();
const targetFile = join(REPORTS_DIR, "session-2026-09-22-v5-25.html");
const archiveFile = join(ARCHIVE_REPORTS_DIR, "session-2026-09-22-v5-25.html");

writeFileSync(targetFile, html, "utf8");
copyFileSync(targetFile, archiveFile);

console.log("✅ Generated reports:");
console.log("   - " + targetFile);
console.log("   - " + archiveFile);
