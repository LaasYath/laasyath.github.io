# UI Rules — Laasya Yatham Portfolio

## Palette
| Token | Value | Usage |
|---|---|---|
| BG Primary | `#000000` | Hero, project view, footer |
| Text Primary | `#FFFFFF` | Headings, active states on black |
| BG Secondary | `#FFFFFF` | Summary, orgs sections |
| Text Secondary | `#000000` | Body on white sections |
| Border (dark) | `rgba(255,255,255,0.10–0.25)` | Cards, dividers on black |
| Border (light) | `#e5e7eb` | Org grid on white |
| Muted (dark bg) | `#6b7280` | Labels, secondary text on black |
| Muted (light bg) | `#9ca3af` | Secondary text on white |
| Hover fill | `#FFFFFF` → text flips to `#000000` | Category cards, nav items |
| Detail panel | `#f9fafb` | Org hover expansion |

## Typography
| Role | Font | Weight | Notes |
|---|---|---|---|
| Headings | Space Grotesk | 700 | Tight tracking |
| Body | Space Grotesk | 300–400 | Light weight preferred |
| Labels, tags, mono | IBM Plex Mono | 400 | `font-mono` class; uppercase + wide tracking |
| Name scramble | IBM Plex Mono | 700 | Hero name only |

## Rules
1. **Zero border-radius.** No `rounded-*` anywhere. All corners are sharp.
2. **No shadows.** Use borders and background fills instead.
3. **Images on dark sections:** `grayscale` filter at rest, `grayscale-0` on hover (`transition-all duration-500`).
4. **Section alternation:** Black → White → White (diagonal cut between them via `clip-diagonal`).
5. **Uppercase labels:** Always `font-mono`, `tracking-widest`, and short (e.g. `01 / INTRO`, `GITHUB →`).
6. **Hover states on dark:** Full white fill, text inverts to black.
7. **Hover states on light:** `bg-gray-50` fill, no color change.
8. **Animations:** GSAP `power3.out` for entrances, `power2.in` for exits, `elastic.out(1,0.5)` for magnetic card resets.
9. **Placeholder projects:** `opacity-50` card + `IN PROGRESS` badge overlay on image. Interactable but visually subdued.
10. **Borders on grids:** Use `border-l border-t` on the container and `border-r border-b` on each child to create a clean grid outline without double borders.

## Spacing
- Section padding: `py-24 laptop:py-32`
- Section max-width: `max-w-5xl mx-auto`
- Page side padding: `px-8 laptop:px-16`
- Card gap: `gap-5` (project grid), `gap-2.5` (mind map tree)

## Component Patterns
- **Category cards:** `flex-1` height (divides hero viewport equally), magnetic GSAP pull on mousemove
- **Project cards:** Fixed `h-40` image area, flex-col content, tech stack as mono tags
- **Org expansion:** `max-height` CSS transition (0 → 240px) on hover, grey panel with left image placeholder
- **Mind map tree:** `border-l` vertical spine + `border-t` horizontal branches + project node buttons
- **Project drawer:** Slides in from right, `w-96` fixed width, closes on same-project click
