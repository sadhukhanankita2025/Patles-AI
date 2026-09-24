import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Layers, 
  Database, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Terminal, 
  FileCode, 
  FolderTree, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/Button';
import { useProject } from '../context/ProjectContext';
import { PageView } from '../types';

interface BuilderPageProps {
  onNavigate: (page: PageView) => void;
  initialPrompt?: string;
}

const PROJECT_TYPES = [
  { id: 'fullstack', label: 'Full Stack Application', desc: 'React frontend + Express API + PostgreSQL schema' },
  { id: 'webapp', label: 'Web Application', desc: 'Dynamic single-page application with backend state' },
  { id: 'website', label: 'Website', desc: 'Content-driven modern web presence with contact / auth' },
  { id: 'api', label: 'API / Microservice', desc: 'REST endpoints with controller validation & database' },
  { id: 'mobile', label: 'Mobile Application', desc: 'React Native / mobile responsive architecture' },
];

const FRONTEND_OPTIONS = ['React', 'Next.js', 'Vue', 'Tailwind CSS'];
const BACKEND_OPTIONS = ['Node.js + Express', 'Python + FastAPI', 'Python + Django', 'PHP + Laravel', 'Java + Spring Boot'];
const DATABASE_OPTIONS = ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Firebase', 'Supabase'];

export const BuilderPage: React.FC<BuilderPageProps> = ({
  onNavigate,
  initialPrompt = ''
}) => {
  const { setActiveProjectId, refreshProjects } = useProject();

  const [prompt, setPrompt] = useState<string>(
    initialPrompt || 'Create a healthcare website with login and appointment booking.'
  );
  const [projectType, setProjectType] = useState<string>('fullstack');
  const [frontend, setFrontend] = useState<string>('React');
  const [backend, setBackend] = useState<string>('Node.js + Express');
  const [database, setDatabase] = useState<string>('PostgreSQL');

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const stagesList = [
    'Initializing AI Project Synthesis Engine',
    'Generating Architecture Specification & Plan',
    'Constructing Production Frontend UI Components',
    'Creating REST Controllers, Routes & Middleware',
    'Generating Database Relational Schema & DDL',
    'Configuring Environment & Build Manifests',
    'Finalizing Project Repository in Database'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCompletedStages([]);

    try {
      // Stage 1
      setCurrentStage(stagesList[0]);
      await new Promise(r => setTimeout(r, 300));
      setCompletedStages(prev => [...prev, stagesList[0]]);

      // Stage 2
      setCurrentStage(stagesList[1]);
      await new Promise(r => setTimeout(r, 400));
      setCompletedStages(prev => [...prev, stagesList[1]]);

      // Stage 3 & 4: Call Real Server API
      setCurrentStage(stagesList[2]);
      
      const res = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          frontend,
          backend,
          database,
          projectType
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Project generation failed.');
      }

      const data = await res.json();
      setCompletedStages(prev => [...prev, stagesList[2]]);

      // Remaining stage animations for visual feedback
      setCurrentStage(stagesList[3]);
      await new Promise(r => setTimeout(r, 300));
      setCompletedStages(prev => [...prev, stagesList[3]]);

      setCurrentStage(stagesList[4]);
      await new Promise(r => setTimeout(r, 300));
      setCompletedStages(prev => [...prev, stagesList[4]]);

      setCurrentStage(stagesList[5]);
      await new Promise(r => setTimeout(r, 200));
      setCompletedStages(prev => [...prev, stagesList[5]]);

      setCurrentStage(stagesList[6]);
      await new Promise(r => setTimeout(r, 200));
      setCompletedStages(prev => [...prev, stagesList[6]]);

      // Set active project and refresh context
      if (data.project && data.project.id) {
        setActiveProjectId(data.project.id);
        await refreshProjects();
        // Redirect to newly created workspace
        setTimeout(() => {
          onNavigate('workspace');
        }, 500);
      }
    } catch (err: any) {
      console.error('Generation failure:', err);
      setError(err.message || 'An unexpected error occurred during project generation.');
    } finally {
      setIsGenerating(false);
      setCurrentStage('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 font-sans">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Patles.ai Software Engineering Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Build with AI
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Describe any application in natural language. Patles.ai generates real production code, database schemas, REST APIs, and provides an integrated VS Code workspace.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Generation Form */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Project Specification Prompt
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={4}
              placeholder="Create a healthcare website with login and appointment booking."
              className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none font-sans"
              required
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-mono">Suggested:</span>
            {[
              'Create a healthcare website with login and appointment booking.',
              'Build a modern e-commerce store with catalog, cart, and checkout.',
              'Design a course learning portal with student enrollment and video lessons.'
            ].map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(sug)}
                className="text-[11px] font-mono text-purple-400 hover:text-purple-300 hover:underline cursor-pointer truncate max-w-xs"
              >
                "{sug.slice(0, 36)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Project Type */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-slate-300">
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              disabled={isGenerating}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
            >
              {PROJECT_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 font-mono">
              {PROJECT_TYPES.find(t => t.id === projectType)?.desc}
            </p>
          </div>

          {/* Technology Frontend / Backend */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-slate-300">
              Frontend & Backend Tech
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={frontend}
                onChange={(e) => setFrontend(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
              >
                {FRONTEND_OPTIONS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <select
                value={backend}
                onChange={(e) => setBackend(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
              >
                {BACKEND_OPTIONS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Cohesive client-server architecture
            </p>
          </div>

          {/* Database */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-slate-300">
              Database Dialect
            </label>
            <select
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              disabled={isGenerating}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
            >
              {DATABASE_OPTIONS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 font-mono">
              Relational DDL & table indexes
            </p>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-800">
          <span className="text-xs font-mono text-slate-400">
            Generates real source files, REST APIs, and database schema
          </span>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={isGenerating}
            leftIcon={<Wand2 className="w-4 h-4 text-cyan-300" />}
            className="font-mono text-xs px-8 shadow-xl shadow-purple-900/40"
          >
            {isGenerating ? 'Generating Project...' : 'Generate Project'}
          </Button>
        </div>

      </form>

      {/* Real Progress Stages */}
      {isGenerating && (
        <div className="p-6 rounded-3xl bg-[#0B1120] border border-purple-500/30 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              Active Generation Pipeline
            </span>
            <span className="text-[11px] text-cyan-400">
              {completedStages.length} of {stagesList.length} completed
            </span>
          </div>

          <div className="space-y-2">
            {stagesList.map((stage, idx) => {
              const isCompleted = completedStages.includes(stage);
              const isCurrent = currentStage === stage;

              return (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isCompleted 
                      ? 'bg-purple-950/20 border-purple-500/30 text-purple-200' 
                      : isCurrent 
                      ? 'bg-slate-900 border-cyan-500/50 text-white animate-pulse' 
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span>{stage}</span>
                  </div>
                  {isCompleted && (
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Ready</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
