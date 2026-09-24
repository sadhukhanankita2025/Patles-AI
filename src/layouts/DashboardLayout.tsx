import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageView } from '../types';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Terminal, 
  HelpCircle, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/Button';
import { PatlesLotusLogo } from '../components/PatlesLotusLogo';

interface DashboardLayoutProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenNewProject: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPage,
  onNavigate,
  onOpenNewProject,
  children
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = (page: PageView) => {
    switch (page) {
      case 'dashboard':
        return 'Engineering Dashboard';
      case 'ai-builder':
        return 'AI Project Generator';
      case 'workspace':
        return 'Repositories & Workspaces';
      case 'ai-chat':
        return 'AI Architecture Assistant';
      case 'code-review':
        return 'Security & Code Review';
      case 'debugger':
        return 'AI Debugger & Root Cause Analysis';
      case 'deployment':
        return 'CI/CD & Deployment Validator';
      case 'documentation':
        return 'Automated Documentation Hub';
      case 'github-import':
        return 'GitHub Repository Importer';
      case 'profile':
        return 'Developer Profile & Settings';
      default:
        return 'Patles.ai Console';
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B1120] text-slate-100">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onOpenNewProject={onOpenNewProject}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-md" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <div className="relative z-10 w-64 bg-[#0B1120] border-r border-slate-800 h-full flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <PatlesLotusLogo variant="horizontal" size="sm" glow={true} animated={true} />
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              currentPage={currentPage}
              onNavigate={(page) => {
                onNavigate(page);
                setMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              onOpenNewProject={() => {
                onOpenNewProject();
                setMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header / Search Bar Contract */}
        <header className="sticky top-0 z-20 h-16 bg-[#0B1120]/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white md:hidden hover:bg-slate-800/80"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
              <button 
                onClick={() => onNavigate('dashboard')} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                Console
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-semibold truncate max-w-[150px] sm:max-w-none">
                {getPageTitle(currentPage)}
              </span>
            </div>
          </div>

          {/* Top Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, prompts, AST symbols, or docs (⌘K)..."
                className="w-full bg-slate-900/80 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>IBM Granite 3.0 Ready</span>
            </div>

            <button
              onClick={() => onNavigate('ai-chat')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
            </button>

            <Button
              variant="gradient"
              size="sm"
              onClick={onOpenNewProject}
              className="hidden sm:inline-flex text-xs px-3.5 py-2"
            >
              + Generate App
            </Button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
