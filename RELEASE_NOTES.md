# 🏛️ Muse Skills v7.1.0 — Agency Reflection & Quality Gate Release

> **The complete agency reflection, quality hardening, and agent orchestration suite.** 65 PRs merged. 189 automated tests. 502 commits. 46 production-grade skills. Zero dead-letter failures. Zero credential leaks.

---

## 🌟 What's New in v7.1.0

- **Tri-Vector Autonomous Agency Coach (`coach`)** (#210): Structured daily standups, async scope checks, client digest automation, and founder vitality audits across Team, Client, and Founder vectors with five dedicated reference playbooks (`team.md`, `client.md`, `founder.md`, `audit.md`, `effort-rubric.md`) and executable CLI engine (`coach.ts`).
- **Toxic Loop Circuit Breaker (`dead-letter`)** (#206): Automatic circuit-trip on ≥2 identical failure signatures, Precondition Delta gate, Vibeguard zero-credential sanitization, and atomic POSIX rename writes for corrupted-state protection (`circuit-breaker.md`).
- **Receipt-or-Rejection Gate (`pua`)** (#207): Verbatim CLI receipt requirement, Ghost File Probe (`fs.existsSync`), Churn-to-Signal ratio guardrail (≤ 1.5; > 3.0 = halt), and banned sycophancy phrase scan with 3-line diagnosis format (`receipt-verification.md`).
- **Automated Purge Register & Founder Vitality ADE (`periodic-retreat` v1.1.0)** (#208): 4-phase strategic retreat facilitation — forensic retrospective with git churn heatmap, `bunx knip` dead-export purge register, Automate/Delegate/Eliminate vitality framework, and binary OKR contracts with Monday Launchpad Packet (`retreat-protocol.md`).
- **AST Code-Shield Pipeline & Cadence Burstiness (`humanize` v1.1.0)** (#209): 3-pass stash pipeline (fenced code, inline backticks, frontmatter, tables, URLs) preserving code blocks through humanization; cadence dispersion metric (σ ≥ 5.0); bullet density fence (≤ 40%); em-dash budget (≤ 1 per 500w); technical jargon whitelist (`ast-shield-and-cadence.md`).
- **Git Convention Miner Merge Filter (`git`)**: Ignored topological merge commits (`--no-merges`) when mining repository commit message conventions in `pr-convention-miner.ts`.

---

## 📊 Suite Verification & Stats

| Metric | v7.0.0 | v7.1.0 |
|:---|:---|:---|
| Automated Tests | 188 | **189** |
| Test Assertions | 3,815 | **3,857** |
| Skills Count | 46 | **46** |
| Shipped Commits | 497 | **502** |
| Test Failures | 0 | **0** |
| Secret Leaks | 0 | **0** |

---

## 🚀 Quick Install

```bash
npx skills add harshsinghmp/muse-skills
```

**Full Changelog**: https://github.com/harshsinghmp/muse-skills/compare/v7.0.0...v7.1.0
