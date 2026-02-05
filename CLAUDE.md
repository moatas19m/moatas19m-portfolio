# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start Vite dev server with HMR (http://localhost:5173)
npm run build    # Create production build in dist/
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Tech Stack

- **React 18** with **React Router 6** for routing
- **Three.js** via **@react-three/fiber** and **@react-three/drei** for 3D graphics
- **Vite 7** as build tool
- **Tailwind CSS 4** with class-variance-authority for component variants
- **Jotai** for atomic state management (shader settings)
- **Framer Motion** for animations
- **TypeScript** (partial adoption, not strict)

## Architecture

### Single Canvas Pattern
A single Three.js `<Canvas>` lives in `App.jsx` and persists across all routes. The `SceneSwitch` component conditionally renders route-specific 3D scenes based on the current pathname:
- `/` → HeroScene (planets, motorcycle, interactive elements)
- `/about` → AboutLeft3D (rider character)
- `/projects` → DOM-based UI only

### Path Aliases
- `@app/*` → `src/*`
- `@shader/*` → `src/components/planets/shader/*`

### Key Directories
- `src/components/planets/shader/` - GPU-based procedural planet generation with Jotai atoms for settings
- `src/components/background/` - Galaxy particle system (200k+ particles)
- `src/components/ui/` - Reusable UI components (card-spotlight, canvas-reveal-effect)
- `src/pages/` - Route page components (lazy-loaded)
- `src/lib/router.tsx` - React Router configuration

### 3D Interaction
Click handlers on 3D objects (planets, motorcycle) trigger React Router navigation. OrbitControls available on certain pages.

### State Management
Jotai atoms in `src/components/planets/shader/atoms/` manage shader settings (mesh resolution, colors, noise filters). Local component state via React hooks.

## Taskmaster Integration

This project uses Taskmaster for task management. See `.cursor/rules/taskmaster/` for:
- `taskmaster.mdc` - All 32 task management commands
- `dev_workflow.mdc` - Development workflow patterns

Tasks are stored in `.taskmaster/tasks/tasks.json`.
