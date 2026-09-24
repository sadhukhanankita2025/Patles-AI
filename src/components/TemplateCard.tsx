import React from 'react';
import { Star, GitFork, ArrowRight, Eye, Code, HeartPulse, ShoppingBag, GraduationCap, Briefcase, Landmark } from 'lucide-react';
import { TemplateItem } from '../types';
import { Button } from './Button';

interface TemplateCardProps {
  template: TemplateItem;
  onUseTemplate: (template: TemplateItem) => void;
  onPreview: (template: TemplateItem) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onUseTemplate,
  onPreview
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Healthcare':
        return <HeartPulse className="w-5 h-5 text-cyan-400" />;
      case 'E-Commerce':
        return <ShoppingBag className="w-5 h-5 text-purple-400" />;
      case 'Education':
        return <GraduationCap className="w-5 h-5 text-blue-400" />;
      case 'Portfolio':
        return <Briefcase className="w-5 h-5 text-emerald-400" />;
      case 'Finance':
        return <Landmark className="w-5 h-5 text-amber-400" />;
      default:
        return <Code className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="group rounded-3xl bg-[#0F172A]/70 border border-slate-800/80 hover:border-purple-500/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/30 flex flex-col justify-between">
      {/* Visual Header / Preview Area */}
      <div className={`relative h-44 w-full bg-gradient-to-br ${template.previewColor} p-6 flex flex-col justify-between border-b border-slate-800/70 overflow-hidden`}>
        {/* Subtle grid pattern inside header */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/60 text-xs font-semibold text-slate-200">
            {getCategoryIcon(template.category)}
            <span>{template.category}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1 font-mono">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {template.stars}
            </span>
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <GitFork className="w-3.5 h-3.5" />
              {template.forks}
            </span>
          </div>
        </div>

        {/* Dynamic preview wireframe visualization */}
        <div className="relative z-10 p-3 rounded-2xl bg-[#0B1120]/80 border border-slate-700/50 backdrop-blur-md transform group-hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="truncate">{template.title}</span>
            <span className="text-cyan-400 font-semibold">Ready</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="h-1.5 rounded bg-slate-700/60" />
            <div className="h-1.5 rounded bg-purple-500/40" />
            <div className="h-1.5 rounded bg-cyan-500/40" />
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
            {template.title}
          </h3>
          
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
            {template.description}
          </p>

          {/* Highlights */}
          <div className="mt-4 space-y-1.5">
            {template.highlights.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-cyan-400">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Tech Stack Unboxed Metadata */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            {template.techStack.map((tech) => (
              <span 
                key={tech}
                className="px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            leftIcon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => onPreview(template)}
          >
            Preview
          </Button>

          <Button
            variant="gradient"
            size="sm"
            className="flex-1 text-xs"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => onUseTemplate(template)}
          >
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
};
