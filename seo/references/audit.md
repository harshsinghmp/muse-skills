# audit — seo audit mode

## When to Use

- **SERP audit**: On-page, off-page, technical SEO health
- **Content freshness audit**: Identify stale content needing update

## Checklist

- [ ] Title tags ≤60 chars, unique per page
- [ ] Meta descriptions ≤160 chars, unique
- [ ] Heading hierarchy logical (h1→h2→h3, no skips)
- [ ] All images have alt text
- [ ] Canonical URLs set for duplicate content
- [ ] Sitemap.xml present and valid
- [ ] robots.txt not blocking indexable pages
- [ ] Core Web Vitals within thresholds (LCP ≤2.5s, FID ≤100ms, CLS ≤0.1)
- [ ] Internal links use descriptive anchor text
- [ ] No broken internal links (404 detection)
 - [ ] Content refreshed within documented cadence
 - [ ] Schema verdicts never rest on static fetch alone: `web_fetch`/`curl` strip `<script>` and miss JS-injected JSON-LD — confirm "no schema" via browser DOM query, Rich Results Test, or Screaming Frog before reporting (source: marketingskills `seo-audit` SKILL.md).

## Severity & routing

| Severity | Action | Route to |
|:---|:---|:---|
| Broken internal link | `AUTO-REPAIR` | update link or add redirect |
| Missing meta description | `AUTO-REPAIR` | `content` (generate) |
| Core Web Vitals fail | `REPORT-ONLY` | `webdev` (perf fix) |
| Stale content (>12mo unupdated) | `REPORT-ONLY` | `content` (refresh) |
| Duplicate title tags | `AUTO-REPAIR` | `seo` (differentiate) |

## Output

`.agents/artifacts/audit-seo-<ts>.md` with findings table per canonical spec: `../skills/references/audit-mode-guidance.md`.
