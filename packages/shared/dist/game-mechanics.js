"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTitleForLevel = exports.calculateTaskXp = exports.calculateXpToNextLevel = exports.calculateLevel = exports.STAT_GAINS = exports.XP_VALUES = void 0;
exports.XP_VALUES = {
    EASY: 10,
    MEDIUM: 25,
    HARD: 50,
};
exports.STAT_GAINS = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
};
const calculateLevel = (xp) => {
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
exports.calculateLevel = calculateLevel;
const calculateXpToNextLevel = (level) => {
    return 100 + (level - 1) * 35;
};
exports.calculateXpToNextLevel = calculateXpToNextLevel;
const calculateTaskXp = (difficulty, actualMinutes, streakDays = 0, isQuest = false) => {
    const base = exports.XP_VALUES[difficulty];
    const durationBonus = Math.min(Math.floor(actualMinutes / 10) * 2, 20);
    const streakBonus = Math.min(streakDays * 0.5, 10);
    let total = base + durationBonus + streakBonus;
    if (isQuest) {
        total *= 1.25;
    }
    return Math.floor(total);
};
exports.calculateTaskXp = calculateTaskXp;
const getTitleForLevel = (level) => {
    if (level >= 50)
        return 'Suspiciously Productive';
    if (level >= 35)
        return 'Productivity Menace';
    if (level >= 20)
        return 'Main Character';
    if (level >= 10)
        return 'Functioning Human';
    if (level >= 5)
        return 'Slightly Functional';
    return 'Wandering Potato';
};
exports.getTitleForLevel = getTitleForLevel;
