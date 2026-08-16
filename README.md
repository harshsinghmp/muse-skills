# Muse Skills

Custom agent skills for enhanced workspace productivity and memory management.

## Installation

Install individual skills using the `npx skills` command:

```bash
# Install updateagents skill
npx skills add https://github.com/harshsinghmp/muse-skills/tree/main/updateagents
```

Or install all skills at once:

```bash
npx skills add https://github.com/harshsinghmp/muse-skills
```

## Available Skills

### updateagents

Automatically discovers, reads, and updates agent memory files (AGENTS.md, CLAUDE.md, .cursorrules, etc.) in the current working directory.

**Features:**
- Auto-discovers existing memory files
- Workspace-scoped only (never touches parent directories)
- Integrates with cavemem, codegraph, rtk, memoryagent, ponytail
- Incremental updates (preserves existing content)
- Priority system for multiple memory files
- Size management (warns at 5KB, errors at 10KB)

**Usage:**
```
"update agents.md"
"refresh clauade.md"
"sync memory files"
"create agent guide for this workspace"
```

[Learn more →](updateagents/README.md)

## Adding New Skills

To add a new skill to this repository:

1. Create a new directory under the root: `mkdir my-new-skill`
2. Add required files:
   - `SKILL.md` - Main skill definition
   - `agents/openai.yaml` - Agent configuration
   - `README.md` - User documentation (optional but recommended)
3. Update `skills.json` with the new skill metadata
4. Test locally before committing

## Skill Structure

Each skill should follow this structure:

```
my-skill/
├── SKILL.md              # Main skill definition (required)
├── README.md             # User-facing documentation (recommended)
├── agents/
│   └── openai.yaml       # Agent configuration (required)
├── references/           # Reference documentation (optional)
│   └── *.md
├── scripts/              # Helper scripts (optional)
│   └── *.sh
└── examples/             # Usage examples (optional)
    └── *.md
```

## Development

### Local Testing

Test skills locally before publishing:

```bash
# Validate a skill's memory file output
cd updateagents
bash scripts/validate-memory-file.sh AGENTS.md
```

### Publishing

1. Commit changes: `git add . && git commit -m "Add new skill"`
2. Push to GitHub: `git push origin main`
3. Skills are immediately available via `npx skills add`

## License

MIT

## Contributing

Feel free to open issues or pull requests for:
- New skill ideas
- Bug fixes
- Documentation improvements
- Feature enhancements
