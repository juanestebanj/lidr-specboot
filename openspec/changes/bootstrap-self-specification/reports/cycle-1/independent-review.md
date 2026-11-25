# Independent adversarial review: self-improvement cycle 1

Date: 2026-11-25. Reviewer: a separate agent/session from the implementer.
Scope: bootstrap-self-specification, EXIT-01 installer process status.
Mode: source self-maintenance. Jira id: none. No acceptance or archival performed.

## Specification and implementation alignment

I read the cycle plan and EXIT-01 scenarios before examining implementation, and
applied the repository adversarial-review and mutation-testing guidance. Git
history is unavailable, so I compared the executable and template directly to
the original uploaded ZIP instead of assuming a branch or merge-base history.

The production logic change is exactly one assignment, process.exitCode = 1,
inside the existing recorded-error reporting branch. It satisfies the scoped
contract without forcing process termination, removing report output or changing
copy/skip behavior. The three scenarios cover single/multiple recorded errors,
successful processing and repeated installation preserving customer bytes.

All 118 packaged template files were independently compared byte-for-byte with
the original ZIP and were unchanged. Template/source guidance synchronization,
installer containment, rollback and general Windows support are not claimed.

The final proposal, design and remediation amendments explicitly extend the
earlier CLI-preservation scope. The final traceability notice is at the top,
labels prior evidence historical, and distinguishes the old T26 zero-status
observation from the current status-one requirement. Direct Unicode checks found
zero introduced U+FFFD replacement characters in those four modified documents.

## Independently reproduced evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Original ZIP executable with T28-T30 | 1 pass, 2 fail; expected red status regressions | independent-red-original.txt |
| Candidate T28-T30 | 3 pass, 0 fail | independent-green.txt |
| Scenario mapping validator | Passed; 32 requirements, 44 scenarios, 30 test identities | independent-traceability.txt |
| Official OpenSpec strict validation | 6 passed, 0 failed | independent-official-validation.json |
| Full native Windows suite | 21 pass, 9 fail; NOT a passing suite | independent-full-suite-windows.txt |
| Native installer diagnostics for T03-T05 | 3 fail; 108 EPERM symlink messages across the three runs | independent-native-diagnostics.txt |

Commands reproduced from the source root:

```sh
node --test --test-reporter=tap tests/installer-exit-status.test.cjs
node scripts/validate-traceability.cjs
openspec validate --all --strict
node --test --test-reporter=tap tests/installer-exit-status.test.cjs tests/remediation.test.cjs tests/self-spec.test.cjs
```

The original-executable replay and mutants ran in separate disposable copies.
The diagnostic-only rerun exposed child-process stdout; it did not replace native
links or modify production/tests. Machine summaries are in independent-results.json.

## Mutation analysis

Only the changed production behavior was mutated; no new mutation framework was
installed. All three meaningful mutants were executed and rejected:

| Mutant | Observed detection |
| --- | --- |
| Remove the exitCode assignment | T28/T29 fail; T30 passes |
| Assign status 2 instead of 1 | T28/T29 fail; T30 passes |
| Make the error/status branch unconditional | T30 fails; T28/T29 pass |

There were no survivors among these three mutants. This is bounded effectiveness
evidence, not an exhaustive mutation score or a proof of all installer behavior.

## Native test failures: individual disposition

| Tests | Observed cause | Scope of conclusion |
| --- | --- | --- |
| T14, T15 | Importer lstat reports ENOENT for source AGENTS.md | The Windows extraction could not materialize the source symbolic link; native import is unverified here. |
| T06 | readlink reports ENOENT for source AGENTS.md | Source link integrity cannot be exercised in this extracted environment. |
| T16, T27 | EPERM when the tests create symbolic-link fixtures | The tests fail before exercising the intended importer cases. |
| T26 | Report contains 36 errors: one injected error plus 35 native EPERM errors, while the assertion expects exactly one | The old native fixture requires link privileges; the new deterministic T28 independently tests the single-error contract. |
| T03, T04, T05 | Installer child returns failure; diagnostic replay exposes 36 EPERM link errors per installation | EXIT-01 correctly makes these incomplete native installations nonzero. Successful native installation remains unverified. |

These nine failures are not waived, hidden by skips or relabeled as passing.
The new success fixture deliberately simulates link creation only to isolate
process status; it is not evidence of successful native symbolic-link creation.
The read-only WSL inventory command returned Wsl/E_ACCESSDENIED. No accessible
Linux fallback was established, and no distributions or tools were installed.

## Findings and remaining gates

No blocker or major implementation defect was found in the bounded EXIT-01
change. The remaining test gap is native filesystem assurance: the complete
suite must pass on a symbolic-link-capable environment before release. Existing
source/template drift and installer security limitations remain outside this
cycle and must not be treated as repaired by this patch.

Official strict validation passed, but it does not establish semantic adequacy,
live agent compliance or complete runtime conformance. The provisional baseline,
Git provenance/integration, maintainer acceptance and archival gates remain
separate. This review does not accept the broader bootstrap or release.

## Provenance and review boundary

Original ZIP SHA-256:
b27f483791a4d831950f7b4f52b3e682e7eedc9053f16efebbfee578f718a6a7

Final reviewed executable SHA-256:
3749eb68649a14b99391ef177ce3e1f50bf5c3b246848fb6a8773a0c7d008839

The independent runtime replay preceded restoration of original LF newlines;
its CRLF-serialized executable hash is recorded in independent-results.json.
I subsequently verified that the final executable text is still exactly the
original plus the single assignment, and that the final documentation amendments
do not change runtime requirements. Final post-review checks and ZIP link/hash
preservation are the coordinator's separate packaging evidence, not claims of
an independent review of an archive that did not yet exist at review time.

## Verdict

PASS WITH GAPS for the bounded EXIT-01 code change and its focused evidence.
Full native release assurance is BLOCKED / NOT ESTABLISHED. Archiving or releasing
the factory is not advisable in the current state. A reviewable candidate may be
packaged with these limitations and pending gates preserved.
