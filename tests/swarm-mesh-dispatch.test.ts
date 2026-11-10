import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  dispatchSwarmPlan,
  dispatchSwarmPlanOnMesh,
  type SwarmPlan,
} from "../skills/context-orchestration/coupling-router/scripts/swarm-dispatcher";
import { type MeshLedger, meshStatus } from "../skills/context-orchestration/coupling-router/scripts/swarm-mesh";

const REPO_ROOT = join(import.meta.dir, "..");
const DISPATCHER = join(REPO_ROOT, "skills/context-orchestration/coupling-router/scripts/swarm-dispatcher.ts");

type Ledger = {
  completedTasks: number;
  failedTasks: number;
  skippedTasks: number;
  results: Array<{ taskId: string; status: string; reason?: string }>;
};

function withDir(fn: (dir: string) => void | Promise<void>) {
  const dir = mkdtempSync(join(tmpdir(), "mesh-dispatch-"));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const plan: SwarmPlan = {
  planId: "mesh-dispatch-test",
  tasks: [
    { id: "a", name: "Task A" },
    { id: "b", name: "Task B" },
    { id: "c", name: "Task C" },
    { id: "d", name: "Task D" },
    { id: "e", name: "Task E" },
    { id: "f", name: "Task F" },
  ],
};

describe("mesh-backed swarm dispatch", () => {
  test("a single dispatcher executes every task and reconciles clean", () =>
    withDir((dir) => {
      const { ledger, mesh } = dispatchSwarmPlanOnMesh(plan, { stateDir: dir, nodeId: "node-1" });
      expect(ledger.completedTasks).toBe(6);
      expect(ledger.failedTasks).toBe(0);
      expect(mesh.completed).toBe(6);
      expect(mesh.anomalies).toEqual([]);
      expect(Object.keys(mesh.byNode)).toEqual(["node-1"]);
    }));

  test("the token ceiling and quorum still apply when ownership comes from the mesh", () =>
    withDir((dir) => {
      const gated: SwarmPlan = {
        planId: "mesh-gates",
        maxTokenCeiling: 8_000,
        tasks: [
          { id: "seam", name: "Critical seam", criticalSeam: true, estimatedTokens: 5_000 },
          { id: "big", name: "Oversized task", estimatedTokens: 9_000 },
          { id: "after-big", name: "Dependent", dependsOn: ["big"], estimatedTokens: 1_000 },
        ],
      };
      const { ledger, mesh } = dispatchSwarmPlanOnMesh(
        gated,
        {
          stateDir: dir,
          nodeId: "node-1",
        },
        [],
        ["seam"],
      );

      const seam = ledger.results.find((result) => result.taskId === "seam");
      expect(seam?.status).toBe("FAILED_CONSENSUS");
      const big = ledger.results.find((result) => result.taskId === "big");
      expect(big?.status).toBe("FAILED");
      expect(big?.reason).toContain("Token budget ceiling");
      const after = ledger.results.find((result) => result.taskId === "after-big");
      expect(after?.status).toBe("SKIPPED_UPSTREAM_FAILURE");
      // Failed tasks release their claim (retryable) instead of staying stuck;
      // a task pruned before it ever ran is reported as unclaimed, not hidden.
      expect(mesh.total).toBe(3);
      expect(mesh.completed).toBe(0);
      expect(mesh.released).toBeGreaterThanOrEqual(1);
      expect(mesh.anomalies.map((anomaly) => `${anomaly.code}:${anomaly.taskId}`)).toContain(
        "UNCLAIMED_TASK:after-big",
      );
    }));

  test(
    "a replayed plan cannot re-execute finished tasks",
    () =>
      withDir((dir) => {
        // Sequential replay is deterministic: the first dispatcher completes
        // everything, so the second can claim nothing at all.
        const first = dispatchSwarmPlanOnMesh(plan, { stateDir: dir, nodeId: "node-1" });
        const second = dispatchSwarmPlanOnMesh(plan, { stateDir: dir, nodeId: "node-2" });

        expect(first.ledger.completedTasks).toBe(6);
        expect(second.ledger.completedTasks).toBe(0);
        expect(second.ledger.skippedTasks).toBe(6);

        const mesh = second.mesh;
        expect(mesh.completed).toBe(6);
        expect(mesh.anomalies).toEqual([]);
        // Both dispatchers registered, but only the first can hold claims.
        expect(
          meshStatus(dir)
            .nodes.map((node) => node.nodeId)
            .sort(),
        ).toEqual(["node-1", "node-2"]);
        expect(Object.keys(mesh.byNode)).toEqual(["node-1"]);
      }),
    60_000,
  );

  test(
    "concurrent dispatchers never execute the same task twice",
    () =>
      withDir(async (dir) => {
        const planFile = join(dir, "..", `plan-${Date.now()}.json`);
        writeFileSync(planFile, JSON.stringify(plan), "utf8");
        const stateDir = join(dir, "mesh");

        const spawn = (node: string) =>
          Bun.spawn(["bun", DISPATCHER, "--plan", planFile, "--mesh", stateDir, "--node", node, "--json"], {
            stdout: "pipe",
            stderr: "pipe",
          });
        const [first, second] = [spawn("node-1"), spawn("node-2")];
        const [firstExit, secondExit] = await Promise.all([first.exited, second.exited]);
        const firstOut = JSON.parse(await new Response(first.stdout).text()) as { ledger: Ledger; mesh: MeshLedger };
        const secondOut = JSON.parse(await new Response(second.stdout).text()) as { ledger: Ledger; mesh: MeshLedger };
        rmSync(planFile, { force: true });

        expect(firstExit).toBe(0);
        expect(secondExit).toBe(0);

        const ran = (out: { ledger: Ledger }) =>
          out.ledger.results.filter((result) => result.status === "COMPLETED").map((result) => result.taskId);
        const firstRan = ran(firstOut);
        const secondRan = ran(secondOut);

        // Scheduling decides who wins; the invariant is disjoint, complete coverage.
        expect([...firstRan, ...secondRan].sort()).toEqual(plan.tasks.map((task) => task.id).sort());
        expect(firstRan.filter((id) => secondRan.includes(id))).toEqual([]);

        const mesh = firstOut.mesh.anomalies.length === 0 ? firstOut.mesh : secondOut.mesh;
        expect(mesh.completed).toBe(6);
        expect(mesh.anomalies).toEqual([]);
      }),
    60_000,
  );

  test("dispatchSwarmPlan stays hook-free for in-process callers", () => {
    const ledger = dispatchSwarmPlan(plan);
    expect(ledger.completedTasks).toBe(6);
    expect(ledger.results.every((result) => result.status === "COMPLETED")).toBe(true);
  });
});
