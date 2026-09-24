import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  FileCode, 
  Maximize2, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from '../Button';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

interface CodeViewerProps {
  filePath: string;
  content: string;
  language?: string;
  isLoading?: boolean;
  onExplainWithAI?: () => void;
  isExplaining?: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  filePath,
  content,
  language,
  isLoading = false,
  onExplainWithAI,
  isExplaining = false
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Map file extension to Prism language key
  const detectedLanguage = useMemo(() => {
    if (language) return language.toLowerCase();
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': return 'typescript';
      case 'tsx': return 'tsx';
      case 'js': return 'javascript';
      case 'jsx': return 'jsx';
      case 'py': return 'python';
      case 'json': return 'json';
      case 'sql': return 'sql';
      case 'yaml':
      case 'yml': return 'yaml';
      case 'md': return 'markdown';
      case 'html': return 'html';
      case 'css': return 'css';
      default: return 'javascript';
    }
  }, [filePath, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = useMemo(() => {
    return content ? content.split('\n') : [];
  }, [content]);

  // Syntax highlighting
  const highlightedCode = useMemo(() => {
    if (!content) return '';
    try {
      const grammar = Prism.languages[detectedLanguage] || Prism.languages.javascript;
      return Prism.highlight(content, grammar, detectedLanguage);
    } catch {
      return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }, [content, detectedLanguage]);

  return (
    <div className="flex flex-col h-full bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Code Header Bar */}
      <div className="p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-2.5 truncate">
          <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold text-white font-mono truncate">
            {filePath || 'Select a file'}
          </span>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/60 shrink-0">
            {detectedLanguage}
          </span>
          <span className="text-[11px] font-mono text-slate-500 shrink-0">
            {lines.length} lines
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Search within code */}
          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find in file..."
              className="w-32 sm:w-40 pl-8 pr-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            title="Copy Source Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onExplainWithAI && (
            <Button
              variant="gradient"
              size="sm"
              onClick={onExplainWithAI}
              isLoading={isExplaining}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              className="text-xs font-semibold shadow-md shadow-purple-900/30 cursor-pointer"
            >
              Explain with AI
            </Button>
          )}
        </div>
      </div>

      {/* Code Editor / Viewer Container */}
      <div className="flex-1 overflow-auto font-mono text-xs relative bg-[#060913]">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            <span className="text-xs font-mono">Fetching source code from repository...</span>
          </div>
        ) : !content ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-slate-500 space-y-2">
            <FileCode className="w-8 h-8 text-slate-600" />
            <span className="text-xs font-mono">Select a source file in the explorer tree to view code.</span>
          </div>
        ) : (
          <div className="flex min-w-full">
            {/* Line Numbers */}
            <div className="select-none py-4 px-3 text-right text-slate-600 bg-[#080D1A] border-r border-slate-800/80 font-mono text-[11px] leading-relaxed shrink-0">
              {lines.map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 overflow-x-auto leading-relaxed text-slate-200">
              <pre
                className="font-mono text-xs whitespace-pre"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Code Viewer Footer */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] font-mono text-slate-500 px-4">
        <span>UTF-8 · LF</span>
        <span>Patles Code Viewer</span>
      </div>
    </div>
  );
};
