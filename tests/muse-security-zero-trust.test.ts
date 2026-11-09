import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..");
const SCRIPT = path.join(REPO_ROOT, "skills/quality-review/muse-security/scripts/zero-trust.ts");

function run(...args: string[]) {
  return spawnSync("bun", [SCRIPT, ...args], { encoding: "utf8" });
}

describe("muse-security zero-trust CLI", () => {
  test("attests a role and emits a SPIFFE SVID", () => {
    const res = run("--attest", "--role", "sol", "--ttl", "15", "--json");
    expect(res.status, res.stderr).toBe(0);
    const identity = JSON.parse(res.stdout) as {
      spiffeId: string;
      subagentRole: string;
      expiresAt: number;
      issuedAt: number;
    };
    expect(identity.spiffeId).toStartWith("spiffe://agency.muse/");
    expect(identity.subagentRole).toBe("sol");
    expect(identity.expiresAt - identity.issuedAt).toBe(15 * 60_000);
  });

  test("rejects --attest without a role and an invalid TTL", () => {
    const missingRole = run("--attest");
    expect(missingRole.status).toBe(1);
    expect(missingRole.stderr).toContain("requires --role");

    const badTtl = run("--attest", "--role", "sol", "--ttl", "0");
    expect(badTtl.status).toBe(2);
    expect(badTtl.stderr).toContain("between 1 and 60");
  });

  test("verifies mutual TLS between two attested roles", () => {
    const res = run("--verify-mtls", "--role", "sol", "--peer-role", "nexus", "--json");
    expect(res.status, res.stderr).toBe(0);
    const result = JSON.parse(res.stdout) as { verified: boolean; protocolVersion: string };
    expect(result.verified).toBe(true);
    expect(result.protocolVersion).toContain("1.3");
  });

  test("verifies the audit chain and prints help", () => {
    const audit = run("--audit-chain", "--json");
    expect(audit.status, audit.stderr).toBe(0);
    const chain = JSON.parse(audit.stdout) as { valid: boolean; totalEntries: number };
    expect(chain.valid).toBe(true);
    expect(chain.totalEntries).toBeGreaterThanOrEqual(1);

    const help = run("--help");
    expect(help.status).toBe(0);
    expect(help.stdout).toContain("zero-trust.ts");
    expect(help.stdout).toContain("--attest");
  });
});
