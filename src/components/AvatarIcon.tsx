import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Lightbulb,
  Star,
  Rocket,
  Crown,
  Flame,
  Sparkles,
  User,
} from 'lucide-react';

export type AvatarId = 'cap' | 'book' | 'lightbulb' | 'star' | 'rocket' | 'crown' | 'flame' | 'owl';

export interface AvatarOption {
  id: AvatarId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'cap', label: 'Graduation Cap', icon: GraduationCap },
  { id: 'book', label: 'Book', icon: BookOpen },
  { id: 'lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'rocket', label: 'Rocket', icon: Rocket },
  { id: 'crown', label: 'Crown', icon: Crown },
  { id: 'flame', label: 'Flame', icon: Flame },
  { id: 'owl', label: 'Sparkles', icon: Sparkles },
];

export function getAvatarIcon(avatarKey: string | null | undefined): React.ComponentType<{ className?: string }> {
  if (!avatarKey) return GraduationCap;
  
  switch (avatarKey) {
    case 'cap':
    case '🧑‍🎓':
    case '👩‍🎓':
      return GraduationCap;
    case 'book':
    case '📚':
      return BookOpen;
    case 'lightbulb':
    case '💡':
    case '🧠':
      return Lightbulb;
    case 'star':
    case '⭐':
      return Star;
    case 'rocket':
    case '🚀':
      return Rocket;
    case 'crown':
    case '👑':
      return Crown;
    case 'flame':
    case '🔥':
      return Flame;
    case 'owl':
    case '🦉':
    case 'sparkles':
      return Sparkles;
    default:
      return GraduationCap;
  }
}

interface AvatarIconProps {
  avatarKey?: string | null;
  className?: string;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ avatarKey, className = 'w-5 h-5' }) => {
  const IconComp = getAvatarIcon(avatarKey);
  return <IconComp className={className} />;
};
