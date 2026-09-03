// Web Audio API Ambient Soundscape Generator for Ubuntu Haus Studio

class StudioAtmosphericAudio {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioContextClass();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, now);
      // Fade in over 2 seconds to 0.15 volume (gentle ambient background)
      this.masterGain.gain.linearRampToValueAtTime(0.12, now + 2);

      // Low pass filter for warm, dark architectural room ambience
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(320, now);

      this.masterGain.connect(this.filter);
      this.filter.connect(this.ctx.destination);

      // Warm harmonic chord (F# warm resonant drone: 92.5Hz, 138.6Hz, 185Hz, 277.18Hz)
      const freqs = [92.5, 138.59, 185.0, 277.18];
      this.oscillators = freqs.map((f, i) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        // Slight subtle LFO modulation effect
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();
        lfo.frequency.setValueAtTime(0.1 + i * 0.05, now);
        lfoGain.gain.setValueAtTime(1.5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);

        oscGain.gain.setValueAtTime(0.25 / freqs.length, now);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain!);
        osc.start(now);
        return osc;
      });

      this.isPlaying = true;
    } catch (e) {
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      this.oscillators = [];
      this.isPlaying = false;
    }, 1300);
  }
}

export const studioAudio = new StudioAtmosphericAudio();
