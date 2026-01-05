import { create } from 'zustand';
import api from '../lib/api';

interface Task {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  isHabit: boolean;
  streakCurrent: number;
  completedToday?: boolean;
  description?: string;
  isMystery?: boolean;
}

interface Quest {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  isCompleted: boolean;
}

interface MysteryTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xpReward: number;
  isCompleted: boolean;
}

interface GameState {
  tasks: Task[];
  quests: Quest[];
  mysteryTasks: MysteryTask[];
  currentMapNode: number;
  completedMapNodes: number[];
  totalTasksCompleted: number;
  currentStreak: number;
  fetchData: () => Promise<void>;
  completeTask: (id: string, minutes: number) => Promise<void>;
  completeQuest: (id: string) => Promise<void>;
  addMysteryTask: (task: MysteryTask) => void;
  completeMysteryTask: (id: string) => void;
  completeMapNode: (nodeId: number) => void;
  setCurrentMapNode: (nodeId: number) => void;
  incrementTasksCompleted: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  tasks: [],
  quests: [],
  mysteryTasks: [],
  currentMapNode: 0,
  completedMapNodes: [],
  totalTasksCompleted: 0,
  currentStreak: 0,
  fetchData: async () => {
    const [tasksRes, questsRes] = await Promise.all([
      api.get('/tasks'),
      api.get('/quests/today'),
    ]);
    set({ tasks: tasksRes.data, quests: questsRes.data });
  },
  completeTask: async (id, minutes) => {
    await api.post(`/tasks/${id}/complete`, { actualMinutes: minutes });
    get().incrementTasksCompleted();
    get().fetchData();
  },
  completeQuest: async (id) => {
    await api.post(`/quests/${id}/complete`);
    get().incrementTasksCompleted();
    get().fetchData();
  },
  addMysteryTask: (task: MysteryTask) => {
    set(state => ({
      mysteryTasks: [...state.mysteryTasks, task]
    }));
    // Also save to localStorage for persistence
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mysteryTasks');
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem('mysteryTasks', JSON.stringify([...existing, task]));
    }
  },
  completeMysteryTask: (id: string) => {
    set(state => ({
      mysteryTasks: state.mysteryTasks.map(t => 
        t.id === id ? { ...t, isCompleted: true } : t
      )
    }));
    get().incrementTasksCompleted();
    // Update localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mysteryTasks');
      const existing = saved ? JSON.parse(saved) : [];
      const updated = existing.map((t: MysteryTask) => 
        t.id === id ? { ...t, isCompleted: true } : t
      );
      localStorage.setItem('mysteryTasks', JSON.stringify(updated));
    }
  },
  completeMapNode: (nodeId: number) => {
    set(state => {
      const newCompleted = state.completedMapNodes.includes(nodeId) 
        ? state.completedMapNodes 
        : [...state.completedMapNodes, nodeId];
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('completedMapNodes', JSON.stringify(newCompleted));
      }
      
      return { completedMapNodes: newCompleted };
    });
  },
  setCurrentMapNode: (nodeId: number) => {
    set({ currentMapNode: nodeId });
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentMapNode', JSON.stringify(nodeId));
    }
  },
  incrementTasksCompleted: () => {
    set(state => {
      const newTotal = state.totalTasksCompleted + 1;
      // Update streak (simplified - daily streak logic would need date tracking)
      const newStreak = state.currentStreak + 1;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('totalTasksCompleted', JSON.stringify(newTotal));
        localStorage.setItem('currentStreak', JSON.stringify(newStreak));
        localStorage.setItem('lastTaskDate', new Date().toISOString().split('T')[0]);
      }
      
      return { totalTasksCompleted: newTotal, currentStreak: newStreak };
    });
  },
}));

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const savedMysteryTasks = localStorage.getItem('mysteryTasks');
  if (savedMysteryTasks) {
    useGameStore.setState({ mysteryTasks: JSON.parse(savedMysteryTasks) });
  }
  
  const savedMapNodes = localStorage.getItem('completedMapNodes');
  if (savedMapNodes) {
    useGameStore.setState({ completedMapNodes: JSON.parse(savedMapNodes) });
  }
  
  const savedCurrentNode = localStorage.getItem('currentMapNode');
  if (savedCurrentNode) {
    useGameStore.setState({ currentMapNode: JSON.parse(savedCurrentNode) });
  }
  
  const savedTotalTasks = localStorage.getItem('totalTasksCompleted');
  if (savedTotalTasks) {
    useGameStore.setState({ totalTasksCompleted: JSON.parse(savedTotalTasks) });
  }
  
  const savedStreak = localStorage.getItem('currentStreak');
  const lastTaskDate = localStorage.getItem('lastTaskDate');
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (savedStreak && lastTaskDate) {
    // Keep streak if task was completed today or yesterday
    if (lastTaskDate === today || lastTaskDate === yesterday) {
      useGameStore.setState({ currentStreak: JSON.parse(savedStreak) });
    } else {
      // Reset streak if more than a day passed
      localStorage.setItem('currentStreak', '0');
      useGameStore.setState({ currentStreak: 0 });
    }
  }
}
