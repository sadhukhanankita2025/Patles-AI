import React from 'react';
import { ExternalLink, GitBranch, Star, Terminal, Code2, Globe, Smartphone, Layers } from 'lucide-react';
import { ProjectRecord, ProjectType } from '../types';
import { Button } from './Button';

interface ProjectCardProps {
  project: ProjectRecord;
  onOpen?: (project: ProjectRecord) => void;
  onViewCode?: (project: ProjectRecord) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpen,
  onViewCode
}) => {
  const getTypeIcon = (type: ProjectType) => {
    switch (type) {
      case 'website':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-purple-400" />;
      case 'fullstack':
        return <Layers className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getStatusBadge = (status: ProjectRecord['status']) => {
    switch (status) {
      case 'Live':
        return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 font-mono"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live</span>;
      case 'Ready':
        return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 font-mono"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Ready</span>;
      case 'Building':
        return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 font-mono"><span className="w-2 h-2 rounded-full bg-amber-400 animate-spin" /> Building</span>;
      case 'Failed':
        return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 font-mono"><span className="w-2 h-2 rounded-full bg-rose-400" /> Failed</span>;
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-[#0F172A]/70 border border-slate-800/80 hover:border-purple-500/40 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-purple-950/20 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
              {getTypeIcon(project.type)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                {project.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono">
                {project.modelUsed}
              </p>
            </div>
          </div>
          <div>
            {getStatusBadge(project.status)}
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        {/* Unboxed Metadata Line */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate max-w-[100px]">{project.branch}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="tabular-nums">{(project.linesOfCode ?? 0).toLocaleString()} LOC</span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {project.stars}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {onViewCode && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              leftIcon={<Code2 className="w-3.5 h-3.5" />}
              onClick={() => onViewCode(project)}
            >
              View Code
            </Button>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Open Live Preview"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
