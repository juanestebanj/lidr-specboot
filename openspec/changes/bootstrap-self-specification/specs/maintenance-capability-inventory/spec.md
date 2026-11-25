## ADDED Requirements

### Requirement: INV-01 Task acquisition inventory
The provisional capability inventory SHALL identify Jira queue and ticket selection, explicit and fallback task sources, and status transitions as documented workflows rather than executed integrations.

#### Scenario: INV-01-S01 Factory inventory
- **WHEN** a maintainer plans factory changes
- **THEN** the inventory identifies acquisition and delivery-status sources and gaps

### Requirement: INV-02 Workspace inventory
The inventory SHALL identify worktree isolation, branch conventions and cleanup boundaries.

#### Scenario: INV-02-S01 Workspace changes
- **WHEN** workspace behavior changes
- **THEN** the inventory identifies the controlling factory and worktree instructions

### Requirement: INV-03 Skill contracts inventory
The inventory SHALL enumerate every canonical SKILL.md with its purpose, input, output and verification status; a full behavioral contract per skill remains incremental work.

#### Scenario: INV-03-S01 Skill discovery
- **WHEN** canonical skills are inventoried
- **THEN** each skill has a unique entry and a source path

### Requirement: INV-04 Execution and tooling inventory
The inventory SHALL identify model selection, documentation rendering, code review scripting and documentation maintenance entry points and distinguish their untested behavior.

#### Scenario: INV-04-S01 Utility discovery
- **WHEN** a maintainer selects an execution or utility change
- **THEN** the inventory identifies the responsible artifacts and unverified surfaces

### Requirement: INV-05 Installer recovery inventory
The inventory SHALL record installer error and recovery limitations without claiming rollback or secure containment.

#### Scenario: INV-05-S01 Installer failure planning
- **WHEN** a maintainer considers installer failures
- **THEN** the inventory identifies error reporting, partial writes, exit status and known containment limitations
