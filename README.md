# Patles.ai — Autonomous AI Software Engineering & Architecture Platform

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x%20%2F%205.x-000000.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-0.52.2-007ACC.svg?style=flat-square&logo=visualstudiocode)](https://microsoft.github.io/monaco-editor/)
[![Gemini](https://img.shields.io/badge/AI_Engine-Gemini_3.8_Flash-8E75B2.svg?style=flat-square&logo=google)](https://ai.google.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-339933.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**Patles.ai** is an enterprise-grade AI software engineering platform and autonomous full-stack development workbench. It operates across the complete software development lifecycle: synthesizing production-grade multi-tier repositories from natural language specifications, providing an in-browser VS Code-style Monaco workspace with live file persistence, context-aware AI assistant mentors, AST-grounded code reviews, automated root-cause debugging with visual diff patching, pre-flight deployment validators, and comprehensive GitHub repository intelligence with interactive file network topology and workflow mapping.

---

## 📑 Table of Contents

- [Core Workflow](#-core-workflow)
- [Actual Features](#-actual-features)
  - [1. AI Project Generator](#1-ai-project-generator-builder)
  - [2. Interactive Monaco Workspace](#2-interactive-monaco-workspace-workspaceprojectid)
  - [3. Project-Aware AI Assistant](#3-project-aware-ai-assistant-assistantprojectid)
  - [4. Automated AI Code Review](#4-automated-ai-code-review-reviewprojectid)
  - [5. AI Debugger & One-Click Fixes](#5-ai-debugger--one-click-fixes-debugprojectid)
  - [6. Pre-Flight Deployment Validator](#6-pre-flight-deployment-validator-deployprojectid)
  - [7. Comprehensive Documentation Generator](#7-comprehensive-documentation-generator-documentationprojectid)
  - [8. GitHub Repository Intelligence & Importer](#8-github-repository-intelligence--importer)
  - [9. File Analysis & Topology View](#9-file-analysis--topology-view)
  - [10. In-Browser Live UI Sandbox & Visualizer](#10-in-browser-live-ui-sandbox--visualizer)
- [Technology Stack](#-technology-stack)
- [Complete File Structure](#-complete-file-structure)
- [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
  - [Prerequisites](#prerequisites)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Install Dependencies](#step-2-install-dependencies)
  - [Step 3: Environment Configuration](#step-3-environment-configuration)
  - [Step 4: Database Schema Initialization](#step-4-database-schema-initialization)
  - [Step 5: Start Development Server](#step-5-start-development-server)
  - [Step 6: Build for Production](#step-6-build-for-production)
- [API Reference](#-api-reference)
- [Security & Architecture Standards](#-security--architecture-standards)
- [Contributing & License](#-contributing--license)

---

## 🔄 Core Workflow

Every phase in Patles.ai operates on the **same unified project context** across frontend, backend, database schemas, and documentation:

```
User Prompt (Natural Language Specification)
    ↓
AI Project Generator (Structured multi-tier JSON synthesis)
    ↓
Generated Project (Source files created in memory & database storage)
    ↓
Interactive Workspace (VS Code Monaco editor + file tree + search)
    ↓
AI Assistant (Context-aware codebase mentor with clickable references)
    ↓
AI Code Review (Security, performance, and best-practice audit)
    ↓
AI Debugger (Stack trace diagnosis + visual diff + one-click patch)
    ↓
Deployment Validator (Platform configuration, environment audit, readiness scoring)
    ↓
Documentation Generator (README, API reference, architecture, deployment runbooks)
```

---

## ✨ Actual Features

### 1. AI Project Generator (`/builder`)
- **Multi-Stack Specification**: Configure Project Types (Website, Web Application, Mobile App, API, Full Stack Application), Frontend Frameworks (React, Next.js, Vue), Backend Engines (Node.js + Express, Python Flask/Django, PHP Laravel, Java Spring Boot), and Relational/Document Databases (PostgreSQL, MySQL, MongoDB, SQLite, Supabase, Firebase).
- **Structured JSON Synthesis**: Communicates with `POST /api/projects/generate` powered by Google Gemini 3.8 Flash and IBM Granite Code archetypes to synthesize complete projects.
- **Production-Ready Source Files**: Never outputs `// TODO` or hollow templates. Generates real frontend components (`App.jsx`, pages, state hooks), backend routers, controllers, services, middleware, authentication models, and PostgreSQL Drizzle/SQL schemas.
- **Contract Consistency Guarantee**: If a frontend component calls `POST /api/appointments`, the backend router exposes that route, the controller implements business logic, and the database schema contains the matching table structure.

### 2. Interactive Monaco Workspace (`/workspace/:projectId`)
- **VS Code Experience**: Embedded **Monaco Editor** (`@monaco-editor/react`) featuring syntax highlighting for JavaScript, TypeScript, JSX, TSX, SQL, JSON, Markdown, and CSS.
- **File Management**: Create, edit, rename, save, and delete project files with persistence to `/api/projects/:projectId/files`.
- **Search Capabilities**: Integrated project file tree search and deep regex/text codebase content search.
- **Integrated Terminal Drawer**: Virtual interactive shell streaming build status, execution logs, and compilation checks.

### 3. Project-Aware AI Assistant (`/assistant/:projectId`)
- **Context-Selective AI**: Receives only relevant files, route definitions, and schema structures instead of dumping an entire repository.
- **Actionable Answers**: Answers user questions ("How does login work?", "Where is the payment API?", "How can I optimize this controller?") with clickable file references, line citations, and component-to-route relationship maps.

### 4. Automated AI Code Review (`/review/:projectId`)
- **Multi-Dimensional Code Analysis**:
  - **Code Quality**: Cyclomatic complexity, maintainability scores, dead code, error boundaries.
  - **Security (SAST)**: SQL injection risks, XSS vulnerabilities, insecure CORS origins, hardcoded credentials, weak password hashes, and unsafe JWT validation.
  - **Performance**: Inefficient N+1 queries, unnecessary re-renders, oversized payloads.
  - **Best Practices**: Architecture modularity, separation of concerns, testability.
- **Granular Findings**: Each issue specifies severity (`critical`, `high`, `medium`, `low`, `info`), file path, line number, description, and suggested code replacement.

### 5. AI Debugger & One-Click Fixes (`/debug/:projectId`)
- **Error Diagnostic**: Input error messages, stack traces, or paste runtime console logs.
- **Root-Cause Analysis**: Cross-references the stack trace against real project source files to identify the culprit file, line, and flawed logic.
- **Visual Diff & One-Click Apply**: Renders unified unified color-coded diffs (`+` addition, `-` deletion) and writes confirmed fixes directly back to disk/database via `PUT /api/projects/:projectId/files`.

### 6. Pre-Flight Deployment Validator (`/deploy/:projectId`)
- **Platform Detection**: Audits configurations for Vercel (`vercel.json`), Netlify (`netlify.toml`), Railway, Render, Docker (`Dockerfile`, `docker-compose.yml`), and GitHub Actions (`.github/workflows`).
- **Environment Variable Audit**: Audits required variables (`DATABASE_URL`, `API_URL`, `JWT_SECRET`, `AI_API_KEY`) ensuring all necessary keys exist in `.env.example` without exposing plaintext secrets.
- **Readiness Checklist**: Computes an actionable readiness score covering build command, start command, CORS production headers, and database connection strings.

### 7. Comprehensive Documentation Generator (`/documentation/:projectId`)
- **One-Click Generation**: Synthesizes clean markdown documentation grounded in actual code:
  - `README.md`: Quickstart, installation, scripts, prerequisites.
  - **API Documentation**: Detailed endpoint tables, query parameters, request bodies, and responses.
  - **Architecture Guide**: Multi-tier data flow and sequence diagrams.
  - **Database Schema Guide**: Table structures, foreign keys, constraints, and indexes.
  - **Authentication & Security Guide**: Session/JWT flows and role-based permissions.
  - **Deployment Runbook**: Production environment steps and cloud deployment guidelines.

### 8. GitHub Repository Intelligence & Importer
- **Automated Repository Ingestion**: Ingests public repositories via GitHub URL (`https://github.com/owner/repo`) or curated history items.
- **AST Parsing & Tech Stack Profiling**: Detects 20+ languages and frameworks across `package.json`, `pom.xml`, `requirements.txt`, etc.
- **Interactive File Explorer**: Full recursive file tree with line numbers, code copying, and syntax highlighting.
- **Visual Normalized Workflow Map (`WorkflowPage`)**: Interactive node graph mapping end-to-end user journeys through UI components, API gateways, route handlers, controllers, ORM services, and database tables.

### 9. File Analysis & Topology View
- **Interactive Network Canvas (`FileNetworkCanvas`)**: High-performance HTML5 Canvas rendering all repository files as nodes connected by internal and external import dependencies with smooth pan, zoom, and highlight filtering.
- **Codebase Treemap View (`FileTreemapView`)**: Visual representation of directory hierarchies and code volume (LOC).
- **Metrics Matrix & Filterable Grid (`FileMetricsTable`)**: Searchable, sortable table of all files with LOC, Cyclomatic Complexity estimates, Maintainability Index, coupling metrics, and export counts.
- **Hotspots & Blast Radius Audit (`FileHotspotsView`)**: Identifies high-risk coupling hubs, high-complexity refactoring candidates, and isolated leaf modules.
- **Deep AI File Audit Drawer (`FileDetailDrawer`)**: Slide-over drawer providing immediate architectural insights, security reviews, and actionable code suggestions.

### 10. In-Browser Live UI Sandbox & Visualizer
- **Interactive Component Sandbox**: Live preview with state mutations, live inputs, and mobile/desktop viewport toggle.
- **Visual Node Topology**: Layered interactive architecture graph spanning Edge WAF, Identity Service, App Core, Cache, Queues, and Database.
- **Mermaid.js Flowchart Generator**: Instant copyable diagrams for GitHub Markdown and Notion.
- **Full ZIP Archive Export**: Downloads complete, runnable project archives generated in-browser via JSZip.

---

## 🛠️ Technology Stack

| Layer | Technologies & Libraries | Purpose |
|:------|:-------------------------|:--------|
| **Frontend Framework** | [React 19](https://react.dev/) | Core UI rendering engine |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) | Strict type safety across client and server |
| **Bundler & Build Tool** | [Vite 8](https://vitejs.dev/) | Instant HMR and optimized production bundling |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) | Utility-first responsive dark theme design |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`) | VS Code-level in-browser code editing |
| **Backend Framework** | [Express 4/5](https://expressjs.com/) | RESTful API server and static asset server |
| **Server Runtime** | [Node.js >=20](https://nodejs.org/) & [tsx](https://github.com/privatenumber/tsx) | Fast TypeScript execution for server routes |
| **Database & Persistence** | PostgreSQL / SQLite + Raw SQL Schema (`server/db/schema.sql`) | In-memory and persistent project/repo storage |
| **AI Synthesis Engine** | [@google/genai](https://www.npmjs.com/package/@google/genai) | Google Gemini 3.8 Flash SDK + IBM Granite models |
| **Data Visualization** | [Recharts 3](https://recharts.org/) | Project telemetry, token metrics, and charts |
| **Animations & Effects** | [Framer Motion](https://www.framer.com/motion/) | Cosmic ambient background and page transitions |
| **Icons & Badges** | [Lucide React](https://lucide.dev/) | Clean, accessible SVG iconography |
| **Archive Generation** | [JSZip](https://stuk.github.io/jszip/) | Client-side ZIP archive creation for code export |
| **Syntax Highlighting** | [PrismJS](https://prismjs.com/) | Multi-language syntax highlighting |

---

## 📂 Complete File Structure

```
.
├── .env.example                            # Template for environment variables
├── index.html                              # SPA HTML entry point (SEO & metadata synced)
├── metadata.json                           # AI Studio applet capabilities and permissions
├── package.json                            # Scripts, dependencies, and project metadata
├── server.ts                               # Full-stack server entry point (Express + Vite)
├── tsconfig.json                           # TypeScript compiler options
├── tsconfig.node.json                      # Node-specific TypeScript compiler options
├── vite.config.ts                          # Vite 8 configuration with Tailwind CSS v4
│
├── public/                                 # Static public assets and favicons
│
├── server/                                 # Backend Architecture & Services
│   ├── db/
│   │   ├── projectStore.ts                 # Project CRUD storage with mock data seeding
│   │   ├── projectStore.js                 # ESM companion for project persistence
│   │   ├── repositoryStore.ts              # In-memory & DB store for GitHub repos and files
│   │   └── schema.sql                      # SQL schema for projects, files, reviews, and logs
│   ├── routes/
│   │   ├── githubRoutes.ts                 # GitHub analysis, import, workflow, and file-audit APIs
│   │   ├── projectRoutes.ts                # Project creation, workspace, review, debug, deploy routes
│   │   └── projectRoutes.js                # ESM companion for project routes
│   └── services/
│       ├── aiService.ts                    # Multi-provider AI interface (Gemini 3.8, Granite, etc.)
│       ├── aiService.js                    # ESM companion for AI interface
│       ├── fileAnalysisService.ts          # File complexity, dependency parsing, and AST metrics
│       ├── fileAnalysisService.js          # ESM companion for file analysis
│       ├── githubService.ts                # GitHub API client, AST scanner, and tech detection
│       ├── projectAnalysisService.ts       # Review, debug, and deployment validator service
│       ├── projectAnalysisService.js       # ESM companion for project analysis
│       ├── projectGeneratorService.ts      # Multi-tier full-stack source file code generator
│       ├── projectGeneratorService.js      # ESM companion for project generator
│       ├── workflowService.ts              # End-to-end journey & workflow graph generator
│       └── workflowService.js              # ESM companion for workflow generator
│
└── src/                                    # Frontend Application (React 19 + TypeScript)
    ├── App.tsx                             # Top-level route switch & layout orchestrator
    ├── main.tsx                            # React DOM client entry point
    ├── index.css                           # Global styles & Tailwind CSS v4 root imports
    │
    ├── components/                         # Shared UI Components
    │   ├── ActivityTimeline.tsx            # Live platform activity log
    │   ├── AnalyticsCard.tsx               # Analytics metric cards with sparklines
    │   ├── ApiPlayground.tsx               # Interactive REST endpoint tester
    │   ├── ArchitectureVisualizer.tsx      # Layered system topology & Mermaid diagrams
    │   ├── Button.tsx                      # Button component variants (primary, secondary, glow)
    │   ├── CosmicPlexusBackground.tsx      # Animated canvas particles & gradient blobs
    │   ├── FeatureCard.tsx                 # Core capability showcase cards
    │   ├── Footer.tsx                      # Application footer & status indicator
    │   ├── Hero.tsx                        # Homepage interactive hero section
    │   ├── Input.tsx                       # Styled input and textarea components
    │   ├── LiveUiSandbox.tsx               # In-browser live rendered UI preview
    │   ├── LoadingSpinner.tsx              # Animated loading spinner
    │   ├── MetricsDashboard.tsx            # Recharts analytics graphs (7D/30D/90D)
    │   ├── Modal.tsx                       # Reusable modal container
    │   ├── Navbar.tsx                      # Header navigation, status badge, and routing links
    │   ├── PatlesLotusLogo.tsx             # Geometric brand logo
    │   ├── ProjectCard.tsx                 # Project summary cards
    │   ├── PromptEditor.tsx                # Prompt configuration chips and options
    │   ├── Sidebar.tsx                     # Dashboard and builder navigation drawer
    │   ├── TemplateCard.tsx                # Curated template gallery cards
    │   ├── VirtualTerminal.tsx             # Simulated developer shell with realistic logs
    │   │
    │   ├── github/                         # GitHub Intelligence & File Analysis
    │   │   ├── AnalysisProgress.tsx        # Multi-stage repository scanning indicator
    │   │   ├── ApiExplorer.tsx             # Discovered API endpoint table & inspector
    │   │   ├── ArchitectureGraph.tsx       # System topology graph
    │   │   ├── CodebaseSummary.tsx         # Executive repository overview & tech badges
    │   │   ├── CodeMentor.tsx              # Context-aware AI repository chat mentor
    │   │   ├── CodeViewer.tsx              # Syntax-highlighted file reader with copy action
    │   │   ├── ComponentGraph.tsx          # Visual component dependency hierarchy
    │   │   ├── DatabaseExplorer.tsx        # Schema definitions, models, and flow inspector
    │   │   ├── FileAnalysisPanel.tsx       # File explanation sidebar drawer
    │   │   ├── FileTree.tsx                # Hierarchical folder tree with search
    │   │   ├── GitHubImportForm.tsx        # Repository URL input & quick-load presets
    │   │   ├── RepositoryExplorer.tsx      # Source explorer container with viewer & tree
    │   │   ├── RepositoryHeader.tsx        # Repository title, stars, forks, and branch
    │   │   ├── RepositoryHealth.tsx        # Code quality & test coverage health card
    │   │   ├── RepositorySearch.tsx        # Instant codebase search input
    │   │   ├── RepositoryStats.tsx         # Numerical statistics (LOC, files, commits)
    │   │   ├── TechnologyStack.tsx         # Detected frameworks, libraries, and tools
    │   │   ├── UserJourneyGraph.tsx        # Visual request/response sequence diagram
    │   │   └── file-analysis/              # Comprehensive File Analysis Submodule
    │   │       ├── FileAnalysisHeader.tsx  # KPI cards, search, view mode toggle, categories
    │   │       ├── FileAnalysisView.tsx    # Master container coordinating canvas, tree, table
    │   │       ├── FileDetailDrawer.tsx    # AI audit inspection drawer with fix suggestions
    │   │       ├── FileHotspotsView.tsx    # Blast radius hubs & refactoring candidates
    │   │       ├── FileMetricsTable.tsx    # Sortable table with LOC, complexity, maintainability
    │   │       ├── FileNetworkCanvas.tsx   # Interactive HTML5 Canvas dependency graph
    │   │       └── FileTreemapView.tsx     # Directory-nested LOC treemap visualization
    │   │
    │   └── workflow/                       # Repository Workflow Mapping Submodule
    │       ├── NodeDetailDrawer.tsx        # Workflow node deep inspection drawer
    │       ├── SourceViewerModal.tsx       # Modal previewing file content for clicked nodes
    │       ├── WorkflowHeader.tsx          # Workflow graph search, filtering, and stats
    │       ├── WorkflowNodeComponent.tsx   # Custom styled workflow node
    │       └── WorkflowToolbar.tsx         # Canvas controls (zoom, layout, center)
    │
    ├── context/
    │   └── ProjectContext.tsx              # React Context for active project state
    ├── data/
    │   ├── metricsData.ts                  # Mock analytics timeseries for Recharts
    │   └── mockData.ts                     # Curated prompts, template definitions, and mock specs
    ├── layouts/
    │   ├── DashboardLayout.tsx             # Authenticated developer workbench layout
    │   └── MainLayout.tsx                  # Public landing layout with cosmic background
    ├── pages/
    │   ├── AuthPage.tsx                    # Login, sign-up, and demo user switch
    │   ├── BuilderPage.tsx                 # Project generation form with stack configuration
    │   ├── DashboardPage.tsx               # Projects list, system telemetry, and quick actions
    │   ├── GitHubIntelligencePage.tsx      # GitHub importer, file analysis, and code exploration
    │   ├── LandingPage.tsx                 # Hero section, features, workflows, and CTA
    │   ├── PromptGeneratorPage.tsx         # AI Code & Architecture synthesis workbench
    │   ├── SubModulesPage.tsx              # Standalone route for Assistant, Review, Debug, Deploy
    │   ├── WorkflowPage.tsx                # Interactive end-to-end repository workflow graph
    │   └── WorkspacePage.tsx               # In-browser VS Code Monaco editor workspace
    └── types/
        ├── fileAnalysis.ts                 # Types for file network, metrics, hotspots, and audit
        ├── github.ts                       # Types for repository analysis, files, and APIs
        ├── index.ts                        # Core types for projects, prompts, reviews, and debug
        └── workflow.ts                     # Types for workflow nodes, edges, and journeys
```

---

## 🚀 Step-by-Step Setup Guide

Follow this guide to set up, run, and develop with Patles.ai on your local machine or cloud environment.

### Prerequisites

Verify that your development environment satisfies these requirements:
- **Node.js**: `v20.0.0` or higher (Node.js 22 LTS recommended).
  ```bash
  node -v
  ```
- **npm**: `v10.0.0` or higher (or `pnpm` / `yarn`).
  ```bash
  npm -v
  ```
- **Git**: Installed and available in your shell path.

---

### Step 1: Clone the Repository

Clone the project from GitHub and navigate into the project directory:

```bash
git clone https://github.com/your-username/patles-ai.git
cd patles-ai
```

---

### Step 2: Install Dependencies

Install all client and server npm dependencies:

```bash
npm install
```

This installs core libraries including React 19, Vite 8, Tailwind CSS v4, Express, `@google/genai`, `@monaco-editor/react`, `recharts`, `lucide-react`, `framer-motion`, `jszip`, and `prismjs`.

---

### Step 3: Environment Configuration

Create a local environment file from the provided `.env.example`:

```bash
cp .env.example .env
```

Open `.env` in your text editor and configure the parameters:

```env
# ========================================================
# PATLES.AI ENVIRONMENT CONFIGURATION
# ========================================================

# Google Gemini API Key (Required for live Gemini AI generation)
# Get your free key at: https://aistudio.google.com/
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Port on which the Express development/production server runs (default: 3000)
PORT=3000

# Base URL for local requests and self-referential endpoints
APP_URL="http://localhost:3000"

# Optional: PostgreSQL Database Connection String
# If omitted, Patles.ai uses its built-in in-memory and SQLite-compatible data store
# DATABASE_URL="postgresql://user:password@localhost:5432/patles_ai"

# Optional: IBM Granite / Alternative Model API endpoint (if applicable)
# GRANITE_API_ENDPOINT="https://api.granite.ibm.com/v1"
```

> **Note**: In Google AI Studio Build environments, the `GEMINI_API_KEY` is injected securely on the server side automatically.

---

### Step 4: Database Schema Initialization

The database schema is fully defined in `server/db/schema.sql`.

If you are using PostgreSQL, apply the schema using `psql` or your database GUI:

```bash
# Optional: Apply schema to your PostgreSQL database
psql $DATABASE_URL -f server/db/schema.sql
```

If you are running the default in-memory/file-backed mode, the server initializes default sample projects, seeded repositories, and file trees automatically on first startup.

---

### Step 5: Start Development Server

Run the development command to start the unified full-stack server:

```bash
npm run dev
```

This command runs `tsx server.ts`, which starts the Express backend on port `3000` with the Vite development server attached as middleware.

Open your browser and navigate to:
```
http://localhost:3000
```

---

### Step 6: Build for Production

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

## 📄 Contributing & License

Contributions, bug reports, and feature proposals are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

This project is licensed under the [MIT License](LICENSE).
