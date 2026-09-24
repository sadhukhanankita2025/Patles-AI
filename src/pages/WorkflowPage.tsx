import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  useReactFlow, 
  ReactFlowProvider,
  MarkerType,
  Edge,
  Node,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { WorkflowHeader } from '../components/workflow/WorkflowHeader';
import { WorkflowToolbar } from '../components/workflow/WorkflowToolbar';
import { WorkflowNodeComponent } from '../components/workflow/WorkflowNodeComponent';
import { NodeDetailDrawer } from '../components/workflow/NodeDetailDrawer';
import { SourceViewerModal } from '../components/workflow/SourceViewerModal';
import { 
  WorkflowNodeItem, 
  WorkflowEdgeItem, 
  WorkflowGraphResponse, 
  WorkflowCategory 
} from '../types/workflow';
import { Loader2, AlertCircle, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { PageView } from '../types';

const nodeTypes = {
  workflowNode: WorkflowNodeComponent
};

interface WorkflowPageProps {
  repositoryId?: string;
  onNavigate?: (page: PageView) => void;
  onBackToRepo?: () => void;
}

const WorkflowCanvasInner: React.FC<WorkflowPageProps> = ({
  repositoryId,
  onNavigate,
  onBackToRepo
}) => {
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();

  const [graphData, setGraphData] = useState<WorkflowGraphResponse | null>(null);
  const [activeRepoId, setActiveRepoId] = useState<string>(repositoryId || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<WorkflowCategory>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutDirection, setLayoutDirection] = useState<'LR' | 'TB'>('LR');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Selected node and drawer state
  const [selectedNode, setSelectedNode] = useState<WorkflowNodeItem | null>(null);
  const [sourceModalFile, setSourceModalFile] = useState<string | null>(null);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // 1. Initial Load: Fetch or auto-resolve repository
  useEffect(() => {
    const resolveAndLoadRepo = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      let targetId = repositoryId;

      // If no repositoryId prop, try URL pathname /github/:id/workflow
      if (!targetId && typeof window !== 'undefined') {
        const match = window.location.pathname.match(/\/github\/([^/]+)\/workflow/);
        if (match && match[1]) {
          targetId = match[1];
        }
      }

      // If still no ID, fetch first available repository from API
      if (!targetId) {
        try {
          const listRes = await fetch('/api/github/repositories');
          if (listRes.ok) {
            const listData = await listRes.json();
            if (listData.repositories && listData.repositories.length > 0) {
              targetId = listData.repositories[0].id;
            }
          }
        } catch {
          // non-blocking
        }
      }

      if (!targetId) {
        setErrorMessage('No repository found. Please analyze or import a repository first.');
        setIsLoading(false);
        return;
      }

      setActiveRepoId(targetId);
      await fetchWorkflowData(targetId, false);
      setIsLoading(false);
    };

    resolveAndLoadRepo();
  }, [repositoryId]);

  // 2. Fetch Workflow Data from Backend
  const fetchWorkflowData = async (repoId: string, refresh: boolean = false) => {
    if (refresh) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/github/repositories/${repoId}/workflow${refresh ? '?refresh=true' : ''}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch workflow graph');
      }

      const data: WorkflowGraphResponse = await res.json();
      setGraphData(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error loading workflow graph');
    } finally {
      if (refresh) setIsRefreshing(false);
    }
  };

  // 3. Compute Dagre Layout dynamically
  const layoutGraph = useCallback((
    rawNodes: WorkflowNodeItem[], 
    rawEdges: WorkflowEdgeItem[], 
    direction: 'LR' | 'TB' = 'LR'
  ) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({
      rankdir: direction,
      align: 'UL',
      nodesep: 40,
      ranksep: 90
    });

    const nodeWidth = 260;
    const nodeHeight = 85;

    rawNodes.forEach(node => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    rawEdges.forEach(edge => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return rawNodes.map(node => {
      const pos = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: (pos?.x || 0) - nodeWidth / 2,
          y: (pos?.y || 0) - nodeHeight / 2
        }
      };
    });
  }, []);

  // 4. Filter nodes and edges by Tab & calculate highlight/dim status
  useEffect(() => {
    if (!graphData) return;

    let filteredNodes = graphData.nodes;
    let filteredEdges = graphData.edges;

    // Filter by Tab
    if (activeTab === 'frontend') {
      filteredNodes = graphData.nodes.filter(n => n.category === 'frontend');
    } else if (activeTab === 'backend') {
      filteredNodes = graphData.nodes.filter(n => n.category === 'backend');
    } else if (activeTab === 'api') {
      filteredNodes = graphData.nodes.filter(n => n.category === 'api' || n.category === 'frontend' || n.category === 'backend');
    } else if (activeTab === 'database') {
      filteredNodes = graphData.nodes.filter(n => n.category === 'database' || n.category === 'table' || n.category === 'backend');
    } else if (activeTab === 'auth') {
      filteredNodes = graphData.nodes.filter(n => n.category === 'auth' || n.data.subType === 'page' || n.data.endpoint?.includes('login'));
    } else if (activeTab === 'journey') {
      filteredNodes = graphData.nodes.filter(n => n.category === 'journey');
    }

    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    filteredEdges = graphData.edges.filter(
      e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );

    // Apply auto layout with current direction
    const positionedNodes = layoutGraph(filteredNodes, filteredEdges, layoutDirection);

    // Calculate connection highlights if a node is selected (Requirement 16)
    let connectedNodeIds = new Set<string>();
    let connectedEdgeIds = new Set<string>();

    if (selectedNode) {
      connectedNodeIds.add(selectedNode.id);

      // Find direct upstream and downstream edges
      graphData.edges.forEach(e => {
        if (e.source === selectedNode.id) {
          connectedNodeIds.add(e.target);
          connectedEdgeIds.add(e.id);
        } else if (e.target === selectedNode.id) {
          connectedNodeIds.add(e.source);
          connectedEdgeIds.add(e.id);
        }
      });
    }

    // Map to React Flow Nodes
    const flowNodes: Node[] = positionedNodes.map(n => {
      const isSelected = selectedNode?.id === n.id;
      const isConnected = connectedNodeIds.has(n.id);
      const isDimmed = Boolean(selectedNode && !isConnected);

      // Match search query
      const matchesSearch = Boolean(
        searchQuery.trim() && (
          n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.data.path?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.data.endpoint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.data.framework?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      return {
        id: n.id,
        type: 'workflowNode',
        position: n.position,
        data: {
          ...n.data,
          isDimmed,
          isHighlighted: isConnected || matchesSearch,
          isSelected
        }
      };
    });

    // Map to React Flow Edges
    const flowEdges: Edge[] = filteredEdges.map(e => {
      const isHighlighted = connectedEdgeIds.has(e.id);
      const isDimmed = Boolean(selectedNode && !isHighlighted);

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: e.animated ?? true,
        type: 'default',
        style: {
          stroke: isHighlighted ? '#38bdf8' : isDimmed ? '#1e293b' : '#64748b',
          strokeWidth: isHighlighted ? 2.5 : 1.5,
          opacity: isDimmed ? 0.2 : 0.85
        },
        labelStyle: {
          fill: isHighlighted ? '#38bdf8' : '#94a3b8',
          fontSize: 10,
          fontFamily: 'monospace',
          fontWeight: 600
        },
        labelBgStyle: {
          fill: '#0B1120',
          fillOpacity: 0.95
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isHighlighted ? '#38bdf8' : '#64748b',
          width: 14,
          height: 14
        }
      };
    });

    setNodes(flowNodes);
    setEdges(flowEdges);

    // Smooth fit view
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 100);
  }, [graphData, activeTab, layoutDirection, selectedNode, searchQuery, layoutGraph, fitView, setNodes, setEdges]);

  // Handle Search centering
  useEffect(() => {
    if (!searchQuery.trim() || !nodes.length) return;

    const matchedNode = nodes.find(n => 
      (n.data as any).label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.data as any).endpoint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.data as any).path?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedNode) {
      setCenter(matchedNode.position.x + 130, matchedNode.position.y + 40, { zoom: 1.1, duration: 400 });
    }
  }, [searchQuery, nodes, setCenter]);

  // Handle Node Selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (!graphData) return;
    const target = graphData.nodes.find(n => n.id === node.id);
    if (target) {
      setSelectedNode(target);
    }
  }, [graphData]);

  // Handle Canvas Deselection
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // AI Explanation handler
  const handleExplainWithAi = async (node: WorkflowNodeItem): Promise<string> => {
    const res = await fetch(`/api/github/repositories/${activeRepoId}/workflow/explain-node`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repositoryId: activeRepoId,
        nodeData: node.data
      })
    });

    if (!res.ok) throw new Error('AI analysis failed');
    const data = await res.json();
    return data.explanation;
  };

  // Export JSON
  const handleExportJson = () => {
    if (!graphData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(graphData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${graphData.metadata.name}-workflow.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export PNG Image
  const handleExportPng = () => {
    const svgElement = document.querySelector('.react-flow__renderer') as HTMLElement;
    if (!svgElement) return;

    // Use Canvas printing or trigger alert/toast
    window.print();
  };

  // Upstream / Downstream counts for detail drawer
  const upstreamCount = useMemo(() => {
    if (!selectedNode || !graphData) return 0;
    return graphData.edges.filter(e => e.target === selectedNode.id).length;
  }, [selectedNode, graphData]);

  const downstreamCount = useMemo(() => {
    if (!selectedNode || !graphData) return 0;
    return graphData.edges.filter(e => e.source === selectedNode.id).length;
  }, [selectedNode, graphData]);

  // Match count for search query
  const matchCount = useMemo(() => {
    if (!searchQuery.trim()) return undefined;
    return nodes.filter(n => (n.data as any).isHighlighted).length;
  }, [searchQuery, nodes]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
        <div className="text-center space-y-1">
          <p className="text-sm font-mono text-white font-medium">Generating Interactive Project Workflow...</p>
          <p className="text-xs font-mono text-slate-500">Synthesizing frontend routes, API endpoints, backend controllers, and PostgreSQL schemas</p>
        </div>
      </div>
    );
  }

  if (errorMessage && !graphData) {
    return (
      <div className="p-8 max-w-xl mx-auto rounded-3xl bg-rose-950/20 border border-rose-500/30 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Workflow Unavailable</h3>
        <p className="text-xs text-rose-300 font-mono">{errorMessage}</p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('github-import')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs shadow-lg transition-all cursor-pointer"
          >
            Import a Repository
          </button>
        )}
      </div>
    );
  }

  const metadata = graphData?.metadata;

  return (
    <div className={`space-y-4 pb-16 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#060a12] p-4 flex flex-col space-y-2' : ''}`}>
      
      {/* 1. Repository Header */}
      {metadata && (
        <WorkflowHeader
          name={metadata.name}
          owner={metadata.owner}
          branch={metadata.branch}
          techStack={metadata.techStack}
          latestCommitSha={metadata.latestCommitSha}
          isRefreshing={isRefreshing}
          isFullscreen={isFullscreen}
          onRefresh={() => fetchWorkflowData(activeRepoId, true)}
          onAutoLayout={() => fitView({ padding: 0.2, duration: 400 })}
          onExportJson={handleExportJson}
          onExportPng={handleExportPng}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          onBackToRepo={onBackToRepo || (onNavigate ? () => onNavigate('github') : undefined)}
        />
      )}

      {/* 2. Workflow Toolbar */}
      <WorkflowToolbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        categoriesCount={metadata?.categories || {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        matchCount={matchCount}
        layoutDirection={layoutDirection}
        onToggleLayoutDirection={() => setLayoutDirection(prev => prev === 'LR' ? 'TB' : 'LR')}
        onZoomIn={() => zoomIn({ duration: 300 })}
        onZoomOut={() => zoomOut({ duration: 300 })}
        onFitView={() => fitView({ padding: 0.2, duration: 400 })}
        onResetView={() => fitView({ padding: 0.2, duration: 400 })}
        onAutoLayout={() => fitView({ padding: 0.2, duration: 400 })}
      />

      {/* Auth or Journey Informational Notice */}
      {activeTab === 'auth' && (
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {metadata?.hasAuthenticationFlow 
                ? metadata.authFlowMessage || 'Authentication flow verified from repository routes, security controllers, and token handling.'
                : 'Authentication flow could not be fully determined from the analyzed repository.'}
            </span>
          </div>
        </div>
      )}

      {activeTab === 'journey' && (
        <div className="p-3.5 rounded-2xl bg-teal-950/20 border border-teal-500/30 flex items-center justify-between text-xs font-mono text-teal-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Inferred from detected routes and API relationships.</span>
          </div>
          <span className="text-[10px] text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
            Automated Synthesis
          </span>
        </div>
      )}

      {/* 3. Interactive Graph Canvas */}
      <div 
        className={`relative w-full rounded-3xl border border-slate-800/90 bg-[#060a12] shadow-2xl overflow-hidden ${
          isFullscreen ? 'flex-1 h-full' : 'h-[650px] lg:h-[720px]'
        }`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={2.5}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: '#64748b', strokeWidth: 1.5 }
          }}
          className="bg-[#060a12]"
        >
          {/* Subtle grid pattern background */}
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="#1e293b" 
          />

          <Controls 
            className="!bg-slate-900/90 !border-slate-800 !rounded-xl !shadow-xl !fill-slate-300 overflow-hidden" 
          />

          <MiniMap
            zoomable
            pannable
            nodeColor={(node: any) => {
              const cat = node.data?.category;
              if (cat === 'frontend') return '#a855f7';
              if (cat === 'backend') return '#06b6d4';
              if (cat === 'api') return '#10b981';
              if (cat === 'database' || cat === 'table') return '#3b82f6';
              if (cat === 'auth') return '#f59e0b';
              if (cat === 'journey') return '#14b8a6';
              return '#64748b';
            }}
            className="!bg-slate-950/90 !border !border-slate-800 !rounded-2xl !shadow-2xl overflow-hidden"
          />
        </ReactFlow>

        {/* Legend / Overlay Note */}
        <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-[#0B1120]/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-3 pointer-events-none hidden sm:flex">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Frontend</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> API</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Backend</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Database</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Auth</span>
        </div>
      </div>

      {/* 4. Interactive Node Details Slide-over Drawer (Requirement 15) */}
      <NodeDetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onOpenSource={(path) => setSourceModalFile(path)}
        onExplainWithAi={handleExplainWithAi}
        onShowConnections={() => {
          if (selectedNode) {
            fitView({ nodes: [{ id: selectedNode.id }], duration: 400, padding: 0.5 });
          }
        }}
        upstreamCount={upstreamCount}
        downstreamCount={downstreamCount}
      />

      {/* 5. Source Code Viewer Modal */}
      {sourceModalFile && (
        <SourceViewerModal
          filePath={sourceModalFile}
          repositoryId={activeRepoId}
          onClose={() => setSourceModalFile(null)}
        />
      )}

    </div>
  );
};

export const WorkflowPage: React.FC<WorkflowPageProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};
