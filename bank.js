// ===== bank.js: البنك (إيداع وسحب وقروض بالليفل وفايدة وأقساط) =====

// القروض بتتفتح بالليفل: بتبدأ بـ 500 بس وكل ما ليفلك يزيد بتتفتح قروض أكبر
const LOAN_AMOUNTS = [500, 1000, 2000, 5000, 10000];
const LOAN_LEVELS = [1, 2, 4, 6, 8];

function loanUnlocked(i) {
  return game.level >= LOAN_LEVELS[i];
}

function maxLoan() {
  let m = 0;
  for (let i = 0; i < LOAN_AMOUNTS.length; i++) {
    if (loanUnlocked(i)) {
      m = LOAN_AMOUNTS[i];
    }
  }
  return m;
}

function bankLog(type, amount) {
  game.bank.history.unshift({ day: game.day, type: type, amount: amount, balance: game.bank.balance });
  if (game.bank.history.length > 20) {
    game.bank.history.pop();
  }
}

function totalFunds() {
  return game.cash + game.bank.balance;
}

function canPay(amount) {
  return totalFunds() >= amount;
}

// الدفع بيبدأ من الكاش وبعدين من البنك (زي الكارت)
function pay(amount, label) {
  const fromCash = Math.min(game.cash, amount);
  game.cash = game.cash - fromCash;
  const rest = amount - fromCash;
  if (rest > 0) {
    game.bank.balance = game.bank.balance - rest;
    bankLog("دفع بالبطاقة: " + label, -rest);
  }
}

// خصم تلقائي (للأقساط): من البنك الأول وبعدين الكاش
function takeFunds(amount) {
  if (totalFunds() < amount) {
    return false;
  }
  const fromBank = Math.min(game.bank.balance, amount);
  game.bank.balance = game.bank.balance - fromBank;
  game.cash = game.cash - (amount - fromBank);
  return true;
}

function bankDeposit() {
  const amount = BANK_AMOUNTS[game.bankUI.amountIdx];
  if (game.cash < amount) {
    denyClick("الكاش مش كفاية للإيداع");
    return;
  }
  game.cash = game.cash - amount;
  game.bank.balance = game.bank.balance + amount;
  bankLog("إيداع", amount);
  playSound("chaching");
  showMessage("اتودع " + amount + " EGP في البنك", "#8fdc5a");
  saveGame(false);
}

function bankWithdraw() {
  const amount = BANK_AMOUNTS[game.bankUI.amountIdx];
  if (game.bank.balance < amount) {
    denyClick("رصيد البنك مش كفاية");
    return;
  }
  game.bank.balance = game.bank.balance - amount;
  game.cash = game.cash + amount;
  bankLog("سحب", -amount);
  playSound("chaching");
  showMessage("سحبت " + amount + " EGP", "#8fdc5a");
  saveGame(false);
}

function takeLoan() {
  const b = game.bank;
  const i = game.bankUI.loanIdx;
  const amount = LOAN_AMOUNTS[i];
  const term = LOAN_TERMS[game.bankUI.termIdx];
  if (!loanUnlocked(i)) {
    denyClick("القرض ده بيتفتح عند ليفل " + LOAN_LEVELS[i] + " (ليفلك " + game.level + ")");
    return;
  }
  if (b.score < 500) {
    denyClick("تقييمك الائتماني ضعيف، سدد أقساطك الأول");
    return;
  }
  if (b.loans.length >= 2) {
    denyClick("عندك قرضين شغالين، سدد الأول");
    return;
  }
  const owed = Math.round(amount * (1 + LOAN_RATE));
  const id = b.nextLoanId;
  b.nextLoanId = id + 1;
  b.loans.push({ id: id, principal: amount, owed: owed, daily: Math.ceil(owed / term), daysLeft: term });
  b.balance = b.balance + amount;
  bankLog("قرض رقم " + id, amount);
  playSound("chaching");
  showMessage("اتحول " + amount + " EGP لحساب البنك", "#8fdc5a");
  saveGame(false);
}

function repayLoan(loan) {
  if (!takeFunds(loan.owed)) {
    denyClick("فلوسك مش كفاية لسداد القرض");
    return;
  }
  game.bank.loans.splice(game.bank.loans.indexOf(loan), 1);
  game.bank.score = Math.min(850, game.bank.score + 10);
  bankLog("سداد قرض رقم " + loan.id, -loan.owed);
  playSound("chaching");
  showMessage("سددت القرض كله", "#8fdc5a");
  saveGame(false);
}

// آخر اليوم: فايدة وأقساط
function processBankDay() {
  const b = game.bank;
  const st = game.stats;
  const interest = Math.floor(b.balance * BANK_INTEREST);
  if (interest > 0) {
    b.balance = b.balance + interest;
    st.interest = interest;
    bankLog("فايدة يومية", interest);
  }
  for (let i = b.loans.length - 1; i >= 0; i--) {
    const L = b.loans[i];
    const due = Math.min(L.daily, L.owed);
    if (takeFunds(due)) {
      L.owed = L.owed - due;
      st.loanPaid = st.loanPaid + due;
      b.score = Math.min(850, b.score + 5);
      bankLog("قسط قرض رقم " + L.id, -due);
    } else {
      st.loanMissed = st.loanMissed + 1;
      b.score = Math.max(300, b.score - 40);
      const fee = Math.round(L.owed * 0.05);
      L.owed = L.owed + fee;
      bankLog("غرامة تأخير على قرض " + L.id + " (" + fee + ")", 0);
    }
    L.daysLeft = Math.max(0, L.daysLeft - 1);
    if (L.owed <= 0) {
      b.loans.splice(i, 1);
      bankLog("تم سداد قرض رقم " + L.id, 0);
    } else if (L.daysLeft === 0) {
      L.daily = L.owed;
    }
  }
}
