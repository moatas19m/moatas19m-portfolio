---
stepsCompleted: [1, 2, 3, 4, 5]
status: complete
inputDocuments: []
workflowType: 'research'
lastStep: 1
research_type: 'technical'
research_topic: 'WebGPU vs WebGL Performance, React Three Fiber Overhead, and Shader Optimization for Portfolio Websites'
research_goals: 'Evaluate rendering pipeline differences (WebGL vs WebGPU), investigate React Three Fiber overhead, research shader optimization techniques, and evaluate vanilla Three.js as an alternative'
user_name: 'Sir'
date: '2026-02-05'
web_research_enabled: true
source_verification: true
---

# Research Report: Technical

**Date:** 2026-02-05
**Author:** Sir
**Research Type:** Technical

---

## Research Overview

This research investigates performance optimization strategies for 3D portfolio websites, covering:
- WebGPU vs WebGL rendering pipeline differences
- React Three Fiber integration overhead analysis
- Shader optimization techniques for procedural planet generation
- Evaluation of vanilla Three.js as an alternative to React Three Fiber

---

<!-- Content will be appended sequentially through research workflow steps -->

## Technical Research Scope Confirmation

**Research Topic:** WebGPU vs WebGL Performance, React Three Fiber Overhead, and Shader Optimization for Portfolio Websites

**Research Goals:** Evaluate rendering pipeline differences (WebGL vs WebGPU), investigate React Three Fiber overhead, research shader optimization techniques, and evaluate vanilla Three.js as an alternative

**Technical Research Scope:**

- Architecture Analysis - WebGL vs WebGPU rendering architectures, React reconciliation overhead, Three.js scene graph patterns
- Implementation Approaches - Direct Three.js vs R3F patterns, shader optimization techniques, GPU compute strategies
- Technology Stack - WebGPU browser support (2026), Three.js WebGPU renderer maturity, performance profiling tools
- Integration Patterns - React virtual DOM interaction with Three.js, abstraction tradeoffs
- Performance Considerations - Draw call overhead, shader complexity, memory management, frame budgets

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2026-02-05

---

## Technology Stack Analysis

### Rendering APIs: WebGL vs WebGPU

#### WebGL (Current Standard)
WebGL has been the dominant web graphics API, built on OpenGL ES. However, there are no more updates planned to OpenGL (and therefore WebGL), so it won't get any new features.

_Current Status:_ Mature, universally supported, but architecturally limited
_Performance Profile:_ Single-threaded command submission, higher CPU overhead
_Browser Support:_ ~99% of browsers
_Source: [MDN WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)_

#### WebGPU (Next Generation)
WebGPU represents a fundamental architectural upgrade that changes how browsers talk to graphics hardware. It exposes modern GPU capabilities inspired by Vulkan, Metal, and Direct3D 12.

_2026 Browser Support Status:_
- Chrome/Edge: Supported since v113 (Windows, macOS, ChromeOS)
- Safari: Shipped by default in iOS 26, iPadOS 26, macOS Tahoe 26 (September 2025)
- Firefox 147: Released January 2026 with WebGPU on Windows and ARM64 macOS
- Global coverage: ~70% as of late 2024, growing steadily

_Performance Gains:_
- Compute shaders: 150x improvement (100,000 particles in <2ms vs WebGL limitations)
- Draw-call-heavy scenarios: Up to 10x improvement
- CPU frame time: Often halved with identical visuals
- Multi-threaded command preparation: Substantially reduced CPU overhead
- AI inference: 80% of native performance in browser

_Source: [WebGPU 2026: 70% Browser Support, 15x Performance Gains](https://byteiota.com/webgpu-2026-70-browser-support-15x-performance-gains/)_

#### Critical Caveats for WebGPU
- With Three.js, WebGPU sometimes **underperforms** WebGL in high-polygon scenes with many unbatched meshes (reported 10x slower in some cases)
- Shadow mapping issues reported in certain configurations
- ~45% of older devices lack storage buffer support in vertex shaders, requiring compatibility mode
- GPU vendor bugs: NVIDIA 572.xx drivers crash RTX 30/40; AMD HD 7700 produces artifacts

_Source: [Three.js GitHub Issue #31055](https://github.com/mrdoob/three.js/issues/31055), [Three.js Forum Discussion](https://discourse.threejs.org/t/the-new-webgl-vs-webgpu-performance-comparison-example/69097)_

---

### Three.js WebGPURenderer Status

#### Production Readiness
The biggest change is **production-ready WebGPU support**. Since r171 (September 2025), you can import WebGPURenderer with zero configuration and automatic WebGL 2 fallback.

_Key Features:_
- Zero-config imports since r171
- Automatic WebGL 2 fallback for unsupported browsers
- Compute shader support
- Modern resource management
- Async initialization required

_Weekly npm downloads:_ 2.7 million (Three.js remains dominant)

_Source: [What's New in Three.js (2026)](https://www.utsubo.com/blog/threejs-2026-what-changed), [Three.js WebGPURenderer Docs](https://threejs.org/docs/pages/WebGPURenderer.html)_

---

### Development Frameworks: React Three Fiber vs Vanilla Three.js

#### React Three Fiber (R3F)
React Three Fiber is a React renderer for Three.js that provides declarative, component-based 3D scene management.

_Performance Reality (Verified):_
- **Official stance:** "No overhead since components render outside of React" - R3F docs claim it outperforms vanilla Three.js in scale due to React's scheduling abilities
- **Real-world reports:** Some developers observe worse performance with custom buffer geometries in Chrome compared to vanilla Three.js
- **Bundle size:** Additional React layer increases bundle size and initial load time

_Key Advantages:_
- React 18 can defer heavy tasks to maintain stable framerate
- Cleaner, more maintainable code for complex scenes
- Excellent for React-based applications
- Strong ecosystem (@react-three/drei, @react-three/postprocessing)

_Source: [R3F Scaling Performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [R3F vs Vanilla Comparison](https://elkayal.me/article/react-three-fiber-vs-vanilla-three-js-what%E2%80%99s-right-for-your-project/)_

#### Vanilla Three.js
_Performance Reality:_
- Direct GPU control without abstraction layers
- Better fine-tuning for high-performance needs
- Smaller bundle size, faster initial load
- Full control over render loop and lifecycle

_When to Choose:_
- Maximum performance is critical
- Simple scenes without complex state management
- Non-React applications
- When every millisecond matters

_Source: [Graffersid Comparison 2026](https://graffersid.com/react-three-fiber-vs-three-js/)_

---

### Shader Languages and Optimization

#### GLSL (WebGL) / WGSL (WebGPU)
_GLSL Optimization Techniques:_
- Move calculations to vertex shader (runs less frequently than fragment shader)
- Replace conditionals (if statements) with `step()` or `mix()` functions
- Use built-in GLSL functions (faster than manual implementations)
- MAD operations (multiply-then-add) are "single cycle" or faster
- Inline functions to reduce overhead

_Texture Optimization:_
- Reduce texture lookups
- Use GL_NEAREST for non-blurred textures
- Prefer efficient formats (GL_RGBA8 over GL_RGBA32F)

_Draw Call Optimization:_
- Geometry merging: Combine separate meshes into single draw calls
- Depth prepass: Reduce rasterized color fragments for complex shaders

_Source: [Khronos GLSL Optimizations](https://www.khronos.org/opengl/wiki/GLSL_Optimizations), [60 to 1500 FPS Optimization](https://medium.com/@dhiashakiry/60-to-1500-fps-optimising-a-webgl-visualisation-d79705b33af4)_

---

### Procedural Planet Shader Optimization

#### Noise Function Selection
_Simplex vs Perlin:_
- **Simplex noise** is ideal for 3D/4D as it uses fewer hash/noise samples
- Simple Perlin can be sufficient for many applications
- Each octave increases GPU work — more octaves = fewer FPS

_Baking Strategy:_
- Pre-compute noise to textures rather than calculating in fragment shader every frame
- Significant computation reduction for static or slowly-changing content

_GPU Compute for Mesh Generation:_
- Use compute shaders to calculate vertex positions (faster than CPU-based)
- CPU mesh generation is "pretty laggy especially if the resolution is high"

_Level of Detail (LOD):_
- Chunked LOD (CPU) or Quadtree LOD (GPU) options available
- Critical for high-resolution procedural planets

_Source: [Three.js Forum - Procedural Planet GPGPU](https://discourse.threejs.org/t/procedural-planet-mesh-generator-gpgpu/69389), [10 Noise Functions for TSL Shaders](https://threejsroadmap.com/blog/10-noise-functions-for-threejs-tsl-shaders)_

---

### Development Tools and Profiling Platforms

#### Essential Performance Tools (2026)
| Tool | Purpose | WebGPU Support |
|------|---------|----------------|
| **stats-gl** | Real-time FPS/CPU/GPU monitoring | Yes |
| **Spector.js** | WebGL frame capture, draw call analysis | WebGL only |
| **lil-gui** | Live parameter tweaking | Yes |
| **three-mesh-bvh** | Fast raycasting | Yes |
| **renderer.info** | Memory and draw call stats | Yes |
| **Chrome DevTools** | Frame timing, memory analysis | Yes |

_Spector.js Details:_
- Chrome/Firefox extension
- Records each draw call with snapshot data and screenshots
- Compatible with vanilla Three.js and React Three Fiber
- Invaluable for understanding frame-by-frame scene behavior

_Source: [Three.js Forum - Performance Profiling Tools](https://discourse.threejs.org/t/performance-profiling-tools-cpu-gpu/17469), [100 Three.js Best Practices](https://www.utsubo.com/blog/threejs-best-practices-100-tips)_

---

### Technology Adoption Recommendations

#### Progressive Enhancement Strategy
**Recommended Approach:** WebGPU primary with WebGL fallback
- Captures performance gains for ~70% of users
- Doesn't abandon the remaining ~30% on older devices/browsers
- Three.js r171+ handles this automatically

_Migration Path:_
1. Test current scene with WebGPURenderer
2. Profile both renderers with your specific geometry/shader load
3. Implement automatic fallback
4. Monitor real-world performance metrics

_Source: [Three.js Roadmap - WebGL vs WebGPU](https://threejsroadmap.com/blog/webgl-vs-webgpu-explained)_

---

## Integration Patterns Analysis

### React Three Fiber Render Loop Architecture

#### Separation from React DOM
The react-three-fiber canvas has its own render loop, which is **completely separated from react-dom**. This is critical for performance — the render loop of a Three.js scene is completely separated from React's Virtual DOM reconciliation.

_Key Insight:_ R3F handles the underlying Three.js render loop efficiently, often outperforming plain Three.js in terms of scale due to React's scheduling abilities and its ability to render components **outside** of React's regular DOM reconciliation.

_Source: [R3F Performance Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls), [GitHub - React Three Fiber](https://github.com/pmndrs/react-three-fiber)_

#### useFrame Hook Pattern
`useFrame` is your per-component render-loop. It calls you back every frame and provides:
- React context for camera
- Clock delta for frame-rate-independent animations
- Scene state (same as useThree)

**Critical Rule:** Never call `requestAnimationFrame` directly — more than 1 RAF impacts performance badly. Always use `useFrame` instead.

```javascript
// GOOD: Frame-rate independent animation
useFrame((state, delta) => {
  mesh.current.rotation.y += delta * 0.5
})

// BAD: Fixed values ignore frame rate
useFrame(() => {
  mesh.current.rotation.y += 0.01 // Runs faster on 120Hz displays!
})
```

_Source: [Three.js Forum - useFrame Performance](https://discourse.threejs.org/t/react-three-fiber-useframe-performance/79423), [useFrame Hook Tutorial](https://sbcode.net/react-three-fiber/use-frame/)_

#### Render-on-Demand Pattern
R3F normally runs at 60fps. Setting `invalidateFrameloop` stops continuous rendering, so it only renders when props change — called **rendering on demand**.

_Use Case:_ Static or rarely-changing scenes (like a portfolio with occasional interactions)

_Source: [R3F Performance Pitfalls](https://docs.pmnd.rs/react-three-fiber/advanced/pitfalls)_

---

### State Management Integration Patterns

#### Jotai for Shader Uniforms (Your Current Stack)
Jotai provides fine-grained control over state updates, ensuring efficient re-renders. Each atom contains a small piece of state, and components **only rerender when the specific atoms they use change**.

_Performance Profile:_
- Lightweight and minimalistic
- Prevents unnecessary rerenders
- Ideal for rapidly changing data (like shader parameters)

**Critical Insight from Real-World Case Study:**
A TypeScript app with React + Three.js switched from Zustand to Jotai and then to a custom store, achieving **200x performance improvement** by subscribing to specific nodes using React's `useSyncExternalStore` API.

_Source: [Three.js Forum - State Management with R3F](https://discourse.threejs.org/t/how-to-use-state-management-with-react-three-fiber-without-performance-issues/61223), [State Management Horror Story - GitNation](https://gitnation.com/contents/from-redux-to-zustand-to-jotai-to-zustand-to-custom-our-state-management-horror-story)_

#### Zustand vs Jotai for 3D Apps
| Aspect | Zustand | Jotai |
|--------|---------|-------|
| Architecture | Centralized, top-down | Atomic, bottom-up |
| Best For | Interconnected global state | Fine-grained reactivity |
| 3D Use Case | Scene-wide settings | Individual shader uniforms |
| Rerender Pattern | Store-level subscriptions | Atom-level subscriptions |

_Recommendation:_ For shader uniforms that change frequently, Jotai's atomic model is ideal. For scene-wide configuration, Zustand may be simpler.

_Source: [Zustand vs Jotai Comparison](https://blog.openreplay.com/zustand-jotai-react-state-manager/)_

---

### Re-render Prevention Patterns

#### Memoization for Heavy Scenes
```javascript
// GOOD: Memoize geometry and materials
const geom = useMemo(() => new BoxGeometry(), [])
const mat = useMemo(() => new MeshBasicMaterial(), [])

return items.map(i => <mesh geometry={geom} material={mat} ... />)
```

_Key Rules:_
- Use `useMemo` for geometry, materials, and lights
- Use `useCallback` for event functions
- Memoize uniform objects if React state can trigger re-renders
- This becomes **noticeably effective as the scene grows**

_Source: [useMemo Hook Tutorial](https://sbcode.net/react-three-fiber/use-memo/), [R3F + Drei Performance Tips](https://medium.com/@ertugrulyaman99/react-three-fiber-enhancing-scene-quality-with-drei-performance-tips-976ba3fba67a)_

#### Asset Loading Patterns
Large GLTF models, texture files, and HDRIs can cause performance problems while loading.

_Best Practices:_
- Use `<Suspense>` to control loading process
- Use `useGLTF.preload()` to pre-load assets
- Consider lazy loading for non-critical 3D elements

_Source: [R3F Performance Pitfalls](https://docs.pmnd.rs/react-three-fiber/advanced/pitfalls)_

---

### Draw Call Optimization Patterns

#### InstancedMesh vs BatchedMesh
| Feature | InstancedMesh | BatchedMesh (r156+) |
|---------|---------------|---------------------|
| Geometry | Same for all instances | Different per instance |
| Draw Calls | 1 (for identical objects) | 1 (for varied objects) |
| Use Case | Trees, particles, props | Mixed geometry, same material |
| Caveat | Can be slower than expected with CPU overhead | More flexible but newer |

**Warning:** InstancedMesh was found to be "significantly slower than Mesh, despite the greatly reduced number of draw calls" with 5000 spheres at 50 divisions. Profile your specific use case!

_Source: [Three.js Forum - InstancedMesh vs BatchedMesh](https://discourse.threejs.org/t/how-to-choose-between-instancedmesh-and-batchedmesh/81221), [Draw Calls: The Silent Killer](https://threejsroadmap.com/blog/draw-calls-the-silent-killer)_

#### Instancing Recommendation
Try to use instancing as much as you can when you need to display many objects of a similar type. For your planet shaders, if you have multiple planets with the same base geometry but different shader parameters, instancing with per-instance uniforms could help.

_Source: [R3F Performance Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)_

---

### GPU Memory and Resource Management

#### WebGL Context Management
Three.js caches all GPU state to avoid redundant WebGL API calls. However, you must manually dispose of resources.

_Disposal Pattern:_
```javascript
// When component unmounts or resource changes
geometry.dispose()
material.dispose()
texture.dispose()

// For renderer cleanup
renderer.forceContextLoss()
renderer.dispose()
```

_Key Insight:_ WebGLRenderer uses a WeakMap to associate GPU resources with Three.js objects, so when objects are garbage collected, their GPU resources are automatically cleaned up — but only if you've called `.dispose()`.

_Source: [Three.js GPU Memory Article](https://ritik-chopra28.medium.com/why-your-three-js-app-is-secretly-eating-gpu-memory-and-how-to-stop-it-fe8ca6b2f72d), [Three.js Forum - Memory Management](https://discourse.threejs.org/t/webgl-memory-management-puzzlers/24583)_

#### R3F Automatic Cleanup
React Three Fiber handles disposal automatically when components unmount — another advantage over vanilla Three.js where you must manage this manually.

_Source: [GitHub - React Three Fiber](https://github.com/pmndrs/react-three-fiber)_

---

### Integration Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad | Solution |
|--------------|--------------|----------|
| Multiple `requestAnimationFrame` calls | Competing loops destroy performance | Use `useFrame` exclusively |
| Creating geometry/materials in render | New objects every frame | Memoize with `useMemo` |
| State updates in `useFrame` | Triggers React reconciliation | Mutate refs directly |
| Not disposing resources | GPU memory leaks | Use cleanup functions |
| Fixed animation values | Frame-rate dependent | Use clock delta |

_Source: [R3F Performance Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)_

---

## Architectural Patterns and Design

### Single Canvas vs Multi-Canvas Architecture

#### The Verdict: Single Canvas Wins
Using multiple canvases is **generally a terrible idea**:
- Browser limits contexts to 8-10 before closing the tab
- No data sharing between canvases
- Performance is bad

**Recommended Architecture:** One canvas that fills the viewport in the background with a single Renderer and one Scene for each virtual canvas area.

_Benefits:_
- Avoids WebGL context limit (only 1 context used)
- No sharing issues between 3D elements
- Better overall performance
- Drei's `<View>` component supports this pattern natively

**Your Current Setup:** Single `<Canvas>` in `App.jsx` with `SceneSwitch` — this is the **correct architectural pattern**!

_Source: [Three.js Forum - Canvases vs Views](https://discourse.threejs.org/t/canvases-vs-views/55858), [Multiple Scenes Tutorial](https://mc.dean.lsa.umich.edu/threejs/manual/en/multiple-scenes.html)_

---

### Scene Graph Optimization Architecture

#### Frustum Culling
Three.js has automatic frustum culling that prevents objects outside the camera's view from being rendered. For InstancedMesh, you need custom per-instance culling.

#### Hierarchical Bounding Boxes
Implementing bounding boxes in Groups avoids checking children if the group is outside frustum — only check groups within frustum, then their children. This hierarchical approach **significantly reduces frustum checks**.

#### Level of Detail (LOD) Architecture
| Distance | Strategy |
|----------|----------|
| Near | Full geometry, all shader features |
| Medium | Reduced polygon count |
| Far | Simplified geometry, basic shaders |
| Very Far | Billboard/impostor or culled |

**Performance Impact:** Developers report **up to 60% performance boost** with optimized rendering strategies.

_Source: [Three.js Forum - InstancedMesh2 with Frustum Culling](https://discourse.threejs.org/t/three-ez-instancedmesh2-enhanced-instancedmesh-with-frustum-culling-fast-raycasting-bvh-sorting-visibility-management-lod-skinning-and-more/69344), [Wild.codes - LOD and Batching](https://wild.codes/candidate-toolkit-question/how-do-you-optimize-three-js-performance-with-lod-batching-and-memory)_

---

### Procedural vs Baked Shader Architecture

#### Trade-off Analysis

| Aspect | Procedural Shaders | Baked Textures |
|--------|-------------------|----------------|
| File Size | Smaller (equations, not pixels) | Larger (bitmap data) |
| Load Time | Faster initial load | Slower initial load |
| Runtime Performance | Higher GPU cost per frame | Lower GPU cost per frame |
| Flexibility | Dynamic, can animate | Static |
| Memory | Lower VRAM usage | Higher VRAM usage |

#### Architectural Decision for Your Planets

**Problem:** Your procedural planet shaders with noise functions are recalculating every frame.

**Solution Options:**

1. **Hybrid Approach (Recommended):**
   - Design procedural shaders for development
   - Bake to textures for production
   - Convert complex procedural results to Color, Normal, Height maps
   - Use lightweight shader to sample textures at runtime

2. **LOD-Based Procedural:**
   - Full procedural for close-up planets
   - Pre-baked textures for distant planets
   - Switch based on camera distance

3. **Compute Shader Pre-pass (WebGPU):**
   - Run heavy noise calculations once in compute shader
   - Store results in texture/buffer
   - Sample from stored data in render pass

_Source: [Unity Forums - Procedural vs Textures](https://discussions.unity.com/t/comparing-performance-of-textures-vs-procedural-shaders-on-mobile-gpu/662156), [MoldStud - Procedural Textures Guide](https://moldstud.com/articles/p-exploring-procedural-textures-a-comprehensive-guide-for-threejs-developers)_

---

### React Three Fiber vs Vanilla Three.js: Architectural Decision Matrix

#### When to Stay with R3F (Your Current Stack)

| Factor | R3F Advantage |
|--------|---------------|
| React ecosystem | Already using React Router, Jotai |
| Component reuse | Declarative 3D components |
| Hot reloading | Faster development iteration |
| Resource cleanup | Automatic disposal on unmount |
| Team skills | React developers can contribute |

#### When to Consider Vanilla Three.js

| Factor | Vanilla Advantage |
|--------|-------------------|
| Performance-critical | Direct control, no abstraction |
| Non-React project | No React dependency |
| Low-level control | Custom render loops, manual optimization |
| AR/VR applications | Fine-grained timing control |
| Complex buffer geometries | Reported better performance in Chrome |

#### Verdict for Your Portfolio

**Stay with R3F** but optimize aggressively:
- Your portfolio is React-based (React Router, Jotai)
- R3F's render loop is **separate from React's Virtual DOM**
- The bottleneck is likely **shader complexity**, not R3F overhead
- Switching to vanilla would require rewriting state management, routing integration, and component structure

_Source: [R3F vs Vanilla Comparison](https://elkayal.me/article/react-three-fiber-vs-vanilla-three-js-what%E2%80%99s-right-for-your-project/), [Graffersid 2026 Comparison](https://graffersid.com/react-three-fiber-vs-three-js/)_

---

### WebGPU Shader Architecture Patterns

#### Uniform Buffer Organization (WebGPU)
Split uniform buffers based on update frequency:

| Buffer | Contents | Update Frequency |
|--------|----------|------------------|
| Global | Projection, View, Camera matrices | Once per frame |
| Per-Object | World/Model matrix, Normal matrix | Per draw call |
| Material | Colors, roughness, etc. | When material changes |
| Shader-Specific | Noise parameters, time | As needed |

#### Storage vs Uniform Buffers
- **Uniform buffers:** Read-only, same value for all invocations
- **Storage buffers:** Read/write, per-instance values possible

**For Planet Shaders:** If each planet needs different noise parameters, consider storage buffers with per-instance data rather than separate materials.

_Source: [WebGPU Uniforms Fundamentals](https://webgpufundamentals.org/webgpu/lessons/webgpu-uniforms.html), [Three.js Roadmap - Galaxy Compute Shaders](https://threejsroadmap.com/blog/galaxy-simulation-webgpu-compute-shaders)_

---

### Portfolio-Specific Architecture Recommendations

#### Performance Budget
| Metric | Target | Your Concern |
|--------|--------|--------------|
| Frame Time | <16ms (60 FPS) | Heavy shaders may exceed |
| Memory | <100 MB | Galaxy particles + planets |
| Initial Load | <3s | Asset preloading |
| Draw Calls | <100 | Unbatched meshes |

#### Recommended Architecture Stack

```
┌─────────────────────────────────────────────────────────┐
│                    React App (Vite)                     │
├─────────────────────────────────────────────────────────┤
│  React Router (Page Navigation)                         │
├─────────────────────────────────────────────────────────┤
│  Single <Canvas> (App.jsx) - WebGPU w/ WebGL fallback   │
├─────────────────────────────────────────────────────────┤
│  SceneSwitch (Route-based scene loading)                │
├─────────────────────────────────────────────────────────┤
│  Jotai Atoms (Shader uniforms - atomic updates)         │
├─────────────────────────────────────────────────────────┤
│  Optimized Shaders:                                     │
│  - Baked noise textures for static planets              │
│  - LOD system for distant objects                       │
│  - Reduced octaves in noise functions                   │
│  - Compute shader pre-pass (WebGPU)                     │
├─────────────────────────────────────────────────────────┤
│  Galaxy Background:                                     │
│  - InstancedMesh for particles                          │
│  - Frustum culling enabled                              │
│  - LOD-based particle density                           │
└─────────────────────────────────────────────────────────┘
```

_Source: [Strapi - 3D Portfolio Guide](https://strapi.io/blog/build-a-simple-3-d-portfolio-website-with-vite-react-three-js-and-strapi), [React Architecture Patterns 2026](https://www.bacancytechnology.com/blog/react-architecture-patterns-and-best-practices)_

---

## Implementation Approaches and Technology Adoption

### Step 1: Performance Profiling (Do This First!)

Before changing anything, profile your current setup to identify the actual bottlenecks.

#### Install Profiling Tools

```bash
npm install r3f-perf
```

#### Add to Your Scene

```jsx
import { Perf } from 'r3f-perf'

function App() {
  return (
    <Canvas>
      <Perf position="top-left" />
      {/* Your scene */}
    </Canvas>
  )
}
```

#### What to Monitor
| Metric | Target | Action if Exceeded |
|--------|--------|-------------------|
| FPS | >55 | Optimize shaders/geometry |
| Draw Calls | <100 | Use instancing/batching |
| Triangles | <1M | Reduce geometry, use LOD |
| GPU Time | <12ms | Simplify shaders |
| CPU Time | <4ms | Check React re-renders |

#### Use Spector.js for Deep Analysis
Install [Spector.js Chrome Extension](https://chrome.google.com/webstore/detail/spectorjs) to capture frame-by-frame draw calls and identify which shaders are consuming the most GPU time.

_Source: [r3f-perf GitHub](https://github.com/utsuboco/r3f-perf), [Codrops - Building Efficient Scenes](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)_

---

### Step 2: Shader Optimization Implementation

#### A. Reduce Noise Octaves

Your planet shaders likely use multiple noise octaves. Each octave multiplies GPU work.

```glsl
// BEFORE: 6 octaves (expensive)
float noise = fbm(position, 6, 2.0, 0.5);

// AFTER: 3 octaves (much faster)
float noise = fbm(position, 3, 2.0, 0.5);
```

**Rule of Thumb:**
- Close-up planets: 4-5 octaves
- Medium distance: 2-3 octaves
- Background planets: 1-2 octaves or baked texture

#### B. Bake Noise to Textures

Use `three-shader-baker` to bake procedural shaders to textures:

```bash
npm install three-shader-baker
```

```jsx
import { useShaderBaker } from 'three-shader-baker'

function BakedPlanet({ proceduralMaterial }) {
  const { bake, texture } = useShaderBaker()

  useEffect(() => {
    // Bake once on mount
    const bakedTexture = bake(proceduralMaterial, 1024, 1024)
    // Use bakedTexture instead of procedural shader
  }, [])

  return <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial map={texture} />
  </mesh>
}
```

**Alternative: Manual Render Target Baking**

```jsx
// Create offscreen render target
const renderTarget = new THREE.WebGLRenderTarget(1024, 1024)

// Render procedural shader to texture once
renderer.setRenderTarget(renderTarget)
renderer.render(proceduralScene, orthoCamera)
renderer.setRenderTarget(null)

// Use renderTarget.texture as baked texture
```

_Source: [three-shader-baker GitHub](https://github.com/FarazzShaikh/three-shader-baker), [Three.js Forum - Bake Shader to Texture](https://discourse.threejs.org/t/bake-glsl-shader-into-a-texture/39495)_

---

### Step 3: WebGPU Migration Implementation

#### Update Three.js to r171+

```bash
npm install three@latest
```

#### Modify Canvas Setup for R3F

```jsx
import * as THREE from 'three/webgpu'
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer({
          ...props,
          antialias: true,
        })
        await renderer.init()
        return renderer
      }}
    >
      {/* Your scene - no other changes needed! */}
      {/* Automatic WebGL 2 fallback for unsupported browsers */}
    </Canvas>
  )
}
```

#### Convert GLSL Shaders to TSL (Optional but Recommended)

TSL (Three Shading Language) is renderer-agnostic and works with both WebGL and WebGPU:

```javascript
// Import TSL functions
import {
  uniform, attribute, varying,
  float, vec3, sin, cos,
  mx_noise_float
} from 'three/tsl'

// Define shader with TSL
const noiseScale = uniform(1.0)
const position = attribute('position')
const noise = mx_noise_float(position.mul(noiseScale))
```

_Source: [R3F WebGPU Setup](https://blog.loopspeed.co.uk/react-three-fiber-webgpu-typescript), [TSL Field Guide](https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/)_

---

### Step 4: LOD Implementation for Planets

#### Basic LOD Setup

```jsx
import { useMemo } from 'react'
import * as THREE from 'three'

function Planet({ position }) {
  const lod = useMemo(() => {
    const lodObject = new THREE.LOD()

    // High detail (close)
    const highDetail = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      proceduralMaterial // Full shader
    )
    lodObject.addLevel(highDetail, 0)

    // Medium detail
    const mediumDetail = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      simplifiedMaterial // Reduced octaves
    )
    lodObject.addLevel(mediumDetail, 50)

    // Low detail (far)
    const lowDetail = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 16),
      bakedTextureMaterial // Pre-baked texture
    )
    lodObject.addLevel(lowDetail, 100)

    return lodObject
  }, [])

  return <primitive object={lod} position={position} />
}
```

#### Automatic LOD with Drei

```jsx
import { Detailed } from '@react-three/drei'

function Planet() {
  return (
    <Detailed distances={[0, 50, 100]}>
      <HighDetailPlanet />  {/* Shown when < 50 units away */}
      <MediumDetailPlanet /> {/* Shown when 50-100 units away */}
      <LowDetailPlanet />   {/* Shown when > 100 units away */}
    </Detailed>
  )
}
```

_Source: [Three.js LOD Docs](https://threejs.org/docs/api/en/objects/LOD.html), [Wael Yasmina - LOD Guide](https://waelyasmina.net/articles/enhancing-three-js-app-performance-with-lod/)_

---

### Step 5: Galaxy Particle Optimization

Your galaxy has 200k+ particles. Here's how to optimize:

#### Use InstancedMesh Properly

```jsx
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Galaxy({ count = 200000 }) {
  const meshRef = useRef()

  const { geometry, positions } = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.01, 4, 4) // Simple geometry
    const pos = new Float32Array(count * 3)

    // Generate positions...
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100
    }

    return { geometry: geo, positions: pos }
  }, [count])

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, null, count]}
      frustumCulled={true} // Enable culling!
    >
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  )
}
```

#### Consider Points Instead of Meshes

For distant particles, `Points` is often faster than `InstancedMesh`:

```jsx
function GalaxyPoints({ count = 200000 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    // Generate positions...
    return pos
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} sizeAttenuation={true} />
    </points>
  )
}
```

_Source: [R3F Scaling Performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)_

---

## Technical Research Recommendations

### Implementation Roadmap

| Phase | Task | Priority | Estimated Impact |
|-------|------|----------|------------------|
| **1** | Add r3f-perf profiling | Critical | Identify bottlenecks |
| **2** | Reduce noise octaves | High | 30-50% GPU time reduction |
| **3** | Implement LOD for planets | High | 40-60% reduction for distant objects |
| **4** | Bake static planet textures | Medium | Eliminate per-frame noise calculation |
| **5** | Migrate to WebGPU | Medium | 10-50% improvement (varies) |
| **6** | Optimize galaxy particles | Medium | Depends on current implementation |
| **7** | Convert shaders to TSL | Low | Future-proofing, minor perf gain |

### Quick Wins (Do These Today)

1. **Add `<Perf />` component** to see actual metrics
2. **Check noise octave count** in planet shaders — reduce to 2-3
3. **Verify frustum culling** is enabled on all meshes
4. **Memoize geometry/materials** with `useMemo`

### Technology Stack Recommendations

| Component | Current | Recommended |
|-----------|---------|-------------|
| Renderer | WebGL (implied) | WebGPU with WebGL fallback |
| Framework | React Three Fiber | Keep R3F (not the bottleneck) |
| State | Jotai | Keep Jotai for shader uniforms |
| Shaders | GLSL procedural | Baked textures + LOD |
| Particles | Unknown | Points or InstancedMesh with culling |

### Success Metrics

| Metric | Current (estimate) | Target |
|--------|-------------------|--------|
| Frame Rate | <30 FPS (heavy scenes) | >55 FPS consistently |
| Initial Load | Unknown | <3 seconds |
| GPU Time | Unknown | <12ms per frame |
| Draw Calls | Unknown | <100 |

---

## Research Completion Summary

**This technical research has covered:**

1. ✅ **Technology Stack Analysis** — WebGPU vs WebGL, R3F vs Vanilla, shader languages
2. ✅ **Integration Patterns** — Render loop architecture, state management, resource disposal
3. ✅ **Architectural Patterns** — Single canvas, LOD, procedural vs baked, decision matrix
4. ✅ **Implementation Approaches** — Step-by-step optimization guide with code examples

**Key Findings:**

- **WebGPU is production-ready** (r171+) with automatic WebGL fallback
- **R3F is NOT your bottleneck** — its render loop is separate from React's Virtual DOM
- **Shader complexity IS likely your bottleneck** — noise octaves, per-frame calculations
- **Bake + LOD is the winning strategy** — procedural for dev, baked for production

**Next Steps:**

1. Profile your current setup with r3f-perf
2. Identify the heaviest shaders with Spector.js
3. Implement quick wins (reduce octaves, memoize)
4. Plan texture baking workflow for planets
5. Consider WebGPU migration for future-proofing

---

**Research Document Complete**
**Date:** 2026-02-05
**Total Sections:** 5 (Scope, Technology Stack, Integration Patterns, Architecture, Implementation)
