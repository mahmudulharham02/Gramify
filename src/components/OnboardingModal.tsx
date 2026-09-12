import React, { useState } from 'react';
import { BookOpen, Sparkles, Trophy, ChevronRight } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { sendOnboardingToFormspree } from '../utils/formspree';
import { loadAppState } from '../utils/storage';

interface OnboardingModalProps {
  onFinish: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onFinish }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to Gramify',
      subtitle: 'Official 60-Mark Bangladesh HSC Syllabus Master',
      body: 'Master all 10 core grammar topics including Voice Change, Narration, Affirmative/Negative Rules, Complex clauses, and Modifiers with instant feedback.',
      icon: BookOpen,
    },
    {
      title: 'Gamified Progress & Streaks',
      subtitle: 'Earn XP, Diamonds, Badges & Titles',
      body: 'Keep your daily practice streak alive for 1.5x XP multipliers. Maintain hearts, level up your rank, and claim badges as you master topics.',
      icon: Sparkles,
    },
    {
      title: 'Offline & Local Storage',
      subtitle: 'Zero Sign-In Required',
      body: 'Everything is stored safely in your browser. Export JSON backups anytime or generate your official printable Certificate of Grammar Mastery!',
      icon: Trophy,
    },
  ];

  const currentSlide = slides[slide];
  const SlideIcon = currentSlide.icon;

  const handleNext = () => {
    soundManager.playClick();
    if (slide + 1 < slides.length) {
      setSlide(slide + 1);
    } else {
      try {
        const appState = loadAppState();
        sendOnboardingToFormspree(appState.user, { state: appState });
      } catch {}
      onFinish();
    }
  };

  return (
    <div
      id="modal-onboarding"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none"
    >
      <div className="w-full max-w-[420px] sm:max-w-[480px] rounded-[16px] p-6 text-center space-y-4 border border-white/[0.08] bg-[#1e293b] shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9] flex items-center justify-center mx-auto">
          <SlideIcon className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0ea5e9] font-mono">
            Step {slide + 1} of {slides.length}
          </span>
          <h2 className="text-[20px] font-bold text-[#f8fafc]">
            {currentSlide.title}
          </h2>
          <h3 className="text-[12px] font-semibold text-[#0ea5e9]">
            {currentSlide.subtitle}
          </h3>
          <p className="text-[12px] text-[#94a3b8] leading-relaxed pt-1 max-w-sm mx-auto">
            {currentSlide.body}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-1.5 pt-1">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                slide === i ? 'w-6 bg-[#0ea5e9]' : 'w-2 bg-[#334155]'
              }`}
            />
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={handleNext}
            className="w-full h-[48px] rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold text-[14px] shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>{slide + 1 < slides.length ? 'Continue' : 'Start Learning'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

