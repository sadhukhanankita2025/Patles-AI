import React from 'react';
import {
  LayoutDashboard,
  Wand2,
  FolderGit2,
  FolderKanban,
  Server,
  FileCode2,
  Github,
  Workflow,
  User,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { PageView } from '../types';
import { PatlesLotusLogo } from './PatlesLotusLogo';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenNewProject: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onOpenNewProject
}) => {
  const menuItems = [
    { id: 'dashboard' as PageView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-builder' as PageView, label: 'AI Builder', icon: Wand2, highlight: true },
    { id: 'my-projects' as PageView, label: 'My Projects', icon: FolderKanban },
    { id: 'workspace' as PageView, label: 'Workspace', icon: FolderGit2 },
    { id: 'deployment' as PageView, label: 'Deployment', icon: Server },
    { id: 'documentation' as PageView, label: 'Documentation', icon: FileCode2 },
    { id: 'github-import' as PageView, label: 'GitHub Intelligence', icon: Github },
    { id: 'workflow' as PageView, label: 'Workflow', icon: Workflow },
    { id: 'profile' as PageView, label: 'Profile', icon: User },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col bg-[#0B1120] border-r border-slate-800/80 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="h-20 px-3.5 flex items-center justify-between border-b border-slate-800/80">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 overflow-hidden text-left group p-1 transition-transform hover:scale-[1.02]"
          title="Patles.ai"
        >
          {isCollapsed ? (
            <PatlesLotusLogo variant="icon" size="sm" glow animated />
          ) : (
            <PatlesLotusLogo variant="horizontal" size="sm" glow animated />
          )}
        </button>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* New Project Button */}
      <div className="p-3">
        <button
          onClick={onOpenNewProject}
          className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl 
          bg-linear-to-r from-purple-600 to-indigo-600 
          hover:from-purple-500 hover:to-indigo-500 
          text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all ${
            isCollapsed ? 'px-0' : 'px-3'
          }`}
          title="New AI Project"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">New Project</span>}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id ||
            (item.id === 'github-import' && currentPage === 'github');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-purple-900/30 text-white border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-slate-400 group-hover:text-slate-300'
                }`}
              />

              {!isCollapsed && (
                <span className="truncate flex-1 text-left">
                  {item.label}
                </span>
              )}

              {item.highlight && !isCollapsed && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/80">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
            P
          </div>

          {!isCollapsed && (
            <div className="truncate flex-1">
              <div className="text-xs font-semibold text-white truncate">
                Alex Chen
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                Pro Developer
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};