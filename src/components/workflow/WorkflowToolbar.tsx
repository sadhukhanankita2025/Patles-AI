import React from 'react';
import {
  Layers,
  Server,
  Terminal,
  Database,
  ShieldCheck,
  Route,
  Sparkles,
  Search,
  X,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  LayoutGrid,
  ArrowRightLeft,
  ArrowUpDown,
  Zap,
  Boxes,
  Network
} from 'lucide-react';
import { WorkflowCategory } from '../../types/workflow';

interface TabItem {
  id: WorkflowCategory;
  label: string;
  icon: any;
  count?: number;
}

interface WorkflowToolbarProps {
  activeTab: WorkflowCategory;
  onSelectTab: (tab: WorkflowCategory) => void;
  categoriesCount: Record<string, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  matchCount?: number;
  layoutDirection: 'LR' | 'TB';
  onToggleLayoutDirection: () => void;
  showClusters: boolean;
  onToggleClusters: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onOpenTraceModal?: () => void;
  hasActiveFileConnection?: boolean;
  onClearConnectionFocus?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onResetView: () => void;
  onAutoLayout: () => void;
}

export const WorkflowToolbar: React.FC<WorkflowToolbarProps> = ({
  activeTab,
  onSelectTab,
  categoriesCount,
  searchQuery,
  onSearchChange,
  matchCount,
  layoutDirection,
  onToggleLayoutDirection,
  showClusters,
  onToggleClusters,
  isSimulating,
  onToggleSimulation,
  onOpenTraceModal,
  hasActiveFileConnection,
  onClearConnectionFocus,
  onZoomIn,
  onZoomOut,
  onFitView,
  onResetView,
  onAutoLayout
}) => {
  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'All Architecture',
      icon: Sparkles,
      count: Object.values(categoriesCount).reduce((a, b) => a + b, 0)
    },
    {
      id: 'frontend',
      label: 'Frontend UI',
      icon: Layers,
      count: categoriesCount.frontend
    },
    {
      id: 'api',
      label: 'API Gateway',
      icon: Terminal,
      count: categoriesCount.api
    },
    {
      id: 'backend',
      label: 'Backend Logic',
      icon: Server,
      count: categoriesCount.backend
    },
    {
      id: 'database',
      label: 'Database & Schemas',
      icon: Database,
      count: (categoriesCount.database || 0) + (categoriesCount.table || 0)
    },
    {
      id: 'auth',
      label: 'Auth Boundary',
      icon: ShieldCheck,
      count: categoriesCount.auth
    },
    {
      id: 'journey',
      label: 'Pipeline Journey',
      icon: Route,
      count: categoriesCount.journey
    },
  ];

  return (
    <div className="space-y-3">
      {/* Category Tabs Segmented Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#080d1a]/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl overflow-x-auto scrollbar-none shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-linear-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold shadow-lg shadow-purple-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} />
              <span>{tab.label}</span>

              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search + Simulation + Clusters + Direction + Zoom Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-[#080d1a]/85 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl">

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search nodes by name, route, controller, schema..."
            className="w-full pl-9 pr-20 py-1.5 text-xs font-mono bg-slate-950/80 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <>
                {matchCount !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {matchCount} found
                  </span>
                )}
                <button
                  onClick={() => onSearchChange('')}
                  className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <span className="text-[9px] font-mono text-slate-600 bg-slate-900 border border-slate-800 px-1 rounded hidden sm:inline">
                /
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Trace Connections, Simulation, Clusters, Layout & View */}
        <div className="flex items-center flex-wrap gap-1.5 self-end sm:self-auto">

          {/* Trace File Connections Button */}
          {onOpenTraceModal && (
            <button
              onClick={onOpenTraceModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${hasActiveFileConnection
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30'
                  : 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30'
                }`}
              title="Search and trace all upstream callers & downstream dependencies of any file"
            >
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trace Files</span>
            </button>
          )}

          {/* Clear Active Connection Focus Button if active */}
          {hasActiveFileConnection && onClearConnectionFocus && (
            <button
              onClick={onClearConnectionFocus}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-mono transition-all cursor-pointer"
              title="Clear active file connection highlight"
            >
              <X className="w-3 h-3" />
              <span className="hidden xl:inline text-[11px]">Clear Highlight</span>
            </button>
          )}

          {/* Flow Simulator Toggle */}
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${isSimulating
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
              }`}
            title="Simulate end-to-end request pipelines through architecture"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce' : 'text-emerald-400'}`} />
            <span>{isSimulating ? 'Simulating' : 'Simulate Flow'}</span>
          </button>

          {/* Cluster Hulls Toggle */}
          <button
            onClick={onToggleClusters}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${showClusters
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-950/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            title="Toggle module cluster boundaries and layers"
          >
            <Boxes className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Clusters</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          {/* Layout Direction Toggle */}
          <button
            onClick={onToggleLayoutDirection}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
            title={`Switch to ${layoutDirection === 'LR' ? 'Vertical (Top to Bottom)' : 'Horizontal (Left to Right)'} flow`}
          >
            {layoutDirection === 'LR' ? (
              <>
                <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden lg:inline text-[11px]">Horizontal</span>
              </>
            ) : (
              <>
                <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden lg:inline text-[11px]">Vertical</span>
              </>
            )}
          </button>

          {/* Zoom & Fit Buttons */}
          <button
            onClick={onZoomIn}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onZoomOut}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onFitView}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Fit to Screen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetView}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onAutoLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition-colors cursor-pointer"
            title="Re-compute clean Dagre layout"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Auto Layout</span>
          </button>
        </div>

      </div>
    </div>
  );
};
