import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cosine, rankDepartments } from "../scripts/route-embeddings";

const ROOT = join(import.meta.dir, "..");

const docs = [
  { key: "code-review:coupling-audit", department: "code-review" },
  { key: "code-review:pr-context", department: "code-review" },
  { key: "accounts:invoicing", department: "accounts" },
];
const vectors = [
  [1, 0, 0],
  [0.6, 0.8, 0],
  [0, 1, 0],
];

describe("embedding router scoring", () => {
  test("cosine is a dot product on already-normalised vectors", () => {
    expect(cosine([1, 0], [1, 0])).toBe(1);
    expect(cosine([1, 0], [0, 1])).toBe(0);
  });

  test("a department scores by its best mode, not its average", () => {
    // The prompt is closest to code-review:pr-context, but code-review's best
    // mode must still beat accounts.
    const ranked = rankDepartments([0.6, 0.8, 0], docs, vectors);
    expect(ranked[0].department).toBe("code-review");
    expect(ranked[0].key).toBe("code-review:pr-context");
    expect(ranked[1].department).toBe("accounts");
  });

  test("ranking is deterministic and returns every department once", () => {
    const first = rankDepartments([0.3, 0.3, 0.9], docs, vectors).map((entry) => entry.department);
    const second = rankDepartments([0.3, 0.3, 0.9], docs, vectors).map((entry) => entry.department);
    expect(first).toEqual(second);
    expect(new Set(first).size).toBe(first.length);
  });
});

describe("embedding baseline", () => {
  test("is separate from the lexical baseline and covers every distribution", () => {
    const embeddings = JSON.parse(readFileSync(join(ROOT, "routing-baseline-embeddings.json"), "utf8")) as {
      model: string;
      revision: string;
      distributions: Record<string, { total: number }>;
    };
    const lexical = JSON.parse(readFileSync(join(ROOT, "routing-baseline.json"), "utf8")) as {
      distributions: Record<string, unknown>;
    };
    expect(Object.keys(embeddings.distributions).sort()).toEqual(Object.keys(lexical.distributions).sort());
    expect(embeddings.model).toBe("Xenova/all-MiniLM-L6-v2");
    // A revision, not a branch: a moved tag cannot change what runs.
    expect(embeddings.revision).toMatch(/^[0-9a-f]{40}$/);
    for (const entry of Object.values(embeddings.distributions)) expect(entry.total).toBeGreaterThan(0);
  });
});
