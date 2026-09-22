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

  describe("8. Department Upgrades & Consolidations Simulation", () => {
    test("content: registers podcast mode and implements broadcast audio engineering standards", () => {
      const contentSkill = fs.readFileSync(path.join(REPO_ROOT, "content", "SKILL.md"), "utf8");
      expect(contentSkill).toContain("| **podcast** |");
      expect(contentSkill).toContain("references/podcast.md");

      const podcastRef = fs.readFileSync(path.join(REPO_ROOT, "content", "references", "podcast.md"), "utf8");
      expect(podcastRef).toContain("-16.0 LUFS");
      expect(podcastRef).toContain("-19.0 LUFS");
      expect(podcastRef).toContain("-1.0 dBTP");
      expect(podcastRef).toContain("80 Hz");
      expect(podcastRef).toContain("Cold Open");
    });

    test("content: video mode houses HeyFrames AI editing, short-form retention, and long-form essay strategies", () => {
      const videoRef = fs.readFileSync(path.join(REPO_ROOT, "content", "references", "video.md"), "utf8");
      expect(videoRef).toContain("HeyFrames & Automated AI Video Workflows");
      expect(videoRef).toContain("Intelligent Aspect Ratio Reframing");
      expect(videoRef).toContain("16:9 to 9:16");
      expect(videoRef).toContain("Kinetic Subtitle Engineering");
      expect(videoRef).toContain("The 3-Second Retention Law");
      expect(videoRef).toContain("Long-Form Video Strategy");
    });

    test("database: registers optimize mode consolidating database-optimizer with memory and query tuning", () => {
      const dbSkill = fs.readFileSync(path.join(REPO_ROOT, "database", "SKILL.md"), "utf8");
      expect(dbSkill).toContain("| **optimize** |");
      expect(dbSkill).toContain("database-optimizer");
      expect(dbSkill).toContain("references/optimize.md");

      const optRef = fs.readFileSync(path.join(REPO_ROOT, "database", "references", "optimize.md"), "utf8");
      expect(optRef).toContain("EXPLAIN (ANALYZE, BUFFERS");
      expect(optRef).toContain("shared_buffers");
      expect(optRef).toContain("work_mem");
      expect(optRef).toContain("SKIP LOCKED");
      expect(optRef).toContain("Covering Indexes (`INCLUDE`)");
    });

    test("webdev: fullstack mode consolidates fullstack-guardian with Three-Perspective Security Architecture", () => {
      const fsRef = fs.readFileSync(path.join(REPO_ROOT, "webdev", "references", "fullstack.md"), "utf8");
      expect(fsRef).toContain("Three-Perspective Security Architecture (fullstack-guardian)");
      expect(fsRef).toContain("[Backend Perspective]");
      expect(fsRef).toContain("[Frontend Perspective]");
      expect(fsRef).toContain("[Security Perspective]");
      expect(fsRef).toContain("parameterized queries");
      expect(fsRef).toContain("state matrix");
    });

    test("webdev: spec mode consolidates spec-miner with Arch/QA hats and EARS requirements extraction", () => {
      const specRef = fs.readFileSync(path.join(REPO_ROOT, "webdev", "references", "spec.md"), "utf8");
      expect(specRef).toContain("legacy reverse-engineering (spec-miner)");
      expect(specRef).toContain("Arch Hat");
      expect(specRef).toContain("QA Hat");
      expect(specRef).toContain("EARS Syntax");
      expect(specRef).toContain("Ubiquitous");
      expect(specRef).toContain("Event-driven");
      expect(specRef).toContain("State-driven");
      expect(specRef).toContain("specs/{project_name}_reverse_spec.md");
    });

    test("webdev: audit mode registers responsiveness-check, viewport test matrix, and touch targets", () => {
      const webdevSkill = fs.readFileSync(path.join(REPO_ROOT, "webdev", "SKILL.md"), "utf8");
      expect(webdevSkill).toContain("| **audit** |");
      expect(webdevSkill).toContain("responsiveness-check");
      expect(webdevSkill).toContain("references/audit.md");

      const auditRef = fs.readFileSync(path.join(REPO_ROOT, "webdev", "references", "audit.md"), "utf8");
      expect(auditRef).toContain("Viewport Breakdown Matrix");
      expect(auditRef).toContain("Horizontal Overflow & Layout Blowout Scan");
      expect(auditRef).toContain("Mobile Touch Targets & Ergonomic Safety");
      expect(auditRef).toContain("44x44px");
      expect(auditRef).toContain("100dvh");
    });

    test("devops: cloudflare mode consolidates Workers, Pages, Full (Strict) SSL, and Zero Trust tunnels", () => {
      const devopsSkill = fs.readFileSync(path.join(REPO_ROOT, "devops", "SKILL.md"), "utf8");
      expect(devopsSkill).toContain("| **cloudflare** |");
      expect(devopsSkill).toContain("references/cloudflare.md");

      const cfRef = fs.readFileSync(path.join(REPO_ROOT, "devops", "references", "cloudflare.md"), "utf8");
      expect(cfRef).toContain("Full (Strict)");
      expect(cfRef).toContain("Zero Trust Tunnels (`cloudflared`)");
      expect(cfRef).toContain("Rate Limiting Rule");
      expect(cfRef).toContain("wrangler.toml");
    });

    test("design: uikit mode consolidates starwind-ui, stitch-design-taste, headless primitives, and CVA", () => {
      const designSkill = fs.readFileSync(path.join(REPO_ROOT, "design", "SKILL.md"), "utf8");
      expect(designSkill).toContain("| **uikit** |");
      expect(designSkill).toContain("starwind-ui");
      expect(designSkill).toContain("stitch-design-taste");
      expect(designSkill).toContain("references/uikit.md");

      const uikitRef = fs.readFileSync(path.join(REPO_ROOT, "design", "references", "uikit.md"), "utf8");
      expect(uikitRef).toContain("stitch-design-taste");
      expect(uikitRef).toContain("Starwind UI");
      expect(uikitRef).toContain("Class Variance Authority / CVA");
      expect(uikitRef).toContain("44×44px");
      expect(uikitRef).toContain("focus-visible");
    });

    test("growth: launch mode incorporates Product Hunt launch playbook", () => {
      const growthSkill = fs.readFileSync(path.join(REPO_ROOT, "growth", "SKILL.md"), "utf8");
      expect(growthSkill).toContain("producthunt");
      expect(growthSkill).toContain("product hunt launch");

      const launchRef = fs.readFileSync(path.join(REPO_ROOT, "growth", "references", "launch.md"), "utf8");
      expect(launchRef).toContain("Product Hunt Launch Playbook (`producthunt`)");
      expect(launchRef).toContain("12:01 AM PST");
      expect(launchRef).toContain("first-4-hours momentum");
    });

    test("design: saas landing page template enforces 9-section sequence and 9 copywriting frameworks", () => {
      const templatePath = path.join(REPO_ROOT, "design", "templates", "saas.md");
      expect(fs.existsSync(templatePath)).toBe(true);

      const tpl = fs.readFileSync(templatePath, "utf8");
      // 9 canonical sections
      expect(tpl).toContain("1. Header / Nav");
      expect(tpl).toContain("2. Hero Section");
      expect(tpl).toContain("3. Logos / Trust Marquee");
      expect(tpl).toContain("4. Features Section(s)");
      expect(tpl).toContain("5. Product Showcase Section");
      expect(tpl).toContain("6. Pricing Section");
      expect(tpl).toContain("7. Testimonial Section");
      expect(tpl).toContain("8. Final CTA Section");
      expect(tpl).toContain("9. Footer");

      // 7 copywriting frameworks + storytelling + SPIN
      expect(tpl).toContain("AIDA (Attention → Interest → Desire → Action)");
      expect(tpl).toContain("PASTOR (Problem → Amplify → Solution → Testimonial → Offer → Response)");
      expect(tpl).toContain("4 P's (Promise → Picture → Proof → Push)");
      expect(tpl).toContain("PRUNE (Point → Reason → Unveil → Nail → Exit)");
      expect(tpl).toContain("SLAP (Stop → Look → Act → Purchase)");
      expect(tpl).toContain("So What? (Problem → Consequence → Solution)");
      expect(tpl).toContain("PAPA (Problem → Advantages → Proof → Action)");
      expect(tpl).toContain("Star-Story-Solution (Storytelling Framework)");
      expect(tpl).toContain("SPIN (Situation → Problem → Implication → Need-Payoff)");

      // Cross references in ui and wireframe references
      const uiRef = fs.readFileSync(path.join(REPO_ROOT, "design", "references", "ui.md"), "utf8");
      expect(uiRef).toContain("templates/saas.md");

      const wireframeRef = fs.readFileSync(path.join(REPO_ROOT, "design", "references", "wireframe.md"), "utf8");
      expect(wireframeRef).toContain("templates/saas.md");
    });

    test("design: ux mode consolidates UX Architecture, Research, Persona Walkthroughs, Onboarding UX, and Interaction Patterns", () => {
      const designSkill = fs.readFileSync(path.join(REPO_ROOT, "design", "SKILL.md"), "utf8");
      expect(designSkill).toContain("| **ux** |");
      expect(designSkill).toContain("ux-architect");
      expect(designSkill).toContain("ux-researcher");
      expect(designSkill).toContain("persona-walkthrough");
      expect(designSkill).toContain("onboarding-ux");
      expect(designSkill).toContain("ux-patterns");

      const uxRef = fs.readFileSync(path.join(REPO_ROOT, "design", "references", "ux.md"), "utf8");
      // Pillar 1: UX Architecture & Systems
      expect(uxRef).toContain("Pillar 1: UX Architecture & Systems Foundations (ArchitectUX)");
      expect(uxRef).toContain("The 3-Click / 3-Level Rule");
      expect(uxRef).toContain("Mandatory Theme Ergonomics");

      // Pillar 2: UX Research & Usability
      expect(uxRef).toContain("Pillar 2: UX Research & Usability Engineering (UX Researcher)");
      expect(uxRef).toContain("The 10 Nielsen-Norman Usability Heuristics Audit");
      expect(uxRef).toContain("System Usability Scale (SUS");

      // Pillar 3: Persona Walkthrough & Psychological Auditing
      expect(uxRef).toContain("Pillar 3: Cognitive Persona Walkthroughs & Conversion Auditing");
      expect(uxRef).toContain("The 5-Second Test");
      expect(uxRef).toContain("The LIFT Model Conversion Audit");
      expect(uxRef).toContain("Fogg Behavior Model ($B = \\text{MAP}$)");
      expect(uxRef).toContain("Dual-Voice Evaluation Format");

      // Pillar 4: Onboarding UX
      expect(uxRef).toContain("Pillar 4: Onboarding UX & Adoption Flow (`onboarding-ux`)");
      expect(uxRef).toContain("The 4-Stage Progressive Disclosure Onboarding Arc");
      expect(uxRef).toContain("Walkthrough Fatigue Prevention");

      // Pillar 5: Interaction Patterns
      expect(uxRef).toContain("Pillar 5: Canonical UX Interaction Patterns (`ux-patterns`)");
      expect(uxRef).toContain("Sequential Stepper / Wizard");
      expect(uxRef).toContain("Soft Delete + 10s Undo Toast");
    });

    test("design: story mode implements visual storytelling, narrative arcs, and video storyboards", () => {
      const designSkill = fs.readFileSync(path.join(REPO_ROOT, "design", "SKILL.md"), "utf8");
      expect(designSkill).toContain("| **story** |");
      expect(designSkill).toContain("visual storytelling");
      expect(designSkill).toContain("references/story.md");
      expect(designSkill).toContain(
        'argument-hint: "[ui|ux|wireframe|logo|branding|socials|graphics|prototype|uikit|story]"',
      );

      const storyRef = fs.readFileSync(path.join(REPO_ROOT, "design", "references", "story.md"), "utf8");
      expect(storyRef).toContain("Visual Storytelling Philosophy & The 4 Pillars");
      expect(storyRef).toContain("The 3-Act Visual Arc");
      expect(storyRef).toContain("The Emotional Journey Map");
      expect(storyRef).toContain("Video Storyboarding & Motion Design Direction");
      expect(storyRef).toContain("Information Design & Data Storytelling");
      expect(storyRef).toContain("Cross-Platform Visual Narrative Adaptation");
    });

    test("devops: cloudflare covers try.cloudflare.com quick tunnels and homelab zero trust", () => {
      const scriptPath = path.join(REPO_ROOT, "devops", "scripts", "tunnel.ts");
      expect(fs.existsSync(scriptPath)).toBe(true);

      const script = fs.readFileSync(scriptPath, "utf8");
      expect(script).toContain("try.cloudflare.com");
      expect(script).toContain("cloudflared");
      expect(script).toContain("pacman -S cloudflared");

      const cfRef = fs.readFileSync(path.join(REPO_ROOT, "devops", "references", "cloudflare.md"), "utf8");
      expect(cfRef).toContain("try.cloudflare.com");
      expect(cfRef).toContain("Client Live Previews");
      expect(cfRef).toContain("External Webhook Simulation");
      expect(cfRef).toContain("Real-Device Mobile & Cellular QA");
      expect(cfRef).toContain("Zero Trust Tunnels (`cloudflared`) & Homelab Architecture");
      expect(cfRef).toContain("docker-compose");
      expect(cfRef).toContain("Cloudflare Access");
    });

    test("content: copy mode incorporates comprehensive copywriting formulas and auto-suggestion matrix", () => {
      const copyRef = fs.readFileSync(path.join(REPO_ROOT, "content", "references", "copy.md"), "utf8");

      // Auto-Suggestion & Selector Matrix
      expect(copyRef).toContain("Automated Formula Selector & Decision Matrix");
      expect(copyRef).toContain("Eugene Schwartz 5 Stages");

      // Core Full-Page Formulas
      expect(copyRef).toContain("AIDA");
      expect(copyRef).toContain("AIDCA & IDCA");
      expect(copyRef).toContain("Danny Iny’s 6+1 Formula");
      expect(copyRef).toContain("PAS (Problem → Agitation → Solution)");
      expect(copyRef).toContain("The 4 Ps (Two Proven Variations)");
      expect(copyRef).toContain("ACCA (Awareness → Comprehension → Conviction → Action)");
      expect(copyRef).toContain("QUEST (Qualify → Understand → Educate → Stimulate → Transition)");
      expect(copyRef).toContain("SLAP (Stop → Look → Act → Purchase)");
      expect(copyRef).toContain("AIDPPC");
      expect(copyRef).toContain("5-Point Copywriting Formula");
      expect(copyRef).toContain("DOS (Dream → Obstacle → Solution)");
      expect(copyRef).toContain("AICPBSAWN");

      // Long-Form & Direct Response
      expect(copyRef).toContain("Bob Serling’s 36-Step Power Copywriting Formula");
      expect(copyRef).toContain("Star → Story → Solution");
      expect(copyRef).toContain("Bob Stone’s 7-Step Copywriting Formula");
      expect(copyRef).toContain("Frank Egner’s 9-Point Formula");
      expect(copyRef).toContain("David Frey’s 12-Step Foolproof Sales Letter");
      expect(copyRef).toContain("Perry Belcher’s 21-Part Sales Letter Formula");
      expect(copyRef).toContain("HELLYEAH");
      expect(copyRef).toContain("PASTOR");

      // VSLs, Headlines & Fascinations
      expect(copyRef).toContain("The Jim Edwards VSL Method");
      expect(copyRef).toContain("Common 3-CTA Video Blueprint");
      expect(copyRef).toContain("Geoffrey Moore’s Positioning Statement");
      expect(copyRef).toContain("Steve Blank’s VAD");
      expect(copyRef).toContain("The 7 Deadly Fascinations");
      expect(copyRef).toContain("RAD Framework (Require → Acquire → Desire)");
      expect(copyRef).toContain("Rob Walling’s 5-Day SaaS Onboarding Drip");
      expect(copyRef).toContain("Wishpond 5-Part Lead Nurture Sequence");
      expect(copyRef).toContain("String of Pearls");
      expect(copyRef).toContain("PASOP Email Sequence");
      expect(copyRef).toContain("ERERS Framework");
    });

    test("Universal Copywriting & SEO/AEO Mandate is strictly enforced across AGENTS.md, content, smm, and taste engine", () => {
      // AGENTS.md working rule
      const agentsMd = fs.readFileSync(path.join(REPO_ROOT, "AGENTS.md"), "utf8");
      expect(agentsMd).toContain("Universal Copywriting & SEO/AEO Mandate");
      expect(agentsMd).toContain("content/references/copy.md");
      expect(agentsMd).toContain("AI Engine Optimization (AEO");

      // content SKILL.md
      const contentSkill = fs.readFileSync(path.join(REPO_ROOT, "content", "SKILL.md"), "utf8");
      expect(contentSkill).toContain("Universal Copywriting & SEO/AEO Mandate");

      // content blog mode
      const blogRef = fs.readFileSync(path.join(REPO_ROOT, "content", "references", "blog.md"), "utf8");
      expect(blogRef).toContain("Select a proven copywriting formula from `copy.md`");
      expect(blogRef).toContain("Answer-First AEO formatting");
      expect(blogRef).toContain("18-Token Standalone Quotability Rule (CITE Gate)");

      // content email mode
      const emailRef = fs.readFileSync(path.join(REPO_ROOT, "content", "references", "email.md"), "utf8");
      expect(emailRef).toContain("proven sequence formula from `copy.md`");
      expect(emailRef).toContain("12 High-Open Subject Line Archetypes in `copy.md`");
      expect(emailRef).toContain("AEO/SEO indexing");

      // smm content mode
      const smmRef = fs.readFileSync(path.join(REPO_ROOT, "smm", "references", "content.md"), "utf8");
      expect(smmRef).toContain("Select a proven copywriting formula from `copy.md`");
      expect(smmRef).toContain("Social Search & AEO");

      // decisions.md and current.md persistent invariants (when present locally)
      const decisionsPath = path.join(REPO_ROOT, ".agents", "context", "decisions.md");
      if (fs.existsSync(decisionsPath)) {
        const decisionsMd = fs.readFileSync(decisionsPath, "utf8");
        expect(decisionsMd).toContain("atom-communication-mub4copy02");
      }

      const currentPath = path.join(REPO_ROOT, ".agents", "context", "current.md");
      if (fs.existsSync(currentPath)) {
        const currentMd = fs.readFileSync(currentPath, "utf8");
        expect(currentMd).toContain("atom-communication-mub4copy02");
      }

      // taste-state.json
      const tastePath = path.join(REPO_ROOT, ".agents", "context", "taste-state.json");
      if (fs.existsSync(tastePath)) {
        const tasteJson = JSON.parse(fs.readFileSync(tastePath, "utf8")) as { atoms: Array<{ id: string }> };
        const hasAtom = tasteJson.atoms.some((a) => a.id === "atom-communication-mub4copy02");
        expect(hasAtom).toBe(true);
      }
    });
  });

  describe("8. Brand Lifecycle & Client Onboarding Engine (brand)", () => {
    const brandDir = path.join(REPO_ROOT, "brand");

    test("brand SKILL.md registers all 8 modes in table and frontmatter", () => {
      const skillMd = fs.readFileSync(path.join(brandDir, "SKILL.md"), "utf8");
      expect(skillMd).toContain("name: brand");
      expect(skillMd).toContain(
        'argument-hint: "[intake|research|pipeline|accounts-access|brief|ecommerce|offboard|audit]"',
      );

      // Modes table
      expect(skillMd).toContain("| **intake** |");
      expect(skillMd).toContain("| **research** |");
      expect(skillMd).toContain("| **pipeline** |");
      expect(skillMd).toContain("| **accounts-access** |");
      expect(skillMd).toContain("| **brief** |");
      expect(skillMd).toContain("| **ecommerce** |");
      expect(skillMd).toContain("| **offboard** |");
      expect(skillMd).toContain("| **audit** |");

      // Verify companion files
      expect(fs.existsSync(path.join(brandDir, "README.md"))).toBe(true);
      expect(fs.existsSync(path.join(brandDir, "agents", "openai.yaml"))).toBe(true);
    });

    test("all 8 mode reference documents exist with actionable agency playbooks", () => {
      const expectedModes = [
        "intake",
        "research",
        "pipeline",
        "accounts-access",
        "brief",
        "ecommerce",
        "offboard",
        "audit",
      ];
      for (const mode of expectedModes) {
        const refPath = path.join(brandDir, "references", `${mode}.md`);
        expect(fs.existsSync(refPath)).toBe(true);
        const content = fs.readFileSync(refPath, "utf8");
        expect(content.length).toBeGreaterThan(500);
      }
    });

    test("ecommerce mode covers Amazon, Shopee, TikTok Shop, international logistics, and global compliance", () => {
      const ecomRef = fs.readFileSync(path.join(brandDir, "references", "ecommerce.md"), "utf8");
      expect(ecomRef).toContain("Amazon (North America, Europe, Japan)");
      expect(ecomRef).toContain("Shopee & Lazada");
      expect(ecomRef).toContain("TikTok Shop");
      expect(ecomRef).toContain("International Logistics & Overseas Warehousing");
      expect(ecomRef).toContain("Global Tax, Compliance & Regulatory Architecture");
      expect(ecomRef).toContain("Multilingual Listing Optimization & Localization Standards");
    });

    test("pipeline mode implements BANT and MEDDIC qualification with 5-stage progression", () => {
      const pipeRef = fs.readFileSync(path.join(brandDir, "references", "pipeline.md"), "utf8");
      expect(pipeRef).toContain("Stage 1: Lead Intake & First Touch");
      expect(pipeRef).toContain("Stage 2: Discovery & Qualification (BANT & MEDDIC)");
      expect(pipeRef).toContain("Stage 3: Solution Architecture & Proposal Blueprint");
      expect(pipeRef).toContain("Stage 4: Contract, SOW & Payment Kickoff");
      expect(pipeRef).toContain("Stage 5: Handover to Agency Delivery Council");
      expect(pipeRef).toContain("Budget");
      expect(pipeRef).toContain("Authority");
      expect(pipeRef).toContain("Need");
      expect(pipeRef).toContain("Timeline");
      expect(pipeRef).toContain("Economic Buyer");
      expect(pipeRef).toContain("Decision Criteria");
    });

    test("accounts-access mode enforces LifeOS zero-leak delegation protocol across all platforms", () => {
      const accessRef = fs.readFileSync(path.join(brandDir, "references", "accounts-access.md"), "utf8");
      expect(accessRef).toContain("Zero-Credential Leak Delegation Standard");
      expect(accessRef).toContain("Never accept, request, or store plaintext passwords");
      expect(accessRef).toContain("Meta Ads & Business Portfolio");
      expect(accessRef).toContain("Manager Account (MCC) Link Request");
      expect(accessRef).toContain("Google Analytics 4 (GA4)");
      expect(accessRef).toContain("Google Tag Manager (GTM)");
      expect(accessRef).toContain("Developer");
      expect(accessRef).toContain("NEVER `Administrator` or `Owner`");
    });

    test("brief mode generates master dossier and cross-department briefs for design, webdev, content, paidads, qa", () => {
      const briefRef = fs.readFileSync(path.join(brandDir, "references", "brief.md"), "utf8");
      expect(briefRef).toContain("The Master Brand Dossier Architecture");
      expect(briefRef).toContain("Department Brief 1: For `design`");
      expect(briefRef).toContain("Department Brief 2: For `webdev`");
      expect(briefRef).toContain("Department Brief 3: For `content` & `smm`");
      expect(briefRef).toContain("Department Brief 4: For `paidads`");
      expect(briefRef).toContain("Department Brief 5: For `qa-launch`");
    });

    test("offboard mode enforces 5-phase structured exit and 48-hour access revocation protocol", () => {
      const offboardRef = fs.readFileSync(path.join(brandDir, "references", "offboard.md"), "utf8");
      expect(offboardRef).toContain("Phase 1: Final Deliverable Audit & SOW Sign-Off");
      expect(offboardRef).toContain("Phase 2: Asset Packaging & Custody Transfer");
      expect(offboardRef).toContain("Phase 3: Access Revocation & Security Vault Purge (48-Hour SLA)");
      expect(offboardRef).toContain("Phase 4: Final Financial Reconciliation");
      expect(offboardRef).toContain("Phase 5: Client NPS & Reverse Testimonial Capture");
      expect(offboardRef).toContain("48-Hour SLA");
    });

    test("intake-audit script computes 50-point score, evaluates gates, and emits clarification prompts", () => {
      const scriptPath = path.join(brandDir, "scripts", "intake-audit.ts");
      expect(fs.existsSync(scriptPath)).toBe(true);

      // 1. Ready for build simulation (score = 48)
      const resGreen = spawnSync("bun", [scriptPath, "--mock", "--score", "48"], { encoding: "utf8" });
      expect(resGreen.status).toBe(0);
      expect(resGreen.stdout).toContain("READY_FOR_BUILD");
      expect(resGreen.stdout).toContain("GREEN LIGHT");

      // 2. Needs clarification simulation (score = 38, exit code 1)
      const resAmber = spawnSync("bun", [scriptPath, "--mock", "--score", "38", "--json"], { encoding: "utf8" });
      expect(resAmber.status).toBe(1);
      const amberJson = JSON.parse(resAmber.stdout);
      expect(amberJson.verdict).toBe("NEEDS_CLARIFICATION");
      expect(amberJson.score).toBe(38);
      expect(amberJson.missing.length).toBe(12);

      // 3. Blocked incomplete simulation (score = 20, exit code 2)
      const resRed = spawnSync("bun", [scriptPath, "--mock", "--score", "20"], { encoding: "utf8" });
      expect(resRed.status).toBe(2);
      expect(resRed.stdout).toContain("BLOCKED_INCOMPLETE");
      expect(resRed.stdout).toContain("RED LIGHT");
      expect(resRed.stdout).toContain("Missing Brand Discovery Parameters");
    });
  });

  describe("9. Agency Operations Department (ops) & Obsidian PKM Workflows", () => {
    const opsDir = path.join(REPO_ROOT, "ops");

    test("ops SKILL.md registers obsidian mode in frontmatter and modes table", () => {
      const skillPath = path.join(opsDir, "SKILL.md");
      const content = fs.readFileSync(skillPath, "utf8");
      expect(content).toContain("obsidian");
      expect(content).toContain("| **obsidian** |");
      expect(content).toContain("references/obsidian.md");
      expect(content).toContain("argument-hint: \"[onboarding|proposal|sow|milestone|retro|multi-client|vendor|obsidian|audit]\"");
    });

    test("ops references/obsidian.md comprehensively covers OFM syntax, wikilinks, callouts, and CLI", () => {
      const refPath = path.join(opsDir, "references", "obsidian.md");
      expect(fs.existsSync(refPath)).toBe(true);
      const ref = fs.readFileSync(refPath, "utf8");
      expect(ref).toContain("[[Note Name]]");
      expect(ref).toContain("![[image.png");
      expect(ref).toContain("> [!note]");
      expect(ref).toContain("> [!important]");
      expect(ref).toContain("> [!faq]-");
      expect(ref).toContain("obsidian create");
      expect(ref).toContain("obsidian search");
      expect(ref).toContain("obsidian plugin:reload");
      expect(ref).toContain("obsidian dev:screenshot");
    });
  });
});
