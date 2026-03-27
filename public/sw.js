// BurZero Service Worker
// Bump CACHE_VERSION on each release to purge old caches
const CACHE_VERSION = "burzero-v1";

// On install: skip waiting so the new SW activates immediately
// without waiting for all browser tabs to close
self.addEventListener("install", () => {
  self.skipWaiting();
});

// On activate: delete stale caches and take control of all open clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// No fetch interception — all requests go to the network normally.
// Next.js handles chunk hashing and HTTP caching; this SW exists
// only to ensure the update lifecycle fires correctly on new deploys.
