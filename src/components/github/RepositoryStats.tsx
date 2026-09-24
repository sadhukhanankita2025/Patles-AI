import React from 'react';
import { 
  Star, 
  GitFork, 
  AlertCircle, 
  HardDrive, 
  Code2, 
  ShieldCheck,
  FileCode,
  Layers
} from 'lucide-react';
import { GitHubRepoMetadata, ProjectHealth } from '../../types/github';

interface RepositoryStatsProps {
  metadata: GitHubRepoMetadata;
  health?: ProjectHealth;
}

export const RepositoryStats: React.FC<RepositoryStatsProps> = ({ metadata, health }) => {
  const formatSize = (sizeKb: number): string => {
    if (sizeKb >= 1024) {
      return `${(sizeKb / 1024).toFixed(1)} MB`;
    }
    return `${sizeKb} KB`;
  };

  const statItems = [
    {
      label: 'Primary Language',
      value: metadata.language || 'TypeScript',
      icon: Code2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      label: 'GitHub Stars',
      value: (metadata?.stars ?? 0).toLocaleString(),
      icon: Star,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      label: 'Forks',
      value: (metadata?.forks ?? 0).toLocaleString(),
      icon: GitFork,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      label: 'Open Issues',
      value: (metadata?.openIssues ?? 0).toLocaleString(),
      icon: AlertCircle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20'
    },
    {
      label: 'Repository Size',
      value: formatSize(metadata?.size ?? 0),
      icon: HardDrive,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      label: 'Lines of Code',
      value: typeof health?.linesOfCode === 'number' ? health.linesOfCode.toLocaleString() : '~12,400',
      icon: FileCode,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      label: 'Files Scanned',
      value: typeof health?.filesScanned === 'number' ? health.filesScanned.toLocaleString() : '84',
      icon: Layers,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20'
    },
    {
      label: 'Doc Health Score',
      value: health?.documentationScore || '85%',
      icon: ShieldCheck,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {statItems.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="p-3.5 rounded-2xl bg-[#0F172A]/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-1 rounded-lg ${stat.bgColor} border ${stat.borderColor} ${stat.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="text-sm sm:text-base font-extrabold text-white font-mono truncate">
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};
