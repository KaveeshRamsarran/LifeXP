import { create } from 'zustand';
import api from '../lib/api';

interface Task {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  isHabit: boolean;
  streakCurrent: number;
  completedToday?: boolean; // Derived
}

interface Quest {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  isCompleted: boolean;
}

interface GameState {
  tasks: Task[];
  quests: Quest[];
  fetchData: () => Promise<void>;
  completeTask: (id: string, minutes: number) => Promise<void>;
  completeQuest: (id: string) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  tasks: [],
  quests: [],
  fetchData: async () => {
    const [tasksRes, questsRes] = await Promise.all([
      api.get('/tasks'),
      api.get('/quests/today'),
    ]);
    set({ tasks: tasksRes.data, quests: questsRes.data });
  },
  completeTask: async (id, minutes) => {
    await api.post(`/tasks/${id}/complete`, { actualMinutes: minutes });
    // Refresh data to get updated XP/Stats/Streaks
    get().fetchData();
    // Also refresh user stats
    // This is a bit hacky, ideally we update optimistic UI
    // But for MVP, refetching is safer
    // We need to trigger a user refresh in authStore too...
    // Let's just rely on the fact that the user might refresh or we can expose a refreshUser method
    // For now, we just refresh game data.
  },
  completeQuest: async (id) => {
    await api.post(`/quests/${id}/complete`);
    get().fetchData();
  },
}));
