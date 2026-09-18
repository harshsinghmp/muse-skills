# technical — Technical SEO: crawl, render, index, canonical, sitemap, robots, hreflang.

## Intake

- Domain(s) and staging vs production URLs
- Search Console (or equivalent) access/export
- Platform (server, CMS, framework) — determines fix path
- Known symptoms (pages not indexed, wrong URLs ranking)
- Default stack: Screaming Frog, open-seo tools, RustySEO, PageSpeed Insights (or proprietary equivalent).

## Deliverable

Technical findings doc: crawl report, index-coverage issues with causes, canonical/robots/sitemap corrections, redirect map, hreflang matrix (if multi-locale), and a prioritized fix list with impact × effort.

## Procedure

1. Crawl the site (crawler of choice); note redirect chains, broken links, orphan pages.
2. Check robots.txt and meta robots per template — find noindex/nofollow accidents.
3. Verify the crawler's-eye view first: fetch key templates with JS disabled and confirm the content is in the raw HTML; check the `X-Robots-Tag` HTTP header alongside the meta tag — a staging `noindex` leaked to production voids everything else.
4. Verify index coverage in GSC: submitted vs indexed; identify pattern (section? parameter? rendering?).
5. Canonical audit: self-referencing norms, duplicates (www/http/params), pagination handling.
6. Sitemap: complete, canonical-only URLs, submitted and fetchable.
7. Rendering check: is content server-rendered or JS-gated for crawlers? JS-gated = fix or SSR/SSG.
8. Core Web Vitals pass: LCP/INP/CLS from field data; fix only failing templates.
9. Write the fix list prioritized by impact × effort with owner-ready specs.
10. Hreflang seven-check order: valid language-region codes, self-referencing tags, return tags present, canonical alignment, one URL per locale, x-default set, no conflicting signals.
11. Sitemap health: lastmod staleness and fake-date detection, canonical-only URLs, no conflicts with robots/noindex/canonical.
12. Redirects: flatten chains to single-hop, verify each target live, log every mapping, snapshot pre-change state with rollback behind an approval gate.
13. Robots bot-split + IndexNow: check training vs search bots separately (GPTBot blocks training only, OAI-SearchBot governs ChatGPT Search citability; Google-Extended blocks training/grounding only, Googlebot governs Search/AI-Overview eligibility) — never infer one from the other; ping IndexNow for fast non-Google indexing where supported.

## Quality gate

- [ ] Crawl and index state measured, not assumed.
- [ ] JS-off HTML confirmed on key templates; header-level `X-Robots-Tag` checked — no staging `noindex` leak.
- [ ] Every finding names its evidence (URL, GSC report line).
- [ ] Canonical/robots/sitemap corrections are exact (not 'review this').
- [ ] Redirects are single-hop, loop-free.
- [ ] Fix list is impact × effort ranked.
- [ ] Hreflang passes the seven-check order.
- [ ] Sitemap passes health (honest lastmod, canonical-only, no conflicts).
- [ ] Redirects flattened, verified, logged, with rollback snapshot approved.

## Render-verify via real browser (optional — dev-browser CLI, new tool, OSS, never assumed)

Reuse: step 7 asks whether content is JS-gated for crawlers; a real-browser goto + snapshot answers it against the step-3 JS-off baseline.

- [ ] `goto` key template → `waitForLoad` → `snapshot`; diff visible text vs the JS-off HTML from step 3.
- [ ] In snapshot but missing JS-off = JS-gated → fix or SSR/SSG per step 7.
- [ ] Re-snapshot after every navigation (refs reset); record headless vs headed profile.

## Routing

- Flagged cost/perf routes (platform bill, function invocations, failing CWV templates beyond quick wins) route to `webdev` performance mode for the metrics-first audit and ranked cost+perf report; `seo` technical mode verifies the result. Source: `vercel-labs/agent-skills` (`skills/vercel-optimize/SKILL.md`).

## Sources

Reference URLs provided for this mode are listed here. When a cited source conflicts with a default above, the source wins — record the override and why.
