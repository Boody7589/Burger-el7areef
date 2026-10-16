// ===== laptop.js: نظام Burger OS (الشاشة الرئيسية والتطبيقات والبنك) =====

// ---------- أيقونات التطبيقات ----------

function drawAppIcon(key, cx, cy, size, color, locked) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  const r = size * 0.22;
  const s = size;
  withShadow(10, 5, "rgba(0,0,0,0.4)", function () {
    fillRound(x, y, size, size, r, vGradient(y, y + size, color, "rgba(0,0,0,0.35)"));
  });
  fillRound(x, y, size, size, r, color);
  fillRound(x + 4, y + 3, size - 8, size / 2 - 3, r * 0.8, "rgba(255,255,255,0.25)");
  strokeRound(x, y, size, size, r, "rgba(26,17,11,0.8)", 3);

  const cream = "#fff3df";
  ctx.fillStyle = cream;
  if (key === "shop") {
    fillRound(cx - s * 0.22, cy - s * 0.05, s * 0.44, s * 0.36, 6, cream);
    ctx.strokeStyle = cream;
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.05, s * 0.12, Math.PI, Math.PI * 2);
    ctx.stroke();
  } else if (key === "upgrades") {
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.27);
    ctx.lineTo(cx + s * 0.22, cy);
    ctx.lineTo(cx + s * 0.09, cy);
    ctx.lineTo(cx + s * 0.09, cy + s * 0.25);
    ctx.lineTo(cx - s * 0.09, cy + s * 0.25);
    ctx.lineTo(cx - s * 0.09, cy);
    ctx.lineTo(cx - s * 0.22, cy);
    ctx.closePath();
    ctx.fill();
  } else if (key === "reviews") {
    drawStar(cx, cy + 2, s * 0.3, cream);
  } else if (key === "reports") {
    fillRound(cx - s * 0.24, cy + s * 0.05, s * 0.12, s * 0.2, 3, cream);
    fillRound(cx - s * 0.06, cy - s * 0.1, s * 0.12, s * 0.35, 3, cream);
    fillRound(cx + s * 0.12, cy - s * 0.22, s * 0.12, s * 0.47, 3, cream);
  } else if (key === "bank") {
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.3, cy - s * 0.06);
    ctx.lineTo(cx, cy - s * 0.28);
    ctx.lineTo(cx + s * 0.3, cy - s * 0.06);
    ctx.closePath();
    ctx.fill();
    for (let k = 0; k < 3; k++) {
      fillRound(cx - s * 0.22 + k * s * 0.17, cy - s * 0.02, s * 0.1, s * 0.24, 2, cream);
    }
    fillRound(cx - s * 0.3, cy + s * 0.24, s * 0.6, s * 0.07, 2, cream);
  } else if (key === "staff") {
    drawEllipse(cx, cy - s * 0.12, s * 0.1, s * 0.1, cream);
    ctx.beginPath();
    ctx.ellipse(cx, cy + s * 0.22, s * 0.2, s * 0.15, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.27, cy - s * 0.02);
    ctx.lineTo(cx, cy - s * 0.27);
    ctx.lineTo(cx + s * 0.27, cy - s * 0.02);
    ctx.closePath();
    ctx.fill();
    fillRound(cx - s * 0.18, cy - s * 0.02, s * 0.36, s * 0.26, 3, cream);
    fillRound(cx - s * 0.05, cy + s * 0.08, s * 0.1, s * 0.16, 2, color);
  }
  if (locked) {
    fillRound(x, y, size, size, r, "rgba(20,14,10,0.62)");
    ctx.strokeStyle = "#f2b134";
    ctx.lineWidth = Math.max(2, s * 0.04);
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.08, s * 0.1, Math.PI, Math.PI * 2);
    ctx.stroke();
    fillRound(cx - s * 0.15, cy - s * 0.08, s * 0.3, s * 0.24, 4, "#f2b134");
  }
}

function drawBadge(x, y, n) {
  drawEllipse(x, y, 14, 14, "#d62f2a");
  ctx.strokeStyle = "#fff3df";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.stroke();
  drawText(String(n), x, y + 6, 16, "#fff3df");
}

// ---------- شريط الحالة ----------

function drawOsStatusBar() {
  fillRound(116, 106, 1048, 44, 10, "rgba(0,0,0,0.4)");
  drawEllipse(146, 134, 11, 6, "#e0953f");
  drawEllipse(146, 128, 11, 7, "#f0a94d");
  fillRound(135, 130, 22, 4, 2, "#6b3a1f");
  drawText("Burger OS", 168, 135, 19, "#fff3df", "left");

  drawEllipse(1142, 128, 10, 10, "#f2b134");
  drawText("E", 1142, 133, 12, "#2b1d14");
  drawText(game.cash + " EGP", 1124, 134, 17, "#fff3df", "right");
  drawText("البنك: " + game.bank.balance + " EGP", 640, 134, 16, "#a8e6b8");
  drawText(clockText(), 990, 134, 17, "#fff3df");

  ctx.strokeStyle = "#fff3df";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (let k = 1; k <= 3; k++) {
    ctx.beginPath();
    ctx.arc(910, 138, k * 6, -2.3, -0.84);
    ctx.stroke();
  }
  drawEllipse(910, 138, 2.5, 2.5, "#fff3df");
  strokeRound(836, 124, 30, 15, 3, "#fff3df", 2);
  fillRound(839, 127, 22, 9, 2, "#8fdc5a");
  fillRound(867, 128, 3, 7, 1, "#fff3df");
}

// ---------- الشاشة الرئيسية ----------

function drawOsWallpaper() {
  fillRound(116, 106, 1048, 508, 10, vGradient(106, 614, "#2f8fb0", "#14304a"));
  const glow = ctx.createRadialGradient(640, 380, 20, 640, 380, 480);
  glow.addColorStop(0, "rgba(255,225,150,0.24)");
  glow.addColorStop(1, "rgba(255,225,150,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(116, 150, 1048, 464);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = -500; x < 1100; x += 70) {
    ctx.moveTo(116 + x + 500, 614);
    ctx.lineTo(116 + x + 900, 150);
  }
  ctx.stroke();
  if (imageReady("logo")) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.3;
    ctx.drawImage(IMAGES.logo, 450, 205, 380, 380);
    ctx.restore();
  }
}

function drawPill(cx, text, color) {
  fillRound(cx - 98, 160, 196, 30, 15, "rgba(0,0,0,0.3)");
  strokeRound(cx - 98, 160, 196, 30, 15, "rgba(255,255,255,0.15)", 2);
  drawText(text, cx, 181, 15, color);
}

function drawOsHome() {
  drawOsWallpaper();
  drawOsStatusBar();
  const avg = averageRating();
  drawPill(330, "يوم " + game.day + " - " + clockText(), "#fff3df");
  drawPill(535, "كاش: " + game.cash + " EGP", "#f2b134");
  drawPill(745, "بنك: " + game.bank.balance + " EGP", "#a8e6b8");
  drawPill(950, "تقييم: " + (avg === null ? "-" : avg.toFixed(1)) + " / 5", "#ffd36b");

  for (let i = 0; i < OS_APPS.length; i++) {
    const a = OS_APPS[i];
    const c = OS_ICON_POS[i];
    const hot = game.hover === "app-" + a.key;
    drawAppIcon(a.key, c.x, c.y, hot ? 132 : 120, a.color, !!a.locked);
    drawText(a.name, c.x, c.y + 98, 20, "#fff3df");
    if (a.key === "shop" && game.deliveries.length > 0) {
      drawBadge(c.x + 56, c.y - 56, game.deliveries.length);
    }
    if (a.key === "reviews" && game.unreadReviews > 0) {
      drawBadge(c.x + 56, c.y - 56, Math.min(99, game.unreadReviews));
    }
    if (a.key === "bank" && game.bank.loans.length > 0) {
      drawBadge(c.x + 56, c.y - 56, game.bank.loans.length);
    }
    if (a.locked) {
      drawText("قريباً", c.x, c.y + 120, 14, "#8fb3c4");
    }
  }
}

// ---------- الشريط الجانبي ----------

function drawDock() {
  fillRound(126, 160, 170, 444, 10, "rgba(0,0,0,0.3)");
  const items = [{ key: "home", name: "الرئيسية", color: "#2f8fb0" }].concat(OS_APPS);
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const b = dockBox(i);
    const active = game.laptopTab === it.key;
    const hot = game.hover === "dock-" + it.key;
    fillRound(b.x, b.y, b.w, b.h, 10, active ? "rgba(242,177,52,0.92)" : (hot ? "rgba(255,243,223,0.22)" : "rgba(255,243,223,0.08)"));
    drawAppIcon(it.key, b.x + b.w - 26, b.y + b.h / 2, 32, it.color, !!it.locked);
    drawText(it.name, b.x + b.w - 50, b.y + b.h / 2 + 6, 15, active ? "#2b1d14" : "#fff3df", "right");
  }
}

function appInfo(key) {
  for (let i = 0; i < OS_APPS.length; i++) {
    if (OS_APPS[i].key === key) {
      return OS_APPS[i];
    }
  }
  return OS_APPS[0];
}

// ---------- مشهد اللابتوب ----------

function drawLaptopScene() {
  ctx.fillStyle = vGradient(0, 720, "#5a3a26", "#3a2819");
  ctx.fillRect(0, 0, 1280, 720);
  withShadow(30, 12, "rgba(0,0,0,0.5)", function () {
    outlinedRound(100, 90, 1080, 540, 18, "#1a1d21", 3, "rgba(255,255,255,0.15)");
  });
  drawEllipse(640, 99, 3, 3, "#3a4a55");

  if (game.laptopTab === "home") {
    drawOsHome();
  } else {
    fillRound(116, 106, 1048, 508, 10, vGradient(106, 614, "#1f4a63", "#14283a"));
    drawOsStatusBar();
    drawDock();

    // النافذة بتتفتح بأنيميشن
    const e = Math.min(1, game.appT);
    const ease = 1 - Math.pow(1 - e, 3);
    ctx.save();
    ctx.translate(735, 382);
    ctx.scale(0.94 + 0.06 * ease, 0.94 + 0.06 * ease);
    ctx.translate(-735, -382);
    ctx.globalAlpha = ease;
    fillRound(310, 160, 850, 444, 12, "rgba(0,0,0,0.18)");
    fillRound(310, 160, 850, 40, 12, "rgba(0,0,0,0.3)");
    const info = appInfo(game.laptopTab);
    drawAppIcon(info.key, 1136, 180, 28, info.color, false);
    drawText(info.name, 1112, 188, 20, "#fff3df", "right");
    if (game.laptopTab === "shop") {
      drawShopTab();
    } else if (game.laptopTab === "upgrades") {
      drawUpgradesTab();
    } else if (game.laptopTab === "reviews") {
      drawReviewsTab();
    } else if (game.laptopTab === "bank") {
      drawBankTab();
    } else {
      drawReportsTab();
    }
    ctx.restore();
  }

  drawHotspotButtons();
  drawHud();
  drawMessage();
}

// ---------- تطبيق طلب المكونات ----------

function drawShopTab() {
  drawText("صفحة " + (game.shopPage + 1) + " / " + shopPageCount(), 640, 188, 16, "#bfe3f2");
  const items = visibleShopItems();
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const y = shopRowY(i);
    fillRound(320, y, 580, 56, 12, "rgba(255,243,223,0.12)");
    fillRound(836, y + 6, 54, 44, 10, "rgba(0,0,0,0.25)");
    drawShopIcon(it.key, 863, y + 28);
    drawText(it.label, 824, y + 25, 20, "#fff3df", "right");
    drawText("حزمة " + it.pack + " = " + it.price + " EGP", 824, y + 46, 14, "#bfe3f2", "right");
    let stockText = "المخزون: " + game.stock[it.key];
    if (it.key === "patties") {
      stockText = "المخزون: " + game.stock.patties + " / " + freezerCap();
    }
    drawText(stockText, 640, y + 34, 18, "#fff3df");
    drawText(String(game.cart[it.key]), 420, y + 35, 22, "#f2b134");
  }
  const total = cartTotal();
  drawText("الإجمالي: " + total + " EGP", 340, 592, 22, "#fff3df", "left");
  if (!canPay(total)) {
    drawText("فلوسك مش كفاية", 560, 592, 18, "#ff7a70", "left");
  } else if (total > game.cash) {
    drawText("هيتدفع من البنك", 560, 592, 16, "#a8e6b8", "left");
  }

  fillRound(920, 214, 230, 380, 12, "rgba(0,0,0,0.25)");
  drawText("في الطريق", 1035, 244, 20, "#f2b134");
  if (game.deliveries.length === 0) {
    drawText("مفيش طلبيات", 1035, 290, 16, "#8fb3c4");
  }
  for (let i = 0; i < game.deliveries.length && i < 4; i++) {
    const d = game.deliveries[i];
    fillRound(932, 260 + i * 80, 206, 70, 10, "rgba(255,243,223,0.12)");
    drawText("طلبية رقم " + d.id, 1035, 286 + i * 80, 17, "#fff3df");
    drawText("توصل بعد " + Math.ceil(d.remaining) + " دقيقة", 1035, 312 + i * 80, 15, "#bfe3f2");
  }
}

// ---------- تطبيق التطويرات ----------

function drawUpgradesTab() {
  drawText("الكاش: " + game.cash + " EGP", 330, 188, 17, "#f2b134", "left");
  drawText("البنك: " + game.bank.balance + " EGP", 520, 188, 17, "#a8e6b8", "left");
  for (let i = 0; i < UPGRADES.length; i++) {
    const u = UPGRADES[i];
    const c = upgradeCardBox(i);
    const lvl = game.up[u.key] === undefined ? 0 : game.up[u.key];
    const owned = u.max > 0 && lvl >= u.max;
    fillRound(c.x, c.y, c.w, c.h, 12, owned ? "rgba(90,163,53,0.22)" : "rgba(255,243,223,0.12)");
    strokeRound(c.x, c.y, c.w, c.h, 12, owned ? "rgba(143,220,90,0.5)" : "rgba(255,255,255,0.1)", 2);
    drawText(u.name, c.x + c.w - 12, c.y + 24, 17, "#fff3df", "right");
    drawText(u.desc, c.x + c.w - 12, c.y + 48, 12, "#bfe3f2", "right");
    let info = "";
    if (u.max === 1) {
      info = lvl > 0 ? "مفتوح" : "مقفول";
    } else {
      info = "المستوى " + lvl + " / " + u.max;
    }
    if (u.key === "freezer") {
      info = info + " - السعة " + freezerCap();
    } else if (u.key === "soda") {
      info = info + " - " + sodaFillTime() + " ث";
    }
    drawText(info, c.x + c.w - 12, c.y + 72, 12, lvl > 0 ? "#8fdc5a" : "#f2b134", "right");
  }
}

// ---------- تطبيق التقييمات ----------

function drawReviewsTab() {
  const avg = averageRating();
  fillRound(320, 214, 240, 380, 12, "rgba(0,0,0,0.25)");
  drawText(avg === null ? "-" : avg.toFixed(1), 440, 320, 72, "#f2b134");
  drawStars(440, 360, 13, avg === null ? 0 : Math.round(avg));
  drawText("من " + game.ratingCount + " تقييم", 440, 410, 18, "#bfe3f2");
  drawText("التقييم العالي بيجيبلك", 440, 470, 15, "#8fb3c4");
  drawText("زباين أكتر", 440, 492, 15, "#8fb3c4");
  if (game.reviews.length === 0) {
    drawText("لسه مفيش تقييمات", 860, 330, 22, "#8fb3c4");
  }
  for (let i = 0; i < game.reviews.length && i < 5; i++) {
    const r = game.reviews[i];
    const y = 214 + i * 76;
    fillRound(580, y, 570, 68, 12, "rgba(255,243,223,0.12)");
    drawText(r.name, 1134, y + 26, 18, "#fff3df", "right");
    drawText(r.text, 1134, y + 52, 15, "#bfe3f2", "right");
    drawStars(660, y + 24, 8, r.stars);
    drawText("اليوم " + r.day, 610, y + 56, 13, "#8fb3c4", "left");
  }
}

// ---------- تطبيق التقارير ----------

function drawReportsTab() {
  const st = game.stats;
  fillRound(320, 214, 260, 380, 12, "rgba(0,0,0,0.25)");
  drawText("النهاردة (يوم " + game.day + ")", 450, 248, 20, "#f2b134");
  const rows = [
    ["زباين اتخدموا", String(st.served)],
    ["زباين مشيوا", String(st.left)],
    ["طلبات اترفضت", String(st.rejected)],
    ["المبيعات", st.revenue + " EGP"],
    ["مصاريف المكونات", st.spent + " EGP"],
    ["تطويرات", st.upgrades + " EGP"]
  ];
  for (let i = 0; i < rows.length; i++) {
    const y = 292 + i * 44;
    drawText(rows[i][0], 566, y, 16, "#bfe3f2", "right");
    drawText(rows[i][1], 336, y, 18, "#fff3df", "left");
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(336, y + 10, 230, 1);
  }
  fillRound(600, 214, 550, 380, 12, "rgba(0,0,0,0.25)");
  drawText("آخر الأيام", 1134, 248, 20, "#f2b134", "right");
  const hist = game.history.slice(-7);
  if (hist.length === 0) {
    drawText("لسه مفيش أيام اتسجلت", 875, 400, 20, "#8fb3c4");
    return;
  }
  let max = 100;
  for (let i = 0; i < hist.length; i++) {
    max = Math.max(max, hist[i].revenue, hist[i].spent);
  }
  const baseY = 470;
  for (let k = 0; k < hist.length; k++) {
    const h = hist[hist.length - 1 - k];
    const gx = 1100 - k * 70;
    const revH = (h.revenue / max) * 170;
    const costH = (h.spent / max) * 170;
    fillRound(gx - 56, baseY - revH, 26, Math.max(2, revH), 4, "#f2b134");
    fillRound(gx - 28, baseY - costH, 26, Math.max(2, costH), 4, "#d62f2a");
    drawText("يوم " + h.day, gx - 28, baseY + 22, 14, "#bfe3f2");
    drawText((h.profit >= 0 ? "+" : "") + h.profit, gx - 28, baseY + 42, 13, h.profit >= 0 ? "#8fdc5a" : "#ff7a70");
  }
  fillRound(640, 548, 14, 14, 3, "#f2b134");
  drawText("مبيعات", 662, 560, 14, "#fff3df", "left");
  fillRound(740, 548, 14, 14, 3, "#d62f2a");
  drawText("مصاريف", 762, 560, 14, "#fff3df", "left");
}

// ---------- تطبيق البنك ----------

function drawBankCard(x, y, w, h) {
  withShadow(16, 8, "rgba(0,0,0,0.45)", function () {
    outlinedRound(x, y, w, h, 18, vGradient(y, y + h, "#1f8a6a", "#0e4a3a"), 3);
  });
  ctx.save();
  roundRectPath(x, y, w, h, 18);
  ctx.clip();
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 3;
  for (let k = 0; k < 6; k++) {
    ctx.beginPath();
    ctx.arc(x + w, y + h, 60 + k * 36, Math.PI, Math.PI * 1.5);
    ctx.stroke();
  }
  ctx.restore();
  drawGloss(x, y, w, h, 14);
  fillRound(x + 18, y + 22, 40, 30, 6, "#f2d27a");
  strokeRound(x + 18, y + 22, 40, 30, 6, "rgba(0,0,0,0.4)", 2);
  drawText("بنك الحريف", x + w - 18, y + 38, 20, "#fff3df", "right");
  drawText("•••• •••• •••• 2026", x + 18, y + 98, 18, "#d9f5e8", "left");
  drawText("الرصيد", x + w - 18, y + 128, 14, "#bfe8d6", "right");
  drawText(game.bank.balance + " EGP", x + w - 18, y + 160, 30, "#ffffff", "right");
}

function bankLabel(score) {
  if (score >= 750) {
    return "ممتاز";
  }
  if (score >= 650) {
    return "جيد";
  }
  if (score >= 500) {
    return "مقبول";
  }
  return "ضعيف";
}

function drawBankAccount() {
  drawBankCard(330, 214, 320, 180);
  drawText("الكاش اللي معاك", 650, 432, 17, "#bfe3f2", "right");
  drawText(game.cash + " EGP", 330, 432, 20, "#f2b134", "left");
  drawText("فايدة بكرة (" + Math.round(BANK_INTEREST * 100) + "%)", 650, 470, 17, "#bfe3f2", "right");
  drawText("+" + Math.floor(game.bank.balance * BANK_INTEREST) + " EGP", 330, 470, 20, "#8fdc5a", "left");

  drawText("اختار المبلغ", 1150, 262, 17, "#bfe3f2", "right");
  drawText("الإيداع بيحول من الكاش للبنك والسحب العكس", 1150, 424, 14, "#8fb3c4", "right");

  // التقييم الائتماني
  fillRound(670, 450, 480, 130, 12, "rgba(0,0,0,0.25)");
  drawText("التقييم الائتماني", 1134, 480, 18, "#fff3df", "right");
  drawText(game.bank.score + " (" + bankLabel(game.bank.score) + ")", 690, 480, 20, "#f2b134", "left");
  const gr = ctx.createLinearGradient(690, 0, 1130, 0);
  gr.addColorStop(0, "#d62f2a");
  gr.addColorStop(0.5, "#f2b134");
  gr.addColorStop(1, "#5aa335");
  fillRound(690, 508, 440, 16, 8, gr);
  const mx = 690 + 440 * ((game.bank.score - 300) / 550);
  drawEllipse(mx, 516, 11, 11, "#fff3df");
  strokeRound(mx - 11, 505, 22, 22, 11, "#1a110b", 3);
  drawText("كل ما تدفع الأقساط في ميعادها التقييم بيزيد", 1134, 556, 14, "#8fb3c4", "right");
}

function drawBankLoans() {
  // قروضك الحالية
  fillRound(330, 214, 350, 380, 12, "rgba(0,0,0,0.25)");
  drawText("قروضك الحالية", 666, 240, 18, "#f2b134", "right");
  if (game.bank.loans.length === 0) {
    drawText("مفيش قروض", 505, 400, 20, "#8fb3c4");
  }
  for (let i = 0; i < game.bank.loans.length && i < 3; i++) {
    const L = game.bank.loans[i];
    const y = 250 + i * 104;
    fillRound(340, y, 330, 96, 10, "rgba(255,243,223,0.12)");
    drawText("قرض رقم " + L.id, 660, y + 22, 16, "#fff3df", "right");
    drawText("المتبقي: " + L.owed + " EGP", 660, y + 42, 14, "#ffd36b", "right");
    drawText("القسط: " + Math.min(L.daily, L.owed) + " EGP / يوم - باقي " + L.daysLeft + " يوم", 660, y + 60, 13, "#bfe3f2", "right");
  }

  // قرض جديد
  fillRound(700, 214, 450, 380, 12, "rgba(0,0,0,0.25)");
  drawText("خد قرض جديد", 1134, 240, 18, "#f2b134", "right");
  drawText("المبلغ", 1134, 262, 14, "#bfe3f2", "right");
  drawText("المدة بالأيام", 1134, 336, 14, "#bfe3f2", "right");
  const amount = LOAN_AMOUNTS[game.bankUI.loanIdx];
  const term = LOAN_TERMS[game.bankUI.termIdx];
  const total = Math.round(amount * (1 + LOAN_RATE));
  const daily = Math.ceil(total / term);
  drawText("هتاخد " + amount + " EGP في حساب البنك", 1134, 416, 16, "#fff3df", "right");
  drawText("هتدفع " + total + " EGP على " + term + " أيام (" + daily + " EGP / يوم)", 1134, 440, 16, "#ffd36b", "right");
  drawText("ليفلك " + game.level + " - أقصى قرض ليك " + maxLoan() + " EGP", 1134, 466, 14, "#8fb3c4", "right");
  drawText("القروض الأكبر بتتفتح مع الليفل", 1134, 570, 14, "#8fb3c4", "right");
}

function drawBankHistory() {
  fillRound(330, 214, 820, 380, 12, "rgba(0,0,0,0.25)");
  drawText("العملية", 1130, 240, 15, "#f2b134", "right");
  drawText("اليوم", 540, 240, 15, "#f2b134", "right");
  drawText("المبلغ", 440, 240, 15, "#f2b134", "left");
  drawText("الرصيد", 350, 240, 15, "#f2b134", "left");
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(344, 248, 792, 2);
  const h = game.bank.history;
  if (h.length === 0) {
    drawText("لسه مفيش عمليات", 740, 400, 20, "#8fb3c4");
  }
  for (let i = 0; i < h.length && i < 9; i++) {
    const y = 278 + i * 34;
    drawText(h[i].type, 1130, y, 15, "#fff3df", "right");
    drawText(String(h[i].day), 540, y, 15, "#bfe3f2", "right");
    drawText((h[i].amount >= 0 ? "+" : "") + h[i].amount, 440, y, 16, h[i].amount >= 0 ? "#8fdc5a" : "#ff7a70", "left");
    drawText(String(h[i].balance), 350, y, 15, "#fff3df", "left");
  }
}

function drawBankTab() {
  if (game.bankUI.tab === "account") {
    drawBankAccount();
  } else if (game.bankUI.tab === "loans") {
    drawBankLoans();
  } else {
    drawBankHistory();
  }
}
