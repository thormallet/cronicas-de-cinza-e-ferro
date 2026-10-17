---
version: alpha
name: Crônicas de Cinza e Ferro
description: Dark Medieval BitLife Premium design language for Crônicas de Cinza e Ferro.
colors:
  bg-deep: "#080605"
  bg: "#0e0b09"
  bg-alt: "#16120e"
  bg-surface: "#1b1611"
  bg-elevated: "#241d16"
  panel: "#17120d"
  panel-inner: "#211a13"
  panel-card: "#271f17"
  panel-highlight: "#33281e"
  pergaminho-escuro: "#1e1711"
  pergaminho-claro: "#f4e8cf"
  leather: "#140e0a"
  leather-light: "#231912"
  wood: "#1e140d"
  wood-dark: "#100a06"
  text: "#f3e6cf"
  text-muted: "#bda88a"
  text-dim: "#7f6e57"
  text-bright: "#ffffff"
  border: "#4a3826"
  border-light: "#6e5439"
  border-gold: "#c99c33"
  border-gold-bright: "#ffd56b"
  border-dark: "#120c08"
  gold-dim: "#785a1a"
  gold: "#c99c33"
  gold-bright: "#e5b746"
  gold-radiant: "#ffd56b"
  accent: "#8b2626"
  accent-hover: "#aa3030"
  royal-purple: "#46183a"
  good: "#286e42"
  good-bright: "#3ea066"
  bad: "#962222"
  bad-bright: "#d93838"
  sapphire: "#1f4c7a"
  sapphire-bright: "#347bbd"
  love: "#9c2553"
  love-bright: "#d83d7a"
typography:
  serif:
    fontFamily: Cinzel
  body:
    fontFamily: Eczar
  h1:
    fontFamily: Cinzel
    fontSize: 1.05rem
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: 1.2px
  h2:
    fontFamily: Cinzel
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: 0.8px
  h3:
    fontFamily: Cinzel
    fontSize: 1.08rem
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: 0.8px
  h4:
    fontFamily: Cinzel
    fontSize: 0.94rem
    fontWeight: 600
    lineHeight: "1.15"
    letterSpacing: 0.8px
  bodyMd:
    fontFamily: Eczar
    fontSize: 15px
    fontWeight: 400
    lineHeight: "1.5"
---

## Overview

Crônicas de Cinza e Ferro is a medieval dynastic life simulator with a Dark Medieval BitLife Premium aesthetic built on obsidian surfaces, aged leather panels, warm parchment text, forged royal gold borders, and crimson wax-seal accents.

## Colors

- Use `bg-deep` and `bg` for the viewport and primary app-shell background (`css/01_base.css`).
- Use `panel`, `panel-inner`, and `panel-card` for cards, modals, and bottom-sheet surfaces.
- Use `text` for primary parchment reading copy, `text-muted` for metadata and secondary descriptions, and `gold-bright` or `gold-radiant` for headings and noble emphasis.
- Use `border-gold` for structural card, header, modal, and button framing, and `border` for subtle internal dividers.
- Use `accent` and `royal-purple` for primary crimson CTA surfaces and royal seals.
- Use `good` / `good-bright` for positive outcomes and health/vigor gains, `bad` / `bad-bright` for damage, debt, and negative outcomes, `sapphire` for intellect/faith/exploration, and `love` for romance/family affinity.

## Themes

| Token | Default (Dark Medieval) | `[data-theme="light"]` |
| --- | --- | --- |
| `--bg-deep` | `#080605` | `#0a0604` |
| `--bg` | `#0e0b09` | `#110d0a` |
| `--bg-alt` | `#16120e` | `#1a140f` |
| `--panel` | `#17120d` | `#1b1510` |
| `--panel-inner` | `#211a13` | `#241c14` |
| `--text` | `#f3e6cf` | `#f5ebd7` |
| `--text-muted` | `#bda88a` | `#c4b093` |

## Typography

- Use `serif` (`Cinzel`) for headings, buttons, badges, HUD labels, and heraldic titles.
- Use `body` (`Eczar`) for narrative event descriptions, chronicle logs, and body copy.
- Apply `font-variant-numeric: tabular-nums` to all numeric counters, gold amounts, years, ages, attribute scores, and progress percentages.
- Apply `text-wrap: balance` to headings (`h1`–`h4`) and `text-wrap: pretty` to narrative paragraphs.

## Layout

- Center `#app-shell` as a mobile-first single-column container (`max-width: 560px`, expanding on desktop rules in `css/07_desktop.css`) using `height: 100dvh` with `100vh` fallback.
- Respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` on `#app-header`, `.hud`, `.custom-dialog-backdrop`, and bottom docks/sheets.
- Maintain a minimum touch target of `44x44px` (`min-height: 44px–46px`) on all interactive buttons, selects, inputs, `.icon-btn`, and `.chip-btn`.
- Leave `0.5rem–0.75rem` (`8px–12px`) spacing between adjacent bordered controls.

## Elevation & Depth

- Express depth through `--shadow-sm`, `--shadow-md`, `--shadow-lg`, and `--shadow-gold` combined with subtle top inner bevels (`inset 0 1px 0 rgba(255, 230, 170, 0.2)`).
- **Explicit exception:** Forged leather, wood, and crimson/gold gradients (`linear-gradient` and `radial-gradient` defined in `css/01_base.css` through `css/06_sheets.css`) are canonical to the Dark Medieval BitLife identity and are explicitly permitted.

## Shapes

- Use `14px` border-radius for `.card` and `.person-card`, `12px` for `.npc-card` and `.item-card`, `20px` for `.custom-dialog` and `.sheet` top corners, `8px` for standard buttons/inputs, and `999px` for `.badge`, `.chip-btn`, and circular `.icon-btn`.
- Compute nested element radii concentrically (`inner_radius = outer_radius - padding`).

## Components

- **Buttons (`button`, `button.primary`, `.icon-btn`, `.chip-btn`):** Use `Cinzel`, `1.5px solid var(--border-gold)`, compositor hover/active feedback (`transform: translateY(1px) scale(0.975)` on `:active`), and explicit `aria-label` on icon-only controls.
- **Cards (`.card`, `.person-card`, `.npc-card`, `.item-card`):** Frame with `--border-gold` or `--border` with a `5px` gold left accent on list cards.
- **Modals (`.custom-dialog-backdrop`, `.custom-dialog`):** Use `role="dialog"`, `aria-modal="true"`, and `popIn` entrance (`cubic-bezier(0.22, 1, 0.36, 1)` starting at `scale(0.92)`).
- **Bottom Sheets (`.sheet-backdrop`, `.sheet`):** Slide via `transform: translateY()` with a tactile top handle (`44px x 4.5px`) in `--gold-bright`.

## Do's and Don'ts

- Do use `:root` CSS Custom Properties (`var(--...)`) from `css/01_base.css` for all colors, fonts, borders, and shadows.
- Do animate only compositor properties (`transform`, `opacity`) and honor `prefers-reduced-motion`.
- Do pair status colors (`--good`, `--bad`, `--gold`) with icons, `+`/`-` signs, or text labels.
- Don't introduce Tailwind CSS, React/JSX, `import`/`export` modules, or external UI component libraries.
- Don't use modern sci-fi/neon purple gradients or unrequested glow effects outside canonical primary/royal affordances.
- Don't animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
