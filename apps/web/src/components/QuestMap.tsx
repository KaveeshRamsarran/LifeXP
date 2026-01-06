'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StarIcon, 
  CrownIcon, 
  TrophyIcon, 
  FlameIcon,
  LightningIcon,
  SparklesIcon,
  SwordIcon,
  ShieldIcon,
  ScrollIcon,
  CoinIcon,
  DragonIcon
} from './icons/GameIcons';

// Quest node types
type QuestNodeType = 'start' | 'battle' | 'treasure' | 'rest' | 'boss' | 'mystery' | 'shop' | 'checkpoint';

interface QuestNode {
  id: number;
  type: QuestNodeType;
  x: number;
  y: number;
  completed: boolean;
  locked: boolean;
  reward: number;
  title: string;
  description: string;
  oneTime?: boolean; // For one-time quests that can't be repeated
}

interface QuestPath {
  from: number;
  to: number;
}

// Random challenge tasks for mystery quests
const mysteryChallengeTasks = [
  { title: "Cold Shower Challenge", description: "Take a cold shower for 2 minutes", category: "DISCIPLINE", difficulty: "HARD" },
  { title: "Gratitude List", description: "Write down 10 things you're grateful for", category: "INTELLIGENCE", difficulty: "EASY" },
  { title: "No Phone Hour", description: "Go 1 hour without checking your phone", category: "DISCIPLINE", difficulty: "MEDIUM" },
  { title: "Random Act of Kindness", description: "Do something nice for a stranger", category: "DISCIPLINE", difficulty: "EASY" },
  { title: "Plank Challenge", description: "Hold a plank for 2 minutes total", category: "STRENGTH", difficulty: "HARD" },
  { title: "Learn Something New", description: "Watch an educational video and take notes", category: "INTELLIGENCE", difficulty: "MEDIUM" },
  { title: "Declutter Challenge", description: "Throw away or donate 5 items you don't need", category: "DISCIPLINE", difficulty: "EASY" },
  { title: "Wall Sit", description: "Hold a wall sit for 90 seconds", category: "STRENGTH", difficulty: "MEDIUM" },
  { title: "Meditation Session", description: "Meditate for 15 minutes", category: "DISCIPLINE", difficulty: "MEDIUM" },
  { title: "Speed Clean", description: "Clean one room in under 15 minutes", category: "DISCIPLINE", difficulty: "EASY" },
  { title: "Push-up Challenge", description: "Do 30 push-ups (can break into sets)", category: "STRENGTH", difficulty: "HARD" },
  { title: "Budget Review", description: "Review your spending from last week", category: "WEALTH", difficulty: "MEDIUM" },
  { title: "Stretch Routine", description: "Complete a 20-minute stretching session", category: "STRENGTH", difficulty: "EASY" },
  { title: "Memory Challenge", description: "Memorize 10 new vocabulary words", category: "INTELLIGENCE", difficulty: "HARD" },
  { title: "Savings Challenge", description: "Transfer $5 to savings", category: "WEALTH", difficulty: "EASY" },
];

interface MysteryTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xpReward: number;
  isCompleted: boolean;
}

// Player sprite component - using custom image
function PlayerSprite({ x, y, isMoving }: { x: number; y: number; isMoving: boolean }) {
  return (
    <div 
      className="player-sprite absolute z-20 transition-all duration-700 ease-out"
      style={{ 
        left: x - 24, 
        top: y - 48,
      }}
    >
      {/* Glow effect under player */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-gold/50 rounded-full blur-md animate-pulse" />
      
      {/* Player image */}
      <img 
        src="/male.png"
        alt="Player character"
        className="w-12 h-12 object-contain drop-shadow-lg"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }}
      />
      
      {/* Player name tag */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[10px] font-bold text-gold bg-background/80 px-1.5 py-0.5 rounded-full border border-gold/30">
          You
        </span>
      </div>
    </div>
  );
}

// Node icon based on type
function NodeIcon({ type, completed }: { type: QuestNodeType; completed: boolean }) {
  const iconClass = `w-6 h-6 ${completed ? 'text-jade' : 'text-white'}`;
  
  switch (type) {
    case 'start':
      return <FlameIcon className={iconClass} />;
    case 'battle':
      return <SwordIcon className={iconClass} />;
    case 'treasure':
      return <CoinIcon className={iconClass} />;
    case 'rest':
      return <ShieldIcon className={iconClass} />;
    case 'boss':
      return <DragonIcon className={iconClass} />;
    case 'mystery':
      return <ScrollIcon className={iconClass} />;
    case 'shop':
      return <CrownIcon className={iconClass} />;
    default:
      return <StarIcon className={iconClass} />;
  }
}

// Get node background color based on type - Elden Ring colors
function getNodeColor(type: QuestNodeType, completed: boolean, locked: boolean) {
  if (locked) return 'from-stone-700 to-stone-800 border-stone-600';
  if (completed) return 'from-emerald-900 to-emerald-950 border-emerald-700';
  
  switch (type) {
    case 'start':
      return 'from-amber-800 to-amber-900 border-amber-600';
    case 'battle':
      return 'from-red-900 to-red-950 border-red-700';
    case 'treasure':
      return 'from-yellow-700 to-yellow-800 border-yellow-600';
    case 'rest':
      return 'from-blue-900 to-blue-950 border-blue-700';
    case 'boss':
      return 'from-purple-900 to-purple-950 border-purple-700';
    case 'mystery':
      return 'from-violet-900 to-violet-950 border-violet-700';
    case 'shop':
      return 'from-orange-800 to-orange-900 border-orange-600';
    case 'checkpoint':
      return 'from-cyan-900 to-cyan-950 border-cyan-700';
    default:
      return 'from-stone-600 to-stone-700 border-stone-500';
  }
}

// Expanded quest map data - Much longer journey with mixed RPG references!
const questNodes: QuestNode[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 1: THE AWAKENING (Starting Zone - Tutorial)
  // ═══════════════════════════════════════════════════════════════════════════════
  { id: 0, type: 'start', x: 80, y: 400, completed: true, locked: false, reward: 0, title: 'The Awakening', description: 'Create your account and begin your journey', oneTime: true },
  { id: 1, type: 'battle', x: 160, y: 350, completed: false, locked: false, reward: 15, title: 'First Steps', description: 'Make your bed for 3 days in a row', oneTime: true },
  { id: 2, type: 'treasure', x: 240, y: 300, completed: false, locked: false, reward: 25, title: 'Early Riser', description: 'Wake up before 7 AM for 3 days', oneTime: true },
  { id: 3, type: 'rest', x: 320, y: 260, completed: false, locked: false, reward: 10, title: 'Meditation', description: 'Meditate for 10 minutes' },
  { id: 4, type: 'mystery', x: 260, y: 420, completed: false, locked: false, reward: 30, title: 'Strange Portal', description: '???' },
  { id: 5, type: 'battle', x: 400, y: 300, completed: false, locked: false, reward: 20, title: 'Productivity Burst', description: 'Complete 5 tasks in one day', oneTime: true },
  { id: 6, type: 'shop', x: 340, y: 380, completed: false, locked: false, reward: 15, title: 'Self Investment', description: 'Read for 30 minutes' },
  { id: 7, type: 'battle', x: 420, y: 420, completed: false, locked: false, reward: 25, title: 'Deep Work', description: 'Focus on a project for 2 hours without distractions', oneTime: true },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 2: CASTLE SIEGE (Building Habits)
  // ═══════════════════════════════════════════════════════════════════════════════
  { id: 8, type: 'checkpoint', x: 500, y: 260, completed: false, locked: true, reward: 50, title: 'Habit Foundation', description: 'Reach Level 3', oneTime: true },
  { id: 9, type: 'battle', x: 580, y: 200, completed: false, locked: true, reward: 30, title: 'Kitchen Master', description: 'Cook a healthy meal from scratch', oneTime: true },
  { id: 10, type: 'mystery', x: 520, y: 360, completed: false, locked: true, reward: 35, title: 'Hidden Passage', description: '???' },
  { id: 11, type: 'treasure', x: 600, y: 320, completed: false, locked: true, reward: 40, title: 'XP Milestone', description: 'Earn 150 total XP', oneTime: true },
  { id: 12, type: 'battle', x: 680, y: 260, completed: false, locked: true, reward: 35, title: 'Weekly Review', description: 'Plan your week on Sunday', oneTime: true },
  { id: 13, type: 'rest', x: 620, y: 420, completed: false, locked: true, reward: 15, title: 'Digital Detox', description: 'No social media for 24 hours' },
  { id: 14, type: 'shop', x: 700, y: 380, completed: false, locked: true, reward: 20, title: 'Skill Building', description: 'Watch an educational video and take notes' },
  { id: 15, type: 'mystery', x: 760, y: 320, completed: false, locked: true, reward: 45, title: 'Cursed Chamber', description: '???' },
  { id: 16, type: 'boss', x: 820, y: 240, completed: false, locked: true, reward: 100, title: 'Declutter Boss', description: 'Deep clean one room in your home', oneTime: true },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 3: ENCHANTED FOREST (Health & Fitness)
  // ═══════════════════════════════════════════════════════════════════════════════
  { id: 17, type: 'checkpoint', x: 920, y: 280, completed: false, locked: true, reward: 60, title: 'Fitness Journey', description: 'Complete the Declutter Boss challenge', oneTime: true },
  { id: 18, type: 'battle', x: 1000, y: 220, completed: false, locked: true, reward: 35, title: 'Morning Jog', description: 'Go for a 20-minute run or walk', oneTime: true },
  { id: 19, type: 'mystery', x: 980, y: 360, completed: false, locked: true, reward: 40, title: 'Fairy Circle', description: '???' },
  { id: 20, type: 'treasure', x: 1080, y: 280, completed: false, locked: true, reward: 50, title: 'XP Hoarder', description: 'Earn 300 total XP', oneTime: true },
  { id: 21, type: 'rest', x: 1060, y: 400, completed: false, locked: true, reward: 20, title: 'Sleep Schedule', description: 'Sleep 8 hours for 7 days straight' },
  { id: 22, type: 'battle', x: 1160, y: 340, completed: false, locked: true, reward: 40, title: 'Gym Warrior', description: 'Complete 5 gym sessions', oneTime: true },
  { id: 23, type: 'shop', x: 1140, y: 200, completed: false, locked: true, reward: 25, title: 'Meal Prep', description: 'Prepare meals for the week ahead' },
  { id: 24, type: 'mystery', x: 1240, y: 260, completed: false, locked: true, reward: 50, title: 'Elven Ruins', description: '???' },
  { id: 25, type: 'battle', x: 1220, y: 400, completed: false, locked: true, reward: 45, title: 'Push-up Master', description: 'Do 50 push-ups in one day (any sets)', oneTime: true },
  { id: 26, type: 'boss', x: 1320, y: 300, completed: false, locked: true, reward: 150, title: '5K Champion', description: 'Run or walk a 5K distance', oneTime: true },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 4: VOLCANIC MOUNTAINS (Career & Finance)
  // ═══════════════════════════════════════════════════════════════════════════════
  { id: 27, type: 'checkpoint', x: 1420, y: 340, completed: false, locked: true, reward: 75, title: 'Career Path', description: 'Complete the 5K challenge', oneTime: true },
  { id: 28, type: 'battle', x: 1500, y: 280, completed: false, locked: true, reward: 50, title: 'Resume Update', description: 'Update your resume or portfolio', oneTime: true },
  { id: 29, type: 'mystery', x: 1480, y: 420, completed: false, locked: true, reward: 55, title: 'Lava Caves', description: '???' },
  { id: 30, type: 'treasure', x: 1580, y: 360, completed: false, locked: true, reward: 65, title: 'XP Legend', description: 'Earn 500 total XP', oneTime: true },
  { id: 31, type: 'rest', x: 1560, y: 200, completed: false, locked: true, reward: 25, title: 'Budget Review', description: 'Review your monthly expenses' },
  { id: 32, type: 'battle', x: 1660, y: 260, completed: false, locked: true, reward: 55, title: 'Side Project', description: 'Work on a personal project for 5 hours total', oneTime: true },
  { id: 33, type: 'shop', x: 1640, y: 420, completed: false, locked: true, reward: 30, title: 'Online Course', description: 'Complete a module in an online course' },
  { id: 34, type: 'mystery', x: 1740, y: 340, completed: false, locked: true, reward: 60, title: 'Obsidian Shrine', description: '???' },
  { id: 35, type: 'battle', x: 1720, y: 180, completed: false, locked: true, reward: 60, title: 'Savings Goal', description: 'Save $100 this month', oneTime: true },
  { id: 36, type: 'boss', x: 1820, y: 280, completed: false, locked: true, reward: 200, title: 'Certification', description: 'Earn a professional certification or complete a course', oneTime: true },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 5: FROZEN WASTES (Discipline & Consistency)
  // ═══════════════════════════════════════════════════════════════════════════════
  { id: 37, type: 'checkpoint', x: 1920, y: 320, completed: false, locked: true, reward: 90, title: 'Iron Will', description: 'Complete the Certification challenge', oneTime: true },
  { id: 38, type: 'battle', x: 2000, y: 260, completed: false, locked: true, reward: 55, title: 'Cold Shower', description: 'Take cold showers for 5 days', oneTime: true },
  { id: 39, type: 'mystery', x: 1980, y: 400, completed: false, locked: true, reward: 65, title: 'Frozen Tomb', description: '???' },
  { id: 40, type: 'treasure', x: 2080, y: 340, completed: false, locked: true, reward: 75, title: 'XP Master', description: 'Earn 750 total XP', oneTime: true },
  { id: 41, type: 'rest', x: 2060, y: 180, completed: false, locked: true, reward: 30, title: '2-Week Streak', description: 'Maintain a 14-day task streak' },
  { id: 42, type: 'battle', x: 2160, y: 240, completed: false, locked: true, reward: 65, title: 'No Junk Food', description: 'Avoid junk food for 7 days', oneTime: true },
  { id: 43, type: 'shop', x: 2140, y: 400, completed: false, locked: true, reward: 35, title: 'Journaling', description: 'Write in a journal for 7 consecutive days' },
  { id: 44, type: 'mystery', x: 2240, y: 320, completed: false, locked: true, reward: 70, title: 'Glacier Heart', description: '???' },
  { id: 45, type: 'battle', x: 2220, y: 160, completed: false, locked: true, reward: 70, title: 'Phone-Free Day', description: 'Go an entire day without your phone', oneTime: true },
  { id: 46, type: 'boss', x: 2320, y: 260, completed: false, locked: true, reward: 250, title: '30-Day Challenge', description: 'Complete any 30-day challenge', oneTime: true },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 6: SHADOW REALM (Mental & Emotional Growth)
  // ═══════════════════════════════════════════════════════════════════════════════
  { id: 47, type: 'checkpoint', x: 2420, y: 300, completed: false, locked: true, reward: 100, title: 'Inner Peace', description: 'Complete the 30-Day Challenge', oneTime: true },
  { id: 48, type: 'battle', x: 2500, y: 240, completed: false, locked: true, reward: 65, title: 'Therapy Session', description: 'Attend a therapy or counseling session', oneTime: true },
  { id: 49, type: 'mystery', x: 2480, y: 380, completed: false, locked: true, reward: 75, title: 'Void Tear', description: '???' },
  { id: 50, type: 'treasure', x: 2580, y: 320, completed: false, locked: true, reward: 85, title: 'XP Champion', description: 'Earn 1000 total XP', oneTime: true },
  { id: 51, type: 'rest', x: 2560, y: 160, completed: false, locked: true, reward: 35, title: '3-Week Streak', description: 'Maintain a 21-day task streak' },
  { id: 52, type: 'battle', x: 2660, y: 220, completed: false, locked: true, reward: 75, title: 'Forgiveness', description: 'Forgive someone who hurt you (write a letter)', oneTime: true },
  { id: 53, type: 'shop', x: 2640, y: 380, completed: false, locked: true, reward: 40, title: 'Gratitude', description: 'Write 100 things you are grateful for' },
  { id: 54, type: 'mystery', x: 2740, y: 300, completed: false, locked: true, reward: 80, title: 'Memory Fragment', description: '???' },
  { id: 55, type: 'battle', x: 2720, y: 140, completed: false, locked: true, reward: 80, title: 'Public Speaking', description: 'Give a presentation or speak in public', oneTime: true },
  { id: 56, type: 'boss', x: 2820, y: 240, completed: false, locked: true, reward: 300, title: 'Life Vision', description: 'Create a detailed 5-year life plan', oneTime: true },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 7: CELESTIAL REALM (Relationships & Community)
  // ═══════════════════════════════════════════════════════════════════════════════
  { id: 57, type: 'checkpoint', x: 2920, y: 280, completed: false, locked: true, reward: 120, title: 'Social Mastery', description: 'Complete your Life Vision', oneTime: true },
  { id: 58, type: 'battle', x: 3000, y: 220, completed: false, locked: true, reward: 75, title: 'Family Dinner', description: 'Host a dinner for family or friends', oneTime: true },
  { id: 59, type: 'mystery', x: 2980, y: 360, completed: false, locked: true, reward: 85, title: 'Star Forge', description: '???' },
  { id: 60, type: 'treasure', x: 3080, y: 300, completed: false, locked: true, reward: 100, title: 'XP Grandmaster', description: 'Earn 1500 total XP', oneTime: true },
  { id: 61, type: 'rest', x: 3060, y: 140, completed: false, locked: true, reward: 40, title: 'Monthly Streak', description: 'Maintain a 30-day task streak' },
  { id: 62, type: 'battle', x: 3160, y: 200, completed: false, locked: true, reward: 85, title: 'Mentorship', description: 'Mentor someone or find a mentor', oneTime: true },
  { id: 63, type: 'shop', x: 3140, y: 360, completed: false, locked: true, reward: 50, title: 'Date Night', description: 'Plan a special outing with loved one' },
  { id: 64, type: 'mystery', x: 3240, y: 280, completed: false, locked: true, reward: 95, title: 'Constellation Puzzle', description: '???' },
  { id: 65, type: 'battle', x: 3220, y: 120, completed: false, locked: true, reward: 90, title: 'Community Event', description: 'Organize or lead a community event', oneTime: true },
  { id: 66, type: 'boss', x: 3320, y: 220, completed: false, locked: true, reward: 350, title: 'Life Coach', description: 'Help 3 people achieve their goals', oneTime: true },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 8: THE FINAL SUMMIT (Life Mastery)
  // ═══════════════════════════════════════════════════════════════════════════════
  { id: 67, type: 'checkpoint', x: 3420, y: 260, completed: false, locked: true, reward: 150, title: 'Life Master', description: 'Complete the Life Coach challenge', oneTime: true },
  { id: 68, type: 'battle', x: 3500, y: 200, completed: false, locked: true, reward: 90, title: 'Marathon', description: 'Run a half or full marathon', oneTime: true },
  { id: 69, type: 'mystery', x: 3480, y: 340, completed: false, locked: true, reward: 100, title: 'Reality Rift', description: '???' },
  { id: 70, type: 'treasure', x: 3580, y: 280, completed: false, locked: true, reward: 125, title: 'XP Immortal', description: 'Earn 2000 total XP', oneTime: true },
  { id: 71, type: 'rest', x: 3560, y: 120, completed: false, locked: true, reward: 50, title: '60-Day Streak', description: 'Maintain a 60-day task streak' },
  { id: 72, type: 'battle', x: 3660, y: 180, completed: false, locked: true, reward: 100, title: 'Business Launch', description: 'Start a side business or major project', oneTime: true },
  { id: 73, type: 'shop', x: 3640, y: 340, completed: false, locked: true, reward: 60, title: 'Dream Vacation', description: 'Plan and take your dream trip' },
  { id: 74, type: 'mystery', x: 3740, y: 260, completed: false, locked: true, reward: 120, title: 'Origin Gate', description: '???' },
  { id: 75, type: 'battle', x: 3720, y: 100, completed: false, locked: true, reward: 110, title: 'Financial Freedom', description: 'Build 6 months emergency fund', oneTime: true },
  { id: 76, type: 'boss', x: 3840, y: 200, completed: false, locked: true, reward: 500, title: 'Life Champion', description: 'Achieve a major life goal you set at the start', oneTime: true },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SECRET ZONE: HIDDEN PATHS (Bonus content)
  // ═══════════════════════════════════════════════════════════════════════════════
  { id: 77, type: 'mystery', x: 400, y: 500, completed: false, locked: true, reward: 100, title: 'Hidden Grotto', description: '???' },
  { id: 78, type: 'treasure', x: 1100, y: 500, completed: false, locked: true, reward: 150, title: 'Hidden Talent', description: 'Perform your hidden talent publicly' },
  { id: 79, type: 'mystery', x: 1800, y: 500, completed: false, locked: true, reward: 175, title: 'Time Rift', description: '???' },
  { id: 80, type: 'treasure', x: 2500, y: 500, completed: false, locked: true, reward: 200, title: 'Anonymous Hero', description: 'Do 10 anonymous good deeds' },
  { id: 81, type: 'mystery', x: 3200, y: 500, completed: false, locked: true, reward: 250, title: 'Quantum Realm', description: '???' },
  { id: 82, type: 'boss', x: 3600, y: 500, completed: false, locked: true, reward: 1000, title: 'True Champion', description: 'Complete every quest on the map', oneTime: true },
];

const questPaths: QuestPath[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 1: THE AWAKENING
  // ═══════════════════════════════════════════════════════════════════════════════
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },  // Fork to mystery
  { from: 3, to: 5 },
  { from: 4, to: 6 },  // Mystery leads to shop
  { from: 4, to: 7 },  // Mystery also leads to battle
  { from: 5, to: 8 },  // Main path to Act 2
  { from: 6, to: 8 },  // Shop also leads to Act 2
  { from: 7, to: 10 }, // Battle leads to Act 2 mystery
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 2: CASTLE SIEGE
  // ═══════════════════════════════════════════════════════════════════════════════
  { from: 8, to: 9 },
  { from: 8, to: 10 },  // Fork
  { from: 9, to: 11 },
  { from: 9, to: 12 },  // Fork
  { from: 10, to: 11 },
  { from: 10, to: 13 }, // Fork to rest
  { from: 11, to: 12 },
  { from: 12, to: 15 },
  { from: 12, to: 16 }, // To boss
  { from: 13, to: 14 },
  { from: 14, to: 15 },
  { from: 15, to: 16 },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 3: ENCHANTED FOREST
  // ═══════════════════════════════════════════════════════════════════════════════
  { from: 16, to: 17 },
  { from: 17, to: 18 },
  { from: 17, to: 19 },  // Fork
  { from: 18, to: 20 },
  { from: 18, to: 23 },  // Fork to shop
  { from: 19, to: 21 },
  { from: 19, to: 22 },  // Fork
  { from: 20, to: 24 },
  { from: 21, to: 22 },
  { from: 21, to: 25 },  // Fork
  { from: 22, to: 24 },
  { from: 23, to: 24 },
  { from: 24, to: 26 },
  { from: 25, to: 26 },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 4: VOLCANIC MOUNTAINS
  // ═══════════════════════════════════════════════════════════════════════════════
  { from: 26, to: 27 },
  { from: 27, to: 28 },
  { from: 27, to: 29 },  // Fork
  { from: 28, to: 30 },
  { from: 28, to: 31 },  // Fork to rest
  { from: 29, to: 30 },
  { from: 29, to: 33 },  // Fork to shop
  { from: 30, to: 32 },
  { from: 30, to: 34 },  // Fork
  { from: 31, to: 32 },
  { from: 31, to: 35 },  // Fork
  { from: 32, to: 34 },
  { from: 33, to: 34 },
  { from: 34, to: 36 },
  { from: 35, to: 36 },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 5: FROZEN WASTES
  // ═══════════════════════════════════════════════════════════════════════════════
  { from: 36, to: 37 },
  { from: 37, to: 38 },
  { from: 37, to: 39 },  // Fork
  { from: 38, to: 40 },
  { from: 38, to: 41 },  // Fork to rest
  { from: 39, to: 40 },
  { from: 39, to: 43 },  // Fork to shop
  { from: 40, to: 42 },
  { from: 40, to: 44 },  // Fork
  { from: 41, to: 42 },
  { from: 41, to: 45 },  // Fork
  { from: 42, to: 44 },
  { from: 43, to: 44 },
  { from: 44, to: 46 },
  { from: 45, to: 46 },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 6: SHADOW REALM
  // ═══════════════════════════════════════════════════════════════════════════════
  { from: 46, to: 47 },
  { from: 47, to: 48 },
  { from: 47, to: 49 },  // Fork
  { from: 48, to: 50 },
  { from: 48, to: 51 },  // Fork to rest
  { from: 49, to: 50 },
  { from: 49, to: 53 },  // Fork to shop
  { from: 50, to: 52 },
  { from: 50, to: 54 },  // Fork
  { from: 51, to: 52 },
  { from: 51, to: 55 },  // Fork
  { from: 52, to: 54 },
  { from: 53, to: 54 },
  { from: 54, to: 56 },
  { from: 55, to: 56 },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 7: CELESTIAL REALM
  // ═══════════════════════════════════════════════════════════════════════════════
  { from: 56, to: 57 },
  { from: 57, to: 58 },
  { from: 57, to: 59 },  // Fork
  { from: 58, to: 60 },
  { from: 58, to: 61 },  // Fork to rest
  { from: 59, to: 60 },
  { from: 59, to: 63 },  // Fork to shop
  { from: 60, to: 62 },
  { from: 60, to: 64 },  // Fork
  { from: 61, to: 62 },
  { from: 61, to: 65 },  // Fork
  { from: 62, to: 64 },
  { from: 63, to: 64 },
  { from: 64, to: 66 },
  { from: 65, to: 66 },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ACT 8: THE FINAL SUMMIT
  // ═══════════════════════════════════════════════════════════════════════════════
  { from: 66, to: 67 },
  { from: 67, to: 68 },
  { from: 67, to: 69 },  // Fork
  { from: 68, to: 70 },
  { from: 68, to: 71 },  // Fork to rest
  { from: 69, to: 70 },
  { from: 69, to: 73 },  // Fork to shop
  { from: 70, to: 72 },
  { from: 70, to: 74 },  // Fork
  { from: 71, to: 72 },
  { from: 71, to: 75 },  // Fork
  { from: 72, to: 74 },
  { from: 73, to: 74 },
  { from: 74, to: 76 },
  { from: 75, to: 76 },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SECRET PATHS
  // ═══════════════════════════════════════════════════════════════════════════════
  { from: 7, to: 77 },   // Early secret from bandit battle
  { from: 77, to: 78 },  // Chain secrets together
  { from: 25, to: 78 },  // Connect from Act 3
  { from: 78, to: 79 },
  { from: 35, to: 79 },  // Connect from Act 4
  { from: 79, to: 80 },
  { from: 55, to: 80 },  // Connect from Act 6
  { from: 80, to: 81 },
  { from: 65, to: 81 },  // Connect from Act 7
  { from: 81, to: 82 },  // True final boss
  { from: 76, to: 82 },  // Also reachable from main final boss
];

interface QuestMapProps {
  currentNodeId?: number;
  completedNodeIds?: number[];
  onNodeClick?: (node: QuestNode) => void;
  onMysteryTask?: (task: MysteryTask) => void;
  onCompleteNode?: (nodeId: number, reward: number) => void;
  onPlayerMove?: (nodeId: number) => void;
}

export default function QuestMap({ 
  currentNodeId = 0, 
  completedNodeIds = [],
  onNodeClick, 
  onMysteryTask,
  onCompleteNode,
  onPlayerMove,
}: QuestMapProps) {
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 350 });
  const [isMoving, setIsMoving] = useState(false);
  const [selectedNode, setSelectedNode] = useState<QuestNode | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [completedQuestIds, setCompletedQuestIds] = useState<Set<number>>(() => {
    // Load from localStorage to persist one-time quest completions
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('completedQuestIds');
      return saved ? new Set(JSON.parse(saved)) : new Set([0]);
    }
    return new Set([0]);
  });
  const [mysteryTasks, setMysteryTasks] = useState<MysteryTask[]>([]);
  const [showMysteryModal, setShowMysteryModal] = useState(false);
  const [currentMysteryTask, setCurrentMysteryTask] = useState<MysteryTask | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Mouse drag state for map panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollPos: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Merge local completed IDs with passed-in completedNodeIds
  const allCompletedIds = new Set([...completedQuestIds, ...completedNodeIds]);

  // Save completed quests to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedQuestIds', JSON.stringify([...completedQuestIds]));
    }
  }, [completedQuestIds]);

  // Check if a quest is completed (including one-time tracking)
  const isQuestCompleted = useCallback((node: QuestNode) => {
    return node.completed || allCompletedIds.has(node.id);
  }, [allCompletedIds]);

  // Determine which nodes are unlocked based on completed nodes
  const isNodeUnlocked = useCallback((nodeId: number) => {
    if (nodeId === 0) return true; // Start is always unlocked
    
    // Find paths that lead to this node
    const incomingPaths = questPaths.filter(p => p.to === nodeId);
    
    // Node is unlocked if any of its predecessor nodes are completed
    return incomingPaths.some(path => allCompletedIds.has(path.from));
  }, [allCompletedIds]);

  // Find the furthest completed node for player position (on initial load only)
  const getFurthestCompletedNode = useCallback(() => {
    // Get the most recently added completed node (last in the set converted to array)
    const completedArray = [...allCompletedIds];
    if (completedArray.length === 0) return 0;
    // Return the last completed node (most recent)
    return completedArray[completedArray.length - 1];
  }, [allCompletedIds]);

  // Update player position when current node changes or on mount
  useEffect(() => {
    // Use currentNodeId from props if valid, otherwise use most recent completed
    const targetNodeId = currentNodeId !== undefined && currentNodeId >= 0 
      ? currentNodeId 
      : getFurthestCompletedNode();
    const node = questNodes.find(n => n.id === targetNodeId);
    if (node) {
      setPlayerPosition({ x: node.x, y: node.y });
      // Auto-scroll to player position (map is 4000px wide, viewport ~700px)
      const newScroll = Math.max(0, Math.min(3500, node.x - 350));
      setScrollPosition(newScroll);
    }
  }, [currentNodeId]); // Only run when currentNodeId changes, not on every completion

  // Generate a random mystery task
  const generateMysteryTask = useCallback(() => {
    const randomChallenge = mysteryChallengeTasks[Math.floor(Math.random() * mysteryChallengeTasks.length)];
    const difficultyXp = { EASY: 15, MEDIUM: 25, HARD: 40 };
    const newTask: MysteryTask = {
      id: `mystery-${Date.now()}`,
      title: randomChallenge.title,
      description: randomChallenge.description,
      category: randomChallenge.category,
      difficulty: randomChallenge.difficulty,
      xpReward: difficultyXp[randomChallenge.difficulty as keyof typeof difficultyXp] || 20,
      isCompleted: false,
    };
    return newTask;
  }, []);

  // Create particles effect
  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      color,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  }, []);

  const handleNodeClick = (node: QuestNode) => {
    // Check if node is unlocked
    if (!isNodeUnlocked(node.id)) return;
    
    // Check if this is a one-time quest that's already completed
    if (node.oneTime && allCompletedIds.has(node.id)) {
      setSelectedNode({ ...node, completed: true });
      return;
    }
    
    setSelectedNode(node);
    createParticles(node.x, node.y, isQuestCompleted(node) ? '#2d5a27' : '#c9a227');
    
    if (!isQuestCompleted(node) && onNodeClick) {
      onNodeClick(node);
    }
  };

  // Handle starting a mystery quest
  const handleStartMystery = () => {
    if (!selectedNode || selectedNode.type !== 'mystery') return;
    
    const newTask = generateMysteryTask();
    setCurrentMysteryTask(newTask);
    setShowMysteryModal(true);
    setMysteryTasks(prev => [...prev, newTask]);
    
    // Notify parent component
    if (onMysteryTask) {
      onMysteryTask(newTask);
    }
  };

  // Handle completing a quest node and moving player
  const handleCompleteQuestNode = (nodeId: number) => {
    const node = questNodes.find(n => n.id === nodeId);
    if (!node || allCompletedIds.has(nodeId)) return;
    
    // Mark as completed
    setCompletedQuestIds(prev => new Set([...prev, nodeId]));
    
    // Show reward animation
    setRewardAmount(node.reward);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);
    
    // Create celebration particles
    createParticles(node.x, node.y, '#c9a227');
    createParticles(node.x, node.y, '#2d5a27');
    
    // Move player to the completed node
    setIsMoving(true);
    setPlayerPosition({ x: node.x, y: node.y });
    setTimeout(() => setIsMoving(false), 700);
    
    // Notify parent
    if (onCompleteNode) {
      onCompleteNode(nodeId, node.reward);
    }
    if (onPlayerMove) {
      onPlayerMove(nodeId);
    }
    
    // Close the selection panel
    setSelectedNode(null);
  };

  // Handle completing a quest (one-time prevention) - legacy
  const handleCompleteQuest = (nodeId: number) => {
    const node = questNodes.find(n => n.id === nodeId);
    if (node?.oneTime) {
      setCompletedQuestIds(prev => new Set([...prev, nodeId]));
    }
  };

  // Mouse drag handlers for map panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start drag with left mouse button
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, scrollPos: scrollPosition });
    e.preventDefault();
  }, [scrollPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = dragStart.x - e.clientX;
    const newScrollPos = Math.max(0, Math.min(3500, dragStart.scrollPos + deltaX));
    setScrollPosition(newScrollPos);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse up listener for when mouse is released outside the container
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  return (
    <div className="quest-map-container relative">
      {/* Reward popup */}
      {showReward && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-br from-amber-900 to-amber-950 border-2 border-amber-500 rounded-lg p-6 text-center shadow-2xl">
            <StarIcon className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-spin" />
            <div className="text-3xl font-elden font-bold text-amber-300">+{rewardAmount} XP</div>
            <div className="text-sm text-amber-200/70 mt-1">Quest Complete!</div>
          </div>
        </div>
      )}

      {/* Map header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2" id="map">
        <h2 className="text-lg sm:text-xl font-elden font-bold text-[#c9a227] flex items-center gap-2">
          <ScrollIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          World Map
        </h2>
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <span className="text-[#8b8b7a]">Progress:</span>
          <span className="text-[#2d5a27] font-bold">
            {allCompletedIds.size}/{questNodes.length}
          </span>
        </div>
      </div>

      {/* Scroll controls */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button 
          className={`px-2 sm:px-3 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-[#d7ceb2] text-xs sm:text-sm rounded transition-colors ${scrollPosition <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setScrollPosition(prev => Math.max(0, prev - 400))}
          disabled={scrollPosition <= 0}
        >
          ← <span className="hidden sm:inline">West</span>
        </button>
        <button 
          className={`px-2 sm:px-3 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-[#d7ceb2] text-xs sm:text-sm rounded transition-colors ${scrollPosition >= 3500 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setScrollPosition(prev => Math.min(3500, prev + 400))}
          disabled={scrollPosition >= 3500}
        >
          <span className="hidden sm:inline">East</span> →
        </button>
        <button 
          className="px-2 sm:px-3 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-[#d7ceb2] text-xs sm:text-sm rounded transition-colors flex items-center gap-1"
          onClick={toggleFullscreen}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span className="hidden sm:inline">Fullscreen</span>
        </button>
        <span className="text-[10px] sm:text-xs text-[#8b8b7a] ml-auto self-center hidden md:block">Drag or use arrows to explore the realm</span>
      </div>

      {/* Map container with horizontal scroll */}
      <div 
        ref={mapContainerRef}
        className={`relative rounded border border-[#c9a227]/20 overflow-hidden select-none transition-all duration-300 touch-pan-x ${
          isFullscreen 
            ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-0' 
            : 'w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px]'
        }`}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          setIsDragging(true);
          setDragStart({ x: touch.clientX, scrollPos: scrollPosition });
        }}
        onTouchMove={(e) => {
          if (!isDragging) return;
          const touch = e.touches[0];
          const deltaX = dragStart.x - touch.clientX;
          const newScrollPos = Math.max(0, Math.min(3500, dragStart.scrollPos + deltaX));
          setScrollPosition(newScrollPos);
        }}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Fullscreen close button */}
        {isFullscreen && (
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 px-3 sm:px-4 py-2 bg-stone-900/90 hover:bg-stone-800 border border-[#c9a227]/50 text-[#c9a227] rounded-sm transition-colors flex items-center gap-2 text-sm"
            onClick={toggleFullscreen}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">Exit Fullscreen (Esc)</span>
          </button>
        )}
        
        {/* Scrollable inner container */}
        <div 
          className={`absolute inset-0 ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
          style={{ 
            width: '4000px',
            transform: `translateX(-${scrollPosition}px)`,
          }}
        >
          {/* Pixel art fantasy map background */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/pixel-art-fantasy-map-v0-z76b6jwd36se1.webp)',
              backgroundSize: isFullscreen ? 'contain' : 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat-x',
              width: '4000px',
              height: '100%',
            }}
          />
          
          {/* Dark overlay for better node visibility */}
          <div className="absolute inset-0 bg-black/30" />

        {/* Paths between nodes - Elden Ring golden paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c9a227" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b7119" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="graceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f4e4a6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#c9a227" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {questPaths.map((path, index) => {
            const fromNode = questNodes.find(n => n.id === path.from);
            const toNode = questNodes.find(n => n.id === path.to);
            if (!fromNode || !toNode) return null;
            
            const isCompleted = allCompletedIds.has(fromNode.id) && allCompletedIds.has(toNode.id);
            const isActive = allCompletedIds.has(fromNode.id) && !allCompletedIds.has(toNode.id) && isNodeUnlocked(toNode.id);
            const isLocked = !isNodeUnlocked(toNode.id);
            
            return (
              <g key={index}>
                {/* Path shadow */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Main path */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isCompleted ? '#2d5a27' : isActive ? 'url(#graceGradient)' : '#3d3d3d'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={isLocked ? '6 6' : 'none'}
                  filter={isActive ? 'url(#glow)' : 'none'}
                  className={isActive ? 'animate-pulse' : ''}
                />
              </g>
            );
          })}
        </svg>

        {/* Quest nodes */}
        {questNodes.map((node) => {
          const completed = allCompletedIds.has(node.id);
          const unlocked = isNodeUnlocked(node.id);
          const isLocked = !unlocked;
          
          return (
          <button
            key={node.id}
            className={`
              absolute z-10 transform -translate-x-1/2 -translate-y-1/2
              w-11 h-11 rounded-sm
              bg-gradient-to-br ${getNodeColor(node.type, completed, isLocked)}
              border-2 shadow-lg
              flex items-center justify-center
              transition-all duration-300
              ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110 hover:shadow-xl'}
              ${selectedNode?.id === node.id ? 'ring-2 ring-[#f4e4a6] ring-offset-2 ring-offset-stone-900 scale-110' : ''}
              ${!isLocked && !completed ? 'animate-pulse-subtle' : ''}
            `}
            style={{ 
              left: node.x, 
              top: node.y,
              boxShadow: isLocked 
                ? 'none' 
                : completed 
                  ? '0 0 12px 2px rgba(45, 90, 39, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
                  : '0 0 15px 3px rgba(201, 162, 39, 0.4), inset 0 1px 1px rgba(255,255,255,0.15)'
            }}
            onClick={() => handleNodeClick(node)}
            disabled={isLocked}
          >
            {/* Inner gradient overlay for depth */}
            <div className="absolute inset-0 rounded-sm bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none" />
            <NodeIcon type={node.type} completed={completed} />
            
            {/* Completion checkmark - Grace marker style */}
            {completed && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-800 rounded-sm flex items-center justify-center border border-emerald-600">
                <svg className="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {/* One-time badge */}
            {node.oneTime && !completed && !isLocked && (
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-700 rounded-sm flex items-center justify-center border border-amber-500 text-[8px] font-bold text-amber-200">
                1
              </div>
            )}
            
            {/* Lock icon */}
            {isLocked && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-stone-700 rounded-sm flex items-center justify-center border border-stone-500">
                <svg className="w-3 h-3 text-stone-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {/* Reward badge - XP style */}
            {!isLocked && node.reward > 0 && !completed && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-stone-800 text-[#c9a227] text-[9px] font-bold rounded-sm border border-[#c9a227]/40 whitespace-nowrap">
                +{node.reward}
              </div>
            )}
          </button>
          );
        })}

        {/* Player sprite */}
        <PlayerSprite x={playerPosition.x} y={playerPosition.y} isMoving={isMoving} />

        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-particle pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              boxShadow: `0 0 6px ${particle.color}`,
            }}
          />
        ))}

        {/* Map legend - RPG style - hidden on mobile */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 hidden sm:flex flex-wrap gap-1 sm:gap-2 text-[8px] sm:text-[9px]">
          {[
            { type: 'battle', label: 'Battle', color: 'bg-red-800' },
            { type: 'treasure', label: 'Treasure', color: 'bg-yellow-700' },
            { type: 'rest', label: 'Rest', color: 'bg-blue-800' },
            { type: 'boss', label: 'Boss', color: 'bg-purple-800' },
            { type: 'mystery', label: 'Mystery', color: 'bg-violet-800' },
            { type: 'checkpoint', label: 'Checkpoint', color: 'bg-cyan-800' },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 bg-stone-900/90 rounded-sm border border-stone-700">
              <div className={`w-2 h-2 rounded-sm ${item.color}`} />
              <span className="text-[#8b8b7a]">{item.label}</span>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Selected node info - RPG style panel */}
      {selectedNode && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-br from-stone-900/95 to-stone-950/95 border border-[#c9a227]/20 rounded animate-scale-in">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className={`p-2 sm:p-3 rounded bg-gradient-to-br ${getNodeColor(selectedNode.type, allCompletedIds.has(selectedNode.id), !isNodeUnlocked(selectedNode.id))} self-start`}>
              <NodeIcon type={selectedNode.type} completed={allCompletedIds.has(selectedNode.id)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-elden font-bold text-[#c9a227] text-base sm:text-lg">{selectedNode.title}</h3>
                {selectedNode.reward > 0 && !allCompletedIds.has(selectedNode.id) && (
                  <div className="text-right shrink-0 sm:hidden">
                    <div className="text-sm font-elden font-bold text-[#c9a227] flex items-center gap-1">
                      <StarIcon className="w-4 h-4" />
                      +{selectedNode.reward}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#8b8b7a] mt-1">{selectedNode.description}</p>
              {selectedNode.oneTime && !allCompletedIds.has(selectedNode.id) && (
                <span className="inline-flex items-center gap-1 mt-2 text-[10px] sm:text-xs text-amber-500 bg-amber-900/30 px-2 py-0.5 rounded-sm">
                  ⚠ One-time quest
                </span>
              )}
              {allCompletedIds.has(selectedNode.id) ? (
                <span className="inline-flex items-center gap-1 mt-2 text-xs sm:text-sm text-emerald-500">
                  <TrophyIcon className="w-4 h-4" /> Completed
                </span>
              ) : isNodeUnlocked(selectedNode.id) && (
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  {selectedNode.type === 'mystery' ? (
                    <button 
                      className="px-3 sm:px-4 py-2 bg-gradient-to-r from-violet-900 to-violet-800 hover:from-violet-800 hover:to-violet-700 text-violet-200 font-elden text-xs sm:text-sm rounded-sm border border-violet-600 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                      onClick={handleStartMystery}
                    >
                      <SparklesIcon className="w-4 h-4" />
                      Accept Challenge
                    </button>
                  ) : (
                    <button 
                      className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-emerald-200 font-elden text-xs sm:text-sm rounded-sm border border-emerald-600 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                      onClick={() => handleCompleteQuestNode(selectedNode.id)}
                    >
                      <TrophyIcon className="w-4 h-4" />
                      Complete (+{selectedNode.reward} XP)
                    </button>
                  )}
                </div>
              )}
            </div>
            {selectedNode.reward > 0 && !allCompletedIds.has(selectedNode.id) && (
              <div className="text-right hidden sm:block">
                <div className="text-xs text-[#8b8b7a]">XP Reward</div>
                <div className="text-xl font-elden font-bold text-[#c9a227] flex items-center gap-1">
                  <StarIcon className="w-5 h-5" />
                  {selectedNode.reward}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mystery Task Modal */}
      {showMysteryModal && currentMysteryTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowMysteryModal(false)}>
          <div 
            className="bg-gradient-to-br from-stone-900 to-stone-950 border-2 border-violet-600 rounded p-6 max-w-md w-full animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-violet-900/50 rounded-sm border border-violet-600">
                <SparklesIcon className="w-8 h-8 text-violet-400" />
              </div>
              <div>
                <h3 className="font-elden text-xl text-violet-300">Mystery Challenge!</h3>
                <p className="text-sm text-[#8b8b7a]">A random trial has been bestowed upon you</p>
              </div>
            </div>
            
            <div className="bg-stone-800/50 rounded-sm p-4 mb-4 border border-stone-600">
              <h4 className="font-elden text-lg text-[#c9a227] mb-2">{currentMysteryTask.title}</h4>
              <p className="text-[#d7ceb2] text-sm mb-3">{currentMysteryTask.description}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2 py-1 bg-stone-700 rounded-sm text-[#8b8b7a]">
                  {currentMysteryTask.category}
                </span>
                <span className={`px-2 py-1 rounded-sm ${
                  currentMysteryTask.difficulty === 'HARD' ? 'bg-red-900/50 text-red-300' :
                  currentMysteryTask.difficulty === 'MEDIUM' ? 'bg-amber-900/50 text-amber-300' :
                  'bg-emerald-900/50 text-emerald-300'
                }`}>
                  {currentMysteryTask.difficulty}
                </span>
                <span className="ml-auto text-[#c9a227] font-bold">
                  +{currentMysteryTask.xpReward} XP
                </span>
              </div>
            </div>
            
            <p className="text-xs text-[#8b8b7a] mb-4 italic">
              This challenge has been added to your quest log. Complete it to earn XP!
            </p>
            
            <button 
              className="w-full py-3 bg-gradient-to-r from-violet-800 to-violet-700 hover:from-violet-700 hover:to-violet-600 text-violet-100 font-elden rounded-sm border border-violet-500 transition-all"
              onClick={() => setShowMysteryModal(false)}
            >
              Accept Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
