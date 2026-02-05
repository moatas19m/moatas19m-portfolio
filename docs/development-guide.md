# Development Guide

## Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **npm** or **yarn** | Latest | Package manager |
| **Git** | Latest | Version control |

### Recommended Tools

| Tool | Purpose |
|------|---------|
| WebStorm / VS Code | IDE with TypeScript support |
| Chrome DevTools | Debugging 3D scenes |
| React DevTools | Component inspection |

---

## Quick Start

```bash
# Clone repository
git clone <repo-url>
cd moatas19m-portfolio

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

**Dev server runs at:** `http://localhost:5173`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on codebase |

### Script Details

**`npm run dev`**
- Starts Vite development server
- Hot Module Replacement (HMR) enabled
- React Fast Refresh for component updates
- Source maps enabled

**`npm run build`**
- Runs Vite production build
- Output: `dist/` directory
- Minified, tree-shaken bundle
- Asset hashing for cache busting

**`npm run lint`**
- ESLint 9 flat config
- React Hooks rules enforced
- React Refresh rules for Vite
- Ignores `dist/` directory

---

## Environment Setup

### Environment Variables

**File:** `.env` (not committed)

```bash
# Example .env structure
# Add any API keys or configuration here
```

**Note:** The `.env` file is gitignored for security.

### Path Aliases

Configured in both `tsconfig.json` and `vite.config.js`:

| Alias | Path | Usage |
|-------|------|-------|
| `@app/*` | `src/*` | `import X from '@app/components/X'` |
| `@shader/*` | `src/components/planets/shader/*` | `import X from '@shader/lib/noise'` |

---

## Project Structure for Development

### Where to Add New Features

| Feature Type | Location |
|--------------|----------|
| New page | `src/pages/NewPage.jsx` + add route in `src/lib/router.tsx` |
| New 3D component | `src/components/` |
| New UI component | `src/components/ui/` |
| New planet | `src/components/planets/` (copy existing planet as template) |
| Shader utilities | `src/components/planets/shader/lib/` |
| Constants | `src/constants/` |

### Adding a New Route

1. Create page component in `src/pages/`:
```jsx
// src/pages/NewPage.jsx
export default function NewPage() {
    return <div>New Page Content</div>;
}
```

2. Add route in `src/lib/router.tsx`:
```tsx
const NewPage = lazy(() => import("../pages/NewPage.jsx"));

// In router config:
{ path: "new", element: withSuspense(<NewPage />) }
```

3. (Optional) Add 3D scene in `App.jsx`:
```jsx
// In SceneSwitch:
{pathname.startsWith("/new") && <NewScene3D />}
```

### Adding a New Planet

1. Copy existing planet (e.g., `Hoth.jsx`)
2. Modify:
   - `meshResolutionAtom` value
   - `planetRadiusAtom` value
   - `elevationGradientAtom` colors
   - `depthGradientAtom` colors
   - `noiseFiltersAtom` configuration
3. Add to `HeroScene.jsx` with click handler

---

## Development Workflow

### Recommended Workflow

1. **Start dev server:** `npm run dev`
2. **Make changes** - HMR updates automatically
3. **Check console** for errors
4. **Lint before commit:** `npm run lint`
5. **Build to verify:** `npm run build`

### Debugging 3D Scenes

**Enable debug helpers in HeroScene.jsx:**
```jsx
// Uncomment in HeroScene.jsx:
<gridHelper args={[100, 100]} />
<axesHelper args={[5]} />
```

**Camera position logging:**
```jsx
// Uncomment CameraLogger component to log camera position on click
```

### Performance Tips

1. **Galaxy particles:** Keep count ≤200k for smooth performance
2. **Planet resolution:** 144 is balanced; higher values impact FPS
3. **Lazy loading:** All pages are lazy-loaded by default
4. **GLTF preloading:** Models are preloaded via `useGLTF.preload()`

---

## Testing

**Current Status:** No automated tests configured

### Recommended Testing Setup

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Add to package.json scripts:
"test": "vitest",
"test:ui": "vitest --ui"
```

### Manual Testing Checklist

- [ ] All routes load without errors
- [ ] 3D scene renders correctly
- [ ] Planets are clickable and navigate correctly
- [ ] Galaxy background animates smoothly
- [ ] Camera parallax responds to mouse
- [ ] Mobile responsive (pages collapse correctly)

---

## Build & Deployment

### Production Build

```bash
npm run build
```

**Output:** `dist/` directory containing:
- `index.html` - Entry point
- `assets/` - JS, CSS, fonts (hashed filenames)

### Preview Build Locally

```bash
npm run preview
```

### Deployment Options

**Static Hosting (Recommended):**
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

**Deploy Steps (Vercel example):**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy

**Note:** No Dockerfile or CI/CD pipelines are currently configured.

---

## Troubleshooting

### Common Issues

**3D scene not rendering:**
- Check browser console for WebGL errors
- Ensure GPU is available
- Try disabling browser extensions

**GLTF models not loading:**
- Verify file paths in `/src/assets/models/`
- Check network tab for 404 errors

**HMR not working:**
- Clear browser cache
- Restart dev server
- Check for syntax errors

**TypeScript errors:**
- Note: `checkJs: false` in tsconfig
- TypeScript is partially adopted
- Some JS files may have type issues

---

## Code Style

### ESLint Rules

- React Hooks rules enforced
- Unused variables starting with `[A-Z_]` are allowed
- React Refresh rules for Vite compatibility

### Conventions

- **Components:** PascalCase (e.g., `HeroScene.jsx`)
- **Utilities:** camelCase (e.g., `utils.ts`)
- **Constants:** camelCase files, UPPER_CASE exports
- **CSS:** Tailwind utility classes preferred
