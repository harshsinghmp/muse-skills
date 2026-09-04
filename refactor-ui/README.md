# 🪄 refactor-ui

**Atomic UI design and interface refactoring engine based on the principles of *Refactoring UI* by Adam Wathan and Steve Schoger.**

`refactor-ui` equips AI agents with deterministic, engineering-grade visual design heuristics to transform crowded, amateurish, or unstyled UI components into polished, high-conversion, accessible interfaces.

---

## ⚡ Install

```bash
# Install refactor-ui skill directly
npx skills add harshsinghmp/muse-skills --skill refactor-ui

# Or install the complete Muse Skills suite
npx skills add harshsinghmp/muse-skills
```

---

## 🎯 How to Use

Describe your UI refactoring goal in plain language:

```text
Refactor this pricing table component to improve visual hierarchy and remove border clutter.
```

```text
Audit this dashboard screen for spacing consistency, typography scale, and WCAG AA contrast.
```

```text
Make this registration form look clean, modern, and professional using Refactoring UI principles.
```

---

## 📊 The 10 Atomic Heuristics

| # | Heuristic Domain | Core Principle | Primary Transformation |
| :--- | :--- | :--- | :--- |
| **01** | **Visual Hierarchy** | Not all elements are created equal | Establish 1 primary focal point; aggressively de-emphasize metadata using weight and color rather than size alone. |
| **02** | **Typography Scale** | Limit font sizes to a curated scale | Apply a fixed 6-tier modular scale (`xs`, `sm`, `base`, `lg`, `xl`, `2xl`) with tight heading line-heights and relaxed body line-heights. |
| **03** | **Color Palette** | Restrict color to functional roles | Build a solid 9-step neutral ramp first (monochrome-first), then introduce 1 primary brand hue and strict status accents. |
| **04** | **Spacing Grid** | Use a consistent spatial rhythm | Enforce a strict 4px/8px geometric interval; double interior component padding to give elements room to breathe. |
| **05** | **Button Hierarchy** | Clarify the primary user action | Assign exactly one Solid Primary CTA; map secondary actions to Outline/Ghost variants and tertiary actions to minimal links. |
| **06** | **Visual Clutter** | Less visual noise = higher clarity | Strip border soup and container boxes; separate sections using whitespace, subtle background shifts, and alignment. |
| **07** | **Empty States** | Turn blank slates into on-ramps | Replace dead empty screens with actionable micro-onboarding, illustrative placeholders, and direct primary creation buttons. |
| **08** | **Shadows & Depth** | Light comes from above | Replace harsh single-line drop-shadows with subtle, layered ambient/direct shadow pairs to simulate realistic elevation. |
| **09** | **Color Contrast** | Accessibility is non-negotiable | Verify all foreground/background pairings meet WCAG AA standards (≥ 4.5:1 for body copy, ≥ 3:1 for large text & UI controls). |
| **10** | **Grouping & Alignment** | Proximity creates semantic meaning | Ensure spacing *within* related element groups is strictly tighter than spacing *between* unrelated groups (Gestalt Law of Proximity). |
| **11** | **Anti-Slop 5-State Gate** | Never ship only the happy path | Explicitly implement Empty, Loading (skeleton), Error (retry CTA), Success, and Overflow defensive wrapping. |

---

## 🛠️ Verification Scripts (Zero Dependencies)

The skill includes standalone Python stdlib tools for deterministic audit and contrast verification:

```bash
# Check WCAG 2.1 contrast between color pairs
python scripts/check_contrast.py --fg "#64748B" --bg "#FFFFFF"

# Audit a JSX / HTML / CSS file for common Refactoring UI anti-patterns
python scripts/audit_ui.py src/components/DashboardCard.tsx
```

---

## 📚 Disclosed Reference Guides

- [`01-visual-hierarchy.md`](references/01-visual-hierarchy.md) — Sizing, optical weights, and the squint test.
- [`02-typography-scale.md`](references/02-typography-scale.md) — Type scaling, line-height proportions, and letter spacing.
- [`03-color-palette.md`](references/03-color-palette.md) — 9-step neutrals, primary accents, and accessible palette generation.
- [`04-spacing-layout.md`](references/04-spacing-layout.md) — 4px/8px spatial rhythm and component breathing room.
- [`05-button-hierarchy.md`](references/05-button-hierarchy.md) — Primary, secondary, tertiary, and destructive action hierarchy.
- [`06-visual-clutter.md`](references/06-visual-clutter.md) — Eliminating border soup, redundant labels, and container noise.
- [`07-empty-states.md`](references/07-empty-states.md) — High-conversion empty states and onboarding patterns.
- [`08-shadows-elevation.md`](references/08-shadows-elevation.md) — Natural elevation, directional lighting, and layered shadows.
- [`09-contrast-accessibility.md`](references/09-contrast-accessibility.md) — WCAG 2.1 math and accessible gray scales.
- [`10-grouping-alignment.md`](references/10-grouping-alignment.md) — Gestalt proximity, table alignment, and optical balance.

---

## 📜 Attribution, Credit & Licensing

- **Original Principles**: Extracted from [*Refactoring UI*](https://refactoringui.com/) by **Adam Wathan** and **Steve Schoger** (© Tailwind Labs Inc.). All conceptual methodology and design philosophy credit belongs to the original authors.
- **Skill Formulation**: Clean-room AI agent skill synthesis authored by **Harsh Singh** for the **LifeOS** / **Muse Skills** open ecosystem.
- **Inspiration**: Acknowledgment to **George Nurijanian** (`gnurio/refactoring-ui-plugin`) for the initial concept of packaging Refactoring UI rules for agent runtimes.
- **License**: [MIT](LICENSE)
