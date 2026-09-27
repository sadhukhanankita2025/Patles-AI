import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  FileCode, 
  ArrowLeft, 
  ArrowRight, 
  Network, 
  Terminal, 
  Server, 
  Layers, 
  Database, 
  ShieldCheck, 
  Route, 
  Globe,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { WorkflowNodeItem, WorkflowEdgeItem } from '../../types/workflow';

interface FileConnectionSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: WorkflowNodeItem[];
  edges: WorkflowEdgeItem[];
  onSelectNode: (node: WorkflowNodeItem) => void;
  selectedNodeId?: string | null;
}

export const FileConnectionSearchModal: React.FC<FileConnectionSearchModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  onSelectNode,
  selectedNodeId
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'total' | 'inbound' | 'outbound' | 'name'>('total');

  // Compute connections map for all nodes
  const connectionStats = useMemo(() => {
    const inboundMap = new Map<string, number>();
    const outboundMap = new Map<string, number>();

    nodes.forEach(n => {
      inboundMap.set(n.id, 0);
      outboundMap.set(n.id, 0);
    });

    edges.forEach(e => {
      if (outboundMap.has(e.source)) {
        outboundMap.set(e.source, (outboundMap.get(e.source) || 0) + 1);
      }
      if (inboundMap.has(e.target)) {
        inboundMap.set(e.target, (inboundMap.get(e.target) || 0) + 1);
      }
    });

    return { inboundMap, outboundMap };
  }, [nodes, edges]);

  // Filter and sort nodes
  const filteredNodes = useMemo(() => {
    return nodes
      .filter(n => {
        // Filter by category
        if (categoryFilter !== 'all' && n.category !== categoryFilter) {
          return false;
        }

        // Filter by query
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          n.label.toLowerCase().includes(q) ||
          n.data.path?.toLowerCase().includes(q) ||
          n.data.endpoint?.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.data.framework?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const aIn = connectionStats.inboundMap.get(a.id) || 0;
        const aOut = connectionStats.outboundMap.get(a.id) || 0;
        const aTotal = aIn + aOut;

        const bIn = connectionStats.inboundMap.get(b.id) || 0;
        const bOut = connectionStats.outboundMap.get(b.id) || 0;
        const bTotal = bIn + bOut;

        if (sortBy === 'total') return bTotal - aTotal;
        if (sortBy === 'inbound') return bIn - aIn;
        if (sortBy === 'outbound') return bOut - aOut;
        return a.label.localeCompare(b.label);
      });
  }, [nodes, query, categoryFilter, sortBy, connectionStats]);

  if (!isOpen) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'frontend': return <Layers className="w-3.5 h-3.5 text-purple-400" />;
      case 'backend': return <Server className="w-3.5 h-3.5 text-cyan-400" />;
      case 'api': return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
      case 'database':
      case 'table': return <Database className="w-3.5 h-3.5 text-blue-400" />;
      case 'auth': return <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />;
      case 'journey': return <Route className="w-3.5 h-3.5 text-teal-400" />;
      default: return <Globe className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#070b16] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/40 flex flex-col max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#0a0f20]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Trace File Connections</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {nodes.length} Files Mapped
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Select any file to immediately spotlight its upstream callers & downstream dependencies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-800/80 space-y-3 bg-[#080d1c]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by file path, component name, route, schema..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters & Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
            {/* Category pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(['all', 'frontend', 'backend', 'api', 'database', 'auth'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-cyan-600 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-slate-400 ml-auto">
              <SlidersHorizontal className="w-3 h-3 text-slate-500" />
              <span className="text-[10px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5 text-white text-[11px] focus:outline-none cursor-pointer"
              >
                <option value="total">Most Connected</option>
                <option value="inbound">Most Inbound Callers</option>
                <option value="outbound">Most Outbound Deps</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
          {filteredNodes.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500 space-y-2">
              <Network className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
              <p>No files match your query "{query}"</p>
            </div>
          ) : (
            filteredNodes.map(node => {
              const inCount = connectionStats.inboundMap.get(node.id) || 0;
              const outCount = connectionStats.outboundMap.get(node.id) || 0;
              const totalCount = inCount + outCount;
              const isSelected = selectedNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    onSelectNode(node);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                      : 'bg-[#090e1c] border-slate-800/80 hover:border-cyan-500/50 hover:bg-[#0c1428]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                      {getCategoryIcon(node.category)}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors truncate">
                          {node.label}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 uppercase shrink-0">
                          {node.category}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400 truncate flex items-center gap-1.5">
                        <FileCode className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{node.data.path || node.data.endpoint || 'Internal Module'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Connection Stats Badges */}
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                    <span 
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/80"
                      title={`${inCount} incoming callers`}
                    >
                      <ArrowLeft className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{inCount} in</span>
                    </span>

                    <span 
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-950/80 text-sky-300 border border-sky-800/80"
                      title={`${outCount} outgoing dependencies`}
                    >
                      <span>{outCount} out</span>
                      <ArrowRight className="w-2.5 h-2.5 text-sky-400" />
                    </span>

                    <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 font-bold hidden sm:inline">
                      {totalCount} total
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-slate-800 bg-[#070b16] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Click any file to focus and trace connections</span>
          <span className="text-slate-600">Esc to close</span>
        </div>
      </div>
    </div>
  );
};
