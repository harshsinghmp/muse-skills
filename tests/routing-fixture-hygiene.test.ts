import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getSkillModeCommands, getSkills } from "../scripts/export-commands";

const REPO_ROOT = join(import.meta.dir, "..");
const FIXTURES = join(REPO_ROOT, "tests", "fixtures", "routing-eval");
const BASELINE = JSON.parse(readFileSync(join(REPO_ROOT, "routing-baseline.json"), "utf8")) as {
  distributions: Record<string, unknown>;
};
const routes = new Set(getSkillModeCommands(getSkills()).map((entry) => `${entry.skill}:${entry.mode}`));

interface Fixture {
  id: string;
  prompt: string;
  expect: string;
}

function load(file: string): Fixture[] {
  return JSON.parse(readFileSync(join(FIXTURES, file), "utf8")) as Fixture[];
}

const files = readdirSync(FIXTURES)
  .filter((file) => file.endsWith(".json"))
  .sort();
const heldout = files.filter((file) => file.startsWith("heldout-"));
const training = load("prompts.json");

describe("routing fixture hygiene", () => {
  test("every held-out set is a real measurement: 40+ prompts, unique ids, routable labels", () => {
    expect(heldout.length).toBeGreaterThanOrEqual(4);
    const problems: string[] = [];
    for (const file of heldout) {
      const entries = load(file);
      if (entries.length < 40) problems.push(`${file}: only ${entries.length} prompts`);
      const ids = new Set(entries.map((entry) => entry.id));
      if (ids.size !== entries.length) problems.push(`${file}: duplicate ids`);
      for (const entry of entries) {
        if (!routes.has(entry.expect)) problems.push(`${file}/${entry.id}: ${entry.expect} is not routable`);
      }
    }
    expect(problems).toEqual([]);
  });

  test("a held-out set never leaks into the training set", () => {
    // Folding a set into training is allowed, but then its file must be deleted
    // and a NEW blind set added — otherwise the "unseen" number is fiction.
    const trainingIds = new Set(training.map((entry) => entry.id));
    const leaked: string[] = [];
    for (const file of heldout) {
      for (const entry of load(file)) {
        if (trainingIds.has(entry.id)) leaked.push(`${file}/${entry.id}`);
      }
    }
    expect(leaked).toEqual([]);
  });

  test("every fixture is registered in the routing baseline", () => {
    // The matrix discovers fixtures from disk; an unregistered one fails the gate.
    const unregistered = files
      .map((file) => (file === "prompts.json" ? "training" : file.replace(/^heldout-/, "").replace(/\.json$/, "")))
      .filter((name) => !(name in BASELINE.distributions));
    expect(unregistered).toEqual([]);
  });

  test("the training set stays the largest and is large enough to be meaningful", () => {
    expect(training.length).toBeGreaterThanOrEqual(200);
    for (const file of heldout) {
      expect(training.length).toBeGreaterThan(load(file).length);
    }
  });
});
