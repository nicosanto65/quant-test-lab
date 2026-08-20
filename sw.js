/* Quant Test Lab — offline cache.
   Network-first so edits to the question bank appear immediately,
   with a cache fallback so the app still opens with no connection. */
const CACHE = 'qtl-v3';
// KaTeX ships one .woff2 per math font family — listed by name rather than by hand so
// adding/removing a family later is a one-line change here, not a silent cache miss.
const KATEX_FONTS = [
  'KaTeX_AMS-Regular', 'KaTeX_Caligraphic-Bold', 'KaTeX_Caligraphic-Regular',
  'KaTeX_Fraktur-Bold', 'KaTeX_Fraktur-Regular', 'KaTeX_Main-Bold', 'KaTeX_Main-BoldItalic',
  'KaTeX_Main-Italic', 'KaTeX_Main-Regular', 'KaTeX_Math-BoldItalic', 'KaTeX_Math-Italic',
  'KaTeX_SansSerif-Bold', 'KaTeX_SansSerif-Italic', 'KaTeX_SansSerif-Regular',
  'KaTeX_Script-Regular', 'KaTeX_Size1-Regular', 'KaTeX_Size2-Regular', 'KaTeX_Size3-Regular',
  'KaTeX_Size4-Regular', 'KaTeX_Typewriter-Regular'
];
const ASSETS = [
  './', './index.html', './css/styles.css',
  './js/util.js', './js/gen-prob.js', './js/gen-applied.js', './js/bank.js',
  './js/lessons.js', './js/formulas.js', './js/store.js', './js/app.js',
  './fonts/inter-variable.woff2', './fonts/source-serif-4-variable.woff2',
  './vendor/katex/katex.min.css', './vendor/katex/katex.min.js',
  ...KATEX_FONTS.map((f) => `./vendor/katex/fonts/${f}.woff2`)
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
