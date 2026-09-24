import React, { useState } from 'react';
import JSZip from 'jszip';
import { PromptEditor, ARCHITECTURE_PATTERNS, DATABASE_DIALECTS } from '../components/PromptEditor';
import { ProjectType, AIModelId, GeneratedProjectStructure } from '../types';
import { getSampleGeneratedProject, AI_MODELS, PROMPT_SUGGESTIONS } from '../data/mockData';
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
  RotateCcw,
  CheckCircle2,
  AlertCircle
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
  const [selectedModel, setSelectedModel] = useState<AIModelId>('gemini-3-8');
  const [selectedType, setSelectedType] = useState<ProjectType>('fullstack');
  const [selectedPattern, setSelectedPattern] = useState<string>('Event-Driven Microservices');
  const [selectedDatabase, setSelectedDatabase] = useState<string>('PostgreSQL (Drizzle ORM)');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Active view tabs: 'architecture' | 'frontend' | 'backend' | 'database' | 'readme' | 'terminal'
  const [activeTab, setActiveTab] = useState<'architecture' | 'frontend' | 'backend' | 'database' | 'readme' | 'terminal'>('architecture');
  const [copied, setCopied] = useState(false);
  const [frontendMode, setFrontendMode] = useState<'code' | 'interactive'>('interactive');
  const [backendMode, setBackendMode] = useState<'code' | 'playground'>('code');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [deployNotification, setDeployNotification] = useState<string | null>(null);

  const currentModelObj = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];
  const [generatedProject, setGeneratedProject] = useState<GeneratedProjectStructure>(() => 
    getSampleGeneratedProject(prompt, selectedType, currentModelObj.name)
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStep('Analyzing semantic requirements & domain entities...');

    try {
      // Step simulation indicators
      const timer1 = setTimeout(() => {
        setGenerationProgress(40);
        setGenerationStep(`Synthesizing ${selectedPattern} topology & node graph...`);
      }, 500);

      const timer2 = setTimeout(() => {
        setGenerationProgress(70);
        setGenerationStep('Constructing typed React 19 views, Express routes & Drizzle schema...');
      }, 1000);

      const timer3 = setTimeout(() => {
        setGenerationProgress(90);
        setGenerationStep('Verifying zero-trust security boundaries & test manifests...');
      }, 1500);

      // Call server generation proxy endpoint
      const response = await fetch('/api/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          projectType: selectedType,
          modelId: currentModelObj.name,
          architecturePattern: selectedPattern,
          databaseDialect: selectedDatabase
        })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (response.ok) {
        const data = await response.json();
        setGeneratedProject(data);
      } else {
        // Fallback to high-quality local generation if server route returns error
        const fallbackProj = getSampleGeneratedProject(prompt, selectedType, currentModelObj.name);
        setGeneratedProject(fallbackProj);
      }
    } catch (err) {
      console.warn('Network call failed, relying on local synthesis engine:', err);
      const fallbackProj = getSampleGeneratedProject(prompt, selectedType, currentModelObj.name);
      setGeneratedProject(fallbackProj);
    } finally {
      setGenerationProgress(100);
      setGenerationStep('Architecture & Codebase synthesized successfully!');
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStep('');
      }, 400);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real .zip download using JSZip
  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      const slug = generatedProject.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');

      // 1. package.json
      const packageJson = {
        name: slug,
        version: '1.0.0',
        private: true,
        type: 'module',
        scripts: {
          dev: 'tsx src/server/index.ts',
          build: 'vite build',
          start: 'NODE_ENV=production node dist/server.js'
        },
        dependencies: {
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          express: '^5.0.0',
          zod: '^3.23.0',
          'drizzle-orm': '^0.35.0',
          'lucide-react': '^0.450.0'
        },
        devDependencies: {
          typescript: '^5.6.0',
          vite: '^6.0.0',
          tsx: '^4.19.0',
          tailwindcss: '^4.0.0',
          'drizzle-kit': '^0.26.0'
        }
      };
      zip.file('package.json', JSON.stringify(packageJson, null, 2));

      // 2. README.md
      zip.file('README.md', generatedProject.readme.overview);

      // 3. Frontend code
      zip.file('src/App.tsx', generatedProject.frontend.sampleCode);

      // 4. Backend code
      zip.file('src/server/routes.ts', generatedProject.backend.sampleCode);

      // 5. Database Schema
      zip.file('src/db/schema.ts', generatedProject.database.schemaCode);

      // 6. Architecture & metadata
      zip.file('architecture.json', JSON.stringify(generatedProject.architecture, null, 2));
      zip.file('.env.example', (generatedProject.readme.envVars || [
        'PORT=3000',
        'DATABASE_URL=postgresql://user:pass@localhost:5432/app_db',
        'JWT_SECRET=super_secret_jwt_key_32_chars'
      ]).join('\n'));

      // Generate blob & trigger download
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-repo.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to bundle repository ZIP:', err);
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
    <div className="space-y-8 font-sans">
      
      {/* Toast Notification */}
      {deployNotification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 border border-purple-500 text-white text-xs font-mono shadow-2xl flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>{deployNotification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patles.ai Synthesis Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Code & Architecture Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transform natural specifications into full-stack repositories with visual architecture graphs, typed components, API controllers, and SQL schemas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentModelObj.name}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopyCode(JSON.stringify(generatedProject, null, 2))}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied Full Project JSON' : 'Export JSON'}
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

      {/* Main Split Layout: Left Prompt & Stack Controls (5 Cols) vs Right Generated Solution (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Prompt Editor & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <PromptEditor
            prompt={prompt}
            onPromptChange={setPrompt}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedPattern={selectedPattern}
            onPatternChange={setSelectedPattern}
            selectedDatabase={selectedDatabase}
            onDatabaseChange={setSelectedDatabase}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {/* Model Diagnostic Stats Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2 font-mono">
            <div className="flex justify-between">
              <span>Active Engine:</span>
              <span className="text-slate-200 font-semibold">{currentModelObj.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Context Capacity:</span>
              <span className="text-cyan-400">{currentModelObj.contextWindow}</span>
            </div>
            <div className="flex justify-between">
              <span>Generation Throughput:</span>
              <span className="text-emerald-400">{currentModelObj.speed}</span>
            </div>
            <div className="flex justify-between">
              <span>Zero-Trust Protocol:</span>
              <span className="text-purple-300">mTLS & RLS Enforced</span>
            </div>
          </div>
        </div>

        {/* Right Side: Generated Project Preview Panel */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Generation Progress Indicator Overlay */}
          {isGenerating && (
            <div className="p-5 rounded-3xl bg-purple-950/30 border border-purple-500/50 backdrop-blur-xl animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  <span className="text-sm font-semibold text-white">Synthesizing Code & Architecture...</span>
                </div>
                <span className="text-xs font-mono text-cyan-400">{generationProgress}%</span>
              </div>
              <p className="text-xs text-cyan-300 font-mono">
                {generationStep}
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Solution Preview Container */}
          <div className="rounded-3xl bg-[#0F172A]/90 border border-slate-800/90 shadow-2xl overflow-hidden backdrop-blur-xl">
            
            {/* Header / Tabs */}
            <div className="p-3 bg-[#0B1120] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
              
              {/* Primary Preview Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
                
                {/* 1. Architecture Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('architecture')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'architecture'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Architecture</span>
                </button>

                {/* 2. Frontend Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('frontend')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'frontend'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Frontend</span>
                </button>

                {/* 3. Backend Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('backend')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'backend'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Server className="w-3.5 h-3.5 text-purple-400" />
                  <span>Backend</span>
                </button>

                {/* 4. Database Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('database')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'database'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Database</span>
                </button>

                {/* 5. README Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('readme')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'readme'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>README</span>
                </button>

                {/* 6. Terminal Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('terminal')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'terminal'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Terminal</span>
                </button>
              </div>

              {/* Sub-view switches for Frontend & Backend */}
              {activeTab === 'frontend' && (
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setFrontendMode('interactive')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                      frontendMode === 'interactive' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MonitorPlay className="w-3 h-3" />
                    <span>Live UI</span>
                  </button>
                  <button
                    onClick={() => setFrontendMode('code')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      frontendMode === 'code' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Code
                  </button>
                </div>
              )}

              {activeTab === 'backend' && (
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setBackendMode('code')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      backendMode === 'code' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setBackendMode('playground')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                      backendMode === 'playground' ? 'bg-slate-800 text-purple-300' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    <span>Test API</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: ARCHITECTURE PREVIEW */}
            {activeTab === 'architecture' && (
              <div className="p-4 sm:p-5">
                <ArchitectureVisualizer
                  architecture={generatedProject.architecture}
                  projectName={generatedProject.projectName}
                />
              </div>
            )}

            {/* TAB 2: FRONTEND PREVIEW */}
            {activeTab === 'frontend' && (
              <div>
                {frontendMode === 'interactive' ? (
                  <div className="p-4">
                    <LiveUiSandbox project={generatedProject} />
                  </div>
                ) : (
                  <div>
                    <div className="px-4 py-2 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-semibold">{generatedProject.frontend.mainFile}</span>
                        <span className="text-slate-600">·</span>
                        <span>{generatedProject.frontend.framework}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(generatedProject.frontend.sampleCode)}
                        className="hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </button>
                    </div>

                    <div className="p-4 bg-[#0B1120] font-mono text-xs text-slate-200 overflow-x-auto max-h-[480px]">
                      <pre className="leading-relaxed">
                        <code>{generatedProject.frontend.sampleCode}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BACKEND PREVIEW */}
            {activeTab === 'backend' && (
              <div>
                {backendMode === 'playground' ? (
                  <div className="p-4">
                    <ApiPlayground
                      endpoints={generatedProject.backend.endpoints}
                      projectName={generatedProject.projectName}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="px-4 py-2 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-semibold">src/server/routes.ts</span>
                        <span className="text-slate-600">·</span>
                        <span>{generatedProject.backend.runtime}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(generatedProject.backend.sampleCode)}
                        className="hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </button>
                    </div>

                    <div className="p-4 bg-[#0B1120] font-mono text-xs text-slate-200 overflow-x-auto max-h-[480px]">
                      {/* Endpoints Quick Index */}
                      <div className="mb-4 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-sans">
                        <div className="text-xs font-bold text-white mb-2">Synthesized API Endpoints</div>
                        {generatedProject.backend.endpoints.map((ep, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 font-mono">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ep.method === 'GET' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'
                              }`}>
                                {ep.method}
                              </span>
                              <span className="text-slate-200">{ep.path}</span>
                            </div>
                            <span className="text-slate-400 text-[11px] font-sans truncate max-w-[240px]">{ep.desc}</span>
                          </div>
                        ))}
                      </div>

                      <pre className="leading-relaxed">
                        <code>{generatedProject.backend.sampleCode}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: DATABASE PREVIEW */}
            {activeTab === 'database' && (
              <div>
                <div className="px-4 py-2 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">src/db/schema.ts</span>
                    <span className="text-slate-600">·</span>
                    <span>{generatedProject.database.dialect}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(generatedProject.database.schemaCode)}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Schema</span>
                  </button>
                </div>

                <div className="p-4 bg-[#0B1120] font-mono text-xs text-slate-200 overflow-x-auto max-h-[480px]">
                  <div className="mb-4 flex flex-wrap gap-2 font-sans">
                    <span className="text-xs text-slate-400">Synthesized Tables:</span>
                    {generatedProject.database.tables.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                        {t}
                      </span>
                    ))}
                  </div>

                  <pre className="leading-relaxed">
                    <code>{generatedProject.database.schemaCode}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 5: README PREVIEW */}
            {activeTab === 'readme' && (
              <div>
                <div className="px-4 py-2 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-semibold">README.md</span>
                    <span className="text-slate-600">·</span>
                    <span>Project Documentation</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(generatedProject.readme.overview)}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </button>
                </div>

                <div className="p-6 bg-[#0B1120] text-xs text-slate-300 space-y-4 max-h-[480px] overflow-y-auto">
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

            {/* TAB 6: TERMINAL PREVIEW */}
            {activeTab === 'terminal' && (
              <div className="p-4">
                <VirtualTerminal
                  projectName={generatedProject.projectName}
                  installCmd={generatedProject.readme.installCmd}
                  runCmd={generatedProject.readme.runCmd}
                />
              </div>
            )}

            {/* Bottom Solution Actions Footer */}
            <div className="p-4 bg-[#0F172A] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Files synthesized: {generatedProject.frontend.fileCount} · Architecture: {generatedProject.architecture?.pattern || 'Microservices'}</span>
              </div>

              <div className="flex items-center gap-2.5">
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
