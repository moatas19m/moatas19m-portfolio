# Project Structure

## Repository Classification

| Property | Value |
|----------|-------|
| **Repository Type** | Monolith |
| **Project Type ID** | web |
| **Primary Language** | TypeScript/JavaScript (mixed) |
| **Framework** | React 18 + Vite 7 |
| **3D Graphics Engine** | Three.js via @react-three/fiber |

## Project Parts

This is a single-part monolith project.

### Part: main

- **Part ID:** main
- **Root Path:** `/`
- **Project Type:** Web Application (3D Portfolio)
- **Description:** Interactive 3D portfolio website built with React Three Fiber

## Directory Overview

```
moatas19m-portfolio/
├── src/                    # Source code
│   ├── App.jsx            # Root layout with persistent Canvas
│   ├── main.jsx           # React entry point with RouterProvider
│   ├── index.css          # Global styles
│   ├── lib/               # Core libraries
│   │   ├── router.tsx     # React Router configuration
│   │   └── utils.ts       # Utility functions
│   ├── components/        # React components
│   │   ├── HeroScene.jsx  # Main 3D scene orchestrator
│   │   ├── ErrorBoundary.jsx
│   │   ├── background/    # Galaxy particle system
│   │   ├── camera/        # Camera control logic
│   │   ├── motorcycle/    # 3D motorcycle model + animations
│   │   ├── planets/       # Planet components + GPU shaders
│   │   ├── rider/         # 3D rider character + animations
│   │   └── ui/            # UI components library
│   ├── pages/             # Route page components
│   │   ├── AboutPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── SkillsPage.jsx
│   │   ├── WorkPage.jsx
│   │   ├── HobbiesPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── layouts/       # Page layout components
│   ├── sections/          # Page section components
│   ├── constants/         # Configuration constants
│   ├── utils/             # Utility components
│   └── assets/            # Static assets
│       └── models/        # 3D model files (.glb)
├── public/                # Public static files
├── docs/                  # Generated documentation
├── node_modules/          # Dependencies
├── package.json           # Project manifest
├── vite.config.js         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
└── index.html             # HTML entry point
```

## Key Architectural Decisions

1. **Single Canvas Pattern** - One Three.js Canvas persists across all routes
2. **Route-Based Scene Switching** - Different 3D scenes render based on pathname
3. **GPU-Based Planet Generation** - Shader-driven procedural terrain
4. **Atomic State Management** - Jotai atoms for shader settings
5. **Lazy-Loaded Pages** - React.lazy() for code splitting
