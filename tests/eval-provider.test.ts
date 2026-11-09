import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import {
  type ChatMessage,
  chatCompletion,
  chatWithTelemetry,
  EvalTelemetry,
  isProviderKind,
  type ProviderConfig,
  resolveProviderConfig,
} from "../skills/agency-delivery/qa-launch/scripts/eval-provider";

interface MockRequestBody {
  model: string;
  messages: ChatMessage[];
  seed?: number;
  temperature?: number;
  max_tokens?: number;
}

interface CapturedRequest {
  auth: string | null;
  body: MockRequestBody;
}

const captured: CapturedRequest[] = [];
let server: ReturnType<typeof Bun.serve>;

beforeAll(() => {
  server = Bun.serve({
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      if (url.pathname !== "/v1/chat/completions") {
        return new Response("not found", { status: 404 });
      }

      const body = (await request.json()) as MockRequestBody;
      captured.push({ auth: request.headers.get("authorization"), body });

      if (body.model === "boom") return new Response("upstream exploded", { status: 500 });
      if (body.model === "slow") await new Promise((resolve) => setTimeout(resolve, 250));

      const digest = createHash("sha256")
        .update(JSON.stringify({ seed: body.seed ?? null, messages: body.messages }))
        .digest("hex");
      const promptChars = body.messages.at(-1)?.content.length ?? 0;

      return Response.json({
        id: "mock",
        choices: [{ message: { role: "assistant", content: digest.slice(0, 16) } }],
        usage: {
          prompt_tokens: promptChars,
          completion_tokens: 8,
          total_tokens: promptChars + 8,
        },
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

function config(overrides: Partial<ProviderConfig> = {}): ProviderConfig {
  return {
    kind: "ollama",
    baseUrl: baseUrl(),
    model: "mock-model",
    seed: 42,
    temperature: 0,
    maxTokens: 64,
    timeoutMs: 2000,
    ...overrides,
  };
}

const messages: ChatMessage[] = [{ role: "user", content: "Score this agent output." }];

describe("eval-provider configuration", () => {
  test("resolves local and cloud defaults", () => {
    const ollama = resolveProviderConfig("ollama", {}, {});
    expect(ollama.baseUrl).toBe("http://127.0.0.1:11434/v1");
    expect(ollama.model).toBe("llama3.2");
    expect(ollama.seed).toBe(42);
    expect(ollama.temperature).toBe(0);

    const vllm = resolveProviderConfig("vllm", {}, {});
    expect(vllm.baseUrl).toBe("http://127.0.0.1:8000/v1");
    expect(vllm.model).toBe("Qwen/Qwen2.5-7B-Instruct");

    const cloud = resolveProviderConfig(
      "openai-compatible",
      {},
      { EVAL_API_KEY: "sk-test", EVAL_BASE_URL: "https://example.test/v1/", EVAL_MODEL: "judge-mini" },
    );
    expect(cloud.baseUrl).toBe("https://example.test/v1");
    expect(cloud.model).toBe("judge-mini");
    expect(cloud.apiKey).toBe("sk-test");
  });

  test("overrides win and invalid numbers are rejected", () => {
    const resolved = resolveProviderConfig(
      "ollama",
      { seed: 7.9, temperature: 0.25, maxTokens: 128, baseUrl: "http://host/v1///" },
      {},
    );
    expect(resolved.seed).toBe(7);
    expect(resolved.temperature).toBe(0.25);
    expect(resolved.maxTokens).toBe(128);
    expect(resolved.baseUrl).toBe("http://host/v1");

    expect(() => resolveProviderConfig("ollama", { temperature: 3 }, {})).toThrow(/temperature/);
    expect(() => resolveProviderConfig("ollama", { maxTokens: 0 }, {})).toThrow(/maxTokens/);
    expect(isProviderKind("ollama")).toBe(true);
    expect(isProviderKind("other")).toBe(false);
  });
});

describe("eval-provider chat completions", () => {
  test("local and cloud kinds produce identical output for the same seed", async () => {
    captured.length = 0;

    const local = await chatCompletion(config({ kind: "ollama", seed: 42 }), messages);
    const cloud = await chatCompletion(config({ kind: "openai-compatible", seed: 42, apiKey: "sk-mock" }), messages);

    expect(local.content).toBe(cloud.content);
    expect(local.usage.totalTokens).toBeGreaterThan(0);
    expect(cloud.usage).toEqual(local.usage);
  });

  test("changing the seed changes the completion", async () => {
    const first = await chatCompletion(config({ seed: 42 }), messages);
    const second = await chatCompletion(config({ seed: 43 }), messages);
    expect(first.content).not.toBe(second.content);
  });

  test("sends the deterministic request shape and bearer token", async () => {
    captured.length = 0;
    await chatCompletion(config({ temperature: 0.25, maxTokens: 64, apiKey: "sk-test" }), messages);

    const request = captured.at(-1);
    expect(request?.auth).toBe("Bearer sk-test");
    expect(request?.body.model).toBe("mock-model");
    expect(request?.body.seed).toBe(42);
    expect(request?.body.temperature).toBe(0.25);
    expect(request?.body.max_tokens).toBe(64);
    expect(request?.body.messages).toEqual(messages);
  });

  test("accumulates telemetry across calls", async () => {
    const telemetry = new EvalTelemetry();
    const first = await chatWithTelemetry(telemetry, config(), messages);
    const second = await chatWithTelemetry(telemetry, config(), messages);

    const snapshot = telemetry.snapshot();
    expect(snapshot.runs).toBe(2);
    expect(snapshot.totalTokens).toBe(first.usage.totalTokens + second.usage.totalTokens);
    expect(snapshot.latencyMs).toBeGreaterThanOrEqual(0);
    expect(snapshot.costUsd).toBe(0);

    telemetry.reset();
    expect(telemetry.snapshot().runs).toBe(0);
  });

  test("prices cloud calls when a price table is supplied", async () => {
    const local = await chatCompletion(config({ kind: "ollama" }), messages, {
      pricePerMillion: { input: 3, output: 15 },
    });
    const cloud = await chatCompletion(config({ kind: "openai-compatible", apiKey: "sk-mock" }), messages, {
      pricePerMillion: { input: 3, output: 15 },
    });

    expect(local.costUsd).toBe(0);
    expect(cloud.costUsd).toBeGreaterThan(0);
  });

  test("surfaces upstream failures with status and snippet", async () => {
    await expect(chatCompletion(config({ model: "boom" }), messages)).rejects.toThrow(
      /failed \(500\).*upstream exploded/,
    );
  });

  test("aborts a request that exceeds the timeout", async () => {
    await expect(chatCompletion(config({ model: "slow", timeoutMs: 30 }), messages)).rejects.toThrow(
      /timed out after 30ms/,
    );
  });
});
