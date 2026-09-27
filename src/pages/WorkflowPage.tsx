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
import { WorkflowFlowEdge } from '../components/workflow/WorkflowFlowEdge';
import { WorkflowClusterOverlay } from '../components/workflow/WorkflowClusterOverlay';
import { FlowSimulatorBar, SIMULATION_SCENARIOS } from '../components/workflow/FlowSimulatorBar';
import { NodeDetailDrawer } from '../components/workflow/NodeDetailDrawer';
import { SourceViewerModal } from '../components/workflow/SourceViewerModal';
import { FileConnectionSearchModal } from '../components/workflow/FileConnectionSearchModal';
import { 
  WorkflowNodeItem, 
  WorkflowEdgeItem, 
  WorkflowGraphResponse, 
  WorkflowCategory 
} from '../types/workflow';
import { 
  Loader2, 
  AlertCircle, 
  Info, 
  ShieldAlert, 
  Sparkles, 
  Zap, 
  Layers, 
  Activity,
  Network,
  ArrowLeft,
  ArrowRight,
  FileCode,
  X,
  Eye,
  Radio
} from 'lucide-react';
import { PageView } from '../types';

const nodeTypes = {
  workflowNode: WorkflowNodeComponent
};

const edgeTypes = {
  flowEdge: WorkflowFlowEdge,
  default: WorkflowFlowEdge
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
  const { fitView, zoomIn, zoomOut, setCenter, getZoom } = useReactFlow();

  const [graphData, setGraphData] = useState<WorkflowGraphResponse | null>(null);
  const [activeRepoId, setActiveRepoId] = useState<string>(repositoryId || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<WorkflowCategory>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutDirection, setLayoutDirection] = useState<'LR' | 'TB'>('LR');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showClusters, setShowClusters] = useState(true);

  // Flow Simulator state
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSimulationPlaying, setIsSimulationPlaying] = useState(false);
  const [simulationScenarioId, setSimulationScenarioId] = useState<string>('auth-flow');
  const [simulationStepIndex, setSimulationStepIndex] = useState<number>(0);

  // Selected node and drawer state
  const [selectedNode, setSelectedNode] = useState<WorkflowNodeItem | null>(null);
  const [sourceModalFile, setSourceModalFile] = useState<string | null>(null);

  // Hover & Connection Focus states
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [connectionDirectionFilter, setConnectionDirectionFilter] = useState<'all' | 'inbound' | 'outbound'>('all');
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Keyboard shortcut to dismiss connection focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNode(null);
        setHoveredNodeId(null);
        setHoveredEdgeId(null);
        setConnectionDirectionFilter('all');
        setIsTraceModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      nodesep: direction === 'LR' ? 50 : 70,
      ranksep: direction === 'LR' ? 120 : 90
    });

    const nodeWidth = 270;
    const nodeHeight = 110;

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

  // 4. Active Simulated Node matching
  const activeSimulatedNodeId = useMemo(() => {
    if (!isSimulating || !graphData) return null;
    const currentScenario = SIMULATION_SCENARIOS.find(s => s.id === simulationScenarioId) || SIMULATION_SCENARIOS[0];
    const step = currentScenario.steps[simulationStepIndex];
    if (!step) return null;

    // Match by node label, endpoint, or path
    const match = graphData.nodes.find(n => 
      n.label.toLowerCase().includes(step.nodeIdMatch.toLowerCase()) ||
      n.data.endpoint?.toLowerCase().includes(step.nodeIdMatch.toLowerCase()) ||
      n.data.path?.toLowerCase().includes(step.nodeIdMatch.toLowerCase()) ||
      n.category.toLowerCase().includes(step.nodeIdMatch.toLowerCase())
    );

    return match ? match.id : null;
  }, [isSimulating, simulationScenarioId, simulationStepIndex, graphData]);

  // Center camera on active simulated node
  useEffect(() => {
    if (!isSimulating || !activeSimulatedNodeId || !nodes.length) return;
    const targetNode = nodes.find(n => n.id === activeSimulatedNodeId);
    if (targetNode) {
      setCenter(targetNode.position.x + 135, targetNode.position.y + 55, { zoom: 1.05, duration: 500 });
    }
  }, [isSimulating, activeSimulatedNodeId, nodes, setCenter]);

  // Auto-play timer for simulator
  useEffect(() => {
    if (!isSimulating || !isSimulationPlaying) return;

    const currentScenario = SIMULATION_SCENARIOS.find(s => s.id === simulationScenarioId) || SIMULATION_SCENARIOS[0];
    const timer = setInterval(() => {
      setSimulationStepIndex(prev => {
        if (prev >= currentScenario.steps.length - 1) {
          setIsSimulationPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2200);

    return () => clearInterval(timer);
  }, [isSimulating, isSimulationPlaying, simulationScenarioId]);

  // 5. Filter nodes and edges by Tab & calculate highlight/dim status
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

    // Precompute global connection counts for all nodes
    const inboundCountsMap = new Map<string, number>();
    const outboundCountsMap = new Map<string, number>();
    graphData.nodes.forEach(n => {
      inboundCountsMap.set(n.id, 0);
      outboundCountsMap.set(n.id, 0);
    });
    graphData.edges.forEach(e => {
      if (outboundCountsMap.has(e.source)) {
        outboundCountsMap.set(e.source, (outboundCountsMap.get(e.source) || 0) + 1);
      }
      if (inboundCountsMap.has(e.target)) {
        inboundCountsMap.set(e.target, (inboundCountsMap.get(e.target) || 0) + 1);
      }
    });

    // Calculate connection highlights if a file is hovered, selected, or simulated
    const focusTargetId = hoveredNodeId || selectedNode?.id || activeSimulatedNodeId;

    let inboundNodeIds = new Set<string>();
    let outboundNodeIds = new Set<string>();
    let inboundEdgeIds = new Set<string>();
    let outboundEdgeIds = new Set<string>();

    if (focusTargetId) {
      graphData.edges.forEach(e => {
        // Inbound: callers pointing to focusTargetId
        if (e.target === focusTargetId) {
          if (connectionDirectionFilter !== 'outbound') {
            inboundNodeIds.add(e.source);
            inboundEdgeIds.add(e.id);
          }
        }
        // Outbound: dependencies called by focusTargetId
        if (e.source === focusTargetId) {
          if (connectionDirectionFilter !== 'inbound') {
            outboundNodeIds.add(e.target);
            outboundEdgeIds.add(e.id);
          }
        }
      });
    }

    if (hoveredEdgeId) {
      const edge = graphData.edges.find(e => e.id === hoveredEdgeId);
      if (edge) {
        inboundNodeIds.add(edge.source);
        outboundNodeIds.add(edge.target);
        inboundEdgeIds.add(edge.id);
      }
    }

    // Map to React Flow Nodes with rich connection telemetry
    const flowNodes: Node[] = positionedNodes.map(n => {
      const isSelected = selectedNode?.id === n.id;
      const isSimulatedActive = activeSimulatedNodeId === n.id;
      const isTarget = focusTargetId === n.id;
      const isInbound = inboundNodeIds.has(n.id);
      const isOutbound = outboundNodeIds.has(n.id);
      const isConnected = isTarget || isInbound || isOutbound;
      const isDimmed = Boolean((focusTargetId || hoveredEdgeId) && !isConnected);

      let connectionRole: 'focus' | 'inbound' | 'outbound' | null = null;
      if (isTarget) connectionRole = 'focus';
      else if (isInbound) connectionRole = 'inbound';
      else if (isOutbound) connectionRole = 'outbound';

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
          layoutDirection,
          inboundCount: inboundCountsMap.get(n.id) || 0,
          outboundCount: outboundCountsMap.get(n.id) || 0,
          connectionRole,
          isDimmed,
          isHighlighted: isConnected || matchesSearch || isSimulatedActive,
          isSelected: isSelected || isSimulatedActive
        }
      };
    });

    // Map to React Flow Edges with directional flow and neon highlighting
    const flowEdges: Edge[] = filteredEdges.map(e => {
      const isInbound = inboundEdgeIds.has(e.id);
      const isOutbound = outboundEdgeIds.has(e.id);
      const isHovered = hoveredEdgeId === e.id;
      const isHighlighted = isInbound || isOutbound || isHovered;
      const isDimmed = Boolean((focusTargetId || hoveredEdgeId) && !isHighlighted);

      const connectionType: 'inbound' | 'outbound' | 'normal' = 
        isInbound ? 'inbound' : isOutbound ? 'outbound' : 'normal';

      // Find source and target node categories & names
      const sourceNode = graphData.nodes.find(n => n.id === e.source);
      const targetNode = graphData.nodes.find(n => n.id === e.target);

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'flowEdge',
        data: {
          label: e.label,
          sourceCategory: sourceNode?.category,
          targetCategory: targetNode?.category,
          sourceName: sourceNode?.label,
          targetName: targetNode?.label,
          sourcePath: sourceNode?.data.path,
          targetPath: targetNode?.data.path,
          isHighlighted,
          isDimmed,
          isHovered,
          connectionType,
          isSimulating: isHighlighted && isSimulating,
          flowSpeed: isHighlighted ? 1.4 : 3
        }
      };
    });

    setNodes(flowNodes);
    setEdges(flowEdges);

    // Initial smooth fit view if not actively simulating
    if (!isSimulating) {
      setTimeout(() => {
        fitView({ padding: 0.18, duration: 400 });
      }, 80);
    }
  }, [
    graphData, 
    activeTab, 
    layoutDirection, 
    selectedNode, 
    hoveredNodeId,
    hoveredEdgeId,
    connectionDirectionFilter,
    searchQuery, 
    activeSimulatedNodeId, 
    isSimulating,
    layoutGraph, 
    fitView, 
    setNodes, 
    setEdges
  ]);

  // Handle Search centering
  useEffect(() => {
    if (!searchQuery.trim() || !nodes.length) return;

    const matchedNode = nodes.find(n => 
      (n.data as any).label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.data as any).endpoint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.data as any).path?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedNode) {
      setCenter(matchedNode.position.x + 135, matchedNode.position.y + 55, { zoom: 1.1, duration: 400 });
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
    downloadAnchor.setAttribute('download', `${graphData.metadata.name}-workflow-architecture.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export PNG Image
  const handleExportPng = () => {
    window.print();
  };

  // Upstream / Downstream nodes and counts for detail drawer
  const drawerUpstreamNodes = useMemo(() => {
    if (!selectedNode || !graphData) return [];
    const callerIds = new Set(
      graphData.edges.filter(e => e.target === selectedNode.id).map(e => e.source)
    );
    return graphData.nodes.filter(n => callerIds.has(n.id));
  }, [selectedNode, graphData]);

  const drawerDownstreamNodes = useMemo(() => {
    if (!selectedNode || !graphData) return [];
    const calleeIds = new Set(
      graphData.edges.filter(e => e.source === selectedNode.id).map(e => e.target)
    );
    return graphData.nodes.filter(n => calleeIds.has(n.id));
  }, [selectedNode, graphData]);

  const upstreamCount = drawerUpstreamNodes.length;
  const downstreamCount = drawerDownstreamNodes.length;

  // Active Focused File node (via hover, click, or simulated trace)
  const activeFocusNode = useMemo(() => {
    if (!graphData) return null;
    const targetId = hoveredNodeId || selectedNode?.id || activeSimulatedNodeId;
    if (!targetId) return null;
    return graphData.nodes.find(n => n.id === targetId) || null;
  }, [graphData, hoveredNodeId, selectedNode, activeSimulatedNodeId]);

  const activeFocusInboundCount = useMemo(() => {
    if (!activeFocusNode || !graphData) return 0;
    return graphData.edges.filter(e => e.target === activeFocusNode.id).length;
  }, [activeFocusNode, graphData]);

  const activeFocusOutboundCount = useMemo(() => {
    if (!activeFocusNode || !graphData) return 0;
    return graphData.edges.filter(e => e.source === activeFocusNode.id).length;
  }, [activeFocusNode, graphData]);

  const handleClearConnectionFocus = () => {
    setSelectedNode(null);
    setHoveredNodeId(null);
    setHoveredEdgeId(null);
    setConnectionDirectionFilter('all');
  };

  // Match count for search query
  const matchCount = useMemo(() => {
    if (!searchQuery.trim()) return undefined;
    return nodes.filter(n => (n.data as any).isHighlighted).length;
  }, [searchQuery, nodes]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-slate-400">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <Sparkles className="w-6 h-6 text-purple-400 absolute animate-pulse" />
        </div>
        <div className="text-center space-y-1.5">
          <p className="text-sm font-mono text-white font-semibold tracking-wide">
            Synthesizing Interactive Architecture Workflow...
          </p>
          <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
            Resolving AST components, API ingress boundaries, controller pipelines, and relational schema topology
          </p>
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
    <div className={`space-y-4 pb-16 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#040711] p-4 flex flex-col space-y-3' : ''}`}>
      
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
          onAutoLayout={() => fitView({ padding: 0.18, duration: 400 })}
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
        showClusters={showClusters}
        onToggleClusters={() => setShowClusters(!showClusters)}
        isSimulating={isSimulating}
        onToggleSimulation={() => {
          setIsSimulating(!isSimulating);
          setIsSimulationPlaying(!isSimulating);
          setSimulationStepIndex(0);
        }}
        onOpenTraceModal={() => setIsTraceModalOpen(true)}
        hasActiveFileConnection={Boolean(activeFocusNode)}
        onClearConnectionFocus={handleClearConnectionFocus}
        onZoomIn={() => zoomIn({ duration: 300 })}
        onZoomOut={() => zoomOut({ duration: 300 })}
        onFitView={() => fitView({ padding: 0.18, duration: 400 })}
        onResetView={() => fitView({ padding: 0.18, duration: 400 })}
        onAutoLayout={() => fitView({ padding: 0.18, duration: 400 })}
      />

      {/* Auth or Journey Informational Notice */}
      {activeTab === 'auth' && (
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {metadata?.hasAuthenticationFlow 
                ? metadata.authFlowMessage || 'Authentication flow verified from repository routes, security controllers, and token handling.'
                : 'Authentication flow inferred from detected user login endpoints and token guards.'}
            </span>
          </div>
        </div>
      )}

      {activeTab === 'journey' && (
        <div className="p-3.5 rounded-2xl bg-teal-950/20 border border-teal-500/30 flex items-center justify-between text-xs font-mono text-teal-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Full-stack pipeline synthesis inferred from detected client actions, API routes, and database tables.</span>
          </div>
          <span className="text-[10px] text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
            End-to-End Trace
          </span>
        </div>
      )}

      {/* 3. Interactive Graph Canvas with Cosmic Atmosphere */}
      <div 
        className={`relative w-full rounded-3xl border border-slate-800/90 bg-[#040711] shadow-2xl overflow-hidden ${
          isFullscreen ? 'flex-1 h-full' : 'h-[660px] lg:h-[740px]'
        }`}
      >
        {/* Deep Space Cosmic Ambient Flares */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none" />

        {/* Top Floating File Connection Spotlight HUD */}
        {activeFocusNode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#070b16]/95 backdrop-blur-2xl border border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.3)] text-xs font-mono text-white animate-in fade-in slide-in-from-top-3 max-w-[92%] sm:max-w-xl">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
              </span>
              <span className="text-slate-400 shrink-0 hidden sm:inline">Highlighting:</span>
              <span className="font-bold text-cyan-300 truncate max-w-[150px] sm:max-w-[220px]" title={activeFocusNode.data.path || activeFocusNode.label}>
                {activeFocusNode.label}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase shrink-0">
                {activeFocusNode.category}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            {/* Inbound Callers filter badge */}
            <button
              onClick={() => setConnectionDirectionFilter(prev => prev === 'inbound' ? 'all' : 'inbound')}
              className={`px-2 py-0.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                connectionDirectionFilter === 'inbound'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                  : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/80'
              }`}
              title="Click to toggle filter: incoming callers only"
            >
              <ArrowLeft className="w-3 h-3 text-emerald-400" />
              <span>{activeFocusInboundCount} Incoming</span>
            </button>

            {/* Outbound Dependencies filter badge */}
            <button
              onClick={() => setConnectionDirectionFilter(prev => prev === 'outbound' ? 'all' : 'outbound')}
              className={`px-2 py-0.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                connectionDirectionFilter === 'outbound'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/30'
                  : 'bg-sky-950/80 text-sky-300 hover:bg-sky-900 border border-sky-800/80'
              }`}
              title="Click to toggle filter: outgoing dependencies only"
            >
              <span>{activeFocusOutboundCount} Outbound</span>
              <ArrowRight className="w-3 h-3 text-sky-400" />
            </button>

            {/* Clear highlight button */}
            <button
              onClick={handleClearConnectionFocus}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto cursor-pointer"
              title="Dismiss file connection highlight (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeMouseEnter={(_, node) => setHoveredNodeId(node.id)}
          onNodeMouseLeave={() => setHoveredNodeId(null)}
          onEdgeMouseEnter={(_, edge) => setHoveredEdgeId(edge.id)}
          onEdgeMouseLeave={() => setHoveredEdgeId(null)}
          onEdgeClick={(_, edge) => {
            setHoveredEdgeId(edge.id);
          }}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.15}
          maxZoom={2.4}
          className="bg-transparent"
        >
          {/* Subtle Cyber Grid */}
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={24} 
            size={1.2} 
            color="#172236" 
          />

          {/* Organic Module Cluster Hulls */}
          <WorkflowClusterOverlay
            nodes={nodes}
            visible={showClusters}
            activeCategory={activeTab}
            onFocusCategory={(cat) => setActiveTab(cat)}
          />

          {/* Canvas Controls */}
          <Controls 
            className="!bg-slate-900/90 !border-slate-800 !rounded-xl !shadow-2xl !fill-slate-300 overflow-hidden" 
          />

          {/* Stylized Radar MiniMap */}
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
            maskColor="rgba(4, 7, 17, 0.75)"
            className="!bg-[#070b16]/95 !border !border-slate-800/90 !rounded-2xl !shadow-2xl overflow-hidden"
          />
        </ReactFlow>

        {/* Bottom Left: Interactive Layer Filter Legend */}
        <div className="absolute bottom-4 left-4 p-2 rounded-2xl bg-[#070b16]/90 backdrop-blur-xl border border-slate-800/90 text-[10px] font-mono text-slate-300 flex items-center gap-2 select-none shadow-2xl hidden md:flex">
          <span className="text-slate-500 font-bold px-1 uppercase tracking-wider text-[9px]">Layers</span>
          
          <button
            onClick={() => setActiveTab('frontend')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'frontend' ? 'bg-purple-950 text-purple-300 border border-purple-800 font-bold' : 'hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Frontend</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'api' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold' : 'hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>API Gateway</span>
          </button>

          <button
            onClick={() => setActiveTab('backend')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'backend' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold' : 'hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Backend</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'database' ? 'bg-blue-950 text-blue-300 border border-blue-800 font-bold' : 'hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Database</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'auth' ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold' : 'hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Auth</span>
          </button>
        </div>

        {/* Bottom Right Telemetry Badge */}
        <div className="absolute bottom-4 right-4 p-2 px-3 rounded-xl bg-[#070b16]/80 backdrop-blur-md border border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center gap-3 select-none pointer-events-none hidden sm:flex">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <strong className="text-white">{nodes.length}</strong> nodes
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-purple-400" />
            <strong className="text-white">{edges.length}</strong> connections
          </span>
        </div>

        {/* Floating Flow Simulator Telemetry Bar */}
        {isSimulating && (
          <FlowSimulatorBar
            isPlaying={isSimulationPlaying}
            onTogglePlay={() => setIsSimulationPlaying(!isSimulationPlaying)}
            currentStepIndex={simulationStepIndex}
            onStepChange={(idx) => setSimulationStepIndex(idx)}
            selectedScenarioId={simulationScenarioId}
            onSelectScenario={(id) => setSimulationScenarioId(id)}
            onClose={() => {
              setIsSimulating(false);
              setIsSimulationPlaying(false);
            }}
          />
        )}

      </div>

      {/* 4. Interactive Node Details Slide-over Drawer */}
      <NodeDetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onOpenSource={(path) => setSourceModalFile(path)}
        onExplainWithAi={handleExplainWithAi}
        onShowConnections={() => {
          if (selectedNode) {
            fitView({ nodes: [{ id: selectedNode.id }], duration: 400, padding: 0.6 });
          }
        }}
        upstreamCount={upstreamCount}
        downstreamCount={downstreamCount}
        upstreamNodes={drawerUpstreamNodes}
        downstreamNodes={drawerDownstreamNodes}
        onSelectNodeById={(nodeId) => {
          if (!graphData) return;
          const target = graphData.nodes.find(n => n.id === nodeId);
          if (target) {
            setSelectedNode(target);
            fitView({ nodes: [{ id: nodeId }], duration: 400, padding: 0.6 });
          }
        }}
      />

      {/* 5. Source Code Viewer Modal */}
      {sourceModalFile && (
        <SourceViewerModal
          filePath={sourceModalFile}
          repositoryId={activeRepoId}
          onClose={() => setSourceModalFile(null)}
          onHighlightInWorkflow={(path) => {
            if (!graphData) return;
            const target = graphData.nodes.find(n => 
              n.data.path?.toLowerCase() === path.toLowerCase() ||
              n.label.toLowerCase() === path.toLowerCase() ||
              path.toLowerCase().endsWith(n.label.toLowerCase()) ||
              (n.data.path && path.toLowerCase().endsWith(n.data.path.toLowerCase()))
            );
            if (target) {
              setSelectedNode(target);
              fitView({ nodes: [{ id: target.id }], duration: 500, padding: 0.6 });
            }
          }}
        />
      )}

      {/* 6. Trace File Connections Search Modal */}
      <FileConnectionSearchModal
        isOpen={isTraceModalOpen}
        onClose={() => setIsTraceModalOpen(false)}
        nodes={graphData?.nodes || []}
        edges={graphData?.edges || []}
        selectedNodeId={selectedNode?.id}
        onSelectNode={(node) => {
          setSelectedNode(node);
          fitView({ nodes: [{ id: node.id }], duration: 500, padding: 0.6 });
        }}
      />

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
