import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");
const SKILL_DIR = join(REPO_ROOT, "skills/context-orchestration/coupling-router");
const MESH = join(SKILL_DIR, "scripts/swarm-mesh.ts");

type TaskClaim = {
  taskId: string;
  nodeId: string;
  attempt: number;
  status: "CLAIMED" | "DONE" | "RELEASED";
  heartbeat: string;
  planHash: string;
  history: Array<{ nodeId: string; reason: string; attempt: number }>;
};

function withMeshDir(fn: (dir: string) => void | Promise<void>) {
  const dir = mkdtempSync(join(tmpdir(), "swarm-mesh-test-"));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function writePlan(
  dir: string,
  tasks: Array<{ id: string; name: string; dependsOn?: string[] }>,
  planId = "mesh-test",
) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "plan.json"), JSON.stringify({ planId, tasks }, null, 2));
}

function mesh(_stateDir: string, ...args: string[]) {
  return spawnSync("bun", [MESH, ...args], { encoding: "utf8", cwd: REPO_ROOT });
}

function readClaim(dir: string, taskId: string): TaskClaim {
  return JSON.parse(readFileSync(join(dir, "claims", `${taskId}.json`), "utf8")) as TaskClaim;
}

function backdateHeartbeat(dir: string, taskId: string, ageSeconds: number) {
  const file = join(dir, "claims", `${taskId}.json`);
  const claim = JSON.parse(readFileSync(file, "utf8")) as TaskClaim;
  claim.heartbeat = new Date(Date.now() - ageSeconds * 1000).toISOString();
  writeFileSync(file, JSON.stringify(claim, null, 2));
}

describe("swarm mesh — atomic claim and duplicate suppression", () => {
  test("exclusive claim: a second node is refused the same task", () =>
    withMeshDir((dir) => {
      writePlan(dir, [
        { id: "schema", name: "Lock the schema" },
        { id: "api", name: "Build the API" },
      ]);

      expect(mesh(dir, "claim", "--state", dir, "--node", "agent-a").status).toBe(0);
      expect(readClaim(dir, "schema").nodeId).toBe("agent-a");
      expect(readClaim(dir, "schema").attempt).toBe(1);

      // agent-b asking for the held task explicitly cannot get it.
      const refused = mesh(dir, "claim", "--state", dir, "--node", "agent-b", "--task", "schema", "--json");
      expect(refused.status).toBe(1);
      expect(JSON.parse(refused.stdout).verdict).toBe("NO_TASK");
      expect(readClaim(dir, "schema").nodeId).toBe("agent-a");

      // ...but it can take the next unclaimed task.
      const next = mesh(dir, "claim", "--state", dir, "--node", "agent-b", "--json");
      expect(next.status).toBe(0);
      expect(JSON.parse(next.stdout)).toMatchObject({ verdict: "CLAIMED", taskId: "api", nodeId: "agent-b" });
    }));

  test("re-claiming as the holder is idempotent (ALREADY_HELD, no new attempt)", () =>
    withMeshDir((dir) => {
      writePlan(dir, [{ id: "schema", name: "Lock the schema" }]);
      mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--task", "schema");
      const again = mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--task", "schema", "--json");
      expect(again.status).toBe(0);
      expect(JSON.parse(again.stdout).verdict).toBe("ALREADY_HELD");
      const claim = readClaim(dir, "schema");
      expect(claim.attempt).toBe(1);
      expect(claim.history).toHaveLength(1);
    }));

  test("a fresh claim is never stolen", () =>
    withMeshDir((dir) => {
      writePlan(dir, [{ id: "schema", name: "Lock the schema" }]);
      mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--task", "schema", "--ttl", "120");
      expect(mesh(dir, "claim", "--state", dir, "--node", "agent-b", "--task", "schema", "--ttl", "120").status).toBe(
        1,
      );
      expect(readClaim(dir, "schema").nodeId).toBe("agent-a");
      expect(readClaim(dir, "schema").attempt).toBe(1);
    }));

  test("DONE is terminal while RELEASED is claimable again", () =>
    withMeshDir((dir) => {
      writePlan(dir, [
        { id: "done-task", name: "Finished work" },
        { id: "released-task", name: "Abandoned work" },
      ]);
      mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--task", "done-task");
      mesh(dir, "complete", "--state", dir, "--node", "agent-a", "--task", "done-task");

      const doneRefused = mesh(dir, "claim", "--state", dir, "--node", "agent-b", "--task", "done-task", "--json");
      expect(doneRefused.status).toBe(1);
      expect(readClaim(dir, "done-task").status).toBe("DONE");

      mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--task", "released-task");
      mesh(dir, "release", "--state", dir, "--node", "agent-a", "--task", "released-task");

      const reclaimed = mesh(dir, "claim", "--state", dir, "--node", "agent-b", "--task", "released-task", "--json");
      expect(reclaimed.status).toBe(0);
      const payload = JSON.parse(reclaimed.stdout);
      expect(payload.verdict).toBe("RECLAIMED");
      expect(payload.attempt).toBe(2);
      const claim = readClaim(dir, "released-task");
      expect(claim.nodeId).toBe("agent-b");
      expect(claim.history.map((entry) => entry.reason)).toEqual(["CLAIM", "RECLAIM"]);
    }));
});

describe("swarm mesh — heartbeat and stale failover", () => {
  test("a stale heartbeat permits takeover and fences the attempt", () =>
    withMeshDir((dir) => {
      writePlan(dir, [{ id: "schema", name: "Lock the schema" }]);
      mesh(dir, "claim", "--state", dir, "--node", "agent-dead", "--task", "schema", "--ttl", "30");
      backdateHeartbeat(dir, "schema", 600);

      const takeover = mesh(
        dir,
        "claim",
        "--state",
        dir,
        "--node",
        "agent-live",
        "--task",
        "schema",
        "--ttl",
        "30",
        "--json",
      );
      expect(takeover.status).toBe(0);
      const payload = JSON.parse(takeover.stdout);
      expect(payload.verdict).toBe("STALE_TAKEOVER");
      expect(payload.attempt).toBe(2);

      const claim = readClaim(dir, "schema");
      expect(claim.nodeId).toBe("agent-live");
      expect(claim.history.map((entry) => entry.reason)).toEqual(["CLAIM", "TAKEOVER"]);

      // The fenced node can no longer complete the work it lost.
      const fenced = mesh(dir, "complete", "--state", dir, "--node", "agent-dead", "--task", "schema");
      expect(fenced.status).toBe(1);
      expect(fenced.stderr).toContain("held by agent-live");
    }));

  test("heartbeat refresh clears staleness without changing the holder", () =>
    withMeshDir((dir) => {
      writePlan(dir, [{ id: "schema", name: "Lock the schema" }]);
      mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--task", "schema", "--ttl", "30");
      backdateHeartbeat(dir, "schema", 120);

      const beat = mesh(dir, "beat", "--state", dir, "--node", "agent-a", "--task", "schema", "--json");
      expect(beat.status).toBe(0);
      const claim = JSON.parse(beat.stdout) as TaskClaim;
      expect(Date.parse(claim.heartbeat)).toBeGreaterThan(Date.now() - 5_000);

      const contested = mesh(dir, "claim", "--state", dir, "--node", "agent-b", "--task", "schema", "--ttl", "30");
      expect(contested.status).toBe(1);
      expect(readClaim(dir, "schema").nodeId).toBe("agent-a");
    }));

  test("a non-holder cannot heartbeat or complete another node's task", () =>
    withMeshDir((dir) => {
      writePlan(dir, [{ id: "schema", name: "Lock the schema" }]);
      mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--task", "schema");
      expect(mesh(dir, "beat", "--state", dir, "--node", "agent-b", "--task", "schema").status).toBe(1);
      expect(mesh(dir, "complete", "--state", dir, "--node", "agent-b", "--task", "schema").status).toBe(1);
      expect(readClaim(dir, "schema").status).toBe("CLAIMED");
    }));
});

describe("swarm mesh — ledger reconciliation", () => {
  test("reports unclaimed, stale, orphan, unknown-node, and plan-drift anomalies", () =>
    withMeshDir((dir) => {
      writePlan(dir, [
        { id: "claimed-task", name: "In flight" },
        { id: "stale-task", name: "Owner died" },
        { id: "unclaimed-task", name: "Never started" },
      ]);
      mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--task", "claimed-task", "--ttl", "30");
      mesh(dir, "claim", "--state", dir, "--node", "agent-dead", "--task", "stale-task", "--ttl", "30");
      backdateHeartbeat(dir, "stale-task", 600);

      // The claiming node vanished without a node record left behind.
      rmSync(join(dir, "nodes", "agent-a.json"), { force: true });

      // Orphan claim for a task the plan does not contain.
      writeFileSync(
        join(dir, "claims", "ghost.json"),
        JSON.stringify({
          taskId: "ghost",
          planId: "mesh-test",
          planHash: "deadbeef",
          nodeId: "agent-ghost",
          attempt: 1,
          status: "CLAIMED",
          claimedAt: new Date().toISOString(),
          heartbeat: new Date().toISOString(),
          history: [],
        }),
      );

      // Plan drift: a claim stamped against a different plan.
      const drifted = readClaim(dir, "claimed-task");
      drifted.planHash = "0".repeat(64);
      writeFileSync(join(dir, "claims", "claimed-task.json"), JSON.stringify(drifted, null, 2));

      const res = mesh(dir, "reconcile", "--state", dir, "--ttl", "30", "--json");
      expect(res.status).toBe(1);
      const ledger = JSON.parse(res.stdout);
      const codes = ledger.anomalies.map((anomaly: { code: string }) => anomaly.code).sort();
      expect(codes).toEqual(["ORPHAN_CLAIM", "PLAN_DRIFT", "STALE_CLAIM", "UNCLAIMED_TASK", "UNKNOWN_NODE"]);
      expect(ledger.total).toBe(3);
      expect(ledger.unclaimed).toBe(1);
      expect(ledger.stale).toBe(1);
    }));

  test("is clean once every task is done by a registered node", () =>
    withMeshDir((dir) => {
      writePlan(dir, [
        { id: "one", name: "First" },
        { id: "two", name: "Second" },
      ]);
      for (const task of ["one", "two"]) {
        mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--task", task);
        mesh(dir, "complete", "--state", dir, "--node", "agent-a", "--task", task);
      }
      const res = mesh(dir, "reconcile", "--state", dir, "--json");
      expect(res.status).toBe(0);
      const ledger = JSON.parse(res.stdout);
      expect(ledger).toMatchObject({ total: 2, completed: 2, unclaimed: 0, stale: 0 });
      expect(ledger.anomalies).toEqual([]);
      expect(ledger.byNode["agent-a"]).toEqual({ claimed: 2, completed: 2 });
      // The ledger is persisted for downstream consumers.
      expect(existsSync(join(dir, "ledger.json"))).toBe(true);
    }));

  test("rejects a plan with duplicate ids or unknown dependencies", () =>
    withMeshDir((dir) => {
      writePlan(dir, [
        { id: "dup", name: "One" },
        { id: "dup", name: "Two" },
        { id: "child", name: "Depends on nothing real", dependsOn: ["missing"] },
      ]);
      const res = mesh(dir, "claim", "--state", dir, "--node", "agent-a");
      expect(res.status).toBe(1);
      expect(res.stderr).toContain("duplicate task id");
      expect(res.stderr).toContain('depends on unknown task "missing"');
    }));
});

describe("swarm mesh — local multi-process simulation", () => {
  test(
    "three workers claim disjoint tasks and reconcile clean",
    () =>
      withMeshDir((dir) => {
        const tasks = Array.from({ length: 6 }, (_, index) => ({ id: `task-${index + 1}`, name: `Task ${index + 1}` }));
        writePlan(dir, tasks);
        const res = mesh(dir, "simulate", "--state", dir, "--workers", "3", "--json");
        expect(res.status).toBe(0);
        const payload = JSON.parse(res.stdout);
        expect(payload.exitCodes).toEqual([0, 0, 0]);
        expect(payload.ledger.completed).toBe(6);
        expect(payload.ledger.anomalies).toEqual([]);

        // Every task ended DONE with exactly one ownership history entry.
        for (const task of tasks) {
          const claim = readClaim(dir, task.id);
          expect(claim.status).toBe("DONE");
          expect(claim.history).toHaveLength(1);
        }

        // No task was completed by two workers, and all three processes joined.
        const worked = Object.values(payload.worked as Record<string, string[]>).flat();
        expect(worked.sort()).toEqual(tasks.map((task) => task.id).sort());
        expect(new Set(worked).size).toBe(tasks.length);

        const status = JSON.parse(mesh(dir, "status", "--state", dir, "--json").stdout);
        expect(status.nodes).toHaveLength(3);
      }),
    60_000,
  );

  test("rejects an out-of-range worker count", () =>
    withMeshDir((dir) => {
      writePlan(dir, [{ id: "one", name: "First" }]);
      expect(mesh(dir, "simulate", "--state", dir, "--workers", "0").status).toBe(1);
      expect(mesh(dir, "simulate", "--state", dir, "--workers", "999").status).toBe(1);
    }));
});

describe("swarm mesh — CLI contract", () => {
  test("usage errors exit 2", () =>
    withMeshDir((dir) => {
      expect(mesh(dir, "claim", "--state", dir).status).toBe(2);
      writePlan(dir, [{ id: "one", name: "First" }]);
      expect(mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--ttl", "0").status).toBe(2);
    }));

  test("identifiers cannot escape the state directory", () =>
    withMeshDir((dir) => {
      writePlan(dir, [{ id: "one", name: "First" }]);
      const traversal = mesh(dir, "claim", "--state", dir, "--node", "../../etc");
      expect(traversal.status).toBe(1);
      expect(traversal.stderr).toContain("not a safe identifier");
      expect(existsSync(join(dir, "..", "etc.json"))).toBe(false);
      expect(existsSync(join(dir, "etc.json"))).toBe(false);
      // Rejected before any state is created.
      expect(existsSync(join(dir, "claims"))).toBe(false);
      expect(existsSync(join(dir, "nodes"))).toBe(false);
    }));

  test("status lists nodes and claims without mutating them", () =>
    withMeshDir((dir) => {
      writePlan(dir, [{ id: "one", name: "First" }]);
      mesh(dir, "claim", "--state", dir, "--node", "agent-a", "--task", "one");
      const res = mesh(dir, "status", "--state", dir, "--json");
      expect(res.status).toBe(0);
      const status = JSON.parse(res.stdout);
      expect(status.tasks).toBe(1);
      expect(status.nodes.map((node: { nodeId: string }) => node.nodeId)).toEqual(["agent-a"]);
      expect(status.claims[0]).toMatchObject({ taskId: "one", nodeId: "agent-a", status: "CLAIMED", stale: false });
    }));
});
