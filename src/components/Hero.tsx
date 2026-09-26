import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Terminal as TerminalIcon, 
  Layers, 
  Zap, 
  Code2, 
  Bot, 
  Palette, 
  Check, 
  Copy, 
  ExternalLink,
  Play,
  FileCode,
  Database,
  Server,
  Activity,
  Calendar,
  UserCheck,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { Button } from './Button';
import { PROMPT_SUGGESTIONS } from '../data/mockData';
import { PatlesLotusLogo } from './PatlesLotusLogo';

interface HeroProps {
  onGenerate: (prompt: string) => void;
  onExploreTemplates: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGenerate, onExploreTemplates }) => {
  const [promptInput, setPromptInput] = useState('');
  const [activeTab, setActiveTab] = useState<'app' | 'server' | 'schema' | 'terminal' | 'preview'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Interactive Live Preview State
  const [previewBookingConfirmed, setPreviewBookingConfirmed] = useState(false);
  const [patientVitals, setPatientVitals] = useState({ bpm: 72, bp: '120/80', spO2: 99 });
  const [isSimulatingLiveTelemetry, setIsSimulatingLiveTelemetry] = useState(true);

  // Live heart rate pulsation simulation
  useEffect(() => {
    if (!isSimulatingLiveTelemetry) return;
    const interval = setInterval(() => {
      setPatientVitals(prev => ({
        bpm: 70 + Math.floor(Math.random() * 6),
        bp: '120/80',
        spO2: 98 + Math.floor(Math.random() * 2)
      }));
    }, 2800);
    return () => clearInterval(interval);
  }, [isSimulatingLiveTelemetry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      onGenerate(promptInput.trim());
    } else {
      onGenerate(PROMPT_SUGGESTIONS[0].prompt);
    }
  };

  const handleChipClick = (suggestionPrompt: string, category: string) => {
    setPromptInput(suggestionPrompt);
    setActiveCategory(category);
  };

  const codeSnippets = {
    app: `// src/App.tsx - React 19 + TypeScript + Tailwind
import React, { useState } from 'react';
import { TelehealthDashboard } from './components/TelehealthDashboard';
import { PatientVitalsStream } from './components/PatientVitalsStream';

export function App() {
  const [patientId] = useState('PT-8842');
  const [telehealthSession, setTelehealthSession] = useState({ active: true });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="font-semibold text-sm tracking-tight">Clinical EHR Portal</h1>
        </div>
        <span className="text-xs font-mono text-cyan-400">HIPAA Compliant · Session #890</span>
      </header>
      
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <TelehealthDashboard patientId={patientId} onConnect={() => setTelehealthSession({ active: true })} />
        </div>
        <div className="lg:col-span-4">
          <PatientVitalsStream patientId={patientId} liveStream={telehealthSession.active} />
        </div>
      </main>
    </div>
  );
}`,
    server: `// server.ts - Express + Node.js + Type-Safe Router
import express, { Request, Response } from 'express';
import { db } from './db/client';
import { appointments, patients } from './db/schema';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());

// Type-Safe API Endpoint: Create Telehealth Session
app.post('/api/telehealth/session', async (req: Request, res: Response) => {
  const { patientId, doctorId, scheduledAt } = req.body;
  
  const [session] = await db.insert(appointments).values({
    patientId,
    doctorId,
    status: 'CONFIRMED',
    webrtcRoomId: \`room_\${Date.now()}\`,
    scheduledAt: new Date(scheduledAt),
  }).returning();

  return res.status(201).json({ success: true, session });
});

export default app;`,
    schema: `-- schema.sql / PostgreSQL + Drizzle ORM
CREATE TABLE patients (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  medical_record_number VARCHAR(128) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(64) REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id VARCHAR(64) NOT NULL,
  status VARCHAR(32) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED')),
  webrtc_room_id VARCHAR(128) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);`,
    terminal: `patles-cli synthesis --blueprint telehealth-ehr --model ibm-granite-3.0
✔ [1/4] Parsing natural language specification... (240ms)
✔ [2/4] Generating PostgreSQL Drizzle schema & migrations (180ms)
✔ [3/4] Scaffolding React 19 Frontend + Tailwind Design System (520ms)
✔ [4/4] Verified AST imports against npm registry: 0 missing dependencies (110ms)

Build Summary:
  → Total Files: 18 files created
  → Frontend: React 19 / TypeScript 5.4 / Vite 5
  → Backend: Express 4.19 / Drizzle ORM / PostgreSQL
  → Test Invariants: 14/14 PASS
  → Scaffold Duration: 1.05s

Ready to preview: http://localhost:3000/preview`
  };

  const handleCopySnippet = () => {
    const textToCopy = activeTab === 'preview' ? codeSnippets.app : codeSnippets[activeTab];
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="relative pt-8 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      
      {/* Background Cosmic Atmosphere & Slow-Moving Framer Motion Gradient Blobs */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20" />
      
      {/* Framer Motion Slow-Moving Nebula Blob 1 (Violet / Lavender) */}
      <motion.div
        className="absolute top-1/4 left-1/2 w-[720px] h-[720px] rounded-full blur-[140px] pointer-events-none mix-blend-screen opacity-55"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(109, 40, 217, 0.25) 50%, transparent 80%)',
        }}
        animate={{
          x: ['-50%', '-42%', '-58%', '-48%', '-50%'],
          y: ['-50%', '-56%', '-44%', '-52%', '-50%'],
          scale: [1, 1.15, 0.9, 1.1, 1],
          rotate: [0, 45, 120, 240, 360],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Framer Motion Slow-Moving Nebula Blob 2 (Electric Cyan) */}
      <motion.div
        className="absolute -top-10 left-10 w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none mix-blend-screen opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(6, 231, 242, 0.35) 0%, rgba(34, 211, 238, 0.18) 55%, transparent 80%)',
        }}
        animate={{
          x: [0, 60, -40, 30, 0],
          y: [0, -50, 40, -30, 0],
          scale: [1, 1.2, 0.88, 1.12, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Framer Motion Slow-Moving Nebula Blob 3 (Hot Pink / Magenta) */}
      <motion.div
        className="absolute bottom-0 right-10 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none mix-blend-screen opacity-45"
        style={{
          background: 'radial-gradient(circle, rgba(255, 93, 175, 0.35) 0%, rgba(236, 72, 153, 0.18) 50%, transparent 80%)',
        }}
        animate={{
          x: [0, -50, 40, -30, 0],
          y: [0, 40, -50, 30, 0],
          scale: [1, 0.9, 1.18, 0.95, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Floating Animated Starlight & Floating Dots in Background */}
      <motion.div
        className="absolute top-16 left-1/4 w-2 h-2 rounded-full bg-purple-300 pointer-events-none"
        style={{ boxShadow: '0 0 10px #c084fc' }}
        animate={{ y: [0, -18, 0], opacity: [0.3, 0.9, 0.3], scale: [1, 1.3, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-44 right-1/4 w-2.5 h-2.5 rounded-full bg-cyan-300 pointer-events-none"
        style={{ boxShadow: '0 0 12px #06e7f2' }}
        animate={{ y: [0, -22, 0], opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-80 left-1/6 w-1.5 h-1.5 rounded-full bg-pink-300 pointer-events-none"
        style={{ boxShadow: '0 0 8px #ff7cc8' }}
        animate={{ y: [0, -15, 0], opacity: [0.2, 0.85, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute bottom-32 right-1/6 w-2 h-2 rounded-full bg-white pointer-events-none"
        style={{ boxShadow: '0 0 10px #ffffff' }}
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.95, 0.3], scale: [1, 1.25, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute top-1/3 left-12 w-2 h-2 rounded-full bg-fuchsia-400 pointer-events-none"
        style={{ boxShadow: '0 0 10px #e879f9' }}
        animate={{ y: [0, -16, 0], x: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-1.5 h-1.5 rounded-full bg-cyan-200 pointer-events-none"
        style={{ boxShadow: '0 0 8px #38bdf8' }}
        animate={{ y: [0, -14, 0], opacity: [0.2, 0.75, 0.2] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-24 right-16 w-2 h-2 rounded-full bg-pink-400 pointer-events-none"
        style={{ boxShadow: '0 0 10px #ec4899' }}
        animate={{ y: [0, -18, 0], opacity: [0.35, 0.9, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Brand Kicker: Clean Typographic Luxury Badge with Floating Animation */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-2xl shadow-purple-950/40 mb-8 backdrop-blur-xl hover:border-purple-500/50 transition-all animate-float-gentle">
          <PatlesLotusLogo variant="icon" size="sm" glow={true} animated={true} />
          <span className="font-bold text-white text-xs sm:text-sm tracking-tight font-['Sora',sans-serif]">
            Patles<span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">.ai</span>
          </span>
          <span className="text-slate-500" aria-hidden="true">·</span>
          <span className="text-xs sm:text-sm text-slate-300 font-medium">Frontier Full-Stack Synthesis</span>
        </div>

        {/* Primary Headline with Balanced Wrap */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08] text-balance font-['Sora',sans-serif]">
          Build Websites & Apps with AI{' '}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            in Seconds.
          </span>
        </h1>

        {/* Concrete Value Proposition (Zero Cliché SaaS Buzzwords) */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed text-balance">
          Turn natural language prompts into working, production-ready full-stack software. Synthesizes responsive React frontends, robust Node.js APIs, and relational PostgreSQL schemas with verified AST compilation.
        </p>

        {/* Main AI Prompt Cockpit */}
        <div className="mt-10 max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="p-2 sm:p-2.5 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-2xl shadow-purple-950/50 backdrop-blur-2xl transition-all focus-within:border-cyan-400/60 focus-within:ring-4 focus-within:ring-purple-500/20"
          >
            <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <div className="flex-1 flex items-start sm:items-center px-4 py-2.5 text-left">
                <Bot className="w-5 h-5 text-purple-400 shrink-0 mt-1 sm:mt-0 mr-3 hidden sm:block" />
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Describe your application... (e.g. Telehealth patient booking portal with WebRTC, Node.js backend, and PostgreSQL)"
                  rows={2}
                  className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm sm:text-base focus:outline-none resize-none font-normal leading-snug"
                />
              </div>

              <div className="flex items-center justify-end px-2 pb-2 md:pb-0 gap-2 shrink-0">
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full sm:w-auto text-sm px-6 py-3.5 shadow-lg shadow-purple-600/30 font-semibold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Generate Project
                </Button>
              </div>
            </div>

            {/* Quick Starters Categorized Row */}
            <div className="pt-3 px-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-left">
              <span className="text-xs text-slate-400 font-medium shrink-0">Starter Prompts:</span>
              {PROMPT_SUGGESTIONS.slice(0, 4).map((sug) => (
                <button
                  type="button"
                  key={sug.label}
                  onClick={() => handleChipClick(sug.prompt, sug.label)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-950/50 border border-slate-700/60 hover:border-purple-500/50 text-slate-300 hover:text-purple-200 transition-all text-left truncate max-w-[200px]"
                >
                  {sug.label}
                </button>
              ))}
            </div>
          </form>

          {/* Verification Metrics Bar */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>&lt; 15s Full-Stack Scaffold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>0 Hallucinated Packages</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>PostgreSQL & TypeScript Ready</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            INTERACTIVE IDE & LIVE SYNTHESIS WORKBENCH
            ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 max-w-5xl mx-auto rounded-3xl bg-[#0F172A]/90 border border-slate-700/80 shadow-2xl shadow-purple-950/30 overflow-hidden backdrop-blur-2xl text-left"
        >
          
          {/* Top Window Bar & Nav Tabs */}
          <div className="px-4 py-3 bg-[#0B1120] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                patles-studio · project synthesis
              </span>
            </div>

            {/* Interactive Workbench Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'preview'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3 h-3 text-cyan-300" />
                <span>Live App Preview</span>
              </button>

              <button
                onClick={() => setActiveTab('app')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'app'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3 h-3 text-cyan-400" />
                <span>App.tsx</span>
              </button>

              <button
                onClick={() => setActiveTab('server')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'server'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Server className="w-3 h-3 text-purple-400" />
                <span>server.ts</span>
              </button>

              <button
                onClick={() => setActiveTab('schema')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'schema'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3 h-3 text-emerald-400" />
                <span>schema.sql</span>
              </button>

              <button
                onClick={() => setActiveTab('terminal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'terminal'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TerminalIcon className="w-3 h-3 text-amber-400" />
                <span>Terminal</span>
              </button>
            </div>

            {/* Actions: Copy Code */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySnippet}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-700/60"
                title="Copy current code snippet"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Workbench Body */}
          <div className="p-5 sm:p-6 bg-gradient-to-b from-[#0F172A] to-[#0A0E1A]">
            
            {/* 1. LIVE APP PREVIEW MODE (Fully interactive clinical EHR simulator) */}
            {activeTab === 'preview' && (
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 space-y-6">
                
                {/* Header inside simulator */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white">TeleHealth Clinical Portal</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          LIVE SIMULATION
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Patient: Eleanor Vance · MRN #8842-CA · Room #WebRTC-402</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={previewBookingConfirmed ? 'secondary' : 'gradient'}
                      onClick={() => setPreviewBookingConfirmed(!previewBookingConfirmed)}
                      leftIcon={<Calendar className="w-3.5 h-3.5" />}
                    >
                      {previewBookingConfirmed ? 'Appointment Confirmed (Click to Reset)' : 'Book Telehealth Visit'}
                    </Button>
                  </div>
                </div>

                {/* 3-Column Interactive Telemetry Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Metric 1: Heart Rate */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 relative overflow-hidden group hover:border-red-500/40 transition-colors">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Resting Heart Rate</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {patientVitals.bpm}
                      </span>
                      <span className="text-xs text-slate-400">BPM</span>
                    </div>
                    
                    {/* Live ECG Waveform Animation */}
                    <div className="my-2 h-6 w-full flex items-center overflow-hidden">
                      <svg className="w-full h-6 text-emerald-400/80" viewBox="0 0 160 24" fill="none">
                        <path
                          d="M 0 12 L 25 12 L 35 4 L 45 20 L 55 12 L 85 12 L 95 2 L 105 22 L 115 12 L 160 12"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="animate-pulse"
                        />
                      </svg>
                    </div>

                    <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Normal sinus rhythm</span>
                    </p>
                  </div>

                  {/* Metric 2: Blood Pressure */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Blood Pressure</span>
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {patientVitals.bp}
                      </span>
                      <span className="text-xs text-slate-400">mmHg</span>
                    </div>
                    <p className="mt-1 text-[11px] text-emerald-400 font-mono">Optimal arterial pressure</p>
                  </div>

                  {/* Metric 3: Oxygen Saturation */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Pulse Oximetry (SpO2)</span>
                      <Activity className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {patientVitals.spO2}%
                      </span>
                      <span className="text-xs text-slate-400">SpO2</span>
                    </div>
                    <p className="mt-1 text-[11px] text-cyan-400 font-mono">Telemetry stream steady</p>
                  </div>
                </div>

                {/* Interactive Status Callout */}
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-white">Full-Stack Synthesis Architecture</span>
                      <p className="text-slate-400">This interactive component was synthesized with React 19, TypeScript, and Express in 1.4 seconds.</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGenerate(promptInput || 'TeleHealth EHR Portal')}
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                  >
                    Open in Studio
                  </Button>
                </div>
              </div>
            )}

            {/* 2. CODE SNIPPET TABS (App.tsx, server.ts, schema.sql, terminal) */}
            {activeTab !== 'preview' && (
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                <code>{codeSnippets[activeTab]}</code>
              </pre>
            )}

          </div>

          {/* Bottom Bar: Architecture Verified */}
          <div className="px-6 py-3 bg-[#0B1120] border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-3">
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Compiler: PASS (0 errors)</span>
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="hidden sm:inline">TypeScript 5.4 · Strict Mode</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onGenerate(promptInput || 'Healthcare Management Portal')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Scaffold This App</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Modern Tech Ecosystem Row (Linear / Vercel style) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-16 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400 font-mono text-center mb-6">
            Architected with modern open-source foundations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 hover:opacity-100 transition-opacity">
            <span className="font-bold text-sm tracking-tight text-slate-300 font-mono">React 19</span>
            <span className="font-bold text-sm tracking-tight text-slate-300 font-mono">TypeScript</span>
            <span className="font-bold text-sm tracking-tight text-slate-300 font-mono">PostgreSQL</span>
            <span className="font-bold text-sm tracking-tight text-slate-300 font-mono">Drizzle ORM</span>
            <span className="font-bold text-sm tracking-tight text-slate-300 font-mono">Tailwind CSS</span>
            <span className="font-bold text-sm tracking-tight text-slate-300 font-mono">Docker</span>
            <span className="font-bold text-sm tracking-tight text-slate-300 font-mono">Vite</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
