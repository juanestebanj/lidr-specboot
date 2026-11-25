## ADDED Requirements

### Requirement: SELF-01 Specification-first self-maintenance
The repository SHALL provide an OpenSpec context and capability baseline for its own evolution. Changes to product behavior or engineering workflows SHALL be specified before implementation.

#### Scenario: SELF-01-S01 Change to Specboot
- **WHEN** a maintainer proposes a behavior or workflow change
- **THEN** the implementing agent reads the relevant baseline and creates or updates an OpenSpec change before implementation

#### Scenario: SELF-01-S02 Customer installation
- **WHEN** the existing package installer runs in an empty target
- **THEN** repository-only self-specifications and tests are not copied to the customer

#### Scenario: SELF-01-S03 Manual import guidance
- **WHEN** a customer follows the source repository manual import instructions
- **THEN** the listed reusable paths exclude source-only openspec/, tests/ and packages/

### Requirement: SELF-02 Traceable verification
The repository SHALL maintain stable requirement identities, source mappings and verification references, and distinguish unverified instruction contracts from tested runtime behavior. Every scenario SHALL have a stable identity and a machine-checked mapping to existing source artifacts and evidence; inspection and instruction checks SHALL NOT be labeled runtime verification.

#### Scenario: SELF-02-S01 Baseline verification
- **WHEN** the maintainer runs the offline self-specification tests
- **THEN** focused structure, traceability and installer behavior checks report pass or fail without external services

### Requirement: SELF-03 Independent acceptance
The documented self-maintenance workflow SHALL require a different reviewer from the implementer and maintainer acceptance before archival. Missing evidence SHALL remain explicitly pending.

#### Scenario: SELF-03-S01 Bootstrap awaiting review
- **WHEN** an implementing agent finishes its verification
- **THEN** the change stays active until independent review and maintainer acceptance are recorded

#### Scenario: SELF-03-S02 Implementation complete
- **WHEN** implementation checks pass but assurance, acceptance or archival is pending
- **THEN** implementation tasks can finish while release gates remain pending outside tasks.md

### Requirement: SELF-04 Maintenance mode precedence
The source repository factory SHALL read the relevant baseline and active deltas before planning self-maintenance even when a Jira ticket or queue supplies the task; Jira greenfield restrictions SHALL remain applicable only outside this source-maintenance mode.

#### Scenario: SELF-04-S01 Jira maintenance
- **WHEN** a task changes Specboot itself in a source checkout
- **THEN** baseline-aware planning and appropriate ADDED, MODIFIED or REMOVED deltas take precedence over greenfield restrictions

### Requirement: SELF-05 Separated lifecycle gates
The factory SHALL treat tasks.md as implementation scope only; independent review, final verification, maintainer acceptance and archival SHALL be tracked in a separate ordered gate record. Blocked gates SHALL remain pending, and archival SHALL require separate authorization after acceptance.

#### Scenario: SELF-05-S01 Pending acceptance
- **WHEN** implementation tasks are complete and independent review has not returned
- **THEN** the factory waits for review without demanding acceptance or archival as implementation tasks

### Requirement: SELF-06 Customer onboarding boundary
Manual imports SHALL distribute dedicated customer onboarding instructions as a regular file, exclude source-only paths, preserve the customer's root README and reject a conflicting onboarding path rather than follow or overwrite it.

#### Scenario: SELF-06-S01 Empty customer
- **WHEN** the manual importer runs against an empty target
- **THEN** the onboarding file is regular, correct and independent of the root README

#### Scenario: SELF-06-S02 Customer README
- **WHEN** a customer has a root README
- **THEN** its bytes remain unchanged and onboarding still contains Specboot guidance

#### Scenario: SELF-06-S03 Conflicting onboarding
- **WHEN** a customer has a different onboarding file or symbolic link
- **THEN** the importer fails without overwriting or following it

### Requirement: SELF-07 Applicable QA
The source repository SHALL use explicit affected-surface QA: automated tests and documentation are required; database, HTTP API and browser checks SHALL be required only when those surfaces are affected, with a reason recorded for each non-applicable check.

#### Scenario: SELF-07-S01 Filesystem and documentation change
- **WHEN** a change affects only filesystem tooling and engineering instructions
- **THEN** the plan records DB, HTTP and browser QA as not applicable and requires real filesystem and documentation checks
