export type SoundCategory = 'operational' | 'alert' | 'message' | 'system';

class SoundManager {
  private enabled: boolean = true;
  private categories: Record<SoundCategory, boolean> = {
    operational: true,
    alert: true,
    message: true,
    system: true,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kairo_sound_prefs');
      if (saved) {
        try {
          const prefs = JSON.parse(saved);
          this.enabled = prefs.enabled;
          this.categories = { ...this.categories, ...prefs.categories };
        } catch (e) {
          // ignore parsing error
        }
      }
    }
  }

  public play(category: SoundCategory, soundId: string) {
    if (!this.enabled || !this.categories[category]) return;
    
    // In a real implementation, this would trigger the HTML5 Audio API
    // const audio = new Audio(`/sounds/${soundId}.mp3`);
    // audio.play();
    console.log(`[SoundManager] Played sound: ${soundId} (Category: ${category})`);
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.save();
  }

  public toggleCategory(category: SoundCategory, enabled: boolean) {
    this.categories[category] = enabled;
    this.save();
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
        categories: this.categories
      }));
    }
  }
}

export const soundManager = new SoundManager();
