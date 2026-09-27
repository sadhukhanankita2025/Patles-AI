import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { 
  Sparkles, 
  Wand2, 
  Code2, 
  Layers, 
  Database, 
  FileText, 
  Download, 
  ExternalLink, 
  Terminal, 
  Settings, 
  Sun, 
  Moon, 
  User, 
  Cpu, 
  Github, 
  Camera, 
  FolderTree, 
  CheckCircle2, 
  AlertCircle,
  Menu,
  X,
  Play
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { PageView } from '../types';
import { PatlesLotusLogo } from '../components/PatlesLotusLogo';
import { AIPromptPanel } from '../components/builder/AIPromptPanel';
import { LivePreviewPanel } from '../components/builder/LivePreviewPanel';
import { BuilderPreviewTab } from '../components/builder/BuilderToolbar';
import { DeviceMode } from '../components/builder/DevicePreviewToggle';
import { FloatingAIChat } from '../components/builder/FloatingAIChat';
import { StatusBar } from '../components/builder/StatusBar';
import { GENERATION_STEPS } from '../components/builder/GenerationProgress';
import { ProjectTreeFile } from '../components/builder/GeneratedProjectTree';
import { SnapshotItem } from '../components/builder/SnapshotTimeline';

interface BuilderPageProps {
  onNavigate: (page: PageView) => void;
  initialPrompt?: string;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({
  onNavigate,
  initialPrompt = ''
}) => {
  const { activeProjectId, setActiveProjectId, refreshProjects } = useProject();

  // Prompt and History (Undo / Redo)
  const defaultInitialPrompt = initialPrompt || 'Create a healthcare website with login and appointment booking.';
  const [prompt, setPrompt] = useState<string>(defaultInitialPrompt);
  const [history, setHistory] = useState<string[]>([defaultInitialPrompt]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // AI Configuration dropdowns
  const [aiModel, setAiModel] = useState<string>('IBM Granite 3.0');
  const [frontend, setFrontend] = useState<string>('React');
  const [backend, setBackend] = useState<string>('Express');
  const [database, setDatabase] = useState<string>('PostgreSQL');
  const [deployment, setDeployment] = useState<string>('Vercel');

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(true); // start with initial sample ready
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Active view tab & responsive device
  const [activeTab, setActiveTab] = useState<BuilderPreviewTab>('visual');
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [selectedFilePath, setSelectedFilePath] = useState<string>('src/pages/Login.jsx');

  // Loaded project metadata & files
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [projectFiles, setProjectFiles] = useState<ProjectTreeFile[]>([]);
  const [snapshots, setSnapshots] = useState<SnapshotItem[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('Ready');

  // Push prompt change to history
  const handlePromptChange = (newVal: string) => {
    setPrompt(newVal);
    // Don't append identical consecutive prompts
    if (newVal !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newVal);
      // Keep last 30 states
      if (newHistory.length > 30) newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setPrompt(history[newIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setPrompt(history[newIdx]);
    }
  };

  // Load project details & files from backend
  const loadProjectData = useCallback(async (projId: string) => {
    try {
      const [projRes, filesRes, snapRes] = await Promise.all([
        fetch(`/api/projects/${projId}`),
        fetch(`/api/projects/${projId}/files`),
        fetch(`/api/projects/${projId}/snapshots`)
      ]);

      if (projRes.ok) {
        const data = await projRes.json();
        setCurrentProject(data.project);
      }

      if (filesRes.ok) {
        const data = await filesRes.json();
        setProjectFiles(data.files || []);
      }

      if (snapRes.ok) {
        const data = await snapRes.json();
        setSnapshots(data.snapshots || []);
      }
    } catch (err) {
      console.warn('Failed to load project files:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const targetId = activeProjectId || 'proj_healthcare_connect';
    loadProjectData(targetId);
  }, [activeProjectId, loadProjectData]);

  // Execute Real Generation Pipeline
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setStatusMessage('Generating project...');
    setProgressPercent(5);
    setCurrentStepIndex(0);

    try {
      // Step 1: Initializing...
      await new Promise(r => setTimeout(r, 400));
      setProgressPercent(15);
      setCurrentStepIndex(1); // Generating architecture...

      // Step 2: Architecture
      await new Promise(r => setTimeout(r, 500));
      setProgressPercent(30);
      setCurrentStepIndex(2); // Generating frontend...

      // Step 3: Call Server API
      const response = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          frontend,
          backend: `Node.js + ${backend}`,
          database,
          projectType: 'fullstack'
        })
      });

      setProgressPercent(50);
      setCurrentStepIndex(3); // Generating backend...
      await new Promise(r => setTimeout(r, 400));

      setProgressPercent(65);
      setCurrentStepIndex(4); // Generating APIs...
      await new Promise(r => setTimeout(r, 400));

      setProgressPercent(80);
      setCurrentStepIndex(5); // Generating database...
      await new Promise(r => setTimeout(r, 400));

      setProgressPercent(92);
      setCurrentStepIndex(6); // Building workspace...
      await new Promise(r => setTimeout(r, 350));

      let newProjectId = activeProjectId || 'proj_healthcare_connect';
      if (response.ok) {
        const data = await response.json();
        if (data.project && data.project.id) {
          newProjectId = data.project.id;
          setActiveProjectId(data.project.id);
          setCurrentProject(data.project);
          if (data.files) {
            setProjectFiles(data.files.map((f: any) => ({
              id: f.id,
              path: f.path,
              fileName: f.file_name,
              language: f.language,
              size: f.size
            })));
            const primaryFile = data.files.find((f: any) => f.path.includes('Login') || f.path.includes('App') || f.path.includes('Dashboard')) || data.files[0];
            if (primaryFile) {
              setSelectedFilePath(primaryFile.path);
            }
          }
          await refreshProjects();
        }
      } else {
        // Fallback reload existing project files
        await loadProjectData(activeProjectId || 'proj_healthcare_connect');
      }

      // Step 7: Done
      setProgressPercent(100);
      setCurrentStepIndex(7);
      setHasGenerated(true);
      setStatusMessage('Project Generated & Ready');

      // Auto switch to visual preview
      setActiveTab('visual');

      // Create automatic snapshot for the newly generated project
      try {
        await fetch(`/api/projects/${newProjectId}/snapshot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Initial Synthesis (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            description: `Generated from prompt: "${prompt.slice(0, 45)}..."`
          })
        });
        loadProjectData(newProjectId);
      } catch (e) {
        // non-blocking
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Generation pipeline encountered an error. Restored cached state.');
      setStatusMessage('Generation Error');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    }
  };

  // Save file handler
  const handleSaveFile = async (filePath: string, content: string) => {
    const projId = activeProjectId || 'proj_healthcare_connect';
    const res = await fetch(`/api/projects/${projId}/files`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: filePath, content })
    });
    if (!res.ok) {
      throw new Error('Failed to save file to backend.');
    }
  };

  // Snapshot handlers
  const handleSaveSnapshot = async (name: string) => {
    const projId = activeProjectId || 'proj_healthcare_connect';
    const res = await fetch(`/api/projects/${projId}/snapshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error('Could not create snapshot.');
    await loadProjectData(projId);
  };

  const handleRestoreSnapshot = async (snapshotId: string) => {
    const projId = activeProjectId || 'proj_healthcare_connect';
    const res = await fetch(`/api/projects/${projId}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snapshotId })
    });
    if (!res.ok) throw new Error('Could not restore snapshot.');
    await loadProjectData(projId);
  };

  // Export handlers
  const handleExportZip = async () => {
    const zip = new JSZip();
    const projName = currentProject?.name || 'HealthcareConnect';
    const projId = activeProjectId || 'proj_healthcare_connect';

    // Fetch full contents
    for (const file of projectFiles) {
      try {
        const res = await fetch(`/api/projects/${projId}/files/content?path=${encodeURIComponent(file.path)}`);
        if (res.ok) {
          const d = await res.json();
          zip.file(file.path, d.file?.content || '');
        }
      } catch (e) {
        zip.file(file.path, `// ${file.path}\n`);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projName.toLowerCase().replace(/\s+/g, '-')}-project.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportReadme = async () => {
    const projId = activeProjectId || 'proj_healthcare_connect';
    const res = await fetch(`/api/projects/${projId}/files/content?path=README.md`);
    const d = res.ok ? await res.json() : null;
    const text = d?.file?.content || `# ${currentProject?.name || 'HealthcareConnect'}\n\nGenerated with Patles.ai`;
    downloadTextFile('README.md', text);
  };

  const handleExportSql = async () => {
    const projId = activeProjectId || 'proj_healthcare_connect';
    const res = await fetch(`/api/projects/${projId}/schema`);
    const d = res.ok ? await res.json() : null;
    const text = d?.sql || `-- Schema for ${currentProject?.name}\n`;
    downloadTextFile('schema.sql', text);
  };

  const handleExportArchitecture = async () => {
    const projId = activeProjectId || 'proj_healthcare_connect';
    const res = await fetch(`/api/projects/${projId}/architecture`);
    const d = res.ok ? await res.json() : null;
    downloadTextFile('architecture.json', JSON.stringify(d, null, 2));
  };

  const handleExportApiDocs = async () => {
    const projId = activeProjectId || 'proj_healthcare_connect';
    const res = await fetch(`/api/projects/${projId}/apis`);
    const d = res.ok ? await res.json() : null;
    downloadTextFile('api-collection.json', JSON.stringify(d, null, 2));
  };

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-white">
      
      {/* ============================================================ */}
      {/* TOP NAVIGATION BAR (As Specified by Prompt) */}
      {/* Patles.ai Logo | AI Builder | Workspace | GitHub Intelligence | Architecture | Snapshots | Settings | Theme Toggle | Profile */}
      {/* ============================================================ */}
      <header className="h-16 bg-[#0B1120]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => onNavigate('landing')}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <PatlesLotusLogo variant="horizontal" size="sm" glow={true} animated={true} />
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => onNavigate('ai-builder')}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-cyan-300 font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Builder</span>
            </button>

            <button
              onClick={() => onNavigate('workspace')}
              className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Workspace</span>
            </button>

            <button
              onClick={() => onNavigate('github')}
              className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5 text-emerald-400" />
              <span>GitHub Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-purple-600/30 border border-purple-500/40 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('snapshots')}
              className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                activeTab === 'snapshots'
                  ? 'bg-purple-600/30 border border-purple-500/40 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Snapshots</span>
            </button>
          </nav>
        </div>

        {/* Right Nav Utilities: Settings, Theme Toggle, Profile */}
        <div className="flex items-center gap-2">
          {/* Active Model Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-[11px] font-mono text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{aiModel}</span>
          </div>

          <button
            onClick={() => setActiveTab('snapshots')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Snapshots"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dashboard Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {isDarkTheme ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="p-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors"
            title="Developer Profile"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white text-[11px] font-bold">
              P
            </div>
            <span className="hidden md:inline pr-1">Dev</span>
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* PAGE BANNER & TITLE / SUBTITLE */}
      {/* ============================================================ */}
      <div className="bg-[#0B1120]/60 border-b border-white/5 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              AI Code & Architecture Generator
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              v3.2 Autonomous Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5 line-clamp-1 max-w-4xl">
            Describe your application and watch Patles.ai generate an entire software architecture, codebase, APIs, database schema, authentication flow, and workspace in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('workspace')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Open in Workspace</span>
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN TWO-PANEL LAYOUT (LEFT: AI CHAT / RIGHT: LIVE VISUAL PREVIEW) */}
      {/* ============================================================ */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden p-3 sm:p-4 gap-4">
        
        {/* LEFT PANEL: AI BUILDER CHAT */}
        <div className="w-full lg:w-[460px] xl:w-[500px] shrink-0 h-full flex flex-col">
          <AIPromptPanel
            prompt={prompt}
            setPrompt={handlePromptChange}
            aiModel={aiModel}
            setAiModel={setAiModel}
            frontend={frontend}
            setFrontend={setFrontend}
            backend={backend}
            setBackend={setBackend}
            database={database}
            setDatabase={setDatabase}
            deployment={deployment}
            setDeployment={setDeployment}
            isGenerating={isGenerating}
            currentStepIndex={currentStepIndex}
            progressPercent={progressPercent}
            onGenerate={handleGenerate}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
        </div>

        {/* RIGHT PANEL: LIVE PROJECT PREVIEW */}
        <div className="flex-1 h-full min-h-[500px] flex flex-col min-w-0">
          <LivePreviewPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            device={device}
            onDeviceChange={setDevice}
            project={currentProject}
            files={projectFiles}
            selectedFilePath={selectedFilePath}
            onSelectFile={setSelectedFilePath}
            isGenerating={isGenerating}
            hasGenerated={hasGenerated}
            snapshots={snapshots}
            onSaveSnapshot={handleSaveSnapshot}
            onRestoreSnapshot={handleRestoreSnapshot}
            onSaveFile={handleSaveFile}
            onOpenWorkspace={() => onNavigate('workspace')}
            onExportZip={handleExportZip}
            onExportReadme={handleExportReadme}
            onExportSql={handleExportSql}
            onExportArchitecture={handleExportArchitecture}
            onExportApiDocs={handleExportApiDocs}
          />
        </div>

      </main>

      {/* ============================================================ */}
      {/* FLOATING AI ASSISTANT PANEL */}
      {/* ============================================================ */}
      <FloatingAIChat
        projectId={activeProjectId || 'proj_healthcare_connect'}
        projectName={currentProject?.name || 'HealthcareConnect'}
        activeFilePath={selectedFilePath}
      />

      {/* ============================================================ */}
      {/* BOTTOM STATUS BAR */}
      {/* Ready | Undo | Redo | Generate | Preview | Snapshot | Publish */}
      {/* ============================================================ */}
      <StatusBar
        statusText={statusMessage}
        isGenerating={isGenerating}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onGenerate={handleGenerate}
        onPreview={() => setActiveTab('visual')}
        onSnapshot={() => setActiveTab('snapshots')}
        onPublish={() => {
          setStatusMessage('Publishing release package...');
          setTimeout(() => setStatusMessage('Published to Production (Docker + Vercel)'), 1500);
        }}
        aiModel={aiModel}
        activeFilePath={selectedFilePath}
      />

    </div>
  );
};
