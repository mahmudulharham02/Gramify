import { Badge } from '../types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_steps',
    title: 'First Steps 🎯',
    icon: '🎯',
    description: 'Complete your first grammar exercise successfully.',
    category: 'progress',
    xpReward: 30,
    coinReward: 5,
  },
  {
    id: 'on_fire_7',
    title: 'On Fire 🔥',
    icon: '🔥',
    description: 'Maintain a 7-day practice streak.',
    category: 'streak',
    xpReward: 150,
    coinReward: 25,
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist 💯',
    icon: '💯',
    description: 'Answer 10 questions in a row without making a single mistake.',
    category: 'mastery',
    xpReward: 100,
    coinReward: 20,
  },
  {
    id: 'voice_master',
    title: 'Voice Master 🎓',
    icon: '🎓',
    description: 'Master all 12 active/passive voice transformation drills with 90%+ score.',
    category: 'mastery',
    xpReward: 200,
    coinReward: 30,
  },
  {
    id: 'complex_solver',
    title: 'Complex Solver 🧩',
    icon: '🧩',
    description: 'Complete 15 Simple ↔ Complex ↔ Compound transformation exercises.',
    category: 'mastery',
    xpReward: 180,
    coinReward: 25,
  },
  {
    id: 'narration_pro',
    title: 'Narration Whisperer 🗣️',
    icon: '🗣️',
    description: 'Successfully change direct speech into indirect speech for 10 sentences.',
    category: 'mastery',
    xpReward: 160,
    coinReward: 25,
  },
  {
    id: 'aff_neg_whiz',
    title: '16-Rule Genius ⚡',
    icon: '⚡',
    description: 'Master Affirmative ↔ Negative rules (None but, cannot but, etc.).',
    category: 'mastery',
    xpReward: 140,
    coinReward: 20,
  },
  {
    id: 'bookworm',
    title: 'Bookworm 📖',
    icon: '📖',
    description: 'Study and solve over 50 questions across any topic.',
    category: 'progress',
    xpReward: 120,
    coinReward: 20,
  },
  {
    id: 'early_bird',
    title: 'Early Bird 🌅',
    icon: '🌅',
    description: 'Practice grammar before 8:00 AM.',
    category: 'special',
    xpReward: 50,
    coinReward: 10,
  },
  {
    id: 'night_owl',
    title: 'Night Owl 🦉',
    icon: '🦉',
    description: 'Practice grammar after 11:00 PM.',
    category: 'special',
    xpReward: 50,
    coinReward: 10,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon ⚡',
    icon: '⚡',
    description: 'Answer 5 questions correctly in under 30 seconds.',
    category: 'special',
    xpReward: 80,
    coinReward: 15,
  },
  {
    id: 'coin_collector',
    title: 'Coin Collector 💎',
    icon: '💎',
    description: 'Accumulate 100 or more grammar coins in your wallet.',
    category: 'progress',
    xpReward: 100,
    coinReward: 50,
  },
  {
    id: 'level_10',
    title: 'Level 10 Achiever 🚀',
    icon: '🚀',
    description: 'Reach Level 10 and unlock the Grammar Gladiator rank.',
    category: 'progress',
    xpReward: 250,
    coinReward: 40,
  },
  {
    id: 'daily_champion',
    title: 'Daily Champion 🏆',
    icon: '🏆',
    description: 'Complete the 10-Question Mixed Daily Challenge with 80%+ accuracy.',
    category: 'special',
    xpReward: 120,
    coinReward: 20,
  },
  {
    id: 'hint_hoarder',
    title: 'Pure Intuition 🪄',
    icon: '🪄',
    description: 'Answer 20 questions without using a single hint token.',
    category: 'special',
    xpReward: 90,
    coinReward: 15,
  },
  {
    id: 'board_topper',
    title: 'HSC Board Topper 👑',
    icon: '👑',
    description: 'Reach 85%+ mastery across all 10 HSC Grammar topics.',
    category: 'mastery',
    xpReward: 500,
    coinReward: 100,
  }
];

export function getLevelTitle(level: number): string {
  if (level < 3) return 'Apprentice 🐣';
  if (level < 6) return 'Grammar Scholar 📚';
  if (level < 9) return 'Linguist 🧠';
  if (level < 12) return 'Grammar Gladiator ⚔️';
  if (level < 16) return 'Sentence Sage 🧙';
  if (level < 20) return 'Transformation Master 🌟';
  if (level < 25) return 'Board Conqueror 🎖️';
  return 'Grammar King / Queen 👑';
}

export function getXpRequiredForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5));
}
