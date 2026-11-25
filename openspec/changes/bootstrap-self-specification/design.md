## Context

The snapshot provides agent instructions and an installer, but not product OpenSpec artifacts. An initial baseline must be reconstructed from the existing sources and clearly identified as provisional.

## Goals / Non-Goals

Goals: describe current product boundaries, apply Specboot's workflow to itself, expose evidence and keep customer distribution separate.
Non-goals: fix pre-existing installer vulnerabilities, synchronize existing template drift, change models, install external tools, run a live factory or claim formal conformance.

## Decisions

- Use native OpenSpec Markdown capability format (Purpose, Requirements, WHEN/THEN scenarios) and the documented config path. Do not introduce a second specification language.
- Keep self-maintenance as an active delta until independent review and maintainer acceptance. Initial baseline specs are proposed, not ratified.
- Add Node built-in tests without dependencies. CLI tests execute only in disposable empty directories; guidance tests verify text presence, not compliance.
- Use the root-only guide to specialize generic customer application QA for this repository. Preserve the package template byte-for-byte. Limit manual import instructions to explicit reusable paths to avoid exporting source-only specs.

## Risks / Trade-offs

- Reconstructed requirements may be incomplete; independent reviewer must check them against the original archive.
- Existing distribution drift and installer security gaps remain; no release is implied.
- Official OpenSpec CLI validation and Windows behavior are not demonstrated by offline checks.
- ZIP lacks Git history and does not establish a real feature branch or PR; perform those gates in a real clone before merge.

## Rollback

Remove the added openspec/ and tests/ trees and revert the README, setup guide and root base standards edits. No customer payload or production logic was changed.

## Remediation design amendment

The later remediation scope in remediation.md supersedes the initial design where they differ. Detect self-maintenance via source checkout and explicit task scope; preserve Jira queue selection but bypass greenfield-only restrictions for this mode. Separate apply and release gates. Use a local Node manual importer with a reusable-path allowlist, no external dependencies, conflict preflight and a regular onboarding file. Use JSON scenario mappings and a Node validator; distinguish source inspection, instruction checks and runtime tests. The inherited NPM installer remains unchanged. Roll back by restoring the preceding self-specified ZIP.

## Cycle 1 design amendment

EXIT-01 is implemented by assigning process.exitCode = 1 inside the existing
recorded-error report branch. This preserves output flushing, report wording,
copy/skip behavior and the package payload. It changes the shipped executable,
while leaving template guidance unchanged. T28-T30 use test-only filesystem
failure injection; native symlink behavior remains covered by the existing
suite and must be verified on a capable environment. A removal mutant must
reproduce the two error-status regressions. Source and template synchronization,
rollback, path containment and autonomous agent orchestration remain outside scope.
