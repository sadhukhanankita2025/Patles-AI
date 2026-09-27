import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Layers, 
  Server, 
  Terminal, 
  Database, 
  HardDrive, 
  ShieldCheck, 
  Globe, 
  Route, 
  FileCode, 
  ArrowRight,
  ArrowLeft,
  ArrowRightLeft,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Activity,
  GitBranch,
  Network
} from 'lucide-react';
import { WorkflowNodeData } from '../../types/workflow';

interface CategoryTheme {
  border: string;
  glow: string;
  accent: string;
  bgGradient: string;
  iconBg: string;
  iconColor: string;
  tagColor: string;
  icon: any;
}

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  frontend: {
    border: 'border-purple-500/40 hover:border-purple-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.18)]',
    accent: '#c084fc',
    bgGradient: 'from-[#140f28]/95 via-[#0e0c1f]/95 to-[#090b14]/95',
    iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    iconColor: 'text-purple-300',
    tagColor: 'text-purple-300',
    icon: Layers
  },
  backend: {
    border: 'border-cyan-500/40 hover:border-cyan-400',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.18)]',
    accent: '#38bdf8',
    bgGradient: 'from-[#081a26]/95 via-[#091522]/95 to-[#070d18]/95',
    iconBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    iconColor: 'text-cyan-300',
    tagColor: 'text-cyan-300',
    icon: Server
  },
  api: {
    border: 'border-emerald-500/40 hover:border-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.18)]',
    accent: '#34d399',
    bgGradient: 'from-[#072118]/95 via-[#081c16]/95 to-[#061011]/95',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    iconColor: 'text-emerald-300',
    tagColor: 'text-emerald-300',
    icon: Terminal
  },
  database: {
    border: 'border-blue-500/40 hover:border-blue-400',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.18)]',
    accent: '#60a5fa',
    bgGradient: 'from-[#0a182c]/95 via-[#0a1424]/95 to-[#060c18]/95',
    iconBg: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
    iconColor: 'text-blue-300',
    tagColor: 'text-blue-300',
    icon: Database
  },
  table: {
    border: 'border-indigo-500/40 hover:border-indigo-400',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.18)]',
    accent: '#818cf8',
    bgGradient: 'from-[#10142e]/95 via-[#0c1024]/95 to-[#070a16]/95',
    iconBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
    iconColor: 'text-indigo-300',
    tagColor: 'text-indigo-300',
    icon: HardDrive
  },
  auth: {
    border: 'border-amber-500/40 hover:border-amber-400',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.18)]',
    accent: '#fbbf24',
    bgGradient: 'from-[#241a08]/95 via-[#1a1408]/95 to-[#0f0e08]/95',
    iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    iconColor: 'text-amber-300',
    tagColor: 'text-amber-300',
    icon: ShieldCheck
  },
  journey: {
    border: 'border-teal-500/40 hover:border-teal-400',
    glow: 'shadow-[0_0_20px_rgba(20,184,166,0.18)]',
    accent: '#2dd4bf',
    bgGradient: 'from-[#071f1e]/95 via-[#081817]/95 to-[#061011]/95',
    iconBg: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
    iconColor: 'text-teal-300',
    tagColor: 'text-teal-300',
    icon: Route
  },
  external: {
    border: 'border-rose-500/40 hover:border-rose-400',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.18)]',
    accent: '#fb7185',
    bgGradient: 'from-[#240e16]/95 via-[#1a0c12]/95 to-[#10080c]/95',
    iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    iconColor: 'text-rose-300',
    tagColor: 'text-rose-300',
    icon: Globe
  }
};

const METHOD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  GET: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  POST: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  PUT: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  DELETE: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  PATCH: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
};

export const WorkflowNodeComponent: React.FC<NodeProps> = memo(({ data, selected }) => {
  const nodeData = data as unknown as (WorkflowNodeData & { layoutDirection?: 'LR' | 'TB' });
  const category = (nodeData.category || 'frontend').toLowerCase();
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.frontend;
  const Icon = theme.icon;

  const isDimmed = nodeData.isDimmed;
  const isHighlighted = nodeData.isHighlighted || selected;
  const isTB = nodeData.layoutDirection === 'TB';
  const role = nodeData.connectionRole;

  // Detect HTTP method
  const methodMatch = (nodeData.method || nodeData.endpoint?.split(' ')[0] || '').toUpperCase();
  const methodStyle = METHOD_COLORS[methodMatch];

  // Specific connection styling based on role
  let roleBorderClass = `${theme.border} ${theme.glow}`;
  if (role === 'focus' || selected) {
    roleBorderClass = 'border-cyan-400 ring-2 sm:ring-4 ring-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.45)] scale-[1.04] z-30';
  } else if (role === 'inbound') {
    roleBorderClass = 'border-emerald-400 ring-2 ring-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.38)] scale-[1.02] z-20';
  } else if (role === 'outbound') {
    roleBorderClass = 'border-sky-400 ring-2 ring-sky-500/80 shadow-[0_0_30px_rgba(56,189,248,0.38)] scale-[1.02] z-20';
  } else if (isHighlighted) {
    roleBorderClass = 'border-cyan-400 ring-2 ring-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.35)] scale-[1.03] z-20';
  }

  return (
    <div
      className={`relative group w-[275px] rounded-2xl border backdrop-blur-2xl transition-all duration-300 select-none bg-gradient-to-b ${
        theme.bgGradient
      } ${roleBorderClass} ${
        isDimmed
          ? 'opacity-15 grayscale-[55%] filter blur-[0.2px] hover:opacity-100 hover:grayscale-0 hover:blur-none pointer-events-auto shadow-none'
          : 'opacity-100 hover:shadow-2xl hover:scale-[1.02]'
      }`}
    >
      {/* Top Edge Ambient Glow Line */}
      <div 
        className="absolute -top-px inset-x-4 h-[2px] rounded-full transition-opacity duration-300 opacity-60 group-hover:opacity-100"
        style={{
          background: role === 'inbound' 
            ? 'linear-gradient(90deg, transparent, #10b981, transparent)'
            : role === 'outbound'
            ? 'linear-gradient(90deg, transparent, #38bdf8, transparent)'
            : `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`
        }}
      />

      {/* Floating Role Badge when file connection is active */}
      {role && (
        <div className="absolute -top-3 left-4 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase shadow-xl flex items-center gap-1 z-30 pointer-events-none animate-in fade-in zoom-in-90 duration-200">
          {role === 'focus' ? (
            <span className="bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full shadow-[0_0_12px_#06b6d4] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
              Target File Focus
            </span>
          ) : role === 'inbound' ? (
            <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full shadow-[0_0_12px_#10b981] flex items-center gap-1">
              <ArrowLeft className="w-2.5 h-2.5" />
              Incoming Caller
            </span>
          ) : role === 'outbound' ? (
            <span className="bg-sky-500 text-slate-950 px-2 py-0.5 rounded-full shadow-[0_0_12px_#38bdf8] flex items-center gap-1">
              Outbound Dep
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          ) : null}
        </div>
      )}

      {/* Input Handle (Target / Inbound) */}
      <Handle
        type="target"
        position={isTB ? Position.Top : Position.Left}
        className={`!w-3 !h-3 !border-2 !border-[#060a12] transition-transform duration-200 group-hover:scale-125 ${
          isTB ? '!-top-1.5' : '!-left-1.5'
        } ${role === 'inbound' ? '!ring-2 !ring-emerald-400' : ''}`}
        style={{ backgroundColor: role === 'inbound' ? '#10b981' : theme.accent }}
      />

      {/* Output Handle (Source / Outbound) */}
      <Handle
        type="source"
        position={isTB ? Position.Bottom : Position.Right}
        className={`!w-3 !h-3 !border-2 !border-[#060a12] transition-transform duration-200 group-hover:scale-125 ${
          isTB ? '!-bottom-1.5' : '!-right-1.5'
        } ${role === 'outbound' ? '!ring-2 !ring-cyan-400' : ''}`}
        style={{ backgroundColor: role === 'outbound' ? '#38bdf8' : theme.accent }}
      />

      <div className="p-3.5 space-y-2.5">
        
        {/* Top Header: Category, SubType/Method, and Status Beacon */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-1 rounded-lg border backdrop-blur-md shrink-0 ${theme.iconBg}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span
              className="text-[10px] font-mono uppercase font-bold tracking-wider truncate"
              style={{ color: theme.accent }}
            >
              {nodeData.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Method pill if available */}
            {methodStyle ? (
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${methodStyle.bg} ${methodStyle.text} ${methodStyle.border}`}>
                {methodMatch}
              </span>
            ) : nodeData.subType ? (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900/90 text-slate-300 border border-slate-700/70 capitalize">
                {nodeData.subType}
              </span>
            ) : null}

            {/* Live Status Beacon */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            </span>
          </div>
        </div>

        {/* Node Name & Path */}
        <div className="space-y-1">
          <h4
            className="text-xs font-semibold text-white tracking-wide truncate group-hover:text-cyan-300 transition-colors"
            title={nodeData.label}
          >
            {nodeData.label}
          </h4>

          {/* Monospace Path or Endpoint */}
          {(nodeData.path || nodeData.endpoint) && (
            <div
              className={`text-[10px] font-mono truncate flex items-center justify-between gap-1.5 px-2 py-1 rounded-lg border transition-colors ${
                role === 'focus'
                  ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
                  : 'bg-black/40 border-slate-800/80 text-slate-400 group-hover:border-slate-700'
              }`}
              title={nodeData.endpoint || nodeData.path}
            >
              <div className="flex items-center gap-1.5 truncate">
                <FileCode className="w-2.5 h-2.5 shrink-0 text-slate-500" />
                <span className="truncate text-slate-300 font-mono">
                  {nodeData.endpoint || nodeData.path}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Connection Counts Row: Incoming vs Outgoing */}
        {(nodeData.inboundCount !== undefined || nodeData.outboundCount !== undefined) && (
          <div className="flex items-center justify-between text-[9px] font-mono px-2 py-1 rounded-lg bg-[#070b14]/70 border border-slate-800/80 text-slate-400">
            <span 
              className={`flex items-center gap-1 transition-colors ${
                role === 'inbound' ? 'text-emerald-300 font-bold' : 'hover:text-emerald-400'
              }`}
              title="Incoming callers (files that import or call this file)"
            >
              <ArrowLeft className="w-2.5 h-2.5 text-emerald-400" />
              <span>{nodeData.inboundCount ?? 0} In</span>
            </span>

            <span className="text-slate-700">·</span>

            <span 
              className="flex items-center gap-1 text-slate-500"
              title="File connection topology"
            >
              <Network className="w-2.5 h-2.5 text-slate-500" />
              <span>{(nodeData.inboundCount ?? 0) + (nodeData.outboundCount ?? 0)} linked</span>
            </span>

            <span className="text-slate-700">·</span>

            <span 
              className={`flex items-center gap-1 transition-colors ${
                role === 'outbound' ? 'text-sky-300 font-bold' : 'hover:text-sky-400'
              }`}
              title="Outbound dependencies (files this file calls or imports)"
            >
              <span>{nodeData.outboundCount ?? 0} Out</span>
              <ArrowRight className="w-2.5 h-2.5 text-sky-400" />
            </span>
          </div>
        )}

        {/* Footer: Tech Stack & Details Hint */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            {nodeData.framework ? (
              <span className="text-cyan-400/90 truncate">{nodeData.framework}</span>
            ) : nodeData.language ? (
              <span className="text-slate-400 truncate">{nodeData.language}</span>
            ) : (
              <span className="text-slate-500">Node</span>
            )}
          </div>

          <span className="text-slate-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1 shrink-0 font-medium">
            <span>Inspect</span>
            <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

      </div>
    </div>
  );
});

WorkflowNodeComponent.displayName = 'WorkflowNodeComponent';
