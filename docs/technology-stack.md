# Technology Stack

## Overview

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **UI Framework** | React | 18.3.1 | Component-based UI |
| **Routing** | React Router DOM | 6.30.1 | Client-side routing with lazy loading |
| **3D Graphics** | Three.js | 0.166.1 | WebGL 3D rendering engine |
| **3D React Bindings** | @react-three/fiber | 8.16.8 | React renderer for Three.js |
| **3D Helpers** | @react-three/drei | 9.108.1 | Useful Three.js abstractions |
| **Build Tool** | Vite | 7.1.0 | Fast dev server with HMR |
| **CSS Framework** | Tailwind CSS | 4.1.11 | Utility-first CSS |
| **State Management** | Jotai | 2.8.4 | Atomic state management |
| **Animation** | Framer Motion | 11.3.8 | Declarative animations |
| **3D Animation** | Framer Motion 3D | 11.2.0 | 3D animation integration |
| **Type System** | TypeScript | 5.9.3 | Static type checking (partial) |
| **Linting** | ESLint | 9.32.0 | Code quality enforcement |

## Framework Details

### React 18

- **Entry Point:** `src/main.jsx`
- **Root Element:** `#root` in `index.html`
- **Rendering Mode:** StrictMode enabled
- **Router Integration:** RouterProvider wraps entire app

### React Router 6

**Configuration:** `src/lib/router.tsx`

| Route | Component | Status |
|-------|-----------|--------|
| `/` | `AppLayout` | Active (Hero scene) |
| `/projects` | `ProjectsPage` | Active |
| `/about` | `AboutPage` | Active |
| `/work` | `WorkPage` | Commented out |
| `/skills` | `SkillsPage` | Commented out |
| `/hobbies` | `HobbiesPage` | Commented out |
| `/contact` | `ContactPage` | Commented out |

**Pattern:** All pages are lazy-loaded with React.lazy() and wrapped in Suspense.

### Three.js / React Three Fiber

- **Canvas Location:** `App.jsx` (persists across routes)
- **Scene Switching:** Conditional rendering based on pathname
- **Additional Libraries:**
  - `three-mesh-bvh` - BVH acceleration for collision/picking
  - `three-custom-shader-material` - Custom GLSL shaders
  - `three-stdlib` - Standard Three.js utilities
  - `simplex-noise` - Procedural noise generation

## Build Configuration

### Vite (`vite.config.js`)

```javascript
plugins: [react(), tailwindcss()]
resolve.alias: {
  '@shader': '/src/components/planets/shader',
  '@app': '/src'
}
```

### TypeScript (`tsconfig.json`)

| Setting | Value | Notes |
|---------|-------|-------|
| `target` | ES2022 | Modern JavaScript |
| `jsx` | react-jsx | New JSX transform |
| `strict` | false | Not enforcing strict mode |
| `checkJs` | false | Not type-checking JS files |
| `moduleResolution` | Bundler | Vite-compatible resolution |

**Path Aliases:**
- `@app/*` → `src/*`
- `@shader/*` → `src/components/planets/shader/*`

### ESLint (`eslint.config.js`)

- **Format:** ESLint 9 flat config
- **Plugins:** react-hooks, react-refresh
- **Custom Rules:** Ignore unused vars starting with `[A-Z_]`
- **Ignored:** `dist/` directory

## Styling

### Tailwind CSS 4

**Configuration:** Inline in `src/index.css`

- **Color System:** OKLCH color space
- **Theme:** Light/dark mode via `.dark` class
- **Animation:** tw-animate-css plugin
- **Component Library:** shadcn/ui (New York style)

**CSS Variables (Root):**
```css
--radius: 0.625rem
--background, --foreground
--primary, --secondary, --accent
--card, --popover, --muted
--destructive, --border, --input, --ring
--chart-1 through --chart-5
--sidebar-* variants
```

### shadcn/ui Integration (`components.json`)

| Setting | Value |
|---------|-------|
| Style | new-york |
| RSC | false |
| TSX | true |
| Base Color | slate |
| CSS Variables | true |
| Icon Library | lucide |

**Aliases:**
- `@app/components` - Components
- `@app/components/ui` - UI components
- `@app/lib/utils` - Utilities
- `@app/lib` - Libraries
- `@app/hooks` - Custom hooks

## State Management

### Jotai

**Usage:** Shader settings and planet configuration

**Atoms Location:** `src/components/planets/shader/atoms/`
- `settings.ts` - Main shader settings
- `showcase.ts` - Showcase mode settings
- `minMax.ts` - Min/max value constraints

## Animation

### Framer Motion

- **2D Animations:** Page transitions, UI effects
- **3D Animations:** `framer-motion-3d` for Three.js integration
- **Usage:** Component entry/exit animations, hover effects

## Architecture Pattern

**Classification:** Component-Based SPA with 3D Canvas Layer

**Key Patterns:**
1. **Single Canvas** - Persistent Three.js canvas across routes
2. **Route-Based Scenes** - Different 3D content per route
3. **Lazy Loading** - Code-split pages for performance
4. **Atomic State** - Fine-grained reactivity via Jotai
5. **GPU Shaders** - Procedural terrain via GLSL
