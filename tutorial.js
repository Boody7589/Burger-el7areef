// ===== tutorial.js: التدريب (كل حاجة مفتوحة فيه وبالمصري) =====

// ---------- أدوات الدروس ----------

function tutOrder(items) {
  let price = 0;
  const lines = [];
  items.forEach(function (it) {
    price = price + MENU[it.id].price;
    lines.push(MENU[it.id].name + (it.kind === "burger" ? sauceNote(it.sauce) : ""));
  });
  return { items: items, price: price, lines: lines, text: lines.join(" + ") };
}

// زبون بطلب محدد، وصبره مبينتهيش في التدريب
function tutSpawn(lookIdx, items) {
  const look = CHARACTERS[lookIdx];
  const order = tutOrder(items);
  game.customers = [null, null];
  game.customers[0] = {
    state: "ordering", look: look, maxPatience: 999, patience: 999, order: order, enter: 0,
    dlg: { lines: buildDialogue(look, order), idx: 0, t: 0 }, ticket: null
  };
  playSound("bell");
  playSound("talk", look.voice);
}

function c0() {
  return game.customers[0];
}

function plateHas(type, key) {
  return game.plates[0].some(function (l) { return l.type === type && (!key || l.key === key); });
}

function trayHas(kind) {
  return game.trays[0].some(function (t) { return t.kind === kind; });
}

function sameTypes(layers, types) {
  return layers.length === types.length && layers.every(function (l, i) { return l.type === types[i]; });
}

// لو الطبق اتبوّظ (حاجة غلط) بنفضّيه ونرجع لأول الدرس
function plateGuard(before, startId) {
  return function () {
    if (game.pendings[0].length > 0 || game.stream !== null) {
      return null;
    }
    if (!sameTypes(game.plates[0], before)) {
      game.plates[0] = [];
      showMessage("ولا يهمك! هنبدأ الطبق من جديد", "#ffd36b");
      return startId;
    }
    return null;
  };
}

function ensureCookedPatty() {
  if (!game.grill.some(function (p) { return p !== null; }) && !plateHas("patty")) {
    game.grill[0] = { cook: 6.5, arriving: false, alerted: true };
  }
}

// ---------- الخطوات ----------

const TUT_STEPS = [
  { id: "welcome", scene: "counter", info: true,
    text: "أهلاً يا شيف! أنا الشيف حريف وهعلمك الشغل خطوة بخطوة. في التدريب كل حاجة مفتوحة وبتجرب براحتك، ومفيش حاجة هتتحسب عليك." },
  { id: "hud", scene: "counter", info: true, box: { x: 0, y: 0, w: 1280, h: 64 },
    text: "فوق عندك: اسم المطعم والليفل بتاعك، اليوم والساعة، تقييم الزباين، أزرار (ملء الشاشة والصوت والقائمة)، وعلى اليمين فلوسك." },
  { id: "arrive", scene: "counter",
    text: "شوف! زبون دخل المطعم وبيتكلم بكلام غريب ومضحك. استنى لحد ما يقول طلبه في الآخر.",
    enter: function () { tutSpawn(0, [{ kind: "burger", id: "classic", sauce: "ketchup" }]); },
    done: function () { return c0() && (c0().state === "waiting" || (c0().dlg.idx >= c0().dlg.lines.length - 1 && c0().dlg.t > 1.2)); } },
  { id: "take", scene: "counter", target: "takeOrder-0", text: "دوس على 'خُد الطلب' عشان تسجل الطلب.",
    done: function () { return c0() && c0().state === "waiting"; } },
  { id: "ticket", scene: "counter", info: true, box: { x: 440, y: 80, w: 400, h: 160 },
    text: "الطلب اتسجل وبيظهر فوق راس الزبون وعلى تذكرة في المطبخ. وخلي بالك من الشريط الأخضر: لو خلص الزبون بيزهق ويمشي!" },
  { id: "goKitchen", scene: "kitchen", text: "يلا نروح المطبخ نحضر الطلب. دوس على 'لف للمطبخ'.",
    done: function () { return game.scene === "kitchen"; } },
  { id: "kTour", scene: "kitchen", info: true,
    text: "ده المطبخ: الفريزر على الشمال، الرغيف والجبنة في النص، الصوصات متعلقة فوق، والبوتاجاز على اليمين. التذكرة فوق على الشمال بتفكّرك بالطلب." },
  { id: "freezer", allow: ["freezer"], scene: "kitchen", target: "freezer", text: "الباتي بيبدأ من الفريزر. دوس عليه وهيروح على البوتاجاز.",
    done: function () { return game.grill.some(function (p) { return p !== null; }); } },
  { id: "wait", allow: [], scene: "kitchen", target: "slot-0",
    text: "شايف الحلقة حوالين الباتي؟ أصفر معناه نيّ، أخضر معناه استوى، وأحمر معناه اتحرق! استنى لحد ما تبقى خضرا (في التدريب مبيتحرقش).",
    guard: function () {
      if (game.plates[0].length > 0 && game.pendings[0].length === 0) {
        game.plates[0] = [];
        showMessage("لسه بدري! استنى الباتي يستوي", "#ffd36b");
      }
      if (!game.grill.some(function (p) { return p !== null; })) {
        return "freezer";
      }
      return null;
    },
    done: function () { return game.grill[0] !== null && getDoneness(game.grill[0].cook) === "cooked"; } },
  { id: "bun1", allow: ["bun"], scene: "kitchen", target: "bin-bun", text: "دلوقتي نبني البرجر من تحت لفوق. أول حاجة الرغيف التحتاني. دوس على الرغيف.",
    guard: plateGuard([], "bun1"), done: function () { return game.plates[0].length >= 1; } },
  { id: "sauce", allow: ["sauce"], scene: "kitchen", target: "sauce-ketchup", text: "الزبون طلب كاتشب. دوس على زجاجة الكاتشب وشوف الصوص بينزل على البرجر.",
    guard: plateGuard(["bun"], "bun1"), done: function () { return plateHas("sauce", "ketchup"); } },
  { id: "patty", allow: ["patty"], scene: "kitchen", target: "slot-0", text: "دوس على الباتي اللي استوى عشان يتحط على البرجر.",
    guard: function () {
      const g = plateGuard(["bun", "sauce"], "bun1")();
      if (g) { return g; }
      ensureCookedPatty();
      return null;
    }, done: function () { return plateHas("patty"); } },
  { id: "bun2", allow: ["bun"], scene: "kitchen", target: "bin-bun", text: "وآخر حاجة الرغيف اللي فوق.",
    guard: plateGuard(["bun", "sauce", "patty"], "bun1"), done: function () { return game.plates[0].filter(function (l) { return l.type === "bun"; }).length >= 2; } },
  { id: "send", allow: ["send"], scene: "kitchen", target: "send", text: "البرجر جاهز! دوس على 'حط على الصينية'.",
    done: function () { return game.trays[0].length >= 1; } },
  { id: "goCounter", scene: "counter", text: "ارجع للكاونتر عشان تسلّم الطلب.", done: function () { return game.scene === "counter"; } },
  { id: "serve", scene: "counter", target: "serve-0", text: "دوس على 'سلّم الطلب' والزبون هيدفعلك!",
    done: function () { return game.stats.served >= 1; } },
  { id: "reward", scene: "counter", info: true,
    text: "برافو! خدت فلوس. في اللعب الحقيقي بتاخد XP كمان وتقييم بالنجوم، وكل ما ليفلك يزيد بتتفتح حاجات جديدة زي القروض الأكبر في البنك." },

  { id: "l2intro", scene: "counter", info: true,
    text: "دلوقتي طلب أكبر: تشيز برجر من غير أي صوص، ومعاه بطاطس وكولا! الزبون الجديد هيحكي كلامه.",
    enter: function () {
      game.plates = [[], []];
      game.trays = [[], []];
      game.pendings = [[], []];
      tutSpawn(3, [{ kind: "burger", id: "cheese", sauce: "none" }, { kind: "fries", id: "fries" }, { kind: "drink", id: "cola" }]);
    } },
  { id: "take2", scene: "counter", target: "takeOrder-0", text: "دوس 'خُد الطلب'.", done: function () { return c0() && c0().state === "waiting"; } },
  { id: "goKitchen2", scene: "kitchen", text: "على المطبخ تاني.", done: function () { return game.scene === "kitchen"; },
    enter: function () { game.grill = [null, null, null]; game.grill[0] = { cook: 6.5, arriving: false, alerted: true }; } },
  { id: "bunB", allow: ["bun"], scene: "kitchen", target: "bin-bun", text: "الطلب ده من غير صوص! يعني نبدأ بالرغيف ونعدي على الباتي علطول. ابدأ بالرغيف.",
    guard: plateGuard([], "bunB"), done: function () { return game.plates[0].length >= 1; } },
  { id: "pattyB", allow: ["patty"], scene: "kitchen", target: "slot-0", text: "جهزتلك باتي مستوي. دوس عليه عشان يتحط فوق الرغيف.",
    guard: function () {
      const g = plateGuard(["bun"], "bunB")();
      if (g) { return g; }
      ensureCookedPatty();
      return null;
    }, done: function () { return plateHas("patty"); } },
  { id: "cheese", allow: ["cheese"], scene: "kitchen", target: "bin-cheese", text: "تشيز برجر يعني جبنة فوق الباتي. دوس على صندوق الجبنة.",
    guard: plateGuard(["bun", "patty"], "bunB"), done: function () { return plateHas("cheese"); } },
  { id: "bunB2", allow: ["bun"], scene: "kitchen", target: "bin-bun", text: "والرغيف اللي فوق.",
    guard: plateGuard(["bun", "patty", "cheese"], "bunB"), done: function () { return game.plates[0].filter(function (l) { return l.type === "bun"; }).length >= 2; } },
  { id: "sendB", allow: ["send"], scene: "kitchen", target: "send", text: "حطه على الصينية.", done: function () { return trayHas("burger"); } },
  { id: "goSides", scene: "sides", target: "toSides", text: "دلوقتي البطاطس والكولا. دوس على 'محطة البطاطس والمشروبات'.", done: function () { return game.scene === "sides"; } },
  { id: "sTour", scene: "sides", info: true, text: "هنا على الشمال صندوق البطاطس والقلاية، وعلى اليمين ماكينة المشروبات، وفي النص الصينية اللي هتروح عليها الحاجة." },
  { id: "potato", allow: ["potato"], scene: "sides", target: "bin-potato", text: "دوس على صندوق البطاطس وهتنزل في القلاية.",
    done: function () { return game.fryer.some(function (p) { return p !== null; }); } },
  { id: "fryWait", allow: [], scene: "sides", target: "fry-0", text: "استنى لحد ما شريط البطاطس يوصل للأخضر (دهبي). في اللعب الحقيقي لو سبتها كتير بتتحرق!",
    done: function () { return game.fryer[0] !== null && getFryDoneness(game.fryer[0].cook) === "cooked"; },
    guard: function () { return game.fryer.some(function (p) { return p !== null; }) || trayHas("fries") ? null : "potato"; } },
  { id: "friesPick", allow: ["fry"], scene: "sides", target: "fry-0", text: "دوس على البطاطس عشان تروح على الصينية.", done: function () { return trayHas("fries"); } },
  { id: "cups", allow: ["cup"], scene: "sides", target: "soda-stack", text: "المشروبات: دوس على الكبايات الفاضية عشان تحط كوباية في الماكينة.", done: function () { return game.soda !== null; } },
  { id: "flavor", allow: ["flavor"], scene: "sides", target: "soda-cola", text: "اختار كولا وشوف الكوباية بتتملي.", done: function () { return game.soda !== null && game.soda.drink === "cola"; },
    guard: function () { return game.soda === null && !trayHas("drink") ? "cups" : null; } },
  { id: "sodaWait", allow: [], scene: "sides", target: "soda-cup", text: "استنى لحد ما الكوباية تتملي.", done: function () { return game.soda !== null && game.soda.fill >= 1; } },
  { id: "sodaPick", allow: ["pickup"], scene: "sides", target: "soda-cup", text: "دوس على الكوباية عشان تروح على الصينية.", done: function () { return trayHas("drink"); } },
  { id: "back2", scene: "counter", text: "ارجع للكاونتر ونسلّم الطلب.", done: function () { return game.scene === "counter"; } },
  { id: "serve2", scene: "counter", target: "serve-0", text: "سلّم الطلب!", done: function () { return game.stats.served >= 2; } },
  { id: "reward2", scene: "counter", info: true,
    text: "تمام! الصينية كان فيها كل الأصناف. وخلي بالك: لو غلطت في صنف الزبون بيدفع على الصح بس ويزعل من الباقي!" },

  { id: "laptop", scene: "counter", target: "laptop", text: "دلوقتي اللابتوب اللي على الكاونتر. دوس على شاشته.", done: function () { return game.scene === "laptop"; } },
  { id: "osHome", scene: "laptop", tab: "home", info: true,
    text: "ده Burger OS: فيه كل تطبيقاتك. بتفتح أي تطبيق بالدوس على أيقونته، والنقط الحمرا بتقولك فيه جديد." },
  { id: "openShop", scene: "laptop", tab: "shop", text: "افتح تطبيق 'طلب المكونات'.", done: function () { return game.laptopTab === "shop"; } },
  { id: "shopInfo", scene: "laptop", tab: "shop", info: true,
    text: "هنا بتطلب المكونات اللي بتخلص: دوس + على اللي عايزه ثم 'اطلب'. الطلب بيوصل بعد ساعة في اللعبة، والفلوس بتتخصم من الكاش أو من البنك." },
  { id: "plus", scene: "laptop", tab: "shop", target: "plus-buns", text: "زوّد حزمة رغيف بالدوس على +.", done: function () { return game.cart.buns > 0; } },
  { id: "orderIt", scene: "laptop", tab: "shop", target: "order", text: "دوس 'اطلب'.", done: function () { return game.deliveries.length > 0; } },
  { id: "upgrades", scene: "laptop", tab: "upgrades", text: "افتح تطبيق 'التطويرات'.", done: function () { return game.laptopTab === "upgrades"; } },
  { id: "upInfo", scene: "laptop", tab: "upgrades", info: true,
    text: "هنا بتشتري الأصناف الجديدة والترابيزات وتطويرات المطبخ، ومنها 'طلبين مع بعض'. في التدريب كل حاجة مفتوحة، لكن في اللعب الحقيقي بتشتريها بفلوسك." },
  { id: "bank", scene: "laptop", tab: "bank", text: "افتح تطبيق 'البنك'.", done: function () { return game.laptopTab === "bank"; } },
  { id: "bankInfo", scene: "laptop", tab: "bank", info: true,
    text: "البنك: بتودع فلوسك وبتاخد فايدة كل يوم، وبتاخد قروض. بتبدأ بقرض 500 بس، وكل ما ليفلك يزيد بتتفتح قروض أكبر!" },
  { id: "reviews", scene: "laptop", tab: "reviews", text: "افتح تطبيق 'التقييمات'.", done: function () { return game.laptopTab === "reviews"; },
    enter: function () { if (game.reviews.length === 0) { addReview(CHARACTERS[0], 5, null, false); addReview(CHARACTERS[4], 4, null, false); } } },
  { id: "revInfo", scene: "laptop", tab: "reviews", info: true,
    text: "هنا آراء الزباين فيك. التقييم العالي بيجيبلك زباين أكتر، والوحش بيبعدهم." },
  { id: "closeLaptop", scene: "counter", text: "اقفل اللابتوب وارجع للكاونتر.", done: function () { return game.scene === "counter"; } },
  { id: "book", scene: "counter", target: "book", text: "ودي كتاب المنيو اللي على الكاونتر. دوس عليه.", done: function () { return game.scene === "book"; } },
  { id: "bookInfo", scene: "book", info: true,
    text: "هنا الأصناف وطريقة تحضيرها. الصفحات بتتفتح بتفتح الأصناف، وبتقلبها بالأزرار تحت." },
  { id: "closeBook", scene: null, target: "bookClose", text: "اقفل المنيو.", done: function () { return game.scene === "counter"; } },
  { id: "double", scene: "counter", info: true,
    text: "ولما تشتري تطوير 'طلبين مع بعض' هتخدم زبونين مرة واحدة: كل زبون ليه طبق وصينية، والمكونات بتروح لأنسب طبق لوحدها، وتقدر تختار الطبق بالأزرار 'طلب 1' و'طلب 2'." },
  { id: "finish", scene: "counter", info: true, last: true,
    text: "خلصت التدريب يا شيف! كده انت جاهز للشغل الحقيقي. هديتك: 300 EGP زيادة في أول يوم. بالتوفيق!" }
];

// ---------- التحكم في التدريب ----------

function startTutorial(first) {
  game.tutBackup = game.started && !game.tut ? JSON.stringify(buildSaveData(false)) : null;
  game.tutFirst = !!first;
  game.tut = { step: 0, t: 0, doneT: -1, entered: -1, skipAsk: false, used: -1 };
  setupSandbox();
  playSound("start");
}

function setupSandbox() {
  game.cash = 5000;
  game.stock = { buns: 99, patties: 99, cheese: 99, ketchup: 99, mayo: 99, mustard: 99, potatoes: 99, cola: 99, orange: 99, cups: 99 };
  game.up = { cheese: 1, fries: 1, drinks: 1, tables: 2, freezer: 3, stove: 1, fryer: 1, soda: 2, warm: 1, bell: 1, double: 0 };
  game.bank = newBank();
  game.reviews = [];
  game.ratingSum = 0;
  game.ratingCount = 0;
  game.history = [];
  game.deliveries = [];
  game.cart = emptyCart();
  startDay();
  game.minutes = DAY_START + 60;
  game.spawnTimer = 99999;
  game.scene = "counter";
}

function endTutorial(completed) {
  const backup = game.tutBackup;
  game.tut = null;
  if (backup) {
    applySaveData(JSON.parse(backup));
    game.started = true;
  } else {
    game.started = false;
    game.xp = game.profile ? game.profile.xp || 0 : 0;
    game.level = levelFromXp(game.xp);
  }
  game.customers = [null, null];
  game.confirmNew = false;
  if (completed && game.profile && !game.profile.tutorialDone) {
    game.profile.tutorialDone = true;
    game.profile.bonusPending = true;
    saveProfiles();
  }
  if (completed) {
    addConfetti(70);
    playSound("levelup");
  }
  refreshSaveInfo();
  game.scene = "menu";
}

function jumpTo(id) {
  for (let i = 0; i < TUT_STEPS.length; i++) {
    if (TUT_STEPS[i].id === id) {
      game.tut.step = i;
      game.tut.entered = -1;
      game.tut.doneT = -1;
      return;
    }
  }
}

function nextStep() {
  const T = game.tut;
  if (TUT_STEPS[T.step].last) {
    endTutorial(true);
    return;
  }
  T.step = T.step + 1;
  T.doneT = -1;
}

function tutorialUpdate(dt) {
  const T = game.tut;
  if (!T || T.skipAsk) {
    return;
  }
  const st = TUT_STEPS[T.step];
  T.t = T.t + dt;
  if (T.entered !== T.step) {
    T.entered = T.step;
    T.doneT = -1;
    if (st.enter) {
      st.enter();
    }
    if (T.step > 0) {
      playSound("step");
    }
  }
  if (T.doneT < 0 && !st.info && st.done && st.done()) {
    T.doneT = 0;
    addFloat("برافو!", 640, 380, "#ffd36b", 30);
  }
  if (st.guard && T.doneT < 0) {
    const jump = st.guard();
    if (jump) {
      jumpTo(jump);
      return;
    }
  }
  if (T.doneT >= 0) {
    T.doneT = T.doneT + dt;
    if (T.doneT > 0.8) {
      nextStep();
    }
  }
}

// ---------- مساعدة الوصول (أي زرار يوصلك للمشهد المطلوب) ----------

const NAV_EDGES = [
  ["counter", "kitchen", "toKitchen"], ["counter", "laptop", "laptop"], ["counter", "book", "book"],
  ["kitchen", "counter", "kitchenBack"], ["kitchen", "sides", "toSides"], ["sides", "kitchen", "sidesBack"],
  ["sides", "counter", "sidesCounter"], ["laptop", "counter", "os-close"], ["book", "counter", "bookClose"]
];

function navHint(from, to) {
  const seen = { };
  seen[from] = true;
  const queue = [{ scene: from, first: null }];
  while (queue.length > 0) {
    const cur = queue.shift();
    for (let i = 0; i < NAV_EDGES.length; i++) {
      const e = NAV_EDGES[i];
      if (e[0] === cur.scene && !seen[e[1]]) {
        const first = cur.first || e[2];
        if (e[1] === to) {
          return first;
        }
        seen[e[1]] = true;
        queue.push({ scene: e[1], first: first });
      }
    }
  }
  return null;
}

function tutTargetBox() {
  const T = game.tut;
  const st = TUT_STEPS[T.step];
  if (st.box) {
    return st.box;
  }
  let name = st.target || null;
  if (st.scene && game.scene !== st.scene) {
    name = navHint(game.scene, st.scene);
  } else if (st.tab && game.scene === "laptop" && game.laptopTab !== st.tab) {
    if (st.tab === "home") {
      name = "dock-home";
    } else {
      name = game.laptopTab === "home" ? "app-" + st.tab : "dock-" + st.tab;
    }
  }
  if (!name) {
    return null;
  }
  const hs = getHotspots();
  for (let i = 0; i < hs.length; i++) {
    if (hs[i].name === name) {
      return hs[i].box;
    }
  }
  return null;
}

// ---------- الرسم ----------

function tutPanelBox() {
  const s = game.scene;
  if (s === "kitchen") {
    return { x: 788, y: 166, w: 446, h: 262, big: true };
  }
  if (s === "sides") {
    return { x: 552, y: 166, w: 392, h: 250, big: true };
  }
  if (s === "laptop") {
    return { x: 140, y: 636, w: 1000, h: 76, big: false };
  }
  if (s === "book") {
    return { x: 190, y: 660, w: 900, h: 56, big: false };
  }
  return { x: 16, y: 76, w: 330, h: 224, big: true };
}

function drawTutHighlight(b) {
  const pulse = 0.5 + Math.sin(game.time * 6) * 0.5;
  const g = 5 + pulse * 5;
  ctx.strokeStyle = "rgba(255,226,120," + (0.65 + pulse * 0.35).toFixed(2) + ")";
  ctx.lineWidth = 5;
  roundRectPath(b.x - g, b.y - g, b.w + g * 2, b.h + g * 2, 16);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  roundRectPath(b.x - g - 4, b.y - g - 4, b.w + g * 2 + 8, b.h + g * 2 + 8, 18);
  ctx.stroke();
  // سهم بيتنطط
  const bob = Math.sin(game.time * 7) * 6;
  const above = b.y > 140;
  const ax = b.x + b.w / 2;
  const ay = above ? b.y - 22 - bob : b.y + b.h + 22 + bob;
  ctx.fillStyle = "#ffd36b";
  ctx.strokeStyle = "#3a2112";
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (above) {
    ctx.moveTo(ax, ay + 12); ctx.lineTo(ax - 14, ay - 10); ctx.lineTo(ax + 14, ay - 10);
  } else {
    ctx.moveTo(ax, ay - 12); ctx.lineTo(ax - 14, ay + 10); ctx.lineTo(ax + 14, ay + 10);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function tutorialButtons() {
  const T = game.tut;
  const st = TUT_STEPS[T.step];
  const pb = tutPanelBox();
  const list = [];
  if (T.skipAsk) {
    list.push({
      name: "tut-resume", box: { x: 450, y: 330, w: 180, h: 50 }, label: "كمّل التدريب", size: 18,
      color: "#5aa335", textColor: "#10260a", action: function () { T.skipAsk = false; }
    });
    list.push({
      name: "tut-exit", box: { x: 650, y: 330, w: 180, h: 50 }, label: "اخرج", size: 18,
      color: "#d62f2a", textColor: "#fff3df", action: function () { endTutorial(false); }
    });
    return list;
  }
  if (pb.big) {
    if (st.info) {
      list.push({
        name: "tut-next", box: { x: pb.x + pb.w - 132, y: pb.y + pb.h - 52, w: 116, h: 40 }, label: st.last ? "ابدأ اللعب" : "التالي", size: 18,
        color: "#5aa335", textColor: "#10260a", action: nextStep
      });
    }
    list.push({
      name: "tut-skip", box: { x: pb.x + 14, y: pb.y + pb.h - 52, w: 96, h: 40 }, label: "تخطي", size: 15,
      color: "#6b7580", textColor: "#fff3df", action: function () { T.skipAsk = true; }
    });
  } else {
    if (st.info) {
      list.push({
        name: "tut-next", box: { x: pb.x + 14, y: pb.y + pb.h / 2 - 19, w: 120, h: 38 }, label: st.last ? "ابدأ اللعب" : "التالي", size: 17,
        color: "#5aa335", textColor: "#10260a", action: nextStep
      });
    }
    list.push({
      name: "tut-skip", box: { x: pb.x + (st.info ? 148 : 14), y: pb.y + pb.h / 2 - 19, w: 90, h: 38 }, label: "تخطي", size: 15,
      color: "#6b7580", textColor: "#fff3df", action: function () { T.skipAsk = true; }
    });
  }
  return list;
}

function drawTutorialOverlay() {
  const T = game.tut;
  if (!T) {
    return;
  }
  const st = TUT_STEPS[T.step];
  const pb = tutPanelBox();
  if (!T.skipAsk) {
    const hb = tutTargetBox();
    if (hb) {
      drawTutHighlight(hb);
    }
  }
  const text = typeof st.text === "function" ? st.text() : st.text;
  withShadow(20, 8, "rgba(0,0,0,0.55)", function () {
    outlinedRound(pb.x, pb.y, pb.w, pb.h, 18, "rgba(30,18,10,0.95)", 3, "#f2b134");
  });
  // الشيف
  if (pb.big) {
    drawAvatar(CHEF_LOOK, pb.x + pb.w - 44, pb.y + 44, 32, 270, 130);
    drawText(CHEF_LOOK.name, pb.x + pb.w - 84, pb.y + 28, 14, "#f2b134", "right");
    drawText("الخطوة " + (T.step + 1) + " / " + TUT_STEPS.length, pb.x + pb.w - 84, pb.y + 48, 13, "#bfe3f2", "right");
    // الخط بيصغر لو الكلام طويل عشان يفضل جوه اللوحة
    let size = 17;
    let lines = wrapText(text, pb.w - 40, size);
    while (size > 12 && lines.length * size * 1.45 > pb.h - 52 - 74) {
      size = size - 1;
      lines = wrapText(text, pb.w - 40, size);
    }
    for (let i = 0; i < lines.length; i++) {
      drawText(lines[i], pb.x + pb.w - 20, pb.y + 84 + i * size * 1.45, size, "#fff3df", "right");
    }
    fillRound(pb.x + 14, pb.y + 8, pb.w - 120, 6, 3, "rgba(255,255,255,0.15)");
    fillRound(pb.x + 14, pb.y + 8, Math.max(6, (pb.w - 120) * ((T.step + 1) / TUT_STEPS.length)), 6, 3, "#f2b134");
  } else {
    drawAvatar(CHEF_LOOK, pb.x + pb.w - 40, pb.y + pb.h / 2, 26, 270, 130);
    const lines = wrapText(text, pb.w - 380, 16);
    for (let i = 0; i < lines.length && i < 3; i++) {
      drawText(lines[i], pb.x + pb.w - 78, pb.y + 22 + i * 21, 16, "#fff3df", "right");
    }
    drawText((T.step + 1) + " / " + TUT_STEPS.length, pb.x + 330, pb.y + pb.h - 10, 13, "#bfe3f2");
  }
  if (T.skipAsk) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, 1280, 720);
    outlinedRound(420, 230, 440, 170, 20, "rgba(30,18,10,0.97)", 3, "#f2b134");
    drawText("تحب تخرج من التدريب؟", 640, 285, 24, "#fff3df");
    drawText("تقدر ترجعله من الإعدادات في أي وقت", 640, 312, 15, "#bfe3f2");
  }
  const bs = tutorialButtons();
  for (let i = 0; i < bs.length; i++) {
    drawButton(bs[i].box, bs[i].label, bs[i].color, bs[i].textColor, game.hover === bs[i].name, bs[i].size);
  }
}

// في التدريب: بنسمح بس بالحركة المطلوبة في الخطوة (وبمرة واحدة)
function tutAllow(kind) {
  const T = game.tut;
  if (!T) {
    return true;
  }
  const st = TUT_STEPS[T.step];
  if (!st.allow && !st.info) {
    return true;
  }
  if (T.doneT >= 0) {
    return false;
  }
  if (st.allow && st.allow.indexOf(kind) >= 0 && T.used !== T.step) {
    T.used = T.step;
    return true;
  }
  if (T.used !== T.step) {
    showMessage("اتبع السهم الدهبي يا شيف", "#ffd36b");
  }
  return false;
}
