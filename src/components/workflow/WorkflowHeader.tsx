import React, { useState, useRef, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Download, 
  LayoutGrid, 
  ArrowLeft,
  Sparkles,
  ChevronDown,
  FileJson,
  Image as ImageIcon,
  Cpu,
  Layers
} from 'lucide-react';
import { Button } from '../Button';

interface WorkflowHeaderProps {
  name: string;
  owner: string;
  branch: string;
  techStack: string[];
  latestCommitSha?: string;
  isRefreshing: boolean;
  isFullscreen: boolean;
  onRefresh: () => void;
  onAutoLayout: () => void;
  onExportJson: () => void;
  onExportPng: () => void;
  onToggleFullscreen: () => void;
  onBackToRepo?: () => void;
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  name,
  owner,
  branch,
  techStack,
  latestCommitSha,
  isRefreshing,
  isFullscreen,
  onRefresh,
  onAutoLayout,
  onExportJson,
  onExportPng,
  onToggleFullscreen,
  onBackToRepo
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#080d1a]/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
      
      {/* Subtle background ambient glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Repo Identity & Breadcrumbs */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {onBackToRepo && (
              <button
                onClick={onBackToRepo}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-white transition-all cursor-pointer group"
                title="Back to Repository Explorer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}

            <div>
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold">{owner}</span>
                <span className="text-slate-600">/</span>
                <h1 className="text-lg font-bold text-white tracking-tight">{name}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-semibold">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  Visual Architecture
                </span>
              </div>

              {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-1 text-slate-300">
                  <GitBranch className="w-3 h-3 text-cyan-400" />
                  <span>{branch}</span>
                </div>

                {latestCommitSha && (
                  <>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <GitCommit className="w-3 h-3 text-purple-400" />
                      <span>{latestCommitSha.substring(0, 7)}</span>
                    </div>
                  </>
                )}

                {techStack && techStack.length > 0 && (
                  <>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <span>{techStack.slice(0, 4).join(' · ')}</span>
                      {techStack.length > 4 && (
                        <span className="text-slate-500">+{techStack.length - 4}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs font-mono bg-slate-900/80 border-slate-700/60 hover:bg-slate-800 text-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isRefreshing ? 'Analyzing...' : 'Refresh'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onAutoLayout}
            className="text-xs font-mono bg-slate-900/80 border-slate-700/60 hover:bg-slate-800 text-slate-200"
            title="Re-compute clean Dagre layout"
          >
            <LayoutGrid className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            <span>Layout</span>
          </Button>

          {/* Export Dropdown */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="text-xs font-mono bg-slate-900/80 border-slate-700/60 hover:bg-slate-800 text-slate-200"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
            </Button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    onExportJson();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileJson className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="font-semibold">Export JSON</p>
                    <p className="text-[10px] text-slate-500">Topology data & relations</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onExportPng();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-800/60"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-semibold">Print / Screenshot</p>
                    <p className="text-[10px] text-slate-500">High-res canvas snapshot</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            className="text-xs font-mono bg-slate-900/80 border-slate-700/60 hover:bg-slate-800 text-slate-200"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                <span className="hidden sm:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
};
