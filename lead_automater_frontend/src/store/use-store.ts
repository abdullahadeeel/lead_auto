import { create } from 'zustand';

interface UIState {
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  notifications: string[];
  addNotification: (message: string) => void;
  removeNotification: (index: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  notifications: [],
  addNotification: (message) =>
    set((state) => ({ notifications: [...state.notifications, message] })),
  removeNotification: (index) =>
    set((state) => ({
      notifications: state.notifications.filter((_, i) => i !== index),
    })),
}));
