/* QUANT TEST LAB — utilities
   Deterministic seeded RNG + exact rational arithmetic so generated
   questions always have a clean, verified answer. */
(function (global) {
  'use strict';

  // ---- seeded RNG (mulberry32) ----
  function makeRng(seed) {
    let a = seed >>> 0;
    const f = function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.int = (lo, hi) => lo + Math.floor(f() * (hi - lo + 1));       // inclusive
    f.pick = (arr) => arr[f.int(0, arr.length - 1)];
    f.sample = (arr, k) => shuffle(arr.slice(), f).slice(0, k);
    f.shuffle = (arr) => shuffle(arr.slice(), f);
    return f;
  }
  function shuffle(a, rng) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = rng.int(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---- integer helpers ----
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  function nCr(n, r) {
    if (r < 0 || r > n) return 0;
    r = Math.min(r, n - r);
    let out = 1;
    for (let i = 1; i <= r; i++) out = (out * (n - r + i)) / i;
    return Math.round(out);
  }
  function nPr(n, r) { let o = 1; for (let i = 0; i < r; i++) o *= (n - i); return o; }
  function fact(n) { let o = 1; for (let i = 2; i <= n; i++) o *= i; return o; }

  // ---- exact fractions ----
  function frac(n, d) {
    if (d === undefined) d = 1;
    if (d === 0) throw new Error('zero denominator');
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    return { n: n / g, d: d / g };
  }
  const F = {
    make: frac,
    add: (a, b) => frac(a.n * b.d + b.n * a.d, a.d * b.d),
    sub: (a, b) => frac(a.n * b.d - b.n * a.d, a.d * b.d),
    mul: (a, b) => frac(a.n * b.n, a.d * b.d),
    div: (a, b) => frac(a.n * b.d, a.d * b.n),
    val: (a) => a.n / a.d,
    str: (a) => (a.d === 1 ? String(a.n) : a.n + '/' + a.d)
  };

  // ---- formatting ----
  function money(x, cur) {
    cur = cur || '$';
    const neg = x < 0; x = Math.abs(x);
    let s = x >= 1000 ? x.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : (Math.round(x * 100) / 100).toString();
    return (neg ? '-' : '') + cur + s;
  }
  const pct = (x, dp) => (Math.round(x * Math.pow(10, dp === undefined ? 1 : dp)) / Math.pow(10, dp === undefined ? 1 : dp)) + '%';
  const round = (x, dp) => Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp);

  // Build a set of plausible multiple-choice options around a correct value.
  function optionsAround(correct, rng, opts) {
    opts = opts || {};
    const fmt = opts.fmt || ((v) => String(v));
    const distractors = (opts.distractors || []).filter(
      (v) => Math.abs(v - correct) > 1e-9 && isFinite(v)
    );
    const set = [correct];
    const push = (v) => {
      if (!isFinite(v)) return;
      if (set.some((s) => Math.abs(s - v) < 1e-9)) return;
      set.push(v);
    };
    distractors.forEach(push);
    let guard = 0;
    while (set.length < 4 && guard++ < 80) {
      const f = rng.pick([0.5, 0.75, 0.8, 1.2, 1.25, 1.5, 2]);
      let v = correct * f;
      if (opts.integer) v = Math.round(v);
      if (opts.dp !== undefined) v = round(v, opts.dp);
      push(v);
    }
    return rng.shuffle(set.slice(0, 4)).map(fmt);
  }

  global.QTL_UTIL = { makeRng, gcd, nCr, nPr, fact, F, money, pct, round, optionsAround };
})(window);
