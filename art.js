// ===== art.js: أدوات الرسم + البرجر + الشخصيات + الواجهة العلوية =====

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const FONT = "Cairo, Arial, sans-serif";

// صور اللعبة (اللوجو وشاشة التحميل) - لو الملف مش موجود اللعبة بتكمل عادي
const IMAGES = {};

function loadImage(key, src) {
  if (typeof Image === "undefined") {
    return;
  }
  const img = new Image();
  img.src = src;
  IMAGES[key] = img;
}

function imageReady(key) {
  const img = IMAGES[key];
  return !!img && img.complete && img.naturalWidth > 0;
}

const hasData = typeof IMAGE_DATA !== "undefined";
loadImage("logo", hasData ? IMAGE_DATA.logo : "logo.png");
loadImage("loading", hasData ? IMAGE_DATA.loading : "loading.jpg");

// خرايط المشاهد الإضافية (كل ملف بيسجل مشهده هنا)
const SCENE_DRAW = {};
const SCENE_HOTSPOTS = {};

// أزرار الواجهة العلوية (ملء الشاشة / الصوت / القائمة)
const HUD_BOXES = {
  full: { x: 880, y: 12, w: 40, h: 40 },
  sound: { x: 928, y: 12, w: 40, h: 40 },
  menu: { x: 976, y: 12, w: 40, h: 40 }
};

// ---------- أدوات رسم عامة ----------

function roundRectPath(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fillRound(x, y, w, h, r, fill) {
  roundRectPath(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function vGradient(y1, y2, c1, c2) {
  const g = ctx.createLinearGradient(0, y1, 0, y2);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

function withShadow(blur, offsetY, color, drawFn) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetY = offsetY;
  drawFn();
  ctx.restore();
}

function drawText(text, x, y, size, color, align) {
  // الكلام العربي بيتكتب من اليمين لليسار (عشان الأرقام وEGP تتظبط صح)
  ctx.direction = /[\u0600-\u06FF]/.test(text) ? "rtl" : "ltr";
  ctx.fillStyle = color;
  ctx.font = "bold " + size + "px " + FONT;
  ctx.textAlign = align || "center";
  ctx.fillText(text, x, y);
}

function drawEllipse(cx, cy, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawButton(box, label, color, textColor, hovered, size) {
  const fs = size || 22;
  if (hovered) {
    box = { x: box.x - 2, y: box.y - 3, w: box.w + 4, h: box.h + 4 };
  }
  const r = Math.min(14, box.h / 2);
  withShadow(hovered ? 20 : 10, 4, "rgba(0,0,0,0.45)", function () {
    fillRound(box.x, box.y, box.w, box.h, r, color);
  });
  roundRectPath(box.x, box.y, box.w, box.h, r);
  const g = ctx.createLinearGradient(0, box.y, 0, box.y + box.h);
  g.addColorStop(0, "rgba(255,255,255,0.28)");
  g.addColorStop(0.5, "rgba(255,255,255,0.04)");
  g.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(26,17,11,0.85)";
  ctx.lineWidth = 3;
  ctx.stroke();
  if (hovered) {
    fillRound(box.x, box.y, box.w, box.h, r, "rgba(255,255,255,0.2)");
  }
  drawText(label, box.x + box.w / 2, box.y + box.h / 2 + fs * 0.36, fs, textColor);
}

// بيرسم كل الأزرار اللي ليها label في المشهد الحالي
function drawHotspotButtons() {
  const list = getHotspots();
  for (let i = 0; i < list.length; i++) {
    const h = list[i];
    if (h.label) {
      drawButton(h.box, h.label, h.color, h.textColor, game.hover === h.name, h.size);
    }
  }
}

// ---------- الواجهة العلوية ----------

function clockText() {
  const h = Math.floor(game.minutes / 60);
  const m = Math.floor(game.minutes % 60);
  const suffix = h >= 12 ? "م" : "ص";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + ":" + (m < 10 ? "0" : "") + m + " " + suffix;
}

function drawHudIcons() {
  const names = ["full", "sound", "menu"];
  for (let i = 0; i < names.length; i++) {
    const b = HUD_BOXES[names[i]];
    const hot = game.hover === "hud-" + names[i];
    fillRound(b.x, b.y, b.w, b.h, 10, hot ? "#5a3a26" : "#3a2819");
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    if (names[i] === "full") {
      ctx.moveTo(b.x + 11, b.y + 18); ctx.lineTo(b.x + 11, b.y + 11); ctx.lineTo(b.x + 18, b.y + 11);
      ctx.moveTo(b.x + 22, b.y + 11); ctx.lineTo(b.x + 29, b.y + 11); ctx.lineTo(b.x + 29, b.y + 18);
      ctx.moveTo(b.x + 29, b.y + 22); ctx.lineTo(b.x + 29, b.y + 29); ctx.lineTo(b.x + 22, b.y + 29);
      ctx.moveTo(b.x + 18, b.y + 29); ctx.lineTo(b.x + 11, b.y + 29); ctx.lineTo(b.x + 11, b.y + 22);
    } else if (names[i] === "sound") {
      ctx.moveTo(b.x + 10, b.y + 16); ctx.lineTo(b.x + 16, b.y + 16); ctx.lineTo(b.x + 23, b.y + 10);
      ctx.lineTo(b.x + 23, b.y + 30); ctx.lineTo(b.x + 16, b.y + 24); ctx.lineTo(b.x + 10, b.y + 24);
      ctx.closePath();
      if (audioSettings.sfx || audioSettings.music) {
        ctx.moveTo(b.x + 28, b.y + 14);
        ctx.arc(b.x + 24, b.y + 20, 6, -0.9, 0.9);
      } else {
        ctx.moveTo(b.x + 28, b.y + 14); ctx.lineTo(b.x + 35, b.y + 26);
        ctx.moveTo(b.x + 35, b.y + 14); ctx.lineTo(b.x + 28, b.y + 26);
      }
    } else {
      ctx.moveTo(b.x + 10, b.y + 12); ctx.lineTo(b.x + 30, b.y + 12);
      ctx.moveTo(b.x + 10, b.y + 20); ctx.lineTo(b.x + 30, b.y + 20);
      ctx.moveTo(b.x + 10, b.y + 28); ctx.lineTo(b.x + 30, b.y + 28);
    }
    ctx.stroke();
  }
}

function drawHud() {
  ctx.fillStyle = vGradient(0, 64, "#2b1d14", "#1a110b");
  ctx.fillRect(0, 0, 1280, 64);
  ctx.fillStyle = "#f2b134";
  ctx.fillRect(0, 62, 1280, 2);
  if (imageReady("logo")) {
    ctx.drawImage(IMAGES.logo, 14, 6, 52, 52);
  }
  drawText("برجر الحريف", imageReady("logo") ? 76 : 28, 42, 26, "#f2b134", "left");

  // اليوم والساعة وشريط تقدم اليوم
  drawText("اليوم " + game.day + "  -  " + clockText(), 640, 34, 20, "#fff3df");
  const frac = Math.min(1, Math.max(0, (game.minutes - DAY_START) / (DAY_END - DAY_START)));
  fillRound(540, 44, 200, 8, 4, "#3a2819");
  fillRound(540, 44, Math.max(8, 200 * frac), 8, 4, "#f2b134");

  // التقييم
  drawStar(786, 32, 11, "#f2b134");
  const avg = averageRating();
  drawText(avg === null ? "-" : avg.toFixed(1), 804, 40, 18, "#fff3df", "left");

  drawHudIcons();
  drawLevelPill();
  drawEllipse(1240, 32, 14, 14, "#f2b134");
  drawText("E", 1240, 38, 16, "#2b1d14");
  drawText(game.cash + " EGP", 1214, 41, 20, "#fff3df", "right");
}

function drawMessage() {
  drawFloatTexts();
  drawConfetti();
  if (game.message === null) {
    return;
  }
  withShadow(14, 4, "rgba(0,0,0,0.5)", function () {
    fillRound(430, 74, 420, 38, 19, "#1a110b");
  });
  drawText(game.message.text, 640, 100, 20, game.message.color);
}

// ---------- البرجر والطبق ----------

function drawPlate(cx, cy, rx) {
  withShadow(16, 8, "rgba(0,0,0,0.35)", function () {
    drawEllipse(cx, cy, rx, rx * 0.2, "#f4ece0");
  });
  drawEllipse(cx, cy, rx * 0.78, rx * 0.14, "#e3d8c6");
}

function pattyColors(doneness) {
  if (doneness === "raw") {
    return ["#d77a72", "#a8483f"];
  }
  if (doneness === "burnt") {
    return ["#3a251a", "#1a110b"];
  }
  return ["#8a5230", "#5a3017"];
}

function layerHeight(L, i, scale) {
  if (L.type === "bun") {
    return (i === 0 ? 32 : 58) * scale;
  }
  if (L.type === "sauce") {
    return 12 * scale;
  }
  if (L.type === "cheese") {
    return 9 * scale;
  }
  return 28 * scale;
}

// ارتفاع قمة البرجر (بنستخدمه عشان نعرف الصوص ينزل فين)
function burgerTopY(layers, baseY, scale) {
  let y = baseY;
  for (let i = 0; i < layers.length; i++) {
    y = y - layerHeight(layers[i], i, scale) + 3 * scale;
  }
  return y;
}

// بيرسم البرجر من تحت لفوق حسب الطبقات
function outlineLayer(scale) {
  ctx.strokeStyle = "rgba(58,33,18,0.7)";
  ctx.lineWidth = Math.max(1.2, 2 * scale);
  ctx.stroke();
}

// بيرسم البرجر من تحت لفوق حسب الطبقات (بخطوط خارجية زي اللوجو)
function drawBurger(cx, baseY, layers, scale) {
  let y = baseY;
  const w = 170 * scale;

  for (let i = 0; i < layers.length; i++) {
    const L = layers[i];
    const h = layerHeight(L, i, scale);
    y = y - h;

    if (L.type === "bun" && i === 0) {
      fillRound(cx - w / 2, y, w, h, 16 * scale, vGradient(y, y + h, "#e0953f", "#b8691f"));
      outlineLayer(scale);
    } else if (L.type === "bun") {
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, y + h);
      ctx.bezierCurveTo(cx - w / 2, y - h * 0.35, cx + w / 2, y - h * 0.35, cx + w / 2, y + h);
      ctx.closePath();
      ctx.fillStyle = vGradient(y, y + h, "#f0a94d", "#c97a30");
      ctx.fill();
      outlineLayer(scale);
      fillRound(cx - w * 0.3, y + h * 0.12, w * 0.3, h * 0.12, h * 0.06, "rgba(255,255,255,0.3)");
      const seeds = [[-0.22, 0.45], [0, 0.25], [0.22, 0.45], [-0.1, 0.62], [0.12, 0.62]];
      for (let k = 0; k < seeds.length; k++) {
        drawEllipse(cx + w * seeds[k][0], y + h * seeds[k][1], 5 * scale, 2.6 * scale, "#fff3df");
      }
    } else if (L.type === "sauce") {
      fillRound(cx - w * 0.46, y, w * 0.92, h, 6 * scale, L.color || "#d62f2a");
      outlineLayer(scale);
      fillRound(cx - w * 0.4, y + 2 * scale, w * 0.8, 3 * scale, 2, "rgba(255,255,255,0.35)");
    } else if (L.type === "cheese") {
      fillRound(cx - w * 0.52, y, w * 1.04, h, 3 * scale, "#f2c230");
      outlineLayer(scale);
      ctx.fillStyle = "#f2c230";
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.3, y + h);
      ctx.lineTo(cx - w * 0.2, y + h + 9 * scale);
      ctx.lineTo(cx - w * 0.1, y + h);
      ctx.closePath();
      ctx.fill();
      fillRound(cx - w * 0.45, y + 1.5 * scale, w * 0.9, 2 * scale, 1, "rgba(255,255,255,0.4)");
    } else if (L.type === "patty") {
      const colors = pattyColors(L.doneness);
      fillRound(cx - w * 0.48, y, w * 0.96, h, 13 * scale, vGradient(y, y + h, colors[0], colors[1]));
      outlineLayer(scale);
      if (L.doneness === "cooked" && scale > 0.5) {
        ctx.strokeStyle = "rgba(0,0,0,0.22)";
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        for (let k = -2; k <= 2; k++) {
          ctx.moveTo(cx + k * 22 * scale - 6 * scale, y + 6 * scale);
          ctx.lineTo(cx + k * 22 * scale + 6 * scale, y + h - 6 * scale);
        }
        ctx.stroke();
      }
    }
    y = y + 3 * scale;
  }
  return y;
}

// ---------- الشخصيات (الزباين) ----------



// ---------- بطاطس ومشروبات وصينية ----------

function drawFries(cx, baseY, scale, doneness) {
  let col = "#e8b53a";
  if (doneness === "raw") {
    col = "#f3e3a0";
  } else if (doneness === "burnt") {
    col = "#6b4a1a";
  }
  for (let k = 0; k < 7; k++) {
    const x = cx - 24 * scale + k * 8 * scale;
    const extra = ((k * 5) % 12) * scale;
    fillRound(x, baseY - 34 * scale - extra - 10 * scale, 6 * scale, (28 * scale) + extra, 2, col);
  }
  ctx.beginPath();
  ctx.moveTo(cx - 28 * scale, baseY - 34 * scale);
  ctx.lineTo(cx + 28 * scale, baseY - 34 * scale);
  ctx.lineTo(cx + 22 * scale, baseY);
  ctx.lineTo(cx - 22 * scale, baseY);
  ctx.closePath();
  ctx.fillStyle = "#d62f2a";
  ctx.fill();
  fillRound(cx - 22 * scale, baseY - 22 * scale, 44 * scale, 10 * scale, 2, "#fff3df");
}

function drawCup(cx, baseY, scale, drink, fill) {
  const s = scale;
  const f = fill === undefined ? 1 : fill;
  const liquid = drink === "cola" ? "#4a2615" : "#f08a1c";
  if (f >= 1) {
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 3 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx + 6 * s, baseY - 66 * s);
    ctx.lineTo(cx + 12 * s, baseY - 92 * s);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx - 22 * s, baseY - 62 * s);
  ctx.lineTo(cx + 22 * s, baseY - 62 * s);
  ctx.lineTo(cx + 16 * s, baseY);
  ctx.lineTo(cx - 16 * s, baseY);
  ctx.closePath();
  ctx.fillStyle = "#fff3df";
  ctx.fill();
  ctx.strokeStyle = "rgba(58,33,18,0.65)";
  ctx.lineWidth = Math.max(1.2, 2 * s);
  ctx.stroke();
  if (drink && f > 0) {
    const h = 46 * s * f;
    const hw = 16 * s + 6 * s * (h / (62 * s));
    ctx.beginPath();
    ctx.moveTo(cx - hw, baseY - h);
    ctx.lineTo(cx + hw, baseY - h);
    ctx.lineTo(cx + 16 * s, baseY);
    ctx.lineTo(cx - 16 * s, baseY);
    ctx.closePath();
    ctx.fillStyle = liquid;
    ctx.fill();
  }
  if (f >= 1) {
    fillRound(cx - 25 * s, baseY - 70 * s, 50 * s, 9 * s, 4 * s, "#d62f2a");
  }
}

// بيرسم كل حاجة على الصينية: البرجر في النص والبطاطس شمال والمشروب يمين
function drawTrayItems(tray, cx, baseY, scale) {
  let burgers = 0;
  for (let i = 0; i < tray.length; i++) {
    if (tray[i].kind === "burger") {
      burgers = burgers + 1;
    }
  }
  let b = 0;
  let f = 0;
  let d = 0;
  for (let i = 0; i < tray.length; i++) {
    const t = tray[i];
    if (t.kind === "burger") {
      drawBurger(cx + (b - (burgers - 1) / 2) * 90 * scale, baseY, t.layers, scale);
      b = b + 1;
    } else if (t.kind === "fries") {
      drawFries(cx - 125 * scale - f * 34 * scale, baseY, scale * 1.3, t.doneness);
      f = f + 1;
    } else {
      drawCup(cx + 125 * scale + d * 34 * scale, baseY, scale * 1.3, t.drink);
      d = d + 1;
    }
  }
}

// ---------- نجمة ومقفول وزبون بياكل ----------

function drawStar(cx, cy, r, color) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const x = cx + Math.cos(ang) * rad;
    const y = cy + Math.sin(ang) * rad;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// 5 نجوم، المملية بالدهبي والباقي رمادي
function drawStars(cx, cy, r, filled) {
  for (let i = 0; i < 5; i++) {
    drawStar(cx + (i - 2) * r * 2.3, cy, r, i < filled ? "#f2b134" : "#5a6a74");
  }
}

function drawLockOverlay(x, y, w, h, r, label) {
  fillRound(x, y, w, h, r, "rgba(20,14,10,0.8)");
  const cx = x + w / 2;
  const cy = y + h / 2 - 8;
  ctx.strokeStyle = "#f2b134";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy - 6, 8, Math.PI, Math.PI * 2);
  ctx.stroke();
  fillRound(cx - 12, cy - 6, 24, 18, 4, "#f2b134");
  drawText(label, cx, cy + 34, 15, "#fff3df");
}

// زبون صغير قاعد على ترابيزة وبياكل

// ---------- لمسات الجرافيكس ----------

function strokeRound(x, y, w, h, r, color, lw) {
  roundRectPath(x, y, w, h, r);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
}

// الزبون بيدخل من الشمال وبيتنفس وهو واقف

// ضلال خفيفة على أطراف الشاشة
function drawVignette(fromY) {
  if (settings.quality === "low") {
    return;
  }
  const y0 = fromY === undefined ? 64 : fromY;
  const g = ctx.createRadialGradient(640, 380, 380, 640, 380, 820);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(10,5,2,0.45)");
  ctx.fillStyle = g;
  ctx.fillRect(0, y0, 1280, 720 - y0);
}

// بخار طالع من الأكل
function drawSteam(x, y, strength) {
  if (settings.quality === "low") {
    return;
  }
  for (let k = 0; k < 4; k++) {
    const phase = (game.time * 0.8 + k * 0.25) % 1;
    const px = x + Math.sin(phase * 6 + k * 2) * 8;
    const py = y - phase * 60;
    const r = 6 + phase * 12;
    drawEllipse(px, py, r, r, "rgba(255,255,255," + ((1 - phase) * 0.35 * strength).toFixed(3) + ")");
  }
}

// ---------- أدوات جرافيكس مشتركة (الجيل التاني) ----------

// مستطيل مدور بخط خارجي
function outlinedRound(x, y, w, h, r, fill, lw, stroke) {
  roundRectPath(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke || "rgba(40,22,12,0.75)";
  ctx.lineWidth = lw || 3;
  ctx.stroke();
}

// تدريج ستانلس ستيل
function metalGradient(y1, y2) {
  const g = ctx.createLinearGradient(0, y1, 0, y2);
  g.addColorStop(0, "#eef2f5");
  g.addColorStop(0.35, "#c3cad0");
  g.addColorStop(0.7, "#9aa3ab");
  g.addColorStop(1, "#7d868e");
  return g;
}

// لمعة فوق الشكل
function drawGloss(x, y, w, h, r) {
  fillRound(x + 3, y + 3, w - 6, h * 0.42, r, "rgba(255,255,255,0.22)");
}

function drawBolt(x, y) {
  drawEllipse(x, y, 3.5, 3.5, "#6b7580");
  drawEllipse(x - 1, y - 1, 1.2, 1.2, "rgba(255,255,255,0.7)");
}

// بيقسم الكلام لسطور على قد العرض
function wrapText(text, maxW, size) {
  ctx.font = "bold " + size + "px " + FONT;
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (let i = 0; i < words.length; i++) {
    const test = cur ? cur + " " + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = words[i];
    } else {
      cur = test;
    }
  }
  if (cur) {
    lines.push(cur);
  }
  return lines;
}

// ---------- مستوى اللاعب وأرقام طايرة وقصاصات ----------

function drawLevelPill() {
  if (game.tut) {
    fillRound(236, 16, 130, 32, 16, "#5aa335");
    drawText("وضع التدريب", 301, 38, 16, "#10260a");
    return;
  }
  fillRound(228, 16, 80, 32, 16, "rgba(242,177,52,0.18)");
  strokeRound(228, 16, 80, 32, 16, "rgba(242,177,52,0.6)", 2);
  drawText("Lv " + game.level, 268, 36, 16, "#f2b134");
  const prev = levelStartXp(game.level);
  const next = levelStartXp(game.level + 1);
  const frac = Math.min(1, Math.max(0, (game.xp - prev) / (next - prev)));
  fillRound(238, 41, 60, 4, 2, "rgba(0,0,0,0.5)");
  fillRound(238, 41, Math.max(3, 60 * frac), 4, 2, "#f2b134");
}

function addFloat(text, x, y, color, size) {
  game.floatTexts.push({ text: text, x: x, y: y, color: color || "#8fdc5a", size: size || 22, t: 0 });
}

function drawFloatTexts() {
  for (let i = 0; i < game.floatTexts.length; i++) {
    const f = game.floatTexts[i];
    ctx.globalAlpha = Math.max(0, 1 - f.t / 1.8);
    withShadow(6, 2, "rgba(0,0,0,0.6)", function () {
      drawText(f.text, f.x, f.y - f.t * 46, f.size, f.color);
    });
    ctx.globalAlpha = 1;
  }
}

function addConfetti(n) {
  const cols = ["#f2b134", "#d62f2a", "#5aa335", "#3d6fbf", "#ff7eb6", "#fff3df"];
  for (let i = 0; i < n; i++) {
    game.confetti.push({
      x: 640 + (Math.random() - 0.5) * 300, y: 300, vx: (Math.random() - 0.5) * 520, vy: -200 - Math.random() * 380,
      r: Math.random() * 6, vr: (Math.random() - 0.5) * 12, c: cols[i % cols.length], t: 0
    });
  }
}

function drawConfetti() {
  for (let i = 0; i < game.confetti.length; i++) {
    const p = game.confetti[i];
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.globalAlpha = Math.max(0, 1 - p.t / 2.6);
    ctx.fillStyle = p.c;
    ctx.fillRect(-5, -3, 10, 6);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}
