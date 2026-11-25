## 0. Setup

- [x] 0.1 Use isolated ZIP workspace; Git branch gate tracked in acceptance.md (no Git history).

## 1. Implementation

- [x] 1.1 Preserve provisional baseline and initial evidence; define remediation requirements before implementation.
- [x] 1.2 Correct factory maintenance mode and separate lifecycle gates (A01/A02).
- [x] 1.3 Correct manual import and customer onboarding (A03).
- [x] 1.4 Implement scenario traceability validation and negative tests (A04/A07).
- [x] 1.5 Reconcile QA applicability (A05).
- [x] 1.6 Inventory remaining capabilities (A06).
- [x] 1.7 Run applicable offline tests, record results and update documentation.

Only implementation work belongs here. Independent review, official CLI validation, final verification, maintainer acceptance and archival are tracked in acceptance.md; none is implied by checked implementation tasks.

## 2. Self-improvement cycle 1: installer exit status

- [x] 2.1 Specify EXIT-01 and reproduce the unchanged installer defect (2 failing regressions, 1 passing success/repeat check).
- [x] 2.2 Correct recorded-error exit status and align regression/traceability expectations.
- [x] 2.3 Run focused checks and mutation regression; record platform limitations and package integrity.

Cycle 1 acceptance is recorded separately; previous implementation evidence is historical.
