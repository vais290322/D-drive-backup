import { create } from 'zustand';

let toastId = 0;

export const useToastStore = create((set) => ({
  toasts: [],
  
  addToast: (message, type = 'info', duration = 3000) => {
    const id = ++toastId;
    
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter(toast => toast.id !== id),
        }));
      }, duration);
    }
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }));
  },
  
  clearAll: () => {
    set({ toasts: [] });
  },
  
  // Convenience methods
  success: (message, duration) => useToastStore.getState().addToast(message, 'success', duration),
  error: (message, duration) => useToastStore.getState().addToast(message, 'error', duration),
  info: (message, duration) => useToastStore.getState().addToast(message, 'info', duration),
  warning: (message, duration) => useToastStore.getState().addToast(message, 'warning', duration),
}));
