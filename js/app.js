/* QUANT TEST LAB — application shell, session runner and views. */
(function (global) {
  'use strict';
  const S = global.QTL_STORE, U = global.QTL_UTIL;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const fmtTime = (sec) => {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + String(s).padStart(2, '0');
  };

  const VIEWS = [
    { id: 'dashboard', label: 'Dash', title: 'Dashboard' },
    { id: 'learn', label: 'Learn', title: 'Learn' },
    { id: 'drill', label: 'Drill', title: 'Drill' },
    { id: 'pattern', label: 'Pattern', title: 'Pattern recognition' },
    { id: 'mixed', label: 'Mixed', title: 'Mixed practice' },
    { id: 'mocks', label: 'Mocks', title: 'Mock tests' },
    { id: 'mistakes', label: 'Errors', title: 'Mistakes and error log' },
    { id: 'sheet', label: 'Sheet', title: 'Formula / technique sheet' },
    { id: 'stats', label: 'Stats', title: 'Statistics' },
    { id: 'settings', label: 'Set', title: 'Settings' }
  ];

  let current = 'dashboard';
  let session = null;       // active runner
  let tickHandle = null;

  /* ------------------------------- utilities ------------------------------- */

  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = el('div', 'toast'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function bars(rows, opts) {
    opts = opts || {};
    if (!rows.length) return '<div class="empty">No data yet.</div>';
    const max = opts.max || 100;
    return rows.map((r) => {
      const v = opts.field ? r[opts.field] : r.accuracy;
      const w = Math.max(2, Math.min(100, 100 * v / max));
      const cls = opts.plain ? '' : (v >= 75 ? 'good' : v < 50 ? 'bad' : '');
      const val = opts.fmt ? opts.fmt(r) : v + '% · n=' + r.n;
      return `<div class="bar-row"><span class="name" title="${esc(r.key)}">${esc(r.key)}</span>
        <span class="bar"><i class="${cls}" style="width:${w}%"></i></span>
        <span class="val">${esc(val)}</span></div>`;
    }).join('');
  }

  /* Minimal inline SVG line chart. points: [{x,y}] with y in 0..max */
  function lineChart(series, opts) {
    opts = opts || {};
    const w = 320, h = 120, pad = 22;
    if (!series.length) return '<div class="empty">Not enough history yet.</div>';
    const max = opts.max || Math.max(1, Math.max.apply(null, series.map((p) => p.y)) * 1.15);
    const n = series.length;
    const px = (i) => pad + (n === 1 ? (w - 2 * pad) / 2 : i * (w - 2 * pad) / (n - 1));
    const py = (y) => h - pad - (y / max) * (h - 2 * pad);
    const d = series.map((p, i) => (i ? 'L' : 'M') + px(i).toFixed(1) + ' ' + py(p.y).toFixed(1)).join(' ');
    const dots = series.map((p, i) => `<circle cx="${px(i).toFixed(1)}" cy="${py(p.y).toFixed(1)}" r="2.4" fill="var(--accent)"/>`).join('');
    const grid = [0, 0.5, 1].map((f) => {
      const y = h - pad - f * (h - 2 * pad);
      return `<line x1="${pad}" y1="${y}" x2="${w - pad}" y2="${y}" stroke="var(--line-soft)" stroke-width="1"/>
              <text x="2" y="${y + 3}" fill="var(--dim)" font-size="8" font-family="monospace">${Math.round(f * max)}</text>`;
    }).join('');
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${esc(opts.label || 'chart')}">
      ${grid}<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="1.6"/>${dots}</svg>
      <div class="chart-legend">${esc(opts.label || '')} · ${n} point${n === 1 ? '' : 's'}</div>`;
  }

  function barChart(rows, opts) {
    opts = opts || {};
    if (!rows.length) return '<div class="empty">No data yet.</div>';
    const w = 320, h = 120, pad = 20;
    const max = Math.max.apply(null, rows.map((r) => r.n)) || 1;
    const bw = (w - 2 * pad) / rows.length;
    const bars = rows.map((r, i) => {
      const bh = (r.n / max) * (h - 2 * pad - 12);
      return `<rect x="${(pad + i * bw + 2).toFixed(1)}" y="${(h - pad - bh).toFixed(1)}" width="${Math.max(2, bw - 4).toFixed(1)}" height="${bh.toFixed(1)}" fill="var(--info)"/>`;
    }).join('');
    const labels = rows.length <= 8 ? rows.map((r, i) =>
      `<text x="${(pad + i * bw + bw / 2).toFixed(1)}" y="${h - 6}" fill="var(--dim)" font-size="7" font-family="monospace" text-anchor="middle">${esc(String(r.key).slice(0, 9))}</text>`).join('') : '';
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}${labels}</svg>
      <div class="chart-legend">${esc(opts.label || '')}</div>`;
  }

  /* ------------------------------ answer grading --------------------------- */

  function parseNumeric(text) {
    if (text === null || text === undefined) return NaN;
    let t = String(text).trim().replace(/,/g, '.').replace(/[%€$\s]/g, '');
    if (!t) return NaN;
    const frac = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (frac) return parseFloat(frac[1]) / parseFloat(frac[2]);
    const v = parseFloat(t);
    return isNaN(v) ? NaN : v;
  }

  function grade(q, given) {
    if (q.answerType === 'mc') return { correct: given === q.correctAnswer, given: given };
    const v = parseNumeric(given);
    if (isNaN(v)) return { correct: false, given: given };
    const tol = q.tolerance === undefined ? 0.01 : q.tolerance;
    let ok = Math.abs(v - q.correctAnswer) <= tol + 1e-9;
    if (!ok && q.acceptFraction) {
      const f = q.acceptFraction[0] / q.acceptFraction[1];
      ok = Math.abs(v - f) <= Math.max(tol, 0.005);
    }
    // also accept the percentage form of a probability answer
    if (!ok && q.correctAnswer > 0 && q.correctAnswer < 1) ok = Math.abs(v / 100 - q.correctAnswer) <= Math.max(tol, 0.005);
    return { correct: ok, given: v };
  }

  /* ================================ RUNNER ================================= */
  /* cfg: {items, mode, testType, allowHelp, perQuestion, totalSeconds,
           noSkip, deferFeedback, onFinish, title, calculator} */
  function startSession(cfg) {
    session = {
      cfg, items: cfg.items, idx: 0,
      records: cfg.items.map(() => null),
      flags: cfg.items.map(() => false),
      startedAt: Date.now(), qStart: Date.now(),
      hintUsed: false, approachShown: false, solutionShown: false,
      confidence: 'Medium', answered: false, lastResult: null,
      deadline: cfg.totalSeconds ? Date.now() + cfg.totalSeconds * 1000 : null
    };
    go('runner');
  }

  function endSession(aborted) {
    const cfg = session.cfg;
    const recs = session.records;
    const elapsed = (Date.now() - session.startedAt) / 1000;
    session = null;
    stopTick();
    if (cfg.onFinish) cfg.onFinish(recs, elapsed, aborted);
    else go(cfg.returnTo || 'dashboard');
  }

  function stopTick() { if (tickHandle) { clearInterval(tickHandle); tickHandle = null; } }

  function startTick() {
    stopTick();
    tickHandle = setInterval(() => {
      if (!session) return stopTick();
      const t = $('#sess-timer');
      if (t) {
        if (session.deadline) {
          const left = (session.deadline - Date.now()) / 1000;
          t.textContent = 'Remaining ' + fmtTime(left);
          t.className = 'timer' + (left < 60 ? ' danger' : left < 180 ? ' warn' : '');
          if (left <= 0) { toast('Time is up.'); autoSubmitRemaining(); return; }
        } else {
          t.textContent = 'Elapsed ' + fmtTime((Date.now() - session.qStart) / 1000);
          t.className = 'timer';
        }
      }
      const pq = $('#pq-timer');
      if (pq && session.cfg.perQuestion) {
        const left = session.cfg.perQuestion - (Date.now() - session.qStart) / 1000;
        pq.textContent = fmtTime(left);
        pq.className = 'timer' + (left < 5 ? ' danger' : '');
        if (left <= 0) submitAnswer(null, true);
      }
    }, 250);
  }

  function autoSubmitRemaining() {
    if (!session) return;
    session.records.forEach((r, i) => {
      if (r) return;
      const q = session.items[i];
      session.records[i] = {
        q, given: null, correct: false, timeSec: 0, hintUsed: false,
        confidence: 'Guess', errorType: 'Too slow', timedOut: true
      };
    });
    finishAndRecord();
  }

  function finishAndRecord() {
    if (!session) return;
    const cfg = session.cfg;
    session.records.forEach((r) => {
      if (!r || r.recorded) return;
      r.recorded = true;
      S.recordAttempt({
        qid: r.q.id, baseId: r.q.baseId || r.q.id, mode: cfg.mode, testType: cfg.testType || cfg.mode,
        topic: r.q.topic, subtopic: r.q.subtopic, difficulty: r.q.difficulty,
        correct: !!r.correct, timeSec: Math.round(r.timeSec), targetTime: r.q.targetTime,
        hintUsed: !!r.hintUsed, confidence: r.confidence || 'Medium',
        errorType: r.errorType || null, given: r.given, expected: r.q.correctAnswer
      });
    });
    endSession(false);
  }

  function submitAnswer(given, timedOut) {
    if (!session || session.answered) return;
    const q = session.items[session.idx];
    const timeSec = (Date.now() - session.qStart) / 1000;
    const g = timedOut ? { correct: false, given: null } : grade(q, given);
    const errorType = S.classifyError({
      correct: g.correct, timeSec, targetTime: q.targetTime, hintUsed: session.hintUsed,
      confidence: session.confidence, given: g.given, expected: q.correctAnswer,
      answerType: q.answerType, topic: q.topic
    });
    const rec = {
      q, given: g.given, correct: g.correct, timeSec, hintUsed: session.hintUsed,
      confidence: session.confidence, errorType, timedOut: !!timedOut
    };
    session.records[session.idx] = rec;
    session.lastResult = rec;
    session.answered = true;
    if (session.cfg.deferFeedback) nextQuestion();
    else render();
  }

  function nextQuestion() {
    if (!session) return;
    if (session.idx >= session.items.length - 1) return finishAndRecord();
    session.idx++;
    session.qStart = Date.now();
    session.hintUsed = session.approachShown = session.solutionShown = false;
    session.answered = !!session.records[session.idx];
    session.confidence = 'Medium';
    render();
  }

  function gotoQuestion(i) {
    if (!session || session.cfg.noSkip) return;
    session.idx = i; session.qStart = Date.now();
    session.hintUsed = session.approachShown = session.solutionShown = false;
    session.answered = !!session.records[session.idx];
    render();
  }

  /* ------------------------------ runner view ------------------------------ */

  function viewRunner(root) {
    const cfg = session.cfg;
    const q = session.items[session.idx];
    const rec = session.records[session.idx];
    const n = session.items.length;

    const head = el('div', 'panel');
    head.innerHTML = `
      <div class="flex between wrap" style="margin-bottom:8px">
        <span class="eyebrow">${esc(cfg.title || cfg.mode)}</span>
        <span class="flex">
          ${cfg.perQuestion ? '<span id="pq-timer" class="timer"></span>' : ''}
          <span id="sess-timer" class="timer"></span>
        </span>
      </div>
      <div class="progress"><i style="width:${((session.idx) / n * 100).toFixed(1)}%"></i></div>
      <div class="flex between">
        <span class="mono-sm dim">Question ${session.idx + 1} of ${n}</span>
        <span class="flex">
          <button class="btn sm ghost" id="flag-btn">${session.flags[session.idx] ? '⚑ Flagged' : '⚐ Flag'}</button>
          <button class="btn sm ghost" id="end-btn">End</button>
        </span>
      </div>`;
    root.appendChild(head);

    const card = el('div', 'panel');
    card.innerHTML = `
      <div class="qmeta">
        <span class="tag d${q.difficulty}">L${q.difficulty}</span>
        ${cfg.hideTopic ? '' : `<span class="tag">${esc(q.topic)}</span>`}
        ${q.targetTime ? `<span>target ${q.targetTime}s</span>` : ''}
        ${q.source === 'curated' ? '<span>curated</span>' : ''}
      </div>
      <div class="qprompt">${/^\s*</.test(q.prompt) ? q.prompt : '<p>' + esc(q.prompt) + '</p>'}</div>`;

    const answerBox = el('div');
    if (q.answerType === 'mc') {
      q.options.forEach((o, i) => {
        const b = el('button', 'opt', `<span class="idx">${String.fromCharCode(65 + i)}</span>${esc(o)}`);
        if (rec) {
          if (o === q.correctAnswer) b.classList.add('right');
          if (rec.given === o && !rec.correct) b.classList.add('wrong');
          b.disabled = true;
        } else {
          b.onclick = () => submitAnswer(o);
        }
        answerBox.appendChild(b);
      });
    } else {
      const wrap = el('div');
      wrap.innerHTML = `<label class="field"><span>Your answer</span>
        <input type="text" inputmode="decimal" id="ans-input" autocomplete="off"
          placeholder="number or fraction, e.g. 0.25 or 1/4" ${rec ? 'disabled' : ''}
          value="${rec && rec.given !== null ? esc(rec.given) : ''}"></label>`;
      answerBox.appendChild(wrap);
      if (!rec) {
        const b = el('button', 'btn primary full', 'Submit answer <kbd>Enter</kbd>');
        b.onclick = () => submitAnswer($('#ans-input').value);
        answerBox.appendChild(b);
      }
    }
    card.appendChild(answerBox);

    if (!rec) {
      const conf = el('div');
      conf.innerHTML = `<div class="eyebrow" style="margin:12px 0 6px">Confidence</div>
        <div class="chips" id="conf-chips">${['Guess', 'Low', 'Medium', 'High'].map((c) =>
        `<button class="chip ${c === session.confidence ? 'on' : ''}" data-c="${c}">${c}</button>`).join('')}</div>`;
      conf.querySelectorAll('.chip').forEach((c) => {
        c.onclick = () => {
          session.confidence = c.dataset.c;
          conf.querySelectorAll('.chip').forEach((x) => x.classList.toggle('on', x === c));
        };
      });
      card.appendChild(conf);

      if (cfg.allowHelp) {
        const help = el('div', 'btn-row');
        help.style.marginTop = '12px';
        const mk = (label, key, field, note) => {
          const b = el('button', 'btn sm ghost', label);
          b.onclick = () => {
            session[key] = true;
            if (key === 'hintUsed') session.hintUsed = true;
            const r = el('div', 'reveal', `<span class="eyebrow">${note}</span>${esc(q[field] || 'Not available for this question.')}`);
            card.appendChild(r);
            b.disabled = true;
          };
          return b;
        };
        help.appendChild(mk('Hint', 'hintUsed', 'hint', 'Hint'));
        help.appendChild(mk('Show approach', 'approachShown', 'approach', 'Approach'));
        help.appendChild(mk('Full solution', 'solutionShown', 'solution', 'Full solution'));
        card.appendChild(help);
      }
    }
    root.appendChild(card);

    /* feedback */
    if (rec && !cfg.deferFeedback) {
      const f = el('div', 'panel');
      const alt = q.altSolution ? `<div class="reveal"><span class="eyebrow">Faster alternative</span>${esc(q.altSolution)}</div>` : '';
      f.innerHTML = `
        <div class="verdict ${rec.correct ? 'ok' : 'no'}">${rec.correct ? 'CORRECT' : rec.timedOut ? 'TIMED OUT' : 'INCORRECT'}
          · ${fmtTime(rec.timeSec)} vs target ${fmtTime(q.targetTime || 90)}
          · confidence ${esc(rec.confidence)}</div>
        <div class="grid c2" style="margin-bottom:10px">
          <div class="stat"><span class="label">Correct answer</span><span class="value" style="font-size:18px">${esc(String(q.correctAnswer))}</span></div>
          <div class="stat"><span class="label">Your answer</span><span class="value" style="font-size:18px">${rec.given === null ? '—' : esc(String(rec.given))}</span></div>
        </div>
        <div class="reveal"><span class="eyebrow">Best solution</span>${esc(q.solution || '')}</div>
        ${alt}
        <div class="reveal"><span class="eyebrow">Main concept · recognition clue</span>
          <strong>${esc(q.recognitionTechnique || '—')}</strong> — ${esc(q.approach || '')}</div>
        <div class="reveal"><span class="eyebrow">Common trap</span>${esc(q.commonTrap || '—')}</div>
        ${!rec.correct ? `<label class="field" style="margin-top:10px"><span>Error type (editable)</span>
          <select id="err-sel">${S.ERROR_TYPES.map((t) =>
        `<option ${t === rec.errorType ? 'selected' : ''}>${t}</option>`).join('')}</select></label>` : ''}`;
      const row = el('div', 'btn-row');
      if (q.baseId) {
        const sim = el('button', 'btn sm', 'Generate similar problem');
        sim.onclick = () => {
          const nq = S.similar(q);
          if (!nq) return toast('No generator for this question.');
          session.items.splice(session.idx + 1, 0, nq);
          session.records.splice(session.idx + 1, 0, null);
          session.flags.splice(session.idx + 1, 0, false);
          toast('Similar problem queued next.');
          render();
        };
        row.appendChild(sim);
      }
      const nx = el('button', 'btn primary',
        session.idx >= session.items.length - 1 ? 'Finish session' : 'Next question <kbd>N</kbd>');
      nx.onclick = () => (session.idx >= session.items.length - 1 ? finishAndRecord() : nextQuestion());
      row.appendChild(nx);
      f.appendChild(row);
      root.appendChild(f);
      const sel = $('#err-sel', f);
      if (sel) sel.onchange = () => { rec.errorType = sel.value; };
    }

    /* navigator */
    if (!cfg.noSkip && n > 1) {
      const nav = el('div', 'panel');
      nav.innerHTML = '<span class="eyebrow">Navigator</span><div class="navgrid" style="margin-top:8px"></div>';
      const g = $('.navgrid', nav);
      session.items.forEach((_, i) => {
        const b = el('button', (session.records[i] ? 'done ' : '') + (session.flags[i] ? 'flag ' : '') + (i === session.idx ? 'cur' : ''), String(i + 1));
        b.onclick = () => gotoQuestion(i);
        g.appendChild(b);
      });
      root.appendChild(nav);
    }

    $('#flag-btn').onclick = () => { session.flags[session.idx] = !session.flags[session.idx]; render(); };
    $('#end-btn').onclick = () => {
      if (confirm('End this session? Answered questions are saved.')) {
        session.records.forEach((r, i) => { if (!r) session.records[i] = null; });
        session.records = session.records.filter(Boolean).map((r) => r);
        finishAndRecord();
      }
    };
    const inp = $('#ans-input');
    if (inp) { inp.focus(); inp.onkeydown = (e) => { if (e.key === 'Enter') submitAnswer(inp.value); }; }
    startTick();
  }

  /* =============================== DASHBOARD =============================== */

  function viewDashboard(root) {
    const s = S.summary();
    const rd = S.readiness();
    const rec = S.recommendation();

    root.appendChild(el('div', 'grid c4', `
      <div class="stat accent"><span class="label">Accuracy</span><span class="value">${s.accuracy}%</span><span class="sub">${s.correct}/${s.total}</span></div>
      <div class="stat"><span class="label">Completed</span><span class="value">${s.total}</span><span class="sub">questions</span></div>
      <div class="stat"><span class="label">Avg time</span><span class="value">${s.avgTime}s</span><span class="sub">per question</span></div>
      <div class="stat"><span class="label">Streak</span><span class="value">${s.streak}</span><span class="sub">best ${s.bestStreak}</span></div>`));

    const nx = el('div', 'panel');
    nx.innerHTML = `<div class="panel-head"><span class="eyebrow">Recommended next session</span></div>
      <p>${esc(rec.text)}</p>`;
    const row = el('div', 'btn-row');
    const b1 = el('button', 'btn primary', 'Train my weaknesses');
    b1.onclick = () => startSession({
      items: S.weaknessSession(12), mode: 'Adaptive', testType: 'Adaptive',
      allowHelp: true, title: 'Adaptive — train my weaknesses', returnTo: 'dashboard'
    });
    row.appendChild(b1);
    const b2 = el('button', 'btn', 'Go to ' + (rec.action === 'learn' ? 'Learn' : rec.action === 'pattern' ? 'Pattern recognition' : rec.action === 'mock' ? 'Mocks' : 'Drill'));
    b2.onclick = () => go(rec.action === 'learn' ? 'learn' : rec.action === 'pattern' ? 'pattern' : rec.action === 'mock' ? 'mocks' : 'drill');
    row.appendChild(b2);
    nx.appendChild(row);

    const quick = el('div', 'btn-row');
    quick.style.marginTop = '8px';
    [['Quick 5 min', 5], ['10 min', 10], ['20 min', 20], ['45 min', 45]].forEach(([label, min]) => {
      const b = el('button', 'btn sm', label);
      b.onclick = () => startSession({
        items: S.weaknessSession(Math.max(4, Math.round(min * 60 / 75))),
        mode: 'Session', testType: 'Session', allowHelp: true,
        totalSeconds: min * 60, title: label + ' session', returnTo: 'dashboard'
      });
      quick.appendChild(b);
    });
    nx.appendChild(quick);
    root.appendChild(nx);

    root.appendChild(el('div', 'grid c3', `
      <div class="stat"><span class="label">Wincent readiness</span><span class="value">${rd.wincent}</span><span class="sub">internal metric</span></div>
      <div class="stat"><span class="label">SIG readiness</span><span class="value">${rd.sig}</span><span class="sub">internal metric</span></div>
      <div class="stat"><span class="label">IMC readiness</span><span class="value">${rd.imc}</span><span class="sub">internal metric</span></div>`));

    const cols = el('div', 'grid c2');
    const p1 = el('div', 'panel');
    p1.innerHTML = '<span class="eyebrow">Accuracy by topic</span><div style="margin-top:8px">' +
      bars(S.byKey('topic').sort((a, b) => b.n - a.n)) + '</div>';
    const p2 = el('div', 'panel');
    p2.innerHTML = '<span class="eyebrow">Accuracy by difficulty</span><div style="margin-top:8px">' +
      bars(S.byKey('difficulty').sort((a, b) => a.key - b.key).map((r) => Object.assign({}, r, { key: 'Level ' + r.key }))) + '</div>';
    cols.appendChild(p1); cols.appendChild(p2);
    root.appendChild(cols);

    const cols2 = el('div', 'grid c2');
    const w = S.weakestTopics(3), st = S.strongestTopics(3);
    const p3 = el('div', 'panel');
    p3.innerHTML = '<span class="eyebrow">Weakest 3 topics</span>' +
      (w.length ? '<ul class="list">' + w.map((r) => `<li>${esc(r.key)} <span class="neg mono-sm right" style="float:right">${r.accuracy}% · n=${r.n}</span></li>`).join('') + '</ul>'
        : '<div class="empty">Needs at least 3 attempts per topic.</div>');
    const p4 = el('div', 'panel');
    p4.innerHTML = '<span class="eyebrow">Strongest 3 topics</span>' +
      (st.length ? '<ul class="list">' + st.map((r) => `<li>${esc(r.key)} <span class="pos mono-sm" style="float:right">${r.accuracy}% · n=${r.n}</span></li>`).join('') + '</ul>'
        : '<div class="empty">Needs at least 3 attempts per topic.</div>');
    cols2.appendChild(p3); cols2.appendChild(p4);
    root.appendChild(cols2);

    const m = S.recentMocks(null, 5);
    const p5 = el('div', 'panel');
    p5.innerHTML = '<span class="eyebrow">Recent mock scores</span>' +
      (m.length ? '<ul class="list">' + m.map((x) => `<li>${esc(x.type)} — <strong>${x.score}/${x.total}</strong>
        <span class="dim mono-sm" style="float:right">${new Date(x.ts).toLocaleDateString()} · ${fmtTime(x.timeSec)}</span></li>`).join('') + '</ul>'
        : '<div class="empty">No mocks taken yet.</div>');
    root.appendChild(p5);
  }

  /* ================================= LEARN ================================= */

  function viewLearn(root) {
    S.allLessonUnits().forEach((unit) => {
      const p = el('div', 'panel');
      p.innerHTML = `<div class="panel-head"><span class="eyebrow">Unit ${esc(unit.unit)}</span><h2>${esc(unit.title)}</h2></div>`;
      unit.concepts.forEach((c) => {
        const d = el('details', 'acc');
        const levelWord = (lv) => lv === 1 ? 'Basic' : lv === 2 ? 'Intermediate' : 'Advanced';
        d.innerHTML = `<summary>${esc(c.name)}</summary>
          <div class="acc-body">
            ${c.primer ? `<div class="reveal"><span class="eyebrow">Start from zero</span>${esc(c.primer)}</div>` : ''}
            <p><strong>Core idea.</strong> ${esc(c.core)}</p>
            <p><strong>When to use it.</strong> ${esc(c.when)}</p>
            <div class="eyebrow">Key formulas</div>
            <ul class="formula-list">${c.formulas.map((f) => `<li><span class="formula">${esc(f)}</span></li>`).join('')}</ul>
            <p><strong>Intuition.</strong> ${esc(c.intuition)}</p>
            <div class="eyebrow" style="margin-top:10px">Worked examples</div>
            ${(c.examples || []).map((ex) => `<div class="reveal"><span class="eyebrow">Level ${ex.level} — ${levelWord(ex.level)}</span>${esc(ex.text)}</div>`).join('')}
            <div class="reveal"><span class="eyebrow">Common trap</span>${esc(c.trap)}</div>
            <div class="eyebrow" style="margin-top:12px">Practice — ${c.checks.length} questions, increasing difficulty</div>
            <div class="checks"></div>
          </div>`;
        const box = $('.checks', d);
        c.checks.forEach((chk, ci) => {
          const wrap = el('div');
          wrap.style.margin = '10px 0';
          const lv = chk.level || 1;
          wrap.innerHTML = `<p style="margin-bottom:6px"><span class="tag d${lv}">L${lv} ${levelWord(lv)}</span> ${esc(chk.q)}</p>`;
          chk.options.forEach((o, oi) => {
            const b = el('button', 'opt', `<span class="idx">${String.fromCharCode(65 + oi)}</span>${esc(o)}`);
            b.onclick = () => {
              Array.from(wrap.querySelectorAll('.opt')).forEach((x, xi) => {
                x.disabled = true;
                if (xi === chk.a) x.classList.add('right');
              });
              if (oi !== chk.a) b.classList.add('wrong');
              const why = el('div', 'reveal', `<span class="eyebrow">${oi === chk.a ? 'Correct' : 'Not quite'}</span>${esc(chk.why)}`);
              wrap.appendChild(why);
              S.recordAttempt({
                qid: 'lesson:' + c.id + ':' + ci, mode: 'Learn', testType: 'Learn',
                topic: unit.topic, subtopic: c.name, difficulty: lv, correct: oi === chk.a, timeSec: 0,
                targetTime: 30, hintUsed: false, confidence: 'Medium'
              });
            };
            wrap.appendChild(b);
          });
          box.appendChild(wrap);
        });
        p.appendChild(d);
      });
      root.appendChild(p);
    });
  }

  /* ================================= DRILL ================================= */

  const drillState = { topic: '', subtopic: '', diffs: [2, 3], count: 10, timed: false, calc: true };

  function viewDrill(root) {
    const p = el('div', 'panel');
    p.innerHTML = `<div class="panel-head"><span class="eyebrow">Configure drill</span></div>
      <label class="field"><span>Topic</span><select id="d-topic">
        <option value="">All topics</option>
        ${S.topics().map((t) => `<option ${t === drillState.topic ? 'selected' : ''}>${esc(t)}</option>`).join('')}
      </select></label>
      <label class="field"><span>Subtopic</span><select id="d-sub"></select></label>
      <div class="eyebrow">Difficulty</div>
      <div class="chips" id="d-diff" style="margin:6px 0 12px">
        ${[1, 2, 3, 4, 5].map((d) => `<button class="chip ${drillState.diffs.includes(d) ? 'on' : ''}" data-d="${d}">Level ${d}</button>`).join('')}
      </div>
      <label class="field"><span>Number of questions</span>
        <select id="d-count">${[5, 10, 15, 20, 30].map((c) => `<option ${c === drillState.count ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
      <div class="chips" style="margin-bottom:12px">
        <button class="chip ${drillState.timed ? 'on' : ''}" id="d-timed">Timed to target</button>
        <button class="chip ${drillState.calc ? 'on' : ''}" id="d-calc">Calculator allowed</button>
      </div>`;
    const start = el('button', 'btn primary full', 'Start drill');
    p.appendChild(start);
    root.appendChild(p);

    const fillSubs = () => {
      const sel = $('#d-sub');
      const subs = S.subtopics(drillState.topic || null);
      sel.innerHTML = '<option value="">All subtopics</option>' + subs.map((x) => `<option ${x === drillState.subtopic ? 'selected' : ''}>${esc(x)}</option>`).join('');
    };
    fillSubs();
    $('#d-topic').onchange = (e) => { drillState.topic = e.target.value; drillState.subtopic = ''; fillSubs(); };
    $('#d-sub').onchange = (e) => { drillState.subtopic = e.target.value; };
    $('#d-count').onchange = (e) => { drillState.count = +e.target.value; };
    $('#d-diff').querySelectorAll('.chip').forEach((c) => {
      c.onclick = () => {
        const d = +c.dataset.d;
        const i = drillState.diffs.indexOf(d);
        if (i >= 0) { if (drillState.diffs.length > 1) drillState.diffs.splice(i, 1); }
        else drillState.diffs.push(d);
        c.classList.toggle('on', drillState.diffs.includes(d));
      };
    });
    $('#d-timed').onclick = (e) => { drillState.timed = !drillState.timed; e.target.classList.toggle('on', drillState.timed); };
    $('#d-calc').onclick = (e) => { drillState.calc = !drillState.calc; e.target.classList.toggle('on', drillState.calc); };

    start.onclick = () => {
      const items = S.buildSession({
        topics: drillState.topic ? [drillState.topic] : null,
        subtopic: drillState.subtopic || null,
        difficulties: drillState.diffs.slice(),
        count: drillState.count
      });
      if (!items.length) return toast('No questions match that combination.');
      startSession({
        items, mode: 'Drill', testType: 'Drill', allowHelp: true,
        title: 'Drill — ' + (drillState.topic || 'all topics') + (drillState.calc ? '' : ' · no calculator'),
        totalSeconds: drillState.timed ? items.reduce((s, q) => s + (q.targetTime || 90), 0) : null,
        returnTo: 'drill'
      });
    };

    const info = el('div', 'panel small muted');
    info.innerHTML = `<span class="eyebrow">Bank</span><p style="margin-top:8px">
      ${S.allGenerators().length} parameterised generators · ${S.curated().length} curated hard questions ·
      ${S.topics().length} topics. Generated questions are built from controlled parameters, so every answer is exact.</p>`;
    root.appendChild(info);
  }

  /* ========================= PATTERN RECOGNITION =========================== */

  const patternState = { seconds: 20, count: 12 };

  function viewPattern(root) {
    if (patternState.run) return viewPatternRun(root);
    const p = el('div', 'panel');
    p.innerHTML = `<div class="panel-head"><span class="eyebrow">Pattern recognition</span></div>
      <p class="small muted">You are not asked to solve the problem. Classify the primary technique before the clock runs out. Recognition accuracy is tracked separately from calculation accuracy.</p>
      <label class="field"><span>Seconds per item</span>
        <select id="p-sec">${[15, 20, 25, 30].map((s) => `<option ${s === patternState.seconds ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
      <label class="field"><span>Items</span>
        <select id="p-n">${[8, 12, 20, 30].map((s) => `<option ${s === patternState.count ? 'selected' : ''}>${s}</option>`).join('')}</select></label>`;
    const b = el('button', 'btn primary full', 'Start recognition set');
    p.appendChild(b);
    root.appendChild(p);

    const r = S.recognitionAccuracy();
    const st = el('div', 'grid c2', `
      <div class="stat"><span class="label">Recognition accuracy</span><span class="value">${r.accuracy}%</span><span class="sub">${r.n} items</span></div>
      <div class="stat"><span class="label">Calculation accuracy</span><span class="value">${S.summary().accuracy}%</span><span class="sub">${S.summary().total} attempts</span></div>`);
    root.appendChild(st);

    $('#p-sec').onchange = (e) => { patternState.seconds = +e.target.value; };
    $('#p-n').onchange = (e) => { patternState.count = +e.target.value; };
    b.onclick = () => {
      const items = S.buildSession({ count: patternState.count, difficulties: [2, 3, 4, 5], curatedShare: 0.5 })
        .filter((q) => q.recognitionTechnique);
      if (items.length < 3) return toast('Not enough classified questions available.');
      patternState.run = { items, idx: 0, answers: [], start: Date.now(), qStart: Date.now(), picked: null };
      render();
    };
  }

  function viewPatternRun(root) {
    const r = patternState.run;
    const q = r.items[r.idx];
    const p = el('div', 'panel');
    p.innerHTML = `<div class="flex between"><span class="eyebrow">Classify — item ${r.idx + 1}/${r.items.length}</span>
        <span id="pr-timer" class="timer"></span></div>
      <div class="progress" style="margin-top:8px"><i style="width:${(r.idx / r.items.length * 100).toFixed(1)}%"></i></div>
      <div class="qprompt" style="margin-top:10px">${/^\s*</.test(q.prompt) ? q.prompt : '<p>' + esc(q.prompt) + '</p>'}</div>`;
    root.appendChild(p);

    const box = el('div', 'panel');
    box.innerHTML = '<span class="eyebrow">Primary approach</span><div class="chips" style="margin-top:8px"></div>';
    const chips = $('.chips', box);
    S.TECHNIQUES.forEach((t) => {
      const c = el('button', 'chip', t);
      c.onclick = () => answerPattern(t);
      chips.appendChild(c);
    });
    root.appendChild(box);

    if (r.picked) {
      const ok = r.picked === q.recognitionTechnique;
      const f = el('div', 'panel');
      f.innerHTML = `<div class="verdict ${ok ? 'ok' : 'no'}">${ok ? 'CORRECT' : 'INCORRECT'} — primary approach: ${esc(q.recognitionTechnique)}</div>
        <div class="reveal"><span class="eyebrow">Why</span>${esc(q.approach || '')}</div>
        <div class="reveal"><span class="eyebrow">Trap</span>${esc(q.commonTrap || '—')}</div>`;
      const b = el('button', 'btn primary full', r.idx >= r.items.length - 1 ? 'Finish set' : 'Next item <kbd>N</kbd>');
      b.onclick = nextPattern;
      f.appendChild(b);
      root.appendChild(f);
    }

    stopTick();
    tickHandle = setInterval(() => {
      const t = $('#pr-timer');
      if (!t || !patternState.run) return stopTick();
      if (patternState.run.picked) { t.textContent = ''; return; }
      const left = patternState.seconds - (Date.now() - patternState.run.qStart) / 1000;
      t.textContent = fmtTime(left);
      t.className = 'timer' + (left < 6 ? ' danger' : '');
      if (left <= 0) answerPattern(null);
    }, 250);
  }

  function answerPattern(t) {
    const r = patternState.run;
    if (!r || r.picked) return;
    r.picked = t || '—';
    const q = r.items[r.idx];
    S.recordRecognition({
      qid: q.id, topic: q.topic, correct: t === q.recognitionTechnique,
      timeSec: (Date.now() - r.qStart) / 1000, picked: t, expected: q.recognitionTechnique
    });
    render();
  }
  function nextPattern() {
    const r = patternState.run;
    if (r.idx >= r.items.length - 1) {
      const acc = S.state.recognition.slice(-r.items.length);
      toast('Set complete: ' + acc.filter((x) => x.correct).length + '/' + r.items.length + ' classified correctly.');
      patternState.run = null;
      stopTick();
    } else { r.idx++; r.qStart = Date.now(); r.picked = null; }
    render();
  }

  /* ============================= MIXED PRACTICE ============================ */

  function viewMixed(root) {
    const modes = [
      { k: 'Easy', d: [1, 2], n: 12, help: true },
      { k: 'Medium', d: [2, 3], n: 12, help: true },
      { k: 'Hard', d: [4, 5], n: 10, help: true },
      { k: 'Wincent level', d: [3, 4, 5], n: 8, help: false, topics: ['Probability', 'Expected Value', 'Combinatorics', 'Order Statistics', 'Symmetry', 'Recursion', 'Optimal Strategy', 'Information Problems', 'Variance', 'Distributions', 'Game Theory'] },
      { k: 'SIG speed level', d: [1, 2, 3], n: 20, help: false, per: 55, topics: ['Mental Maths', 'Finance', 'Data Interpretation', 'Logic', 'Probability', 'Expected Value'] },
      { k: 'Fully mixed', d: [1, 2, 3, 4, 5], n: 15, help: true }
    ];
    const p = el('div', 'panel');
    p.innerHTML = '<div class="panel-head"><span class="eyebrow">Mixed practice</span></div><p class="small muted">The topic is hidden until you answer, so you have to recognise the structure yourself.</p>';
    const row = el('div', 'btn-row');
    modes.forEach((m) => {
      const b = el('button', 'btn', m.k);
      b.onclick = () => {
        const items = S.buildSession({ count: m.n, difficulties: m.d, topics: m.topics || null });
        startSession({
          items, mode: 'Mixed', testType: 'Mixed — ' + m.k, allowHelp: m.help,
          hideTopic: true, perQuestion: m.per || null,
          title: 'Mixed — ' + m.k, returnTo: 'mixed'
        });
      };
      row.appendChild(b);
    });
    p.appendChild(row);
    root.appendChild(p);

    const cm = S.confidenceMatrix();
    const q = el('div', 'panel');
    q.innerHTML = '<span class="eyebrow">Confidence calibration</span><div style="margin-top:8px">' +
      bars(cm.rows.filter((r) => r.n)) + `</div>
      <div class="hr"></div>
      <div class="grid c2">
        <div class="stat"><span class="label">Confident errors</span><span class="value neg">${cm.confidentErrors}</span><span class="sub">high confidence, wrong</span></div>
        <div class="stat"><span class="label">Lucky correct</span><span class="value">${cm.luckyCorrect}</span><span class="sub">guess/low, right</span></div>
      </div>`;
    root.appendChild(q);
  }

  /* ================================= MOCKS ================================= */

  const sprintState = { seconds: 15, count: 15 };

  function viewMocks(root) {
    const track = S.activeTrack();

    /* --- Speed Sprint (reasoning track) --- */
    if (track === 'reasoning') {
      const sp = el('div', 'panel');
      sp.innerHTML = `<div class="panel-head"><span class="eyebrow">Speed Sprint</span><h2>Fast numerical / abstract / logical / verbal reasoning</h2></div>
        <p class="small muted">One question at a time, a short hard timer per question, no skipping back, no hints. This is the format real speed-reasoning assessments use — the clock is the whole point.</p>
        <label class="field"><span>Seconds per question</span><select id="sprint-sec">
          ${[12, 15, 18, 20].map((s) => `<option ${s === sprintState.seconds ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
        <label class="field"><span>Questions</span><select id="sprint-n">
          ${[10, 15, 20, 25].map((n) => `<option ${n === sprintState.count ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`;
      const spb = el('button', 'btn primary full', 'Start Speed Sprint');
      spb.onclick = () => {
        sprintState.seconds = +$('#sprint-sec', sp).value;
        sprintState.count = +$('#sprint-n', sp).value;
        const items = S.buildSession({ count: sprintState.count, difficulties: [1, 2, 3, 4, 5] });
        if (!items.length) return toast('No reasoning-track questions available.');
        startSession({
          items, mode: 'Mock', testType: 'Speed Sprint', allowHelp: false, deferFeedback: true, noSkip: true,
          perQuestion: sprintState.seconds, totalSeconds: items.length * sprintState.seconds,
          title: 'SPEED SPRINT — ' + items.length + ' questions / ' + sprintState.seconds + 's each',
          onFinish: (recs, elapsed) => finishMock('Speed Sprint', recs, elapsed)
        });
      };
      sp.appendChild(spb);
      root.appendChild(sp);
    }

    /* --- Wincent / SIG / IMC / McKinsey prep (quant track only — these mocks are defined
       around quant-track topic names and have no matching content on other tracks) --- */
    const set = S.state.settings;
    if (track === 'quant') {
    const w = el('div', 'panel');
    w.innerHTML = `<div class="panel-head"><span class="eyebrow">Wincent mock</span><h2>12 questions · 100 minutes</h2></div>
      <p class="small muted">Substantial probability and mathematical reasoning. No hints, no solutions until submission. Target pace is roughly 8 minutes per question.</p>`;
    const wb = el('button', 'btn primary full', 'Start Wincent mock');
    wb.onclick = () => {
      const items = S.buildSession({
        count: 12, difficulties: [3, 4, 5], curatedShare: 0.6,
        topics: ['Probability', 'Expected Value', 'Combinatorics', 'Order Statistics', 'Symmetry',
          'Recursion', 'Optimal Strategy', 'Information Problems', 'Variance', 'Distributions', 'Game Theory']
      });
      if (!items.length) return toast('No questions match that combination.');
      startSession({
        items, mode: 'Mock', testType: 'Wincent', allowHelp: false, deferFeedback: true,
        totalSeconds: 100 * 60, title: 'WINCENT MOCK — 12 questions / 100 min',
        onFinish: (recs, elapsed) => finishMock('Wincent', recs, elapsed)
      });
    };
    w.appendChild(wb);
    root.appendChild(w);

    const g = el('div', 'panel');
    g.innerHTML = `<div class="panel-head"><span class="eyebrow">SIG mock</span><h2>${set.sigMinutes} minutes · no skipping</h2></div>
      <p class="small muted">One total timer. Once an answer is submitted the test moves on and cannot go back. Speed and accuracy both count.</p>
      <label class="field"><span>Questions</span><select id="sig-n">
        ${[15, 20, 25, 30].map((n) => `<option ${n === set.sigCount ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`;
    const gb = el('button', 'btn primary full', 'Start SIG mock');
    gb.onclick = () => {
      const n = +$('#sig-n').value;
      set.sigCount = n; S.save();
      const items = S.buildSession({
        count: n, difficulties: [1, 2, 3],
        topics: ['Mental Maths', 'Finance', 'Data Interpretation', 'Logic', 'Probability', 'Expected Value', 'Market Making']
      });
      if (!items.length) return toast('No questions match that combination.');
      startSession({
        items, mode: 'Mock', testType: 'SIG', allowHelp: false, deferFeedback: true, noSkip: true,
        totalSeconds: set.sigMinutes * 60, title: 'SIG MOCK — ' + n + ' questions / ' + set.sigMinutes + ' min',
        onFinish: (recs, elapsed) => finishMock('SIG', recs, elapsed)
      });
    };
    g.appendChild(gb);
    root.appendChild(g);

    /* --- IMC --- */
    const imc = set.imc;
    const i = el('div', 'panel');
    i.innerHTML = `<div class="panel-head"><span class="eyebrow">IMC mock — provisional</span><h2>${esc(imc.label)}</h2></div>
      <p class="small muted">The real structure is unknown. This framework is defined by a single JS object
      (<code>settings.imc</code>) and can be edited below or in <code>js/store.js</code> once you have the official practice assessment.</p>
      <ul class="list">${imc.sections.map((sec) =>
      `<li>${esc(sec.name)} <span class="dim mono-sm" style="float:right">${sec.count} q · ${sec.seconds}s each</span></li>`).join('')}</ul>`;
    const ib = el('button', 'btn primary full', 'Start IMC mock');
    ib.onclick = () => {
      let items = [];
      imc.sections.forEach((sec) => {
        items = items.concat(S.buildSession({ count: sec.count, topics: sec.topics, difficulties: [1, 2, 3, 4] })
          .map((q) => Object.assign(q, { targetTime: sec.seconds, section: sec.name })));
      });
      startSession({
        items, mode: 'Mock', testType: 'IMC', allowHelp: false, deferFeedback: true,
        totalSeconds: imc.totalMinutes * 60, title: 'IMC MOCK (provisional)',
        onFinish: (recs, elapsed) => finishMock('IMC', recs, elapsed)
      });
    };
    i.appendChild(ib);
    root.appendChild(i);

    /* --- McKinsey-style --- */
    const k = el('div', 'panel');
    k.innerHTML = `<div class="panel-head"><span class="eyebrow">McKinsey Solve preparation</span><h2>Analogous exercises only</h2></div>
      <p class="small muted">These are original exercises built to train the same underlying skills. They do not reproduce or imitate any proprietary assessment content, and this section is kept separate from the quantitative trading material.</p>`;
    const krow = el('div', 'btn-row');
    [['A · Data interpretation sprint', ['Data Interpretation'], 10, 75],
    ['B · Constraint optimisation', ['Constraint Optimisation'], 6, 150],
    ['C · Structured decisions', ['Structured Decisions'], 6, 110]].forEach(([label, topics, n, per]) => {
      const b = el('button', 'btn', label);
      b.onclick = () => {
        const items = S.buildSession({ count: n, topics, difficulties: [2, 3, 4] });
        startSession({
          items, mode: 'Mock', testType: 'McKinsey prep', allowHelp: false, deferFeedback: true,
          perQuestion: per, totalSeconds: n * per, title: label,
          onFinish: (recs, elapsed) => finishMock('McKinsey prep', recs, elapsed)
        });
      };
      krow.appendChild(b);
    });
    k.appendChild(krow);
    root.appendChild(k);
    }

    /* --- history --- */
    const hist = S.state.mocks.slice().reverse();
    const h = el('div', 'panel');
    h.innerHTML = '<span class="eyebrow">Mock history</span>' + (hist.length
      ? '<ul class="list">' + hist.map((m) => `<li>${esc(m.type)} — <strong>${m.score}/${m.total}</strong>
          <span class="dim mono-sm" style="float:right">${new Date(m.ts).toLocaleString()} · ${fmtTime(m.timeSec)}${m.rating !== null && m.rating !== undefined ? ' · internal ' + m.rating : ''}</span></li>`).join('') + '</ul>'
      : '<div class="empty">No mocks yet.</div>');
    root.appendChild(h);
  }

  let lastMockReport = null;

  function finishMock(type, recs, elapsed) {
    const done = recs.filter(Boolean);
    const score = done.filter((r) => r.correct).length;
    const total = done.length;
    const rating = S.internalRating(type, total ? score / total : 0);
    S.recordMock({ type, score, total, timeSec: Math.round(elapsed), rating });
    lastMockReport = { type, recs: done, score, total, elapsed, rating };
    go('mockreport');
  }

  function viewMockReport(root) {
    const r = lastMockReport;
    if (!r) { go('mocks'); return; }
    const perMin = r.elapsed > 0 ? (r.total / (r.elapsed / 60)) : 0;
    const slow = r.recs.filter((x) => x.q.targetTime && x.timeSec > x.q.targetTime * 1.5);
    const topicRows = (() => {
      const m = {};
      r.recs.forEach((x) => {
        m[x.q.topic] = m[x.q.topic] || { n: 0, c: 0 };
        m[x.q.topic].n++; if (x.correct) m[x.q.topic].c++;
      });
      return Object.keys(m).map((k) => ({ key: k, n: m[k].n, accuracy: Math.round(100 * m[k].c / m[k].n) }))
        .sort((a, b) => a.accuracy - b.accuracy);
    })();

    const head = el('div', 'panel');
    head.innerHTML = `<div class="panel-head"><span class="eyebrow">${esc(r.type)} mock result</span></div>
      <div class="grid c4">
        <div class="stat accent"><span class="label">Score</span><span class="value">${r.score}/${r.total}</span></div>
        <div class="stat"><span class="label">Time</span><span class="value">${fmtTime(r.elapsed)}</span></div>
        <div class="stat"><span class="label">Pace</span><span class="value">${perMin.toFixed(2)}</span><span class="sub">q / minute</span></div>
        <div class="stat"><span class="label">Internal rating</span><span class="value">${r.rating === null || r.rating === undefined ? '—' : r.rating}</span><span class="sub">vs your own history</span></div>
      </div>
      <p class="small dim" style="margin-top:10px">The internal rating compares this attempt only with your own previous mocks of the same type. It is not a prediction of any employer's score.</p>`;
    root.appendChild(head);

    const br = el('div', 'panel');
    br.innerHTML = '<span class="eyebrow">Topic breakdown</span><div style="margin-top:8px">' + bars(topicRows) + '</div>' +
      (slow.length ? `<div class="hr"></div><span class="eyebrow">Inefficient method — well over target time</span>
        <ul class="list">${slow.map((x) => `<li>${esc(x.q.topic)} — ${fmtTime(x.timeSec)} vs ${fmtTime(x.q.targetTime)}
          <span class="dim mono-sm" style="float:right">${esc(x.q.recognitionTechnique || '')}</span></li>`).join('')}</ul>` : '');
    root.appendChild(br);

    r.recs.forEach((x, i) => {
      const p = el('div', 'panel');
      p.innerHTML = `<div class="qmeta"><span class="tag d${x.q.difficulty}">L${x.q.difficulty}</span>
          <span class="tag">${esc(x.q.topic)}</span><span>${fmtTime(x.timeSec)}</span></div>
        <div class="verdict ${x.correct ? 'ok' : 'no'}">Q${i + 1} — ${x.correct ? 'correct' : 'incorrect'}
          · your answer ${x.given === null ? '—' : esc(String(x.given))} · correct ${esc(String(x.q.correctAnswer))}</div>
        <div class="qprompt small">${/^\s*</.test(x.q.prompt) ? x.q.prompt : '<p>' + esc(x.q.prompt) + '</p>'}</div>
        <div class="reveal"><span class="eyebrow">Solution</span>${esc(x.q.solution || '')}</div>
        <div class="reveal"><span class="eyebrow">Technique</span>${esc(x.q.recognitionTechnique || '')} — ${esc(x.q.approach || '')}</div>`;
      root.appendChild(p);
    });

    const b = el('button', 'btn primary full', 'Back to mocks');
    b.onclick = () => go('mocks');
    root.appendChild(b);
  }

  /* ================================ MISTAKES =============================== */

  function viewMistakes(root) {
    const wrong = S.state.attempts.filter((a) => !a.correct).slice().reverse();
    const eb = S.errorBreakdown();

    const p = el('div', 'panel');
    p.innerHTML = '<span class="eyebrow">Error types</span><div style="margin-top:8px">' +
      bars(eb, { field: 'n', max: Math.max(1, Math.max.apply(null, eb.map((e) => e.n))), plain: true, fmt: (r) => r.n }) + '</div>';
    const redo = el('button', 'btn primary full', 'Redo mistakes (spaced repetition)');
    redo.style.marginTop = '10px';
    redo.onclick = () => {
      const ids = Array.from(new Set(wrong.map((a) => a.qid)));
      const cur = S.curated().filter((q) => ids.includes(q.id));
      const baseIds = Array.from(new Set(wrong.map((a) => a.baseId).filter(Boolean)));
      const regen = S.allGenerators().filter((g) => baseIds.includes(g.id)).map((g) => S.instantiate(g));
      const items = cur.concat(regen).slice(0, 15);
      if (!items.length) return toast('No mistakes recorded yet.');
      startSession({ items, mode: 'Redo', testType: 'Redo', allowHelp: true, title: 'Redo mistakes', returnTo: 'mistakes' });
    };
    p.appendChild(redo);
    root.appendChild(p);

    const list = el('div', 'panel');
    list.innerHTML = '<span class="eyebrow">Error log</span>';
    if (!wrong.length) list.innerHTML += '<div class="empty">No mistakes logged. Take a drill to populate this.</div>';
    wrong.slice(0, 60).forEach((a) => {
      const d = el('details', 'acc');
      d.innerHTML = `<summary>${esc(a.topic || '—')} <span class="dim mono-sm" style="margin-left:auto">${new Date(a.ts).toLocaleDateString()}</span></summary>
        <div class="acc-body">
          <p class="small muted">${esc(a.subtopic || '')} · level ${a.difficulty} · ${a.timeSec}s · confidence ${esc(a.confidence || '—')}
            ${a.hintUsed ? '· hint used' : ''}</p>
          <p class="small">Your answer <strong>${a.given === null || a.given === undefined ? '—' : esc(String(a.given))}</strong>
            · correct <strong>${esc(String(a.expected))}</strong></p>
          <label class="field"><span>Error classification</span>
            <select data-aid="${a.aid}">${S.ERROR_TYPES.map((t) => `<option ${t === a.errorType ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        </div>`;
      $('select', d).onchange = (e) => { S.setErrorType(a.aid, e.target.value); toast('Reclassified.'); };
      list.appendChild(d);
    });
    root.appendChild(list);
  }

  /* ================================= SHEET ================================= */

  function viewSheet(root) {
    const note = el('div', 'panel small muted');
    note.innerHTML = '<span class="eyebrow">Preparation only</span><p style="margin-top:8px">This sheet is a study aid. Do not use it during any real assessment.</p>';
    root.appendChild(note);
    global.QTL_FORMULAS.forEach((g) => {
      const p = el('div', 'panel');
      p.innerHTML = `<div class="panel-head"><span class="eyebrow">${esc(g.group)}</span></div>`;
      g.items.forEach((it) => {
        const d = el('details', 'acc');
        d.innerHTML = `<summary><strong>${esc(it.t)}</strong></summary>
          <div class="acc-body">
            <p class="trigger">Trigger: ${esc(it.trigger)}</p>
            <p>${esc(it.body)}</p>
          </div>`;
        p.appendChild(d);
      });
      root.appendChild(p);
    });
  }

  /* ================================= STATS ================================= */

  function viewStats(root) {
    const days = S.perDay();
    const rd = S.readiness();
    const cm = S.confidenceMatrix();
    const rec = S.recognitionAccuracy();

    const a = el('div', 'grid c2');
    const p1 = el('div', 'panel');
    p1.innerHTML = '<span class="eyebrow">Accuracy over time (daily %)</span>' +
      lineChart(days.map((d) => ({ y: d.accuracy })), { max: 100, label: 'daily accuracy' });
    const p2 = el('div', 'panel');
    p2.innerHTML = '<span class="eyebrow">Speed over time (avg s/question)</span>' +
      lineChart(days.map((d) => ({ y: d.avgTime })), { label: 'avg seconds' });
    a.appendChild(p1); a.appendChild(p2);
    root.appendChild(a);

    const b = el('div', 'grid c2');
    const p3 = el('div', 'panel');
    p3.innerHTML = '<span class="eyebrow">Questions completed per day</span>' +
      barChart(days.map((d) => ({ key: d.date.slice(5), n: d.n })), { label: 'questions/day' });
    const p4 = el('div', 'panel');
    p4.innerHTML = '<span class="eyebrow">Mock performance (%)</span>' +
      lineChart(S.state.mocks.map((m) => ({ y: Math.round(100 * m.score / Math.max(1, m.total)) })), { max: 100, label: 'mock score' });
    b.appendChild(p3); b.appendChild(p4);
    root.appendChild(b);

    const c = el('div', 'grid c2');
    const p5 = el('div', 'panel');
    p5.innerHTML = '<span class="eyebrow">Accuracy by topic</span><div style="margin-top:8px">' + bars(S.byKey('topic')) + '</div>';
    const p6 = el('div', 'panel');
    p6.innerHTML = '<span class="eyebrow">Average time by topic (s)</span><div style="margin-top:8px">' +
      bars(S.byKey('topic'), { field: 'avgTime', max: Math.max(30, Math.max.apply(null, S.byKey('topic').map((r) => r.avgTime) || [30])), plain: true, fmt: (r) => r.avgTime + 's' }) + '</div>';
    c.appendChild(p5); c.appendChild(p6);
    root.appendChild(c);

    const d = el('div', 'panel');
    d.innerHTML = `<span class="eyebrow">Recognition vs calculation</span>
      <div class="grid c2" style="margin-top:8px">
        <div class="stat"><span class="label">Recognition</span><span class="value">${rec.accuracy}%</span><span class="sub">${rec.n} items</span></div>
        <div class="stat"><span class="label">Calculation</span><span class="value">${S.summary().accuracy}%</span><span class="sub">${S.summary().total} attempts</span></div>
      </div>
      <div class="hr"></div>
      <span class="eyebrow">Confidence calibration</span><div style="margin-top:8px">${bars(cm.rows.filter((r) => r.n))}</div>
      <p class="small muted" style="margin-top:8px">Confident errors: <strong class="neg">${cm.confidentErrors}</strong> ·
        low-confidence correct: <strong>${cm.luckyCorrect}</strong></p>`;
    root.appendChild(d);

    const e = el('div', 'panel');
    e.innerHTML = `<span class="eyebrow">Readiness scores</span>
      <p class="small muted" style="margin-top:6px">Internal progress metrics only. They do not predict employer test outcomes.</p>
      <div class="grid c3" style="margin-top:8px">
        <div class="stat accent"><span class="label">Wincent</span><span class="value">${rd.wincent}</span></div>
        <div class="stat accent"><span class="label">SIG</span><span class="value">${rd.sig}</span></div>
        <div class="stat accent"><span class="label">IMC</span><span class="value">${rd.imc}</span></div>
      </div>
      <div class="hr"></div>
      <div class="small muted mono-sm">components — hard accuracy ${rd.parts.hardAcc}% · recognition ${rd.parts.rec}% ·
        within target time ${rd.parts.speed}% · speed-set accuracy ${rd.parts.sigAcc}% · throughput ${rd.parts.throughput} · finance ${rd.parts.finAcc}%</div>`;
    root.appendChild(e);

    const f = el('div', 'panel');
    f.innerHTML = '<span class="eyebrow">Error types</span><div style="margin-top:8px">' +
      bars(S.errorBreakdown(), { field: 'n', max: Math.max(1, Math.max.apply(null, S.errorBreakdown().map((x) => x.n).concat([1]))), plain: true, fmt: (r) => r.n }) + '</div>';
    root.appendChild(f);
  }

  /* ================================ SETTINGS =============================== */

  function viewSettings(root) {
    const set = S.state.settings;

    const t = el('div', 'panel');
    t.innerHTML = '<span class="eyebrow">Appearance</span>';
    const tb = el('button', 'btn full', 'Toggle dark / light theme');
    tb.style.marginTop = '8px';
    tb.onclick = toggleTheme;
    t.appendChild(tb);
    root.appendChild(t);

    const w = el('div', 'panel');
    w.innerHTML = `<span class="eyebrow">Readiness weights</span>
      <p class="small muted" style="margin-top:6px">Weights are relative; they are normalised automatically.</p>`;
    Object.keys(set.weights).forEach((test) => {
      const grp = el('div');
      grp.innerHTML = `<div class="eyebrow" style="margin:12px 0 6px">${test.toUpperCase()}</div>`;
      Object.keys(set.weights[test]).forEach((k) => {
        const lab = el('label', 'field');
        lab.innerHTML = `<span>${k}</span><input type="number" min="0" max="100" value="${set.weights[test][k]}">`;
        $('input', lab).onchange = (e) => { set.weights[test][k] = Math.max(0, +e.target.value || 0); S.save(); toast('Weights updated.'); };
        grp.appendChild(lab);
      });
      w.appendChild(grp);
    });
    root.appendChild(w);

    const i = el('div', 'panel');
    i.innerHTML = `<span class="eyebrow">IMC mock configuration</span>
      <p class="small muted" style="margin-top:6px">Edit the JSON below and save once you know the real structure. Topics must match topic names used by the bank.</p>
      <textarea id="imc-json">${esc(JSON.stringify(set.imc, null, 2))}</textarea>`;
    const ib = el('button', 'btn full', 'Save IMC configuration');
    ib.onclick = () => {
      try {
        const obj = JSON.parse($('#imc-json').value);
        if (!obj.sections || !Array.isArray(obj.sections)) throw new Error('sections missing');
        set.imc = obj; S.save(); toast('IMC configuration saved.');
      } catch (e) { toast('Invalid JSON: ' + e.message); }
    };
    i.appendChild(ib);
    root.appendChild(i);

    const sg = el('div', 'panel');
    sg.innerHTML = `<span class="eyebrow">SIG mock</span>
      <label class="field"><span>Total minutes</span><input type="number" id="sig-min" value="${set.sigMinutes}" min="1" max="120"></label>`;
    $('#sig-min', sg).onchange = (e) => { set.sigMinutes = Math.max(1, +e.target.value || 23); S.save(); toast('Saved.'); };
    root.appendChild(sg);

    const d = el('div', 'panel');
    d.innerHTML = '<span class="eyebrow">Data</span>';
    const row = el('div', 'btn-row');
    row.style.marginTop = '8px';
    const dl = (name, text, type) => {
      const blob = new Blob([text], { type });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };
    const bj = el('button', 'btn', 'Export progress (JSON)');
    bj.onclick = () => dl('quant-test-lab-progress.json', S.exportJSON(), 'application/json');
    const bc = el('button', 'btn', 'Export attempts (CSV)');
    bc.onclick = () => dl('quant-test-lab-attempts.csv', S.exportCSV(), 'text/csv');
    const bi = el('button', 'btn', 'Import progress (JSON)');
    bi.onclick = () => $('#import-file').click();
    const br = el('button', 'btn ghost', 'Reset all data');
    br.onclick = () => {
      if (confirm('Delete all stored progress? This cannot be undone.')) { S.reset(); toast('All data cleared.'); render(); }
    };
    [bj, bc, bi, br].forEach((b) => row.appendChild(b));
    d.appendChild(row);
    const inp = el('input');
    inp.type = 'file'; inp.id = 'import-file'; inp.accept = '.json,application/json'; inp.style.display = 'none';
    inp.onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try { S.importJSON(r.result); toast('Progress imported.'); render(); }
        catch (err) { toast('Import failed: ' + err.message); }
      };
      r.readAsText(f);
    };
    d.appendChild(inp);
    root.appendChild(d);

    const about = el('div', 'panel small muted');
    about.innerHTML = `<span class="eyebrow">About</span>
      <p style="margin-top:8px">Quant Test Lab runs entirely in your browser. All progress is stored in localStorage on this device,
      so exporting the JSON periodically is the only backup. No network requests are made after the first load.</p>
      <p>${S.allGenerators().length} generators · ${S.curated().length} curated questions · ${S.state.attempts.length} attempts recorded.</p>`;
    root.appendChild(about);
  }

  /* ================================= SHELL ================================= */

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', cur);
    S.state.settings.theme = cur; S.save();
  }

  function go(view) {
    if (session && view !== 'runner') { session = null; stopTick(); }
    current = view;
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    const main = $('#main');
    main.innerHTML = '';
    const view = session ? 'runner' : current;

    if (view !== 'runner') {
      const meta = VIEWS.find((v) => v.id === view);
      if (meta) {
        const h = el('div');
        h.style.margin = '2px 0 12px';
        h.innerHTML = `<h1>${esc(meta.title)}</h1>`;
        main.appendChild(h);
      }
    }

    ({
      runner: viewRunner, dashboard: viewDashboard, learn: viewLearn, drill: viewDrill,
      pattern: viewPattern, mixed: viewMixed, mocks: viewMocks, mockreport: viewMockReport,
      mistakes: viewMistakes, sheet: viewSheet, stats: viewStats, settings: viewSettings
    }[view] || viewDashboard)(main);

    document.querySelectorAll('[data-nav]').forEach((b) => {
      b.classList.toggle('active', b.dataset.nav === current);
    });
    if (view !== 'runner' && view !== 'pattern') stopTick();
  }

  function buildNav() {
    const tab = $('#tabbar'), side = $('#sidenav');
    VIEWS.forEach((v, i) => {
      const a = el('button', '', v.label);
      a.dataset.nav = v.id;
      a.onclick = () => go(v.id);
      tab.appendChild(a);
      const b = el('button', '', `<span class="k">${i + 1 === 10 ? '0' : i + 1}</span>${v.title}`);
      b.dataset.nav = v.id;
      b.onclick = () => go(v.id);
      side.appendChild(b);
    });
  }

  function keys(e) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) {
      if (e.key === 'Escape') e.target.blur();
      return;
    }
    if (e.key >= '1' && e.key <= '9' || e.key === '0') {
      if (session) {
        // answer MC by number
        const q = session.items[session.idx];
        if (q && q.answerType === 'mc' && !session.records[session.idx]) {
          const i = (e.key === '0' ? 10 : +e.key) - 1;
          if (q.options[i]) return submitAnswer(q.options[i]);
        }
        return;
      }
      const i = (e.key === '0' ? 10 : +e.key) - 1;
      if (VIEWS[i]) go(VIEWS[i].id);
      return;
    }
    const k = e.key.toLowerCase();
    if (session) {
      if (k === 'n') {
        if (session.records[session.idx]) (session.idx >= session.items.length - 1 ? finishAndRecord() : nextQuestion());
      } else if (k === 'h' && session.cfg.allowHelp) {
        const b = Array.from(document.querySelectorAll('.btn')).find((x) => x.textContent.trim() === 'Hint');
        if (b && !b.disabled) b.click();
      } else if (k === 'f') {
        session.flags[session.idx] = !session.flags[session.idx]; render();
      }
    } else if (patternState.run && k === 'n') nextPattern();
    if (k === 't') toggleTheme();
  }

  function buildTrackSelect() {
    const sel = $('#track-select');
    if (!sel) return;
    sel.innerHTML = S.tracks().map((t) => `<option value="${esc(t.id)}">${esc(t.label)}</option>`).join('');
    sel.value = S.activeTrack();
    sel.onchange = () => {
      S.setTrack(sel.value);
      drillState.topic = ''; drillState.subtopic = '';
      go('dashboard');
      toast('Track: ' + S.tracks().find((t) => t.id === sel.value).label);
    };
  }

  function init() {
    document.documentElement.setAttribute('data-theme', S.state.settings.theme || 'dark');
    buildNav();
    buildTrackSelect();
    $('#theme-btn').onclick = toggleTheme;
    document.addEventListener('keydown', keys);
    window.addEventListener('beforeunload', () => S.save());
    go('dashboard');
  }

  document.addEventListener('DOMContentLoaded', init);
  global.QTL_APP = { go, render, startSession };
})(window);
