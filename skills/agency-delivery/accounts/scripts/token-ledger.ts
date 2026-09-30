#!/usr/bin/env bun
/**
 * token-ledger.ts: Per-client AI token & compute billing attribution ledger.
 *
 * Usage:
 *   bun token-ledger.ts --record <clientId> <model> <inputTokens> <outputTokens> [task]
 *   bun token-ledger.ts --report <clientId> [--json]
 */

import fs from "node:fs";
import path from "node:path";

export interface TokenEntry {
  id: string;
  clientId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  billableUsd: number;
  task: string;
  timestamp: string;
}

export const MODEL_PRICING: Record<string, { inputPer1M: number; outputPer1M: number; markupMultiplier: number }> = {
  "claude-3-7-sonnet": { inputPer1M: 3.0, outputPer1M: 15.0, markupMultiplier: 1.2 },
  "claude-3-5-sonnet": { inputPer1M: 3.0, outputPer1M: 15.0, markupMultiplier: 1.2 },
  "claude-3-5-haiku": { inputPer1M: 0.8, outputPer1M: 4.0, markupMultiplier: 1.15 },
  "gemini-2-0-flash": { inputPer1M: 0.1, outputPer1M: 0.4, markupMultiplier: 1.15 },
  "gemini-1-5-pro": { inputPer1M: 1.25, outputPer1M: 5.0, markupMultiplier: 1.2 },
  "gpt-4o": { inputPer1M: 2.5, outputPer1M: 10.0, markupMultiplier: 1.2 },
  o1: { inputPer1M: 15.0, outputPer1M: 60.0, markupMultiplier: 1.25 },
};

export function calculateCost(model: string, inputTokens: number, outputTokens: number) {
  const norm = model.toLowerCase();
  const pricing = Object.entries(MODEL_PRICING).find(([k]) => norm.includes(k))?.[1] || {
    inputPer1M: 3.0,
    outputPer1M: 15.0,
    markupMultiplier: 1.2,
  };

  const rawCost = (inputTokens / 1_000_000) * pricing.inputPer1M + (outputTokens / 1_000_000) * pricing.outputPer1M;
  const billable = rawCost * pricing.markupMultiplier;
  return { costUsd: Number(rawCost.toFixed(4)), billableUsd: Number(billable.toFixed(4)) };
}

export function recordTokenUsage(
  ledgerFile: string,
  clientId: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
  task = "Autonomous Task Execution",
): TokenEntry {
  const { costUsd, billableUsd } = calculateCost(model, inputTokens, outputTokens);
  const entry: TokenEntry = {
    id: `tok-${Date.now().toString(36)}`,
    clientId,
    model,
    inputTokens,
    outputTokens,
    costUsd,
    billableUsd,
    task,
    timestamp: new Date().toISOString(),
  };

  let existing: TokenEntry[] = [];
  if (fs.existsSync(ledgerFile)) {
    try {
      existing = JSON.parse(fs.readFileSync(ledgerFile, "utf8"));
    } catch {
      existing = [];
    }
  }

  existing.push(entry);
  fs.mkdirSync(path.dirname(ledgerFile), { recursive: true });
  fs.writeFileSync(ledgerFile, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
  return entry;
}

export function generateClientComputeReport(ledgerFile: string, clientId: string) {
  let entries: TokenEntry[] = [];
  if (fs.existsSync(ledgerFile)) {
    try {
      const all: TokenEntry[] = JSON.parse(fs.readFileSync(ledgerFile, "utf8"));
      entries = all.filter((e) => e.clientId.toLowerCase() === clientId.toLowerCase());
    } catch {
      entries = [];
    }
  }

  const totalInput = entries.reduce((acc, e) => acc + e.inputTokens, 0);
  const totalOutput = entries.reduce((acc, e) => acc + e.outputTokens, 0);
  const totalCost = entries.reduce((acc, e) => acc + e.costUsd, 0);
  const totalBillable = entries.reduce((acc, e) => acc + e.billableUsd, 0);

  return {
    clientId,
    totalSessions: entries.length,
    totalInputTokens: totalInput,
    totalOutputTokens: totalOutput,
    totalRawCostUsd: Number(totalCost.toFixed(2)),
    totalBillableComputeUsd: Number(totalBillable.toFixed(2)),
    marginProfitUsd: Number((totalBillable - totalCost).toFixed(2)),
    entries,
  };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const defaultLedger = path.join(process.cwd(), ".agents/context/token-ledger.json");

  if (args.includes("--record")) {
    const idx = args.indexOf("--record");
    const clientId = args[idx + 1];
    const model = args[idx + 2] || "claude-3-7-sonnet";
    const input = parseInt(args[idx + 3] || "0", 10);
    const output = parseInt(args[idx + 4] || "0", 10);
    const task = args[idx + 5] || "Autonomous Feature Implementation";

    if (!clientId) {
      console.error("Error: --record requires <clientId> <model> <inputTokens> <outputTokens>");
      process.exit(1);
    }

    const entry = recordTokenUsage(defaultLedger, clientId, model, input, output, task);
    console.log(`\n💳 Recorded AI Compute for Client: ${clientId}`);
    console.log(`  Model: ${entry.model}`);
    console.log(`  Tokens: ${entry.inputTokens.toLocaleString()} in / ${entry.outputTokens.toLocaleString()} out`);
    console.log(`  Raw API Cost: $${entry.costUsd.toFixed(4)}`);
    console.log(`  Billable to Client (Cost + Margin): $${entry.billableUsd.toFixed(4)}`);
  } else if (args.includes("--report")) {
    const idx = args.indexOf("--report");
    const clientId = args[idx + 1];
    if (!clientId) {
      console.error("Error: --report requires <clientId>");
      process.exit(1);
    }
    const report = generateClientComputeReport(defaultLedger, clientId);
    if (args.includes("--json")) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`\n📊 AI Infrastructure Compute Report: ${clientId}`);
      console.log(`  Total Tasks Executed: ${report.totalSessions}`);
      console.log(`  Total Tokens: ${(report.totalInputTokens + report.totalOutputTokens).toLocaleString()}`);
      console.log(`  Raw Inference Cost: $${report.totalRawCostUsd.toFixed(2)}`);
      console.log(`  Billable to Client: $${report.totalBillableComputeUsd.toFixed(2)}`);
      console.log(`  Agency Compute Net Profit: $${report.marginProfitUsd.toFixed(2)}`);
    }
  } else {
    console.log(
      "Usage: bun token-ledger.ts --record <clientId> <model> <inTokens> <outTokens> [task] | --report <clientId>",
    );
  }
}
