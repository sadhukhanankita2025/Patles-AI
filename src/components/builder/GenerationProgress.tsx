import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles, Cpu, Layers, Database, Shield, Globe } from 'lucide-react';

export interface GenerationStep {
  id: string;
  label: string;
  detail: string;
  iconName: string;
}

export const GENERATION_STEPS: GenerationStep[] = [
  { id: 'init', label: 'Initializing...', detail: 'Configuring AI compiler context and semantic models', iconName: 'Cpu' },
  { id: 'arch', label: 'Generating architecture...', detail: 'Synthesizing full-stack node topology and message flow', iconName: 'Layers' },
  { id: 'frontend', label: 'Generating frontend...', detail: 'Scaffolding React components, responsive layouts & Tailwind UI', iconName: 'Globe' },
  { id: 'backend', label: 'Generating backend...', detail: 'Creating Express router, auth guards and business services', iconName: 'Shield' },
  { id: 'apis', label: 'Generating APIs...', detail: 'Synthesizing 18 REST endpoints with validation schemas', iconName: 'Cpu' },
  { id: 'database', label: 'Generating database...', detail: 'Creating PostgreSQL relational DDL, tables and audit triggers', iconName: 'Database' },
  { id: 'workspace', label: 'Building workspace...', detail: 'Bundling virtual filesystem and setting up VS Code editor', iconName: 'Layers' },
  { id: 'done', label: 'Done.', detail: 'Project generated and ready for inspection', iconName: 'Sparkles' }
];

interface GenerationProgressProps {
  currentStepIndex: number;
  progressPercent: number;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  currentStepIndex,
  progressPercent
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-5 rounded-3xl bg-[#0B1120]/95 border border-purple-500/30 shadow-2xl backdrop-blur-2xl space-y-4"
    >
      {/* Header & Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-wide uppercase">
              AI Generation Pipeline Active
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {Math.min(100, Math.round(progressPercent))}%
          </span>
        </div>

        {/* Dynamic Glowing Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-white/5 overflow-hidden p-0.5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            initial={{ width: '5%' }}
            animate={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-1.5 pt-1">
        {GENERATION_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex || currentStepIndex === GENERATION_STEPS.length - 1;
          const isCurrent = idx === currentStepIndex && currentStepIndex < GENERATION_STEPS.length - 1;
          const isPending = idx > currentStepIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.04 }}
              className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                isDone
                  ? 'bg-purple-950/20 border border-purple-500/20 text-purple-200'
                  : isCurrent
                  ? 'bg-slate-900/90 border border-cyan-400/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-950/40 border border-white/5 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0 flex items-center justify-center text-[9px] text-slate-600">
                    {idx + 1}
                  </div>
                )}
                <div className="truncate">
                  <span className={`font-semibold ${isCurrent ? 'text-cyan-300' : ''}`}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="hidden sm:inline-block ml-2 text-[10px] text-slate-400 font-sans">
                      — {step.detail}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {isDone && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Ready
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 animate-pulse">
                    Synthesizing
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
