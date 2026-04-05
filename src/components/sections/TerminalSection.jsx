import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TerminalWindow from '../terminal/TerminalWindow.jsx'
import { useTerminalStore } from '../../store/terminalStore.js'
import { helpCommand, executeCommand } from '../../commands/index.js'

export default function TerminalSection() {
  const [active, setActive] = useState(false)
  const sectionRef = useRef(null)
  const hasAutoRun = useRef(false)
  const { addLines, lines } = useTerminalStore()

  // Auto-run "help" when scrolled into view (once)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoRun.current) {
          hasAutoRun.current = true
          // Small delay so the animation feels natural
          setTimeout(() => {
            if (lines.length === 0) addLines(helpCommand())
          }, 600)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [addLines, lines.length])

  return (
    <section id="terminal" className="py-24" style={{ background: 'var(--bg)' }} ref={sectionRef}>
      <div className="section-container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--accent)' }}>04. terminal</p>
          <h2 className="section-heading">Interactive Terminal</h2>
          <div className="w-16 h-1 rounded mt-3" style={{ background: 'var(--accent)' }} />
          <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            Explore my portfolio the hacker way. Click the terminal to activate, then type commands.
          </p>
        </motion.div>

        {/* Quick-command pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['help', 'about', 'skills', 'projects', 'contact'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setActive(true)
                // Inject command as if typed
                setTimeout(() => {
                  const store = useTerminalStore.getState()
                  store.addInputLine(cmd, 'visitor@portfolio:~$ ')
                  store.pushHistory(cmd)
                  executeCommand(cmd, {
                    cwd: store.cwd,
                    setCwd: store.setCwd,
                    setAiLoading: store.setAiLoading,
                  }).then((result) => {
                    if (result.lines?.length) store.addLines(result.lines)
                  })
                }, 100)
              }}
              className="font-mono text-xs px-3 py-1.5 rounded-md transition-all"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--accent)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              $ {cmd}
            </button>
          ))}
        </div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-xl overflow-hidden"
          style={{ height: 500, boxShadow: active ? '0 0 50px var(--accent-glow)' : '0 20px 60px rgba(0,0,0,0.4)' }}
        >
          <TerminalWindow disabled={!active} />

          {/* Click-to-activate overlay */}
          <AnimatePresence>
            {!active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
                onClick={() => setActive(true)}
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-4"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-mono font-bold"
                    style={{ background: 'var(--accent)', color: '#000', boxShadow: '0 0 30px var(--accent-glow)' }}
                  >
                    &gt;_
                  </div>
                  <p className="font-mono text-sm" style={{ color: 'var(--term-green)' }}>
                    Click to activate terminal
                  </p>
                  <p className="font-mono text-xs" style={{ color: 'var(--term-muted)' }}>
                    ↑↓ history · Tab autocomplete · Ctrl+L clear
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hint */}
        {active && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-xs text-center font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            Click outside the terminal or scroll freely — it won't trap your scroll
          </motion.p>
        )}
      </div>
    </section>
  )
}
