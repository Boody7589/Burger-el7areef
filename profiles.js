// ===== profiles.js: تسجيل اللاعبين وقايمة اللاعبين =====

// لو عايز تستقبل تسجيلات اللاعبين أونلاين، حط هنا رابط (مثلاً Google Apps Script أو Webhook).
// لو سيبته فاضي: البيانات بتتحفظ على جهاز اللاعب بس.
const REGISTRATION_URL = "";

const PROFILES_KEY = "burgerLegacyProfiles";
const CURRENT_KEY = "burgerLegacyCurrent";
const OLD_SAVE_KEY = "burgerLegacySave";
const PROFILES_PER_PAGE = 6;

let profiles = [];

function loadProfiles() {
  try {
    const d = JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]");
    profiles = Array.isArray(d) ? d : [];
    const cur = localStorage.getItem(CURRENT_KEY);
    const found = profiles.filter(function (p) { return p.id === cur; })[0];
    game.profile = found || null;
  } catch (e) {
    profiles = [];
    game.profile = null;
  }
}

function saveProfiles() {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    // مش مشكلة لو التخزين مش شغال
  }
}

// كل لاعب ليه مكان حفظ لوحده
function saveKey() {
  return "burgerLegacySave_" + (game.profile ? game.profile.id : "guest");
}

function setCurrentProfile(p) {
  game.profile = p;
  try {
    localStorage.setItem(CURRENT_KEY, p ? p.id : "");
  } catch (e) {
    // مش مشكلة
  }
}

function selectProfile(id) {
  const p = profiles.filter(function (x) { return x.id === id; })[0];
  if (!p) {
    return;
  }
  setCurrentProfile(p);
  p.lastPlayed = Date.now();
  saveProfiles();
  game.started = false;
  game.confirmNew = false;
  game.xp = p.xp || 0;
  game.level = levelFromXp(game.xp);
  refreshSaveInfo();
  game.scene = "menu";
}

// ---------- الإرسال للسيرفر (اختياري) ----------

function trySync(p) {
  if (!REGISTRATION_URL || typeof fetch !== "function" || (typeof navigator !== "undefined" && navigator.onLine === false)) {
    return;
  }
  try {
    fetch(REGISTRATION_URL, {
      method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ game: "burger-el-harif", id: p.id, name: p.name, city: p.city, contact: p.contact, created: p.created })
    }).then(function () {
      p.synced = true;
      saveProfiles();
    }).catch(function () {});
  } catch (e) {
    // هيحاول تاني المرة الجاية
  }
}

function syncPending() {
  profiles.forEach(function (p) {
    if (!p.synced) {
      trySync(p);
    }
  });
}

function exportProfiles() {
  try {
    const blob = new Blob([JSON.stringify(profiles, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "burger-players.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    showMessage("اتصدّر ملف اللاعبين", "#8fdc5a");
  } catch (e) {
    showMessage("مقدرتش أصدّر الملف", "#ff7a70");
  }
}

// ---------- التسجيل ----------

const REG_FIELDS = [
  { key: "name", y: 224, label: "الاسم (إجباري)", ph: "اكتب اسمك", max: 20 },
  { key: "city", y: 294, label: "المدينة (اختياري)", ph: "مثلاً: القاهرة", max: 30 },
  { key: "contact", y: 364, label: "الإيميل أو الموبايل (اختياري)", ph: "عشان نتواصل معاك", max: 40 }
];
const regInputs = {};
let regInputsVisible = false;

function emptyRegForm() {
  return { name: "", city: "", contact: "", avatar: 0 };
}

function openRegister() {
  game.regForm = emptyRegForm();
  game.regError = "";
  game.scene = "register";
}

function ensureRegInputs() {
  if (typeof document.createElement !== "function" || regInputs.name) {
    return;
  }
  REG_FIELDS.forEach(function (f) {
    const el = document.createElement("input");
    el.type = "text";
    el.maxLength = f.max;
    el.placeholder = f.ph;
    el.dir = "rtl";
    el.autocomplete = "off";
    el.style.cssText = "position:fixed;display:none;z-index:20;box-sizing:border-box;padding:0 14px;border:3px solid #c97a30;" +
      "border-radius:12px;background:#fff3df;color:#2b1d14;font-family:Cairo,Arial,sans-serif;font-weight:700;outline:none;";
    el.addEventListener("input", function () {
      game.regForm[f.key] = el.value;
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        submitRegistration();
      }
    });
    document.body.appendChild(el);
    regInputs[f.key] = el;
  });
}

function layoutRegInputs() {
  const rect = canvas.getBoundingClientRect();
  const sx = rect.width / 1280;
  REG_FIELDS.forEach(function (f) {
    const el = regInputs[f.key];
    if (!el) {
      return;
    }
    el.style.left = rect.left + 380 * sx + "px";
    el.style.top = rect.top + f.y * sx + "px";
    el.style.width = 520 * sx + "px";
    el.style.height = 46 * sx + "px";
    el.style.fontSize = 20 * sx + "px";
    el.style.display = "block";
    if (document.activeElement !== el && el.value !== game.regForm[f.key]) {
      el.value = game.regForm[f.key];
    }
  });
  regInputsVisible = true;
}

// بيتنادى كل فريم: بيظهر المدخلات في التسجيل بس
function syncRegInputs() {
  if (game.scene === "register") {
    ensureRegInputs();
    if (typeof canvas.getBoundingClientRect === "function") {
      layoutRegInputs();
    }
  } else if (regInputsVisible) {
    REG_FIELDS.forEach(function (f) {
      if (regInputs[f.key]) {
        regInputs[f.key].style.display = "none";
      }
    });
    regInputsVisible = false;
  }
}

function submitRegistration() {
  const f = game.regForm;
  const name = f.name.trim();
  if (name.length < 2) {
    game.regError = "اكتب اسمك (حرفين على الأقل)";
    playSound("buzz");
    return;
  }
  if (profiles.some(function (p) { return p.name.toLowerCase() === name.toLowerCase(); })) {
    game.regError = "الاسم ده مسجل قبل كده، اختار اسم تاني";
    playSound("buzz");
    return;
  }
  const isFirst = profiles.length === 0;
  const p = {
    id: "p" + Date.now().toString(36) + Math.floor(Math.random() * 1000), name: name, city: f.city.trim(), contact: f.contact.trim(),
    avatar: f.avatar, created: Date.now(), lastPlayed: Date.now(), level: 1, xp: 0, tutorialDone: false, synced: false
  };
  profiles.push(p);
  saveProfiles();
  setCurrentProfile(p);
  // لو فيه لعبة قديمة (قبل التسجيل) بنربطها بأول لاعب
  game.menuNote = "";
  try {
    const old = localStorage.getItem(OLD_SAVE_KEY);
    if (isFirst && old) {
      localStorage.setItem(saveKey(), old);
      game.menuNote = "لقينا لعبتك القديمة وربطناها بحسابك";
    }
  } catch (e) {
    // مش مشكلة
  }
  trySync(p);
  game.started = false;
  game.xp = 0;
  game.level = 1;
  refreshSaveInfo();
  game.regForm = emptyRegForm();
  playSound("start");
  startTutorial(true);
}

function drawRegisterScene() {
  drawPanelBackground();
  withShadow(24, 10, "rgba(0,0,0,0.5)", function () {
    outlinedRound(300, 60, 680, 650, 26, "rgba(30,18,10,0.86)", 3, "rgba(242,177,52,0.75)");
  });
  drawText("أهلاً بيك في برجر الحريف!", 640, 108, 30, "#f2b134");
  drawText("سجّل بياناتك عشان نحفظ تقدمك", 640, 144, 18, "#e8d3b0");
  REG_FIELDS.forEach(function (f) {
    drawText(f.label, 900, f.y - 8, 16, "#fff3df", "right");
  });
  drawText("اختار شخصيتك", 900, 446, 18, "#fff3df", "right");
  for (let i = 0; i < CHARACTERS.length; i++) {
    const p = regAvatarPos(i);
    const sel = game.regForm.avatar === i;
    if (sel) {
      drawEllipse(p.x, p.y, 36, 36, "rgba(242,177,52,0.35)");
    }
    drawAvatar(CHARACTERS[i], p.x, p.y, sel ? 31 : 27);
    if (game.hover === "avatar-" + i) {
      ctx.strokeStyle = "#fff3df";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 33, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  if (game.regError) {
    drawText(game.regError, 640, 618, 17, "#ff7a70");
  }
  drawText("بياناتك بتتحفظ على جهازك، وممكن تتبعت لصانع اللعبة لما يكون فيه إنترنت", 640, 702, 13, "#8a6d55");
  drawHotspotButtons();
  drawVignette(0);
}

function regAvatarPos(i) {
  if (i < 7) {
    return { x: 640 + (i - 3) * 76, y: 496 };
  }
  return { x: 640 + (i - 7 - 2.5) * 76, y: 568 };
}

SCENE_DRAW.register = drawRegisterScene;
SCENE_HOTSPOTS.register = function () {
  const list = [];
  for (let i = 0; i < CHARACTERS.length; i++) {
    const p = regAvatarPos(i);
    list.push({
      name: "avatar-" + i, box: { x: p.x - 34, y: p.y - 34, w: 68, h: 68 },
      action: (function (k) { return function () { game.regForm.avatar = k; playSound("pop"); }; })(i)
    });
  }
  list.push({
    name: "reg-submit", box: { x: 480, y: 630, w: 320, h: 52 }, label: "سجّل وابدأ", size: 23,
    color: "#f2b134", textColor: "#2b1d14", action: submitRegistration
  });
  if (profiles.length > 0) {
    list.push({
      name: "reg-back", box: { x: 330, y: 636, w: 120, h: 42 }, label: "رجوع", size: 17,
      color: "#6b7580", textColor: "#fff3df", action: function () { game.scene = "players"; }
    });
  }
  return list;
};

// ---------- قايمة اللاعبين ----------

function openPlayers() {
  game.playersPage = 0;
  game.confirmProfileDelete = "";
  game.scene = "players";
}

function deleteProfile(id) {
  if (game.confirmProfileDelete !== id) {
    game.confirmProfileDelete = id;
    return;
  }
  game.confirmProfileDelete = "";
  try {
    localStorage.removeItem("burgerLegacySave_" + id);
  } catch (e) {
    // مش مشكلة
  }
  profiles = profiles.filter(function (p) { return p.id !== id; });
  saveProfiles();
  if (game.profile && game.profile.id === id) {
    setCurrentProfile(null);
    game.started = false;
  }
  if (profiles.length === 0) {
    openRegister();
  }
}

function playerCardBox(i) {
  const col = i % 2;
  const row = Math.floor(i / 2);
  return { x: col === 0 ? 650 : 270, y: 168 + row * 124, w: 360, h: 112 };
}

function drawPlayersScene() {
  drawPanelBackground();
  withShadow(24, 10, "rgba(0,0,0,0.5)", function () {
    outlinedRound(240, 60, 800, 650, 26, "rgba(30,18,10,0.86)", 3, "rgba(242,177,52,0.75)");
  });
  drawText("اللاعبين على الجهاز", 640, 108, 30, "#f2b134");
  drawText("عدد المسجلين: " + profiles.length, 640, 144, 18, "#e8d3b0");
  const start = (game.playersPage || 0) * PROFILES_PER_PAGE;
  const page = profiles.slice(start, start + PROFILES_PER_PAGE);
  for (let i = 0; i < page.length; i++) {
    const p = page[i];
    const b = playerCardBox(i);
    const isCur = game.profile && game.profile.id === p.id;
    const hot = game.hover === "player-" + p.id;
    outlinedRound(b.x, b.y, b.w, b.h, 16, hot ? "rgba(255,243,223,0.2)" : "rgba(255,243,223,0.1)", 3, isCur ? "#8fdc5a" : "rgba(242,177,52,0.4)");
    drawAvatar(CHARACTERS[p.avatar % CHARACTERS.length], b.x + b.w - 56, b.y + 56, 38);
    drawText(p.name, b.x + b.w - 108, b.y + 40, 22, "#fff3df", "right");
    drawText("Lv " + levelFromXp(p.xp || 0) + (p.city ? " - " + p.city : ""), b.x + b.w - 108, b.y + 68, 15, "#ffd36b", "right");
    drawText("آخر لعب: " + new Date(p.lastPlayed).toLocaleDateString("ar-EG"), b.x + b.w - 108, b.y + 92, 13, "#bfe3f2", "right");
    if (isCur) {
      drawText("الحالي", b.x + 70, b.y + 40, 15, "#8fdc5a");
    }
  }
  if (profiles.length > PROFILES_PER_PAGE) {
    drawText("صفحة " + ((game.playersPage || 0) + 1) + " / " + Math.ceil(profiles.length / PROFILES_PER_PAGE), 640, 560, 15, "#bfe3f2");
  }
  drawText("دوس على اللاعب عشان تلعب بيه", 640, 592, 15, "#8a6d55");
  drawHotspotButtons();
  drawVignette(0);
  drawMessage();
}

SCENE_DRAW.players = drawPlayersScene;
SCENE_HOTSPOTS.players = function () {
  const list = [];
  const start = (game.playersPage || 0) * PROFILES_PER_PAGE;
  const page = profiles.slice(start, start + PROFILES_PER_PAGE);
  page.forEach(function (p, i) {
    const b = playerCardBox(i);
    list.push({ name: "player-" + p.id, box: b, action: function () { selectProfile(p.id); playSound("start"); } });
    const del = game.confirmProfileDelete === p.id;
    list.push({
      name: "pdel-" + p.id, box: { x: b.x + 8, y: b.y + 66, w: del ? 100 : 36, h: 30 }, label: del ? "متأكد؟" : "×", size: 15,
      color: "#d62f2a", textColor: "#fff3df", action: (function (id) { return function () { deleteProfile(id); }; })(p.id)
    });
  });
  if (profiles.length > PROFILES_PER_PAGE) {
    const pages = Math.ceil(profiles.length / PROFILES_PER_PAGE);
    if ((game.playersPage || 0) < pages - 1) {
      list.push({ name: "pl-next", box: { x: 520, y: 542, w: 90, h: 34 }, label: "التالي", size: 15, color: "#6b7580", textColor: "#fff3df", action: function () { game.playersPage++; } });
    }
    if ((game.playersPage || 0) > 0) {
      list.push({ name: "pl-prev", box: { x: 670, y: 542, w: 90, h: 34 }, label: "السابق", size: 15, color: "#6b7580", textColor: "#fff3df", action: function () { game.playersPage--; } });
    }
  }
  list.push({
    name: "pl-new", box: { x: 290, y: 624, w: 220, h: 50 }, label: "لاعب جديد", size: 20,
    color: "#5aa335", textColor: "#10260a", action: openRegister
  });
  list.push({
    name: "pl-export", box: { x: 530, y: 624, w: 260, h: 50 }, label: "تصدير بيانات اللاعبين", size: 17,
    color: "#3d6fbf", textColor: "#fff3df", action: exportProfiles
  });
  if (game.profile) {
    list.push({
      name: "pl-back", box: { x: 810, y: 624, w: 190, h: 50 }, label: "رجوع", size: 20,
      color: "#d62f2a", textColor: "#fff3df", action: function () { game.scene = "menu"; }
    });
  }
  return list;
};
