#!/usr/bin/env bun
/**
 * verify — every offline gate, one command, one summary.
 *
 * The repository has ~20 gates. Running them one at a time is where a
 * contributor (or an agent) loses minutes and forgets two. This runs them
 * concurrently with a cap, streams nothing until the end, and prints one table.
 *
 *   bun run verify              # offline gates
 *   bun run verify --network    # also check upstream dependencies
 *   bun run verify --skip test  # skip a slow gate by name
 *   bun run verify --json       # machine-readable summary
 */

const GATES: Array<{ name: string; cmd: string[]; network?: boolean }> = [
  { name: "lint", cmd: ["bun", "run", "lint"] },
  { name: "type-check", cmd: ["bun", "run", "type-check"] },
  { name: "test", cmd: ["bun", "test", "--parallel", "--timeout", "30000"] },
  { name: "surface", cmd: ["bun", "run", "check:surface"] },
  { name: "harness", cmd: ["bun", "run", "check:harness"] },
  { name: "install", cmd: ["bun", "run", "check:install"] },
  { name: "routing-matrix", cmd: ["bun", "run", "check:routing:matrix"] },
  { name: "routing-coverage", cmd: ["bun", "run", "check:routing:coverage"] },
  { name: "routing-docs", cmd: ["bun", "run", "check:routing:docs"] },
  { name: "routing-signals", cmd: ["bun", "run", "check:routing:signals"] },
  { name: "ledger", cmd: ["bun", "run", "check:ledger"] },
  { name: "hygiene", cmd: ["bun", "run", "check:hygiene"] },
  { name: "secret-scan", cmd: ["bun", "run", "secret-scan", "."] },
  { name: "docs-commands", cmd: ["bun", "run", "check:docs-commands"] },
  { name: "mcp", cmd: ["bun", "run", "check:mcp"] },
  { name: "deps", cmd: ["bun", "run", "check:deps"], network: true },
];

const args = process.argv.slice(2);
const includeNetwork = args.includes("--network");
const asJson = args.includes("--json");
const skipped = new Set<string>();
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === "--skip") skipped.add(args[i + 1]);
}

if (args.includes("--list")) {
  console.log(
    JSON.stringify(
      GATES.map(({ name, cmd, network }) => ({ name, cmd, network: Boolean(network) })),
      null,
      2,
    ),
  );
  process.exit(0);
}

const selected = GATES.filter((gate) => (includeNetwork || !gate.network) && !skipped.has(gate.name));
const LIMIT = 6;

async function runGate(gate: {
  name: string;
  cmd: string[];
}): Promise<{ name: string; ok: boolean; ms: number; out: string }> {
  const started = performance.now();
  const proc = Bun.spawn(gate.cmd, { stdout: "pipe", stderr: "pipe", cwd: process.cwd() });
  const [stdout, stderr] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
  const code = await proc.exited;
  return {
    name: gate.name,
    ok: code === 0,
    ms: Math.round(performance.now() - started),
    out: `${stdout}\n${stderr}`.trim(),
  };
}

async function main() {
  const results: Array<{ name: string; ok: boolean; ms: number; out: string }> = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(LIMIT, selected.length) }, async () => {
    while (cursor < selected.length) {
      const gate = selected[cursor];
      cursor += 1;
      results.push(await runGate(gate));
    }
  });
  await Promise.all(workers);
  results.sort((a, b) => b.ms - a.ms);

  if (asJson) {
    console.log(
      JSON.stringify(
        { passed: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, results },
        null,
        2,
      ),
    );
  } else {
    const width = Math.max(...results.map((r) => r.name.length));
    for (const result of results) {
      const mark = result.ok ? "✅" : "❌";
      console.log(`${mark} ${result.name.padEnd(width)} ${String(result.ms).padStart(6)}ms`);
    }
    const failed = results.filter((r) => !r.ok);
    console.log(
      `\n${results.length - failed.length}/${results.length} gates passed${failed.length ? "" : " — ready to push"}.`,
    );
    if (failed.length > 0) {
      for (const result of failed) {
        console.log(`\n──── ${result.name} ────`);
        console.log(result.out.split("\n").slice(-25).join("\n"));
      }
    }
  }

  process.exit(results.every((r) => r.ok) ? 0 : 1);
}

main();
