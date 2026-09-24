import React from 'react';
import { Boxes, GitBranch, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';
import { AnalyticsMetric } from '../types';

interface AnalyticsCardProps {
  metric: AnalyticsMetric;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ metric }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Boxes':
        return <Boxes className="w-5 h-5 text-purple-400" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-indigo-400" />;
      default:
        return <Boxes className="w-5 h-5 text-purple-400" />;
    }
  };

  // Generate SVG path for sparkline
  const max = Math.max(...metric.sparkline);
  const min = Math.min(...metric.sparkline);
  const range = max - min || 1;
  const width = 120;
  const height = 36;
  const points = metric.sparkline.map((val, idx) => {
    const x = (idx / (metric.sparkline.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="p-6 rounded-3xl bg-[#0F172A]/70 border border-slate-800/80 hover:border-purple-500/40 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-purple-950/20 group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:scale-105 transition-transform">
          {getIcon(metric.iconName)}
        </div>
        
        {/* Subtle trend indicator */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{metric.change}</span>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-medium text-slate-400">
          {metric.title}
        </h4>
        <div className="text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
          {metric.value}
        </div>
      </div>

      {/* Sparkline & Timeframe Footer */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">
          {metric.timeframe}
        </span>

        {/* Mini SVG Sparkline */}
        <div className="w-24 h-7">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke="#A855F7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
