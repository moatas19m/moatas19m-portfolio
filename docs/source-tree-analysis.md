# Source Tree Analysis

## Project Root Structure

```
moatas19m-portfolio/
│
├── 📄 index.html                    # HTML entry point (title: "Moatasim bin Hisham")
├── 📄 package.json                  # Project manifest (dependencies, scripts)
├── 📄 package-lock.json             # Dependency lock file
├── 📄 yarn.lock                     # Yarn lock file
├── 📄 vite.config.js                # Vite build configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 eslint.config.js              # ESLint flat config
├── 📄 components.json               # shadcn/ui configuration
├── 📄 README.md                     # Project readme (boilerplate)
├── 📄 CLAUDE.md                     # AI assistant guidance
├── 📄 .env                          # Environment variables
├── 📄 .gitignore                    # Git ignore rules
│
├── 📁 src/                          # ⭐ SOURCE CODE
├── 📁 public/                       # Static assets (served as-is)
├── 📁 docs/                         # Generated documentation (this!)
├── 📁 node_modules/                 # Dependencies (ignored)
│
├── 📁 .cursor/                      # Cursor AI rules
├── 📁 .taskmaster/                  # Taskmaster config
├── 📁 _bmad/                        # BMAD workflow system
├── 📁 _bmad-output/                 # BMAD outputs
├── 📁 .git/                         # Git repository
└── 📁 .idea/                        # WebStorm config
```

---

## Source Directory (`src/`)

```
src/
│
├── 📄 main.jsx                      # ⭐ ENTRY POINT - React root, RouterProvider
├── 📄 App.jsx                       # ⭐ ROOT LAYOUT - Persistent Canvas, SceneSwitch
├── 📄 App.css                       # Legacy CSS (unused)
├── 📄 index.css                     # Global styles, Tailwind config, CSS variables
├── 📄 shims-glsl.d.ts               # TypeScript declarations for .glsl imports
│
├── 📁 lib/                          # Core libraries
│   ├── 📄 router.tsx                # ⭐ ROUTING - React Router configuration
│   └── 📄 utils.ts                  # Utilities (cn, preload, PreloadOnView)
│
├── 📁 components/                   # React components
│   ├── 📄 HeroScene.jsx             # ⭐ MAIN SCENE - Planets, rider, motorcycle
│   ├── 📄 ErrorBoundary.jsx         # Error handling wrapper
│   │
│   ├── 📁 background/               # Background effects
│   │   ├── 📄 GalaxyBackground.jsx  # ⭐ 200k particle galaxy
│   │   └── 📁 animations/
│   │       └── 📄 WarpTunnel.jsx    # Warp effect (commented out)
│   │
│   ├── 📁 camera/                   # Camera controls
│   │   └── 📄 CameraController.jsx  # Route-aware camera config
│   │
│   ├── 📁 motorcycle/               # Motorcycle 3D model
│   │   ├── 📄 Motorcycle.jsx        # GLTF loader, auto-scaling
│   │   └── 📁 animations/
│   │       └── 📄 ScrollAnimation.jsx  # Scroll-driven motion (unused)
│   │
│   ├── 📁 rider/                    # Rider 3D character
│   │   ├── 📄 Rider.jsx             # GLTF loader, animation controller
│   │   └── 📁 animations/
│   │       └── 📄 idlePoseAnimation.jsx  # ⭐ Complex animation sequencer
│   │
│   ├── 📁 planets/                  # ⭐ PROCEDURAL PLANETS
│   │   ├── 📄 Hoth.jsx              # Ice planet (teal/cyan)
│   │   ├── 📄 Chromastone.jsx       # Crystal planet (purple/pink)
│   │   ├── 📄 Coruscant.jsx         # City planet (blue/violet)
│   │   ├── 📄 Mustafar.jsx          # Lava planet (red/orange)
│   │   │
│   │   └── 📁 shader/               # ⭐ GPU SHADER SYSTEM
│   │       ├── 📁 atoms/            # Jotai state atoms
│   │       │   ├── 📄 settings.ts   # Main shader settings
│   │       │   ├── 📄 showcase.ts   # Showcase mode
│   │       │   └── 📄 minMax.ts     # Value constraints
│   │       │
│   │       ├── 📁 components/       # Shader components
│   │       │   ├── 📁 planet-gpu/   # GPU-rendered planet
│   │       │   │   ├── 📄 planet-gpu.tsx    # Main planet mesh
│   │       │   │   └── 📄 terrain-face.tsx  # Individual face
│   │       │   ├── 📁 planet-cpu/   # CPU fallback (unused)
│   │       │   │   ├── 📄 planet.tsx
│   │       │   │   ├── 📄 mesh-generation.ts
│   │       │   │   └── 📄 terrain-face.tsx
│   │       │   ├── 📁 wire-face/    # Wireframe preview
│   │       │   │   └── 📄 wire-face.tsx
│   │       │   └── 📁 atmosphere/   # Atmospheric glow
│   │       │       └── 📄 atmosphere.tsx
│   │       │
│   │       ├── 📁 glsl/             # GLSL shaders
│   │       │   ├── 📁 atmosphere/
│   │       │   │   ├── 📄 atmosphere.fs
│   │       │   │   └── 📄 atmosphere.vs
│   │       │   ├── 📁 compute/
│   │       │   │   ├── 📄 buffer.vs
│   │       │   │   └── 📄 vertex-compute.fs
│   │       │   └── 📁 planet/
│   │       │       ├── 📄 planet.fs
│   │       │       └── 📄 planet.vs
│   │       │
│   │       └── 📁 lib/              # Shader utilities
│   │           ├── 📄 noise.ts      # ⭐ SimpleNoiseFilter, RidgidNoiseFilter
│   │           ├── 📄 gradient.ts   # GradientStop class
│   │           ├── 📄 vector.ts     # Vector constants
│   │           ├── 📄 gpu-compute.ts
│   │           ├── 📄 animation-variants.ts
│   │           ├── 📄 spherize.ts
│   │           ├── 📄 min-max.ts
│   │           ├── 📄 lerp.ts
│   │           ├── 📄 map.ts
│   │           ├── 📄 clamp.ts
│   │           ├── 📄 pad.ts
│   │           ├── 📄 cn.ts
│   │           ├── 📄 export-mesh.ts
│   │           ├── 📄 generate-planet-name.ts
│   │           └── 📄 get-repo-stars.ts
│   │
│   └── 📁 ui/                       # UI component library
│       ├── 📄 card-spotlight.tsx    # Mouse-tracking spotlight card
│       └── 📄 canvas-reveal-effect.tsx  # Animated dot matrix shader
│
├── 📁 pages/                        # Route pages
│   ├── 📄 AboutPage.jsx             # About page (CardSpotlight + Rider 3D)
│   ├── 📄 ProjectsPage.jsx          # Projects grid with modal
│   ├── 📄 SkillsPage.jsx            # Placeholder
│   ├── 📄 WorkPage.jsx              # Placeholder
│   ├── 📄 HobbiesPage.jsx           # Placeholder
│   ├── 📄 ContactPage.jsx           # Placeholder
│   └── 📁 layouts/
│       └── 📄 SplitCanvasLayout.jsx # Split view layout (deprecated)
│
├── 📁 sections/                     # Page sections
│   └── 📄 StarText.jsx              # ⭐ Particle text with hover scatter
│
├── 📁 constants/                    # Configuration constants
│   ├── 📄 cameraConfig.js           # Camera position/FOV per route
│   ├── 📄 controlsConfig.js         # OrbitControls settings per route
│   └── 📄 limbs.js                  # Rider bone names
│
├── 📁 utils/                        # Utility components
│   └── 📄 SubtleCameraParallax.jsx  # Mouse-driven camera parallax
│
└── 📁 assets/                       # Static assets
    └── 📁 models/
        ├── 📄 motorcycle.glb        # 3D motorcycle model
        └── 📄 rider.glb             # 3D rider character (with animations)
```

---

## Critical Paths

### Entry Flow
```
index.html
    └── src/main.jsx (React root)
        └── src/lib/router.tsx (RouterProvider)
            └── src/App.jsx (Root layout + Canvas)
                ├── GalaxyBackground (always)
                ├── SubtleCameraParallax (always)
                └── SceneSwitch (route-based)
                    ├── "/" → HeroScene
                    └── "/about" → AboutLeft3D
```

### 3D Rendering Pipeline
```
App.jsx <Canvas>
    ├── Lights (hemisphere + directional)
    ├── Environment (sunset preset)
    ├── GalaxyBackground (200k particles)
    ├── SubtleCameraParallax
    └── SceneSwitch
        └── HeroScene
            ├── OrbitControls
            ├── StarText (particle name)
            ├── Hoth (→ /work)
            ├── Chromastone (→ /projects)
            ├── Coruscant (→ /skills)
            ├── Mustafar (→ /contact)
            ├── Rider (→ /about)
            ├── Motorcycle (→ /hobbies)
            └── ContactShadows
```

### Shader System Data Flow
```
Planet Component (e.g., Hoth.jsx)
    └── Creates Jotai store with presets
        └── Provider wraps PlanetGPU
            └── PlanetGPU reads atoms
                └── TerrainFace × 6 directions
                    └── GLSL shaders compute vertices
                        └── Noise filters (Simple/Ridgid)
                            └── Gradient colors applied
```

---

## Key File Purposes

| File | Purpose | Dependencies |
|------|---------|--------------|
| `main.jsx` | React entry, mounts app | router.tsx |
| `App.jsx` | Canvas + routing shell | All 3D components |
| `router.tsx` | Route definitions | All pages |
| `HeroScene.jsx` | Main interactive scene | All planets, rider, motorcycle |
| `GalaxyBackground.jsx` | Background particles | Three.js |
| `planet-gpu.tsx` | Planet renderer | terrain-face, Jotai atoms |
| `noise.ts` | Procedural terrain | simplex-noise |
| `idlePoseAnimation.jsx` | Character animation | Three.js AnimationMixer |

---

## Integration Points

### React Router ↔ Three.js
- `useLocation()` in `SceneSwitch` determines which 3D scene renders
- `useNavigate()` in `HeroScene` triggered by 3D object clicks

### Jotai ↔ Three.js
- Each planet wraps `PlanetGPU` in isolated `Provider`
- Atoms drive mesh resolution, colors, noise parameters

### Framer Motion ↔ Three.js
- `framer-motion-3d` provides `motion.group` and `motion.mesh`
- `useSpring` for smooth rotation values
