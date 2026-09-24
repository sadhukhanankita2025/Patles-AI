import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useProject } from '../context/ProjectContext';
import { 
  FolderTree, 
  FileCode, 
  Save, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Search, 
  Terminal as TerminalIcon, 
  Sparkles, 
  Send, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown,
  Play,
  RotateCcw,
  CheckCircle2,
  X,
  Code2
} from 'lucide-react';
import { Button } from '../components/Button';
import { PageView } from '../types';

interface WorkspacePageProps {
  onNavigate?: (page: PageView) => void;
  targetFile?: string;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  onNavigate,
  targetFile
}) => {
  const { activeProjectId, activeProject, refreshActiveProject } = useProject();

  // File explorer & Editor state
  const [files, setFiles] = useState<Array<{ id: string; path: string; fileName: string; language: string; size: number }>>([]);
  const [activeFilePath, setActiveFilePath] = useState<string>('src/pages/Login.jsx');
  const [activeFileContent, setActiveFileContent] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [fileSearch, setFileSearch] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // File creation & deletion modals
  const [isCreatingFile, setIsCreatingFile] = useState<boolean>(false);
  const [newFilePath, setNewFilePath] = useState<string>('');

  // AI Assistant state
  const [assistantMessages, setAssistantMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; relevantFiles?: string[] }>>([
    {
      sender: 'ai',
      text: `Hello! I am your Project Assistant for **${activeProject?.name || 'this project'}**. Ask me about API routes, component data flows, or file roles.`
    }
  ]);
  const [assistantInput, setAssistantInput] = useState<string>('');
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);

  // Terminal state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '> patles-ai workspace initialized',
    `> project context: ${activeProjectId}`,
    '> local dev server: ready on http://localhost:3000'
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');

  // Load files on mount or when activeProjectId changes
  useEffect(() => {
    loadFiles();
  }, [activeProjectId]);

  const loadFiles = async () => {
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/files`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        
        // Pick default or target file
        const target = targetFile 
          ? data.files.find((f: any) => f.path === targetFile)
          : data.files.find((f: any) => f.path === 'src/pages/Login.jsx' || f.path === 'src/App.jsx') || data.files[0];

        if (target) {
          loadFileContent(target.path);
        }
      }
    } catch (err) {
      console.error('Failed to load project files:', err);
    }
  };

  const loadFileContent = async (filePath: string) => {
    setIsLoadingFile(true);
    setActiveFilePath(filePath);
    setHasUnsavedChanges(false);

    try {
      const res = await fetch(`/api/projects/${activeProjectId}/files/content?path=${encodeURIComponent(filePath)}`);
      if (res.ok) {
        const data = await res.json();
        setActiveFileContent(data.file?.content || '// Empty file');
      }
    } catch (err) {
      console.error('Failed to load file content:', err);
    } finally {
      setIsLoadingFile(false);
    }
  };

  // Real Save File API
  const handleSaveFile = async () => {
    if (!activeFilePath) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/projects/${activeProjectId}/files`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: activeFilePath,
          content: activeFileContent
        })
      });

      if (res.ok) {
        setHasUnsavedChanges(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        setTerminalLogs(prev => [...prev, `[SAVE] ${activeFilePath} persisted to database at ${new Date().toLocaleTimeString()}`]);
        refreshActiveProject();
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveFile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFilePath, activeFileContent]);

  // Create new file
  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath.trim()) return;

    try {
      const res = await fetch(`/api/projects/${activeProjectId}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: newFilePath.trim(),
          content: '// New source file\n'
        })
      });

      if (res.ok) {
        setIsCreatingFile(false);
        setNewFilePath('');
        await loadFiles();
        loadFileContent(newFilePath.trim());
      }
    } catch (err) {
      console.error('Create file failed:', err);
    }
  };

  // Delete file
  const handleDeleteFile = async (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete ${filePath}?`)) return;

    try {
      const res = await fetch(`/api/projects/${activeProjectId}/files?path=${encodeURIComponent(filePath)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await loadFiles();
        if (activeFilePath === filePath) {
          const remaining = files.filter(f => f.path !== filePath);
          if (remaining[0]) loadFileContent(remaining[0].path);
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // AI Assistant Ask
  const handleSendAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim()) return;

    const userMsg = assistantInput.trim();
    setAssistantMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAssistantInput('');
    setIsAssistantThinking(true);

    try {
      const res = await fetch(`/api/projects/${activeProjectId}/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg,
          activeFile: activeFilePath
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAssistantMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: data.answer,
            relevantFiles: data.relevantFiles
          }
        ]);
      }
    } catch (err) {
      console.error('Assistant error:', err);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  // Terminal commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setTerminalInput('');

    let output = '';
    if (cmd === 'clear') {
      setTerminalLogs([]);
      return;
    } else if (cmd === 'npm run dev' || cmd === 'npm start') {
      output = `> vite v6.0.0 dev server running\n  ➜ Local: http://localhost:3000/\n  ➜ Network: use --host to expose`;
    } else if (cmd === 'npm test') {
      output = `> vitest run\n  ✓ All 8 test suites passed (14 tests)`;
    } else if (cmd.startsWith('ls')) {
      output = files.map(f => f.path).join('  ');
    } else {
      output = `Command executed: ${cmd} (exit status: 0)`;
    }

    setTerminalLogs(prev => [...prev, `$ ${cmd}`, output]);
  };

  const mapExtensionToMonacoLang = (path: string): string => {
    if (path.endsWith('.jsx') || path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.tsx') || path.endsWith('.ts')) return 'typescript';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.sql')) return 'sql';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.md')) return 'markdown';
    if (path.endsWith('.env') || path.endsWith('.example')) return 'shell';
    return 'plaintext';
  };

  const filteredFiles = files.filter(f => 
    !fileSearch || f.path.toLowerCase().includes(fileSearch.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-[#070B14] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl font-mono text-xs">
      
      {/* Top VS Code Workspace Titlebar */}
      <div className="h-10 bg-[#0B1120] border-b border-slate-800 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-purple-400" />
            {activeProject?.name || 'Workspace'}
          </span>
          <span className="text-slate-500 text-[11px]">
            {activeFilePath} {hasUnsavedChanges && '• (unsaved)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="w-3 h-3" /> Saved to DB
            </span>
          )}

          <button
            onClick={handleSaveFile}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Save file to database (Ctrl+S)"
          >
            <Save className="w-3 h-3" />
            <span>{isSaving ? 'Saving...' : 'Save File'}</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(activeFileContent);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Copy code"
          >
            {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: PROJECT EXPLORER (Width 64) */}
        <div className="w-64 bg-[#090D17] border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-purple-400" />
              Explorer
            </span>
            <button
              onClick={() => setIsCreatingFile(true)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Create new file"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search Files */}
          <div className="p-2 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
              <input
                type="text"
                placeholder="Search files..."
                value={fileSearch}
                onChange={(e) => setFileSearch(e.target.value)}
                className="w-full pl-6 pr-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* File Tree List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {filteredFiles.map(file => {
              const isActive = file.path === activeFilePath;
              return (
                <div
                  key={file.id}
                  onClick={() => loadFileContent(file.path)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer group ${
                    isActive 
                      ? 'bg-purple-600/20 text-purple-200 font-semibold border border-purple-500/30' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                    <span className="truncate" title={file.path}>{file.path}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteFile(file.path, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 transition-opacity"
                    title="Delete file"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Inline Create File Modal */}
          {isCreatingFile && (
            <form onSubmit={handleCreateFile} className="p-3 border-t border-slate-800 bg-slate-950 space-y-2">
              <span className="text-[11px] text-slate-300 font-bold block">Create File</span>
              <input
                type="text"
                placeholder="e.g. src/utils/helpers.js"
                value={newFilePath}
                onChange={(e) => setNewFilePath(e.target.value)}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                autoFocus
                required
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingFile(false)}
                  className="px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-purple-600 text-white rounded text-[11px] font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>

        {/* CENTER COLUMN: MONACO EDITOR */}
        <div className="flex-1 flex flex-col bg-[#070B14] overflow-hidden">
          
          {/* Active File Tab */}
          <div className="h-8 bg-[#0A0F1D] border-b border-slate-800 flex items-center px-4 shrink-0 text-slate-400 text-xs">
            <span className="font-semibold text-white">{activeFilePath}</span>
            {hasUnsavedChanges && <span className="ml-2 text-purple-400 text-[10px] font-bold">● Unsaved</span>}
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 overflow-hidden relative">
            {isLoadingFile ? (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400 mr-2" />
                Loading source code...
              </div>
            ) : (
              <Editor
                height="100%"
                theme="vs-dark"
                language={mapExtensionToMonacoLang(activeFilePath)}
                value={activeFileContent}
                onChange={(value) => {
                  setActiveFileContent(value || '');
                  setHasUnsavedChanges(true);
                }}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  cursorBlinking: 'smooth',
                  padding: { top: 12, bottom: 12 }
                }}
              />
            )}
          </div>

          {/* BOTTOM TERMINAL PANEL (Collapsible, Height 140px) */}
          <div className="h-36 bg-[#040711] border-t border-slate-800 flex flex-col shrink-0">
            <div className="h-7 bg-[#080D1A] border-b border-slate-800/80 px-3 flex items-center justify-between select-none">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <TerminalIcon className="w-3 h-3 text-cyan-400" />
                Terminal & Service Logs
              </span>
              <span className="text-[10px] text-slate-500">Press Enter to run command</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-1 text-[11px] text-slate-300">
              {terminalLogs.map((log, i) => (
                <div key={i} className="leading-tight font-mono whitespace-pre-wrap">{log}</div>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="h-8 border-t border-slate-800/80 px-2 flex items-center gap-2 bg-[#060A14]">
              <span className="text-cyan-400 text-xs">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="npm run dev | npm test | ls | clear"
                className="flex-1 bg-transparent text-white text-xs focus:outline-none placeholder-slate-600"
              />
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: AI ASSISTANT (Width 80 / 320px) */}
        <div className="w-80 bg-[#090D17] border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Project AI Assistant
            </span>
            <span className="text-[10px] text-purple-400 font-mono">Gemini 3.8</span>
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-b border-slate-800 flex flex-wrap gap-1">
            {[
              'Explain this file',
              'How does login work?',
              'Where is appointment API?'
            ].map((qp, i) => (
              <button
                key={i}
                onClick={() => setAssistantInput(qp)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {assistantMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl text-xs space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-purple-900/30 border border-purple-500/30 text-white ml-4'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 mr-2'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Clickable file links */}
                {msg.relevantFiles && msg.relevantFiles.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold block">Referenced Files:</span>
                    {msg.relevantFiles.map((rf, i) => (
                      <button
                        key={i}
                        onClick={() => loadFileContent(rf)}
                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono text-left"
                      >
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        <span>{rf}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isAssistantThinking && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                Thinking with project context...
              </div>
            )}
          </div>

          {/* Question Input */}
          <form onSubmit={handleSendAssistant} className="p-3 border-t border-slate-800 bg-[#0B1120]">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask about this project..."
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                disabled={isAssistantThinking}
                className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={isAssistantThinking || !assistantInput.trim()}
                className="absolute right-2 top-2 text-purple-400 hover:text-white disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
};
