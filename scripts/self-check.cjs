#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
function check(root, { run = spawnSync } = {}) {
  root = path.resolve(root);
  const dependency = path.join(root, 'node_modules/@fission-ai/openspec');
  let requested, installed;
  try {
    requested = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).devDependencies['@fission-ai/openspec'];
    installed = JSON.parse(fs.readFileSync(path.join(dependency, 'package.json'), 'utf8'));
  } catch (error) { throw new Error(`Pinned OpenSpec dependency unavailable; run npm ci --ignore-scripts. ${error.message}`); }
  if (!/^\d+\.\d+\.\d+$/.test(requested) || installed.version !== requested) throw new Error('Installed OpenSpec version does not match the exact pinned dependency');
  const bin = typeof installed.bin === 'string' ? installed.bin : installed.bin?.openspec;
  if (typeof bin !== 'string' || path.isAbsolute(bin) || bin.split(/[\\/]/).includes('..')) throw new Error('Invalid OpenSpec executable path');
  const executable = fs.realpathSync(path.join(dependency, bin));
  if (!executable.startsWith(fs.realpathSync(dependency) + path.sep)) throw new Error('OpenSpec executable escaped its dependency');
  const tests = fs.readdirSync(path.join(root, 'tests')).filter(x => x.endsWith('.test.cjs')).sort().map(x => path.join(root, 'tests', x));
  if (!tests.length) throw new Error('No source tests found');
  const stages = [
    ['generated template', [path.join(root, 'scripts/build-template.cjs'), '--check']],
    ['scenario traceability', [path.join(root, 'scripts/validate-traceability.cjs')]],
    ['official OpenSpec strict validation', [executable, 'validate', '--all', '--strict']],
    ['complete source tests', ['--test', ...tests]]
  ];
  for (const [name, args] of stages) {
    console.log(`Self-check: ${name}`);
    const result = run(process.execPath, args, { cwd: root, stdio: 'inherit', timeout: 300000 });
    if (result.error) throw result.error;
    if (result.status !== 0 || result.signal) throw new Error(`Self-check failed: ${name} (status ${result.status}, signal ${result.signal || 'none'})`);
  }
  return { stages: stages.length, technicalChecks: 'passed', acceptance: 'not-granted' };
}
if (require.main === module) {
  try {
    if (process.argv.length !== 2) throw new Error('Usage: node scripts/self-check.cjs');
    console.log(JSON.stringify(check(path.resolve(__dirname, '..'))));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { check };
