# Extending a Generated Mode/Command Surface

Procedure for adding modes, references, or commands to a skills corpus whose
surfaces are GENERATED (dispatch directories, command exporters, count claims).
Class-level; the concrete instance this procedure was validated on is a skills
suite where a `sync-dispatch` generator and a command exporter share one
`getModesForSkill`-style source.

## Procedure (in order)

1. **Define "mode" once, as code.** A naming predicate (e.g. lowercase
   kebab-case reference filenames; uppercase files are governance docs, not
   modes) shared by every consumer via import — never re-deriving the set with
   `readdirSync` in a second place. Two consumers with two definitions is how
   counts and routing silently diverge.
2. **Pilot 2–3 entries across different shapes, gate, then batch.** Tables
   differ per file (column counts, leading `||` pipes, backticked vs bold
   cells, 5-column variants). The pilot surfaces every ripple before 14 files
   are committed to one pattern.
3. **Let the test suite enumerate the ripple.** After adding content, run the
   full suite and treat every failure as the list of derived surfaces that must
   follow: per-skill count claims, advertised totals, dispatch drift,
   per-skill README tables. Fix the failures by DERIVING the values (recompute
   from the generator's source), never by hand-guessing a number.
4. **Land each batch as one PR** with the derived updates included, so no
   intermediate state ships a count that disagrees with the artifact.

## Content sourcing

- Research before authoring: anchor each domain-specific reference file in
  named external standards (OWASP cheat sheets, NIST SPs, WCAG thresholds) and
  cite them in a `## Sources` section. Internal authorities (the skill's own
  SKILL.md, sibling references) are legitimate Sources when that is what the
  content is derived from — say so; never dress a guess as a citation.
- Do not add modes to departments that are already audit-shaped by design
  (an auditor-of-auditors skill, a review loop, a dispatcher). Name the
  exclusion explicitly so the gap count is honest.

## Pitfalls

- **A table's separator row parses as a data row.** `| :--- | :--- |` yields a
  "name" of `---` after punctuation-stripping; require names to start with a
  letter and check header/separator rows before treating any `|`-line as data.
- **Markdown-link-only validation misses backticked plain-text paths.**
  `` `references/x.md` `` mentions in prose and Sources are the most common
  citation form; sweep both, and accept a canonical shared location (e.g.
  `skills/references/...`) as well as the per-skill one. Regex-derived
  "sources" fabricated a doubled `references/references/` path in 14 files
  because the extractor could not see path context — every derived path must
  be `existsSync`-verified against the location it claims.
- **Never anchor a patch on a truncated view of a line.** Terminal output cut
  at N characters matched the prefix of a longer authored row and split it
  into two mangled rows. Read the full line (or grep it) before anchoring.
- **A newline-stripped single-line file looks thin but may be complete.**
  Check content before "fixing": the repair is restoring line structure at
  section markers, not rewriting the substance. Conversely, sweep "dead link"
  hits before fixing — some are syntax examples inside table cells and
  template instructions inside code spans, not real links.
- **Assert the branch after every checkout in a command chain.** A silent
  checkout failure makes the following rebase/amend operate on the wrong
  branch — including a protected one; `git branch --show-current` before any
  commit, rebase, or push.
