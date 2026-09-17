import fs from 'node:fs';import assert from 'node:assert/strict';
import {createVariationContext} from './lib/pabo-variation-context.mjs';
import {runPaboReasoningAudit} from './lib/pabo-reasoning-audit.mjs';
const html=fs.readFileSync('public/apps/pabo-rekenklaar/index.html','utf8'),context=createVariationContext(html);
const report=runPaboReasoningAudit(context);
fs.mkdirSync('/tmp/pabo-reasoning-evidence',{recursive:true});fs.writeFileSync('/tmp/pabo-reasoning-evidence/reasoning.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({version:report.version,passed:report.passed,counts:report.counts,journeys:report.journeys.map(({trail,...rest})=>rest),failures:report.failures},null,2));
assert.equal(report.passed,true,JSON.stringify(report.failures));
