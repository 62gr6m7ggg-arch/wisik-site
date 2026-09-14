'use client';
import {useEffect, useRef, useState, type Dispatch, type SetStateAction} from 'react';
import {Button} from '@/components/ui/button';
import {lineColor} from './construction-visuals';
import {distance, type DrawLine, type V3} from './geometry-math';
import {canonicalLine, distinctLines, lineThroughPair, namedEnds} from './construction-selection-math';

export type ConstructionAction = 'segment' | 'midpoint' | 'extend' | 'parallel' | 'intersect' | 'foot';
type Pending = {action: 'parallel' | 'intersect' | 'foot'; lineId: string};
type Props = {
  points: Record<string, V3>; lines: DrawLine[]; selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>; disabled: boolean;
  advanced?: boolean; atLimit?: boolean;
  execute: (action: ConstructionAction, names: string[], first?: string, second?: string) => void | Promise<void>;
};

/** One selection model for the legacy workbench and every course construction. */
export function useConstructionSelection({points, lines, selected, setSelected, disabled, advanced = false, atLimit = false, execute}: Props) {
  const [picked, setPicked] = useState('');
  const [pending, setPending] = useState<Pending | null>(null);
  const [second, setSecond] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [waiting, setWaiting] = useState(false);
  const inFlight = useRef(false);
  const listRef = useRef<HTMLDetailsElement>(null);
  // A save or a render must not erase a selection. An actual edit/undo/reset must.
  const revision = JSON.stringify([points, lines.map(l => [l.id, l.a, l.b, !!l.infinite])]);
  const previous = useRef(revision);
  function clear() { setPicked(''); setPending(null); setSecond([]); setSelected([]); setNotice(''); }
  useEffect(() => { if (previous.current !== revision) { previous.current = revision; clear(); } }, [revision]);
  const blocked = disabled || waiting;
  const chosen = lines.find(l => l.id === picked);
  const primary = chosen ? canonicalLine(chosen, lines) : lineThroughPair(selected, points, lines);
  const reference = pending ? lines.find(l => l.id === pending.lineId) : primary;
  const pair = selected.length === 2 && selected.every(n => points[n]) && distance(points[selected[0]], points[selected[1]]) > 1e-7;
  const toggle = (names: string[], p: string) => names.includes(p) ? names.filter(n => n !== p) : names.length >= 2 ? [p] : [...names, p];

  async function perform(action: ConstructionAction, names: string[], first = '', other = '') {
    if (disabled || inFlight.current) return;
    inFlight.current = true; setWaiting(true); setNotice('');
    try { await execute(action, names, first, other); }
    catch { setNotice('Deze stap kon niet worden afgerond. Controleer je tekening en probeer opnieuw.'); }
    finally { inFlight.current = false; setWaiting(false); setPending(null); setSecond([]); }
  }
  function choosePoint(p: string) {
    if (blocked || inFlight.current || !points[p]) return;
    setNotice('');
    if (pending && pending.action !== 'intersect') {
      void perform(pending.action, [p], pending.lineId); return;
    }
    if (pending) {
      const next = toggle(second, p); setSecond(next);
      if (next.length === 2) {
        const line = lineThroughPair(next, points, lines);
        if (line) void perform('intersect', [], pending.lineId, line.id);
        else setNotice(`Door ${next.join(' en ')} is nog geen bestaande lijn gekozen. Kies een andere lijn of annuleer en teken eerst een lijnstuk.`);
      }
      return;
    }
    setPicked(''); setSelected(names => toggle(names, p));
  }
  function chooseLine(id: string) {
    if (blocked || inFlight.current) return;
    const original = lines.find(l => l.id === id);
    if (!original) return;
    const line = canonicalLine(original, lines);
    setNotice('');
    if (pending?.action === 'intersect') { void perform('intersect', [], pending.lineId, line.id); return; }
    if (pending) { setNotice('Kies nu een punt, niet een tweede lijn.'); return; }
    setPicked(line.id); setSelected(namedEnds(line, points));
  }
  function begin(action: ConstructionAction) {
    if (blocked || inFlight.current) return;
    setNotice('');
    if (action === 'segment' || action === 'midpoint') {
      if (pair) void perform(action, selected); return;
    }
    if (!primary) return;
    if (action === 'extend') { if (!primary.infinite) void perform(action, [], primary.id); return; }
    setPending({action, lineId: primary.id}); setSecond([]);
  }
  const secondLine = pending?.action === 'intersect' ? lineThroughPair(second, points, lines) : undefined;
  const activeLines = [reference?.id, secondLine?.id].filter(Boolean) as string[];
  const highlightedPoints = [...new Set([...selected, ...second])];
  const instruction = pending?.action === 'parallel' ? `Kies het punt waar de evenwijdige lijn doorheen moet. Referentie: ${reference?.name}.`
    : pending?.action === 'foot' ? `Kies het punt dat je op ${reference?.name} wilt projecteren.`
    : pending ? `Kies de tweede lijn: tik twee punten of een bestaande lijn aan. Eerste lijn: ${reference?.name}.`
    : 'Kies twee punten of tik een bestaande lijn aan. Kies daarna je actie.';
  const caption = reference ? `${reference.infinite ? 'Lijn' : 'Lijnstuk'} ${reference.name}${pending ? ' · blijft geselecteerd' : ''}`
    : selected.length ? `Punten ${selected.join(' en ')}${pair ? ' · nog geen lijnstuk gekozen' : ' · kies nog een punt'}` : 'Nog niets geselecteerd';
  const actionButtons: [ConstructionAction, string, boolean][] = [
    ['segment', 'Lijnstuk tekenen', pair],
    ['extend', primary?.infinite ? 'Al verlengd' : 'Verlengen', !!primary && !primary.infinite],
    ['parallel', 'Evenwijdig door…', !!primary],
    ['intersect', 'Snijpunt met…', !!primary],
    ...(advanced ? [['midpoint', 'Midden bepalen', pair], ['foot', 'Loodvoet van…', !!primary]] as [ConstructionAction, string, boolean][] : []),
  ];
  const controls = <div className="selection-controls" data-selection-first="true" aria-label="Constructiebediening">
    <p className="selection-instruction" aria-live="polite">{instruction}</p>
    <div className="point-tray" aria-label="Punten op naam selecteren">{Object.keys(points).map(n => <Button type="button" variant="outline" key={n} disabled={blocked} aria-pressed={highlightedPoints.includes(n)} className={'point-tag ' + (highlightedPoints.includes(n) ? 'active' : '')} onClick={() => choosePoint(n)}>{n}</Button>)}</div>
    <p className="selection-caption" role="status">{caption}{second.length > 0 && <span> · Tweede keuze: {second.join(' en ')}</span>}</p>
    {!pending && <div className="selection-actions">{actionButtons.map(([action, label, available]) => <Button type="button" variant="outline" key={action} data-action={action} disabled={blocked || !available || (atLimit && ['segment','parallel','extend'].includes(action))} onClick={() => begin(action)}>{label}</Button>)}</div>}
    {pending ? <Button type="button" variant="ghost" disabled={blocked} onClick={() => { setPending(null); setSecond([]); setNotice(''); }}>Actie annuleren</Button>
      : <Button type="button" variant="ghost" disabled={blocked || (!selected.length && !picked)} onClick={clear}>Selectie wissen</Button>}
    {notice && <p className="selection-notice" role="status">{notice}</p>}
    {atLimit && <p className="selection-notice">Het maximum aantal lijnen is bereikt. Neem eerst een stap terug.</p>}
    <details ref={listRef} className="selection-line-list"><summary>Lijn op naam kiezen</summary><p>Ook voor een hulplijn zonder twee benoemde punten.</p><div className="line-key">{distinctLines(lines).map(l => <button type="button" key={l.id} disabled={blocked || (!!pending && pending.action !== 'intersect')} aria-pressed={activeLines.includes(l.id)} onClick={() => { chooseLine(l.id); if (listRef.current) listRef.current.open = false; }}><span className="line-swatch" aria-hidden="true" style={{backgroundColor: lineColor(l, lines.filter(q => !q.id.startsWith('edge-')))}}/>{l.name}{l.infinite ? ' · verlengd' : ''}</button>)}</div></details>
  </div>;
  return {controls, choosePoint, chooseLine, activeLines, highlightedPoints, clear, blocked};
}
