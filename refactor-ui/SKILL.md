---
name: refactor-ui
description: "Audit, polish, and refactor user interfaces using the 10 atomic design heuristics from Refactoring UI. Transforms amateurish, crowded, or unstyled UI into clean, high-conversion, production-ready interfaces. Covers visual hierarchy, typography scales, color systems, spacing grids, button tiers, clutter reduction, empty states, natural shadows, accessible contrast, and optical grouping. Trigger on 'refactor this UI', 'improve this design', 'fix visual hierarchy', 'make this component look professional', 'audit UI contrast and spacing', 'clean up this messy dashboard', or whenever reviewing frontend templates, JSX, CSS, or Tailwind layouts."
version: 1.0.0
author: Harsh Singh
license: MIT
platforms: [macos, linux, windows]
metadata:
  hermes:
    tags: [ui-design, refactoring-ui, tailwind, typography, color-palette, visual-hierarchy, accessibility, frontend, design-systems]
    related_skills: [designscope, new-project, agent-handoff]
    requires_tools: [view_file, replace_file_content, write_to_file, run_command]
---

# 🪄 refactor-ui — Atomic UI Design & Interface Refactoring Engine

Systematically evaluate, refine, and refactor user interface components, layouts, and design systems using the 10 atomic heuristics established by Adam Wathan and Steve Schoger (*Refactoring UI*). This skill transforms amateur, cluttered, or inconsistent UI into clean, balanced, and accessible interfaces by treating design as a sequence of deterministic, engineering-grade visual decisions.

---

## When to Use

**Triggers:**
- *"Refactor this UI / component / screen"*
- *"Improve the visual hierarchy of this dashboard / form / card"*
- *"Make this interface look clean, modern, and professional"*
- *"Fix the typography scale, spacing, or color palette"*
- *"Audit this layout for visual clutter and excessive borders"*
- *"Review button hierarchy or empty states on this page"*
- Frontend review passes where the layout technically works but feels "developer-designed" or visually unbalanced.

**Anti-triggers:**
- Extracting tokens from a live URL or screenshot without refactoring existing code — use [`designscope`](../designscope/SKILL.md).
- Backend API logic, database schemas, or state architecture changes unrelated to presentation.
- Generating novel branding, illustrations, or vector artwork from scratch.

---

## Quick Reference

### Leading Principles & Priors

Recruit these core mental models when executing any UI refactor:

1. **Squint Test**: When blurred, the interface's primary action and core metric must immediately draw the eye before secondary details.
2. **De-emphasize to Emphasize**: Instead of making important elements bigger and louder, soften surrounding borders, background tones, and metadata.
3. **Monochrome Foundation**: Solidify layout, optical weights, and spacing in grayscale before introducing brand or accent hues.
4. **Stepped Scale Discipline**: Enforce a strict 4px/8px geometric interval for spacing and a fixed 6-tier type scale. Eliminate arbitrary pixel values (e.g., `13px`, `22px`, `38px`).
5. **Whitespace-First Grouping**: Separate distinct sections using whitespace (`gap-8`, `space-y-6`) and subtle surface shifts rather than heavy 1px borders.

### The 10 Atomic Heuristics

| # | Heuristic Domain | Core Problem Solved | Primary Tool / Technique |
| :--- | :--- | :--- | :--- |
| **01** | **Visual Hierarchy** | Everything competing for attention | Primary focal point + aggressive de-emphasis of secondary elements |
| **02** | **Typography Scale** | Inconsistent, uncalibrated font sizes | 6-tier scale with proportional line-heights and optical font weights |
| **03** | **Color Palette** | Garish, saturated, or arbitrary colors | 9-step neutrals + primary brand hue + functional status semantics |
| **04** | **Spacing Grid** | Arbitrary margins and cramped layouts | Fixed 4px/8px spacing ramp; generous component padding |
| **05** | **Button Hierarchy** | Competing CTAs of equal visual weight | Primary (Solid), Secondary (Ghost/Outline), Tertiary (Link/Minimal) |
| **06** | **Visual Clutter** | Border soup, redundant labels, noisy boxes | Surface contrast, directional spacing, removing self-evident labels |
| **07** | **Empty States** | Blank, lifeless screens that confuse users | Action-oriented onboarding, illustrative placeholder, direct CTA |
| **08** | **Shadows & Depth** | Flat cards, muddy dropshadows | Layered 2-part shadows with ambient light and simulated elevation |
| **09** | **Color Contrast** | Low-contrast text failing accessibility | WCAG AA compliance (≥ 4.5:1 text, ≥ 3:1 UI components) |
| **10** | **Grouping & Proximity** | Related items drifting apart | Law of proximity: spacing *inside* group must be < spacing *between* groups |

---

## Procedure

Always execute UI refactoring in this ordered sequence to prevent circular styling edits:

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│ 1. Triage &     │ ──▶ │ 2. Structural &     │ ──▶ │ 3. Polish &      │ ──▶ │ 4. Verification &   │
│    Hierarchy    │     │    Spacing System   │     │    Visual Weight │     │    Contrast Oracle  │
└─────────────────┘     └─────────────────────┘     └──────────────────┘     └─────────────────────┘
```

### Step 1 — Element Inventory & Hierarchy Triage
1. **Identify the Single Primary Focal Point**: Determine the one action or data point that matters most in this viewport section.
2. **Assign Tiers (1 to 3)**:
   - **Tier 1 (Primary)**: Key metric, main CTA button, primary header.
   - **Tier 2 (Secondary)**: Supporting text, input fields, secondary actions, table rows.
   - **Tier 3 (Tertiary / Metadata)**: Timestamps, field labels, breadcrumbs, helper hints.
3. **Execute De-emphasis**: Tone down all Tier 3 elements before increasing the size of Tier 1.

### Step 2 — Spatial Grid & Whitespace Architecture
1. **Strip Border Soup**: Delete interior 1px borders dividing cards, list rows, and sidebar items.
2. **Establish Proximity**:
   - Spacing *between related label and input*: `gap-1.5` or `mb-1.5` (4–6px).
   - Spacing *between distinct form fields*: `gap-4` or `space-y-4` (16px).
   - Spacing *between major layout sections*: `gap-8` to `gap-12` (32–48px).
3. **Increase Component Breathing Room**: If a card or container feels cramped, double the inner padding (e.g., upgrade `p-3` to `p-6`).

### Step 3 — Typography & Color Systematization
1. **Apply Stepped Typography Scale**:
   - Page Titles: `text-2xl` to `text-3xl` (`font-bold`, `tracking-tight`, `leading-tight`).
   - Section Headers: `text-lg` to `text-xl` (`font-semibold`, `tracking-tight`, `leading-snug`).
   - Body Copy: `text-sm` to `text-base` (`font-normal`, `leading-relaxed`).
   - Metadata / Badges: `text-xs` (`font-medium`, `text-muted-foreground`, `tracking-normal`).
2. **Standardize Color Tokens**:
   - Darken/lighten text using semantic steps (`text-foreground` → `text-muted-foreground` → `text-muted-foreground/70`).
   - Ensure interactive accents are reserved for actionable targets (links, active tabs, primary CTAs).

### Step 4 — Elevation, Borders & Surface Treatment
1. **Apply Natural Elevation**: Replace harsh single-line shadows (`box-shadow: 0 4px 6px rgba(0,0,0,0.3)`) with subtle layered shadows:
   ```css
   box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
   ```
2. **Use Background Surface Shifts**: Separate cards using subtle background contrast (`bg-background` on `bg-muted/40` parent) rather than heavy outlines.

---

## Pitfalls

- **Relying Exclusively on Font Size for Hierarchy**: Changing everything to huge text makes the UI loud and unreadable. Use font weight and muted colors to create contrast without size bloat.
- **Centering Everything**: Centered body copy or left-aligned labels with centered inputs creates ragged, amateur scanlines. Left-align text by default.
- **Using Pure Black Text on Pure White**: `#000000` text on `#FFFFFF` background creates harsh optical vibration. Use a deep slate or zinc neutral (`#0f172a` or `#18181b`).
- **Icons Without Optical Balance**: Raw icon SVGs often look heavier than adjacent text. Size icons down by 1 step (e.g., 16px icon beside 14px text) and apply muted color.
- **Burying Actions in Low-Contrast Grays**: Never set placeholder or button text so light that it fails WCAG AA standards.

---

## Verification

Before signing off on any UI refactor, verify every gate:

- [ ] **Squint Test Passed**: The primary action or metric remains unmistakably distinct when looking at the interface through blurred vision.
- [ ] **Zero Arbitrary Values**: All margins, paddings, and font sizes map 1:1 to defined scale tokens (Tailwind / CSS variables).
- [ ] **Single Primary Action**: Exactly one primary CTA exists per visible section or modal; secondary actions use outline/ghost styles.
- [ ] **Proximity Law Upheld**: Inner spacing within any logical component is strictly smaller than outer spacing to adjacent components.
- [ ] **WCAG AA Compliance**: All text-to-background contrast ratios measure ≥ 4.5:1 (normal text) and ≥ 3:1 (large text and UI components).
- [ ] **No Border Overload**: Structural separation is achieved primarily through whitespace and background tinting, not nested boxes.

---

## 📚 Disclosed Reference Guides

For deep reference on specific heuristics, consult the specialized guides in `references/`:
- [01-visual-hierarchy.md](references/01-visual-hierarchy.md) — Sizing, optical weight, and focal points.
- [02-typography-scale.md](references/02-typography-scale.md) — Modular type scales and line-height ratios.
- [03-color-palette.md](references/03-color-palette.md) — Neutrals, primary brand, and semantic state hues.
- [04-spacing-layout.md](references/04-spacing-layout.md) — 4px/8px spatial rhythm and component layouts.
- [05-button-hierarchy.md](references/05-button-hierarchy.md) — Primary, secondary, tertiary, and destructive button patterns.
- [06-visual-clutter.md](references/06-visual-clutter.md) — Eliminating border soup, redundant labels, and visual noise.
- [07-empty-states.md](references/07-empty-states.md) — High-value empty states, onboarding patterns, and action CTAs.
- [08-shadows-elevation.md](references/08-shadows-elevation.md) — Directional lighting, layered shadows, and elevation systems.
- [09-contrast-accessibility.md](references/09-contrast-accessibility.md) — WCAG 2.1 contrast formulas and accessible color pairing.
- [10-grouping-alignment.md](references/10-grouping-alignment.md) — Gestalt proximity, alignment grids, and optical balancing.

---

## 📜 Attribution & Licensing

- **Original Principles & Methodology**: Derived from the landmark design book [*Refactoring UI*](https://refactoringui.com/) by **Adam Wathan** and **Steve Schoger** (© Tailwind Labs Inc.). All conceptual design principles belong to the original authors.
- **Skill Formulation & Architecture**: Independent clean-room synthesis engineered by **Harsh Singh** for the **LifeOS** and **Muse Skills** open-source ecosystem.
- **Inspiration**: Acknowledgment to **George Nurijanian** (`gnurio/refactoring-ui-plugin`) for the initial concept of packaging Refactoring UI rules for agent runtimes.
- **License**: MIT License. Compatible with all autonomous agent runtimes.
