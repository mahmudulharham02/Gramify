import React from 'react';

interface AppFooterProps {
  hidden?: boolean;
  onToast?: (message: string) => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ hidden = false, onToast }) => {
  if (hidden) return null;

  const handleClick = () => {
    if (onToast) {
      onToast('Made with love by TechValiy for HSC Students 🌟');
    }
  };

  return (
    <footer
      id="persistent-app-footer"
      className="w-full border-t border-slate-800/60 bg-[#0a0e1a]/80 backdrop-blur-md py-3 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left pb-[72px] lg:pb-0">
        {/* Credential text */}
        <div
          onClick={handleClick}
          className="flex items-center gap-1.5 text-xs text-slate-400 select-none cursor-pointer hover:text-slate-200 transition-colors"
          title="Click for creator note"
        >
          <span>Made with love by</span>
          <strong className="text-cyan-400 font-bold hover:underline tracking-wide">
            TechValiy
          </strong>
          <span className="text-slate-400 text-[11px] hidden sm:inline">• HSC English 2nd Paper Quest</span>
        </div>

        {/* Local Storage Status */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Progress saved on this device</span>
        </div>

        {/* TechValiy Badge */}
        <div className="flex items-center justify-center">
          <a
            href="https://www.techvaliy.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="TechValiy — Business Growth & Development"
            className="inline-block transition-transform hover:scale-105 active:scale-95 duration-200"
          >
            <img
              src="https://www.techvaliy.com/wp-content/uploads/2023/04/techvaliy-logo.jpg"
              alt="TechValiy — Business Growth & Development"
              style={{ maxHeight: '36px', width: 'auto' }}
              className="h-8 sm:h-9 w-auto max-w-[150px] object-contain rounded drop-shadow"
              referrerPolicy="no-referrer"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
