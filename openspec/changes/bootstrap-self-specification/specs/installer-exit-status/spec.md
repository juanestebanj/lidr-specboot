## ADDED Requirements

### Requirement: EXIT-01 Observable installation status
The packaged installer SHALL return exit status 1 when any attempted symbolic link creation is recorded as an error, and SHALL return exit status 0 when copy and link processing completes without recorded errors. The report SHALL retain the recorded errors and operation counts. Existing paths skipped by the current installer SHALL NOT alone cause a failure status. This change SHALL NOT imply rollback, destination validation or correction of existing paths.

#### Scenario: EXIT-01-S01 Recorded link failure
- **WHEN** one or more link creation attempts throw and the installer reaches its report
- **THEN** the process exits with status 1 and prints the recorded errors and operation counts

#### Scenario: EXIT-01-S02 Successful processing
- **WHEN** all copy and link processing completes without recorded errors
- **THEN** the process exits with status 0 and prints operation counts

#### Scenario: EXIT-01-S03 Existing destination entries
- **WHEN** the installer repeats against existing destination entries without a new operation error
- **THEN** it exits with status 0 and preserves existing file bytes
