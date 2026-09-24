import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileAnalysisResponse, 
  FileMetricItem, 
  FileNetworkNode 
} from '../../../types/fileAnalysis';
import { FileAnalysisHeader, FileAnalysisViewMode } from './FileAnalysisHeader';
import { FileNetworkCanvas } from './FileNetworkCanvas';
import { FileTreemapView } from './FileTreemapView';
import { FileMetricsTable } from './FileMetricsTable';
import { FileHotspotsView } from './FileHotspotsView';
import { FileDetailDrawer } from './FileDetailDrawer';
import { Loader2, AlertCircle, Sparkles, Orbit, FileCode } from 'lucide-react';
import { Button } from '../../Button';

interface FileAnalysisViewProps {
  repositoryId: string;
  onOpenInSourceExplorer?: (filePath: string) => void;
  defaultFilePath?: string;
}

export const FileAnalysisView: React.FC<FileAnalysisViewProps> = ({
  repositoryId,
  onOpenInSourceExplorer,
  defaultFilePath
}) => {
  const [data, setData] = useState<FileAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [activeMode, setActiveMode] = useState<FileAnalysisViewMode>('network');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<FileMetricItem | null>(null);

  const fetchAnalysis = useCallback(async (forceRefresh: boolean = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const url = `/api/github/repositories/${repositoryId}/file-analysis${forceRefresh ? '?refresh=true' : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch file analysis');
      }

      const json: FileAnalysisResponse = await res.json();
      setData(json);

      // If defaultFilePath passed or selected file present, match it
      if (defaultFilePath && json.files.length > 0) {
        const target = json.files.find(f => f.path === defaultFilePath);
        if (target) setSelectedFile(target);
      }
    } catch (err: any) {
      console.error('File analysis fetch error:', err);
      setError(err.message || 'Error loading file analysis');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [repositoryId, defaultFilePath]);

  useEffect(() => {
    fetchAnalysis(false);
  }, [fetchAnalysis]);

  const handleSelectNetworkNode = (node: FileNetworkNode) => {
    if (!data) return;
    const file = data.files.find(f => f.id === node.id || f.path === node.path);
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSelectFileByPath = (path: string) => {
    if (!data) return;
    const file = data.files.find(f => f.path === path);
    if (file) {
      setSelectedFile(file);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 rounded-2xl bg-[#090D17] border border-slate-800 shadow-2xl flex flex-col items-center justify-center space-y-4 min-h-[500px]">
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <div className="text-center font-mono">
          <div className="text-sm font-bold text-white">Synthesizing Repository File Topology...</div>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Parsing imports, computing cyclomatic complexity, coupling blast radius, and network nodes...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-10 rounded-2xl bg-[#090D17] border border-rose-500/30 shadow-2xl text-center space-y-4 max-w-xl mx-auto font-mono">
        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 w-fit mx-auto border border-rose-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="text-white font-bold text-sm">File Analysis Unavailable</div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error || 'Unable to build repository file network. Please verify the repository files are indexed.'}
        </p>
        <Button onClick={() => fetchAnalysis(true)} size="sm">
          Retry Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Metric Bar */}
      <FileAnalysisHeader
        summary={data.summary}
        activeMode={activeMode}
        onChangeMode={setActiveMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onRefresh={() => fetchAnalysis(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main View Area */}
      <div>
        {activeMode === 'network' && (
          <FileNetworkCanvas
            nodes={data.network.nodes}
            edges={data.network.edges}
            selectedNodeId={selectedFile?.id || null}
            onSelectNode={handleSelectNetworkNode}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        )}

        {activeMode === 'treemap' && (
          <FileTreemapView
            directories={data.directories}
            files={data.files}
            onSelectFile={setSelectedFile}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        )}

        {activeMode === 'table' && (
          <FileMetricsTable
            files={data.files}
            onSelectFile={setSelectedFile}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        )}

        {activeMode === 'hotspots' && (
          <FileHotspotsView
            summary={data.summary}
            onSelectFile={setSelectedFile}
          />
        )}
      </div>

      {/* Slide-over Deep File Inspection Drawer */}
      {selectedFile && (
        <FileDetailDrawer
          file={selectedFile}
          repositoryId={repositoryId}
          onClose={() => setSelectedFile(null)}
          onSelectFileByPath={handleSelectFileByPath}
          onOpenInSourceExplorer={onOpenInSourceExplorer}
        />
      )}
    </div>
  );
};
