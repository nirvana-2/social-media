import { create } from 'zustand';

const useUiStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: true,
  modals: {
    postCreate: false,
    editProfile: false,
    likesModal: false
  },
  notifications: [],

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    return { theme: newTheme };
  }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  openModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: true }
  })),

  closeModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: false }
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [{ ...notification, id: Date.now() }, ...state.notifications]
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));

export default useUiStore;
