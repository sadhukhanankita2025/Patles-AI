import React from 'react';
import { 
  Layout, 
  Cpu, 
  ShieldCheck, 
  Bug, 
  Server, 
  FileText, 
  ArrowUpRight 
} from 'lucide-react';
import { FeatureItem } from '../types';

interface FeatureCardProps {
  feature: FeatureItem;
  onSelect?: (feature: FeatureItem) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onSelect }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Layout':
        return <Layout className="w-6 h-6 text-purple-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'Bug':
        return <Bug className="w-6 h-6 text-rose-400" />;
      case 'ServerCheck':
        return <Server className="w-6 h-6 text-blue-400" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-indigo-400" />;
      default:
        return <Layout className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(feature)}
      className="group relative p-6 sm:p-7 rounded-3xl bg-[#0F172A]/70 border border-slate-800/80 hover:border-purple-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 cursor-pointer flex flex-col justify-between"
    >
      {/* Soft gradient glow on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div>
        {/* Card Header: Icon & Category */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
            {getIcon(feature.iconName)}
          </div>
          
          {/* Clean unboxed metadata with divider */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{feature.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-cyan-400">{feature.badgeText}</span>
          </div>
        </div>

        {/* Feature Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors tracking-tight flex items-center justify-between">
          <span>{feature.title}</span>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Footer Metrics */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="text-slate-400">Benchmark:</span>
        <span className="text-slate-200 font-medium">{feature.metrics}</span>
      </div>
    </div>
  );
};
