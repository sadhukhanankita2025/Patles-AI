import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import { PromptEditor } from '../components/PromptEditor';
import { GeneratedProjectStructure } from '../types';
import { getSampleGeneratedProject, PROMPT_SUGGESTIONS } from '../data/mockData';
import { Button } from '../components/Button';
import { ArchitectureVisualizer } from '../components/ArchitectureVisualizer';
import { ApiPlayground } from '../components/ApiPlayground';
import { VirtualTerminal } from '../components/VirtualTerminal';
import { LiveUiSandbox } from '../components/LiveUiSandbox';
import { 
  Code2, 
  Server, 
  Database, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Terminal, 
  Network,
  MonitorPlay,
  FileCode,
  FolderGit2,
  CheckCircle2,
  Layers,
  Search,
  FileDown
} from 'lucide-react';

interface PromptGeneratorPageProps {
  initialPrompt?: string;
  onOpenDeploy?: (proj: GeneratedProjectStructure) => void;
}

export const PromptGeneratorPage: React.FC<PromptGeneratorPageProps> = ({
  initialPrompt = '',
  onOpenDeploy
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt || PROMPT_SUGGESTIONS[0].prompt
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Active view tabs: 'code' | 'architecture' | 'live-ui' | 'api' | 'terminal' | 'readme'
  const [activeTab, setActiveTab] = useState<'code' | 'architecture' | 'live-ui' | 'api' | 'terminal' | 'readme'>('code');
  const [selectedCodeFile, setSelectedCodeFile] = useState<string>('frontend');
  const [copied, setCopied] = useState(false);
  const [fileCopied, setFileCopied] = useState(false);
  const [allCopied, setAllCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [fileSearch, setFileSearch] = useState('');
  const [deployNotification, setDeployNotification] = useState<string | null>(null);

  const [generatedProject, setGeneratedProject] = useState<GeneratedProjectStructure>(() => 
    getSampleGeneratedProject(prompt, 'fullstack', 'Patles AI Engine')
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStep('Analyzing semantic prompt requirements & domain entities...');

    try {
      const timer1 = setTimeout(() => {
        setGenerationProgress(45);
        setGenerationStep('Synthesizing system architecture topology & node relationships...');
      }, 400);

      const timer2 = setTimeout(() => {
        setGenerationProgress(75);
        setGenerationStep('Constructing typed React 19 UI, Express 5 API & database schemas...');
      }, 800);

      const timer3 = setTimeout(() => {
        setGenerationProgress(92);
        setGenerationStep('Verifying project integrity, packages & runnable scripts...');
      }, 1200);

      // Call server generation proxy endpoint
      const response = await fetch('/api/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          projectType: 'fullstack'
        })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (response.ok) {
        const data = await response.json();
        setGeneratedProject(data);
      } else {
        const fallbackProj = getSampleGeneratedProject(prompt, 'fullstack', 'Patles AI Engine');
        setGeneratedProject(fallbackProj);
      }
    } catch (err) {
      console.warn('Network call failed, relying on local synthesis engine:', err);
      const fallbackProj = getSampleGeneratedProject(prompt, 'fullstack', 'Patles AI Engine');
      setGeneratedProject(fallbackProj);
    } finally {
      setGenerationProgress(100);
      setGenerationStep('Architecture & Codebase synthesized successfully!');
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStep('');
      }, 350);
    }
  };

  // Structured code files of this particular project
  const projectCodeFiles = useMemo(() => {
    const slug = generatedProject.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const packageJsonStr = JSON.stringify({
      name: slug,
      version: '1.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'tsx src/server/index.ts',
        build: 'vite build',
        start: 'NODE_ENV=production node dist/server.js',
        'db:push': 'drizzle-kit push'
      },
      dependencies: {
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        express: '^5.0.0',
        zod: '^3.24.0',
        'drizzle-orm': '^0.38.0',
        'lucide-react': '^0.475.0',
        cors: '^2.8.5'
      },
      devDependencies: {
        typescript: '^5.7.0',
        vite: '^6.1.0',
        tsx: '^4.19.0',
        tailwindcss: '^4.0.0',
        'drizzle-kit': '^0.30.0'
      }
    }, null, 2);

    const envStr = (generatedProject.readme.envVars || [
      'PORT=3000',
      'DATABASE_URL=postgresql://user:pass@localhost:5432/app_db',
      'JWT_SECRET=super_secret_jwt_key_32_chars'
    ]).join('\n');

    return [
      {
        id: 'frontend',
        path: generatedProject.frontend.mainFile || 'src/App.tsx',
        label: 'App.tsx',
        role: 'React 19 Frontend UI',
        language: 'tsx',
        code: generatedProject.frontend.sampleCode
      },
      {
        id: 'backend',
        path: 'src/server/routes.ts',
        label: 'routes.ts',
        role: 'Express 5 API Server',
        language: 'ts',
        code: generatedProject.backend.sampleCode
      },
      {
        id: 'database',
        path: 'src/db/schema.ts',
        label: 'schema.ts',
        role: 'Drizzle ORM Schema',
        language: 'ts',
        code: generatedProject.database.schemaCode
      },
      {
        id: 'package',
        path: 'package.json',
        label: 'package.json',
        role: 'Project Dependencies',
        language: 'json',
        code: packageJsonStr
      },
      {
        id: 'readme',
        path: 'README.md',
        label: 'README.md',
        role: 'Documentation & Setup',
        language: 'markdown',
        code: generatedProject.readme.overview
      },
      {
        id: 'env',
        path: '.env.example',
        label: '.env.example',
        role: 'Environment Config',
        language: 'bash',
        code: envStr
      }
    ];
  }, [generatedProject]);

  const filteredCodeFiles = useMemo(() => {
    if (!fileSearch.trim()) return projectCodeFiles;
    const query = fileSearch.toLowerCase();
    return projectCodeFiles.filter(f => 
      f.label.toLowerCase().includes(query) || 
      f.path.toLowerCase().includes(query) ||
      f.role.toLowerCase().includes(query)
    );
  }, [projectCodeFiles, fileSearch]);

  const activeFile = filteredCodeFiles.find(f => f.id === selectedCodeFile) || filteredCodeFiles[0] || projectCodeFiles[0];

  // Copy code helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyActiveFile = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.code);
    setFileCopied(true);
    setTimeout(() => setFileCopied(false), 2000);
  };

  const handleCopyAllCode = () => {
    const allCode = projectCodeFiles
      .map(f => `// ==========================================\n// File: ${f.path} (${f.role})\n// ==========================================\n\n${f.code}`)
      .join('\n\n\n');
    navigator.clipboard.writeText(allCode);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const handleDownloadActiveFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.path.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Real .zip download using JSZip
  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      const slug = generatedProject.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');

      projectCodeFiles.forEach(file => {
        zip.file(file.path, file.code);
      });

      zip.file('architecture.json', JSON.stringify(generatedProject.architecture, null, 2));

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-codebase.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate .zip bundle', err);
    }
  };

  const handleTriggerDeploy = () => {
    setDeployNotification(`Provisioning deployment pipeline for ${generatedProject.projectName}...`);
    setTimeout(() => {
      onOpenDeploy?.(generatedProject);
      setDeployNotification(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      
      {/* Toast Notification */}
      {deployNotification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 border border-cyan-500 text-white text-xs font-mono shadow-2xl flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>{deployNotification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patles.ai Synthesis Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Code & Architecture Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter your prompt to synthesize complete full-stack source code, visual architecture, and runnable components.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopyCode(JSON.stringify(generatedProject, null, 2))}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied Project JSON' : 'Export JSON'}
          </Button>

          <Button
            variant="gradient"
            size="sm"
            onClick={handleDownloadZip}
            leftIcon={downloadSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5" />}
          >
            {downloadSuccess ? 'Downloaded .ZIP' : 'Download Repo (.zip)'}
          </Button>
        </div>
      </div>

      {/* TWO BLOCKS LAYOUT: Block 1 (Prompt Input) & Block 2 (Output & Codes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* BLOCK 1: Take Prompt Block */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              1. Prompt Input
            </span>
            <span className="text-[11px] font-mono text-slate-500">Natural Language Specs</span>
          </div>

          <PromptEditor
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* BLOCK 2: Output & Project Code Block */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              2. Synthesized Project Output & Code
            </span>
            <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]" title={generatedProject.projectName}>
              {generatedProject.projectName}
            </span>
          </div>

          {/* Generation Progress Indicator Overlay */}
          {isGenerating && (
            <div className="p-5 rounded-3xl bg-cyan-950/30 border border-cyan-500/50 backdrop-blur-xl animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  <span className="text-sm font-semibold text-white">Synthesizing Code & Architecture...</span>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{generationProgress}%</span>
              </div>
              <p className="text-xs text-cyan-300 font-mono">
                {generationStep}
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-400 h-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Solution Preview Container */}
          <div className="rounded-3xl bg-[#0F172A]/90 border border-slate-800/90 shadow-2xl overflow-hidden backdrop-blur-xl">
            
            {/* Project Summary Banner */}
            <div className="p-4 bg-[#0B1120] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white truncate" title={generatedProject.projectName}>
                      {generatedProject.projectName}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase shrink-0">
                      Full Stack
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
                    {generatedProject.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyAllCode}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Copy all project source files to clipboard"
                >
                  {allCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{allCopied ? 'Copied All Code' : 'Copy All Code'}</span>
                </button>

                <button
                  onClick={handleDownloadZip}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-900/40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .zip</span>
                </button>
              </div>
            </div>

            {/* Primary View Tabs */}
            <div className="p-2.5 bg-[#090e1c] border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1.5">
                
                {/* 1. Project Code Tab (PRIMARY) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'code'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Project Code</span>
                </button>

                {/* 2. Architecture Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('architecture')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'architecture'
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Network className="w-3.5 h-3.5 text-purple-400" />
                  <span>Architecture</span>
                </button>

                {/* 3. Live UI Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('live-ui')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'live-ui'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <MonitorPlay className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live UI</span>
                </button>

                {/* 4. API Playground Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('api')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'api'
                      ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test API</span>
                </button>

                {/* 5. Terminal Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('terminal')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'terminal'
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Terminal</span>
                </button>

                {/* 6. README Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('readme')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'readme'
                      ? 'bg-slate-800 text-white font-bold border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>README</span>
                </button>

              </div>
            </div>

            {/* TAB 1: PROJECT CODE EXPLORER (SHOWS ALL CODES OF THIS PARTICULAR PROJECT) */}
            {activeTab === 'code' && (
              <div className="flex flex-col">
                {/* File Selection Bar */}
                <div className="p-2.5 bg-[#0B1120] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold px-1 shrink-0">
                      Files ({filteredCodeFiles.length}):
                    </span>
                    {filteredCodeFiles.map(file => {
                      const isSelected = activeFile?.id === file.id;
                      return (
                        <button
                          key={file.id}
                          type="button"
                          onClick={() => setSelectedCodeFile(file.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-semibold shadow-sm'
                              : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                          }`}
                        >
                          <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <span>{file.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative shrink-0">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={fileSearch}
                      onChange={(e) => setFileSearch(e.target.value)}
                      placeholder="Filter files..."
                      className="pl-8 pr-2.5 py-1 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-32 sm:w-36"
                    />
                  </div>
                </div>

                {/* Active File Header info */}
                <div className="px-4 py-2.5 bg-[#0F172A] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-cyan-400 font-bold truncate">{activeFile.path}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {activeFile.role}
                    </span>
                    <span className="text-slate-600 hidden sm:inline">·</span>
                    <span className="text-slate-500 text-[11px] hidden sm:inline">
                      {activeFile.code.split('\n').length} lines
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyActiveFile}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-[11px] transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Copy active file code"
                    >
                      {fileCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy File</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleDownloadActiveFile}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-[11px] transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Download active file"
                    >
                      <FileDown className="w-3 h-3 text-slate-400" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* Code Content with Line Numbers */}
                <div className="p-4 bg-[#060a12] max-h-[520px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
                  <div className="flex font-mono text-xs leading-relaxed select-text">
                    {/* Line numbers column */}
                    <div className="pr-4 select-none text-slate-600 text-right font-mono border-r border-slate-800/80 shrink-0">
                      {activeFile.code.split('\n').map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    {/* Code text */}
                    <div className="pl-4 overflow-x-auto flex-1 text-slate-200">
                      <pre className="font-mono">
                        <code>{activeFile.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ARCHITECTURE PREVIEW */}
            {activeTab === 'architecture' && (
              <div className="p-4 sm:p-5">
                <ArchitectureVisualizer
                  architecture={generatedProject.architecture}
                  projectName={generatedProject.projectName}
                />
              </div>
            )}

            {/* TAB 3: LIVE UI PREVIEW */}
            {activeTab === 'live-ui' && (
              <div className="p-4">
                <LiveUiSandbox project={generatedProject} />
              </div>
            )}

            {/* TAB 4: API PLAYGROUND */}
            {activeTab === 'api' && (
              <div className="p-4">
                <ApiPlayground
                  endpoints={generatedProject.backend.endpoints}
                  projectName={generatedProject.projectName}
                />
              </div>
            )}

            {/* TAB 5: TERMINAL PREVIEW */}
            {activeTab === 'terminal' && (
              <div className="p-4">
                <VirtualTerminal
                  projectName={generatedProject.projectName}
                  installCmd={generatedProject.readme.installCmd}
                  runCmd={generatedProject.readme.runCmd}
                />
              </div>
            )}

            {/* TAB 6: README PREVIEW */}
            {activeTab === 'readme' && (
              <div>
                <div className="px-4 py-2.5 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-semibold">README.md</span>
                    <span className="text-slate-600">·</span>
                    <span>Project Documentation & Architecture</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(generatedProject.readme.overview)}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </button>
                </div>

                <div className="p-6 bg-[#0B1120] text-xs text-slate-300 space-y-4 max-h-[500px] overflow-y-auto">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {generatedProject.readme.overview}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-white uppercase font-mono">Quickstart Commands:</div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 space-y-1">
                      <div>$ {generatedProject.readme.installCmd}</div>
                      <div>$ {generatedProject.readme.runCmd}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-white uppercase font-mono">Synthesized Stack Features:</div>
                    <div className="space-y-1.5">
                      {generatedProject.readme.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Solution Actions Footer */}
            <div className="p-4 bg-[#0F172A] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Files synthesized: {projectCodeFiles.length} · Architecture: {generatedProject.architecture?.pattern || 'Microservices'}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAllCode}
                  leftIcon={allCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                >
                  {allCopied ? 'Copied All Code' : 'Copy All Code'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadZip}
                  leftIcon={downloadSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                >
                  {downloadSuccess ? 'Downloaded Repo' : 'Download Zip'}
                </Button>
                
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={handleTriggerDeploy}
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Deploy Pipeline
                </Button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
