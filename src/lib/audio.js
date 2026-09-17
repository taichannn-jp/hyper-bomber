// src/lib/hyper-bomber/audio.js
// Web Audio APIによるネプリーグ風サウンドエンジン

class SoundFX {
  constructor() {
    this.ctx = null;
    this.sparkNode = null;
    this.sparkGain = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 正解音（ピンポーン！）
  playCorrect() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // 高い「ピン」
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, now); // C6
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.4, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // 続く「ポーン」
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now + 0.12); // E6
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.45, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.8);

    // きらめき高調波
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(2093.0, now + 0.12); // C7
    gain3.gain.setValueAtTime(0.15, now + 0.12);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc3.connect(gain3);
    gain3.connect(this.ctx.destination);
    osc3.start(now + 0.12);
    osc3.stop(now + 0.6);
  }

  // ターン切り替え音（「OK! 次！」）
  playNextTurn() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // 不正解音（ブブー！）
  playWrong() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    [0, 0.18].forEach((offset) => {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(150, now + offset);
      osc2.frequency.setValueAtTime(155, now + offset); // デチューン不快音

      gain.gain.setValueAtTime(0.3, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now + offset);
      osc2.start(now + offset);
      osc1.stop(now + offset + 0.16);
      osc2.stop(now + offset + 0.16);
    });
  }

  // カウントダウン拍子音（チクタク / 警告音）
  playTick(isUrgent = false) {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isUrgent ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(isUrgent ? 880 : 440, now); // 緊急時は高音
    if (isUrgent) {
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
    }

    gain.gain.setValueAtTime(isUrgent ? 0.35 : 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isUrgent ? 0.09 : 0.06));

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // 導火線のジリジリ火花音（ループ用）
  startSparkLoop() {
    this.init();
    if (this.isMuted || !this.ctx || this.sparkNode) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      this.sparkNode = noise;
      this.sparkGain = gain;
    } catch (e) {
      console.warn('Spark loop audio error:', e);
    }
  }

  stopSparkLoop() {
    if (this.sparkNode) {
      try {
        this.sparkNode.stop();
        this.sparkNode.disconnect();
      } catch (e) {}
      this.sparkNode = null;
      this.sparkGain = null;
    }
  }

  // 大爆発音（ドッカーン！）
  playExplosion() {
    this.init();
    this.stopSparkLoop();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. 低音インパクト
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 1.2);
    oscGain.gain.setValueAtTime(0.7, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.5);

    // 2. 轟音ノイズ
    try {
      const bufferSize = this.ctx.sampleRate * 2.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 2.0);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.9, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 2.5);
    } catch (e) {
      console.warn('Explosion noise error:', e);
    }
  }

  // 完全制覇ファンファーレ
  playClear() {
    this.init();
    this.stopSparkLoop();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const notes = [
      { f: 523.25, t: 0.0, d: 0.15 }, // C5
      { f: 659.25, t: 0.15, d: 0.15 }, // E5
      { f: 783.99, t: 0.30, d: 0.15 }, // G5
      { f: 1046.50, t: 0.45, d: 0.70 } // C6
    ];

    notes.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.4, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });
  }
}

export const soundFX = new SoundFX();
