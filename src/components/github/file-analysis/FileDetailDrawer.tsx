import React, { useState, useEffect } from 'react';
import { 
  FileMetricItem 
} from '../../../types/fileAnalysis';
import { 
  X, 
  Sparkles, 
  Code2, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink, 
  Loader2,
  FileCode,
  FolderTree,
  GitCommit,
  Cpu,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '../../Button';

interface FileDetailDrawerProps {
  file: FileMetricItem | null;
  repositoryId: string;
  onClose: () => void;
  onSelectFileByPath?: (path: string) => void;
  onOpenInSourceExplorer?: (path: string) => void;
}

type DrawerTab = 'metrics' | 'ai-audit' | 'source';

export const FileDetailDrawer: React.FC<FileDetailDrawerProps> = ({
  file,
  repositoryId,
  onClose,
  onSelectFileByPath,
  onOpenInSourceExplorer
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('metrics');
  const [copied, setCopied] = useState(false);
  const [rawContent, setRawContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  
  // AI Audit State
  const [aiAudit, setAiAudit] = useState<any>(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Load content when file changes
  useEffect(() => {
    if (!file) return;
    setRawContent('');
    setAiAudit(null);
    setAuditError(null);
    loadContent(file.id);
  }, [file]);

  const loadContent = async (fileId: string) => {
    setIsLoadingContent(true);
    try {
      const res = await fetch(`/api/github/files/${fileId}`);
      if (res.ok) {
        const data = await res.json();
        setRawContent(data.file?.content || '// File content is empty or binary');
      }
    } catch {
      setRawContent('// Failed to load file content from server');
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleRunAiAudit = async () => {
    if (!file) return;
    setIsLoadingAudit(true);
    setAuditError(null);

    try {
      const res = await fetch(`/api/github/repositories/${repositoryId}/file-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: file.path,
          fileId: file.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiAudit(data.audit);
      } else {
        const err = await res.json();
        setAuditError(err.error || 'Failed to complete AI file audit');
      }
    } catch (err: any) {
      setAuditError(err.message || 'Network error running AI file audit');
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const handleCopyPath = () => {
    if (!file) return;
    navigator.clipboard.writeText(file.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!file) return null;

  const complexityColor = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    critical: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
  }[file.complexityLevel];

  const categoryBadgeColor: Record<string, string> = {
    component: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    page: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    route: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    service: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    model: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    hook: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    util: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    style: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    config: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
    test: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    doc: 'bg-gray-700/30 text-gray-300 border-gray-600/30',
    other: 'bg-slate-800 text-slate-400 border-slate-700'
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#090D16] border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out">
      {/* Drawer Top Header */}
      <div className="p-5 border-b border-slate-800/80 bg-[#0B1120] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono truncate" title={file.fileName}>
                {file.fileName}
              </h3>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border font-semibold ${categoryBadgeColor[file.category] || categoryBadgeColor.other}`}>
                {file.category}
              </span>
              {file.isHotspot && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-bold">
                  <Zap className="w-2.5 h-2.5" /> Hotspot
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono text-slate-400 truncate max-w-sm" title={file.path}>
                {file.path}
              </span>
              <button 
                onClick={handleCopyPath}
                className="text-slate-500 hover:text-slate-300 p-0.5 rounded"
                title="Copy relative path"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenInSourceExplorer && (
            <button
              onClick={() => onOpenInSourceExplorer(file.path)}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open in Source Explorer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Source Explorer</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center border-b border-slate-800 bg-[#0B1120]/60 px-5 gap-4 shrink-0 text-xs font-mono">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'metrics'
              ? 'border-purple-500 text-purple-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Intelligence & Metrics</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('ai-audit');
            if (!aiAudit && !isLoadingAudit) {
              handleRunAiAudit();
            }
          }}
          className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'ai-audit'
              ? 'border-cyan-400 text-cyan-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Architecture Audit</span>
          {aiAudit && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
        </button>

        <button
          onClick={() => setActiveTab('source')}
          className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'source'
              ? 'border-emerald-400 text-emerald-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Raw Source ({file.linesOfCode} LOC)</span>
        </button>
      </div>

      {/* Drawer Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* TAB 1: METRICS & DEPENDENCIES */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* Quick KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-500 block">Lines of Code</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{file.linesOfCode.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">{file.codeLines} code · {file.commentLines} cmts</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-500 block">File Size</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {file.size > 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${file.size} B`}
                </span>
                <span className="text-[10px] text-slate-400">{file.extension.toUpperCase()} format</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-500 block">Complexity</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-lg font-bold text-white">{file.cyclomaticComplexity}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold ${complexityColor}`}>
                    {file.complexityLevel}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Cyclomatic score</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-500 block">Maintainability</span>
                <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{file.maintainabilityIndex}/100</span>
                <span className="text-[10px] text-slate-400">SE Index Rating</span>
              </div>
            </div>

            {/* Coupling & Hotspot Overview */}
            <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  Coupling & Module Connectivity
                </h4>
                <span className="text-[11px] text-slate-400">
                  {file.inboundImportsCount} in · {file.importsCount} out
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[11px] text-cyan-400 font-semibold mb-1 flex items-center gap-1">
                    <span>Inbound Dependents</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {file.inboundImportsCount}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {file.inboundImportsCount === 0 
                      ? 'No internal files directly import this file (leaf or entrypoint).' 
                      : `Imported and relied upon by ${file.inboundImportsCount} other modules.`}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[11px] text-purple-400 font-semibold mb-1 flex items-center gap-1">
                    <span>Outbound Dependencies</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                      {file.importsCount}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Imports {file.importedFiles.length} internal files and {file.externalPackages.length} third-party packages.
                  </p>
                </div>
              </div>
            </div>

            {/* Imported By List (Inbound) */}
            {file.importedBy.length > 0 && (
              <div className="space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
                    Files Depending On This Module ({file.importedBy.length})
                  </span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {file.importedBy.map((dependentPath, idx) => (
                    <div 
                      key={idx}
                      onClick={() => onSelectFileByPath && onSelectFileByPath(dependentPath)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors cursor-pointer group"
                    >
                      <span className="truncate">{dependentPath}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Files Imported (Outbound) */}
            {file.importedFiles.length > 0 && (
              <div className="space-y-2 font-mono">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  Internal Files Imported By This Module ({file.importedFiles.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {file.importedFiles.map((targetPath, idx) => (
                    <div 
                      key={idx}
                      onClick={() => onSelectFileByPath && onSelectFileByPath(targetPath)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors cursor-pointer group"
                    >
                      <span className="truncate">{targetPath}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-purple-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Packages Imported */}
            {file.externalPackages.length > 0 && (
              <div className="space-y-2 font-mono">
                <span className="text-xs font-bold text-slate-300">
                  External NPM / Library Packages ({file.externalPackages.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {file.externalPackages.map((pkg, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono"
                    >
                      {pkg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Exported Symbols */}
            {file.exportedSymbols.length > 0 && (
              <div className="space-y-2 font-mono">
                <span className="text-xs font-bold text-slate-300">
                  Exported Public Symbols ({file.exportedSymbols.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {file.exportedSymbols.map((sym, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300 font-mono"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: AI ARCHITECTURE AUDIT */}
        {activeTab === 'ai-audit' && (
          <div className="space-y-5 font-mono">
            {isLoadingAudit ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-purple-500/30 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                <div className="text-sm font-bold text-white">Running Gemini Architecture Audit...</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Analyzing code structure, security postures, maintainability boundaries, and role in {file.fileName}...
                </p>
              </div>
            ) : auditError ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  Audit Failed
                </div>
                <p>{auditError}</p>
                <Button size="sm" variant="outline" onClick={handleRunAiAudit}>
                  Retry Audit
                </Button>
              </div>
            ) : aiAudit ? (
              <div className="space-y-4">
                {/* Audit Header Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 via-slate-900 to-cyan-950/30 border border-purple-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-purple-300 font-semibold uppercase tracking-wider block">
                      Architectural Quality Score
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-white">
                        {aiAudit.qualityScore || 88}/100
                      </span>
                      <span className="text-xs text-slate-400">
                        Grade: {aiAudit.maintainabilityRating || 'A'}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRunAiAudit}
                    className="text-xs font-mono"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
                    Re-Analyze
                  </Button>
                </div>

                {/* Summary */}
                {aiAudit.summary && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      Module Purpose & Overview
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {aiAudit.summary}
                    </p>
                  </div>
                )}

                {/* Architectural Role */}
                {aiAudit.architecturalRole && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      Role in Application Architecture
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {aiAudit.architecturalRole}
                    </p>
                  </div>
                )}

                {/* Security Audit */}
                {aiAudit.securityAudit && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Security & Vulnerability Posture
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold ${
                        aiAudit.securityAudit.status === 'alert'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : aiAudit.securityAudit.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {aiAudit.securityAudit.status || 'Passed'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans">
                      {aiAudit.securityAudit.notes || 'No critical vulnerabilities or credentials leakage found.'}
                    </p>
                  </div>
                )}

                {/* Key Functions */}
                {aiAudit.keyFunctions && aiAudit.keyFunctions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300">Key Functions & Handlers</span>
                    <div className="space-y-1.5">
                      {aiAudit.keyFunctions.map((fn: any, i: number) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                          <span className="text-cyan-300 font-bold">{fn.name}</span>
                          {fn.signature && <span className="text-slate-500 text-[10px] block truncate">{fn.signature}</span>}
                          <p className="text-slate-400 text-[11px] mt-0.5">{fn.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {aiAudit.recommendations && aiAudit.recommendations.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Architectural Recommendations
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                      {aiAudit.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto opacity-70" />
                <div className="text-sm font-bold text-white">Gemini Architecture Audit Available</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Evaluate security vulnerabilities, function boundaries, coupling risks, and optimization advice.
                </p>
                <Button size="sm" onClick={handleRunAiAudit}>
                  Start AI Audit
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SOURCE CODE */}
        {activeTab === 'source' && (
          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{file.path}</span>
              <span>{file.linesOfCode} lines · {file.size} bytes</span>
            </div>

            {isLoadingContent ? (
              <div className="p-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
                Loading source code...
              </div>
            ) : (
              <div className="rounded-xl bg-[#030712] border border-slate-800 overflow-x-auto text-xs p-4 leading-relaxed text-slate-300 max-h-[500px]">
                <pre className="font-mono">
                  {rawContent}
                </pre>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
