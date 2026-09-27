import React from 'react';
import { 
  Sparkles, 
  Wand2, 
  X,
  Lightbulb,
  ArrowRight,
  CornerDownLeft
} from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '../data/mockData';
import { Button } from './Button';

interface PromptEditorProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isGenerating && prompt.trim()) {
        onGenerate();
      }
    }
  };

  return (
    <div className="w-full">
      {/* Prompt Input Block Container */}
      <div className="relative rounded-3xl bg-[#0F172A]/90 border border-slate-800/90 shadow-2xl p-5 sm:p-6 focus-within:border-cyan-500/60 focus-within:ring-4 focus-within:ring-cyan-500/10 transition-all backdrop-blur-xl">
        
        {/* Block Header */}
        <div className="flex items-center justify-between mb-3 text-xs border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Enter Project Prompt</span>
              <span className="text-[11px] text-slate-400">Describe the app, features, API routes, and database models</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
              {prompt.length} chars
            </span>
            {prompt && (
              <button
                type="button"
                onClick={() => onPromptChange('')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Textarea Input */}
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Build an AI-powered SaaS application with user authentication, real-time analytics dashboard, PostgreSQL schema with Drizzle ORM, Express REST API endpoints, and clean modern responsive UI..."
          rows={7}
          className="w-full bg-slate-950/70 rounded-2xl p-4 border border-slate-800/80 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 resize-y min-h-[170px] leading-relaxed font-sans"
        />

        {/* Suggestion Chips */}
        <div className="pt-3.5 mt-3 border-t border-slate-800/70">
          <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-mono text-slate-400">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Example Project Blueprints (click to load):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onPromptChange(item.prompt)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-950/40 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-1.5 group"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-300">⌘+Enter</kbd> or click</span>
            <span className="sm:hidden">Ready to synthesize</span>
          </div>

          <Button
            variant="gradient"
            size="lg"
            onClick={onGenerate}
            isLoading={isGenerating}
            rightIcon={<Wand2 className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-lg shadow-cyan-600/25 hover:shadow-cyan-500/40 px-8 py-3.5 cursor-pointer font-bold tracking-wide"
          >
            {isGenerating ? 'Synthesizing Architecture...' : 'Generate Code & Architecture'}
          </Button>
        </div>

      </div>
    </div>
  );
};
