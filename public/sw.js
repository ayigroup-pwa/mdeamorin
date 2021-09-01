
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});



/*

Lento - app (poteción)           - conectividad - nube
Rapid - appCache - Browser Cache -              - Nube Cache

appCache - Browser Cache- Service Cache -              - Nube Cache

cache:
key: 'value',
1: ../../../foto.jpg

*/
