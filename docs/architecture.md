# Architecture Document

## Executive Summary

**moatas19m-portfolio** is an interactive 3D portfolio website built with React and Three.js. The application features a persistent WebGL canvas with procedurally generated planets, animated 3D characters, and a particle-based galaxy background. Users navigate by clicking 3D objects, which trigger React Router transitions while maintaining the 3D context.

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Browser                                    │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    React Application                         │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │              React Router (URL State)                │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                           │                                  │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │                 App.jsx (Root Layout)                │    │   │
│  │  │  ┌─────────────────────────────────────────────┐    │    │   │
│  │  │  │         Three.js Canvas (Persistent)         │    │    │   │
│  │  │  │  ┌─────────────────────────────────────┐    │    │    │   │
│  │  │  │  │  GalaxyBackground (200k particles)  │    │    │    │   │
│  │  │  │  ├─────────────────────────────────────┤    │    │    │   │
│  │  │  │  │  SceneSwitch (Route-based 3D)       │    │    │    │   │
│  │  │  │  │  ├── HeroScene (/)                  │    │    │    │   │
│  │  │  │  │  └── AboutLeft3D (/about)           │    │    │    │   │
│  │  │  │  └─────────────────────────────────────┘    │    │    │   │
│  │  │  └─────────────────────────────────────────────┘    │    │   │
│  │  │  ┌─────────────────────────────────────────────┐    │    │   │
│  │  │  │              Outlet (Page Content)           │    │    │   │
│  │  │  └─────────────────────────────────────────────┘    │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                         WebGL Context                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Architecture Pattern

**Pattern:** Component-Based SPA with Persistent 3D Canvas Layer

**Key Characteristics:**
1. **Single Canvas** - One Three.js canvas persists across all routes
2. **Route-Based Scenes** - Different 3D content per route via SceneSwitch
3. **Layered Rendering** - 3D canvas (z-index: 0) + DOM content (z-index: 20)
4. **Atomic State** - Jotai atoms for fine-grained shader reactivity
5. **Lazy Loading** - Pages loaded on demand for performance

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **UI Framework** | React | 18.3.1 |
| **Routing** | React Router DOM | 6.30.1 |
| **3D Engine** | Three.js | 0.166.1 |
| **3D Bindings** | @react-three/fiber | 8.16.8 |
| **3D Helpers** | @react-three/drei | 9.108.1 |
| **Build Tool** | Vite | 7.1.0 |
| **Styling** | Tailwind CSS | 4.1.11 |
| **State** | Jotai | 2.8.4 |
| **Animation** | Framer Motion | 11.3.8 |
| **Types** | TypeScript | 5.9.3 (partial) |

---

## Component Architecture

### Core Components

```
App.jsx (Root)
├── ErrorBoundary
│   └── Canvas (Three.js)
│       ├── Lights (hemisphere + directional)
│       ├── Environment (sunset preset)
│       ├── GalaxyBackground
│       ├── SubtleCameraParallax
│       └── SceneSwitch
│           ├── HeroScene (/)
│           │   ├── OrbitControls
│           │   ├── StarText
│           │   ├── Hoth → /work
│           │   ├── Chromastone → /projects
│           │   ├── Coruscant → /skills
│           │   ├── Mustafar → /contact
│           │   ├── Rider → /about
│           │   ├── Motorcycle → /hobbies
│           │   └── ContactShadows
│           └── AboutLeft3D (/about)
│               └── Rider
└── Outlet (DOM pages)
    ├── AboutPage
    ├── ProjectsPage
    └── ... (placeholder pages)
```

### Component Categories

| Category | Count | Description |
|----------|-------|-------------|
| Core | 3 | App, HeroScene, ErrorBoundary |
| Background | 2 | GalaxyBackground, WarpTunnel |
| Planets | 4 | Hoth, Chromastone, Coruscant, Mustafar |
| Characters | 2 | Rider, Motorcycle |
| Camera | 2 | CameraController, SubtleCameraParallax |
| UI | 2 | CardSpotlight, CanvasRevealEffect |
| Sections | 1 | StarText |
| Pages | 7 | About, Projects, Skills, Work, Hobbies, Contact + Layout |

---

## Data Flow

### Rendering Pipeline

```
main.jsx
    └── RouterProvider
        └── App.jsx
            ├── Canvas (Three.js context)
            │   ├── useFrame loop (60fps)
            │   │   ├── GalaxyBackground rotation
            │   │   ├── Camera parallax
            │   │   └── Animation ticks
            │   └── Scene graph
            │       └── Meshes, lights, etc.
            └── Outlet
                └── Page components (DOM)
```

### State Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Action   │────▶│   State Change  │────▶│   Re-render     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Click 3D object │────▶│ navigate()      │────▶│ SceneSwitch     │
│                 │     │ (React Router)  │     │ renders new 3D  │
└─────────────────┘     └─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Mouse move      │────▶│ Ref update      │────▶│ useFrame reads  │
│                 │     │ (no re-render)  │     │ and applies     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Planet State (Jotai)

```
Planet Component (e.g., Hoth.jsx)
    │
    ▼
┌─────────────────────────────┐
│ Create isolated Jotai store │
│ with preset atom values     │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ Provider wraps PlanetGPU    │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ useAtomValue() reads:       │
│ - meshResolutionAtom        │
│ - planetRadiusAtom          │
│ - elevationGradientAtom     │
│ - noiseFiltersAtom          │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ TerrainFace renders with    │
│ GPU shaders                 │
└─────────────────────────────┘
```

---

## Routing Architecture

### Route Configuration

```typescript
// src/lib/router.tsx
createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <div /> },      // Empty (3D only)
            { path: "projects", element: <ProjectsPage /> },
            { path: "about", element: <AboutPage /> },
            // ... more routes
        ],
    },
])
```

### Route-to-Scene Mapping

| Route | 3D Scene | DOM Content |
|-------|----------|-------------|
| `/` | HeroScene | Empty |
| `/about` | AboutLeft3D (Rider) | CardSpotlight bio |
| `/projects` | - | Project cards grid |
| `/work` | - | Placeholder |
| `/skills` | - | Placeholder |
| `/hobbies` | - | Placeholder |
| `/contact` | - | Placeholder |

### Navigation Triggers

3D objects in HeroScene trigger navigation:

| Object | Target Route |
|--------|--------------|
| Hoth (ice planet) | `/work` |
| Chromastone (purple) | `/projects` |
| Coruscant (city) | `/skills` |
| Mustafar (lava) | `/contact` |
| Rider | `/about` |
| Motorcycle | `/hobbies` |

---

## Shader System Architecture

### Directory Structure

```
src/components/planets/shader/
├── atoms/                  # Jotai state
│   ├── settings.ts        # Core planet settings
│   ├── showcase.ts        # Display mode
│   └── minMax.ts          # Value constraints
├── components/
│   ├── planet-gpu/        # GPU-rendered planet
│   │   ├── planet-gpu.tsx # Main component
│   │   └── terrain-face.tsx
│   ├── atmosphere/        # Glow effect
│   └── wire-face/         # Debug wireframe
├── glsl/                  # GLSL shaders
│   ├── planet/
│   ├── atmosphere/
│   └── compute/
└── lib/                   # Utilities
    ├── noise.ts           # Noise generators
    ├── gradient.ts        # Color gradients
    └── ...
```

### Noise System

| Class | Algorithm | Use Case |
|-------|-----------|----------|
| `SimpleNoiseFilter` | Layered simplex | Rolling terrain |
| `RidgidNoiseFilter` | Ridge-enhanced | Mountains, peaks |

**Parameters:**
- `strength` - Amplitude
- `roughness` - Frequency multiplier
- `baseRoughness` - Initial frequency
- `persistence` - Amplitude decay
- `layerCount` - Octaves
- `center` - Offset (Vector3)
- `minValue` - Base elevation

---

## Performance Considerations

### Optimizations Implemented

| Technique | Location | Impact |
|-----------|----------|--------|
| Lazy loading | router.tsx | Reduced initial bundle |
| GLTF preload | Motorcycle, Rider | Faster model display |
| Ref-based animation | All 3D components | No re-renders on frame |
| Isolated Jotai stores | Planets | No cross-component updates |
| AdditiveBlending | Galaxy | Efficient particle rendering |
| depthWrite: false | Particles | Correct transparency |

### Performance Budgets

| Metric | Target | Current |
|--------|--------|---------|
| Galaxy particles | ≤200k | 200k |
| Planet resolution | ≤144 | 144 |
| 3D models | ≤2 | 2 (rider, motorcycle) |
| Concurrent animations | ≤5 | ~4 |

---

## Security Considerations

### Current Status

| Aspect | Status | Notes |
|--------|--------|-------|
| Environment variables | `.env` gitignored | ✅ Secure |
| API calls | None | N/A |
| User input | Click only | Low risk |
| Dependencies | npm audit | Regular updates needed |

### Recommendations

1. Run `npm audit` regularly
2. Keep dependencies updated
3. Add CSP headers in deployment
4. Consider subresource integrity for CDN assets

---

## Extensibility Points

### Adding New Features

| Feature | Extension Point |
|---------|-----------------|
| New planet | Copy existing planet, modify atoms |
| New route | Add to router.tsx + SceneSwitch |
| New 3D effect | Add to Canvas in App.jsx |
| New UI component | Add to src/components/ui/ |
| New animation | Add to component's useFrame |

### Plugin Points

1. **Jotai atoms** - Add new atoms for additional state
2. **Noise filters** - Create new filter classes
3. **GLSL shaders** - Add to shader/glsl/
4. **drei components** - Leverage existing helpers

---

## Deployment Architecture

### Current State

- **Build output:** Static files in `dist/`
- **CI/CD:** Not configured
- **Hosting:** Static hosting compatible

### Recommended Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GitHub Repo   │────▶│   Vercel/       │────▶│   CDN Edge      │
│                 │     │   Netlify       │     │   (Global)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│ git push        │     │ Auto build      │
│ triggers        │     │ npm run build   │
└─────────────────┘     └─────────────────┘
```

---

## Appendix

### Key Files Reference

| File | Purpose |
|------|---------|
| `src/main.jsx` | Application entry point |
| `src/App.jsx` | Root layout with Canvas |
| `src/lib/router.tsx` | Route definitions |
| `src/components/HeroScene.jsx` | Main 3D scene |
| `src/components/planets/shader/atoms/settings.ts` | Planet state |

### Dependencies Graph

```
React
├── react-dom
├── react-router-dom
└── @react-three/fiber
    └── three
        ├── @react-three/drei
        ├── three-mesh-bvh
        └── three-custom-shader-material

jotai (independent)
framer-motion
├── framer-motion-3d
tailwindcss
└── @tailwindcss/vite
```
