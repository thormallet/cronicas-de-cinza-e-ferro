/* ============================================================================
   [SOM] — sintetizador de efeitos sonoros (SoundFX)
   ============================================================================ */
const SoundFX = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    const btn = document.getElementById("btn-sound");
    if (btn) btn.textContent = this.enabled ? "🔊 Som: ON" : "🔇 Som: OFF";
    if (this.enabled) this.play("click");
  },

  tone(freq, type, duration, delay = 0, vol = 0.07, detune = 0) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const oscHarm = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (detune) osc.detune.setValueAtTime(detune, t);

      oscHarm.type = "sine";
      oscHarm.frequency.setValueAtTime(freq * 1.5, t);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(Math.min(3800, freq * 5), t);

      gain.gain.setValueAtTime(0.0008, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.018);
      gain.gain.exponentialRampToValueAtTime(vol * 0.45, t + duration * 0.45);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      const harmGain = this.ctx.createGain();
      harmGain.gain.setValueAtTime(vol * 0.22, t);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.8);

      osc.connect(filter);
      oscHarm.connect(harmGain);
      harmGain.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      oscHarm.start(t);
      osc.stop(t + duration + 0.03);
      oscHarm.stop(t + duration + 0.03);
    } catch (e) {}
  },

  noiseBurst(duration = 0.1, delay = 0, vol = 0.04, highpassFreq = 900) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime + delay;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(highpassFreq, t);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    } catch (e) {}
  },

  play(effect) {
    if (!this.enabled) return;
    switch (effect) {
      case "click":
        this.tone(330, "triangle", 0.065, 0, 0.045);
        this.tone(495, "sine", 0.05, 0.015, 0.025);
        break;
      case "year":
        this.tone(293.66, "triangle", 0.45, 0.00, 0.065);
        this.tone(349.23, "triangle", 0.45, 0.07, 0.060);
        this.tone(440.00, "triangle", 0.55, 0.14, 0.065);
        this.tone(587.33, "sine", 0.70, 0.22, 0.070);
        break;
      case "coin":
        this.tone(1174.66, "sine", 0.12, 0.00, 0.055);
        this.tone(1567.98, "sine", 0.16, 0.05, 0.060);
        this.tone(2093.00, "sine", 0.28, 0.11, 0.065);
        this.noiseBurst(0.05, 0, 0.025, 2400);
        break;
      case "sword":
        this.noiseBurst(0.14, 0, 0.055, 1600);
        this.tone(520, "sawtooth", 0.09, 0.00, 0.055, -15);
        this.tone(880, "triangle", 0.18, 0.04, 0.060, 12);
        this.tone(1320, "sine", 0.22, 0.06, 0.040);
        break;
      case "love":
        this.tone(392.00, "sine", 0.42, 0.00, 0.060);
        this.tone(493.88, "triangle", 0.48, 0.09, 0.060);
        this.tone(587.33, "sine", 0.55, 0.18, 0.065);
        this.tone(783.99, "sine", 0.75, 0.27, 0.070);
        break;
      case "bells":
        this.tone(523.25, "triangle", 0.75, 0.00, 0.080);
        this.tone(659.25, "triangle", 0.75, 0.12, 0.075);
        this.tone(783.99, "triangle", 0.85, 0.24, 0.080);
        this.tone(1046.50, "sine", 1.10, 0.36, 0.085);
        break;
      case "success":
        this.tone(349.23, "triangle", 0.20, 0.00, 0.065);
        this.tone(440.00, "triangle", 0.24, 0.08, 0.065);
        this.tone(523.25, "triangle", 0.30, 0.16, 0.070);
        this.tone(698.46, "sine", 0.45, 0.24, 0.075);
        break;
      case "fail":
        this.tone(261.63, "sawtooth", 0.24, 0.00, 0.055);
        this.tone(233.08, "sawtooth", 0.28, 0.12, 0.055);
        this.tone(174.61, "triangle", 0.45, 0.24, 0.065);
        break;
      case "death":
        this.tone(146.83, "sawtooth", 1.2, 0.00, 0.085);
        this.tone(220.00, "sine", 1.0, 0.02, 0.060);
        this.tone(110.00, "triangle", 1.6, 0.35, 0.095);
        break;
    }
  }
};
