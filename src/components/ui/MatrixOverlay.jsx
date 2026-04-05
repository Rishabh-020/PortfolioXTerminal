import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore.js'

export default function MatrixOverlay() {
  const canvasRef = useRef(null)
  const setMatrixActive = useAppStore((s) => s.setMatrixActive)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const cols    = Math.floor(canvas.width / 16)
    const drops   = Array(cols).fill(1)
    const chars   = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOP0123456789@#$%'

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00ff41'
      ctx.font = '14px JetBrains Mono, monospace'

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * 16, y * 16)
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }

    const interval = setInterval(draw, 40)

    // Auto-dismiss after 5 seconds
    const timeout = setTimeout(() => setMatrixActive(false), 5000)

    const onKey = () => setMatrixActive(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onKey)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onKey)
    }
  }, [setMatrixActive])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 text-center font-mono">
        <p className="text-4xl font-bold mb-4" style={{ color: '#00ff41', textShadow: '0 0 20px #00ff41' }}>
          🐇 KONAMI UNLOCKED
        </p>
        <p style={{ color: '#00cc33' }}>Click or press any key to exit the Matrix</p>
      </div>
    </motion.div>
  )
}
