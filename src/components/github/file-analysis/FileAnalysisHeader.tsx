import React from 'react';
import { CodebaseFileSummary, FileCategory } from '../../../types/fileAnalysis';
import { 
  Network, 
  Layers, 
  Table, 
  Zap, 
  Search, 
  RotateCcw, 
  FileCode, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Activity,
  Filter
} from 'lucide-react';
import { Button } from '../../Button';

export type FileAnalysisViewMode = 'network' | 'treemap' | 'table' | 'hotspots';

interface FileAnalysisHeaderProps {
  summary: CodebaseFileSummary;
  activeMode: FileAnalysisViewMode;
  onChangeMode: (mode: FileAnalysisViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const FileAnalysisHeader: React.FC<FileAnalysisHeaderProps> = ({
  summary,
  activeMode,
  onChangeMode,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onRefresh,
  isRefreshing
}) => {
  const topHotspot = summary.hotspots[0];

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 shadow-xl">
          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            Indexed Files
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {summary.totalFiles.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">Source modules</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 shadow-xl">
          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Lines of Code (LOC)
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {summary.totalLinesOfCode.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">Avg {summary.averageLocPerFile} LOC / file</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 shadow-xl">
          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            Avg Complexity
          </div>
          <div className="text-xl font-bold text-amber-300 mt-1">
            {summary.averageComplexity}
          </div>
          <span className="text-[10px] text-slate-500">Cyclomatic rating</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 shadow-xl">
          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Low Risk Modules
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {summary.totalFiles > 0 
              ? `${Math.round(((summary.complexityDistribution.low + summary.complexityDistribution.moderate) / summary.totalFiles) * 100)}%` 
              : '100%'}
          </div>
          <span className="text-[10px] text-slate-500">Maintainable state</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 shadow-xl col-span-2 md:col-span-1">
          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Primary Hotspot
          </div>
          <div className="text-sm font-bold text-white mt-1 truncate" title={topHotspot?.fileName || 'None'}>
            {topHotspot ? topHotspot.fileName : 'None detected'}
          </div>
          <span className="text-[10px] text-amber-400 font-semibold">
            {topHotspot ? `${topHotspot.inboundImportsCount} incoming links` : 'Healthy coupling'}
          </span>
        </div>
      </div>

      {/* 2. Languages Distribution Bar */}
      {summary.languages.length > 0 && (
        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Codebase Footprint by Language
            </span>
            <span className="text-slate-500 text-[11px]">
              {summary.languages.length} detected languages
            </span>
          </div>

          {/* Color stacked progress bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
            {summary.languages.map((lang, idx) => (
              <div
                key={idx}
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.max(1.5, lang.percentage)}%`,
                  backgroundColor: lang.color
                }}
                title={`${lang.language}: ${lang.percentage}% (${lang.linesOfCode.toLocaleString()} LOC)`}
              />
            ))}
          </div>

          {/* Language Legend Swatches */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px] text-slate-300">
            {summary.languages.slice(0, 6).map((lang, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                <span>{lang.language}</span>
                <span className="text-slate-500 font-semibold">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Toolbar: View Mode Tabs + Search + Category Filter + Refresh */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
        
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#0B1120] border border-slate-800 rounded-xl overflow-x-auto shrink-0 shadow-lg">
          <button
            onClick={() => onChangeMode('network')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              activeMode === 'network'
                ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Network Graph</span>
          </button>

          <button
            onClick={() => onChangeMode('treemap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              activeMode === 'treemap'
                ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Treemap Hierarchy</span>
          </button>

          <button
            onClick={() => onChangeMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              activeMode === 'table'
                ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Metrics Matrix ({summary.totalFiles})</span>
          </button>

          <button
            onClick={() => onChangeMode('hotspots')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              activeMode === 'hotspots'
                ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Hotspots & Risks</span>
          </button>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search file path or name..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#0B1120] border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Category Filter Select */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-2.5 py-1.5 bg-[#0B1120] border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="component">Components</option>
            <option value="page">Pages</option>
            <option value="route">API Routes</option>
            <option value="service">Services</option>
            <option value="model">DB Models</option>
            <option value="hook">Hooks</option>
            <option value="util">Utilities</option>
            <option value="config">Config</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-[#0B1120] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title="Re-run File Analysis"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
