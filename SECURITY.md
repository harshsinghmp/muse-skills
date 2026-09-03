# Security Policy

## Reporting a vulnerability

Do not open a public issue for security reports.

Report vulnerabilities privately via GitHub Security Advisories:
<https://github.com/harshsinghmp/muse-skills/security/advisories/new>

Include:

- Affected skill(s) and file paths
- Reproduction steps or proof of concept
- Impact assessment

You will receive an acknowledgment within 72 hours. Fixes are prioritized by
severity; credit is given unless you prefer otherwise.

## Scope

In scope: skill prompt-injection vectors, secret leakage in shipped files,
unsafe script execution (`scripts/`), malicious content in `references/` or
`examples/`.

Out of scope: issues in downstream runtimes (Claude Code, Codex, etc.),
social engineering, and theoretical findings without a working exploit path.

## Supported versions

Only the latest release (see the version badge in
[README.md](README.md)) receives security fixes.
