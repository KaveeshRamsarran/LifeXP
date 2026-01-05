'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import api from '@/lib/api';
import dynamic from 'next/dynamic';
import { 
  FlameIcon, 
  LightningIcon, 
  CrownIcon, 
  BrainIcon, 
  MuscleIcon, 
  TargetIcon, 
  CoinIcon,
  CheckmarkIcon,
  PlusIcon,
  ScrollIcon,
  StarIcon,
  SparklesIcon,
  TrophyIcon,
  SwordIcon,
  ShieldIcon
} from './icons/GameIcons';

// Mystery task interface
interface MysteryTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xpReward: number;
  isCompleted: boolean;
}

// Dynamically import QuestMap to avoid SSR issues
const QuestMap = dynamic(() => import('./QuestMap'), { ssr: false });

// XP Popup component for floating +XP animations
function XpPopup({ xp, id, onComplete }: { xp: number; id: string; onComplete: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(id), 1500);
    return () => clearTimeout(timer);
  }, [id, onComplete]);
  
  return (
    <div className="xp-popup">
      +{xp} XP
    </div>
  );
}

// Level Up Celebration overlay - Mixed RPG style
function LevelUpCelebration({ level, onClose }: { level: number; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Random RPG messages
  const levelUpMessages = [
    { title: 'LEVEL UP!', subtitle: 'Your power grows stronger' },
    { title: 'GREAT RUNE RESTORED', subtitle: 'Touch grace to continue' },
    { title: 'VICTORY ACHIEVED', subtitle: 'A new horizon awaits' },
    { title: 'SKILL UNLOCKED', subtitle: 'The Warrior within awakens' },
    { title: 'POWER INCREASED', subtitle: 'Your legend grows' },
  ];
  const message = levelUpMessages[level % levelUpMessages.length];

  return (
    <div className="level-up-overlay" onClick={onClose}>
      <div className="level-up-content">
        <CrownIcon className="w-20 h-20 text-[#f4e4a6] animate-bounce-in" />
        <h2 className="text-4xl font-elden font-bold text-[#f4e4a6] mt-4">{message.title}</h2>
        <p className="text-2xl text-[#c9a227] mt-2">Level {level}</p>
        <div className="mt-4 text-[#8b8b7a]">{message.subtitle}</div>
      </div>
    </div>
  );
}

// Stat icon mapping
const statIcons: Record<string, React.ReactNode> = {
  INTELLIGENCE: <BrainIcon className="w-5 h-5" />,
  STRENGTH: <MuscleIcon className="w-5 h-5" />,
  DISCIPLINE: <TargetIcon className="w-5 h-5" />,
  WEALTH: <CoinIcon className="w-5 h-5" />,
};

// Difficulty XP values
const difficultyXp: Record<string, number> = {
  EASY: 10,
  MEDIUM: 20,
  HARD: 35,
};

export default function Dashboard() {
  const { user, updateUserStats } = useAuthStore();
  const { 
    tasks, quests, mysteryTasks, fetchData, completeTask, completeQuest, addMysteryTask, completeMysteryTask,
    currentMapNode, completedMapNodes, playerGender, completeMapNode, setCurrentMapNode, setPlayerGender
  } = useGameStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [xpPopups, setXpPopups] = useState<Array<{ id: string; xp: number; x: number; y: number }>>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(1);
  const previousLevelRef = useRef(user?.level || 1);

  useEffect(() => {
    fetchData();
  }, []);

  // Check for level up
  useEffect(() => {
    if (user && user.level > previousLevelRef.current) {
      setCelebrationLevel(user.level);
      setShowLevelUp(true);
      previousLevelRef.current = user.level;
    }
  }, [user?.level]);

  const removeXpPopup = useCallback((id: string) => {
    setXpPopups(prev => prev.filter(p => p.id !== id));
  }, []);

  const showXpGain = useCallback((xp: number, event?: React.MouseEvent) => {
    const id = Math.random().toString(36).substr(2, 9);
    const x = event?.clientX || window.innerWidth / 2;
    const y = event?.clientY || window.innerHeight / 2;
    setXpPopups(prev => [...prev, { id, xp, x, y }]);
  }, []);

  const handleCompleteTask = async (taskId: string, xp: number, category: string, event: React.MouseEvent) => {
    // Show XP popup immediately (optimistic)
    showXpGain(xp, event);
    
    // Optimistically update XP in UI
    if (user) {
      updateUserStats({ xp: user.xp + xp });
    }
    
    // Actually complete the task
    await completeTask(taskId, xp);
  };

  const handleCompleteQuest = async (questId: string, xp: number, event: React.MouseEvent) => {
    showXpGain(xp, event);
    
    if (user) {
      updateUserStats({ xp: user.xp + xp });
    }
    
    await completeQuest(questId);
  };

  // Handle mystery task from QuestMap
  const handleMysteryTask = useCallback((task: MysteryTask) => {
    addMysteryTask(task);
  }, [addMysteryTask]);

  // Handle completing a map node/quest
  const handleCompleteMapNode = useCallback((nodeId: number, xpReward: number) => {
    completeMapNode(nodeId);
    if (user) {
      updateUserStats({ xp: user.xp + xpReward });
    }
  }, [completeMapNode, user, updateUserStats]);

  // Handle player moving on map
  const handlePlayerMove = useCallback((nodeId: number) => {
    setCurrentMapNode(nodeId);
  }, [setCurrentMapNode]);

  // Handle gender change
  const handleGenderChange = useCallback((gender: 'male' | 'female') => {
    setPlayerGender(gender);
  }, [setPlayerGender]);

  // Handle completing a mystery task
  const handleCompleteMysteryTask = async (taskId: string, xp: number, event: React.MouseEvent) => {
    showXpGain(xp, event);
    
    if (user) {
      updateUserStats({ xp: user.xp + xp });
    }
    
    completeMysteryTask(taskId);
  };

  if (!user) return null;

  // XP Calculation for Bar
  let xpAtStartOfLevel = 0;
  for (let i = 1; i < user.level; i++) {
    xpAtStartOfLevel += (100 + (i - 1) * 35);
  }
  const xpForNextLevel = 100 + (user.level - 1) * 35;
  const currentLevelXp = user.xp - xpAtStartOfLevel;
  const progress = Math.min(100, Math.max(0, (currentLevelXp / xpForNextLevel) * 100));

  return (
    <div className="space-y-8 relative">
      {/* XP Popups */}
      {xpPopups.map(popup => (
        <div 
          key={popup.id} 
          className="fixed z-50 pointer-events-none"
          style={{ left: popup.x - 30, top: popup.y - 20 }}
        >
          <XpPopup xp={popup.xp} id={popup.id} onComplete={removeXpPopup} />
        </div>
      ))}

      {/* Level Up Celebration */}
      {showLevelUp && (
        <LevelUpCelebration 
          level={celebrationLevel} 
          onClose={() => setShowLevelUp(false)} 
        />
      )}

      {/* Hero Stats Card - Elden Ring style */}
      <div className="fantasy-card p-6 animate-scale-in">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Level Badge - Site of Grace style */}
          <div className="level-badge">
            <CrownIcon className="w-6 h-6 text-[#f4e4a6] mb-1" />
            <span className="text-2xl font-bold text-[#f4e4a6]">{user.level}</span>
          </div>

          {/* XP Bar Section */}
          <div className="flex-1 w-full">
            <div className="flex justify-between mb-2 items-center">
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-[#f4e4a6]" />
                <span className="font-elden font-bold text-lg text-[#d7ceb2]">Level {user.level} Adventurer</span>
              </div>
              <span className="text-[#c9a227] font-medium">{Math.floor(currentLevelXp)} / {xpForNextLevel} XP</span>
            </div>
            <div className="xp-bar">
              <div 
                className="xp-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid - Elden Ring attributes */}
          <div className="grid grid-cols-4 gap-3 w-full md:w-auto">
            <div className="stat-card stat-card-intelligence">
              <BrainIcon className="w-6 h-6 mb-1 text-[#4a6a8a]" />
              <div className="text-xs text-[#8b8b7a]">INT</div>
              <div className="font-bold text-lg text-[#d7ceb2]">{user.statIntelligence.toFixed(1)}</div>
            </div>
            <div className="stat-card stat-card-strength">
              <MuscleIcon className="w-6 h-6 mb-1 text-[#8b5a5a]" />
              <div className="text-xs text-[#8b8b7a]">STR</div>
              <div className="font-bold text-lg text-[#d7ceb2]">{user.statStrength.toFixed(1)}</div>
            </div>
            <div className="stat-card stat-card-discipline">
              <TargetIcon className="w-6 h-6 mb-1 text-[#6b5b7c]" />
              <div className="text-xs text-[#8b8b7a]">END</div>
              <div className="font-bold text-lg text-[#d7ceb2]">{user.statDiscipline.toFixed(1)}</div>
            </div>
            <div className="stat-card stat-card-wealth">
              <CoinIcon className="w-6 h-6 mb-1 text-[#a08a4a]" />
              <div className="text-xs text-[#8b8b7a]">ARC</div>
              <div className="font-bold text-lg text-[#d7ceb2]">{user.statWealth.toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Quests - Elden Ring style */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-elden font-bold flex items-center gap-2 text-[#c9a227]">
            <LightningIcon className="w-6 h-6 text-[#8b4513]" />
            Daily Trials
          </h2>
          {quests.length === 0 ? (
            <div className="fantasy-card p-6 text-center">
              <ScrollIcon className="w-12 h-12 mx-auto mb-3 text-[#8b8b7a] opacity-50" />
              <p className="text-[#8b8b7a]">No trials available today</p>
            </div>
          ) : (
            quests.map((quest, index) => {
              const questXp = difficultyXp[quest.difficulty] || 15;
              return (
                <div 
                  key={quest.id} 
                  className={`quest-card ${quest.isCompleted ? 'opacity-60' : ''}`}
                  style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-sm ${quest.isCompleted ? 'bg-emerald-900/30' : 'bg-amber-900/30'}`}>
                      {quest.isCompleted ? (
                        <TrophyIcon className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <ScrollIcon className="w-6 h-6 text-[#8b4513]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#d7ceb2]">{quest.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`category-badge category-${quest.category.toLowerCase()}`}>
                          {quest.category}
                        </span>
                        <span className={`difficulty-badge difficulty-${quest.difficulty.toLowerCase()}`}>
                          {quest.difficulty}
                        </span>
                        <span className="text-xs text-[#c9a227] flex items-center gap-1">
                          <StarIcon className="w-3 h-3" /> +{questXp}
                        </span>
                      </div>
                    </div>
                    {!quest.isCompleted ? (
                      <button 
                        className="complete-btn"
                        onClick={(e) => handleCompleteQuest(quest.id, questXp, e)}
                      >
                        <CheckmarkIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="p-2 bg-emerald-900/30 rounded-sm">
                        <CheckmarkIcon className="w-5 h-5 text-emerald-500" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Tasks & Habits - Elden Ring style */}
        <div className="lg:col-span-2 space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-elden font-bold flex items-center gap-2 text-[#c9a227]">
              <SparklesIcon className="w-6 h-6 text-[#6b5b7c]" />
              Quests & Habits
            </h2>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-amber-900 to-amber-800 hover:from-amber-800 hover:to-amber-700 text-amber-200 font-elden text-sm rounded-sm border border-amber-600 transition-all flex items-center gap-2"
              onClick={() => setIsCreateOpen(!isCreateOpen)}
            >
              <PlusIcon className="w-4 h-4" /> New Quest
            </button>
          </div>

          {isCreateOpen && <CreateTaskForm onClose={() => setIsCreateOpen(false)} />}

          <div className="grid gap-4">
            {tasks.map((task, index) => {
              const taskXp = difficultyXp[task.difficulty] || 15;
              return (
                <div 
                  key={task.id} 
                  className="task-card"
                  style={{ animationDelay: `${0.25 + index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-sm bg-stone-800/50 border border-stone-600`}>
                      {statIcons[task.category] || <TargetIcon className="w-6 h-6 text-[#8b8b7a]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#d7ceb2]">{task.title}</span>
                        {task.isHabit && task.streakCurrent > 0 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-900/30 rounded-sm text-xs text-red-300 border border-red-800/40">
                            <FlameIcon className="w-3 h-3" />
                            <span>{task.streakCurrent}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`category-badge category-${task.category.toLowerCase()}`}>
                          {task.category}
                        </span>
                        <span className={`difficulty-badge difficulty-${task.difficulty.toLowerCase()}`}>
                          {task.difficulty}
                        </span>
                        <span className="text-xs text-[#8b8b7a]">
                          {task.isHabit ? '🔄 Habit' : '⚔ One-time'}
                        </span>
                        <span className="text-xs text-[#c9a227] flex items-center gap-1 ml-auto">
                          <StarIcon className="w-3 h-3" /> +{taskXp}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="px-4 py-2 bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-emerald-200 text-sm rounded-sm border border-emerald-700 transition-all"
                      onClick={(e) => handleCompleteTask(task.id, taskXp, task.category, e)}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              );
            })}
            {tasks.length === 0 && (
              <div className="fantasy-card p-8 text-center">
                <ScrollIcon className="w-16 h-16 mx-auto mb-4 text-[#8b8b7a] opacity-30" />
                <p className="text-lg text-[#8b8b7a] mb-2">Your quest log awaits</p>
                <p className="text-sm text-[#8b8b7a] opacity-70">Create a quest to begin your journey, Adventurer</p>
              </div>
            )}
          </div>

          {/* Mystery Challenges Section */}
          {mysteryTasks.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-elden font-bold flex items-center gap-2 text-[#6b5b7c]">
                <ShieldIcon className="w-5 h-5" />
                Mystery Challenges
              </h3>
              <div className="grid gap-3">
                {mysteryTasks.filter(t => !t.isCompleted).map((task, index) => (
                  <div 
                    key={task.id} 
                    className="task-card border-[#6b5b7c]/40 bg-gradient-to-r from-stone-900 to-purple-950/30"
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-sm bg-purple-900/40 border border-purple-700/40">
                        <SparklesIcon className="w-6 h-6 text-[#9b7bb8]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#d7ceb2]">{task.title}</span>
                          <span className="px-2 py-0.5 bg-purple-900/30 rounded-sm text-xs text-purple-300 border border-purple-800/40">
                            Mystery
                          </span>
                        </div>
                        <p className="text-xs text-[#8b8b7a] mt-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`category-badge category-${task.category.toLowerCase()}`}>
                            {task.category}
                          </span>
                          <span className={`difficulty-badge difficulty-${task.difficulty.toLowerCase()}`}>
                            {task.difficulty}
                          </span>
                          <span className="text-xs text-[#c9a227] flex items-center gap-1 ml-auto">
                            <StarIcon className="w-3 h-3" /> +{task.xpReward}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="px-4 py-2 bg-gradient-to-r from-purple-900 to-purple-800 hover:from-purple-800 hover:to-purple-700 text-purple-200 text-sm rounded-sm border border-purple-700 transition-all"
                        onClick={(e) => handleCompleteMysteryTask(task.id, task.xpReward, e)}
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quest Journey Map Section */}
      <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <QuestMap 
          currentNodeId={currentMapNode} 
          completedNodeIds={completedMapNodes}
          playerGender={playerGender}
          onMysteryTask={handleMysteryTask}
          onCompleteNode={handleCompleteMapNode}
          onPlayerMove={handlePlayerMove}
          onGenderChange={handleGenderChange}
        />
      </div>

      {/* Achievement Section - Mixed RPG style */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }} id="achievements">
        <div className="fantasy-card p-4 hover:border-[#c9a227]/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-sm bg-amber-900/30 border border-amber-700/40">
              <TrophyIcon className="w-8 h-8 text-[#c9a227]" />
            </div>
            <div>
              <h3 className="font-elden font-bold text-[#c9a227]">Achievements</h3>
              <p className="text-sm text-[#8b8b7a]">3/12 Unlocked</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {['🏆', '⭐', '🔥'].map((emoji, i) => (
              <span key={i} className="text-2xl">{emoji}</span>
            ))}
            <span className="text-2xl opacity-30">🎯</span>
            <span className="text-2xl opacity-30">💎</span>
          </div>
        </div>

        <div className="fantasy-card p-4 hover:border-[#8b4513]/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-sm bg-red-900/30 border border-red-800/40">
              <FlameIcon className="w-8 h-8 text-[#a0522d]" />
            </div>
            <div>
              <h3 className="font-elden font-bold text-[#a0522d]">Daily Streak</h3>
              <p className="text-sm text-[#8b8b7a]">Keep the flame alive</p>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-elden font-bold text-[#a0522d]">7</span>
            <span className="text-[#8b8b7a]">days</span>
            <FlameIcon className="w-6 h-6 text-[#a0522d] ml-auto animate-pulse" />
          </div>
        </div>

        <div className="fantasy-card p-4 hover:border-[#6b5b7c]/40 transition-colors" id="stats">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-sm bg-purple-900/30 border border-purple-800/40">
              <SwordIcon className="w-8 h-8 text-[#6b5b7c]" />
            </div>
            <div>
              <h3 className="font-elden font-bold text-[#6b5b7c]">Power Level</h3>
              <p className="text-sm text-[#8b8b7a]">Your overall strength</p>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-elden font-bold text-[#6b5b7c]">
              {Math.round((user.statIntelligence + user.statStrength + user.statDiscipline + user.statWealth) * 10)}
            </span>
            <span className="text-[#8b8b7a]">PWR</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateTaskForm({ onClose }: { onClose: () => void }) {
  const { fetchData } = useGameStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('INTELLIGENCE');
  const [difficulty, setDifficulty] = useState('EASY');
  const [isHabit, setIsHabit] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/tasks', {
      title,
      category,
      difficulty,
      isHabit,
      estimatedMinutes: 15,
    });
    await fetchData();
    onClose();
  };

  return (
    <div className="fantasy-card p-6 animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <ScrollIcon className="w-5 h-5 text-[#c9a227]" />
        <h3 className="font-elden font-bold text-[#c9a227]">Inscribe New Quest</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            className="w-full px-4 py-3 bg-stone-800/80 border border-stone-600 rounded-sm text-[#d7ceb2] placeholder-stone-500 focus:border-[#c9a227] focus:outline-none transition-colors"
            placeholder="Quest inscription..."
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select 
            className="flex-1 min-w-[140px] px-3 py-2 bg-stone-800/80 border border-stone-600 rounded-sm text-[#d7ceb2] focus:border-[#c9a227] focus:outline-none"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="INTELLIGENCE">🧠 Intelligence</option>
            <option value="STRENGTH">💪 Strength</option>
            <option value="DISCIPLINE">🎯 Endurance</option>
            <option value="WEALTH">💰 Arcane</option>
          </select>
          <select 
            className="flex-1 min-w-[120px] px-3 py-2 bg-stone-800/80 border border-stone-600 rounded-sm text-[#d7ceb2] focus:border-[#c9a227] focus:outline-none"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            <option value="EASY">⭐ Easy (+10)</option>
            <option value="MEDIUM">⭐⭐ Medium (+20)</option>
            <option value="HARD">⭐⭐⭐ Hard (+35)</option>
          </select>
        </div>
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-sm bg-stone-800/50 hover:bg-stone-800/70 border border-stone-600 transition-colors">
          <input 
            type="checkbox" 
            className="w-5 h-5 accent-[#c9a227]"
            checked={isHabit} 
            onChange={e => setIsHabit(e.target.checked)} 
          />
          <div className="flex items-center gap-2">
            <FlameIcon className="w-5 h-5 text-[#8b4513]" />
            <span className="text-sm text-[#d7ceb2]">Recurring ritual</span>
          </div>
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            className="px-4 py-2 rounded-sm text-[#8b8b7a] hover:text-[#d7ceb2] hover:bg-stone-800/50 transition-all"
            onClick={onClose}
          >
            Abandon
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-gradient-to-r from-amber-900 to-amber-800 hover:from-amber-800 hover:to-amber-700 text-amber-200 font-elden rounded-sm border border-amber-600 transition-all flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Inscribe
          </button>
        </div>
      </form>
    </div>
  );
}
