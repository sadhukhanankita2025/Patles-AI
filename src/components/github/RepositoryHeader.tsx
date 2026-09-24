import React from 'react';
import { 
  Github, 
  GitBranch, 
  ExternalLink, 
  GitCommit, 
  Clock, 
  Sparkles, 
  RefreshCw,
  Workflow,
  Network
} from 'lucide-react';
import { GitHubRepoMetadata } from '../../types/github';
import { Button } from '../Button';

interface RepositoryHeaderProps {
  metadata: GitHubRepoMetadata;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onViewWorkflow?: () => void;
  onViewFileAnalysis?: () => void;
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  metadata,
  onRefresh,
  isRefreshing,
  onViewWorkflow,
  onViewFileAnalysis
}) => {
  return (
    <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Repo Title, Owner, Badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-cyan-400">
              <Github className="w-3.5 h-3.5" />
              <span>{metadata.owner}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/60 text-xs font-mono text-purple-300">
              <GitBranch className="w-3 h-3 text-purple-400" />
              <span>{metadata.defaultBranch}</span>
            </div>

            {metadata.latestCommitSha && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-400">
                <GitCommit className="w-3 h-3 text-emerald-400" />
                <span className="text-slate-300 font-semibold">{metadata.latestCommitSha}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {metadata.name}
            </h1>
            <a
              href={metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Open in GitHub"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {metadata.description || 'No description provided for this repository.'}
          </p>

          {metadata.latestCommitMessage && (
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2 pt-1">
              <span className="text-slate-500">Latest commit:</span>
              <span className="text-slate-300 truncate max-w-md">"{metadata.latestCommitMessage}"</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onViewFileAnalysis && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewFileAnalysis}
              leftIcon={<Network className="w-3.5 h-3.5 text-cyan-400" />}
              className="text-xs font-mono border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-white"
            >
              File Analysis
            </Button>
          )}

          {onViewWorkflow && (
            <Button
              variant="gradient"
              size="sm"
              onClick={onViewWorkflow}
              leftIcon={<Workflow className="w-3.5 h-3.5 text-cyan-300" />}
              className="text-xs font-mono shadow-lg shadow-purple-900/40"
            >
              View Project Workflow
            </Button>
          )}

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isRefreshing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs font-mono"
            >
              Re-Scan
            </Button>
          )}

          <a
            href={metadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>

      </div>
    </div>
  );
};
