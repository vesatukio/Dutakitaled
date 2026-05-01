const CACHE_NAME = "dtled-v4";

const FILES_TO_CACHE = [
  "./",
  "./index.html"
];

/* INSTALL */
self.addEventListener("install", e => {
  self.skipWaiting(); // langsung aktif

  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

/* ACTIVATE (BERSIHIN CACHE LAMA) */
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

/* FETCH (PAKSA UPDATE DARI SERVER DULU) */
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, clone);
        });

        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
