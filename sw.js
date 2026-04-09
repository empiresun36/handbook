/* ══════════════════════════════════════
   Service Worker - 社區管理規劃手冊 PWA
   讓網站可以離線瀏覽（快取所有頁面）
══════════════════════════════════════ */

const CACHE_NAME = 'handbook-v1';

/* 預先快取的檔案清單 */
const PRECACHE_URLS = [
  './index.html',
  './ch01-rules.html',
  './ch02-committee.html',
  './ch03-residents.html',
  './ch04-property.html',
  './ch05-cleaning.html',
  './contact.html',
  './shared.css',
  './shared.js',
  './manifest.json'
];

/* 安裝：預先快取所有頁面 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

/* 啟用：清除舊版快取 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* 攔截請求：優先用快取，失敗再連網 */
self.addEventListener('fetch', event => {
  /* 音樂串流不快取，直接連網 */
  if (event.request.url.includes('pixabay.com') ||
      event.request.url.includes('cdn.')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        /* 只快取成功的 GET 請求 */
        if (!response || response.status !== 200 || event.request.method !== 'GET') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
