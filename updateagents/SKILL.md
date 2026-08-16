---
name: updateagents
description: Automatically discovers, reads, and updates agent memory files (AGENTS.md, CLAUDE.md, .cursorrules, etc.) in the current working directory. Integrates with cavemem, codegraph, rtk, memoryagent, and ponytail for enhanced context discovery. Workspace-scoped only.
---

# updateagents

Automatically discovers, reads, and updates agent memory files (AGENTS.md, CLAUDE.md, .cursorrules, etc.) in the current working directory. Scans workspace for commands, patterns, conventions, and architecture details, then merges new findings into existing memory files or creates them if they don't exist. Workspace-scoped only — never touches parent directories. Integrates with cavemem, codegraph, rtk, memoryagent, and ponytail for enhanced context discovery.

## When to use

- User asks to "update agents.md", "refresh clauade.md", "sync memory files"
- After significant codebase changes that should be documented
- Before handing off work to another agent
- When starting work in a directory without existing agent memory
- User mentions "agent context", "workspace memory", or "documentation for agents"
- After running cavemem, codegraph analysis, or other discovery tools
- Periodic maintenance of agent-facing documentation

## Prerequisites

Ensure these tools are available (install if missing):
- `cavemem` - Compressed memory extraction
- `codegraph` - Code structure analysis
- `rtk` - Repository toolkit
- `memoryagent` - Memory management
- `ponytail` - Tail-based log/context extraction

## Workflow

### 1. Discover existing memory files

Search the **current working directory only** (no parent traversal) for:
- `AGENTS.md`
- `CLAUDE.md`
- `.cursorrules`
- `.github/copilot-instructions.md`
- `GEMINI.md`
- `CODEX.md`
- Any `*.md` file in root with "agent", "claude", "cursor", "copilot", "gemini" in name

If multiple exist, prioritize in this order: AGENTS.md > CLAUDE.md > .cursorrules > others

### 2. Read existing content (if found)

Load the highest-priority existing file to understand current structure and avoid duplication.

### 3. Scan workspace for new information

Run discovery tools in parallel where available:

```bash
# If cavemem is installed
cavemem extract --format markdown --output /tmp/cavemem-output.md

# If codegraph is installed  
codegraph analyze --format markdown --output /tmp/codegraph-output.md

# If rtk is installed
rtk scan --output /tmp/rtk-output.md

# If memoryagent is installed
memoryagent capture --scope workspace --output /tmp/memoryagent-output.md

# If ponytail is installed
ponytail extract --workspace --output /tmp/ponytail-output.md
```

### 4. Manual workspace inspection

Regardless of tool availability, always perform manual scans:

**Commands & Scripts:**
```bash
# Find build/test/lint commands
find . -maxdepth 2 -name "package.json" -o -name "Makefile" -o -name "*.toml" -o -name "*.yaml" -o -name "*.yml" | head -5
grep -r "scripts" package.json 2>/dev/null | head -20
cat Makefile 2>/dev/null | grep "^[a-z]" | head -20

# Check for CI configs
find .github/workflows -name "*.yml" 2>/dev/null | head -5
```

**Project Structure:**
```bash
# Identify main source directories
ls -d */ 2>/dev/null | grep -E "(src|lib|app|packages|components)" | head -10

# Count files by type
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.go" -o -name "*.rs" | wc -l
```

**Key Patterns:**
```bash
# Look for common patterns
grep -r "export default" src/ 2>/dev/null | head -10
grep -r "interface\|type " src/ 2>/dev/null | head -10
grep -r "@deprecated\|TODO\|FIXME" . --include="*.ts" --include="*.js" --include="*.py" 2>/dev/null | head -10
```

**Testing Setup:**
```bash
# Find test commands and frameworks
grep -r "jest\|vitest\|pytest\|mocha\|cypress\|playwright" package.json 2>/dev/null
find . -name "*.test.*" -o -name "*.spec.*" | head -5
```

### 5. Synthesize findings

Extract from all sources:
- **Essential commands**: build, test, lint, deploy, dev server
- **Architecture**: main directories, entry points, data flow
- **Conventions**: naming, file structure, import patterns
- **Gotchas**: non-obvious behaviors, required env vars, known issues
- **Testing**: framework, location, how to run
- **Dependencies**: key libraries, version constraints

### 6. Update or create memory file

**If file exists:**
- Preserve existing structure
- Add new sections only if genuinely new
- Update outdated information
- Remove deprecated content
- Keep total size manageable (<5KB preferred)

**If creating new:**
Use this template structure:

```markdown
# [Project Name] - Agent Guide

## Quick Start
- Essential commands (build, test, run, deploy)
- Key directories and their purposes

## Architecture
- High-level structure
- How components fit together
- Data/control flow

## Conventions
- Naming patterns
- File organization
- Code style

## Testing
- Framework used
- How to run tests
- Test location patterns

## Gotchas
- Non-obvious behaviors
- Required environment variables
- Common pitfalls

## Dependencies
- Key libraries and versions
- Important configuration
```

### 7. Write the file

Save to the highest-priority discovered file, or create `AGENTS.md` in workspace root if none exist.

## Output contract

After execution, report:
1. Which file was updated/created
2. Number of new facts added
3. Any sections significantly changed
4. Warnings about missing tools (if cavemem/codegraph/etc unavailable)

## Integration notes

- **cavemem**: Provides compressed historical context from previous sessions
- **codegraph**: Maps code relationships and dependencies automatically  
- **rtk**: Extracts repository-level patterns and conventions
- **memoryagent**: Captures workspace-specific learnings and decisions
- **ponytail**: Extracts recent activity and context from logs/tails

When these tools are available, their output takes precedence over manual scanning for accuracy and depth.

## Safety rules

- **NEVER** traverse above current working directory
- **NEVER** modify files outside workspace root
- **ALWAYS** read before writing to preserve existing content
- **PREFER** incremental updates over full rewrites
- **RESPECT** file size limits (warn if approaching 10KB)
