# 🚫 Negative Constraints & Architectural Anti-Patterns

> **Operating Invariant**: Negative constraints are as critical as positive rules. Preventing known architectural failure modes and speculative complexity cuts agent hallucinations and regressions by over 90%.

---

## 1. Universal Agent Anti-Patterns

| Anti-Pattern | Why It Fails | Strict Invariant |
| :--- | :--- | :--- |
| **Speculative Architecture** | Agents create unused folders, abstractions, or "future-proofing" files that add maintenance debt. | Implement strictly what is currently requested. **Current Needs > Future Possibilities (YAGNI)**. |
| **Rogue Package Installation** | Casually running `npm install <pkg>` for minor utilities that modern runtimes provide natively. | All dependencies must be listed in `stack.md` allowlist. Never install Axios, Lodash, or Moment. |
| **Silent Error Swallowing** | Using empty `catch {}` blocks or returning default mocks when APIs fail. | Fail fast and loud. Log structured error details and exit cleanly with diagnostic codes. |
| **Synthetic Artifact Leakage** | Leaving proprietary IDE markers (`ORCA_RICH_MD`, Cursor, Windsurf wrappers) in commits. | Always unwrap and decode to raw markdown; backtick template tokens (`<issue-id>`). |
| **Context Window Overload** | Ingesting massive directories or entire logs into LLM context instead of surgical lookups. | Use targeted tools (`rg`, `fd`, `jq`) to extract minimal verifiable evidence. |

---

## 2. Frontend & UI Anti-Patterns

- ❌ **`useEffect` Data Fetching**: Never use raw `useEffect` hooks for remote data fetching in React 19 / modern Next.js. Use Server Components, Actions, or TanStack Query.
- ❌ **Cumulative Layout Shifts (CLS)**: Never render remote images or dynamic banners without explicit aspect-ratio or dimensions.
- ❌ **Inline CSS Magic Numbers**: Avoid arbitrary pixel values (e.g. `margin: 17px`). Use locked DTCG spacing tokens (`space-4`, `space-6`) and OKLCH palettes.
- ❌ **Client-Side Secret Ingestion**: Never import environment variables prefixed with database URLs or private keys into client components.

---

## 3. Backend & API Anti-Patterns

- ❌ **Unvalidated Request Payloads**: Never process `req.body` or query params without a validating Zod schema.
- ❌ **N+1 Database Queries**: Avoid executing database queries inside map loops. Use batch queries or join loaders.
- ❌ **Raw SQL String Interpolation**: Always use parameterized queries or type-safe ORM drivers (Drizzle, Kysely, Prisma).
- ❌ **Inconsistent Error Envelopes**: APIs must return predictable envelopes: `{ success: false, error: { code, message } }`.

---

## 4. Verification Gate Before Commit

Before claiming any task complete:
1. Did you add any unapproved dependencies? (Run `bun updateagents.ts --stack-guard`)
2. Are all tests and lints passing? (Run `bun test` and `bun run lint`)
3. Are there any plaintext secrets or tokens exposed? (Run secret scan)
