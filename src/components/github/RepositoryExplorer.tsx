import React, { useState, useEffect } from 'react';
import { FileTree } from './FileTree';
import { CodeViewer } from './CodeViewer';
import { FileAnalysisPanel } from './FileAnalysisPanel';
import { RepositoryFileItem, FileExplanation, FolderExplanation } from '../../types/github';
import { Sparkles, FileCode, Split, PanelRightClose, PanelRightOpen, Network } from 'lucide-react';

interface RepositoryExplorerProps {
  repositoryId: string;
  files: RepositoryFileItem[];
  defaultFilePath?: string;
  onSwitchToFileAnalysis?: () => void;
  onReloadFiles?: () => void;
}

export const RepositoryExplorer: React.FC<RepositoryExplorerProps> = ({
  repositoryId,
  files,
  defaultFilePath,
  onSwitchToFileAnalysis,
  onReloadFiles
}) => {
  const [selectedFile, setSelectedFile] = useState<RepositoryFileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  
  // AI Explanation states
  const [fileExplanation, setFileExplanation] = useState<FileExplanation | null>(null);
  const [folderExplanation, setFolderExplanation] = useState<FolderExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(true);

  // Reset file selection when switching repositories
  useEffect(() => {
    setSelectedFile(null);
    setFileContent('');
    setFileExplanation(null);
    setFolderExplanation(null);
  }, [repositoryId]);

  // Initialize with default file or first source file when files load
  useEffect(() => {
    if (files.length > 0) {
      const target = defaultFilePath 
        ? files.find(f => f.path === defaultFilePath)
        : files.find(f => f.fileName === 'package.json') ||
          files.find(f => f.fileName === 'README.md') ||
          files.find(f => f.fileName.includes('App') || f.fileName.includes('server') || f.fileName.includes('index') || f.fileName.includes('main')) ||
          files[0];

      if (target) {
        handleSelectFile(target);
      }
    }
  }, [files, defaultFilePath, repositoryId]);

  const handleSelectFile = async (file: RepositoryFileItem) => {
    setSelectedFile(file);
    setFolderExplanation(null);
    setFileExplanation(null);
    setIsLoadingContent(true);

    try {
      const res = await fetch(`/api/github/files/${file.id}`);
      if (res.ok) {
        const data = await res.json();
        setFileContent(data.file?.content || '// File is empty or binary');
      } else {
        setFileContent('// Failed to load file content from server');
      }
    } catch {
      setFileContent('// Network error loading file content');
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleSelectFolder = async (folderPath: string, filesInFolder: string[]) => {
    setFolderExplanation(null);
    setFileExplanation(null);
    setIsExplaining(true);
    setShowAnalysisPanel(true);

    try {
      const res = await fetch('/api/github/explain-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repositoryId,
          folderPath,
          files: filesInFolder
        })
      });

      if (res.ok) {
        const data = await res.json();
        setFolderExplanation(data.explanation);
      }
    } catch (err) {
      console.warn('Folder explanation error:', err);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleExplainWithAI = async () => {
    if (!selectedFile || !fileContent) return;

    setIsExplaining(true);
    setShowAnalysisPanel(true);
    setFolderExplanation(null);

    try {
      const res = await fetch('/api/github/explain-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repositoryId,
          fileId: selectedFile.id,
          filePath: selectedFile.path,
          content: fileContent
        })
      });

      if (res.ok) {
        const data = await res.json();
        setFileExplanation(data.explanation);
      }
    } catch (err) {
      console.warn('AI explain file error:', err);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-purple-400" />
            Repository Source Explorer
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            ({files.length} indexed files)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToFileAnalysis && (
            <button
              onClick={onSwitchToFileAnalysis}
              className="p-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Switch to Interactive File Analysis View"
            >
              <Network className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">File Analysis View</span>
            </button>
          )}

          <button
            onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title={showAnalysisPanel ? 'Hide AI Analysis Panel' : 'Show AI Analysis Panel'}
          >
            {showAnalysisPanel ? (
              <>
                <PanelRightClose className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Hide AI Panel</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Show AI Panel</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 3-Column / 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start min-h-[600px]">
        
        {/* Left Tree Explorer: 3 Cols */}
        <div className="lg:col-span-3 h-[600px]">
          <FileTree
            files={files}
            selectedFilePath={selectedFile?.path || null}
            onSelectFile={handleSelectFile}
            onSelectFolder={handleSelectFolder}
          />
        </div>

        {/* Center Code Viewer: 5 to 9 Cols */}
        <div className={`${showAnalysisPanel ? 'lg:col-span-5' : 'lg:col-span-9'} h-[600px]`}>
          <CodeViewer
            filePath={selectedFile?.path || ''}
            content={fileContent}
            language={selectedFile?.language}
            isLoading={isLoadingContent}
            onExplainWithAI={handleExplainWithAI}
            isExplaining={isExplaining}
          />
        </div>

        {/* Right AI Semantic Panel: 4 Cols */}
        {showAnalysisPanel && (
          <div className="lg:col-span-4 h-[600px] overflow-hidden">
            <FileAnalysisPanel
              fileExplanation={fileExplanation}
              folderExplanation={folderExplanation}
              filePath={selectedFile?.path}
              isLoading={isExplaining}
              onClose={() => setShowAnalysisPanel(false)}
            />
          </div>
        )}

      </div>
    </div>
  );
};
