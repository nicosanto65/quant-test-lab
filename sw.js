/* Quant Test Lab — offline cache.
   Network-first so edits to the question bank appear immediately,
   with a cache fallback so the app still opens with no connection. */
const CACHE = 'qtl-v1';
const ASSETS = [
  './', './index.html', './css/styles.css',
  './js/util.js', './js/gen-prob.js', './js/gen-applied.js', './js/bank.js',
  './js/lessons.js', './js/formulas.js', './js/store.js', './js/app.js'
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
