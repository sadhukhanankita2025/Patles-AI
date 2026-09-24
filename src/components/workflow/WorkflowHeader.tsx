import React, { useState } from 'react';
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
  Layers,
  ChevronDown,
  FileJson,
  Image as ImageIcon
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

  return (
    <div className="bg-[#0B1120]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Repo Identity & Breadcrumbs */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {onBackToRepo && (
              <button
                onClick={onBackToRepo}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Back to Repository Explorer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold">{owner}</span>
                <span className="text-slate-600">/</span>
                <h1 className="text-lg font-bold text-white tracking-wide">{name}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Interactive Workflow
                </span>
              </div>

              {/* Branch, Commit & Tech Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
                  <GitBranch className="w-3 h-3 text-cyan-400" />
                  <span>{branch}</span>
                </div>

                {latestCommitSha && (
                  <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
                    <GitCommit className="w-3 h-3 text-purple-400" />
                    <span>{latestCommitSha.substring(0, 7)}</span>
                  </div>
                )}

                {techStack && techStack.length > 0 && (
                  <div className="flex items-center gap-1.5 pl-1">
                    {techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                    {techStack.length > 4 && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        +{techStack.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Analysis</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onAutoLayout}
            className="text-xs font-mono"
            title="Re-compute clean Dagre layout"
          >
            <LayoutGrid className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            <span>Auto Layout</span>
          </Button>

          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="text-xs font-mono"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
            </Button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-[#0F172A] border border-slate-800 shadow-2xl py-1.5 z-50">
                <button
                  onClick={() => {
                    onExportJson();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileJson className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export JSON Graph</span>
                </button>
                <button
                  onClick={() => {
                    onExportPng();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export PNG Image</span>
                </button>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            className="text-xs font-mono"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                <span>Fullscreen</span>
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
};
