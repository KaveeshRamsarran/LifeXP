import { create } from 'zustand';
import api from '../lib/api';
import { LoginInput, RegisterInput } from '@life-xp/shared';

interface User {
  id: string;
  email: string;
  name: string;
  xp: number;
  level: number;
  title: string;
  statIntelligence: number;
  statStrength: number;
  statDiscipline: number;
  statWealth: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  login: async (data) => {
    const res = await api.post('/auth/login', data);
    set({ user: res.data.user });
    // Fetch full profile after login to get stats
    const me = await api.get('/me');
    set({ user: me.data.user });
  },
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    set({ user: res.data.user });
    const me = await api.get('/me');
    set({ user: me.data.user });
  },
  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null });
  },
  checkAuth: async () => {
    try {
      const res = await api.get('/me');
      set({ user: res.data.user });
    } catch (error) {
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
