# onpage — On-page: titles, meta, headings, internal links, structured data, snippet quality.

## Intake

- Target page(s) and their target queries
- Current rankings and snippet appearance
- SERP shape for each query (what's ranking and why)
- Content authority of the page (depth, uniqueness)
- Default stack: open-seo tools (or proprietary equivalent).

## Deliverable

Per-page optimization spec: title (≤ 60 chars, front-loaded), meta description (≤ 155, CTA-shaped), H-structure, entity/keyword mapping, internal-link additions with anchors, and schema markup validated per schema.org.

## Procedure

1. Check the live SERP: what formats rank (PAA, video, listicles) — match the winning shape.
2. Title: primary query front-loaded, brand at end if it fits, ≤ 60 chars.
3. Meta description: benefit + proof + CTA; ≤ 155 chars.
4. H-structure: one H1 = page promise; H2s = sub-promises; no skip levels.
5. Map entities/keywords to sections — full coverage, zero stuffing.
6. Internal links: 3–5 contextual additions from relevant authority pages, descriptive anchors.
7. Schema: choose the type(s) (Article, Product, FAQ, HowTo) and validate.
8. Combine multiple types on one page with a single JSON-LD `@graph`; validate in order — Rich Results Test, then Schema.org validator, then GSC Enhancements after deploy. Dates ISO 8601, URLs fully qualified, markup matching visible content exactly.
9. Re-check snippet after deploy (CTR is the on-page KPI, not vibes).
10. Image audit by role tier: alt-text classes per role, file-size thresholds by role, modern-format ladder; never lazy-load the hero, set fetchpriority on the LCP image, and check CLS.
11. Page-type mismatch check first: classify the SERP's dominant page type (strong consensus >60%, mixed 40-60%, fragmented <40%) — a technically perfect page of the wrong type never ranks; on mismatch, build the matching page type instead of optimizing.
12. Product-page specifics: breadcrumb trail (Home > Category > Product), unique description (200+ words, never manufacturer copy) plus specs table plus on-page reviews, 3+ images (800px+, descriptive filenames, `<picture>` AVIF → WebP → JPEG), keyword-rich filenames, and og:image tags with dimensions/alt.

## Quality gate

- [ ] Title/description within limits and query-matched.
- [ ] SERP-shape matched (format follows what ranks).
- [ ] One H1; logical H2/H3 depth.
- [ ] Internal links added from real authority pages.
- [ ] Schema validates for its type.
- [ ] Multi-type pages use one `@graph`; validation order honored (Rich Results → Schema.org → GSC Enhancements); dates/URLs exact, markup matches visible content.
- [ ] Images pass role-tiered audit (alt classes, size thresholds, modern formats; hero eager + fetchpriority, CLS clean).
- [ ] Keyword density checked: primary 0.5–1.5%, semantic variations present, no stuffing (keeper: wshobson/seo-technical-optimization).

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.
