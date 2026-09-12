import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Sparkles,
  ChevronRight,
  User,
  Star,
  Rocket,
  Crown,
  Flame,
  Lightbulb,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { soundManager } from '../utils/sound';
import { AvatarPickerModal, resolveAvatar } from './AvatarPickerModal';
import { ThemeToggle } from './ThemeToggle';

interface StudentIntroModalProps {
  initialProfile?: StudentProfile;
  isEditing?: boolean;
  onSave?: (profile: Partial<StudentProfile>) => void;
  onSaveProfile?: (profile: Partial<StudentProfile>) => void;
  onCompleteOnboarding?: (profile: Partial<StudentProfile>) => void;
  onClose?: () => void;
}

export const StudentIntroModal: React.FC<StudentIntroModalProps> = ({
  initialProfile,
  isEditing = false,
  onSave,
  onSaveProfile,
  onCompleteOnboarding,
  onClose,
}) => {
  const [step, setStep] = useState<'form' | 'carousel'>('form');
  const [carouselSlide, setCarouselSlide] = useState(0);

  const [name, setName] = useState(initialProfile?.name || '');
  const [roll, setRoll] = useState(initialProfile?.roll_id || initialProfile?.roll || '');
  const [collegeName, setCollegeName] = useState(
    initialProfile?.college_name || initialProfile?.institute || ''
  );
  const [group, setGroup] = useState(initialProfile?.group || 'Science');
  const [board, setBoard] = useState(initialProfile?.board || 'Dhaka');
  const [avatar, setAvatar] = useState<string>(resolveAvatar(initialProfile?.avatar));
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [gender, setGender] = useState<'male' | 'female' | null>(
    initialProfile?.gender === 'male' || initialProfile?.gender === 'female'
      ? initialProfile.gender
      : null
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isFormValid = name.trim().length > 0 && gender !== null;

  const triggerSave = (profile: Partial<StudentProfile>) => {
    if (typeof onSave === 'function') {
      onSave(profile);
    } else if (typeof onSaveProfile === 'function') {
      onSaveProfile(profile);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isFormValid || gender === null) return;
    soundManager.playClick();

    const finalRoll = roll.trim() ? roll.trim().slice(0, 20) : null;
    const finalCollege = collegeName.trim() ? collegeName.trim().slice(0, 80) : '';

    if (isEditing) {
      triggerSave({
        name: name.trim().slice(0, 30),
        roll: finalRoll,
        roll_id: finalRoll,
        college_name: finalCollege,
        institute: finalCollege,
        group,
        board,
        avatar,
        gender,
      });
      if (onClose) onClose();
    } else {
      setStep('carousel');
    }
  };

  const handleFinishOnboarding = () => {
    soundManager.playLevelUp();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (_) {}

    const finalRoll = roll.trim() ? roll.trim().slice(0, 20) : null;
    const finalCollege = collegeName.trim() ? collegeName.trim().slice(0, 80) : '';

    const completedProfile: Partial<StudentProfile> = {
      name: name.trim().slice(0, 30),
      roll: finalRoll,
      roll_id: finalRoll,
      college_name: finalCollege,
      institute: finalCollege,
      group,
      board,
      avatar,
      gender,
      joinedAt: new Date().toISOString(),
    };

    triggerSave(completedProfile);
    if (typeof onCompleteOnboarding === 'function') {
      onCompleteOnboarding(completedProfile);
    }
    if (onClose) onClose();
  };

  const slides = [
    {
      title: 'Master All HSC Grammar Topics',
      subtitle: '60 Marks Board Standard Preparation',
      description:
        'Drill deep into Voice Change, Direct/Indirect Narration, Right Form of Verbs, Completing Sentences, Modifiers, and more with instant formula breakdowns.',
      icon: BookOpen,
      isCredit: false,
    },
    {
      title: '20 Diamonds Welcome Bonus',
      subtitle: 'Earn XP, Diamonds & 15+ Badges',
      description:
        'You start with 20 Diamonds to exchange for Hearts or 50/50 hints in the shop. Keep your daily streak burning for 1.5x XP multipliers and level up your rank!',
      icon: Sparkles,
      isCredit: false,
    },
    {
      title: 'Track Mastery & Get Certified',
      subtitle: 'Offline-First with Full Backup & PNG Certificate',
      description:
        'Everything is stored in your browser without requiring a server. Back up your progress anytime as JSON or export your verified Certificate of Grammar Mastery!',
      icon: Trophy,
      isCredit: false,
    },
    {
      title: 'Crafted by ARHAM',
      subtitle: 'Engineered for Bangladesh HSC Students',
      description:
        'Built for Higher Secondary Certificate students across all education boards with official NCTB curriculum precision.',
      icon: GraduationCap,
      isCredit: true,
    },
  ];

  return (
    <div
      id="modal-student-intro"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-[420px] sm:max-w-[480px] rounded-[16px] p-6 border border-white/[0.08] bg-[#1e293b] shadow-2xl relative my-auto animate-fade-in select-none">
        {/* Onboarding Theme Toggle in Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle id="btn-onboarding-theme-toggle" variant="icon" />
        </div>

        {step === 'form' ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center mx-auto mb-2 text-[#0ea5e9]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-[20px] font-bold text-[#f8fafc] leading-tight">
                {isEditing ? 'Edit Student Profile' : 'Welcome to Gramify'}
              </h2>
              <p className="text-[12px] text-[#94a3b8] leading-tight truncate">
                {isEditing
                  ? 'Update your details for personalized certificate & analytics'
                  : 'Enter your details to initialize your Grammar Quest'}
              </p>
            </div>

            {/* Avatar picker trigger button */}
            <div className="flex flex-col items-center justify-center py-1">
              <button
                type="button"
                id="btn-intro-avatar-picker"
                onClick={() => {
                  soundManager.playClick();
                  setShowPicker(true);
                }}
                className="
                  w-20 h-20 rounded-full
                  bg-slate-700/50 border-2 border-white/10
                  hover:border-cyan-400 hover:bg-slate-700
                  flex items-center justify-center
                  text-4xl
                  transition-all active:scale-95 cursor-pointer
                "
                title="Tap to change avatar"
              >
                {resolveAvatar(avatar)}
              </button>
              <p className="text-xs text-slate-400 mt-1">Tap to change</p>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#f8fafc] block">
                Student Full Name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                id="input-student-name"
                type="text"
                maxLength={30}
                required
                placeholder="e.g. Albert Arham"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[14px] text-[#f8fafc] placeholder:text-[#94a3b8]/60 focus:outline-none focus:border-[#0ea5e9]/50 focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
              />
            </div>

            {/* Roll / Student ID */}
            <div className="space-y-1.5">
              <label htmlFor="input-student-roll" className="text-[12px] font-semibold text-[#f8fafc] block">
                Roll / Student ID (Optional)
              </label>
              <input
                id="input-student-roll"
                type="text"
                maxLength={20}
                placeholder="e.g. 108425"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[14px] text-[#f8fafc] font-mono placeholder:text-[#94a3b8]/60 focus:outline-none focus:border-[#0ea5e9]/50 focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
              />
            </div>

            {/* Gender Selector (2 Options Only: Male & Female) */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#f8fafc] block">
                Gender <span className="text-[#ef4444]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="btn-gender-male"
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setGender('male');
                  }}
                  className={`h-[56px] rounded-xl border flex items-center justify-center gap-2.5 px-3 transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'border-[#0ea5e9] bg-[#0ea5e9]/10 text-[#f8fafc]'
                      : 'border-white/10 bg-transparent text-[#94a3b8] hover:border-white/20 hover:text-[#f8fafc]'
                  }`}
                >
                  <User className="w-5 h-5 text-[#0ea5e9]" />
                  <span className="text-[14px] font-medium text-[#f8fafc]">Male</span>
                </button>

                <button
                  id="btn-gender-female"
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setGender('female');
                  }}
                  className={`h-[56px] rounded-xl border flex items-center justify-center gap-2.5 px-3 transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'border-[#0ea5e9] bg-[#0ea5e9]/10 text-[#f8fafc]'
                      : 'border-white/10 bg-transparent text-[#94a3b8] hover:border-white/20 hover:text-[#f8fafc]'
                  }`}
                >
                  <User className="w-5 h-5 text-[#0ea5e9]" />
                  <span className="text-[14px] font-medium text-[#f8fafc]">Female</span>
                </button>
              </div>
              {gender === null && submitAttempted && (
                <p className="text-[12px] text-[#ef4444] mt-1">Please select your gender to continue.</p>
              )}
            </div>

            {/* Group & Board Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#f8fafc] block">Academic Group</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[14px] text-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]/50 focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all cursor-pointer"
                >
                  <option value="Science">Science</option>
                  <option value="Humanities">Humanities / Arts</option>
                  <option value="Business Studies">Business Studies / Commerce</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#f8fafc] block">Education Board</label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[14px] text-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]/50 focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all cursor-pointer"
                >
                  <option value="Dhaka">Dhaka Board</option>
                  <option value="Rajshahi">Rajshahi Board</option>
                  <option value="Chattogram">Chattogram Board</option>
                  <option value="Sylhet">Sylhet Board</option>
                  <option value="Barishal">Barishal Board</option>
                  <option value="Cumilla">Cumilla Board</option>
                  <option value="Jashore">Jashore Board</option>
                  <option value="Mymensingh">Mymensingh Board</option>
                  <option value="Dinajpur">Dinajpur Board</option>
                  <option value="Madrasah">Madrasah / Technical</option>
                </select>
              </div>
            </div>

            {/* College / Institute (below Education Board) */}
            <div className="space-y-1.5">
              <label htmlFor="input-student-college" className="text-[12px] font-semibold text-[#f8fafc] block">
                College / Institute (Optional)
              </label>
              <input
                id="input-student-college"
                type="text"
                maxLength={80}
                placeholder="e.g. SRCC"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[14px] text-[#f8fafc] placeholder:text-[#94a3b8]/60 focus:outline-none focus:border-[#0ea5e9]/50 focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              {isEditing && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 h-[48px] rounded-xl bg-slate-800 hover:bg-slate-700 text-[#94a3b8] hover:text-[#f8fafc] font-semibold text-[14px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                id="btn-submit-intro"
                type="submit"
                disabled={!isFormValid}
                className="flex-1 h-[48px] rounded-xl font-semibold text-[14px] bg-[#0ea5e9] hover:bg-[#0284c7] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0ea5e9] shadow-md cursor-pointer"
              >
                <span>{isEditing ? 'Save Profile' : 'Start Learning'}</span>
              </button>
            </div>

            {/* Local Storage Privacy Notice */}
            <p className="text-[11px] text-slate-400 text-center pt-1 leading-normal">
              Your data is stored locally on this device. We do not collect or transmit your personal information.
            </p>
          </form>
        ) : (
          /* 4-Slide Carousel */
          <div className="space-y-4 text-center">
            {slides[carouselSlide].isCredit ? (
              <div className="p-4 rounded-xl bg-[#0f172a] border border-white/[0.08] text-center space-y-2 animate-fade-in">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center mx-auto text-[#0ea5e9]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-[20px] font-bold text-[#f8fafc]">
                  {slides[carouselSlide].title}
                </h2>
                <h3 className="text-[12px] font-semibold text-[#0ea5e9]">
                  {slides[carouselSlide].subtitle}
                </h3>
                <p className="text-[12px] text-[#94a3b8] leading-relaxed max-w-sm mx-auto">
                  {slides[carouselSlide].description}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center mx-auto mb-2 text-[#0ea5e9]">
                  {React.createElement(slides[carouselSlide].icon, { className: 'w-6 h-6' })}
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0ea5e9] font-mono">
                    Step {carouselSlide + 1} of {slides.length}
                  </span>
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-[#f8fafc]">
                    {slides[carouselSlide].title}
                  </h2>
                  <h3 className="text-[12px] font-semibold text-[#0ea5e9]">
                    {slides[carouselSlide].subtitle}
                  </h3>
                  <p className="text-[12px] text-[#94a3b8] leading-relaxed pt-0.5 max-w-sm mx-auto">
                    {slides[carouselSlide].description}
                  </p>
                </div>
              </div>
            )}

            {/* Carousel Dots */}
            <div className="flex justify-center gap-1.5 pt-1">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    carouselSlide === i ? 'w-6 bg-[#0ea5e9]' : 'w-2 bg-[#334155]'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              {carouselSlide < slides.length - 1 && (
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-1/3 h-[44px] rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[#94a3b8] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Skip
                </button>
              )}
              <button
                type="button"
                id="btn-onboarding-continue"
                onClick={() => {
                  soundManager.playClick();
                  if (carouselSlide + 1 < slides.length) {
                    setCarouselSlide((prev) => prev + 1);
                  } else {
                    handleFinishOnboarding();
                  }
                }}
                className="flex-1 h-[44px] rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{carouselSlide === slides.length - 1 ? 'Start Learning' : 'Continue'}</span>
                {carouselSlide < slides.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {showPicker && (
        <AvatarPickerModal
          isOpen={showPicker}
          currentAvatar={avatar}
          onSelect={(selected) => setAvatar(selected)}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};
