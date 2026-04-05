import { create } from 'zustand'

let lid = 0
const nid = () => ++lid

export const useTerminalStore = create((set, get) => ({
  lines:        [],
  history:      [],
  historyIndex: -1,
  cwd:          '/',
  aiLoading:    false,

  addLines: (newLines) =>
    set((s) => ({ lines: [...s.lines, ...newLines.map((l) => ({ id: nid(), ...l }))] })),

  addLine: (text, className = '') =>
    get().addLines([{ type: 'output', spans: [{ text, className }] }]),

  addInputLine: (cmd, prompt) =>
    get().addLines([{ type: 'input', spans: [{ text: prompt, className: 'prompt-inline' }, { text: cmd }] }]),

  clearLines: () => set({ lines: [] }),

  pushHistory: (cmd) =>
    set((s) => ({
      history: cmd ? [cmd, ...s.history.filter((c) => c !== cmd)].slice(0, 100) : s.history,
      historyIndex: -1,
    })),

  navigateHistory: (dir) => {
    const { history, historyIndex } = get()
    let next = dir === 'up'
      ? Math.min(historyIndex + 1, history.length - 1)
      : Math.max(historyIndex - 1, -1)
    set({ historyIndex: next })
    return next === -1 ? '' : history[next]
  },

  setCwd:       (cwd) => set({ cwd }),
  setAiLoading: (v)   => set({ aiLoading: v }),
}))
