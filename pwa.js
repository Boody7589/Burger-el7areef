// ===== pwa.js: تثبيت اللعبة على الجهاز واللعب أوفلاين =====

let deferredInstall = null;

if (typeof window !== "undefined" && window.addEventListener) {
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredInstall = e;
  });
  window.addEventListener("appinstalled", function () {
    deferredInstall = null;
  });
}

function canInstall() {
  return deferredInstall !== null;
}

function installApp() {
  if (deferredInstall === null) {
    return;
  }
  deferredInstall.prompt();
  deferredInstall.userChoice.then(function () {
    deferredInstall = null;
  });
}

// الـ Service Worker بيحفظ ملفات اللعبة عشان تشتغل من غير نت (بيشتغل على http/https بس)
if (typeof navigator !== "undefined" && "serviceWorker" in navigator && typeof location !== "undefined" && location.protocol.indexOf("http") === 0) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  });
}
