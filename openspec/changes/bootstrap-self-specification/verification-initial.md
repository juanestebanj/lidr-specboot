# Bootstrap verification — 2026-11-25

Implementer-run evidence; independent acceptance pending.

- Source SHA-256: `388b444c9a5b1f1ebe459d732f6806e4d4cdc62e9c85c05ba64626cd82718898`
- Environment: Linux, Node.js 22.16.0, no OpenSpec CLI installed.
- Command: `node --test tests/self-spec.test.cjs`
- Result: 11 passed, 0 failed, 0 skipped. Tests include real CLI execution in disposable directories, structure checks and textual workflow checks.
- YAML: configuration parsed successfully with PyYAML. This is not official OpenSpec validation.
- Database/API/browser and mutation checks: not applicable; no production logic or those surfaces changed.
- Git branch, independent reviewer, official OpenSpec validation, Windows validation and maintainer acceptance: pending or not demonstrated. No archive/merge/release performed.
- Original archive unchanged. Existing symlink metadata and packaged template preserved in the output ZIP.

## Test output

```text
TAP version 13
# Subtest: T01: specification structure, unique IDs and traceability
ok 1 - T01: specification structure, unique IDs and traceability
  ---
  duration_ms: 3.825807
  type: 'test'
  ...
# Subtest: T02: manifest defines package payload and installer
ok 2 - T02: manifest defines package payload and installer
  ---
  duration_ms: 0.456437
  type: 'test'
  ...
# Subtest: T03: clean explicit install copies template and creates correct links, not self-specs
ok 3 - T03: clean explicit install copies template and creates correct links, not self-specs
  ---
  duration_ms: 201.216838
  type: 'test'
  ...
# Subtest: T04: default install uses cwd
ok 4 - T04: default install uses cwd
  ---
  duration_ms: 75.241536
  type: 'test'
  ...
# Subtest: T05: existing file remains intact and repeat does not copy files
ok 5 - T05: existing file remains intact and repeat does not copy files
  ---
  duration_ms: 171.354956
  type: 'test'
  ...
# Subtest: T06: canonical source and agent-specific link integrity
ok 6 - T06: canonical source and agent-specific link integrity
  ---
  duration_ms: 3.19376
  type: 'test'
  ...
# Subtest: T07: factory instructions contain the documented order and separation
ok 7 - T07: factory instructions contain the documented order and separation
  ---
  duration_ms: 0.358004
  type: 'test'
  ...
# Subtest: T08: independent review instructions require reproduction and spec comparison
ok 8 - T08: independent review instructions require reproduction and spec comparison
  ---
  duration_ms: 0.612231
  type: 'test'
  ...
# Subtest: T09: onboarding includes OpenSpec and external tool setup
ok 9 - T09: onboarding includes OpenSpec and external tool setup
  ---
  duration_ms: 1.019312
  type: 'test'
  ...
# Subtest: T10: repository-only guidance points to baseline and pending review
ok 10 - T10: repository-only guidance points to baseline and pending review
  ---
  duration_ms: 0.885703
  type: 'test'
  ...
# Subtest: T11: manual import guidance excludes repository-only paths
ok 11 - T11: manual import guidance excludes repository-only paths
  ---
  duration_ms: 0.489041
  type: 'test'
  ...
1..11
# tests 11
# suites 0
# pass 11
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 540.147626
```
