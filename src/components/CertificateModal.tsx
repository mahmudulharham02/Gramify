import React, { useState, useEffect } from 'react';
import { X, Download, GraduationCap } from 'lucide-react';
import { AppState } from '../types';
import { generateMasteryCertificate, downloadCertificatePNG } from '../utils/certificate';
import { soundManager } from '../utils/sound';

interface CertificateModalProps {
  state: AppState;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ state, onClose }) => {
  const [certDataUrl, setCertDataUrl] = useState<string>('');

  useEffect(() => {
    const url = generateMasteryCertificate(state);
    setCertDataUrl(url);
  }, [state]);

  const handleDownload = () => {
    soundManager.playCoin();
    downloadCertificatePNG(state);
  };

  return (
    <div
      id="modal-certificate"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div className="w-full max-w-3xl bg-[#1e293b] border border-white/[0.08] rounded-2xl flex flex-col max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/[0.08] flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Certificate of Grammar Mastery
              </h2>
              <p className="text-xs text-slate-400">
                Official credential verification based on curriculum exercises
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Preview Image */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center bg-slate-950">
          {certDataUrl ? (
            <img
              src={certDataUrl}
              alt="HSC Grammar Mastery Certificate"
              referrerPolicy="no-referrer"
              className="max-w-full h-auto rounded-xl border border-white/[0.08] shadow-xl"
            />
          ) : (
            <div className="text-slate-400 text-xs">Generating certificate...</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-white/[0.08] bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            Awarded to <span className="font-semibold text-white">{state.user.name}</span> • Level {state.level} ({state.user.title})
          </span>

          <button
            id="btn-download-cert-png"
            onClick={handleDownload}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Verified PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
