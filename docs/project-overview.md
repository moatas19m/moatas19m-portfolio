# Project Overview

## moatas19m-portfolio

**An interactive 3D portfolio website showcasing software engineering work through immersive WebGL experiences.**

---

## Quick Facts

| Property | Value |
|----------|-------|
| **Project Type** | Web Application (3D Portfolio) |
| **Repository Type** | Monolith |
| **Primary Language** | TypeScript/JavaScript |
| **Framework** | React 18 + Three.js |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |

---

## What This Project Does

This portfolio website presents the work of **Moatasim bin Hisham Sayyid** through an interactive 3D interface featuring:

- **Procedurally Generated Planets** - Four unique planets (Hoth, Chromastone, Coruscant, Mustafar) each linking to different sections
- **Animated 3D Characters** - Rider character with idle animation sequences
- **Galaxy Background** - 200,000 particle spiral galaxy with auto-rotation
- **Interactive Navigation** - Click on 3D objects to navigate to different pages
- **Mouse Parallax** - Subtle camera movement following cursor position

---

## Technology Highlights

### 3D Graphics Stack
- **Three.js** for WebGL rendering
- **@react-three/fiber** for React integration
- **@react-three/drei** for helpful abstractions
- **Custom GLSL shaders** for planet terrain generation

### Frontend Stack
- **React 18** with hooks and lazy loading
- **React Router 6** for client-side routing
- **Jotai** for atomic state management
- **Framer Motion** for animations
- **Tailwind CSS** for styling

### Key Architectural Decisions
1. **Single Persistent Canvas** - 3D context maintained across route changes
2. **Isolated Planet Stores** - Each planet has its own Jotai store
3. **GPU-Based Terrain** - Procedural noise computed in shaders
4. **Lazy-Loaded Pages** - Code splitting for performance

---

## Project Structure Summary

```
src/
├── main.jsx           # Entry point
├── App.jsx            # Root layout + Canvas
├── lib/router.tsx     # Route definitions
├── components/        # 30+ React components
│   ├── HeroScene.jsx  # Main 3D scene
│   ├── planets/       # 4 planets + shader system
│   ├── background/    # Galaxy particles
│   └── ui/            # UI components
├── pages/             # 7 route pages
└── assets/models/     # 3D models (GLTF)
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Dev server:** http://localhost:5173

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture](./architecture.md) | System design and data flows |
| [Technology Stack](./technology-stack.md) | Detailed tech inventory |
| [Component Inventory](./component-inventory.md) | All components documented |
| [Source Tree Analysis](./source-tree-analysis.md) | Annotated file structure |
| [Development Guide](./development-guide.md) | How to develop and deploy |
| [State Management](./state-management.md) | Jotai and routing state |

---

## Current Status

### Active Pages
- `/` - Hero scene with planets and characters
- `/about` - About page with rider character
- `/projects` - Projects grid with modal

### Placeholder Pages
- `/work` - Work experience (not implemented)
- `/skills` - Skills/testimonials (not implemented)
- `/hobbies` - Hobbies/interests (not implemented)
- `/contact` - Contact form (not implemented)

---

## Contributing

1. Read the [Development Guide](./development-guide.md)
2. Follow existing code patterns
3. Test 3D interactions manually
4. Run `npm run lint` before committing
