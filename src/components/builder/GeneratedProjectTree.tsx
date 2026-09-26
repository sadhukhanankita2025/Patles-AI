import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileText, 
  Database, 
  ChevronRight, 
  ChevronDown, 
  Search,
  Code2,
  FileJson,
  X
} from 'lucide-react';

export interface ProjectTreeFile {
  id: string;
  path: string;
  fileName: string;
  language?: string;
  size?: number;
}

interface GeneratedProjectTreeProps {
  files: ProjectTreeFile[];
  selectedFilePath: string;
  onSelectFile: (path: string) => void;
  projectName?: string;
}

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  file?: ProjectTreeFile;
  children: Record<string, TreeNode>;
}

export const GeneratedProjectTree: React.FC<GeneratedProjectTreeProps> = ({
  files,
  selectedFilePath,
  onSelectFile,
  projectName = 'HealthcareConnect'
}) => {
  const [search, setSearch] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'src/pages': true,
    'src/components': true,
    'server': true,
    'server/routes': true,
    'database': true
  });

  // Build tree from flat paths
  const rootNode: TreeNode = {
    name: projectName,
    path: '',
    isFolder: true,
    children: {}
  };

  const filteredFiles = search.trim() === ''
    ? files
    : files.filter(f => f.path.toLowerCase().includes(search.toLowerCase()));

  filteredFiles.forEach(file => {
    const parts = file.path.replace(/^\/+/, '').split('/');
    let current = rootNode;
    let accumulatedPath = '';

    parts.forEach((part, index) => {
      accumulatedPath = accumulatedPath ? `${accumulatedPath}/${part}` : part;
      const isLast = index === parts.length - 1;

      if (isLast) {
        current.children[part] = {
          name: part,
          path: accumulatedPath,
          isFolder: false,
          file,
          children: {}
        };
      } else {
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: accumulatedPath,
            isFolder: true,
            children: {}
          };
        }
        current = current.children[part];
      }
    });
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.sql')) return <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    if (fileName.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
    if (fileName.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    if (fileName.endsWith('.jsx') || fileName.endsWith('.tsx')) return <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    if (fileName.endsWith('.js') || fileName.endsWith('.ts')) return <FileCode className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const sortedKeys = Object.keys(node.children).sort((a, b) => {
      const aIsFolder = node.children[a].isFolder;
      const bIsFolder = node.children[b].isFolder;
      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;
      return a.localeCompare(b);
    });

    return (
      <div key={node.path || 'root'} className="space-y-0.5">
        {sortedKeys.map(key => {
          const child = node.children[key];
          const isExpanded = expandedFolders[child.path] ?? true;
          const isSelected = selectedFilePath === child.path;

          if (child.isFolder) {
            return (
              <div key={child.path}>
                <button
                  type="button"
                  onClick={() => toggleFolder(child.path)}
                  style={{ paddingLeft: `${depth * 12 + 8}px` }}
                  className="w-full py-1 pr-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-1.5 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                  {isExpanded ? (
                    <FolderOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  )}
                  <span className="truncate">{child.name}</span>
                </button>

                {isExpanded && renderNode(child, depth + 1)}
              </div>
            );
          }

          return (
            <button
              key={child.path}
              type="button"
              onClick={() => onSelectFile(child.path)}
              style={{ paddingLeft: `${depth * 12 + 20}px` }}
              className={`w-full py-1 pr-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors text-left ${
                isSelected
                  ? 'bg-purple-600/30 text-cyan-300 border border-purple-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {getFileIcon(child.name)}
              <span className="truncate">{child.name}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#0B1120] border-r border-white/10 w-64 shrink-0 text-xs font-mono">
      {/* Search Header */}
      <div className="p-3 border-b border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-purple-400" />
            Project Tree
          </span>
          <span className="text-[10px] text-slate-500">
            {files.length} files
          </span>
        </div>

        <div className="relative">
          <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter files..."
            className="w-full bg-slate-950 border border-white/10 rounded-lg pl-7 pr-7 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="px-2 py-1 text-slate-400 text-[11px] font-bold flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>{projectName}</span>
        </div>
        {renderNode(rootNode, 0)}
      </div>
    </div>
  );
};
