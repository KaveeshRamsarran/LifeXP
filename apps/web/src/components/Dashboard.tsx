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
  SwordIcon
} from './icons/GameIcons';

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

// Level Up Celebration overlay
function LevelUpCelebration({ level, onClose }: { level: number; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="level-up-overlay" onClick={onClose}>
      <div className="level-up-content">
        <CrownIcon className="w-20 h-20 text-gold animate-bounce-in" />
        <h2 className="text-4xl font-cinzel font-bold text-gold mt-4">LEVEL UP!</h2>
        <p className="text-2xl text-gold-light mt-2">Level {level}</p>
        <div className="mt-4 text-muted">Click to continue your adventure</div>
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
  const { tasks, quests, fetchData, completeTask, completeQuest } = useGameStore();
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

      {/* Hero Stats Card */}
      <div className="fantasy-card p-6 animate-scale-in">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Level Badge */}
          <div className="level-badge">
            <CrownIcon className="w-6 h-6 text-gold mb-1" />
            <span className="text-2xl font-bold text-gold">{user.level}</span>
          </div>

          {/* XP Bar Section */}
          <div className="flex-1 w-full">
            <div className="flex justify-between mb-2 items-center">
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-gold" />
                <span className="font-bold text-lg text-gold">Level {user.level} Adventurer</span>
              </div>
              <span className="text-gold-light font-medium">{Math.floor(currentLevelXp)} / {xpForNextLevel} XP</span>
            </div>
            <div className="xp-bar">
              <div 
                className="xp-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 w-full md:w-auto">
            <div className="stat-card stat-card-intelligence">
              <BrainIcon className="w-6 h-6 mb-1" />
              <div className="text-xs opacity-70">INT</div>
              <div className="font-bold text-lg">{user.statIntelligence.toFixed(1)}</div>
            </div>
            <div className="stat-card stat-card-strength">
              <MuscleIcon className="w-6 h-6 mb-1" />
              <div className="text-xs opacity-70">STR</div>
              <div className="font-bold text-lg">{user.statStrength.toFixed(1)}</div>
            </div>
            <div className="stat-card stat-card-discipline">
              <TargetIcon className="w-6 h-6 mb-1" />
              <div className="text-xs opacity-70">DIS</div>
              <div className="font-bold text-lg">{user.statDiscipline.toFixed(1)}</div>
            </div>
            <div className="stat-card stat-card-wealth">
              <CoinIcon className="w-6 h-6 mb-1" />
              <div className="text-xs opacity-70">WLTH</div>
              <div className="font-bold text-lg">{user.statWealth.toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Quests */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold flex items-center gap-2 text-gold">
            <LightningIcon className="w-6 h-6 text-ember" />
            Daily Quests
          </h2>
          {quests.length === 0 ? (
            <div className="fantasy-card p-6 text-center">
              <ScrollIcon className="w-12 h-12 mx-auto mb-3 text-muted opacity-50" />
              <p className="text-muted">No quests available today</p>
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
                    <div className={`p-2 rounded-lg ${quest.isCompleted ? 'bg-jade/20' : 'bg-ember/20'}`}>
                      {quest.isCompleted ? (
                        <TrophyIcon className="w-6 h-6 text-jade" />
                      ) : (
                        <ScrollIcon className="w-6 h-6 text-ember" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{quest.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`category-badge category-${quest.category.toLowerCase()}`}>
                          {quest.category}
                        </span>
                        <span className={`difficulty-badge difficulty-${quest.difficulty.toLowerCase()}`}>
                          {quest.difficulty}
                        </span>
                        <span className="text-xs text-gold flex items-center gap-1">
                          <StarIcon className="w-3 h-3" /> +{questXp} XP
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
                      <div className="p-2 bg-jade/20 rounded-full">
                        <CheckmarkIcon className="w-5 h-5 text-jade" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Tasks & Habits */}
        <div className="lg:col-span-2 space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gold">
              <SparklesIcon className="w-6 h-6 text-mystic" />
              Tasks & Habits
            </h2>
            <button 
              className="fantasy-btn flex items-center gap-2"
              onClick={() => setIsCreateOpen(!isCreateOpen)}
            >
              <PlusIcon className="w-4 h-4" /> New Task
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
                    <div className={`p-2 rounded-lg category-icon-bg-${task.category.toLowerCase()}`}>
                      {statIcons[task.category] || <TargetIcon className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{task.title}</span>
                        {task.isHabit && task.streakCurrent > 0 && (
                          <span className="streak-badge">
                            <FlameIcon className="w-4 h-4 streak-flame" />
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
                        <span className="text-xs text-muted">
                          {task.isHabit ? '🔄 Habit' : '✨ One-time'}
                        </span>
                        <span className="text-xs text-gold flex items-center gap-1 ml-auto">
                          <StarIcon className="w-3 h-3" /> +{taskXp} XP
                        </span>
                      </div>
                    </div>
                    <button 
                      className="complete-btn"
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
                <ScrollIcon className="w-16 h-16 mx-auto mb-4 text-muted opacity-30" />
                <p className="text-lg text-muted mb-2">Your quest log is empty</p>
                <p className="text-sm text-muted opacity-70">Create a task to begin your adventure!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quest Journey Map Section */}
      <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <QuestMap currentNodeId={3} />
      </div>

      {/* Achievement Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="fantasy-card p-4 card-shine hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gold/20 border border-gold/40">
              <TrophyIcon className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-gold">Achievements</h3>
              <p className="text-sm text-muted">3/12 Unlocked</p>
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

        <div className="fantasy-card p-4 card-shine hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-ember/20 border border-ember/40">
              <FlameIcon className="w-8 h-8 text-ember" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-ember">Current Streak</h3>
              <p className="text-sm text-muted">Keep it going!</p>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-ember">7</span>
            <span className="text-muted">days</span>
            <FlameIcon className="w-6 h-6 text-ember ml-auto streak-flame" />
          </div>
        </div>

        <div className="fantasy-card p-4 card-shine hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-mystic/20 border border-mystic/40">
              <SwordIcon className="w-8 h-8 text-mystic" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-mystic">Battle Power</h3>
              <p className="text-sm text-muted">Your overall strength</p>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-mystic">
              {Math.round((user.statIntelligence + user.statStrength + user.statDiscipline + user.statWealth) * 10)}
            </span>
            <span className="text-muted">BP</span>
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
        <ScrollIcon className="w-5 h-5 text-gold" />
        <h3 className="font-bold text-gold">New Quest</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            className="fantasy-input w-full"
            placeholder="Quest Title..."
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select 
            className="fantasy-select flex-1 min-w-[140px]"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="INTELLIGENCE">🧠 Intelligence</option>
            <option value="STRENGTH">💪 Strength</option>
            <option value="DISCIPLINE">🎯 Discipline</option>
            <option value="WEALTH">💰 Wealth</option>
          </select>
          <select 
            className="fantasy-select flex-1 min-w-[120px]"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            <option value="EASY">⭐ Easy (+10 XP)</option>
            <option value="MEDIUM">⭐⭐ Medium (+20 XP)</option>
            <option value="HARD">⭐⭐⭐ Hard (+35 XP)</option>
          </select>
        </div>
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors">
          <input 
            type="checkbox" 
            className="fantasy-checkbox"
            checked={isHabit} 
            onChange={e => setIsHabit(e.target.checked)} 
          />
          <div className="flex items-center gap-2">
            <FlameIcon className="w-5 h-5 text-ember" />
            <span className="text-sm">Make this a recurring habit</span>
          </div>
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            className="px-4 py-2 rounded-lg text-muted hover:text-white hover:bg-surface/50 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="fantasy-btn">
            <PlusIcon className="w-4 h-4" />
            Create Quest
          </button>
        </div>
      </form>
    </div>
  );
}
