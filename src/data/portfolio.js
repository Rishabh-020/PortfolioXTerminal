// ── EDIT THIS FILE to personalise your entire portfolio ──────────

export const OWNER = {
  name:       'Alex Rivera',
  username:   'alexrivera',
  host:       'portfolio',
  roles:      ['Full-Stack Engineer', 'Open Source Builder', 'Terminal Enthusiast', 'Systems Thinker'],
  tagline:    'I build fast, reliable software and the tools developers love.',
  location:   'San Francisco, CA',
  email:      'alex@example.dev',
  github:     'alexrivera',        // ← your GitHub username for live API
  linkedin:   'in/alexrivera-dev',
  twitter:    '@alex_codes',
  website:    'https://alexrivera.dev',
  resumeUrl:  '/resume.pdf',
  available:  true,                // toggle "Open to work" badge
  bio: [
    "I'm a full-stack engineer with 5+ years building production systems at scale.",
    "Before that, I was a physics PhD student who fell in love with shipping software that actually works.",
    "I care deeply about correctness, developer experience, and performance. I build in the open — most of my tools are MIT-licensed.",
  ],
  stats: [
    { label: 'Years Exp',      value: 5,    suffix: '+' },
    { label: 'Projects',       value: 40,   suffix: '+' },
    { label: 'GitHub Stars',   value: 6200, suffix: '+' },
    { label: 'Coffees / Day',  value: 3,    suffix: '☕' },
  ],
  timeline: [
    { year: '2024', title: 'Senior Engineer @ Vercel',       desc: 'Edge runtime, DX infrastructure, and OSS tooling.' },
    { year: '2022', title: 'Staff Engineer @ Stripe',        desc: 'Led payment API v3 redesign. 40ms → 3ms p99.' },
    { year: '2020', title: 'Full-Stack Engineer @ Shopify',  desc: 'Storefront performance and checkout reliability.' },
    { year: '2019', title: 'First Commit to Open Source',    desc: 'hyperroute — 2.4k stars and counting.' },
    { year: '2018', title: 'B.Sc Computer Science, Stanford','desc': 'Minored in Physics. Thesis on distributed consensus.' },
  ],
}

export const SKILLS = {
  Frontend:  ['React', 'Next.js', 'TypeScript', 'Svelte', 'WebGL', 'Tailwind CSS', 'Framer Motion', 'Vite'],
  Backend:   ['Node.js', 'Rust', 'Go', 'Python', 'Fastify', 'GraphQL', 'PostgreSQL', 'Redis', 'Kafka'],
  'DevOps':  ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'GitHub Actions', 'Cloudflare Workers', 'Nginx'],
  Tools:     ['Neovim', 'tmux', 'Git', 'Figma', 'Postman', 'Linear', 'Obsidian'],
}

export const PROJECTS = [
  {
    name:        'hyperroute',
    description: 'A blazing-fast HTTP router for Node.js with zero-overhead middleware. 10× faster than Express on benchmarks.',
    tech:        ['TypeScript', 'Node.js'],
    stars:       2400,
    forks:       180,
    url:         'https://github.com/alexrivera/hyperroute',
    demo:        'https://hyperroute.dev',
    featured:    true,
    color:       '#3fb950',
    tags:        ['TypeScript', 'Node.js', 'Performance'],
  },
  {
    name:        'sqlcraft',
    description: 'Type-safe SQL query builder with automatic schema inference from migrations. Zero codegen.',
    tech:        ['TypeScript', 'PostgreSQL'],
    stars:       1800,
    forks:       120,
    url:         'https://github.com/alexrivera/sqlcraft',
    demo:        'https://sqlcraft.dev',
    featured:    true,
    color:       '#79c0ff',
    tags:        ['TypeScript', 'PostgreSQL', 'DX'],
  },
  {
    name:        'edgecache',
    description: 'Distributed edge caching layer for Next.js deployed across 20+ PoPs globally.',
    tech:        ['Rust', 'Redis', 'Next.js'],
    stars:       980,
    forks:       67,
    url:         'https://github.com/alexrivera/edgecache',
    demo:        null,
    featured:    false,
    color:       '#e3b341',
    tags:        ['Rust', 'Redis', 'Next.js'],
  },
  {
    name:        'devpod',
    description: 'One-command reproducible dev environments. Nix + Docker Compose under the hood.',
    tech:        ['Nix', 'Docker', 'Go'],
    stars:       560,
    forks:       45,
    url:         'https://github.com/alexrivera/devpod',
    demo:        null,
    featured:    false,
    color:       '#d2a8ff',
    tags:        ['Go', 'Docker', 'DevOps'],
  },
  {
    name:        'termui',
    description: 'React component library for building terminal-style UIs in the browser.',
    tech:        ['React', 'TypeScript'],
    stars:       430,
    forks:       38,
    url:         'https://github.com/alexrivera/termui',
    demo:        'https://termui.dev',
    featured:    false,
    color:       '#f85149',
    tags:        ['React', 'TypeScript'],
  },
  {
    name:        'bench',
    description: 'Dead-simple HTTP benchmarking CLI with histogram output and CI integration.',
    tech:        ['Rust'],
    stars:       320,
    forks:       22,
    url:         'https://github.com/alexrivera/bench',
    demo:        null,
    featured:    false,
    color:       '#3fb950',
    tags:        ['Rust', 'CLI', 'Performance'],
  },
]

// All project filter tags
export const ALL_TAGS = ['All', 'TypeScript', 'React', 'Rust', 'Go', 'Node.js', 'PostgreSQL', 'Docker', 'Next.js', 'Redis', 'CLI']

// Simulated file system for terminal ls/cd/cat
export const FILE_SYSTEM = {
  '/': { type: 'dir', children: ['about.txt', 'resume.pdf', 'projects/', 'blog/'] },
  '/about.txt': {
    type: 'file',
    content: ['Name:   Alex Rivera', 'Role:   Full-Stack Engineer', 'Based:  San Francisco, CA', '', 'Open to interesting conversations and collaborations.'],
  },
  '/resume.pdf': { type: 'file', content: ['[PDF] Opening in browser...', 'URL: https://alexrivera.dev/resume.pdf'] },
  '/projects/': { type: 'dir', children: ['hyperroute/', 'sqlcraft/', 'edgecache/'] },
  '/projects/hyperroute/': { type: 'dir', children: ['README.md'] },
  '/projects/hyperroute/README.md': {
    type: 'file',
    content: ['# hyperroute', '', '> Zero-overhead HTTP router for Node.js', '', '  npm install hyperroute'],
  },
  '/blog/': { type: 'dir', children: ['rust-in-node.md', 'type-safe-sql.md'] },
  '/blog/rust-in-node.md': {
    type: 'file',
    content: ['# When I Rewrote My Node.js Hot Path in Rust', '', 'Published: 2024-03-12', '', 'Read: https://alexrivera.dev/blog/rust-in-node'],
  },
}
