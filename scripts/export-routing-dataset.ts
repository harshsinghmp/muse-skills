#!/usr/bin/env bun
/**
 * export-routing-dataset — build the training pairs for a fine-tuned router.
 *
 * Off-the-shelf embeddings reach 3/40 exact on a blind set; an agent reading
 * the directory reaches 28/40. The gap is domain vocabulary, and the fix is a
 * contrastive fine-tune on this repository's own pairs — not a bigger model.
 *
 *   bun run export:routing-dataset                 # writes .agents/artifacts/routing/finetune.jsonl
 *   bun run export:routing-dataset --out /tmp/x.jsonl
 *
 * Each row: { "anchor": "<prompt>", "positive": "<department:mode>", "negatives": [..] }
 * Negatives are the modes the lexical router ranked just below the truth — the
 * pairs the model currently gets wrong, which is what makes the gradient useful.
 *
 * Fine-tune recipe (run where torch is available; this repo stays dependency-free):
 *
 *   from sentence_transformers import SentenceTransformer, InputExample, losses, evaluation
 *   model = SentenceTransformer("BAAI/bge-base-en-v1.5")
 *   train = [InputExample(texts=[r["anchor"], r["positive"]]) for r in rows]
 *   loss  = losses.MultipleNegativesRankingLoss(model)   # in-batch negatives do the work
 *   model.fit(train_dataloader=DataLoader(train, batch_size=32, shuffle=True),
 *             epochs=3, warmup_steps=100, loss=loss)
 *   # Hold v10 back. Ship only if it beats the frozen baseline on v10 and v9.
 *
 * Guardrail: never train on v10. It is the set that judges the result.
 */

import fs from "node:fs";
import path from "node:path";
import { triagePrompt } from "../skills/context-orchestration/secretary/scripts/secretary";

const ROOT = path.resolve(import.meta.dir, "..");
const FIXTURES = path.join(ROOT, "tests/fixtures/routing-eval");
const DEFAULT_OUT = path.join(ROOT, ".agents", "artifacts", "routing", "finetune.jsonl");

/** v10 is the judge — including it here would make every later number a lie. */
const TRAIN_FILES = [
  "prompts.json",
  "heldout-v5.json",
  "heldout-v6.json",
  "heldout-v7.json",
  "heldout-v8.json",
  "heldout-v9.json",
];

interface Pair {
  anchor: string;
  positive: string;
  negatives: string[];
}

export function buildPairs(): Pair[] {
  const signals = JSON.parse(
    fs.readFileSync(path.join(ROOT, "skills/context-orchestration/secretary/references/mode-signals.json"), "utf8"),
  ) as Record<string, Record<string, unknown>>;
  const allModes = Object.entries(signals).flatMap(([department, modes]) =>
    Object.keys(modes).map((mode) => `${department}:${mode}`),
  );

  const pairs: Pair[] = [];
  for (const file of TRAIN_FILES) {
    const items = JSON.parse(fs.readFileSync(path.join(FIXTURES, file), "utf8")) as Array<{
      prompt: string;
      expect: string;
    }>;
    for (const item of items) {
      const routed = triagePrompt(item.prompt);
      const guess = `${routed.department}:${routed.mode}`;
      // Hard negatives: what the current router actually confuses it with, plus
      // a fixed sample of same-department siblings for the mode decision.
      const negatives = new Set<string>();
      if (guess !== item.expect) negatives.add(guess);
      for (const alt of routed.alternatives ?? []) {
        const candidate = `${alt.department}:${alt.mode}`;
        if (candidate !== item.expect) negatives.add(candidate);
      }
      if (negatives.size < 3) {
        for (const mode of allModes) {
          if (negatives.size >= 3) break;
          if (mode !== item.expect && mode.startsWith(`${item.expect.split(":")[0]}:`)) negatives.add(mode);
        }
      }
      pairs.push({ anchor: item.prompt, positive: item.expect, negatives: [...negatives].slice(0, 3) });
    }
  }
  return pairs;
}

if (import.meta.main) {
  const outIndex = Bun.argv.indexOf("--out");
  const out = outIndex === -1 ? DEFAULT_OUT : path.resolve(Bun.argv[outIndex + 1]);
  const pairs = buildPairs();
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${pairs.map((pair) => JSON.stringify(pair)).join("\n")}\n`, "utf8");

  const withHardNegative = pairs.filter((pair) => pair.negatives.length > 0).length;
  console.log(`✅ ${pairs.length} pairs → ${out}`);
  console.log(`   ${withHardNegative} carry a hard negative from the current router's confusion`);
  console.log("   v10 is excluded on purpose: it is the set that judges the result.");
}
