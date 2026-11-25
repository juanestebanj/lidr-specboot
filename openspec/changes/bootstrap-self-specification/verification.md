# Remediation verification — implementation evidence only

Status: active/proposed, not ratified or archived. The earlier bootstrap evidence is preserved verbatim in verification-initial.md. This report is from the implementing session; it is not independent acceptance.

## Provenance and scope

Both input archives retained their original SHA-256 values (see remediation.md). Work was performed in an isolated extracted copy, not an actual Git clone. The three remediation specification artifacts were written before the implementation files; their SHA-256 values are recorded in specification-before-implementation.sha256 and were rechecked after tests. This record is implementer evidence, not independently timestamped provenance.

## Reproduction

Linux, Node v22.16.0, npm 10.9.2. No external setup tools, Jira operations or live agents invoked. From repository root:

```sh
node --test tests/*.test.cjs
node scripts/validate-traceability.cjs
(cd packages/specboot && npm pack --dry-run --offline --ignore-scripts --json)
sha256sum -c openspec/changes/bootstrap-self-specification/specification-before-implementation.sha256
```

27 tests passed, zero failed/skipped; full TAP output in test-output.txt. Traceability validator reported 31 requirements, 41 scenarios, 27 unique test IDs. YAML configuration parsed successfully. Offline NPM dry run listed 120 entries (bin/, template/, package.json only); see npm-pack-dry-run.json. Package installer and template remain byte-identical to inputs.

## Finding disposition

| Finding | Implementation | Evidence | Residual limitation |
| --- | --- | --- | --- |
| A01 | Source self-maintenance precedence, active change reuse, customer greenfield preserved | T07, T12 | Instruction checks, no live Jira or agent run |
| A02 | Implementation-only tasks and ordered separate acceptance record | T10, T13 | Not an executable lifecycle engine; separate reviewer pending |
| A03 | Dedicated regular customer onboarding, allowlisted local importer | T11, T14–T17, T27 | Linux only; no atomic rollback or concurrent filesystem protection guarantee |
| A04 | Machine-checked scenario mapping references | T01, T18–T23 | Does not prove semantic relevance of every valid reference |
| A05 | Unified affected-surface QA profile | T24; applicability below | Live agent compliance unverified |
| A06 | Expanded proposed capability inventory and five inventory requirements | T25 | Inventory is not a full behavioral contract for each skill |
| A07 | Stable scenario IDs, classified evidence, injected installer link-error check | T18, T26; traceability.json | Existing installer still exits zero on recorded link error; no claim of repair |

## QA applicability

- Automated tests: applicable, 27 passed.
- Filesystem/CLI: applicable, exercised in disposable targets; negative import, link and mapping cases passed. Injected failure validates existing installer reporting without changing installer.
- Database: N/A, no database introduced or changed.
- HTTP API: N/A, no endpoint introduced or changed.
- Browser UI: N/A, no browser UI introduced or changed.
- Documentation: applicable, updated factory, QA, setup and traceability. No fictional reports for N/A surfaces.
- Adversarial test effectiveness: controlled negative input cases executed; no exhaustive mutation-testing tool run. Separate reviewer must assess semantic coverage and independently reproduce the results.

## Pending gates and exclusions

Official OpenSpec CLI unavailable; strict validation pending. Git feature branch unavailable in ZIP-only environment. Independent reviewer, final verification, maintainer acceptance and separate archival authorization remain pending. Windows and live agent execution untested. Pre-existing NPM installer vulnerabilities, package-template drift, model-routing contradictions and broader capability completeness remain out of scope. The one intentional symbolic-link type change is ai-specs/specboot-instructions.md, replaced by a regular dedicated customer document. All other original links are preserved. No publication, commit, merge, Jira transition, ratification or archive operation performed.
