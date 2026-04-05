import React from 'react'
import { motion } from 'framer-motion'
import { OWNER } from '../../data/portfolio.js'
import { useInView, useCountUp } from '../../hooks/index.js'

function StatCard({ stat, inView }) {
  const count = useCountUp(stat.value, inView)
  return (
    <div className="card p-5 text-center">
      <div className="text-3xl font-bold font-mono mb-1" style={{ color: 'var(--accent)' }}>
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
    </div>
  )
}

function TimelineItem({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-4 group"
    >
      {/* Year + line */}
      <div className="flex flex-col items-center">
        <span
          className="font-mono text-xs font-bold px-2 py-1 rounded shrink-0"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          {item.year}
        </span>
        <div className="w-px flex-1 mt-2" style={{ background: 'var(--border)' }} />
      </div>
      {/* Content */}
      <div className="pb-8">
        <h4 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{item.title}</h4>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
      </div>
    </motion.div>
  )
}

export default function AboutSection() {
  const [sectionRef, inView] = useInView()

  return (
    <section id="about" className="py-24" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--accent)' }}>01. about_me</p>
          <h2 className="section-heading">About Me</h2>
          <div className="w-16 h-1 rounded mt-3" style={{ background: 'var(--accent)' }} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Avatar + Bio */}
          <div>
            {/* Avatar placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative mb-8"
            >
              <div
                className="w-40 h-40 rounded-2xl flex items-center justify-center text-6xl font-bold mx-auto lg:mx-0"
                style={{ background: 'var(--surface)', border: '2px solid var(--accent)', color: 'var(--accent)' }}
              >
                {OWNER.name.charAt(0)}
              </div>
              {/* Availability badge */}
              {OWNER.available && (
                <div
                  className="absolute -bottom-3 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
                  Open to work
                </div>
              )}
            </motion.div>

            {/* Bio */}
            <div className="space-y-4 mb-8">
              {OWNER.bio.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Resume button */}
            <a href={OWNER.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <span>📄</span> Download Resume
            </a>
          </div>

          {/* Right — Stats + Timeline */}
          <div ref={sectionRef}>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {OWNER.stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <StatCard stat={s} inView={inView} />
                </motion.div>
              ))}
            </div>

            {/* Timeline */}
            <h3 className="font-semibold mb-6" style={{ color: 'var(--text)' }}>Career Timeline</h3>
            <div>
              {OWNER.timeline.map((item, i) => (
                <TimelineItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
