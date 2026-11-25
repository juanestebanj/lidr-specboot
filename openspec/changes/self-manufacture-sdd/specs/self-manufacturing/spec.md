## ADDED Requirements

### Requirement: MFG-01 Canonical distribution generation
The source repository SHALL generate its customer template solely from canonical regular files beneath docs/, ai-specs/ and the existing .cursor/rules/ adapter configuration, excluding source-only root artifacts, and SHALL reject symlinks and special files in managed input/output trees before mutating generated artifacts. The existing Cursor discovery rule SHALL remain part of the generated product.

#### Scenario: MFG-01-S01 Canonical generation
- **WHEN** the build runs against valid canonical inputs
- **THEN** the generated tree contains exactly the corresponding docs/, ai-specs/ and .cursor/rules/ files

#### Scenario: MFG-01-S02 Unsafe filesystem entry
- **WHEN** a managed input or output contains a symbolic link or special file
- **THEN** generation fails before writing through it

### Requirement: MFG-02 Reproducible provenance
The generator SHALL produce stable sorted portable paths and exact SHA-256 source/target digests in template-manifest.json, without timestamps or absolute paths, and repeated generation SHALL produce identical artifact bytes.

#### Scenario: MFG-02-S01 Repeated generation
- **WHEN** the same canonical bytes are generated twice
- **THEN** both template contents and provenance manifest are byte-identical

### Requirement: MFG-03 Non-mutating drift detection
Check mode SHALL fail for missing, modified or extra generated files or an incorrect manifest and SHALL leave all inspected artifact bytes unchanged.

#### Scenario: MFG-03-S01 Artifact drift
- **WHEN** a generated file or manifest is missing, altered or extraneous
- **THEN** check mode reports failure without repairing or deleting the evidence

### Requirement: MFG-04 Fail-closed self-check
A single self-check command SHALL run generated-drift checking, scenario traceability, official strict OpenSpec validation and the complete source test suite using a pinned local tool dependency, stop on a failed prerequisite and return a nonzero status without granting acceptance.

#### Scenario: MFG-04-S01 Failed prerequisite
- **WHEN** any self-check stage fails or its required tool is unavailable
- **THEN** the command returns failure and does not report final success or acceptance

### Requirement: MFG-05 Linux conformance automation
The repository SHALL provide read-only Ubuntu-slim CI with Node24, exact dependency locking and pinned official action revisions, running full self-checks and package verification without publishing, merging or granting agent approval.

#### Scenario: MFG-05-S01 Pull request validation
- **WHEN** CI validates a pull request
- **THEN** source checks and package checks must succeed and no write or publication step runs

### Requirement: MFG-06 Distribution boundary
The npm payload SHALL contain only the installer, generated customer template, deterministic template manifest and normal package metadata, excluding source-only OpenSpec specifications, source tests, scripts, CI and reports.

#### Scenario: MFG-06-S01 Package inspection
- **WHEN** package verification inspects npm pack dry-run output
- **THEN** it fails for any payload entry outside the declared distribution boundary

### Requirement: MFG-07 AI-assisted self-maintenance loop
Source-maintenance guidance SHALL require relevant baseline and delta reading, specification before implementation, failing regression evidence, regeneration, self-checks, separate adversarial review and human acceptance; unavailable gates SHALL remain blocked and SHALL NOT trigger automatic approval or archival.

#### Scenario: MFG-07-S01 Agent changes Specboot
- **WHEN** an AI agent is asked to improve Specboot itself
- **THEN** it follows the documented source-maintenance loop and reports evidence and separate unresolved gates

### Requirement: MFG-08 Manufactured product installation
The source tests SHALL install the built toolkit in a disposable target, verify the generated customer bytes and compatibility links, exclude source-only paths and verify that repeat installation preserves customer-owned files. An additional smoke test SHALL create the actual npm tarball, install it offline without lifecycle scripts in a temporary consumer, and execute that installed product rather than only the source-tree installer.

#### Scenario: MFG-08-S01 Disposable installation
- **WHEN** the built toolkit is installed and then repeated in a symlink-capable test environment
- **THEN** the installed bytes and links match the distribution and existing customer files remain unchanged

#### Scenario: MFG-08-S02 Packed product smoke test
- **WHEN** the toolkit is packed and installed offline into a disposable consumer
- **THEN** its installed executable produces the expected customer bytes and compatibility links while preserving customer-owned files on repetition
