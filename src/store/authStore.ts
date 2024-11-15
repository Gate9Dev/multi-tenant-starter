import { create } from 'zustand';
import { authenticateUser, type User } from '../services/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    const user = await authenticateUser(email, password);
    set({ isAuthenticated: true, user });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));