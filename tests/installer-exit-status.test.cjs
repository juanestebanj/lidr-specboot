'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const cli = path.resolve(__dirname, '../packages/specboot/bin/init.js');

// Test-only injection keeps process-status checks independent of OS symlink privileges.
// Placeholder files simulate successful link creation; native link behavior is covered by T03/T06.
function fixture(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'specboot-exit-'));
  try {
    const target = path.join(dir, 'customer');
    const preload = path.join(dir, 'link-injection.cjs');
    fs.writeFileSync(preload, `
      const fs = require('node:fs'), path = require('node:path');
      fs.symlinkSync = (link, dest) => {
        const mode = process.env.SPECBOOT_TEST_LINK_MODE;
        if (mode === 'all' || (mode === 'one' && path.basename(dest) === 'CLAUDE.md')) {
          throw new Error('injected link failure');
        }
        fs.writeFileSync(dest, 'test-only link placeholder', { flag: 'wx' });
      };
    `);
    const run = mode => {
      const result = spawnSync(process.execPath, ['--require', preload, cli, target], {
        encoding: 'utf8', timeout: 15000,
        env: { ...process.env, SPECBOOT_TEST_LINK_MODE: mode }
      });
      assert.ifError(result.error);
      assert.equal(result.signal, null);
      return result;
    };
    fn({ target, run });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('T28: one recorded link failure returns one and preserves the complete report', () => fixture(({ run }) => {
  const result = run('one');
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /Errors \(1\):/);
  assert.match(result.stdout, /CLAUDE\.md: injected link failure/);
  for (const label of ['Files copied', 'Symlinks', 'Skipped', 'Next steps:']) assert.ok(result.stdout.includes(label));
}));

test('T29: multiple recorded link failures return one rather than an error count', () => fixture(({ run }) => {
  const result = run('all');
  assert.equal(result.status, 1, result.stdout + result.stderr);
  const count = result.stdout.match(/Errors \((\d+)\):/);
  assert.ok(count, result.stdout);
  assert.ok(Number(count[1]) > 1);
  assert.match(result.stdout, /GEMINI\.md: injected link failure/);
}));

test('T30: successful processing and repeat installation return zero and preserve customer bytes', () => fixture(({ target, run }) => {
  const first = run('none');
  assert.equal(first.status, 0, first.stdout + first.stderr);
  assert.doesNotMatch(first.stdout, /Errors \(/);
  assert.match(first.stdout, /Files copied\s+[1-9]\d*/);
  const owned = path.join(target, 'docs/base-standards.md');
  fs.writeFileSync(owned, 'customer-owned content\n');
  const repeat = run('none');
  assert.equal(repeat.status, 0, repeat.stdout + repeat.stderr);
  assert.match(repeat.stdout, /Files copied\s+0\b/);
  assert.equal(fs.readFileSync(owned, 'utf8'), 'customer-owned content\n');
}));
