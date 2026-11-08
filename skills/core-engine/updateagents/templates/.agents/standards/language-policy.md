# Language Policy — Universal English Working Language & Script Guard

> **Scope:** every agent working in this repository, and every project scaffolded from this template.
> **Authority:** mandatory, not optional background reading. Routed from `AGENTS.md` (Working rules → Evidence and language).

## 1. The Working Language Rule

English is the universal working language across all projects and agents:

- **Universal scope**: Agent responses, internal chain-of-thought/reasoning, code, identifiers, comments, commits, pull requests, specifications, and documentation are strictly written in English.
- **Input language never changes output language**: A reference site, documentation page, screenshot, PDF, video, audio file, chat message, or media asset may be provided in Japanese, Chinese, Korean, Arabic, Hindi, Cyrillic, Hebrew, Thai, Devanagari, or any other script. Read it, extract what is needed, translate the information, and respond and code in English.
- **Translate, never mirror**: Quote non-English source material only when the exact original wording matters, and always provide the English translation immediately beside it.
- **Never switch language to match the user**: Never switch languages to match the conversational language of the user or prompt, including informal chat, short replies, single words, greetings, or acknowledgments.

---

## 2. Site-Content Carve-Out

- **Public copy**: Public site copy, user interfaces, and marketing copy remain in English unless the user explicitly approves a localized locale or multilingual target in project specifications.
- **Proper nouns & cultural terms**: Proper nouns (people, places, brands), specific culinary dish names, and localized prices with native currency symbols may retain their original script where semantically and culturally appropriate.

---

## 3. Why a Written Rule Is Not Enough

A language model reading a non-English reference can inadvertently mirror or carry non-English script into replies, comments, and committed files without noticing. Prompt instructions alone cannot eliminate attention bias or accidental script leakage.

Because instructions alone cannot prevent this failure mode, this policy is paired with an automated mechanical guard.

---

## 4. Enforcement Pattern (Stack-Agnostic)

Enforcement runs through **the project's own test runner** (e.g. `bun test`, `npm test`, `pytest`, `cargo test`, `go test`), not a specific vendor tool:

- **Scan scope**: The guard scans all tracked source code, configuration files, and documentation.
- **Detected scripts**: The guard checks for non-English scripts, including:
  - CJK Unified Ideographs (Chinese, Japanese Kanji)
  - Japanese Hiragana & Katakana
  - Korean Hangul
  - Cyrillic
  - Arabic
  - Hebrew
  - Thai
  - Devanagari
  - Fullwidth ASCII and punctuation characters
- **Failure output**: On encountering unlisted non-English script, the test runner fails with the exact `file`, `line number`, and `script name`.

### Hook Note

Where the project has a pre-commit hook (or CI workflow), it runs the same guard before commits are accepted so that a language policy violation cannot enter version history.

---

## 5. Explicit Allowlist

The mechanical guard respects an explicit allowlist for legitimate non-ASCII usage in English text:

1. **Typography and mathematical symbols**:
   - Em dashes (`—`) and en dashes (`–`)
   - Curly quotes and apostrophes (`“`, `”`, `‘`, `’`)
   - Middle dots (`·`), bullets, and section signs (`§`)
   - Arrows (`→`, `←`, `↑`, `↓`, `↔`)
   - Comparison and math operators (`≥`, `≤`, `×`, `÷`, `°`, `±`, `≠`, `≈`)
   - Currency symbols (`$`, `€`, `£`, `₹`, `¥`)
   - Box-drawing characters and approved diagrams
   - Standard Unicode emoji where permitted by project style
2. **Accented Latin for genuine English usage**:
   - Common loanwords with diacritics (e.g., `café`, `naïve`, `résumé`, `cliché`)
   - Accented proper nouns and geographic names (e.g., `São Paulo`, `München`, `Beyoncé`)
3. **Byte-identical vendor tokens & protocol fixtures**:
   - Vendor token markers, cryptographic digests, protocol payload signatures, or upstream API mock fixtures that must stay byte-identical to an external specification.

---

## 6. If the Guard Fails

When the test runner or pre-commit hook reports a language violation:

1. **Read the report**: Note the reported file, line number, and script name.
2. **Translate**: Read the offending line and translate the non-English characters to English.
3. **Evaluate necessity**: Retain the original script only if it represents an approved proper noun, culturally specific dish name, or byte-identical vendor token.
4. **Allowlist with documentation**: If the token must be preserved, add that token or file path to the project guard's allowlist accompanied by a comment explaining why its exact bytes matter.

---

## See Also

- `AGENTS.md` — Working rules (Rule 6: Evidence and language).
- `.agents/standards/anti-patterns.md` — Negative constraints and anti-patterns.
- `.agents/standards/execution-kernel.md` — Refactoring discipline and verification gates.
