import React from 'react';
import {
  LayoutDashboard,
  Wand2,
  FolderGit2,
  FolderKanban,
  MessageSquare,
  ShieldCheck,
  Bug,
  Server,
  FileCode2,
  Github,
  Workflow,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus
} from 'lucide-react';
import { PageView } from '../types';
import { PatlesLotusLogo } from './PatlesLotusLogo';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenNewProject: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onOpenNewProject,
  onLogout
}) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard' as PageView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-builder' as PageView, label: 'AI Builder', icon: Wand2, highlight: true },
    { id: 'my-projects' as PageView, label: 'My Projects', icon: FolderKanban },
    { id: 'workspace' as PageView, label: 'Workspace', icon: FolderGit2 },
    { id: 'ai-chat' as PageView, label: 'AI Assistant', icon: MessageSquare },
    { id: 'code-review' as PageView, label: 'Code Review', icon: ShieldCheck },
    { id: 'debugger' as PageView, label: 'Debugger', icon: Bug },
    { id: 'deployment' as PageView, label: 'Deployment', icon: Server },
    { id: 'documentation' as PageView, label: 'Documentation', icon: FileCode2 },
    { id: 'github-import' as PageView, label: 'GitHub Intelligence', icon: Github },
    { id: 'workflow' as PageView, label: 'Workflow', icon: Workflow },
    { id: 'profile' as PageView, label: 'Profile', icon: User },
  ];

  const displayName = user?.name || 'Developer';
  const displayEmail = user?.email || 'developer@patles.ai';
  const avatarLetter = (displayName.charAt(0) || 'D').toUpperCase();

  return (
    <aside 
      className={`h-screen sticky top-0 flex flex-col bg-[#0B1120] border-r border-slate-800/80 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 px-3.5 flex items-center justify-between border-b border-slate-800/80">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 overflow-hidden text-left focus:outline-none group p-1 transition-transform hover:scale-[1.02] cursor-pointer"
          title="Patles.ai"
        >
          {isCollapsed ? (
            <PatlesLotusLogo variant="icon" size="sm" glow={true} animated={true} />
          ) : (
            <PatlesLotusLogo variant="horizontal" size="sm" glow={true} animated={true} />
          )}
        </button>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <button
          onClick={onOpenNewProject}
          className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all cursor-pointer ${
            isCollapsed ? 'px-0' : 'px-3'
          }`}
          title="New AI Project"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">New Project</span>}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'github-import' && currentPage === 'github');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-purple-900/30 text-white border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${
                isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
              }`} />
              
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

      {/* User Profile & Logout Footer */}
      <div className="p-3 border-t border-slate-800/80">
        <div className={`flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
            {avatarLetter}
          </div>
          {!isCollapsed && (
            <div className="truncate flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {displayName}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate" title={displayEmail}>
                {displayEmail}
              </div>
            </div>
          )}
          {!isCollapsed && onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              title="Sign Out / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {isCollapsed && onLogout && (
          <button
            onClick={onLogout}
            className="w-full mt-2 flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Sign Out / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
