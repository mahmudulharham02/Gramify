import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/sound';

/**
 * Exactly 30 emoji options for the student avatar roster
 */
export const AVATAR_OPTIONS = [
  "😎", "🫣", "😑", "🫩", "😙",
  "😺", "😼", "😾",
  "🐶", "🐱", "🐭", "🐰",
  "🦁", "🦆", "🦉", "🕷", "🦕",
  "🌚", "🌝",
  "🧠", "🧑", "👩", "🧔", "🧕",
  "🧑🎓", "🥷", "🧑💻", "🧑🚀",
  "👑", "🦸"
];

export const DEFAULT_AVATAR = "🧑🎓";

/**
 * Safely resolves an avatar key or legacy ID to a valid emoji string.
 * Defaults to "🧑🎓" if null, undefined, or 'cap'.
 */
export function resolveAvatar(avatar?: string | null): string {
  if (!avatar) return DEFAULT_AVATAR;
  if (avatar === 'cap' || avatar === '🧑‍🎓' || avatar === '👩‍🎓') return DEFAULT_AVATAR;
  if (avatar === 'owl') return '🦉';
  if (avatar === 'star' || avatar === '⭐') return '⭐';
  if (avatar === 'crown') return '👑';
  if (avatar === 'rocket') return '🧑🚀';
  if (avatar === 'flame') return '🔥';
  if (avatar === 'lightbulb' || avatar === 'brain') return '🧠';
  if (avatar === 'book') return DEFAULT_AVATAR;
  return avatar;
}

export interface AvatarPickerModalProps {
  isOpen: boolean;
  currentAvatar?: string | null;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  currentAvatar,
  onSelect,
  onClose,
}) => {
  const [tempAvatar, setTempAvatar] = useState<string>(() => resolveAvatar(currentAvatar));

  useEffect(() => {
    if (isOpen) {
      setTempAvatar(resolveAvatar(currentAvatar));
    }
  }, [isOpen, currentAvatar]);

  if (!isOpen) return null;

  const handleSave = () => {
    soundManager.playClick();
    onSelect(tempAvatar);
    onClose();
  };

  const handleCancel = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div
      id="modal-avatar-picker-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-4 select-none animate-fade-in"
      onClick={handleCancel}
    >
      <div
        id="modal-avatar-picker-content"
        className="
          bg-slate-900 border border-white/10 rounded-2xl
          w-full max-w-md
          p-5
          animate-in slide-in-from-bottom-4 duration-300
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">Choose Your Avatar</h3>
          <button
            id="btn-close-avatar-modal"
            type="button"
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Current selection preview */}
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-slate-800/50">
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-3xl shrink-0">
            {tempAvatar}
          </div>
          <div>
            <p className="text-sm text-white font-medium">Selected</p>
            <p className="text-xs text-slate-400">Tap an emoji below to choose</p>
          </div>
        </div>

        {/* Emoji Grid (6 cols on mobile, 8 on desktop) */}
        <div className="grid grid-cols-6 md:grid-cols-8 gap-2 max-h-[300px] overflow-y-auto p-1">
          {AVATAR_OPTIONS.map((emoji) => {
            const isSelected = tempAvatar === emoji;
            return (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setTempAvatar(emoji);
                }}
                className={`
                  aspect-square rounded-xl
                  flex items-center justify-center
                  text-2xl md:text-3xl
                  transition-all cursor-pointer
                  ${
                    isSelected
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-105 shadow-sm'
                      : 'bg-slate-800/50 border-2 border-transparent hover:bg-slate-700 hover:scale-105'
                  }
                `}
              >
                {emoji}
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-5">
          <button
            id="btn-cancel-avatar-picker"
            type="button"
            onClick={handleCancel}
            className="flex-1 h-12 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="btn-save-avatar-picker"
            type="button"
            onClick={handleSave}
            className="flex-1 h-12 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-400 transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
