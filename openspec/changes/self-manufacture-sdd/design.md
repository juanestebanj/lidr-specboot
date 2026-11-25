# Design

## Authority and boundaries
Repository main at f6c80442fa1d6cfefdbe25c2d9d0223ac89046c1 is the original baseline. The uploaded remediation and cycle 1 are proposed imports, not accepted upstream history. Work is isolated on feature/self-manufacture-sdd. GitHub connection branch writes returned403; local authenticated GitHub CLI is the allowed fallback if available.

## Build graph
Canonical docs/ and ai-specs/ -> scripts/build-template.cjs -> packages/specboot/template/ and template-manifest.json -> scripts/check-package.cjs -> npm payload -> installer smoke tests.
OpenSpec baseline/deltas -> scenario mapping -> self-check -> independent review -> CI -> human acceptance.

## Determinism
Use Node filesystem and crypto APIs without runtime dependencies. Sort paths using byte/lexical ordering, store portable forward-slash paths and SHA-256 values, and omit timestamps, absolute paths and machine-specific data. Manifest source and target digests refer to exact copied bytes. Repeated builds produce identical paths and bytes.

## Safety and source of truth
The generator owns only packages/specboot/template/ and packages/specboot/template-manifest.json. Validate source and output paths before writes; reject symbolic links or special files in canonical inputs or managed outputs rather than following them. Missing, changed and extra generated files fail check mode without mutation. Regeneration may remove stale regular generated files only inside the verified managed directory.
Root agent compatibility links are retained as Git symbolic links. The dedicated customer onboarding file is canonical and regular. No source-only root paths are copied.

## Verification
One self-check command checks generated drift, machine traceability, official OpenSpec strict validation and all source tests. It uses an exact pinned local OpenSpec dependency and propagates any failure. No skip/force-green options are added. Package checking invokes npm pack dry run without lifecycle scripts and enforces an explicit payload boundary.
CI uses Ubuntu-slim only, Node24, pinned official action commits, npm ci --ignore-scripts, self-check and package-check. No write token or release operation.

## Agent loop
The external AI agent reads relevant current baseline and active changes, creates/updates proposal/design/scenarios/tasks before code, writes failing tests, implements source changes, regenerates, runs checks, and requests a separate adversarial review. Reviewer and human acceptance remain separate gates; acceptance and archival are never implementation checkboxes. No code claims to enforce external agent behavior or human identity.

## QA applicability
Filesystem, CLI, generated artifact, specification, packaging and documentation QA apply. Database, HTTP API and browser QA are N/A. Windows native symlink failures remain visible; Linux CI must run the complete suite.
