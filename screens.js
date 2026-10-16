// ===== screens.js: القائمة الرئيسية وشاشة التحميل وتقرير اليوم =====

const MENU_FLOATERS = ["bun", "patty", "cheese", "fries", "cup", "star", "bun", "patty", "cheese", "fries", "cup", "star", "bun", "star"];

// عناصر عايمة في الخلفية (رغيف وبطاطس وكوباية...)
function drawFloaters() {
  for (let i = 0; i < MENU_FLOATERS.length; i++) {
    const x = ((i * 137 + game.time * (14 + (i % 5) * 4)) % 1500) - 110;
    const y = 90 + ((i * 73) % 540) + Math.sin(game.time * 0.8 + i) * 22;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(game.time * 0.35 + i);
    ctx.globalAlpha = 0.2;
    const k = MENU_FLOATERS[i];
    if (k === "bun") {
      drawEllipse(0, 0, 30, 20, "#f0a94d");
      drawEllipse(0, -6, 16, 5, "#fff3df");
    } else if (k === "patty") {
      drawEllipse(0, 0, 28, 18, "#8a5230");
    } else if (k === "cheese") {
      fillRound(-24, -14, 48, 28, 4, "#f2c230");
    } else if (k === "fries") {
      drawFries(0, 14, 0.8, "cooked");
    } else if (k === "cup") {
      drawCup(0, 30, 0.7, "cola");
    } else {
      drawStar(0, 0, 18, "#f2b134");
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

function drawPlayerCard() {
  const p = game.profile;
  if (!p) {
    return;
  }
  outlinedRound(24, 20, 340, 92, 18, "rgba(30,18,10,0.82)", 3, "rgba(242,177,52,0.75)");
  drawAvatar(CHARACTERS[p.avatar % CHARACTERS.length], 318, 66, 34);
  drawText(p.name, 270, 52, 22, "#fff3df", "right");
  const xp = p.xp || 0;
  const lv = levelFromXp(xp);
  drawText("ليفل " + lv, 270, 76, 16, "#f2b134", "right");
  const prev = levelStartXp(lv);
  const next = levelStartXp(lv + 1);
  fillRound(40, 90, 230, 10, 5, "rgba(0,0,0,0.5)");
  fillRound(40, 90, Math.max(8, 230 * Math.min(1, (xp - prev) / (next - prev))), 10, 5, "#f2b134");
}

// زباين صغيرين بيمشوا تحت في الشارع
function drawWalkers() {
  if (settings.quality === "low") {
    return;
  }
  for (let i = 0; i < 8; i++) {
    const x = ((i * 190 + game.time * (36 + (i % 3) * 8)) % 1500) - 110;
    const bob = Math.abs(Math.sin(game.time * 8 + i)) * 4;
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.translate(x, 706 - bob);
    ctx.scale(0.2, 0.2);
    ctx.translate(-640, -542);
    drawCustomerBody(CHARACTERS[i], 1, false);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawMenuScene() {
  ctx.fillStyle = vGradient(0, 720, "#3d2312", "#150c07");
  ctx.fillRect(0, 0, 1280, 720);
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 + game.time * 0.05;
    ctx.fillStyle = "rgba(255,214,130,0.055)";
    ctx.beginPath();
    ctx.moveTo(400, 380);
    ctx.lineTo(400 + Math.cos(a - 0.09) * 1000, 380 + Math.sin(a - 0.09) * 1000);
    ctx.lineTo(400 + Math.cos(a + 0.09) * 1000, 380 + Math.sin(a + 0.09) * 1000);
    ctx.closePath();
    ctx.fill();
  }
  const glow = ctx.createRadialGradient(400, 380, 20, 400, 380, 440 + Math.sin(game.time * 1.6) * 20);
  glow.addColorStop(0, "rgba(242,177,52,0.4)");
  glow.addColorStop(1, "rgba(242,177,52,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1280, 720);
  if (settings.quality !== "low") {
    for (let i = 0; i < 14; i++) {
      const bx = (i * 97) % 1280;
      const by = 80 + ((i * 131) % 560) + Math.sin(game.time * 0.6 + i) * 18;
      drawEllipse(bx, by, 10 + (i % 4) * 5, 10 + (i % 4) * 5, "rgba(255,214,130," + (0.05 + 0.03 * Math.sin(game.time + i)).toFixed(3) + ")");
    }
  }
  drawFloaters();
  drawWalkers();

  // اللوجو بيطلع وينزل ولمعة بتعدّي عليه
  const bob = Math.sin(game.time * 1.8) * 7;
  const lx = 150;
  const ly = 126 + bob;
  if (imageReady("logo")) {
    withShadow(34, 14, "rgba(0,0,0,0.6)", function () {
      fillRound(lx, ly, 460, 460, 52, "#2b1d14");
    });
    ctx.save();
    roundRectPath(lx, ly, 460, 460, 52);
    ctx.clip();
    ctx.drawImage(IMAGES.logo, lx, ly, 460, 460);
    const sx = lx - 200 + ((game.time * 160) % 900);
    const sheen = ctx.createLinearGradient(sx, 0, sx + 120, 0);
    sheen.addColorStop(0, "rgba(255,255,255,0)");
    sheen.addColorStop(0.5, "rgba(255,255,255,0.22)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(lx, ly, 460, 460);
    ctx.restore();
    strokeRound(lx, ly, 460, 460, 52, "rgba(242,177,52,0.9)", 5);
  } else {
    drawText("برجر الحريف", 380, 360, 70, "#f2b134");
  }
  drawText("مطعم برجر في قلب القاهرة", 380, 640, 22, "#ffe9a8");

  drawPlayerCard();

  const labeled = getHotspots().filter(function (h) { return h.label; });
  const panelH = 90 + labeled.length * 58;
  withShadow(24, 10, "rgba(0,0,0,0.5)", function () {
    outlinedRound(730, 120, 400, panelH, 26, "rgba(30,18,10,0.8)", 3, "rgba(242,177,52,0.75)");
  });
  fillRound(742, 130, 376, 38, 16, "rgba(242,177,52,0.18)");
  drawText("القائمة الرئيسية", 930, 157, 21, "#f2b134");
  drawHotspotButtons();
  if (game.saveInfo !== null && game.profile) {
    drawText("فيه لعبة محفوظة: اليوم " + game.saveInfo.day, 930, 120 + panelH + 26, 16, "#8fdc5a");
  }
  if (game.menuNote) {
    drawText(game.menuNote, 930, 120 + panelH + 52, 15, "#ffd36b");
  }
  fillRound(470, 664, 340, 30, 15, "rgba(21,12,7,0.78)");
  drawText("صنع بواسطة " + CREATOR_NAME, 640, 685, 15, "#ffe9a8");
  fillRound(1176, 686, 90, 24, 12, "rgba(21,12,7,0.78)");
  drawText("الإصدار " + GAME_VERSION, 1256, 704, 14, "#a88a6a", "right");
  drawVignette(0);
}

// ---------- شاشة التحميل ----------

function easeBounce(p) {
  const n = 7.5625;
  const d = 2.75;
  if (p < 1 / d) {
    return n * p * p;
  }
  if (p < 2 / d) {
    p = p - 1.5 / d;
    return n * p * p + 0.75;
  }
  if (p < 2.5 / d) {
    p = p - 2.25 / d;
    return n * p * p + 0.9375;
  }
  p = p - 2.625 / d;
  return n * p * p + 0.984375;
}

const LOAD_LAYERS = [
  { type: "bun", th: 0.06 }, { type: "patty", th: 0.26 }, { type: "cheese", th: 0.44 },
  { type: "sauce", th: 0.62, color: "#d62f2a" }, { type: "patty2", th: 0.76 }, { type: "bun", th: 0.88 }
];

function drawLoadSprite(type, x, y) {
  if (type === "bun") {
    drawEllipse(x, y, 40, 24, "#f0a94d");
    drawEllipse(x, y - 6, 22, 7, "rgba(255,255,255,0.35)");
  } else if (type === "patty" || type === "patty2") {
    drawEllipse(x, y, 38, 17, "#6b3a1f");
  } else if (type === "cheese") {
    outlinedRound(x - 38, y - 6, 76, 12, 3, "#f2c230", 2);
  } else {
    outlinedRound(x - 34, y - 6, 68, 12, 6, "#d62f2a", 2);
  }
}

function drawLoadingScene() {
  const L = game.loading;
  const frac = Math.min(1, L.t / L.dur);
  const eased = 1 - Math.pow(1 - frac, 2);
  ctx.fillStyle = vGradient(0, 720, "#3d2312", "#150c07");
  ctx.fillRect(0, 0, 1280, 720);
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 + game.time * 0.07;
    ctx.fillStyle = "rgba(255,214,130,0.05)";
    ctx.beginPath();
    ctx.moveTo(640, 250);
    ctx.lineTo(640 + Math.cos(a - 0.09) * 1100, 250 + Math.sin(a - 0.09) * 1100);
    ctx.lineTo(640 + Math.cos(a + 0.09) * 1100, 250 + Math.sin(a + 0.09) * 1100);
    ctx.closePath();
    ctx.fill();
  }
  const glow = ctx.createRadialGradient(640, 250, 20, 640, 250, 640);
  glow.addColorStop(0, "rgba(242,177,52,0.3)");
  glow.addColorStop(1, "rgba(242,177,52,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1280, 720);
  drawFloaters();

  // البنر (بيظهر بنعومة وبيقرب وبتعدّي عليه لمعة)
  const fade = Math.min(1, L.t / 0.5);
  const bx0 = 227;
  const by0 = 52;
  const bw = 826;
  const bh = 314;
  ctx.globalAlpha = fade;
  if (imageReady("loading")) {
    const zoom = 1 + 0.06 * frac;
    withShadow(34, 14, "rgba(0,0,0,0.6)", function () {
      fillRound(bx0, by0, bw, bh, 24, "#1a110b");
    });
    ctx.save();
    roundRectPath(bx0, by0, bw, bh, 24);
    ctx.clip();
    ctx.translate(bx0 + bw / 2, by0 + bh / 2);
    ctx.scale(zoom, zoom);
    ctx.drawImage(IMAGES.loading, -bw / 2, -bh / 2, bw, bh);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();
    ctx.save();
    roundRectPath(bx0, by0, bw, bh, 24);
    ctx.clip();
    const sx = bx0 - 200 + ((game.time * 260) % (bw + 400));
    const sheen = ctx.createLinearGradient(sx, 0, sx + 160, 0);
    sheen.addColorStop(0, "rgba(255,255,255,0)");
    sheen.addColorStop(0.5, "rgba(255,255,255,0.25)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(bx0, by0, bw, bh);
    ctx.restore();
    const pulse = 0.7 + Math.sin(game.time * 4) * 0.3;
    strokeRound(bx0, by0, bw, bh, 24, "rgba(242,177,52," + pulse.toFixed(2) + ")", 5);
  } else {
    drawText("برجر الحريف", 640, 230, 80, "#f2b134");
  }
  ctx.globalAlpha = 1;

  // برجر بيتبني مع التحميل
  const cx = 640;
  const baseY = 512;
  const sc = 0.85;
  drawPlate(cx, baseY + 8, 120);
  const landed = [];
  let dropping = null;
  for (let i = 0; i < LOAD_LAYERS.length; i++) {
    const ly = LOAD_LAYERS[i];
    const p = Math.max(0, Math.min(1, (frac - ly.th) / 0.1));
    const layer = ly.type === "patty2" ? { type: "patty", doneness: "cooked" } : (ly.type === "patty" ? { type: "patty", doneness: "cooked" } : (ly.type === "sauce" ? { type: "sauce", color: ly.color } : { type: ly.type }));
    if (p >= 1) {
      landed.push(layer);
    } else if (p > 0 && dropping === null) {
      dropping = { ly: ly, p: p };
    }
  }
  const squash = 1 + Math.sin(Math.min(1, (frac * 10) % 1) * Math.PI) * 0.03;
  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(1, squash);
  ctx.translate(-cx, -baseY);
  const top = drawBurger(cx, baseY, landed, sc);
  ctx.restore();
  if (dropping !== null) {
    const e = easeBounce(dropping.p);
    const side = LOAD_LAYERS.indexOf(dropping.ly) % 2 === 0 ? -1 : 1;
    const sx = cx + side * (1 - dropping.p) * 280;
    const sy = top - 20 - (1 - e) * 170;
    drawLoadSprite(dropping.ly.type, sx, sy);
  }
  if (frac >= 1) {
    for (let k = 0; k < 6; k++) {
      const a = game.time * 3 + k * 1.05;
      drawStar(cx + Math.cos(a) * 130, top + 40 + Math.sin(a * 1.4) * 40, 7, "rgba(255,233,168,0.9)");
    }
  }

  // شريط التقدم
  const bx = 360;
  const bwid = 560;
  outlinedRound(bx, 556, bwid, 24, 12, "#1a110b", 3, "rgba(242,177,52,0.6)");
  const fw = Math.max(24, bwid * eased);
  roundRectPath(bx, 556, fw, 24, 12);
  const bar = ctx.createLinearGradient(0, 556, 0, 580);
  bar.addColorStop(0, "#ffd36b");
  bar.addColorStop(1, "#d9921c");
  ctx.fillStyle = bar;
  ctx.fill();
  ctx.save();
  roundRectPath(bx, 556, fw, 24, 12);
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(bx + ((game.time * 220) % (fw + 60)) - 30, 556, 22, 24);
  ctx.restore();
  const dots = ".".repeat(Math.floor(game.time * 3) % 4);
  drawText("جاري التحميل" + dots, 640, 614, 21, "#fff3df");
  drawText(Math.floor(eased * 100) + "%", bx + bwid, 614, 17, "#f2b134", "right");

  // نصيحة بتتغير
  const tips = LOADING_TIPS;
  const ti = Math.floor(L.t / 2.2) % tips.length;
  const tph = (L.t % 2.2) / 2.2;
  const talpha = Math.min(1, tph * 6) * Math.min(1, (1 - tph) * 6);
  outlinedRound(240, 636, 800, 40, 16, "rgba(30,18,10,0.8)", 2, "rgba(242,177,52,0.5)");
  drawStar(272, 656, 10, "#f2b134");
  ctx.globalAlpha = talpha;
  drawText(tips[ti], 660, 662, 17, "#ffe9a8");
  ctx.globalAlpha = 1;
  drawText("By " + CREATOR_NAME, 640, 704, 14, "#8a6d55");
  drawVignette(0);

  // ستاير بتقفل لما التحميل يخلص
  const outT = Math.max(0, Math.min(1, (L.t - L.dur) / 0.4));
  if (outT > 0) {
    const w = 640 * outT;
    ctx.fillStyle = "#150c07";
    ctx.fillRect(0, 0, w, 720);
    ctx.fillRect(1280 - w, 0, w, 720);
    ctx.fillStyle = "#f2b134";
    ctx.fillRect(w - 4, 0, 4, 720);
    ctx.fillRect(1280 - w, 0, 4, 720);
  }
}

// ---------- تقرير آخر اليوم (على شكل فاتورة) ----------

function drawResultsScene() {
  ctx.fillStyle = vGradient(0, 720, "#3d2312", "#150c07");
  ctx.fillRect(0, 0, 1280, 720);
  drawFloaters();
  drawVignette(0);

  // الورقة بحافة مسننة من تحت
  withShadow(30, 12, "rgba(0,0,0,0.55)", function () {
    ctx.beginPath();
    ctx.moveTo(340, 40);
    ctx.lineTo(940, 40);
    ctx.lineTo(940, 676);
    for (let x = 940; x > 340; x -= 20) {
      ctx.lineTo(x - 10, 692);
      ctx.lineTo(x - 20, 676);
    }
    ctx.closePath();
    ctx.fillStyle = "#fff6e4";
    ctx.fill();
  });
  ctx.strokeStyle = "rgba(90,58,38,0.35)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(358, 58, 564, 590);
  ctx.setLineDash([]);

  drawText("برجر الحريف", 640, 100, 34, "#c97a30");
  drawText("تقرير اليوم " + game.day, 640, 138, 24, "#2b1d14");
  ctx.fillStyle = "#f2b134";
  ctx.fillRect(420, 150, 440, 4);

  const st = game.stats;
  const profit = st.revenue - st.spent - st.upgrades;
  const avg = averageRating();
  const rows = [
    ["زباين اتخدموا", String(st.served), "#2b1d14"],
    ["زباين مشيوا زهقانين", String(st.left), "#2b1d14"],
    ["طلبات اترفضت", String(st.rejected), "#2b1d14"],
    ["المبيعات والبقشيش", st.revenue + " EGP", "#2b1d14"],
    ["مصاريف المكونات", (st.spent > 0 ? "-" : "") + st.spent + " EGP", st.spent > 0 ? "#b3261e" : "#2b1d14"],
    ["تطويرات", (st.upgrades > 0 ? "-" : "") + st.upgrades + " EGP", st.upgrades > 0 ? "#b3261e" : "#2b1d14"],
    ["الربح", (profit >= 0 ? "+" : "") + profit + " EGP", profit >= 0 ? "#2f7a1a" : "#b3261e"],
    ["فايدة البنك", (st.interest > 0 ? "+" : "") + st.interest + " EGP", st.interest > 0 ? "#2f7a1a" : "#2b1d14"],
    ["أقساط القروض", (st.loanPaid > 0 ? "-" : "") + st.loanPaid + " EGP", st.loanPaid > 0 ? "#b3261e" : "#2b1d14"],
    ["التقييم العام", avg === null ? "-" : avg.toFixed(1) + " / 5", "#2b1d14"],
    ["الكاش دلوقتي", game.cash + " EGP", "#2b1d14"],
    ["رصيد البنك", game.bank.balance + " EGP", "#2b1d14"]
  ];
  for (let i = 0; i < rows.length; i++) {
    const y = 192 + i * 31;
    const strong = i === 6;
    if (strong) {
      fillRound(380, y - 20, 520, 28, 8, "rgba(242,177,52,0.22)");
    }
    drawText(rows[i][0], 890, y, strong ? 21 : 19, "#6b4a32", "right");
    drawText(rows[i][1], 392, y, strong ? 22 : 20, rows[i][2], "left");
    ctx.font = "bold 20px " + FONT;
    const valueEnd = 392 + ctx.measureText(rows[i][1]).width + 14;
    ctx.font = "bold " + (strong ? 21 : 19) + "px " + FONT;
    const labelStart = 890 - ctx.measureText(rows[i][0]).width - 12;
    ctx.fillStyle = "rgba(90,58,38,0.3)";
    for (let dx = valueEnd; dx < labelStart; dx += 12) {
      ctx.fillRect(dx, y - 4, 5, 2);
    }
  }
  if (st.loanMissed > 0) {
    drawText("تنبيه: اتأخرت عن قسط قرض!", 640, 584, 17, "#b3261e");
  } else {
    drawText("تم حفظ تقدمك تلقائياً", 640, 584, 15, "#8a6d55");
  }

  // ختم
  ctx.save();
  ctx.translate(866, 104);
  ctx.rotate(-0.28);
  strokeRound(-56, -22, 112, 44, 8, "rgba(201,58,52,0.75)", 4);
  drawText("تم", 0, 9, 28, "rgba(201,58,52,0.75)");
  ctx.restore();

  drawHotspotButtons();
}
