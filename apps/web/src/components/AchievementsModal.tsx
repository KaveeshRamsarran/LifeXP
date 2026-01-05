'use client';
import { TrophyIcon, StarIcon, FlameIcon, CrownIcon, SwordIcon, ShieldIcon, ScrollIcon, LightningIcon } from './icons/GameIcons';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

const rarityColors = {
  common: 'from-stone-600 to-stone-700 border-stone-500',
  uncommon: 'from-emerald-800 to-emerald-900 border-emerald-600',
  rare: 'from-blue-800 to-blue-900 border-blue-600',
  epic: 'from-purple-800 to-purple-900 border-purple-600',
  legendary: 'from-amber-700 to-amber-800 border-amber-500',
};

const rarityGlow = {
  common: '',
  uncommon: 'shadow-emerald-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-amber-500/50 animate-pulse',
};

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLevel: number;
  userXp: number;
  totalTasksCompleted?: number;
  currentStreak?: number;
}

export default function AchievementsModal({ 
  isOpen, 
  onClose, 
  userLevel,
  userXp,
  totalTasksCompleted = 0,
  currentStreak = 0,
}: AchievementsModalProps) {
  if (!isOpen) return null;

  const achievements: Achievement[] = [
    // Beginner achievements
    { 
      id: '1', 
      name: 'First Steps', 
      description: 'Complete your first task', 
      icon: <StarIcon className="w-6 h-6" />,
      unlocked: totalTasksCompleted >= 1,
      rarity: 'common',
    },
    { 
      id: '2', 
      name: 'Getting Started', 
      description: 'Reach Level 2', 
      icon: <CrownIcon className="w-6 h-6" />,
      unlocked: userLevel >= 2,
      rarity: 'common',
    },
    { 
      id: '3', 
      name: 'Flame Keeper', 
      description: 'Maintain a 3-day streak', 
      icon: <FlameIcon className="w-6 h-6" />,
      unlocked: currentStreak >= 3,
      progress: Math.min(currentStreak, 3),
      maxProgress: 3,
      rarity: 'common',
    },
    // Uncommon achievements
    { 
      id: '4', 
      name: 'Task Warrior', 
      description: 'Complete 10 tasks', 
      icon: <SwordIcon className="w-6 h-6" />,
      unlocked: totalTasksCompleted >= 10,
      progress: Math.min(totalTasksCompleted, 10),
      maxProgress: 10,
      rarity: 'uncommon',
    },
    { 
      id: '5', 
      name: 'XP Hunter', 
      description: 'Earn 500 XP total', 
      icon: <StarIcon className="w-6 h-6" />,
      unlocked: userXp >= 500,
      progress: Math.min(userXp, 500),
      maxProgress: 500,
      rarity: 'uncommon',
    },
    { 
      id: '6', 
      name: 'Week Warrior', 
      description: 'Maintain a 7-day streak', 
      icon: <FlameIcon className="w-6 h-6" />,
      unlocked: currentStreak >= 7,
      progress: Math.min(currentStreak, 7),
      maxProgress: 7,
      rarity: 'uncommon',
    },
    // Rare achievements
    { 
      id: '7', 
      name: 'Rising Champion', 
      description: 'Reach Level 5', 
      icon: <CrownIcon className="w-6 h-6" />,
      unlocked: userLevel >= 5,
      rarity: 'rare',
    },
    { 
      id: '8', 
      name: 'Centurion', 
      description: 'Complete 100 tasks', 
      icon: <ShieldIcon className="w-6 h-6" />,
      unlocked: totalTasksCompleted >= 100,
      progress: Math.min(totalTasksCompleted, 100),
      maxProgress: 100,
      rarity: 'rare',
    },
    { 
      id: '9', 
      name: 'XP Collector', 
      description: 'Earn 2000 XP total', 
      icon: <StarIcon className="w-6 h-6" />,
      unlocked: userXp >= 2000,
      progress: Math.min(userXp, 2000),
      maxProgress: 2000,
      rarity: 'rare',
    },
    // Epic achievements
    { 
      id: '10', 
      name: 'Elite Warrior', 
      description: 'Reach Level 10', 
      icon: <SwordIcon className="w-6 h-6" />,
      unlocked: userLevel >= 10,
      rarity: 'epic',
    },
    { 
      id: '11', 
      name: 'Month Master', 
      description: 'Maintain a 30-day streak', 
      icon: <FlameIcon className="w-6 h-6" />,
      unlocked: currentStreak >= 30,
      progress: Math.min(currentStreak, 30),
      maxProgress: 30,
      rarity: 'epic',
    },
    { 
      id: '12', 
      name: 'Loremaster', 
      description: 'Earn 10,000 XP total', 
      icon: <ScrollIcon className="w-6 h-6" />,
      unlocked: userXp >= 10000,
      progress: Math.min(userXp, 10000),
      maxProgress: 10000,
      rarity: 'epic',
    },
    // Legendary achievements
    { 
      id: '13', 
      name: 'Elden Lord', 
      description: 'Reach Level 25', 
      icon: <CrownIcon className="w-6 h-6" />,
      unlocked: userLevel >= 25,
      rarity: 'legendary',
    },
    { 
      id: '14', 
      name: 'Year Champion', 
      description: 'Maintain a 365-day streak', 
      icon: <FlameIcon className="w-6 h-6" />,
      unlocked: currentStreak >= 365,
      progress: Math.min(currentStreak, 365),
      maxProgress: 365,
      rarity: 'legendary',
    },
    { 
      id: '15', 
      name: 'Thousand Victories', 
      description: 'Complete 1000 tasks', 
      icon: <LightningIcon className="w-6 h-6" />,
      unlocked: totalTasksCompleted >= 1000,
      progress: Math.min(totalTasksCompleted, 1000),
      maxProgress: 1000,
      rarity: 'legendary',
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-stone-900 to-stone-950 border-2 border-[#c9a227]/30 rounded-lg shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-stone-900 to-transparent p-6 border-b border-[#c9a227]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-900/40 rounded-lg border border-amber-700/50">
                <TrophyIcon className="w-8 h-8 text-[#c9a227]" />
              </div>
              <div>
                <h2 className="text-2xl font-elden font-bold text-[#c9a227]">Achievements</h2>
                <p className="text-sm text-[#8b8b7a]">{unlockedCount}/{achievements.length} Unlocked</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#8b8b7a] hover:text-[#d7ceb2] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-stone-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-lg border-2 bg-gradient-to-br ${rarityColors[achievement.rarity]} 
                  ${achievement.unlocked ? `shadow-lg ${rarityGlow[achievement.rarity]}` : 'opacity-60 grayscale'}
                  transition-all duration-300 hover:scale-[1.02]`}
              >
                {/* Rarity indicator */}
                <div className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold uppercase rounded bg-stone-900/90 border border-current"
                  style={{ 
                    color: achievement.rarity === 'legendary' ? '#f59e0b' : 
                           achievement.rarity === 'epic' ? '#a855f7' :
                           achievement.rarity === 'rare' ? '#3b82f6' :
                           achievement.rarity === 'uncommon' ? '#10b981' : '#78716c'
                  }}
                >
                  {achievement.rarity}
                </div>

                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded ${achievement.unlocked ? 'text-white' : 'text-stone-500'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-elden font-bold ${achievement.unlocked ? 'text-white' : 'text-stone-400'}`}>
                      {achievement.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">{achievement.description}</p>
                    
                    {/* Progress bar for in-progress achievements */}
                    {achievement.maxProgress && !achievement.unlocked && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                            style={{ width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {achievement.progress || 0}/{achievement.maxProgress}
                        </p>
                      </div>
                    )}
                    
                    {achievement.unlocked && (
                      <div className="mt-2 flex items-center gap-1 text-emerald-400 text-xs">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Unlocked!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
