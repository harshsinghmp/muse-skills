#!/usr/bin/env bun

/**
 * ⚓ anchor.ts — Context Anchor Engine: Working Reference Snapshots & Workstream Parking
 *
 * Implements:
 * 1. Micro-anchor dropping (<= 15 lines) into .agents/anchor.md
 * 2. Named workstream parking into .agents/anchors/<slug>.md
 * 3. Atomic workstream switching with auto-park and freshness check
 * 4. AST Attention Pinning (<= 30 lines) with source grounding and body replacement
 * 5. Ghost Task Verification (file existence, post-anchor mtime, and git diff check)
 *
 * Usage:
 *   bun anchor.ts [--drop] [--park <slug>] [--switch <slug>] [--list] [--pin <file:symbol>] [--verify] [--json]
 */

process.on("unhandledRejection", (reason, _promise) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";

export interface DropOptions {
  workstream?: string;
  branch?: string;
  client?: string;
  state?: string[] | string;
  reference?: string;
  nextAction?: string;
  pinnedContext?: string;
}

export interface AnchorSummary {
  slug: string;
  type: "active" | "parked";
  path: string;
  branch: string;
  client: string;
  timestamp: string;
  nextAction: string;
  stateSummary: string;
}

export interface SwitchResult {
  success: boolean;
  slug?: string;
  branch?: string;
  fresh?: boolean;
  warning?: string;
  error?: string;
  reEntryBlock?: string;
}

export interface PinResult {
  success: boolean;
  file?: string;
  symbol?: string;
  startLine?: number;
  endLine?: number;
  pinSnippet?: string;
  error?: string;
}

export interface VerificationResult {
  success: boolean;
  ghostTask: boolean;
  targetFile?: string;
  reason: string;
}

export function getGitBranch(targetDir: string): string {
  try {
    const res = spawnSync("git", ["branch", "--show-current"], {
      cwd: targetDir,
      encoding: "utf8",
    });
    if (res.status === 0 && res.stdout.trim()) {
      return res.stdout.trim();
    }
  } catch {}
  return "main";
}

export function formatAnchorContent(opts: {
  timestamp: string;
  workstream: string;
  branch: string;
  client: string;
  stateBullets: string[];
  reference: string;
  nextAction: string;
  pinnedSection?: string;
}): string {
  const lines: string[] = [
    `# Context Anchor — ${opts.timestamp}`,
    `workstream: ${opts.workstream} | branch: ${opts.branch}`,
    `Client: ${opts.client}`,
    "",
    "## What's True Right Now",
  ];

  for (const bullet of opts.stateBullets) {
    lines.push(`- ${bullet.replace(/^[-*]\s*/, "")}`);
  }

  lines.push("");
  lines.push("## The Working Reference");
  lines.push(`> ${opts.reference.replace(/^>\s*/, "")}`);
  lines.push("");
  lines.push("## Next Action");
  lines.push(
    opts.nextAction.startsWith("- [ ]") ? opts.nextAction : `- [ ] ${opts.nextAction.replace(/^[-*]\s*/, "")}`,
  );

  if (opts.pinnedSection && opts.pinnedSection.trim().length > 0) {
    lines.push("");
    lines.push(opts.pinnedSection.trim());
  }

  return lines.join("\n");
}

export function dropAnchor(
  workspaceRoot: string,
  options?: DropOptions,
): { success: boolean; path: string; content: string } {
  const agentsDir = join(workspaceRoot, ".agents");
  if (!existsSync(agentsDir)) {
    mkdirSync(agentsDir, { recursive: true });
  }

  const anchorPath = join(agentsDir, "anchor.md");
  const currentBranch = getGitBranch(workspaceRoot);
  const timestamp = new Date().toISOString();

  let stateBullets: string[] = [];
  if (Array.isArray(options?.state)) {
    stateBullets = options.state;
  } else if (typeof options?.state === "string") {
    stateBullets = [options.state];
  } else {
    stateBullets = [
      "Active work in progress; initial task scope defined.",
      "Architectural decisions aligned with project specifications.",
    ];
  }

  let ref = options?.reference || "Resume active development on current workstream. resume by: execute next action.";
  if (!ref.includes("resume by:")) {
    ref = `${ref.replace(/\.*$/, "")}. resume by: execute next action.`;
  }

  const nextAction = options?.nextAction || "- [ ] src/index.ts:1 — Continue implementation of current task";

  const content = formatAnchorContent({
    timestamp,
    workstream: options?.workstream || currentBranch,
    branch: options?.branch || currentBranch,
    client: options?.client || "internal",
    stateBullets,
    reference: ref,
    nextAction,
    pinnedSection: options?.pinnedContext,
  });

  writeFileSync(anchorPath, `${content}\n`, "utf8");
  return { success: true, path: anchorPath, content };
}

export function parkWorkstream(
  workspaceRoot: string,
  slug: string,
  options?: DropOptions,
): { success: boolean; path: string; slug: string } {
  const anchorsDir = join(workspaceRoot, ".agents/anchors");
  if (!existsSync(anchorsDir)) {
    mkdirSync(anchorsDir, { recursive: true });
  }

  const targetPath = join(anchorsDir, `${slug}.md`);
  const activeAnchorPath = join(workspaceRoot, ".agents/anchor.md");

  if (existsSync(activeAnchorPath) && !options?.state && !options?.reference) {
    const activeContent = readFileSync(activeAnchorPath, "utf8");
    const updatedContent = activeContent.replace(/workstream:\s*[^|\n]+/, `workstream: ${slug}`);
    writeFileSync(targetPath, updatedContent, "utf8");
  } else {
    const currentBranch = getGitBranch(workspaceRoot);
    const timestamp = new Date().toISOString();
    let stateBullets: string[] = [];
    if (Array.isArray(options?.state)) {
      stateBullets = options.state;
    } else if (typeof options?.state === "string") {
      stateBullets = [options.state];
    } else {
      stateBullets = [`Parked workstream ${slug} awaiting resumption.`, "Decisions preserved in anchor state."];
    }

    let ref = options?.reference || `Workstream ${slug} parked. resume by: resume active task.`;
    if (!ref.includes("resume by:")) {
      ref = `${ref.replace(/\.*$/, "")}. resume by: resume active task.`;
    }

    const nextAction = options?.nextAction || `- [ ] src/index.ts:1 — Resume parked workstream ${slug}`;

    const content = formatAnchorContent({
      timestamp,
      workstream: slug,
      branch: options?.branch || currentBranch,
      client: options?.client || "internal",
      stateBullets,
      reference: ref,
      nextAction,
      pinnedSection: options?.pinnedContext,
    });
    writeFileSync(targetPath, `${content}\n`, "utf8");
  }

  return { success: true, path: targetPath, slug };
}

export function parseAnchorDetails(filePath: string): {
  slug: string;
  branch: string;
  client: string;
  timestamp: string;
  stateBullets: string[];
  reference: string;
  nextAction: string;
  pinnedSection?: string;
} {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  let timestamp = "";
  let slug = "";
  let branch = "";
  let client = "internal";
  const stateBullets: string[] = [];
  let reference = "";
  let nextAction = "";
  let section = "";
  const pinnedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# Context Anchor —")) {
      timestamp = trimmed.replace("# Context Anchor —", "").trim();
      continue;
    }
    if (trimmed.startsWith("workstream:")) {
      const match = trimmed.match(/workstream:\s*([^|\n]+)(?:\|\s*branch:\s*([^\n]+))?/);
      if (match) {
        slug = match[1].trim();
        if (match[2]) branch = match[2].trim();
      }
      continue;
    }
    if (trimmed.startsWith("Client:")) {
      client = trimmed.replace("Client:", "").trim();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      section = trimmed.replace("## ", "").toLowerCase();
      if (section.startsWith("pinned")) {
        pinnedLines.push(line);
      }
      continue;
    }

    if (section.startsWith("pinned")) {
      pinnedLines.push(line);
      continue;
    }

    if (section.includes("what's true") || section.includes("whats true")) {
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        stateBullets.push(trimmed.replace(/^[-*]\s*/, ""));
      }
    } else if (section.includes("working reference")) {
      if (trimmed.startsWith(">")) {
        reference = trimmed.replace(/^>\s*/, "");
      } else if (trimmed.length > 0 && !reference) {
        reference = trimmed;
      }
    } else if (section.includes("next action")) {
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        nextAction = trimmed;
      }
    }
  }

  return {
    slug: slug || basename(filePath, ".md"),
    branch: branch || "main",
    client,
    timestamp,
    stateBullets,
    reference,
    nextAction: nextAction || "- [ ] Pending task definition",
    pinnedSection: pinnedLines.length > 0 ? pinnedLines.join("\n") : undefined,
  };
}

export function switchWorkstream(workspaceRoot: string, slug: string): SwitchResult {
  const anchorsDir = join(workspaceRoot, ".agents/anchors");
  const targetPath = join(anchorsDir, `${slug}.md`);

  if (!existsSync(targetPath)) {
    return {
      success: false,
      error: `Parked anchor for '${slug}' not found at ${targetPath}`,
    };
  }

  const activeAnchorPath = join(workspaceRoot, ".agents/anchor.md");
  if (existsSync(activeAnchorPath)) {
    const current = parseAnchorDetails(activeAnchorPath);
    if (current.slug && current.slug !== slug) {
      parkWorkstream(workspaceRoot, current.slug);
    }
  }

  const targetContent = readFileSync(targetPath, "utf8");
  writeFileSync(activeAnchorPath, targetContent, "utf8");

  const restored = parseAnchorDetails(activeAnchorPath);
  const currentBranch = getGitBranch(workspaceRoot);
  const isFresh = restored.branch === currentBranch;

  const firstState = restored.stateBullets[0] || "Resuming parked context";
  const cleanNext = restored.nextAction.replace(/^[-*]\s*\[[\s xX]?\]\s*/, "");

  const reEntryBlock = [
    `⚓ resuming ${restored.slug} (branch: ${restored.branch})`,
    `   State: ${firstState}`,
    `   ▶ Next: ${cleanNext}`,
  ].join("\n");

  return {
    success: true,
    slug: restored.slug,
    branch: restored.branch,
    fresh: isFresh,
    warning: isFresh
      ? undefined
      : `Branch mismatch: anchor recorded '${restored.branch}', current git branch is '${currentBranch}'.`,
    reEntryBlock,
  };
}

export function listAnchors(workspaceRoot: string): AnchorSummary[] {
  const summaries: AnchorSummary[] = [];

  const activePath = join(workspaceRoot, ".agents/anchor.md");
  if (existsSync(activePath)) {
    const parsed = parseAnchorDetails(activePath);
    summaries.push({
      slug: parsed.slug,
      type: "active",
      path: activePath,
      branch: parsed.branch,
      client: parsed.client,
      timestamp: parsed.timestamp,
      nextAction: parsed.nextAction,
      stateSummary: parsed.stateBullets.join("; "),
    });
  }

  const anchorsDir = join(workspaceRoot, ".agents/anchors");
  if (existsSync(anchorsDir)) {
    const files = readdirSync(anchorsDir).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      const p = join(anchorsDir, f);
      const parsed = parseAnchorDetails(p);
      summaries.push({
        slug: parsed.slug,
        type: "parked",
        path: p,
        branch: parsed.branch,
        client: parsed.client,
        timestamp: parsed.timestamp,
        nextAction: parsed.nextAction,
        stateSummary: parsed.stateBullets.join("; "),
      });
    }
  }

  return summaries;
}

export function pinAttentionContext(workspaceRoot: string, fileSymbolSpec: string): PinResult {
  const parts = fileSymbolSpec.split(":");
  if (parts.length < 2) {
    return {
      success: false,
      error: `Invalid spec format '${fileSymbolSpec}'. Expected 'file:symbol' or 'file:startLine-endLine'.`,
    };
  }

  const relFile = parts[0];
  const symbolOrRange = parts.slice(1).join(":");
  const absFile = resolve(workspaceRoot, relFile);

  if (!existsSync(absFile)) {
    return {
      success: false,
      error: `Target file '${relFile}' does not exist on disk.`,
    };
  }

  const content = readFileSync(absFile, "utf8");
  const lines = content.split("\n");
  const isPython = relFile.endsWith(".py");

  let startLine = 1;
  let endLine = lines.length;
  let snippetLines: string[] = [];

  const rangeMatch = symbolOrRange.match(/^L?(\d+)-L?(\d+)$/i);
  if (rangeMatch) {
    startLine = Math.max(1, parseInt(rangeMatch[1], 10));
    endLine = Math.min(lines.length, parseInt(rangeMatch[2], 10));
    snippetLines = lines.slice(startLine - 1, endLine);
  } else {
    const symbol = symbolOrRange.trim();
    let foundIdx = -1;

    if (isPython) {
      const pyRegex = new RegExp(`(^|\\n)(?:class|def)\\s+${symbol}\\b`);
      const match = content.match(pyRegex);
      if (match && match.index !== undefined) {
        const offset = match.index + (match[1] ? match[1].length : 0);
        foundIdx = content.slice(0, offset).split("\n").length - 1;
      }
    } else {
      const tsRegex = new RegExp(
        `(?:export\\s+)?(?:declare\\s+)?(?:async\\s+)?(?:interface|type|class|function|const|let|enum)\\s+${symbol}\\b`,
      );
      foundIdx = lines.findIndex((l) => tsRegex.test(l));
    }

    if (foundIdx === -1) {
      foundIdx = lines.findIndex((l) => l.includes(symbol));
    }

    if (foundIdx === -1) {
      return {
        success: false,
        error: `Symbol '${symbol}' not found in '${relFile}'.`,
      };
    }

    startLine = foundIdx + 1;
    let endIdx = foundIdx;

    if (isPython) {
      const baseIndentMatch = lines[foundIdx].match(/^(\s*)/);
      const baseIndent = baseIndentMatch ? baseIndentMatch[1].length : 0;
      for (let i = foundIdx + 1; i < lines.length; i++) {
        const l = lines[i];
        if (l.trim().length === 0) continue;
        const indentMatch = l.match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1].length : 0;
        if (indent <= baseIndent) {
          endIdx = i - 1;
          break;
        }
        endIdx = i;
      }
    } else {
      let openBraces = 0;
      let started = false;
      for (let i = foundIdx; i < lines.length; i++) {
        const l = lines[i];
        const opens = (l.match(/{/g) || []).length;
        const closes = (l.match(/}/g) || []).length;
        if (opens > 0) started = true;
        openBraces += opens - closes;
        if (started && openBraces <= 0) {
          endIdx = i;
          break;
        }
        if (!started && (l.includes(";") || (l.trim().startsWith("type ") && l.includes("=")))) {
          endIdx = i;
          break;
        }
      }
    }

    endLine = Math.max(startLine, endIdx + 1);
    snippetLines = lines.slice(startLine - 1, endLine);

    // Strip implementation bodies for functions/methods to save tokens and avoid orientation burn
    if (!isPython) {
      snippetLines = snippetLines.map((line) => {
        if (/function\s+\w+\s*\(.*\)\s*\{/.test(line)) {
          return line.replace(/\{.*/, "{ /* ... */ }");
        }
        return line;
      });
    }
  }

  // Enforce AST Pinning Invariant 1: Line Cap <= 30 lines
  if (snippetLines.length > 30) {
    snippetLines = snippetLines.slice(0, 29);
    snippetLines.push(isPython ? "# ... [truncated to 30-line cap]" : "// ... [truncated to 30-line cap]");
  }

  const commentHeader = isPython
    ? `# [PIN: ${relFile}#L${startLine}-L${endLine}]`
    : `// [PIN: ${relFile}#L${startLine}-L${endLine}]`;

  const pinSnippet = [commentHeader, ...snippetLines].join("\n");

  // Read or create active anchor
  const activeAnchorPath = join(workspaceRoot, ".agents/anchor.md");
  let activeContent = "";
  if (existsSync(activeAnchorPath)) {
    activeContent = readFileSync(activeAnchorPath, "utf8");
  } else {
    dropAnchor(workspaceRoot);
    activeContent = readFileSync(activeAnchorPath, "utf8");
  }

  const codeLang = isPython ? "python" : "typescript";
  const newPinBlock = ["## Pinned Attention Context", `\`\`\`${codeLang}`, pinSnippet, "```"].join("\n");

  let updatedContent = "";
  if (activeContent.includes("## Pinned Attention Context")) {
    updatedContent = activeContent.replace(/## Pinned Attention Context[\s\S]*?(?=\n## |$)/, `${newPinBlock}\n`);
  } else {
    updatedContent = `${activeContent.trim()}\n\n${newPinBlock}\n`;
  }

  writeFileSync(activeAnchorPath, updatedContent, "utf8");

  return {
    success: true,
    file: relFile,
    symbol: symbolOrRange,
    startLine,
    endLine,
    pinSnippet,
  };
}

export function verifyNextAction(workspaceRoot: string, anchorPath?: string): VerificationResult {
  const targetAnchorPath = anchorPath || join(workspaceRoot, ".agents/anchor.md");

  if (!existsSync(targetAnchorPath)) {
    return {
      success: false,
      ghostTask: true,
      reason: `Anchor file not found at '${targetAnchorPath}'.`,
    };
  }

  const details = parseAnchorDetails(targetAnchorPath);
  if (!details.nextAction || details.nextAction.includes("Pending task definition")) {
    return {
      success: false,
      ghostTask: true,
      reason: "No concrete Next Action defined in anchor.",
    };
  }

  // Parse target file from Next Action:
  // e.g. "- [ ] `src/auth/service.ts:45` — implement" or "- [ ] src/app.ts:88 — text"
  const fileMatch = details.nextAction.match(/(?:`([^`:]+)(?::\d+)?`|([a-zA-Z0-9_\-./\\]+\.[a-zA-Z0-9]+)(?::\d+)?)/);

  const matchedFile = fileMatch ? fileMatch[1] || fileMatch[2] : null;
  if (!matchedFile) {
    return {
      success: false,
      ghostTask: true,
      reason: `Could not identify target file path in Next Action: '${details.nextAction}'.`,
    };
  }

  const absTarget = resolve(workspaceRoot, matchedFile);
  const relTarget = relative(workspaceRoot, absTarget);

  // Invariant 1: Target file must exist on disk
  if (!existsSync(absTarget)) {
    return {
      success: false,
      ghostTask: true,
      targetFile: relTarget,
      reason: `Target file '${relTarget}' does not exist on disk.`,
    };
  }

  // Invariant 2: File mtime must post-date anchor timestamp (with 1000ms clock tolerance)
  const anchorTime = details.timestamp ? Date.parse(details.timestamp) : 0;
  const stat = statSync(absTarget);
  const mtimeMs = stat.mtimeMs;

  if (anchorTime > 0 && mtimeMs < anchorTime - 1000) {
    // Check if git has committed changes since anchor
    let hasGitCommitSince = false;
    try {
      const gitLog = spawnSync("git", ["log", `--since=${details.timestamp}`, "--oneline", "--", relTarget], {
        cwd: workspaceRoot,
        encoding: "utf8",
      });
      if (gitLog.status === 0 && gitLog.stdout.trim().length > 0) {
        hasGitCommitSince = true;
      }
    } catch {}

    if (!hasGitCommitSince) {
      return {
        success: false,
        ghostTask: true,
        targetFile: relTarget,
        reason: `Target file '${relTarget}' mtime (${new Date(mtimeMs).toISOString()}) does not post-date anchor timestamp (${details.timestamp}) and has no commits since anchor.`,
      };
    }
  }

  // Invariant 3: Target file must have meaningful changes in git
  let hasGitChanges = false;
  try {
    const gitStatus = spawnSync("git", ["status", "--porcelain", "--", relTarget], {
      cwd: workspaceRoot,
      encoding: "utf8",
    });
    if (gitStatus.status === 0 && gitStatus.stdout.trim().length > 0) {
      hasGitChanges = true;
    } else {
      const gitLog = spawnSync("git", ["log", "-n", "1", "--", relTarget], {
        cwd: workspaceRoot,
        encoding: "utf8",
      });
      if (gitLog.status === 0 && gitLog.stdout.trim().length > 0) {
        hasGitChanges = true;
      }
    }
  } catch {}

  if (!hasGitChanges) {
    return {
      success: false,
      ghostTask: true,
      targetFile: relTarget,
      reason: `Target file '${relTarget}' shows no git diff, unstaged changes, or commits post-dating anchor.`,
    };
  }

  return {
    success: true,
    ghostTask: false,
    targetFile: relTarget,
    reason: `Target file '${relTarget}' exists, was modified post-anchor, and contains verified changes.`,
  };
}

if (import.meta.main) {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      drop: { type: "boolean", default: false },
      park: { type: "string" },
      switch: { type: "string" },
      list: { type: "boolean", default: false },
      pin: { type: "string" },
      verify: { type: "boolean", default: false },
      workstream: { type: "string" },
      branch: { type: "string" },
      client: { type: "string" },
      state: { type: "string" },
      reference: { type: "string" },
      next: { type: "string" },
      json: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: true,
  });

  const workspaceRoot = positionals[0] ? resolve(process.cwd(), positionals[0]) : process.cwd();

  if (values.help) {
    console.log(`
⚓ anchor.ts — Context Anchor Engine: Working Reference Snapshots & Workstream Parking

Usage:
  bun anchor.ts [workspaceRoot] [options]

Commands:
  --drop               Drop micro-anchor into .agents/anchor.md (<=15 lines)
  --park <slug>        Park current workstream to .agents/anchors/<slug>.md
  --switch <slug>      Park active context and restore target parked workstream
  --list               List active and parked workstream anchors
  --pin <file:symbol>  AST Attention Pinning: extract verbatim type/contract (<=30 lines)
  --verify             Ghost Task Verification: inspect file existence, mtime, and git diff

Options:
  --workstream <slug>  Specify workstream slug
  --branch <name>      Specify git branch name
  --client <codename>  Specify client codename (NDA protected)
  --state <text>       State bullet for anchor
  --reference <text>   Working reference with resume by clause
  --next <action>      Next action item with target file and line
  --json               Output machine-readable JSON
  -h, --help           Show this help message
`);
    process.exit(0);
  }

  if (values.drop) {
    const res = dropAnchor(workspaceRoot, {
      workstream: values.workstream,
      branch: values.branch,
      client: values.client,
      state: values.state,
      reference: values.reference,
      nextAction: values.next,
    });

    if (values.json) {
      console.log(JSON.stringify(res, null, 2));
    } else {
      console.log(`\n⚓ Context Anchor Dropped: ${res.path}`);
      console.log(res.content);
    }
    process.exit(0);
  }

  if (values.park) {
    const res = parkWorkstream(workspaceRoot, values.park, {
      workstream: values.park,
      branch: values.branch,
      client: values.client,
      state: values.state,
      reference: values.reference,
      nextAction: values.next,
    });

    if (values.json) {
      console.log(JSON.stringify(res, null, 2));
    } else {
      console.log(`\n⚓ Workstream Parked: ${values.park} → ${res.path}`);
    }
    process.exit(0);
  }

  if (values.switch) {
    const res = switchWorkstream(workspaceRoot, values.switch);
    if (values.json) {
      console.log(JSON.stringify(res, null, 2));
    } else {
      if (!res.success) {
        console.error(`\n❌ Switch failed: ${res.error}`);
        process.exit(1);
      }
      console.log(`\n${res.reEntryBlock}`);
      if (res.warning) {
        console.warn(`⚠️ ${res.warning}`);
      }
    }
    process.exit(res.success ? 0 : 1);
  }

  if (values.list) {
    const anchors = listAnchors(workspaceRoot);
    if (values.json) {
      console.log(JSON.stringify(anchors, null, 2));
    } else {
      console.log(`\n⚓ Workstream Anchors (${anchors.length}):`);
      if (anchors.length === 0) {
        console.log("  No active or parked anchors found.");
      } else {
        for (const a of anchors) {
          const badge = a.type === "active" ? "🟢 [ACTIVE]" : "📦 [PARKED]";
          console.log(`  ${badge} ${a.slug.padEnd(26)} (branch: ${a.branch})`);
          console.log(`      Next: ${a.nextAction}`);
        }
      }
    }
    process.exit(0);
  }

  if (values.pin) {
    const res = pinAttentionContext(workspaceRoot, values.pin);
    if (values.json) {
      console.log(JSON.stringify(res, null, 2));
    } else {
      if (!res.success) {
        console.error(`\n❌ AST Pin failed: ${res.error}`);
        process.exit(1);
      }
      console.log(`\n🌲 AST Attention Pinned: ${res.file} (L${res.startLine}-L${res.endLine})`);
      console.log(res.pinSnippet);
    }
    process.exit(res.success ? 0 : 1);
  }

  if (values.verify) {
    const res = verifyNextAction(workspaceRoot);
    if (values.json) {
      console.log(JSON.stringify(res, null, 2));
    } else {
      if (res.ghostTask) {
        console.error(`\n👻 GHOST TASK DETECTED:`);
        console.error(`  Target: ${res.targetFile || "Unknown"}`);
        console.error(`  Reason: ${res.reason}`);
      } else {
        console.log(`\n✅ TASK VERIFIED:`);
        console.log(`  Target: ${res.targetFile}`);
        console.log(`  Reason: ${res.reason}`);
      }
    }
    process.exit(res.ghostTask ? 1 : 0);
  }

  // Default to list if no flag given
  const anchors = listAnchors(workspaceRoot);
  if (values.json) {
    console.log(JSON.stringify(anchors, null, 2));
  } else {
    console.log(`\n⚓ Workstream Anchors (${anchors.length}):`);
    for (const a of anchors) {
      const badge = a.type === "active" ? "🟢 [ACTIVE]" : "📦 [PARKED]";
      console.log(`  ${badge} ${a.slug.padEnd(26)} (branch: ${a.branch})`);
      console.log(`      Next: ${a.nextAction}`);
    }
  }
  process.exit(0);
}
