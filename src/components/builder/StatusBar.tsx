import React from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  RotateCw, 
  Wand2, 
  Eye, 
  Camera, 
  UploadCloud, 
  GitBranch, 
  Cpu, 
  Terminal,
  Loader2
} from 'lucide-react';

interface StatusBarProps {
  statusText?: string;
  isGenerating: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onGenerate: () => void;
  onPreview: () => void;
  onSnapshot: () => void;
  onPublish: () => void;
  aiModel?: string;
  activeFilePath?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  statusText = 'Ready',
  isGenerating,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onGenerate,
  onPreview,
  onSnapshot,
  onPublish,
  aiModel = 'IBM Granite 3.0',
  activeFilePath = 'src/pages/Login.jsx'
}) => {
  return (
    <footer className="h-9 bg-[#0B1120] border-t border-white/10 px-3 sm:px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none z-30 shrink-0">
      {/* Left Status info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {isGenerating ? (
            <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className={isGenerating ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
            {statusText}
          </span>
        </div>

        <span className="hidden md:inline text-slate-700">|</span>

        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <GitBranch className="w-3 h-3 text-purple-400" />
          <span>main</span>
        </div>

        <span className="hidden lg:inline text-slate-700">|</span>

        <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>{aiModel}</span>
        </div>

        <span className="hidden xl:inline text-slate-700">|</span>

        <div className="hidden xl:flex items-center gap-1.5 text-slate-500 truncate max-w-xs">
          <span>Editing:</span>
          <span className="text-slate-300">{activeFilePath}</span>
        </div>
      </div>

      {/* Right Controls requested: Undo, Redo, Generate, Preview, Snapshot, Publish */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo || isGenerating}
          className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
          title="Undo"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Undo</span>
        </button>

        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo || isGenerating}
          className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
          title="Redo"
        >
          <RotateCw className="w-3 h-3" />
          <span className="hidden sm:inline">Redo</span>
        </button>

        <span className="text-slate-700">|</span>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-2 py-0.5 rounded hover:bg-purple-950/60 text-purple-300 hover:text-purple-200 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Wand2 className="w-3 h-3 text-purple-400" />
          <span>Generate</span>
        </button>

        <button
          type="button"
          onClick={onPreview}
          className="px-2 py-0.5 rounded hover:bg-cyan-950/60 text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={onSnapshot}
          className="px-2 py-0.5 rounded hover:bg-amber-950/60 text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Camera className="w-3 h-3 text-amber-400" />
          <span>Snapshot</span>
        </button>

        <button
          type="button"
          onClick={onPublish}
          className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer ml-1"
        >
          <UploadCloud className="w-3 h-3" />
          <span>Publish</span>
        </button>
      </div>
    </footer>
  );
};
