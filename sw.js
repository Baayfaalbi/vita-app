const CACHE_NAME = 'vita-v1';

const FICHIERS = [
  '.',
  'index.html',
  'manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FICHIERS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(function(response) {
      var copie = response.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(event.request, copie);
      });
      return response;
    }).catch(function() {
      return caches.match(event.request).then(function(reponse) {
        return reponse || caches.match('.');
      });
    })
  );
});