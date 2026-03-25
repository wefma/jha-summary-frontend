const CACHE_VERSION = "__GIT_COMMIT_HASH__";
const CACHE_NAME = `jha-summary-${CACHE_VERSION}`;
const API_CACHE_NAME = `jha-summary-api-${CACHE_VERSION}`;
const SCORES_API_URL = "__SCORES_API_URL__";
const API_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const API_REFRESH_SYNC_TAG = `jha-summary-api-refresh-${CACHE_VERSION}`;
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

function createEmptyApiResponse() {
  return new Response(JSON.stringify({ jha_summary: {} }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

async function refreshApiCache(cache, request = SCORES_API_URL) {
  const networkResponse = await fetch(request);

  if (!networkResponse || networkResponse.status !== 200) {
    throw new Error("Failed to refresh API cache");
  }

  const responseToCache = await createCacheableResponse(networkResponse.clone());
  await cache.put(request, responseToCache);

  return networkResponse;
}

async function scheduleApiRefresh() {
  if (!self.registration.sync) {
    return;
  }

  try {
    if (typeof self.registration.sync.getTags === "function") {
      const tags = await self.registration.sync.getTags();

      if (tags.includes(API_REFRESH_SYNC_TAG)) {
        return;
      }
    }

    await self.registration.sync.register(API_REFRESH_SYNC_TAG);
  } catch {
    // Background Sync is best-effort; the next fetch will retry as well.
  }
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

self.addEventListener("sync", (event) => {
  if (event.tag !== API_REFRESH_SYNC_TAG) {
    return;
  }

  event.waitUntil(
    caches
      .open(API_CACHE_NAME)
      .then((cache) => refreshApiCache(cache))
      .catch(() => undefined),
  );
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
          return await refreshApiCache(cache, request);
        } catch {
          event.waitUntil(scheduleApiRefresh());
          return cachedResponse || createEmptyApiResponse();
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
