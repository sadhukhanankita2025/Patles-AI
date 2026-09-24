import React, { useState } from 'react';
import { DirectoryCluster, FileMetricItem } from '../../../types/fileAnalysis';
import { Folder, FileCode, Layers, ArrowRight, Zap, AlertCircle } from 'lucide-react';

interface FileTreemapViewProps {
  directories: DirectoryCluster[];
  files: FileMetricItem[];
  onSelectFile: (file: FileMetricItem) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  component: '#38BDF8',
  page: '#818CF8',
  route: '#34D399',
  service: '#FBBF24',
  model: '#F43F5E',
  hook: '#2DD4BF',
  util: '#A855F7',
  style: '#F472B6',
  config: '#94A3B8',
  test: '#60A5FA',
  doc: '#64748B',
  other: '#6B7280'
};

export const FileTreemapView: React.FC<FileTreemapViewProps> = ({
  directories,
  files,
  onSelectFile,
  searchQuery = '',
  selectedCategory = 'all'
}) => {
  const [selectedDir, setSelectedDir] = useState<string | null>(null);

  // Filter directories and files
  const filteredFiles = files.filter(f => {
    const matchesSearch = !searchQuery || 
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalFilteredLoc = filteredFiles.reduce((sum, f) => sum + f.linesOfCode, 0) || 1;

  // Group filtered files by directory
  const dirFileMap = new Map<string, FileMetricItem[]>();
  for (const file of filteredFiles) {
    const dir = file.path.includes('/') ? file.path.substring(0, file.path.lastIndexOf('/')) : '/';
    const list = dirFileMap.get(dir) || [];
    list.push(file);
    dirFileMap.set(dir, list);
  }

  const activeDirs = Array.from(dirFileMap.entries()).sort((a, b) => {
    const locA = a[1].reduce((sum, f) => sum + f.linesOfCode, 0);
    const locB = b[1].reduce((sum, f) => sum + f.linesOfCode, 0);
    return locB - locA;
  });

  return (
    <div className="space-y-6">
      {/* Top Explanation Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>
            Codebase Volume & Directory Hierarchy Treemap: Block sizes proportional to Lines of Code (LOC).
          </span>
        </div>
        <span className="text-slate-500">
          {activeDirs.length} active directories · {filteredFiles.length} files
        </span>
      </div>

      {/* Treemap Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeDirs.map(([dirPath, dirFiles]) => {
          const dirLoc = dirFiles.reduce((sum, f) => sum + f.linesOfCode, 0);
          const percentageOfCodebase = Math.round((dirLoc / totalFilteredLoc) * 100);
          const isSelected = selectedDir === dirPath;

          return (
            <div
              key={dirPath}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected 
                  ? 'bg-[#0E1629] border-purple-500/60 shadow-lg shadow-purple-900/20' 
                  : 'bg-[#0A0F1D] border-slate-800 hover:border-slate-700 hover:bg-[#0D1324]'
              }`}
            >
              <div>
                {/* Directory Header */}
                <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 truncate">
                    <Folder className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-xs font-bold text-white font-mono truncate" title={dirPath}>
                      {dirPath}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-purple-300 block">
                      {dirLoc.toLocaleString()} LOC
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {percentageOfCodebase}% codebase
                    </span>
                  </div>
                </div>

                {/* Visual Proportion Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    style={{ width: `${Math.max(4, percentageOfCodebase)}%` }}
                  />
                </div>

                {/* File Blocks inside directory */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {dirFiles.map(file => {
                    const color = CATEGORY_COLORS[file.category] || '#94A3B8';
                    const fileShare = Math.round((file.linesOfCode / (dirLoc || 1)) * 100);

                    return (
                      <div
                        key={file.id}
                        onClick={() => onSelectFile(file)}
                        className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between text-xs font-mono transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span 
                            className="w-2 h-2 rounded-full shrink-0" 
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-slate-300 group-hover:text-white truncate" title={file.fileName}>
                            {file.fileName}
                          </span>
                          {file.isHotspot && (
                            <span title="High coupling hotspot">
                              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-slate-400">
                            {file.linesOfCode} L
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Footer Info */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{dirFiles.length} files</span>
                <span className="text-slate-400">
                  Avg {(dirLoc / dirFiles.length).toFixed(0)} LOC / file
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
