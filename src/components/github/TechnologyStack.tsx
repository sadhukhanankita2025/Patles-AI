import React from 'react';
import { Cpu, CheckCircle2, Layers } from 'lucide-react';
import { DetectedTech } from '../../types/github';

interface TechnologyStackProps {
  techStack: DetectedTech[];
  frameworks?: string[];
}

export const TechnologyStack: React.FC<TechnologyStackProps> = ({ techStack, frameworks = [] }) => {
  const getCategoryBadgeColor = (category: DetectedTech['category']) => {
    switch (category) {
      case 'frontend':
        return 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60';
      case 'backend':
        return 'bg-purple-950/40 text-purple-300 border-purple-800/60';
      case 'database':
        return 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60';
      case 'language':
        return 'bg-blue-950/40 text-blue-300 border-blue-800/60';
      case 'mobile':
        return 'bg-amber-950/40 text-amber-300 border-amber-800/60';
      case 'devops':
        return 'bg-rose-950/40 text-rose-300 border-rose-800/60';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Detected Technology Stack
            </h2>
            <p className="text-[11px] text-slate-400">
              AST signature inspection of manifests, configurations, and imports
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/40">
          {techStack.length} Technologies Identified
        </span>
      </div>

      {techStack.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 font-mono">
          Scanning configuration manifests...
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 font-mono text-xs shadow-sm transition-all hover:scale-[1.02] ${getCategoryBadgeColor(
                tech.category
              )}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <div className="flex flex-col">
                <span className="font-bold text-white leading-tight">
                  {tech.name} {tech.version ? `@${tech.version}` : ''}
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-wide">
                  {tech.category} · via {tech.sourceFile}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {frameworks.length > 0 && (
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Core Frameworks:</span>
          {frameworks.map((fw, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700/60 text-[11px]"
            >
              {fw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
