import { TaskDifficulty } from './schemas';

export const XP_VALUES = {
  EASY: 10,
  MEDIUM: 25,
  HARD: 50,
};

export const STAT_GAINS = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};

export const calculateLevel = (xp: number): number => {
  // Level 1 starts at 0 XP
  // XP needed to next level: 100 + (level-1)*35
  // This is an arithmetic progression sum problem if we want total XP for level L
  // But for simple lookup, we can iterate or use an approximation.
  // Since max level isn't huge, iteration is fine for display, but let's do a formula if possible.
  // Let's stick to a simple iterative approach for accuracy or a reverse formula.
  
  let level = 1;
  let currentXp = xp;
  let xpNeeded = 100;

  while (currentXp >= xpNeeded) {
    currentXp -= xpNeeded;
    level++;
    xpNeeded = 100 + (level - 1) * 35;
  }
  
  return level;
};

export const calculateXpToNextLevel = (level: number): number => {
  return 100 + (level - 1) * 35;
};

export const calculateTaskXp = (
  difficulty: 'EASY' | 'MEDIUM' | 'HARD',
  actualMinutes: number,
  streakDays: number = 0,
  isQuest: boolean = false
): number => {
  const base = XP_VALUES[difficulty];
  
  const durationBonus = Math.min(Math.floor(actualMinutes / 10) * 2, 20);
  
  const streakBonus = Math.min(streakDays * 0.5, 10);
  
  let total = base + durationBonus + streakBonus;
  
  if (isQuest) {
    total *= 1.25;
  }
  
  return Math.floor(total);
};

export const getTitleForLevel = (level: number): string => {
  if (level >= 50) return 'Suspiciously Productive';
  if (level >= 35) return 'Productivity Menace';
  if (level >= 20) return 'Main Character';
  if (level >= 10) return 'Functioning Human';
  if (level >= 5) return 'Slightly Functional';
  return 'Wandering Potato';
};
