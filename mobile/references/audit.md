# audit — mobile audit mode

## When to Use

- **Store audit**: Verify app listing, keywords, screenshots, ratings, and store compliance are current
- **Launch audit**: Check iOS/Android launch readiness (store accounts, certificates, preview video, build submitted)

## Checklist

- [ ] App Store listing updated with latest version, screenshots, and release notes
- [ ] Keyword strategy documented and current
- [ ] Ratings and reviews monitored (weekly sweep)
- [ ] App Store/Play Store compliance checked (privacy policy, age rating, permissions)
- [ ] Latest store build version matches shipped version
- [ ] In-app analytics events firing correctly (see `analytics` audit)
- [ ] Push notification certificates valid (iOS)
- [ ] Google Play signing key current and backed up (Android)

## Severity & routing

| Severity | Action | Route to |
|:---|:---|:---|
| Store listing stale (>30 days) | `AUTO-REPAIR` | `content` (update listing copy) |
| Missing privacy policy URL | `PROPOSE-DIFF` | `qa-launch` (block release) |
| Certificate expired | `PROPOSE-DIFF` | `devops` (renew + re-sign) |
| Analytics events not firing | `REPORT-ONLY` | `analytics` audit |
| App not on latest OS version | `AUTO-REPAIR` | mobile (update build target) |

## Output

`.agents/artifacts/audit-mobile-<ts>.md` with findings table per canonical spec: `../skills/references/audit-mode-guidance.md`.
