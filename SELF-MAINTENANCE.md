# Specboot manufactures and maintains itself

Specboot's source repository is a product of its own AI-assisted specification-driven development process. An external coding agent performs the engineering; deterministic scripts manufacture and check the distributable toolkit. Technical checks do not grant acceptance.

## Start here

Use a symlink-capable Linux checkout with Node24 and npm. Install the exact locked development dependencies without lifecycle scripts:

```sh
npm ci --ignore-scripts
npm run build
npm run self:check
npm run package:check
```

`self:check` deliberately fails if its pinned OpenSpec tool is missing, the generated product drifts, scenario references are invalid, strict specification validation fails, or any source test fails. Windows checkouts that represent Git symlinks as ordinary text do not satisfy the full native filesystem checks. Do not waive failures or rewrite them as passes.

## Production graph

| Input | Manufacturing step | Product |
| --- | --- | --- |
| Canonical `docs/` and `ai-specs/` regular files | `scripts/build-template.cjs` | `packages/specboot/template/` |
| Canonical `.cursor/rules/` adapter configuration | The same deterministic generator | Cursor discovery rules in the template |
| The same exact source bytes | SHA-256 provenance generation | `packages/specboot/template-manifest.json` |
| Source specifications and active deltas | Traceability and official strict validation | Machine-checkable references and diagnostics |
| Installer and generated products | Tests and npm pack inspection | Verified distribution boundary and installation behavior |

Edit canonical sources, then regenerate. Treat the template as generated output. `npm run build:check` detects missing, changed and extra files without fixing them. Generated artifacts are committed so reviewers can inspect the product as well as the source. `.gitattributes` keeps checked-out text in LF form across platforms. Build output contains no timestamps or local absolute paths.

The generator owns only the package's template directory and manifest. It rejects symlinks and special files in its input/output trees. Generation is recoverable from source but is not transactional and does not claim protection against concurrent malicious filesystem changes.

## AI-assisted self-improvement cycle

1. Read `openspec/self-specification.md`, `openspec/config.yaml`, relevant baseline specifications, active deltas and the capability inventory. This source-maintenance mode takes precedence over customer Jira greenfield rules.
2. Create an isolated feature branch. Define a bounded change in `openspec/changes/<change>/`: proposal, design, stable requirement/scenario identities, implementation tasks and a separate acceptance record. Read `docs/openspec-tasks-mandatory-steps.md` using the repository's affected-surface QA profile.
3. Add and execute a failing regression before implementation. Preserve the failing evidence, then change canonical sources or source tooling. Update specifications first when scope changes.
4. Regenerate with `npm run build`. Update `openspec/traceability.json` with real source and test identities. Use `ai-specs/skills/factory/` and relevant specialist skills as engineering guidance.
5. Execute self-checks and package verification. Test meaningful negative cases and mutations. Record commands, results, artifact hashes and limitations under the active change. Database, API and browser QA apply only when those surfaces change.
6. Have a different agent/session read the specifications, inspect the change and independently reproduce evidence using `adversarial-review`. The implementer does not approve its own work. Fix major findings and obtain a new review after substantive changes.
7. Open or update a pull request. Linux CI repeats the deterministic checks. Present the evidence for human acceptance. Keep blocked gates pending. Synchronization, archival, merging, publication and recurring autonomous tasks require their own authorization.

The governing principle: No self-approval by implementing agents, no unsupported claims of correctness, and no final acceptance without adequate evidence.

## Prompt for the next source change

> Use Specboot source-maintenance mode to implement this bounded improvement: [describe it]. Read SELF-MAINTENANCE.md and the relevant baseline and active changes. Specify before coding, reproduce a failing regression, implement the smallest correction, regenerate the toolkit, run self-check and package-check, obtain independent adversarial review, and return a draft PR with evidence and unresolved acceptance gates. Do not merge, publish or archive automatically.

This is a repeatable engineering loop. It does not train a model or run background self-modification. The original bootstrap remains proposed until its separate acceptance gates are closed.
