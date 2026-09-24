import React from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Key, 
  Terminal, 
  Database, 
  Package, 
  FileCode,
  ArrowRight
} from 'lucide-react';
import { CodebaseSummary } from '../../types/github';
import { Button } from '../Button';

interface CodebaseSummaryViewProps {
  summary?: CodebaseSummary | null;
  onGenerateSummary?: () => void;
  isLoading?: boolean;
}

export const CodebaseSummaryView: React.FC<CodebaseSummaryViewProps> = ({
  summary,
  onGenerateSummary,
  isLoading = false
}) => {
  if (!summary) {
    return (
      <div className="p-8 rounded-3xl bg-[#0F172A]/80 border border-slate-800 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Synthesize AI Codebase Summary</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Extract executive system architecture, key application capabilities, entry points, and authentication workflows.
          </p>
        </div>
        {onGenerateSummary && (
          <Button
            variant="gradient"
            size="md"
            onClick={onGenerateSummary}
            isLoading={isLoading}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="text-xs font-semibold shadow-lg shadow-purple-600/30"
          >
            Generate AI Codebase Summary
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              AI Codebase Summary
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous structural deconstruction & architectural blueprint
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
            {summary.modelUsed || 'Gemini 3.8 Flash'}
          </span>
          {onGenerateSummary && (
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateSummary}
              isLoading={isLoading}
              className="text-xs"
            >
              Re-Synthesize
            </Button>
          )}
        </div>
      </div>

      {/* Project Overview */}
      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
        <h3 className="text-xs font-bold text-purple-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          Project Overview
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {summary.projectOverview}
        </p>
      </div>

      {/* Architecture & Entry Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            System Architecture
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {summary.architecture}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-emerald-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5" />
            Main Entry Points
          </h3>
          <div className="space-y-2 font-mono text-xs">
            {summary.entryPoints?.frontend && (
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">FRONTEND ENTRY</span>
                <span className="text-cyan-300 font-semibold">{summary.entryPoints.frontend}</span>
              </div>
            )}
            {summary.entryPoints?.backend && (
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">BACKEND ENTRY</span>
                <span className="text-purple-300 font-semibold">{summary.entryPoints.backend}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Features */}
      {summary.mainFeatures?.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Key Application Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {summary.mainFeatures.map((feature, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300 font-mono"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer Details: Auth, API, Database, Dependencies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        
        {/* Auth */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <Key className="w-4 h-4" />
            Authentication
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {summary.authentication || 'Token-based authentication'}
          </p>
        </div>

        {/* API Layer */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Terminal className="w-4 h-4" />
            API Routing Layer
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {summary.apiLayer || 'RESTful API controller layer'}
          </p>
        </div>

        {/* Database */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <Database className="w-4 h-4" />
            Database & Schema
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {summary.database || 'Relational schema persistence'}
          </p>
        </div>

      </div>

    </div>
  );
};
