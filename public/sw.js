const CACHE_NAME = "jha-summary-v1";
const API_CACHE_NAME = "jha-summary-api-v1";
const SCORES_API_URL = "https://jha-summary-api-cors.wefma.net/jha-scores.json";
const API_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const PRECACHE_URLS = [
  "/",
  "/changelog",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/smartphone-icons/android/pwa-icons.png",
];

async function createCacheableResponse(response) {
  const body = await response.blob();
  const headers = new Headers(response.headers);
  headers.set("sw-fetched-at", String(Date.now()));

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isFreshApiCache(response) {
  const fetchedAt = Number(response.headers.get("sw-fetched-at"));

  if (!fetchedAt) {
    return false;
  }

  return Date.now() - fetchedAt < API_CACHE_TTL_MS;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![CACHE_NAME, API_CACHE_NAME].includes(key))
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  if (request.url === SCORES_API_URL) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        if (cachedResponse && isFreshApiCache(cachedResponse)) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);

          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = await createCacheableResponse(
            networkResponse.clone(),
          );
          await cache.put(request, responseToCache);

          return networkResponse;
        } catch {
          return cachedResponse || Response.error();
        }
      }),
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/") || Response.error()),
    );
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          event.waitUntil(cache.put(request, responseToCache));

          return networkResponse;
        });
      }),
    ),
  );
});
