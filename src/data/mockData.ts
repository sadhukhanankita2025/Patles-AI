import { 
  FeatureItem, 
  TemplateItem, 
  AnalyticsMetric, 
  ProjectRecord, 
  ActivityItem, 
  AITip,
  AIModel,
  GeneratedProjectStructure 
} from '../types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gemini-3-8',
    name: 'Gemini 3.8 Flash',
    provider: 'Google AI',
    badge: 'Ultra-Fast Architecture Engine',
    description: 'High-speed reasoning model with native code understanding and instant full-stack synthesis.',
    contextWindow: '1M tokens',
    speed: '120 tok/s'
  },
  {
    id: 'ibm-granite',
    name: 'IBM Granite 3.0 Code',
    provider: 'IBM Granite AI',
    badge: 'Enterprise Safe',
    description: 'Trained on 116 languages with verifiable enterprise safety and clean attribution.',
    contextWindow: '128k tokens',
    speed: '85 tok/s'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o Developer Edition',
    provider: 'OpenAI',
    badge: 'Fast Synthesis',
    description: 'Low-latency code generation optimized for full-stack web and mobile apps.',
    contextWindow: '128k tokens',
    speed: '95 tok/s'
  },
  {
    id: 'claude-3-7',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    badge: 'Deep Architecture',
    description: 'State-of-the-art multi-file code reasoning, schema synthesis, and refactoring.',
    contextWindow: '200k tokens',
    speed: '70 tok/s'
  }
];

export const PROMPT_SUGGESTIONS = [
  {
    label: 'Healthcare Website',
    prompt: 'Design an interactive HIPAA-compliant patient portal with telehealth appointment scheduling, lab report telemetry, and doctor messaging in React and Node.js.'
  },
  {
    label: 'Portfolio',
    prompt: 'Build a minimalist software engineer portfolio with dark glassmorphism, interactive interactive GitHub commit timeline, dynamic project filters, and terminal view.'
  },
  {
    label: 'Smart Campus',
    prompt: 'Create a smart university campus operations dashboard tracking lecture hall occupancy, IoT energy consumption, campus bus routes, and student study room booking.'
  },
  {
    label: 'Hospital Management',
    prompt: 'Generate an emergency hospital triage system with real-time bed allocation, vital signs telemetry alert feeds, and surgical suite scheduling.'
  },
  {
    label: 'E-Commerce App',
    prompt: 'Develop an ultra-fast headless streetwear store with dynamic cart drawer, multi-currency pricing, stock countdowns, and Stripe checkout integration.'
  }
];

export const FEATURES: FeatureItem[] = [
  {
    id: 'website-generator',
    title: 'AI Website Generator',
    description: 'Transform natural language prompts into production-grade multi-page web applications with responsive Tailwind CSS, state management, and asset scaffolding in seconds.',
    category: 'Synthesis',
    iconName: 'Layout',
    badgeText: 'Instant Scaffolding',
    metrics: '< 15s avg generation'
  },
  {
    id: 'code-understanding',
    title: 'AI Code Understanding',
    description: 'Deep semantic AST analysis across entire multi-repo structures. Trace call graphs, locate breaking changes, and comprehend unfamiliar dependencies effortlessly.',
    category: 'Intelligence',
    iconName: 'Cpu',
    badgeText: 'AST Semantic Graph',
    metrics: '200k+ token context'
  },
  {
    id: 'code-review',
    title: 'AI Code Review',
    description: 'Automated PR analysis that detects race conditions, memory leaks, OWASP security vulnerabilities, and accessibility compliance before merging.',
    category: 'Quality',
    iconName: 'ShieldCheck',
    badgeText: 'Security Hardened',
    metrics: '99.4% precision'
  },
  {
    id: 'debugging',
    title: 'AI Debugging',
    description: 'Paste stack traces or unhandled exceptions to receive root-cause explanations with single-click automated patch pull requests that resolve edge cases.',
    category: 'Diagnostics',
    iconName: 'Bug',
    badgeText: 'Auto-Remediation',
    metrics: 'Zero-config patches'
  },
  {
    id: 'deployment-validator',
    title: 'Deployment Validator',
    description: 'Pre-flight checks inspecting build artifacts, container manifests, environment variables, and CDN bundle sizes to prevent failed CI/CD pipelines.',
    category: 'DevOps',
    iconName: 'ServerCheck',
    badgeText: 'Pre-flight Guard',
    metrics: 'Catch 98% CI failures'
  },
  {
    id: 'documentation-generator',
    title: 'Documentation Generator',
    description: 'Generate comprehensive OpenAPI specifications, architectural diagrams, typed function docs, and developer onboarding READMEs synced with your codebase.',
    category: 'Docs',
    iconName: 'FileText',
    badgeText: 'Live Doc Sync',
    metrics: 'OpenAPI 3.1 & Markdown'
  }
];

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'healthcare',
    title: 'TeleHealth & Clinical EHR Suite',
    category: 'Healthcare',
    description: 'End-to-end medical portal featuring patient triage records, encrypted WebRTC video visits, and vitals monitoring graphs.',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind'],
    stars: 342,
    forks: 89,
    previewColor: 'from-cyan-500/20 to-blue-600/20',
    defaultPrompt: 'Create a telehealth web platform with HIPAA-friendly patient records, appointment booking calendar, and real-time medical vitals timeline.',
    highlights: ['HIPAA compliant structure', 'Interactive vitals timeline', 'Role-based access (Doctor/Patient)']
  },
  {
    id: 'ecommerce',
    title: 'Aura Headless E-Commerce',
    category: 'E-Commerce',
    description: 'Modern high-converting online storefront with slide-out cart, faceted filter navigation, search indexing, and Stripe billing.',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Stripe', 'Redis'],
    stars: 512,
    forks: 142,
    previewColor: 'from-purple-500/20 to-pink-600/20',
    defaultPrompt: 'Build an elegant dark-themed headless e-commerce store with product collections, filtering by price and tag, dynamic cart drawer, and order checkout.',
    highlights: ['Sub-second page transitions', 'Optimistic cart state', 'Integrated checkout flow']
  },
  {
    id: 'education',
    title: 'EduSphere Interactive STEM Campus',
    category: 'Education',
    description: 'Engaging learning management hub with interactive interactive code challenges, student progress analytics, and live classroom chat.',
    techStack: ['React', 'Vite', 'Express', 'Prisma', 'Socket.io'],
    stars: 288,
    forks: 64,
    previewColor: 'from-blue-500/20 to-indigo-600/20',
    defaultPrompt: 'Design a modern STEM education platform with course syllabus hierarchy, interactive code sandbox runner, and student quiz analytics.',
    highlights: ['Live code runner integration', 'Chapter progress tracking', 'Interactive grading rubrics']
  },
  {
    id: 'portfolio',
    title: 'Apex Developer Portfolio & Tech Blog',
    category: 'Portfolio',
    description: 'Ultra-refined personal developer presence featuring project showcase cards, interactive terminal, markdown blog, and contact form.',
    techStack: ['React', 'TypeScript', 'Motion', 'Tailwind CSS'],
    stars: 620,
    forks: 180,
    previewColor: 'from-emerald-500/20 to-teal-600/20',
    defaultPrompt: 'Scaffold an elite developer portfolio with interactive CLI modal, animated bento project cards, published blog engine, and resume download.',
    highlights: ['Zero layout shift', 'Interactive CLI terminal', 'Bento grid layout']
  },
  {
    id: 'finance',
    title: 'QuantLedger Fintech & Trading Terminal',
    category: 'Finance',
    description: 'Enterprise multi-asset financial ledger with real-time candlestick charts, portfolio PnL tracking, and transaction audit trails.',
    techStack: ['React', 'D3.js', 'Go Backend', 'PostgreSQL', 'Tailwind'],
    stars: 435,
    forks: 98,
    previewColor: 'from-amber-500/20 to-orange-600/20',
    defaultPrompt: 'Create a financial dashboard terminal with multi-currency balance breakdowns, live candle charts, recent transaction audit trail, and wire transfers.',
    highlights: ['Tabular precision data', 'Double-entry ledger model', 'Real-time market tickers']
  }
];

export const ANALYTICS_METRICS: AnalyticsMetric[] = [
  {
    id: 'projects-generated',
    title: 'Projects Generated',
    value: '1,428',
    change: '+28.4%',
    changeType: 'positive',
    timeframe: 'vs last 30 days',
    iconName: 'Boxes',
    sparkline: [40, 48, 52, 60, 58, 70, 85, 92, 108, 120]
  },
  {
    id: 'github-imported',
    title: 'GitHub Repos Imported',
    value: '384',
    change: '+14.2%',
    changeType: 'positive',
    timeframe: 'vs last 30 days',
    iconName: 'GitBranch',
    sparkline: [22, 26, 28, 30, 31, 35, 38, 42, 45, 52]
  },
  {
    id: 'code-reviews',
    title: 'Code Reviews Completed',
    value: '5,892',
    change: '+42.1%',
    changeType: 'positive',
    timeframe: 'vs last 30 days',
    iconName: 'ShieldCheck',
    sparkline: [120, 140, 165, 180, 210, 240, 280, 310, 340, 390]
  },
  {
    id: 'bugs-fixed',
    title: 'Bugs Fixed by AI',
    value: '2,104',
    change: '+31.8%',
    changeType: 'positive',
    timeframe: 'vs last 30 days',
    iconName: 'CheckCircle2',
    sparkline: [50, 55, 62, 70, 75, 88, 98, 112, 125, 142]
  }
];

export const RECENT_PROJECTS: ProjectRecord[] = [
  {
    id: 'proj-01',
    name: 'MediCare Telehealth Hub',
    type: 'fullstack',
    modelUsed: 'IBM Granite 3.0',
    status: 'Ready',
    updatedAt: '12 minutes ago',
    stars: 24,
    branch: 'main',
    url: 'https://medicare.patles.app',
    description: 'HIPAA-compliant telemedicine consultation platform with WebRTC and PostgreSQL.',
    linesOfCode: 14280
  },
  {
    id: 'proj-02',
    name: 'Vortex Quantum Trading',
    type: 'website',
    modelUsed: 'Claude 3.7 Sonnet',
    status: 'Live',
    updatedAt: '2 hours ago',
    stars: 48,
    branch: 'release/v1.2',
    url: 'https://vortex.patles.app',
    description: 'High frequency crypto and algorithmic asset dashboard with streaming charts.',
    linesOfCode: 8930
  },
  {
    id: 'proj-03',
    name: 'SwiftDeliver Courier Mobile',
    type: 'mobile',
    modelUsed: 'GPT-4o Developer',
    status: 'Ready',
    updatedAt: '5 hours ago',
    stars: 12,
    branch: 'feature/driver-flow',
    url: 'https://swiftdeliver.patles.app',
    description: 'Cross-platform driver dispatch and signature receipt tracking app.',
    linesOfCode: 6420
  },
  {
    id: 'proj-04',
    name: 'EduCamp Campus Navigator',
    type: 'fullstack',
    modelUsed: 'IBM Granite 3.0',
    status: 'Building',
    updatedAt: 'Just now',
    stars: 8,
    branch: 'dev',
    description: 'Interactive map and student resource directory for university campuses.',
    linesOfCode: 11200
  },
  {
    id: 'proj-05',
    name: 'Lumina Developer Portfolio',
    type: 'website',
    modelUsed: 'Claude 3.7 Sonnet',
    status: 'Ready',
    updatedAt: 'Yesterday',
    stars: 65,
    branch: 'main',
    url: 'https://lumina.patles.app',
    description: 'Dark-mode personal portfolio with interactive playground and blog.',
    linesOfCode: 4210
  }
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    action: 'Code Review Approved',
    target: 'PR #142 - Refactor auth session tokens',
    timestamp: '8 mins ago',
    status: 'completed',
    model: 'IBM Granite 3.0',
    duration: '2.4s'
  },
  {
    id: 'act-2',
    action: 'Full-Stack Scaffolding',
    target: 'Project MediCare Telehealth Hub',
    timestamp: '25 mins ago',
    status: 'completed',
    model: 'IBM Granite 3.0',
    duration: '14.8s'
  },
  {
    id: 'act-3',
    action: 'NullPointerException Patched',
    target: 'OrderService.ts line 144',
    timestamp: '1 hour ago',
    status: 'completed',
    model: 'Claude 3.7 Sonnet',
    duration: '1.9s'
  },
  {
    id: 'act-4',
    action: 'Deployment Pre-flight Verified',
    target: 'AWS ECS cluster us-east-1',
    timestamp: '3 hours ago',
    status: 'completed',
    model: 'GPT-4o',
    duration: '3.1s'
  },
  {
    id: 'act-5',
    action: 'OpenAPI Spec Generated',
    target: 'Payment Gateway API v2',
    timestamp: '5 hours ago',
    status: 'completed',
    model: 'IBM Granite 3.0',
    duration: '4.2s'
  }
];

export const AI_TIPS: AITip[] = [
  {
    id: 'tip-1',
    title: 'Model Prompting with IBM Granite',
    content: 'When generating backend models, mention specific foreign key constraints. IBM Granite automatically generates indexed relational schemas.',
    category: 'Architecture',
    readTime: '1 min read'
  },
  {
    id: 'tip-2',
    title: 'Automated Test Generation',
    content: 'Use Patles.ai Debugger tab to generate complementary Vitest unit tests right alongside your bug fixes.',
    category: 'Testing',
    readTime: '2 min read'
  },
  {
    id: 'tip-3',
    title: 'Zero-Config Containerization',
    content: 'All generated Full-Stack templates include a multi-stage Dockerfile optimized for sub-100MB production runtimes.',
    category: 'DevOps',
    readTime: '1 min read'
  }
];

export function getSampleGeneratedProject(prompt: string, type: 'website' | 'mobile' | 'fullstack', model: string): GeneratedProjectStructure {
  const title = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt || 'Generated Application';
  const pattern = type === 'fullstack' ? 'Event-Driven Microservices' : type === 'mobile' ? 'Mobile Backend-as-a-Service' : 'Edge-Accelerated Jamstack';
  
  return {
    projectName: 'Patles-' + (prompt.split(' ')[0] || 'App').toLowerCase() + '-v1',
    projectType: type,
    model: model,
    summary: `Production-ready ${type} synthesized via ${model} based on prompt: "${prompt}"`,
    architecture: {
      pattern: pattern,
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
      nodes: [
        {
          id: 'node-client',
          name: type === 'mobile' ? 'React Native Client' : 'Next.js 15 / React 19 Client',
          category: 'client',
          tech: type === 'mobile' ? 'Expo SDK 52 + Tailwind' : 'Vite + React 19 + Tailwind v4',
          description: 'Zero-latency interactive client with optimistic state updates and WebSocket telemetry subscription.',
          connections: ['node-gateway'],
          latency: '14ms',
          security: 'TLS 1.3 / Strict CSP'
        },
        {
          id: 'node-gateway',
          name: 'Cloudflare Edge / API Gateway',
          category: 'gateway',
          tech: 'Envoy Proxy + JWT Validator',
          description: 'Global edge termination, DDoS shielding, rate limiting (100 req/sec), and token validation.',
          connections: ['node-auth-service', 'node-core-service'],
          latency: '4ms',
          security: 'mTLS + WAF Rule Group'
        },
        {
          id: 'node-auth-service',
          name: 'Auth & RBAC Identity Service',
          category: 'service',
          tech: 'Node.js Microservice',
          description: 'Session rotation, cryptographic signing, multi-tenant RBAC policies, and OAuth2 federated login.',
          connections: ['node-cache', 'node-db'],
          latency: '8ms',
          security: 'Ed25519 Signed JWTs'
        },
        {
          id: 'node-core-service',
          name: 'Application Core Service',
          category: 'service',
          tech: 'TypeScript / Express 5 Engine',
          description: 'Domain controller orchestrating records, event triggers, and business logic pipelines.',
          connections: ['node-cache', 'node-queue', 'node-db'],
          latency: '12ms',
          security: 'RBAC Enforcement Layer'
        },
        {
          id: 'node-cache',
          name: 'Redis L2 Distributed Cache',
          category: 'cache',
          tech: 'Redis v7 Cluster (Multi-AZ)',
          description: 'In-memory fast lookup cache for active sessions, live presence, and read-through caching.',
          connections: [],
          latency: '<1.2ms',
          security: 'TLS Auth + VPC Peering'
        },
        {
          id: 'node-queue',
          name: 'BullMQ / Kafka Async Pipeline',
          category: 'queue',
          tech: 'Event Stream Broker',
          description: 'Guaranteed at-least-once message delivery for analytics, webhooks, and worker processing.',
          connections: ['node-worker'],
          latency: '2ms',
          security: 'Encrypted at Rest (AES-256)'
        },
        {
          id: 'node-worker',
          name: 'AI & Background Worker Node',
          category: 'ai',
          tech: 'Node.js Worker Fleet + Gemini SDK',
          description: 'Asynchronous indexing, vector embedding generation, and background batch computations.',
          connections: ['node-db'],
          latency: '28ms',
          security: 'Isolated IAM Role'
        },
        {
          id: 'node-db',
          name: 'Primary PostgreSQL Database',
          category: 'database',
          tech: 'PostgreSQL 16 + Drizzle ORM',
          description: 'ACID transactional store with automated read replicas and point-in-time recovery.',
          connections: [],
          latency: '3.5ms',
          security: 'Row-Level Security (RLS)'
        }
      ],
      mermaidDiagram: `graph TD
  Client["💻 ${type === 'mobile' ? 'Mobile App (Expo)' : 'Web Client (React 19)'}"] -->|"HTTPS / WSS"| Gateway["🛡️ Edge API Gateway & WAF"]
  Gateway -->|"Verify Auth"| AuthService["🔑 Auth & Identity Service"]
  Gateway -->|"Route Requests"| CoreService["⚙️ Core Application Service"]
  CoreService -->|"Sub-millisecond Read"| Redis["⚡ Redis Cluster Cache"]
  CoreService -->|"Dispatch Events"| EventQueue["📬 Event Stream (BullMQ)"]
  EventQueue -->|"Consume Jobs"| AIWorker["🤖 AI Worker Fleet"]
  CoreService -->|"Drizzle ORM Queries"| Postgres[("🗄️ PostgreSQL + RLS")]
  AIWorker -->|"Write Embeddings"| Postgres
  AuthService -->|"Session Storage"| Redis`
    },
    frontend: {
      framework: type === 'mobile' ? 'React Native / Expo' : 'React 19 + Vite + Tailwind CSS v4',
      fileCount: type === 'fullstack' ? 18 : 12,
      mainFile: type === 'mobile' ? 'App.tsx' : 'src/App.tsx',
      sampleCode: `import React, { useState } from 'react';
import { Sparkles, Terminal, Activity, ArrowRight } from 'lucide-react';

export default function ApplicationView() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 p-8">
      <header className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
            P
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">${title}</h1>
            <p className="text-xs text-slate-400">Synthesized with ${model}</p>
          </div>
        </div>
        <button className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-sm">
          Deploy to Production
        </button>
      </header>

      <main className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="text-xs text-purple-400 font-medium mb-1">Status</div>
          <div className="text-2xl font-bold text-white font-mono">100% Online</div>
          <p className="text-xs text-slate-400 mt-2">Zero runtime degradation detected across regions.</p>
        </div>
        
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="text-xs text-cyan-400 font-medium mb-1">Response Time</div>
          <div className="text-2xl font-bold text-white font-mono">18ms</div>
          <p className="text-xs text-slate-400 mt-2">Edge SSR accelerated with automatic cache headers.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="text-xs text-emerald-400 font-medium mb-1">Architecture</div>
          <div className="text-2xl font-bold text-white font-mono">${type.toUpperCase()}</div>
          <p className="text-xs text-slate-400 mt-2">Type-safe end-to-end integration verified.</p>
        </div>
      </main>
    </div>
  );
}`
    },
    backend: {
      runtime: 'Node.js 22 + Express + TypeScript',
      endpoints: [
        { method: 'GET', path: '/api/v1/health', desc: 'System telemetry and database ping' },
        { method: 'POST', path: '/api/v1/records', desc: 'Secure payload creation with Zod validation' },
        { method: 'GET', path: '/api/v1/records/:id', desc: 'Fetch entity record with relation joins' },
        { method: 'POST', path: '/api/v1/auth/session', desc: 'Issue encrypted JWT session token' }
      ],
      sampleCode: `import express, { Request, Response } from 'express';
import { z } from 'zod';

const router = express.Router();

const RecordSchema = z.object({
  title: z.string().min(3),
  status: z.enum(['active', 'archived', 'pending']),
  metadata: z.record(z.any()).optional()
});

// GET health check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    modelEngine: '${model}'
  });
});

// POST create entity
router.post('/records', async (req: Request, res: Response) => {
  const parsed = RecordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }
  
  // Real database write handled via ORM connection pool
  return res.status(201).json({
    id: 'rec_' + Math.random().toString(36).substring(7),
    ...parsed.data,
    createdAt: new Date().toISOString()
  });
});

export default router;`
    },
    database: {
      dialect: 'PostgreSQL 16 with Drizzle ORM',
      tables: ['users', 'projects', 'telemetry_logs', 'api_tokens'],
      schemaCode: `import { pgTable, text, timestamp, uuid, jsonb, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  projectType: text('project_type').notNull(),
  prompt: text('prompt').notNull(),
  status: text('status').default('Ready').notNull(),
  stars: integer('stars').default(0).notNull(),
  config: jsonb('config').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`
    },
    readme: {
      overview: `# ${title}\n\nGenerated automatically with **Patles.ai** using **${model}**.\nThis repository delivers a fully configured ${type} architecture with zero external boilerplate dependencies.`,
      installCmd: 'npm install',
      runCmd: type === 'mobile' ? 'npm run start' : 'npm run dev',
      features: [
        'Production Tailwind CSS v4 styling with dark theme',
        'End-to-end typed schema validation with Zod',
        'Zero-trust API endpoints with CORS and rate-limiting',
        'Ready-to-deploy Docker and CI/CD workflow included'
      ]
    }
  };
}
