import React from 'react';
import { PageView } from '../types';
import { Button } from '../components/Button';
import { GitHubIntelligencePage } from './GitHubIntelligencePage';
import { 
  FolderGit2, 
  Server, 
  FileCode2, 
  User
} from 'lucide-react';

interface SubModulesPageProps {
  page: PageView;
  onNavigate: (page: PageView) => void;
  onOpenNewProject: () => void;
}

export const SubModulesPage: React.FC<SubModulesPageProps> = ({
  page,
  onNavigate,
  onOpenNewProject
}) => {
  /* Render Sub-Views */
  switch (page) {
    case 'workspace':
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white">Active Workspaces</h1>
              <p className="text-xs text-slate-400 mt-0.5">Isolated runtime environments and persistent branches</p>
            </div>
            <Button variant="gradient" size="sm" onClick={onOpenNewProject}>
              + Create Workspace
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">production-cluster-01</span>
                <span className="text-xs text-emerald-400 font-mono">Running (Node 22)</span>
              </div>
              <p className="text-xs text-slate-400">Hosting 4 active microservices with PostgreSQL replication.</p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>CPU: 18% · RAM: 2.1 GB</span>
                <span className="text-cyan-400 cursor-pointer">Configure →</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">staging-sandbox-beta</span>
                <span className="text-xs text-cyan-400 font-mono">Idle (Hot-Standby)</span>
              </div>
              <p className="text-xs text-slate-400">Ephemeral branch testing for pull requests.</p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>CPU: 4% · RAM: 820 MB</span>
                <span className="text-cyan-400 cursor-pointer">Configure →</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'deployment':
      return (
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Server className="w-6 h-6 text-blue-400" />
              <span>Deployment & Pre-flight Validator</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Inspect build containers, environment secrets, and edge clusters</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">US-East Cluster</div>
              <div className="text-xl font-bold text-white font-mono mt-1">Healthy</div>
              <span className="text-[11px] text-emerald-400 font-mono">99.99% Uptime</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">EU-Central Cluster</div>
              <div className="text-xl font-bold text-white font-mono mt-1">Healthy</div>
              <span className="text-[11px] text-emerald-400 font-mono">99.98% Uptime</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">AP-Southeast Cluster</div>
              <div className="text-xl font-bold text-white font-mono mt-1">Healthy</div>
              <span className="text-[11px] text-emerald-400 font-mono">100% Uptime</span>
            </div>
          </div>
        </div>
      );

    case 'documentation':
      return (
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-6 h-6 text-indigo-400" />
              <span>Automated Documentation Generator</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">OpenAPI 3.1 specifications and typed Markdown documentation synced with your codebase</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-mono text-xs text-cyan-400">openapi-spec.json (v3.1.0)</span>
              <Button variant="outline" size="sm">Export Swagger</Button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-300">
              <div>openapi: 3.1.0</div>
              <div>info: Patles REST API</div>
              <div>paths:</div>
              <div className="pl-4">/api/v1/health: [GET] 200 OK</div>
              <div className="pl-4">/api/v1/records: [POST, GET] 201 Created</div>
            </div>
          </div>
        </div>
      );

    case 'github-import':
    case 'github':
      return <GitHubIntelligencePage onNavigate={onNavigate} />;

    case 'profile':
      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-purple-400" />
              <span>Developer Profile & Credentials</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Manage subscription, model permissions, and API secrets</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xl">
                A
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Alex Chen</h3>
                <p className="text-xs text-slate-400 font-mono">sadhukhanankita80@gmail.com</p>
                <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Pro Plan Active</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">API Key:</span>
                <p className="text-slate-200 mt-1">pk_live_••••••••••••••••</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">Model Quota:</span>
                <p className="text-emerald-400 mt-1">Unlimited Pro Tier</p>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
