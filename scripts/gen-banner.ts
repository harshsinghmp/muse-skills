/**
 * Brand banner generator — assets/banner.svg
 *
 * Design: deep-space canvas, violet→cyan accent gradient, 46-node
 * constellation (one node per shipped department), technical type stack.
 * Self-contained: no external fonts, images, or filters.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const W = 1200;
const H = 400;
const SANS = "'DejaVu Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO = "'DejaVu Sans Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

// 46 nodes on a 7x7 lattice (49 cells), 3 left empty — one per department.
const COLS = 7;
const ROWS = 7;
const SKIP = new Set([0, 13, 48]); // 49 - 3 = 46
const nodes: Array<{ x: number; y: number; i: number }> = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c;
    if (SKIP.has(i)) continue;
    nodes.push({ x: 838 + c * 46, y: 66 + r * 40, i });
  }
}

// Connection lines: a sparse deterministic mesh between neighbouring nodes.
const lines: string[] = [];
for (const n of nodes) {
  const right = nodes.find((m) => m.i === n.i + 1 && m.i % COLS !== 0);
  const down = nodes.find((m) => m.i === n.i + COLS);
  if (right) lines.push(`M${n.x} ${n.y}L${right.x} ${right.y}`);
  if (down && (n.i + COLS) % 2 !== 0) lines.push(`M${n.x} ${n.y}L${down.x} ${down.y}`);
}

// Highlighted nodes (accent) — the "core engine" departments.
const HIGHLIGHT = new Set([2, 9, 16, 23, 30, 37, 44]);

const dots = nodes
  .map((n) => {
    if (HIGHLIGHT.has(n.i)) {
      return `<circle cx="${n.x}" cy="${n.y}" r="5.5" fill="url(#accent)"/>`;
    }
    return `<circle cx="${n.x}" cy="${n.y}" r="3.2" fill="#E2E8F0" fill-opacity="0.55"/>`;
  })
  .join("\n    ");

const chip = (x: number, label: string) => `
    <g transform="translate(${x} 296)">
      <rect x="0" y="0" width="${label.length * 9.6 + 30}" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.05" stroke="#FFFFFF" stroke-opacity="0.10"/>
      <text x="15" y="22" font-family="${MONO}" font-size="13" letter-spacing="1.1" fill="#CBD5E1">${label}</text>
    </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Muse Skills — 46 production-grade agent departments">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B0D16"/>
      <stop offset="0.5" stop-color="#0D1020"/>
      <stop offset="1" stop-color="#06070E"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#A78BFA"/>
      <stop offset="0.45" stop-color="#6366F1"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8B5CF6"/>
      <stop offset="0.55" stop-color="#6366F1"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
    <radialGradient id="glowV" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#8B5CF6" stop-opacity="0.50"/>
      <stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowC" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#22D3EE" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#22D3EE" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#FFFFFF" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <ellipse cx="1010" cy="90" rx="330" ry="250" fill="url(#glowV)"/>
  <ellipse cx="690" cy="380" rx="330" ry="220" fill="url(#glowC)"/>

  <g stroke="#FFFFFF" stroke-opacity="0.09" stroke-width="1" fill="none">
    <path d="M40 28 L40 12 L56 12"/>
    <path d="M${W - 40} 28 L${W - 40} 12 L${W - 56} 12"/>
    <path d="M40 ${H - 28} L40 ${H - 12} L56 ${H - 12}"/>
    <path d="M${W - 40} ${H - 28} L${W - 40} ${H - 12} L${W - 56} ${H - 12}"/>
  </g>

  <text x="72" y="132" font-family="${MONO}" font-size="13" letter-spacing="4.2" fill="url(#accent)">AGENT OPERATING SYSTEM</text>

  <text x="70" y="212" font-family="${SANS}" font-size="74" font-weight="bold" letter-spacing="-1.5" fill="#F8FAFC">MUSE<tspan fill="url(#accent)">&#160;SKILLS</tspan></text>

  <text x="72" y="256" font-family="${SANS}" font-size="20" fill="#94A3B8">46 production departments &#183; one install &#183; zero dependencies</text>

  ${chip(72, "46 SKILLS")}
  ${chip(200, "233 TESTS")}
  ${chip(328, "MIT")}
  ${chip(418, "8 HARNESSES")}

  <g stroke="#C7D2FE" stroke-opacity="0.24" stroke-width="1" fill="none">
    ${lines.join("\n    ")}
  </g>
  ${dots}

  <text x="838" y="356" font-family="${MONO}" font-size="11" letter-spacing="2.2" fill="#64748B">46 DEPARTMENTS &#183; ONE REGISTRY</text>

  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="url(#bar)"/>
</svg>
`;

mkdirSync("assets", { recursive: true });
writeFileSync("assets/banner.svg", svg);
console.log(`assets/banner.svg written (${svg.length} bytes, ${nodes.length} nodes, ${lines.length} links)`);
