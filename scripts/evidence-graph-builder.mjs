#!/usr/bin/env node
/**
 * evidence-graph-builder.mjs
 * Builds a bidirectional entity graph from .agents/context/evidence-ledger.md.
 * Nodes: DECISION, COMMITMENT, CLAIM, STATUS, SKILL, ARTIFACT.
 * Edges: references (decision → skill), verifies (claim → artifact),
 *        blocks (status → decision), supersedes (decision → decision).
 *
 * Usage: node scripts/evidence-graph-builder.mjs
 * Output: .agents/context/evidence-graph.json + stdout summary
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve repo root: scripts/ → repo root (one level up from scripts/)
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER_PATH = resolve(ROOT, '.agents/context/evidence-ledger.md');
const OUT_PATH = resolve(ROOT, '.agents/context/evidence-graph.json');

const ledger = readFileSync(LEDGER_PATH, 'utf8');
const nodes = [];
const edges = [];
const seen = new Set();

function addNode(id, type, label) {
  if (!id || seen.has(id)) return;
  seen.add(id);
  nodes.push({ id, type, label });
}

function addEdge(source, target, relation) {
  if (source && target && source !== target) edges.push({ source, target, relation });
}

// Parse EVD entries — each starts with "### EVD-NNN | date | CATEGORY"
const entryPattern = /### EVD-(\d+) \| ([\d-]+) \| (\w+)\n([\s\S]*?)(?=\n### EVD-|\n## |\n---\n\n## |$)/g;
let m;
while ((m = entryPattern.exec(ledger)) !== null) {
  const id = `EVD-${m[1]}`;
  const category = m[3].toUpperCase();
  const body = m[4];
  const stmtMatch = body.match(/\*\*Statement\*\*:\s*(.+?)(?:\n|$)/);
  const stmt = stmtMatch ? stmtMatch[1].trim().slice(0, 80) : 'no statement';
  const evMatch = body.match(/\*\*Evidence\*\*:\s*(.+?)(?:\n\*\*|$)/);
  const evidence = evMatch ? evMatch[1].trim() : '';

  addNode(id, category, stmt);

  // Extract skill references from evidence
  const skillRefs = evidence.matchAll(/`([a-z][\w-]*\/)?[A-Z][\w-]*\.md`|`([\w-]+)\/SKILL\.md`|`scripts\/([\w.-]+)`/g);
  for (const m of skillRefs) {
    const s = m[1] || m[2] || m[3];
    if (s && !s.startsWith('EVD-')) addNode(s, 'SKILL', s);
    if (s && !s.startsWith('EVD-')) addEdge(id, s, 'references');
  }

  // Extract artifact references
  const artRefs = evidence.matchAll(/`(\.agents\/artifacts\/[^`]+|\.agents\/archive\/[^`]+|\.agents\/context\/[^`]+)`/g);
  for (const m of artRefs) {
    const a = m[1];
    addNode(a, 'ARTIFACT', a.split('/').pop());
    addEdge(id, a, 'cites');
  }

  // Extract supersedes
  const supMatch = body.match(/\[SUPERSEDED by (EVD-\d+)\]/);
  if (supMatch) addEdge(id, supMatch[1], 'supersedes');

  // Extract status relationships
  if (category === 'CLAIM' && body.includes('**Status**: `VERIFIED`')) {
    const evIdMatch = evidence.match(/EVD-\d+/);
    if (evIdMatch) addEdge(id, evIdMatch[0], 'evidences');
  }
  if (category === 'COMMITMENT' && body.includes('**Status**: `FULFILLED`')) {
    const evIdMatch = evidence.match(/EVD-\d+/);
    if (evIdMatch) addEdge(id, evIdMatch[0], 'fulfills');
  }
  if (category === 'STATUS' && body.includes('Blocking')) {
    const blockMatch = evidence.match(/blocking (EVD-\d+|[\w\s-]+)/i);
    if (blockMatch) addEdge(id, 'status', 'blocks');
  }
}

// Add implicit skill→artifact edges from SKILL.md audit references
const auditSkills = ['database', 'git', 'smm', 'ops', 'gtm', 'animate', 'analytics', 'seo', 'qa-launch', 'content', 'pua', 'growth', 'mobile'];
for (const s of auditSkills) {
  const auditPath = resolve(ROOT, s, 'references', 'audit.md');
  try {
    const audit = readFileSync(auditPath, 'utf8');
    const routingRefs = audit.matchAll(/`([\w-]+\/[\w/-]+\.md)`/g);
    for (const m of routingRefs) {
      const target = m[1];
      addNode('skills/references/audit-mode-guidance.md', 'ARTIFACT', 'audit-mode-guidance.md');
      addEdge(s, 'skills/references/audit-mode-guidance.md', 'routes-to');
    }
  } catch { /* skill may not have audit reference */ }
}

const graph = {
  meta: {
    generated: new Date().toISOString(),
    source: '.agents/context/evidence-ledger.md',
    nodeCount: nodes.length,
    edgeCount: edges.length,
    categories: [...new Set(nodes.map(n => n.type))],
  },
  nodes,
  edges,
};

writeFileSync(OUT_PATH, JSON.stringify(graph, null, 2));
console.log(`✓ Evidence graph: ${nodes.length} nodes, ${edges.length} edges → ${OUT_PATH}`);
console.log(`  Categories: ${[...new Set(nodes.map(n => n.type))].join(', ')}`);
