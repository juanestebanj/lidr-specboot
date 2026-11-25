# Remediation scope (proposed, not accepted)

Amend the active bootstrap rather than open a conflicting delta. Inputs: original ZIP SHA-256 `388b444c9a5b1f1ebe459d732f6806e4d4cdc62e9c85c05ba64626cd82718898`; self-specified ZIP SHA-256 `c8f816621ac098265d228d1d4608166040e1983eb8a40d6c207d5486f98fd95f`.

| Finding | Proposed contract | Verification |
| --- | --- | --- |
| A01 | SELF-01, SELF-04: source self-maintenance overrides Jira greenfield restrictions; relevant baseline and active deltas required, customer greenfield unchanged | T12 |
| A02 | SELF-03, SELF-05: implementation checkboxes only; separate ordered acceptance gates; no self-approval, no archive inside factory | T13 |
| A03 | SELF-06: dedicated regular customer onboarding file; manual import preserves customer README and fails if onboarding conflict | T14–T17 |
| A04 | SELF-02: validated source paths, test IDs and mapping completeness; reject invalid references | T18–T23 |
| A05 | SELF-07: explicit QA applicability based on affected surfaces, evidence for N/A, no fictional application checks | T24 |
| A06 | INV-01–INV-05: inventory remaining capabilities and distinguish documented obligations from verified behavior | T25 |
| A07 | SELF-02 and INST-04: stable scenario IDs, scenario evidence references, error-reporting scenario | T18, T26 |

Non-goals: installer security hardening, general template synchronization, actual agent orchestration engine, CI deployment, external installations, ratification or archival. Existing package template and CLI stay unchanged; canonical manual import receives the corrections. The old baseline is provisional, and inventory additions are not a complete behavioral specification of every skill. Official CLI validation and a separate reviewer are acceptance gates, not implementation claims.

## Subsequent cycle 1 amendment (2026-11-25)

The earlier non-goal preserving the CLI unchanged applies to the preceding
remediation only. The current self-improvement cycle explicitly changes the
installer executable to repair its recorded-error exit status under EXIT-01.
The packaged template remains unchanged. See self-improvement-plan.md and
reports/cycle-1 for current evidence, provenance and pending acceptance gates.
The earlier verification logs and manifest remain historical evidence.
