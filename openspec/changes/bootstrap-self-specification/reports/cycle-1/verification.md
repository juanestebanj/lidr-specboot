# Self-improvement cycle 1 — candidate evidence

Date: 2026-11-25. Status: implementation candidate; not accepted or released.

## Result
Specboot has used its source self-maintenance process to correct a defect in its
own packaged installer. Recorded symbolic-link errors now set process.exitCode
to 1. Successful processing and skips retain status 0. No runtime dependency,
forced process termination, rollback behavior, template synchronization or
autonomous recurring improvement has been added.

## Specification and evidence
- Plan: ../../self-improvement-plan.md.
- Contract: ../../specs/installer-exit-status/spec.md, requirement EXIT-01.
- Pre-implementation contract hash: specification-before-implementation.sha256.
- Original behavior: red.txt; 3 tests, 1 pass, 2 fail as expected.
- Corrected behavior: green.txt; 3 tests, 3 pass, 0 fail.
- Test effectiveness: mutation.txt; removing the correction causes 2 regression failures while the successful-processing check still passes.
- Scenario mapping: traceability.txt; executable identities and references checked.
- Independent review: independent-review.md; see its verdict and limitations directly.
- Environment and machine results: results.json.
- Final post-review checks: final-focused.txt, final-traceability.txt and final-openspec.txt; all commands returned status 0. Official strict validation passed 6 items, 0 failures.
- Full native Windows suite: full-suite-windows.txt; status 1; # tests 30; # pass 21; # fail 9.

The full-suite failures are not waived and are not recorded as a passing suite.
The working extraction cannot materialize the original 44 symbolic links because
Windows denied creation with WinError 1314. Existing native installation/import
tests require that filesystem capability. The new tests isolate process behavior
with explicit test-only injection and do not prove native link installation.

## Provenance and distribution
The original uploaded ZIP remains unchanged. The candidate ZIP retains all
44 original symbolic-link entries and target bytes, and the complete packaged
template is unchanged. The shipped executable receives the one-line correction.
The source tree and customer template still differ in guidance; broader drift,
installer containment and rollback remain outside this cycle.
changes.json records per-file preimage and candidate SHA-256 values (excluding
itself to avoid recursive hashing), and source-changes.patch records textual edits.
Historical bootstrap logs and manifests describe the preceding candidate only.

## Acceptance and limits
- Independent review is separate evidence, not implementer or human acceptance.
- The full native suite must pass on a symlink-capable environment before release.
- Official OpenSpec strict validation passed using the existing local CLI; no new external CLI was installed.
- Git provenance/branch integration is pending because the input is a ZIP without Git history.
- Maintainer acceptance, synchronization, archival and publication remain pending.
- DB, HTTP API and browser QA are N/A: those surfaces were not changed.

## Reproduce
From an extracted, symlink-capable checkout with Node.js 18 or newer:

```sh
node --test --test-reporter=tap tests/installer-exit-status.test.cjs
node scripts/validate-traceability.cjs
node --test tests/*.test.cjs
```

The mutation experiment copies packages/ and the new regression test into a
temporary tree, removes only the process.exitCode assignment, reruns the focused
tests, expects 2 failures and 1 pass, and discards the temporary mutant.
With a trusted OpenSpec CLI, also run openspec validate --all --strict.
