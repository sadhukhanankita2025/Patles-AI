import React from 'react';
import { Route, ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import { UserJourneyStep } from '../../types/github';

interface UserJourneyGraphProps {
  steps: UserJourneyStep[];
}

export const UserJourneyGraph: React.FC<UserJourneyGraphProps> = ({ steps = [] }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Inferred User Journey & Navigation Flow
            </h2>
            <p className="text-xs text-slate-400">
              End-to-end user state progression reconstructed from application routes and page hierarchy
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/60">
          {steps.length} Route Stages
        </span>
      </div>

      {/* Steps Pipeline */}
      <div className="overflow-x-auto py-2">
        <div className="flex items-center gap-3 min-w-[650px]">
          {steps.map((step, idx) => (
            <React.Fragment key={step.step}>
              <div className="flex-1 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                    {step.step}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {step.route}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white font-mono">{step.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

    </div>
  );
};
