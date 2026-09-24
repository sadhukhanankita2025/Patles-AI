import React, { useState } from 'react';
import { Terminal, Search, ArrowRight, FileCode, CheckCircle, ExternalLink } from 'lucide-react';
import { DiscoveredApi } from '../../types/github';

interface ApiExplorerProps {
  apis: DiscoveredApi[];
  onSelectApiFile?: (filePath: string) => void;
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({ apis, onSelectApiFile }) => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');

  const filteredApis = apis.filter((api) => {
    const matchesSearch = 
      api.path.toLowerCase().includes(search.toLowerCase()) ||
      api.purpose.toLowerCase().includes(search.toLowerCase()) ||
      api.filePath.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === 'ALL' || api.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const getMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-950/60 text-blue-400 border-blue-800/60';
      case 'POST':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-950/60 text-amber-400 border-amber-800/60';
      case 'DELETE':
        return 'bg-rose-950/60 text-rose-400 border-rose-800/60';
      default:
        return 'bg-purple-950/60 text-purple-400 border-purple-800/60';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Discovered API Endpoints
            </h2>
            <p className="text-xs text-slate-400">
              Scanned route definitions, HTTP methods, and controller handlers
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Method Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
            {['ALL', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  methodFilter === m
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search endpoints..."
              className="w-40 sm:w-48 pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <th className="py-3 px-3 font-medium">METHOD</th>
              <th className="py-3 px-3 font-medium">ENDPOINT PATH</th>
              <th className="py-3 px-3 font-medium">SOURCE FILE</th>
              <th className="py-3 px-3 font-medium">PURPOSE & INFERRED ACTION</th>
              <th className="py-3 px-3 font-medium text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {filteredApis.map((api, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                onClick={() => onSelectApiFile && onSelectApiFile(api.filePath)}
              >
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md border font-bold text-[10px] ${getMethodBadge(
                      api.method
                    )}`}
                  >
                    {api.method}
                  </span>
                </td>

                <td className="py-3 px-3 font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {api.path}
                </td>

                <td className="py-3 px-3 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate max-w-[160px]">{api.filePath}</span>
                  </div>
                </td>

                <td className="py-3 px-3 text-slate-300 font-sans text-xs">
                  {api.purpose}
                </td>

                <td className="py-3 px-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectApiFile) onSelectApiFile(api.filePath);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-mono text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View File</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApis.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-500 font-mono">
            {apis.length === 0
              ? 'No API endpoints detected in this repository.'
              : 'No endpoints match your current filter.'}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
        <span>Showing {filteredApis.length} of {apis.length} endpoints</span>
        <span>REST / HTTP Protocol</span>
      </div>
    </div>
  );
};
