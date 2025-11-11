import { create } from 'zustand';
import { api, clearAuthCookies, setAuthCookies } from '../lib/api';

export interface Profile {
  starting_balance: string;
  current_balance: string;
  total_pnl: string;
  cash_available: string;
}

interface AuthState {
  isAuthenticated: boolean;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  profile: null,
  loading: false,
  initialized: false,
  login: async (username: string, password: string) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { username, password });
      setAuthCookies(data.access, data.refresh);
      set({ isAuthenticated: true });
      await useAuthStore.getState().fetchProfile();
    } finally {
      set({ loading: false });
    }
  },
  register: async (username: string, email: string, password: string) => {
    set({ loading: true });
    try {
      await api.post('/auth/register', { username, email, password });
      await useAuthStore.getState().login(username, password);
    } finally {
      set({ loading: false });
    }
  },
  logout: () => {
    clearAuthCookies();
    set({ isAuthenticated: false, profile: null, initialized: true });
  },
  fetchProfile: async () => {
    try {
      const { data } = await api.get('/auth/profile');
      set({ profile: data, isAuthenticated: true, initialized: true });
    } catch (error) {
      clearAuthCookies();
      set({ isAuthenticated: false, profile: null, initialized: true });
    }
  },
}));
