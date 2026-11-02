import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const NEW_PROJECT = join(REPO_ROOT, "skills/core-engine/new-project/scripts/new-project.ts");
const INTAKE_REF = join(REPO_ROOT, "skills/core-engine/new-project/references/client-onboarding.md");
const SANDBOX = join(tmpdir(), `client-onboarding-test-${Date.now()}`);

function run(args: string[]) {
  return spawnSync("bun", [NEW_PROJECT, ...args], { encoding: "utf8" });
}

const INTAKE_DOCS = [
  "Client-Intake/01-Brand/brand-identity.md",
  "Client-Intake/01-Brand/visual-direction.md",
  "Client-Intake/01-Brand/voice-and-tone.md",
  "Client-Intake/02-Business/business-model.md",
  "Client-Intake/02-Business/audience-persona.md",
  "Client-Intake/03-Offerings/offerings-catalog.md",
  "Client-Intake/03-Offerings/scope-deliverables.md",
  "Client-Intake/04-Technical-Intake/access-and-credentials.md",
  "Client-Intake/04-Technical-Intake/integrations-matrix.md",
];

describe("new-project client onboarding", () => {
  beforeEach(() => {
    rmSync(SANDBOX, { recursive: true, force: true });
    mkdirSync(SANDBOX, { recursive: true });
  });

  afterEach(() => {
    rmSync(SANDBOX, { recursive: true, force: true });
  });

  it("renders every intake doc and a client-aware start-here from flags", () => {
    const target = join(SANDBOX, "acme-health");
    const res = run([
      target,
      "--agent-name",
      "Test Agent",
      "--non-interactive",
      "--name=Acme Health",
      "--intent=app",
      "--type=astro",
      "--client-name=Acme Health LLC",
      "--client-brand=Acme Health",
      "--client-contact=Dana Lee",
      "--client-role=COO",
      "--client-email=dana@acme.health",
      "--business-model=b2b-saas",
      "--company-stage=seed",
      "--revenue-band=1m-10m",
      "--industry=Healthcare",
      "--audience=Regional clinics",
      "--problem=Manual paper intake",
      "--offerings=Intake Suite, EHR Sync",
      "--competitors=Epic, Cerner",
      "--objections=Price, Migration effort",
      "--launch-goal=50 clinics onboarded",
      "--boundaries=Native mobile app, Multi-language",
      "--domain=acme.health",
      "--dns-provider=cloudflare",
      "--git-host=github",
      "--payments=stripe",
      "--integrations=hubspot,segment",
      "--engagement=fixed-scope",
      "--sla-tier=priority",
      "--comms-channel=slack",
      "--comms-cadence=weekly",
      "--kickoff-date=2026-11-10",
      "--deadline=2027-02-01",
      "--budget=USD 40k",
      "--access-items=DNS, GitHub org, Stripe account",
      "--palette=indigo",
    ]);

    expect(res.status, res.stderr).toBe(0);
    expect(res.stdout).toContain("client onboarding artifacts");

    for (const doc of INTAKE_DOCS) {
      expect(existsSync(join(target, doc)), doc).toBe(true);
    }

    const brief = readFileSync(join(target, "Client-Intake/00-Intake-Brief.md"), "utf8");
    expect(brief).toContain("**Organization**: Acme Health LLC");
    expect(brief).toContain("**Business Model**: B2B SaaS");
    expect(brief).toContain("**Launch Goal**: 50 clinics onboarded");
    expect(brief).toContain("**Competitors**: Epic, Cerner");
    expect(brief).toContain("Access Required From Client");

    const startHere = readFileSync(join(target, "start-here.md"), "utf8");
    expect(startHere).toContain("Acme Health LLC");
    expect(startHere).toContain("Regional clinics");
    expect(startHere).toContain("50 clinics onboarded");
    expect(startHere).toContain("framework `astro`");

    const product = readFileSync(join(target, ".agents/context/product.md"), "utf8");
    expect(product).toContain("Regional clinics");

    const brandIdentity = readFileSync(join(target, "Client-Intake/01-Brand/brand-identity.md"), "utf8");
    expect(brandIdentity).toContain("Dana Lee");
    expect(brandIdentity).toContain("Regional clinics");
    expect(brandIdentity).not.toContain("{{");
  }, 30_000);

  it("prefills from a JSON intake file and lets flags override it", () => {
    const target = join(SANDBOX, "northwind");
    const intakePath = join(SANDBOX, "northwind.json");
    writeFileSync(
      intakePath,
      JSON.stringify({
        clientName: "Northwind Studio",
        brandName: "Northwind",
        contactName: "Rae Kim",
        contactEmail: "rae@northwind.studio",
        businessModel: "agency-service",
        companyStage: "bootstrapped",
        industry: "Design & Creative",
        icp: "Independent DTC brands",
        coreProblem: "Fragmented brand systems",
        competitors: ["Studio A", "Studio B"],
        offerings: ["Brand Sprint", "Website System"],
        launchGoal: "Launch 3 client sites",
        boundaries: ["Paid ads", "Video production"],
        domain: "northwind.studio",
        payments: ["stripe"],
        integrations: ["notion", "slack"],
        engagement: "retainer",
        slaTier: "standard",
        budget: "USD 8k/mo",
        commsChannel: "slack",
        commsCadence: "biweekly",
      }),
      "utf8",
    );

    const res = run([
      target,
      "--agent-name",
      "Test Agent",
      "--non-interactive",
      "--name=Northwind",
      "--intent=app",
      "--type=astro",
      `--intake=${intakePath}`,
      "--client-brand=Northwind Creative",
    ]);

    expect(res.status, res.stderr).toBe(0);
    const brief = readFileSync(join(target, "Client-Intake/00-Intake-Brief.md"), "utf8");
    expect(brief).toContain("**Organization**: Northwind Studio");
    expect(brief).toContain("**Brand / Trade Name**: Northwind Creative");
    expect(brief).toContain("**Business Model**: Agency / Professional Service");
    expect(brief).toContain("**Primary Domain**: northwind.studio");
    expect(brief).toContain("**Engagement Type**: retainer");

    const persona = readFileSync(join(target, "Client-Intake/02-Business/audience-persona.md"), "utf8");
    expect(persona).toContain("Independent DTC brands");
    expect(persona).not.toContain("{{");

    const business = readFileSync(join(target, "Client-Intake/02-Business/business-model.md"), "utf8");
    expect(business).toContain("- Studio A");
    expect(business).toContain("| Engagement Type | retainer |");
  }, 30_000);

  it("keeps legacy brief-only behavior when no onboarding signal is passed", () => {
    const target = join(SANDBOX, "legacy");
    const res = run([
      target,
      "--agent-name",
      "Test Agent",
      "--non-interactive",
      "--name=Legacy Site",
      "--intent=content",
      "--type=astro",
    ]);

    expect(res.status, res.stderr).toBe(0);
    expect(existsSync(join(target, "Client-Intake/00-Intake-Brief.md"))).toBe(true);
    expect(existsSync(join(target, "start-here.md"))).toBe(false);
    expect(existsSync(join(target, "Client-Intake/01-Brand/brand-identity.md"))).toBe(false);
  }, 30_000);

  it("honors --skip-client-onboarding even when client flags are present", () => {
    const target = join(SANDBOX, "skipped");
    const res = run([
      target,
      "--agent-name",
      "Test Agent",
      "--non-interactive",
      "--name=Skipped",
      "--intent=content",
      "--type=astro",
      "--client-name=Skip Co",
      "--skip-client-onboarding",
    ]);

    expect(res.status, res.stderr).toBe(0);
    expect(existsSync(join(target, "Client-Intake/00-Intake-Brief.md"))).toBe(true);
    expect(existsSync(join(target, "start-here.md"))).toBe(false);
    expect(existsSync(join(target, "Client-Intake/01-Brand/brand-identity.md"))).toBe(false);
  }, 30_000);

  it("documents the onboarding flags and the reference schema", () => {
    const help = run(["--help"]);
    expect(help.status).toBe(0);
    expect(help.stdout).toContain("--onboard-client");
    expect(help.stdout).toContain("--skip-client-onboarding");
    expect(help.stdout).toContain("--intake <path>");

    expect(existsSync(INTAKE_REF)).toBe(true);
    const ref = readFileSync(INTAKE_REF, "utf8");
    expect(ref).toContain("Five-Section Interview Order");
    expect(ref).toContain("JSON Intake Shape");
    expect(ref).toContain("Output Map");
  });
});
