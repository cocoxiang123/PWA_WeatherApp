const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

//Install SW
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});
//Listen for requests
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(() => {
      return fetch(e.request).catch(() => caches.match("offline.html"));
    })
  );
});

//Activate the SW
self.addEventListener("active", (e) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);
  e.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

//install banner
const fireAddToHomeScreenImpression = (event) => {
  fireTracking("Add to homescreen shown");
  //will not work for chrome, untill fixed
  event.userChoice.then((choiceResult) => {
    fireTracking(`User clicked ${choiceResult}`);
  });

  //This is to prevent `beforeinstallprompt` event that triggers again on `Add` or `Cancel` click
  self.removeEventListener(
    "beforeinstallprompt",
    fireAddToHomeScreenImpression
  );
};
self.addEventListener("beforeinstallprompt", fireAddToHomeScreenImpression);

//Track web app install by user
self.addEventListener("appinstalled", (event) => {
  fireTracking("PWA app installed by user!!! Hurray");
});
