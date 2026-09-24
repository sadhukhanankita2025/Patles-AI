import React, { useState } from 'react';
import { Layers, ArrowRight, ShieldCheck, Zap, Server, Database, Globe, Cpu } from 'lucide-react';
import { ArchitectureNode } from '../../types/github';

interface ArchitectureGraphProps {
  pattern?: string;
  description?: string;
  nodes: ArchitectureNode[];
}

export const ArchitectureGraph: React.FC<ArchitectureGraphProps> = ({
  pattern = 'Multi-Tier Distributed Application',
  description,
  nodes = []
}) => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(nodes[0] || null);

  const getNodeIcon = (category: string) => {
    switch (category) {
      case 'client':
        return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'gateway':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'service':
        return <Server className="w-5 h-5 text-purple-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      default:
        return <Cpu className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Architecture Pattern: {pattern}</span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Repository Architecture Visualizer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {description || 'Interactive topology generated from repository dependency and AST analysis'}
          </p>
        </div>

        <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/60">
          {nodes.length} Architectural Tiers
        </span>
      </div>

      {/* Visual Pipeline Layout */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-4 py-4">
          
          {/* User ingress */}
          <div className="flex flex-col items-center text-center space-y-2 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-white shadow-lg">
              <Globe className="w-6 h-6 text-slate-300" />
            </div>
            <span className="text-xs font-bold text-white font-mono">User Traffic</span>
            <span className="text-[10px] text-slate-500 font-mono">HTTPS / WSS</span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

          {/* Scanned Nodes */}
          {nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center space-y-2 min-w-[150px] shrink-0 ${
                    isSelected
                      ? 'bg-purple-950/50 border-purple-500 shadow-lg shadow-purple-900/40 scale-105'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {getNodeIcon(node.category)}
                  </div>
                  <span className="text-xs font-bold text-white font-mono truncate max-w-[130px]">
                    {node.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono truncate max-w-[130px]">
                    {node.tech}
                  </span>
                  {node.latency && (
                    <span className="text-[9px] text-emerald-400 font-mono">
                      {node.latency}
                    </span>
                  )}
                </div>

                {index < nodes.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">{selectedNode.name}</span>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                {selectedNode.category}
              </span>
            </div>
            <span className="text-slate-400">Node Ingress: {selectedNode.latency || '< 10ms'}</span>
          </div>

          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {selectedNode.description}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">TECHNOLOGY STACK</span>
              <span className="text-cyan-300 font-semibold">{selectedNode.tech}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">SECURITY BOUNDARY</span>
              <span className="text-emerald-400 font-semibold">TLS 1.3 / Zero-Trust Mesh</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
