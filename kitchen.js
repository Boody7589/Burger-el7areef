// ===== kitchen.js: منطق المطبخ ومحطة البطاطس والمشروبات =====
// الأطباق: كل طلب ليه طبق. الطبقات اللي لسه بتطير بتتحسب في game.pendings

// الطبقات اللي على الطبق + اللي بتطير ليه
function layersOf(i) {
  return game.plates[i].concat(game.pendings[i]);
}

function platePending(i) {
  return game.plates[i].length + game.pendings[i].length;
}

function plateTop(i) {
  return burgerTopY(layersOf(i), PLATE_BASE_Y, layout().plateScale);
}

// هل الطبق ده يقبل المكون ده في الترتيب الصح؟
function canAccept(layers, type) {
  const hasPatty = layers.some(function (l) { return l.type === "patty"; });
  const hasCheese = layers.some(function (l) { return l.type === "cheese"; });
  const buns = layers.filter(function (l) { return l.type === "bun"; }).length;
  if (type === "bun") {
    return layers.length === 0 || (hasPatty && buns < 2);
  }
  if (type === "sauce") {
    return layers.length === 1 && layers[0].type === "bun";
  }
  if (type === "patty") {
    return buns === 1 && !hasPatty;
  }
  if (type === "cheese") {
    return hasPatty && !hasCheese && buns === 1;
  }
  return true;
}

// المكون بيروح للطبق المتحدد لو مناسب، وإلا للطبق التاني لو هو اللي مناسب
function pickPlate(type) {
  const sel = selSlot();
  if (canAccept(layersOf(sel), type)) {
    return sel;
  }
  if (slotCount() === 2) {
    const other = 1 - sel;
    if (canAccept(layersOf(other), type)) {
      game.sel = other;
      showMessage("المكون راح لطبق طلب " + (other + 1), "#ffd36b");
      return other;
    }
  }
  return sel;
}

function removePending(idx, type) {
  const k = game.pendings[idx].findIndex(function (p) { return p.type === type; });
  if (k >= 0) {
    game.pendings[idx].splice(k, 1);
  }
}

// رغيف أو جبنة بيطيروا من الصندوق للطبق المناسب
function addLayerFromBin(type, kind, bin, stockKey, label) {
  if (game.stock[stockKey] <= 0) {
    denyClick(label + " خلص! اطلب من اللابتوب");
    return;
  }
  const idx = pickPlate(type);
  if (platePending(idx) >= 6) {
    denyClick("الطبق مليان!");
    return;
  }
  const y1 = plateTop(idx) - 10;
  game.stock[stockKey] = game.stock[stockKey] - 1;
  game.pendings[idx].push({ type: type });
  playSound("pop");
  addFlyer({
    kind: kind, x0: bin.x + bin.w / 2, y0: bin.y + 60, x1: plateX(idx), y1: y1, dur: 0.4,
    onDone: function () {
      removePending(idx, type);
      game.plates[idx].push({ type: type });
    }
  });
}

function onSauceClick(s) {
  if (!tutAllow("sauce")) {
    return;
  }
  if (game.stream !== null) {
    return;
  }
  if (game.stock[s.key] <= 0) {
    denyClick(s.label + " خلص! اطلب من اللابتوب");
    return;
  }
  const idx = pickPlate("sauce");
  if (platePending(idx) >= 6) {
    denyClick("الطبق مليان!");
    return;
  }
  const y1 = plateTop(idx) - 4;
  game.stock[s.key] = game.stock[s.key] - 1;
  game.pendings[idx].push({ type: "sauce", key: s.key });
  playSound("squirt");
  game.stream = {
    key: s.key, color: s.color, x0: s.x, y0: 206, x1: plateX(idx), y1: y1, t: 0, dur: 0.8,
    onDone: function () {
      removePending(idx, "sauce");
      game.plates[idx].push({ type: "sauce", key: s.key, color: s.color });
    }
  };
}

function onSlotClick(i) {
  if (!tutAllow("patty")) {
    return;
  }
  const p = game.grill[i];
  if (p === null || p.arriving) {
    return;
  }
  const idx = pickPlate("patty");
  if (platePending(idx) >= 6) {
    denyClick("الطبق مليان!");
    return;
  }
  const y1 = plateTop(idx) - 12;
  const done = getDoneness(p.cook);
  game.grill[i] = null;
  game.pendings[idx].push({ type: "patty", doneness: done });
  playSound("pop");
  addFlyer({
    kind: "patty", doneness: done, x0: STOVE_SLOTS[i].x, y0: STOVE_SLOTS[i].y, x1: plateX(idx), y1: y1, dur: 0.45,
    onDone: function () {
      removePending(idx, "patty");
      game.plates[idx].push({ type: "patty", doneness: done });
    }
  });
}

function discardPlate() {
  if (!tutAllow("discard")) {
    return;
  }
  const idx = selSlot();
  if (game.pendings[idx].length > 0) {
    return;
  }
  game.plates[idx] = [];
}

function sendToTray() {
  if (!tutAllow("send")) {
    return;
  }
  const idx = selSlot();
  if (game.pendings[idx].length > 0) {
    return;
  }
  if (game.plates[idx].length === 0) {
    denyClick("الطبق فاضي!");
    return;
  }
  if (trayFull(idx)) {
    denyClick("الصينية مليانة!");
    return;
  }
  game.trays[idx].push({ kind: "burger", layers: game.plates[idx] });
  game.plates[idx] = [];
  playSound("pop");
  showMessage(slotCount() === 2 ? "البرجر اتحط على صينية طلب " + (idx + 1) : "البرجر اتحط على الصينية", "#8fdc5a");
}

function plateX(i) {
  return layout().plate[i];
}

function addFlyer(f) {
  f.t = 0;
  game.flyers.push(f);
}

function freeSlot(list, limit) {
  for (let i = 0; i < limit; i++) {
    if (list[i] === null) {
      return i;
    }
  }
  return -1;
}

function onBunClick() {
  if (!tutAllow("bun")) {
    return;
  }
  addLayerFromBin("bun", "bun", BUN_BIN, "buns", "الرغيف");
}

function onCheeseClick() {
  if (!tutAllow("cheese")) {
    return;
  }
  if (game.up.cheese < 1) {
    denyClick("الجبنة مقفولة! افتحها من التطويرات");
    return;
  }
  addLayerFromBin("cheese", "cheese", CHEESE_BIN, "cheese", "الجبنة");
}

function onFreezerClick() {
  if (!tutAllow("freezer")) {
    return;
  }
  if (game.stock.patties <= 0) {
    denyClick("الفريزر فاضي! اطلب باتي من اللابتوب");
    return;
  }
  const slot = freeSlot(game.grill, stoveBurners());
  if (slot === -1) {
    denyClick("البوتاجاز مليان!");
    return;
  }
  game.stock.patties = game.stock.patties - 1;
  game.freezerOpen = 1;
  game.grill[slot] = { cook: 0, arriving: true, alerted: false };
  playSound("freezer");
  addFlyer({
    kind: "patty", doneness: "raw", x0: FREEZER_BOX.x + 95, y0: FREEZER_BOX.y + 150,
    x1: STOVE_SLOTS[slot].x, y1: STOVE_SLOTS[slot].y, dur: 0.6,
    onDone: function () {
      game.grill[slot].arriving = false;
      playSound("sizzle");
    }
  });
}

function trayFull(i) {
  return game.trays[i].length + game.trayPendings[i] >= TRAY_MAX;
}

function clearTray(i) {
  game.trays[i] = [];
}

function selectSlot(i) {
  game.sel = i;
  playSound("click");
}

function onPotatoClick() {
  if (!tutAllow("potato")) {
    return;
  }
  if (game.up.fries < 1) {
    denyClick("البطاطس مقفولة! افتحها من التطويرات");
    return;
  }
  if (game.stock.potatoes <= 0) {
    denyClick("البطاطس خلصت! اطلب من اللابتوب");
    return;
  }
  const slot = freeSlot(game.fryer, fryerSlots());
  if (slot === -1) {
    denyClick("القلاية مليانة!");
    return;
  }
  game.stock.potatoes = game.stock.potatoes - 1;
  game.fryer[slot] = { cook: 0, arriving: true, alerted: false };
  playSound("pop");
  addFlyer({
    kind: "potato", x0: POTATO_BIN.x + 65, y0: POTATO_BIN.y + 50, x1: FRYER_SLOTS[slot].x, y1: FRYER_SLOTS[slot].y, dur: 0.5,
    onDone: function () {
      game.fryer[slot].arriving = false;
      playSound("sizzle");
    }
  });
}

function onFryerClick(i) {
  if (!tutAllow("fry")) {
    return;
  }
  const p = game.fryer[i];
  const idx = selSlot();
  if (p === null || p.arriving) {
    return;
  }
  if (trayFull(idx)) {
    denyClick("الصينية مليانة!");
    return;
  }
  const done = getFryDoneness(p.cook);
  game.fryer[i] = null;
  game.trayPendings[idx] = game.trayPendings[idx] + 1;
  playSound("pop");
  addFlyer({
    kind: "fries", doneness: done, x0: FRYER_SLOTS[i].x, y0: FRYER_SLOTS[i].y, x1: TRAY_PREVIEW.x, y1: TRAY_PREVIEW.y - 20, dur: 0.5,
    onDone: function () {
      game.trays[idx].push({ kind: "fries", doneness: done });
      game.trayPendings[idx] = game.trayPendings[idx] - 1;
    }
  });
}

function onCupStackClick() {
  if (!tutAllow("cup")) {
    return;
  }
  if (game.up.drinks < 1) {
    denyClick("الماكينة مقفولة! افتحها من التطويرات");
    return;
  }
  if (game.soda !== null) {
    denyClick("فيه كوباية في الماكينة لسه");
    return;
  }
  if (game.stock.cups <= 0) {
    denyClick("الكبايات خلصت! اطلب من اللابتوب");
    return;
  }
  game.stock.cups = game.stock.cups - 1;
  game.soda = { drink: null, fill: 0 };
  playSound("pop");
}

function onFlavorClick(key, label) {
  if (!tutAllow("flavor")) {
    return;
  }
  if (game.up.drinks < 1) {
    denyClick("الماكينة مقفولة! افتحها من التطويرات");
    return;
  }
  if (game.soda === null) {
    denyClick("حط كوباية فاضية الأول");
    return;
  }
  if (game.soda.drink !== null) {
    denyClick("الكوباية دي اتحددت نكهتها");
    return;
  }
  if (game.stock[key] <= 0) {
    denyClick(label + " خلص! اطلب من اللابتوب");
    return;
  }
  game.stock[key] = game.stock[key] - 1;
  game.soda.drink = key;
  game.soda.fill = 0;
  playSound("pour");
}

function onCupPickup() {
  if (!tutAllow("pickup")) {
    return;
  }
  const s = game.soda;
  const idx = selSlot();
  if (s === null) {
    return;
  }
  if (s.drink === null) {
    denyClick("اختار نكهة الأول");
    return;
  }
  if (s.fill < 1) {
    denyClick("استنى لحد ما الكوباية تتملي");
    return;
  }
  if (trayFull(idx)) {
    denyClick("الصينية مليانة!");
    return;
  }
  const drink = s.drink;
  game.soda = null;
  game.trayPendings[idx] = game.trayPendings[idx] + 1;
  playSound("pop");
  addFlyer({
    kind: "cup", drink: drink, x0: SODA.cupSlot.x + 60, y0: SODA.cupSlot.y + 60, x1: TRAY_PREVIEW.x, y1: TRAY_PREVIEW.y - 20, dur: 0.5,
    onDone: function () {
      game.trays[idx].push({ kind: "drink", drink: drink });
      game.trayPendings[idx] = game.trayPendings[idx] - 1;
    }
  });
}

