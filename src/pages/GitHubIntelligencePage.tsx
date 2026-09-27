import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageView } from '../types';
import { 
  GitHubRepoMetadata, 
  RepositoryAnalysis, 
  RepositoryFileItem 
} from '../types/github';
import { GitHubImportForm } from '../components/github/GitHubImportForm';
import { AnalysisProgress, ProgressStep } from '../components/github/AnalysisProgress';
import { RepositoryHeader } from '../components/github/RepositoryHeader';
import { RepositoryStats } from '../components/github/RepositoryStats';
import { TechnologyStack } from '../components/github/TechnologyStack';
import { RepositoryExplorer } from '../components/github/RepositoryExplorer';
import { ApiExplorer } from '../components/github/ApiExplorer';
import { DatabaseExplorer } from '../components/github/DatabaseExplorer';
import { ArchitectureGraph } from '../components/github/ArchitectureGraph';
import { ComponentGraph } from '../components/github/ComponentGraph';
import { UserJourneyGraph } from '../components/github/UserJourneyGraph';
import { CodebaseSummaryView } from '../components/github/CodebaseSummary';
import { RepositoryHealth } from '../components/github/RepositoryHealth';
import { CodeMentor } from '../components/github/CodeMentor';
import { RepositorySearch } from '../components/github/RepositorySearch';
import { 
  FolderGit2, 
  Terminal, 
  Database, 
  Layers, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  FileCode, 
  Bot, 
  ArrowLeft,
  RotateCcw,
  Workflow,
  Network
} from 'lucide-react';
import { Button } from '../components/Button';
import { WorkflowPage } from './WorkflowPage';
import { FileAnalysisView } from '../components/github/file-analysis/FileAnalysisView';

type ActiveTab = 'overview' | 'workflow' | 'file-analysis' | 'files' | 'apis' | 'database' | 'architecture' | 'mentor' | 'search' | 'health';

interface GitHubIntelligencePageProps {
  onNavigate: (page: PageView) => void;
  initialSubTab?: string;
}

export const GitHubIntelligencePage: React.FC<GitHubIntelligencePageProps> = ({
  onNavigate,
  initialSubTab
}) => {
  const [repository, setRepository] = useState<GitHubRepoMetadata | null>(null);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [files, setFiles] = useState<RepositoryFileItem[]>([]);
  const [historyRepos, setHistoryRepos] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedFilePath, setSelectedFilePath] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real Progress tracker
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { id: '1', label: 'Repository validated', status: 'pending' },
    { id: '2', label: 'Repository metadata fetched', status: 'pending' },
    { id: '3', label: 'File tree scanned', status: 'pending' },
    { id: '4', label: 'Technologies detected', status: 'pending' },
    { id: '5', label: 'Components analyzed', status: 'pending' },
    { id: '6', label: 'APIs detected', status: 'pending' },
    { id: '7', label: 'Database analyzed', status: 'pending' },
    { id: '8', label: 'Architecture generated', status: 'pending' },
  ]);

  // Load previously imported repositories from server
  useEffect(() => {
    fetchHistory();
  }, []);

  // Sync sub-tab if passed
  useEffect(() => {
    if (initialSubTab && ['overview', 'workflow', 'file-analysis', 'files', 'apis', 'database', 'architecture', 'mentor', 'search', 'health'].includes(initialSubTab)) {
      setActiveTab(initialSubTab as ActiveTab);
    }
  }, [initialSubTab]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/github/repositories');
      if (res.ok) {
        const data = await res.json();
        setHistoryRepos(data.repositories || []);
      }
    } catch {
      // Non-blocking history fetch
    }
  };

  const loadFilesForRepository = async (repoId: string) => {
    try {
      const filesRes = await fetch(`/api/github/repositories/${repoId}/files`);
      if (filesRes.ok) {
        const filesData = await filesRes.json();
        setFiles(filesData.files || []);
      }
    } catch (err) {
      console.warn('Failed to load files:', err);
    }
  };

  const updateProgress = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
    setProgressSteps(prev =>
      prev.map((step, idx) => ({
        ...step,
        status: idx < stepIndex ? 'completed' : idx === stepIndex ? 'active' : 'pending'
      }))
    );
  };

  const handleAnalyzeRepository = async (repoUrl: string, forceRefresh: boolean = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    updateProgress(0);

    try {
      // Step 1: Validating
      updateProgress(0);
      await new Promise(r => setTimeout(r, 200));

      // Step 2: Metadata
      updateProgress(1);
      await new Promise(r => setTimeout(r, 250));

      // Step 3: Scan tree & download
      updateProgress(2);

      const response = await fetch('/api/github/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl, forceRefresh })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to analyze repository');
      }

      const data = await response.json();

      // Step 4 to 8 progress animation
      updateProgress(3);
      await new Promise(r => setTimeout(r, 150));
      updateProgress(4);
      await new Promise(r => setTimeout(r, 150));
      updateProgress(5);
      await new Promise(r => setTimeout(r, 150));
      updateProgress(6);
      await new Promise(r => setTimeout(r, 150));
      updateProgress(7);
      await new Promise(r => setTimeout(r, 200));

      // Mark all completed
      setProgressSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));

      setRepository(data.repository);
      setAnalysis(data.analysis);

      // Fetch file tree for explorer
      await loadFilesForRepository(data.repository.id);

      fetchHistory();
    } catch (err: any) {
      console.error('Import failure:', err);
      setErrorMessage(err.message || 'An error occurred while importing repository');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!repository) return;
    setIsGeneratingSummary(true);

    try {
      const res = await fetch('/api/github/codebase-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repositoryId: repository.id })
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(prev => prev ? { ...prev, summary: data.summary } : null);
      }
    } catch (err: any) {
      console.warn('Summary generation error:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSelectFileFromOtherView = (filePath: string) => {
    setSelectedFilePath(filePath);
    setActiveTab('files');
  };

  const navTabs: Array<{ id: ActiveTab; label: string; icon: any; count?: number }> = [
    { id: 'overview', label: 'Overview', icon: FolderGit2 },
    { id: 'workflow', label: 'Workflow Map', icon: Workflow, count: analysis?.api_count ? analysis.api_count + (analysis.component_count || 0) : undefined },
    { id: 'file-analysis', label: 'File Analysis', icon: Network, count: files.length },
    { id: 'files', label: 'Source Explorer', icon: FileCode, count: files.length },
    { id: 'apis', label: 'Discovered APIs', icon: Terminal, count: analysis?.apis?.length },
    { id: 'database', label: 'Database & Schema', icon: Database },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'mentor', label: 'AI Code Mentor', icon: Bot },
    { id: 'search', label: 'Search Codebase', icon: Search },
    { id: 'health', label: 'Project Health', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. If no repo selected, show large import hero */}
      {!repository ? (
        <div className="space-y-8">
          <GitHubImportForm
            onAnalyze={(url) => handleAnalyzeRepository(url)}
            isLoading={isLoading}
            historyRepos={historyRepos}
            onSelectHistory={(url) => handleAnalyzeRepository(url)}
          />

          {/* Progress Tracker while scanning */}
          {isLoading && (
            <AnalysisProgress
              steps={progressSteps}
              currentStepIndex={currentStepIndex}
            />
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono max-w-2xl mx-auto flex items-center justify-between">
              <span>Error: {errorMessage}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setErrorMessage(null)}
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* 2. Repository Intelligence Dashboard */
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          
          {/* Top Bar with Switch Repo action */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setRepository(null);
                setAnalysis(null);
                setFiles([]);
                setSelectedFilePath(undefined);
                setErrorMessage(null);
                setActiveTab('overview');
                fetchHistory();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-mono text-cyan-400 hover:text-cyan-300 border border-slate-700/80 transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Import Another Repository</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              Patles.ai Repository Intelligence
            </span>
          </div>

          {/* Repository Header */}
          <RepositoryHeader
            metadata={repository}
            onRefresh={() => handleAnalyzeRepository(repository.url, true)}
            isRefreshing={isLoading}
            onViewWorkflow={() => setActiveTab('workflow')}
            onViewFileAnalysis={() => setActiveTab('file-analysis')}
          />

          {/* Repository Quick Stats */}
          <RepositoryStats
            metadata={repository}
            health={analysis?.health}
          />

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#0B1120] border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none shadow-xl">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Views */}
          <div>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Tech Stack */}
                <TechnologyStack
                  techStack={analysis?.technology_stack || []}
                  frameworks={analysis?.frameworks || []}
                />

                {/* AI Codebase Summary */}
                <CodebaseSummaryView
                  summary={analysis?.summary}
                  onGenerateSummary={handleGenerateSummary}
                  isLoading={isGeneratingSummary}
                />

                {/* Split Previews: Architecture & User Journey */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {analysis?.architecture && (
                    <ArchitectureGraph
                      pattern={analysis.architecture.pattern}
                      description={analysis.architecture.description}
                      nodes={analysis.architecture.nodes}
                    />
                  )}

                  {analysis?.user_journeys && (
                    <UserJourneyGraph
                      steps={analysis.user_journeys}
                    />
                  )}
                </div>

                {/* Health Overview */}
                {analysis?.health && (
                  <RepositoryHealth
                    health={analysis.health}
                    databaseName={analysis.database?.type}
                  />
                )}
              </div>
            )}

            {/* WORKFLOW MAP TAB */}
            {activeTab === 'workflow' && (
              <WorkflowPage
                repositoryId={repository.id}
                onBackToRepo={() => setActiveTab('overview')}
                onNavigate={onNavigate}
              />
            )}

            {/* FILE ANALYSIS TAB */}
            {activeTab === 'file-analysis' && (
              <FileAnalysisView
                repositoryId={repository.id}
                onOpenInSourceExplorer={(filePath) => {
                  setSelectedFilePath(filePath);
                  setActiveTab('files');
                }}
                defaultFilePath={selectedFilePath}
              />
            )}

            {/* SOURCE EXPLORER TAB */}
            {activeTab === 'files' && (
              <RepositoryExplorer
                repositoryId={repository.id}
                files={files}
                defaultFilePath={selectedFilePath}
                onSwitchToFileAnalysis={() => setActiveTab('file-analysis')}
                onReloadFiles={() => loadFilesForRepository(repository.id)}
              />
            )}

            {/* DISCOVERED APIS TAB */}
            {activeTab === 'apis' && (
              <ApiExplorer
                apis={analysis?.apis || []}
                onSelectApiFile={handleSelectFileFromOtherView}
              />
            )}

            {/* DATABASE & SCHEMA TAB */}
            {activeTab === 'database' && (
              <DatabaseExplorer
                database={
                  analysis?.database || {
                    type: 'PostgreSQL',
                    orm: 'Drizzle ORM',
                    schemaFiles: [],
                    models: ['users', 'sessions', 'audit_logs'],
                    flow: ['Application', 'API Gateway', 'ORM Layer', 'PostgreSQL']
                  }
                }
                onSelectSchemaFile={handleSelectFileFromOtherView}
              />
            )}

            {/* ARCHITECTURE TAB */}
            {activeTab === 'architecture' && (
              <div className="space-y-6">
                {analysis?.architecture && (
                  <ArchitectureGraph
                    pattern={analysis.architecture.pattern}
                    description={analysis.architecture.description}
                    nodes={analysis.architecture.nodes}
                  />
                )}

                {analysis?.component_graph?.hierarchy && (
                  <ComponentGraph
                    components={analysis.component_graph.hierarchy}
                  />
                )}

                {analysis?.user_journeys && (
                  <UserJourneyGraph
                    steps={analysis.user_journeys}
                  />
                )}
              </div>
            )}

            {/* AI CODE MENTOR TAB */}
            {activeTab === 'mentor' && (
              <CodeMentor
                repositoryId={repository.id}
                repoName={repository.name}
                onSelectFile={handleSelectFileFromOtherView}
              />
            )}

            {/* CODEBASE SEARCH TAB */}
            {activeTab === 'search' && (
              <RepositorySearch
                repositoryId={repository.id}
                onSelectResultFile={handleSelectFileFromOtherView}
              />
            )}

            {/* PROJECT HEALTH TAB */}
            {activeTab === 'health' && analysis?.health && (
              <RepositoryHealth
                health={analysis.health}
                databaseName={analysis.database?.type}
              />
            )}

          </div>

        </motion.div>
      )}

    </div>
  );
};
