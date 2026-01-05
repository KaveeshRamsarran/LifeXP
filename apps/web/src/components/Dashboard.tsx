'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, Check, Flame } from 'lucide-react';
import { Input } from './ui/Input';
import api from '@/lib/api';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { tasks, quests, fetchData, completeTask, completeQuest } = useGameStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  if (!user) return null;

  // XP Calculation for Bar
  // We need to know how much XP was needed for PREVIOUS levels to know the "start" of this level.
  // Or we can just simplify: The backend handles level. We just need to know how much XP into THIS level we are.
  // But we only have Total XP.
  // Let's recalculate "XP at start of current level".
  let xpAtStartOfLevel = 0;
  for (let i = 1; i < user.level; i++) {
    xpAtStartOfLevel += (100 + (i - 1) * 35);
  }
  const xpForNextLevel = 100 + (user.level - 1) * 35;
  const currentLevelXp = user.xp - xpAtStartOfLevel;
  const progress = Math.min(100, Math.max(0, (currentLevelXp / xpForNextLevel) * 100));

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-4 bg-slate-900/50 border-slate-800">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-xl">Level {user.level}</span>
                <span className="text-muted-foreground">{Math.floor(currentLevelXp)} / {xpForNextLevel} XP</span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center w-full md:w-auto">
              <div>
                <div className="text-xs text-muted-foreground">INT</div>
                <div className="font-bold text-blue-400">{user.statIntelligence.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">STR</div>
                <div className="font-bold text-red-400">{user.statStrength.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">DIS</div>
                <div className="font-bold text-purple-400">{user.statDiscipline.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">WLTH</div>
                <div className="font-bold text-green-400">{user.statWealth.toFixed(1)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Quests */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-yellow-500">⚡</span> Daily Quests
          </h2>
          {quests.map(quest => (
            <Card key={quest.id} className={`border-slate-800 ${quest.isCompleted ? 'opacity-50' : ''}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{quest.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{quest.category} • {quest.difficulty}</div>
                </div>
                {!quest.isCompleted ? (
                  <Button size="sm" onClick={() => completeQuest(quest.id)}>
                    <Check className="w-4 h-4" />
                  </Button>
                ) : (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tasks & Habits */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Tasks & Habits</h2>
            <Button size="sm" onClick={() => setIsCreateOpen(!isCreateOpen)}>
              <Plus className="w-4 h-4 mr-2" /> New Task
            </Button>
          </div>

          {isCreateOpen && <CreateTaskForm onClose={() => setIsCreateOpen(false)} />}

          <div className="grid gap-4">
            {tasks.map(task => (
              <Card key={task.id} className="border-slate-800">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{task.title}</span>
                      {task.isHabit && (
                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1 text-orange-400">
                          <Flame className="w-3 h-3" /> {task.streakCurrent}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {task.category} • {task.difficulty} • {task.isHabit ? 'Habit' : 'One-time'}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => completeTask(task.id, 15)}>
                    Complete
                  </Button>
                </CardContent>
              </Card>
            ))}
            {tasks.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No active tasks. Create one to start earning XP!
              </div>
            )}
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
    <Card className="border-slate-700 bg-slate-900">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="Task Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
          <div className="flex gap-2">
            <select 
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="INTELLIGENCE">Intelligence</option>
              <option value="STRENGTH">Strength</option>
              <option value="DISCIPLINE">Discipline</option>
              <option value="WEALTH">Wealth</option>
            </select>
            <select 
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isHabit" 
              checked={isHabit} 
              onChange={e => setIsHabit(e.target.checked)} 
            />
            <label htmlFor="isHabit" className="text-sm">Recurring Habit</label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
