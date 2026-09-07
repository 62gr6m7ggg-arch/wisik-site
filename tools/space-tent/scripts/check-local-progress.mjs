import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Works before integration (source beside this script), and in a repository
// when passed the app/local-progress.ts entry as a second argument.
const site = resolve(process.argv[2] || process.cwd());
const localEntry = resolve(process.argv[3] || resolve(site, 'app/local-progress.ts'));
const require = createRequire(resolve(site, 'package.json'));
const {build} = require('esbuild');
async function load(entry) {
  const result = await build({entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', write: false,
    plugins: [{name: 'use-site-model', setup(builder) {
      builder.onResolve({filter: /^\.\/(model|geometry-math|workbench-math)$/}, args => {
        if (resolve(args.importer) === localEntry) return {path: resolve(site, 'app', args.path + '.ts')};
      });
    }}],
  });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
}
const L = await load(localEntry);
const M = await load(resolve(site, 'app/model.ts'));
const W = await load(resolve(site, 'app/workbench-math.ts'));
let serial = 0;
const freshId = () => `local-test-${String(++serial).padStart(6, '0')}`;
const answer = (questionId, value = M.QUESTIONS[questionId].answer, extras = {}) => ({id: freshId(), type: 'answer', payload: {questionId, answer: [...value], helped: false, context: 'practice', sessionId: 'learning-session-1', ...extras}});
const stamped = (event, at = ++serial) => ({...event, at});
const envelope = events => JSON.stringify({format: L.LOCAL_PROGRESS_FORMAT, version: L.LOCAL_PROGRESS_VERSION, events});
class MemoryStorage {
  values = new Map(); writes = 0; denyRead = false; denyWrite = false; discardWrite = false;
  getItem(key) {if (this.denyRead) throw new Error('SecurityError'); return this.values.get(key) ?? null;}
  setItem(key, text) {if (this.denyWrite) throw new Error('QuotaExceededError'); this.writes++; if (!this.discardWrite) this.values.set(key, text);}
}
const create = () => {const storage = new MemoryStorage(); return {storage, store: L.createLocalProgressStore(storage)};};
const eventCount = result => {assert.equal(result.ok, true, result.error); return result.events.length;};
const assertFailure = (result, pattern) => {assert.equal(result.ok, false); assert.match(result.error, pattern);};
const invalidImport = (events, pattern) => {
  const {store, storage} = create(); store.append(answer('p1'), 1);
  const previous = storage.getItem(L.LOCAL_PROGRESS_KEY);
  assertFailure(store.importProgress(envelope(events)), pattern);
  assert.equal(storage.getItem(L.LOCAL_PROGRESS_KEY), previous, 'Invalid imports must never overwrite existing progress');
};

// Fail immediately if any operation attempts a network request, including an
// uploaded construction. The adapter also has no browser-global dependency.
let networkCalls = 0;
const originalFetch = globalThis.fetch;
globalThis.fetch = () => {networkCalls++; throw new Error('Local progress must not use fetch');};

// Reload, canonical scoring, retry IDs, and import across devices.
const first = create();
assert.deepEqual(first.store.load(), {ok: true, events: []});
const wrong = answer('p1', ['a'], {correct: true});
assert.equal(eventCount(first.store.append(wrong, 100)), 1);
let reloaded = L.createLocalProgressStore(first.storage).load();
assert.equal(reloaded.events[0].payload.correct, false, 'Ignore claimed correctness');
assert.equal(M.deriveProgress(reloaded.events).xp, 0);
const right = answer('p1');
assert.equal(eventCount(first.store.append(right, 101)), 2);
let progress = M.deriveProgress(first.store.load().events);
assert.equal(progress.evidence.p1.independent, false, 'A corrected answer remains a retry after reload');
assert.equal(progress.xp, 10);
assert.equal(eventCount(first.store.append(right, 999)), 2, 'Retrying an event ID is idempotent');
const exported = first.store.exportProgress();
assert.equal(exported.ok, true);
const second = create();
second.store.append(answer('p2'), 102);
assert.equal(eventCount(second.store.importProgress(exported.text)), 3);
assert.equal(eventCount(second.store.importProgress(exported.text)), 3, 'Repeated import does not add attempts or XP');
assert.equal(M.deriveProgress(second.store.load().events).xp, 30);
assert.equal(eventCount(L.createLocalProgressStore(second.storage).load()), 3);
assert.equal(eventCount(first.store.load()), 2, 'Export/import does not mutate the source device');

// One ID cannot silently replace a different answer. Caller mutation also
// cannot modify the adapter's persisted or fallback state.
const beforeConflict = first.storage.getItem(L.LOCAL_PROGRESS_KEY);
assertFailure(first.store.append({...wrong, payload: {...wrong.payload, answer: ['c']}}, 200), /hetzelfde nummer/);
assert.equal(first.storage.getItem(L.LOCAL_PROGRESS_KEY), beforeConflict);
const isolated = first.store.load(); isolated.events[0].payload.answer[0] = 'c';
assert.equal(first.store.load().events[0].payload.answer[0], 'a');

// Validate every currently playable question, its choice domain, and context.
for (const block of M.BANK.blocks) for (const [context, ids] of [['practice', block.questionIds], ['probe', block.probeIds], ['retest', block.retestIds]]) {
  for (const id of ids) {
    const result = create().store.append(answer(id, M.QUESTIONS[id].answer, {context}));
    assert.equal(result.ok, true, id + ': ' + result.error);
    assert.equal(result.events[0].payload.correct, true, id);
  }
}
invalidImport([stamped(answer('p1', ['c'], {context: 'check'}))], /oefenreeks/);
invalidImport([stamped(answer('p1', ['niet-bestaand']))], /ongeldig antwoord/);
invalidImport([stamped(answer('v3', ['A', 'A']))], /ongeldig antwoord/);
invalidImport([stamped({...answer('p1'), payload: {...answer('p1').payload, questionId: '__proto__'}})], /onbekende vraag/);
invalidImport([{id: freshId(), at: 1, type: 'admin', payload: {level1Passed: true}}], /onbekende handeling/);
invalidImport([{...stamped(answer('p1')), at: 1.5}], /ongeldige handeling/);

// A block completion is coverage, not mastery, and needs preceding answers.
const block = M.BANK.blocks[0];
const blockEvent = {id: freshId(), type: 'block', payload: {blockId: block.id}};
invalidImport([stamped(blockEvent)], /niet alle oefenantwoorden/);
invalidImport([stamped({...blockEvent, payload: {blockId: 'level-seven'}})], /onbekend lesblok/);
const covered = create();
block.questionIds.forEach((id, i) => assert.equal(covered.store.append(answer(id), 10 + i).ok, true));
assert.equal(covered.store.append(blockEvent, 20).ok, true);
assert.deepEqual(M.deriveProgress(covered.store.load().events).complete, [block.id]);
assert.equal(M.deriveProgress(covered.store.load().events).level1Passed, false);
invalidImport([stamped(blockEvent, 0), ...block.questionIds.map((id, i) => stamped(answer(id), i + 1))], /niet alle oefenantwoorden/);

// Independent checks need every distinct checkpoint in one unhelped session.
const check = create();
for (const [i, id] of M.CHECKS['1'].entries()) {
  assert.equal(check.store.append(answer(id, M.QUESTIONS[id].answer, {context: 'check', sessionId: 'check-session'}), 100 + i).ok, true);
  assert.equal(M.deriveProgress(check.store.load().events).successfulCheck, i === M.CHECKS['1'].length - 1);
}
assert.equal(M.deriveProgress(check.store.load().events).level1Passed, false);
const checkEvents = check.store.load().events;
const changedCheck = checkEvents.map((event, i) => i ? event : {...event, payload: {...event.payload, answer: [M.QUESTIONS[event.payload.questionId].options.find(o => !M.QUESTIONS[event.payload.questionId].answer.includes(o.id)).id], correct: true}});
const tampered = create(); assert.equal(tampered.store.importProgress(envelope(changedCheck)).ok, true);
assert.equal(M.deriveProgress(tampered.store.load().events).successfulCheck, false, 'Do not trust imported checkpoint success');
const differentSessions = create();
assert.equal(differentSessions.store.importProgress(envelope(checkEvents.map((event, i) => ({...event, payload: {...event.payload, sessionId: `session-${i}`}})))).ok, true);
assert.equal(M.deriveProgress(differentSessions.store.load().events).successfulCheck, false);

// Paper is explicitly self-check and cannot be passed with repeated criteria.
invalidImport([{id: freshId(), at: 1, type: 'paper', payload: {checks: ['figure', 'figure', 'figure', 'figure']}}], /ongeldige zelfcontrole/);
const paper = create();
paper.store.append({id: freshId(), type: 'paper', payload: {checks: ['figure'], source: 'teacher-certified'}}, 1);
assert.equal(M.deriveProgress(paper.store.load().events).paperDone, false);
paper.store.append({id: freshId(), type: 'paper', payload: {checks: ['figure', 'relations', 'intersection', 'reason'], source: 'teacher-certified'}}, 2);
assert.equal(M.deriveProgress(paper.store.load().events).paperDone, true);
assert.equal(paper.store.load().events[1].payload.source, 'self-check');

// Full level gate: four covered blocks + independent check + paper self-check.
const full = create(); let time = 0;
for (const b of M.BANK.blocks) {
  for (const id of b.questionIds) full.store.append(answer(id), ++time);
  full.store.append({id: freshId(), type: 'block', payload: {blockId: b.id}}, ++time);
}
assert.equal(M.deriveProgress(full.store.load().events).level1Passed, false);
full.store.importProgress(check.store.exportProgress().text);
assert.equal(M.deriveProgress(full.store.load().events).level1Passed, false);
full.store.importProgress(paper.store.exportProgress().text);
assert.equal(M.deriveProgress(full.store.load().events).level1Passed, true);
assert.equal(M.deriveProgress(L.createLocalProgressStore(full.storage).load().events).level1Passed, true);

// Verify proof again for both workbench variants, and remove unrelated labels
// and identifiers from the local/exported payload. No construct is uploaded.
for (const variant of [0, 1]) {
  const construct = create();
  const points = W.initialPoints(variant), corners = W.sectionPoints(variant);
  const lines = corners.map((a, i) => ({id: freshId(), name: 'private-name-must-not-survive', a, b: corners[(i + 1) % 4]}));
  const event = {id: freshId(), type: 'workbench', payload: {variant, helped: false, correct: false, points: {...points, privatePointName: [0, 0, 0]}, lines, userId: 'private-account-id'}};
  assert.equal(construct.store.append(event, 100).ok, true);
  assert.equal(M.deriveProgress(construct.store.load().events).xp, 60);
  const copy = construct.store.exportProgress();
  assert.ok(!copy.text.includes('private-') && !copy.text.includes('privatePointName') && !copy.text.includes('userId'));
  const other = create(); assert.equal(other.store.importProgress(copy.text).ok, true);
  assert.equal(M.deriveProgress(L.createLocalProgressStore(other.storage).load().events).workbench.payload.correct, true);
  const wrongProof = {...event, id: freshId(), payload: {...event.payload, lines: lines.slice(0, 3), correct: true}};
  const rejected = create(); assertFailure(rejected.store.append(wrongProof), /nog niet compleet/);
  assert.equal(rejected.store.load().events.length, 0);
  const proofImport = create(); assert.equal(proofImport.store.importProgress(envelope([stamped(wrongProof)])).ok, true);
  assert.equal(M.deriveProgress(proofImport.store.load().events).workbench, undefined, 'A forged correct flag must not pass an incomplete construction');
  const forged = {id: freshId(), type: 'workbench', at: 1, payload: {correct: true, variant, helped: false}};
  invalidImport([forged], /ongeldige constructie/);
}

// All-or-nothing malformed-file rejection, version checking, size bounds.
const safe = create(); safe.store.append(answer('p1'), 100);
const beforeBadFile = safe.storage.getItem(L.LOCAL_PROGRESS_KEY);
for (const text of ['not JSON', '<html>wrong file</html>', '{}', JSON.stringify({format: L.LOCAL_PROGRESS_FORMAT, version: 999, events: []}), ' '.repeat(L.MAX_PROGRESS_CHARACTERS + 1)]) {
  assert.equal(safe.store.importProgress(text).ok, false);
  assert.equal(safe.storage.getItem(L.LOCAL_PROGRESS_KEY), beforeBadFile);
}
safe.storage.values.set(L.LOCAL_PROGRESS_KEY, 'damaged');
assertFailure(safe.store.load(), /geen leesbaar/);
assertFailure(safe.store.append(answer('p2')), /geen leesbaar/);
assert.equal(safe.storage.getItem(L.LOCAL_PROGRESS_KEY), 'damaged', 'Do not silently replace corrupt storage');

// Quota/security failures and silent discards never return a successful save.
const quota = create(); quota.store.append(answer('p1'), 100);
const beforeQuota = quota.storage.getItem(L.LOCAL_PROGRESS_KEY);
quota.storage.denyWrite = true;
const unsaved = answer('p2');
assertFailure(quota.store.append(unsaved, 101), /vol of geblokkeerd/);
assert.equal(quota.storage.getItem(L.LOCAL_PROGRESS_KEY), beforeQuota);
assert.equal(quota.store.load().events.length, 1);
assertFailure(quota.store.importProgress(exported.text), /vol of geblokkeerd/);
assert.equal(quota.storage.getItem(L.LOCAL_PROGRESS_KEY), beforeQuota);
quota.storage.denyWrite = false;
assert.equal(quota.store.append(unsaved, 102).ok, true);
assert.equal(quota.store.load().events.length, 2);
const inaccessible = L.createLocalProgressStore(() => {throw new Error('SecurityError');});
assertFailure(inaccessible.load(), /geen toegang/);
assertFailure(inaccessible.append(answer('p1')), /geen toegang/);
const silent = create(); silent.storage.discardWrite = true;
assertFailure(silent.store.append(answer('p1')), /niet bevestigd/);
assert.equal(silent.store.load().events.length, 0);

// Interleaved tabs read the current store before appending; a backwards clock
// does not turn an assisted correction into an independent first answer.
const tabs = create(), tabTwo = L.createLocalProgressStore(tabs.storage);
tabs.store.append(answer('p1', ['a']), 1000);
tabTwo.append(answer('p1'), 1);
assert.equal(tabs.store.load().events.length, 2);
assert.equal(M.deriveProgress(tabs.store.load().events).evidence.p1.independent, false);

assert.equal(networkCalls, 0);
globalThis.fetch = originalFetch;
const source = readFileSync(localEntry, 'utf8');
assert.ok(!/\b(fetch|XMLHttpRequest|sendBeacon|WebSocket)\s*\(/.test(source), 'The adapter contains no network sender');
console.log('Local progress checks passed: all available questions, fresh/reloaded storage, scoring and level gates, proof rechecking for both construction variants, duplicate/conflicting IDs, safe import/export, malformed files, quota/security failures, clock reversal and no network calls.');
