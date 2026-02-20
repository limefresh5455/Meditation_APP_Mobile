import Sound from 'react-native-sound';
import TrackPlayer from 'react-native-track-player';

Sound.setCategory('Playback', true);

class PanningService {
  private sound: Sound | null = null;
  private soundUrl: string | null = null;
  private panValue: number = 0;

  setupSound(
    url: string | number,
    panValue: number,
    onReady?: () => void,
  ): void {
    this.cleanup();
    this.panValue = panValue;

    const finalUrl = typeof url === 'number' ? url : String(url);

    const callback = (error: any) => {
      if (error) {
        console.log('PanningService: failed to load sound', error);
        return;
      }
      if (!this.sound) return;
      this.sound.setPan(this.panValue);
      TrackPlayer.setVolume(0);
      this.sound.setVolume(1);
      onReady?.();
    };

    const sound: Sound =
      typeof finalUrl === 'number'
        ? new Sound(finalUrl, callback)
        : new Sound(finalUrl, '', callback);

    this.sound = sound;
    this.soundUrl = String(finalUrl);
  }

  setPan(value: number): void {
    this.panValue = value;
    if (this.sound) {
      this.sound.setPan(value);
    }
  }

  getPanValue(): number {
    return this.panValue;
  }

  syncPlayback(isPlaying: boolean, position: number): void {
    if (!this.sound) return;
    if (isPlaying) {
      this.sound.play();
      this.sound.getCurrentTime(sec => {
        if (Math.abs(sec - position) > 1.0) {
          this.sound?.setCurrentTime(position);
        }
      });
    } else {
      this.sound.pause();
    }
  }

  seekTo(position: number): void {
    if (this.sound) {
      this.sound.setCurrentTime(position);
    }
  }

  isActiveForUrl(url: string): boolean {
    return this.soundUrl === url;
  }

  hasSound(): boolean {
    return this.sound !== null;
  }

  getSoundUrl(): string | null {
    return this.soundUrl;
  }

  cleanup(): void {
    if (this.sound) {
      this.sound.stop();
      this.sound.release();
      this.sound = null;
      this.soundUrl = null;
    }
  }

  disable(): void {
    this.cleanup();
    TrackPlayer.setVolume(1);
  }
}

export default new PanningService();
