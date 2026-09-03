# Claim Verification Taxonomy Reference

## Hierarchy of Factual Grounding

1. **`[RAW]` (Direct Local Evidence)**:
   - Command stdout/stderr logs.
   - Local file contents and line ranges.
   - Automated test suite results.
   - Highest confidence ($1.0$).

2. **`[FETCH]` (Authoritative Primary Source)**:
   - Official API documentation (e.g., nodejs.org, bun.sh).
   - W3C / RFC specifications.
   - Primary peer-reviewed research papers.
   - Confidence: $0.95$.

3. **`[SEARCH]` (Secondary Corroborated Source)**:
   - Multiple independent engineering blogs or community discussions.
   - Must have 2+ concordant sources.
   - Confidence: $0.80$.

4. **`[INFER]` (Structured Logical Deduction)**:
   - Agent extrapolation from known premises.
   - Must explicitly list the reasoning chain.
   - Confidence: $0.70$.
