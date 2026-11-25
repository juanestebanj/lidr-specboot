# Self-manufacturing verification candidate

Status: implementation candidate; independent review and Linux CI pending.

## Scope and provenance
Original fork main: f6c80442fa1d6cfefdbe25c2d9d0223ac89046c1.
The branch imports the proposed uploaded bootstrap and cycle-1 evidence, then defines
self-manufacturing contracts in commit eb744c7 before the new implementation.
Historical bootstrap logs remain historical; no prior acceptance is inferred.
The GitHub connection rejected branch writes; authenticated local Git/gh is used.

## Recorded local evidence
- Generator first run: 10 tests, 0 passed, 10 failed before implementation.
- Self-check/payload first run: 6 tests, 0 passed, 6 failed before implementation.
- Actual packed-product first run: 1 expected failure before smoke implementation.
- Final local suite: 47 tests, 34 passed, 13 failed, 0 skipped.
- The 13 failures require native symbolic links denied by this Windows sandbox or
  its core.symlinks=false Git checkout; they remain visible and are not waived.
- Generated drift check and scenario traceability passed (40 requirements,
  54 scenarios, 47 test identities).
- Exact local OpenSpec1.3.1 strict validation passed all7 items.
- npm payload verification passed125 entries; actual tarball installation is
  exercised by T47 and requires native symlink capability for the final install.
- Canonical generation contains122 exact source files; source-only root artifacts
  are excluded from customer projects.
- Locked dependency installation completed with lifecycle scripts disabled,
  75 packages audited and0 vulnerabilities reported by npm at installation time.

## Applicability
Filesystem, CLI, package, provenance, specifications and documentation checks apply.
Database, HTTP API and browser UI checks are N/A because no such surface changes.
Source generation is not transactional and does not claim concurrent filesystem
attacker protection. AI behavior and human acceptance are documented obligations,
not a runtime identity/approval enforcement engine.

## Pending
Independent adversarial review, full Linux CI, final verification and human
acceptance remain separate. No merge, release, publication or archival is authorized.
