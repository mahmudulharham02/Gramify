import React, { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setDismissed(false);
    }
  }, [isOnline]);

  if (isOnline) {
    return null;
  }

  if (dismissed) {
    return (
      <button
        id="badge-offline-minimized"
        type="button"
        onClick={() => setDismissed(false)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5 rounded-full bg-amber-950/90 border border-amber-500/40 px-3 py-1 text-[11px] font-semibold text-amber-300 shadow-xl backdrop-blur-md hover:bg-amber-900/90 transition-all"
      >
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
        <span>Offline</span>
      </button>
    );
  }

  return (
    <div
      id="banner-offline-active"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 flex items-start gap-3 rounded-xl bg-slate-900/95 border border-amber-500/40 p-3 text-xs text-amber-100 shadow-2xl backdrop-blur-md animate-fade-in"
    >
      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
        <WifiOff className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-amber-300">Offline Mode Active</span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>
        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
          You are offline, but Gramify works without internet. All questions, rules, and XP are saved locally on this device.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        title="Dismiss offline banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
