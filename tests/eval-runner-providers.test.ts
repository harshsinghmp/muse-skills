import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  type ChatMessage,
  EvalTelemetry,
  type ProviderConfig,
  resolveProviderConfig,
} from "../skills/agency-delivery/qa-launch/scripts/eval-provider";
import {
  buildJudgeMessages,
  type EvaluationSample,
  evaluateDualModelConsensus,
  evaluateDualModelWithProviders,
  parseJudgeScores,
} from "../skills/agency-delivery/qa-launch/scripts/eval-runner";

const REPO_ROOT = path.resolve(__dirname, "..");
const EVAL_RUNNER = path.join(REPO_ROOT, "skills/agency-delivery/qa-launch/scripts/eval-runner.ts");

interface JudgePayload {
  model: string;
  messages: ChatMessage[];
}

const JUDGE_SCORES: Record<string, Record<string, unknown>> = {
  "pass-a": { accuracy: 9, instructionFollowing: 9, safetyCompliance: 10, conciseness: 9, reasoning: "structure pass" },
  "pass-b": {
    accuracy: 8.6,
    instructionFollowing: 8.6,
    safetyCompliance: 9,
    conciseness: 8.6,
    reasoning: "adversarial pass",
  },
  "dispute-a": { accuracy: 9.5, instructionFollowing: 9.5, safetyCompliance: 10, conciseness: 9.5, reasoning: "high" },
  "dispute-b": { accuracy: 7, instructionFollowing: 7, safetyCompliance: 9, conciseness: 7, reasoning: "low" },
  "unsafe-a": { accuracy: 9, instructionFollowing: 9, safetyCompliance: 2, conciseness: 9, reasoning: "unsafe" },
  "unsafe-b": { accuracy: 9, instructionFollowing: 9, safetyCompliance: 2, conciseness: 9, reasoning: "unsafe" },
};

const sample: EvaluationSample = {
  sampleId: "SMP-PROV",
  taskPrompt: "Output user profile in JSON format",
  agentOutput: '{"userId":"USR-123","role":"admin"}',
  expectedGroundTruth: "USR-123",
};

let server: ReturnType<typeof Bun.serve>;

beforeAll(() => {
  server = Bun.serve({
    port: 0,
    async fetch(request) {
      if (new URL(request.url).pathname !== "/v1/chat/completions") {
        return new Response("not found", { status: 404 });
      }
      const body = (await request.json()) as JudgePayload;
      const scores = JUDGE_SCORES[body.model] ?? {
        accuracy: 8,
        instructionFollowing: 8,
        safetyCompliance: 9,
        conciseness: 8,
        reasoning: "default",
      };
      const content =
        body.model === "fenced-a" ? `\`\`\`json\n${JSON.stringify(scores)}\n\`\`\`` : JSON.stringify(scores);
      return Response.json({
        id: "mock",
        choices: [{ message: { role: "assistant", content } }],
        usage: { prompt_tokens: 40, completion_tokens: 12, total_tokens: 52 },
      });
    },
  });
});

afterAll(() => {
  server.stop(true);
});

function baseUrl(): string {
  return `http://127.0.0.1:${server.port}/v1`;
}

function judgeConfig(model: string, kind: ProviderConfig["kind"] = "ollama"): ProviderConfig {
  return resolveProviderConfig(kind, { baseUrl: baseUrl(), model, seed: 42 });
}

describe("provider-backed dual-judge path", () => {
  test("buildJudgeMessages emits role-specific instructions and the sample", () => {
    const structure = buildJudgeMessages(sample, "structure");
    const adversarial = buildJudgeMessages(sample, "adversarial");

    expect(structure[0].content).toContain("Judge A (Structure & Precision)");
    expect(adversarial[0].content).toContain("Judge B (Adversarial & Anti-Slop");
    expect(structure[1].content).toContain(sample.taskPrompt);
    expect(structure[1].content).toContain(sample.agentOutput);
    expect(structure[1].content).toContain(sample.expectedGroundTruth ?? "");
  });

  test("parseJudgeScores handles fenced JSON and clamps out-of-range values", () => {
    const fenced =
      '```json\n{"accuracy":12,"instructionFollowing":9,"safetyCompliance":10,"conciseness":8,"reasoning":"ok"}\n```';
    const parsed = parseJudgeScores(fenced);
    expect(parsed.accuracy).toBe(10);
    expect(parsed.weightedTotal).toBeGreaterThan(9);

    expect(() => parseJudgeScores("no json here")).toThrow(/no JSON object/);
    expect(() => parseJudgeScores('{"accuracy":"high"}')).toThrow(/numeric "accuracy"/);
  });

  test("PASS when both providers agree above the gate", async () => {
    const verdict = await evaluateDualModelWithProviders(sample, {
      judgeA: judgeConfig("pass-a"),
      judgeB: judgeConfig("pass-b", "openai-compatible"),
    });

    expect(verdict.verdict).toBe("PASS");
    expect(verdict.passed).toBe(true);
    expect(verdict.isConsensusValid).toBe(true);
    expect(verdict.consensusScore).toBeGreaterThanOrEqual(8.5);
    expect(verdict.judgeA.model).toBe("pass-a");
    expect(verdict.judgeB.model).toBe("pass-b");
  });

  test("DISPUTE when judge scores diverge beyond the delta fence", async () => {
    const verdict = await evaluateDualModelWithProviders(sample, {
      judgeA: judgeConfig("dispute-a"),
      judgeB: judgeConfig("dispute-b"),
    });

    expect(verdict.verdict).toBe("DISPUTE");
    expect(verdict.passed).toBe(false);
    expect(verdict.isConsensusValid).toBe(false);
    expect(verdict.scoreDelta).toBeGreaterThan(1.5);
  });

  test("FAIL when safety falls below the floor", async () => {
    const verdict = await evaluateDualModelWithProviders(sample, {
      judgeA: judgeConfig("unsafe-a"),
      judgeB: judgeConfig("unsafe-b"),
    });

    expect(verdict.verdict).toBe("FAIL");
    expect(verdict.passed).toBe(false);
    expect(verdict.judgeA.scores.safetyCompliance).toBe(2);
  });

  test("split local/cloud judges record telemetry", async () => {
    const telemetry = new EvalTelemetry();
    const verdict = await evaluateDualModelWithProviders(sample, {
      judgeA: judgeConfig("pass-a", "ollama"),
      judgeB: judgeConfig("pass-b", "openai-compatible"),
      telemetry,
    });

    expect(verdict.verdict).toBe("PASS");
    const snapshot = telemetry.snapshot();
    expect(snapshot.runs).toBe(2);
    expect(snapshot.totalTokens).toBe(104);
    expect(snapshot.costUsd).toBe(0);
  });

  test("the deterministic heuristic path is unchanged", () => {
    const verdict = evaluateDualModelConsensus(sample);
    expect(verdict.verdict).toBe("PASS");
    expect(verdict.passed).toBe(true);
  });

  test("CLI --evaluate-sample runs both judges through providers", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-provider-cli-"));
    try {
      const input = path.join(dir, "sample.json");
      fs.writeFileSync(input, JSON.stringify(sample), "utf8");

      const proc = Bun.spawn(
        [
          "bun",
          EVAL_RUNNER,
          "--evaluate-sample",
          "--input",
          input,
          "--judge-a",
          "ollama",
          "--judge-b",
          "openai-compatible",
          "--judge-a-base-url",
          baseUrl(),
          "--judge-b-base-url",
          baseUrl(),
          "--judge-a-model",
          "pass-a",
          "--judge-b-model",
          "pass-b",
          "--seed",
          "42",
          "--telemetry",
          "--json",
        ],
        { stdout: "pipe", stderr: "pipe" },
      );

      const [stdout, stderr, exitCode] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
        proc.exited,
      ]);

      expect(exitCode, stderr).toBe(0);
      const output = JSON.parse(stdout) as {
        verdict: { verdict: string; passed: boolean };
        telemetry: { runs: number; totalTokens: number };
      };
      expect(output.verdict.verdict).toBe("PASS");
      expect(output.verdict.passed).toBe(true);
      expect(output.telemetry.runs).toBe(2);
      expect(output.telemetry.totalTokens).toBe(104);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }, 30000);
});
