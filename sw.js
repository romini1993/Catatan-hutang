// Tiap kali lu ganti icon atau update web, ganti angka versinya (misal dari v1124 jadi v1125)
const CACHE_NAME = 'hutang-pwa-v1125'; 
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  // Maksa service worker baru buat langsung aktif tanpa nunggu tab ditutup
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Langsung nge-take over control halaman web saat itu juga
  event.waitUntil(clients.claim()); 
  
  // Bersihin cache jadul biar web lu ga nyangkut di versi lama
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
