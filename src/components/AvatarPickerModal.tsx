import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { isCustomPhoto, resizeAndEncodeImage } from '../utils/imageUpload';

export { isCustomPhoto };

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTempAvatar(resolveAvatar(currentAvatar));
    }
  }, [isOpen, currentAvatar]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeAndEncodeImage(file);
      soundManager.playClick();
      setTempAvatar(dataUrl);
    } catch (err) {
      console.warn('Failed to process image:', err);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

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

        {/* Current selection preview with Upload / Remove options */}
        <div className="flex items-center justify-between gap-3 mb-4 p-3 rounded-xl bg-slate-800/50 border border-white/[0.06]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-3xl shrink-0 overflow-hidden border border-white/10">
              {isCustomPhoto(tempAvatar) ? (
                <img src={tempAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{tempAvatar}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {isCustomPhoto(tempAvatar) ? 'Custom Photo' : 'Preset Avatar'}
              </p>
              <p className="text-xs text-slate-400">
                {isCustomPhoto(tempAvatar) ? 'Photo ready to save' : 'Tap an emoji or upload photo'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              id="btn-modal-upload-photo"
              onClick={() => {
                soundManager.playClick();
                fileInputRef.current?.click();
              }}
              className="h-8 px-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
            {isCustomPhoto(tempAvatar) && (
              <button
                type="button"
                id="btn-modal-remove-photo"
                onClick={() => {
                  soundManager.playClick();
                  setTempAvatar(DEFAULT_AVATAR);
                }}
                className="h-8 px-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

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
