import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getSkillModeCommands, getSkills } from "../scripts/export-commands";
import {
  calculateCost,
  generateClientComputeReport,
  recordTokenUsage,
} from "../skills/agency-delivery/accounts/scripts/token-ledger";
import {
  dispatchSwarmPlan,
  partitionDagIntoWaves,
  type SwarmPlan,
  type SwarmTask,
} from "../skills/context-orchestration/coupling-router/scripts/swarm-dispatcher";

const REPO_ROOT = path.resolve(__dirname, "..");
const FIXTURES = path.join(__dirname, "fixtures", "agency-simulation");
const WORKTREE_LEASE = path.join(REPO_ROOT, "skills/context-orchestration/coupling-router/scripts/worktree-lease.ts");

interface ScenarioTask extends SwarmTask {
  skill: string;
  mode: string;
}

interface Scenario extends SwarmPlan {
  scenarioId: string;
  client: string;
  profile: string;
  billing: { model: string; inputTokens: number; outputTokens: number };
  tasks: ScenarioTask[];
}

const FIXTURE_FILES = ["ecommerce.json", "b2b-saas.json", "productized-agency.json"];
const scenarios: Scenario[] = FIXTURE_FILES.map((file) =>
  JSON.parse(fs.readFileSync(path.join(FIXTURES, file), "utf8")),
);

function withTempDir<T>(fn: (dir: string) => T): T {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "agency-sim-"));
  try {
    return fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function lease(dir: string, ...args: string[]) {
  return spawnSync("bun", [WORKTREE_LEASE, ...args], { cwd: dir, encoding: "utf8" });
}

describe("🏢 Multi-client agency simulation workflows", () => {
  const skills = getSkills();
  const commandNames = new Set(getSkillModeCommands(skills).map((entry) => `${entry.skill}-${entry.mode}`));

  describe("1. Scenario fixtures", () => {
    test("ships exactly three distinct client profiles", () => {
      expect(scenarios.map((s) => s.profile).sort()).toEqual(
        ["B2B SaaS", "E-commerce", "Turnkey productized agency"].sort(),
      );
      expect(new Set(scenarios.map((s) => s.scenarioId)).size).toBe(3);
    });

    test("every task resolves to a real skill and mode shipped in this repository", () => {
      for (const scenario of scenarios) {
        for (const task of scenario.tasks) {
          expect(skills.some((skill) => skill.name === task.skill)).toBe(true);
          expect(commandNames.has(`${task.skill}-${task.mode}`)).toBe(true);
        }
      }
    });

    test("every dependency points at a task in the same plan", () => {
      for (const scenario of scenarios) {
        const ids = new Set(scenario.tasks.map((task) => task.id));
        for (const task of scenario.tasks) {
          for (const dependency of task.dependsOn ?? []) {
            expect(ids.has(dependency)).toBe(true);
          }
        }
      }
    });

    test("each scenario crosses at least three departments and two divisions", () => {
      for (const scenario of scenarios) {
        expect(new Set(scenario.tasks.map((task) => task.skill)).size).toBeGreaterThanOrEqual(3);
        expect(new Set(scenario.tasks.map((task) => task.assignedDivision)).size).toBeGreaterThanOrEqual(2);
      }
    });

    test("the three scenarios together cover every shipped skill", () => {
      const covered = new Set(scenarios.flatMap((scenario) => scenario.tasks.map((task) => task.skill)));
      expect([...covered].sort()).toEqual(skills.map((skill) => skill.name).sort());
    });

    test("task ids are unique inside each scenario", () => {
      for (const scenario of scenarios) {
        const ids = scenario.tasks.map((task) => task.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    });
  });

  describe("2. DAG wave dispatch", () => {
    test("partitions every scenario into valid topological waves", () => {
      for (const scenario of scenarios) {
        const { waves, isValid, error } = partitionDagIntoWaves(scenario.tasks);
        expect(error).toBeUndefined();
        expect(isValid).toBe(true);
        expect(waves.length).toBeGreaterThan(1);

        const seen = new Set<string>();
        for (const wave of waves) {
          for (const taskId of wave.taskIds) {
            const task = scenario.tasks.find((t) => t.id === taskId);
            expect(task).toBeDefined();
            for (const dependency of task?.dependsOn ?? []) {
              expect(seen.has(dependency)).toBe(true);
            }
          }
          for (const taskId of wave.taskIds) seen.add(taskId);
        }
        expect(seen.size).toBe(scenario.tasks.length);
      }
    });

    test("completes every scenario inside its token ceiling", () => {
      for (const scenario of scenarios) {
        const ledger = dispatchSwarmPlan(scenario);
        expect(ledger.failedTasks).toBe(0);
        expect(ledger.skippedTasks).toBe(0);
        expect(ledger.completedTasks).toBe(scenario.tasks.length);
        expect(ledger.budgetExhausted).toBe(false);
        expect(ledger.totalTokensBurned).toBeLessThanOrEqual(ledger.tokenCeiling);
        expect(ledger.summary).toContain("succeeded");
      }
    });

    test("a rejected critical seam fails and prunes its downstream dependents", () => {
      const scenario = scenarios[0];
      const seam = scenario.tasks.find((task) => task.criticalSeam);
      expect(seam).toBeDefined();
      if (!seam) return;

      const ledger = dispatchSwarmPlan(scenario, [], [seam.id]);
      const seamResult = ledger.results.find((result) => result.taskId === seam.id);
      expect(seamResult?.status).toBe("FAILED_CONSENSUS");
      expect(seamResult?.consensusVote?.passed).toBe(false);

      const dependents = scenario.tasks.filter((task) => (task.dependsOn ?? []).includes(seam.id));
      expect(dependents.length).toBeGreaterThan(0);
      for (const dependent of dependents) {
        expect(ledger.results.find((result) => result.taskId === dependent.id)?.status).toBe(
          "SKIPPED_UPSTREAM_FAILURE",
        );
      }
    });

    test("the token arbiter halts and skips once the ceiling is exhausted", () => {
      const scenario = scenarios[1];
      const total = scenario.tasks.reduce((sum, task) => sum + (task.estimatedTokens ?? 5000), 0);
      const tight: SwarmPlan = { ...scenario, maxTokenCeiling: Math.floor(total / 2) };

      const ledger = dispatchSwarmPlan(tight);
      expect(ledger.budgetExhausted).toBe(true);
      expect(ledger.failedTasks + ledger.skippedTasks).toBeGreaterThan(0);
      expect(ledger.totalTokensBurned).toBeLessThanOrEqual(tight.maxTokenCeiling ?? 0);
    });
  });

  describe("3. Concurrent worktree leases", () => {
    test("acquire, defer, hold, release, and stale takeover", () => {
      withTempDir((dir) => {
        const first = lease(dir, "probe", "--owner", "agent-a", "--scope", "src/app");
        expect(first.status).toBe(0);
        expect(first.stdout).toContain("ACQUIRED");

        const deferred = lease(dir, "probe", "--owner", "agent-b");
        expect(deferred.status).toBe(1);
        expect(deferred.stdout).toContain("DEFER");
        expect(deferred.stdout).toContain("agent-a");

        const held = lease(dir, "hold", "--owner", "agent-a");
        expect(held.status).toBe(0);
        expect(held.stdout).toContain("heartbeat refreshed");

        const released = lease(dir, "release");
        expect(released.status).toBe(0);
        expect(fs.existsSync(path.join(dir, ".agents", "artifacts", "WORKTREE-LEASE.md"))).toBe(false);

        const acquiredAgain = lease(dir, "probe", "--owner", "agent-b");
        expect(acquiredAgain.status).toBe(0);
        expect(acquiredAgain.stdout).toContain("owner=agent-b");

        const stale = new Date(Date.now() - 60 * 60_000).toISOString().replace(/\.\d{3}Z$/, "Z");
        fs.writeFileSync(
          path.join(dir, ".agents", "artifacts", "WORKTREE-LEASE.md"),
          `# WORKTREE LEASE\nowner: agent-dead\nbranch: feat/x\nacquired: ${stale}\nheartbeat: ${stale}\nscope: src\nnotes: none\n`,
          "utf8",
        );

        const takeover = lease(dir, "probe", "--owner", "agent-c");
        expect(takeover.status).toBe(0);
        expect(takeover.stdout).toContain("TAKEOVER");
        expect(fs.readFileSync(path.join(dir, ".agents", "artifacts", "WORKTREE-LEASE.md"), "utf8")).toContain(
          "owner: agent-c",
        );
      });
    });
  });

  describe("4. Billing and telemetry receipts", () => {
    test("every scenario produces a reconcilable compute receipt with positive margin", () => {
      withTempDir((dir) => {
        const ledgerFile = path.join(dir, "token-ledger.json");

        for (const scenario of scenarios) {
          const entry = recordTokenUsage(
            ledgerFile,
            scenario.client,
            scenario.billing.model,
            scenario.billing.inputTokens,
            scenario.billing.outputTokens,
            scenario.planId,
          );
          const expected = calculateCost(
            scenario.billing.model,
            scenario.billing.inputTokens,
            scenario.billing.outputTokens,
          );
          expect(entry.costUsd).toBe(expected.costUsd);
          expect(entry.billableUsd).toBe(expected.billableUsd);
          expect(entry.billableUsd).toBeGreaterThan(entry.costUsd);
        }

        for (const scenario of scenarios) {
          const report = generateClientComputeReport(ledgerFile, scenario.client);
          expect(report.totalSessions).toBe(1);
          expect(report.totalRawCostUsd).toBeGreaterThan(0);
          expect(report.totalBillableComputeUsd).toBeGreaterThan(report.totalRawCostUsd);
          expect(report.marginProfitUsd).toBeGreaterThan(0);
        }
      });
    });
  });
});
