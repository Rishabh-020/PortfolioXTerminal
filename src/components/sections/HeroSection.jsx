import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { OWNER } from '../../data/portfolio.js'

// ── Particle canvas background ────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let   W = canvas.width  = canvas.offsetWidth
    let   H = canvas.height = canvas.offsetHeight
    let   raf

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }))

    const onResize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', onResize)

    const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3fb950'

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(63,185,80,${0.12 * (1 - d / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
        const p = particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(63,185,80,0.5)'
        ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

// ── Typing animation ──────────────────────────────────────────────
function TypingText({ phrases }) {
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[phaseIdx % phrases.length]
    let timeout

    if (!deleting && displayed.length < phrase.length) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 65)
    } else if (!deleting && displayed.length === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setPhaseIdx((i) => i + 1)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, phaseIdx, phrases])

  return (
    <span className="font-mono" style={{ color: 'var(--accent)' }}>
      {displayed}
      <span className="cursor-blink" />
    </span>
  )
}

// ── Scroll indicator ──────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 opacity-60">
      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>scroll</span>
      <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
        style={{ borderColor: 'var(--text-muted)' }}>
        <motion.div
          className="w-1 h-2 rounded-full"
          style={{ background: 'var(--accent)' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────
export default function HeroSection() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <ParticleCanvas />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.15,
        }}
      />

      {/* Content */}
      <div className="relative z-10 section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Greeting */}
          <p className="font-mono text-sm mb-4" style={{ color: 'var(--accent)' }}>
            &gt; Hello, World! I&apos;m
          </p>

          {/* Name */}
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-4 leading-tight" style={{ color: 'var(--text)' }}>
            {OWNER.name}
          </h1>

          {/* Typing roles */}
          <div className="text-xl sm:text-2xl font-medium mb-6 h-9">
            <TypingText phrases={OWNER.roles} />
          </div>

          {/* Tagline */}
          <p className="max-w-xl mx-auto text-base mb-10" style={{ color: 'var(--text-muted)' }}>
            {OWNER.tagline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-primary" onClick={() => scrollTo('projects')}>
              <span>⚡</span> View Projects
            </button>
            <button className="btn-outline" onClick={() => scrollTo('terminal')}>
              <span className="font-mono">&gt;_</span> Open Terminal
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  )
}
