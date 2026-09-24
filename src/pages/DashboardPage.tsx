import React, { useState } from 'react';
import { 
  ANALYTICS_METRICS, 
  RECENT_PROJECTS, 
  RECENT_ACTIVITIES, 
  AI_TIPS 
} from '../data/mockData';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { MetricsDashboard } from '../components/MetricsDashboard';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { ProjectRecord, ActivityItem, PageView } from '../types';
import { 
  Sparkles, 
  Plus, 
  Github, 
  Workflow,
  ShieldCheck, 
  Bug, 
  Terminal, 
  ExternalLink, 
  Code2, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  GitBranch,
  Layers,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: PageView) => void;
  onOpenNewProject: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenNewProject
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [tipIndex, setTipIndex] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');

  const currentTip = AI_TIPS[tipIndex];

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % AI_TIPS.length);
  };

  const handlePrevTip = () => {
    setTipIndex((prev) => (prev - 1 + AI_TIPS.length) % AI_TIPS.length);
  };

  const filteredProjects = RECENT_PROJECTS.filter((p) => {
    const matchesCategory = projectFilter === 'all' || p.type === projectFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: ProjectRecord['status']) => {
    switch (status) {
      case 'Live':
        return <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live</span>;
      case 'Ready':
        return <span className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Ready</span>;
      case 'Building':
        return <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-spin" /> Building</span>;
      case 'Failed':
        return <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Failed</span>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Welcome Card */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0F172A] border border-purple-500/30 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>IBM Granite 3.0 Model Cluster Online</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, Developer Alex 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your autonomous AI development platform is operating at peak performance. 4 repositories are ready for deployment and 0 critical vulnerabilities were found in your last PR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('workspace')}
              className="text-xs"
            >
              View Workspaces
            </Button>
            <Button
              variant="gradient"
              size="md"
              onClick={onOpenNewProject}
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs font-semibold shadow-lg shadow-purple-600/30"
            >
              New AI Project
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Analytics Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white tracking-tight">
            Developer Metrics & Synthesis Velocity
          </h2>
          <span className="text-xs font-mono text-slate-400">Past 30 Days</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ANALYTICS_METRICS.map((metric) => (
            <AnalyticsCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      {/* 3. Quick Actions Cards */}
      <div>
        <h2 className="text-base font-bold text-white tracking-tight mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={onOpenNewProject}
            className="p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-purple-500/50 text-left transition-all hover:bg-slate-900 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-purple-200">
              Generate Project
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Natural prompt to React, Node.js & SQL
            </p>
          </button>

          <button
            onClick={() => onNavigate('github-import')}
            className="p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-cyan-500/50 text-left transition-all hover:bg-slate-900 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Github className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-200">
              Import GitHub Repo
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Connect external git repo for AI analysis
            </p>
          </button>

          <button
            onClick={() => onNavigate('code-review')}
            className="p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-emerald-500/50 text-left transition-all hover:bg-slate-900 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-200">
              Run Code Review
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Scan pull requests for security and bugs
            </p>
          </button>

          <button
            onClick={() => onNavigate('debugger')}
            className="p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-rose-500/50 text-left transition-all hover:bg-slate-900 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Bug className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-rose-200">
              AI Debugger
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Paste stack trace for auto-remediation patch
            </p>
          </button>

        </div>
      </div>

      {/* 4. Live Metrics & Telemetry Dashboard (Active Project Growth & API Usage Trends via Recharts) */}
      <MetricsDashboard />

      {/* 5. Split Section: Recent Projects Table & AI Activity Timeline + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Recent Projects Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl">
            
            {/* Table Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">Recent Projects</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Managed and synthesized software repositories
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter projects..."
                    className="w-36 sm:w-44 bg-slate-900 text-xs text-slate-200 placeholder:text-slate-500 pl-8 pr-3 py-1.5 rounded-xl border border-slate-700/80 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                  {['all', 'website', 'mobile', 'fullstack'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setProjectFilter(type)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                        projectFilter === type
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400">
                    <th className="py-3 px-2 font-medium">PROJECT</th>
                    <th className="py-3 px-2 font-medium">MODEL</th>
                    <th className="py-3 px-2 font-medium">BRANCH</th>
                    <th className="py-3 px-2 font-medium">STATUS</th>
                    <th className="py-3 px-2 font-medium text-right">METRICS</th>
                    <th className="py-3 px-2 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredProjects.map((proj) => (
                    <tr 
                      key={proj.id}
                      className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedProject(proj)}
                    >
                      <td className="py-3.5 px-2">
                        <div className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate max-w-[180px]">
                          {proj.name}
                        </div>
                        <div className="text-[11px] text-slate-400 capitalize font-mono">
                          {proj.type}
                        </div>
                      </td>

                      <td className="py-3.5 px-2 font-mono text-slate-300">
                        {proj.modelUsed}
                      </td>

                      <td className="py-3.5 px-2 font-mono text-slate-400">
                        <div className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[100px]">{proj.branch}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-2">
                        {getStatusBadge(proj.status)}
                      </td>

                      <td className="py-3.5 px-2 text-right font-mono text-slate-300 tabular-nums">
                        {(proj.linesOfCode ?? 0).toLocaleString()} LOC
                      </td>

                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(proj);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-mono text-[11px] transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProjects.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-400">
                  No projects match your filter.
                </div>
              )}
            </div>

            {/* Table Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Showing {filteredProjects.length} projects</span>
              <button 
                onClick={onOpenNewProject}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Generate Another Repository</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: Recent AI Activity Timeline + AI Tips Widget (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Activity Timeline */}
          <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-bold text-white">
                  Recent AI Activity
                </h2>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Live Feed</span>
            </div>

            <ActivityTimeline
              activities={RECENT_ACTIVITIES}
              onSelectActivity={(act) => setSelectedActivity(act)}
            />
          </div>

          {/* AI Tips Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-[#0F172A] border border-indigo-500/30 shadow-xl backdrop-blur-xl relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>AI Engineering Tip #{tipIndex + 1}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevTip}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  aria-label="Previous tip"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextTip}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  aria-label="Next tip"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-2">
              {currentTip.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTip.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Category: {currentTip.category}</span>
              <span>{currentTip.readTime}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Project Inspector Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.name}
          description={`Architecture: ${selectedProject.type.toUpperCase()} · Synthesized with ${selectedProject.modelUsed}`}
          maxWidth="xl"
        >
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedProject.description}
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-400">Branch:</span>
                <p className="text-white font-semibold mt-0.5">{selectedProject.branch}</p>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>
                <p className="text-emerald-400 font-semibold mt-0.5">{selectedProject.status}</p>
              </div>
              <div>
                <span className="text-slate-400">Lines of Code:</span>
                <p className="text-white font-semibold mt-0.5">{(selectedProject.linesOfCode ?? 0).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400">Last Synced:</span>
                <p className="text-slate-300 mt-0.5">{selectedProject.updatedAt}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProject(null);
                  onNavigate('workflow');
                }}
                leftIcon={<Workflow className="w-3.5 h-3.5 text-cyan-400" />}
                className="text-xs font-mono"
              >
                View Project Workflow
              </Button>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => {
                  setSelectedProject(null);
                  onNavigate('ai-builder');
                }}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open in AI Builder
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Activity Details Modal */}
      {selectedActivity && (
        <Modal
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          title={selectedActivity.action}
          description={`Timestamp: ${selectedActivity.timestamp}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
              <div>
                <span className="text-slate-400">Target Resource:</span>
                <p className="text-white font-semibold mt-0.5">{selectedActivity.target}</p>
              </div>
              <div>
                <span className="text-slate-400">Reasoning Model:</span>
                <p className="text-cyan-400 mt-0.5">{selectedActivity.model}</p>
              </div>
              <div>
                <span className="text-slate-400">Inference Latency:</span>
                <p className="text-emerald-400 mt-0.5">{selectedActivity.duration}</p>
              </div>
              <div>
                <span className="text-slate-400">Execution Status:</span>
                <p className="text-slate-200 mt-0.5 capitalize">{selectedActivity.status}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedActivity(null)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
