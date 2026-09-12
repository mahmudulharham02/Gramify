/**
 * Sound Engine & Audio Diagnostic Suite for HSC Grammar Quest
 * Multi-tiered, fail-safe audio engine supporting playCorrect.mp3 / correct_answer.mp3
 * and playWrong.mp3 / wrong_answer.mp3.
 *
 * Features:
 *  1. Immediate AudioContext unlocking on user interaction.
 *  2. Pre-decoded AudioBuffers for zero-latency Web Audio API playback.
 *  3. Fallback to HTML5 Audio with persistent references (prevents GC silence).
 *  4. Data-URI fallback (audio/mpeg) if network/file paths fail.
 *  5. Oscillator-based synthesizer fallback if all audio drivers fail.
 *  6. Comprehensive diagnostic utility function to verify loading of correct_answer.mp3
 *     and wrong_answer.mp3 via network, HTML5 Audio events (canplaythrough, error),
 *     and Web Audio API decoding.
 */

import playCorrectViteUrl from '../assets/playCorrect.mp3';
import playWrongViteUrl from '../assets/playWrong.mp3';
import { PLAY_CORRECT_BASE64, PLAY_WRONG_BASE64 } from './audioBase64';

export interface AudioDiagnosticItemResult {
  file: string;
  url: string;
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  accessible: boolean;
  httpStatus?: number;
  contentType?: string;
  contentLength?: number;
  duration?: string;
  eventsTriggered: string[];
  canPlayThrough: boolean;
  webAudioDecoded: boolean;
  errorCode?: number;
  errorMessage?: string;
  details?: string;
}

export interface AudioDiagnosticSummary {
  timestamp: string;
  totalTested: number;
  successCount: number;
  failedCount: number;
  results: Record<string, AudioDiagnosticItemResult>;
}

/**
 * Diagnostic utility function to test and verify the loading of the 'correct_answer.mp3'
 * and 'wrong_answer.mp3' files in the soundManager.
 *
 * Emits comprehensive console log outputs reporting the status of the 'Audio' object loading
 * (e.g., loadstart, loadedmetadata, loadeddata, canplay, canplaythrough, error events)
 * to verify if the files are accessible, properly encoded, and not corrupted.
 */
export async function runAudioDiagnostics(
  targets: Array<{ name: string; url: string }> = [
    { name: 'correct_answer.mp3', url: '/audio/correct_answer.mp3' },
    { name: 'wrong_answer.mp3', url: '/audio/wrong_answer.mp3' },
  ]
): Promise<AudioDiagnosticSummary> {
  console.group(
    '%c[SoundManager Diagnostic] Starting Audio Integrity & Loading Verification',
    'background: #0284c7; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
  );
  console.log(
    `Testing ${targets.length} target audio files at ${new Date().toLocaleTimeString()}...`
  );

  const results: Record<string, AudioDiagnosticItemResult> = {};
  let successCount = 0;
  let failedCount = 0;

  for (const target of targets) {
    console.group(`%cTesting: ${target.name} (${target.url})`, 'color: #38bdf8; font-weight: bold;');
    const eventsTriggered: string[] = [];
    let httpStatus: number | undefined;
    let contentType: string | undefined;
    let contentLength: number | undefined;
    let webAudioDecoded = false;
    let durationStr = 'unknown';

    // Step 1: Network & HTTP Availability Check
    try {
      console.log(`[HTTP Check] Probing ${target.url}...`);
      const res = await fetch(target.url);
      httpStatus = res.status;
      contentType = res.headers.get('content-type') || undefined;
      const cl = res.headers.get('content-length');
      if (cl) contentLength = parseInt(cl, 10);

      if (res.ok) {
        console.log(
          `%c[HTTP Check] HTTP ${res.status} OK | Content-Type: ${contentType || 'N/A'} | Size: ${
            contentLength ? `${contentLength} bytes` : 'unknown'
          }`,
          'color: #4ade80;'
        );

        // Step 2: Web Audio API Binary Buffer Decode Check (integrity & codec validation)
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          try {
            const ctx = new AudioContextClass();
            const ab = await res.clone().arrayBuffer();
            const decoded = await ctx.decodeAudioData(ab);
            webAudioDecoded = true;
            durationStr = `${decoded.duration.toFixed(2)}s`;
            console.log(
              `%c[WebAudio Decode] Decoded successfully! Duration: ${durationStr}, Sample Rate: ${decoded.sampleRate}Hz, Channels: ${decoded.numberOfChannels}`,
              'color: #4ade80;'
            );
            ctx.close().catch(() => {});
          } catch (decodeErr) {
            console.warn('[WebAudio Decode] Could not decode buffer with AudioContext:', decodeErr);
          }
        }
      } else {
        console.error(`%c[HTTP Check] Failed with HTTP status ${res.status}`, 'color: #f87171;');
      }
    } catch (netErr) {
      console.error('[HTTP Check] Network fetch error:', netErr);
    }

    // Step 3: HTML5 'Audio' Object Event Verification (canplaythrough, error events)
    const audioTestPromise = new Promise<AudioDiagnosticItemResult>((resolve) => {
      const audio = new Audio();
      let isResolved = false;

      const finish = (result: Partial<AudioDiagnosticItemResult>) => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timeoutTimer);

        // Detach listeners
        audio.onloadstart = null;
        audio.onloadedmetadata = null;
        audio.onloadeddata = null;
        audio.oncanplay = null;
        audio.oncanplaythrough = null;
        audio.onerror = null;

        const finalResult: AudioDiagnosticItemResult = {
          file: target.name,
          url: target.url,
          status: result.status || 'FAILED',
          accessible: httpStatus === 200,
          httpStatus,
          contentType,
          contentLength,
          duration: durationStr,
          eventsTriggered,
          canPlayThrough: result.canPlayThrough ?? false,
          webAudioDecoded,
          errorCode: result.errorCode,
          errorMessage: result.errorMessage,
          details: result.details,
        };

        if (finalResult.status === 'SUCCESS') {
          successCount++;
          console.log(
            `%c[Summary] ${target.name} is ACCESSIBLE, PROPERLY ENCODED, and NOT CORRUPTED.`,
            'color: #4ade80; font-weight: bold;'
          );
        } else {
          failedCount++;
          console.error(
            `%c[Summary] ${target.name} FAILED verification. Reason: ${
              result.details || result.errorMessage || 'Unknown failure'
            }`,
            'color: #f87171; font-weight: bold;'
          );
        }

        resolve(finalResult);
      };

      const timeoutTimer = setTimeout(() => {
        console.warn(
          `[Audio Event] Timed out waiting for canplaythrough on ${target.name} (events received: ${
            eventsTriggered.join(', ') || 'none'
          })`
        );
        finish({
          status: webAudioDecoded ? 'SUCCESS' : 'TIMEOUT',
          canPlayThrough: false,
          details: 'Timed out waiting for canplaythrough event',
        });
      }, 4500);

      audio.addEventListener('loadstart', () => {
        eventsTriggered.push('loadstart');
        console.log(`[Audio Event] 'loadstart': Browser started loading media resource.`);
      });

      audio.addEventListener('loadedmetadata', () => {
        eventsTriggered.push('loadedmetadata');
        if (audio.duration && !isNaN(audio.duration)) {
          durationStr = `${audio.duration.toFixed(2)}s`;
        }
        console.log(`[Audio Event] 'loadedmetadata': Metadata loaded. Duration: ${durationStr}`);
      });

      audio.addEventListener('loadeddata', () => {
        eventsTriggered.push('loadeddata');
        console.log(`[Audio Event] 'loadeddata': First media frame/packet successfully retrieved.`);
      });

      audio.addEventListener('canplay', () => {
        eventsTriggered.push('canplay');
        console.log(`[Audio Event] 'canplay': Browser estimates playback can begin.`);
      });

      audio.addEventListener('canplaythrough', () => {
        eventsTriggered.push('canplaythrough');
        console.log(
          `%c[Audio Event] 'canplaythrough': File buffered enough to play through to the end without buffering!`,
          'color: #4ade80; font-weight: bold;'
        );
        finish({
          status: 'SUCCESS',
          canPlayThrough: true,
          details: 'Successfully loaded and ready for playback',
        });
      });

      audio.addEventListener('error', (e) => {
        eventsTriggered.push('error');
        const mediaErr = audio.error;
        let errMsg = 'Unknown MediaError';
        const errCode = mediaErr?.code;

        if (mediaErr) {
          switch (mediaErr.code) {
            case 1:
              errMsg = 'MEDIA_ERR_ABORTED: The user or browser aborted fetching the media.';
              break;
            case 2:
              errMsg = 'MEDIA_ERR_NETWORK: A network error caused media download to fail.';
              break;
            case 3:
              errMsg = 'MEDIA_ERR_DECODE: The media file is corrupted or encoded in an unsupported codec.';
              break;
            case 4:
              errMsg = 'MEDIA_ERR_SRC_NOT_SUPPORTED: Media source not found (404) or MIME type not supported.';
              break;
            default:
              errMsg = mediaErr.message || 'Media error occurred';
          }
        }

        console.error(
          `%c[Audio Event] 'error': Code ${errCode}: ${errMsg}`,
          'color: #f87171; font-weight: bold;',
          e
        );

        finish({
          status: 'FAILED',
          canPlayThrough: false,
          errorCode: errCode,
          errorMessage: errMsg,
          details: errMsg,
        });
      });

      audio.preload = 'auto';
      audio.src = target.url;
      audio.load();
    });

    results[target.name] = await audioTestPromise;
    console.groupEnd();
  }

  const summary: AudioDiagnosticSummary = {
    timestamp: new Date().toISOString(),
    totalTested: targets.length,
    successCount,
    failedCount,
    results,
  };

  console.log('%c[Audio Diagnostic Table Summary]', 'color: #38bdf8; font-weight: bold;');
  console.table(
    Object.values(results).map((r) => ({
      File: r.file,
      URL: r.url,
      Status: r.status,
      'HTTP Status': r.httpStatus,
      'Content-Type': r.contentType,
      Duration: r.duration,
      canplaythrough: r.canPlayThrough ? '✅ Yes' : '❌ No',
      'WebAudio Decoded': r.webAudioDecoded ? '✅ Yes' : '❌ No',
      Events: r.eventsTriggered.join(' -> '),
    }))
  );
  console.groupEnd();

  return summary;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private correctBuffer: AudioBuffer | null = null;
  private wrongBuffer: AudioBuffer | null = null;
  private isDecodingBuffers: boolean = false;
  private activeAudios = new Set<HTMLAudioElement>();

  constructor() {
    this.setupUnlockListeners();
    // Warm buffers as soon as possible in browser
    if (typeof window !== 'undefined') {
      this.initContext();
      this.warmBuffers();
      // Expose to window for easy browser-console testing, diagnostics, and verification
      (window as unknown as { __soundManager: SoundEngine }).__soundManager = this;
      (window as unknown as { __playCorrect: () => void }).__playCorrect = () => this.playCorrect();
      (window as unknown as { __playWrong: () => void }).__playWrong = () => this.playWrong();
      (window as unknown as { runAudioDiagnostics: typeof runAudioDiagnostics }).runAudioDiagnostics =
        runAudioDiagnostics;
      (window as unknown as { __runAudioDiagnostics: typeof runAudioDiagnostics }).__runAudioDiagnostics =
        runAudioDiagnostics;
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Diagnostic utility method on soundManager instance to verify correct_answer.mp3 and wrong_answer.mp3
   */
  public async runAudioDiagnostics(): Promise<AudioDiagnosticSummary> {
    return runAudioDiagnostics([
      { name: 'correct_answer.mp3', url: '/audio/correct_answer.mp3' },
      { name: 'wrong_answer.mp3', url: '/audio/wrong_answer.mp3' },
    ]);
  }

  private setupUnlockListeners() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.warmBuffers();
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch (e) {
          console.warn('[SoundEngine] Could not initialize AudioContext:', e);
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private async fetchAndDecode(sources: string[]): Promise<AudioBuffer | null> {
    if (!this.ctx) return null;

    for (const src of sources) {
      try {
        const res = await fetch(src);
        if (!res.ok) continue;
        const ab = await res.arrayBuffer();
        if (ab.byteLength === 0) continue;
        // decodeAudioData handles raw mp3 byte buffers
        const buffer = await this.ctx.decodeAudioData(ab);
        if (buffer) return buffer;
      } catch {
        // Continue trying next source
      }
    }
    return null;
  }

  private async warmBuffers() {
    if (this.isDecodingBuffers) return;
    this.initContext();
    if (!this.ctx) return;

    this.isDecodingBuffers = true;
    try {
      if (!this.correctBuffer) {
        this.correctBuffer = await this.fetchAndDecode([
          PLAY_CORRECT_BASE64,
          playCorrectViteUrl,
          '/audio/correct_answer.mp3',
          '/audio/playCorrect.mp3',
          '/correct_answer.mp3',
          '/playCorrect.mp3',
        ]);
        if (this.correctBuffer) {
          console.info('[SoundEngine] Correct audio buffer pre-loaded successfully');
        }
      }
      if (!this.wrongBuffer) {
        this.wrongBuffer = await this.fetchAndDecode([
          PLAY_WRONG_BASE64,
          playWrongViteUrl,
          '/audio/wrong_answer.mp3',
          '/audio/playWrong.mp3',
          '/wrong_answer.mp3',
          '/playWrong.mp3',
        ]);
        if (this.wrongBuffer) {
          console.info('[SoundEngine] Wrong audio buffer pre-loaded successfully');
        }
      }
    } catch (e) {
      console.warn('[SoundEngine] Error warming buffers:', e);
    } finally {
      this.isDecodingBuffers = false;
    }
  }

  /**
   * Play pre-decoded AudioBuffer with optional gain boost
   */
  private playBuffer(buffer: AudioBuffer, gainLevel: number = 1.0): boolean {
    try {
      this.initContext();
      if (!this.ctx) return false;

      // Resume context if suspended
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const gain = this.ctx.createGain();
      gain.gain.value = gainLevel;

      source.connect(gain);
      gain.connect(this.ctx.destination);

      source.start(0);
      return true;
    } catch (e) {
      console.warn('[SoundEngine] playBuffer failed:', e);
      return false;
    }
  }

  /**
   * Play audio via HTML5 Audio element with garbage collection protection
   */
  private playHtmlAudio(sources: string[], synthFallback: () => void) {
    if (typeof Audio === 'undefined') {
      synthFallback();
      return;
    }

    let sourceIdx = 0;

    const tryNext = () => {
      if (sourceIdx >= sources.length) {
        synthFallback();
        return;
      }

      const currentSrc = sources[sourceIdx++];
      try {
        const audio = new Audio(currentSrc);
        audio.volume = 1.0;
        this.activeAudios.add(audio);

        const cleanup = () => {
          this.activeAudios.delete(audio);
          audio.onended = null;
          audio.onerror = null;
        };

        audio.onended = cleanup;
        audio.onerror = () => {
          cleanup();
          tryNext();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            cleanup();
            tryNext();
          });
        }
      } catch {
        tryNext();
      }
    };

    tryNext();
  }

  /**
   * Primary entry point for playing an audio effect
   */
  private playEffect(
    soundName: string,
    buffer: AudioBuffer | null,
    sources: string[],
    gainLevel: number,
    synthFallback: () => void
  ) {
    if (!this.isEnabled) return;

    this.initContext();

    // 1. Try Web Audio buffer (fastest, concurrent, zero latency)
    if (buffer && this.ctx) {
      if (this.playBuffer(buffer, gainLevel)) {
        return;
      }
    }

    // 2. Try HTML5 Audio elements
    this.playHtmlAudio(sources, synthFallback);

    // 3. Simultaneously re-trigger buffer warming in background
    if (!buffer) {
      this.warmBuffers();
    }
  }

  /**
   * Play correct answer sound effect (correct_answer.mp3 / playCorrect.mp3)
   */
  public playCorrect() {
    this.playEffect(
      'playCorrect',
      this.correctBuffer,
      [
        playCorrectViteUrl,
        PLAY_CORRECT_BASE64,
        '/audio/correct_answer.mp3',
        '/audio/playCorrect.mp3',
        '/correct_answer.mp3',
        '/playCorrect.mp3',
      ],
      1.2,
      () => this.playSynthesizedCorrect()
    );
  }

  /**
   * Play wrong answer sound effect (wrong_answer.mp3 / playWrong.mp3)
   */
  public playWrong() {
    this.playEffect(
      'playWrong',
      this.wrongBuffer,
      [
        playWrongViteUrl,
        PLAY_WRONG_BASE64,
        '/audio/wrong_answer.mp3',
        '/audio/playWrong.mp3',
        '/wrong_answer.mp3',
        '/playWrong.mp3',
      ],
      1.1,
      () => this.playSynthesizedWrong()
    );
  }

  // Synthesizer Fallbacks
  private playSynthesizedCorrect() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);

        gain.gain.setValueAtTime(0.001, now + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.2, now + index * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + index * 0.07);
        osc.stop(now + index * 0.07 + 0.36);
      });
    } catch {
      // Audio fails gracefully
    }
  }

  private playSynthesizedWrong() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio fails gracefully
    }
  }

  public playLevelUp() {
    if (!this.isEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.15 },
        { f: 1046.5, t: 0.39, d: 0.4 },
        { f: 1318.51, t: 0.55, d: 0.6 },
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.001, now + t);
        gain.gain.exponentialRampToValueAtTime(0.25, now + t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch {
      // Audio fails gracefully
    }
  }

  public playCoin() {
    if (!this.isEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio fails gracefully
    }
  }

  public playClick() {
    if (!this.isEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fails gracefully
    }
  }

  public playHint() {
    if (!this.isEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [700, 950, 1200];
      freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.08, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.2);
      });
    } catch {
      // Audio fails gracefully
    }
  }

  public playReward() {
    this.playLevelUp();
  }

  public playIncorrect() {
    this.playWrong();
  }
}

export const soundManager = new SoundEngine();
