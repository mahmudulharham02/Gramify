import React, { useState, useEffect } from 'react';
import { AlertTriangle, Download, X, Info } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface CacheWarningBannerProps {
  onExport: () => void;
  onDismiss?: () => void;
}

const COLLAPSED_KEY = 'cacheWarningCollapsed';

export const CacheWarningBanner: React.FC<CacheWarningBannerProps> = ({ onExport }) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleCollapse = (newCollapsed: boolean) => {
    try {
      localStorage.setItem(COLLAPSED_KEY, newCollapsed ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
    setCollapsed(newCollapsed);
  };

  if (collapsed) {
    return (
      <div className="flex justify-end mb-3">
        <button
          id="btn-expand-cache-warning"
          type="button"
          onClick={() => {
            soundManager.playClick();
            handleToggleCollapse(false);
          }}
          title="Data Safety & Backup Notice — Tap to expand"
          className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <Info className="w-3.5 h-3.5" />
          <span>Data Safety</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="banner-cache-warning"
      className="relative z-content w-full rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 sm:p-4 text-amber-200 transition-all shadow-lg shadow-amber-500/5 mb-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-amber-300">
              Important: Local Storage & Data Safety Notice
            </h4>
            <p className="text-[11px] sm:text-xs text-amber-200/90 leading-relaxed max-w-3xl">
              All your XP, hearts, streaks, and unlocked badges are stored locally in your
              browser. <strong className="text-amber-300 font-semibold">Do NOT clear your browser cache or site data</strong> or you will lose your progress! Use the backup button below to save your JSON backup regularly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="btn-banner-export-json"
            type="button"
            onClick={() => {
              soundManager.playCoin();
              onExport();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow transition-all active:scale-95"
            title="Download JSON progress backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Progress</span>
            <span className="sm:hidden">Backup</span>
          </button>

          <button
            id="btn-collapse-cache-warning"
            type="button"
            onClick={() => {
              soundManager.playClick();
              handleToggleCollapse(true);
            }}
            className="p-1.5 rounded-lg text-amber-400 hover:text-amber-100 hover:bg-amber-500/20 transition-colors"
            title="Collapse notice into icon"
            aria-label="Collapse banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
