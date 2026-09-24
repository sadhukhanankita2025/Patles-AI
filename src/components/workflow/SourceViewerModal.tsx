import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileCode, 
  Loader2, 
  ExternalLink,
  Code2
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

interface SourceViewerModalProps {
  filePath: string | null;
  repositoryId: string;
  onClose: () => void;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({
  filePath,
  repositoryId,
  onClose
}) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filePath || !repositoryId) return;

    const fetchSource = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // First fetch list of files to get file ID
        const filesRes = await fetch(`/api/github/repositories/${repositoryId}/files`);
        if (!filesRes.ok) throw new Error('Failed to load repository files');
        const filesData = await filesRes.json();
        
        const target = filesData.files?.find((f: any) => 
          f.path.toLowerCase() === filePath.toLowerCase() ||
          f.path.endsWith(filePath) ||
          filePath.endsWith(f.path)
        );

        if (!target) {
          throw new Error(`File ${filePath} not found in repository index`);
        }

        const fileRes = await fetch(`/api/github/files/${target.id}`);
        if (!fileRes.ok) throw new Error('Failed to load file contents');
        const fileData = await fileRes.json();
        setContent(fileData.file?.content || '// File is empty or could not be loaded');
      } catch (err: any) {
        setError(err.message || 'Error loading file content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSource();
  }, [filePath, repositoryId]);

  // Syntax highlighting
  const highlightedCode = useMemo(() => {
    if (!content) return '';
    const ext = filePath?.split('.').pop()?.toLowerCase() || 'js';
    let grammar = Prism.languages.javascript;

    if (['ts', 'tsx'].includes(ext)) {
      grammar = Prism.languages.tsx || Prism.languages.typescript || Prism.languages.javascript;
    } else if (['jsx', 'js'].includes(ext)) {
      grammar = Prism.languages.jsx || Prism.languages.javascript;
    } else if (ext === 'json') {
      grammar = Prism.languages.json || Prism.languages.javascript;
    } else if (ext === 'py') {
      grammar = Prism.languages.python || Prism.languages.javascript;
    } else if (ext === 'sql') {
      grammar = Prism.languages.sql || Prism.languages.javascript;
    }

    try {
      return Prism.highlight(content, grammar, ext);
    } catch {
      return content;
    }
  }, [content, filePath]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!filePath) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[85vh] flex flex-col bg-[#0B1120] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/60">
          <div className="flex items-center gap-2 min-w-0">
            <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-mono text-white font-semibold truncate">
              {filePath}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={isLoading || !content}
              className="text-xs font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 bg-[#060a12] scrollbar-thin scrollbar-thumb-slate-800">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-xs font-mono">Fetching source code from repository...</span>
            </div>
          ) : error ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-rose-400">
              <span className="text-xs font-mono">Failed to load file: {error}</span>
            </div>
          ) : (
            <pre className="m-0 leading-relaxed font-mono">
              <code 
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{content ? `${content.split('\n').length} lines of code` : ''}</span>
          <span className="text-slate-400">Patles.ai Code Intelligence</span>
        </div>

      </div>
    </div>
  );
};
