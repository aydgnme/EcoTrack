import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (userData) => set({ user: userData, isLoggedIn: !!userData }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));

export default useUserStore;