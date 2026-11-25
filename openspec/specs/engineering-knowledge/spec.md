# Engineering Knowledge

## Purpose

Describe canonical reusable knowledge and its documented distribution conventions. Evidence: README.md, docs/base-standards.md, ai-specs/ and package template.

## Requirements

### Requirement: KNOW-01 Canonical standards
Project guidance SHALL identify docs/base-standards.md as the shared core and refer to specialized standards.

#### Scenario: KNOW-01-S01 Agent entry point
- **WHEN** an agent reads a root compatibility link in a symlink-capable checkout
- **THEN** it reaches the core standards

### Requirement: KNOW-02 Reusable agent roles and skills
Canonical agent roles and skill instructions SHALL reside under ai-specs/agents and ai-specs/skills; existing skill exposure is represented by Claude and Cursor links.

#### Scenario: KNOW-02-S01 Canonical discovery
- **WHEN** an agent inspects the canonical directory
- **THEN** role definitions and SKILL.md entry points are discoverable

### Requirement: KNOW-03 Documentation maintenance
The documented workflow SHALL require agents to load applicable skill references and update affected OpenSpec artifacts before post-apply implementation changes.

#### Scenario: KNOW-03-S01 Post-apply change
- **WHEN** a fix changes the requirements before archival
- **THEN** the agent updates affected artifacts before changing implementation

### Requirement: KNOW-04 Customer template separation
The installer SHALL read the package template rather than the repository root. Template drift is a known baseline gap, not a guarantee of synchronization.

#### Scenario: KNOW-04-S01 Target installation
- **WHEN** the CLI runs in an empty target
- **THEN** only the template payload and generated links are installed
