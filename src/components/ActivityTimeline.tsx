import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ArrowUpRight, Cpu } from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivityTimelineProps {
  activities: ActivityItem[];
  onSelectActivity?: (item: ActivityItem) => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  onSelectActivity
}) => {
  const getStatusIcon = (status: ActivityItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-cyan-400 animate-spin" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'queued':
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {activities.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelectActivity && onSelectActivity(item)}
            className="relative group cursor-pointer"
          >
            {/* Timeline bullet */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#0B1120] border border-slate-700 flex items-center justify-center group-hover:border-purple-400 transition-colors">
              {getStatusIcon(item.status)}
            </div>

            {/* Content box */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 group-hover:border-purple-500/40 transition-all hover:bg-slate-900/90">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-white group-hover:text-purple-200">
                  {item.action}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 truncate">
                {item.target}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Cpu className="w-3 h-3" />
                  {item.model}
                </span>
                <span className="tabular-nums">
                  Duration: {item.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
