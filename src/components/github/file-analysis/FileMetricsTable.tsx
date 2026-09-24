import React, { useState, useMemo } from 'react';
import { FileMetricItem } from '../../../types/fileAnalysis';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  ExternalLink, 
  Sparkles, 
  FileCode, 
  Zap, 
  ShieldCheck, 
  Activity,
  Copy,
  Check
} from 'lucide-react';

interface FileMetricsTableProps {
  files: FileMetricItem[];
  onSelectFile: (file: FileMetricItem) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

type SortField = 'path' | 'linesOfCode' | 'size' | 'inboundImportsCount' | 'importsCount' | 'cyclomaticComplexity' | 'maintainabilityIndex';
type SortOrder = 'asc' | 'desc';

export const FileMetricsTable: React.FC<FileMetricsTableProps> = ({
  files,
  onSelectFile,
  searchQuery = '',
  selectedCategory = 'all'
}) => {
  const [sortField, setSortField] = useState<SortField>('linesOfCode');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedFiles = useMemo(() => {
    let result = files.filter(f => {
      const matchesSearch = !searchQuery || 
        f.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        const comp = valA.localeCompare(valB as string);
        return sortOrder === 'asc' ? comp : -comp;
      }

      return sortOrder === 'asc' 
        ? (valA as number) - (valB as number) 
        : (valB as number) - (valA as number);
    });
  }, [files, searchQuery, selectedCategory, sortField, sortOrder]);

  const handleCopy = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const getComplexityBadge = (level: string, score: number) => {
    switch (level) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">Crit ({score})</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-orange-500/20 text-orange-300 border border-orange-500/30">High ({score})</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">Mod ({score})</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Low ({score})</span>;
    }
  };

  const categoryColor: Record<string, string> = {
    component: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    page: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    route: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    service: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    model: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    hook: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
    util: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    style: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    config: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
    test: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    doc: 'bg-gray-700/30 text-gray-300 border-gray-600/30',
    other: 'bg-slate-800 text-slate-400 border-slate-700'
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-600 opacity-60 group-hover:opacity-100" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-purple-400" />
      : <ArrowDown className="w-3 h-3 text-purple-400" />;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#090D17] overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-800 bg-[#0C1222] text-slate-400">
              <th 
                onClick={() => handleSort('path')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-white group transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>File Path & Role</span>
                  {renderSortIcon('path')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('linesOfCode')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-white group transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>LOC</span>
                  {renderSortIcon('linesOfCode')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('size')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-white group transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Size</span>
                  {renderSortIcon('size')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('inboundImportsCount')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-white group transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Inbound (Coupling)</span>
                  {renderSortIcon('inboundImportsCount')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('importsCount')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-white group transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Outbound</span>
                  {renderSortIcon('importsCount')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('cyclomaticComplexity')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-white group transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Complexity</span>
                  {renderSortIcon('cyclomaticComplexity')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('maintainabilityIndex')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-white group transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Maintainability</span>
                  {renderSortIcon('maintainabilityIndex')}
                </div>
              </th>

              <th className="py-3 px-4 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Rows */}
          <tbody className="divide-y divide-slate-800/60">
            {filteredAndSortedFiles.map((file) => (
              <tr
                key={file.id}
                onClick={() => onSelectFile(file)}
                className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                {/* File Path & Role */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <FileCode className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="truncate max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
                          {file.fileName}
                        </span>
                        <span className={`text-[10px] px-2 py-0.2 rounded border font-semibold uppercase ${categoryColor[file.category] || categoryColor.other}`}>
                          {file.category}
                        </span>
                        {file.isHotspot && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                            <Zap className="w-2.5 h-2.5" /> Hotspot
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400 truncate max-w-sm" title={file.path}>
                          {file.path}
                        </span>
                        <button
                          onClick={(e) => handleCopy(file.path, e)}
                          className="text-slate-600 hover:text-slate-400 p-0.5"
                          title="Copy file path"
                        >
                          {copiedPath === file.path ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </td>

                {/* LOC */}
                <td className="py-3 px-4 text-right">
                  <span className="font-bold text-slate-200">
                    {file.linesOfCode.toLocaleString()}
                  </span>
                  <div className="w-16 h-1 bg-slate-800 rounded-full ml-auto mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-purple-500" 
                      style={{ width: `${Math.min(100, Math.max(10, file.linesOfCode / 5))}%` }}
                    />
                  </div>
                </td>

                {/* Size */}
                <td className="py-3 px-4 text-right text-slate-400">
                  {file.size > 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${file.size} B`}
                </td>

                {/* Inbound Coupling */}
                <td className="py-3 px-4 text-center">
                  <span className={`font-bold ${file.inboundImportsCount > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {file.inboundImportsCount}
                  </span>
                </td>

                {/* Outbound Imports */}
                <td className="py-3 px-4 text-center text-slate-300">
                  {file.importsCount}
                </td>

                {/* Complexity */}
                <td className="py-3 px-4 text-center">
                  {getComplexityBadge(file.complexityLevel, file.cyclomaticComplexity)}
                </td>

                {/* Maintainability Index */}
                <td className="py-3 px-4 text-center">
                  <span className={`font-bold ${file.maintainabilityIndex >= 80 ? 'text-emerald-400' : file.maintainabilityIndex >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {file.maintainabilityIndex}%
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectFile(file)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Open Deep File Intelligence"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-[#0C1222] border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>Showing {filteredAndSortedFiles.length} of {files.length} indexed files</span>
        <span>Sorted by {sortField} ({sortOrder})</span>
      </div>
    </div>
  );
};
