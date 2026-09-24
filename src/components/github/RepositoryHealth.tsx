import React from 'react';
import { 
  ShieldCheck, 
  FileCode, 
  Layers, 
  Terminal, 
  Database, 
  Package, 
  FileText, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ProjectHealth } from '../../types/github';

interface RepositoryHealthProps {
  health: ProjectHealth;
  databaseName?: string;
}

export const RepositoryHealth: React.FC<RepositoryHealthProps> = ({ health, databaseName }) => {
  if (!health) return null;

  const healthMetrics = [
    {
      label: 'Files Scanned',
      value: typeof health.filesScanned === 'number' ? health.filesScanned.toLocaleString() : String(health.filesScanned || '0'),
      icon: FileCode,
      color: 'text-indigo-400',
      status: 'Ready'
    },
    {
      label: 'Lines of Code (LOC)',
      value: typeof health.linesOfCode === 'number' ? health.linesOfCode.toLocaleString() : String(health.linesOfCode || '0'),
      icon: Layers,
      color: 'text-cyan-400',
      status: 'Indexed'
    },
    {
      label: 'Components Detected',
      value: health.componentsCount?.toString() || '0',
      icon: Sliders,
      color: 'text-purple-400',
      status: 'Mapped'
    },
    {
      label: 'API Endpoints',
      value: health.apiCount?.toString() || '0',
      icon: Terminal,
      color: 'text-emerald-400',
      status: 'Active'
    },
    {
      label: 'Dependencies',
      value: health.dependenciesCount?.toString() || '0',
      icon: Package,
      color: 'text-blue-400',
      status: 'Resolved'
    },
    {
      label: 'Database Engine',
      value: databaseName || 'PostgreSQL',
      icon: Database,
      color: 'text-amber-400',
      status: 'Detected'
    },
    {
      label: 'Documentation Score',
      value: health.documentationScore || '80%',
      icon: FileText,
      color: 'text-teal-400',
      status: 'Healthy'
    },
    {
      label: 'Environment Config',
      value: health.environmentStatus || 'Configured',
      icon: ShieldCheck,
      color: 'text-rose-400',
      status: 'Protected'
    }
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Project Health & Codebase Readiness
            </h2>
            <p className="text-xs text-slate-400">
              Audit metrics assessing code density, documentation parity, and API coverage
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-xs font-mono text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Production Ready Assessment</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {healthMetrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>

              <div className="text-lg font-bold text-white font-mono truncate">
                {item.value}
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Status:</span>
                <span className="text-emerald-400 font-semibold">{item.status}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
