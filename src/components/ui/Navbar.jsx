import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore.js'
import { OWNER } from '../../data/portfolio.js'

const NAV_LINKS = [
  { id: 'home',     label: 'Home' },
  { id: 'about',    label: 'About' },
  { id: 'skills',   label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'contact',  label: 'Contact' },
]

export default function Navbar() {
  const { darkMode, toggleDark, mobileOpen, setMobileOpen, activeSection } = useAppStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => scrollTo('home')}
              className="flex items-center gap-2 font-mono font-bold text-lg"
              style={{ color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span style={{ color: 'var(--accent)' }}>&gt;_</span>
              <span>{OWNER.username}</span>
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="relative px-4 py-2 text-sm font-medium rounded-md transition-colors"
                  style={{
                    color: activeSection === id ? 'var(--accent)' : 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                  {activeSection === id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}
                title="Toggle theme"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-1.5"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer' }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block w-4 h-0.5 rounded transition-all"
                    style={{
                      background: 'var(--text)',
                      transform: mobileOpen
                        ? i === 0 ? 'rotate(45deg) translate(4px, 4px)'
                        : i === 2 ? 'rotate(-45deg) translate(4px, -4px)'
                        : 'scaleX(0)'
                        : 'none',
                    }}
                  />
                ))}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-40 w-72 flex flex-col pt-20 pb-8 px-6"
            style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}
          >
            {NAV_LINKS.map(({ id, label }, i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => scrollTo(id)}
                className="text-left py-4 text-lg font-medium border-b transition-colors"
                style={{
                  color: activeSection === id ? 'var(--accent)' : 'var(--text)',
                  borderColor: 'var(--border)',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: 'var(--accent)', marginRight: '0.75rem', fontFamily: 'monospace' }}>
                  {String(i + 1).padStart(2, '0')}.
                </span>
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
