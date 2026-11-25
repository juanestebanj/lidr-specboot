# Specboot self-specification

Status: proposed bootstrap baseline, awaiting independent review and maintainer acceptance.
Source: original archive commit identifier `f6c80442fa1d6cfefdbe25c2d9d0223ac89046c1` (archive metadata, not a verified Git history).

## Scope and authority

- `openspec/specs/` describes the existing product's externally observable behavior and documented agent obligations. Requirements are identified by stable IDs. Instruction contracts are not proof of agent compliance.
- `openspec/changes/` records proposed evolution, including the initial self-specification change. Do not archive until evidence and acceptance are complete.
- `docs/base-standards.md` and `ai-specs/` remain sources of engineering guidance. Generic ATS examples in `docs/api-spec.yml`, `docs/data-model.md`, and `docs/development_guide.md` are not this project's runtime architecture.
- `packages/specboot/template/` is the customer distribution. Repository-only specifications and tests stay outside it. Do not resolve discrepancies by copying this repository's OpenSpec directory into customers.
- For this repository, the verification applicability rules in `openspec/config.yaml` specialize the generic application QA checklist: no DB, HTTP or browser verification is required for the existing filesystem CLI and documentation-only changes. Record why; do not silently mark tests passed.

## Source maintenance precedence and lifecycle

For changes to Specboot itself, including Jira-sourced work, read the relevant baseline and active deltas; Jira greenfield-only restrictions do not apply. This source profile takes precedence over generic factory and application QA instructions. Customer workflows retain their existing mode. `tasks.md` covers implementation only; independent review, final verification, maintainer acceptance and archival are separate gates in `acceptance.md`. If a gate is blocked, report it without pretending that the change is approved. Archival requires separate authorization after acceptance.

See the active bootstrap [remediation scope](changes/bootstrap-self-specification/remediation.md), [capability inventory](capability-inventory.md), and [scenario mappings](traceability.json). The inventory identifies outstanding contracts, not proof of complete behavior.

## Architecture

Human request -> external coding agent -> OpenSpec change artifacts -> relevant Specboot skills and standards -> implementation in an isolated workspace -> independent adversarial review -> verification -> maintainer acceptance -> archive/delivery.

This is a documented process, not a machine-enforced orchestration engine. Specboot's executable installer copies its packaged template and creates compatibility links; it does not implement OpenSpec or run agents.

## Self-application

1. Read the relevant baseline capability and traceability entries before proposing a change.
2. Create an OpenSpec change (proposal, design as applicable, delta specs, tasks) before altering implementation or agent workflows.
3. Use Specboot's own skills for the change, including independent adversarial review. Test behavior and document evidence.
4. Synchronize accepted deltas using OpenSpec, then archive only after maintainer acceptance. Update traceability with changed requirements and evidence.
5. For a change to these rules themselves, follow the same process. Never allow the implementing agent to approve its own change.

## Known gaps, not approved fixes

- Canonical and packaged knowledge differ: template synchronization and distribution completeness are not guaranteed.
- Installer destination containment, atomic rollback and Windows compatibility require separate investigation/remediation.
- Agent workflow enforcement, budgets and independent execution identity are not implemented by the installer.
- No existing CI or official OpenSpec validation is established by this snapshot.
- Existing README and factory workflow ordering differ; factory-specific ordering in FLOW-02 to FLOW-04 comes from the factory skill.
- Existing onboarding examples install external tools; the bootstrap does not execute them.

## Verify locally

From the repository root, with Node.js 18 or later, run `node --test tests/*.test.cjs`. These focused checks do not validate every requirement or constitute independent assurance. With an independently installed, trusted OpenSpec CLI, also run `openspec validate --all --strict` and resolve diagnostics before acceptance. See the active bootstrap change for evidence and remaining gates.

## Proposed self-improvement cycle 1

The active bootstrap now includes EXIT-01: recorded installer link errors return
status 1; successful processing and existing-entry skips retain status 0.
See changes/bootstrap-self-specification/self-improvement-plan.md and the cycle-1
reports for the current candidate and limitations. Prior bootstrap verification
and acceptance records remain historical; they do not approve this cycle.
This cycle changes the packaged executable but does not synchronize template guidance.
