# Onboarding

## Purpose

Describe the documented onboarding process as distinct from CLI behavior. Evidence: setup-sdd.md and README.md.

## Requirements

### Requirement: ONB-01 Guided installation
The setup instructions SHALL cover detecting the existing installation channel, installing and initializing OpenSpec when needed, importing Specboot, configuring technical context and verifying the result.

#### Scenario: ONB-01-S01 New customer project
- **WHEN** an agent follows the onboarding guide
- **THEN** the documented setup and verification steps are available

### Requirement: ONB-02 Project specialization
The setup guidance SHALL require customer-specific technical context and agent adaptation; the shipped examples SHALL NOT be treated as a verified model of Specboot itself.

#### Scenario: ONB-02-S01 Target context differs
- **WHEN** a target project has a different stack
- **THEN** the agent customizes the context instead of assuming the example stack

### Requirement: ONB-03 Optional tool integrations
The setup guide SHALL describe recommended CodeGraph and RTK integrations as separate setup activities, not as installer guarantees.

#### Scenario: ONB-03-S01 CLI alone
- **WHEN** the package installer is executed
- **THEN** the external tool setup is not automatically performed by the installer
