import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'mobile-item' | 'settings';
  className?: string;
  onInstalled?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
  onInstalled,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGenericGuide, setShowGenericGuide] = useState(false);

  // If already installed and running standalone
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Installed as native app</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success && onInstalled) {
        onInstalled();
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // In Chromium / Edge when beforeinstallprompt hasn't fired yet or in standard browser
      setShowGenericGuide(true);
    }
  };

  return (
    <>
      {/* NAVBAR VARIANT */}
      {variant === 'navbar' && (
        <button
          id="btn-pwa-install-nav"
          type="button"
          onClick={handleInstallClick}
          title="Install Gramify as a native app"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all active:scale-95 shadow-sm ${className}`}
        >
          <Download className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
          <span className="hidden md:inline">Install App</span>
          <span className="md:hidden">Install</span>
        </button>
      )}

      {/* MOBILE DRAWER VARIANT */}
      {variant === 'mobile-item' && (
        <button
          id="btn-pwa-install-mobile"
          type="button"
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-500/30 text-left text-white transition-all active:scale-[0.99] ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-cyan-200">Install Native App</p>
              <p className="text-[11px] text-slate-400">Offline practice, zero lag, full screen</p>
            </div>
          </div>
          <Download className="w-4 h-4 text-cyan-400 shrink-0" />
        </button>
      )}

      {/* BANNER / HOME DASHBOARD VARIANT */}
      {variant === 'banner' && (
        <div
          id="pwa-install-banner"
          className={`rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-4 relative overflow-hidden shadow-lg ${className}`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Install Gramify App</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Offline Ready
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Add to your home screen for full offline and instant launch.
                </p>
              </div>
            </div>

            <button
              id="btn-pwa-install-banner"
              type="button"
              onClick={handleInstallClick}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shrink-0 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Install Gramify</span>
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS VARIANT */}
      {variant === 'settings' && (
        <button
          id="btn-pwa-install-settings"
          type="button"
          onClick={handleInstallClick}
          className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors active:scale-95 ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Install App on Device</span>
        </button>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div
          id="modal-ios-pwa-guide"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
        >
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/[0.1] p-5 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                <p className="text-xs text-slate-400">Run Gramify full screen like a native app</p>
              </div>
            </div>

            <div className="space-y-3 my-4 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-white/[0.06]">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Tap the Share Button</p>
                  <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                    Tap the <Share2 className="w-3.5 h-3.5 text-cyan-400 inline" /> icon at the bottom of Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-white/[0.06]">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Select "Add to Home Screen"</p>
                  <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                    Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-cyan-400 inline" /> <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-white/[0.06]">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Tap "Add"</p>
                  <p className="text-slate-400 mt-0.5">
                    Confirm in top right. Gramify will appear on your home screen!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Generic Browser Guide Modal */}
      {showGenericGuide && (
        <div
          id="modal-generic-pwa-guide"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
        >
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/[0.1] p-5 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setShowGenericGuide(false)}
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Install Gramify</h3>
                <p className="text-xs text-slate-400">Browser installation guide</p>
              </div>
            </div>

            <div className="space-y-2.5 my-4 text-xs text-slate-300">
              <p>To install Gramify as a desktop or mobile app:</p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                <li>
                  <strong>On Chrome / Edge:</strong> Click the <strong>Install</strong> icon in the address bar (right side of the URL) or open menu (⋮) &gt; <strong>Install Gramify</strong>.
                </li>
                <li>
                  <strong>On Android Chrome:</strong> Tap menu (⋮) &gt; <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                </li>
                <li>
                  <strong>On Safari (macOS Sonoma+):</strong> File &gt; <strong>Add to Dock</strong>.
                </li>
              </ul>
              <p className="text-[11px] text-cyan-300 bg-cyan-950/40 p-2 rounded-lg border border-cyan-500/20">
                ⚡ Once installed, Gramify operates completely offline with instant launch.
              </p>
            </div>

            <button
              onClick={() => setShowGenericGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
