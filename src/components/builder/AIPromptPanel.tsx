import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  RotateCcw, 
  RotateCw, 
  Cpu, 
  Globe, 
  Server, 
  Database, 
  Cloud,
  CornerDownLeft,
  ChevronDown
} from 'lucide-react';
import { PromptSuggestionCard, QUICK_PROMPTS } from './PromptSuggestionCard';
import { GenerationProgress } from './GenerationProgress';

interface AIPromptPanelProps {
  prompt: string;
  setPrompt: (val: string) => void;
  aiModel: string;
  setAiModel: (val: string) => void;
  frontend: string;
  setFrontend: (val: string) => void;
  backend: string;
  setBackend: (val: string) => void;
  database: string;
  setDatabase: (val: string) => void;
  deployment: string;
  setDeployment: (val: string) => void;
  isGenerating: boolean;
  currentStepIndex: number;
  progressPercent: number;
  onGenerate: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const AI_MODELS = [
  { id: 'IBM Granite 3.0', label: 'IBM Granite 3.0 (Enterprise)' },
  { id: 'GPT-4o', label: 'GPT-4o (OpenAI High-Speed)' },
  { id: 'Claude 3.7 Sonnet', label: 'Claude 3.7 Sonnet (Anthropic Code)' }
];

const FRONTEND_OPTIONS = ['React', 'Next.js', 'Vue'];
const BACKEND_OPTIONS = ['Express', 'Django', 'Flask', 'Spring Boot'];
const DATABASE_OPTIONS = ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase'];
const DEPLOYMENT_OPTIONS = ['Vercel', 'Railway', 'Docker'];

export const AIPromptPanel: React.FC<AIPromptPanelProps> = ({
  prompt,
  setPrompt,
  aiModel,
  setAiModel,
  frontend,
  setFrontend,
  backend,
  setBackend,
  database,
  setDatabase,
  deployment,
  setDeployment,
  isGenerating,
  currentStepIndex,
  progressPercent,
  onGenerate,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut: Enter -> Generate, Shift+Enter -> New line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && prompt.trim()) {
        onGenerate();
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-5 overflow-y-auto pr-1">
      {/* Header section */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Autonomous Full-Stack Architect</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          What are we building today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
          Describe your application and Patles.ai will generate a complete full-stack project with frontend UI, backend APIs, relational schema, and interactive workspace.
        </p>
      </div>

      {/* Main Prompt Box */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0F172A]/80 border border-white/10 shadow-2xl backdrop-blur-xl space-y-3 relative group focus-within:border-purple-500/50 transition-all">
        <div className="flex items-center justify-between pb-1 border-b border-white/5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Project Prompt Specification
          </span>

          {/* Undo / Redo controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo || isGenerating}
              title="Undo prompt changes (Ctrl+Z)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo || isGenerating}
              title="Redo prompt changes (Ctrl+Y)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            rows={4}
            placeholder="Create a healthcare website with login and appointment booking."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base leading-relaxed focus:outline-none resize-none font-sans"
          />
        </div>

        {/* Footer info & shortcut indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-400">
              <span>Enter</span>
              <CornerDownLeft className="w-2.5 h-2.5" />
            </span>
            <span className="hidden sm:inline">to Generate</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">Shift + Enter for new line</span>
          </div>

          <div className="text-right text-slate-400">
            {prompt.length} chars
          </div>
        </div>
      </div>

      {/* AI Configuration Section */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0F172A]/75 border border-white/10 space-y-3.5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            AI & Architecture Configuration
          </span>
          <span className="text-[11px] font-mono text-cyan-400">Full-Stack Cohesion</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* AI Model */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-purple-400" /> AI Model
            </label>
            <div className="relative">
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                disabled={isGenerating}
                className="w-full appearance-none px-3 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500 pr-8"
              >
                {AI_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Frontend */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" /> Frontend
            </label>
            <div className="relative">
              <select
                value={frontend}
                onChange={(e) => setFrontend(e.target.value)}
                disabled={isGenerating}
                className="w-full appearance-none px-3 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500 pr-8"
              >
                {FRONTEND_OPTIONS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Backend */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Server className="w-3 h-3 text-emerald-400" /> Backend
            </label>
            <div className="relative">
              <select
                value={backend}
                onChange={(e) => setBackend(e.target.value)}
                disabled={isGenerating}
                className="w-full appearance-none px-3 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500 pr-8"
              >
                {BACKEND_OPTIONS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Database */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Database className="w-3 h-3 text-amber-400" /> Database
            </label>
            <div className="relative">
              <select
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                disabled={isGenerating}
                className="w-full appearance-none px-3 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500 pr-8"
              >
                {DATABASE_OPTIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Deployment */}
          <div className="space-y-1 sm:col-span-2 lg:col-span-2">
            <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Cloud className="w-3 h-3 text-blue-400" /> Deployment Target
            </label>
            <div className="relative">
              <select
                value={deployment}
                onChange={(e) => setDeployment(e.target.value)}
                disabled={isGenerating}
                className="w-full appearance-none px-3 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500 pr-8"
              >
                {DEPLOYMENT_OPTIONS.map(dp => (
                  <option key={dp} value={dp}>{dp}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Large Generate Button */}
      <motion.button
        type="button"
        whileHover={{ scale: isGenerating ? 1 : 1.01 }}
        whileTap={{ scale: isGenerating ? 1 : 0.99 }}
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-mono font-bold text-sm tracking-wide shadow-xl shadow-purple-900/30 hover:shadow-cyan-900/40 border border-cyan-400/30 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Wand2 className={`w-5 h-5 text-cyan-200 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
        <span>
          {isGenerating ? 'Generating Full Project...' : 'Generate Full Project'}
        </span>
      </motion.button>

      {/* Progress pipeline overlay during generation */}
      {isGenerating && (
        <GenerationProgress
          currentStepIndex={currentStepIndex}
          progressPercent={progressPercent}
        />
      )}

      {/* Quick Prompt Cards */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Prompt Templates
          </span>
          <span className="text-[11px] text-slate-500 font-mono">10 Curated Blueprints</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
          {QUICK_PROMPTS.map((suggestion) => (
            <PromptSuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              isSelected={prompt === suggestion.prompt}
              onSelect={(p) => setPrompt(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
