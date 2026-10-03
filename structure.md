# Portfolio Structure — Laasya Yatham

## Owner
- **Name:** Laasya Yatham
- **Email:** laasya.yatham@utexas.edu
- **GitHub:** https://github.com/LaasYath
- **LinkedIn:** https://www.linkedin.com/in/laasya-yatham-8534a4296/
- **Bio:** CS + Canfield Business Honors student at UT Austin. Interested in SWE, product management, and tech consulting. Internship background in network engineering, design technology, and support.

## Deployed Site
- **URL:** https://laasyayatham.netlify.app
- **Host:** Netlify (Node 20, `@netlify/plugin-nextjs`)
- **Repo:** `laasyath.github.io-1`, branch `main`

## Tech Stack
- **Framework:** Next.js 16 (pages router), React 19
- **Styling:** Tailwind CSS v4, dark mode via `next-themes` (class strategy)
- **Animations:** GSAP stagger on hero text
- **Content:** `data/portfolio.json` is the single source of truth for all content

## Pages
| Route | Purpose |
|---|---|
| `/` | Hero taglines, project grid, about section |
| `/resume` | Experience, education, skills (gated by `showResume` flag) |
| `/blog` | Blog post listing (gated by `showBlog` flag) |
| `/blog/[slug]` | Markdown blog post with syntax highlighting |
| `/edit` | Dev-only admin dashboard for live JSON editing |

## Current Content (portfolio.json)

### Taglines
```
My name is Laasya Yatham.
I am a passionate CS + Canfield Business
Honors student dedicated to building
innovative full stack experiences.
```

### Projects (7 total)
1. **Bounding Volume Hierarchy Graphics Visualizer** — Java, JUnit, Swing. AVL-adapted BVH tree for collision detection.
2. **P2Prompt** — TypeScript, Solana, APIs. P2P cross-border crypto transfer route comparator.
3. **pseudo-lang** — TypeScript, Next.js. Custom programming language with lexer/parser/AST inside a mobile IDE.
4. **HEB Grocer New Online Deli Shop** — Figma, Next.js, React. WCAG AA compliant prototype for HEB's deli shop redesign.
5. **EduMedia Mobile Application** — Figma, React, Back4App. School community app (chat, clubs, calendars, galleries).
6. **Central Texas Tourism Recs** — HTML, CSS, PHP, SQL. Dining/outdoors/history recommendation site.
7. **CEB Cryptography Simulator** — AutumnHacks Intl. Hackathon 1st place. Encryption tools + cipher visualizer.

### Socials
- GitHub, LinkedIn, Email

### Feature Flags
```json
{ "showCursor": false, "showBlog": false, "darkMode": false, "showResume": false }
```

## Component Map
| Component | What it renders |
|---|---|
| `Header` | Sticky nav, theme toggle, mobile popover menu |
| `Footer` | "LET'S WORK TOGETHER" CTA + socials |
| `WorkCard` | Project card with image hover, title, description |
| `Button` | Primary/secondary theme-aware button |
| `Socials` | Row of social link buttons |
| `Cursor` | Custom animated cursor (opt-in via flag) |
| `ProjectResume` | Experience entry with dates + bullet points |
| `ContentSection` | Markdown renderer with Prism syntax highlighting |
| `BlogEditor` | Modal editor for blog post metadata + content |

## Tailwind Breakpoints
```
mob: 375px | tablet: 768px | laptop: 1024px | desktop: 1280px | laptopl: 1440px
```

## Key Files
```
data/portfolio.json   — all content + feature flags
pages/index.js        — homepage
pages/resume.js       — resume page
styles/globals.css    — gradient decorations, Hind font
tailwind.config.js    — custom breakpoints
next.config.js        — minimal (reactStrictMode: true)
netlify.toml          — build config (Node 20, plugin-nextjs)
```
