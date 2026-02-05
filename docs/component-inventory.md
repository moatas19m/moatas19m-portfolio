# Component Inventory

## Overview

| Category | Count | Description |
|----------|-------|-------------|
| **Core Components** | 3 | App layout, error handling, scene orchestration |
| **3D Components** | 8 | Galaxy, planets, motorcycle, rider, camera |
| **UI Components** | 2 | Card spotlight, canvas reveal effect |
| **Pages** | 7 | Route page components |
| **Utilities** | 4 | Camera parallax, preloading, className merge |
| **Shader System** | 12+ | Procedural planet generation |

---

## Core Components

### App.jsx
**Location:** `src/App.jsx`
**Purpose:** Root layout with persistent Three.js Canvas

**Key Features:**
- Single `<Canvas>` that persists across all routes
- `SceneSwitch` component for route-based 3D scene switching
- Global lighting (hemisphere + directional + Environment preset)
- Galaxy background (200k particles)
- Subtle camera parallax on mouse movement
- Bottom vignette gradient overlay

**Routes Handled:**
- `/` → `<HeroScene />`
- `/about` → `<AboutLeft3D />`

### HeroScene.jsx
**Location:** `src/components/HeroScene.jsx`
**Purpose:** Main 3D scene with interactive elements

**3D Elements:**
- `StarText` - Particle-based name display with hover scatter effect
- `Hoth` - Ice planet → links to `/work`
- `Chromastone` - Purple planet → links to `/projects`
- `Coruscant` - City planet → links to `/skills`
- `Mustafar` - Lava planet → links to `/contact`
- `Rider` - 3D character → links to `/about`
- `Motorcycle` - 3D vehicle → links to `/hobbies`
- `ContactShadows` - Ground shadow effect

**Interaction Pattern:** Click handlers on groups trigger React Router navigation

### ErrorBoundary.jsx
**Location:** `src/components/ErrorBoundary.jsx`
**Purpose:** Graceful error handling for 3D scene failures

---

## 3D Components

### GalaxyBackground.jsx
**Location:** `src/components/background/GalaxyBackground.jsx`
**Purpose:** Procedural spiral galaxy particle system

**Props:**
| Prop | Default | Description |
|------|---------|-------------|
| `count` | 60000 | Number of particles |
| `size` | 0.05 | Particle size |
| `radius` | 12 | Galaxy radius |
| `branches` | 4 | Spiral arm count |
| `spin` | 1.2 | Spiral tightness |
| `insideColor` | #ff6030 | Center color |
| `outsideColor` | #1b3984 | Edge color |
| `fadeIn` | 0.8 | Fade-in duration (seconds) |
| `rotationSpeed` | 0.08 | Auto-rotation speed |

**Implementation:** BufferGeometry with position/color attributes, AdditiveBlending

### Planet Components
**Location:** `src/components/planets/`

| Component | Theme | Radius | Colors |
|-----------|-------|--------|--------|
| `Hoth.jsx` | Ice world | 1.5 | Teal → Cyan → White |
| `Chromastone.jsx` | Crystal | 1.6 | Purple → Magenta → Pink |
| `Coruscant.jsx` | City | 0.8 | Deep blue → Violet → White |
| `Mustafar.jsx` | Lava | 0.9 | Yellow → Red → Orange |

**Pattern:** Each planet creates isolated Jotai store with preset atom values for:
- `meshResolutionAtom` - Geometry detail (144)
- `planetRadiusAtom` - Size
- `elevationGradientAtom` - Surface color gradient
- `depthGradientAtom` - Ocean/low areas color
- `noiseFiltersAtom` - Terrain noise layers (Simple + Ridgid)

### Motorcycle.jsx
**Location:** `src/components/motorcycle/Motorcycle.jsx`
**Purpose:** GLTF 3D motorcycle model

**Features:**
- Auto-scaling to target size (4 units)
- Shadow casting/receiving
- GLTF preloading

### Rider.jsx
**Location:** `src/components/rider/Rider.jsx`
**Purpose:** Animated 3D character model

**Animations:**
- `fall-landing` - Initial drop
- `walking` - Walk cycle
- `warrior-idle` - Idle stance (loop)
- `ninja-idle` - Alt idle (loop)

**Animation System:** Custom `playIdleAnimation()` with:
- Sequential initial animations
- Looping idle pattern
- Hip tracking for world-space movement
- Early exit from walk → idle

### CameraController.jsx
**Location:** `src/components/camera/CameraController.jsx`
**Purpose:** Route-aware camera configuration

**Configs:**
- Home: position [10, 1, 0], FOV 60
- Other: position [10, 1, 0], FOV 40

### SubtleCameraParallax.jsx
**Location:** `src/utils/SubtleCameraParallax.jsx`
**Purpose:** Mouse-driven camera parallax effect

**Parameters:**
- `strength` - Sensitivity multiplier
- `maxYaw` - Horizontal cap (~9°)
- `maxPitch` - Vertical cap (~6°)
- `damping` - Smoothing factor

---

## UI Components

### CardSpotlight.tsx
**Location:** `src/components/ui/card-spotlight.tsx`
**Purpose:** Card with mouse-tracking spotlight effect

**Features:**
- Radial gradient follows cursor
- `CanvasRevealEffect` on hover
- Framer Motion animations

### CanvasRevealEffect.tsx
**Location:** `src/components/ui/canvas-reveal-effect.tsx`
**Purpose:** Animated dot matrix shader effect

**Implementation:**
- Nested Three.js Canvas
- Custom GLSL fragment shader
- Configurable colors, opacities, animation speed

---

## Pages

| Page | Route | 3D Content | DOM Content |
|------|-------|------------|-------------|
| `AboutPage.jsx` | `/about` | Rider character | CardSpotlight with bio |
| `ProjectsPage.jsx` | `/projects` | Chromastone + Rider | Project cards grid |
| `SkillsPage.jsx` | `/skills` | - | Placeholder |
| `WorkPage.jsx` | `/work` | - | Placeholder |
| `HobbiesPage.jsx` | `/hobbies` | - | Placeholder |
| `ContactPage.jsx` | `/contact` | - | Placeholder |

### SplitCanvasLayout.jsx
**Location:** `src/pages/layouts/SplitCanvasLayout.jsx`
**Purpose:** Layout with left 3D pane + right content (marked for deletion)

---

## Sections

### StarText.jsx
**Location:** `src/sections/StarText.jsx`
**Purpose:** 3D particle text with interactive scatter effect

**Features:**
- Text converted to ShapeGeometry
- MeshSurfaceSampler for particle distribution
- Physics-based hover repulsion
- Spring-back animation to base positions

**Props:**
- `text` - Display text (supports `\n`)
- `particleCount` - Number of particles (15000)
- `hoverRadius` - Interaction radius
- `burst` - Push strength
- `returnSpeed` - Spring-back speed

---

## Shader System

**Location:** `src/components/planets/shader/`

### Atoms (Jotai State)
| Atom | Purpose |
|------|---------|
| `meshResolutionAtom` | Geometry subdivision level |
| `planetRadiusAtom` | Planet size |
| `isWireframeAtom` | Wireframe toggle |
| `rendersGlobeAtom` | Full sphere vs single face |
| `isBlendAtom` | Color blending toggle |
| `elevationGradientAtom` | Surface color stops |
| `depthGradientAtom` | Ocean color stops |
| `noiseFiltersAtom` | Terrain noise configuration |

### Noise System (`lib/noise.ts`)
| Class | Purpose |
|-------|---------|
| `SimpleNoiseFilter` | Standard simplex noise layers |
| `RidgidNoiseFilter` | Ridge-enhanced noise (mountains) |

**Parameters:**
- `strength`, `roughness`, `baseRoughness`
- `persistence`, `layerCount`
- `center` (Vector3), `minValue`
- `useFirstLayerAsMask`

### Gradient System (`lib/gradient.ts`)
- `GradientStop` class with anchor + RGBA color
- `gradientToString()` for CSS conversion

### GPU Components
- `planet-gpu.tsx` - Main planet renderer with 6 terrain faces
- `terrain-face.tsx` - Individual face mesh generation
- `wire-face.tsx` - Wireframe preview face
- `atmosphere.tsx` - Atmospheric glow effect

---

## Utilities

### lib/utils.ts
| Export | Purpose |
|--------|---------|
| `cn()` | Tailwind className merge (clsx + twMerge) |
| `preload()` | Trigger lazy import |
| `PreloadOnView` | IntersectionObserver preload component |

### Constants
| File | Purpose |
|------|---------|
| `cameraConfig.js` | Camera position/FOV per route |
| `controlsConfig.js` | OrbitControls settings per route |
| `limbs.js` | Bone names for rider animation |
