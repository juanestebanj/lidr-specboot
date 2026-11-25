'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const fail = msg => { throw new Error(msg); };
function unique(xs, label) { if (new Set(xs).size !== xs.length) fail(`Duplicate ${label}`); }
function resolveFile(base, rel) {
  if (typeof rel !== 'string' || path.isAbsolute(rel) || rel.split(/[\\/]/).includes('..')) fail(`Invalid source: ${rel}`);
  let p; try { p = fs.realpathSync(path.resolve(base, rel)); } catch { fail(`Missing source: ${rel}`); }
  if (!p.startsWith(fs.realpathSync(base) + path.sep) || !fs.statSync(p).isFile()) fail(`Invalid source: ${rel}`);
  return p;
}
function discover(base) {
  const specs = [];
  const dir = path.join(base, 'openspec');
  for (const cap of fs.readdirSync(path.join(dir,'specs'))) specs.push(`openspec/specs/${cap}/spec.md`);
  for (const change of fs.readdirSync(path.join(dir,'changes'),{withFileTypes:true})) {
    if (!change.isDirectory() || change.name === 'archive') continue;
    const sub = path.join(dir,'changes',change.name,'specs');
    if (fs.existsSync(sub)) for (const cap of fs.readdirSync(sub)) specs.push(`openspec/changes/${change.name}/specs/${cap}/spec.md`);
  }
  const reqs = [], scenarios = new Map();
  for (const spec of specs) {
    const text = fs.readFileSync(resolveFile(base,spec),'utf8');
    for (const req of text.split(/^### Requirement: /m).slice(1)) {
      const id = req.match(/^([A-Z]+-\d{2}) /)?.[1];
      if (!id || !/\bSHALL\b/.test(req)) fail(`Invalid requirement in ${spec}`);
      reqs.push(id);
      const blocks = req.split(/^#### Scenario: /m).slice(1);
      if (!blocks.length) fail(`Missing scenarios: ${id}`);
      for (const block of blocks) {
        const sid = block.match(/^([A-Z]+-\d{2}-S\d{2}) /)?.[1];
        if (!sid || !sid.startsWith(id+'-') || !/^.+\n- \*\*WHEN\*\* .+\n- \*\*THEN\*\* .+/.test(block)) fail(`Invalid scenario: ${id}`);
        if (scenarios.has(sid)) fail(`Duplicate scenario: ${sid}`);
        scenarios.set(sid, { requirement:id, spec });
      }
    }
  }
  unique(reqs,'requirement');
  if (!reqs.length) fail('No requirements');
  const tests = new Map();
  for (const file of fs.readdirSync(path.join(base,'tests')).filter(x=>x.endsWith('.test.cjs'))) {
    const rel = `tests/${file}`;
    for (const m of fs.readFileSync(resolveFile(base,rel),'utf8').matchAll(/^test\(['"](T\d{2}):/gm)) {
      if (tests.has(m[1])) fail(`Duplicate test: ${m[1]}`);
      tests.set(m[1],rel);
    }
  }
  return {reqs,scenarios,tests};
}
function validate(base, data) {
  const {reqs,scenarios,tests} = discover(base);
  if (data.version !== 1 || !Array.isArray(data.scenarios)) fail('Invalid mapping schema');
  const ids = [];
  for (const row of data.scenarios) {
    const expected = scenarios.get(row.id);
    if (!expected || expected.requirement !== row.requirement || expected.spec !== row.spec) fail(`Unknown/mismatched scenario: ${row.id}`);
    ids.push(row.id);
    if (!Array.isArray(row.sources) || !row.sources.length || !Array.isArray(row.tests) || !row.reason?.trim()) fail(`Incomplete mapping: ${row.id}`);
    unique(row.sources,`sources for ${row.id}`); unique(row.tests,`tests for ${row.id}`);
    for (const rel of row.sources) resolveFile(base,rel);
    if (!['runtime','instruction','inspection','structure'].includes(row.kind)) fail(`Invalid evidence kind: ${row.id}`);
    if ((row.kind === 'inspection') !== (row.tests.length === 0)) fail(`Invalid test coverage classification: ${row.id}`);
    for (const id of row.tests) if (!tests.has(id)) fail(`Unknown test: ${id}`);
  }
  unique(ids,'mapping');
  if (ids.length !== scenarios.size) fail('Missing scenario mapping');
  return {requirements:reqs.length,scenarios:ids.length,tests:tests.size};
}
if (require.main === module) {
  try { console.log(JSON.stringify(validate(root,JSON.parse(fs.readFileSync(path.join(root,'openspec/traceability.json'),'utf8'))))); }
  catch(e) { console.error(e.message); process.exitCode=1; }
}
module.exports={discover,validate};
