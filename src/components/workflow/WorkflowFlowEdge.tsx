import React, { memo } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from '@xyflow/react';

export interface WorkflowEdgeData {
  label?: string;
  sourceCategory?: string;
  targetCategory?: string;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  isSimulating?: boolean;
  simulationActive?: boolean;
  method?: string;
  protocol?: string;
  flowSpeed?: number;
  connectionType?: 'inbound' | 'outbound' | 'normal';
  sourceName?: string;
  targetName?: string;
  sourcePath?: string;
  targetPath?: string;
  isHovered?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#a855f7', // purple/violet
  backend: '#06b6d4',  // cyan
  api: '#10b981',      // emerald
  database: '#3b82f6', // blue
  table: '#6366f1',    // indigo
  auth: '#f59e0b',     // amber
  journey: '#14b8a6',  // teal
  external: '#f43f5e'  // rose
};

export const WorkflowFlowEdge: React.FC<EdgeProps> = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected
}) => {
  const edgeData = (data || {}) as WorkflowEdgeData;
  const isHighlighted = edgeData.isHighlighted || selected || edgeData.isHovered;
  const isDimmed = edgeData.isDimmed;
  const isSimulating = edgeData.isSimulating || edgeData.simulationActive;
  const connectionType = edgeData.connectionType || 'normal';

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Determine colors based on connection direction
  const sourceCat = (edgeData.sourceCategory || 'frontend').toLowerCase();
  const targetCat = (edgeData.targetCategory || 'backend').toLowerCase();
  const baseColor = CATEGORY_COLORS[sourceCat] || '#06b6d4';
  const targetColor = CATEGORY_COLORS[targetCat] || '#38bdf8';

  // Inbound connections to focused file = emerald (#10b981)
  // Outbound connections from focused file = electric cyan (#38bdf8)
  const connectionHighlightColor = 
    connectionType === 'inbound' ? '#10b981' : 
    connectionType === 'outbound' ? '#38bdf8' : 
    '#38bdf8';

  const strokeColor = isHighlighted
    ? connectionHighlightColor
    : isSimulating
    ? '#10b981'
    : isDimmed
    ? '#1a2333'
    : baseColor;

  const gradientId = `edge-grad-${id.replace(/[^a-zA-Z0-9]/g, '_')}`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop 
            offset="0%" 
            stopColor={isHighlighted ? connectionHighlightColor : baseColor} 
            stopOpacity={isDimmed ? 0.15 : isHighlighted ? 1 : 0.85} 
          />
          <stop 
            offset="100%" 
            stopColor={isHighlighted ? (connectionType === 'inbound' ? '#34d399' : '#818cf8') : targetColor} 
            stopOpacity={isDimmed ? 0.15 : isHighlighted ? 1 : 0.85} 
          />
        </linearGradient>
      </defs>

      {/* Ambient Glow path for highlighted or normal state */}
      {!isDimmed && (
        <path
          d={edgePath}
          fill="none"
          stroke={isHighlighted ? connectionHighlightColor : strokeColor}
          strokeWidth={isHighlighted ? (edgeData.isHovered ? 9 : 6) : 3.5}
          strokeOpacity={isHighlighted ? 0.45 : 0.12}
          className="transition-all duration-300 pointer-events-none"
        />
      )}

      {/* Primary Edge stroke */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={isDimmed ? '#1e293b' : isHighlighted ? connectionHighlightColor : `url(#${gradientId})`}
        strokeWidth={isHighlighted ? 2.8 : isSimulating ? 2 : 1.5}
        strokeDasharray={isDimmed ? '4,4' : undefined}
        strokeOpacity={isDimmed ? 0.2 : 0.95}
        className="transition-all duration-200"
        style={style}
      />

      {/* Moving Signal Packet (SVG Native animateMotion) */}
      {(!isDimmed || isHighlighted) && (
        <g className="pointer-events-none">
          {/* Main glowing packet */}
          <circle
            r={isHighlighted ? 4 : isSimulating ? 4 : 2.5}
            fill={
              isSimulating 
                ? '#34d399' 
                : isHighlighted 
                ? (connectionType === 'inbound' ? '#34d399' : '#38bdf8') 
                : '#e0e7ff'
            }
            className={
              isHighlighted 
                ? connectionType === 'inbound'
                  ? 'filter drop-shadow-[0_0_8px_#10b981]'
                  : 'filter drop-shadow-[0_0_8px_#38bdf8]'
                : 'filter drop-shadow-[0_0_4px_#38bdf8]'
            }
          >
            <animateMotion
              dur={isHighlighted ? '1.4s' : isSimulating ? '1.5s' : '3s'}
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>

          {/* Secondary trailing particle for fluid visual flow */}
          <circle
            r={isHighlighted ? 2.5 : 1.5}
            fill={isHighlighted ? (connectionType === 'inbound' ? '#10b981' : '#818cf8') : targetColor}
            opacity="0.75"
          >
            <animateMotion
              dur={isHighlighted ? '1.4s' : isSimulating ? '1.5s' : '3s'}
              begin="0.25s"
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
        </g>
      )}

      {/* Edge Label (HTTP Method / Connection Type / Contract description) */}
      {(edgeData.label || isHighlighted) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={`px-2 py-0.5 rounded-lg text-[9px] font-mono tracking-wider transition-all select-none shadow-xl flex items-center gap-1.5 ${
              isHighlighted
                ? connectionType === 'inbound'
                  ? 'bg-emerald-950/95 text-emerald-300 border border-emerald-500/70 shadow-emerald-900/50 font-bold scale-105 ring-1 ring-emerald-400/40'
                  : 'bg-cyan-950/95 text-cyan-300 border border-cyan-500/70 shadow-cyan-900/50 font-bold scale-105 ring-1 ring-cyan-400/40'
                : isDimmed
                ? 'bg-[#060a12]/80 text-slate-600 border border-slate-900'
                : 'bg-[#0b101e]/90 text-slate-400 border border-slate-800/80 hover:text-white hover:border-slate-700'
            }`}
          >
            {isHighlighted && (
              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
                connectionType === 'inbound' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`} />
            )}
            <span>
              {edgeData.label || (connectionType === 'inbound' ? 'Inbound Call' : 'Outbound Dep')}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

WorkflowFlowEdge.displayName = 'WorkflowFlowEdge';
