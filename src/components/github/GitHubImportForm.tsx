import React, { useState } from 'react';
import { Github, Sparkles, AlertCircle, ArrowRight, CheckCircle2, History } from 'lucide-react';
import { Button } from '../Button';

interface GitHubImportFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  historyRepos?: Array<{ id: string; name: string; owner: string; url: string }>;
  onSelectHistory?: (url: string) => void;
}

export const GitHubImportForm: React.FC<GitHubImportFormProps> = ({
  onAnalyze,
  isLoading,
  historyRepos = [],
  onSelectHistory
}) => {
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const sampleRepos = [
    { label: 'Express.js', url: 'https://github.com/expressjs/express' },
    { label: 'React', url: 'https://github.com/facebook/react' },
    { label: 'Next.js Commerce', url: 'https://github.com/vercel/commerce' },
    { label: 'FastAPI', url: 'https://github.com/fastapi/fastapi' },
  ];

  const validateUrl = (input: string): boolean => {
    setValidationError(null);
    if (!input.trim()) {
      setValidationError('Please enter a GitHub repository URL');
      return false;
    }

    const regex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(?:\.git)?(?:\/.*)?$/;
    if (!regex.test(input.trim())) {
      setValidationError('Invalid GitHub URL. Must be in the format: https://github.com/username/repository');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(url)) {
      onAnalyze(url.trim());
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setValidationError(null);
    onAnalyze(sampleUrl);
  };

  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0F172A] border border-purple-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        
        {/* Header Badges & Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-cyan-400">
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repository Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Understand Any Codebase in Minutes with AI
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Enter any public GitHub repository to extract technology stack, architecture topologies, discovered REST APIs, database schemas, and AI code explanations.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="relative flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Github className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="https://github.com/username/repository"
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-950/80 rounded-2xl border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                  validationError
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                    : 'border-slate-700/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="submit"
                variant="gradient"
                size="md"
                isLoading={isLoading}
                leftIcon={<Sparkles className="w-4 h-4" />}
                className="w-full sm:w-auto text-xs font-semibold px-6 py-3.5 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                Analyze Repository
              </Button>
            </div>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Quick Sample Repos */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-500">Try popular repos:</span>
            {sampleRepos.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handleSelectSample(sample.url)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Previously Analyzed Quick Switcher */}
          {historyRepos.length > 0 && onSelectHistory && (
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              <span className="text-slate-500 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-purple-400" />
                Cached Analyses:
              </span>
              {historyRepos.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectHistory(r.url)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-800/40 transition-colors cursor-pointer"
                >
                  {r.name}
                </button>
              ))}
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
