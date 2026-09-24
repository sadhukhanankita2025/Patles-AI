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
  ArrowUpDown
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
  onZoomIn,
  onZoomOut,
  onFitView,
  onResetView,
  onAutoLayout
}) => {
  const tabs: TabItem[] = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Sparkles, 
      count: Object.values(categoriesCount).reduce((a, b) => a + b, 0) 
    },
    { 
      id: 'frontend', 
      label: 'Frontend', 
      icon: Layers, 
      count: categoriesCount.frontend 
    },
    { 
      id: 'backend', 
      label: 'Backend', 
      icon: Server, 
      count: categoriesCount.backend 
    },
    { 
      id: 'api', 
      label: 'API Flow', 
      icon: Terminal, 
      count: categoriesCount.api 
    },
    { 
      id: 'database', 
      label: 'Database', 
      icon: Database, 
      count: (categoriesCount.database || 0) + (categoriesCount.table || 0) 
    },
    { 
      id: 'auth', 
      label: 'Authentication', 
      icon: ShieldCheck, 
      count: categoriesCount.auth 
    },
    { 
      id: 'journey', 
      label: 'User Journey', 
      icon: Route, 
      count: categoriesCount.journey 
    },
  ];

  return (
    <div className="space-y-3">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#0B1120]/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none shadow-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
              <span>{tab.label}</span>

              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search + Canvas Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-[#0B1120]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search nodes by name, endpoint, path, or technology..."
            className="w-full pl-9 pr-16 py-1.5 text-xs font-mono bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />

          {searchQuery && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {matchCount !== undefined && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {matchCount} found
                </span>
              )}
              <button
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Canvas Toolbar Controls */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          {/* Layout Direction Toggle */}
          <button
            onClick={onToggleLayoutDirection}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
            title={`Switch to ${layoutDirection === 'LR' ? 'Vertical (Top to Bottom)' : 'Horizontal (Left to Right)'} flow`}
          >
            {layoutDirection === 'LR' ? (
              <>
                <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline text-[11px]">Horizontal</span>
              </>
            ) : (
              <>
                <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden md:inline text-[11px]">Vertical</span>
              </>
            )}
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

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
            title="Re-run auto layout"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Auto Layout</span>
          </button>
        </div>

      </div>
    </div>
  );
};
