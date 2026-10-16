// Service Worker: بيخزن ملفات اللعبة عشان تتلعب أوفلاين
const CACHE = "burger-el-harif-v9";
const FILES = [
  "./", "index.html", "style.css", "manifest.webmanifest", "icon.ico", "icon-192.png", "icon-512.png",
  "images.js", "sound.js", "art.js", "characters.js", "kitchen.js", "bank.js", "scenes.js", "screens.js",
  "settings.js", "profiles.js", "tutorial.js", "laptop.js", "book.js", "sides.js", "game.js", "pwa.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) {
        return cached;
      }
      return fetch(e.request).then(function (res) {
        const copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); }).catch(function () {});
        return res;
      }).catch(function () { return caches.match("index.html"); });
    })
  );
});
