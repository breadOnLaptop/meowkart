import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: () => boolean;
}

// Per Assignment: "Assume a default user is logged in."
const DEFAULT_USER = {
  id: 1,
  name: 'Default User',
  email: 'customer@meowkart.com',
  role: 'CUSTOMER'
};

export const useAuthStore = create<AuthStore>(() => ({
  user: DEFAULT_USER,
  isAuthenticated: () => true,
}));
