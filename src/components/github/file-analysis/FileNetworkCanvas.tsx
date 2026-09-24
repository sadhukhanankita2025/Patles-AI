import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  FileNetworkNode, 
  FileNetworkEdge, 
  FileCategory, 
  ComplexityLevel 
} from '../../../types/fileAnalysis';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Pause, 
  Play, 
  Eye, 
  EyeOff, 
  Layers, 
  Search,
  Sparkles,
  Zap,
  Filter
} from 'lucide-react';

interface FileNetworkCanvasProps {
  nodes: FileNetworkNode[];
  edges: FileNetworkEdge[];
  selectedNodeId?: string | null;
  onSelectNode: (node: FileNetworkNode) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

const CATEGORY_COLORS: Record<FileCategory, string> = {
  component: '#38BDF8', // Sky / Cyan
  page: '#818CF8',      // Indigo
  route: '#34D399',     // Emerald
  service: '#FBBF24',   // Amber
  model: '#F43F5E',     // Rose
  hook: '#2DD4BF',      // Teal
  util: '#A855F7',      // Purple
  style: '#F472B6',     // Pink
  config: '#94A3B8',    // Slate
  test: '#60A5FA',      // Blue
  doc: '#64748B',       // Gray
  other: '#6B7280'
};

interface SimNode extends FileNetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const FileNetworkCanvas: React.FC<FileNetworkCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  searchQuery = '',
  selectedCategory = 'all'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Simulation & Viewport state
  const simNodesRef = useRef<SimNode[]>([]);
  const isRunningPhysicsRef = useRef<boolean>(true);
  const [isRunningPhysics, setIsRunningPhysics] = useState<boolean>(true);
  const [showEdges, setShowEdges] = useState<boolean>(true);

  // Viewport transforms (pan & zoom)
  const transformRef = useRef<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 0.9 });
  const [zoomLevel, setZoomLevel] = useState<number>(0.9);

  // Hover & Drag state
  const hoveredNodeRef = useRef<SimNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const isDraggingCanvasRef = useRef<boolean>(false);
  const draggedNodeRef = useRef<SimNode | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize simulation nodes
  useEffect(() => {
    if (!nodes || nodes.length === 0) return;

    // Compute node radius based on lines of code
    simNodesRef.current = nodes.map(n => {
      const radius = Math.max(10, Math.min(36, 10 + Math.sqrt(n.linesOfCode || 10) * 1.2));
      return {
        ...n,
        x: n.x || Math.random() * 800 + 100,
        y: n.y || Math.random() * 600 + 100,
        vx: 0,
        vy: 0,
        radius
      };
    });

    // Auto-fit initial viewport
    centerGraph();
  }, [nodes]);

  const centerGraph = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth || 900;
    const height = containerRef.current.clientHeight || 600;
    transformRef.current = {
      x: width / 2 - 500 * 0.85,
      y: height / 2 - 400 * 0.85,
      k: 0.85
    };
    setZoomLevel(0.85);
  }, []);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Physics step
    const stepPhysics = () => {
      if (!isRunningPhysicsRef.current) return;

      const simNodes = simNodesRef.current;
      const total = simNodes.length;
      if (total === 0) return;

      const centerX = 500;
      const centerY = 400;
      const damping = 0.88;

      // 1. Repulsion between all nodes
      for (let i = 0; i < total; i++) {
        const n1 = simNodes[i];
        if (n1 === draggedNodeRef.current) continue;

        for (let j = i + 1; j < total; j++) {
          const n2 = simNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy || 1;
          const minDist = (n1.radius + n2.radius) * 2.2;

          if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq) || 1;
            const force = ((minDist - dist) / dist) * 0.25;
            n1.vx -= dx * force;
            n1.vy -= dy * force;
            if (n2 !== draggedNodeRef.current) {
              n2.vx += dx * force;
              n2.vy += dy * force;
            }
          } else if (distSq < 40000) {
            // General Coulomb-like gentle repulsion
            const force = 120 / distSq;
            n1.vx -= dx * force;
            n1.vy -= dy * force;
            if (n2 !== draggedNodeRef.current) {
              n2.vx += dx * force;
              n2.vy += dy * force;
            }
          }
        }

        // 2. Gravitational pull toward category center
        const gravity = 0.008;
        n1.vx += (centerX - n1.x) * gravity;
        n1.vy += (centerY - n1.y) * gravity;
      }

      // 3. Spring attraction along edges
      const nodeMap = new Map<string, SimNode>();
      for (const n of simNodes) nodeMap.set(n.id, n);

      for (const edge of edges) {
        const s = nodeMap.get(edge.source);
        const t = nodeMap.get(edge.target);
        if (s && t) {
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 140;
          const force = (dist - targetDist) * 0.008;

          if (s !== draggedNodeRef.current) {
            s.vx += (dx / dist) * force;
            s.vy += (dy / dist) * force;
          }
          if (t !== draggedNodeRef.current) {
            t.vx -= (dx / dist) * force;
            t.vy -= (dy / dist) * force;
          }
        }
      }

      // 4. Integrate velocities
      for (const n of simNodes) {
        if (n === draggedNodeRef.current) continue;
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
      }
    };

    // Render loop
    const render = () => {
      if (!canvas || !containerRef.current) return;
      stepPhysics();

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const { x: panX, y: panY, k } = transformRef.current;

      ctx.clearRect(0, 0, width, height);

      // Save context for transform
      ctx.save();
      ctx.translate(panX, panY);
      ctx.scale(k, k);

      // Draw background grid dots
      const gridSize = 40;
      const startX = -panX / k - 100;
      const startY = -panY / k - 100;
      const endX = startX + width / k + 200;
      const endY = startY + height / k + 200;

      ctx.fillStyle = 'rgba(51, 65, 85, 0.2)';
      for (let gx = Math.floor(startX / gridSize) * gridSize; gx < endX; gx += gridSize) {
        for (let gy = Math.floor(startY / gridSize) * gridSize; gy < endY; gy += gridSize) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const simNodes = simNodesRef.current;
      const nodeMap = new Map<string, SimNode>();
      for (const n of simNodes) nodeMap.set(n.id, n);

      // Draw Edges
      if (showEdges) {
        for (const edge of edges) {
          const s = nodeMap.get(edge.source);
          const t = nodeMap.get(edge.target);
          if (!s || !t) continue;

          // Check if either node matches category or search
          const sMatch = selectedCategory === 'all' || s.category === selectedCategory;
          const tMatch = selectedCategory === 'all' || t.category === selectedCategory;
          const isHighlighted = (hoveredNodeRef.current && (hoveredNodeRef.current.id === s.id || hoveredNodeRef.current.id === t.id)) ||
                                (selectedNodeId && (selectedNodeId === s.id || selectedNodeId === t.id));

          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);

          if (isHighlighted) {
            ctx.strokeStyle = '#C084FC';
            ctx.lineWidth = 2.5;
          } else if (sMatch && tMatch) {
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.25)';
            ctx.lineWidth = 1;
          } else {
            ctx.strokeStyle = 'rgba(71, 85, 105, 0.08)';
            ctx.lineWidth = 0.5;
          }
          ctx.stroke();

          // Draw small arrow head towards target
          if (isHighlighted || (sMatch && tMatch)) {
            const angle = Math.atan2(t.y - s.y, t.x - s.x);
            const arrowX = t.x - (t.radius + 6) * Math.cos(angle);
            const arrowY = t.y - (t.radius + 6) * Math.sin(angle);
            ctx.fillStyle = isHighlighted ? '#C084FC' : 'rgba(148, 163, 184, 0.4)';
            ctx.beginPath();
            ctx.arc(arrowX, arrowY, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Nodes
      for (const node of simNodes) {
        const isSelected = node.id === selectedNodeId;
        const isHovered = hoveredNodeRef.current?.id === node.id;
        const categoryMatch = selectedCategory === 'all' || node.category === selectedCategory;
        const searchMatch = !searchQuery || 
          node.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
          node.name.toLowerCase().includes(searchQuery.toLowerCase());

        const opacity = categoryMatch && searchMatch ? 1 : 0.2;
        const baseColor = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.other;

        ctx.save();
        ctx.globalAlpha = opacity;

        // Glow ring for hotspots or selected
        if (node.isHotspot || isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + (isSelected ? 8 : 5), 0, Math.PI * 2);
          ctx.fillStyle = isSelected 
            ? 'rgba(192, 132, 252, 0.35)' 
            : node.isHotspot 
            ? 'rgba(251, 191, 36, 0.25)' 
            : 'rgba(56, 189, 248, 0.25)';
          ctx.fill();
        }

        // Node circle body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#A855F7' : baseColor;
        ctx.fill();

        // Node border
        ctx.lineWidth = isSelected ? 3 : node.isHotspot ? 2.5 : 1.5;
        ctx.strokeStyle = isSelected 
          ? '#FFFFFF' 
          : node.isHotspot 
          ? '#F59E0B' 
          : 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // Inner core for entrypoint
        if (node.isEntrypoint) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }

        // Node Label (rendered if zoom is high enough, or if selected/hovered/hotspot)
        if (k > 0.65 || isSelected || isHovered || node.isHotspot) {
          ctx.font = `${Math.max(9, Math.min(13, Math.round(11 / k)))}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          // Label background pill for readability
          const labelText = node.name;
          const textMetrics = ctx.measureText(labelText);
          const textW = textMetrics.width;
          const labelY = node.y + node.radius + 4;

          ctx.fillStyle = 'rgba(11, 17, 32, 0.85)';
          ctx.fillRect(node.x - textW / 2 - 4, labelY - 1, textW + 8, 14);

          ctx.fillStyle = isSelected ? '#F3E8FF' : isHovered ? '#FFFFFF' : '#CBD5E1';
          ctx.fillText(labelText, node.x, labelY);
        }

        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [edges, selectedCategory, searchQuery, selectedNodeId, showEdges]);

  // Mouse Interaction handlers
  const getCanvasCoords = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const { x: panX, y: panY, k } = transformRef.current;
    return {
      x: (clientX - rect.left - panX) / k,
      y: (clientY - rect.top - panY) / k
    };
  };

  const findNodeAtCoords = (cx: number, cy: number): SimNode | null => {
    const simNodes = simNodesRef.current;
    for (let i = simNodes.length - 1; i >= 0; i--) {
      const node = simNodes[i];
      const dx = cx - node.x;
      const dy = cy - node.y;
      if (dx * dx + dy * dy <= (node.radius + 4) * (node.radius + 4)) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const clickedNode = findNodeAtCoords(coords.x, coords.y);

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      dragStartPosRef.current = { x: coords.x, y: coords.y };
    } else {
      isDraggingCanvasRef.current = true;
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);

    // If dragging a node
    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = coords.x;
      draggedNodeRef.current.y = coords.y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    // If panning canvas
    if (isDraggingCanvasRef.current) {
      const dx = e.clientX - dragStartPosRef.current.x;
      const dy = e.clientY - dragStartPosRef.current.y;
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };

      transformRef.current = {
        ...transformRef.current,
        x: transformRef.current.x + dx,
        y: transformRef.current.y + dy
      };
      return;
    }

    // Hover detection
    const found = findNodeAtCoords(coords.x, coords.y);
    hoveredNodeRef.current = found;
    setHoveredNode(found);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = found ? 'pointer' : 'grab';
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedNodeRef.current) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      const dist = Math.hypot(coords.x - dragStartPosRef.current.x, coords.y - dragStartPosRef.current.y);
      if (dist < 5) {
        onSelectNode(draggedNodeRef.current);
      }
      draggedNodeRef.current = null;
    }
    isDraggingCanvasRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newK = Math.max(0.2, Math.min(3.5, transformRef.current.k * zoomFactor));

    const newX = mouseX - (mouseX - transformRef.current.x) * (newK / transformRef.current.k);
    const newY = mouseY - (mouseY - transformRef.current.y) * (newK / transformRef.current.k);

    transformRef.current = { x: newX, y: newY, k: newK };
    setZoomLevel(newK);
  };

  const handleZoom = (delta: number) => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const newK = Math.max(0.2, Math.min(3.5, transformRef.current.k + delta));
    const factor = newK / transformRef.current.k;

    transformRef.current = {
      x: width / 2 - (width / 2 - transformRef.current.x) * factor,
      y: height / 2 - (height / 2 - transformRef.current.y) * factor,
      k: newK
    };
    setZoomLevel(newK);
  };

  const togglePhysics = () => {
    const nextState = !isRunningPhysics;
    setIsRunningPhysics(nextState);
    isRunningPhysicsRef.current = nextState;
  };

  return (
    <div ref={containerRef} className="relative w-full h-[620px] bg-[#070B14] rounded-2xl border border-slate-800 overflow-hidden select-none">
      
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Floating Canvas Controls (Top Right) */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl z-10">
        <button
          onClick={() => handleZoom(0.15)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.15)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={centerGraph}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset Viewport Center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-800 mx-0.5"></div>
        <button
          onClick={togglePhysics}
          className={`p-2 rounded-lg transition-colors ${
            isRunningPhysics ? 'text-cyan-400 hover:bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'
          }`}
          title={isRunningPhysics ? 'Pause Physics Auto-layout' : 'Resume Physics Simulation'}
        >
          {isRunningPhysics ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setShowEdges(!showEdges)}
          className={`p-2 rounded-lg transition-colors ${
            showEdges ? 'text-purple-400 hover:bg-purple-500/10' : 'text-slate-500 hover:text-slate-300'
          }`}
          title={showEdges ? 'Hide Dependency Links' : 'Show Dependency Links'}
        >
          {showEdges ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Legend / Category Palette (Bottom Left) */}
      <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 shadow-xl z-10 font-mono text-[11px] max-w-sm hidden sm:block">
        <div className="text-slate-400 font-bold mb-2 flex items-center justify-between">
          <span>File Network Topology</span>
          <span className="text-[10px] text-slate-500">{(zoomLevel * 100).toFixed(0)}% zoom</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
            <span>Component (.tsx)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#818CF8]"></span>
            <span>Page / View</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]"></span>
            <span>API Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]"></span>
            <span>Service / Store</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]"></span>
            <span>Model / DB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]"></span>
            <span>Config / Infra</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full border border-amber-400 bg-amber-400/30"></span> Hotspot (High Coupling)
          </span>
          <span>·</span>
          <span>Size = Lines of Code</span>
        </div>
      </div>

      {/* Hover Card Tooltip */}
      {hoveredNode && (
        <div 
          className="absolute pointer-events-none z-20 p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-purple-500/40 shadow-2xl font-mono text-xs max-w-xs transition-opacity duration-150"
          style={{
            left: Math.min(
              (containerRef.current?.clientWidth || 800) - 240,
              Math.max(16, hoveredNode.x * transformRef.current.k + transformRef.current.x + 16)
            ),
            top: Math.min(
              (containerRef.current?.clientHeight || 600) - 130,
              Math.max(16, hoveredNode.y * transformRef.current.k + transformRef.current.y - 40)
            )
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-white truncate">{hoveredNode.name}</span>
            <span 
              className="text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase"
              style={{
                backgroundColor: `${CATEGORY_COLORS[hoveredNode.category]}20`,
                color: CATEGORY_COLORS[hoveredNode.category]
              }}
            >
              {hoveredNode.category}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 truncate mb-2">{hoveredNode.path}</div>
          
          <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-800 pt-1.5 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Lines of Code</span>
              <span className="font-bold text-white">{hoveredNode.linesOfCode} LOC</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Coupling</span>
              <span className="font-bold text-cyan-400">{hoveredNode.inboundCount} in · {hoveredNode.outboundCount} out</span>
            </div>
          </div>

          {hoveredNode.isHotspot && (
            <div className="mt-1.5 text-[10px] text-amber-400 flex items-center gap-1 font-bold">
              <Zap className="w-3 h-3" /> Core Architecture Hotspot
            </div>
          )}
        </div>
      )}

    </div>
  );
};
