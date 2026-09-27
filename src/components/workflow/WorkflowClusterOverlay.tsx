import React, { useMemo } from 'react';
import { Node, useViewport } from '@xyflow/react';
import { 
  Layers, 
  Terminal, 
  Server, 
  Database, 
  ShieldCheck, 
  Route, 
  Globe,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { WorkflowCategory } from '../../types/workflow';

interface WorkflowClusterOverlayProps {
  nodes: Node[];
  visible: boolean;
  activeCategory: WorkflowCategory;
  onFocusCategory: (category: WorkflowCategory) => void;
}

interface ClusterMeta {
  category: WorkflowCategory;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  neonBorder: string;
  bgFill: string;
  glowColor: string;
}

const CLUSTERS: Record<string, ClusterMeta> = {
  frontend: {
    category: 'frontend',
    title: 'Client Surface & UI',
    subtitle: 'Pages, Views & Client State',
    icon: Layers,
    color: '#c084fc',
    neonBorder: 'rgba(168, 85, 247, 0.45)',
    bgFill: 'rgba(168, 85, 247, 0.035)',
    glowColor: 'rgba(168, 85, 247, 0.15)'
  },
  api: {
    category: 'api',
    title: 'API Gateway & Ingress',
    subtitle: 'HTTP Endpoints & Routing',
    icon: Terminal,
    color: '#34d399',
    neonBorder: 'rgba(16, 185, 129, 0.45)',
    bgFill: 'rgba(16, 185, 129, 0.035)',
    glowColor: 'rgba(16, 185, 129, 0.15)'
  },
  backend: {
    category: 'backend',
    title: 'Core Logic & Services',
    subtitle: 'Controllers, Services & Logic',
    icon: Server,
    color: '#38bdf8',
    neonBorder: 'rgba(6, 182, 212, 0.45)',
    bgFill: 'rgba(6, 182, 212, 0.035)',
    glowColor: 'rgba(6, 182, 212, 0.15)'
  },
  database: {
    category: 'database',
    title: 'Data Persistence',
    subtitle: 'PostgreSQL Tables & Schemas',
    icon: Database,
    color: '#60a5fa',
    neonBorder: 'rgba(59, 130, 246, 0.45)',
    bgFill: 'rgba(59, 130, 246, 0.035)',
    glowColor: 'rgba(59, 130, 246, 0.15)'
  },
  table: {
    category: 'table',
    title: 'Schema Tables',
    subtitle: 'Entity Models & Indexes',
    icon: Database,
    color: '#818cf8',
    neonBorder: 'rgba(99, 102, 241, 0.45)',
    bgFill: 'rgba(99, 102, 241, 0.035)',
    glowColor: 'rgba(99, 102, 241, 0.15)'
  },
  auth: {
    category: 'auth',
    title: 'Security Boundary',
    subtitle: 'Authentication & Session Guards',
    icon: ShieldCheck,
    color: '#fbbf24',
    neonBorder: 'rgba(245, 158, 11, 0.45)',
    bgFill: 'rgba(245, 158, 11, 0.035)',
    glowColor: 'rgba(245, 158, 11, 0.15)'
  },
  journey: {
    category: 'journey',
    title: 'User Journey Flow',
    subtitle: 'End-to-End Pipeline Steps',
    icon: Route,
    color: '#2dd4bf',
    neonBorder: 'rgba(20, 184, 166, 0.45)',
    bgFill: 'rgba(20, 184, 166, 0.035)',
    glowColor: 'rgba(20, 184, 166, 0.15)'
  },
  external: {
    category: 'external',
    title: 'External Systems',
    subtitle: 'Third-party APIs & Webhooks',
    icon: Globe,
    color: '#fb7185',
    neonBorder: 'rgba(244, 63, 94, 0.45)',
    bgFill: 'rgba(244, 63, 94, 0.035)',
    glowColor: 'rgba(244, 63, 94, 0.15)'
  }
};

export const WorkflowClusterOverlay: React.FC<WorkflowClusterOverlayProps> = ({
  nodes,
  visible,
  activeCategory,
  onFocusCategory
}) => {
  const { x, y, zoom } = useViewport();

  // Compute cluster boundaries from nodes
  const clusters = useMemo(() => {
    if (!visible || !nodes.length) return [];

    // Group nodes by category
    const groups: Record<string, { nodes: Node[]; minX: number; minY: number; maxX: number; maxY: number }> = {};

    const nodeWidth = 270;
    const nodeHeight = 110;
    const padding = 28;
    const topHeaderSpace = 44;

    nodes.forEach(node => {
      const cat = ((node.data as any)?.category || 'frontend').toLowerCase();
      const nodeX = node.position.x;
      const nodeY = node.position.y;

      if (!groups[cat]) {
        groups[cat] = {
          nodes: [],
          minX: nodeX,
          minY: nodeY,
          maxX: nodeX + nodeWidth,
          maxY: nodeY + nodeHeight
        };
      }

      groups[cat].nodes.push(node);
      groups[cat].minX = Math.min(groups[cat].minX, nodeX);
      groups[cat].minY = Math.min(groups[cat].minY, nodeY);
      groups[cat].maxX = Math.max(groups[cat].maxX, nodeX + nodeWidth);
      groups[cat].maxY = Math.max(groups[cat].maxY, nodeY + nodeHeight);
    });

    return Object.entries(groups)
      .filter(([_, group]) => group.nodes.length >= 1)
      .map(([cat, group]) => {
        const meta = CLUSTERS[cat] || CLUSTERS.frontend;
        const bounds = {
          x: group.minX - padding,
          y: group.minY - topHeaderSpace - padding,
          width: group.maxX - group.minX + padding * 2,
          height: group.maxY - group.minY + topHeaderSpace + padding * 2
        };

        return {
          cat,
          meta,
          count: group.nodes.length,
          bounds
        };
      });
  }, [nodes, visible]);

  if (!visible || !clusters.length) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-visible"
      style={{
        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
        transformOrigin: '0 0',
      }}
    >
      <svg className="w-full h-full overflow-visible">
        <defs>
          <filter id="hull-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {clusters.map(({ cat, meta, count, bounds }) => {
          const isSelectedCategory = activeCategory === cat;
          const Icon = meta.icon;

          return (
            <g key={cat} className="transition-all duration-300">
              {/* Hull Ambient Glow Fill */}
              <rect
                x={bounds.x}
                y={bounds.y}
                width={bounds.width}
                height={bounds.height}
                rx="28"
                ry="28"
                fill={meta.bgFill}
                filter="url(#hull-glow)"
                opacity={isSelectedCategory ? 1 : 0.7}
              />

              {/* Hull Neon Perimeter Border */}
              <rect
                x={bounds.x}
                y={bounds.y}
                width={bounds.width}
                height={bounds.height}
                rx="28"
                ry="28"
                fill="none"
                stroke={meta.neonBorder}
                strokeWidth={isSelectedCategory ? 2 : 1.25}
                strokeDasharray={isSelectedCategory ? undefined : '6 4'}
                className="transition-all duration-300"
              />

              {/* Floating Cluster Header Plate */}
              <foreignObject
                x={bounds.x + 18}
                y={bounds.y + 12}
                width={bounds.width - 36}
                height={40}
                className="overflow-visible"
              >
                <div className="flex items-center justify-between text-xs font-mono select-none">
                  {/* Left Label */}
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1 rounded-lg border backdrop-blur-md flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: `${meta.color}15`,
                        borderColor: `${meta.color}40`,
                        color: meta.color
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="font-bold tracking-wider text-[11px] uppercase"
                        style={{ color: meta.color }}
                      >
                        {meta.title}
                      </span>
                      <span className="text-slate-500 text-[10px] hidden sm:inline">
                        · {meta.subtitle}
                      </span>
                    </div>

                    <span
                      className="text-[9px] px-1.5 py-0.2 rounded-full font-bold border"
                      style={{
                        backgroundColor: `${meta.color}18`,
                        borderColor: `${meta.color}35`,
                        color: meta.color
                      }}
                    >
                      {count} {count === 1 ? 'node' : 'nodes'}
                    </span>
                  </div>

                  {/* Right Focus Button */}
                  <button
                    onClick={() => onFocusCategory(meta.category)}
                    className="pointer-events-auto px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition-all flex items-center gap-1 cursor-pointer"
                    title={`Focus on ${meta.title}`}
                  >
                    <Maximize2 className="w-2.5 h-2.5" />
                    <span>Focus</span>
                  </button>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
