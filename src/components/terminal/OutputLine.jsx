import React, { memo } from 'react'

function PromptInline({ text }) {
  const match = text.match(/^(.+?)@(.+?):(.+?)(\$\s*)$/)
  if (!match) return <span style={{ color: 'var(--term-green)' }}>{text}</span>
  const [, user, host, path, dollar] = match
  return (
    <>
      <span style={{ color: 'var(--prompt-user)' }}>{user}</span>
      <span style={{ color: 'var(--term-muted)' }}>@</span>
      <span style={{ color: 'var(--prompt-host)' }}>{host}</span>
      <span style={{ color: 'var(--term-muted)' }}>:</span>
      <span style={{ color: 'var(--prompt-path)' }}>{path}</span>
      <span style={{ color: 'var(--term-muted)' }}>{dollar}</span>
    </>
  )
}

const OutputLine = memo(function OutputLine({ lineData }) {
  const { spans } = lineData
  return (
    <div className="output-line whitespace-pre-wrap break-all leading-relaxed font-mono text-sm">
      {spans.map((span, i) =>
        span.className === 'prompt-inline'
          ? <PromptInline key={i} text={span.text} />
          : <span key={i} className={span.className || ''}>{span.text}</span>
      )}
    </div>
  )
})

export default OutputLine
