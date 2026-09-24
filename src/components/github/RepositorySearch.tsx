import React, { useState } from 'react';
import { Search, FileCode, Terminal, ArrowRight, Loader2, Code2 } from 'lucide-react';

interface SearchResult {
  type: 'file' | 'content' | 'api';
  id?: string;
  path: string;
  fileName: string;
  language?: string;
  snippet?: string;
  match: string;
}

interface RepositorySearchProps {
  repositoryId: string;
  onSelectResultFile: (filePath: string, fileId?: string) => void;
}

export const RepositorySearch: React.FC<RepositorySearchProps> = ({
  repositoryId,
  onSelectResultFile
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/github/repositories/${repositoryId}/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const sampleSearches = ['auth', 'login', 'router', 'schema', 'config', 'user'];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Global Codebase Search</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Instant deep search across filenames, functions, endpoints, variables, and code content
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search variables, functions, routes (e.g. login, JWT, drizzle)..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white text-xs font-semibold rounded-2xl shadow-lg shadow-purple-900/30 transition-all font-mono flex items-center gap-1.5 cursor-pointer"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </button>
      </form>

      {/* Suggested Quick Searches */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
        <span className="text-slate-500">Quick queries:</span>
        {sampleSearches.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQuery(s);
              setTimeout(() => handleSearch(), 50);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 text-[11px] transition-colors cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Search Results */}
      <div className="space-y-3 pt-2">
        {isSearching ? (
          <div className="py-12 text-center text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Scanning index for "{query}"...</span>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 font-mono">
            No matches found for "{query}". Try a different function or filename keyword.
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((res, idx) => (
              <div
                key={idx}
                onClick={() => onSelectResultFile(res.path, res.id)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    {res.type === 'api' ? (
                      <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <FileCode className="w-4 h-4 text-purple-400 shrink-0" />
                    )}
                    <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {res.fileName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {res.match}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 truncate max-w-xl">
                    {res.path}
                  </div>

                  {res.snippet && (
                    <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80 truncate">
                      {res.snippet}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 shrink-0 self-end sm:self-center">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
