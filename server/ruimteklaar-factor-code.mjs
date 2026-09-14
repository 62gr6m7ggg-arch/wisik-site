/** Exact prime-factorisation access rule. This is a puzzle gate, not identity authentication.
 * All arithmetic is BigInt. The deterministic Miller-Rabin domain is 2..2^64-1.
 * First twelve prime witnesses: Sorenson/Webster, Strong Pseudoprimes to Twelve
 * Prime Bases, arXiv:1509.00864. No eval, random witnesses or floating-point products.
 */
export const MAX_FACTOR_CODE_LENGTH = 512;
export const MAX_FACTOR_INTEGER = (1n << 64n) - 1n;
const BASES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function powmod(a, e, n) {
  let result = 1n;
  while (e > 0n) {
    if (e & 1n) result = result * a % n;
    a = a * a % n;
    e >>= 1n;
  }
  return result;
}
export function isPrime64(n) {
  if (typeof n !== 'bigint' || n < 2n || n > MAX_FACTOR_INTEGER) return false;
  for (const p of BASES) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }
  let d = n - 1n, s = 0;
  while ((d & 1n) === 0n) { d >>= 1n; s++; }
  for (const a of BASES) {
    let x = powmod(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let passed = false;
    for (let r = 1; r < s; r++) {
      x = x * x % n;
      if (x === n - 1n) { passed = true; break; }
    }
    if (!passed) return false;
  }
  return true;
}
/** Return a canonical credential only for a complete, valid factorisation. */
export function factorCode(input) {
  if (typeof input !== 'string' || input.length > MAX_FACTOR_CODE_LENGTH) return null;
  const tokens = input.trim().split(/\s+/u);
  if (tokens.length < 2 || tokens.length > 64 || !/^[0-9]{1,20}$/.test(tokens[0])) return null;
  const n = BigInt(tokens[0]);
  if (n < 2n || n > MAX_FACTOR_INTEGER) return null;
  let remaining = n;
  const factors = new Map();
  for (const token of tokens.slice(1)) {
    const match = /^([0-9]{1,20})(?:\^([0-9]{1,2})|([⁰¹²³⁴⁵⁶⁷⁸⁹]{1,2}))?$/.exec(token);
    if (!match) return null;
    const p = BigInt(match[1]);
    const e = match[2] ? Number(match[2]) : match[3] ? Number([...match[3]].map(c => SUPER.indexOf(c)).join('')) : 1;
    if (p < 2n || p > remaining || e < 1 || e > 63 || remaining % p !== 0n) return null;
    if (!factors.has(p) && !isPrime64(p)) return null;
    for (let i = 0; i < e; i++) {
      if (remaining % p !== 0n) return null;
      remaining /= p;
    }
    factors.set(p, (factors.get(p) || 0) + e);
  }
  if (remaining !== 1n) return null;
  return [String(n), ...[...factors].sort(([a], [b]) => a < b ? -1 : 1).map(([p, e]) => String(p) + (e > 1 ? '^' + e : ''))].join(' ');
}
