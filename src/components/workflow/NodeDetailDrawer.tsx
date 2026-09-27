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
  ArrowLeft,
  ShieldCheck,
  Cpu,
  Route,
  Loader2,
  HardDrive,
  Code2,
  Table,
  CheckCircle2,
  Radio
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
  upstreamNodes?: WorkflowNodeItem[];
  downstreamNodes?: WorkflowNodeItem[];
  onSelectNodeById?: (nodeId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  onOpenSource,
  onExplainWithAi,
  onShowConnections,
  upstreamCount = 0,
  downstreamCount = 0,
  upstreamNodes = [],
  downstreamNodes = [],
  onSelectNodeById
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'source' | 'schema' | 'ai'>('overview');
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
      setAiExplanation('Architecture synthesis unavailable at this moment.');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-110 bg-[#070b16]/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl z-40 flex flex-col transition-all duration-300 animate-in slide-in-from-right">

      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800/90 flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase font-bold tracking-wider">
              {data.category}
            </span>
            {data.subType && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 capitalize">
                {data.subType}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
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

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 px-4 bg-[#050812]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2.5 text-xs font-mono border-b-2 transition-all cursor-pointer ${activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('source')}
          className={`px-3 py-2.5 text-xs font-mono border-b-2 transition-all cursor-pointer ${activeTab === 'source'
              ? 'border-cyan-400 text-cyan-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          Source & API
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-2.5 text-xs font-mono border-b-2 transition-all cursor-pointer ${activeTab === 'schema'
              ? 'border-cyan-400 text-cyan-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          Contracts
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3 py-2.5 text-xs font-mono border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'ai'
              ? 'border-purple-400 text-purple-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>AI Analysis</span>
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-slate-800 text-xs font-mono">

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Description */}
            {data.description && (
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Functional Role</span>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {data.description}
                </p>
              </div>
            )}

            {/* Path / Endpoint Display */}
            {(data.endpoint || data.path) && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {data.endpoint ? 'API Endpoint' : 'File Location'}
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-slate-200 truncate font-mono text-[11px]">
                      {data.endpoint || data.path}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPath}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                    title="Copy path to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Ingress / Egress Topology Metrics */}
            <div className="space-y-3">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Topology Connectivity</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3 text-emerald-400" /> Upstream Callers
                  </span>
                  <p className="text-lg font-bold text-white mt-1">{upstreamCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-sky-400" /> Downstream Dependencies
                  </span>
                  <p className="text-lg font-bold text-white mt-1">{downstreamCount}</p>
                </div>
              </div>

              <button
                onClick={() => onShowConnections(node.id)}
                className="w-full py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/40"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Center & Highlight File Connections</span>
              </button>

              {/* Upstream Connected Files List */}
              {upstreamNodes.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-wider">
                      <ArrowLeft className="w-3 h-3" />
                      Incoming Callers ({upstreamNodes.length})
                    </span>
                    <span className="text-slate-500 text-[9px]">Click to trace</span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                    {upstreamNodes.map(upNode => (
                      <div
                        key={upNode.id}
                        onClick={() => onSelectNodeById && onSelectNodeById(upNode.id)}
                        className="p-2 rounded-xl bg-emerald-950/20 hover:bg-emerald-950/50 border border-emerald-900/40 hover:border-emerald-500/60 text-emerald-300 text-[11px] flex items-center justify-between gap-2 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCode className="w-3 h-3 text-emerald-400 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-white group-hover:text-emerald-300 transition-colors block truncate">
                              {upNode.label}
                            </span>
                            <span className="text-[9px] text-slate-500 block truncate font-mono">
                              {upNode.data.path || upNode.data.endpoint || upNode.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 uppercase shrink-0">
                          {upNode.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Downstream Connected Files List */}
              {downstreamNodes.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-sky-400 font-bold uppercase tracking-wider">
                      <ArrowRight className="w-3 h-3" />
                      Outgoing Dependencies ({downstreamNodes.length})
                    </span>
                    <span className="text-slate-500 text-[9px]">Click to trace</span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                    {downstreamNodes.map(downNode => (
                      <div
                        key={downNode.id}
                        onClick={() => onSelectNodeById && onSelectNodeById(downNode.id)}
                        className="p-2 rounded-xl bg-sky-950/20 hover:bg-sky-950/50 border border-sky-900/40 hover:border-sky-500/60 text-sky-300 text-[11px] flex items-center justify-between gap-2 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCode className="w-3 h-3 text-sky-400 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-white group-hover:text-sky-300 transition-colors block truncate">
                              {downNode.label}
                            </span>
                            <span className="text-[9px] text-slate-500 block truncate font-mono">
                              {downNode.data.path || downNode.data.endpoint || downNode.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 uppercase shrink-0">
                          {downNode.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Connected Entities */}
            {data.connectedApis && data.connectedApis.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Associated API Endpoints</span>
                <div className="space-y-1">
                  {data.connectedApis.map((api, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3" />
                      <span>{api}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.databaseRelations && data.databaseRelations.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Database Entities & Tables</span>
                <div className="space-y-1">
                  {data.databaseRelations.map((table, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-blue-400 flex items-center gap-1.5">
                      <Database className="w-3 h-3" />
                      <span>{table}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: SOURCE & API */}
        {activeTab === 'source' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Source Repository Code</span>
                {data.path && (
                  <button
                    onClick={() => onOpenSource(data.path!)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Open Code Viewer</span>
                  </button>
                )}
              </div>
              <p className="text-slate-400 text-xs font-sans">
                Inspect raw syntax, imports, function exports, and type signatures in the integrated code reader.
              </p>
            </div>

            {/* Method & Protocol Info */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Protocol Details</span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Method</span>
                  <span className="text-cyan-400 font-bold">{data.method || 'GET / POST'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Framework</span>
                  <span className="text-slate-300">{data.framework || 'Node.js / Express'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Language</span>
                  <span className="text-slate-300">{data.language || 'TypeScript'}</span>
                </div>
              </div>
            </div>

            {/* Quick cURL snippet */}
            {data.endpoint && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Example cURL Request</span>
                <pre className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
                  {`curl -X ${data.method || 'GET'} \\
  'http://localhost:3000${data.endpoint.replace(/^[A-Z]+\s+/, '')}' \\
  -H 'Content-Type: application/json'`}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SCHEMA & CONTRACTS */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Security & Authorization Contract
              </span>
              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                {data.category === 'auth'
                  ? 'Guarded by session token / Bearer JWT headers. CSRF validated.'
                  : 'Accessible to authenticated internal services with standard project scope.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Data Model Dependencies</span>
              {data.dependencies && data.dependencies.length > 0 ? (
                <div className="space-y-1">
                  {data.dependencies.map((dep, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px] flex items-center justify-between">
                      <span>{dep}</span>
                      <span className="text-slate-500 text-[9px]">dependency</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 text-slate-500 text-xs">
                  No direct external dependencies listed.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AI ANALYSIS */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-2 text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Architectural Intelligence</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Generate an architectural breakdown of this module: data flow, scaling bottlenecks, coupling risks, and interface contracts.
              </p>

              <button
                onClick={handleExplain}
                disabled={isExplaining}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-900/40"
              >
                {isExplaining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Architecture...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 text-cyan-300" />
                    <span>Run Gemini Architecture Audit</span>
                  </>
                )}
              </button>
            </div>

            {aiExplanation && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 animate-in fade-in duration-200">
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">Analysis Synthesis</span>
                <div className="text-xs font-sans text-slate-200 leading-relaxed whitespace-pre-line">
                  {aiExplanation}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
