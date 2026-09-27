import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Sparkles,
  Zap
} from 'lucide-react';

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: {
    nodeIdMatch: string;
    nodeName: string;
    stage: string;
    description: string;
    latencyMs: number;
    protocol: string;
    status: string;
  }[];
}

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'auth-flow',
    title: 'User Authentication & JWT Flow',
    description: 'Client login request traced through gateway, controller, SQL validation, and token signing',
    category: 'auth',
    steps: [
      {
        nodeIdMatch: 'login',
        nodeName: 'Auth / Login View',
        stage: 'Client Dispatch',
        description: 'User enters credentials and dispatches form submission',
        latencyMs: 4,
        protocol: 'React onSubmit',
        status: 'DISPATCHED'
      },
      {
        nodeIdMatch: 'api',
        nodeName: 'POST /api/auth/login',
        stage: 'API Ingress',
        description: 'Ingress routing through Express middleware and rate limiter',
        latencyMs: 12,
        protocol: 'HTTP/2 REST',
        status: 'INGRESS_OK'
      },
      {
        nodeIdMatch: 'authcontroller',
        nodeName: 'AuthController.ts',
        stage: 'Controller Layer',
        description: 'Sanitizes payload, validates email format and password schema',
        latencyMs: 6,
        protocol: 'TypeScript Logic',
        status: 'VALIDATED'
      },
      {
        nodeIdMatch: 'authservice',
        nodeName: 'AuthService.ts',
        stage: 'Business Logic',
        description: 'Bcrypt hash comparison and business rule verification',
        latencyMs: 24,
        protocol: 'Bcrypt CPU',
        status: 'COMPUTING'
      },
      {
        nodeIdMatch: 'users',
        nodeName: 'users (PostgreSQL Table)',
        stage: 'Database Storage',
        description: 'Indexed query on user email and fetches user security credentials',
        latencyMs: 16,
        protocol: 'SQL Query (indexed)',
        status: 'DB_MATCH'
      },
      {
        nodeIdMatch: 'token',
        nodeName: 'Session & JWT Issuer',
        stage: 'Token Synthesis',
        description: 'Signs RS256 JWT access token and sets secure HttpOnly cookie',
        latencyMs: 8,
        protocol: 'JWT Signed',
        status: '200_SUCCESS'
      }
    ]
  },
  {
    id: 'api-query',
    title: 'Data Query & Hydration Trace',
    description: 'Full-stack request flow retrieving and caching relational database entities',
    category: 'api',
    steps: [
      {
        nodeIdMatch: 'page',
        nodeName: 'Dashboard Client View',
        stage: 'Client Hydration',
        description: 'SWR / React Query triggers repository telemetry fetch',
        latencyMs: 3,
        protocol: 'Client Fetch',
        status: 'DISPATCHED'
      },
      {
        nodeIdMatch: 'route',
        nodeName: 'GET /api/github/repositories',
        stage: 'Route Ingress',
        description: 'Authenticates Bearer token and routes to repository controller',
        latencyMs: 9,
        protocol: 'HTTP/2 REST',
        status: 'ROUTED'
      },
      {
        nodeIdMatch: 'controller',
        nodeName: 'RepositoryController.ts',
        stage: 'Controller Handler',
        description: 'Parses query parameters, page limits, and filters',
        latencyMs: 5,
        protocol: 'Logic Execution',
        status: 'PROCESSING'
      },
      {
        nodeIdMatch: 'table',
        nodeName: 'repositories (SQL Table)',
        stage: 'Database Query',
        description: 'Executes indexed JOIN on repository files and commits',
        latencyMs: 28,
        protocol: 'PostgreSQL Pool',
        status: 'HYDRATED'
      },
      {
        nodeIdMatch: 'serializer',
        nodeName: 'JSON Serializer',
        stage: 'Client Response',
        description: 'Gzip compressed payload returned to browser with 200 OK',
        latencyMs: 6,
        protocol: 'HTTP 200 OK',
        status: 'DELIVERED'
      }
    ]
  },
  {
    id: 'journey-pipeline',
    title: 'End-to-End Pipeline Execution',
    description: 'Autonomous code analysis and workflow graph generation pipeline',
    category: 'journey',
    steps: [
      {
        nodeIdMatch: 'workflow',
        nodeName: 'Workflow Visualizer UI',
        stage: 'Trigger Analysis',
        description: 'User initiates interactive workflow synthesis and topology layout',
        latencyMs: 5,
        protocol: 'UI Event',
        status: 'INITIALIZED'
      },
      {
        nodeIdMatch: 'api',
        nodeName: 'GET /repositories/:id/workflow',
        stage: 'Ingress Gateway',
        description: 'Validates repository permissions and forwards to workflow service',
        latencyMs: 14,
        protocol: 'REST Endpoint',
        status: 'ACCEPTED'
      },
      {
        nodeIdMatch: 'workflowservice',
        nodeName: 'WorkflowService.ts',
        stage: 'Topology Synthesizer',
        description: 'Analyzes AST, extracts endpoints, routes, relations and computes Dagre layout',
        latencyMs: 45,
        protocol: 'DAG Layout',
        status: 'COMPUTED'
      },
      {
        nodeIdMatch: 'canvas',
        nodeName: 'Interactive Canvas Viewport',
        stage: 'Vector Rendering',
        description: 'Hydrates nodes, animated bezier edges, and cluster hulls in 60fps canvas',
        latencyMs: 12,
        protocol: 'WebGL / DOM',
        status: 'RENDERED'
      }
    ]
  }
];

interface FlowSimulatorBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  onClose: () => void;
}

export const FlowSimulatorBar: React.FC<FlowSimulatorBarProps> = ({
  isPlaying,
  onTogglePlay,
  currentStepIndex,
  onStepChange,
  selectedScenarioId,
  onSelectScenario,
  onClose
}) => {
  const currentScenario = SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];
  const steps = currentScenario.steps;
  const currentStep = steps[currentStepIndex] || steps[0];

  const cumulativeLatency = steps.slice(0, currentStepIndex + 1).reduce((acc, s) => acc + s.latencyMs, 0);

  return (
    <div className="absolute bottom-5 inset-x-4 max-w-4xl mx-auto bg-[#0a0f1e]/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 p-3.5 z-30 transition-all select-none animate-in slide-in-from-bottom duration-300">
      
      {/* Top Row: Scenario selector + Live status indicator + Close */}
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-800/80">
        
        {/* Left: Pulse Indicator & Scenario Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 relative" />
          </div>

          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Pulse Pipeline Simulator
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <select
              value={selectedScenarioId}
              onChange={(e) => {
                onSelectScenario(e.target.value);
                onStepChange(0);
              }}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-0.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {SIMULATION_SCENARIOS.map(sc => (
                <option key={sc.id} value={sc.id}>
                  {sc.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Metrics & Close */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Step: <strong className="text-white">{currentStep.latencyMs}ms</strong></span>
            <span className="text-slate-600">·</span>
            <span>Total: <strong className="text-cyan-300">{cumulativeLatency}ms</strong></span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Exit Flow Simulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Row: Stepper Progress & Active Step Telemetry */}
      <div className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Step Info */}
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              STEP {currentStepIndex + 1}/{steps.length}
            </span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {currentStep.stage}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-semibold text-white truncate">
              {currentStep.nodeName}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 ml-auto md:ml-0">
              {currentStep.status}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 font-mono leading-relaxed truncate">
            {currentStep.description}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
          <button
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 cursor-pointer transition-all active:scale-95"
            title={isPlaying ? 'Pause Simulation' : 'Start Automatic Simulation'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate</span>
              </>
            )}
          </button>

          <button
            onClick={() => onStepChange((currentStepIndex + 1) % steps.length)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 cursor-pointer transition-all"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStepChange(0)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white cursor-pointer transition-all"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Step Dots Progress */}
      <div className="flex items-center gap-1.5 pt-1">
        {steps.map((st, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <button
              key={idx}
              onClick={() => onStepChange(idx)}
              className="flex-1 h-1.5 rounded-full transition-all cursor-pointer relative group"
              style={{
                backgroundColor: isCurrent 
                  ? '#38bdf8' 
                  : isDone 
                  ? '#10b981' 
                  : 'rgba(51, 65, 85, 0.6)'
              }}
              title={`Step ${idx + 1}: ${st.nodeName}`}
            >
              {isCurrent && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400/40 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
