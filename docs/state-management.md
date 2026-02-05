# State Management Analysis

## Overview

This project uses a hybrid state management approach:

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Shader Settings** | Jotai | Atomic state for planet configuration |
| **Routing State** | React Router | URL-based navigation state |
| **Component State** | React hooks | Local UI state (refs, useState) |
| **Animation State** | Refs + useFrame | Per-frame animation tracking |

---

## Jotai State Management

### Location
`src/components/planets/shader/atoms/`

### Architecture Pattern: Isolated Stores

Each planet creates its own Jotai store with preset values:

```jsx
// Example from Hoth.jsx
const hothStore = useMemo(() => {
    const s = createStore()
    initialValues.forEach((val, atom) => s.set(atom, val))
    return s
}, [initialValues])

return (
    <Provider store={hothStore}>
        <PlanetGPU showcase={true}/>
    </Provider>
)
```

**Benefit:** Each planet has isolated state, preventing cross-contamination.

### Atom Definitions

**File:** `settings.ts`

| Atom | Type | Default | Purpose |
|------|------|---------|---------|
| `meshResolutionAtom` | number | 144 | Geometry detail level |
| `planetRadiusAtom` | number | 2 | Planet size |
| `isWireframeAtom` | boolean | false | Debug wireframe |
| `rendersGlobeAtom` | boolean | true | Full sphere vs face |
| `isBlendAtom` | boolean | true | Color blending |
| `showsPerformanceAtom` | boolean | false | Stats display |
| `elevationGradientAtom` | GradientStop[] | [...] | Surface colors |
| `depthGradientAtom` | GradientStop[] | [...] | Ocean colors |
| `noiseFiltersAtom` | NoiseFilter[] | [...] | Terrain config |

**File:** `showcase.ts` - Showcase mode settings
**File:** `minMax.ts` - Value constraints

### Usage in Components

```tsx
// planet-gpu.tsx
const resolution = useAtomValue(meshResolutionAtom);
const wireframe = useAtomValue(isWireframeAtom);
const radius = useAtomValue(planetRadiusAtom);
```

---

## React Router State

### Configuration
**File:** `src/lib/router.tsx`

```tsx
export const router = createBrowserRouter([
    {
        path: "/",
        element: withSuspense(<AppLayout />),
        children: [
            { index: true, element: withSuspense(<div />) },
            { path: "projects", element: withSuspense(<ProjectsPage />) },
            { path: "about", element: withSuspense(<AboutPage />) },
            // ... more routes
        ],
    },
]);
```

### URL-to-Scene Mapping
**File:** `src/App.jsx`

```jsx
function SceneSwitch() {
    const { pathname } = useLocation();
    return (
        <>
            {pathname === "/" && <HeroScene />}
            {pathname.startsWith("/about") && <AboutLeft3D />}
        </>
    );
}
```

### Navigation Triggers

3D objects trigger navigation via click handlers:

```jsx
// HeroScene.jsx
<group onClick={(e) => { e.stopPropagation(); navigate('/projects') }}>
    <Chromastone position={[1, 4.3, 4.2]} />
</group>
```

---

## Component-Level State

### Refs for 3D Objects

```jsx
// HeroScene.jsx
const controlsRef = useRef();
const motorcycleRef = useRef();
```

### useState for UI

```jsx
// ProjectsPage.jsx
const [open, setOpen] = useState(null);

// SplitCanvasLayout.jsx
const [isMobile, setIsMobile] = useState(false);
```

### useRef for Animation State

```jsx
// GalaxyBackground.jsx
const pointsRef = useRef();
const groupRef = useRef();

// StarText.jsx
const basePositionsRef = useRef(null);   // Immutable baseline
const velocitiesRef = useRef(null);      // Per-axis velocities
const hoverActive = useRef(false);
```

---

## Animation State

### useFrame Pattern

Animation state tracked via refs and updated in `useFrame`:

```jsx
// GalaxyBackground.jsx
useFrame((_, dt) => {
    if (groupRef.current && rotationSpeed !== 0) {
        groupRef.current.rotation.y += rotationSpeed * dt;
    }
});
```

### Framer Motion Integration

```tsx
// planet-gpu.tsx
const rotationX = useMotionValue(0);
const rotationY = useMotionValue(0);
const springRotationX = useSpring(rotationX, { stiffness: 100, damping: 20 });
```

### Animation Controller Pattern

```jsx
// Rider.jsx
useEffect(() => {
    const { dispose, tick } = playIdleAnimation(actions, options);
    ctrlRef.current = { tick, dispose };
    return () => ctrlRef.current?.dispose?.();
}, [actions]);

useFrame((_, dt) => {
    ctrlRef.current?.tick?.(dt);
});
```

---

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interaction                      │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Click on 3D    │  │  Mouse Move     │  │  Route Change   │
│  Object         │  │  (Parallax)     │  │  (Browser)      │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  navigate()     │  │  Ref Updates    │  │  useLocation()  │
│  (React Router) │  │  (useFrame)     │  │  triggers       │
└────────┬────────┘  └─────────────────┘  └────────┬────────┘
         │                                         │
         └─────────────────┬───────────────────────┘
                           ▼
                  ┌─────────────────┐
                  │  SceneSwitch    │
                  │  re-renders     │
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │  New 3D Scene   │
                  │  Mounted        │
                  └─────────────────┘
```

---

## Best Practices Observed

1. **Isolated Jotai Stores** - Each planet gets its own store
2. **URL as Source of Truth** - Route determines scene
3. **Refs for Animation** - Avoids re-renders on every frame
4. **Lazy Loading** - Pages loaded on demand
5. **Motion Values** - Framer Motion for spring physics
