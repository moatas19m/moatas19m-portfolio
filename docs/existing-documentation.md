# Existing Documentation Inventory

## Summary

- **Total Documents Found:** 6
- **User-Provided Context:** None

## Documentation Files

### Project Documentation

| File | Type | Part | Description |
|------|------|------|-------------|
| `README.md` | readme | main | Basic Vite template readme (boilerplate, not customized) |
| `CLAUDE.md` | ai-guidance | main | AI assistant guidance with architecture overview, build commands, tech stack |

### AI Assistant Rules

| File | Type | Part | Description |
|------|------|------|-------------|
| `.cursor/rules/cursor_rules.mdc` | ai-rules | main | Guidelines for creating and maintaining Cursor rules |
| `.cursor/rules/self_improve.mdc` | ai-rules | main | Self-improvement guidelines for AI assistants |

### Workflow Documentation

| File | Type | Part | Description |
|------|------|------|-------------|
| `.cursor/rules/taskmaster/taskmaster.mdc` | workflow | main | Comprehensive Taskmaster MCP tools reference (32 commands) |
| `.cursor/rules/taskmaster/dev_workflow.mdc` | workflow | main | Development workflow guidelines using Taskmaster |

## Key Information Extracted

### From CLAUDE.md

**Build Commands:**
- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

**Architecture Patterns:**
- Single Canvas Pattern - One Three.js Canvas persists across all routes
- Route-based scene switching via SceneSwitch component
- Lazy-loaded page components

**Path Aliases:**
- `@app/*` → `src/*`
- `@shader/*` → `src/components/planets/shader/*`

**State Management:**
- Jotai atoms for shader settings
- React hooks for local component state

### From Taskmaster Rules

- Task management via `.taskmaster/tasks/tasks.json`
- Tagged contexts for multi-context workflows
- PRD-driven feature development patterns
