import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SKILLS } from '../../data/portfolio.js'

const CATEGORY_ICONS = {
  Frontend:  '🎨',
  Backend:   '⚙️',
  'DevOps':  '🚀',
  Tools:     '🛠️',
}

function SkillBadge({ skill, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: 1.08, y: -2 }}
      className="px-4 py-2 rounded-lg font-mono text-sm font-medium cursor-default"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.boxShadow = '0 0 12px var(--accent-glow)'
        e.currentTarget.style.color = 'var(--accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.color = 'var(--text)'
      }}
    >
      {skill}
    </motion.div>
  )
}

export default function SkillsSection() {
  const categories = Object.keys(SKILLS)
  const [active, setActive] = useState(categories[0])

  return (
    <section id="skills" className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="section-container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--accent)' }}>02. skills</p>
          <h2 className="section-heading">Tech Stack</h2>
          <div className="w-16 h-1 rounded mt-3" style={{ background: 'var(--accent)' }} />
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active === cat ? 'var(--accent)' : 'var(--surface)',
                color: active === cat ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${active === cat ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              <span>{CATEGORY_ICONS[cat] || '💡'}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Skill badges */}
        <div className="min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {SKILLS[active].map((skill, i) => (
                <SkillBadge key={skill} skill={skill} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* All skills summary bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-6 rounded-xl font-mono text-sm leading-loose"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--accent)' }}>const</span>
          <span style={{ color: 'var(--text-muted)' }}> stack </span>
          <span style={{ color: 'var(--text)' }}>= {'{'}</span>
          {categories.map((cat, i) => (
            <span key={cat}>
              <br />
              <span style={{ color: 'var(--text-muted)' }}>  {cat.toLowerCase()}</span>
              <span style={{ color: 'var(--text)' }}>: [</span>
              <span style={{ color: 'var(--accent)' }}>
                {SKILLS[cat].map((s) => `"${s}"`).join(', ')}
              </span>
              <span style={{ color: 'var(--text)' }}>]{i < categories.length - 1 ? ',' : ''}</span>
            </span>
          ))}
          <br />
          <span style={{ color: 'var(--text)' }}>{'}'}</span>
        </motion.div>
      </div>
    </section>
  )
}
