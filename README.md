# Patles.ai

Patles.ai is a React + TypeScript application that lets you generate, explore, and manage project ideas from a prompt-driven dashboard. The app includes a landing page, AI project generation flow, GitHub repository intelligence views, workflow visualization, and a developer workspace experience.

## Features

- Prompt-driven project generation UI
- Dashboard for browsing and managing generated projects
- GitHub repository import and intelligence views
- Workflow graph for repo structure and user flows
- AI-assisted project context and analysis endpoints
- Express backend API for project generation and file persistence
- In-browser project workspace and code inspection experience
- Build and run flow for local development

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Express
- Node.js
- Monaco editor support
- Google Gemini API integration via @google/genai

## Project structure

- `src/` — React frontend
- `server/` — backend routes and service logic
- `server.ts` — Express + Vite server entry point
- `public/` — static assets
- `package.json` — scripts and dependencies
- `.env.example` — example environment values

## Setup

### 1) Install Node.js and npm

Use Node.js 20+ and npm 10+.

```bash
node -v
npm -v
```

### 2) Install dependencies

```bash
npm install
```

If you hit an install peer-dependency issue, use the current compatible setup in this repo, which already includes the correct Vite/esbuild alignment.

### 3) Configure environment variables

Create a local env file:

```bash
copy .env.example .env
```

Then update `.env` with values such as:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="npm run dev"
GITHUB_TOKEN=""
PORT=3000
```

`GEMINI_API_KEY` is optional for basic app startup, but it is required for the AI generation features to work.

### 4) Run the app

```bash
npm run dev
```

The app will start on the configured local port.

## Production build

```bash
npm run build
```

## Scripts

- `npm run dev` — start the local development server
- `npm run build` — build the frontend bundle for production
- `npm run start` — run the project server
- `npm run lint` — TypeScript type check

## Notes

- The app uses a local Express server and Vite middleware.
- The server can start without a Gemini key, but AI-powered generation and assistant behavior will be limited.
- If port 3000 is already in use, stop the conflicting process or run the app on a different port.

## License

This project is provided as-is for local development and experimentation.

To test or deploy the production build:

```bash
# 1. Compile TypeScript and build the production bundle
npm run build

# 2. Start the production Express server
npm start
```

The optimized client assets are served from `/dist` while all backend `/api/*` routes remain active and responsive.

---

## 📡 API Reference

### Project Generation & Workspace APIs

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/projects/generate` | Generates a complete structured project with real source files |
| `GET` | `/api/projects` | Retrieves list of all generated and seeded projects |
| `GET` | `/api/projects/:id` | Retrieves single project details, files, and metadata |
| `PUT` | `/api/projects/:id/files` | Saves updated file content into project storage |
| `POST` | `/api/projects/:id/files` | Creates a new file in the project |
| `DELETE` | `/api/projects/:id/files` | Deletes a file from the project |
| `POST` | `/api/projects/:id/review` | Executes automated AI code review across quality, security, and performance |
| `POST` | `/api/projects/:id/debug` | Analyzes an error/stack trace against project code and provides diff fix |
| `GET` | `/api/projects/:id/deploy-check` | Performs pre-flight deployment and environment readiness checks |
| `POST` | `/api/projects/:id/documentation` | Generates comprehensive README, API, and architectural docs |

### GitHub Intelligence & Analysis APIs

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/github/import` | Ingests a public GitHub repository URL, clones, and parses files |
| `GET` | `/api/github/repositories` | Lists all analyzed repositories in the workspace |
| `GET` | `/api/github/repositories/:id` | Returns repository summary, tech stack, and files |
| `GET` | `/api/github/repositories/:id/workflow` | Returns interactive workflow journey graph (UI → API → DB) |
| `GET` | `/api/github/repositories/:id/file-analysis` | Generates file topology, metrics matrix, treemap, and hotspots |
| `POST` | `/api/github/repositories/:id/file-audit` | Deep AI inspection of a single file with architectural insights |
| `POST` | `/api/github/repositories/:id/mentor` | Conversational repository mentor grounded in indexed code |
| `GET` | `/api/github/repositories/:id/search` | Search files, symbols, and code text |

### General Platform APIs

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/generate` | Autonomous architecture and code synthesis from prompt |
| `GET` | `/api/health` | System health check and uptime probe |

---

## 🔒 Security & Architecture Standards

1. **Zero Secret Leakage**:
   - `GEMINI_API_KEY` and other sensitive secrets are consumed strictly by the Express server.
   - Client bundles never contain API keys or private credentials.
   - The Deployment Validator checks for missing environment keys in `.env.example` but masks actual credentials.

2. **Isolated Sandboxes**:
   - UI Sandboxes and Virtual Terminal CLI instances execute in safe browser memory spaces with no arbitrary command execution on the host machine.

3. **Strict Validation & Parsing**:
   - All AI generation routes enforce structured JSON schemas to prevent hallucinated formats.
   - AST analysis and file reading handle edge cases (empty files, binary formats, oversized files) safely.

---

