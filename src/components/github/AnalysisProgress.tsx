import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

interface AnalysisProgressProps {
  steps: ProgressStep[];
  currentStepIndex: number;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ steps, currentStepIndex }) => {
  return (
    <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-purple-500/30 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Repository Intelligence Pipeline
          </h3>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/40">
          Step {Math.min(currentStepIndex + 1, steps.length)} of {steps.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isActive = step.status === 'active';

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-mono ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : isActive
                  ? 'bg-cyan-950/30 border-cyan-500/50 text-white shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
