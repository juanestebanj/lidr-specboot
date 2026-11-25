// Offline focused checks for the proposed Specboot self-specification.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'packages/specboot/bin/init.js');
const template = path.join(root, 'packages/specboot/template');
const change = 'openspec/changes/bootstrap-self-specification';
/** @param {string} p */
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
/** @param {(dir: string) => void} fn */
function temporary(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'specboot-self-'));
  try { fn(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
/** @param {string} dir @param {boolean} [explicit] */
function install(dir, explicit = true) {
  return execFileSync(process.execPath, explicit ? [cli, dir] : [cli], { cwd: dir, encoding: 'utf8', timeout: 15000 });
}
/** @param {string} dir @returns {string[]} */
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : e.name === '.DS_Store' ? [] : [p];
  });
}
test('T01: specification structure, unique IDs and traceability', () => {
  const { validate } = require('../scripts/validate-traceability.cjs');
  const result = validate(root, JSON.parse(read('openspec/traceability.json')));
  assert.ok(result.requirements >= 22); assert.ok(result.scenarios >= 28);
});
test('T02: manifest defines package payload and installer', () => {
  const pkg = JSON.parse(read('packages/specboot/package.json'));
  assert.equal(pkg.bin['lidr-specboot'], './bin/init.js');
  assert.deepEqual(pkg.files, ['bin/', 'template/', 'template-manifest.json']);
  assert.equal(pkg.engines.node, '>=18');
});
test('T03: clean explicit install copies template and creates correct links, not self-specs', () => temporary(dir => {
  const out = install(dir);
  for (const f of files(template)) assert.deepEqual(fs.readFileSync(path.join(dir, path.relative(template, f))), fs.readFileSync(f));
  for (const n of ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'codex.md']) assert.equal(fs.readlinkSync(path.join(dir, n)), 'docs/base-standards.md');
  for (const tool of ['.claude', '.cursor']) for (const kind of ['agents', 'skills']) {
    for (const n of fs.readdirSync(path.join(template, 'ai-specs', kind)).filter(n => !n.startsWith('.'))) {
      const link = path.join(dir, tool, kind, n);
      assert.equal(fs.readlinkSync(link), `../../ai-specs/${kind}/${n}`);
      assert.ok(fs.existsSync(link));
    }
  }
  assert.match(out, /Files copied\s+\d+/); assert.match(out, /Symlinks\s+\d+/); assert.match(out, /Skipped\s+\d+/); assert.match(out, /Next steps:/);
  for (const p of ['openspec', 'tests']) assert.equal(fs.existsSync(path.join(dir, p)), false);
}));
test('T04: default install uses cwd', () => temporary(dir => { install(dir, false); assert.ok(fs.existsSync(path.join(dir, 'docs/base-standards.md'))); }));
test('T05: existing file remains intact and repeat does not copy files', () => temporary(dir => {
  fs.mkdirSync(path.join(dir, 'docs')); const p = path.join(dir, 'docs/base-standards.md');
  fs.writeFileSync(p, 'customer-owned\n'); install(dir); const out = install(dir);
  assert.equal(fs.readFileSync(p, 'utf8'), 'customer-owned\n'); assert.match(out, /Files copied\s+0\b/);
}));
test('T06: canonical source and agent-specific link integrity', () => {
  for (const n of ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'codex.md']) assert.equal(fs.readlinkSync(path.join(root, n)), 'docs/base-standards.md');
  for (const tool of ['.claude', '.cursor']) for (const kind of ['agents', 'skills']) {
    const canonical = path.join(root, 'ai-specs', kind);
    for (const n of fs.readdirSync(canonical).filter(n => !n.startsWith('.'))) {
      if (kind === 'skills' && !fs.existsSync(path.join(canonical, n, 'SKILL.md'))) continue;
      const link = path.join(root, tool, kind, n);
      assert.equal(fs.realpathSync(link), fs.realpathSync(path.join(canonical, n)));
    }
  }
});
test('T07: factory instructions contain the documented order and separation', () => {
  const s = read('ai-specs/skills/factory/SKILL.md');
  const section = s.split('## Per-task pipeline (strict order)')[1].split('## Adversarial review before verify')[0];
  const terms = ['using-git-worktrees', 'enrich-us', 'openspec-new-change', 'openspec-ff-change', 'openspec-apply-change', 'adversarial-review', 'openspec-verify-change'];
  let prev = -1; for (const t of terms) { const idx = section.indexOf(t); assert.ok(idx > prev, t); prev = idx; }
  assert.match(section, /Do not run `openspec-archive-change`, `commit`, or worktree cleanup/);
  assert.match(s, /coordinator handshake/); assert.match(s, /different subagent/);
});
test('T08: independent review instructions require reproduction and spec comparison', () => {
  const s = read('ai-specs/skills/adversarial-review/SKILL.md');
  assert.match(s, /different agent or session/); assert.match(s, /Independently re-run cited evidence/); assert.match(s, /spec vs code mismatches/i);
});
test('T09: onboarding includes OpenSpec and external tool setup', () => {
  const s = read('setup-sdd.md');
  for (const term of ['Detect Existing Specboot Installation Channel', 'Install OpenSpec', 'Initialize OpenSpec', 'Import LIDR Specboot', 'Verify Symlink Integrity', 'Install CodeGraph', 'Install RTK']) assert.ok(s.includes(term), term);
});
test('T10: repository-only guidance points to baseline and pending review', () => {
  assert.match(read('openspec/config.yaml'), /^schema: spec-driven/m);
  assert.match(read('docs/base-standards.md'), /openspec\/self-specification\.md/);
  assert.match(read('README.md'), /openspec\/self-specification\.md/);
  assert.match(read('openspec/self-specification.md'), /Never allow the implementing agent to approve its own change/);
  assert.match(read(`${change}/acceptance.md`), /Independent adversarial review \| PENDING/);
});

test('T11: manual import guidance excludes repository-only paths', () => {
  const expected = ['docs', 'ai-specs', '.claude', '.cursor', 'AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'codex.md'];
  assert.deepEqual(require('../scripts/manual-import.cjs').paths, expected);
  for (const file of ['README.md','setup-sdd.md']) assert.match(read(file), /node .*scripts\/manual-import\.cjs/);
});
