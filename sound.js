// ===== sound.js: الأصوات (بتتعمل بالكود، مفيش ملفات صوت) =====

let audioCtx = null;
let masterGain = null;
let musicGain = null;
let sizzleGain = null;
let noiseBuffer = null;
const audioSettings = { sfx: true, music: true, sfxVol: 0.8, musicVol: 0.6 };

// لازم تتنادى بعد أول ضغطة (المتصفح مبيسمحش بصوت قبل كده)
function initAudio() {
  if (audioCtx !== null) {
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) {
    return;
  }
  audioCtx = new AC();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.6 * audioSettings.sfxVol;
  masterGain.connect(audioCtx.destination);
  musicGain = audioCtx.createGain();
  musicGain.gain.value = audioSettings.music ? 0.1 * audioSettings.musicVol : 0;
  musicGain.connect(audioCtx.destination);

  // ضوضاء بيضا بنستخدمها لصوت التشويح والصوص
  const len = audioCtx.sampleRate * 2;
  noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  // صوت تشويح مستمر بنتحكم في علوه
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuffer;
  src.loop = true;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 4500;
  filter.Q.value = 0.8;
  sizzleGain = audioCtx.createGain();
  sizzleGain.gain.value = 0;
  src.connect(filter);
  filter.connect(sizzleGain);
  sizzleGain.connect(masterGain);
  src.start();

  startMusic();
}

function tone(freq, delay, dur, type, vol, dest) {
  const t = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(dest || masterGain);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noiseBurst(delay, dur, freq, vol) {
  const t = audioCtx.currentTime + delay;
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(masterGain);
  src.start(t);
  src.stop(t + dur + 0.05);
}

const SFX = {
  click: function () { tone(660, 0, 0.06, "square", 0.12); },
  pop: function () { tone(420, 0, 0.08, "sine", 0.3); tone(630, 0.05, 0.08, "sine", 0.25); },
  bell: function () { tone(1320, 0, 0.6, "sine", 0.25); tone(1760, 0.06, 0.6, "sine", 0.18); },
  squirt: function () { noiseBurst(0, 0.7, 1500, 0.35); },
  freezer: function () { noiseBurst(0, 0.4, 350, 0.5); tone(110, 0, 0.3, "sine", 0.3); },
  sizzle: function () { noiseBurst(0, 0.7, 5500, 0.4); },
  cash: function () { tone(880, 0, 0.1, "triangle", 0.3); tone(1175, 0.09, 0.3, "triangle", 0.3); },
  buzz: function () { tone(150, 0, 0.3, "sawtooth", 0.22); },
  delivery: function () { tone(523, 0, 0.15, "triangle", 0.3); tone(659, 0.15, 0.15, "triangle", 0.3); tone(784, 0.3, 0.3, "triangle", 0.3); },
  endDay: function () { tone(784, 0, 0.2, "triangle", 0.3); tone(659, 0.2, 0.2, "triangle", 0.3); tone(523, 0.4, 0.2, "triangle", 0.3); tone(392, 0.6, 0.5, "triangle", 0.3); },
  start: function () { tone(392, 0, 0.12, "triangle", 0.3); tone(523, 0.12, 0.12, "triangle", 0.3); tone(659, 0.24, 0.12, "triangle", 0.3); tone(784, 0.36, 0.4, "triangle", 0.3); }
};

function playSound(name, arg) {
  if (audioCtx === null || !audioSettings.sfx) {
    return;
  }
  SFX[name](arg);
}

// level من 0 لـ 1
function setSizzle(level) {
  if (audioCtx === null || sizzleGain === null) {
    return;
  }
  const target = audioSettings.sfx ? level * 0.07 : 0;
  sizzleGain.gain.setTargetAtTime(target, audioCtx.currentTime, 0.1);
}

function setMusicOn(on) {
  audioSettings.music = on;
  if (musicGain !== null) {
    musicGain.gain.value = on ? 0.1 * audioSettings.musicVol : 0;
  }
}

function setSfxOn(on) {
  audioSettings.sfx = on;
  if (!on) {
    setSizzle(0);
  }
}

// موسيقى هادية بسيطة بتتكرر
function startMusic() {
  const bass = [110, 110, 147, 98];
  const scale = [440, 494, 554, 659, 740, 880];
  let step = 0;
  setInterval(function () {
    if (!audioSettings.music || audioCtx.state !== "running") {
      return;
    }
    if (step % 4 === 0) {
      tone(bass[Math.floor(step / 4) % bass.length], 0, 0.9, "sine", 0.9, musicGain);
    }
    if (Math.random() < 0.6) {
      tone(scale[Math.floor(Math.random() * scale.length)], 0, 0.4, "triangle", 0.5, musicGain);
    }
    step = step + 1;
  }, 420);
}

// ===== أصوات إضافية: منبه المطبخ (جرس حقيقي) =====

// جرس بيتكون من عدة نغمات غير متناسقة زي الجرس الحقيقي
function bellStrike(delay) {
  const base = 1046;
  const ratios = [1, 2.76, 5.4, 8.93];
  const vols = [0.32, 0.2, 0.12, 0.06];
  const durs = [1.1, 0.7, 0.4, 0.25];
  for (let i = 0; i < ratios.length; i++) {
    tone(base * ratios[i], delay, durs[i], "sine", vols[i]);
  }
  noiseBurst(delay, 0.05, 6000, 0.15);
}

SFX.kitchenBell = function () {
  bellStrike(0);
  bellStrike(0.5);
  bellStrike(1.0);
};
SFX.ding = function () {
  tone(1568, 0, 0.5, "sine", 0.28);
  tone(2093, 0.05, 0.4, "sine", 0.16);
};
SFX.pour = function () {
  noiseBurst(0, 1.0, 2200, 0.22);
};
SFX.page = function () {
  noiseBurst(0, 0.18, 3500, 0.25);
};

// صوت كلام الزبون (زقزقة مضحكة، طبقتها حسب الشخصية)
SFX.talk = function (pitch) {
  const p = pitch || 1;
  for (let i = 0; i < 4; i++) {
    tone((260 + Math.random() * 120) * p, i * 0.07, 0.08, "square", 0.08);
  }
};
// صوت البنك (كاش)
SFX.chaching = function () {
  tone(1320, 0, 0.08, "triangle", 0.25);
  tone(1760, 0.08, 0.08, "triangle", 0.25);
  tone(2093, 0.16, 0.35, "triangle", 0.25);
  noiseBurst(0, 0.12, 5000, 0.2);
};

// مستوى صوت المؤثرات والموسيقى من الإعدادات (من 0 لـ 1)
function setSfxVolume(v) {
  audioSettings.sfxVol = v;
  if (masterGain !== null) {
    masterGain.gain.value = 0.6 * v;
  }
}

function setMusicVolume(v) {
  audioSettings.musicVol = v;
  if (musicGain !== null && audioSettings.music) {
    musicGain.gain.value = 0.1 * v;
  }
}

SFX.levelup = function () {
  tone(523, 0, 0.14, "triangle", 0.3);
  tone(659, 0.12, 0.14, "triangle", 0.3);
  tone(784, 0.24, 0.14, "triangle", 0.3);
  tone(1047, 0.36, 0.5, "triangle", 0.32);
  noiseBurst(0.36, 0.2, 6000, 0.12);
};
SFX.step = function () {
  tone(988, 0, 0.1, "sine", 0.22);
  tone(1319, 0.09, 0.22, "sine", 0.2);
};
SFX.whoosh = function () {
  noiseBurst(0, 0.35, 900, 0.25);
};
