import {cross, distance, dot, sub, type DrawLine, type V3} from './geometry-math';

const EPS = 1e-7;
/** Test in world coordinates, never in the screen projection. */
export function onCarrier(p: V3, line: DrawLine): boolean {
  const u = sub(line.b, line.a), length = Math.hypot(...u);
  return length > EPS && Math.hypot(...cross(sub(p, line.a), u)) / length < EPS;
}
export function sameCarrier(a: DrawLine, b: DrawLine): boolean {
  return distance(b.a, b.b) > EPS && onCarrier(b.a, a) && onCarrier(b.b, a);
}
export function containsPoint(line: DrawLine, p: V3): boolean {
  if (!onCarrier(p, line)) return false;
  if (line.infinite) return true;
  const u = sub(line.b, line.a), t = dot(sub(p, line.a), u) / dot(u, u);
  return t >= -EPS && t <= 1 + EPS;
}
/** An extended copy and its original edge are one selectable carrier. */
export function canonicalLine(line: DrawLine, lines: DrawLine[]): DrawLine {
  return lines.find(l => l.infinite && sameCarrier(line, l)) || line;
}
export function distinctLines(lines: DrawLine[]): DrawLine[] {
  return lines.filter(l => distance(l.a, l.b) > EPS)
    .map(l => canonicalLine(l, lines)).filter((l, i, a) => a.findIndex(q => q.id === l.id) === i);
}
export function lineThroughPair(names: string[], points: Record<string, V3>, lines: DrawLine[]): DrawLine | undefined {
  if (names.length !== 2) return;
  const [a, b] = names.map(n => points[n]);
  if (!a || !b || distance(a, b) < EPS) return;
  const matches = lines.filter(l => containsPoint(l, a) && containsPoint(l, b));
  const exact = matches.find(l => (distance(a, l.a) < EPS && distance(b, l.b) < EPS) || (distance(b, l.a) < EPS && distance(a, l.b) < EPS));
  const chosen = exact || matches[0];
  return chosen && canonicalLine(chosen, lines);
}
export function namedEnds(line: DrawLine, points: Record<string, V3>): string[] {
  const names = [line.a, line.b].map(p => Object.keys(points).find(n => distance(points[n], p) < EPS));
  return names.every(Boolean) && names[0] !== names[1] ? names as string[] : [];
}
export function screenSegmentDistance(p: number[], a: number[], b: number[]): number {
  const dx = b[0] - a[0], dy = b[1] - a[1], den = dx * dx + dy * dy;
  if (den < 1e-12) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / den));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
