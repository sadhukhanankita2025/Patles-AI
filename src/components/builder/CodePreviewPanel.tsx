import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Copy, 
  Check, 
  Save, 
  Search, 
  FileCode, 
  X, 
  Sparkles,
  Layers,
  Database,
  Shield,
  FileText,
  Key,
  Globe,
  Server
} from 'lucide-react';
import { GeneratedProjectTree, ProjectTreeFile } from './GeneratedProjectTree';

interface CodePreviewPanelProps {
  projectId?: string;
  files: ProjectTreeFile[];
  selectedFilePath: string;
  onSelectFile: (path: string) => void;
  projectName?: string;
  onSaveFile?: (path: string, content: string) => Promise<void>;
  openInWorkspace?: () => void;
}

export const CodePreviewPanel: React.FC<CodePreviewPanelProps> = ({
  projectId = 'proj_healthcare_connect',
  files,
  selectedFilePath,
  onSelectFile,
  projectName = 'HealthcareConnect',
  onSaveFile,
  openInWorkspace
}) => {
  const [openTabs, setOpenTabs] = useState<string[]>(['src/pages/Login.jsx']);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedOutputFilter, setSelectedOutputFilter] = useState<string | null>(null);

  // Sync tabs when selectedFilePath changes
  useEffect(() => {
    if (selectedFilePath && !openTabs.includes(selectedFilePath)) {
      setOpenTabs(prev => [...prev, selectedFilePath]);
    }
  }, [selectedFilePath, openTabs]);

  // Fetch file content on path selection
  useEffect(() => {
    if (!selectedFilePath) return;

    let active = true;
    setIsLoadingContent(true);

    const targetId = projectId || 'proj_healthcare_connect';
    fetch(`/api/projects/${targetId}/files/content?path=${encodeURIComponent(selectedFilePath)}`)
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.json();
      })
      .then(data => {
        if (active && data.file) {
          setFileContent(data.file.content || '');
        }
      })
      .catch(() => {
        // Fallback demo content if not found in db
        if (active) {
          if (selectedFilePath.endsWith('.sql')) {
            setFileContent(`-- PostgreSQL Database Schema for ${projectName}
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  status VARCHAR(30) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`);
          } else if (selectedFilePath.endsWith('Login.jsx')) {
            setFileContent(`import React, { useState } from 'react';
import { api } from '../services/api';

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response && response.token) {
        localStorage.setItem('auth_token', response.token);
        if (onLoginSuccess) onLoginSuccess(response.user);
      } else {
        setError('Authentication token not received.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">${projectName} Sign In</h2>
        <p className="text-sm text-slate-400 mb-6">Enter your credentials to access the platform.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-300">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-300">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};`);
          } else {
            setFileContent(`// ${selectedFilePath}\n// Generated by Patles.ai for ${projectName}\n\nexport const handler = async () => {\n  console.log("Ready");\n};`);
          }
        }
      })
      .finally(() => {
        if (active) setIsLoadingContent(false);
      });

    return () => { active = false; };
  }, [selectedFilePath, projectName, projectId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!onSaveFile) return;
    setIsSaving(true);
    try {
      await onSaveFile(selectedFilePath, fileContent);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const closeTab = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = openTabs.filter(t => t !== path);
    setOpenTabs(updated);
    if (selectedFilePath === path && updated.length > 0) {
      onSelectFile(updated[updated.length - 1]);
    }
  };

  const getLanguage = (path: string) => {
    if (path.endsWith('.sql')) return 'sql';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    if (path.endsWith('.tsx') || path.endsWith('.jsx')) return 'javascript';
    if (path.endsWith('.ts') || path.endsWith('.js')) return 'javascript';
    return 'javascript';
  };

  // 9 Generated Output Cards required by prompt
  const outputCards = [
    { id: 'frontend', title: 'Frontend', value: 'React + Tailwind', icon: Globe, color: 'text-cyan-400', targetFile: 'src/pages/Login.jsx' },
    { id: 'backend', title: 'Backend', value: 'Node + Express', icon: Server, color: 'text-purple-400', targetFile: 'server/routes/api.js' },
    { id: 'database', title: 'Database', value: 'PostgreSQL', icon: Database, color: 'text-amber-400', targetFile: 'database/schema.sql' },
    { id: 'auth', title: 'Authentication', value: 'JWT + bcrypt', icon: Key, color: 'text-rose-400', targetFile: 'src/pages/Login.jsx' },
    { id: 'apis', title: 'API Endpoints', value: '18 Generated APIs', icon: Layers, color: 'text-blue-400', targetFile: 'server/routes/api.js' },
    { id: 'components', title: 'Components', value: '24 Components', icon: Sparkles, color: 'text-emerald-400', targetFile: 'src/components/Navbar.jsx' },
    { id: 'pages', title: 'Pages', value: '8 Pages', icon: FileCode, color: 'text-indigo-400', targetFile: 'src/pages/Dashboard.jsx' },
    { id: 'readme', title: 'README', value: 'Generated', icon: FileText, color: 'text-teal-400', targetFile: 'README.md' },
    { id: 'env', title: 'Environment', value: '.env.example ready', icon: Shield, color: 'text-yellow-400', targetFile: '.env.example' }
  ];

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Generated Output Cards (Clickable) */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        {outputCards.map(card => {
          const Icon = card.icon;
          const isSelected = selectedOutputFilter === card.id;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                setSelectedOutputFilter(card.id);
                onSelectFile(card.targetFile);
              }}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-500'
                  : 'bg-[#0F172A]/80 hover:bg-slate-800/80 border-white/5 hover:border-purple-500/30'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">{card.title}</span>
                <Icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
              <div className="text-[11px] font-bold text-white truncate font-sans">
                {card.value}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main VS Code style IDE Editor */}
      <div className="flex-1 min-h-[460px] flex rounded-2xl bg-[#0B1120] border border-white/10 overflow-hidden shadow-2xl">
        {/* Left: Project Tree Explorer */}
        <GeneratedProjectTree
          files={files}
          selectedFilePath={selectedFilePath}
          onSelectFile={onSelectFile}
          projectName={projectName}
        />

        {/* Right: Monaco Editor & Tabs */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#020617]">
          {/* Tabs Bar */}
          <div className="h-10 bg-[#0B1120] border-b border-white/10 flex items-center justify-between px-2 overflow-x-auto">
            <div className="flex items-center gap-1 overflow-x-auto">
              {openTabs.map(tabPath => {
                const isActive = tabPath === selectedFilePath;
                const fileName = tabPath.split('/').pop() || tabPath;

                return (
                  <div
                    key={tabPath}
                    onClick={() => onSelectFile(tabPath)}
                    className={`h-8 px-3 rounded-t-lg text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors border-t-2 ${
                      isActive
                        ? 'bg-[#020617] text-white border-purple-500'
                        : 'bg-[#0B1120]/60 text-slate-400 border-transparent hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate max-w-[120px]">{fileName}</span>
                    <button
                      onClick={(e) => closeTab(tabPath, e)}
                      className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Editor Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                title="Copy current file contents"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-mono text-white flex items-center gap-1.5 shadow-sm transition-colors"
                title="Save file changes to database"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{saveSuccess ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={getLanguage(selectedFilePath)}
              value={fileContent}
              onChange={(value) => setFileContent(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                wordWrap: 'on'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
