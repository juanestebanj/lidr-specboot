#!/usr/bin/env node
'use strict';
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
function validatePayload(paths) {
  if (!Array.isArray(paths) || paths.some(p => typeof p !== 'string')) throw new Error('Invalid package payload');
  if (new Set(paths).size !== paths.length) throw new Error('Duplicate package payload path');
  for (const p of paths) {
    if (path.posix.isAbsolute(p) || p.includes('\\') || p.split('/').some(x => x === '..' || x === '.' || x === '')) throw new Error(`Invalid payload path: ${p}`);
    const allowed = ['package.json','README.md','LICENSE','bin/init.js','template-manifest.json'].includes(p) || p.startsWith('template/docs/') || p.startsWith('template/ai-specs/') || p.startsWith('template/.cursor/rules/');
    if (!allowed) throw new Error(`Package boundary violation: ${p}`);
  }
  for (const required of ['package.json','bin/init.js','template-manifest.json','template/docs/base-standards.md','template/ai-specs/specboot-instructions.md','template/.cursor/rules/use-base-rules.mdc']) {
    if (!paths.includes(required)) throw new Error(`Missing required package product: ${required}`);
  }
  return { files: paths.length };
}
function npm(args, cwd) {
  // Run npm's JavaScript entry point directly, preserving paths as argv without a shell.
  const candidates = [process.env.npm_execpath,
    path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'),
    path.resolve(path.dirname(process.execPath), '../lib/node_modules/npm/bin/npm-cli.js')];
  const cli = candidates.find(p => p && fs.existsSync(p));
  if (!cli) throw new Error('npm executable unavailable; run this command through npm run');
  const result = spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8', timeout: 120000 });
  if (result.error) throw result.error;
  if (result.status !== 0 || result.signal) throw new Error(`npm operation failed: ${result.stderr || result.signal || result.status}`);
  return result;
}
function checkPackage(root) {
  require('./build-template.cjs').build(root, { check: true });
  const result = npm(['pack', '.', '--dry-run', '--json', '--ignore-scripts'], path.join(root, 'packages/specboot'));
  const packed = JSON.parse(result.stdout);
  if (!Array.isArray(packed) || packed.length !== 1 || !Array.isArray(packed[0].files)) throw new Error('Unexpected npm pack payload');
  return validatePayload(packed[0].files.map(x => x.path));
}
function smokePackage(root) {
  require('./build-template.cjs').build(root, { check: true });
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'specboot-packed-'));
  try {
    const packed = JSON.parse(npm(['pack', '.', '--pack-destination', temporary, '--json', '--ignore-scripts'], path.join(root, 'packages/specboot')).stdout);
    if (!Array.isArray(packed) || packed.length !== 1 || !Array.isArray(packed[0].files)) throw new Error('Unexpected packed product metadata');
    validatePayload(packed[0].files.map(x => x.path));
    const filename = packed[0].filename;
    if (typeof filename !== 'string' || path.basename(filename) !== filename || !filename.endsWith('.tgz')) throw new Error('Unsafe packed product filename');
    const consumer = path.join(temporary, 'consumer');
    npm(['install', '--prefix', consumer, '--offline', '--ignore-scripts', '--no-audit', '--no-fund', path.join(temporary, filename)], temporary);
    const installed = path.join(consumer, 'node_modules/@lidr/lidr-specboot');
    const manifestFile = path.join(installed, 'template-manifest.json');
    if (!fs.readFileSync(manifestFile).equals(fs.readFileSync(path.join(root, 'packages/specboot/template-manifest.json')))) throw new Error('Installed manifest differs from manufactured product');
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    const customer = path.join(temporary, 'customer');
    fs.mkdirSync(customer); fs.writeFileSync(path.join(customer, 'README.md'), 'customer-owned README');
    function install() {
      const r = spawnSync(process.execPath, [path.join(installed, 'bin/init.js'), customer], { encoding: 'utf8', timeout: 30000 });
      if (r.error) throw r.error;
      if (r.status !== 0 || r.signal) throw new Error(`Installed product failed: ${r.stdout}${r.stderr}`);
    }
    install();
    for (const row of manifest.files) {
      const bytes = fs.readFileSync(path.join(customer, ...row.path.split('/')));
      if (crypto.createHash('sha256').update(bytes).digest('hex') !== row.targetSha256) throw new Error(`Installed byte mismatch: ${row.path}`);
    }
    for (const name of ['AGENTS.md','CLAUDE.md','GEMINI.md','codex.md']) {
      if (fs.readlinkSync(path.join(customer, name)) !== 'docs/base-standards.md') throw new Error(`Incorrect installed link: ${name}`);
    }
    for (const tool of ['.claude','.cursor']) for (const kind of ['agents','skills']) {
      for (const name of fs.readdirSync(path.join(customer, 'ai-specs', kind))) {
        if (fs.realpathSync(path.join(customer, tool, kind, name)) !== fs.realpathSync(path.join(customer, 'ai-specs', kind, name))) throw new Error(`Incorrect installed compatibility link: ${tool}/${kind}/${name}`);
      }
    }
    for (const name of ['openspec','tests','scripts','packages','SELF-MAINTENANCE.md']) if (fs.existsSync(path.join(customer, name))) throw new Error(`Source-only artifact leaked: ${name}`);
    const owned = path.join(customer, 'docs/base-standards.md');
    fs.writeFileSync(owned, 'customer-owned standards'); install();
    if (fs.readFileSync(owned, 'utf8') !== 'customer-owned standards' || fs.readFileSync(path.join(customer, 'README.md'), 'utf8') !== 'customer-owned README') throw new Error('Repeat installation modified customer-owned files');
    return { files: manifest.files.length, installedProduct: true };
  } finally {
    const cleanup = fs.realpathSync(temporary), base = fs.realpathSync(os.tmpdir());
    if (path.dirname(cleanup) !== base || !path.basename(cleanup).startsWith('specboot-packed-')) throw new Error('Refusing cleanup outside the verified temporary directory');
    fs.rmSync(cleanup, { recursive: true, force: true });
  }
}
if (require.main === module) {
  try {
    if (process.argv.length !== 2) throw new Error('Usage: node scripts/check-package.cjs');
    console.log(JSON.stringify(checkPackage(path.resolve(__dirname, '..'))));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { validatePayload, checkPackage, smokePackage };
