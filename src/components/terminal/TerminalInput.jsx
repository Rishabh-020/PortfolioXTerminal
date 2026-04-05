import React, { useState, useEffect, useCallback } from 'react'
import { useTerminalStore } from '../../store/terminalStore.js'

export default function TerminalInput({ prompt, onKeyDown, inputRef, disabled }) {
  const [value, setValue] = useState('')
  const aiLoading = useTerminalStore((s) => s.aiLoading)

  useEffect(() => { if (!disabled) inputRef.current?.focus() }, [inputRef, disabled])

  const handleKey = useCallback((e) => {
    if (!disabled) onKeyDown(e, value, setValue)
  }, [onKeyDown, value, disabled])

  const { user, host, path } = prompt

  return (
    <div
      className="flex items-center px-4 py-3 shrink-0 font-mono text-sm"
      style={{ borderTop: '1px solid var(--term-border)' }}
      onClick={() => !disabled && inputRef.current?.focus()}
    >
      <span className="select-none whitespace-nowrap mr-1">
        <span style={{ color: 'var(--prompt-user)' }}>{user}</span>
        <span style={{ color: 'var(--term-muted)' }}>@</span>
        <span style={{ color: 'var(--prompt-host)' }}>{host}</span>
        <span style={{ color: 'var(--term-muted)' }}>:</span>
        <span style={{ color: 'var(--prompt-path)' }}>{path}</span>
        <span style={{ color: 'var(--term-muted)' }}>$ </span>
      </span>

      {aiLoading ? (
        <span style={{ color: 'var(--term-muted)' }} className="flex items-center gap-2">
          {[0,1,2].map((i) => (
            <span key={i} className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--term-muted)', animation: `cursorBlink 1.2s ${i*0.2}s step-end infinite` }} />
          ))}
          <span className="ml-1">processing…</span>
        </span>
      ) : (
        <>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            disabled={disabled}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            className="flex-1 bg-transparent outline-none border-none font-mono text-sm"
            style={{ color: 'var(--term-text)', caretColor: 'transparent' }}
          />
          <span className="cursor-blink" />
        </>
      )}
    </div>
  )
}
