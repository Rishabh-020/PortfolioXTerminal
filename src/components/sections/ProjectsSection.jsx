import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS, ALL_TAGS, OWNER } from '../../data/portfolio.js'

function FlipCard({ project }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: 1000, height: 260 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl p-6 flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            background: 'var(--surface)',
            border: `1px solid var(--border)`,
          }}
        >
          {project.featured && (
            <span
              className="absolute top-4 right-4 text-xs font-mono px-2 py-0.5 rounded"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              ★ featured
            </span>
          )}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4"
            style={{ background: project.color + '22', border: `1px solid ${project.color}44` }}
          >
            {'⚡'}
          </div>
          <h3 className="font-mono font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>
            {project.name}
          </h3>
          <p className="text-sm flex-1 leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
            {project.description.slice(0, 80)}…
          </p>
          <div className="flex items-center gap-3 text-sm font-mono">
            <span style={{ color: 'var(--text-muted)' }}>★ {project.stars.toLocaleString()}</span>
            <span style={{ color: 'var(--text-muted)' }}>⑂ {project.forks}</span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl p-6 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            rotateY: '180deg',
            background: `linear-gradient(135deg, ${project.color}15, var(--surface))`,
            border: `1px solid ${project.color}66`,
            transform: 'rotateY(180deg)',
          }}
        >
          <div>
            <h3 className="font-mono font-bold text-lg mb-3" style={{ color: project.color }}>
              {project.name}
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text)' }}>
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded font-mono"
                  style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-xs px-3 py-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              GitHub →
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs px-3 py-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                Live Demo →
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function FeaturedCard({ project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl p-8 mb-6"
      style={{
        background: `linear-gradient(135deg, ${project.color}18, var(--surface))`,
        border: `1px solid ${project.color}44`,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 rounded mb-2 inline-block"
            style={{ background: project.color + '22', color: project.color }}>
            ★ Featured
          </span>
          <h3 className="font-mono font-bold text-2xl" style={{ color: 'var(--text)' }}>{project.name}</h3>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
          <span>★ {project.stars.toLocaleString()}</span>
          <span>⑂ {project.forks}</span>
        </div>
      </div>
      <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {project.tech.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded font-mono"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-outline">GitHub →</a>
          {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-primary">Live →</a>}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const [activeTag, setActiveTag] = useState('All')
  const [ghStars, setGhStars] = useState({})

  // Fetch live star counts
  useEffect(() => {
    fetch(`https://api.github.com/users/${OWNER.github}/repos?per_page=100`)
      .then((r) => r.json())
      .then((repos) => {
        const map = {}
        repos.forEach?.((r) => { map[r.name] = r.stargazers_count })
        setGhStars(map)
      })
      .catch(() => {})
  }, [])

  const featured    = PROJECTS.filter((p) => p.featured)
  const nonFeatured = PROJECTS.filter((p) => !p.featured)

  const filtered = activeTag === 'All'
    ? nonFeatured
    : nonFeatured.filter((p) => p.tags.includes(activeTag))

  // Merge live star counts
  const withLiveStars = (p) => ({ ...p, stars: ghStars[p.name] ?? p.stars })

  return (
    <section id="projects" className="py-24" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--accent)' }}>03. projects</p>
          <h2 className="section-heading">What I&apos;ve Built</h2>
          <div className="w-16 h-1 rounded mt-3" style={{ background: 'var(--accent)' }} />
        </motion.div>

        {/* Featured */}
        {featured.map((p) => <FeaturedCard key={p.name} project={withLiveStars(p)} />)}

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 my-10">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all"
              style={{
                background: activeTag === tag ? 'var(--accent)' : 'var(--surface)',
                color: activeTag === tag ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${activeTag === tag ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <FlipCard project={withLiveStars(p)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="text-xs mt-6 text-center" style={{ color: 'var(--text-muted)' }}>
          Hover / tap cards to flip for details & links
        </p>
      </div>
    </section>
  )
}
