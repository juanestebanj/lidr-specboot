# Provisional capability inventory

Not a ratified baseline or proof of runtime behavior. All workflow entries are instruction contracts, inspected but not executed end-to-end. Full individual skill contracts, detailed Jira integration and recovery tests remain incremental work. Source paths are repository-relative.

| Area | Source | Inputs → outputs / known gaps |
| --- | --- | --- |
| Task acquisition and Jira status | ai-specs/skills/factory/SKILL.md | Queue keywords (PER JQL), ticket keys, explicit tasks or fallback references → selected tasks; satisfactory verification → In review; external Jira not tested |
| Workspace | ai-specs/skills/using-git-worktrees/SKILL.md; ai-specs/skills/factory/SKILL.md | Base branch, task and optional ticket → isolated worktree and feature branch; cleanup separately authorized; actual Git unavailable |
| Model selection | docs/base-standards.md; ai-specs/skills/factory/SKILL.md | Planning task → configured model and effort; existing provider-specific instructions not reconciled here |
| Documentation rendering | ai-specs/skills/writing-skills/render-graphs.js | DOT graphs → rendered output; failure exit-status gap inherited; rendering not executed |
| Code review scripting | ai-specs/scripts/code_review.sh | Repository context/diff → review script output; external tools not executed |
| Documentation maintenance | ai-specs/skills/update-docs/SKILL.md; docs/documentation-standards.md | Change and affected documents → updated docs; no live agent execution |
| Installer failure and recovery | packages/specboot/bin/init.js | Target and template → copies, links and summary; recorded link errors exit 1 in proposed cycle 1; partial writes, no rollback, symlink containment and Windows gaps inherited |
| Manual importer | scripts/manual-import.cjs | Existing customer directory and canonical reusable paths → non-overwriting import; conflicts rejected; no transactional rollback or concurrent filesystem mutation guarantee |

## Canonical skills (top-level entry points)

| Skill | Source | Input | Output / obligation | Verification |
| --- | --- | --- | --- | --- |
| adversarial-review | ai-specs/skills/adversarial-review/SKILL.md | Change, worktree, Jira ID or none | Independent findings and verdict | Instruction inspection |
| code-auditing | ai-specs/skills/code-auditing/SKILL.md | Code/audit scope | Audit findings | Instruction inspection |
| commit | ai-specs/skills/commit/SKILL.md | Reviewed change | Commit and PR workflow | Instruction inspection |
| enrich-us | ai-specs/skills/enrich-us/SKILL.md | Story/ticket | Enriched story and acceptance criteria | Instruction inspection |
| explain | ai-specs/skills/explain/SKILL.md | Technical question | Explanation and mental model | Instruction inspection |
| factory | ai-specs/skills/factory/SKILL.md | Task source and execution mode | Isolated specification/apply/review/verify workflow | Instruction inspection |
| meta-prompt | ai-specs/skills/meta-prompt/SKILL.md | Prompt | Refined prompt | Instruction inspection |
| mutation-testing | ai-specs/skills/mutation-testing/SKILL.md | Changed logic and tests | Test effectiveness findings | Instruction inspection |
| openspec-sync-specs | ai-specs/skills/openspec-sync-specs/SKILL.md | Change delta and main specs | Synchronized specification guidance | Instruction inspection |
| playwright-qa-scenarios | ai-specs/skills/playwright-qa-scenarios/SKILL.md | UI requirements | Playwright scenario list | Instruction inspection |
| playwright-skill | ai-specs/skills/playwright-skill/SKILL.md | Browser testing task | Playwright test guidance | Instruction inspection |
| quick-change | ai-specs/skills/quick-change/SKILL.md | Informal change request | Bounded change workflow | Instruction inspection |
| show-spec-working | ai-specs/skills/show-spec-working/SKILL.md | Feature/spec/ticket | Demonstration workflow | Instruction inspection |
| sync-agent-symlinks | ai-specs/skills/sync-agent-symlinks/SKILL.md | Skill inventory change | Updated agent exposure | Instruction inspection |
| update-docs | ai-specs/skills/update-docs/SKILL.md | Implemented change | Affected technical docs | Instruction inspection |
| using-git-worktrees | ai-specs/skills/using-git-worktrees/SKILL.md | Feature work | Isolated workspace | Instruction inspection |
| writing-skills | ai-specs/skills/writing-skills/SKILL.md | Skill creation/edit | Skill and verification guidance | Instruction inspection |
