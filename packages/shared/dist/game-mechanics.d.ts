export declare const XP_VALUES: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
};
export declare const STAT_GAINS: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
};
export declare const calculateLevel: (xp: number) => number;
export declare const calculateXpToNextLevel: (level: number) => number;
export declare const calculateTaskXp: (difficulty: "EASY" | "MEDIUM" | "HARD", actualMinutes: number, streakDays?: number, isQuest?: boolean) => number;
export declare const getTitleForLevel: (level: number) => string;
