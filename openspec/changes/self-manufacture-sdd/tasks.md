## 0. Isolate
- [ ] 0.1 Create feature/self-manufacture-sdd from verified main and record provenance.
- [ ] 0.2 Import the proposed bootstrap without claiming previous acceptance.

## 1. Specify and test
- [ ] 1.1 Record self-manufacturing contracts, scenario mappings and acceptance gates before implementation.
- [ ] 1.2 Add failing generator, self-check, package-boundary and installation tests.

## 2. Implement
- [ ] 2.1 Implement deterministic canonical-to-template generation and a portable digest manifest.
- [ ] 2.2 Implement fail-closed source checks and package verification.
- [ ] 2.3 Pin tool dependencies and add Ubuntu-slim CI.
- [ ] 2.4 Regenerate the customer template from canonical sources and document the self-maintenance loop.

## 3. Verify
- [ ] 3.1 Run focused tests, negative/mutation cases, traceability and official strict validation.
- [ ] 3.2 Run the full native suite and package/install checks in a symlink-capable Linux environment.
- [ ] 3.3 Record reproducible evidence and publish a draft PR when repository write access permits.
