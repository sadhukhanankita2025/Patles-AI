import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { TemplateCard } from '../components/TemplateCard';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { TEMPLATES } from '../data/mockData';
import { TemplateItem, PageView } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Star, 
  GitFork, 
  Cpu, 
  Palette, 
  Feather, 
  Binary, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  Database, 
  Terminal, 
  Check, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  FileCode,
  Server,
  Zap,
  Boxes,
  Code2,
  Workflow
} from 'lucide-react';
import { PatlesLotusLogo } from '../components/PatlesLotusLogo';

interface LandingPageProps {
  onNavigate: (page: PageView) => void;
  onStartWithPrompt: (prompt: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onStartWithPrompt
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  // Interactive Synthesis Pipeline Step State
  const [activePipelineStep, setActivePipelineStep] = useState<number>(1);
  
  // Interactive FAQ Open State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick CTA prompt input
  const [ctaPrompt, setCtaPrompt] = useState('');

  const categories = ['All', 'Healthcare', 'E-Commerce', 'Education', 'Portfolio', 'Finance'];

  const filteredTemplates = activeCategoryFilter === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategoryFilter);

  const handleUseTemplate = (template: TemplateItem) => {
    onStartWithPrompt(template.defaultPrompt);
  };

  const handleCopyColor = (hexString: string, id: string) => {
    navigator.clipboard.writeText(hexString);
    setCopiedColor(id);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const faqs = [
    {
      q: 'How does Patles.ai prevent AI code hallucinations and broken packages?',
      a: 'Unlike generic chatbots that guess packages, Patles.ai passes every generated file through a deterministic AST (Abstract Syntax Tree) validator. Dependencies are verified against the npm registry, imports are resolved strictly from package.json, and TypeScript compilation is executed before presenting code.'
    },
    {
      q: 'Can I export the full project to my own GitHub account or Docker container?',
      a: 'Yes. Every project generated on Patles.ai is standard, framework-compliant code (React 19, Vite, Express, PostgreSQL, Drizzle ORM). You can export directly as a GitHub repository or download a ZIP with a production-ready Dockerfile and docker-compose.yml.'
    },
    {
      q: 'Which AI models power the code generation engine?',
      a: 'Patles.ai utilizes high-performance code reasoning architectures including IBM Granite 3.0 Code and frontier reasoning models. The pipeline decomposes natural language prompts into structural specs, database schemas, and modular components in parallel.'
    },
    {
      q: 'Who owns the intellectual property of the generated code?',
      a: 'You own 100% of the code, schemas, and design assets synthesized by Patles.ai. No vendor lock-in, no proprietary runtime libraries, and complete freedom for commercial deployment.'
    },
    {
      q: 'Can I connect my own PostgreSQL or Cloud SQL database?',
      a: 'Absolutely. Patles.ai generates standard Drizzle or Prisma ORM schemas with migration scripts. You can use our managed database sandboxes or plug in your connection string (Neon, Supabase, Cloud SQL, AWS RDS) seamlessly.'
    }
  ];

  return (
    <div className="relative bg-transparent text-slate-100 overflow-hidden">
      
      {/* 1. Hero Section (with Live Workbench & Cosmic Atmosphere) */}
      <Hero
        onGenerate={(prompt) => onStartWithPrompt(prompt)}
        onExploreTemplates={() => {
          const el = document.getElementById('templates');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* ========================================================
          2. ASYMMETRIC BENTO GRID: THE ENGINE OF PATLES.AI
          ======================================================== */}
      <section id="features" className="py-24 border-t border-slate-800/80 relative bg-[#060818]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Clean Typographic Kicker */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 mb-3 tracking-wider uppercase">
              <Cpu className="w-3.5 h-3.5" />
              <span>Deterministic Compiler Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Sora',sans-serif] text-balance">
              The Architecture Engine of Patles.ai
            </h2>
            <p className="mt-4 text-base text-slate-300 leading-relaxed text-balance">
              Engineered to replace fragile chat snippets with fully integrated, type-safe full-stack software repos.
            </p>
          </div>

          {/* Asymmetric Bento Layout with Smooth Hover Lift & Dynamic Lighting */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento 1: 2-Column Marquee - Multi-File Code Synthesis & Live Diff */}
            <div className="md:col-span-2 p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/40 flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-cosmic-pulse" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span>AST Multi-File Graph</span>
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Simultaneous Multi-File Synthesis
                </h3>
                <p className="mt-2 text-sm text-slate-300 max-w-xl leading-relaxed">
                  Generates frontend views, backend routes, state stores, and database schemas concurrently with cross-file import consistency.
                </p>
              </div>

              {/* Interactive Code Mockup */}
              <div className="mt-6 rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 animate-pulse">✔</span>
                    <span>src/routes/telehealth.ts · Generated & Linked</span>
                  </div>
                  <span className="text-emerald-400 font-medium">Types Synced</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-purple-400">export const</span> appointmentRouter = <span className="text-cyan-400">createRouter</span>({'{'}
                </div>
                <div className="pl-4 text-slate-400">
                  createSession: <span className="text-yellow-300">protectedProcedure</span>.<span className="text-blue-400">input</span>(zAppointmentSchema)...
                </div>
                <div className="pl-4 text-emerald-400">
                  // Auto-connected to PostgreSQL foreign key constraints
                </div>
                <div className="text-slate-400">{'}'});</div>
              </div>
            </div>

            {/* Bento 2: 1-Column - Relational PostgreSQL & Drizzle Schema */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/40 flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-cosmic-pulse" />

              <div>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Relational SQL & Migrations
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Synthesizes production Drizzle ORM schemas with foreign keys, indexes, and automated SQL migration files.
                </p>
              </div>

              <div className="mt-6 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>patients</span>
                  <span className="text-cyan-400">PK (uuid)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>appointments</span>
                  <span className="text-purple-400">FK → patients.id</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>vital_telemetry</span>
                  <span className="text-emerald-400">FK → patients.id</span>
                </div>
              </div>
            </div>

            {/* Bento 3: 1-Column - Zero-Hallucination AST Guard */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/40 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Zero-Hallucination Guard
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Every package imported is verified live against the npm registry. No dead imports, non-existent methods, or phantom modules.
                </p>
              </div>

              <div className="mt-6 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">lucide-react</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3 animate-pulse" /> verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">drizzle-orm</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3 animate-pulse" /> verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">express</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3 animate-pulse" /> verified
                  </span>
                </div>
              </div>
            </div>

            {/* Bento 4: 1-Column - Deterministic Compilers */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-950/40 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Deterministic Compilers
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Real in-memory TypeScript builds with Vite 5. Catches syntax, typing, and component contract errors instantly.
                </p>
              </div>

              <div className="mt-6 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono">
                <div className="text-2xl font-extrabold text-white font-mono tabular-nums flex items-baseline gap-2">
                  <span>99.4%</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-xs text-slate-400 mt-1">First-turn TypeScript compile pass rate</div>
              </div>
            </div>

            {/* Bento 5: 2-Column - 1-Click Export & Edge Deploy */}
            <div className="md:col-span-2 p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/40 flex flex-col justify-between group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Full GitHub Sync & Docker Export
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 max-w-lg leading-relaxed">
                    Own your code completely. Push directly to GitHub, download as clean standard source code, or deploy with container manifests.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => onNavigate('ai-builder')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Try AI Builder
                  </Button>
                </div>
              </div>

              {/* Terminal command strip */}
              <div className="mt-6 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-cyan-400 animate-pulse">$</span>
                  <span className="truncate">git clone https://github.com/your-org/patles-generated-app.git</span>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 ml-2">Standard Node.js / Vite</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. HOW IT WORKS: INTERACTIVE 3-STEP ARCHITECTURE PIPELINE
          ======================================================== */}
      <section className="py-24 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-purple-400 mb-3 tracking-wider uppercase">
              <Workflow className="w-3.5 h-3.5" />
              <span>Full-Stack Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Sora',sans-serif]">
              From Prompt to Production in 3 Steps
            </h2>
            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              Explore how Patles.ai decomposes high-level intent into deterministic, test-passing software codebases.
            </p>
          </div>

          {/* Interactive Step Switcher Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setActivePipelineStep(1)}
              className={`p-5 rounded-2xl text-left border transition-all ${
                activePipelineStep === 1
                  ? 'bg-slate-900 border-purple-500/80 shadow-lg shadow-purple-950/30 ring-1 ring-purple-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-mono text-purple-400 mb-1">01. Architectural Planning</div>
              <h4 className="text-base font-bold text-white">Intent & Schema Decomposition</h4>
              <p className="text-xs text-slate-400 mt-1">
                Extracts data models, endpoints, UI routes, and security invariants from natural language.
              </p>
            </button>

            <button
              onClick={() => setActivePipelineStep(2)}
              className={`p-5 rounded-2xl text-left border transition-all ${
                activePipelineStep === 2
                  ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-mono text-cyan-400 mb-1">02. Deterministic Code Synthesis</div>
              <h4 className="text-base font-bold text-white">AST Multi-File Code Generation</h4>
              <p className="text-xs text-slate-400 mt-1">
                Generates modular React 19 components, Tailwind design systems, and Express APIs in parallel.
              </p>
            </button>

            <button
              onClick={() => setActivePipelineStep(3)}
              className={`p-5 rounded-2xl text-left border transition-all ${
                activePipelineStep === 3
                  ? 'bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-mono text-emerald-400 mb-1">03. Verification & Deployment</div>
              <h4 className="text-base font-bold text-white">In-Memory Build & Containerization</h4>
              <p className="text-xs text-slate-400 mt-1">
                Verifies TypeScript compilation, runs invariant tests, and produces clean Docker export files.
              </p>
            </button>
          </div>

          {/* Active Step Details Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
            {activePipelineStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Step 1 Detail</span>
                  <h3 className="text-2xl font-bold text-white">Autonomous Entity & Route Mapping</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    When you enter a prompt like "HIPAA clinical EHR with appointment booking and lab results", Patles.ai decomposes it into:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">✓</span>
                      <span>Relational entities: Patients, Appointments, Vitals, Doctors, Lab Reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">✓</span>
                      <span>Security policies: Role-based access control (Doctor vs Patient)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">✓</span>
                      <span>Client views: Dashboard, Booking Modal, Telehealth Room, Vitals Stream</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                  <div className="text-purple-400">// Blueprint Specification</div>
                  <div className="text-slate-400">{'{\n  "target": "full-stack-web",\n  "framework": "react-19-express",\n  "database": "postgresql",\n  "tables": ["patients", "appointments", "vitals"],\n  "auth": "jwt-rbac",\n  "compliance": ["hipaa-ready", "owasp-top-10"]\n}'}</div>
                </div>
              </div>
            )}

            {activePipelineStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Step 2 Detail</span>
                  <h3 className="text-2xl font-bold text-white">Full-Stack Parallel Generation</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Patles.ai concurrently synthesizes every file in your project, ensuring types defined in your database schema automatically bind to your React frontend forms.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="text-cyan-400">✓</span>
                      <span>Consistent Tailwind theme tokens, typography, and dark mode palette</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyan-400">✓</span>
                      <span>Full CRUD Express routes with input validation via Zod schemas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyan-400">✓</span>
                      <span>Zero hallucinated dependencies — 100% npm verified packages</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                  <div className="text-cyan-400">// Type-Safe Contract Validation</div>
                  <div className="text-emerald-400">✔ Generated: src/types/patient.ts (48 lines)</div>
                  <div className="text-emerald-400">✔ Generated: src/components/VitalsMonitor.tsx (112 lines)</div>
                  <div className="text-emerald-400">✔ Generated: server/routes/telehealth.ts (84 lines)</div>
                  <div className="text-emerald-400">✔ Generated: drizzle/schema.ts (92 lines)</div>
                </div>
              </div>
            )}

            {activePipelineStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Step 3 Detail</span>
                  <h3 className="text-2xl font-bold text-white">Instant Sandbox & Docker Containerization</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Before giving you the preview link, our compiler sandbox executes TypeScript checks and builds your static assets. Any compile errors are auto-remediated in milliseconds.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Automated TypeScript compilation with strict type checking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Standard multi-stage Dockerfile for production containerization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>One-click deploy to Vercel, Cloud Run, Render, or Docker Swarm</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                  <div className="text-emerald-400">// Dockerfile Scaffolding Complete</div>
                  <div className="text-slate-400">FROM node:20-alpine AS build</div>
                  <div className="text-slate-400">WORKDIR /app && COPY package*.json ./</div>
                  <div className="text-slate-400">RUN npm ci && COPY . . && npm run build</div>
                  <div className="text-cyan-400 mt-2">Container ready: docker build -t patles-app .</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ========================================================
          4. ARCHITECTURAL TEMPLATES SHOWCASE
          ======================================================== */}
      <section id="templates" className="py-24 border-t border-slate-800/80 bg-[#070B19]/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-3 tracking-wider uppercase">
                <Layers className="w-3.5 h-3.5" />
                <span>Production Starters</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Sora',sans-serif]">
                Architectural Blueprints
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
                Domain-verified full-stack blueprints with pre-configured relational schemas, responsive layouts, and verified npm dependencies.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    activeCategoryFilter === cat
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUseTemplate={handleUseTemplate}
                onPreview={(tmpl) => setSelectedTemplate(tmpl)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          5. OFFICIAL BRAND IDENTITY & 3-PETAL LOTUS JEWEL
          ======================================================== */}
      <section id="brand" className="py-24 border-t border-slate-800/80 relative overflow-hidden bg-transparent">
        {/* Subtle Cosmic Nebula Glow behind Brand Stage */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-purple-600/15 via-indigo-600/10 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-purple-300 mb-3 tracking-wider uppercase">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Brand Identity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Sora',sans-serif]">
              The 3-Petal Cosmic Lotus of Patles.ai
            </h2>
            <p className="mt-4 text-base text-slate-300 leading-relaxed text-balance">
              Engineered as an ultra-premium vector mark. Exactly 3 glowing crystal petals with dual orbital light rings and an inner AI diamond nucleus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 5 Cols: Visual Lotus with Neon Cosmic Bloom & Floating Levitation */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl bg-[#0B1120]/90 border border-purple-500/30 shadow-2xl shadow-purple-950/40 relative overflow-hidden group animate-float-gentle">
              <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/25 rounded-full blur-[80px] pointer-events-none animate-cosmic-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px] pointer-events-none animate-float-reverse" />
              
              {/* Twinkling Starlight Points */}
              <div className="absolute top-8 left-10 w-2 h-2 rounded-full bg-pink-400 animate-starlight-1 pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-2 h-2 rounded-full bg-cyan-400 animate-starlight-2 pointer-events-none" />
              <div className="absolute top-1/3 right-8 w-1.5 h-1.5 rounded-full bg-purple-300 animate-starlight-3 pointer-events-none" />

              <div className="relative z-10 py-6 transform group-hover:scale-105 transition-transform duration-500">
                <PatlesLotusLogo variant="vertical" size="2xl" glow={true} animated={true} showTagline={true} />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Vector SVG · 3-Petal Cosmic Lotus Architecture</span>
              </div>
            </div>

            {/* Right 7 Cols: The 3 Petal Pillars with Instant Palette Copying */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Petal 1: Left */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-pink-500/30 flex items-start justify-between gap-4 hover:border-pink-500/60 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0 mt-0.5">
                    <Feather className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-pink-400 uppercase tracking-wider font-semibold">
                        Left Petal · Angled -34°
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-0.5">Creativity & Visual UI/UX</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Hot Pink → Rose Pink → Soft Magenta. Translucent crystal glass with glossy specular highlights and edge rim lighting.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyColor('#FF5DAF → #EC4899 → #FF7CC8', 'pink')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-pink-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors border border-pink-500/30 shrink-0"
                  title="Copy Left Petal Gradient"
                >
                  {copiedColor === 'pink' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Palette</span>
                </button>
              </div>

              {/* Petal 2: Center */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex items-start justify-between gap-4 hover:border-purple-500/60 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                        Center Petal · Tallest Apex
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-0.5">Frontier AI Reasoning & Inner Core</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Deep Violet → Royal Purple → Lavender Glow. Houses the inner AI diamond crystal nucleus with concentrated photon light.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyColor('#6D28D9 → #8B5CF6 → #C4B5FD', 'purple')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-purple-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors border border-purple-500/30 shrink-0"
                  title="Copy Center Petal Gradient"
                >
                  {copiedColor === 'purple' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Palette</span>
                </button>
              </div>

              {/* Petal 3: Right */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-start justify-between gap-4 hover:border-cyan-500/60 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Binary className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                        Right Petal · Angled +34°
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-0.5">Technology, Compilers & Systems</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Cyan → Aqua → Electric Blue. Translucent glowing crystalline glass with cyan rim lighting and specular ridges.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyColor('#06E7F2 → #22D3EE → #2563EB', 'cyan')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors border border-cyan-500/30 shrink-0"
                  title="Copy Right Petal Gradient"
                >
                  {copiedColor === 'cyan' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Palette</span>
                </button>
              </div>

              {/* Brand Actions Row */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="/favicon.svg"
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Favicon (SVG)</span>
                </a>
                <a
                  href="/patles-logo-horizontal.svg"
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>Download 4K Horizontal SVG</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          6. COMPARISON MATRIX: PATLES.AI VS GENERIC AI CHATBOTS
          ======================================================== */}
      <section className="py-24 border-t border-slate-800/80 relative bg-[#070B19]/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Sora',sans-serif]">
              Why Engineers Choose Patles.ai
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              The difference between copying disconnected snippets from a chat window and generating a complete working repo.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-12 bg-slate-950 p-4 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="col-span-6 sm:col-span-5 font-semibold text-slate-200">Capabilities</div>
              <div className="col-span-3 sm:col-span-4 text-center font-bold text-cyan-400">Patles.ai</div>
              <div className="col-span-3 sm:col-span-3 text-center text-slate-400">Generic AI Chatbots</div>
            </div>

            <div className="divide-y divide-slate-800/70 text-xs sm:text-sm">
              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 sm:col-span-5 font-medium text-white">Full-Stack Multi-File Repo</div>
                <div className="col-span-3 sm:col-span-4 text-center font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <Check className="w-4 h-4 text-emerald-400" /> 18+ synced files
                </div>
                <div className="col-span-3 sm:col-span-3 text-center text-slate-400">Single markdown block</div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center bg-slate-900/40">
                <div className="col-span-6 sm:col-span-5 font-medium text-white">Relational PostgreSQL Schemas</div>
                <div className="col-span-3 sm:col-span-4 text-center font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <Check className="w-4 h-4 text-emerald-400" /> Drizzle ORM + Migrations
                </div>
                <div className="col-span-3 sm:col-span-3 text-center text-slate-400">Raw pseudo-SQL</div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 sm:col-span-5 font-medium text-white">AST Package Verification</div>
                <div className="col-span-3 sm:col-span-4 text-center font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <Check className="w-4 h-4 text-emerald-400" /> 0 hallucinated packages
                </div>
                <div className="col-span-3 sm:col-span-3 text-center text-slate-400">Guesses package names</div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center bg-slate-900/40">
                <div className="col-span-6 sm:col-span-5 font-medium text-white">Live In-Browser Interactive Preview</div>
                <div className="col-span-3 sm:col-span-4 text-center font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <Check className="w-4 h-4 text-emerald-400" /> Real React sandbox
                </div>
                <div className="col-span-3 sm:col-span-3 text-center text-slate-400">None (copy-paste manually)</div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 sm:col-span-5 font-medium text-white">Docker & GitHub Sync</div>
                <div className="col-span-3 sm:col-span-4 text-center font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <Check className="w-4 h-4 text-emerald-400" /> 1-Click push & containers
                </div>
                <div className="col-span-3 sm:col-span-3 text-center text-slate-400">Manual setup required</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          7. QUANTITATIVE PROOF & ATTRIBUTABLE TESTIMONIALS
          ======================================================== */}
      <section className="py-24 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Quantitative Precision Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">14,200+</div>
              <div className="mt-1 text-xs text-slate-400">Full-Stack Repos Generated</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">99.4%</div>
              <div className="mt-1 text-xs text-slate-400">First-Turn TypeScript Pass</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">1.4s</div>
              <div className="mt-1 text-xs text-slate-400">Average Scaffold Duration</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">0</div>
              <div className="mt-1 text-xs text-slate-400">Hallucinated Packages Allowed</div>
            </div>
          </div>

          {/* Attributable Developer Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <p className="text-sm text-slate-200 leading-relaxed italic">
                "We scaffolded our entire clinical telemetry portal on Patles.ai in an afternoon. Having the Drizzle schema and Express router generated with zero type errors saved our engineering team three weeks."
              </p>
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 text-xs">
                  SC
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Dr. Sarah Chen</h4>
                  <p className="text-[11px] text-slate-400">VP Engineering, Pulse Health Systems</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <p className="text-sm text-slate-200 leading-relaxed italic">
                "The biggest differentiator is the AST import validator. Other tools spit out non-existent npm modules that break on install. Patles.ai gave us a repository that passed `npm install && npm run build` on the very first try."
              </p>
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 text-xs">
                  MK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Marcus Keller</h4>
                  <p className="text-[11px] text-slate-400">Staff Architect, Meridian Cloud</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <p className="text-sm text-slate-200 leading-relaxed italic">
                "The 3-petal lotus branding and cosmic aesthetic match the quality of the underlying code. It genuinely feels like the developer tool from 2030."
              </p>
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center font-bold text-pink-300 text-xs">
                  AL
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Aria Lindqvist</h4>
                  <p className="text-[11px] text-slate-400">Founder, Aura Headless Commerce</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          8. DEVELOPER FAQ ACCORDION
          ======================================================== */}
      <section className="py-24 border-t border-slate-800/80 relative bg-[#070B19]/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Sora',sans-serif]">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Clear, transparent answers about code generation, licensing, and security.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="font-semibold text-sm sm:text-base text-white">
                      {faq.q}
                    </span>
                    <span className="p-1 rounded-lg bg-slate-800 text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================
          9. GRAND COSMIC FOOTER CTA
          ======================================================== */}
      <section className="py-28 border-t border-slate-800/80 relative overflow-hidden bg-[#050816]">
        <div className="absolute inset-0 bg-radial-glow opacity-80 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          
          <div className="mb-8 flex justify-center transform hover:scale-105 transition-transform duration-300">
            <PatlesLotusLogo variant="vertical" size="xl" glow={true} animated={true} showTagline={true} />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight font-['Sora',sans-serif] text-balance">
            Ready to Scaffold Your Next Masterpiece?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed text-balance">
            Turn your vision into verified, type-safe full-stack code in seconds. No credit card required.
          </p>

          {/* Quick prompt launcher */}
          <div className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={ctaPrompt}
              onChange={(e) => setCtaPrompt(e.target.value)}
              placeholder="What do you want to build? (e.g. AI-powered financial dashboard)"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-purple-500/40 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Button
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto text-sm px-6 py-3.5 shrink-0 whitespace-nowrap"
              onClick={() => onStartWithPrompt(ctaPrompt.trim() || 'Modern AI Web Application')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Building
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span>Free Tier Available</span>
            <span aria-hidden="true">·</span>
            <span>Instant GitHub Export</span>
            <span aria-hidden="true">·</span>
            <span>PostgreSQL & Docker Ready</span>
          </div>

        </div>
      </section>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <Modal
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          title={selectedTemplate.title}
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className={`h-48 rounded-2xl bg-gradient-to-br ${selectedTemplate.previewColor} p-6 flex flex-col justify-between border border-slate-700/60 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-grid-pattern opacity-30" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-slate-900/80 text-xs font-mono text-cyan-400 border border-slate-700/60">
                  {selectedTemplate.category}
                </span>
                <span className="text-xs font-mono text-slate-300">
                  ★ {selectedTemplate.stars} stars
                </span>
              </div>
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white">{selectedTemplate.title}</h4>
                <p className="text-xs text-slate-200 mt-1">{selectedTemplate.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Synthesized Architectural Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedTemplate.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Full-Stack Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                size="md"
                onClick={() => {
                  handleUseTemplate(selectedTemplate);
                  setSelectedTemplate(null);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Synthesize This Project
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
