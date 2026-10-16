// ===== characters.js: الزباين (13 شخصية) + كلامهم المضحك + رسمهم =====

// ask = بيطلب بإيه، intro/quirk = كلام غريب ومضحك قبل الطلب
const CHARACTERS = [
  { id: "man", name: "أحمد", style: "short", skin: "#f3d9b4", skinDark: "#d9b88c", hair: "#2b1a12",
    shirt: ["#e23b34", "#a81f1b"], collar: true, mul: 1.0, voice: 1.0, ask: "هات لي",
    intro: ["أنا لسه جاي من فرح ملوخية!", "أنا مش جعان.. أنا بس بحب أتخانق مع الجوع", "صباح الفل! ولا أقول مساء؟ مش فارقة"],
    quirk: ["وخلي الأكل بسرعة قبل ما أنسى أنا جعان ليه", "ومتقولش لأمي إني أكلت برة", "علشان فاضل لي ٣ ساعات قبل ما أعمل دايت"] },
  { id: "girl-hijab", name: "مريم", style: "hijab", skin: "#f6dcc0", skinDark: "#e0bf9c", hair: "#2b1a12",
    scarf: ["#2f8fa8", "#1f6577"], shirt: ["#f2b134", "#c98a1a"], mul: 1.1, voice: 1.25, ask: "ممكن",
    intro: ["أنا قريت إن البرجر بيحل مشاكل الحياة", "عندي حالة طوارئ.. جعانة بشكل شخصي", "صاحبتي قالتلي إن هنا أحلى برجر.. لو وحش هقاطعها"],
    quirk: ["بس بسرعة عشان عندي حلقة مسلسل", "وخليه شكله حلو عشان هصوره", "ولو نقص حاجة هعمل لك تقييم مأساوي"] },
  { id: "girl-long", name: "سارة", style: "long", skin: "#f0cfa8", skinDark: "#d8b088", hair: "#4a2a18",
    shirt: ["#7d5be0", "#4a2fa0"], mul: 1.0, voice: 1.3, ask: "من فضلك",
    intro: ["أنا شفت حلم إنك بتعمل برجر بشكل مسرحي", "هو البرجر بيحب الكاتشب ولا الكاتشب بيحب البرجر؟", "عاملة دايت.. بس النهاردة بقول للدايت أجازة"],
    quirk: ["وخلي كل طبقة في مكانها زي حياة منظمة", "مش عايزة أي مفاجآت.. إلا لو لذيذة", "وابتسم وانت بتحضره عشان الطعم يبقى أحلى"] },
  { id: "man-beard", name: "كريم", style: "short", beard: true, glasses: true, skin: "#e0b88a", skinDark: "#c49a6c",
    hair: "#1a1a1a", mouth: "#f0b8a8", shirt: ["#3d6fbf", "#274a88"], collar: true, mul: 0.9, voice: 0.85, ask: "اديني",
    intro: ["أنا اتجوزت الدقن دي من ٥ سنين", "تصدق إني حلمت بالبرجر ده بالتفصيل؟", "أنا مش متوتر.. بس إيدي بتترعش من الجوع"],
    quirk: ["وبالله عليك متحطش خس.. عندي مشاكل شخصية معاه", "هصور الأكل قبل ما آكله، سيبك مني", "وهقعد مستني كأني في محطة قطر"] },
  { id: "grandpa", name: "عم حسن", style: "bald", glasses: true, mustache: "#eeeeee", wrinkles: true, skin: "#e6c39a",
    skinDark: "#c9a37a", hair: "#eeeeee", brow: "#9a9a9a", shirt: ["#c9b48a", "#a08a5c"], collar: true,
    mul: 1.4, voice: 0.7, ask: "هات يا بني",
    intro: ["في أيامنا كان البرجر ساندوتش لحمة وخلاص!", "أنا مستني من ١٩٨٥ وأخيراً جه دوري", "هو إنت اللي عامل المحل ده ولا أبوك؟"],
    quirk: ["ومتنساش.. أنا أكبر منك بالبرجر", "بس خلي بالك أسناني مش زي زمان", "وبالمرة قول لي، الدنيا حر ولا برد؟"] },
  { id: "grandma", name: "تيتة سعاد", style: "hijab", wrinkles: true, skin: "#ecd0ae", skinDark: "#d2b08a", hair: "#dddddd",
    brow: "#9a9a9a", scarf: ["#d9cfe8", "#b3a5cf"], shirt: ["#8a5fb0", "#613b86"], mul: 1.4, voice: 0.9,
    ask: "عايزة يا حبيبي",
    intro: ["يا حبيبي أنا جاية أطمن على الأكل", "ولادي قالولي ما أكلش برة.. وأنا قلت لهم سلام", "هو الكاتشب ده طماطم بجد ولا حاجة تانية؟"],
    quirk: ["وخليه سخن يا قلبي زي حنان الجدة", "وإياك تنسى الشطة.. لأ استنى مفيش شطة هنا", "وهقعد أحكي لك عن جوزي الله يرحمه"] },
  { id: "biker", name: "كابتن ميكا", style: "cap", capColor: "#2b2b2b", sunglasses: true, skin: "#e6bd92", skinDark: "#c99c70",
    hair: "#2b1a12", mouth: "#7a2f22", shirt: ["#2f2f35", "#17171c"], outfit: "vest", mul: 0.85, voice: 0.8, ask: "هات لي",
    intro: ["أنا جاي بالموتوسيكل.. بس من بعيد", "أنا مش بخاف من حاجة.. إلا من الجوع", "الكل بيقولي ريّس.. وأنا بصدّق"],
    quirk: ["وخلي البرجر أسرع من الموتور بتاعي", "هقعد وأتصرف إني مشغول جداً", "ولو اتأخرت هعمل شوية دوشة بالصوت"] },
  { id: "afro", name: "ليلى", style: "afro", skin: "#c68c5f", skinDark: "#a86f44", hair: "#1f130d", earrings: true,
    shirt: ["#f5c542", "#d99a1a"], mul: 1.0, voice: 1.2, ask: "عايزة",
    intro: ["أنا بحب الشعر ده.. بس هو مبيحبنيش الصبح", "بدور على أحسن برجر في الكون بالظبط", "اليوم ده بدأ بقهوة وانتهى بجوع"],
    quirk: ["وخلي كل حاجة بتلمع زي مزاجي", "لو الصوص مظبوط هغني لك أغنية", "وأنا بحب الحاجات اللي بتتعمل بحب"] },
  { id: "boss", name: "أستاذ عادل", style: "slick", mustache: "#2b1a12", skin: "#f0d2ac", skinDark: "#d4b088",
    hair: "#2b2b2b", shirt: ["#2c3e5c", "#17263f"], outfit: "suit", tie: "#d62f2a", mul: 0.8, voice: 0.9, ask: "أحتاج",
    intro: ["عندي اجتماع بعد ١٠ دقايق.. مع نفسي", "اعتبر ده طلب شركة بميزانية مفتوحة", "الوقت ده فلوس.. وإنت لسه واقف"],
    quirk: ["وأريد فاتورة رسمية ومختومة بالختم الجاد", "وبسرعة قبل ما الأسهم تنزل", "وهنعمل شراكة لو الطعم عجبني"] },
  { id: "punk", name: "روكا", style: "mohawk", hair: "#ff4fa3", skin: "#f3d9b4", skinDark: "#d9b88c", earrings: true,
    shirt: ["#3a3a3a", "#1c1c1c"], mul: 0.9, voice: 1.15, ask: "هات",
    intro: ["شعري ده مش لون.. ده موقف", "أنا بسمع روك وبحب البرجر الثقيل", "أنا هنا علشان أثور على الجوع"],
    quirk: ["وخلي الطعم ينفجر زي الجيتار", "ولو مفيش صوص هعمل ثورة", "وبلاش عيون الناس.. أنا خجول من جوه"] },
  { id: "nerd", name: "بيبو", style: "messy", glasses: true, bigGlasses: true, hair: "#4a3322", skin: "#f3d9b4", skinDark: "#d9b88c",
    shirt: ["#4caf50", "#2e7d32"], outfit: "hoodie", mul: 1.0, voice: 1.1, ask: "ممكن أطلب",
    intro: ["أنا لسه خارج من لعبة ٢٤ ساعة", "الأكل ده محتاج patch بس مفيش وقت", "عندي مستوى جوع ٩٩٪"],
    quirk: ["ولو في bug في الطلب هبلغ المطور", "ومتقولش لأمي إني نمت هنا", "وهحط الأكل في الـ inventory بتاعي"] },
  { id: "kid-boy", name: "ياسين الصغير", style: "spiky", hair: "#3a2416", skin: "#f3d9b4", skinDark: "#d9b88c", blush: true, kid: true,
    shirt: ["#ff8f2b", "#d96a0f"], mul: 1.2, voice: 1.5, ask: "عايز",
    intro: ["أنا أقوى من بابا.. بس هو أطول", "هو البرجر بيكبر الواحد بسرعة؟", "أنا شفت دبور وجريت.. بس مش خايف"],
    quirk: ["ومتقولش لماما إني بحب الكاتشب أكتر من الخضار", "وهاخد بالون لو سمحت؟", "وبسرعة عشان عندي ماتش بعد شوية"] },
  { id: "kid-girl", name: "ميمي", style: "pigtails", hair: "#7a4a2a", skin: "#f6dcc0", skinDark: "#e0bf9c", blush: true, kid: true,
    shirt: ["#ff7eb6", "#d94f8a"], mul: 1.2, voice: 1.6, ask: "عايزة",
    intro: ["أنا ميمي وعندي حيوان أليف خيالي", "أنا مش بخاف من حاجة غير الواد اللي بيضحك", "ماما قالتلي أطلب بأدب.. فأنا بطلب بأدب شديد"],
    quirk: ["وخلي البرجر ضخم زي قلبي", "هقعد وأسيب رجلي تتهز", "ولو حطيت صوص كتير هعمل لك رسمة"] }
];

// الشيف اللي بيعلمك في التدريب
const CHEF_LOOK = {
  id: "chef", name: "الشيف حريف", style: "chef", beard: true, glasses: true, skin: "#e0b88a", skinDark: "#c49a6c",
  hair: "#1a1a1a", mouth: "#f0b8a8", shirt: ["#fffaf0", "#d8d0c0"], outfit: "chef", mul: 1, voice: 0.9
};

// ---------- الكلام ----------

function sauceSpeech(rule) {
  if (rule === "none") {
    return " " + pickOne(["من غير صوص خالص", "من غير أي صوص", "وممنوع الصوصات"]);
  }
  return " بـ" + sauceLabel(rule);
}

function orderSpeech(look, order) {
  const parts = order.items.map(function (it) {
    return it.kind === "burger" ? MENU[it.id].name + sauceSpeech(it.sauce) : MENU[it.id].name;
  });
  return look.ask + " " + parts.join(" و ");
}

// المحادثة: كلام غريب + حاجة مضحكة + الطلب نفسه
function buildDialogue(look, order) {
  return [pickOne(look.intro), pickOne(look.quirk), orderSpeech(look, order)];
}

// ---------- رسم الجسم ----------

function drawCustomerBody(look, ratio, talking) {
  const style = look.style;
  const hijab = style === "hijab";
  const faceRx = hijab ? 56 : 62;
  const faceRy = hijab ? 62 : 70;
  const faceCy = hijab ? 304 : 298;
  const line = "rgba(58,33,18,0.6)";

  // ---- خلف الراس ----
  if (style === "long") {
    fillRound(566, 236, 148, 190, 56, look.hair);
  }
  if (style === "afro") {
    drawEllipse(640, 262, 98, 92, look.hair);
  }
  if (style === "pigtails") {
    drawEllipse(582, 318, 20, 28, look.hair);
    drawEllipse(698, 318, 20, 28, look.hair);
  }
  if (style === "bun") {
    drawEllipse(640, 214, 24, 24, look.hair);
  }
  if (hijab) {
    drawEllipse(640, 300, 82, 94, look.scarf[1]);
  }

  // ---- رقبة وجسم ----
  fillRound(618, 340, 44, 50, 12, look.skinDark);
  withShadow(20, 8, "rgba(0,0,0,0.4)", function () {
    fillRound(540, 372, 200, 170, 54, vGradient(372, 542, look.shirt[0], look.shirt[1]));
  });
  strokeRound(540, 372, 200, 170, 54, line, 3);

  if (look.outfit === "suit") {
    ctx.fillStyle = "#fff3df";
    ctx.beginPath();
    ctx.moveTo(606, 372); ctx.lineTo(640, 434); ctx.lineTo(674, 372);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = look.tie;
    ctx.beginPath();
    ctx.moveTo(634, 388); ctx.lineTo(646, 388); ctx.lineTo(650, 432); ctx.lineTo(640, 448); ctx.lineTo(630, 432);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(606, 372); ctx.lineTo(588, 450);
    ctx.moveTo(674, 372); ctx.lineTo(692, 450);
    ctx.stroke();
  } else if (look.outfit === "hoodie") {
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.ellipse(640, 376, 52, 22, 0, 0, Math.PI);
    ctx.stroke();
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(626, 398); ctx.lineTo(622, 440);
    ctx.moveTo(654, 398); ctx.lineTo(658, 440);
    ctx.stroke();
  } else if (look.outfit === "chef") {
    ctx.fillStyle = "#d62f2a";
    ctx.beginPath();
    ctx.moveTo(612, 376); ctx.lineTo(640, 410); ctx.lineTo(668, 376);
    ctx.closePath();
    ctx.fill();
    for (let k = 0; k < 3; k++) {
      drawEllipse(624, 430 + k * 28, 5, 5, "#3a2112");
      drawEllipse(656, 430 + k * 28, 5, 5, "#3a2112");
    }
  } else if (look.outfit === "vest") {
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(640, 380); ctx.lineTo(640, 540);
    ctx.stroke();
    drawEllipse(600, 420, 5, 5, "#c0c0c0");
    drawEllipse(680, 420, 5, 5, "#c0c0c0");
  } else if (look.collar) {
    ctx.fillStyle = "#fff3df";
    ctx.beginPath();
    ctx.moveTo(606, 372); ctx.lineTo(640, 414); ctx.lineTo(674, 372);
    ctx.closePath();
    ctx.fill();
  }
  if (hijab) {
    drawEllipse(640, 404, 86, 50, look.scarf[0]);
    ctx.strokeStyle = look.scarf[1];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(600, 392); ctx.lineTo(590, 436);
    ctx.moveTo(680, 392); ctx.lineTo(690, 436);
    ctx.stroke();
  }

  // ---- الوش ----
  if (!hijab) {
    drawEllipse(578, 304, 11, 18, look.skinDark);
    drawEllipse(702, 304, 11, 18, look.skinDark);
    if (look.earrings) {
      drawEllipse(574, 326, 5, 8, "#f2b134");
      drawEllipse(706, 326, 5, 8, "#f2b134");
    }
  }
  const skin = ctx.createRadialGradient(625, 280, 10, 640, faceCy, 80);
  skin.addColorStop(0, look.skin);
  skin.addColorStop(1, look.skinDark);
  drawEllipse(640, faceCy, faceRx, faceRy, skin);
  ctx.strokeStyle = line;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(640, faceCy, faceRx, faceRy, 0, 0, Math.PI * 2);
  ctx.stroke();

  // ---- الشعر قدام ----
  ctx.fillStyle = look.hair;
  if (style === "short" || style === "long" || style === "pigtails") {
    ctx.beginPath();
    ctx.ellipse(640, 262, 66, 46, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    if (style === "pigtails") {
      fillRound(570, 296, 10, 8, 3, "#ff4f8a");
      fillRound(700, 296, 10, 8, 3, "#ff4f8a");
    }
  } else if (style === "slick") {
    ctx.beginPath();
    ctx.ellipse(640, 258, 66, 40, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(640, 262, 52, Math.PI * 1.15, Math.PI * 1.7);
    ctx.stroke();
  } else if (style === "afro") {
    ctx.beginPath();
    ctx.ellipse(640, 256, 70, 34, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  } else if (style === "cap") {
    ctx.fillStyle = look.capColor;
    ctx.beginPath();
    ctx.ellipse(640, 258, 68, 44, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    fillRound(590, 252, 120, 12, 6, look.capColor);
    fillRound(650, 256, 80, 10, 5, "#444");
    drawEllipse(640, 238, 8, 8, "#f2b134");
  } else if (style === "mohawk") {
    ctx.beginPath();
    for (let k = 0; k < 5; k++) {
      const bx = 612 + k * 14;
      ctx.moveTo(bx - 8, 236);
      ctx.lineTo(bx, 190 - (k % 2) * 14);
      ctx.lineTo(bx + 8, 236);
    }
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(640, 252, 18, 12, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  } else if (style === "messy") {
    ctx.beginPath();
    ctx.ellipse(640, 262, 66, 44, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    for (let k = 0; k < 5; k++) {
      drawEllipse(600 + k * 20, 226 - (k % 2) * 8, 14, 14, look.hair);
    }
  } else if (style === "spiky") {
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const bx = 596 + k * 17;
      ctx.moveTo(bx - 9, 240);
      ctx.lineTo(bx, 200 - (k % 2) * 12);
      ctx.lineTo(bx + 9, 240);
    }
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(640, 258, 64, 38, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  } else if (style === "chef") {
    drawEllipse(584, 270, 12, 20, look.hair);
    drawEllipse(696, 270, 12, 20, look.hair);
    ctx.fillStyle = "#fffaf0";
    ctx.strokeStyle = "rgba(58,33,18,0.6)";
    ctx.lineWidth = 3;
    const puffs = [[598, 190, 30, 28], [640, 172, 34, 32], [682, 190, 30, 28]];
    for (let k = 0; k < puffs.length; k++) {
      ctx.beginPath();
      ctx.ellipse(puffs[k][0], puffs[k][1], puffs[k][2], puffs[k][3], 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    outlinedRound(588, 200, 104, 44, 10, "#fffaf0", 3);
    outlinedRound(582, 236, 116, 16, 6, "#f2f2f2", 3);
  } else if (style === "bald") {
    drawEllipse(580, 290, 10, 24, look.hair);
    drawEllipse(700, 290, 10, 24, look.hair);
    drawEllipse(622, 246, 18, 7, "rgba(255,255,255,0.3)");
  } else if (hijab) {
    ctx.fillStyle = look.scarf[0];
    ctx.beginPath();
    ctx.ellipse(640, 264, 64, 36, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    drawEllipse(640, 366, 48, 14, look.scarf[0]);
  }

  // دقن
  if (look.beard) {
    ctx.fillStyle = look.hair;
    ctx.beginPath();
    ctx.ellipse(640, 330, 60, 46, 0, 0, Math.PI);
    ctx.fill();
  }

  // تجاعيد
  if (look.wrinkles) {
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (!hijab) {
      ctx.moveTo(612, 260); ctx.lineTo(668, 260);
      ctx.moveTo(618, 269); ctx.lineTo(662, 269);
    }
    ctx.moveTo(594, 298); ctx.lineTo(586, 294);
    ctx.moveTo(594, 303); ctx.lineTo(586, 306);
    ctx.moveTo(686, 298); ctx.lineTo(694, 294);
    ctx.moveTo(686, 303); ctx.lineTo(694, 306);
    ctx.stroke();
  }

  // العيون
  const blink = game.time % 4 < 0.12 ? 0.15 : 1;
  const big = look.kid ? 1.25 : 1;
  if (look.sunglasses) {
    fillRound(592, 288, 40, 24, 8, "#111");
    fillRound(648, 288, 40, 24, 8, "#111");
    fillRound(630, 296, 20, 5, 2, "#111");
    fillRound(598, 291, 14, 5, 2, "rgba(255,255,255,0.35)");
    fillRound(654, 291, 14, 5, 2, "rgba(255,255,255,0.35)");
  } else {
    drawEllipse(615, 300, 10 * big, 8 * big * blink, "#ffffff");
    drawEllipse(665, 300, 10 * big, 8 * big * blink, "#ffffff");
    drawEllipse(615, 301, 4.5 * big, 4.5 * big * blink, "#2b1a12");
    drawEllipse(665, 301, 4.5 * big, 4.5 * big * blink, "#2b1a12");
    drawEllipse(617, 299, 1.6, 1.6 * blink, "#ffffff");
    drawEllipse(667, 299, 1.6, 1.6 * blink, "#ffffff");
  }
  if (look.glasses) {
    const gr = look.bigGlasses ? 19 : 15;
    ctx.strokeStyle = "#2b1d14";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(615, 300, gr, 0, Math.PI * 2);
    ctx.moveTo(665 + gr, 300);
    ctx.arc(665, 300, gr, 0, Math.PI * 2);
    ctx.moveTo(615 + gr, 300); ctx.lineTo(665 - gr, 300);
    ctx.stroke();
  }

  // مناخير
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(640, 306); ctx.lineTo(635, 320); ctx.lineTo(645, 320);
  ctx.stroke();

  if (look.blush) {
    drawEllipse(596, 326, 11, 7, "rgba(255,90,110,0.35)");
    drawEllipse(684, 326, 11, 7, "rgba(255,90,110,0.35)");
  }

  // الحواجب حسب مزاج الزبون
  if (!look.sunglasses) {
    ctx.strokeStyle = look.brow || look.hair;
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (ratio > 0.25) {
      ctx.moveTo(601, 281); ctx.lineTo(629, 281);
      ctx.moveTo(651, 281); ctx.lineTo(679, 281);
    } else {
      ctx.moveTo(601, 274); ctx.lineTo(629, 286);
      ctx.moveTo(679, 274); ctx.lineTo(651, 286);
    }
    ctx.stroke();
  }

  if (look.mustache) {
    fillRound(614, 311, 52, 10, 5, look.mustache);
  }

  // الفم حسب المزاج (وبيتحرك لما الزبون بيتكلم)
  ctx.strokeStyle = look.mouth || "#7a2f22";
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (talking) {
    const open = 4 + Math.abs(Math.sin(game.time * 14)) * 7;
    drawEllipse(640, 336, 11, open, "#5a1f18");
    ctx.beginPath();
  } else if (ratio > 0.5) {
    ctx.arc(640, 322, 16, 0.15 * Math.PI, 0.85 * Math.PI);
  } else if (ratio > 0.25) {
    ctx.moveTo(626, 334); ctx.lineTo(654, 334);
  } else {
    ctx.arc(640, 346, 16, 1.15 * Math.PI, 1.85 * Math.PI);
  }
  ctx.stroke();
}

// ---------- فقاعة الكلام ----------

function drawBubble(c, ratio) {
  const W = 360;
  const cx = 640;
  let lines = [];
  let shown = [];
  let size = 17;
  let lh = 22;
  let header = c.look.name;

  if (c.state === "ordering") {
    const d = c.dlg;
    lines = wrapText(d.lines[d.idx], W - 40, size);
    let remaining = Math.floor(d.t * 32);
    for (let i = 0; i < lines.length; i++) {
      shown.push(lines[i].slice(0, Math.max(0, Math.min(lines[i].length, remaining))));
      remaining = remaining - lines[i].length - 1;
    }
  } else {
    header = "طلب رقم " + c.ticket.number;
    lines = c.order.lines;
    shown = lines;
    size = 15;
    lh = 20;
  }

  const h = 34 + lines.length * lh + 8;
  const top = 184 - h;
  withShadow(14, 4, "rgba(0,0,0,0.35)", function () {
    outlinedRound(cx - W / 2, top, W, h, 18, "#fff3df", 3, "rgba(58,33,18,0.7)");
  });
  ctx.fillStyle = "#fff3df";
  ctx.beginPath();
  ctx.moveTo(620, 183); ctx.lineTo(660, 183); ctx.lineTo(640, 203);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(58,33,18,0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(620, 183); ctx.lineTo(640, 203); ctx.lineTo(660, 183);
  ctx.stroke();
  ctx.fillStyle = "#fff3df";
  ctx.fillRect(623, 181, 34, 5);

  fillRound(cx + W / 2 - 24 - header.length * 8, top + 8, header.length * 8 + 16, 20, 10, "rgba(201,122,48,0.2)");
  drawText(header, cx + W / 2 - 16, top + 23, 13, "#a85a1c", "right");
  for (let i = 0; i < shown.length; i++) {
    drawText(shown[i], cx + W / 2 - 18, top + 34 + (i + 1) * lh - 6, size, "#2b1d14", "right");
  }

  // شريط الصبر
  fillRound(540, 208, 200, 12, 6, "#2b1d14");
  let barColor = "#5aa335";
  if (ratio <= 0.25) {
    barColor = "#d62f2a";
  } else if (ratio <= 0.5) {
    barColor = "#f2b134";
  }
  fillRound(540, 208, Math.max(12, 200 * ratio), 12, 6, barColor);
  strokeRound(540, 208, 200, 12, 6, "rgba(0,0,0,0.5)", 2);
}

// الزبون في مكانه (1 أو 2 على الكاونتر)، بيدخل من الشمال وبيتنفس
function drawCustomer(c, slot) {
  const cx = layout().cust[slot];
  const sc = slotCount() === 2 ? 0.82 : 1;
  const e = c.enter === undefined ? 1 : c.enter;
  const ease = 1 - Math.pow(1 - e, 3);
  const ratio = c.patience / c.maxPatience;
  const talking = c.state === "ordering" && c.dlg.t * 32 < c.dlg.lines[c.dlg.idx].length && e >= 1;

  ctx.save();
  ctx.translate(cx, 542);
  ctx.scale(sc, sc);
  ctx.translate(-640, -542);
  ctx.translate(-(1 - ease) * 360, Math.sin(game.time * 2 + slot) * 1.5 + Math.abs(Math.sin(game.time * 12)) * (1 - ease) * 8);

  // ضل على الأرض
  drawEllipse(640, 548, 110, 14, "rgba(0,0,0,0.25)");

  ctx.save();
  if (c.look.kid) {
    ctx.translate(640, 542);
    ctx.scale(0.78, 0.78);
    ctx.translate(-640, -542);
  }
  drawCustomerBody(c.look, ratio, talking);
  ctx.restore();

  ctx.save();
  if (c.look.kid) {
    ctx.translate(0, 69);
  }
  drawBubble(c, ratio);
  ctx.restore();
  ctx.restore();
}

// صورة شخصية دايرية (للتسجيل والقوائم)
function drawAvatar(look, cx, cy, r, focusY, range) {
  const fy = focusY === undefined ? 335 : focusY;
  const rg = range === undefined ? 100 : range;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = vGradient(cy - r, cy + r, "#f7c85a", "#c97a30");
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.translate(cx, cy);
  ctx.scale(r / rg, r / rg);
  ctx.translate(-640, -fy);
  drawCustomerBody(look, 1, false);
  ctx.restore();
  ctx.strokeStyle = "rgba(40,22,12,0.85)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}
