import React from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  Database, 
  Layers, 
  Terminal, 
  ArrowDownRight, 
  ArrowUpRight, 
  Cpu, 
  Folder,
  FileCode,
  CheckCircle2,
  X,
  Code2
} from 'lucide-react';
import { FileExplanation, FolderExplanation } from '../../types/github';

interface FileAnalysisPanelProps {
  fileExplanation?: FileExplanation | null;
  folderExplanation?: FolderExplanation | null;
  filePath?: string;
  onClose?: () => void;
  isLoading?: boolean;
}

export const FileAnalysisPanel: React.FC<FileAnalysisPanelProps> = ({
  fileExplanation,
  folderExplanation,
  filePath,
  onClose,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-purple-500/30 shadow-2xl flex flex-col items-center justify-center space-y-3 min-h-[300px]">
        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-sm font-bold text-white">AI AST Semantic Engine Running</div>
        <p className="text-xs text-slate-400 text-center max-w-xs font-mono">
          Deconstructing functions, inputs, outputs, database boundaries, and security policies...
        </p>
      </div>
    );
  }

  // Render Folder Explanation
  if (folderExplanation) {
    return (
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl space-y-4 overflow-y-auto max-h-[650px] scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-mono truncate max-w-xs">
                {folderExplanation.folderPath}
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">
                Folder Architecture Explanation
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Purpose */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Folder Purpose
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {folderExplanation.purpose}
          </p>
        </div>

        {/* Key Files */}
        {folderExplanation.importantFiles?.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 font-mono">
              Key Files & Modules
            </div>
            <div className="space-y-1.5">
              {folderExplanation.importantFiles.map((file, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                  <span className="text-cyan-300 font-semibold">{file.name}: </span>
                  <span className="text-slate-400">{file.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relationship */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-300 font-mono">
            Relationship with Other Folders
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            {folderExplanation.relationship}
          </p>
        </div>

        {/* Responsibilities */}
        {folderExplanation.responsibilities?.length > 0 && (
          <div className="space-y-1.5 font-mono text-xs">
            <div className="text-xs font-bold text-slate-300 font-mono">
              Main Responsibilities
            </div>
            {folderExplanation.responsibilities.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render File Explanation
  if (fileExplanation) {
    return (
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl space-y-5 overflow-y-auto max-h-[650px] scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono truncate max-w-xs">
                AI Code Understanding
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">
                {fileExplanation.modelUsed || 'Gemini 3.8 Flash'}
              </span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 1. File Summary */}
        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1">
          <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-mono">
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            File Summary
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {fileExplanation.summary}
          </p>
        </div>

        {/* 2. Purpose */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Architectural Purpose
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {fileExplanation.purpose}
          </p>
        </div>

        {/* 3. Functions */}
        {fileExplanation.functions && fileExplanation.functions.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              Key Functions & Handlers
            </div>
            <div className="space-y-1.5">
              {fileExplanation.functions.map((fn, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
                  <div className="text-cyan-300 font-semibold">{fn.name}()</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{fn.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Inputs & Outputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5 text-blue-400" />
              Inputs / Params
            </span>
            <p className="text-slate-300 mt-1 text-[11px]">
              {fileExplanation.inputs || 'Standard function arguments'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 text-teal-400" />
              Outputs / Returns
            </span>
            <p className="text-slate-300 mt-1 text-[11px]">
              {fileExplanation.outputs || 'Calculated result or React JSX'}
            </p>
          </div>
        </div>

        {/* 5. APIs & Database */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1 font-semibold">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              APIs Involved
            </span>
            <p className="text-slate-300 mt-1 text-[11px]">
              {fileExplanation.apis?.join(', ') || 'None declared'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1 font-semibold">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Database Operations
            </span>
            <p className="text-slate-300 mt-1 text-[11px]">
              {fileExplanation.database || 'No direct DB query'}
            </p>
          </div>
        </div>

        {/* 6. Security Analysis */}
        {fileExplanation.security && (
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 font-mono text-xs">
            <span className="text-amber-300 flex items-center gap-1.5 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Security Considerations
            </span>
            <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
              {fileExplanation.security}
            </p>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="p-8 rounded-2xl bg-[#0F172A] border border-slate-800 text-center text-slate-500 font-mono text-xs space-y-2">
      <Sparkles className="w-6 h-6 text-purple-400/60 mx-auto" />
      <p>Select any source file and click <span className="text-purple-300 font-bold">"Explain with AI"</span> to view a deep architectural breakdown.</p>
    </div>
  );
};
