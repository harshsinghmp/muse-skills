import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const SCRIPT = path.join(REPO_ROOT, "skills/agency-delivery/retain/scripts/client-health-telemetry.ts");

describe("retain scorecard requires a real portfolio", () => {
  test("refuses to run without --in and does not fabricate a demo portfolio", () => {
    const res = spawnSync("bun", [SCRIPT, "--scorecard", "--json"], { encoding: "utf8" });
    expect(res.status).toBe(1);
    expect(res.stderr).toContain("requires --in");
    expect(res.stdout).not.toContain("Apex");
  });

  test("scores the supplied portfolio", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "retain-scorecard-"));
    try {
      const portfolio = path.join(dir, "portfolio.json");
      fs.writeFileSync(
        portfolio,
        JSON.stringify([
          {
            accountName: "Client One",
            monthlyRevenue: 12000,
            productTelemetry: 90,
            sentimentScore: 85,
            financialVelocity: 92,
          },
          {
            accountName: "Client Two",
            monthlyRevenue: 8000,
            productTelemetry: 60,
            sentimentScore: 55,
            financialVelocity: 65,
          },
        ]),
        "utf8",
      );

      const res = spawnSync("bun", [SCRIPT, "--scorecard", "--in", portfolio, "--json"], { encoding: "utf8" });
      expect(res.status, res.stderr).toBe(0);
      const scorecard = JSON.parse(res.stdout) as {
        totalAccounts: number;
        totalMonthlyRevenue: number;
        averageHealthScore: number;
      };
      expect(scorecard.totalAccounts).toBe(2);
      expect(scorecard.totalMonthlyRevenue).toBe(20000);
      expect(scorecard.averageHealthScore).toBeGreaterThan(0);
      expect(res.stdout).not.toContain("Apex SaaS Solutions");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
