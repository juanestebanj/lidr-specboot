'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const check = (root, run) => require('../scripts/self-check.cjs').check(root, { run });
function fixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'specboot-check-'));
  const pkg = path.join(root, 'node_modules/@fission-ai/openspec');
  fs.mkdirSync(path.join(pkg, 'bin'), { recursive: true });
  fs.mkdirSync(path.join(root, 'tests'));
  fs.writeFileSync(path.join(root, 'tests/example.test.cjs'), '// fixture');
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({devDependencies:{'@fission-ai/openspec':'1.3.1'}}));
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({version:'1.3.1',bin:{openspec:'bin/openspec.js'}}));
  fs.writeFileSync(path.join(pkg, 'bin/openspec.js'), '// fixture');
  try { fn(root, pkg); } finally { fs.rmSync(root, {recursive:true,force:true}); }
}
test('T41: self-check runs all required stages in order without accepting the change', () => fixture(root => {
  const calls = [];
  const result = check(root, (command, args) => { calls.push([command,...args]); return {status:0}; });
  assert.equal(calls.length, 4);
  assert.ok(calls[0].join(' ').includes('build-template.cjs --check'));
  assert.ok(calls[1].join(' ').includes('validate-traceability.cjs'));
  assert.ok(calls[2].join(' ').includes('validate --all --strict'));
  assert.ok(calls[3].includes('--test'));
  assert.ok(calls[3].some(x => x.endsWith('example.test.cjs')));
  assert.deepEqual(result, {stages:4,technicalChecks:'passed',acceptance:'not-granted'});
}));
test('T42: every failed stage or spawn error stops subsequent checks', () => fixture(root => {
  for (let failed = 0; failed < 4; failed++) {
    let calls = 0;
    assert.throws(() => check(root, () => ({status:calls++ === failed ? 7 : 0})), /failed/i);
    assert.equal(calls, failed + 1);
  }
  assert.throws(() => check(root, () => ({status:null,error:new Error('spawn blocked')})), /spawn blocked/);
}));
test('T43: missing pinned OpenSpec tool fails before reporting success', () => fixture((root, pkg) => {
  fs.unlinkSync(path.join(pkg, 'package.json'));
  assert.throws(() => check(root, () => ({status:0})), /OpenSpec|openspec/i);
}));
test('T44: unexpected OpenSpec version is rejected', () => fixture((root, pkg) => {
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({version:'9.9.9',bin:{openspec:'bin/openspec.js'}}));
  assert.throws(() => check(root, () => ({status:0})), /version|pinned/i);
}));
test('T45: package verifier accepts the declared payload and rejects source or escaping paths', () => {
  const { validatePayload } = require('../scripts/check-package.cjs');
  const good = ['package.json','bin/init.js','template-manifest.json','template/docs/base-standards.md','template/ai-specs/specboot-instructions.md','template/.cursor/rules/use-base-rules.mdc'];
  assert.ok(validatePayload(good));
  for (const extra of ['openspec/spec.md','tests/test.cjs','scripts/run.cjs','.github/workflows/ci.yml','template/openspec/spec.md','../secret','/absolute','template\\docs\\bad']) {
    assert.throws(() => validatePayload([...good,extra]), /payload|path|boundary/i, extra);
  }
});
test('T46: package verifier rejects missing required products and duplicate paths', () => {
  const { validatePayload } = require('../scripts/check-package.cjs');
  const good = ['package.json','bin/init.js','template-manifest.json','template/docs/base-standards.md','template/ai-specs/specboot-instructions.md','template/.cursor/rules/use-base-rules.mdc'];
  for (const missing of good) assert.throws(() => validatePayload(good.filter(x => x !== missing)), /missing|required/i);
  assert.throws(() => validatePayload([...good,'bin/init.js']), /duplicate/i);
});

test('T47: actual packed toolkit installs offline and manufactures a disposable customer project', () => {
  const { smokePackage } = require('../scripts/check-package.cjs');
  const result = smokePackage(path.resolve(__dirname, '..'));
  assert.ok(result.files > 0);
  assert.equal(result.installedProduct, true);
});
