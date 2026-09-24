import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { githubRouter } from './server/routes/githubRoutes.js';
import { projectRouter } from './server/routes/projectRoutes.js';
import { projectStore } from './server/db/projectStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use('/api/github', githubRouter);
  app.use('/api/projects', projectRouter);

  // Initialize Gemini AI Client if API key is present
  const geminiApiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (geminiApiKey) {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(geminiApiKey),
      timestamp: new Date().toISOString(),
      engine: geminiApiKey ? 'Gemini 3.8 Flash' : 'Patles Semantic Generator',
    });
  });

  // Project and Architecture Generation API
  app.post('/api/generate-project', async (req, res) => {
    try {
      const {
        prompt,
        projectType = 'fullstack',
        modelId = 'ibm-granite',
        architecturePattern = 'Event-Driven Microservices',
        databaseDialect = 'PostgreSQL (Drizzle ORM)'
      } = req.body;

      if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.status(400).json({ error: 'Prompt specification is required' });
      }

      let synthesized: any = null;
      let isAIGenerated = false;
      let engineUsed = 'Patles Semantic Generator';

      // If Gemini API is available, attempt real AI generation with multi-model fallback
      if (ai) {
        const systemInstruction = `You are Patles.ai, a principal cloud architect and staff full-stack engineer. 
Given a user specification for an application, you generate:
1. Complete architectural breakdown (system pattern, data flows, scalability, security, layered node graph, and Mermaid diagram).
2. Production-grade frontend code (TypeScript React 19 component with Tailwind CSS).
3. Production-grade backend code (Express TypeScript router with validation, controllers, and middleware).
4. Production-grade database schema (PostgreSQL Drizzle ORM schema with tables and relationships).
5. Comprehensive README.md with setup instructions, prerequisites, environment variables, and run commands.

Return ONLY a valid JSON object matching this TypeScript interface without any surrounding markdown backticks or commentary:
{
  "projectName": string,
  "projectType": "website" | "mobile" | "fullstack",
  "model": string,
  "summary": string,
  "architecture": {
    "pattern": string,
    "description": string,
    "scalabilitySummary": string,
    "securityProtocol": string,
    "dataFlowSteps": string[],
    "nodes": [
      {
        "id": string,
        "name": string,
        "category": "client" | "gateway" | "service" | "cache" | "database" | "queue" | "ai",
        "tech": string,
        "description": string,
        "connections": string[],
        "latency": string,
        "security": string
      }
    ],
    "mermaidDiagram": string
  },
  "frontend": {
    "framework": string,
    "fileCount": number,
    "mainFile": string,
    "sampleCode": string,
    "previewType": string
  },
  "backend": {
    "runtime": string,
    "endpoints": [
      {
        "method": "GET" | "POST" | "PUT" | "DELETE",
        "path": string,
        "desc": string,
        "sampleResponse": string
      }
    ],
    "sampleCode": string
  },
  "database": {
    "dialect": string,
    "tables": string[],
    "schemaCode": string
  },
  "readme": {
    "overview": string,
    "installCmd": string,
    "runCmd": string,
    "features": string[],
    "envVars": string[]
  }
}`;

        const userContent = `Application Request: "${prompt}"
Target Type: ${projectType}
Preferred Architecture Pattern: ${architecturePattern}
Database Dialect: ${databaseDialect}

Synthesize complete architecture, system nodes, frontend code, backend endpoints with sample responses, database schema, and project README.`;

        // Try candidate models in order of stability
        const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash'];
        
        for (const candidateModel of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: candidateModel,
              contents: userContent,
              config: {
                systemInstruction,
                responseMimeType: 'application/json',
                temperature: 0.3,
              }
            });

            if (response.text) {
              let cleaned = response.text.trim();
              if (cleaned.startsWith('```json')) {
                cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
              } else if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
              }

              const parsed = JSON.parse(cleaned);
              if (parsed.projectName && parsed.architecture && parsed.frontend) {
                synthesized = parsed;
                isAIGenerated = true;
                engineUsed = candidateModel;
                break;
              }
            }
          } catch (modelErr: any) {
            console.warn(`Model ${candidateModel} failed or unavailable:`, modelErr?.status || modelErr?.message || modelErr);
          }
        }
      }

      // If AI models were unavailable or in high demand, use the deterministic synthesizer
      if (!synthesized) {
        synthesized = generateDynamicProject(prompt, projectType, modelId, architecturePattern, databaseDialect);
        isAIGenerated = false;
        engineUsed = 'Patles Semantic Architecture Engine';
      }

      // Always create a persistent project record in projectStore
      const projectId = `proj_${(synthesized.projectName || 'project').toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString(36)}`;
      try {
        await projectStore.createProject({
          id: projectId,
          user_id: 'usr_developer',
          name: synthesized.projectName || 'Generated App',
          slug: (synthesized.projectName || 'generated-app').toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: synthesized.summary || `Synthesized from prompt: ${prompt}`,
          prompt,
          project_type: (projectType as any) || 'fullstack',
          frontend: synthesized.frontend?.framework || 'React',
          backend: synthesized.backend?.runtime || 'Node.js + Express',
          database_name: synthesized.database?.dialect || 'PostgreSQL',
          features: synthesized.readme?.features || ['Authentication', 'API Integration', 'Responsive UI'],
          status: 'Ready',
          stars: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        // Store source files
        const filesToPersist = [
          {
            path: 'src/App.tsx',
            fileName: 'App.tsx',
            language: 'typescript',
            content: synthesized.frontend?.sampleCode || '// App component'
          },
          {
            path: 'src/server/routes.ts',
            fileName: 'routes.ts',
            language: 'typescript',
            content: synthesized.backend?.sampleCode || '// Express router'
          },
          {
            path: 'src/db/schema.ts',
            fileName: 'schema.ts',
            language: 'typescript',
            content: synthesized.database?.schemaCode || '// Drizzle schema'
          },
          {
            path: 'README.md',
            fileName: 'README.md',
            language: 'markdown',
            content: synthesized.readme?.overview || '# Project'
          },
          {
            path: '.env.example',
            fileName: '.env.example',
            language: 'bash',
            content: (synthesized.readme?.envVars || ['PORT=3000', 'DATABASE_URL=postgresql://localhost:5432/db']).join('\n')
          },
          {
            path: 'package.json',
            fileName: 'package.json',
            language: 'json',
            content: JSON.stringify({
              name: (synthesized.projectName || 'project').toLowerCase().replace(/[^a-z0-9]/g, '-'),
              version: '1.0.0',
              private: true,
              scripts: {
                dev: synthesized.readme?.runCmd || 'npm run dev',
                build: 'vite build',
                start: 'node dist/server.js'
              },
              dependencies: {
                react: '^19.0.0',
                'react-dom': '^19.0.0',
                express: '^5.0.0',
                'drizzle-orm': '^0.35.0',
                'lucide-react': '^0.450.0'
              }
            }, null, 2)
          }
        ];

        for (const file of filesToPersist) {
          await projectStore.saveFile({
            id: `file_${projectId}_${file.fileName}`,
            project_id: projectId,
            path: file.path,
            file_name: file.fileName,
            language: file.language,
            size: file.content.length,
            content: file.content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (storeErr) {
        console.warn('Could not persist project into projectStore:', storeErr);
      }

      return res.json({
        ...synthesized,
        projectId,
        isAIGenerated,
        engineUsed
      });
    } catch (err: any) {
      console.error('Generation endpoint error:', err);
      res.status(500).json({ error: err.message || 'Internal generation failure' });
    }
  });

  // Vite integration: middleware in dev, static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> Patles.ai Server running at http://0.0.0.0:${PORT}`);
  });
}

/**
 * High-fidelity contextual project generator
 * Dynamically constructs rich architecture diagrams, typed components, API routes, and schema
 */
function generateDynamicProject(
  prompt: string,
  type: string,
  modelId: string,
  pattern: string,
  dialect: string
) {
  const pLower = prompt.toLowerCase();
  
  // Extract keywords or domain
  const isEcommerce = pLower.includes('shop') || pLower.includes('store') || pLower.includes('cart') || pLower.includes('product') || pLower.includes('commerce');
  const isHealthcare = pLower.includes('health') || pLower.includes('patient') || pLower.includes('doctor') || pLower.includes('clinic') || pLower.includes('medical');
  const isCrypto = pLower.includes('crypto') || pLower.includes('trade') || pLower.includes('token') || pLower.includes('wallet') || pLower.includes('defi');
  const isChatOrCollab = pLower.includes('chat') || pLower.includes('message') || pLower.includes('collab') || pLower.includes('whiteboard') || pLower.includes('team');
  const isAIApp = pLower.includes('agent') || pLower.includes('ai') || pLower.includes('llm') || pLower.includes('model') || pLower.includes('bot');

  let domainName = 'CoreEngine';
  let entitySingular = 'item';
  let entityPlural = 'items';
  let primaryTable = 'items';
  let secondaryTable = 'activities';

  if (isEcommerce) {
    domainName = 'AuraCommerce';
    entitySingular = 'product';
    entityPlural = 'products';
    primaryTable = 'products';
    secondaryTable = 'orders';
  } else if (isHealthcare) {
    domainName = 'MediPulse';
    entitySingular = 'patient';
    entityPlural = 'patients';
    primaryTable = 'patients';
    secondaryTable = 'consultations';
  } else if (isCrypto) {
    domainName = 'NovaTrade';
    entitySingular = 'asset';
    entityPlural = 'assets';
    primaryTable = 'order_book';
    secondaryTable = 'trade_executions';
  } else if (isChatOrCollab) {
    domainName = 'SyncCanvas';
    entitySingular = 'room';
    entityPlural = 'rooms';
    primaryTable = 'collaboration_rooms';
    secondaryTable = 'event_log';
  } else if (isAIApp) {
    domainName = 'CognitiveAgent';
    entitySingular = 'workflow';
    entityPlural = 'workflows';
    primaryTable = 'agent_workflows';
    secondaryTable = 'execution_traces';
  }

  const cleanTitle = prompt.length > 36 ? prompt.substring(0, 36) + '...' : prompt;
  const projectSlug = domainName.toLowerCase() + '-platform';

  const architectureNodes = [
    {
      id: 'node-client',
      name: type === 'mobile' ? 'React Native Client' : 'Next.js 15 / React 19 Client',
      category: 'client' as const,
      tech: type === 'mobile' ? 'Expo SDK 52 + Tailwind' : 'Vite + React 19 + Tailwind v4',
      description: 'Zero-latency interactive client with optimistic state updates and WebSocket telemetry subscription.',
      connections: ['node-gateway'],
      latency: '14ms',
      security: 'TLS 1.3 / Strict CSP'
    },
    {
      id: 'node-gateway',
      name: 'Cloudflare Edge / API Gateway',
      category: 'gateway' as const,
      tech: 'Envoy Proxy + JWT Validator',
      description: 'Global edge termination, DDoS shielding, rate limiting (100 req/sec), and token validation.',
      connections: ['node-auth-service', 'node-core-service'],
      latency: '4ms',
      security: 'mTLS + WAF Rule Group'
    },
    {
      id: 'node-auth-service',
      name: 'Auth & RBAC Identity Service',
      category: 'service' as const,
      tech: 'Go / Node.js Microservice',
      description: 'Session rotation, cryptographic signing, multi-tenant RBAC policies, and OAuth2 federated login.',
      connections: ['node-cache', 'node-db'],
      latency: '8ms',
      security: 'Ed25519 Signed JWTs'
    },
    {
      id: 'node-core-service',
      name: `${domainName} Application Service`,
      category: 'service' as const,
      tech: 'TypeScript / Express 5 Engine',
      description: `Domain controller orchestrating ${entityPlural}, event triggers, and business logic pipelines.`,
      connections: ['node-cache', 'node-queue', 'node-db'],
      latency: '12ms',
      security: 'RBAC Enforcement Layer'
    },
    {
      id: 'node-cache',
      name: 'Redis L2 Distributed Cache',
      category: 'cache' as const,
      tech: 'Redis v7 Cluster (Multi-AZ)',
      description: 'In-memory fast lookup cache for active sessions, live presence, and read-through caching.',
      connections: [],
      latency: '<1.2ms',
      security: 'TLS Auth + VPC Peering'
    },
    {
      id: 'node-queue',
      name: 'BullMQ / Kafka Async Pipeline',
      category: 'queue' as const,
      tech: 'Event Stream Broker',
      description: 'Guaranteed at-least-once message delivery for analytics, webhooks, and worker processing.',
      connections: ['node-worker'],
      latency: '2ms',
      security: 'Encrypted at Rest (AES-256)'
    },
    {
      id: 'node-worker',
      name: 'AI & Background Worker Node',
      category: 'ai' as const,
      tech: 'Node.js Worker Fleet + Gemini SDK',
      description: 'Asynchronous indexing, vector embedding generation, and background batch computations.',
      connections: ['node-db'],
      latency: '28ms',
      security: 'Isolated IAM Role'
    },
    {
      id: 'node-db',
      name: 'Primary PostgreSQL Database',
      category: 'database' as const,
      tech: 'PostgreSQL 16 + Drizzle ORM + pgvector',
      description: 'ACID transactional store with automated read replicas and point-in-time recovery.',
      connections: [],
      latency: '3.5ms',
      security: 'Row-Level Security (RLS)'
    }
  ];

  const mermaidDiagram = `graph TD
  Client["💻 ${type === 'mobile' ? 'Mobile App (Expo)' : 'Web Client (React 19)'}"] -->|"HTTPS / WSS"| Gateway["🛡️ Edge API Gateway & WAF"]
  Gateway -->|"Verify Auth"| AuthService["🔑 Auth & Identity Service"]
  Gateway -->|"Route Requests"| CoreService["⚙️ ${domainName} Service"]
  CoreService -->|"Sub-millisecond Read"| Redis["⚡ Redis Cluster Cache"]
  CoreService -->|"Dispatch Events"| EventQueue["📬 Event Stream (BullMQ)"]
  EventQueue -->|"Consume Jobs"| AIWorker["🤖 AI Worker Fleet"]
  CoreService -->|"Drizzle ORM Queries"| Postgres[("🗄️ PostgreSQL + RLS")]
  AIWorker -->|"Write Embeddings"| Postgres
  AuthService -->|"Session Storage"| Redis`;

  const frontendSampleCode = `import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Plus, 
  Search, 
  Terminal, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface ${domainName}Item {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'synced' | 'pending';
  latency: string;
  updatedAt: string;
}

export default function ${domainName}App() {
  const [items, setItems] = useState<${domainName}Item[]>([
    { id: '1', name: 'Alpha Cluster Gateway', category: 'Infrastructure', status: 'active', latency: '4ms', updatedAt: 'Just now' },
    { id: '2', name: 'Neural Dispatch Pipeline', category: 'Intelligence', status: 'synced', latency: '12ms', updatedAt: '2m ago' },
    { id: '3', name: 'PostgreSQL Vector Sync', category: 'Persistence', status: 'active', latency: '3ms', updatedAt: '5m ago' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newItem: ${domainName}Item = {
        id: String(Date.now()),
        name: 'Node-' + Math.floor(Math.random() * 9000 + 1000),
        category: 'Compute',
        status: 'active',
        latency: Math.floor(Math.random() * 15 + 2) + 'ms',
        updatedAt: 'Just now'
      };
      setItems(prev => [newItem, ...prev]);
      setIsProcessing(false);
    }, 400);
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 p-6 sm:p-8 font-sans">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>${pattern}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">${domainName} Hub</h1>
          <p className="text-xs text-slate-400 mt-1">${cleanTitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleCreate}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isProcessing ? 'Deploying...' : 'Provision Node'}</span>
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-mono text-slate-400">Total ${entityPlural}</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">{items.length} Nodes</div>
          <div className="text-[11px] text-emerald-400 mt-1">✓ 100% Health Score</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-mono text-slate-400">Avg Ingress Latency</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">6.3ms</div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-AZ Edge Accelerated</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-mono text-slate-400">Security Barrier</div>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-1">mTLS Active</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero-Trust Network Model</div>
        </div>
      </section>

      {/* Items Data Grid */}
      <section className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search cluster..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="text-xs font-mono text-slate-400">Showing {filteredItems.length} records</div>
        </div>

        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {filteredItems.map(item => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div>
                  <div className="font-semibold text-slate-200">{item.name}</div>
                  <div className="text-[11px] text-slate-500 font-sans">{item.category} · {item.updatedAt}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-cyan-400">{item.latency}</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] uppercase">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}`;

  const backendSampleCode = `import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const router = express.Router();

// Input Validation Schemas
export const Create${domainName}Schema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().default('General'),
  priority: z.enum(['low', 'normal', 'critical']).default('normal'),
  metadata: z.record(z.unknown()).optional()
});

// Middleware: Authentication & Tenant Context
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid bearer token' });
  }
  // In production, verify JWT claims via Ed25519 public key
  req.user = { id: 'usr_patles_991', role: 'admin', tenant: 'tenant_primary' };
  next();
}

/**
 * GET /api/v1/${entityPlural}
 * Fetch paginated records with cursor and filtering
 */
router.get('/${entityPlural}', requireAuth, async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const mockResults = [
      { id: 'rec_101', name: 'Alpha Cluster Gateway', status: 'active', latencyMs: 4, createdAt: new Date().toISOString() },
      { id: 'rec_102', name: 'Neural Dispatch Pipeline', status: 'synced', latencyMs: 12, createdAt: new Date().toISOString() },
      { id: 'rec_103', name: 'PostgreSQL Vector Sync', status: 'active', latencyMs: 3, createdAt: new Date().toISOString() }
    ];

    res.json({
      success: true,
      data: mockResults,
      pagination: { total: mockResults.length, limit, hasMore: false }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Database query error' });
  }
});

/**
 * POST /api/v1/${entityPlural}
 * Provision new entity with atomic validation & event emission
 */
router.post('/${entityPlural}', requireAuth, async (req: Request, res: Response) => {
  try {
    const validated = Create${domainName}Schema.parse(req.body);
    const newRecord = {
      id: 'rec_' + Date.now(),
      ...validated,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Emit event to background queue (BullMQ / Kafka)
    // await eventQueue.add('entity.created', { recordId: newRecord.id });

    res.status(201).json({
      success: true,
      message: 'Record successfully persisted',
      record: newRecord
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(422).json({ error: 'Validation failed', details: err.errors });
    }
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

/**
 * GET /api/v1/health
 * System telemetry & database connection verification
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    architecture: '${pattern}',
    modelEngine: '${modelId}',
    uptimeSec: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
  });
});

export default router;`;

  const databaseSchemaCode = `import { pgTable, text, timestamp, varchar, integer, jsonb, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Primary Entities Table: ${primaryTable}
 * Stores foundational records with audit timestamps and JSONB metadata
 */
export const ${primaryTable} = pgTable('${primaryTable}', {
  id: varchar('id', { length: 64 }).primaryKey(),
  tenantId: varchar('tenant_id', { length: 64 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 32 }).notNull().default('active'),
  priority: varchar('priority', { length: 32 }).default('normal'),
  metadata: jsonb('metadata').default({}),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => {
  return {
    tenantIdx: index('idx_${primaryTable}_tenant').on(table.tenantId),
    statusIdx: index('idx_${primaryTable}_status').on(table.status),
    createdIdx: index('idx_${primaryTable}_created').on(table.createdAt)
  };
});

/**
 * Audit & Event Log Table: ${secondaryTable}
 * Tracks immutable operational events and user actions
 */
export const ${secondaryTable} = pgTable('${secondaryTable}', {
  id: varchar('id', { length: 64 }).primaryKey(),
  targetId: varchar('target_id', { length: 64 }).references(() => ${primaryTable}.id, { onDelete: 'cascade' }),
  eventType: varchar('event_type', { length: 128 }).notNull(),
  payload: jsonb('payload').default({}),
  performedBy: varchar('performed_by', { length: 64 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => {
  return {
    targetIdx: index('idx_${secondaryTable}_target').on(table.targetId),
    eventIdx: index('idx_${secondaryTable}_type').on(table.eventType)
  };
});

// Relationships
export const ${primaryTable}Relations = relations(${primaryTable}, ({ many }) => ({
  activities: many(${secondaryTable})
}));

export const ${secondaryTable}Relations = relations(${secondaryTable}, ({ one }) => ({
  parent: one(${primaryTable}, {
    fields: [${secondaryTable}.targetId],
    references: [${primaryTable}.id]
  })
}));`;

  const readmeContent = `# ${domainName} — ${cleanTitle}

[![Architecture: ${pattern}](https://img.shields.io/badge/Architecture-${encodeURIComponent(pattern)}-blue.svg)](#)
[![TypeScript: 5.x](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](#)
[![Stack: Full--Stack](https://img.shields.io/badge/Stack-React_19_+_Express_5-9333ea.svg)](#)
[![Database: ${dialect}](https://img.shields.io/badge/Database-${encodeURIComponent(dialect)}-emerald.svg)](#)

> Synthesized autonomously by **Patles.ai Architecture Engine** using model \`${modelId}\`.

---

## 🏗️ Architecture Overview

The system is engineered according to the **${pattern}** paradigm:
- **Client Layer**: Zero-bundle overhead React 19 / Vite client with optimistic state reconciliation.
- **Edge Gateway**: Ingress rate limiting, CORS configuration, and SSL termination.
- **Microservices**: Decoupled domain services handling ${entityPlural} and audit trails.
- **Caching**: L2 Redis distributed caching layer with automated invalidation.
- **Database**: PostgreSQL 16 schema mapped via Drizzle ORM with row-level security policies.

\`\`\`mermaid
${mermaidDiagram}
\`\`\`

---

## ⚡ Quickstart & Setup

### 1. Prerequisites
- **Node.js** >= 20.0.0
- **npm** >= 10.0.0 or **pnpm** >= 9.0.0
- **PostgreSQL** instance (local Docker or cloud provider like Supabase/Neon)

### 2. Installation
\`\`\`bash
# Clone or extract repository
cd ${projectSlug}

# Install all project dependencies
npm install
\`\`\`

### 3. Environment Configuration
Copy the sample environment template and populate your database credentials:
\`\`\`bash
cp .env.example .env
\`\`\`

Populate the following variables:
\`\`\`env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/${projectSlug}
JWT_SECRET=super_secret_cryptographic_key_32_chars
REDIS_URL=redis://localhost:6379
NODE_ENV=development
\`\`\`

### 4. Database Migrations
\`\`\`bash
# Run Drizzle ORM schema migration
npx drizzle-kit push
\`\`\`

### 5. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
Server starts at **http://localhost:3000** with integrated Vite frontend and Express API backend!

---

## 🚀 API Endpoints Reference

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| \`GET\` | \`/api/v1/health\` | System health, uptime, and database telemetry |
| \`GET\` | \`/api/v1/${entityPlural}\` | Paginated listing of ${entityPlural} with filter support |
| \`POST\` | \`/api/v1/${entityPlural}\` | Create new entity with Zod validation & event queue |
| \`GET\` | \`/api/v1/${entityPlural}/:id\` | Retrieve single entity record by UUID |
| \`DELETE\`| \`/api/v1/${entityPlural}/:id\` | Soft-delete entity record with audit trail |

---

## 📦 Project Directory Structure

\`\`\`
${projectSlug}/
├── src/
│   ├── client/           # React 19 Frontend Components
│   │   ├── components/   # UI Library & Design Tokens
│   │   ├── hooks/        # Query Hooks & State Management
│   │   └── App.tsx       # Root Client View
│   ├── server/           # Express API Backend
│   │   ├── controllers/  # Business Logic Handlers
│   │   ├── middleware/   # Auth, Rate Limit, Error Handling
│   │   └── routes.ts     # API Endpoints Router
│   ├── db/               # Database Layer
│   │   └── schema.ts     # Drizzle ORM PostgreSQL Schema
│   └── types/            # Shared End-to-End TypeScript Types
├── package.json          # Dependencies & Scripts
├── tsconfig.json         # Strict TypeScript Configuration
├── vite.config.ts        # Vite Build Bundler Config
└── README.md             # Project Guide
\`\`\`

---

## 🛡️ Security & Scalability Features

- **Row Level Security (RLS)**: Enforced isolation at the database layer.
- **Input Sanitization**: All incoming payloads strictly checked against Zod schemas.
- **CORS & Helmets**: Security headers automatically configured for production.
- **Edge Deployment**: Readily deployable to Cloud Run, Vercel, or AWS ECS.

---
*Generated by Patles.ai*`;

  return {
    projectName: domainName + ' Engine',
    projectType: type as any,
    model: modelId,
    summary: `Production-ready ${type} architecture synthesized via ${modelId} for: "${prompt}"`,
    architecture: {
      pattern,
      description: `High-availability ${pattern} architected for sub-20ms edge latency, automated horizontal scaling, and enterprise zero-trust security.`,
      scalabilitySummary: 'Auto-scales horizontally on Cloud Run / Kubernetes from 0 to 10,000 requests/sec with Redis L2 query caching.',
      securityProtocol: 'Zero-Trust Architecture with TLS 1.3, mTLS inter-service mesh, signed Ed25519 JWT tokens, and strict Zod runtime verification.',
      dataFlowSteps: [
        '1. Ingress request received by Edge CDN & Envoy API Gateway with WAF inspection.',
        '2. Gateway verifies JWT token signature against Auth Identity Service cache.',
        '3. Request routed to Domain Service; cache hit returns from Redis in <1.5ms.',
        '4. Cache miss executes type-safe Drizzle SQL query against PostgreSQL with RLS.',
        '5. State change dispatches async event to BullMQ / Kafka queue for background AI worker tasks.',
        '6. Response serialized and returned with ETag cache-control headers.'
      ],
      nodes: architectureNodes,
      mermaidDiagram
    },
    frontend: {
      framework: type === 'mobile' ? 'React Native / Expo SDK 52' : 'React 19 + Vite 8 + Tailwind CSS v4',
      fileCount: type === 'fullstack' ? 24 : 14,
      mainFile: type === 'mobile' ? 'App.tsx' : 'src/App.tsx',
      sampleCode: frontendSampleCode,
      previewType: isEcommerce ? 'ecommerce' : isHealthcare ? 'healthcare' : isCrypto ? 'crypto' : isChatOrCollab ? 'collab' : 'dashboard'
    },
    backend: {
      runtime: 'Node.js 22 + Express 5 + TypeScript',
      endpoints: [
        {
          method: 'GET',
          path: `/api/v1/${entityPlural}`,
          desc: `Fetch paginated ${entityPlural} with cursor and status filters`,
          sampleResponse: JSON.stringify({
            success: true,
            data: [
              { id: '101', name: 'Alpha Node', status: 'active', latencyMs: 4 },
              { id: '102', name: 'Beta Cluster', status: 'synced', latencyMs: 8 }
            ],
            total: 2
          }, null, 2)
        },
        {
          method: 'POST',
          path: `/api/v1/${entityPlural}`,
          desc: `Provision new ${entitySingular} with atomic Zod validation`,
          sampleResponse: JSON.stringify({
            success: true,
            record: { id: 'rec_992', name: 'Production Node', status: 'active' }
          }, null, 2)
        },
        {
          method: 'GET',
          path: '/api/v1/health',
          desc: 'Cluster telemetry, DB connection pool, and system uptime',
          sampleResponse: JSON.stringify({
            status: 'healthy',
            architecture: pattern,
            uptimeSec: 3624.8,
            memoryMB: 48
          }, null, 2)
        }
      ],
      sampleCode: backendSampleCode
    },
    database: {
      dialect,
      tables: [primaryTable, secondaryTable, 'user_sessions', 'api_rate_limits'],
      schemaCode: databaseSchemaCode
    },
    readme: {
      overview: readmeContent,
      installCmd: 'npm install',
      runCmd: 'npm run dev',
      features: [
        `Architecture Pattern: ${pattern}`,
        `Frontend: ${type === 'mobile' ? 'React Native' : 'React 19 + Tailwind v4'}`,
        `Backend: Express 5 TypeScript with Zod validation`,
        `Database: ${dialect} with automated migrations`,
        'Interactive in-browser testing playground',
        'Multi-AZ Redis caching with sub-2ms latency',
        'Full repository export to .zip archive'
      ],
      envVars: [
        'PORT=3000',
        `DATABASE_URL=postgresql://user:pass@localhost:5432/${projectSlug}`,
        'JWT_SECRET=super_secret_cryptographic_key_32_chars',
        'REDIS_URL=redis://localhost:6379'
      ]
    }
  };
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
});
