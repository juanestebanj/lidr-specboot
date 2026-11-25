# Self-improvement cycle 1: observable installer failure

Status: proposed, implementation and review evidence recorded separately.

## Original request
Make the software factory improve itself.

## Bounded interpretation and definition of done
Use Specboot source self-maintenance mode to improve one measurable existing defect:
the npm installer records symbolic-link failures but reports process exit status 0.
Specify first, demonstrate a failing regression against the unchanged installer,
implement a minimal correction, then obtain separate review and rerun checks.
The deliverable is a revised candidate archive with reproducible evidence; it is
not a ratified release, autonomous learning system, or permission for future changes.

## Scope
- Amend the existing bootstrap change; EXIT-01 defines three observable scenarios.
- Change packages/specboot/bin/init.js to set process.exitCode = 1 on recorded errors.
- Correct the historical T26 expectation and add T28-T30 regression coverage.
- Extend scenario traceability and update exact-count assertions.
- Record original archive provenance, source changes, red/green evidence and review.
- Preserve original ZIP symbolic-link entries in the deliverable.
- Keep independent review, official CLI validation, human acceptance and archival separate.

## Design and tradeoffs
A one-line process.exitCode assignment preserves output flushing, summary wording,
skip behavior, copy behavior and the package payload. This does not call process.exit()
or introduce a runtime dependency. New regression tests use a test-only preload
to inject fs.symlinkSync failures deterministically; successful actual installation
remains covered by the existing native filesystem tests where supported.
The CLI and packaged template contents remain distinct: this change modifies the
shipped executable, not the customer guidance template.

## QA
Automated tests, CLI failure injection, traceability, and artifact integrity apply.
DB, HTTP API and browser checks are N/A: no corresponding surface changes.
Regression tests must reject a mutant with the exit-code correction removed.
Native Windows symlink capability and any unavailable external tools must be
reported honestly. Official OpenSpec validation requires a trusted installed CLI.
Existing installer security gaps and broader template drift remain outside scope.

## Repeatable loop
1. Select a measured defect from the capability inventory.
2. Specify a bounded change and evidence required before implementation.
3. Capture a failing regression.
4. Implement the smallest correction.
5. Have a separate reviewer reproduce evidence and inspect the diff.
6. Rerun verification, record limitations, and present the candidate for acceptance.
7. Start another cycle only within an authorized scope.
