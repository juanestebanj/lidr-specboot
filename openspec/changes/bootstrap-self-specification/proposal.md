## Why

Specboot teaches specification-driven development but the source snapshot contains no root OpenSpec product specifications. Establish a first baseline so its own evolution can use the same workflow.

## What Changes

- Establish five baseline capability specifications, repository-specific OpenSpec context and requirement traceability.
- Add a proposed self-maintenance capability and focused offline tests.
- Keep customer template and installer behavior unchanged.

## Capabilities

### New Capabilities
- `self-maintenance`: specification-first evolution, traceability and independent acceptance.

### Modified Capabilities
- None. The five baseline specifications document the existing product rather than changing its behavior.

## Impact

Root README, setup-sdd.md, root base standards, new `openspec/` and `tests/` files. Manual import guidance now uses an explicit reusable-path allowlist. No new dependencies or changes to published package payload, installer, skills or agent links.

## Audit remediation amendment (proposed)

See [remediation.md](remediation.md). Add `maintenance-capability-inventory` and strengthen the existing proposed `self-maintenance` delta. The five baseline capabilities remain provisional; scenario identifiers and the existing installer error scenario are descriptive refinements. Manual-import changes apply only to the canonical source; the NPM payload stays unchanged.

## Cycle 1 scope amendment: observable installer failure

The maintainer requested factory self-improvement. The bounded first cycle
adds EXIT-01 and repairs the packaged installer's success status on recorded
link errors. The CLI now sets process.exitCode to 1 for those errors; successful
processing and skips retain status 0. The customer template stays unchanged.
See self-improvement-plan.md and reports/cycle-1 for evidence and acceptance
limits. This amendment extends the earlier bootstrap scope; it does not approve
the baseline, release, archival or recurring autonomous changes.
