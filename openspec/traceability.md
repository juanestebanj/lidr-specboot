> **Self-manufacturing amendment:** MFG-01 through MFG-08 and T31-T47 extend the proposed bootstrap. Current mappings are in traceability.json; current evidence is in changes/self-manufacture-sdd/reports/. Historical cycle-1 counts/logs below remain historical.

> **Current candidate, cycle 1 (2026-11-25):** The original bootstrap narrative and tables below are historical. The authoritative current scenario mapping is `traceability.json`, checked by `scripts/validate-traceability.cjs`: 40 requirements, 54 scenarios and 47 test identities. EXIT-01 adds recorded-error status (T28/T29), successful processing (T30) and existing-entry preservation (T30). Focused tests use explicit test-only link injection; they do not establish native symlink installation. Current evidence, independent review and blocked release gates are in `changes/bootstrap-self-specification/reports/cycle-1/`. No historical passing log implies that the current full native suite passed.

# Scenario traceability

Canonical mapping: `openspec/traceability.json`. Every scenario has a stable ID, requirement and specification path, source artifacts, evidence kind and rationale. Run `node scripts/validate-traceability.cjs`. This validates reference integrity, not semantic adequacy; instruction tests do not prove agent compliance. Baseline and active deltas are provisional.

| Scenario | Evidence kind | Tests | Evidence scope |
| --- | --- | --- | --- |
| INV-01-S01 | structure | T25 | Factory acquisition/status inventory present. |
| INV-02-S01 | structure | T25 | Worktree and branch inventory present. |
| INV-03-S01 | structure | T25 | Every top-level canonical skill inventoried. |
| INV-04-S01 | structure | T25 | Execution and utility inventory present. |
| INV-05-S01 | structure | T25 | Installer recovery limitations inventoried. |
| SELF-01-S01 | instruction | T10, T12 | Baseline-first instructions present; no live agent conformance. |
| SELF-01-S02 | runtime | T03 | NPM installer excludes self-specifications and tests. |
| SELF-01-S03 | runtime | T11, T14 | Allowlist and observed manual import boundary. |
| SELF-02-S01 | structure | T01, T18, T19, T20, T21, T22, T23 | Reference, identity, coverage and corruption checks; semantic adequacy still reviewed manually. |
| SELF-03-S01 | instruction | T10, T13 | Pending independent review and maintainer acceptance preserved. |
| SELF-03-S02 | instruction | T13 | Separate apply and acceptance records checked. |
| SELF-04-S01 | instruction | T12 | Source maintenance override, not live Jira execution. |
| SELF-05-S01 | instruction | T13 | Implementation scope and ordered pending gates checked. |
| SELF-06-S01 | runtime | T14 | Empty target receives dedicated regular onboarding; source paths excluded. |
| SELF-06-S02 | runtime | T15 | Customer README and repeat behavior checked. |
| SELF-06-S03 | runtime | T16, T17, T27 | Conflicting regular/symlink onboarding and symlinked ancestor rejected. |
| SELF-07-S01 | instruction | T24 | Affected-surface rules checked; actual report records applicability. |
| FLOW-01-S01 | instruction | T07 | Order of named pipeline steps checked, not execution. |
| FLOW-02-S01 | instruction | T07 | Separate reviewer and handshake instruction checked. |
| FLOW-03-S01 | inspection | inspection only | Loop failure instructions, no live agent execution. |
| FLOW-03-S02 | inspection | inspection only | Single-pass instructions, no live agent execution. |
| FLOW-04-S01 | instruction | T07, T13 | Delivery prohibited inside pipeline; separate acceptance gates. |
| KNOW-01-S01 | runtime | T06 | Root compatibility link destinations verified. |
| KNOW-02-S01 | structure | T06, T25 | Canonical top-level skills inventory and agent links. |
| KNOW-03-S01 | inspection | inspection only | Section 7 requires specification update before post-apply code. |
| KNOW-04-S01 | runtime | T03 | Installer payload excludes root-only specs and tests. |
| INST-01-S01 | runtime | T03 | Explicit target installation and byte comparison. |
| INST-01-S02 | runtime | T04 | Default target via working directory. |
| INST-02-S01 | runtime | T03 | Template file contents compared in clean target. |
| INST-02-S02 | runtime | T05 | Existing file preserved and repeat copies zero. |
| INST-03-S01 | runtime | T03 | Expected root and agent links checked. |
| INST-04-S01 | runtime | T03, T05 | Normal completion summary and counts. |
| INST-04-S02 | runtime | T26 | Injected link failure reported; inherited zero exit status explicitly observed. (Historical pre-cycle observation; current cycle 1 T26 requires status 1.) |
| INST-05-S01 | structure | T02 | Package manifest fields; actual packaging separately checked. |
| ONB-01-S01 | instruction | T09, T14, T15 | Onboarding steps checked and manual import exercised; full setup not executed. |
| ONB-02-S01 | inspection | inspection only | Customization required; no live agent customization tested. |
| ONB-03-S01 | runtime | T03, T09 | CLI runs without optional external setup; setup instructions separate. |
| QA-01-S01 | instruction | T24 | Affected-surface applicability profile exists in controlling documents. |
| QA-02-S01 | instruction | T08 | Evidence reproduction and spec comparison instructions checked. |
| QA-03-S01 | inspection | inspection only | Mutation-style review of changed production logic prescribed. |
| QA-03-S02 | inspection | inspection only | Documentation-only exception inspected. |
