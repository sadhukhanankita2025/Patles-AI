import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart
} from 'recharts';
import {
  PROJECT_GROWTH_7D,
  PROJECT_GROWTH_30D,
  PROJECT_GROWTH_90D,
  API_USAGE_7D,
  API_USAGE_30D,
  API_USAGE_90D,
  METRICS_SUMMARY,
  ProjectGrowthDataPoint,
  ApiUsageDataPoint
} from '../data/metricsData';
import {
  TrendingUp,
  Activity,
  Zap,
  Layers,
  Server,
  Cpu,
  Clock,
  Sparkles,
  CheckCircle,
  BarChart3,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

type Timeframe = '7D' | '30D' | '90D';
type ProjectChartMode = 'cumulative' | 'breakdown' | 'velocity';
type ApiChartMode = 'models' | 'tokensLatency';

export const MetricsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('30D');
  const [projectChartMode, setProjectChartMode] = useState<ProjectChartMode>('cumulative');
  const [apiChartMode, setApiChartMode] = useState<ApiChartMode>('models');

  // Select project data based on timeframe
  const projectData: ProjectGrowthDataPoint[] = 
    timeframe === '7D' ? PROJECT_GROWTH_7D :
    timeframe === '30D' ? PROJECT_GROWTH_30D : PROJECT_GROWTH_90D;

  // Select API usage data based on timeframe
  const apiData: ApiUsageDataPoint[] = 
    timeframe === '7D' ? API_USAGE_7D :
    timeframe === '30D' ? API_USAGE_30D : API_USAGE_90D;

  const latestProjectPoint = projectData[projectData.length - 1];
  const latestApiPoint = apiData[apiData.length - 1];

  // Custom Glassmorphic Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl text-xs z-50 min-w-[190px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-mono text-slate-300 font-bold">{label}</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
              Telemetry
            </span>
          </div>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={`entry-${index}`} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                    style={{ backgroundColor: entry.color || entry.fill || entry.stroke }}
                  />
                  <span>{entry.name}:</span>
                </span>
                <span className="font-mono font-semibold text-white">
                  {typeof entry.value === 'number' && typeof entry.value.toLocaleString === 'function'
                    ? entry.value.toLocaleString()
                    : (entry.value ?? '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar with Timeframe selector & Live Status */}
      <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Live Metrics & Telemetry Dashboard
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Feed
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time telemetry measuring active repository growth, model synthesis volume, and token throughput
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              {(['7D', '30D', '90D'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                    timeframe === tf
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick KPI Stat Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          {METRICS_SUMMARY.map((metric, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 font-medium">{metric.label}</span>
                <span className="inline-flex items-center text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {metric.change}
                </span>
              </div>
              <div className="text-lg font-extrabold text-white font-mono tracking-tight">
                {metric.value}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {metric.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizations Grid: 2 Large Interactive Recharts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Active Project Growth Chart */}
        <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            {/* Chart Header & Mode Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    Active Project Growth
                    <span className="text-[10px] font-mono font-normal text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-800/50">
                      +{timeframe === '7D' ? '71.4%' : timeframe === '30D' ? '271%' : '766%'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Cumulative managed repos & active edge deployments
                  </p>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setProjectChartMode('cumulative')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    projectChartMode === 'cumulative'
                      ? 'bg-purple-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Growth
                </button>
                <button
                  onClick={() => setProjectChartMode('breakdown')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    projectChartMode === 'breakdown'
                      ? 'bg-purple-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Categories
                </button>
                <button
                  onClick={() => setProjectChartMode('velocity')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    projectChartMode === 'velocity'
                      ? 'bg-purple-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Velocity
                </button>
              </div>
            </div>

            {/* Recharts Area / Bar Container */}
            <div className="h-68 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {projectChartMode === 'cumulative' ? (
                  <AreaChart data={projectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="activeProjectsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="deploymentsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Area
                      type="monotone"
                      name="Active Projects"
                      dataKey="activeProjects"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#activeProjectsGrad)"
                      activeDot={{ r: 5, stroke: '#fff', strokeWidth: 1.5, fill: '#a855f7' }}
                    />
                    <Area
                      type="monotone"
                      name="Live Deployments"
                      dataKey="deployments"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#deploymentsGrad)"
                      activeDot={{ r: 4, stroke: '#fff', strokeWidth: 1.5, fill: '#06b6d4' }}
                    />
                  </AreaChart>
                ) : projectChartMode === 'breakdown' ? (
                  <BarChart data={projectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Bar dataKey="fullstack" name="Full-Stack Apps" stackId="a" fill="#a855f7" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="websites" name="Websites / Portals" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="mobile" name="Mobile / PWAs" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <BarChart data={projectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Bar
                      dataKey="newProjects"
                      name="New Projects / Period"
                      fill="#8b5cf6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Telemetry Meta Cards */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-center font-mono">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Total Active</span>
              <span className="text-sm font-bold text-purple-400">{latestProjectPoint?.activeProjects ?? 0} Repos</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Live Deploys</span>
              <span className="text-sm font-bold text-cyan-400">{latestProjectPoint?.deployments ?? 0} Live</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Deploy Ratio</span>
              <span className="text-sm font-bold text-emerald-400">
                {latestProjectPoint && latestProjectPoint.activeProjects > 0
                  ? Math.round((latestProjectPoint.deployments / latestProjectPoint.activeProjects) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* 2. Recent API Usage Trends Chart */}
        <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            {/* Chart Header & Mode Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    Recent API Usage Trends
                    <span className="text-[10px] font-mono font-normal text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-800/50">
                      {(latestApiPoint?.totalCalls ?? 0).toLocaleString()} Calls/Day
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Model inference distribution, token throughput & edge latency
                  </p>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setApiChartMode('models')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    apiChartMode === 'models'
                      ? 'bg-cyan-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  By Model
                </button>
                <button
                  onClick={() => setApiChartMode('tokensLatency')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    apiChartMode === 'tokensLatency'
                      ? 'bg-cyan-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tokens & Latency
                </button>
              </div>
            </div>

            {/* Recharts API Container */}
            <div className="h-68 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {apiChartMode === 'models' ? (
                  <AreaChart data={apiData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="geminiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="graniteGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="claudeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Area
                      type="monotone"
                      name="Gemini 3.8 Flash"
                      dataKey="geminiCalls"
                      stackId="1"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#geminiGrad)"
                    />
                    <Area
                      type="monotone"
                      name="IBM Granite 3.0"
                      dataKey="graniteCalls"
                      stackId="1"
                      stroke="#818cf8"
                      strokeWidth={1.8}
                      fillOpacity={1}
                      fill="url(#graniteGrad)"
                    />
                    <Area
                      type="monotone"
                      name="Claude 3.7 Sonnet"
                      dataKey="claudeCalls"
                      stackId="1"
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#claudeGrad)"
                    />
                  </AreaChart>
                ) : (
                  <ComposedChart data={apiData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}M`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                      domain={[100, 200]}
                      tickFormatter={(v) => `${v}ms`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="tokensK"
                      name="Tokens (kilo-tokens)"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgLatencyMs"
                      name="Latency (ms)"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      dot={{ r: 4, stroke: '#fff', strokeWidth: 1.5, fill: '#f43f5e' }}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Telemetry Meta Cards */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-center font-mono">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Peak Speed</span>
              <span className="text-sm font-bold text-cyan-400">{latestApiPoint?.avgLatencyMs ?? 0} ms</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Success Rate</span>
              <span className="text-sm font-bold text-emerald-400">{latestApiPoint?.successRate ?? 0}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Gemini Share</span>
              <span className="text-sm font-bold text-sky-400">
                {latestApiPoint && latestApiPoint.totalCalls > 0
                  ? Math.round((latestApiPoint.geminiCalls / latestApiPoint.totalCalls) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Model Clusters & Hardware Engine Status */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/20 via-slate-900/70 to-cyan-950/20 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-white font-semibold">Gemini 3.8 Flash Cluster:</span>
            <span className="text-emerald-400">Operational (120 tok/s)</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-slate-300 hidden sm:flex">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white font-semibold">Edge Gateway:</span>
            <span className="text-cyan-400">0.02% error rate</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Telemetry sync: Every 30s</span>
        </div>
      </div>

    </div>
  );
};
