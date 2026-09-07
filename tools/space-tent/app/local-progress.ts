import {BANK, QUESTIONS, correctAnswer, type LearningEvent} from './model';
import {CUBE, distance, type DrawLine, type V3} from './geometry-math';
import {initialPoints, verifyWorkbench} from './workbench-math';

/** Only this adapter's key is read or written. No network or account is used. */
export const LOCAL_PROGRESS_KEY = 'wisik.space-tent.progress.v1';
export const LOCAL_PROGRESS_FORMAT = 'wisik-space-tent-progress';
export const LOCAL_PROGRESS_VERSION = 1;
export const MAX_PROGRESS_CHARACTERS = 2_000_000;
export const MAX_PROGRESS_EVENTS = 5_000;

export type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'>;
export type LocalProgressResult = {ok: boolean; events: LearningEvent[]; error?: string};
export type LocalProgressExport = LocalProgressResult & {text?: string};
export type NewLocalEvent = Pick<LearningEvent, 'id' | 'type' | 'payload'>;
type Envelope = {format: typeof LOCAL_PROGRESS_FORMAT; version: typeof LOCAL_PROGRESS_VERSION; events: LearningEvent[]};

const contexts = {
  practice: new Set(BANK.blocks.flatMap(b => b.questionIds)),
  probe: new Set(BANK.blocks.flatMap(b => b.probeIds)),
  retest: new Set(BANK.blocks.flatMap(b => b.retestIds)),
  check: new Set(BANK.checkpointIds),
};
const paperChecks = ['figure', 'relations', 'intersection', 'reason'];
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const own = (v: object, key: string) => Object.prototype.hasOwnProperty.call(v, key);
function fail(message: string): never {throw new Error(message);}
const clone = (events: LearningEvent[]): LearningEvent[] => JSON.parse(JSON.stringify(events)) as LearningEvent[];
const vector = (v: unknown): v is V3 => Array.isArray(v) && v.length === 3 && v.every(n => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) < 20);

/** Allowlisted fields only: imported names, identifiers or other data are not kept. */
function normalizeEvent(value: unknown): LearningEvent {
  if (!record(value) || typeof value.id !== 'string' || !/^[a-zA-Z0-9-]{10,80}$/.test(value.id)
    || typeof value.at !== 'number' || !Number.isSafeInteger(value.at) || value.at < 0 || value.at > 8_640_000_000_000_000
    || !record(value.payload)) fail('Het voortgangsbestand bevat een ongeldige handeling.');
  const payload = value.payload;
  let clean: Record<string, unknown>;
  if (value.type === 'answer') {
    const {questionId, answer, helped, context, sessionId} = payload;
    if (typeof questionId !== 'string' || !own(QUESTIONS, questionId)) fail('Het voortgangsbestand bevat een onbekende vraag.');
    const question = QUESTIONS[questionId];
    if (typeof context !== 'string' || !own(contexts, context) || !contexts[context as keyof typeof contexts].has(questionId)) fail('Een antwoord hoort niet bij deze oefenreeks.');
    const allowed = question.type === 'choice' ? (question.options || []).map(o => o.id) : [...Object.keys(CUBE), ...Object.keys(question.extraPoints || {})];
    const answerCount = question.selectCount || (question.type === 'points' ? question.answer.length : 1);
    if (!Array.isArray(answer) || answer.length !== answerCount || answer.some(v => typeof v !== 'string' || !allowed.includes(v))
      || new Set(answer).size !== answer.length || typeof helped !== 'boolean'
      || typeof sessionId !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(sessionId)) fail('Het voortgangsbestand bevat een ongeldig antwoord.');
    clean = {questionId, answer: [...answer], helped, context, sessionId, correct: correctAnswer(question, answer)};
  } else if (value.type === 'block') {
    const block = BANK.blocks.find(b => b.id === payload.blockId);
    if (!block) fail('Het voortgangsbestand bevat een onbekend lesblok.');
    clean = {blockId: block.id};
  } else if (value.type === 'paper') {
    const {checks} = payload;
    if (!Array.isArray(checks) || checks.length > 4 || checks.some(v => typeof v !== 'string' || !paperChecks.includes(v)) || new Set(checks).size !== checks.length) fail('Het voortgangsbestand bevat een ongeldige zelfcontrole.');
    clean = {checks: paperChecks.filter(check => checks.includes(check)), source: 'self-check'};
  } else if (value.type === 'workbench') {
    const {lines, points, variant, helped} = payload;
    if ((variant !== 0 && variant !== 1) || typeof helped !== 'boolean' || !Array.isArray(lines) || lines.length > 60
      || !record(points) || Object.keys(points).length > 32 || Object.values(points).some(p => !vector(p))) fail('Het voortgangsbestand bevat een ongeldige constructie.');
    const proof: DrawLine[] = lines.map((line, index) => {
      if (!record(line) || !vector(line.a) || !vector(line.b) || distance(line.a, line.b) <= 1e-6
        || (line.infinite !== undefined && typeof line.infinite !== 'boolean')) fail('Het voortgangsbestand bevat een ongeldige constructielijn.');
      return {id: `proof-${index}`, name: `h${index + 1}`, a: [...line.a] as V3, b: [...line.b] as V3, infinite: line.infinite === true};
    });
    // The proof is local and exported only on explicit request. Storing the
    // minimum geometry permits rechecking instead of trusting a supplied flag.
    const cleanPoints = initialPoints(variant);
    clean = {variant, helped, lines: proof, points: cleanPoints, correct: verifyWorkbench(proof, cleanPoints, variant)};
  } else fail('Het voortgangsbestand bevat een onbekende handeling.');
  return {id: value.id, type: value.type, at: value.at, payload: clean};
}

function orderedUnique(events: LearningEvent[]): LearningEvent[] {
  const byId = new Map<string, LearningEvent>();
  for (const event of events) {
    const previous = byId.get(event.id);
    if (previous) {
      // Retrying one event with a new timestamp is safe; different content with
      // the same ID is a conflict and must never silently replace an answer.
      if (previous.type !== event.type || JSON.stringify(previous.payload) !== JSON.stringify(event.payload)) fail('Twee handelingen hebben hetzelfde nummer maar een verschillende inhoud. Er is niets overschreven.');
    } else byId.set(event.id, event);
  }
  if (byId.size > MAX_PROGRESS_EVENTS) fail('Er zijn te veel opgeslagen handelingen voor één voortgangsbestand. Bewaar eerst een kopie van je voortgang.');
  // Stable ordering retains first-attempt evidence when timestamps coincide.
  return [...byId.values()].sort((a, b) => a.at - b.at);
}

function validateBlockEvidence(events: LearningEvent[]): void {
  const attempted = new Set<string>();
  for (const event of events) {
    if (event.type === 'answer' && event.payload.context === 'practice') attempted.add(String(event.payload.questionId));
    if (event.type === 'block') {
      const block = BANK.blocks.find(b => b.id === event.payload.blockId)!;
      if (!block.questionIds.every(id => attempted.has(id))) fail('Een lesblok is als afgerond gemarkeerd terwijl niet alle oefenantwoorden aanwezig zijn.');
    }
  }
}

/** Recalculates correctness; never accepts a imported XP, pass or correct flag. */
export function validateLocalEvents(values: unknown): LearningEvent[] {
  if (!Array.isArray(values) || values.length > MAX_PROGRESS_EVENTS) fail('Het voortgangsbestand bevat geen geldige reeks handelingen.');
  const events = orderedUnique(values.map(normalizeEvent));
  validateBlockEvidence(events);
  return events;
}

/** Complete exports may be merged; repeated imports do not award extra XP. */
export function mergeLocalEvents(existing: unknown, incoming: unknown): LearningEvent[] {
  const events = orderedUnique([...validateLocalEvents(existing), ...validateLocalEvents(incoming)]);
  validateBlockEvidence(events);
  return events;
}

function parse(text: string): LearningEvent[] {
  if (typeof text !== 'string' || text.length > MAX_PROGRESS_CHARACTERS) fail('Het voortgangsbestand is te groot.');
  let envelope: unknown;
  try {envelope = JSON.parse(text);} catch {return fail('Dit is geen leesbaar voortgangsbestand. Je bestaande voortgang is niet vervangen.');}
  if (!record(envelope) || envelope.format !== LOCAL_PROGRESS_FORMAT || envelope.version !== LOCAL_PROGRESS_VERSION) fail('Dit bestand is geen ondersteunde Space-tent-voortgang.');
  return validateLocalEvents(envelope.events);
}

function serialize(events: LearningEvent[]): string {
  const envelope: Envelope = {format: LOCAL_PROGRESS_FORMAT, version: LOCAL_PROGRESS_VERSION, events};
  const text = JSON.stringify(envelope);
  if (text.length > MAX_PROGRESS_CHARACTERS) fail('Je voortgang is te groot voor de lokale opslag. Bewaar eerst een kopie van je voortgang.');
  return text;
}

/**
 * Inject storage, or a getter because accessing window.localStorage itself can
 * throw. The adapter is synchronous, so append/import do not race in one tab.
 * Local progress is a learning aid, not authenticated assessment evidence.
 */
export function createLocalProgressStore(storage: ProgressStorage | (() => ProgressStorage)) {
  let lastGood: LearningEvent[] = [];
  const getStorage = () => typeof storage === 'function' ? storage() : storage;
  function read(): LearningEvent[] {
    let text: string | null;
    try {text = getStorage().getItem(LOCAL_PROGRESS_KEY);} catch {return fail('De browser geeft geen toegang tot je lokale voortgang. Je voortgang is nog niet veilig opgeslagen.');}
    return text === null ? [] : parse(text);
  }
  function success(events: LearningEvent[]): LocalProgressResult {
    lastGood = clone(events);
    return {ok: true, events: clone(events)};
  }
  function failure(error: unknown): LocalProgressResult {
    return {ok: false, events: clone(lastGood), error: error instanceof Error ? error.message : 'Je voortgang kon niet worden bewaard.'};
  }
  function write(events: LearningEvent[]): LocalProgressResult {
    const text = serialize(events);
    try {getStorage().setItem(LOCAL_PROGRESS_KEY, text);} catch {return fail('Opslaan op dit apparaat is niet gelukt. De browseropslag is vol of geblokkeerd. Je nieuwste handeling is nog niet bewaard; probeer opnieuw.');}
    // Do not announce persistence when an injected or restricted storage
    // silently discards the write.
    let saved: string | null;
    try {saved = getStorage().getItem(LOCAL_PROGRESS_KEY);} catch {return fail('De browser kon niet bevestigen dat je voortgang is opgeslagen. Probeer opnieuw.');}
    if (saved !== text) fail('De browser heeft je voortgang niet bevestigd. Je nieuwste handeling is nog niet veilig bewaard.');
    return success(events);
  }
  return {
    load(): LocalProgressResult {
      try {return success(read());} catch (error) {return failure(error);}
    },
    append(event: NewLocalEvent, at = Date.now()): LocalProgressResult {
      try {
        const existing = read();
        // A device clock moving backwards must not put a new answer ahead of
        // an earlier attempt, or a block ahead of its prerequisite answers.
        const time = Math.max(at, existing.at(-1)?.at ?? 0);
        const next = normalizeEvent({...event, at: time});
        if (next.type === 'workbench' && !next.payload.correct) fail('De constructie is nog niet compleet. Controleer de vier zijden van de doorsnede voordat je deze afrondt.');
        const merged = orderedUnique([...existing, next]);
        validateBlockEvidence(merged);
        return write(merged);
      } catch (error) {return failure(error);}
    },
    exportProgress(): LocalProgressExport {
      try {
        const events = read();
        return {...success(events), text: serialize(events)};
      } catch (error) {return failure(error);}
    },
    importProgress(text: string): LocalProgressResult {
      try {return write(mergeLocalEvents(read(), parse(text)));} catch (error) {return failure(error);}
    },
  };
}
