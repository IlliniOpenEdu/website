# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is the homepage for **IlliniOpenEdu** (`www.illiniopenedu.org`), a React + TypeScript + Vite single-page app. All source code lives under the `homepage/` subdirectory; the repo root only contains the `CNAME` file and `README.md`.

## Commands

All commands must be run from the `homepage/` directory:

```bash
npm run dev       # start dev server with HMR
npm run build     # type-check (tsc -b) then bundle (vite build)
npm run lint      # run ESLint on the project
npm run preview   # serve the production build locally
```

## Architecture

- **Entry**: `homepage/index.html` → `homepage/src/main.tsx` → `homepage/src/App.tsx`
- **Styles**: `App.css` scopes component styles; `index.css` holds global CSS variables (color tokens, layout). SVG icons are sprite-referenced from `public/icons.svg` via `<use href="/icons.svg#...">`.
- **Assets**: Static images live in `src/assets/`; `public/` is served as-is (favicon, icon sprite).
- **TypeScript**: Composite project — `tsconfig.json` references `tsconfig.app.json` (src) and `tsconfig.node.json` (vite config). Strict unused-variable/parameter checks are on (`noUnusedLocals`, `noUnusedParameters`).
- **No router, no state management, no backend** — currently a single-component app.