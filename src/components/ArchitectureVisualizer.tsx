import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Database, 
  Cpu, 
  ArrowRight, 
  Copy, 
  Check, 
  Server, 
  Monitor, 
  Workflow, 
  Radio, 
  ExternalLink,
  Code
} from 'lucide-react';
import { ArchitectureData, ArchitectureNode } from '../types';

interface ArchitectureVisualizerProps {
  architecture: ArchitectureData;
  projectName: string;
}

export const ArchitectureVisualizer: React.FC<ArchitectureVisualizerProps> = ({
  architecture,
  projectName
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'visual' | 'flow' | 'mermaid' | 'security'>('visual');
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(
    architecture.nodes?.[0] || null
  );
  const [copiedMermaid, setCopiedMermaid] = useState(false);

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(architecture.mermaidDiagram);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  const getCategoryBadge = (category: ArchitectureNode['category']) => {
    switch (category) {
      case 'client':
        return { color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300', icon: Monitor };
      case 'gateway':
        return { color: 'border-blue-500/40 bg-blue-950/30 text-blue-300', icon: ShieldCheck };
      case 'service':
        return { color: 'border-purple-500/40 bg-purple-950/30 text-purple-300', icon: Server };
      case 'cache':
        return { color: 'border-amber-500/40 bg-amber-950/30 text-amber-300', icon: Zap };
      case 'queue':
        return { color: 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300', icon: Workflow };
      case 'ai':
        return { color: 'border-fuchsia-500/40 bg-fuchsia-950/30 text-fuchsia-300', icon: Cpu };
      case 'database':
        return { color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300', icon: Database };
      default:
        return { color: 'border-slate-500/40 bg-slate-900 text-slate-300', icon: Layers };
    }
  };

  return (
    <div className="space-y-4">
      {/* Visualizer Header with Pattern Title & Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0F172A] border border-slate-800">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Architecture Blueprint</span>
          </div>
          <h3 className="text-sm font-bold text-white mt-0.5">{architecture.pattern}</h3>
        </div>

        {/* Sub-Tabs: Visual Map, Sequence Flow, Mermaid, Security Matrix */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('visual')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              activeSubTab === 'visual' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visual Graph
          </button>
          <button
            onClick={() => setActiveSubTab('flow')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              activeSubTab === 'flow' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Pipeline
          </button>
          <button
            onClick={() => setActiveSubTab('mermaid')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              activeSubTab === 'mermaid' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mermaid
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              activeSubTab === 'security' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Security & Scale
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: VISUAL ARCHITECTURE GRAPH */}
      {activeSubTab === 'visual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Nodes Interactive Grid (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Interactive System Nodes (Click node to inspect):</span>
              <span className="text-cyan-400">{architecture.nodes?.length || 0} Tier Nodes</span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {architecture.nodes?.map((node, index) => {
                const badge = getCategoryBadge(node.category);
                const IconComponent = badge.icon;
                const isSelected = selectedNode?.id === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-purple-500/80 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/40'
                        : 'bg-[#0B1120] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${badge.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{node.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {node.tech}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {node.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-emerald-400 block">{node.latency || '<10ms'}</span>
                        <span className="text-[10px] text-slate-500 font-mono capitalize">{node.category}</span>
                      </div>
                    </div>

                    {/* Connecting arrows indicator */}
                    {node.connections && node.connections.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>Connected to:</span>
                        <span className="text-cyan-300 truncate">
                          {node.connections.map(c => c.replace('node-', '')).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Inspector Panel (5 Cols) */}
          <div className="lg:col-span-5">
            {selectedNode ? (
              <div className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4 text-xs font-sans">
                <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="font-bold text-white uppercase font-mono text-[11px]">Node Inspector</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">
                    {selectedNode.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{selectedNode.name}</h4>
                  <div className="text-xs font-mono text-cyan-400 mt-0.5">{selectedNode.tech}</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Target Latency:</span>
                    <span className="text-emerald-400 font-bold">{selectedNode.latency || '<10ms'}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Security Barrier:</span>
                    <span className="text-purple-300 truncate max-w-[160px]">{selectedNode.security || 'Encrypted / TLS'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-[11px] font-mono text-slate-400 mb-1.5">Downstream Service Links:</div>
                  <div className="space-y-1 font-mono text-[11px]">
                    {selectedNode.connections && selectedNode.connections.length > 0 ? (
                      selectedNode.connections.map(conn => (
                        <div key={conn} className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>{conn}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic">Terminal storage node (no downstream hops)</div>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[11px] text-slate-300 leading-snug">
                  🛡️ Zero-trust mTLS encryption enforced across all internal network hops.
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                Select an architecture node from the left to inspect configuration and security parameters.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Sub-Tab 2: DATA PIPELINE SEQUENCE */}
      {activeSubTab === 'flow' && (
        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase font-mono">End-to-End Ingress & Data Lifecycle Flow</span>
            <span className="text-[11px] font-mono text-cyan-400">Deterministic Execution</span>
          </div>

          <div className="space-y-2.5">
            {architecture.dataFlowSteps?.map((step, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3 text-xs"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {idx + 1}
                </div>
                <div className="text-slate-200 leading-relaxed font-sans pt-0.5">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: MERMAID DIAGRAM */}
      {activeSubTab === 'mermaid' && (
        <div className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mermaid.js Flowchart Definition</span>
            </div>
            <button
              onClick={handleCopyMermaid}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
            >
              {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMermaid ? 'Copied' : 'Copy Mermaid'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
            <code>{architecture.mermaidDiagram}</code>
          </pre>
          <p className="text-[11px] text-slate-500 font-mono">
            Directly renderable in GitHub Markdown, Notion, Obsidian, and Mermaid Live Editor.
          </p>
        </div>
      )}

      {/* Sub-Tab 4: SECURITY & SCALE MATRIX */}
      {activeSubTab === 'security' && (
        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase font-mono">Scalability & Zero-Trust Protocol</span>
            <span className="text-[11px] font-mono text-emerald-400">Enterprise Hardened</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Scalability Characteristics</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {architecture.scalabilitySummary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Security Protocol</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {architecture.securityProtocol}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-400 space-y-1.5">
            <div className="flex justify-between">
              <span>Ingress Protection:</span>
              <span className="text-slate-200">Cloudflare DDoS + WAF Layer 7</span>
            </div>
            <div className="flex justify-between">
              <span>Token Encryption:</span>
              <span className="text-slate-200">Ed25519 Asymmetric Signatures</span>
            </div>
            <div className="flex justify-between">
              <span>Database Access:</span>
              <span className="text-slate-200">PostgreSQL Row-Level Security (RLS)</span>
            </div>
            <div className="flex justify-between">
              <span>Compliance Baseline:</span>
              <span className="text-emerald-400">SOC2 Type II & GDPR Ready</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
