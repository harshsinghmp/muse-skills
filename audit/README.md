# Brain Audit (`audit`)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Type: Agent Skill](https://img.shields.io/badge/Type-Agent%20Skill-blue.svg?style=for-the-badge)](#)
[![Triggers: /audit-brain](https://img.shields.io/badge/Triggers-%2Faudit--brain%20%7C%20%2Fhygiene-purple.svg?style=for-the-badge)](#)

Knowledge hygiene and referential integrity auditor for AI agent memory banks, documentation trees, and knowledge bases. Audits memory stores, `.memory/wiki/`, and project documentation for dead links, broken symbol references, orphaned notes, leaked credentials, and stale contradictions.

---

## 🧭 What is this?

As repositories evolve, documentation and memory banks decay:
- Links break silently.
- Old skill names and deprecated parameters linger in tutorials.
- Unintentional API keys get pasted into scratch notes.

`audit` provides an automated, rigorous sweep of your cognitive surface to ensure 100% referential integrity and zero security leaks.

---

## ⚡ Installation

```bash
npx skills add harshsinghmp/muse-skills --skill audit
```

---

## 🚀 Usage & Triggers

```bash
# Slash commands
/audit-brain
/hygiene

# Natural language
"Audit all markdown documentation for dead links and broken references"
"Run a memory hygiene scan across .agents/context/ and docs/"
```

---

## 📄 Artifacts Generated

1. `audit-report.md` — Complete audit breakdown of link integrity, secret sweep, frontmatter health, and remediations.
