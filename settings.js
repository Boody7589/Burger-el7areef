// ===== settings.js: الإعدادات + عن اللعبة + شاشة الخروج =====

const SETTINGS_KEY = "burgerLegacySettings";
const CREATOR_NAME = "Monsef Bayoumy";
const GAME_VERSION = "9";
const settings = { autoFullscreen: true, quality: "high" };

function loadSettings() {
  try {
    const d = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
    if (d) {
      settings.autoFullscreen = d.autoFullscreen !== false;
      settings.quality = d.quality === "low" ? "low" : "high";
      audioSettings.sfx = d.sfx !== false;
      audioSettings.music = d.music !== false;
      audioSettings.sfxVol = typeof d.sfxVol === "number" ? d.sfxVol : 0.8;
      audioSettings.musicVol = typeof d.musicVol === "number" ? d.musicVol : 0.6;
    }
  } catch (e) {
    // لو مفيش إعدادات محفوظة هنستخدم الافتراضي
  }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      autoFullscreen: settings.autoFullscreen, quality: settings.quality,
      sfx: audioSettings.sfx, music: audioSettings.music, sfxVol: audioSettings.sfxVol, musicVol: audioSettings.musicVol
    }));
  } catch (e) {
    // مش مشكلة لو التخزين مش شغال
  }
}

// ملء الشاشة (المتصفح بيسمح بيه بعد أول ضغطة بس)
function enterFullscreen() {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      const p = document.documentElement.requestFullscreen();
      if (p && p.catch) {
        p.catch(function () {});
      }
    }
  } catch (e) {
    // لو المتصفح رفض مفيش مشكلة
  }
}

function openSettings() {
  game.settingsReturn = game.scene;
  game.confirmDelete = false;
  game.scene = "settings";
}

function closeSettings() {
  saveSettings();
  game.confirmDelete = false;
  game.scene = game.settingsReturn || "menu";
}

function deleteProgress() {
  if (!game.confirmDelete) {
    game.confirmDelete = true;
    return;
  }
  game.confirmDelete = false;
  try {
    localStorage.removeItem(saveKey());
  } catch (e) {
    // مفيش حاجة تتمسح
  }
  game.started = false;
  game.xp = 0;
  game.level = 1;
  if (game.profile) {
    game.profile.level = 1;
    game.profile.xp = 0;
    saveProfiles();
  }
  refreshSaveInfo();
  showMessage("اتمسح تقدم اللاعب", "#ff7a70");
}

// الخروج من اللعبة: بيحفظ وبيقفل الصفحة لو المتصفح سمح
function exitGame() {
  if (game.started && !game.tut) {
    saveGame(false);
  }
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  } catch (e) {
    // مش مشكلة
  }
  game.scene = "bye";
  game.byeT = 0;
  setTimeout(function () {
    try {
      window.close();
    } catch (e) {
      // لو المتصفح منع القفل، الشاشة بتفضل ظاهرة
    }
  }, 1500);
}

// ---------- أدوات رسم ----------

function drawPanelBackground() {
  ctx.fillStyle = vGradient(0, 720, "#3d2312", "#150c07");
  ctx.fillRect(0, 0, 1280, 720);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + game.time * 0.04;
    ctx.fillStyle = "rgba(255,214,130,0.04)";
    ctx.beginPath();
    ctx.moveTo(640, 360);
    ctx.lineTo(640 + Math.cos(a - 0.1) * 1000, 360 + Math.sin(a - 0.1) * 1000);
    ctx.lineTo(640 + Math.cos(a + 0.1) * 1000, 360 + Math.sin(a + 0.1) * 1000);
    ctx.closePath();
    ctx.fill();
  }
  drawFloaters();
}

function drawSliderControl(box, value, on) {
  const cy = box.y + box.h / 2;
  fillRound(box.x, cy - 7, box.w, 14, 7, "#1a110b");
  fillRound(box.x, cy - 7, Math.max(14, box.w * value), 14, 7, on ? "#f2b134" : "#6b7580");
  strokeRound(box.x, cy - 7, box.w, 14, 7, "rgba(0,0,0,0.5)", 2);
  const kx = box.x + box.w * value;
  drawEllipse(kx, cy, 13, 13, "#fff3df");
  strokeRound(kx - 13, cy - 13, 26, 26, 13, "#3a2112", 3);
  drawText(Math.round(value * 100) + "%", box.x + box.w + 36, cy + 6, 16, "#fff3df");
}

// ---------- مشهد الإعدادات ----------

const SET_ROW = 150;
function setRowY(i) {
  return SET_ROW + i * 62;
}

function drawSettingsScene() {
  drawPanelBackground();
  withShadow(24, 10, "rgba(0,0,0,0.5)", function () {
    outlinedRound(260, 70, 760, 620, 26, "rgba(30,18,10,0.85)", 3, "rgba(242,177,52,0.75)");
  });
  fillRound(272, 82, 736, 44, 18, "rgba(242,177,52,0.18)");
  drawText("الإعدادات", 640, 114, 28, "#f2b134");

  const labels = ["المؤثرات الصوتية", "الموسيقى", "ملء الشاشة تلقائياً", "جودة الرسم", "التدريب", "اللاعب الحالي", "بيانات التقدم"];
  for (let i = 0; i < labels.length; i++) {
    const y = setRowY(i);
    fillRound(280, y - 8, 720, 54, 12, "rgba(255,243,223,0.06)");
    drawText(labels[i], 984, y + 28, 21, "#fff3df", "right");
  }
  drawSliderControl({ x: 300, y: setRowY(0), w: 380, h: 44 }, audioSettings.sfxVol, audioSettings.sfx);
  drawSliderControl({ x: 300, y: setRowY(1), w: 380, h: 44 }, audioSettings.musicVol, audioSettings.music);
  if (game.profile) {
    drawText(game.profile.name, 690, setRowY(5) + 28, 17, "#ffd36b", "right");
  }
  drawText("Monsef Bayoumy - صانع اللعبة", 640, 676, 14, "#8a6d55");
  drawHotspotButtons();
  drawVignette(0);
  drawMessage();
}

function toggleColor(on) {
  return { color: on ? "#5aa335" : "#6b7580", textColor: on ? "#10260a" : "#fff3df" };
}

SCENE_HOTSPOTS.settings = function () {
  const list = [];
  const t1 = toggleColor(audioSettings.sfx);
  list.push({
    name: "set-sfx", box: { x: 790, y: setRowY(0), w: 190, h: 44 }, label: audioSettings.sfx ? "شغالة" : "مقفولة", size: 18,
    color: t1.color, textColor: t1.textColor, action: function () { setSfxOn(!audioSettings.sfx); saveSettings(); }
  });
  list.push({
    name: "set-sfx-vol", box: { x: 300, y: setRowY(0), w: 380, h: 44 },
    slider: { get: function () { return audioSettings.sfxVol; }, set: function (v) { setSfxVolume(v); } }, action: function () { playSound("pop"); }
  });
  const t2 = toggleColor(audioSettings.music);
  list.push({
    name: "set-music", box: { x: 790, y: setRowY(1), w: 190, h: 44 }, label: audioSettings.music ? "شغالة" : "مقفولة", size: 18,
    color: t2.color, textColor: t2.textColor, action: function () { setMusicOn(!audioSettings.music); saveSettings(); }
  });
  list.push({
    name: "set-music-vol", box: { x: 300, y: setRowY(1), w: 380, h: 44 },
    slider: { get: function () { return audioSettings.musicVol; }, set: function (v) { setMusicVolume(v); } }, action: function () {}
  });
  const t3 = toggleColor(settings.autoFullscreen);
  list.push({
    name: "set-fs", box: { x: 790, y: setRowY(2), w: 190, h: 44 }, label: settings.autoFullscreen ? "شغال" : "مقفول", size: 18,
    color: t3.color, textColor: t3.textColor, action: function () { settings.autoFullscreen = !settings.autoFullscreen; saveSettings(); }
  });
  const t4 = toggleColor(settings.quality === "high");
  list.push({
    name: "set-quality", box: { x: 790, y: setRowY(3), w: 190, h: 44 }, label: settings.quality === "high" ? "عالية" : "منخفضة", size: 18,
    color: t4.color, textColor: t4.textColor, action: function () { settings.quality = settings.quality === "high" ? "low" : "high"; saveSettings(); }
  });
  list.push({
    name: "set-tut", box: { x: 700, y: setRowY(4), w: 280, h: 44 }, label: "ابدأ التدريب", size: 18,
    color: "#3d6fbf", textColor: "#fff3df", action: function () { saveSettings(); startTutorial(); }
  });
  list.push({
    name: "set-player", box: { x: 700, y: setRowY(5), w: 280, h: 44 }, label: "تغيير اللاعب", size: 18,
    color: "#3d6fbf", textColor: "#fff3df", action: function () { saveSettings(); openPlayers(); }
  });
  list.push({
    name: "set-delete", box: { x: 700, y: setRowY(6), w: 280, h: 44 }, label: game.confirmDelete ? "متأكد؟ هيمسح التقدم" : "امسح التقدم", size: 17,
    color: game.confirmDelete ? "#d62f2a" : "#6b4a32", textColor: "#fff3df", action: deleteProgress
  });
  list.push({
    name: "set-about", box: { x: 300, y: 610, w: 240, h: 50 }, label: "عن اللعبة", size: 20,
    color: "#f2b134", textColor: "#2b1d14", action: function () { game.scene = "about"; }
  });
  list.push({
    name: "set-back", box: { x: 740, y: 610, w: 240, h: 50 }, label: "رجوع", size: 20,
    color: "#d62f2a", textColor: "#fff3df", action: closeSettings
  });
  return list;
};
SCENE_DRAW.settings = drawSettingsScene;

// ---------- مشهد عن اللعبة ----------

function drawAboutScene() {
  drawPanelBackground();
  const bob = Math.sin(game.time * 1.8) * 6;
  if (imageReady("logo")) {
    withShadow(30, 12, "rgba(0,0,0,0.6)", function () {
      fillRound(120, 110 + bob, 400, 400, 48, "#2b1d14");
    });
    ctx.save();
    roundRectPath(120, 110 + bob, 400, 400, 48);
    ctx.clip();
    ctx.drawImage(IMAGES.logo, 120, 110 + bob, 400, 400);
    ctx.restore();
    strokeRound(120, 110 + bob, 400, 400, 48, "rgba(242,177,52,0.9)", 5);
  }
  withShadow(24, 10, "rgba(0,0,0,0.5)", function () {
    outlinedRound(580, 110, 580, 480, 26, "rgba(30,18,10,0.85)", 3, "rgba(242,177,52,0.75)");
  });
  drawText("عن اللعبة", 870, 158, 28, "#f2b134");
  drawText("برجر الحريف", 870, 214, 40, "#fff3df");
  drawText("لعبة إدارة مطعم برجر في قلب القاهرة", 870, 252, 18, "#e8d3b0");
  ctx.fillStyle = "rgba(242,177,52,0.5)";
  ctx.fillRect(660, 280, 420, 3);
  drawText("صانع اللعبة والمصمم", 870, 330, 20, "#bfe3f2");
  // الاسم بيلمع
  const glow = 0.6 + Math.sin(game.time * 3) * 0.4;
  withShadow(18 * glow, 0, "rgba(242,177,52,0.9)", function () {
    drawText(CREATOR_NAME, 870, 392, 46, "#f2b134");
  });
  for (let k = 0; k < 5; k++) {
    const a = game.time * 1.4 + k * 1.3;
    drawStar(870 + Math.cos(a) * (150 + k * 6), 380 + Math.sin(a * 1.3) * 34, 6 + (k % 2) * 3, "rgba(255,233,168," + (0.4 + 0.4 * Math.sin(a * 2)).toFixed(2) + ")");
  }
  drawText("الإصدار " + GAME_VERSION, 870, 460, 18, "#8fb3c4");
  drawText("شكراً إنك بتلعب! لو عجبتك اللعبة قول لصحابك", 870, 510, 16, "#ffd36b");
  drawHotspotButtons();
  drawVignette(0);
}
SCENE_DRAW.about = drawAboutScene;
SCENE_HOTSPOTS.about = function () {
  return [{
    name: "about-back", box: { x: 760, y: 540, w: 220, h: 50 }, label: "رجوع", size: 20,
    color: "#d62f2a", textColor: "#fff3df", action: function () { game.scene = "settings"; }
  }];
};

// ---------- شاشة الخروج ----------

function drawByeScene() {
  game.byeT = (game.byeT || 0) + 0.016;
  drawPanelBackground();
  const pop = Math.min(1, game.byeT * 2.2);
  const bounce = 1 + Math.sin(game.byeT * 8) * 0.02 * (1 - Math.min(1, game.byeT / 2));
  ctx.save();
  ctx.translate(640, 270);
  ctx.scale(pop * bounce, pop * bounce);
  if (imageReady("logo")) {
    withShadow(30, 12, "rgba(0,0,0,0.6)", function () {
      fillRound(-150, -150, 300, 300, 40, "#2b1d14");
    });
    ctx.save();
    roundRectPath(-150, -150, 300, 300, 40);
    ctx.clip();
    ctx.drawImage(IMAGES.logo, -150, -150, 300, 300);
    ctx.restore();
    strokeRound(-150, -150, 300, 300, 40, "rgba(242,177,52,0.9)", 5);
  }
  ctx.restore();
  drawText("شكراً إنك لعبت برجر الحريف!", 640, 480, 34, "#f2b134");
  drawText("اتحفظ تقدمك. تقدر تقفل الصفحة دلوقتي.", 640, 524, 20, "#fff3df");
  drawText("صنع بحب بواسطة " + CREATOR_NAME, 640, 566, 18, "#e8d3b0");
  drawHotspotButtons();
  drawVignette(0);
}
SCENE_DRAW.bye = drawByeScene;
SCENE_HOTSPOTS.bye = function () {
  return [{
    name: "bye-back", box: { x: 530, y: 600, w: 220, h: 54 }, label: "رجوع للعبة", size: 21,
    color: "#5aa335", textColor: "#10260a", action: function () { game.scene = "menu"; }
  }];
};
