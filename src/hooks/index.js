import { useCallback, useRef, useEffect, useState } from 'react'
import { useTerminalStore } from '../store/terminalStore.js'
import { useAppStore } from '../store/appStore.js'
import { executeCommand, COMMAND_NAMES } from '../commands/index.js'

// ── useTerminal ───────────────────────────────────────────────────
export function useTerminal() {
  const { addLines, addInputLine, clearLines, pushHistory, navigateHistory, cwd, setCwd, setAiLoading } = useTerminalStore()
  const inputRef = useRef(null)

  const getPrompt = useCallback(() => {
    const path = cwd === '/' ? '~' : cwd.replace(/\/$/, '')
    return { user: 'visitor', host: 'portfolio', path }
  }, [cwd])

  const promptString = useCallback(() => {
    const { user, host, path } = getPrompt()
    return `${user}@${host}:${path}$ `
  }, [getPrompt])

  const submit = useCallback(async (value) => {
    const cmd = value.trim()
    addInputLine(cmd, promptString())
    pushHistory(cmd)
    if (!cmd) return
    const result = await executeCommand(cmd, { cwd, setCwd, setAiLoading })
    if (result.action === 'clear') { clearLines(); return }
    if (result.action === 'cd' && result.newCwd) setCwd(result.newCwd)
    if (result.lines?.length) addLines(result.lines)
  }, [addInputLine, addLines, clearLines, pushHistory, promptString, cwd, setCwd, setAiLoading])

  const handleKeyDown = useCallback((e, inputValue, setInputValue) => {
    if (e.key === 'Enter') { submit(inputValue); setInputValue(''); return }
    if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); clearLines(); return }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = navigateHistory('up')
      setInputValue(prev)
      setTimeout(() => { const el = inputRef.current; if (el) el.setSelectionRange(el.value.length, el.value.length) }, 0)
      return
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setInputValue(navigateHistory('down')); return }
    if (e.key === 'Tab') {
      e.preventDefault()
      const parts = inputValue.split(/\s+/)
      if (parts.length === 1) {
        const matches = COMMAND_NAMES.filter((c) => c.startsWith(parts[0].toLowerCase()))
        if (matches.length === 1) setInputValue(matches[0] + ' ')
        else if (matches.length > 1) addLines([{ type: 'output', spans: [{ text: '  ' + matches.join('   '), className: 'term-cyan' }] }])
      }
    }
  }, [submit, clearLines, navigateHistory, addLines])

  return { getPrompt, handleKeyDown, inputRef }
}

// ── useAutoScroll ─────────────────────────────────────────────────
export function useAutoScroll(deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

// ── useInView ─────────────────────────────────────────────────────
export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15, ...options })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

// ── useCountUp ────────────────────────────────────────────────────
export function useCountUp(target, inView, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])
  return count
}

// ── useKonami ─────────────────────────────────────────────────────
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
export function useKonami(callback) {
  const seq = useRef([])
  useEffect(() => {
    const handler = (e) => {
      seq.current = [...seq.current, e.key].slice(-KONAMI.length)
      if (seq.current.join() === KONAMI.join()) callback()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [callback])
}

// ── useSectionObserver ────────────────────────────────────────────
export function useSectionObserver(ids) {
  const setActiveSection = useAppStore((s) => s.setActiveSection)
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveSection(id)
      }, { threshold: 0.4 })
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [ids, setActiveSection])
}
