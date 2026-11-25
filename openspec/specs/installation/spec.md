# Installation

## Purpose

Describe the existing package installer, not an idealized secure installer. Evidence: packages/specboot/bin/init.js and package.json.

## Requirements

### Requirement: INST-01 Target selection
The CLI SHALL use the resolved first positional argument as target, or the current working directory when omitted.

#### Scenario: INST-01-S01 Explicit target
- **WHEN** a path argument is supplied
- **THEN** the template is installed at that resolved path

#### Scenario: INST-01-S02 Default target
- **WHEN** no argument is supplied
- **THEN** the current working directory is used

### Requirement: INST-02 Template copy
The CLI SHALL recursively copy template files, skipping .DS_Store and existing file paths.

#### Scenario: INST-02-S01 Clean install
- **WHEN** the target is empty
- **THEN** template files are copied into matching relative paths

#### Scenario: INST-02-S02 Preserve existing file
- **WHEN** a destination file already exists
- **THEN** its contents remain unchanged

### Requirement: INST-03 Agent entry points
The CLI SHALL attempt to create four root links to docs/base-standards.md and Claude/Cursor agent and skill links based on the packaged template inventory; existing link paths are skipped.

#### Scenario: INST-03-S01 New links
- **WHEN** the environment supports symlinks and target paths are absent
- **THEN** links refer to the corresponding installed artifacts

### Requirement: INST-04 Installation report
On normal completion the CLI SHALL print copy, link and skip counts, any recorded link errors, and next steps.

#### Scenario: INST-04-S01 Completed run
- **WHEN** the copy and link operations complete
- **THEN** the summary is printed

#### Scenario: INST-04-S02 Recorded link creation failure
- **WHEN** a symbolic link creation attempt throws and the installer reaches normal completion
- **THEN** the summary includes the recorded link error

### Requirement: INST-05 Package boundary
The NPM package SHALL declare its installer entry point and ship bin/ and template/ as its payload directories.

#### Scenario: INST-05-S01 Package manifest
- **WHEN** the manifest is inspected
- **THEN** the bin entry, file allowlist and Node >=18 engine are declared
