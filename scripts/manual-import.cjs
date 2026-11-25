#!/usr/bin/env node
'use strict';
// Local source import only; not part of the NPM package.
const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve(__dirname, '..');
const paths = ['docs','ai-specs','.claude','.cursor','AGENTS.md','CLAUDE.md','GEMINI.md','codex.md'];
const onboarding = 'ai-specs/specboot-instructions.md';
function stat(p) { try { return fs.lstatSync(p); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
function fail(p) { throw new Error(`Conflicting import path: ${p}`); }
function run(target) {
  target = path.resolve(target);
  const root = stat(target);
  if (!root || !root.isDirectory() || root.isSymbolicLink()) fail(target);
  target = fs.realpathSync(target);
  if (target === source || target.startsWith(source + path.sep)) fail(target);
  const plan = [];
  // Preflight every destination before creating any entries. No destination directory symlinks.
  function inspect(rel) {
    const src = path.join(source, rel), dst = path.join(target, rel);
    const a = fs.lstatSync(src), b = stat(dst);
    if (a.isDirectory()) {
      if (b && !b.isDirectory()) fail(rel);
      if (!b) plan.push(() => fs.mkdirSync(dst));
      for (const child of fs.readdirSync(src).sort()) if (child !== '.DS_Store') inspect(path.join(rel, child));
    } else if (a.isSymbolicLink()) {
      const link = fs.readlinkSync(src);
      const resolved = path.resolve(path.dirname(src), link);
      if (path.isAbsolute(link) || !resolved.startsWith(source + path.sep)) fail(rel);
      if (b && (!b.isSymbolicLink() || fs.readlinkSync(dst) !== link)) {
        // Existing regular agent files are customer-owned; never overwrite them.
        if (!b.isFile()) fail(rel);
      }
      if (!b) plan.push(() => fs.symlinkSync(link, dst));
    } else if (a.isFile()) {
      if (b && !b.isFile()) fail(rel);
      if (rel === onboarding && b && !fs.readFileSync(src).equals(fs.readFileSync(dst))) fail(rel);
      if (!b) plan.push(() => fs.copyFileSync(src, dst, fs.constants.COPYFILE_EXCL));
    } else fail(rel);
  }
  if (!fs.lstatSync(path.join(source, onboarding)).isFile()) fail(onboarding);
  for (const rel of paths) inspect(rel);
  for (const op of plan) op();
  console.log(`Specboot manual import: ${plan.length} entries created; existing files preserved`);
}
if (require.main === module) {
  try { if (process.argv.length !== 3) throw new Error('Usage: node scripts/manual-import.cjs EXISTING_TARGET_DIRECTORY'); run(process.argv[2]); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
module.exports = { run, paths };
