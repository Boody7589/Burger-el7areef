// ===== scenes.js: مشهد الكاونتر والمطبخ (الجيل التاني من الجرافيكس) =====

const MINI_BURGER = [{ type: "bun" }, { type: "patty", doneness: "cooked" }, { type: "bun" }];

// ---------- الخلفية: المحل ----------

function drawLamp(x) {
  const glow = ctx.createRadialGradient(x, 132, 5, x, 132, 200);
  glow.addColorStop(0, "rgba(255,214,130,0.5)");
  glow.addColorStop(1, "rgba(255,214,130,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - 200, 64, 400, 320);
  ctx.fillStyle = "#1a110b";
  ctx.fillRect(x - 1, 92, 2, 14);
  ctx.beginPath();
  ctx.moveTo(x - 38, 128);
  ctx.lineTo(x - 15, 103);
  ctx.lineTo(x + 15, 103);
  ctx.lineTo(x + 38, 128);
  ctx.closePath();
  ctx.fillStyle = vGradient(103, 128, "#e8453c", "#a8231c");
  ctx.fill();
  ctx.strokeStyle = "rgba(40,22,12,0.8)";
  ctx.lineWidth = 3;
  ctx.stroke();
  fillRound(x - 24, 107, 14, 5, 2, "rgba(255,255,255,0.4)");
  drawEllipse(x, 130, 13, 5, "#ffe9a8");
}

function drawFloorTiles(topY) {
  ctx.fillStyle = vGradient(topY, 720, "#7a5238", "#4f321f");
  ctx.fillRect(0, topY, 1280, 720 - topY);
  const rows = [];
  let yy = topY;
  let step = 12;
  while (yy < 720) {
    rows.push(yy);
    yy = yy + step;
    step = step * 1.35;
  }
  rows.push(720);
  for (let r = 0; r < rows.length - 1; r++) {
    const t0 = (rows[r] - topY) / (720 - topY);
    const t1 = (rows[r + 1] - topY) / (720 - topY);
    for (let i = -10; i < 10; i++) {
      if (Math.abs((i + r) % 2) === 0) {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(640 + i * (60 + 170 * t0), rows[r]);
      ctx.lineTo(640 + (i + 1) * (60 + 170 * t0), rows[r]);
      ctx.lineTo(640 + (i + 1) * (60 + 170 * t1), rows[r + 1]);
      ctx.lineTo(640 + i * (60 + 170 * t1), rows[r + 1]);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,235,200,0.1)";
      ctx.fill();
    }
  }
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = -8; i <= 8; i++) {
    ctx.moveTo(640 + i * 60, topY);
    ctx.lineTo(640 + i * 230, 720);
  }
  for (let r = 0; r < rows.length; r++) {
    ctx.moveTo(0, rows[r]);
    ctx.lineTo(1280, rows[r]);
  }
  ctx.stroke();
}

function drawWindow() {
  const x = 70;
  const y = 135;
  const w = 300;
  const h = 150;
  withShadow(16, 6, "rgba(0,0,0,0.4)", function () {
    ctx.fillStyle = "#2b1d14";
    ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
  });
  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 6, y + 6, w - 12, h - 12);
  ctx.clip();
  const dayT = Math.max(0, Math.min(1, (game.minutes - 540) / 480));
  const skyTop = dayT < 0.5 ? lerpColor("#9ad8f5", "#86cdee", dayT * 2) : lerpColor("#86cdee", "#f09a5f", (dayT - 0.5) * 2);
  const skyBot = dayT < 0.5 ? lerpColor("#fdeec8", "#fbe7b8", dayT * 2) : lerpColor("#fbe7b8", "#f7b46a", (dayT - 0.5) * 2);
  ctx.fillStyle = vGradient(y, y + h, skyTop, skyBot);
  ctx.fillRect(x, y, w, h);
  const sunX = x + 40 + dayT * 220;
  const sunY = y + 105 - Math.sin(Math.PI * dayT) * 75;
  const sun = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 60);
  sun.addColorStop(0, dayT > 0.75 ? "rgba(255,170,90,1)" : "rgba(255,244,170,1)");
  sun.addColorStop(1, "rgba(255,244,170,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(sunX - 70, sunY - 70, 140, 140);
  for (let k = 0; k < 3; k++) {
    const cx = x - 60 + ((game.time * 7 + k * 120) % (w + 120));
    const cy = y + 30 + k * 20;
    drawEllipse(cx, cy, 30, 10, "rgba(255,255,255,0.85)");
    drawEllipse(cx + 18, cy - 6, 20, 10, "rgba(255,255,255,0.85)");
    drawEllipse(cx - 16, cy - 4, 16, 8, "rgba(255,255,255,0.85)");
  }
  const blds = [[10, 70, 46], [60, 40, 58], [124, 80, 44], [172, 52, 52], [230, 64, 40], [274, 44, 40]];
  for (let i = 0; i < blds.length; i++) {
    const b = blds[i];
    ctx.fillStyle = i % 2 === 0 ? "#6f8294" : "#5d7184";
    ctx.fillRect(x + b[0], y + h - 26 - b[1], b[2], b[1]);
    for (let wy = 0; wy < b[1] - 12; wy += 14) {
      for (let wx = 6; wx < b[2] - 8; wx += 12) {
        ctx.fillStyle = (wx + wy + i * 7) % 3 === 0 ? "#ffe9a8" : "rgba(255,255,255,0.25)";
        ctx.fillRect(x + b[0] + wx, y + h - 26 - b[1] + 8 + wy, 6, 8);
      }
    }
  }
  ctx.fillStyle = "#4a4f55";
  ctx.fillRect(x, y + h - 26, w, 26);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let dx = 0; dx < w; dx += 34) {
    ctx.fillRect(x + dx, y + h - 14, 18, 3);
  }
  const carX = x - 50 + ((game.time * 42) % (w + 100));
  fillRound(carX, y + h - 30, 46, 14, 5, "#d62f2a");
  fillRound(carX + 10, y + h - 40, 24, 12, 5, "#e8453c");
  fillRound(carX + 14, y + h - 38, 16, 8, 3, "#bfe3f2");
  drawEllipse(carX + 11, y + h - 15, 5, 5, "#1a110b");
  drawEllipse(carX + 35, y + h - 15, 5, 5, "#1a110b");
  ctx.restore();
  // الشبابيك والستاير
  ctx.fillStyle = "#2b1d14";
  ctx.fillRect(x + 147, y + 4, 6, h - 8);
  ctx.fillRect(x + 4, y + 70, w - 8, 6);
  for (let side = 0; side < 2; side++) {
    const sx = side === 0 ? x - 4 : x + w + 4;
    const dir = side === 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(sx, y - 8);
    ctx.lineTo(sx + dir * 56, y - 8);
    ctx.bezierCurveTo(sx + dir * 46, y + 50, sx + dir * 24, y + 90, sx + dir * 30, y + h + 6);
    ctx.lineTo(sx, y + h + 6);
    ctx.closePath();
    ctx.fillStyle = vGradient(y, y + h, "#d9453b", "#a02a22");
    ctx.fill();
    ctx.strokeStyle = "rgba(40,22,12,0.8)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx + dir * 12, y);
    ctx.lineTo(sx + dir * 12, y + h);
    ctx.moveTo(sx + dir * 30, y);
    ctx.lineTo(sx + dir * 24, y + h);
    ctx.stroke();
  }
  // الحاجز والنبتة
  fillRound(58, 284, 324, 12, 4, "#c58a52");
  strokeRound(58, 284, 324, 12, 4, "rgba(40,22,12,0.7)", 2);
  fillRound(318, 262, 26, 22, 5, "#c0603a");
  strokeRound(318, 262, 26, 22, 5, "rgba(40,22,12,0.7)", 2);
  for (let k = 0; k < 5; k++) {
    drawEllipse(331 + (k - 2) * 8, 252 - (k % 2) * 6, 7, 14, "#4caf50");
  }
}

function drawWallClock(cx, cy) {
  withShadow(8, 4, "rgba(0,0,0,0.4)", function () {
    drawEllipse(cx, cy, 40, 40, "#c58a52");
  });
  drawEllipse(cx, cy, 33, 33, "#fff3df");
  ctx.strokeStyle = "rgba(40,22,12,0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.stroke();
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    ctx.strokeStyle = "#5a3a26";
    ctx.lineWidth = k % 3 === 0 ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 26, cy + Math.sin(a) * 26);
    ctx.lineTo(cx + Math.cos(a) * 31, cy + Math.sin(a) * 31);
    ctx.stroke();
  }
  const hrs = (game.minutes / 60) % 12;
  const mins = game.minutes % 60;
  const ha = ((hrs + mins / 60) / 12) * Math.PI * 2 - Math.PI / 2;
  const ma = (mins / 60) * Math.PI * 2 - Math.PI / 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#2b1d14";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(ha) * 17, cy + Math.sin(ha) * 17);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(ma) * 26, cy + Math.sin(ma) * 26);
  ctx.stroke();
  drawEllipse(cx, cy, 3.5, 3.5, "#d62f2a");
}

// إطار اللوجو على الحيطة
function drawWallDecor() {
  withShadow(16, 6, "rgba(0,0,0,0.4)", function () {
    outlinedRound(890, 122, 210, 172, 10, "#c58a52", 3);
  });
  fillRound(900, 132, 190, 152, 6, "#2b1d14");
  if (imageReady("logo")) {
    ctx.drawImage(IMAGES.logo, 920, 134, 150, 148);
  } else {
    drawText("برجر الحريف", 995, 214, 26, "#f2b134");
  }
}

function drawRestaurantBackground() {
  ctx.fillStyle = vGradient(64, 340, "#7a4d33", "#53321f");
  ctx.fillRect(0, 0, 1280, 340);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  for (let x = 0; x < 1280; x += 96) {
    ctx.fillRect(x, 64, 3, 232);
  }
  ctx.fillStyle = "rgba(255,220,160,0.06)";
  for (let x = 48; x < 1280; x += 96) {
    for (let y = 130; y < 290; y += 64) {
      ctx.beginPath();
      ctx.moveTo(x, y - 14); ctx.lineTo(x + 10, y); ctx.lineTo(x, y + 14); ctx.lineTo(x - 10, y);
      ctx.closePath();
      ctx.fill();
    }
  }
  // عارضة السقف
  ctx.fillStyle = vGradient(64, 92, "#3a2112", "#5a3622");
  ctx.fillRect(0, 64, 1280, 28);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(0, 66, 1280, 3);
  // وزرة الحيطة
  ctx.fillStyle = "#3a2112";
  ctx.fillRect(0, 298, 1280, 42);
  for (let x = 0; x < 1280; x += 120) {
    outlinedRound(x + 8, 306, 104, 26, 5, "#4f2f1b", 2, "rgba(0,0,0,0.45)");
  }
  ctx.fillStyle = "#c58a52";
  ctx.fillRect(0, 292, 1280, 8);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(0, 293, 1280, 2);
  drawFloorTiles(340);
  drawWindow();
  drawWallDecor();
  drawWallClock(1190, 205);
}

// ---------- الترابيزات والزباين اللي بياكلوا ----------

function drawMiniDiner(x, tableY, look, t) {
  const bob = Math.sin(t * 6) * 2;
  const hijab = look.style === "hijab";
  fillRound(x - 22, tableY - 38 + bob, 44, 40, 14, look.shirt[0]);
  strokeRound(x - 22, tableY - 38 + bob, 44, 40, 14, "rgba(58,33,18,0.6)", 2);
  const hy = tableY - 54 + bob;
  if (hijab) {
    drawEllipse(x, hy, 20, 23, look.scarf[1]);
  }
  if (look.style === "afro") {
    drawEllipse(x, hy - 4, 24, 22, look.hair);
  }
  drawEllipse(x, hy + 1, hijab ? 14 : 16, hijab ? 16 : 18, look.skin);
  ctx.strokeStyle = "rgba(58,33,18,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, hy + 1, hijab ? 14 : 16, hijab ? 16 : 18, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = hijab ? look.scarf[0] : look.hair;
  if (look.style !== "bald") {
    ctx.beginPath();
    ctx.ellipse(x, hy - 4, hijab ? 16 : 18, hijab ? 11 : 12, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  }
  drawEllipse(x - 6, hy + 2, 2, 2, "#2b1a12");
  drawEllipse(x + 6, hy + 2, 2, 2, "#2b1a12");
}

// ترابيزة بمفرش كاروهات وكرسي وملحية
function drawTable(spot, diner, index) {
  ctx.save();
  ctx.translate(spot.x, spot.y);
  ctx.scale(spot.s, spot.s);
  // كرسي ورا
  outlinedRound(-26, -92, 52, 60, 10, "#8a3a24", 3);
  fillRound(-20, -86, 40, 8, 4, "rgba(255,255,255,0.2)");
  if (diner !== null) {
    drawMiniDiner(0, 0, diner.look, game.time + index);
  }
  // الترابيزة
  withShadow(10, 6, "rgba(0,0,0,0.4)", function () {
    drawEllipse(0, 4, 60, 17, "#5a3a26");
  });
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, -2, 56, 14, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "#fff3df";
  ctx.fillRect(-60, -20, 120, 40);
  ctx.fillStyle = "#d62f2a";
  for (let ix = -6; ix < 6; ix++) {
    for (let iy = -2; iy < 2; iy++) {
      if ((ix + iy) % 2 === 0) {
        ctx.fillRect(ix * 11, iy * 8 - 2, 11, 8);
      }
    }
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(58,33,18,0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -2, 56, 14, 0, 0, Math.PI * 2);
  ctx.stroke();
  fillRound(38, -14, 7, 10, 2, "#eee");
  fillRound(46, -13, 6, 9, 2, "#c93a34");
  if (diner !== null && diner.timer / DINE_TIME > 0.25) {
    drawEllipse(-6, -4, 20, 6, "#fff");
    drawBurger(-6, -3, MINI_BURGER, 0.24);
  }
  ctx.restore();
}

function drawDiningArea() {
  for (let i = 0; i < game.up.tables; i++) {
    let diner = null;
    for (let k = 0; k < game.diners.length; k++) {
      if (game.diners[k].table === i) {
        diner = game.diners[k];
      }
    }
    drawTable(TABLE_SPOTS[i], diner, i);
  }
}

// ---------- الكاونتر وحاجاته ----------

function drawCounterTop() {
  ctx.beginPath();
  ctx.moveTo(50, 470);
  ctx.lineTo(1230, 470);
  ctx.lineTo(1280, 720);
  ctx.lineTo(0, 720);
  ctx.closePath();
  ctx.fillStyle = vGradient(470, 720, "#b07a46", "#6e4527");
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.14)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let t = 1; t < 14; t++) {
    ctx.moveTo(50 + (t / 14) * 1180, 474);
    ctx.lineTo((t / 14) * 1280, 720);
  }
  ctx.stroke();
  // لمعة الكاونتر
  ctx.fillStyle = "rgba(255,240,200,0.07)";
  ctx.beginPath();
  ctx.moveTo(200, 474); ctx.lineTo(560, 474); ctx.lineTo(420, 720); ctx.lineTo(60, 720);
  ctx.closePath();
  ctx.fill();
  outlinedRound(50, 458, 1180, 18, 8, "#dba66a", 3);
  fillRound(60, 461, 1160, 4, 2, "rgba(255,255,255,0.4)");
}

function drawRegister() {
  const x = 1105;
  withShadow(16, 8, "rgba(0,0,0,0.45)", function () {
    outlinedRound(x, 512, 160, 104, 12, vGradient(512, 616, "#454a52", "#23272c"), 3);
  });
  outlinedRound(x + 14, 524, 132, 40, 6, "#a8e6b8", 3);
  let total = "0";
  const c = game.customers[game.sel];
  if (c !== null && c !== undefined && c.ticket) {
    total = String(c.order.price);
  }
  drawText(total + " EGP", x + 80, 553, 21, "#10260a");
  for (let k = 0; k < 8; k++) {
    fillRound(x + 16 + (k % 4) * 32, 574 + Math.floor(k / 4) * 18, 24, 12, 4, k === 7 ? "#5aa335" : "#6b7580");
  }
  fillRound(x + 40, 500, 80, 16, 4, "#fff3df");
  strokeRound(x + 40, 500, 80, 16, 4, "rgba(40,22,12,0.6)", 2);
}

function drawTrayAt(cx, items, idx) {
  const two = slotCount() === 2;
  const rx = two ? 98 : 120;
  withShadow(14, 8, "rgba(0,0,0,0.45)", function () {
    drawEllipse(cx, 596, rx + 12, 26, "#d4dbe0");
  });
  ctx.strokeStyle = "rgba(40,22,12,0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, 596, rx + 12, 26, 0, 0, Math.PI * 2);
  ctx.stroke();
  drawEllipse(cx, 594, rx - 8, 19, "#9aa3ab");
  drawTrayItems(items, cx, 598, two ? 0.5 : 0.62);
  if (two) {
    drawText("طلب " + (idx + 1), cx, 636, 14, "#fff3df");
  }
}

function drawCounterScene() {
  drawRestaurantBackground();
  drawDiningArea();
  drawDust();
  drawLamp(450);
  drawLamp(900);

  const slots = slotCount();
  for (let i = 0; i < slots; i++) {
    if (game.customers[i] !== null) {
      drawCustomer(game.customers[i], i);
    }
  }

  drawCounterTop();
  drawHands();
  drawRegister();
  const L = layout();
  for (let i = 0; i < slots; i++) {
    drawTrayAt(L.tray[i], game.trays[i], i);
  }
  drawMenuBook();
  drawLaptopOnCounter();
  drawDayTint();
  drawVignette();
  drawHotspotButtons();
  drawHud();
  drawMessage();
}

// ---------- المطبخ ----------

function drawKitchenWall() {
  ctx.fillStyle = vGradient(64, 430, "#f6efdf", "#dcd2bb");
  ctx.fillRect(0, 64, 1280, 366);
  ctx.strokeStyle = "rgba(0,0,0,0.09)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let r = 0; r < 12; r++) {
    const y = 64 + r * 32;
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    for (let x = (r % 2) * 32; x < 1280; x += 64) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 32);
    }
  }
  ctx.stroke();
  // خلفية البوتاجاز (سيراميك أحمر)
  ctx.save();
  ctx.beginPath();
  ctx.rect(770, 150, 480, 290);
  ctx.clip();
  ctx.fillStyle = vGradient(150, 440, "#d8453b", "#a8281f");
  ctx.fillRect(770, 150, 480, 290);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let r = 0; r < 10; r++) {
    const y = 150 + r * 32;
    ctx.moveTo(770, y);
    ctx.lineTo(1250, y);
    for (let x = 770 + (r % 2) * 24; x < 1250; x += 48) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 32);
    }
  }
  ctx.stroke();
  ctx.restore();
  strokeRound(770, 150, 480, 290, 4, "rgba(40,22,12,0.5)", 3);
  // شعاع ضوء
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.moveTo(300, 64); ctx.lineTo(520, 64); ctx.lineTo(320, 430); ctx.lineTo(90, 430);
  ctx.closePath();
  ctx.fill();
}

function drawHood() {
  ctx.beginPath();
  ctx.moveTo(780, 64);
  ctx.lineTo(1260, 64);
  ctx.lineTo(1204, 160);
  ctx.lineTo(836, 160);
  ctx.closePath();
  ctx.fillStyle = metalGradient(64, 160);
  ctx.fill();
  ctx.strokeStyle = "rgba(40,22,12,0.7)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  for (let x = 866; x < 1180; x += 30) {
    fillRound(x, 118, 18, 7, 3, "rgba(0,0,0,0.2)");
  }
  const glow = ctx.createRadialGradient(1020, 160, 4, 1020, 160, 130);
  glow.addColorStop(0, "rgba(255,224,150,0.35)");
  glow.addColorStop(1, "rgba(255,224,150,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(880, 150, 280, 150);
  drawEllipse(940, 150, 12, 4, "#fff0b8");
  drawEllipse(1100, 150, 12, 4, "#fff0b8");
}

function drawPrepCounter() {
  ctx.fillStyle = metalGradient(430, 720);
  ctx.fillRect(0, 430, 1280, 290);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(0, 426, 1280, 6);
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 160; x < 1280; x += 320) {
    ctx.moveTo(x, 650);
    ctx.lineTo(x, 720);
  }
  ctx.moveTo(0, 650);
  ctx.lineTo(1280, 650);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  for (let x = -200; x < 1280; x += 90) {
    ctx.moveTo(x, 720);
    ctx.lineTo(x + 260, 432);
  }
  ctx.stroke();
}

// صندوق ستانلس (رغيف أو جبنة)
function drawBin(box, key, label, stock, hoverName) {
  withShadow(14, 6, "rgba(0,0,0,0.35)", function () {
    outlinedRound(box.x, box.y, box.w, box.h, 14, metalGradient(box.y, box.y + box.h), 3);
  });
  fillRound(box.x + 10, box.y + 24, box.w - 20, box.h - 36, 8, "#3a424a");
  outlinedRound(box.x + 4, box.y + 6, box.w - 8, 16, 7, "#eef2f5", 2);
  fillRound(box.x + 12, box.y + 8, box.w - 24, 4, 2, "rgba(255,255,255,0.8)");
  if (key === "bun") {
    drawEllipse(box.x + 32, box.y + 98, 22, 15, "#d9893b");
    drawEllipse(box.x + 80, box.y + 98, 22, 15, "#d9893b");
    drawEllipse(box.x + 56, box.y + 74, 22, 15, "#e8a04d");
    drawEllipse(box.x + 56, box.y + 69, 12, 4, "rgba(255,255,255,0.35)");
  } else {
    fillRound(box.x + 20, box.y + 86, 72, 14, 3, "#f2c230");
    fillRound(box.x + 24, box.y + 68, 72, 14, 3, "#f7d24d");
    fillRound(box.x + 18, box.y + 50, 72, 14, 3, "#f2c230");
    drawEllipse(box.x + 40, box.y + 57, 3, 3, "#d9a51c");
    drawEllipse(box.x + 62, box.y + 93, 3, 3, "#d9a51c");
  }
  if (stock <= 0) {
    fillRound(box.x, box.y, box.w, box.h, 14, "rgba(0,0,0,0.6)");
    drawText("خلص!", box.x + box.w / 2, box.y + 75, 24, "#ff7a70");
  }
  if (game.hover === hoverName) {
    strokeRound(box.x - 3, box.y - 3, box.w + 6, box.h + 6, 17, "#fff3df", 4);
  }
  drawText(label + " x" + stock, box.x + box.w / 2, 630, 17, "#1a110b");
}

function drawBins() {
  drawBin(BUN_BIN, "bun", "رغيف", game.stock.buns, "bin-bun");
  drawBin(CHEESE_BIN, "cheese", "جبنة", game.stock.cheese, "bin-cheese");
  if (game.up.cheese < 1) {
    drawLockOverlay(CHEESE_BIN.x, CHEESE_BIN.y, CHEESE_BIN.w, CHEESE_BIN.h, 14, "مقفول");
  }
}

// الفريزر
function drawFreezer() {
  const f = FREEZER_BOX;
  const open = Math.min(1, game.freezerOpen * 2);
  withShadow(18, 8, "rgba(0,0,0,0.4)", function () {
    outlinedRound(f.x, f.y, f.w, f.h, 16, metalGradient(f.y, f.y + f.h), 3);
  });
  fillRound(f.x + 12, f.y + 12, 166, 366, 10, "#1d3340");
  ctx.fillStyle = "#3d5a6a";
  for (let r = 0; r < 4; r++) {
    ctx.fillRect(f.x + 12, f.y + 90 + r * 70, 166, 6);
  }
  const shown = Math.min(game.stock.patties, 8);
  for (let k = 0; k < shown; k++) {
    const px = f.x + 60 + (k % 2) * 70;
    const py = f.y + 78 + Math.floor(k / 2) * 70;
    drawEllipse(px, py, 28, 9, "#d77a72");
    drawEllipse(px - 8, py - 2, 8, 2.5, "rgba(255,255,255,0.35)");
  }
  const doorW = 166 * (1 - 0.85 * open);
  outlinedRound(f.x + 12, f.y + 12, doorW, 366, 10, vGradient(f.y, f.y + f.h, "#f5fafc", "#c8d8e2"), 3);
  fillRound(f.x + 12 + doorW - 20, f.y + 120, 9, 110, 4, "#6b7580");
  fillRound(f.x + 12 + doorW - 18, f.y + 122, 3, 106, 2, "rgba(255,255,255,0.6)");
  if (open < 0.3) {
    // شاشة الحرارة
    fillRound(f.x + 32, f.y + 28, 126, 44, 8, "#10242c");
    drawText("-18°C", f.x + 95, f.y + 60, 24, "#7dffb0");
    drawEllipse(f.x + 40, f.y + 36, 3, 3, "#7dffb0");
    drawText("الفريزر", f.x + 95, f.y + 112, 22, "#274a5a");
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    for (let k = 0; k < 16; k++) {
      ctx.fillRect(f.x + 26 + (k * 37) % 130, f.y + 240 + (k * 53) % 110, 4, 4);
    }
    const frac = Math.min(1, game.stock.patties / freezerCap());
    fillRound(f.x + 32, f.y + 330, 126, 14, 7, "#2b4a5a");
    fillRound(f.x + 32, f.y + 330, Math.max(8, 126 * frac), 14, 7, frac > 0.3 ? "#5aa335" : "#d62f2a");
    drawText("باتي x" + game.stock.patties, f.x + 95, f.y + 366, 18, "#274a5a");
  }
  if (game.hover === "freezer") {
    strokeRound(f.x - 3, f.y - 3, f.w + 6, f.h + 6, 18, "#fff3df", 4);
  }
}

function drawFlames(cx, cy) {
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    const flick = 3 + Math.sin(game.time * 14 + k * 1.7) * 3;
    ctx.strokeStyle = k % 2 === 0 ? "#4aa3ff" : "#bfe0ff";
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 46, cy + Math.sin(a) * 46);
    ctx.lineTo(cx + Math.cos(a) * (52 + flick), cy + Math.sin(a) * (52 + flick));
    ctx.stroke();
  }
}

// البوتاجاز
function drawStove() {
  withShadow(18, 8, "rgba(0,0,0,0.45)", function () {
    outlinedRound(780, 440, 460, 210, 16, vGradient(440, 650, "#eef1f3", "#98a1a9"), 3);
  });
  outlinedRound(796, 452, 428, 150, 10, "#262a2f", 3);
  drawGloss(796, 452, 428, 150, 8);

  for (let i = 0; i < STOVE_SLOTS.length; i++) {
    const s = STOVE_SLOTS[i];
    const p = game.grill[i];
    drawEllipse(s.x, s.y, 52, 52, "#15181b");
    drawEllipse(s.x, s.y, 36, 36, "#2a2e33");
    if (i >= stoveBurners()) {
      drawLockOverlay(s.x - 56, s.y - 56, 112, 112, 56, "مقفول");
      continue;
    }
    ctx.strokeStyle = "#5a6068";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(s.x - 52, s.y); ctx.lineTo(s.x + 52, s.y);
    ctx.moveTo(s.x, s.y - 52); ctx.lineTo(s.x, s.y + 52);
    ctx.stroke();

    if (p === null || p.arriving) {
      continue;
    }
    drawFlames(s.x, s.y);
    fillRound(s.x + 40, s.y - 7, 48, 14, 6, "#1a110b");
    const pan = ctx.createRadialGradient(s.x - 12, s.y - 12, 4, s.x, s.y, 46);
    pan.addColorStop(0, "#7d8791");
    pan.addColorStop(1, "#2f343a");
    drawEllipse(s.x, s.y, 45, 45, pan);
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 45, 0, Math.PI * 2);
    ctx.stroke();

    const done = getDoneness(p.cook);
    const colors = pattyColors(done);
    const grad = ctx.createRadialGradient(s.x - 10, s.y - 10, 4, s.x, s.y, 36);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    drawEllipse(s.x, s.y, 34, 34, grad);
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 34, 0, Math.PI * 2);
    ctx.stroke();
    drawEllipse(s.x - 10, s.y - 12, 10, 5, "rgba(255,255,255,0.18)");
    drawSteam(s.x, s.y - 40, done === "raw" ? 0.5 : 1);

    let ringColor = "#f2b134";
    if (done === "cooked") {
      ringColor = "#5aa335";
    } else if (done === "burnt") {
      ringColor = "#d62f2a";
    }
    const frac = Math.min(p.cook / COOK_MAX, 1);
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = ringColor;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 64, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    ctx.stroke();
    if (game.hover === "slot-" + i) {
      ctx.strokeStyle = "#fff3df";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 72, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawText("الحلقة: أصفر نيّ  |  أخضر استوى  |  أحمر اتحرق", 1010, 622, 14, "#1a110b");
  for (let i = 0; i < 3; i++) {
    const on = i < stoveBurners() && game.grill[i] !== null && !game.grill[i].arriving;
    drawEllipse(STOVE_SLOTS[i].x, 640, 9, 9, "#1a110b");
    if (on) {
      drawEllipse(STOVE_SLOTS[i].x, 640, 14, 14, "rgba(74,163,255,0.35)");
    }
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(STOVE_SLOTS[i].x, 640);
    ctx.lineTo(STOVE_SLOTS[i].x + (on ? 6 : 0), on ? 633 : 631);
    ctx.stroke();
  }
  drawText("بوتاجاز", 1222, 644, 14, "#1a110b", "right");
}

// الصوصات متعلقة من فوق بالمقلوب
function drawSauceRack() {
  outlinedRound(336, 70, 388, 14, 5, metalGradient(70, 84), 3);
  for (let i = 0; i < SAUCES.length; i++) {
    const s = SAUCES[i];
    const hot = game.hover === "sauce-" + s.key;
    const squeezing = game.stream !== null && game.stream.key === s.key;
    let squeeze = 1;
    if (squeezing) {
      squeeze = 1 - 0.12 * Math.sin(Math.PI * Math.min(1, game.stream.t / game.stream.dur));
    }
    ctx.save();
    ctx.translate(s.x, 84);
    ctx.scale(1, squeeze);
    ctx.fillStyle = "#8a939b";
    ctx.fillRect(-4, 0, 8, 10);
    outlinedRound(-27, 8, 54, 86, 14, vGradient(8, 94, s.color, s.dark), 3);
    fillRound(-18, 18, 8, 60, 4, "rgba(255,255,255,0.4)");
    fillRound(-14, 44, 28, 24, 5, "rgba(255,255,255,0.75)");
    outlinedRound(-9, 92, 18, 22, 4, s.cap, 2);
    fillRound(-4, 112, 8, 8, 2, s.cap);
    ctx.restore();
    if (hot) {
      strokeRound(s.x - 38, 78, 76, 182, 14, "#1a110b", 3);
    }
    drawText(s.label, s.x, 230, 16, "#1a110b");
    drawText("x" + game.stock[s.key], s.x, 250, 16, "#1a110b");
    if (game.stock[s.key] <= 0) {
      drawText("خلص!", s.x, 150, 18, "#d62f2a");
    }
  }
}

// تذاكر الطلبات اللي اتاخدت (واحدة أو اتنين)
function drawKitchenTickets() {
  outlinedRound(36, 98, 300, 8, 3, metalGradient(98, 106), 2);
  const two = slotCount() === 2;
  let drawn = 0;
  for (let i = 0; i < slotCount(); i++) {
    const c = game.customers[i];
    const w = two ? 140 : 210;
    const cx = two ? 108 + i * 148 : 150;
    ctx.save();
    ctx.translate(cx, 165);
    ctx.rotate(i === 0 ? -0.03 : 0.03);
    withShadow(12, 6, "rgba(0,0,0,0.35)", function () {
      outlinedRound(-w / 2, -64, w, 128, 4, "#fff3df", 2);
    });
    drawEllipse(0, -64, 7, 7, i === 0 ? "#d62f2a" : "#3d6fbf");
    if (c !== null && c.ticket) {
      const order = c.order;
      drawText("طلب رقم " + c.ticket.number, 0, -36, two ? 15 : 19, "#2b1d14");
      for (let k = 0; k < order.lines.length; k++) {
        drawText(order.lines[k], 0, -12 + k * 20, two ? 11 : 15, "#6b4a32");
      }
      if (!two) {
        let hint = "";
        for (let k = 0; k < order.items.length; k++) {
          if (order.items[k].kind === "burger") {
            hint = recipeHintFor(order.items[k]);
          }
        }
        drawText(hint, 0, 54, 12, "#2b1d14");
      }
      drawn = drawn + 1;
    } else {
      drawText(two ? "فاضي" : "مفيش طلب دلوقتي", 0, -6, two ? 15 : 19, "#8a6d55");
    }
    ctx.restore();
  }
}

// حاجات بتطير (رغيف أو باتي...)
function drawFlyers() {
  for (let i = 0; i < game.flyers.length; i++) {
    const f = game.flyers[i];
    const p = f.t / f.dur;
    const x = f.x0 + (f.x1 - f.x0) * p;
    const y = f.y0 + (f.y1 - f.y0) * p - Math.sin(Math.PI * p) * 70;
    if (f.kind === "bun") {
      drawEllipse(x, y, 34, 22, "#e8a04d");
      drawEllipse(x, y - 6, 20, 6, "rgba(255,255,255,0.3)");
    } else if (f.kind === "cheese") {
      outlinedRound(x - 32, y - 6, 64, 12, 3, "#f2c230", 2);
    } else if (f.kind === "potato") {
      drawEllipse(x, y, 28, 18, "#c9a15a");
      drawEllipse(x - 8, y - 4, 6, 4, "#a8803a");
    } else if (f.kind === "fries") {
      drawFries(x, y + 24, 0.9, f.doneness);
    } else if (f.kind === "cup") {
      drawCup(x, y + 34, 0.9, f.drink);
    } else {
      drawEllipse(x, y, 34, 34, pattyColors(f.doneness)[0]);
    }
  }
}

function drawPlates() {
  const L = layout();
  const two = slotCount() === 2;
  const sc = L.plateScale;
  for (let i = 0; i < slotCount(); i++) {
    const px = L.plate[i];
    const sel = game.sel === i;
    outlinedRound(px - 100 * sc, 592, 200 * sc, 44, 8, "#b98a5a", 3);
    fillRound(px - 92 * sc, 596, 184 * sc, 6, 3, "rgba(255,255,255,0.25)");
    if (two && sel) {
      const pulse = 0.55 + Math.sin(game.time * 5) * 0.2;
      drawEllipse(px, 620, 96 * sc / 0.72 * 0.72 + 14, 26, "rgba(242,177,52," + pulse.toFixed(2) + ")");
    }
    drawPlate(px, 618, 110 * (sc / 0.95));
    drawBurger(px, PLATE_BASE_Y, game.plates[i], sc);
    if (two) {
      drawText("طلب " + (i + 1), px, 654, 14, sel ? "#7a3b00" : "#1a110b");
    }
  }
}

function drawKitchenScene() {
  drawKitchenWall();
  drawHood();
  drawUtensilRail();
  drawPrepCounter();
  drawKitchenTickets();
  drawSauceRack();
  drawBins();
  drawFreezer();
  drawStove();
  drawPlates();
  drawFlyers();
  drawStream();
  drawVignette();
  drawHotspotButtons();
  drawHud();
  drawMessage();
}

function drawLaptopOnCounter() {
  const hot = game.hover === "laptop";
  const b = laptopScreenBox;

  // القاعدة والكيبورد
  withShadow(18, 10, "rgba(0,0,0,0.45)", function () {
    ctx.fillStyle = vGradient(585, 618, "#4a4f55", "#2c3036");
    ctx.beginPath();
    ctx.moveTo(116, 585);
    ctx.lineTo(374, 585);
    ctx.lineTo(396, 618);
    ctx.lineTo(94, 618);
    ctx.closePath();
    ctx.fill();
  });
  for (let r = 0; r < 2; r++) {
    for (let k = 0; k < 11; k++) {
      ctx.fillStyle = hot ? "rgba(143,220,90,0.55)" : "rgba(255,255,255,0.14)";
      ctx.fillRect(138 + k * 21, 590 + r * 9, 17, 5);
    }
  }
  fillRound(220, 608, 50, 6, 3, "rgba(255,255,255,0.18)");

  // الشاشة
  fillRound(b.x - 12, b.y - 12, b.w + 24, b.h + 24, 10, "#1a1d21");
  drawEllipse(b.x + b.w / 2, b.y - 5, 2.5, 2.5, "#3a4a55");
  fillRound(b.x, b.y, b.w, b.h, 4, hot ? vGradient(b.y, b.y + b.h, "#4ab3e0", "#2a7fa4") : vGradient(b.y, b.y + b.h, "#2f8fb0", "#14304a"));
  fillRound(b.x, b.y, b.w, 18, 4, "rgba(0,0,0,0.3)");
  drawText("Burger OS", b.x + 8, b.y + 13, 11, "#fff3df", "left");
  const icons = ["#f2b134", "#5aa335", "#d62f2a", "#3d6fbf"];
  for (let i = 0; i < 4; i++) {
    const ix = b.x + 14 + i * 48;
    fillRound(ix, b.y + 34, 38, 38, 9, icons[i]);
    fillRound(ix + 3, b.y + 36, 32, 14, 6, "rgba(255,255,255,0.25)");
  }
  // لمعة على الشاشة
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.moveTo(b.x, b.y + 20);
  ctx.lineTo(b.x + 90, b.y + 20);
  ctx.lineTo(b.x + 40, b.y + b.h);
  ctx.lineTo(b.x, b.y + b.h);
  ctx.closePath();
  ctx.fill();
  drawText("اضغط هنا", b.x + b.w / 2, b.y + 108, hot ? 20 : 18, "#fff3df");

  // نقطة حمرا لو فيه جديد
  if (game.deliveries.length > 0 || game.unreadReviews > 0) {
    drawEllipse(b.x + b.w - 4, b.y + 4, 9, 9, "#d62f2a");
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(b.x + b.w - 4, b.y + 4, 9, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawMenuBook() {
  const b = BOOK_BOX;
  const hot = game.hover === "book";
  ctx.save();
  ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
  ctx.rotate(-0.06);
  withShadow(14, 8, "rgba(0,0,0,0.5)", function () {
    fillRound(-b.w / 2, -b.h / 2 + 8, b.w, b.h - 8, 8, "#3a1a10");
  });
  fillRound(-b.w / 2 + 6, -b.h / 2 + 2, b.w - 12, b.h - 12, 6, "#f4e6c8");
  fillRound(-b.w / 2, -b.h / 2, b.w - 8, b.h - 14, 8, hot ? vGradient(-b.h / 2, b.h / 2, "#c4483c", "#8a2a20") : vGradient(-b.h / 2, b.h / 2, "#a8382e", "#6e1f18"));
  strokeRound(-b.w / 2 + 8, -b.h / 2 + 8, b.w - 24, b.h - 30, 5, "#f2b134", 2);
  drawText("المنيو", -b.w / 2 + (b.w - 8) / 2, 6, 26, "#f2b134");
  drawText("اضغط وافتح", -b.w / 2 + (b.w - 8) / 2, 28, 13, "#ffe9a8");
  ctx.restore();
}

function drawShopIcon(key, cx, cy) {
  if (key === "buns") {
    drawEllipse(cx - 12, cy + 8, 18, 12, "#d9893b");
    drawEllipse(cx + 12, cy + 8, 18, 12, "#d9893b");
    drawEllipse(cx, cy - 6, 18, 12, "#e8a04d");
  } else if (key === "patties") {
    drawEllipse(cx, cy + 10, 24, 9, "#a8483f");
    drawEllipse(cx, cy + 2, 24, 9, "#d77a72");
    drawEllipse(cx, cy - 8, 24, 9, "#a8483f");
    drawEllipse(cx, cy - 15, 24, 9, "#d77a72");
  } else if (key === "cheese") {
    fillRound(cx - 22, cy + 4, 44, 11, 3, "#f2c230");
    fillRound(cx - 18, cy - 8, 44, 11, 3, "#f7d24d");
    fillRound(cx - 24, cy - 20, 44, 11, 3, "#f2c230");
  } else if (key === "potatoes") {
    drawEllipse(cx - 10, cy + 6, 14, 10, "#c9a15a");
    drawEllipse(cx + 12, cy + 4, 14, 10, "#b98d46");
    drawEllipse(cx, cy - 8, 14, 10, "#c9a15a");
  } else if (key === "cups") {
    drawCup(cx - 8, cy + 22, 0.6, null, 0);
    drawCup(cx + 10, cy + 26, 0.6, null, 0);
  } else if (key === "cola" || key === "orange") {
    drawCup(cx, cy + 24, 0.62, key);
  } else {
    let sauce = SAUCES[0];
    for (let i = 0; i < SAUCES.length; i++) {
      if (SAUCES[i].key === key) {
        sauce = SAUCES[i];
      }
    }
    fillRound(cx - 14, cy - 10, 28, 36, 8, sauce.color);
    fillRound(cx - 6, cy - 22, 12, 14, 3, sauce.cap);
  }
}

function drawStream() {
  const st = game.stream;
  if (st === null) {
    return;
  }
  const p = st.t / st.dur;
  const head = Math.min(1, p * 2.2);
  const tail = Math.max(0, (p - 0.55) / 0.45);
  const cx = st.x0 + (st.x1 - st.x0) * 0.1;
  const cy = st.y0 + 70;
  ctx.strokeStyle = st.color;
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let k = 0; k <= 12; k++) {
    const s = tail + (head - tail) * (k / 12);
    const x = (1 - s) * (1 - s) * st.x0 + 2 * (1 - s) * s * cx + s * s * st.x1;
    const y = (1 - s) * (1 - s) * st.y0 + 2 * (1 - s) * s * cy + s * s * st.y1;
    if (k === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  if (head >= 1) {
    drawEllipse(st.x1, st.y1 + 2, 24 * Math.min(1, (p - 0.4) * 3), 6, st.color);
  }
}

// ---------- لمسات إضافية ----------

function lerpColor(a, b, t) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map(function (v, i) { return Math.round(v + (pb[i] - v) * t); });
  return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
}

// تراب بيعوم في شعاع الشمس
function drawDust() {
  if (settings.quality === "low") {
    return;
  }
  for (let i = 0; i < 22; i++) {
    const x = 130 + ((i * 53 + game.time * (6 + (i % 4) * 3)) % 440);
    const y = 160 + ((i * 41 + game.time * (4 + (i % 3) * 2)) % 300);
    const a = 0.12 + 0.12 * Math.sin(game.time * 1.5 + i);
    drawEllipse(x, y, 1.6 + (i % 3) * 0.6, 1.6 + (i % 3) * 0.6, "rgba(255,240,200," + a.toFixed(2) + ")");
  }
}

// لون الجو بيتغير مع اليوم: صبح بارد وآخر اليوم دافي
function drawDayTint() {
  if (game.tut || settings.quality === "low") {
    return;
  }
  const t = Math.max(0, Math.min(1, (game.minutes - 540) / 480));
  if (t > 0.65) {
    ctx.fillStyle = "rgba(255,140,50," + (((t - 0.65) / 0.35) * 0.14).toFixed(3) + ")";
    ctx.fillRect(0, 64, 1280, 656);
  } else if (t < 0.15) {
    ctx.fillStyle = "rgba(170,200,255," + (((0.15 - t) / 0.15) * 0.08).toFixed(3) + ")";
    ctx.fillRect(0, 64, 1280, 656);
  }
}

// إيدين الزباين على الكاونتر (بتتحرك لما يتكلموا)
function drawHands() {
  const L = layout();
  const sc = slotCount() === 2 ? 0.82 : 1;
  for (let i = 0; i < slotCount(); i++) {
    const c = game.customers[i];
    if (c === null) {
      continue;
    }
    const spread = (c.look.kid ? 58 : 80) * sc;
    const talking = c.state === "ordering" && c.enter >= 1 && c.dlg.t * TALK_SPEED < c.dlg.lines[c.dlg.idx].length;
    for (let side = -1; side <= 1; side += 2) {
      const lift = talking && side === 1 ? Math.abs(Math.sin(game.time * 9 + i)) * 14 : 0;
      const hx = L.cust[i] + side * spread;
      const hy = 462 - lift;
      ctx.save();
      ctx.translate(hx, hy);
      ctx.scale(sc, sc);
      drawEllipse(0, 0, 22, 13, c.look.skin);
      for (let f = -1; f <= 1; f++) {
        drawEllipse(f * 9, -9, 5, 6, c.look.skin);
      }
      ctx.strokeStyle = "rgba(58,33,18,0.6)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 13, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

// أدوات المطبخ متعلقة على الحيطة
function drawUtensilRail() {
  outlinedRound(796, 168, 440, 8, 3, metalGradient(168, 176), 2);
  for (let i = 0; i < 6; i++) {
    const x = 826 + i * 72;
    const sway = Math.sin(game.time * 1.4 + i) * 1.5;
    ctx.save();
    ctx.translate(x, 176);
    ctx.rotate(sway * 0.02);
    ctx.strokeStyle = "#5a6068";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 62);
    ctx.stroke();
    if (i % 4 === 0) {
      drawEllipse(0, 74, 16, 14, "#9aa3ab");
    } else if (i % 4 === 1) {
      outlinedRound(-12, 62, 24, 36, 5, "#c3cad0", 2);
    } else if (i % 4 === 2) {
      ctx.strokeStyle = "#c3cad0";
      ctx.lineWidth = 2;
      for (let k = -1; k <= 1; k++) {
        ctx.beginPath();
        ctx.ellipse(k * 3, 82, 6, 20, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      drawEllipse(0, 82, 20, 20, "#3a3f45");
      drawEllipse(0, 82, 14, 14, "#2a2e33");
    }
    ctx.restore();
    drawEllipse(x, 176, 4, 4, "#8a939b");
  }
}
