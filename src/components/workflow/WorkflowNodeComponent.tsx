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
  Sparkles,
  ArrowRight,
  Code2
} from 'lucide-react';
import { WorkflowNodeData } from '../../types/workflow';

const CATEGORY_THEMES: Record<string, {
  border: string;
  bg: string;
  glow: string;
  badgeBg: string;
  badgeText: string;
  icon: any;
}> = {
  frontend: {
    border: 'border-purple-500/50 hover:border-purple-400',
    bg: 'bg-[#120e24]/90',
    glow: 'shadow-purple-900/30',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    badgeText: 'text-purple-300',
    icon: Layers
  },
  backend: {
    border: 'border-cyan-500/50 hover:border-cyan-400',
    bg: 'bg-[#091a24]/90',
    glow: 'shadow-cyan-900/30',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    badgeText: 'text-cyan-300',
    icon: Server
  },
  api: {
    border: 'border-emerald-500/50 hover:border-emerald-400',
    bg: 'bg-[#092219]/90',
    glow: 'shadow-emerald-900/30',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    badgeText: 'text-emerald-300',
    icon: Terminal
  },
  database: {
    border: 'border-blue-500/50 hover:border-blue-400',
    bg: 'bg-[#0a1728]/90',
    glow: 'shadow-blue-900/30',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    badgeText: 'text-blue-300',
    icon: Database
  },
  table: {
    border: 'border-indigo-500/50 hover:border-indigo-400',
    bg: 'bg-[#0f172a]/90',
    glow: 'shadow-indigo-900/30',
    badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    badgeText: 'text-indigo-300',
    icon: HardDrive
  },
  auth: {
    border: 'border-amber-500/50 hover:border-amber-400',
    bg: 'bg-[#211807]/90',
    glow: 'shadow-amber-900/30',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    badgeText: 'text-amber-300',
    icon: ShieldCheck
  },
  journey: {
    border: 'border-teal-500/50 hover:border-teal-400',
    bg: 'bg-[#081f20]/90',
    glow: 'shadow-teal-900/30',
    badgeBg: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    badgeText: 'text-teal-300',
    icon: Route
  },
  external: {
    border: 'border-rose-500/50 hover:border-rose-400',
    bg: 'bg-[#240e16]/90',
    glow: 'shadow-rose-900/30',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    badgeText: 'text-rose-300',
    icon: Globe
  }
};

export const WorkflowNodeComponent: React.FC<NodeProps> = memo(({ data, selected }) => {
  const nodeData = data as unknown as WorkflowNodeData;
  const category = (nodeData.category || 'frontend').toLowerCase();
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.frontend;
  const Icon = theme.icon;

  const isDimmed = nodeData.isDimmed;
  const isHighlighted = nodeData.isHighlighted || selected;

  return (
    <div
      className={`relative group w-64 rounded-2xl border backdrop-blur-xl transition-all duration-200 select-none ${
        theme.bg
      } ${
        isHighlighted
          ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl shadow-cyan-500/20 scale-[1.03] z-20'
          : theme.border
      } ${
        isDimmed ? 'opacity-25 grayscale-[30%] pointer-events-auto' : 'opacity-100 shadow-lg ' + theme.glow
      }`}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-slate-900 !-left-1.5 transition-transform group-hover:scale-125"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-purple-400 !border-2 !border-slate-900 !-right-1.5 transition-transform group-hover:scale-125"
      />

      <div className="p-3 space-y-2">
        {/* Top Header: Category & Subtype Badge */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className={`p-1 rounded-lg border ${theme.badgeBg}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${theme.badgeText}`}>
              {nodeData.category}
            </span>
          </div>

          {nodeData.subType && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 capitalize">
              {nodeData.subType}
            </span>
          )}
        </div>

        {/* Node Label / Name */}
        <div>
          <h4
            className="text-xs font-semibold text-white tracking-wide truncate group-hover:text-cyan-300 transition-colors"
            title={nodeData.label}
          >
            {nodeData.label}
          </h4>

          {/* Path or Endpoint subtitle */}
          {(nodeData.path || nodeData.endpoint) && (
            <p
              className="text-[10px] font-mono text-slate-400 truncate mt-0.5 flex items-center gap-1"
              title={nodeData.path || nodeData.endpoint}
            >
              <FileCode className="w-2.5 h-2.5 shrink-0 text-slate-500" />
              <span className="truncate">{nodeData.endpoint || nodeData.path}</span>
            </p>
          )}
        </div>

        {/* Node Description Snippet */}
        {nodeData.description && (
          <p className="text-[10px] text-slate-400 line-clamp-1 leading-snug">
            {nodeData.description}
          </p>
        )}

        {/* Card Footer Indicators */}
        <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            {nodeData.language && (
              <span className="text-slate-400">{nodeData.language}</span>
            )}
            {nodeData.framework && (
              <span className="text-cyan-400/90">{nodeData.framework}</span>
            )}
          </div>

          <span className="text-slate-500 group-hover:text-cyan-300 transition-colors flex items-center gap-0.5">
            Details <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    </div>
  );
});

WorkflowNodeComponent.displayName = 'WorkflowNodeComponent';
