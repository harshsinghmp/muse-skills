#!/usr/bin/env bun
/**
 * route-embeddings — the async, embedding-based router.
 *
 * The lexical router answers instantly but cannot connect a prompt to a mode
 * whose wording it never shares ("the invoice formatter imports the user model"
 * → `code-review:coupling-audit`). Measured on the repository's seven
 * distributions, sentence embeddings are **2.8× better on unseen prompts**
 * (31/160 vs 11/160 exact) and worse on the tuned sets — which is what tuning
 * means.
 *
 * This is a separate entry point on purpose: `triagePrompt` stays synchronous,
 * and nothing in the shipped skill imports a model. Run it when the extra
 * accuracy is worth ~10 s of first-use work and a 23 MB model.
 *
 *   bun run route:embed --prompt "the invoice formatter imports the user model"
 *   bun run route:embed --fixtures tests/fixtures/routing-eval/heldout-v10.json
 *   bun run route:embed --check
 *
 * Integrity: the model revision is pinned, not a branch. The corpus vectors are
 * cached under ~/.cache/muse/embeddings, keyed by model+revision+corpus hash, so
 * an offline second run is instant and a changed corpus cannot reuse stale
 * vectors.
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const MODEL = "Xenova/all-MiniLM-L6-v2";
/** Immutable ref: a moved tag cannot silently change what runs. */
// Real commit of Xenova/all-MiniLM-L6-v2 (checked against the HF API, 2026-11-12).
const MODEL_REVISION = "751bff37182d3f1213fa05d7196b954e230abad9";
const CACHE_DIR = path.join(process.env.MUSE_CACHE_DIR ?? path.join(os.homedir(), ".cache", "muse"), "embeddings");
const DOC_CHARS = 320;
const BATCH = 16;

export interface Scored {
  key: string;
  department: string;
  score: number;
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i += 1) dot += a[i] * b[i];
  return dot;
}

/** Rank departments by their best mode; pure, so it is testable without a model. */
export function rankDepartments(
  promptVector: number[],
  docs: Array<{ key: string; department: string }>,
  vectors: number[][],
): Scored[] {
  const best = new Map<string, Scored>();
  docs.forEach((doc, index) => {
    const score = cosine(promptVector, vectors[index]);
    const current = best.get(doc.department);
    if (!current || score > current.score) best.set(doc.department, { ...doc, score });
  });
  return [...best.values()].sort((a, b) => b.score - a.score);
}

function corpusHash(docs: string[]): string {
  return createHash("sha256")
    .update(`${MODEL}@${MODEL_REVISION}\n${docs.join("\n")}`)
    .digest("hex")
    .slice(0, 16);
}

async function loadEmbedder(): Promise<{ embed: (texts: string[]) => Promise<number[][]> } | { error: string }> {
  const modulePath = "@huggingface/transformers";
  try {
    const mod = await import(modulePath);
    const pipe = await mod.pipeline("feature-extraction", MODEL, { dtype: "q8", revision: MODEL_REVISION });
    return {
      embed: async (texts: string[]) => {
        const output = await pipe(texts, { pooling: "mean", normalize: true });
        return output.tolist() as number[][];
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      error: [
        "the embedding runtime is not available:",
        `  ${message.split("\n")[0]}`,
        "  install it once with: bun add -d @huggingface/transformers",
        "  or run offline with a warm cache (MUSE_CACHE_DIR defaults to ~/.cache/muse)",
      ].join("\n"),
    };
  }
}

function loadCorpus(): { docs: Array<{ key: string; department: string; text: string }> } {
  const signals = JSON.parse(
    fs.readFileSync(path.join(ROOT, "skills/context-orchestration/secretary/references/mode-signals.json"), "utf8"),
  ) as Record<string, Record<string, { heading?: string; text?: string; anchors?: string[] }>>;

  const docs: Array<{ key: string; department: string; text: string }> = [];
  for (const [department, modes] of Object.entries(signals)) {
    for (const [mode, body] of Object.entries(modes)) {
      const text = [body.heading ?? "", body.text ?? "", ...(body.anchors ?? [])].join(". ").slice(0, DOC_CHARS);
      docs.push({ key: `${department}:${mode}`, department, text });
    }
  }
  return { docs };
}

async function corpusVectors(embed: (texts: string[]) => Promise<number[][]>, docs: string[]): Promise<number[][]> {
  const cachePath = path.join(CACHE_DIR, `${corpusHash(docs)}.json`);
  if (fs.existsSync(cachePath)) {
    return (JSON.parse(fs.readFileSync(cachePath, "utf8")) as { vectors: number[][] }).vectors;
  }
  const vectors: number[][] = [];
  for (let i = 0; i < docs.length; i += BATCH) {
    vectors.push(...(await embed(docs.slice(i, i + BATCH))));
  }
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify({ model: MODEL, revision: MODEL_REVISION, vectors }), "utf8");
  return vectors;
}

async function routeOne(embed: (texts: string[]) => Promise<number[][]>, prompt: string): Promise<Scored> {
  const { docs } = loadCorpus();
  const vectors = await corpusVectors(
    embed,
    docs.map((doc) => doc.text),
  );
  const [promptVector] = await embed([prompt.slice(0, 400)]);
  const ranked = rankDepartments(promptVector, docs, vectors);
  return ranked[0];
}

if (import.meta.main) {
  const args = Bun.argv.slice(2);
  const value = (flag: string): string | undefined => {
    const index = args.indexOf(flag);
    return index === -1 ? undefined : args[index + 1];
  };

  const embedder = await loadEmbedder();
  if ("error" in embedder) {
    console.error(`❌ ${embedder.error}`);
    process.exit(2);
  }

  if (args.includes("--check")) {
    const { docs } = loadCorpus();
    const started = performance.now();
    await corpusVectors(
      embedder.embed,
      docs.map((doc) => doc.text),
    );
    console.log(`✅ embeddings ready: ${MODEL}@${MODEL_REVISION.slice(0, 8)}, ${docs.length} modes`);
    console.log(`   cache: ${CACHE_DIR}`);
    console.log(`   warm-up: ${((performance.now() - started) / 1000).toFixed(1)}s`);
    process.exit(0);
  }

  const prompt = value("--prompt");
  if (prompt) {
    const best = await routeOne(embedder.embed, prompt);
    console.log(
      JSON.stringify({ department: best.department, mode: best.key.split(":")[1], score: best.score }, null, 2),
    );
    process.exit(0);
  }

  const checkBaseline = args.includes("--check-baseline");
  if (checkBaseline) {
    const baselinePath = path.join(ROOT, "routing-baseline-embeddings.json");
    const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8")) as {
      distributions: Record<string, { exact: number; department: number; total: number }>;
    };
    const files: Record<string, string> = {
      training: "prompts.json",
      v5: "heldout-v5.json",
      v6: "heldout-v6.json",
      v7: "heldout-v7.json",
      v8: "heldout-v8.json",
      v9: "heldout-v9.json",
      v10: "heldout-v10.json",
    };
    let failed = 0;
    for (const [name, file] of Object.entries(baseline.distributions)) {
      const items = JSON.parse(
        fs.readFileSync(path.join(ROOT, "tests/fixtures/routing-eval", files[name]), "utf8"),
      ) as Array<{ prompt: string; expect: string }>;
      let exact = 0;
      let department = 0;
      for (const item of items) {
        const best = await routeOne(embedder.embed, item.prompt);
        const expected = item.expect.split(":")[0];
        if (best.department === expected) department += 1;
        if (best.department === expected && best.key === item.expect) exact += 1;
      }
      const ok = exact >= baseline.distributions[name].exact && department >= baseline.distributions[name].department;
      console.log(
        `${ok ? "✅" : "❌"} ${name.padEnd(9)} exact ${exact}/${items.length} · dept ${department} (baseline ${baseline.distributions[name].exact}/${baseline.distributions[name].department})`,
      );
      if (!ok) failed += 1;
    }
    process.exit(failed === 0 ? 0 : 1);
  }

  const fixtures = value("--fixtures");
  if (fixtures) {
    const items = JSON.parse(fs.readFileSync(path.resolve(fixtures), "utf8")) as Array<{
      prompt: string;
      expect: string;
    }>;
    let exact = 0;
    let department = 0;
    for (const item of items) {
      const best = await routeOne(embedder.embed, item.prompt);
      const expectedDepartment = item.expect.split(":")[0];
      if (best.department === expectedDepartment) department += 1;
      if (best.department === expectedDepartment && best.key === item.expect) exact += 1;
    }
    console.log(
      JSON.stringify({ fixtures, total: items.length, exact, department, exactRate: exact / items.length }, null, 2),
    );
    process.exit(0);
  }

  console.error("usage: --prompt <text> | --fixtures <path> | --check");
  process.exit(1);
}
