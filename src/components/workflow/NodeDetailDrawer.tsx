import React, { useState } from 'react';
import { 
  X, 
  FileCode, 
  Terminal, 
  Database, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Route,
  Loader2,
  HardDrive
} from 'lucide-react';
import { WorkflowNodeItem } from '../../types/workflow';
import { Button } from '../Button';

interface NodeDetailDrawerProps {
  node: WorkflowNodeItem | null;
  onClose: () => void;
  onOpenSource: (filePath: string) => void;
  onExplainWithAi: (node: WorkflowNodeItem) => Promise<string>;
  onShowConnections: (nodeId: string) => void;
  upstreamCount?: number;
  downstreamCount?: number;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  onOpenSource,
  onExplainWithAi,
  onShowConnections,
  upstreamCount = 0,
  downstreamCount = 0
}) => {
  const [copied, setCopied] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  if (!node) return null;

  const { data } = node;

  const handleCopyPath = () => {
    const textToCopy = data.endpoint || data.path || data.label;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplain = async () => {
    setIsExplaining(true);
    try {
      const explanation = await onExplainWithAi(node);
      setAiExplanation(explanation);
    } catch {
      setAiExplanation('Unable to generate AI explanation at this time.');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 md:w-[420px] bg-[#0B1120]/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl z-40 flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-semibold">
              {data.category}
            </span>
            {data.subType && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                {data.subType}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white tracking-wide truncate" title={data.label}>
            {data.label}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* Path / Endpoint Display */}
        {(data.path || data.endpoint) && (
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                {data.endpoint ? 'API Endpoint' : 'File Location'}
              </span>
              <button
                onClick={handleCopyPath}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs font-mono text-cyan-300 break-all select-all">
              {data.endpoint || data.path}
            </p>
          </div>
        )}

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Description
          </label>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
            {data.description || 'Architectural entity detected in repository structure.'}
          </p>
        </div>

        {/* Tech Specs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Language</span>
            <span className="text-xs font-mono text-white font-medium mt-0.5 block truncate">
              {data.language || 'Standard'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Framework</span>
            <span className="text-xs font-mono text-purple-300 font-medium mt-0.5 block truncate">
              {data.framework || 'Detected Module'}
            </span>
          </div>
        </div>

        {/* Connected Graph Metrics */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/20 via-purple-950/20 to-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="text-center flex-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Incoming</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{upstreamCount} nodes</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center flex-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Outgoing</span>
            <span className="text-sm font-bold font-mono text-purple-400">{downstreamCount} nodes</span>
          </div>
        </div>

        {/* Connected APIs */}
        {data.connectedApis && data.connectedApis.length > 0 && (
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Connected APIs ({data.connectedApis.length})
            </label>
            <div className="space-y-1">
              {data.connectedApis.map((api, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 font-mono text-xs flex items-center justify-between"
                >
                  <span className="truncate">{api}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Database Relations */}
        {data.databaseRelations && data.databaseRelations.length > 0 && (
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              Database Relations
            </label>
            <div className="flex flex-wrap gap-1.5">
              {data.databaseRelations.map((rel, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-800/50 text-blue-300 font-mono text-xs"
                >
                  {rel}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Architectural Breakdown */}
        {aiExplanation && (
          <div className="space-y-2 p-3.5 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/30">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Patles AI Architectural Analysis</span>
            </div>
            <div className="text-xs text-slate-300 space-y-2 whitespace-pre-line leading-relaxed font-sans">
              {aiExplanation}
            </div>
          </div>
        )}

      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 border-t border-slate-800 bg-[#0B1120] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {data.path ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenSource(data.path!)}
              className="text-xs font-mono w-full"
            >
              <FileCode className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              <span>Open Source</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-xs font-mono w-full opacity-50"
            >
              <FileCode className="w-3.5 h-3.5 mr-1.5" />
              <span>No File Path</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowConnections(node.id)}
            className="text-xs font-mono w-full"
          >
            <Layers className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            <span>Show Connections</span>
          </Button>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={handleExplain}
          disabled={isExplaining}
          className="text-xs font-mono w-full shadow-lg shadow-purple-900/40"
        >
          {isExplaining ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              <span>Synthesizing Architecture...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-cyan-300" />
              <span>Explain with AI</span>
            </>
          )}
        </Button>
      </div>

    </div>
  );
};
