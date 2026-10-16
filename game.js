// ===== game.js: منطق اللعبة (Milestone 8: طلبين مع بعض + البنك + زباين مضحكين) =====

// ---------- ثوابت ----------
const MAX_PATIENCE = 40;      // صبر الزبون العادي بالثواني
const COOK_RAW_UNTIL = 5;     // الباتي: لحد 5 ثواني نيّ
const COOK_BURNT_AFTER = 9;   // الباتي: بعد 9 ثواني بيتحرق
const COOK_MAX = 12;
const FRY_RAW_UNTIL = 4;      // البطاطس: لحد 4 ثواني بيضا
const FRY_BURNT_AFTER = 7;    // البطاطس: بعد 7 ثواني بتتحرق
const FRY_MAX = 10;
const DINE_TIME = 22;         // الزبون بياكل على الترابيزة كام ثانية
const DINE_TIP = 10;          // بقشيش الأكل على الترابيزة
const TALK_SPEED = 32;        // سرعة كتابة كلام الزبون (حرف في الثانية)

const DAY_START = 540;        // الساعة 9:00 (بالدقايق)
const DAY_END = 1020;         // الساعة 5:00 م
const STOP_SPAWN_AT = 990;
const MIN_PER_SEC = 2;        // كل ثانية حقيقية = دقيقتين في اللعبة
const DELIVERY_MINUTES = 60;
const TRAY_MAX = 6;

const PLATE_BASE_Y = 616;

// ---------- البنك ----------
const BANK_INTEREST = 0.01;   // فايدة يومية على رصيد البنك
const LOAN_RATE = 0.10;       // فايدة القرض (مرة واحدة)
const BANK_AMOUNTS = [100, 500, 1000, 2000];
const LOAN_TERMS = [3, 5, 7];

// ---------- المنيو ----------
// recipe = الأساس من غير الصوص (الصوص بيتحدد حسب طلب كل زبون)
const MENU = {
  classic: { name: "كلاسيك برجر", price: 85, recipe: ["bun", "patty", "bun"] },
  cheese: { name: "تشيز برجر", price: 100, recipe: ["bun", "patty", "cheese", "bun"] },
  fries: { name: "بطاطس", price: 35 },
  cola: { name: "كولا", price: 20 },
  orange: { name: "عصير برتقان", price: 20 }
};
const LAYER_NAMES = { bun: "رغيف", patty: "باتي", cheese: "جبنة" };

// ---------- مكان الزباين والأطباق (واحد أو اتنين) ----------
const SLOT_LAYOUTS = {
  1: { cust: [640], tray: [690], plate: [620], plateScale: 0.95 },
  2: { cust: [490, 790], tray: [490, 790], plate: [575, 705], plateScale: 0.72 }
};

// ---------- أماكن في المطبخ ----------
const BUN_BIN = { x: 245, y: 470, w: 112, h: 130 };
const CHEESE_BIN = { x: 368, y: 470, w: 112, h: 130 };
const FREEZER_BOX = { x: 40, y: 250, w: 190, h: 390 };
const STOVE_SLOTS = [{ x: 880, y: 532 }, { x: 1010, y: 532 }, { x: 1140, y: 532 }];

const SAUCES = [
  { key: "ketchup", label: "كاتشب", x: 400, color: "#d62f2a", dark: "#a81f1b", cap: "#fff3df" },
  { key: "mayo", label: "مايونيز", x: 530, color: "#f5ecd2", dark: "#d9cba3", cap: "#d62f2a" },
  { key: "mustard", label: "مسطردة", x: 660, color: "#e8b21a", dark: "#b88a0c", cap: "#fff3df" }
];
const SAUCE_KEYS = ["ketchup", "mayo", "mustard"];

// ---------- محطة البطاطس والمشروبات ----------
const POTATO_BIN = { x: 150, y: 470, w: 130, h: 130 };
const FRYER_SLOTS = [{ x: 410, y: 536 }, { x: 540, y: 536 }];
const TRAY_PREVIEW = { x: 735, y: 598 };
const SODA = {
  stack: { x: 845, y: 490, w: 100, h: 110 },
  cupSlot: { x: 1030, y: 474, w: 120, h: 126 },
  colaBtn: { x: 985, y: 392, w: 110, h: 30 },
  orangeBtn: { x: 1105, y: 392, w: 110, h: 30 }
};

// ---------- الترابيزات (ورا في المحل) ----------
const TABLE_SPOTS = [{ x: 120, y: 388, s: 0.72 }, { x: 265, y: 388, s: 0.72 }, { x: 1010, y: 388, s: 0.72 }, { x: 1155, y: 388, s: 0.72 }];

// المكونات اللي بتتباع في اللابتوب (سعر الحزمة بالجنيه)
// needs = لازم تفتح التطوير ده الأول عشان المكون يظهر
const SHOP_ITEMS = [
  { key: "buns", label: "رغيف", pack: 10, price: 30 },
  { key: "patties", label: "باتي", pack: 10, price: 120 },
  { key: "cheese", label: "جبنة", pack: 10, price: 40, needs: "cheese" },
  { key: "ketchup", label: "كاتشب", pack: 10, price: 15 },
  { key: "mayo", label: "مايونيز", pack: 10, price: 20 },
  { key: "mustard", label: "مسطردة", pack: 10, price: 15 },
  { key: "potatoes", label: "بطاطس", pack: 10, price: 50, needs: "fries" },
  { key: "cola", label: "كولا", pack: 10, price: 60, needs: "drinks" },
  { key: "orange", label: "عصير برتقان", pack: 10, price: 80, needs: "drinks" },
  { key: "cups", label: "كبايات", pack: 10, price: 30, needs: "drinks" }
];
const SHOP_PER_PAGE = 5;

// ---------- التطويرات ----------
const UPGRADES = [
  { key: "cheese", name: "تشيز برجر", desc: "صنف جديد + صندوق جبنة", max: 1, prices: [600] },
  { key: "fries", name: "بطاطس", desc: "صنف جديد + قلاية ومحطة بطاطس", max: 1, prices: [900] },
  { key: "drinks", name: "ماكينة المشروبات", desc: "كولا وعصير من الماكينة", max: 1, prices: [1200] },
  { key: "tables", name: "ترابيزات الأكل", desc: "الزباين ياكلوا ويسيبوا بقشيش", max: 4, prices: [450, 450, 450, 450] },
  { key: "freezer", name: "سعة الفريزر", desc: "تخزّن باتي أكتر", max: 3, prices: [500, 800, 1200] },
  { key: "stove", name: "عين بوتاجاز زيادة", desc: "تطبخ 3 باتيهات مرة واحدة", max: 1, prices: [700] },
  { key: "fryer", name: "سبت قلاية تاني", desc: "تقلي في سبتين", max: 1, prices: [600], requires: "fries" },
  { key: "soda", name: "سرعة المشروبات", desc: "الكوباية تتملي أسرع", max: 2, prices: [500, 900], requires: "drinks" },
  { key: "warm", name: "حفظ الحرارة", desc: "الأكل بعد ما يستوي مبيتحرقش", max: 1, prices: [1500] },
  { key: "bell", name: "منبه الاستواء", desc: "جرس يرن لما الأكل يستوي", max: 1, prices: [400] },
  { key: "double", name: "طلبين مع بعض", desc: "زبونين وطبقين في نفس الوقت", max: 1, prices: [1800] }
];
const FREEZER_CAPS = [20, 35, 50, 70];
const SODA_TIMES = [3.0, 2.2, 1.5];

// ---------- التقييمات ----------
const REVIEW_TEXTS = {
  5: ["برجر خرافي! هرجع تاني", "أحلى برجر في المنطقة", "سريع وطعمه جامد جداً", "الأكل ساخن والخدمة ممتازة", "صاحب المطعم ده مجنون بس الأكل عبقري"],
  4: ["حلو بس استنيت شوية", "طعمه كويس والخدمة تمام", "برجر حلو والسعر مناسب"],
  3: ["عادي، استنيت كتير شوية", "مش وحش بس مش حاجة مميزة"],
  2: ["الأكل مش زي ما طلبت", "كنت متوقع أحسن من كده"],
  1: ["تجربة وحشة، مش هرجع", "الخدمة وحشة"]
};
const DINE_TEXTS = ["المكان حلو والأكل لذيذ", "قعدة مريحة وأكل جامد", "مكان تحفة وبرجر خطير"];
const PROBLEM_REVIEW = {
  raw: "الباتي كان نيّ", burnt: "الباتي كان محروق", wrong: "البرجر مش زي ما طلبت", wrongsauce: "الصوص كان غلط",
  rawfries: "البطاطس كانت بيضا", burntfries: "البطاطس كانت محروقة", wrongdrink: "المشروب كان غلط",
  missing: "الطلب كان ناقص", left: "استنيت كتير ومشيت"
};
const LOADING_TIPS = [
  "الباتي بيتحرق لو سبته كتير على البوتاجاز!",
  "كل زبون عنده رأيه في الصوص: نوع معين أو من غير صوص خالص",
  "الترابيزات بتزود البقشيش والتقييم",
  "ادخل البنك وخد قرض لو محتاج تتطور بسرعة",
  "دوس F في أي وقت لملء الشاشة",
  "اطلب المكونات من اللابتوب قبل ما تخلص"
];

// ---------- أماكن الضغط ----------
const laptopScreenBox = { x: 140, y: 420, w: 210, h: 135 };
const toKitchenBox = { x: 1010, y: 645, w: 230, h: 56 };
const kitchenBackBox = { x: 40, y: 660, w: 230, h: 46 };
const discardBox = { x: 440, y: 660, w: 150, h: 46 };
const sendBox = { x: 610, y: 660, w: 230, h: 46 };
const toSidesBox = { x: 860, y: 660, w: 380, h: 46 };
const sidesToCounterBox = { x: 300, y: 660, w: 230, h: 46 };
const orderButtonBox = { x: 730, y: 566, w: 200, h: 48 };
const BOOK_BOX = { x: 945, y: 515, w: 150, h: 95 };

function slotActionBox(i) {
  return { x: layout().cust[i] - 100, y: 645, w: 200, h: 56 };
}

function clearTrayBox(i) {
  return { x: layout().tray[i] - 45, y: 617, w: 90, h: 24 };
}

function shopRowY(i) {
  return 230 + i * 62;
}

// مكان كارت التطوير رقم i (3 أعمدة)
function upgradeCardBox(i) {
  const cols = [884, 602, 320];
  return { x: cols[i % 3], y: 214 + Math.floor(i / 3) * 96, w: 266, h: 88 };
}

// تطبيقات نظام Burger OS في اللابتوب
const OS_APPS = [
  { key: "shop", name: "طلب المكونات", color: "#f2b134" },
  { key: "upgrades", name: "التطويرات", color: "#5aa335" },
  { key: "reviews", name: "التقييمات", color: "#d62f2a" },
  { key: "reports", name: "التقارير", color: "#3d6fbf" },
  { key: "bank", name: "البنك", color: "#1f8a6a" },
  { key: "staff", name: "التوظيف", color: "#6b7580", locked: true }
];
const OS_ICON_POS = [{ x: 330, y: 262 }, { x: 640, y: 262 }, { x: 950, y: 262 }, { x: 330, y: 446 }, { x: 640, y: 446 }, { x: 950, y: 446 }];

function appIconBox(i) {
  const c = OS_ICON_POS[i];
  return { x: c.x - 80, y: c.y - 65, w: 160, h: 150 };
}

function dockBox(i) {
  return { x: 136, y: 168 + i * 52, w: 150, h: 44 };
}

// أماكن البنك
function bankSubBox(i) {
  return { x: 1150 - 120 * (i + 1) - 10 * i, y: 166, w: 120, h: 34 };
}
function bankAmountBox(i) {
  return { x: 1150 - 108 * (i + 1) - 12 * i, y: 276, w: 108, h: 44 };
}
const BANK_DEPOSIT_BOX = { x: 922, y: 346, w: 228, h: 54 };
const BANK_WITHDRAW_BOX = { x: 670, y: 346, w: 228, h: 54 };
function loanAmountBox(i) {
  return { x: 1150 - 84 * (i + 1) - 6 * i, y: 268, w: 84, h: 42 };
}
function loanTermBox(i) {
  return { x: 1150 - 140 * (i + 1) - 12 * i, y: 342, w: 140, h: 40 };
}
const LOAN_TAKE_BOX = { x: 704, y: 484, w: 446, h: 54 };
function loanPayBox(i) {
  return { x: 346, y: 250 + i * 104 + 66, w: 130, h: 26 };
}

function defaultStock() {
  return { buns: 20, patties: 10, cheese: 0, ketchup: 20, mayo: 10, mustard: 10, potatoes: 0, cola: 0, orange: 0, cups: 0 };
}

function emptyCart() {
  return { buns: 0, patties: 0, cheese: 0, ketchup: 0, mayo: 0, mustard: 0, potatoes: 0, cola: 0, orange: 0, cups: 0 };
}

function emptyStats() {
  return { served: 0, left: 0, rejected: 0, revenue: 0, spent: 0, upgrades: 0, interest: 0, loanPaid: 0, loanMissed: 0 };
}

function emptyUp() {
  return { cheese: 0, fries: 0, drinks: 0, tables: 0, freezer: 0, stove: 0, fryer: 0, soda: 0, warm: 0, bell: 0, double: 0 };
}

function newBank() {
  return { balance: 0, loans: [], score: 600, history: [], nextLoanId: 1 };
}

// ---------- حالة اللعبة ----------
const game = {
  scene: "loading",          // loading / menu / counter / kitchen / sides / laptop / book / results
  loading: null,
  started: false,
  resumeScene: "counter",
  time: 0,
  cash: 1500,
  day: 1,
  minutes: DAY_START,
  customers: [null, null],   // الزباين اللي على الكاونتر (واحد أو اتنين)
  nextOrderNumber: 1,
  spawnTimer: 2,
  lastLook: -1,
  stock: defaultStock(),
  up: emptyUp(),             // مستويات التطويرات
  sel: 0,                    // الطلب المتحدد (طبق وصينية)
  plates: [[], []],
  pendings: [[], []],        // طبقات لسه بتطير للطبق
  grill: [null, null, null],
  fryer: [null, null],
  soda: null,                // الكوباية اللي في ماكينة المشروبات
  trays: [[], []],
  trayPendings: [0, 0],
  diners: [],                // الزباين اللي بياكلوا على الترابيزات
  reviews: [],
  ratingSum: 0,
  ratingCount: 0,
  flyers: [],
  stream: null,
  freezerOpen: 0,
  cart: emptyCart(),
  laptopTab: "home",
  appT: 1,
  bank: newBank(),
  bankUI: { tab: "account", amountIdx: 1, loanIdx: 0, termIdx: 1 },
  shopPage: 0,
  bookPage: 0,
  unreadReviews: 0,
  history: [],
  deliveries: [],
  deliveryCount: 0,
  stats: emptyStats(),
  hover: "",
  message: null,
  saveTimer: 0,
  saveInfo: null,
  confirmNew: false,
  xp: 0,
  level: 1,
  profile: null,             // اللاعب الحالي
  tut: null,                 // حالة التدريب
  tutBackup: null,
  tutFirst: false,
  floatTexts: [],
  confetti: [],
  settingsReturn: "menu",
  confirmDelete: false,
  regForm: { name: "", city: "", contact: "", avatar: 0 },
  regError: "",
  byeT: 0,
  menuNote: "",
  playersPage: 0,
  confirmProfileDelete: ""
};

// ---------- دوال مساعدة ----------

function slotCount() {
  return 1 + game.up.double;
}

function layout() {
  return SLOT_LAYOUTS[slotCount()];
}

function selSlot() {
  return Math.min(game.sel, slotCount() - 1);
}

function isInside(box, point) {
  return (
    point.x >= box.x && point.x <= box.x + box.w &&
    point.y >= box.y && point.y <= box.y + box.h
  );
}

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height)
  };
}

function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function showMessage(text, color) {
  game.message = { text: text, color: color, timer: 2.5 };
}

function denyClick(text) {
  showMessage(text, "#ff7a70");
  playSound("buzz");
}

function isPlayScene() {
  return game.scene === "counter" || game.scene === "kitchen" || game.scene === "sides" || game.scene === "laptop" || game.scene === "book";
}

function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      const p = document.documentElement.requestFullscreen();
      if (p && p.catch) {
        p.catch(function () {});
      }
    }
  } catch (e) {
    // لو المتصفح رفض ملء الشاشة مفيش مشكلة
  }
}

// شاشة التحميل: بتظهر وبعدين بتنفذ next
function startLoading(next, dur) {
  game.loading = {
    t: 0, dur: dur, next: next,
    tip: LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)]
  };
  game.scene = "loading";
}

// ---------- البنك ----------




// الدفع بيبدأ من الكاش وبعدين من البنك (زي الكارت)

// خصم تلقائي (للأقساط): من البنك الأول وبعدين الكاش






// آخر اليوم: فايدة وأقساط

// ---------- التطويرات ----------

function freezerCap() {
  return FREEZER_CAPS[game.up.freezer];
}

function stoveBurners() {
  return 2 + game.up.stove;
}

function fryerSlots() {
  return 1 + game.up.fryer;
}

function sodaFillTime() {
  return SODA_TIMES[game.up.soda];
}

// حالة زرار الشراء لكل تطوير
function upgradeStatus(u) {
  const lvl = game.up[u.key] === undefined ? 0 : game.up[u.key];
  if (lvl >= u.max) {
    return { label: "تم", ok: false };
  }
  if (u.requires && game.up[u.requires] < 1) {
    return { label: "مقفول", ok: false };
  }
  const cost = u.prices[lvl];
  return { label: cost + " EGP", ok: canPay(cost), cost: cost };
}

function buyUpgrade(u) {
  const st = upgradeStatus(u);
  if (st.label === "تم") {
    return;
  }
  if (st.label === "مقفول") {
    const needed = UPGRADES.filter(function (x) { return x.key === u.requires; })[0];
    denyClick("لازم تفتح " + needed.name + " الأول");
    return;
  }
  if (!st.ok) {
    denyClick("فلوسك مش كفاية!");
    return;
  }
  pay(st.cost, u.name);
  game.stats.upgrades = game.stats.upgrades + st.cost;
  game.up[u.key] = game.up[u.key] + 1;
  // هدية مكونات لما تفتح صنف جديد
  if (u.key === "cheese") {
    game.stock.cheese = game.stock.cheese + 10;
  } else if (u.key === "fries") {
    game.stock.potatoes = game.stock.potatoes + 10;
  } else if (u.key === "drinks") {
    game.stock.cola = game.stock.cola + 10;
    game.stock.orange = game.stock.orange + 10;
    game.stock.cups = game.stock.cups + 10;
  }
  playSound("cash");
  showMessage("اشتريت: " + u.name, "#8fdc5a");
  saveGame(false);
}

// ---------- التقييمات ----------

function averageRating() {
  return game.ratingCount > 0 ? game.ratingSum / game.ratingCount : null;
}

function ratingFactor() {
  const avg = averageRating();
  return avg === null ? 1 : 1.3 - 0.06 * avg;
}

// problem = سبب المشكلة (لو فيه)، dined = قعد وأكل على ترابيزة
function addReview(look, stars, problem, dined) {
  let text;
  if (problem) {
    text = PROBLEM_REVIEW[problem];
  } else if (dined) {
    text = pickOne(DINE_TEXTS);
  } else {
    text = pickOne(REVIEW_TEXTS[stars]);
  }
  game.reviews.unshift({ name: look.name, stars: stars, text: text, day: game.day });
  if (game.reviews.length > 30) {
    game.reviews.pop();
  }
  game.ratingSum = game.ratingSum + stars;
  game.ratingCount = game.ratingCount + 1;
  game.unreadReviews = game.unreadReviews + 1;
}

// ---------- الليفل والخبرة (XP) ----------

const LEVEL_XP = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];

function levelStartXp(level) {
  if (level <= 1) {
    return 0;
  }
  if (level <= LEVEL_XP.length) {
    return LEVEL_XP[level - 1];
  }
  return 4000 + (level - 11) * 1000;
}

function levelFromXp(xp) {
  let l = 1;
  while (xp >= levelStartXp(l + 1)) {
    l = l + 1;
  }
  return l;
}

function addXP(n, x, y) {
  if (game.tut || n <= 0) {
    return;
  }
  const before = game.level;
  game.xp = game.xp + n;
  game.level = levelFromXp(game.xp);
  addFloat("+" + n + " XP", x || 640, y || 340, "#7dd3ff", 20);
  if (game.level > before) {
    let extra = "";
    for (let i = 0; i < LOAN_LEVELS.length; i++) {
      if (LOAN_LEVELS[i] === game.level) {
        extra = " - اتفتح قرض " + LOAN_AMOUNTS[i] + " EGP";
      }
    }
    showMessage("ليفل جديد! وصلت ليفل " + game.level + extra, "#ffd36b");
    playSound("levelup");
    addConfetti(50);
  }
}

function updateEffects(dt) {
  for (let i = game.floatTexts.length - 1; i >= 0; i--) {
    game.floatTexts[i].t = game.floatTexts[i].t + dt;
    if (game.floatTexts[i].t > 1.8) {
      game.floatTexts.splice(i, 1);
    }
  }
  for (let i = game.confetti.length - 1; i >= 0; i--) {
    const p = game.confetti[i];
    p.t = p.t + dt;
    p.vy = p.vy + 900 * dt;
    p.x = p.x + p.vx * dt;
    p.y = p.y + p.vy * dt;
    p.r = p.r + p.vr * dt;
    if (p.t > 2.6) {
      game.confetti.splice(i, 1);
    }
  }
}

// ---------- الحفظ والتحميل (LocalStorage) ----------

function readSave() {
  try {
    const raw = localStorage.getItem(saveKey());
    if (!raw) {
      return null;
    }
    const data = JSON.parse(raw);
    if (!data || data.v !== 1) {
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

function refreshSaveInfo() {
  const d = readSave();
  game.saveInfo = d === null ? null : { day: d.day };
}

// forNextDay = true معناها: احفظ كأن اليوم الجاي بدأ (بنستخدمها آخر اليوم)
function buildSaveData(forNextDay) {
  return {
    v: 1,
    cash: game.cash,
    day: forNextDay ? game.day + 1 : game.day,
    minutes: forNextDay ? DAY_START : game.minutes,
    stock: game.stock,
    up: game.up,
    bank: game.bank,
    reviews: game.reviews,
    ratingSum: game.ratingSum,
    ratingCount: game.ratingCount,
    history: game.history,
    nextOrderNumber: game.nextOrderNumber,
    deliveries: game.deliveries,
    deliveryCount: game.deliveryCount,
    stats: forNextDay ? emptyStats() : game.stats,
    xp: game.xp,
    sfx: audioSettings.sfx,
    music: audioSettings.music
  };
}

// forNextDay = true معناها: احفظ كأن اليوم الجاي بدأ (بنستخدمها آخر اليوم)
function saveGame(forNextDay) {
  if (game.tut) {
    return;
  }
  try {
    localStorage.setItem(saveKey(), JSON.stringify(buildSaveData(forNextDay)));
    if (game.profile) {
      game.profile.level = game.level;
      game.profile.xp = game.xp;
      game.profile.lastPlayed = Date.now();
      saveProfiles();
    }
    refreshSaveInfo();
  } catch (e) {
    // لو التخزين مش شغال اللعبة تكمل عادي من غير حفظ
  }
}

function applySaveData(d) {
  game.cash = d.cash;
  game.day = d.day;
  game.nextOrderNumber = d.nextOrderNumber || 1;
  game.stock = Object.assign(defaultStock(), d.stock);
  game.up = Object.assign(emptyUp(), d.up);
  game.bank = Object.assign(newBank(), d.bank);
  game.reviews = d.reviews || [];
  game.ratingSum = d.ratingSum || 0;
  game.ratingCount = d.ratingCount || 0;
  game.history = d.history || [];
  game.xp = d.xp || 0;
  game.level = levelFromXp(game.xp);
  game.cart = emptyCart();
  game.deliveries = d.deliveries || [];
  game.deliveryCount = d.deliveryCount || 0;
  game.started = true;
  setSfxOn(d.sfx !== false);
  setMusicOn(d.music !== false);
  startDay();
  game.minutes = d.minutes >= DAY_END ? DAY_START : d.minutes;
  game.stats = Object.assign(emptyStats(), d.stats);
}

function loadGame() {
  const d = readSave();
  if (d === null) {
    return false;
  }
  applySaveData(d);
  game.menuNote = "";
  return true;
}

// ---------- اليوم واللعبة الجديدة ----------

function startDay() {
  game.minutes = DAY_START;
  game.customers = [null, null];
  game.spawnTimer = 2;
  game.sel = 0;
  game.plates = [[], []];
  game.pendings = [[], []];
  game.grill = [null, null, null];
  game.fryer = [null, null];
  game.soda = null;
  game.trays = [[], []];
  game.trayPendings = [0, 0];
  game.diners = [];
  game.flyers = [];
  game.stream = null;
  game.stats = emptyStats();
  game.saveTimer = 0;
  game.laptopTab = "home";
  game.scene = "counter";
}

function newGame() {
  game.cash = 1500;
  if (game.profile && game.profile.bonusPending) {
    game.cash = game.cash + 300;
    game.profile.bonusPending = false;
    saveProfiles();
  }
  game.day = 1;
  game.nextOrderNumber = 1;
  game.stock = defaultStock();
  game.up = emptyUp();
  game.bank = newBank();
  game.reviews = [];
  game.ratingSum = 0;
  game.ratingCount = 0;
  game.history = [];
  game.unreadReviews = 0;
  game.cart = emptyCart();
  game.shopPage = 0;
  game.deliveries = [];
  game.deliveryCount = 0;
  game.xp = 0;
  game.level = 1;
  game.menuNote = "";
  game.started = true;
  startDay();
}

function onNewGame() {
  initAudio();
  if ((game.started || game.saveInfo !== null) && !game.confirmNew) {
    game.confirmNew = true;
    return;
  }
  game.confirmNew = false;
  startLoading(function () {
    newGame();
    saveGame(false);
    playSound("start");
  }, 1.8);
}

function onContinue() {
  initAudio();
  if (game.started) {
    game.scene = game.resumeScene;
  } else {
    startLoading(function () {
      if (loadGame()) {
        playSound("start");
      } else {
        game.scene = "menu";
      }
    }, 1.8);
  }
}

function endDay() {
  for (let i = 0; i < game.customers.length; i++) {
    const c = game.customers[i];
    if (c !== null) {
      game.stats.left = game.stats.left + 1;
      addReview(c.look, 1, "left", false);
    }
  }
  game.customers = [null, null];
  processBankDay();
  const st = game.stats;
  game.history.push({
    day: game.day, served: st.served, left: st.left, rejected: st.rejected,
    revenue: st.revenue, spent: st.spent + st.upgrades, profit: st.revenue - st.spent - st.upgrades
  });
  if (game.history.length > 10) {
    game.history.shift();
  }
  if (st.served > 0) {
    addXP(10 + st.served * 2);
  }
  game.scene = "results";
  setSizzle(0);
  saveGame(true);
  playSound("endDay");
}

function nextDay() {
  game.day = game.day + 1;
  startDay();
}

// ---------- الزبون والطلب ----------

function sauceLabel(key) {
  for (let i = 0; i < SAUCES.length; i++) {
    if (SAUCES[i].key === key) {
      return SAUCES[i].label;
    }
  }
  return "";
}

// الزبون يا بيختار صوص معين يا من غير صوص خالص (مفيش "أي صوص")
function pickSauceRule() {
  return Math.random() < 0.7 ? pickOne(SAUCE_KEYS) : "none";
}

function sauceNote(rule) {
  return rule === "none" ? " (من غير صوص)" : " (" + sauceLabel(rule) + ")";
}

// ترتيب البرجر المطلوب كنص للتذكرة
function recipeHintFor(item) {
  const core = MENU[item.id].recipe;
  const parts = [LAYER_NAMES[core[0]]];
  if (item.sauce !== "none") {
    parts.push(sauceLabel(item.sauce));
  }
  for (let i = 1; i < core.length; i++) {
    parts.push(LAYER_NAMES[core[i]]);
  }
  return parts.join(" > ");
}

function makeOrder() {
  const items = [];
  const burgerId = game.up.cheese > 0 && Math.random() < 0.4 ? "cheese" : "classic";
  items.push({ kind: "burger", id: burgerId, sauce: pickSauceRule() });
  if (game.up.fries > 0 && Math.random() < 0.4) {
    items.push({ kind: "fries", id: "fries" });
  }
  if (game.up.drinks > 0 && Math.random() < 0.4) {
    items.push({ kind: "drink", id: Math.random() < 0.5 ? "cola" : "orange" });
  }
  let price = 0;
  const lines = [];
  items.forEach(function (it) {
    price = price + MENU[it.id].price;
    lines.push(MENU[it.id].name + (it.kind === "burger" ? sauceNote(it.sauce) : ""));
  });
  return { items: items, price: price, lines: lines, text: lines.join(" + ") };
}

function freeCustomerSlot() {
  for (let i = 0; i < slotCount(); i++) {
    if (game.customers[i] === null) {
      return i;
    }
  }
  return -1;
}

function spawnCustomer(slot) {
  let idx = Math.floor(Math.random() * CHARACTERS.length);
  while (idx === game.lastLook) {
    idx = Math.floor(Math.random() * CHARACTERS.length);
  }
  game.lastLook = idx;
  const look = CHARACTERS[idx];
  const order = makeOrder();
  const patience = MAX_PATIENCE * look.mul + 12 * (order.items.length - 1) + 12;
  game.customers[slot] = {
    state: "ordering", look: look, maxPatience: patience, patience: patience, order: order, enter: 0,
    dlg: { lines: buildDialogue(look, order), idx: 0, t: 0 }, ticket: null
  };
  playSound("bell");
}

function customerLeaves(i) {
  game.customers[i] = null;
  game.spawnTimer = (3 + Math.random() * 4) * ratingFactor();
}

function takeOrder(i) {
  const c = game.customers[i];
  c.ticket = { number: game.nextOrderNumber, order: c.order };
  game.nextOrderNumber = game.nextOrderNumber + 1;
  c.dlg.idx = c.dlg.lines.length - 1;
  c.state = "waiting";
  playSound("pop");
}

// ---------- المطبخ ----------

function getDoneness(cookTime) {
  if (cookTime < COOK_RAW_UNTIL) {
    return "raw";
  }
  if (cookTime <= COOK_BURNT_AFTER) {
    return "cooked";
  }
  return "burnt";
}

function getFryDoneness(cookTime) {
  if (cookTime < FRY_RAW_UNTIL) {
    return "raw";
  }
  if (cookTime <= FRY_BURNT_AFTER) {
    return "cooked";
  }
  return "burnt";
}





// أول مكان فاضي على البوتاجاز أو القلاية (بحسب التطويرات)

// رغيف أو جبنة بيطيروا من الصندوق للطبق المتحدد











// ---------- محطة البطاطس والمشروبات ----------



// ماكينة المشروبات: 1) خد كوباية فاضية 2) اختار النكهة 3) استنى تتملي 4) خدها



// ---------- تسليم الطلب ----------

// بيحكم على برجر: "ok" أو "wrong" أو "wrongsauce" أو "raw" أو "burnt"
function judgeBurger(layers, item) {
  const sauces = layers.filter(function (l) { return l.type === "sauce"; });
  const rest = layers.filter(function (l) { return l.type !== "sauce"; });
  const core = MENU[item.id].recipe;
  if (rest.length !== core.length) {
    return "wrong";
  }
  for (let i = 0; i < core.length; i++) {
    if (rest[i].type !== core[i]) {
      return "wrong";
    }
  }
  // الصوص لو موجود لازم يكون واحد وفوق الرغيف اللي تحت
  if (sauces.length > 1 || (sauces.length === 1 && layers[1].type !== "sauce")) {
    return "wrong";
  }
  if (item.sauce === "none") {
    if (sauces.length > 0) {
      return "wrongsauce";
    }
  } else if (sauces.length !== 1 || sauces[0].key !== item.sauce) {
    return "wrongsauce";
  }
  const patty = rest[1];
  if (patty.doneness === "raw") {
    return "raw";
  }
  if (patty.doneness === "burnt") {
    return "burnt";
  }
  return "ok";
}

// بيقارن عنصر مطلوب بعنصر على الصينية: "ok" أو سبب المشكلة أو "wrongkind"
function judgeItem(item, t) {
  if (item.kind !== t.kind) {
    return "wrongkind";
  }
  if (item.kind === "burger") {
    return judgeBurger(t.layers, item);
  }
  if (item.kind === "fries") {
    if (t.doneness === "raw") {
      return "rawfries";
    }
    return t.doneness === "burnt" ? "burntfries" : "ok";
  }
  return t.drink === item.id ? "ok" : "wrongdrink";
}

const PROBLEM_TEXT = {
  raw: "الباتي لسه نيّ!",
  burnt: "الباتي محروق!",
  wrong: "البرجر مش زي ما طلبت!",
  wrongsauce: "الصوص مش زي ما طلبت!",
  rawfries: "البطاطس لسه بيضا!",
  burntfries: "البطاطس محروقة!",
  wrongdrink: "المشروب غلط!",
  missing: "ناقص حاجة من الطلب!"
};

function evaluateOrder(order, tray) {
  const used = tray.map(function () { return false; });
  let paid = 0;
  let problem = null;
  order.items.forEach(function (item) {
    let found = -1;
    let reason = null;
    for (let j = 0; j < tray.length; j++) {
      if (used[j]) {
        continue;
      }
      const r = judgeItem(item, tray[j]);
      if (r === "ok") {
        found = j;
        break;
      }
      if (r !== "wrongkind" && reason === null) {
        reason = r;
      }
    }
    if (found >= 0) {
      used[found] = true;
      paid = paid + MENU[item.id].price;
    } else if (problem === null) {
      problem = reason === null ? "missing" : reason;
    }
  });
  return { paid: paid, problem: problem };
}

function freeTable() {
  for (let i = 0; i < game.up.tables; i++) {
    let taken = false;
    for (let k = 0; k < game.diners.length; k++) {
      if (game.diners[k].table === i) {
        taken = true;
      }
    }
    if (!taken) {
      return i;
    }
  }
  return -1;
}

function serveCustomer(i) {
  const c = game.customers[i];
  const ratio = c.patience / c.maxPatience;
  const result = evaluateOrder(c.order, game.trays[i]);

  game.cash = game.cash + result.paid;
  game.stats.revenue = game.stats.revenue + result.paid;
  if (result.paid > 0) {
    addFloat("+" + result.paid + " EGP", layout().tray[i], 560, "#8fdc5a", 26);
  }
  if (result.problem === null) {
    game.stats.served = game.stats.served + 1;
    showMessage("الزبون مبسوط! +" + result.paid + " EGP", "#8fdc5a");
    playSound("cash");
    const stars = ratio > 0.5 ? 5 : (ratio > 0.25 ? 4 : 3);
    addXP(12 + Math.floor(result.paid / 10) + (stars === 5 ? 8 : 0), layout().tray[i], 520);
    const table = freeTable();
    if (table >= 0) {
      // الزبون بيقعد ياكل، والتقييم بعد ما يخلص
      game.diners.push({ table: table, look: c.look, timer: DINE_TIME, stars: stars });
    } else {
      addReview(c.look, stars, null, false);
    }
  } else {
    game.stats.rejected = game.stats.rejected + 1;
    const extra = result.paid > 0 ? " (دفع " + result.paid + " EGP)" : "";
    showMessage(PROBLEM_TEXT[result.problem] + extra, "#ff7a70");
    playSound(result.paid > 0 ? "cash" : "buzz");
    addReview(c.look, result.paid > 0 ? 2 : 1, result.problem, false);
    if (result.paid > 0) {
      addXP(5, layout().tray[i], 520);
    }
  }
  game.trays[i] = [];
  customerLeaves(i);
}

// ---------- طلب المكونات من اللابتوب ----------

function availableShopItems() {
  return SHOP_ITEMS.filter(function (it) {
    return !it.needs || game.up[it.needs] > 0;
  });
}

function shopPageCount() {
  return Math.max(1, Math.ceil(availableShopItems().length / SHOP_PER_PAGE));
}

function visibleShopItems() {
  if (game.shopPage >= shopPageCount()) {
    game.shopPage = shopPageCount() - 1;
  }
  return availableShopItems().slice(game.shopPage * SHOP_PER_PAGE, (game.shopPage + 1) * SHOP_PER_PAGE);
}

function cartTotal() {
  let total = 0;
  for (let i = 0; i < SHOP_ITEMS.length; i++) {
    total = total + game.cart[SHOP_ITEMS[i].key] * SHOP_ITEMS[i].price;
  }
  return total;
}

function changeCart(key, amount) {
  const next = game.cart[key] + amount;
  if (next >= 0 && next <= 9) {
    game.cart[key] = next;
  }
}

function incomingPatties() {
  let n = 0;
  game.deliveries.forEach(function (d) {
    n = n + (d.items.patties || 0);
  });
  return n;
}

function orderIngredients() {
  const total = cartTotal();
  if (total <= 0) {
    denyClick("اختار الكميات الأول");
    return;
  }
  if (!canPay(total)) {
    denyClick("فلوسك مش كفاية!");
    return;
  }
  const newPatties = game.cart.patties * 10;
  if (newPatties > 0 && game.stock.patties + incomingPatties() + newPatties > freezerCap()) {
    denyClick("مفيش مكان في الفريزر! (السعة " + freezerCap() + ")");
    return;
  }
  pay(total, "طلب مكونات");
  game.stats.spent = game.stats.spent + total;
  game.deliveryCount = game.deliveryCount + 1;
  const items = {};
  for (let i = 0; i < SHOP_ITEMS.length; i++) {
    const it = SHOP_ITEMS[i];
    items[it.key] = game.cart[it.key] * it.pack;
    game.cart[it.key] = 0;
  }
  game.deliveries.push({ id: game.deliveryCount, items: items, remaining: DELIVERY_MINUTES });
  playSound("cash");
  showMessage("تم الطلب! هيوصل بعد ساعة", "#8fdc5a");
  saveGame(false);
}

function deliverOrder(d) {
  for (let i = 0; i < SHOP_ITEMS.length; i++) {
    const key = SHOP_ITEMS[i].key;
    game.stock[key] = game.stock[key] + (d.items[key] || 0);
  }
  showMessage("وصلت طلبية المكونات رقم " + d.id + "!", "#8fdc5a");
  playSound("delivery");
}

// ---------- تطبيقات اللابتوب ----------

function openApp(a) {
  if (a.locked) {
    showMessage("التوظيف جاي في ميلستون قدام", "#f2b134");
    return;
  }
  game.laptopTab = a.key;
  game.appT = 0;
  if (a.key === "reviews") {
    game.unreadReviews = 0;
  }
  playSound("click");
}

// صفحات كتاب المنيو (بتظهر بس الحاجات اللي انت فتحتها)
function bookSpreads() {
  const spreads = ["burgers", "sauces"];
  if (game.up.fries > 0) {
    spreads.push("sides");
  }
  if (game.up.drinks > 0) {
    spreads.push("drinks");
  }
  return spreads;
}

// ---------- الأماكن اللي تتضغط (hotspots) ----------

function chipColor(active) {
  return { color: active ? "#f2b134" : "#3a5a6b", textColor: active ? "#2b1d14" : "#fff3df" };
}

function getHotspots() {
  const list = [];

  if (game.scene === "loading") {
    return list;
  }

  if (SCENE_HOTSPOTS[game.scene]) {
    return SCENE_HOTSPOTS[game.scene]();
  }

  if (game.scene === "menu") {
    const hasProgress = game.started || game.saveInfo !== null;
    let y = 188;
    const add = function (name, label, color, textColor, action) {
      list.push({ name: name, box: { x: 760, y: y, w: 340, h: 50 }, label: label, size: 21, color: color, textColor: textColor, action: action });
      y = y + 58;
    };
    if (hasProgress) {
      add("resume", "كمّل اللعب", "#5aa335", "#10260a", onContinue);
      add("start", game.confirmNew ? "متأكد؟ هيمسح التقدم" : "لعبة جديدة", game.confirmNew ? "#d62f2a" : "#f2b134",
        game.confirmNew ? "#fff3df" : "#2b1d14", onNewGame);
    } else {
      add("start", "ابدأ اللعب", "#f2b134", "#2b1d14", onNewGame);
    }
    add("tutorial", "التدريب", "#3d6fbf", "#fff3df", function () { startTutorial(false); });
    add("settings", "الإعدادات", "#6b7580", "#fff3df", openSettings);
    add("players", "تغيير اللاعب", "#6b7580", "#fff3df", openPlayers);
    if (typeof canInstall === "function" && canInstall()) {
      add("install", "ثبّت اللعبة", "#1f8a6a", "#fff3df", installApp);
    }
    add("exit", "خروج", "#d62f2a", "#fff3df", exitGame);
    return list;
  }

  if (game.scene === "results") {
    list.push({
      name: "nextDay", box: { x: 380, y: 600, w: 250, h: 56 }, label: "اليوم الجاي",
      color: "#5aa335", textColor: "#10260a", action: nextDay
    });
    list.push({
      name: "toMenu", box: { x: 660, y: 600, w: 250, h: 56 }, label: "القائمة الرئيسية",
      color: "#6b7580", textColor: "#fff3df", action: function () { game.resumeScene = "results"; game.scene = "menu"; }
    });
    return list;
  }

  if (game.scene === "counter") {
    list.push({ name: "laptop", box: laptopScreenBox, action: function () { game.laptopTab = "home"; game.appT = 1; game.scene = "laptop"; } });
    list.push({ name: "book", box: BOOK_BOX, action: function () { game.bookPage = 0; game.scene = "book"; playSound("page"); } });
    list.push({
      name: "toKitchen", box: toKitchenBox, label: "لف للمطبخ",
      color: "#d62f2a", textColor: "#fff3df", action: function () { game.scene = "kitchen"; }
    });
    const two = slotCount() === 2;
    for (let i = 0; i < slotCount(); i++) {
      const c = game.customers[i];
      const tag = two ? " " + (i + 1) : "";
      if (c !== null && c.state === "ordering") {
        list.push({
          name: "takeOrder-" + i, box: slotActionBox(i), label: "خُد الطلب" + tag,
          color: "#5aa335", textColor: "#10260a", action: (function (k) { return function () { takeOrder(k); }; })(i)
        });
      }
      if (c !== null && c.state === "waiting" && game.trays[i].length > 0) {
        list.push({
          name: "serve-" + i, box: slotActionBox(i), label: "سلّم الطلب" + tag,
          color: "#f2b134", textColor: "#2b1d14", action: (function (k) { return function () { serveCustomer(k); }; })(i)
        });
      }
      if (game.trays[i].length > 0) {
        list.push({
          name: "clearTray-" + i, box: clearTrayBox(i), label: "فضّي", size: 13,
          color: "#6b7580", textColor: "#fff3df", action: (function (k) { return function () { clearTray(k); }; })(i)
        });
      }
    }
  } else if (game.scene === "kitchen") {
    list.push({
      name: "kitchenBack", box: kitchenBackBox, label: "رجوع للكاونتر",
      color: "#d62f2a", textColor: "#fff3df", action: function () { game.scene = "counter"; }
    });
    list.push({
      name: "discard", box: discardBox, label: "ارمي الطبق",
      color: "#6b7580", textColor: "#fff3df", action: discardPlate
    });
    list.push({
      name: "send", box: sendBox, label: "حط على الصينية",
      color: "#5aa335", textColor: "#10260a", action: sendToTray
    });
    list.push({
      name: "toSides", box: toSidesBox, label: "محطة البطاطس والمشروبات",
      color: "#3d6fbf", textColor: "#fff3df", action: function () { game.scene = "sides"; }
    });
    if (slotCount() === 2) {
      for (let i = 0; i < 2; i++) {
        const cc = chipColor(game.sel === i);
        list.push({
          name: "target-" + i, box: { x: 282 + i * 76, y: 660, w: 72, h: 46 }, label: "طلب " + (i + 1), size: 14,
          color: cc.color, textColor: cc.textColor, action: (function (k) { return function () { selectSlot(k); }; })(i)
        });
        list.push({
          name: "plate-" + i, box: { x: plateX(i) - 70, y: 540, w: 140, h: 100 },
          action: (function (k) { return function () { selectSlot(k); }; })(i)
        });
      }
    }
    list.push({ name: "bin-bun", box: BUN_BIN, action: onBunClick });
    list.push({ name: "bin-cheese", box: CHEESE_BIN, action: onCheeseClick });
    list.push({ name: "freezer", box: FREEZER_BOX, action: onFreezerClick });
    SAUCES.forEach(function (s) {
      list.push({
        name: "sauce-" + s.key, box: { x: s.x - 36, y: 80, w: 72, h: 180 },
        action: function () { onSauceClick(s); }
      });
    });
    STOVE_SLOTS.forEach(function (s, i) {
      const p = game.grill[i];
      if (p !== null && !p.arriving) {
        list.push({
          name: "slot-" + i, box: { x: s.x - 60, y: s.y - 60, w: 120, h: 120 },
          action: function () { onSlotClick(i); }
        });
      }
    });
  } else if (game.scene === "sides") {
    list.push({
      name: "sidesBack", box: kitchenBackBox, label: "رجوع للمطبخ",
      color: "#d62f2a", textColor: "#fff3df", action: function () { game.scene = "kitchen"; }
    });
    list.push({
      name: "sidesCounter", box: sidesToCounterBox, label: "روح للكاونتر",
      color: "#5aa335", textColor: "#10260a", action: function () { game.scene = "counter"; }
    });
    if (slotCount() === 2) {
      for (let i = 0; i < 2; i++) {
        const cc = chipColor(game.sel === i);
        list.push({
          name: "target-" + i, box: { x: 545 + i * 130, y: 660, w: 120, h: 46 }, label: "لطلب " + (i + 1), size: 17,
          color: cc.color, textColor: cc.textColor, action: (function (k) { return function () { selectSlot(k); }; })(i)
        });
      }
    }
    list.push({ name: "bin-potato", box: POTATO_BIN, action: onPotatoClick });
    FRYER_SLOTS.forEach(function (s, i) {
      const p = game.fryer[i];
      if (p !== null && !p.arriving) {
        list.push({
          name: "fry-" + i, box: { x: s.x - 60, y: s.y - 50, w: 120, h: 100 },
          action: function () { onFryerClick(i); }
        });
      }
    });
    list.push({ name: "soda-stack", box: SODA.stack, action: onCupStackClick });
    list.push({ name: "soda-cup", box: SODA.cupSlot, action: onCupPickup });
    list.push({
      name: "soda-cola", box: SODA.colaBtn, label: "كولا", size: 17,
      color: "#4a2615", textColor: "#fff3df", action: function () { onFlavorClick("cola", "الكولا"); }
    });
    list.push({
      name: "soda-orange", box: SODA.orangeBtn, label: "برتقان", size: 17,
      color: "#f08a1c", textColor: "#2b1d14", action: function () { onFlavorClick("orange", "العصير"); }
    });
  } else if (game.scene === "book") {
    const spreads = bookSpreads();
    if (game.bookPage < spreads.length - 1) {
      list.push({
        name: "bookNext", box: { x: 215, y: 612, w: 200, h: 46 }, label: "الصفحة الجاية",
        color: "#6b4a32", textColor: "#fff3df", action: function () { game.bookPage = game.bookPage + 1; playSound("page"); }
      });
    }
    if (game.bookPage > 0) {
      list.push({
        name: "bookPrev", box: { x: 865, y: 612, w: 200, h: 46 }, label: "الصفحة اللي قبلها",
        color: "#6b4a32", textColor: "#fff3df", action: function () { game.bookPage = game.bookPage - 1; playSound("page"); }
      });
    }
    list.push({
      name: "bookClose", box: { x: 540, y: 612, w: 200, h: 46 }, label: "اقفل المنيو",
      color: "#d62f2a", textColor: "#fff3df", action: function () { game.scene = "counter"; }
    });
  } else if (game.scene === "laptop") {
    const tab = game.laptopTab;
    if (tab === "home") {
      OS_APPS.forEach(function (a, i) {
        list.push({ name: "app-" + a.key, box: appIconBox(i), action: function () { openApp(a); } });
      });
      list.push({
        name: "os-close", box: { x: 530, y: 552, w: 220, h: 46 }, label: "إغلاق اللابتوب",
        color: "#d62f2a", textColor: "#fff3df", action: function () { game.scene = "counter"; }
      });
    } else {
      list.push({ name: "dock-home", box: dockBox(0), action: function () { game.laptopTab = "home"; } });
      OS_APPS.forEach(function (a, i) {
        list.push({ name: "dock-" + a.key, box: dockBox(i + 1), action: function () { openApp(a); } });
      });
      list.push({
        name: "os-close", box: { x: 136, y: 540, w: 150, h: 50 }, label: "إغلاق",
        color: "#d62f2a", textColor: "#fff3df", action: function () { game.scene = "counter"; }
      });

      if (tab === "shop") {
        if (game.shopPage > 0) {
          list.push({
            name: "prevPage", box: { x: 330, y: 166, w: 110, h: 34 }, label: "السابق", size: 17,
            color: "#6b7580", textColor: "#fff3df", action: function () { game.shopPage = game.shopPage - 1; }
          });
        }
        if (game.shopPage < shopPageCount() - 1) {
          list.push({
            name: "nextPage", box: { x: 450, y: 166, w: 110, h: 34 }, label: "التالي", size: 17,
            color: "#6b7580", textColor: "#fff3df", action: function () { game.shopPage = game.shopPage + 1; }
          });
        }
        visibleShopItems().forEach(function (it, i) {
          const y = shopRowY(i);
          list.push({
            name: "minus-" + it.key, box: { x: 340, y: y + 8, w: 40, h: 40 }, label: "-",
            color: "#6b7580", textColor: "#fff3df", action: function () { changeCart(it.key, -1); }
          });
          list.push({
            name: "plus-" + it.key, box: { x: 460, y: y + 8, w: 40, h: 40 }, label: "+",
            color: "#5aa335", textColor: "#10260a", action: function () { changeCart(it.key, 1); }
          });
        });
        const canOrder = cartTotal() > 0 && canPay(cartTotal());
        list.push({
          name: "order", box: orderButtonBox, label: "اطلب",
          color: canOrder ? "#5aa335" : "#6b7580", textColor: canOrder ? "#10260a" : "#fff3df", action: orderIngredients
        });
      } else if (tab === "upgrades") {
        UPGRADES.forEach(function (u, i) {
          const card = upgradeCardBox(i);
          const st = upgradeStatus(u);
          list.push({
            name: "buy-" + u.key, box: { x: card.x + 8, y: card.y + 10, w: 104, h: 30 }, label: st.label, size: 15,
            color: st.ok ? "#5aa335" : "#6b7580", textColor: st.ok ? "#10260a" : "#fff3df",
            action: function () { buyUpgrade(u); }
          });
        });
      } else if (tab === "bank") {
        const ui = game.bankUI;
        const subs = [["account", "حسابي"], ["loans", "القروض"], ["history", "السجل"]];
        subs.forEach(function (s, i) {
          const cc = chipColor(ui.tab === s[0]);
          list.push({
            name: "bank-sub-" + s[0], box: bankSubBox(i), label: s[1], size: 17, color: cc.color, textColor: cc.textColor,
            action: function () { ui.tab = s[0]; }
          });
        });
        if (ui.tab === "account") {
          BANK_AMOUNTS.forEach(function (a, i) {
            const cc = chipColor(ui.amountIdx === i);
            list.push({
              name: "bank-amount-" + i, box: bankAmountBox(i), label: String(a), size: 19, color: cc.color, textColor: cc.textColor,
              action: function () { ui.amountIdx = i; }
            });
          });
          list.push({
            name: "bank-deposit", box: BANK_DEPOSIT_BOX, label: "إيداع في البنك", size: 20,
            color: "#5aa335", textColor: "#10260a", action: bankDeposit
          });
          list.push({
            name: "bank-withdraw", box: BANK_WITHDRAW_BOX, label: "سحب من البنك", size: 20,
            color: "#3d6fbf", textColor: "#fff3df", action: bankWithdraw
          });
        } else if (ui.tab === "loans") {
          LOAN_AMOUNTS.forEach(function (a, i) {
            const open = loanUnlocked(i);
            const cc = chipColor(ui.loanIdx === i && open);
            list.push({
              name: "loan-amount-" + i, box: loanAmountBox(i), label: open ? String(a) : "ليفل " + LOAN_LEVELS[i], size: open ? 17 : 13,
              color: open ? cc.color : "#4a525a", textColor: open ? cc.textColor : "#9aa3ab",
              action: function () {
                if (open) {
                  ui.loanIdx = i;
                } else {
                  denyClick("القرض ده بيتفتح عند ليفل " + LOAN_LEVELS[i] + " (ليفلك " + game.level + ")");
                }
              }
            });
          });
          LOAN_TERMS.forEach(function (t, i) {
            const cc = chipColor(ui.termIdx === i);
            list.push({
              name: "loan-term-" + i, box: loanTermBox(i), label: t + " أيام", size: 17, color: cc.color, textColor: cc.textColor,
              action: function () { ui.termIdx = i; }
            });
          });
          list.push({
            name: "loan-take", box: LOAN_TAKE_BOX, label: "خد القرض", size: 21,
            color: "#5aa335", textColor: "#10260a", action: takeLoan
          });
          game.bank.loans.forEach(function (L, i) {
            if (i < 3) {
              list.push({
                name: "loan-pay-" + i, box: loanPayBox(i), label: "سدد الكل", size: 14,
                color: "#d62f2a", textColor: "#fff3df", action: function () { repayLoan(L); }
              });
            }
          });
        }
      }
    }
  }

  // أزرار الواجهة العلوية (في كل مشاهد اللعب)
  list.push({ name: "hud-full", box: HUD_BOXES.full, action: toggleFullscreen });
  list.push({
    name: "hud-sound", box: HUD_BOXES.sound,
    action: function () {
      const anyOn = audioSettings.sfx || audioSettings.music;
      setSfxOn(!anyOn);
      setMusicOn(!anyOn);
    }
  });
  list.push({
    name: "hud-menu", box: HUD_BOXES.menu,
    action: function () {
      if (game.tut) {
        game.tut.skipAsk = true;
        return;
      }
      saveGame(false);
      game.resumeScene = game.scene;
      game.scene = "menu";
    }
  });
  if (game.tut) {
    const tb = tutorialButtons();
    return game.tut.skipAsk ? tb : list.concat(tb);
  }
  return list;
}

function findHotspot(pos) {
  const list = getHotspots();
  for (let i = list.length - 1; i >= 0; i--) {
    if (isInside(list[i].box, pos)) {
      return list[i];
    }
  }
  return null;
}

// ---------- التحديث والحلقة الرئيسية ----------

// بيزود وقت الطبخ، وبيمنع الحرق لو التطوير مفتوح، وبيرن المنبه لو اشتريته
function tickCooking(p, dt, rawUntil, burntAfter, alertText, slotNumber) {
  p.cook = p.cook + dt;
  if (game.up.warm > 0 && p.cook > burntAfter - 0.05) {
    p.cook = burntAfter - 0.05;
  }
  if (game.up.bell > 0 && !p.alerted && p.cook >= rawUntil) {
    p.alerted = true;
    playSound("kitchenBell");
    showMessage(alertText + " (رقم " + slotNumber + ")", "#8fdc5a");
  }
}

function updateCustomers(dt) {
  let free = -1;
  for (let i = 0; i < slotCount(); i++) {
    const c = game.customers[i];
    if (c === null) {
      if (free === -1) {
        free = i;
      }
      continue;
    }
    c.patience = c.patience - dt;
    c.enter = Math.min(1, c.enter + dt * 1.8);
    if (c.state === "ordering" && c.enter >= 1) {
      const d = c.dlg;
      d.t = d.t + dt;
      if (d.idx < d.lines.length - 1 && d.t >= d.lines[d.idx].length / TALK_SPEED + 1.3) {
        d.idx = d.idx + 1;
        d.t = 0;
        playSound("talk", c.look.voice);
      }
    }
    if (c.patience <= 0) {
      game.stats.left = game.stats.left + 1;
      addReview(c.look, 1, "left", false);
      customerLeaves(i);
      showMessage(c.look.name + " زهق ومشي!", "#ff7a70");
      if (free === -1) {
        free = i;
      }
    }
  }
  if (free !== -1 && game.minutes < STOP_SPAWN_AT) {
    game.spawnTimer = game.spawnTimer - dt;
    if (game.spawnTimer <= 0) {
      spawnCustomer(free);
      playSound("talk", game.customers[free].look.voice);
    }
  }
}

function update(dt) {
  game.time = game.time + dt;
  updateEffects(dt);

  if (game.scene === "loading") {
    const L = game.loading;
    L.t = L.t + dt;
    const imagesOk = typeof Image === "undefined" || imageReady("loading");
    if (L.t >= L.dur + 0.4 && (imagesOk || L.t >= L.dur + 3)) {
      L.next();
    }
    return;
  }

  if (!isPlayScene()) {
    setSizzle(0);
    return;
  }

  game.appT = game.appT + dt * 4;

  if (game.tut) {
    tutorialUpdate(dt);
  }

  // الساعة (واقفة في التدريب)
  if (!game.tut) {
    game.minutes = game.minutes + dt * MIN_PER_SEC;
    if (game.minutes >= DAY_END) {
      endDay();
      return;
    }
  }

  // حفظ تلقائي كل 10 ثواني
  game.saveTimer = game.saveTimer + dt;
  if (game.saveTimer >= 10) {
    game.saveTimer = 0;
    saveGame(false);
  }

  updateCustomers(dt);

  // الزباين اللي بياكلوا على الترابيزات
  for (let i = game.diners.length - 1; i >= 0; i--) {
    const d = game.diners[i];
    d.timer = d.timer - dt;
    if (d.timer <= 0) {
      game.diners.splice(i, 1);
      game.cash = game.cash + DINE_TIP;
      game.stats.revenue = game.stats.revenue + DINE_TIP;
      addReview(d.look, d.stars >= 5 ? 5 : d.stars + 1, null, true);
      showMessage(d.look.name + " خلص أكله وساب بقشيش +" + DINE_TIP + " EGP", "#8fdc5a");
      playSound("cash");
      addXP(5, TABLE_SPOTS[d.table].x, 360);
    }
  }

  // الباتي على البوتاجاز والبطاطس في القلاية
  let stoveCooking = 0;
  for (let i = 0; i < game.grill.length; i++) {
    const p = game.grill[i];
    if (p !== null && !p.arriving) {
      tickCooking(p, dt, COOK_RAW_UNTIL, COOK_BURNT_AFTER, "الباتي استوى!", i + 1);
      stoveCooking = stoveCooking + 1;
    }
  }
  let fryCooking = 0;
  for (let i = 0; i < game.fryer.length; i++) {
    const p = game.fryer[i];
    if (p !== null && !p.arriving) {
      tickCooking(p, dt, FRY_RAW_UNTIL, FRY_BURNT_AFTER, "البطاطس استوت!", i + 1);
      fryCooking = fryCooking + 1;
    }
  }
  let sizzle = 0;
  if (game.scene === "kitchen" && stoveCooking > 0) {
    sizzle = Math.min(1, 0.4 + stoveCooking * 0.2);
  } else if (game.scene === "sides" && fryCooking > 0) {
    sizzle = Math.min(1, 0.4 + fryCooking * 0.3);
  }
  setSizzle(sizzle);

  // ماكينة المشروبات
  if (game.soda !== null && game.soda.drink !== null && game.soda.fill < 1) {
    game.soda.fill = Math.min(1, game.soda.fill + dt / sodaFillTime());
    if (game.soda.fill >= 1) {
      playSound("ding");
      showMessage("الكوباية جاهزة!", "#8fdc5a");
    }
  }

  // طلبيات التوصيل
  for (let i = game.deliveries.length - 1; i >= 0; i--) {
    const d = game.deliveries[i];
    d.remaining = d.remaining - dt * MIN_PER_SEC;
    if (d.remaining <= 0) {
      game.deliveries.splice(i, 1);
      deliverOrder(d);
    }
  }

  // الحاجات اللي بتطير
  for (let i = game.flyers.length - 1; i >= 0; i--) {
    const f = game.flyers[i];
    f.t = f.t + dt;
    if (f.t >= f.dur) {
      game.flyers.splice(i, 1);
      f.onDone();
    }
  }
  if (game.stream !== null) {
    game.stream.t = game.stream.t + dt;
    if (game.stream.t >= game.stream.dur) {
      const s = game.stream;
      game.stream = null;
      s.onDone();
    }
  }

  game.freezerOpen = Math.max(0, game.freezerOpen - dt * 1.6);

  if (game.message !== null) {
    game.message.timer = game.message.timer - dt;
    if (game.message.timer <= 0) {
      game.message = null;
    }
  }
}

let lastTime = 0;

function gameLoop(time) {
  let dt = (time - lastTime) / 1000;
  lastTime = time;
  if (dt > 0.1) {
    dt = 0.1;
  }

  update(dt);

  if (game.scene === "loading") {
    drawLoadingScene();
  } else if (game.scene === "menu") {
    drawMenuScene();
  } else if (game.scene === "counter") {
    drawCounterScene();
  } else if (game.scene === "kitchen") {
    drawKitchenScene();
  } else if (game.scene === "sides") {
    drawSidesScene();
  } else if (game.scene === "laptop") {
    drawLaptopScene();
  } else if (game.scene === "book") {
    drawBookScene();
  } else if (game.scene === "results") {
    drawResultsScene();
  } else if (SCENE_DRAW[game.scene]) {
    SCENE_DRAW[game.scene]();
  }
  if (game.tut) {
    drawTutorialOverlay();
  }
  syncRegInputs();

  requestAnimationFrame(gameLoop);
}

// ---------- التحكم بالماوس والكيبورد ----------

let mouseDown = null;
let autoFsDone = false;

function applySlider(h, pos) {
  const v = Math.max(0, Math.min(1, (pos.x - h.box.x) / h.box.w));
  h.slider.set(v);
}

// ملء الشاشة تلقائي مع أول ضغطة (المتصفح مبيسمحش قبل كده)
function autoFullscreenOnce() {
  if (!autoFsDone && settings.autoFullscreen) {
    autoFsDone = true;
    enterFullscreen();
  }
}

canvas.addEventListener("click", function (event) {
  initAudio();
  autoFullscreenOnce();
  const pos = getMousePos(event);
  const h = findHotspot(pos);
  if (h !== null) {
    if (game.scene === "menu" && h.name !== "start") {
      game.confirmNew = false;
    }
    if (h.label || h.name.indexOf("hud") === 0) {
      playSound("click");
    }
    if (h.slider) {
      applySlider(h, pos);
    }
    h.action();
  }
});

canvas.addEventListener("mousedown", function (event) {
  const h = findHotspot(getMousePos(event));
  mouseDown = h !== null && h.slider ? h : null;
});

canvas.addEventListener("mouseup", function () {
  if (mouseDown !== null) {
    saveSettings();
  }
  mouseDown = null;
});

canvas.addEventListener("mousemove", function (event) {
  const pos = getMousePos(event);
  if (mouseDown !== null && (event.buttons & 1)) {
    applySlider(mouseDown, pos);
  }
  const h = findHotspot(pos);
  game.hover = h === null ? "" : h.name;
  canvas.style.cursor = h === null ? "default" : "pointer";
});

document.addEventListener("keydown", function (event) {
  if (event.target && event.target.tagName === "INPUT") {
    return;
  }
  if (event.key === "f" || event.key === "F") {
    toggleFullscreen();
  } else if (event.key === "m" || event.key === "M") {
    const anyOn = audioSettings.sfx || audioSettings.music;
    setSfxOn(!anyOn);
    setMusicOn(!anyOn);
    saveSettings();
  }
});

// حفظ لما تقفل الصفحة أو تغير التاب
window.addEventListener("beforeunload", function () {
  if (game.started && isPlayScene()) {
    saveGame(false);
  }
});
document.addEventListener("visibilitychange", function () {
  if (document.hidden && game.started && isPlayScene()) {
    saveGame(false);
  }
});

// أيقونة اللعبة (favicon) من اللوجو
try {
  const iconLink = document.createElement("link");
  iconLink.rel = "icon";
  iconLink.href = IMAGE_DATA.logo;
  document.head.appendChild(iconLink);
} catch (e) {
  // مش مشكلة لو المتصفح مش بيدعم
}

// بعد التحميل: تسجيل لأول مرة، أو اختيار لاعب، أو القائمة
function bootAfterLoading() {
  syncPending();
  if (profiles.length === 0) {
    openRegister();
  } else if (!game.profile) {
    openPlayers();
  } else {
    game.scene = "menu";
  }
}

loadSettings();
loadProfiles();
if (game.profile) {
  game.xp = game.profile.xp || 0;
  game.level = levelFromXp(game.xp);
}
game.loading = {
  t: 0, dur: 3.4, tip: LOADING_TIPS[0],
  next: bootAfterLoading
};
refreshSaveInfo();
if (document.fonts) {
  document.fonts.load("bold 20px Cairo");
}
requestAnimationFrame(gameLoop);
