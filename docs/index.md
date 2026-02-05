# Project Documentation Index

> **Master entry point for AI-assisted development**
>
> Generated: 2026-02-05 | Scan Level: Exhaustive | Mode: Initial Scan

---

## Project Overview

| Property | Value |
|----------|-------|
| **Type** | Monolith - Web Application (3D Portfolio) |
| **Primary Language** | TypeScript/JavaScript |
| **Framework** | React 18 + Three.js |
| **Architecture** | Component-based SPA with persistent 3D canvas |

---

## Quick Reference

### Tech Stack
- **UI:** React 18.3.1 + React Router 6.30.1
- **3D:** Three.js 0.166.1 + @react-three/fiber 8.16.8
- **Build:** Vite 7.1.0
- **Styling:** Tailwind CSS 4.1.11
- **State:** Jotai 2.8.4
- **Animation:** Framer Motion 11.3.8

### Entry Points
- **App Entry:** `src/main.jsx`
- **Root Layout:** `src/App.jsx`
- **Router:** `src/lib/router.tsx`
- **Main 3D Scene:** `src/components/HeroScene.jsx`

### Path Aliases
- `@app/*` → `src/*`
- `@shader/*` → `src/components/planets/shader/*`

---

## Generated Documentation

### Core Documents

| Document | Description |
|----------|-------------|
| [Project Overview](./project-overview.md) | High-level project summary |
| [Architecture](./architecture.md) | System design, data flows, diagrams |
| [Technology Stack](./technology-stack.md) | Complete tech inventory with versions |

### Analysis Documents

| Document | Description |
|----------|-------------|
| [Component Inventory](./component-inventory.md) | All 30+ components documented |
| [Source Tree Analysis](./source-tree-analysis.md) | Annotated directory structure |
| [State Management](./state-management.md) | Jotai atoms, routing, component state |

### Development Documents

| Document | Description |
|----------|-------------|
| [Development Guide](./development-guide.md) | Setup, scripts, workflows, debugging |
| [Project Structure](./project-structure.md) | Repository classification and parts |
| [Existing Documentation](./existing-documentation.md) | Pre-existing docs inventory |

---

## Existing Project Documentation

| File | Type | Description |
|------|------|-------------|
| `README.md` | readme | Vite template boilerplate |
| `CLAUDE.md` | ai-guidance | AI assistant guidance with architecture |
| `.cursor/rules/*.mdc` | ai-rules | Cursor AI rules and workflows |

---

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/components/` | React components (3D and UI) |
| `src/components/planets/` | Procedural planets + shader system |
| `src/components/planets/shader/` | GPU terrain generation |
| `src/pages/` | Route page components |
| `src/lib/` | Core utilities (router, utils) |
| `src/assets/models/` | GLTF 3D models |

---

## Development Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build to dist/
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## Navigation Map

### 3D Object → Route Mapping

| 3D Object | Route | Status |
|-----------|-------|--------|
| StarText (name) | - | Display only |
| Hoth (ice planet) | `/work` | Placeholder |
| Chromastone (purple) | `/projects` | Active |
| Coruscant (city) | `/skills` | Placeholder |
| Mustafar (lava) | `/contact` | Placeholder |
| Rider (character) | `/about` | Active |
| Motorcycle | `/hobbies` | Placeholder |

---

## For AI Assistants

### When Implementing Features

1. **New Page:** Add to `src/pages/` + update `src/lib/router.tsx`
2. **New 3D Content:** Add to `src/components/` + register in `HeroScene.jsx` or `SceneSwitch`
3. **New Planet:** Copy existing planet in `src/components/planets/`, modify atom values
4. **New UI Component:** Add to `src/components/ui/`

### Key Patterns

- **State:** Use Jotai atoms for shader settings, refs for animation state
- **Navigation:** `useNavigate()` from react-router-dom
- **3D Updates:** Use `useFrame()` with refs (avoid setState in render loop)
- **Styling:** Tailwind utility classes, `cn()` for conditional classes

### Files to Read First

1. `src/App.jsx` - Understand the root structure
2. `src/components/HeroScene.jsx` - Main 3D scene
3. `src/lib/router.tsx` - All routes
4. `src/components/planets/shader/atoms/settings.ts` - Planet configuration

---

## Scan Metadata

| Property | Value |
|----------|-------|
| **Workflow Version** | 1.2.0 |
| **Scan Level** | Exhaustive |
| **Files Analyzed** | 60+ source files |
| **Components Documented** | 30+ |
| **Generated Documents** | 10 |

**State File:** `docs/project-scan-report.json`
