import { line, blank, divider, green, cyan, yellow, muted, red, purple, plain } from '../utils/output.js'
import { OWNER, SKILLS, PROJECTS, FILE_SYSTEM } from '../data/portfolio.js'

// ── help ─────────────────────────────────────────────────────────
export function helpCommand() {
  const cmds = [
    ['help',     'Show this help menu'],
    ['about',    'Who am I?'],
    ['skills',   'Tech stack'],
    ['projects', 'Featured projects + live GitHub'],
    ['contact',  'Get in touch'],
    ['clear',    'Clear terminal (Ctrl+L)'],
    ['ls',       'List directory'],
    ['cd <dir>', 'Change directory'],
    ['cat <f>',  'Read a file'],
    ['ask <q>',  'Ask the AI assistant'],
  ]
  return [
    blank(),
    line(green('Commands')), divider(),
    ...cmds.map(([c, d]) => line(cyan(`  ${c.padEnd(14)}`), muted(d))),
    blank(),
    line(muted('  ↑↓ history  •  Tab autocomplete  •  Ctrl+L clear')),
    blank(),
  ]
}

// ── about ────────────────────────────────────────────────────────
export function aboutCommand() {
  return [
    blank(),
    line(green(`  ${OWNER.name}`), muted('  —  '), plain(OWNER.roles[0])),
    line(muted(`  📍 ${OWNER.location}`)),
    blank(), divider(), blank(),
    ...OWNER.bio.map((b) => line(plain(`  ${b}`))),
    blank(), divider(), blank(),
    line(yellow('  Links')),
    line(muted('  github   '), cyan(`https://github.com/${OWNER.github}`)),
    line(muted('  linkedin '), cyan(`https://linkedin.com/${OWNER.linkedin}`)),
    line(muted('  twitter  '), cyan(`https://twitter.com/${OWNER.twitter}`)),
    blank(),
  ]
}

// ── skills ───────────────────────────────────────────────────────
export function skillsCommand() {
  const out = [blank()]
  for (const [cat, items] of Object.entries(SKILLS)) {
    out.push(line(yellow(`  ◆ ${cat}`)))
    out.push(line(muted('  '), plain(items.join('  ·  '))))
    out.push(blank())
  }
  return out
}

// ── projects ─────────────────────────────────────────────────────
export async function projectsCommand() {
  const staticLines = [
    blank(), line(green('  Projects')), divider(), blank(),
    ...PROJECTS.slice(0, 4).flatMap((p) => [
      line(cyan(`  ${p.name}`), muted('  '), yellow(`★ ${p.stars}`)),
      line(muted('  '), plain(p.description)),
      blank(),
    ]),
  ]
  let ghLines = []
  try {
    const res = await fetch(`https://api.github.com/users/${OWNER.github}/repos?sort=stargazers&per_page=5`)
    if (res.ok) {
      const repos = await res.json()
      ghLines = [
        line(green('  Live GitHub')), divider(), blank(),
        ...repos.map((r) => line(cyan(`  ${r.name.padEnd(26)}`), yellow(`★ ${r.stargazers_count}`), muted(`  ${r.language || ''}`)))
      ]
    }
  } catch { ghLines = [line(muted('  (GitHub API unavailable)'))] }
  return [...staticLines, ...ghLines, blank()]
}

// ── contact ──────────────────────────────────────────────────────
export function contactCommand() {
  return [
    blank(), line(green('  Contact')), divider(), blank(),
    line(yellow('  ✉  '), cyan(OWNER.email)),
    line(yellow('  🐙 '), cyan(`https://github.com/${OWNER.github}`)),
    line(yellow('  💼 '), cyan(`https://linkedin.com/${OWNER.linkedin}`)),
    blank(),
    line(muted('  Available for: consulting, full-time, OSS collaboration')),
    blank(),
  ]
}

// ── filesystem ───────────────────────────────────────────────────
function resolve(cwd, target) {
  if (!target || target === '.') return cwd
  if (target === '..') { const p = cwd.replace(/\/$/, '').split('/'); p.pop(); return p.join('/') || '/' }
  if (target.startsWith('/')) return target + (FILE_SYSTEM[target + '/'] ? '/' : '')
  const base = cwd.endsWith('/') ? cwd : cwd + '/'
  const full = base + target
  return FILE_SYSTEM[full + '/'] ? full + '/' : full
}

export function lsCommand(cwd) {
  const node = FILE_SYSTEM[cwd]
  if (!node || node.type !== 'dir') return [blank(), line(red(`  No such directory: ${cwd}`)), blank()]
  return [blank(), line(...node.children.flatMap((c, i) => [c.endsWith('/') ? cyan(c) : green(c), i < node.children.length - 1 ? muted('   ') : muted('')])), blank()]
}

export function cdCommand(cwd, args) {
  const target = args[0]
  if (!target || target === '~') return { cwd: '/', lines: [] }
  const resolved = resolve(cwd, target)
  if (!FILE_SYSTEM[resolved] || FILE_SYSTEM[resolved].type !== 'dir')
    return { cwd, lines: [blank(), line(red(`  cd: no such directory: ${target}`)), blank()] }
  return { cwd: resolved, lines: [] }
}

export function catCommand(cwd, args) {
  if (!args[0]) return [blank(), line(red('  cat: missing operand')), blank()]
  const resolved = args[0].startsWith('/') ? args[0] : (cwd.endsWith('/') ? cwd : cwd + '/') + args[0]
  const node = FILE_SYSTEM[resolved]
  if (!node) return [blank(), line(red(`  cat: ${args[0]}: No such file`)), blank()]
  if (node.type === 'dir') return [blank(), line(red(`  cat: ${args[0]}: Is a directory`)), blank()]
  return [blank(), ...node.content.map((l) => line(plain(`  ${l}`))), blank()]
}

// ── ask (AI) ─────────────────────────────────────────────────────
const SYSTEM = `You are an AI assistant embedded in ${OWNER.name}'s developer portfolio terminal. 
Answer questions about their skills, experience and projects concisely (2-4 sentences). 
Plain text only — no markdown, no bullets. Keep it friendly and slightly witty.`

export async function askCommand(args, setAiLoading) {
  const q = args.join(' ').trim()
  if (!q) return [blank(), line(muted('  Usage: '), cyan('ask <question>')), blank()]
  setAiLoading(true)
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM,
        messages: [{ role: 'user', content: q }],
      }),
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data = await res.json()
    const text = data.content?.[0]?.text || '(no response)'
    const words = text.split(' ')
    const wrapped = []
    let cur = ''
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > 68) { if (cur) wrapped.push(cur); cur = w }
      else cur = cur ? cur + ' ' + w : w
    }
    if (cur) wrapped.push(cur)
    return [blank(), line(yellow('  ◆ AI Assistant')), blank(), ...wrapped.map((l) => line(plain(`  ${l}`))), blank()]
  } catch (e) {
    return [blank(), line(red(`  Error: ${e.message}`)), blank()]
  } finally {
    setAiLoading(false)
  }
}

// ── COMMAND NAMES for autocomplete ───────────────────────────────
export const COMMAND_NAMES = ['help','about','skills','projects','contact','clear','ls','cd','cat','pwd','ask','whoami','date','echo','sudo']

// ── registry ─────────────────────────────────────────────────────
export async function executeCommand(input, { cwd, setCwd, setAiLoading }) {
  const trimmed = input.trim()
  if (!trimmed) return { lines: [] }
  const [cmd, ...args] = trimmed.split(/\s+/)

  switch (cmd.toLowerCase()) {
    case 'help':     return { lines: helpCommand() }
    case 'about':    return { lines: aboutCommand() }
    case 'skills':   return { lines: skillsCommand() }
    case 'projects': return { lines: await projectsCommand() }
    case 'contact':  return { lines: contactCommand() }
    case 'clear':    return { lines: [], action: 'clear' }
    case 'ls':       return { lines: lsCommand(cwd) }
    case 'pwd':      return { lines: [blank(), line(plain(`  ${cwd}`)), blank()] }
    case 'cd': {
      const r = cdCommand(cwd, args)
      return { lines: r.lines, action: 'cd', newCwd: r.cwd }
    }
    case 'cat':    return { lines: catCommand(cwd, args) }
    case 'ask':    return { lines: await askCommand(args, setAiLoading) }
    case 'whoami': return { lines: [blank(), line(cyan('  visitor')), blank()] }
    case 'date':   return { lines: [blank(), line(cyan(`  ${new Date().toString()}`)), blank()] }
    case 'echo':   return { lines: [blank(), line(plain('  ' + args.join(' '))), blank()] }
    case 'sudo':   return { lines: [blank(), line(red('  Nice try. This incident has been reported. 👀')), blank()] }
    case 'vim': case 'nvim':
      return { lines: [blank(), line(muted('  No vim escape needed here. But yes, I use Neovim btw.')), blank()] }
    default:
      return { lines: [blank(), line(red(`  command not found: `), plain(cmd)), line(muted('  Type '), cyan('help'), muted(' for available commands.')), blank()] }
  }
}
