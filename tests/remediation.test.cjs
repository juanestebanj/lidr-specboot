'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'), path=require('node:path'), os=require('node:os');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const change='openspec/changes/bootstrap-self-specification';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const factory=()=>read('ai-specs/skills/factory/SKILL.md');
const {validate}=require('../scripts/validate-traceability.cjs');
const mapping=()=>JSON.parse(read('openspec/traceability.json'));
function temp(fn){const d=fs.mkdtempSync(path.join(os.tmpdir(),'specboot-remediation-'));try{fn(d);}finally{fs.rmSync(d,{recursive:true,force:true});}}
function importer(d){return spawnSync(process.execPath,[path.join(root,'scripts/manual-import.cjs'),d],{encoding:'utf8',timeout:15000});}
function onboarding(d){return path.join(d,'ai-specs/specboot-instructions.md');}
function goodImport(d){let r=importer(d);assert.equal(r.status,0,r.stderr);assert.ok(fs.lstatSync(onboarding(d)).isFile());assert.equal(fs.readFileSync(onboarding(d),'utf8'),read('ai-specs/specboot-instructions.md'));for(const p of ['openspec','tests','packages','scripts'])assert.equal(fs.existsSync(path.join(d,p)),false);}
test('T12: source maintenance precedence and customer greenfield separation (instruction)',()=>{
 const s=factory(); const profile=s.split('## Source self-maintenance mode (takes precedence)')[1].split('## Task source')[0];
 for(const term of ['relevant baseline and active delta','greenfield-only prohibitions','MODIFIED/REMOVED','For customer tasks outside this mode','Pass this mode and precedence'])assert.ok(profile.includes(term),term);
 assert.match(s,/Jira greenfield mode \(mandatory for Jira outside source self-maintenance\)/);assert.match(read('openspec/config.yaml'),/overrides Jira greenfield restrictions/);
});
test('T13: lifecycle instructions isolate acceptance from apply',()=>{
 const s=factory();assert.match(s,/acceptance gates in `acceptance.md` are outside apply completeness/);assert.match(s,/If the independent reviewer or trusted CLI is unavailable, report a blocked gate and stop/);
 const tasks=read(`${change}/tasks.md`);const checklist=tasks.split('\n').filter(l=>/^- \[[ x]\]/.test(l));assert.ok(checklist.length);assert.ok(checklist.every(l=>!/(independent review|maintainer acceptance|archiv|official CLI)/i.test(l)));
 const gates=read(`${change}/acceptance.md`);let last=-1;for(const term of ['Independent adversarial review | PENDING','Official OpenSpec strict validation and final verification | PENDING','Maintainer acceptance | PENDING','Synchronization and archival | PENDING']){const n=gates.indexOf(term);assert.ok(n>last,term);last=n;}
});
test('T14: empty manual import gets correct regular onboarding and reusable paths',()=>temp(d=>{goodImport(d);assert.equal(fs.existsSync(path.join(d,'README.md')),false);assert.ok(fs.existsSync(path.join(d,'.claude/skills/factory/SKILL.md')));}));
test('T15: customer README preserved and repeat manual import is idempotent',()=>temp(d=>{const p=path.join(d,'README.md');fs.writeFileSync(p,'customer-owned');goodImport(d);goodImport(d);assert.equal(fs.readFileSync(p,'utf8'),'customer-owned');}));
test('T16: conflicting onboarding symlink rejected without modifying its target',()=>temp(d=>{const p=path.join(d,'README.md');fs.writeFileSync(p,'customer-owned');fs.mkdirSync(path.join(d,'ai-specs'));fs.symlinkSync('../README.md',onboarding(d));const r=importer(d);assert.notEqual(r.status,0);assert.match(r.stderr,/Conflicting import path/);assert.equal(fs.readFileSync(p,'utf8'),'customer-owned');assert.equal(fs.existsSync(path.join(d,'docs')),false);}));
test('T17: conflicting regular onboarding rejected without overwriting',()=>temp(d=>{fs.mkdirSync(path.join(d,'ai-specs'));fs.writeFileSync(onboarding(d),'custom');const r=importer(d);assert.notEqual(r.status,0);assert.equal(fs.readFileSync(onboarding(d),'utf8'),'custom');assert.equal(fs.existsSync(path.join(d,'docs')),false);}));
test('T18: all scenario identities and references validated',()=>{const r=validate(root,mapping());assert.equal(r.requirements,40);assert.equal(r.scenarios,54);});
test('T19: invalid mapped source rejected',()=>{const m=mapping();m.scenarios[0].sources=['nonexistent.js'];assert.throws(()=>validate(root,m),/Missing source/);});
test('T20: nonexistent test identity rejected',()=>{const m=mapping();m.scenarios.find(x=>x.tests.length).tests=['T99'];assert.throws(()=>validate(root,m),/Unknown test/);});
test('T21: omitted scenario rejected',()=>{const m=mapping();m.scenarios.pop();assert.throws(()=>validate(root,m),/Missing scenario mapping/);});
test('T22: duplicate mapping rejected',()=>{const m=mapping();m.scenarios.push(m.scenarios[0]);assert.throws(()=>validate(root,m),/Duplicate mapping/);});
test('T23: invalid classification and escaping source rejected',()=>{let m=mapping();m.scenarios[0].kind='claimed-pass';assert.throws(()=>validate(root,m),/Invalid evidence kind/);m=mapping();m.scenarios[0].sources=['../outside'];assert.throws(()=>validate(root,m),/Invalid source/);});
test('T24: affected-surface QA profile consistent across source instructions',()=>{for(const file of ['ai-specs/skills/factory/SKILL.md','docs/openspec-tasks-mandatory-steps.md','openspec/config.yaml']){const s=read(file);assert.match(s,/affected.surface/i);assert.match(s,/acceptance\.md/);assert.match(s,/N\/A/);}assert.match(read('docs/openspec-tasks-mandatory-steps.md'),/Do not create fictional database, curl or Playwright reports/);});
test('T25: canonical skill inventory exhaustive for top-level entries',()=>{const s=read('openspec/capability-inventory.md');const actual=fs.readdirSync(path.join(root,'ai-specs/skills')).filter(n=>fs.existsSync(path.join(root,'ai-specs/skills',n,'SKILL.md'))).sort();const rows=[...s.matchAll(/^\| ([a-z-]+) \| ai-specs\/skills\/\1\/SKILL\.md \|/gm)].map(m=>m[1]).sort();assert.deepEqual(rows,actual);for(const term of ['Task acquisition and Jira status','Workspace','Model selection','Documentation rendering','Code review scripting','Documentation maintenance','Installer failure and recovery'])assert.ok(s.includes(term));});
test('T26: installer reports recorded link creation error (injected failure)',()=>temp(d=>{const preload=path.join(d,'fail-link.cjs');fs.writeFileSync(preload,`const fs=require('node:fs');const real=fs.symlinkSync;fs.symlinkSync=(target,dest,...rest)=>{if(dest.endsWith('CLAUDE.md'))throw new Error('injected link failure');return real(target,dest,...rest)};`);const target=path.join(d,'customer');const r=spawnSync(process.execPath,['--require',preload,path.join(root,'packages/specboot/bin/init.js'),target],{encoding:'utf8',timeout:15000});assert.equal(r.status,1,r.stderr);assert.match(r.stdout,/Errors \(1\):/);assert.match(r.stdout,/CLAUDE\.md: injected link failure/);}));
test('T27: symlinked customer directory rejected before writes',()=>temp(d=>{const outside=path.join(d,'external'),customer=path.join(d,'customer');fs.mkdirSync(outside);fs.mkdirSync(customer);fs.symlinkSync(outside,path.join(customer,'docs'),'dir');const r=importer(customer);assert.notEqual(r.status,0);assert.deepEqual(fs.readdirSync(outside),[]);}));
