import React, { useCallback } from 'react'
import { useTerminalStore } from '../../store/terminalStore.js'
import { useTerminal, useAutoScroll } from '../../hooks/index.js'
import OutputLine from './OutputLine.jsx'
import TerminalInput from './TerminalInput.jsx'
import { OWNER } from '../../data/portfolio.js'

export default function TerminalWindow({ disabled = false }) {
  const lines = useTerminalStore((s) => s.lines)
  const cwd   = useTerminalStore((s) => s.cwd)
  const { getPrompt, handleKeyDown, inputRef } = useTerminal()
  const scrollRef = useAutoScroll([lines])

  const focusInput = useCallback(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled, inputRef])

  const prompt = getPrompt()
  const displayPrompt = {
    ...prompt,
    path: cwd === '/' ? '~' : cwd.replace(/\/$/, ''),
  }

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden scanline relative"
      style={{ background: 'var(--term-bg)', border: '1px solid var(--term-border)' }}
      onClick={focusInput}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 h-10 shrink-0 select-none"
        style={{ background: 'var(--term-surface)', borderBottom: '1px solid var(--term-border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
          <span className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
        </div>
        <span className="font-mono text-xs" style={{ color: 'var(--term-muted)' }}>
          {OWNER.username}@{OWNER.host} — bash
        </span>
        <span className="font-mono text-xs" style={{ color: 'var(--term-green)' }}>●</span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 py-1"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Welcome */}
        <div className="px-2 pt-3 pb-2 font-mono text-sm border-b mb-1" style={{ borderColor: 'var(--term-border)' }}>
          <p style={{ color: 'var(--term-green)' }}>Welcome to <span style={{ color: 'var(--term-cyan)' }}>{OWNER.name}</span>'s portfolio terminal.</p>
          <p style={{ color: 'var(--term-muted)' }}>
            Type <span style={{ color: 'var(--term-cyan)' }}>help</span> for commands.
            &nbsp;↑↓ history &nbsp;· Tab autocomplete &nbsp;· Ctrl+L clear
          </p>
        </div>

        {/* Lines */}
        <div className="py-1">
          {lines.map((l) => <OutputLine key={l.id} lineData={l} />)}
        </div>
      </div>

      {/* Input */}
      <TerminalInput
        prompt={displayPrompt}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
        disabled={disabled}
      />
    </div>
  )
}
