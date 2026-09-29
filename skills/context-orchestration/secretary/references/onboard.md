# 🧭 Secretary Mode: Onboard (Interactive Identity & Context Interview)

The `onboard` mode equips the Secretary agent to lead an interactive, conversational onboarding interview with the principal or developer.

---

## 1. Operating Doctrine

When a user invokes `/onboard`, `secretary:onboard`, `setup identity`, or asks to configure their profile:
1. **Determine Scope**:
   - **Global Identity (`~/.agents/identity/`)**: Personal profile, assistant stance, compass, machine invariants.
   - **Project Context (`./.agents/context/`)**: Domain problem, ICP, current state, roadmap, project-specific stance.
2. **Conduct the Interview Iteratively**:
   - Ask **one stage at a time** (or present grouped choices). Never dump 20 questions in a giant wall of text.
   - Offer sensible defaults that the user can accept with a single keystroke or confirmation.
3. **Persist Clean Markdown Artifacts**:
   - Write cleanly formatted markdown files without synthetic wrappers or fluff.

---

## 2. Global Identity Flow (`~/.agents/identity/`)

### Stage 1: Principal Identity
> *"Let's establish your foundational developer identity. What is your preferred name or handle, your core technical superpowers (e.g. full-stack TypeScript, systems architecture), and your communication style (e.g. concise/direct vs detailed/explanatory)?"*

Output destination: `~/.agents/identity/user.md`

### Stage 2: Assistant Persona & Council Stance
> *"How should your AI assistant operate? What should its name be (default: Muse)? How do you want to delegate tasks across the Council Leads (Sol for Full-Stack, Jasper for Design/CRO, Crew for Operations, Nexus for Hardening)?"*

Output destination: `~/.agents/identity/assistant.md`

### Stage 3: The Compass (Current State ➔ True North)
> *"Let's calibrate your compass (Current State ➔ True North):*
> 1. *Where are you right now? What are your active projects and biggest bottlenecks?*
> 2. *What is your 1-year True North vision of success?*
> 3. *What are the top 1–3 non-negotiable milestones for the next 90 days?*
> 4. *What are your core operating values (e.g. evidence before claims, ruthless simplicity)?"*

Output destination: `~/.agents/identity/compass.md`

### Stage 4: Global Machine Rules
> *"What are your machine-wide engineering rules? (e.g. default package manager: bun, zero secret exposure via Vibeguard, test pass required before PR)?"*

Output destination: `~/.agents/identity/rules.md`

---

## 3. Project-Scoped Context Flow (`./.agents/context/`)

When run inside a repository:

### Stage 1: First-Run Choice Gate
Present the developer with 3 options:
```markdown
1. **Inherit Global Identity [Default]**: Uses your global ~/.agents/identity/ settings.
2. **Customize Project Identity**: Run a 5-minute project-specific interview.
3. **Do Later**: Scaffold templates with clear guidance on how to run later.
```

### Stage 2: Project Calibration (if customizing)
1. **Product & ICP**: What core problem does this codebase solve, who is it for, and what is its defensible wedge? $\rightarrow$ Update `./.agents/context/product.md`.
2. **Current Reality**: What code is verified and running today? What are the active mock placeholders or blockers? $\rightarrow$ Update `./.agents/context/current.md`.
3. **Sprint Trajectory**: What are the immediate 30-day and 90-day deliverable targets? $\rightarrow$ Update `./.agents/context/roadmap.md`.
4. **Architecture & Constraints**: Are there strict stack boundaries, ports, or API invariants? $\rightarrow$ Update `./.agents/context/architecture.md`.

---

## 4. Verification & Closeout

After writing the files:
1. Print a clean summary table of files created/updated with file links.
2. Advise the user:
   - For Global: *"Global identity initialized. All projects will now inherit these preferences."*
   - For Project: *"Project context saved to `./.agents/context/`. Next time you work in this repo, agents will immediately ground on these facts."*
