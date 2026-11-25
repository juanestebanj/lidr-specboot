# Agent Workflow

## Purpose

Describe the factory skill as an instruction contract for external agents. This is not an executable scheduler. Evidence: ai-specs/skills/factory/SKILL.md.

## Requirements

### Requirement: FLOW-01 Task isolation and planning
The factory instructions SHALL prescribe a per-task worktree, requirement enrichment, OpenSpec change creation and artifact completion before implementation.

#### Scenario: FLOW-01-S01 New task
- **WHEN** the factory workflow starts a task
- **THEN** the documented sequence is worktree, enrichment, new change, artifact generation, then apply

### Requirement: FLOW-02 Review handshake
The factory instructions SHALL require a reviewer distinct from the implementer before every verify, using the coordinator handshake by default when the worker cannot spawn agents.

#### Scenario: FLOW-02-S01 Apply completed
- **WHEN** the worker cannot spawn a reviewer
- **THEN** the coordinator receives worktree, change name and Jira ID or none, spawns an independent reviewer and relays the verdict

### Requirement: FLOW-03 Review and verification loop
The factory instructions SHALL prescribe fixing FAIL verdicts before verify in loop mode, and reporting the verdict with one verification pass in single-pass mode.

#### Scenario: FLOW-03-S01 Loop failure
- **WHEN** a reviewer returns FAIL in loop mode
- **THEN** the worker fixes findings and obtains another independent review

#### Scenario: FLOW-03-S02 Single pass
- **WHEN** no-loop mode is requested
- **THEN** one review and one verification are reported without a fix loop

### Requirement: FLOW-04 Delivery boundary
The factory instructions SHALL prohibit archive, commit and worktree cleanup within the per-task pipeline.

#### Scenario: FLOW-04-S01 Factory verification ends
- **WHEN** the task reaches the end of its pipeline
- **THEN** archive, commit and cleanup remain separate actions
