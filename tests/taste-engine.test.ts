import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { TasteEngine } from "../scripts/taste-engine.ts";

describe("🧠 Native Agent Taste Engine", () => {
  const tempStatePath = path.resolve(process.cwd(), ".agents/artifacts/scratch/test-taste-state.json");

  beforeEach(async () => {
    try {
      await fs.unlink(tempStatePath);
    } catch {
      // Ignore if file doesn't exist
    }
  });

  afterEach(async () => {
    try {
      await fs.unlink(tempStatePath);
    } catch {
      // Ignore
    }
  });

  it("classifies signals into the 5 fixed categories correctly", () => {
    const engine = new TasteEngine(tempStatePath);
    expect(engine.classifyCategory("Always translate non English speech to natural English")).toBe("communication");
    expect(engine.classifyCategory("Open separate atomic PR per skill feature")).toBe("git-workflow");
    expect(engine.classifyCategory("We use Stripe, Razorpay, Cashfree with GST ITC recovery")).toBe("fintech");
    expect(engine.classifyCategory("Strict boundary check before deploying changes")).toBe("boundaries");
    expect(engine.classifyCategory("Prefer modular decoupled components")).toBe("architecture");
  });

  it("tracks recurrence (N) and triggers promotion qualification at N >= 2", () => {
    const engine = new TasteEngine(tempStatePath);

    // First observation (N = 1)
    const res1 = engine.observeSignal("Open an atomic PR per feature per skill", {
      category: "git-workflow",
    });
    expect(res1.signal.recurrenceCount).toBe(1);
    expect(res1.qualifiedForPromotion).toBe(false);

    // Second observation (N = 2)
    const res2 = engine.observeSignal("Open an atomic PR per feature per skill", {
      category: "git-workflow",
    });
    expect(res2.signal.recurrenceCount).toBe(2);
    expect(res2.qualifiedForPromotion).toBe(true);

    // Promotes to active atom
    const atom = engine.promoteSignalToAtom(res2.signal.id);
    expect(atom.rule).toContain("atomic PR");
    expect(atom.status).toBe("active");
    expect(atom.confidence).toBeGreaterThanOrEqual(0.8);
    expect(res2.signal.promotedToAtomId).toBe(atom.id);
  });

  it("strictly enforces the active atom cap (<= 20) by retiring the oldest atom", () => {
    const engine = new TasteEngine(tempStatePath);
    // Artificially configure a small cap for testing
    const state = engine.getState();
    state.activeAtomCap = 3;

    // Add 3 active atoms
    for (let i = 1; i <= 3; i++) {
      const sig = engine.observeSignal(`Rule number ${i}`, { category: "architecture" });
      sig.signal.recurrenceCount = 2;
      engine.promoteSignalToAtom(sig.signal.id);
    }

    expect(engine.getState().atoms.filter((a) => a.status === "active").length).toBe(3);

    // Add a 4th atom when cap is 3
    const sig4 = engine.observeSignal("Rule number 4", { category: "architecture" });
    sig4.signal.recurrenceCount = 2;
    engine.promoteSignalToAtom(sig4.signal.id);

    // Still exactly 3 active atoms!
    const active = engine.getState().atoms.filter((a) => a.status === "active");
    const retired = engine.getState().atoms.filter((a) => a.status === "retired");

    expect(active.length).toBe(3);
    expect(retired.length).toBe(1);
    expect(retired[0].rule).toBe("Rule number 1");
  });

  it("detects conflicts against existing active atoms", () => {
    const engine = new TasteEngine(tempStatePath);

    // Promote standard fintech atom
    const sig1 = engine.observeSignal("We use Stripe and Cashfree with zero QuickBooks assumption", {
      category: "fintech",
    });
    sig1.signal.recurrenceCount = 2;
    engine.promoteSignalToAtom(sig1.signal.id);

    // Conflicting signal
    const conflictResult = engine.observeSignal("Set up QuickBooks ledger integration", {
      category: "fintech",
    });

    expect(conflictResult.conflictWithAtom).not.toBeNull();
    expect(conflictResult.conflictWithAtom?.rule).toContain("Stripe and Cashfree");
  });

  it("prunes stale atoms inactive for > 365 days", () => {
    const engine = new TasteEngine(tempStatePath);
    const sig = engine.observeSignal("Legacy protocol standard", { category: "architecture" });
    sig.signal.recurrenceCount = 2;
    const atom = engine.promoteSignalToAtom(sig.signal.id);

    // Artificially age the atom by 400 days
    const pastDate = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString();
    atom.lastTriggered = pastDate;

    const retired = engine.pruneStaleAtoms(365);
    expect(retired.length).toBe(1);
    expect(atom.status).toBe("retired");
  });

  it("generates structured markdown table output", () => {
    const engine = new TasteEngine(tempStatePath);
    const sig = engine.observeSignal("Always native English output", { category: "communication" });
    sig.signal.recurrenceCount = 2;
    engine.promoteSignalToAtom(sig.signal.id);

    const md = engine.formatMarkdownSummary();
    expect(md).toContain("# Invariant Atom Table");
    expect(md).toContain("Always native English output");
    expect(md).toContain("communication");
  });

  it("allows increasing the active atom cap to accommodate more rules", () => {
    const engine = new TasteEngine(tempStatePath);
    engine.getState().activeAtomCap = 5;

    for (let i = 1; i <= 5; i++) {
      const sig = engine.observeSignal(`Dynamic rule ${i}`, { category: "architecture" });
      sig.signal.recurrenceCount = 2;
      engine.promoteSignalToAtom(sig.signal.id);
    }

    const active = engine.getState().atoms.filter((a) => a.status === "active");
    expect(active.length).toBe(5);
  });

  it("does not flag conflict when an atom contains general fintech rails without negative rules", () => {
    const engine = new TasteEngine(tempStatePath);
    const sig = engine.observeSignal("We use Stripe for payment processing", { category: "fintech" });
    sig.signal.recurrenceCount = 2;
    engine.promoteSignalToAtom(sig.signal.id);

    const result = engine.observeSignal("Integrate QuickBooks Online for reconciliation", { category: "fintech" });
    expect(result.conflictWithAtom).toBeNull();
  });
});
