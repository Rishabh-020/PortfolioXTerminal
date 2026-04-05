import { create } from 'zustand'

export const useAppStore = create((set) => ({
  // Theme
  darkMode: true,
  toggleDark: () =>
    set((s) => {
      const next = !s.darkMode
      if (next) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
      return { darkMode: next }
    }),

  // Mobile nav
  mobileOpen: false,
  setMobileOpen: (v) => set({ mobileOpen: v }),

  // Active nav section (for highlight)
  activeSection: 'home',
  setActiveSection: (id) => set({ activeSection: id }),

  // Matrix rain overlay (Konami easter egg)
  matrixActive: false,
  setMatrixActive: (v) => set({ matrixActive: v }),

  // Cursor position for custom cursor
  cursor: { x: 0, y: 0 },
  setCursor: (x, y) => set({ cursor: { x, y } }),
}))
