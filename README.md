# Quant Test Lab

Offline practice environment for quantitative trading / research assessments (Wincent-style, SIG-style, IMC-style) plus a separate section of original exercises analogous to the skills tested by McKinsey Solve.

Static HTML/CSS/JS. No backend, no build step, no external API. All progress lives in `localStorage` on the device.

---

## 1. Folder / file structure

```
quant-test-lab/
├── index.html            entry point, loads everything in order
├── sw.js                 optional service worker (offline cache)
├── README.md
├── css/
│   └── styles.css        dark-first terminal styling, mobile-first
└── js/
    ├── util.js           seeded RNG, exact fractions, nCr/nPr, formatting
    ├── gen-prob.js       parameterised generators: probability curriculum
    ├── gen-applied.js    generators: mental maths, finance, exhibits, logic, market making
    ├── bank.js           60 curated hard questions + the add-question API
    ├── lessons.js        Learn-mode content (units A–P)
    ├── formulas.js       formula / technique sheet
    ├── store.js          localStorage state, analytics, SRS, question engine
    └── app.js            router, session runner, all ten views
```

Load order matters: `util.js` first, `app.js` last. If you add a file, put it before `store.js` if it defines questions, and register it in `index.html`.

## 2. Run locally

Opening `index.html` directly with a double-click works for everything except the service worker. To get the offline cache too, serve it:

```bash
cd quant-test-lab
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static server works (`npx serve`, VS Code Live Server, etc.).

## 3. Open on a phone

**Same network:** start the server above, find your computer's LAN IP (`ipconfig getifaddr en0` on macOS, `hostname -I` on Linux) and open `http://<that-ip>:8080` on the phone.

**Anywhere:** deploy to GitHub Pages (below) and open the URL. On iOS, Share → *Add to Home Screen*; on Android, menu → *Install app*. It then launches full screen and works with no connection.

## 4. Deploy free on GitHub Pages

```bash
cd quant-test-lab
git init
git add .
git commit -m "Quant Test Lab"
git branch -M main
git remote add origin https://github.com/<user>/quant-test-lab.git
git push -u origin main
```

Then in the repository: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**. The site appears at `https://<user>.github.io/quant-test-lab/` within a minute or two. All paths are relative, so no configuration is needed.

Progress is per-device. Use **Settings → Export progress (JSON)** before switching devices and **Import progress** on the new one.

## 5. Where the question bank lives

Two sources, both used automatically by every mode:

| Source | File | What it is |
|---|---|---|
| Curated | `js/bank.js` | 60 fixed hard problems, stable ids (`h001`…), eligible for spaced repetition |
| Generated | `js/gen-prob.js`, `js/gen-applied.js` | 82 parameterised templates that build a fresh, exactly-solved instance on demand |

Generators use a seeded RNG and controlled parameter ranges, so every instance has a deterministic, verified answer and sensible numbers — never random noise.

## 6. Adding new questions

**A single question** — append to the array in `js/bank.js`, or from any file loaded after it:

```js
QTL_BANK.add({
  id: 'h061',                         // must be unique and stable
  topic: 'Expected Value',
  subtopic: 'Linearity',
  difficulty: 4,                      // 1–5
  prompt: 'Question text. HTML is allowed — use <table class="qtable"> for exhibits.',
  answerType: 'numeric',              // 'numeric' or 'mc'
  options: [],                        // required only for 'mc'
  correctAnswer: 12.5,                // number for numeric, exact option string for mc
  tolerance: 0.01,
  hint: 'Smallest useful push.',
  approach: 'Names the technique and the setup, without the answer.',
  solution: 'Rigorous step-by-step.',
  altSolution: 'Optional faster route.',
  recognitionTechnique: 'Linearity of expectation',   // must match a name in QTL_STORE.TECHNIQUES
  commonTrap: 'What people get wrong.',
  targetTime: 150,                    // seconds
  tags: ['linearity']
});
```

**A batch pasted from an AI** — `QTL_BANK.addMany([ {...}, {...} ])`. Ask for exactly the field names above; anything missing just renders as blank rather than breaking.

Numeric answers accept decimals, fractions (`1/4`), and the percentage form of a probability, so you do not need to guess the format the answer will be typed in.

**A new generator** — push onto the array in either generator file:

```js
add({
  id: 'e_myproblem', topic: 'Expected Value', subtopic: 'Indicators',
  difficulty: 3, targetTime: 120,
  build(r) {                          // r is the seeded RNG: r.int(a,b), r.pick(arr), r.shuffle(arr)
    const n = r.int(4, 9);
    return { prompt: `…${n}…`, answerType: 'numeric', correctAnswer: n / 2,
             tolerance: 0.01, hint: '…', approach: '…', solution: '…',
             recognitionTechnique: 'Indicator variables', commonTrap: '…' };
  }
});
```

Keep the answer computed from the same parameters used in the prompt — that is what guarantees correctness. New topics appear in the Drill selector automatically.

## 7. Changing the IMC configuration

The IMC mock is defined by one object. Two ways to edit it:

- **In the app:** Settings → *IMC mock configuration* → edit the JSON → Save. Stored with your progress.
- **In the source:** `js/store.js`, `DEFAULTS.settings.imc`:

```js
imc: {
  label: 'IMC — provisional configuration',
  totalMinutes: 20,
  sections: [
    { name: 'Numerical reasoning', topics: ['Mental Maths', 'Data Interpretation'], count: 8, seconds: 45 },
    { name: 'Sequences and logic', topics: ['Logic'], count: 6, seconds: 60 }
    // …add or replace sections once the official structure is known
  ]
}
```

`topics` entries must match topic names in the bank (see the list in the Drill selector). Editing the source resets anyone who has not already saved a custom config; editing in Settings only affects your own device.

---

### Notes

- Readiness scores are internal progress metrics computed from your own history, with configurable weights in Settings. They are not predictions of any employer's assessment.
- The McKinsey section contains original exercises written to train analogous skills. It does not reproduce or imitate proprietary assessment content.
- The formula sheet is a preparation aid, not something to have open during a real assessment.
