import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Search,
  Code2,
  FileJson,
  Database,
  Sparkles
} from 'lucide-react';
import { RepositoryFileItem } from '../../types/github';

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  fileItem?: RepositoryFileItem;
  children: Record<string, TreeNode>;
}

interface FileTreeProps {
  files: RepositoryFileItem[];
  selectedFilePath: string | null;
  onSelectFile: (file: RepositoryFileItem) => void;
  onSelectFolder?: (folderPath: string, filesInFolder: string[]) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  selectedFilePath,
  onSelectFile,
  onSelectFolder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'server': true,
    'pages': true,
    'components': true,
    'app': true
  });

  // Build hierarchical tree structure from flat file paths
  const treeRoot = useMemo(() => {
    const root: TreeNode = {
      name: 'root',
      path: '',
      isFolder: true,
      children: {}
    };

    const filteredFiles = files.filter(f => 
      !searchQuery.trim() || 
      f.path.toLowerCase().includes(searchQuery.toLowerCase())
    );

    for (const file of filteredFiles) {
      const parts = file.path.split('/');
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join('/');

        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: currentPath,
            isFolder: !isLast,
            fileItem: isLast ? file : undefined,
            children: {}
          };
        }
        current = current.children[part];
      }
    }

    return root;
  }, [files, searchQuery]);

  const toggleFolder = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = { ...prev, [path]: !prev[path] };
      return next;
    });

    if (onSelectFolder) {
      // Collect files inside folder
      const filesInside = files
        .filter(f => f.path.startsWith(path + '/'))
        .map(f => f.fileName);
      onSelectFolder(path, filesInside);
    }
  };

  const getFileIcon = (fileName: string) => {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.ts') || lower.endsWith('.tsx') || lower.endsWith('.js') || lower.endsWith('.jsx')) {
      return <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
    if (lower.endsWith('.json')) {
      return <FileJson className="w-4 h-4 text-amber-400 shrink-0" />;
    }
    if (lower.endsWith('.sql') || lower.includes('schema') || lower.endsWith('.prisma')) {
      return <Database className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    if (lower.endsWith('.md') || lower.endsWith('.txt')) {
      return <FileText className="w-4 h-4 text-slate-400 shrink-0" />;
    }
    return <Code2 className="w-4 h-4 text-purple-400 shrink-0" />;
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = Boolean(expandedFolders[node.path]);
    const childKeys = Object.keys(node.children).sort((a, b) => {
      const aIsFolder = node.children[a].isFolder;
      const bIsFolder = node.children[b].isFolder;
      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;
      return a.localeCompare(b);
    });

    if (node.path === '') {
      return (
        <div className="space-y-0.5">
          {childKeys.map(k => renderNode(node.children[k], depth))}
        </div>
      );
    }

    if (node.isFolder) {
      return (
        <div key={node.path} className="select-none">
          <button
            onClick={(e) => toggleFolder(node.path, e)}
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
            className="w-full flex items-center gap-1.5 py-1.5 pr-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-mono transition-colors text-left group cursor-pointer"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
            )}

            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-purple-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-purple-400/80 shrink-0" />
            )}

            <span className="truncate font-semibold">{node.name}</span>
          </button>

          {isExpanded && (
            <div>
              {childKeys.map(k => renderNode(node.children[k], depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const isSelected = selectedFilePath === node.fileItem?.path;

    return (
      <div key={node.path} className="select-none">
        <button
          onClick={() => node.fileItem && onSelectFile(node.fileItem)}
          style={{ paddingLeft: `${depth * 14 + 20}px` }}
          className={`w-full flex items-center justify-between py-1.5 pr-2 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
            isSelected
              ? 'bg-purple-900/40 text-cyan-300 border border-purple-500/40 font-medium'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {getFileIcon(node.name)}
            <span className="truncate">{node.name}</span>
          </div>

          {node.fileItem?.hasContent && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shrink-0" title="Source cached" />
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Tree Search Header */}
      <div className="p-3 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-purple-400" />
            Repository Files
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {files.length} indexed
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>
      </div>

      {/* Tree Node Hierarchy */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-800">
        {renderNode(treeRoot)}
      </div>

      {/* Footer hint */}
      <div className="p-2.5 bg-slate-900/60 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>Click file to view code</span>
        <span className="text-cyan-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI Enabled
        </span>
      </div>
    </div>
  );
};
