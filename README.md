# Portfolio (React + Vite)

## Task Master AI (MCP) setup

This project is initialized with Task Master AI as an MCP server for Cursor.

### Quick start

1. Copy `.env.example` to `.env` and add at least one API key:
   - `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` (others are supported too)
2. In Cursor, use the Task Master MCP integration to manage tasks.

### Project files

- `.taskmaster/` contains configuration, docs, and generated tasks.
- `.taskmaster/docs/prd.txt` holds the PRD used to generate tasks.

### Common commands

- Manage tasks via Cursor MCP palette or use the CLI if installed:
  - `task-master list`
  - `task-master add-task "My task"`
  - `task-master set-status --id 1 --status done`

---

## Vite

This project uses React + Vite with HMR and ESLint.

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
