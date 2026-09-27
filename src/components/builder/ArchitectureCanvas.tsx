import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Database, 
  Globe, 
  Shield, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  User,
  Key,
  Lock,
  Calendar,
  Cloud,
  CheckCircle2,
  FileText,
  Sliders
} from 'lucide-react';

interface ArchitectureNode {
  id: string;
  name: string;
  category: string;
  tech: string;
  description: string;
  connections: string[];
}

interface ArchitectureCanvasProps {
  project: any;
  architectureData?: any;
}

export const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = ({
  project,
  architectureData
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>('node_client');
  const [activeSubTab, setActiveSubTab] = useState<'graph' | 'auth_flow' | 'summary'>('graph');

  const nodes: ArchitectureNode[] = architectureData?.nodes?.length
    ? architectureData.nodes
    : [
        {
          id: 'node_user',
          name: 'End User / Browser',
          category: 'client',
          tech: 'HTTPS / Web Standards',
          description: 'Patients and practitioners accessing the application via Desktop or Mobile devices.',
          connections: ['node_client']
        },
        {
          id: 'node_client',
          name: 'React Frontend SPA',
          category: 'client',
          tech: 'React 19 + Tailwind CSS + Vite',
          description: 'Client application with stateful hooks, responsive forms, and authenticated routes.',
          connections: ['node_api']
        },
        {
          id: 'node_auth',
          name: 'JWT Auth Guard',
          category: 'gateway',
          tech: 'jsonwebtoken + bcrypt',
          description: 'Intercepts requests, validates Bearer tokens, and attaches authenticated user context.',
          connections: ['node_api']
        },
        {
          id: 'node_api',
          name: 'Express 5 REST API',
          category: 'service',
          tech: 'Node.js + Express + Zod',
          description: 'REST controller dispatching validation, authorization, and business logic execution.',
          connections: ['node_db']
        },
        {
          id: 'node_db',
          name: 'PostgreSQL Relational DB',
          category: 'database',
          tech: 'PostgreSQL 16 + Drizzle ORM',
          description: 'Stores users, doctors, appointments, payments, and audit logs with ACID guarantees.',
          connections: []
        }
      ];

  const authFlowSteps = [
    { step: 1, title: 'End User', desc: 'Enters email and password on /login', icon: User, color: 'text-cyan-400' },
    { step: 2, title: 'Login Page', desc: 'React component validates form and dispatches credentials', icon: Globe, color: 'text-purple-400' },
    { step: 3, title: 'JWT Authentication', desc: 'Backend verifies bcrypt hash & signs signed JWT token', icon: Key, color: 'text-amber-400' },
    { step: 4, title: 'Auth Middleware', desc: 'Guard verifies token claims & attaches user ID to req.user', icon: Lock, color: 'text-rose-400' },
    { step: 5, title: 'Protected Dashboard', desc: 'Patient portal renders appointments & health records', icon: Layers, color: 'text-emerald-400' },
    { step: 6, title: 'Appointment Booking', desc: 'Authorized POST /api/appointments records booking in DB', icon: Calendar, color: 'text-blue-400' }
  ];

  const summaryCards = [
    {
      title: 'Project Overview',
      tag: 'Core Concept',
      color: 'border-purple-500/30 text-purple-300',
      bullets: [
        'Domain-specific full-stack architecture generated from natural language prompt',
        'Separation of concerns between interactive UI, REST API, and relational storage',
        'Configured with security, environment variable templates, and runnable scripts'
      ]
    },
    {
      title: 'Frontend Flow',
      tag: 'Client Layer',
      color: 'border-cyan-500/30 text-cyan-300',
      bullets: [
        'Component hierarchy driven by modular React components in src/components/',
        'Custom hooks encapsulate data fetching and error states',
        'Instant client-side feedback and responsive breakpoint styling via Tailwind CSS'
      ]
    },
    {
      title: 'Backend Flow',
      tag: 'Server Layer',
      color: 'border-emerald-500/30 text-emerald-300',
      bullets: [
        'Express 5 route handlers organized in server/routes/ with clean controller bindings',
        'Centralized request schema validation preventing injection and malformed payloads',
        'CORS and JSON body parser middlewares with error boundary handlers'
      ]
    },
    {
      title: 'Database Flow',
      tag: 'Persistence Layer',
      color: 'border-amber-500/30 text-amber-300',
      bullets: [
        'Relational schema in database/schema.sql with primary keys & foreign key constraints',
        'Indexes placed on critical query columns (patient_id, doctor_id, appointment_date)',
        'ACID transactions ensuring consistent state during multi-table writes'
      ]
    },
    {
      title: 'Authentication Flow',
      tag: 'Security Protocol',
      color: 'border-rose-500/30 text-rose-300',
      bullets: [
        'Passwords salted and hashed using bcrypt (10 rounds)',
        'Stateless JWT tokens issued with expiration and signed using server secret',
        'Bearer token validation in Authorization header guarding private endpoints'
      ]
    },
    {
      title: 'Deployment Flow',
      tag: 'Infrastructure',
      color: 'border-blue-500/30 text-blue-300',
      bullets: [
        'Optimized Vite build output bundled into static files',
        'Containerized Dockerfile readiness exposing production PORT',
        'Single-click deployment support for Vercel, Railway, and Render'
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Sub-tabs header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/90 border border-white/10">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveSubTab('graph')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              activeSubTab === 'graph'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Interactive Graph
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('auth_flow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              activeSubTab === 'auth_flow'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Authentication Flow
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('summary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              activeSubTab === 'summary'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Architecture Summary
          </button>
        </div>

        {activeSubTab === 'graph' && (
          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: INTERACTIVE GRAPH */}
      {activeSubTab === 'graph' && (
        <div className="flex-1 bg-slate-950/70 rounded-3xl border border-white/10 p-6 flex flex-col justify-between overflow-hidden relative">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Interactive node visualizer */}
          <div 
            className="flex-1 flex flex-col justify-center items-center py-6 transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 w-full max-w-4xl relative z-10">
              {nodes.map((node, index) => {
                const isSelected = selectedNode === node.id;
                const isLast = index === nodes.length - 1;

                return (
                  <React.Fragment key={node.id}>
                    <motion.div
                      whileHover={{ scale: 1.04, y: -2 }}
                      onClick={() => setSelectedNode(node.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer w-48 text-left ${
                        isSelected
                          ? 'bg-[#0F172A] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                          : 'bg-[#0B1120]/90 border-white/10 hover:border-purple-500/40 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-white/10 text-cyan-300">
                          {node.category}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      
                      <div className="text-xs font-bold text-white mb-1 truncate">
                        {node.name}
                      </div>

                      <div className="text-[11px] font-mono text-purple-300 mb-2 truncate">
                        {node.tech}
                      </div>

                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                        {node.description}
                      </p>
                    </motion.div>

                    {/* Flow arrow between nodes */}
                    {!isLast && (
                      <div className="hidden lg:flex items-center text-slate-600">
                        <ArrowRight className="w-5 h-5 text-purple-400 animate-pulse" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Node detail inspector footer */}
          {selectedNode && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-mono text-purple-400 font-bold mr-2">Selected Component:</span>
                <span className="text-white font-semibold">{nodes.find(n => n.id === selectedNode)?.name}</span>
                <span className="text-slate-400 ml-2 font-mono">({nodes.find(n => n.id === selectedNode)?.tech})</span>
                <p className="text-slate-300 text-[11px] font-sans mt-0.5">
                  {nodes.find(n => n.id === selectedNode)?.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  Latency: ~12ms
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  Auto Layout Active
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: AUTHENTICATION FLOW VISUALIZATION */}
      {activeSubTab === 'auth_flow' && (
        <div className="flex-1 bg-slate-950/70 rounded-3xl border border-white/10 p-6 overflow-y-auto space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              End-to-End JWT Authentication Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              User credentials exchange, cryptographic token validation, and protected appointment scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {authFlowSteps.map((flow) => {
              const Icon = flow.icon;
              return (
                <div
                  key={flow.step}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/30 transition-all space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center justify-center">
                      {flow.step}
                    </span>
                    <Icon className={`w-4 h-4 ${flow.color}`} />
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {flow.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {flow.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-[#0B1120] border border-cyan-500/20 text-xs font-mono text-slate-300 space-y-2">
            <div className="text-cyan-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Middleware Verification Blueprint (Express)
            </div>
            <pre className="text-[11px] text-slate-400 overflow-x-auto p-3 rounded-xl bg-slate-950 border border-white/5">
{`const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
};`}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 3: ARCHITECTURE SUMMARY CARDS */}
      {activeSubTab === 'summary' && (
        <div className="flex-1 bg-slate-950/70 rounded-3xl border border-white/10 p-6 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Architecture Specification Summaries
              </h3>
              <p className="text-xs text-slate-400">
                Detailed breakdowns of application data flow, layers, and deployment contracts.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">All flows editable</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summaryCards.map((card, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{card.title}</h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border bg-slate-950 ${card.color}`}>
                    {card.tag}
                  </span>
                </div>

                <ul className="space-y-2">
                  {card.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="text-[11px] text-slate-300 font-sans leading-relaxed flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
