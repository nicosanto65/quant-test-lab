/* QUANT TEST LAB — persistent state, analytics and the question engine. */
(function (global) {
  'use strict';
  const U = global.QTL_UTIL;
  const KEY = 'qtl_state_v1';

  const ERROR_TYPES = ['Concept gap', 'Formula recall', 'Wrong sample space', 'Conditional probability error',
    'Counting error', 'Arithmetic error', 'Misread question', 'Wrong assumption',
    'Correct approach but execution error', 'Too slow', 'Overcomplicated solution', 'Guess', 'Other'];

  const TECHNIQUES = ['Symmetry', 'Conditional probability', 'Bayes', 'Counting', 'Complement',
    'Linearity of expectation', 'Indicator variables', 'Tail sum', 'Order statistics', 'Conditioning',
    'Recursion', 'Optimal stopping', 'Information / impossibility', 'Game theory', 'Direct calculation', 'Other'];

  const DEFAULTS = {
    v: 1,
    attempts: [],
    mocks: [],
    recognition: [],
    srs: {},
    settings: {
      theme: 'dark',
      calculator: true,
      weights: {
        wincent: { hardAccuracy: 40, recognition: 25, speed: 20, mock: 15 },
        sig: { speedAccuracy: 40, throughput: 30, finance: 15, mock: 15 },
        imc: { numerical: 30, logic: 25, probability: 25, mock: 20 }
      },
      imc: {
        label: 'IMC — provisional configuration',
        totalMinutes: 20,
        sections: [
          { name: 'Numerical reasoning', topics: ['Mental Maths', 'Data Interpretation'], count: 8, seconds: 45 },
          { name: 'Sequences and logic', topics: ['Logic'], count: 6, seconds: 60 },
          { name: 'Probability and EV', topics: ['Probability', 'Expected Value'], count: 6, seconds: 90 },
          { name: 'Market making', topics: ['Market Making'], count: 4, seconds: 90 }
        ]
      },
      sigCount: 20,
      sigMinutes: 23,
      track: 'quant'
    }
  };

  const TRACKS = [
    { id: 'quant', label: 'Quant trading' },
    { id: 'reasoning', label: 'Reasoning speed' },
    { id: 'ib', label: 'Investment Banking' },
    { id: 'am', label: 'Asset Management' },
    { id: 'wm', label: 'Wealth Management' },
    { id: 'consulting', label: 'Consulting' }
  ];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      const s = JSON.parse(raw);
      return merge(JSON.parse(JSON.stringify(DEFAULTS)), s);
    } catch (e) {
      console.warn('State unreadable, starting fresh.', e);
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  }
  function merge(base, over) {
    Object.keys(over || {}).forEach((k) => {
      if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) && base[k]) merge(base[k], over[k]);
      else base[k] = over[k];
    });
    return base;
  }

  let state = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('Save failed', e); } };

  /* ----------------------------- question engine ---------------------------- */

  /* Every track's generators/curated items live in their own global array so files can be
     loaded independently; new tracks just register their array name here. Content with no
     explicit `track` field (the original quant material) is treated as track:'quant'. */
  const GEN_SOURCES = ['QTL_GEN_PROB', 'QTL_GEN_APPLIED', 'QTL_GEN_REASONING', 'QTL_GEN_IB', 'QTL_GEN_AM'];
  const LESSON_SOURCES = ['QTL_LESSONS', 'QTL_LESSONS_REASONING', 'QTL_LESSONS_IB', 'QTL_LESSONS_WM', 'QTL_LESSONS_AM', 'QTL_LESSONS_CONSULTING'];

  function activeTrack() { return state.settings.track || 'quant'; }
  function tracks() { return TRACKS; }
  function setTrack(t) {
    if (!TRACKS.some((x) => x.id === t)) return;
    state.settings.track = t; save();
  }

  /* track: omit for the active track, pass 'all' to bypass filtering entirely
     (used when looking a specific question up by id regardless of which track is selected). */
  function allGenerators(track) {
    let list = [];
    GEN_SOURCES.forEach((k) => { if (global[k]) list = list.concat(global[k]); });
    if (track === 'all') return list;
    const t = track || activeTrack();
    return list.filter((g) => (g.track || 'quant') === t);
  }
  function curated(track) {
    const list = (global.QTL_BANK && global.QTL_BANK.questions) || [];
    if (track === 'all') return list;
    const t = track || activeTrack();
    return list.filter((q) => (q.track || 'quant') === t);
  }
  function allLessonUnits(track) {
    let list = [];
    LESSON_SOURCES.forEach((k) => { if (global[k]) list = list.concat(global[k]); });
    if (track === 'all') return list;
    const t = track || activeTrack();
    return list.filter((u) => (u.track || 'quant') === t);
  }

  function topics() {
    const set = new Set();
    allGenerators().forEach((g) => set.add(g.topic));
    curated().forEach((q) => set.add(q.topic));
    return Array.from(set).sort();
  }
  function subtopics(topic) {
    const set = new Set();
    allGenerators().forEach((g) => { if (!topic || g.topic === topic) set.add(g.subtopic); });
    curated().forEach((q) => { if (!topic || q.topic === topic) set.add(q.subtopic); });
    return Array.from(set).sort();
  }

  let seedCounter = Date.now() % 100000;
  function instantiate(gen, seed) {
    const s = seed === undefined ? (seedCounter = (seedCounter * 1103515245 + 12345) >>> 0) : seed;
    const rng = U.makeRng(s);
    const q = gen.build(rng);
    return Object.assign({
      id: gen.id + '#' + s, baseId: gen.id, seed: s, source: 'generated',
      topic: gen.topic, subtopic: gen.subtopic, difficulty: gen.difficulty,
      targetTime: gen.targetTime, tolerance: 0.01, answerType: 'numeric'
    }, q, { id: gen.id + '#' + s, baseId: gen.id, seed: s, source: 'generated' });
  }

  function similar(question) {
    const gen = allGenerators('all').find((g) => g.id === question.baseId);
    if (!gen) return null;
    return instantiate(gen);
  }

  /* Build a session. spec: {topics[], subtopic, difficulties[], count, includeCurated, mode} */
  function buildSession(spec) {
    spec = spec || {};
    const count = spec.count || 10;
    const wantTopics = spec.topics && spec.topics.length ? spec.topics : null;
    const diffs = spec.difficulties && spec.difficulties.length ? spec.difficulties : [1, 2, 3, 4, 5];

    const gens = allGenerators().filter((g) =>
      (!wantTopics || wantTopics.includes(g.topic)) &&
      (!spec.subtopic || g.subtopic === spec.subtopic) &&
      diffs.includes(g.difficulty));

    let cur = spec.includeCurated === false ? [] : curated().filter((q) =>
      (!wantTopics || wantTopics.includes(q.topic)) &&
      (!spec.subtopic || q.subtopic === spec.subtopic) &&
      diffs.includes(q.difficulty));

    // spaced repetition: questions previously failed come back sooner
    const now = Date.now();
    const due = cur.filter((q) => state.srs[q.id] && state.srs[q.id].due <= now);
    const rng = U.makeRng((Math.random() * 1e9) | 0);
    cur = rng.shuffle(cur);
    const pool = [];
    rng.shuffle(due).slice(0, Math.ceil(count * 0.3)).forEach((q) => pool.push(q));

    const curShare = spec.curatedShare === undefined ? 0.35 : spec.curatedShare;
    let curTarget = Math.round(count * curShare);
    for (const q of cur) {
      if (pool.length >= curTarget) break;
      if (!pool.includes(q)) pool.push(q);
    }
    let guard = 0;
    while (pool.length < count && gens.length && guard++ < 500) {
      pool.push(instantiate(rng.pick(gens)));
    }
    // if no generators matched, top up with any curated
    guard = 0;
    while (pool.length < count && cur.length && guard++ < 500) pool.push(cur[pool.length % cur.length]);
    return rng.shuffle(pool).slice(0, count);
  }

  /* ------------------------------- recording -------------------------------- */

  function recordAttempt(a) {
    a.ts = Date.now();
    a.aid = 'a' + a.ts + '_' + Math.floor(Math.random() * 1e6);
    state.attempts.push(a);
    // spaced repetition bookkeeping for stable (curated) ids
    if (a.qid && a.qid.indexOf('#') === -1) {
      const s = state.srs[a.qid] || { streak: 0, misses: 0, due: 0 };
      if (a.correct) { s.streak++; s.misses = Math.max(0, s.misses - 1); }
      else { s.streak = 0; s.misses++; }
      const days = a.correct ? Math.min(30, Math.pow(2, s.streak)) : 0.25;
      s.due = Date.now() + days * 86400000;
      state.srs[a.qid] = s;
    }
    save();
    return a.aid;
  }
  function recordRecognition(r) { r.ts = Date.now(); state.recognition.push(r); save(); }
  function recordMock(m) { m.ts = Date.now(); state.mocks.push(m); save(); }
  function setErrorType(aid, type) {
    const a = state.attempts.find((x) => x.aid === aid);
    if (a) { a.errorType = type; save(); }
  }

  function classifyError(ctx) {
    // ctx: {correct, timeSec, targetTime, hintUsed, confidence, given, expected, answerType, topic}
    if (ctx.correct) return null;
    if (ctx.confidence === 'Guess') return 'Guess';
    if (ctx.given === '' || ctx.given === null || ctx.given === undefined) return 'Too slow';
    if (ctx.timeSec > (ctx.targetTime || 90) * 2) return 'Too slow';
    if (ctx.answerType === 'numeric' && isFinite(ctx.given) && isFinite(ctx.expected) && ctx.expected !== 0) {
      const ratio = Math.abs(ctx.given / ctx.expected);
      if (ratio > 0.9 && ratio < 1.1) return 'Arithmetic error';
      if (Math.abs(ratio - 1) < 0.35) return 'Correct approach but execution error';
      if (/Probability|Expected|Order/.test(ctx.topic || '') && (ratio > 1.6 || ratio < 0.6)) return 'Wrong sample space';
    }
    if (ctx.hintUsed) return 'Concept gap';
    return 'Concept gap';
  }

  /* ------------------------------- analytics -------------------------------- */

  const pct = (a, b) => (b ? Math.round(1000 * a / b) / 10 : 0);

  function summary() {
    const at = state.attempts;
    const n = at.length;
    const correct = at.filter((a) => a.correct).length;
    const avgTime = n ? at.reduce((s, a) => s + (a.timeSec || 0), 0) / n : 0;
    // streak = consecutive correct at the tail
    let streak = 0;
    for (let i = at.length - 1; i >= 0; i--) { if (at[i].correct) streak++; else break; }
    let best = 0, run = 0;
    at.forEach((a) => { if (a.correct) { run++; best = Math.max(best, run); } else run = 0; });
    return { total: n, correct, accuracy: pct(correct, n), avgTime: Math.round(avgTime * 10) / 10, streak, bestStreak: best };
  }

  function byKey(key) {
    const map = {};
    state.attempts.forEach((a) => {
      const k = a[key] === undefined ? 'Unknown' : a[key];
      map[k] = map[k] || { n: 0, c: 0, t: 0 };
      map[k].n++; if (a.correct) map[k].c++; map[k].t += a.timeSec || 0;
    });
    return Object.keys(map).map((k) => ({
      key: k, n: map[k].n, correct: map[k].c,
      accuracy: pct(map[k].c, map[k].n), avgTime: Math.round(10 * map[k].t / map[k].n) / 10
    }));
  }

  function weakestTopics(k, minN) {
    minN = minN === undefined ? 3 : minN;
    return byKey('topic').filter((r) => r.n >= minN).sort((a, b) => a.accuracy - b.accuracy).slice(0, k || 3);
  }
  function strongestTopics(k, minN) {
    minN = minN === undefined ? 3 : minN;
    return byKey('topic').filter((r) => r.n >= minN).sort((a, b) => b.accuracy - a.accuracy).slice(0, k || 3);
  }

  function perDay() {
    const map = {};
    state.attempts.forEach((a) => {
      const d = new Date(a.ts).toISOString().slice(0, 10);
      map[d] = map[d] || { n: 0, c: 0, t: 0 };
      map[d].n++; if (a.correct) map[d].c++; map[d].t += a.timeSec || 0;
    });
    return Object.keys(map).sort().map((d) => ({
      date: d, n: map[d].n, accuracy: pct(map[d].c, map[d].n),
      avgTime: Math.round(10 * map[d].t / map[d].n) / 10
    }));
  }

  function recognitionAccuracy() {
    const r = state.recognition;
    return { n: r.length, accuracy: pct(r.filter((x) => x.correct).length, r.length) };
  }

  function errorBreakdown() {
    const map = {};
    state.attempts.filter((a) => !a.correct).forEach((a) => {
      const k = a.errorType || 'Other';
      map[k] = (map[k] || 0) + 1;
    });
    return Object.keys(map).map((k) => ({ key: k, n: map[k] })).sort((a, b) => b.n - a.n);
  }

  function confidenceMatrix() {
    const rows = ['Guess', 'Low', 'Medium', 'High'];
    const out = {};
    rows.forEach((r) => { out[r] = { n: 0, c: 0 }; });
    state.attempts.forEach((a) => {
      const c = a.confidence || 'Medium';
      if (!out[c]) out[c] = { n: 0, c: 0 };
      out[c].n++; if (a.correct) out[c].c++;
    });
    const confidentErrors = state.attempts.filter((a) => !a.correct && a.confidence === 'High').length;
    const luckyCorrect = state.attempts.filter((a) => a.correct && (a.confidence === 'Guess' || a.confidence === 'Low')).length;
    return { rows: Object.keys(out).map((k) => ({ key: k, n: out[k].n, accuracy: pct(out[k].c, out[k].n) })), confidentErrors, luckyCorrect };
  }

  function recentMocks(type, k) {
    return state.mocks.filter((m) => !type || m.type === type).slice(-(k || 5)).reverse();
  }

  /* Readiness scores: internal progress metrics only. */
  function readiness() {
    const w = state.settings.weights;
    const at = state.attempts;
    const hard = at.filter((a) => a.difficulty >= 4);
    const hardAcc = pct(hard.filter((a) => a.correct).length, hard.length);
    const rec = recognitionAccuracy().accuracy;

    // speed score: fraction of attempts completed inside their target time
    const timed = at.filter((a) => a.targetTime);
    const speed = pct(timed.filter((a) => a.timeSec <= a.targetTime).length, timed.length);

    const mockScore = (type) => {
      const m = recentMocks(type, 3);
      if (!m.length) return 0;
      return Math.round(m.reduce((s, x) => s + 100 * x.score / Math.max(1, x.total), 0) / m.length);
    };

    const sigAttempts = at.filter((a) => a.testType === 'SIG' || a.targetTime <= 60);
    const sigAcc = pct(sigAttempts.filter((a) => a.correct).length, sigAttempts.length);
    const finAttempts = at.filter((a) => a.topic === 'Finance');
    const finAcc = pct(finAttempts.filter((a) => a.correct).length, finAttempts.length);
    const throughput = (() => {
      const t = sigAttempts.filter((a) => a.timeSec > 0);
      if (!t.length) return 0;
      const avg = t.reduce((s, a) => s + a.timeSec, 0) / t.length;
      return Math.max(0, Math.min(100, Math.round(100 * (60 / Math.max(10, avg)))));
    })();

    const num = at.filter((a) => ['Mental Maths', 'Data Interpretation'].includes(a.topic));
    const logic = at.filter((a) => a.topic === 'Logic');
    const prob = at.filter((a) => ['Probability', 'Expected Value', 'Distributions'].includes(a.topic));
    const accOf = (arr) => pct(arr.filter((a) => a.correct).length, arr.length);

    const mix = (parts) => Math.round(parts.reduce((s, p) => s + p[0] * p[1], 0) / parts.reduce((s, p) => s + p[0], 0));

    return {
      wincent: mix([[w.wincent.hardAccuracy, hardAcc], [w.wincent.recognition, rec],
      [w.wincent.speed, speed], [w.wincent.mock, mockScore('Wincent')]]),
      sig: mix([[w.sig.speedAccuracy, sigAcc], [w.sig.throughput, throughput],
      [w.sig.finance, finAcc], [w.sig.mock, mockScore('SIG')]]),
      imc: mix([[w.imc.numerical, accOf(num)], [w.imc.logic, accOf(logic)],
      [w.imc.probability, accOf(prob)], [w.imc.mock, mockScore('IMC')]]),
      parts: { hardAcc, rec, speed, sigAcc, throughput, finAcc }
    };
  }

  /* Internal percentile: where a mock score sits within this user's own history. */
  function internalRating(type, ratio) {
    const past = state.mocks.filter((m) => m.type === type);
    if (past.length < 2) return null;
    const ratios = past.map((m) => m.score / Math.max(1, m.total));
    const below = ratios.filter((r) => r < ratio).length;
    return Math.round(100 * below / ratios.length);
  }

  /* ------------------------- adaptive session building ----------------------- */

  function weaknessSession(count) {
    count = count || 12;
    const rows = byKey('topic');
    const seen = new Set(rows.map((r) => r.key));
    const all = topics();
    const notPractised = all.filter((t) => !seen.has(t));
    const weak = rows.filter((r) => r.n >= 2).sort((a, b) => a.accuracy - b.accuracy).slice(0, 3).map((r) => r.key);
    const slow = rows.filter((r) => r.n >= 2).sort((a, b) => b.avgTime - a.avgTime).slice(0, 2).map((r) => r.key);
    const recentWrong = state.attempts.filter((a) => !a.correct).slice(-15).map((a) => a.topic);
    const target = Array.from(new Set(weak.concat(slow, notPractised.slice(0, 2), recentWrong)));
    const list = target.length ? target : all;
    const lvl = adaptiveLevel();
    return buildSession({ topics: list, count, difficulties: [Math.max(1, lvl - 1), lvl, Math.min(5, lvl + 1)] });
  }

  function adaptiveLevel() {
    const last = state.attempts.slice(-8);
    if (!last.length) return 2;
    const acc = last.filter((a) => a.correct).length / last.length;
    const avgD = last.reduce((s, a) => s + (a.difficulty || 2), 0) / last.length;
    if (acc >= 0.8) return Math.min(5, Math.round(avgD + 1));
    if (acc <= 0.4) return Math.max(1, Math.round(avgD - 1));
    return Math.max(1, Math.min(5, Math.round(avgD)));
  }

  function recommendation() {
    const s = summary();
    if (s.total < 5) return { text: 'Start with Learn → Probability fundamentals, then a 10-question Drill at difficulty 2.', action: 'learn' };
    const weak = weakestTopics(1)[0];
    const rec = recognitionAccuracy();
    if (rec.n < 10) return { text: 'Run a Pattern Recognition set — classification speed is the cheapest score you can buy for Wincent.', action: 'pattern' };
    if (rec.accuracy < 65) return { text: 'Recognition accuracy is ' + rec.accuracy + '%. Do 15 Pattern Recognition items before more calculation drills.', action: 'pattern' };
    if (weak && weak.accuracy < 60) return { text: weak.key + ' is at ' + weak.accuracy + '%. Read the lesson, then drill 10 questions in it.', action: 'drill', topic: weak.key };
    const mocks = recentMocks(null, 1);
    if (!mocks.length) return { text: 'Take a full Wincent mock to establish a baseline.', action: 'mock' };
    return { text: 'Run "Train my weaknesses" for a 12-question adaptive set at level ' + adaptiveLevel() + '.', action: 'adaptive' };
  }

  /* ------------------------------ import / export --------------------------- */

  function exportJSON() { return JSON.stringify(state, null, 2); }
  function importJSON(text) {
    const obj = JSON.parse(text);
    if (!obj || typeof obj !== 'object' || !Array.isArray(obj.attempts)) throw new Error('Not a Quant Test Lab progress file.');
    state = merge(JSON.parse(JSON.stringify(DEFAULTS)), obj);
    save();
  }
  function exportCSV() {
    const head = ['date', 'test_type', 'topic', 'subtopic', 'difficulty', 'correct', 'time_seconds', 'hint_used', 'confidence', 'error_type'];
    const esc = (v) => '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""') + '"';
    const rows = state.attempts.map((a) => [
      new Date(a.ts).toISOString(), a.testType || a.mode || '', a.topic || '', a.subtopic || '',
      a.difficulty || '', a.correct ? 1 : 0, a.timeSec || 0, a.hintUsed ? 1 : 0,
      a.confidence || '', a.errorType || ''].map(esc).join(','));
    return [head.join(','), ...rows].join('\n');
  }
  function reset() { state = JSON.parse(JSON.stringify(DEFAULTS)); save(); }

  global.QTL_STORE = {
    get state() { return state; },
    save, reset, ERROR_TYPES, TECHNIQUES,
    tracks, activeTrack, setTrack, allLessonUnits,
    topics, subtopics, buildSession, instantiate, similar, allGenerators, curated,
    recordAttempt, recordRecognition, recordMock, setErrorType, classifyError,
    summary, byKey, weakestTopics, strongestTopics, perDay, recognitionAccuracy,
    errorBreakdown, confidenceMatrix, recentMocks, readiness, internalRating,
    weaknessSession, adaptiveLevel, recommendation,
    exportJSON, importJSON, exportCSV
  };
})(window);
