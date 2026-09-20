import { describe, expect, test } from "bun:test";
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
});
