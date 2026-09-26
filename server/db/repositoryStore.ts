import fs from 'fs';
import path from 'path';

export interface GitHubRepositoryRow {
  id: string;
  user_id: string;
  owner: string;
  name: string;
  url: string;
  branch: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  open_issues: number;
  size: number;
  default_branch: string;
  latest_commit_sha?: string;
  latest_commit_message?: string;
  created_at: string;
  updated_at: string;
}

export interface RepositoryFileRow {
  id: string;
  repository_id: string;
  path: string;
  file_name: string;
  language: string;
  size: number;
  content: string;
  sha?: string;
}

export interface RepositoryAnalysisRow {
  id: string;
  repository_id: string;
  technology_stack: any[];
  frameworks: string[];
  database: any;
  api_count: number;
  component_count: number;
  apis: any[];
  dependencies: any[];
  summary: any;
  architecture: any;
  health: any;
  user_journeys: any[];
  component_graph: any;
  created_at: string;
}

export interface CodeExplanationRow {
  id: string;
  repository_id: string;
  file_id: string;
  file_path: string;
  summary: string;
  purpose: string;
  functions: any[];
  inputs?: string;
  outputs?: string;
  dependencies: string[];
  api_info: string[];
  database_info: string;
  security_notes: string;
  created_at: string;
}

class RepositoryStore {
  private repositories: Map<string, GitHubRepositoryRow> = new Map();
  private files: Map<string, RepositoryFileRow[]> = new Map(); // repoId -> files
  private analyses: Map<string, RepositoryAnalysisRow> = new Map(); // repoId -> analysis
  private explanations: Map<string, CodeExplanationRow[]> = new Map(); // repoId -> explanations

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const sampleRepoId = 'patlesai_patles-ai-core';
    const sampleRepo: GitHubRepositoryRow = {
      id: sampleRepoId,
      user_id: 'usr_developer',
      owner: 'patlesai',
      name: 'patles-ai-core',
      url: 'https://github.com/patlesai/patles-ai-core',
      branch: 'main',
      description: 'Patles.ai enterprise code intelligence, real-time repository analyzer, and multi-tier application engine',
      language: 'TypeScript',
      stars: 1420,
      forks: 312,
      open_issues: 8,
      size: 14250,
      default_branch: 'main',
      latest_commit_sha: 'a8f93e1',
      latest_commit_message: 'feat: add interactive project workflow visualization engine',
      created_at: '2026-01-15T10:00:00Z',
      updated_at: new Date().toISOString()
    };
    this.repositories.set(sampleRepoId, sampleRepo);

    const sampleFiles: RepositoryFileRow[] = [
      {
        id: `file_${sampleRepoId}_1`,
        repository_id: sampleRepoId,
        path: 'src/App.tsx',
        file_name: 'App.tsx',
        language: 'tsx',
        size: 4200,
        content: `import React from 'react';\nimport { DashboardPage } from './pages/DashboardPage';\nimport { WorkflowPage } from './pages/WorkflowPage';\nimport { Navbar } from './components/Navbar';\nimport { Sidebar } from './components/Sidebar';\n\nexport default function App() {\n  return <div><Navbar /><Sidebar /><WorkflowPage /></div>;\n}`
      },
      {
        id: `file_${sampleRepoId}_2`,
        repository_id: sampleRepoId,
        path: 'src/pages/DashboardPage.tsx',
        file_name: 'DashboardPage.tsx',
        language: 'tsx',
        size: 5100,
        content: `import React, { useEffect, useState } from 'react';\nimport axios from 'axios';\nimport { ProjectCard } from '../components/ProjectCard';\n\nexport const DashboardPage = () => {\n  useEffect(() => {\n    axios.get('/api/projects');\n    axios.get('/api/metrics');\n  }, []);\n  return <div>Dashboard</div>;\n};`
      },
      {
        id: `file_${sampleRepoId}_3`,
        repository_id: sampleRepoId,
        path: 'src/pages/WorkflowPage.tsx',
        file_name: 'WorkflowPage.tsx',
        language: 'tsx',
        size: 6800,
        content: `import React, { useEffect } from 'react';\nimport axios from 'axios';\nimport { WorkflowCanvas } from '../components/workflow/WorkflowCanvas';\n\nexport const WorkflowPage = () => {\n  useEffect(() => {\n    axios.get('/api/github/repositories/1/workflow');\n  }, []);\n  return <WorkflowCanvas />;\n};`
      },
      {
        id: `file_${sampleRepoId}_4`,
        repository_id: sampleRepoId,
        path: 'src/pages/AuthPage.tsx',
        file_name: 'AuthPage.tsx',
        language: 'tsx',
        size: 3400,
        content: `import React from 'react';\nimport axios from 'axios';\n\nexport const AuthPage = () => {\n  const handleLogin = (creds) => {\n    axios.post('/api/auth/login', creds);\n  };\n  return <div>Auth</div>;\n};`
      },
      {
        id: `file_${sampleRepoId}_5`,
        repository_id: sampleRepoId,
        path: 'src/services/apiClient.ts',
        file_name: 'apiClient.ts',
        language: 'ts',
        size: 1900,
        content: `import axios from 'axios';\n\nexport const apiClient = {\n  login: (data) => axios.post('/api/auth/login', data),\n  getRepos: () => axios.get('/api/github/repositories'),\n  getWorkflow: (id) => axios.get(\`/api/github/repositories/\${id}/workflow\`),\n};`
      },
      {
        id: `file_${sampleRepoId}_6`,
        repository_id: sampleRepoId,
        path: 'server/routes/authRoutes.ts',
        file_name: 'authRoutes.ts',
        language: 'ts',
        size: 2800,
        content: `import { Router } from 'express';\nimport * as authController from '../controllers/authController';\nimport { verifyToken } from '../middleware/authMiddleware';\n\nconst router = Router();\nrouter.post('/api/auth/login', authController.login);\nrouter.post('/api/auth/signup', authController.signup);\nrouter.get('/api/auth/me', verifyToken, authController.getProfile);\nexport default router;`
      },
      {
        id: `file_${sampleRepoId}_7`,
        repository_id: sampleRepoId,
        path: 'server/routes/projectRoutes.ts',
        file_name: 'projectRoutes.ts',
        language: 'ts',
        size: 3100,
        content: `import { Router } from 'express';\nimport * as projectController from '../controllers/projectController';\n\nconst router = Router();\nrouter.get('/api/projects', projectController.listProjects);\nrouter.post('/api/projects/analyze', projectController.analyze);\nexport default router;`
      },
      {
        id: `file_${sampleRepoId}_8`,
        repository_id: sampleRepoId,
        path: 'server/controllers/authController.ts',
        file_name: 'authController.ts',
        language: 'ts',
        size: 3600,
        content: `import { userService } from '../services/userService';\nimport bcrypt from 'bcrypt';\nimport jwt from 'jsonwebtoken';\n\nexport const login = async (req, res) => {\n  const user = await userService.findByEmail(req.body.email);\n  const valid = await bcrypt.compare(req.body.password, user.password_hash);\n  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);\n  return res.json({ token, user });\n};`
      },
      {
        id: `file_${sampleRepoId}_9`,
        repository_id: sampleRepoId,
        path: 'server/controllers/projectController.ts',
        file_name: 'projectController.ts',
        language: 'ts',
        size: 3200,
        content: `import { projectService } from '../services/projectService';\n\nexport const listProjects = async (req, res) => {\n  const projects = await projectService.getProjects();\n  return res.json({ projects });\n};`
      },
      {
        id: `file_${sampleRepoId}_10`,
        repository_id: sampleRepoId,
        path: 'server/services/userService.ts',
        file_name: 'userService.ts',
        language: 'ts',
        size: 2900,
        content: `import { db } from '../db';\nimport { users } from '../db/schema';\n\nexport const userService = {\n  findByEmail: async (email) => db.select().from(users).where({ email }),\n  create: async (data) => db.insert(users).values(data)\n};`
      },
      {
        id: `file_${sampleRepoId}_11`,
        repository_id: sampleRepoId,
        path: 'server/services/projectService.ts',
        file_name: 'projectService.ts',
        language: 'ts',
        size: 3400,
        content: `import { db } from '../db';\nimport { projects, repositories } from '../db/schema';\n\nexport const projectService = {\n  getProjects: async () => db.select().from(projects),\n  getRepos: async () => db.select().from(repositories)\n};`
      },
      {
        id: `file_${sampleRepoId}_12`,
        repository_id: sampleRepoId,
        path: 'server/middleware/authMiddleware.ts',
        file_name: 'authMiddleware.ts',
        language: 'ts',
        size: 1800,
        content: `import jwt from 'jsonwebtoken';\n\nexport const verifyToken = (req, res, next) => {\n  const auth = req.headers.authorization;\n  if (!auth) return res.status(401).json({ error: 'Unauthorized' });\n  next();\n};`
      },
      {
        id: `file_${sampleRepoId}_13`,
        repository_id: sampleRepoId,
        path: 'server/db/schema.ts',
        file_name: 'schema.ts',
        language: 'ts',
        size: 3900,
        content: `import { pgTable, text, serial, timestamp, integer } from 'drizzle-orm/pg-core';\n\nexport const users = pgTable('users', {\n  id: serial('id').primaryKey(),\n  email: text('email').notNull().unique(),\n  password_hash: text('password_hash').notNull(),\n  created_at: timestamp('created_at').defaultNow()\n});\n\nexport const projects = pgTable('projects', {\n  id: serial('id').primaryKey(),\n  user_id: integer('user_id').references(() => users.id),\n  name: text('name').notNull(),\n  status: text('status').default('active')\n});\n\nexport const appointments = pgTable('appointments', {\n  id: serial('id').primaryKey(),\n  user_id: integer('user_id').references(() => users.id),\n  title: text('title').notNull()\n});\n\nexport const sessions = pgTable('sessions', {\n  id: serial('id').primaryKey(),\n  user_id: integer('user_id').references(() => users.id),\n  token: text('token').notNull()\n});`
      }
    ];
    this.files.set(sampleRepoId, sampleFiles);

    const sampleAnalysis: RepositoryAnalysisRow = {
      id: `analysis_${sampleRepoId}`,
      repository_id: sampleRepoId,
      technology_stack: [
        { name: 'React', category: 'frontend', confidence: 100, sourceFile: 'package.json' },
        { name: 'TypeScript', category: 'language', confidence: 98, sourceFile: 'tsconfig.json' },
        { name: 'Tailwind CSS', category: 'frontend', confidence: 95, sourceFile: 'tailwind.config.js' },
        { name: 'Express', category: 'backend', confidence: 95, sourceFile: 'package.json' },
        { name: 'PostgreSQL', category: 'database', confidence: 92, sourceFile: 'schema.ts' },
        { name: 'Drizzle ORM', category: 'database', confidence: 95, sourceFile: 'package.json' },
        { name: 'JWT Auth', category: 'backend', confidence: 90, sourceFile: 'authMiddleware.ts' }
      ],
      frameworks: ['React', 'Express', 'Tailwind CSS', 'Drizzle ORM'],
      database: {
        type: 'PostgreSQL',
        orm: 'Drizzle ORM',
        schemaFiles: ['server/db/schema.ts'],
        models: ['users', 'projects', 'appointments', 'sessions'],
        flow: ['React Client', 'Express Router', 'Drizzle ORM', 'PostgreSQL DB']
      },
      api_count: 5,
      component_count: 12,
      apis: [
        { method: 'POST', path: '/api/auth/login', filePath: 'server/routes/authRoutes.ts', purpose: 'Authenticates user and signs session token' },
        { method: 'POST', path: '/api/auth/signup', filePath: 'server/routes/authRoutes.ts', purpose: 'Creates new user record with salted password' },
        { method: 'GET', path: '/api/projects', filePath: 'server/routes/projectRoutes.ts', purpose: 'Retrieves active user project records' },
        { method: 'POST', path: '/api/projects/analyze', filePath: 'server/routes/projectRoutes.ts', purpose: 'Executes repository intelligence deep scan' },
        { method: 'GET', path: '/api/github/repositories', filePath: 'server/routes/githubRoutes.ts', purpose: 'Lists all indexed repositories' }
      ],
      dependencies: [
        { name: 'react', version: '^19.0.0', category: 'frontend', purpose: 'UI component framework' },
        { name: 'express', version: '^4.21.0', category: 'backend', purpose: 'HTTP server runtime' },
        { name: 'drizzle-orm', version: '^0.38.0', category: 'database', purpose: 'Type-safe SQL ORM' },
        { name: 'pg', version: '^8.13.0', category: 'database', purpose: 'PostgreSQL client driver' }
      ],
      summary: {},
      architecture: {
        pattern: 'Multi-Tier Client-Server Monorepo',
        description: 'React SPA communicating via Axios REST API with Express Node.js services and PostgreSQL persistence layer.',
        nodes: []
      },
      health: {
        score: 96,
        status: 'Optimal',
        filesScanned: sampleFiles.length,
        linesOfCode: 38500,
        componentsCount: 12,
        apiCount: 5,
        databaseStatus: 'Active',
        dependenciesCount: 18
      },
      user_journeys: [
        { step: 1, name: 'Landing & Discovery', role: 'Anonymous User', action: 'Inspects developer workbench capabilities and features' },
        { step: 2, name: 'Login & Verification', role: 'New Developer', action: 'Signs in via /api/auth/login and receives JWT Bearer token' },
        { step: 3, name: 'Repository Explorer', role: 'Authenticated Developer', action: 'Accesses Project Dashboard and selects target repository' },
        { step: 4, name: 'Interactive Workflow Graph', role: 'System Architect', action: 'Visualizes full-stack entity relationships from UI to PostgreSQL' },
        { step: 5, name: 'Architecture Verification', role: 'Lead Engineer', action: 'Validates API routes, controller services, and relational tables' }
      ],
      component_graph: {},
      created_at: new Date().toISOString()
    };
    this.analyses.set(sampleRepoId, sampleAnalysis);
  }

  // Repositories
  async getRepository(id: string): Promise<GitHubRepositoryRow | null> {
    return this.repositories.get(id) || null;
  }

  async getRepositoryByUrl(url: string): Promise<GitHubRepositoryRow | null> {
    const cleanUrl = url.toLowerCase().replace(/\/$/, '');
    for (const repo of this.repositories.values()) {
      if (repo.url.toLowerCase().replace(/\/$/, '') === cleanUrl) {
        return repo;
      }
    }
    return null;
  }

  async getAllRepositories(): Promise<GitHubRepositoryRow[]> {
    return Array.from(this.repositories.values()).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  async saveRepository(repo: GitHubRepositoryRow): Promise<GitHubRepositoryRow> {
    this.repositories.set(repo.id, { ...repo, updated_at: new Date().toISOString() });
    return repo;
  }

  // Files
  async getFiles(repositoryId: string): Promise<RepositoryFileRow[]> {
    const list = this.files.get(repositoryId) || [];
    const allPaths = new Set(list.map(f => f.path));
    // Filter out entries that are parent directories of other files
    return list.filter(f => {
      if (f.path.endsWith('/')) return false;
      const isDir = Array.from(allPaths).some(other => other !== f.path && other.startsWith(f.path + '/'));
      return !isDir;
    });
  }

  async getFileById(fileId: string): Promise<RepositoryFileRow | null> {
    for (const fileList of this.files.values()) {
      const found = fileList.find(f => f.id === fileId || f.path === fileId);
      if (found) return found;
    }
    return null;
  }

  async getFileByPath(repositoryId: string, filePath: string): Promise<RepositoryFileRow | null> {
    const fileList = this.files.get(repositoryId) || [];
    return fileList.find(f => f.path === filePath) || null;
  }

  async saveFiles(repositoryId: string, files: RepositoryFileRow[]): Promise<void> {
    this.files.set(repositoryId, files);
  }

  // Analysis
  async getAnalysis(repositoryId: string): Promise<RepositoryAnalysisRow | null> {
    return this.analyses.get(repositoryId) || null;
  }

  async saveAnalysis(analysis: RepositoryAnalysisRow): Promise<RepositoryAnalysisRow> {
    this.analyses.set(analysis.repository_id, analysis);
    return analysis;
  }

  // Code Explanations
  async getExplanation(repositoryId: string, fileId: string): Promise<CodeExplanationRow | null> {
    const list = this.explanations.get(repositoryId) || [];
    return list.find(e => e.file_id === fileId) || null;
  }

  async saveExplanation(explanation: CodeExplanationRow): Promise<CodeExplanationRow> {
    const list = this.explanations.get(explanation.repository_id) || [];
    const index = list.findIndex(e => e.file_id === explanation.file_id);
    if (index >= 0) {
      list[index] = explanation;
    } else {
      list.push(explanation);
    }
    this.explanations.set(explanation.repository_id, list);
    return explanation;
  }

  async searchRepository(repositoryId: string, query: string): Promise<any[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const fileList = this.files.get(repositoryId) || [];
    const analysis = this.analyses.get(repositoryId);
    const results: any[] = [];

    // Search file names & content
    for (const f of fileList) {
      const nameMatch = f.file_name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q);
      const contentIndex = f.content ? f.content.toLowerCase().indexOf(q) : -1;

      if (nameMatch || contentIndex !== -1) {
        let snippet = '';
        if (contentIndex !== -1 && f.content) {
          const start = Math.max(0, contentIndex - 40);
          const end = Math.min(f.content.length, contentIndex + q.length + 60);
          snippet = f.content.substring(start, end).replace(/\n/g, ' ');
        }

        results.push({
          type: nameMatch ? 'file' : 'content',
          id: f.id,
          path: f.path,
          fileName: f.file_name,
          language: f.language,
          snippet: snippet ? `...${snippet}...` : undefined,
          match: nameMatch ? 'Filename match' : 'Code content match'
        });
      }
    }

    // Search APIs
    if (analysis && analysis.apis) {
      for (const api of analysis.apis) {
        if (
          api.path?.toLowerCase().includes(q) ||
          api.method?.toLowerCase().includes(q) ||
          api.purpose?.toLowerCase().includes(q)
        ) {
          results.push({
            type: 'api',
            path: api.filePath,
            fileName: path.basename(api.filePath || 'api'),
            snippet: `${api.method} ${api.path} - ${api.purpose}`,
            match: 'API Endpoint'
          });
        }
      }
    }

    return results.slice(0, 30);
  }
}

export const repositoryStore = new RepositoryStore();
