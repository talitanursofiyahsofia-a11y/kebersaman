import { AudioPreset } from '../types/portfolio';

// Web Audio API ambient generator for pleasant background music
class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private activeInterval: number | null = null;
  private currentPreset: AudioPreset = 'melodi-senja';
  private targetVolume: number = 0.6;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.targetVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.targetVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.targetVolume, this.ctx.currentTime, 0.05);
    }
  }

  // Play a soft synthetic bell/piano tone with harmonics
  private playNote(freq: number, duration: number, type: OscillatorType = 'sine', decay: number = 2.5) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Harmonics oscillator for warm acoustic warmth
    const osc2 = this.ctx.createOscillator();
    const harmonicGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Envelope
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    harmonicGain.gain.setValueAtTime(0, now);
    harmonicGain.gain.linearRampToValueAtTime(0.05, now + 0.03);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + (decay * 0.7));

    osc.connect(noteGain);
    osc2.connect(harmonicGain);

    noteGain.connect(this.masterGain);
    harmonicGain.connect(this.masterGain);

    osc.start(now);
    osc2.start(now);

    osc.stop(now + decay);
    osc2.stop(now + decay);
  }

  // Melodic progressions based on preset
  public start(preset: AudioPreset) {
    this.initContext();
    this.stop();
    this.isRunning = true;
    this.currentPreset = preset;

    // Frequencies (Hz) for soothing emotional keys: C, D, E, F, G, A, B
    const notes = {
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99
    };

    if (preset === 'melodi-senja') {
      // Warm nostalgic arpeggio (Cmaj9 - Am7 - Fmaj7 - G)
      const patterns = [
        [notes.C3, notes.G3, notes.E4, notes.B4, notes.C5],
        [notes.E3, notes.B3, notes.G4, notes.D5],
        [notes.C3, notes.A3, notes.E4, notes.C5, notes.E5],
        [notes.E3, notes.C4, notes.G4, notes.D5]
      ];
      let bar = 0;
      let step = 0;

      const tick = () => {
        if (!this.isRunning) return;
        const currentChord = patterns[bar % patterns.length];
        const note = currentChord[step % currentChord.length];
        this.playNote(note, 3.2, 'sine', 3.0);

        step++;
        if (step >= currentChord.length) {
          step = 0;
          bar++;
        }
      };

      tick();
      this.activeInterval = window.setInterval(tick, 900);
    } else if (preset === 'piano-hujan') {
      // Soft gentle raindrops & romantic piano notes
      const scale = [notes.C4, notes.E4, notes.G4, notes.A4, notes.C5, notes.D5, notes.E5];
      const bassNotes = [notes.C3, notes.E3, notes.C3, notes.G3];
      let bassIdx = 0;

      const tick = () => {
        if (!this.isRunning) return;
        // Occasional soft bass
        if (Math.random() > 0.4) {
          this.playNote(bassNotes[bassIdx % bassNotes.length], 4.0, 'triangle', 3.8);
          bassIdx++;
        }
        // Random pleasant raindrop notes
        const n1 = scale[Math.floor(Math.random() * scale.length)];
        this.playNote(n1, 2.0, 'sine', 2.0);

        if (Math.random() > 0.5) {
          setTimeout(() => {
            if (this.isRunning) {
              const n2 = scale[Math.floor(Math.random() * scale.length)];
              this.playNote(n2, 2.5, 'sine', 2.4);
            }
          }, 350);
        }
      };

      tick();
      this.activeInterval = window.setInterval(tick, 1400);
    } else if (preset === 'bintang-malam') {
      // Atmospheric dreamy space chords
      const chords = [
        [notes.C3, notes.G3, notes.D4, notes.G4],
        [notes.A3, notes.E4, notes.B4, notes.E5],
        [notes.F4, notes.C4, notes.A4, notes.C5],
        [notes.G3, notes.D4, notes.B4, notes.D5]
      ];
      let chordIndex = 0;

      const tick = () => {
        if (!this.isRunning) return;
        const ch = chords[chordIndex % chords.length];
        ch.forEach((freq, idx) => {
          setTimeout(() => {
            if (this.isRunning) {
              this.playNote(freq, 4.5, 'sine', 4.0);
            }
          }, idx * 220);
        });
        chordIndex++;
      };

      tick();
      this.activeInterval = window.setInterval(tick, 3200);
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }
  }

  public getIsRunning() {
    return this.isRunning;
  }
}

export const ambientEngine = new AmbientAudioEngine();
