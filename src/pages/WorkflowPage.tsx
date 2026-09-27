import React from 'react';
import { PageView } from '../types';

interface WorkflowPageProps {
  repositoryId?: string;
  onNavigate: (page: PageView) => void;
  onBackToRepo: () => void;
}

export const WorkflowPage: React.FC<WorkflowPageProps> = () => {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-6">

      {/* Main Container */}
      <div
        className="
          flex w-full max-w-6xl items-center justify-center
          min-h-[420px] lg:min-h-[calc(100vh-10rem)]
          rounded-2xl border border-slate-800/90
          bg-[#070b16]/95 shadow-2xl
        "
      >
        <span className="text-sm text-slate-300">
          Workflow Canvas
        </span>
      </div>

      {/* Secondary Panel */}
      <div
        className="
          flex w-full max-w-6xl items-center justify-center
          min-h-[280px] lg:min-h-[360px]
          rounded-xl border border-slate-800/90
          bg-slate-900/90 shadow-2xl
        "
      >
        <span className="text-sm text-slate-400">
          Secondary Panel
        </span>
      </div>

    </div>
  );
};

export default WorkflowPage;