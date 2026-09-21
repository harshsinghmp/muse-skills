#!/usr/bin/env bun
/**
 * Native Agent Taste & Preference Learning Engine
 *
 * Captures recurring user steering, coding habits, and project constraints (N >= 2),
 * promotes verified invariants to the Global Invariant Atom Table (<=20 active atoms),
 * and syncs directly with LifeOS and DOX cognitive memory without third-party SaaS.
 *
 * @license MIT
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";

export type TasteCategory = "communication" | "git-workflow" | "architecture" | "fintech" | "boundaries";

export interface TasteSignal {
  id: string;
  category: TasteCategory;
  preference: string;
  rationale: string;
  recurrenceCount: number;
  firstObserved: string;
  lastObserved: string;
  sourceContexts: string[];
  promotedToAtomId?: string;
}

export interface InvariantAtom {
  id: string;
  category: TasteCategory;
  rule: string;
  scope: "global" | "project";
  confidence: number; // 0.0 - 1.0
  createdAt: string;
  lastTriggered: string;
  status: "active" | "retired";
}

export interface TasteState {
  schemaVersion: number;
  activeAtomCap: number; // Default: 20
  signals: TasteSignal[];
  atoms: InvariantAtom[];
}

export const DEFAULT_ACTIVE_ATOM_CAP = 40;

export class TasteEngine {
  private stateFilePath: string;
  private state: TasteState;

  constructor(stateFilePath?: string) {
    this.stateFilePath = stateFilePath || path.resolve(process.cwd(), ".agents/context/taste-state.json");
    this.state = {
      schemaVersion: 1,
      activeAtomCap: DEFAULT_ACTIVE_ATOM_CAP,
      signals: [],
      atoms: [],
    };
  }

  async load(): Promise<void> {
    try {
      const data = await fs.readFile(this.stateFilePath, "utf8");
      this.state = JSON.parse(data);
    } catch {
      // Default state will be used if file does not exist
    }
  }

  async save(): Promise<void> {
    const dir = path.dirname(this.stateFilePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.stateFilePath, JSON.stringify(this.state, null, 2), "utf8");
  }

  getState(): TasteState {
    return this.state;
  }

  classifyCategory(text: string): TasteCategory {
    const lower = text.toLowerCase();
    const hasWord = (word: string) => new RegExp(`\\b${word}\\b`, "i").test(text);

    if (
      lower.includes("english") ||
      lower.includes("tone") ||
      lower.includes("concise") ||
      lower.includes("translate") ||
      lower.includes("slop") ||
      lower.includes("copy") ||
      lower.includes("copywriting") ||
      lower.includes("aeo") ||
      lower.includes("seo")
    ) {
      return "communication";
    }
    if (
      hasWord("git") ||
      hasWord("commit") ||
      hasWord("pr") ||
      hasWord("prs") ||
      hasWord("branch") ||
      hasWord("rebase")
    ) {
      return "git-workflow";
    }
    if (
      lower.includes("stripe") ||
      lower.includes("razorpay") ||
      lower.includes("cashfree") ||
      lower.includes("payu") ||
      lower.includes("paytm") ||
      lower.includes("fintech") ||
      hasWord("tax") ||
      hasWord("gst") ||
      lower.includes("invoice")
    ) {
      return "fintech";
    }
    if (
      lower.includes("boundary") ||
      lower.includes("secret") ||
      hasWord("auth") ||
      lower.includes("permission") ||
      lower.includes("guard")
    ) {
      return "boundaries";
    }
    return "architecture";
  }

  detectConflict(newPreference: string, category: TasteCategory): InvariantAtom | null {
    const lower = newPreference.toLowerCase();
    const activeAtoms = this.state.atoms.filter((a) => a.status === "active" && a.category === category);

    for (const atom of activeAtoms) {
      const atomLower = atom.rule.toLowerCase();
      // Heuristic conflict detection
      if (
        (lower.includes("quickbooks") || lower.includes("xero")) &&
        (atomLower.includes("zero-quickbooks") ||
          atomLower.includes("zero quickbooks") ||
          atomLower.includes("no quickbooks") ||
          atomLower.includes("without quickbooks"))
      ) {
        return atom;
      }
      if (lower.includes("monolithic pr") && atomLower.includes("atomic pr")) {
        return atom;
      }
    }
    return null;
  }

  observeSignal(
    preference: string,
    options?: {
      category?: TasteCategory;
      rationale?: string;
      sourceContext?: string;
    },
  ): { signal: TasteSignal; qualifiedForPromotion: boolean; conflictWithAtom: InvariantAtom | null } {
    const category = options?.category || this.classifyCategory(preference);
    const conflict = this.detectConflict(preference, category);
    const now = new Date().toISOString();

    const normalized = preference.trim().toLowerCase();
    let existing = this.state.signals.find(
      (s) => s.preference.toLowerCase().includes(normalized) || normalized.includes(s.preference.toLowerCase()),
    );

    if (existing) {
      existing.recurrenceCount += 1;
      existing.lastObserved = now;
      if (options?.sourceContext && !existing.sourceContexts.includes(options.sourceContext)) {
        existing.sourceContexts.push(options.sourceContext);
      }
      if (options?.rationale && !existing.rationale) {
        existing.rationale = options.rationale;
      }
    } else {
      const id = `sig-${category}-${Date.now().toString(36)}`;
      existing = {
        id,
        category,
        preference: preference.trim(),
        rationale: options?.rationale || "Captured from user task feedback",
        recurrenceCount: 1,
        firstObserved: now,
        lastObserved: now,
        sourceContexts: options?.sourceContext ? [options.sourceContext] : ["session-observation"],
      };
      this.state.signals.push(existing);
    }

    const qualifiedForPromotion = existing.recurrenceCount >= 2 && !existing.promotedToAtomId;
    return { signal: existing, qualifiedForPromotion, conflictWithAtom: conflict };
  }

  promoteSignalToAtom(signalId: string, scope: "global" | "project" = "global"): InvariantAtom {
    const signal = this.state.signals.find((s) => s.id === signalId);
    if (!signal) {
      throw new Error(`Signal not found: ${signalId}`);
    }

    const activeAtoms = this.state.atoms.filter((a) => a.status === "active");
    if (activeAtoms.length >= this.state.activeAtomCap) {
      // Find oldest or least recently triggered active atom to retire
      const sorted = [...activeAtoms].sort(
        (a, b) => new Date(a.lastTriggered).getTime() - new Date(b.lastTriggered).getTime(),
      );
      const toRetire = sorted[0];
      if (toRetire) {
        toRetire.status = "retired";
      }
    }

    const now = new Date().toISOString();
    const atomId = `atom-${signal.category}-${Date.now().toString(36)}`;
    const confidence = Math.min(1.0, 0.7 + signal.recurrenceCount * 0.1);

    const newAtom: InvariantAtom = {
      id: atomId,
      category: signal.category,
      rule: signal.preference,
      scope,
      confidence,
      createdAt: now,
      lastTriggered: now,
      status: "active",
    };

    this.state.atoms.push(newAtom);
    signal.promotedToAtomId = atomId;
    return newAtom;
  }

  pruneStaleAtoms(maxInactiveDays: number = 365): InvariantAtom[] {
    const now = Date.now();
    const retired: InvariantAtom[] = [];

    for (const atom of this.state.atoms) {
      if (atom.status === "active") {
        const lastTriggeredTime = new Date(atom.lastTriggered).getTime();
        const daysInactive = (now - lastTriggeredTime) / (1000 * 60 * 60 * 24);
        if (daysInactive > maxInactiveDays) {
          atom.status = "retired";
          retired.push(atom);
        }
      }
    }

    return retired;
  }

  formatMarkdownSummary(): string {
    const activeAtoms = this.state.atoms.filter((a) => a.status === "active");
    const pendingSignals = this.state.signals.filter((s) => !s.promotedToAtomId);

    let out = `# Invariant Atom Table (Active: ${activeAtoms.length}/${this.state.activeAtomCap})\n\n`;
    out += `| ID | Category | Scope | Rule | Confidence | Last Triggered |\n`;
    out += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    for (const atom of activeAtoms) {
      out += `| \`${atom.id}\` | ${atom.category} | ${atom.scope} | ${atom.rule} | ${(atom.confidence * 100).toFixed(0)}% | ${atom.lastTriggered.slice(0, 10)} |\n`;
    }

    if (pendingSignals.length > 0) {
      out += `\n## Observed Signals Queue (Awaiting Recurrence N >= 2)\n\n`;
      out += `| ID | Category | Recurrence (N) | Preference | Last Observed |\n`;
      out += `| :--- | :--- | :--- | :--- | :--- |\n`;
      for (const sig of pendingSignals) {
        out += `| \`${sig.id}\` | ${sig.category} | ${sig.recurrenceCount} | ${sig.preference} | ${sig.lastObserved.slice(0, 10)} |\n`;
      }
    }

    return out;
  }
}

// CLI Execution Entrypoint
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "status";
  const engine = new TasteEngine();
  await engine.load();

  if (command === "observe") {
    let preference = "";
    let category: TasteCategory | undefined;
    let rationale = "";

    for (const arg of args.slice(1)) {
      if (arg.startsWith("--signal=")) {
        preference = arg.slice("--signal=".length);
      } else if (arg.startsWith("--category=")) {
        category = arg.slice("--category=".length) as TasteCategory;
      } else if (arg.startsWith("--rationale=")) {
        rationale = arg.slice("--rationale=".length);
      }
    }

    if (!preference) {
      console.error("Error: --signal is required.");
      process.exit(1);
    }

    const { signal, qualifiedForPromotion, conflictWithAtom } = engine.observeSignal(preference, {
      category,
      rationale,
    });

    if (conflictWithAtom) {
      console.warn(
        `⚠️ [CONFLICT DETECTED] Signal conflicts with existing active atom: ${conflictWithAtom.id} ("${conflictWithAtom.rule}")`,
      );
    }

    console.log(`✓ Observed signal [${signal.id}] (N=${signal.recurrenceCount}) in category '${signal.category}'`);
    if (qualifiedForPromotion) {
      console.log(`🎯 Recurrence N >= 2 reached! Eligible for promotion.`);
      const atom = engine.promoteSignalToAtom(signal.id);
      console.log(
        `🚀 Automatically promoted to active atom [${atom.id}] (confidence: ${(atom.confidence * 100).toFixed(0)}%)`,
      );
    }
    await engine.save();
  } else if (command === "status" || command === "list") {
    console.log(engine.formatMarkdownSummary());
  } else if (command === "prune") {
    const retired = engine.pruneStaleAtoms();
    console.log(`Retired ${retired.length} stale atoms (>365 days).`);
    await engine.save();
  } else if (command === "set-cap") {
    let cap = DEFAULT_ACTIVE_ATOM_CAP;
    for (const arg of args.slice(1)) {
      if (arg.startsWith("--cap=")) {
        cap = Number.parseInt(arg.slice("--cap=".length), 10);
      }
    }
    if (Number.isNaN(cap) || cap < 1) {
      console.error("Error: --cap must be a positive integer.");
      process.exit(1);
    }
    engine.getState().activeAtomCap = cap;
    console.log(`✓ Active atom cap updated to ${cap}`);
    await engine.save();
  } else {
    console.log(`Usage: bun scripts/taste-engine.ts [observe|status|list|prune|set-cap --cap=<N>]`);
  }
}

if (import.meta.main) {
  main().catch((err) => {
    console.error("TasteEngine error:", err);
    process.exit(1);
  });
}
