#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function optionalStat(p) {
  try { return fs.lstatSync(p); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
function directory(p, optional = false) {
  const s = optionalStat(p);
  if (!s && optional) return false;
  if (!s) throw new Error(`Missing canonical directory: ${p}`);
  if (s.isSymbolicLink()) throw new Error(`Symbolic link is not a managed directory: ${p}`);
  if (!s.isDirectory()) throw new Error(`Expected a directory: ${p}`);
  return true;
}
function readTree(base, optional = false) {
  const result = new Map();
  if (!directory(base, optional)) return result;
  function visit(dir, prefix) {
    for (const name of fs.readdirSync(dir).sort()) {
      if (name.includes('\\')) throw new Error(`Nonportable source name: ${name}`);
      const p = path.join(dir, name), rel = prefix + name;
      const s = fs.lstatSync(p);
      if (s.isSymbolicLink()) throw new Error(`Symbolic link in managed tree: ${p}`);
      if (s.isDirectory()) visit(p, rel + '/');
      else if (s.isFile()) result.set(rel, fs.readFileSync(p));
      else throw new Error(`Special file in managed tree: ${p}`);
    }
  }
  visit(base, '');
  return result;
}
function build(root, { check = false } = {}) {
  root = fs.realpathSync(root);
  directory(path.join(root, '.cursor'));
  const expected = new Map();
  for (const dir of ['docs', 'ai-specs', '.cursor/rules']) {
    for (const [rel, bytes] of readTree(path.join(root, dir))) expected.set(`${dir}/${rel}`, bytes);
  }
  const sorted = [...expected].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  const packageRoot = path.resolve(root, 'packages/specboot');
  for (const p of [path.join(root, 'packages'), packageRoot]) directory(p, true);
  const target = path.resolve(packageRoot, 'template');
  if (path.dirname(target) !== packageRoot || path.dirname(packageRoot) !== path.join(root, 'packages')) {
    throw new Error('Generated target escaped the managed package directory');
  }
  const actual = readTree(target, true);
  const manifestPath = path.join(packageRoot, 'template-manifest.json');
  const ms = optionalStat(manifestPath);
  if (ms && (ms.isSymbolicLink() || !ms.isFile())) throw new Error(`Unsafe manifest entry: ${manifestPath}`);
  const manifest = Buffer.from(JSON.stringify({
    schemaVersion: 1,
    files: sorted.map(([rel, bytes]) => ({ path: rel, source: rel, sourceSha256: hash(bytes), targetSha256: hash(bytes) }))
  }, null, 2) + '\n');
  const drift = [];
  for (const [rel, bytes] of sorted) {
    if (!actual.has(rel)) drift.push(`missing template/${rel}`);
    else if (!actual.get(rel).equals(bytes)) drift.push(`modified template/${rel}`);
  }
  for (const rel of actual.keys()) if (!expected.has(rel)) drift.push(`extra template/${rel}`);
  if (!ms || !fs.readFileSync(manifestPath).equals(manifest)) drift.push('missing or modified template-manifest.json');
  if (check && drift.length) throw new Error('Generated template drift:\n' + drift.join('\n'));
  if (!check && drift.length) {
    // The complete managed tree was checked above. This fixed absolute target is
    // inside packageRoot; no caller-controlled output path is accepted by the CLI.
    // Generation is recoverable from canonical inputs, but is not transactional.
    if (optionalStat(target)) fs.rmSync(target, { recursive: true });
    fs.mkdirSync(target, { recursive: true });
    for (const [rel, bytes] of sorted) {
      const p = path.join(target, ...rel.split('/'));
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, bytes);
    }
    fs.writeFileSync(manifestPath, manifest);
  }
  return { files: sorted.length, changed: !check && drift.length > 0, checked: check };
}
if (require.main === module) {
  try {
    if (process.argv.slice(2).some(x => x !== '--check') || process.argv.slice(2).length > 1) throw new Error('Usage: node scripts/build-template.cjs [--check]');
    console.log(JSON.stringify(build(path.resolve(__dirname, '..'), { check: process.argv.includes('--check') })));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { build };
