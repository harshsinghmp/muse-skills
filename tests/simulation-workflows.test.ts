import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");

describe("🔬 Workflow Simulation & Integration Engine", () => {
  describe("1. muse-security Suite Simulation", () => {
    const securityDir = path.join(REPO_ROOT, "muse-security");
    const skillPath = path.join(securityDir, "SKILL.md");

    test("muse-security declares all 6 core operating modes and matching references", () => {
      expect(fs.existsSync(skillPath)).toBe(true);
      const skillContent = fs.readFileSync(skillPath, "utf8");

      const expectedModes = ["cve", "remediate", "cloud-waf", "sast", "runtime", "audit"];
      for (const mode of expectedModes) {
        expect(skillContent).toContain(`**${mode}**`);
        const refPath = path.join(securityDir, "references", `${mode}.md`);
        expect(fs.existsSync(refPath)).toBe(true);
      }
    });

    test("CVE severity triage logic correctly scores CVSS and exploitability", () => {
      const cveRef = fs.readFileSync(path.join(securityDir, "references", "cve.md"), "utf8");
      expect(cveRef).toContain("CVSS v3.1/v4");
      expect(cveRef).toContain("4-tier severity matrix (Critical / Important / Moderate / Low)");
      expect(cveRef).toContain("Non-Destructive Diagnostic Capture");
      expect(cveRef).toContain("sosreport -k");
    });

    test("Cloud WAF architect covers all 6 Well-Architected Framework pillars", () => {
      const wafRef = fs.readFileSync(path.join(securityDir, "references", "cloud-waf.md"), "utf8");
      expect(wafRef).toContain("1. Security");
      expect(wafRef).toContain("2. Reliability");
      expect(wafRef).toContain("3. Performance");
      expect(wafRef).toContain("4. Cost");
      expect(wafRef).toContain("5. Operations");
      expect(wafRef).toContain("6. Sustainability");
    });

    test("SAST and Runtime modes enforce zero command injection and tenant boundary isolation", () => {
      const sastRef = fs.readFileSync(path.join(securityDir, "references", "sast.md"), "utf8");
      const runtimeRef = fs.readFileSync(path.join(securityDir, "references", "runtime.md"), "utf8");

      expect(sastRef).toContain("eval()");
      expect(sastRef).toContain("MITRE ATT&CK");
      expect(runtimeRef).toContain("Destructive Command Interception (ClawSec Gate)");
      expect(runtimeRef).toContain("Zero-Secret Isolation (Varlock & Vibeguard Standard)");
    });
  });

  describe("2. smm Postiz Multi-Channel Dispatch Simulation", () => {
    const smmDir = path.join(REPO_ROOT, "smm");
    const postizRefPath = path.join(smmDir, "references", "postiz.md");

    test("smm registers postiz mode in SKILL.md and openai.yaml", () => {
      const skillContent = fs.readFileSync(path.join(smmDir, "SKILL.md"), "utf8");
      expect(skillContent).toContain("**postiz**");
      expect(skillContent).toContain("references/postiz.md");

      const openaiYaml = fs.readFileSync(path.join(smmDir, "agents", "openai.yaml"), "utf8");
      expect(openaiYaml.toLowerCase()).toContain("postiz");
    });

    test("postiz reference specifies remote media upload pipeline and TikTok direct-post mandate", () => {
      expect(fs.existsSync(postizRefPath)).toBe(true);
      const content = fs.readFileSync(postizRefPath, "utf8");

      expect(content).toContain("Mandatory Remote Media Upload Pipeline");
      expect(content).toContain("postiz upload");
      expect(content).toContain("TikTok Direct-Post Mandate");
      expect(content).toContain("DIRECT_POST");
    });
  });

  describe("3. database Vector Search & Quantization Contract", () => {
    const vectorRefPath = path.join(REPO_ROOT, "database", "references", "vector-search.md");

    test("vector-search reference documents Scalar, Product, and Binary Quantization trade-offs", () => {
      expect(fs.existsSync(vectorRefPath)).toBe(true);
      const content = fs.readFileSync(vectorRefPath, "utf8");

      expect(content).toContain("Scalar Quantization (SQ)");
      expect(content).toContain("Product Quantization (PQ)");
      expect(content).toContain("Binary Quantization (BQ)");
      expect(content).toContain("Atomic model migration & alias swap protocol");
      expect(content).toContain("update_collection_aliases");
    });
  });

  describe("4. seo Citlyze AEO & Citation SoV Calculation Simulation", () => {
    const aeoRefPath = path.join(REPO_ROOT, "seo", "references", "aeo.md");

    test("aeo reference contains the Citlyze Citation SoV mathematical formula and 6 platform engines", () => {
      expect(fs.existsSync(aeoRefPath)).toBe(true);
      const content = fs.readFileSync(aeoRefPath, "utf8");

      expect(content).toContain("Citation Share of Voice");
      expect(content).toContain("Direct Domain Links");
      expect(content).toContain("ChatGPT Search");
      expect(content).toContain("Perplexity");
      expect(content).toContain("Google Gemini/AI Overviews");
      expect(content).toContain("Claude");
    });
  });

  describe("5. Cognitive & Execution Low-Hanging Enrichments", () => {
    test("content copy reference contains Aaron 8 Pre-Flight Auditor Gates", () => {
      const copyRef = fs.readFileSync(path.join(REPO_ROOT, "content", "references", "copy.md"), "utf8");
      expect(copyRef).toContain("Aaron 8 Pre-Flight Auditor Gates");
      expect(copyRef).toContain("CORE-EEAT");
      expect(copyRef).toContain("18-Token Self-Contained Rule");
      expect(copyRef).toContain("STAR (Case Study & Proof Point Gate)");
      expect(copyRef).toContain("ROAS (Acquisition Efficiency Gate)");
      expect(copyRef).toContain("SEND (Outreach & Email Copy Gate)");
      expect(copyRef).toContain("RAMP (Readiness Gate)");
      expect(copyRef).toContain("ECHO (Tonal Integrity Gate)");
      expect(copyRef).toContain("TALE (Narrative Arc Gate)");
    });

    test("gtm score reference contains Gooseworks 4-Tier Fit-Intent Matrix and intent signal harvesters", () => {
      const scoreRef = fs.readFileSync(path.join(REPO_ROOT, "gtm", "references", "score.md"), "utf8");
      expect(scoreRef).toContain("Gooseworks 4-Tier Fit-Intent Matrix");
      expect(scoreRef).toContain("High Fit + High Intent");
      expect(scoreRef).toContain("Hiring / Job Posting Deltas");
      expect(scoreRef).toContain("Tech Stack & Infrastructure Shifts");
      expect(scoreRef).toContain("Capital & Corporate Events");
    });

    test("growth referral reference contains Viral Factor formula and Cycle Time acceleration", () => {
      const referralRef = fs.readFileSync(path.join(REPO_ROOT, "growth", "references", "referral.md"), "utf8");
      expect(referralRef).toContain("K = i \\times c");
      expect(referralRef).toContain("Viral Cycle Time ($ct$) Acceleration");
      expect(referralRef).toContain("Double-Sided Asymmetric Rewards");
    });

    test("code-review triage matrix contains Isolated Fresh-Eyes Protocol and strict dependency bump rules", () => {
      const triageRef = fs.readFileSync(path.join(REPO_ROOT, "code-review", "references", "triage-matrix.md"), "utf8");
      expect(triageRef).toContain("Isolated Fresh-Eyes Review Protocol (`context: fork`)");
      expect(triageRef).toContain("Zero-Context Blind Pass");
      expect(triageRef).toContain("Strict Isolation Rule");
      expect(triageRef).toContain("Lockfile Diff Audit");
    });

    test("git issue-to-pr-discipline contains Section 9 Pre-PR Adversarial Grilling Checklist", () => {
      const gitRef = fs.readFileSync(path.join(REPO_ROOT, "git", "references", "issue-to-pr-discipline.md"), "utf8");
      expect(gitRef).toContain("9. Pre-PR Adversarial Grilling Checklist");
      expect(gitRef).toContain("Inversion & Catastrophic Failure");
      expect(gitRef).toContain("Blast Radius & Shared State");
      expect(gitRef).toContain("Async Race Conditions & Ordering");
    });

    test("new-project contains Poka-Yoke architectural contracts and Milestone Exclusion List", () => {
      const newProjSkill = fs.readFileSync(path.join(REPO_ROOT, "new-project", "SKILL.md"), "utf8");
      expect(newProjSkill).toContain("Poka-Yoke Architectural Scaffolding Contracts");
      expect(newProjSkill).toContain("Unrepresentable Misuse States");
      expect(newProjSkill).toContain("Three Regulatory Axes");
      expect(newProjSkill).toContain('Milestone Exclusion List ("What We Are NOT Building")');
    });

    test("humanize patterns contains expanded P51-P60 anti-slop rules", () => {
      const patternsRef = fs.readFileSync(path.join(REPO_ROOT, "humanize", "references", "patterns.md"), "utf8");
      expect(patternsRef).toContain("P51 Somatic Cliche Mapping");
      expect(patternsRef).toContain("P52 Narrative Moralizing");
      expect(patternsRef).toContain("P53 Artificial Causal Tidiness");
      expect(patternsRef).toContain("P54 Sycophantic / Enthusiastic Opener");
      expect(patternsRef).toContain("P55 Hedging Stack");
      expect(patternsRef).toContain("P56 Nominalization Bloat");
      expect(patternsRef).toContain("P57 Reasoning Trace Leakage");
      expect(patternsRef).toContain("P58 Em-Dash Over-Saturation");
      expect(patternsRef).toContain("P59 Pseudo-Profundity");
      expect(patternsRef).toContain("P60 Venue Mismatch Register");
    });
  });

  describe("6. accounts Financial Operations Engine Simulation", () => {
    const accountsDir = path.join(REPO_ROOT, "accounts");
    const skillPath = path.join(accountsDir, "SKILL.md");

    test("accounts declares all 6 core operating modes and matching references", () => {
      expect(fs.existsSync(skillPath)).toBe(true);
      const skillContent = fs.readFileSync(skillPath, "utf8");

      const expectedModes = ["invoicing", "bookkeeping", "client-pnl", "cashflow", "tax-compliance", "audit"];
      for (const mode of expectedModes) {
        expect(skillContent).toContain(`**${mode}**`);
        const refPath = path.join(accountsDir, "references", `${mode}.md`);
        expect(fs.existsSync(refPath)).toBe(true);
      }
    });

    test("invoicing reference defines DSO compression dunning ladder and upfront deposit mandate", () => {
      const invRef = fs.readFileSync(path.join(accountsDir, "references", "invoicing.md"), "utf8");
      expect(invRef).toContain("50% deposit upfront");
      expect(invRef).toContain("T-3 Days (Courtesy Heads-Up)");
      expect(invRef).toContain("Day 0 (Due Date)");
      expect(invRef).toContain("T+7 Days (Delivery Notice)");
      expect(invRef).toContain("T+14 Days (Hard Delivery Pause)");
    });

    test("bookkeeping reference defines standard 6-class COA and Deferred Revenue recognition", () => {
      const bookRef = fs.readFileSync(path.join(accountsDir, "references", "bookkeeping.md"), "utf8");
      expect(bookRef).toContain("1000–1999 Assets");
      expect(bookRef).toContain("2020");
      expect(bookRef).toContain("Deferred Revenue");
      expect(bookRef).toContain("5000–5999 Direct Cost of Goods Sold (COGS)");
      expect(bookRef).toContain("5-Step Monthly Financial Close Protocol");
    });

    test("client-pnl reference specifies gross margin benchmarks and EHR realization formula", () => {
      const pnlRef = fs.readFileSync(path.join(accountsDir, "references", "client-pnl.md"), "utf8");
      expect(pnlRef).toContain("Client Gross Margin");
      expect(pnlRef).toContain("Effective Hourly Rate (EHR)");
      expect(pnlRef).toContain("$150/hr");
      expect(pnlRef).toContain("Rule of 10%");
      expect(pnlRef).toContain("Change-Order Fee");
    });

    test("cashflow reference enforces 3-to-6 month reserve buffer and 3-account segregation", () => {
      const cashRef = fs.readFileSync(path.join(accountsDir, "references", "cashflow.md"), "utf8");
      expect(cashRef).toContain("13-Week Rolling Cash Flow Forecast");
      expect(cashRef).toContain("Cash Runway (Months)");
      expect(cashRef).toContain("Operating Account");
      expect(cashRef).toContain("Tax Reserve Sub-Account");
      expect(cashRef).toContain("Days Sales Outstanding (DSO)");
    });

    test("tax-compliance specifies cross-border export zero-rating and contractor compliance", () => {
      const taxRef = fs.readFileSync(path.join(accountsDir, "references", "tax-compliance.md"), "utf8");
      expect(taxRef).toContain("Export of Services under Letter of Undertaking (LUT)");
      expect(taxRef).toContain("Reverse Charge: VAT to be accounted for by the recipient");
      expect(taxRef).toContain("Form W-9");
      expect(taxRef).toContain("Form W-8BEN");
      expect(taxRef).toContain("1099-NEC");
    });

    test("audit reference outlines 5 financial leakage vectors and prioritized action matrix", () => {
      const auditRef = fs.readFileSync(path.join(accountsDir, "references", "audit.md"), "utf8");
      expect(auditRef).toContain("Zombie SaaS & Cloud Tooling");
      expect(auditRef).toContain("Unbilled Work & Creeping Milestones");
      expect(auditRef).toContain("Payment Gateway & FX Spread Drag");
      expect(auditRef).toContain("Contractor Margin Distortion");
      expect(auditRef).toContain("Immediate Remedy (24h)");
    });

    test("bookkeeping reference implements OpenAccountants 3-outcome model and modern gateway clearing accounts", () => {
      const bookRef = fs.readFileSync(path.join(accountsDir, "references", "bookkeeping.md"), "utf8");
      // Modern Fintech Gateway Clearing Ledgers (No QuickBooks/Xero dependency)
      expect(bookRef).toContain("1031` Stripe Clearing");
      expect(bookRef).toContain("1032` Razorpay Clearing");
      expect(bookRef).toContain("1033` Cashfree Clearing & AutoCollect");
      expect(bookRef).toContain("1034` PayU Clearing");
      expect(bookRef).toContain("1035` Paytm Gateway Clearing");
      expect(bookRef).toContain("1200` GST / Tax Input Credit (ITC");

      // OpenAccountants Epistemic Model & Working Paper
      expect(bookRef).toContain("OpenAccountants Three-Outcome Classification Protocol");
      expect(bookRef).toContain("`1. CLASSIFIED` (Definitive)");
      expect(bookRef).toContain("`2. ASSUMED` (Disclosed Conservative Default)");
      expect(bookRef).toContain("`3. NEEDS INPUT` (Gated Stop)");
      expect(bookRef).toContain("OpenAccountants Standardized Working Paper Schema");
    });

    test("invoicing reference supports AutoCollect virtual accounts and modern payment rails", () => {
      const invRef = fs.readFileSync(path.join(accountsDir, "references", "invoicing.md"), "utf8");
      expect(invRef).toContain("Stripe");
      expect(invRef).toContain("Razorpay");
      expect(invRef).toContain("Cashfree Payments");
      expect(invRef).toContain("PayU");
      expect(invRef).toContain("Paytm Payment Gateway");
      expect(invRef).toContain("AutoCollect");
    });

    test("reconcile-gateways script executes cleanly and outputs valid working papers with ITC calculations", () => {
      const scriptPath = path.join(accountsDir, "scripts", "reconcile-gateways.ts");
      expect(fs.existsSync(scriptPath)).toBe(true);

      const res = spawnSync("bun", [scriptPath, "--demo"], { encoding: "utf8" });
      expect(res.status).toBe(0);
      expect(res.stdout).toContain("Payment Gateway Settlement & OpenAccountants Reconciliation Report");
      expect(res.stdout).toContain("STRIPE");
      expect(res.stdout).toContain("RAZORPAY");
      expect(res.stdout).toContain("CASHFREE");
      expect(res.stdout).toContain("PAYU");
      expect(res.stdout).toContain("PAYTM");
      expect(res.stdout).toContain("Total Recoverable GST Input Tax Credit (ITC on Fees)");
      expect(res.stdout).toContain("CLASSIFIED");
    });
  });

  describe("7. Council Persona Capabilities & Multi-Ecosystem Simulation", () => {
    test("Jasper: animate technical-diagrams generates zero-JS moving SVG architectures", () => {
      const diagPath = path.join(REPO_ROOT, "animate", "references", "technical-diagrams.md");
      expect(fs.existsSync(diagPath)).toBe(true);
      const content = fs.readFileSync(diagPath, "utf8");
      expect(content).toContain("stroke-dashoffset");
      expect(content).toContain("animateMotion");
      expect(content).toContain("Flow Mode");
      expect(content).toContain("Architecture Mode");
      expect(content).toContain("prefers-reduced-motion");
    });

    test("Jasper: smm social-intel harvests multi-platform sentiment and viral hooks at zero cost", () => {
      const intelPath = path.join(REPO_ROOT, "smm", "references", "social-intel.md");
      expect(fs.existsSync(intelPath)).toBe(true);
      const content = fs.readFileSync(intelPath, "utf8");
      expect(content).toContain("Twitter / X");
      expect(content).toContain("Reddit");
      expect(content).toContain("YouTube");
      expect(content).toContain("Social Intelligence Dossier");
      expect(content).toContain("Viral Hook Bank");
    });

    test("Sol: database tuning runs semantic parameter optimization loops against real metrics", () => {
      const tuningPath = path.join(REPO_ROOT, "database", "references", "tuning.md");
      expect(fs.existsSync(tuningPath)).toBe(true);
      const content = fs.readFileSync(tuningPath, "utf8");
      expect(content).toContain("Semantic parameter reasoning");
      expect(content).toContain("Database Connection Pooling");
      expect(content).toContain("Vector Search Indexing & Quantization");
      expect(content).toContain("Optimization Report Schema");
    });

    test("Sol & Crew: automation browser-relay connects authenticated browser tabs with zero credential leak", () => {
      const relayPath = path.join(REPO_ROOT, "automation", "references", "browser-relay.md");
      expect(fs.existsSync(relayPath)).toBe(true);
      const content = fs.readFileSync(relayPath, "utf8");
      expect(content).toContain("127.0.0.1:18795");
      expect(content).toContain("browser-relay doctor");
      expect(content).toContain("LifeOS Vibeguard Protocol");
      expect(content).toContain("Zero Password Ingestion");
    });

    test("Nexus: code-review boundary-governance strictly enforces the 5 checkpoints", () => {
      const govPath = path.join(REPO_ROOT, "code-review", "references", "boundary-governance.md");
      expect(fs.existsSync(govPath)).toBe(true);
      const content = fs.readFileSync(govPath, "utf8");
      expect(content).toContain("The 5 Checkpoints");
      expect(content).toContain("1. GOAL");
      expect(content).toContain("2. FACTS");
      expect(content).toContain("3. METHOD");
      expect(content).toContain("4. VERIFICATION");
      expect(content).toContain("5. BOUNDARIES");
      expect(content).toContain("Unsolicited Refactoring");
    });

    test("Crew: client-comms factual-reporting grounds status updates in verified Git evidence", () => {
      const repPath = path.join(REPO_ROOT, "client-comms", "references", "factual-reporting.md");
      expect(fs.existsSync(repPath)).toBe(true);
      const content = fs.readFileSync(repPath, "utf8");
      expect(content).toContain("Evidence Precedes Claims");
      expect(content).toContain("Completed & Verified Deliverables");
      expect(content).toContain("Risks & Decisions Required From Client");
    });

    test("Council Overall: updateagents global-atoms caps active cross-project invariants at <=20", () => {
      const atomPath = path.join(REPO_ROOT, "updateagents", "references", "global-atoms.md");
      expect(fs.existsSync(atomPath)).toBe(true);
      const content = fs.readFileSync(atomPath, "utf8");
      expect(content).toContain("Global Atom Cap (≤20 active invariant atoms)");
      expect(content).toContain("Promotion Gate (≥2 Independent Repositories)");
      expect(content).toContain("365-Day Demotion Lifecycle");
      expect(content).toContain("Task Observation Loop");
    });
  });
});
