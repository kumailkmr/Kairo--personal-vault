export type SoundCategory = 'operational' | 'alert' | 'message' | 'system';
export type SoundProfile = 'ping_subtle' | 'ping_alert' | 'success_chime' | 'error_buzz' | 'warning_pulse';

class SoundManager {
  private enabled: boolean = true;
  private categories: Record<SoundCategory, boolean> = {
    operational: true,
    alert: true,
    message: true,
    system: true,
  };
  private audioCtx: AudioContext | null = null;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kairo_sound_prefs');
      if (saved) {
        try {
          const prefs = JSON.parse(saved);
          if (prefs.enabled !== undefined) this.enabled = prefs.enabled;
          if (prefs.categories) this.categories = { ...this.categories, ...prefs.categories };
          if (prefs.volume !== undefined) this.volume = prefs.volume;
        } catch (e) {}
      }
    }
  }

  private initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public play(category: SoundCategory, soundId: SoundProfile) {
    if (!this.enabled || !this.categories[category]) return;
    
    this.initContext();
    if (!this.audioCtx) return;
    
    // Resume context if suspended (browser autoplay policy)
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    try {
      this.synthesizeSound(soundId);
    } catch(e) {
      console.warn("Audio synthesis failed", e);
    }
  }

  private synthesizeSound(profile: SoundProfile) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const t = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Base volume adjusted by user preference
    const baseVol = this.volume;

    switch (profile) {
      case 'ping_subtle':
        // Soft sine wave, high pitch, quick fade
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(baseVol * 0.4, t + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.5);
        break;

      case 'success_chime':
        // Ascending major third (C -> E)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, t); // C5
        osc.frequency.setValueAtTime(659.25, t + 0.15); // E5
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(baseVol * 0.5, t + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(baseVol * 0.2, t + 0.15);
        gainNode.gain.linearRampToValueAtTime(baseVol * 0.5, t + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        osc.start(t);
        osc.stop(t + 0.9);
        break;

      case 'ping_alert':
        // Double triangle ping
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, t);
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(baseVol * 0.3, t + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        gainNode.gain.setValueAtTime(0, t + 0.2);
        gainNode.gain.linearRampToValueAtTime(baseVol * 0.3, t + 0.22);
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.5);
        break;

      case 'warning_pulse':
        // Lower pitch sine pulse
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.linearRampToValueAtTime(400, t + 0.3);
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(baseVol * 0.5, t + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.5);
        break;
        
      case 'error_buzz':
        // Sawtooth low buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(baseVol * 0.3, t + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.01, t + 0.3);
        
        // Add a slight frequency wobble
        osc.frequency.linearRampToValueAtTime(140, t + 0.1);
        osc.frequency.linearRampToValueAtTime(160, t + 0.2);
        osc.frequency.linearRampToValueAtTime(150, t + 0.3);
        
        osc.start(t);
        osc.stop(t + 0.4);
        break;
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.save();
    if (enabled) {
      this.play('system', 'ping_subtle');
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.save();
    this.play('system', 'ping_subtle');
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleCategory(category: SoundCategory, enabled: boolean) {
    this.categories[category] = enabled;
    this.save();
    if (enabled) {
      this.play(category, 'ping_subtle');
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getCategories() {
    return { ...this.categories };
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kairo_sound_prefs', JSON.stringify({
        enabled: this.enabled,
        volume: this.volume,
        categories: this.categories
      }));
    }
  }
}

export const soundManager = new SoundManager();
