import React from 'react';
import { FileMetricItem, CodebaseFileSummary } from '../../../types/fileAnalysis';
import { Zap, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Cpu, Layers } from 'lucide-react';

interface FileHotspotsViewProps {
  summary: CodebaseFileSummary;
  onSelectFile: (file: FileMetricItem) => void;
}

export const FileHotspotsView: React.FC<FileHotspotsViewProps> = ({
  summary,
  onSelectFile
}) => {
  return (
    <div className="space-y-6 font-mono">
      {/* Overview Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>
            Coupling & Architectural Risk Engine: Identifying modules with highest blast radius and refactoring priorities.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Architecture Hotspots (Coupling) */}
        <div className="p-5 rounded-2xl bg-[#0B1120] border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Architecture Hotspots</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Highest inbound imports. Modifications here ripple across multiple modules.
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              {summary.hotspots.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {summary.hotspots.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No high-coupling hotspots identified.
              </div>
            ) : (
              summary.hotspots.map((file) => (
                <div
                  key={file.id}
                  onClick={() => onSelectFile(file)}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white group-hover:text-amber-300 text-xs truncate max-w-xs">
                      {file.fileName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300">
                      {file.inboundImportsCount} callers
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">{file.path}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800">
                    <span>{file.linesOfCode} LOC · {file.category}</span>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Inspect <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Refactoring Candidates (High Complexity) */}
        <div className="p-5 rounded-2xl bg-[#0B1120] border border-rose-500/30 shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Refactoring Candidates</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Highest cyclomatic complexity and branch logic requiring decomposition.
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
              {summary.highComplexityFiles.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {summary.highComplexityFiles.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                All indexed files exhibit low/moderate cyclomatic complexity!
              </div>
            ) : (
              summary.highComplexityFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => onSelectFile(file)}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white group-hover:text-rose-300 text-xs truncate max-w-xs">
                      {file.fileName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-rose-500/20 text-rose-300">
                      Score: {file.cyclomaticComplexity}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">{file.path}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800">
                    <span>{file.linesOfCode} LOC · {file.maintainabilityIndex}% M.I.</span>
                    <span className="text-rose-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Inspect <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Leaf & Standalone Modules */}
        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Isolated & Leaf Modules</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Zero inbound dependencies. Safe to refactor or prune if unused.
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              {summary.leafFiles.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {summary.leafFiles.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                All files are interconnected in the dependency tree.
              </div>
            ) : (
              summary.leafFiles.slice(0, 10).map((file) => (
                <div
                  key={file.id}
                  onClick={() => onSelectFile(file)}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white group-hover:text-cyan-300 text-xs truncate max-w-xs">
                      {file.fileName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-800 text-slate-400">
                      {file.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">{file.path}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800">
                    <span>{file.linesOfCode} LOC · 0 in / {file.importsCount} out</span>
                    <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Inspect <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
