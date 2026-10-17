---
name: baseline-ui
description: Quickly deslop UI code by fixing spacing, hierarchy, typography, and small layout issues. Stack-adaptive (supports both Tailwind/React and Vanilla CSS/HTML with DESIGN.md contracts). Use when the interface needs a fast cleanup or polish pass.
---

# Baseline UI (Stack-Adaptive & Design-Contract Aware)

Enforces an opinionated UI baseline to prevent AI-generated interface slop while strictly respecting the active project's stack and `DESIGN.md` contract.

## How to use

- `/baseline-ui`
  Apply these constraints to any UI work in this conversation.

- `/baseline-ui <file>`
  Review the file against all constraints below and output:
  - violations (quote the exact line/snippet)
  - why it matters (1 short sentence)
  - a concrete fix (code-level suggestion matching the project's stack)

## 0. Stack & Design Contract Detection (CRITICAL GATE)

Before applying stack-specific rules, inspect the project root:
1. **Check for `DESIGN.md` or Project Architecture Skills (e.g., `cronicas-arquitetura`):**
   - If `DESIGN.md` exists, its tokens, typography, elevation, and **Explicit Exceptions** supersede generic defaults below.
2. **Identify the Stack Mode:**
   - **Mode A — Modern Component Stack (Tailwind / React / Astro / Next):** Apply Tailwind defaults, `motion/react`, `cn` (`clsx` + `tailwind-merge`), and accessible primitives (`Base UI`, `React Aria`, `Radix`).
   - **Mode B — Vanilla CSS & Global JS Stack (e.g., Crônicas de Cinza e Ferro):** NEVER introduce Tailwind classes, JSX, `import`/`export`, or npm packages. Express all rules using existing CSS Custom Properties (`var(--...)`) in the project's stylesheets and Vanilla DOM/HTML attributes.

## Stack

- **In Mode A (Tailwind/React):**
  - MUST use Tailwind CSS defaults unless custom values already exist or are explicitly requested
  - MUST use `motion/react` (formerly `framer-motion`) when JavaScript animation is required
  - SHOULD use `tw-animate-css` for entrance and micro-animations in Tailwind CSS
  - MUST use `cn` utility (`clsx` + `tailwind-merge`) for class logic
- **In Mode B (Vanilla CSS/JS):**
  - MUST use existing `:root` CSS Custom Properties (`var(--...)`) from the base stylesheet (`css/01_base.css`) before introducing new tokens
  - MUST use native CSS transitions and `@keyframes` on compositor properties (`transform`, `opacity`)
  - NEVER inject utility framework classes or external libraries not loaded in `index.html`

## Components

- MUST use the project’s existing component primitives or patterns first
- NEVER mix primitive systems within the same interaction surface
- **In Mode A:** MUST use accessible component primitives for anything with keyboard or focus behavior (`Base UI`, `React Aria`, `Radix`), preferring [`Base UI`](https://base-ui.com/react/components) for new primitives if compatible
- **In Mode B:** Use semantic HTML (`<button>`, `<dialog>` / `role="dialog" aria-modal="true"`) and preserve existing global event handlers
- MUST add an `aria-label` to icon-only or emoji-only buttons
- MUST give interactive controls a minimum touch target of `44x44px`

## Interaction

- MUST use a confirmation dialog (`AlertDialog` or project modal) for destructive or irreversible actions
- SHOULD use structural skeletons or deterministic placeholders for loading states
- NEVER use `100vh` / `h-screen` alone for full-viewport app shells; use `100dvh` (`h-dvh`) with fallback
- MUST respect `env(safe-area-inset-*)` for fixed headers, docks, and bottom sheets
- MUST show validation or action errors next to where the action happens
- NEVER block paste in `input` or `textarea` elements

## Animation

- NEVER add gratuitous animation to high-frequency routine interactions (such as tab switches) unless requested
- MUST animate only compositor props (`transform`, `opacity`)
- NEVER animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`)
- SHOULD avoid animating paint properties (`background`, `color`) except for small, local UI (buttons, text, icons)
- SHOULD use `ease-out` (or `cubic-bezier(0.22, 1, 0.36, 1)`) on entrance
- SHOULD start scale entrances near `0.92–0.96` (never from `scale(0)`)
- SHOULD add subtle press feedback on `:active` (`scale(0.975)` or `scale(0.96)`)
- NEVER exceed `200ms` for interaction feedback (`150ms–180ms` preferred)
- MUST pause looping animations when off-screen
- MUST respect `prefers-reduced-motion`

## Typography

- MUST use `text-wrap: balance` (`text-balance`) for headings and `text-wrap: pretty` (`text-pretty`) for body/paragraphs
- MUST use `font-variant-numeric: tabular-nums` (`tabular-nums`) for all dynamic numbers, counters, gold/currency, years, stats, and progress values
- SHOULD use `truncate` (`text-overflow: ellipsis`) or `line-clamp` for dense UI labels
- SHOULD keep body reading measure between `60ch` and `75ch`
- NEVER modify `letter-spacing` (`tracking-*`) unless governed by `DESIGN.md` or explicitly requested

## Layout & Geometry

- MUST use a fixed, deliberate `z-index` scale (no arbitrary random `z-index` values)
- MUST match nested border radii concentrically (`inner_radius = outer_radius - padding`)
- SHOULD group related content with spatial breathing room (`gap`, `padding`) before adding divider lines
- SHOULD leave at least `8px–12px` breathing room between adjacent bordered controls

## Performance

- NEVER animate large `blur()` or `backdrop-filter` surfaces during transitions
- NEVER apply `will-change` outside an active animation
- NEVER interleave DOM layout reads and writes in the same frame
- **In Mode A:** NEVER use `useEffect` for anything that can be expressed as render logic

## Design

- **Unless explicitly governed by `DESIGN.md` (e.g., Dark Medieval / Heraldic themes):**
  - NEVER use generic AI gradients, neon purple/multicolor gradients, or unrequested glow effects as primary affordances
  - SHOULD use the project's defined shadow scale (`--shadow-sm/md/lg` or Tailwind default shadow scale)
- **Universal Rules (All Projects):**
  - MUST give empty states one clear next action or clear contextual guidance
  - SHOULD limit primary accent color usage to one dominant call-to-action per view
  - NEVER rely on color alone to communicate status — always pair status color with an icon or text label
