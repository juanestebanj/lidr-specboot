# Quality Assurance

## Purpose

Describe documented quality obligations rather than claiming technical enforcement. Evidence: docs/openspec-tasks-mandatory-steps.md, ai-specs/skills/adversarial-review/SKILL.md, ai-specs/skills/mutation-testing/SKILL.md.

## Requirements

### Requirement: QA-01 Verification tasks
The general task guidance SHALL prescribe test review, unit tests and relevant database, API and browser verification, plus documentation updates. Repository-specific applicability is defined in openspec/config.yaml.

#### Scenario: QA-01-S01 Planning a change
- **WHEN** the affected surfaces are identified
- **THEN** applicable verification tasks and evidence are specified

### Requirement: QA-02 Independent review evidence
Adversarial review instructions SHALL require reviewers to compare specifications and implementation, seek negative cases and independently reproduce cited evidence.

#### Scenario: QA-02-S01 Review requested
- **WHEN** the independent reviewer receives a change
- **THEN** the reviewer examines acceptance criteria, diff, tests and evidence and reports findings

### Requirement: QA-03 Test effectiveness
The adversarial review instructions SHALL require mutation-style analysis for changed production logic; a documentation-only change may skip it.

#### Scenario: QA-03-S01 Production logic changed
- **WHEN** the review includes changed production files
- **THEN** test effectiveness is investigated

#### Scenario: QA-03-S02 Documentation only
- **WHEN** no production logic changed
- **THEN** the review may omit mutation analysis
