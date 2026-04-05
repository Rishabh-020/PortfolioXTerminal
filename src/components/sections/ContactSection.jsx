import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { OWNER } from '../../data/portfolio.js'

const SOCIALS = [
  { label: 'GitHub',   icon: '🐙', href: `https://github.com/${OWNER.github}`,           handle: `@${OWNER.github}` },
  { label: 'LinkedIn', icon: '💼', href: `https://linkedin.com/${OWNER.linkedin}`,        handle: OWNER.linkedin },
  { label: 'Twitter',  icon: '🐦', href: `https://twitter.com/${OWNER.twitter.replace('@','')}`, handle: OWNER.twitter },
  { label: 'Email',    icon: '✉️',  href: `mailto:${OWNER.email}`,                        handle: OWNER.email },
]

function SocialCard({ social, index }) {
  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="card flex items-center gap-4 p-4 no-underline"
      style={{ textDecoration: 'none' }}
    >
      <span className="text-2xl">{social.icon}</span>
      <div>
        <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{social.label}</p>
        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{social.handle}</p>
      </div>
      <span className="ml-auto text-lg" style={{ color: 'var(--text-muted)' }}>↗</span>
    </motion.a>
  )
}

export default function ContactSection() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [status, setStatus]   = useState('idle') // idle | sending | sent | error
  const [errors, setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStatus('sending')
    // Simulate send (replace with real endpoint / EmailJS / Resend etc.)
    await new Promise((r) => setTimeout(r, 1400))
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
  }

  const Field = ({ name, label, multiline }) => {
    const Tag = multiline ? 'textarea' : 'input'
    return (
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>{label}</label>
        <Tag
          value={form[name]}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          rows={multiline ? 5 : undefined}
          className="w-full px-4 py-3 rounded-lg text-sm font-mono outline-none resize-none transition-all"
          style={{
            background: 'var(--surface)',
            border: `1.5px solid ${errors[name] ? 'var(--term-red)' : 'var(--border)'}`,
            color: 'var(--text)',
          }}
          onFocus={(e)  => { if (!errors[name]) e.target.style.borderColor = 'var(--accent)' }}
          onBlur={(e)   => { if (!errors[name]) e.target.style.borderColor = 'var(--border)' }}
        />
        {errors[name] && <p className="mt-1 text-xs" style={{ color: 'var(--term-red)' }}>{errors[name]}</p>}
      </div>
    )
  }

  return (
    <section id="contact" className="py-24" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--accent)' }}>05. contact</p>
          <h2 className="section-heading">Get In Touch</h2>
          <div className="w-16 h-1 rounded mt-3" style={{ background: 'var(--accent)' }} />
          <p className="mt-4 max-w-xl" style={{ color: 'var(--text-muted)' }}>
            Open to interesting conversations, consulting, collaborations, and full-time roles.
            Usually reply within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-8 space-y-5"
          >
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <span className="text-5xl">✅</span>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Message sent!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Thanks for reaching out. I'll get back to you soon.</p>
                <button className="btn-outline mt-2" onClick={() => setStatus('idle')}>Send another</button>
              </div>
            ) : (
              <>
                <Field name="name"    label="Name" />
                <Field name="email"   label="Email" />
                <Field name="message" label="Message" multiline />
                <button
                  className="btn-primary w-full justify-center"
                  onClick={handleSubmit}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </span>
                  ) : 'Send Message →'}
                </button>
              </>
            )}
          </motion.div>

          {/* Right — Availability + Socials */}
          <div className="space-y-6">
            {/* Availability badge */}
            {OWNER.available && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card p-6 flex items-center gap-4"
              >
                <div className="relative">
                  <span className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: 'var(--accent-light)' }}>
                    🟢
                  </span>
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping"
                    style={{ background: 'var(--accent)', opacity: 0.5 }}
                  />
                </div>
                <div>
                  <p className="font-bold" style={{ color: 'var(--text)' }}>Open to Work</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Available for full-time, consulting & OSS collaboration
                  </p>
                </div>
              </motion.div>
            )}

            {/* Social links */}
            <div className="space-y-3">
              {SOCIALS.map((s, i) => <SocialCard key={s.label} social={s} index={i} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="section-container mt-20 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent)' }}>&gt;_</span> {OWNER.name} · {new Date().getFullYear()}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Built with React + Vite + Tailwind + Framer Motion
          </p>
        </div>
      </div>
    </section>
  )
}
