import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe, 
  Smartphone, 
  Layers, 
  ChevronDown, 
  Wand2, 
  Terminal, 
  Cpu, 
  Check, 
  Network,
  Database,
  Workflow
} from 'lucide-react';
import { ProjectType, AIModelId } from '../types';
import { AI_MODELS, PROMPT_SUGGESTIONS } from '../data/mockData';
import { Button } from './Button';

export const ARCHITECTURE_PATTERNS = [
  { id: 'Event-Driven Microservices', label: 'Event-Driven Microservices', desc: 'Decoupled domain services + BullMQ / Kafka stream + Redis' },
  { id: 'Modular Monolith', label: 'Modular Monolith', desc: 'Clean architecture with domain boundaries in unified runtime' },
  { id: 'Edge-Accelerated Jamstack', label: 'Edge-Accelerated Jamstack', desc: 'Edge SSR + Global CDN caching + Serverless functions' },
  { id: 'Real-Time WebSocket Cluster', label: 'Real-Time WebSocket Cluster', desc: 'Bi-directional state sync with Redis Pub/Sub backplane' },
  { id: 'Serverless Event Pipeline', label: 'Serverless Event Pipeline', desc: 'Zero-idle compute with event triggers and queue workers' }
];

export const DATABASE_DIALECTS = [
  'PostgreSQL (Drizzle ORM)',
  'Supabase (Postgres + Realtime)',
  'MongoDB Atlas (Mongoose)',
  'SQLite (Turso Edge)'
];

interface PromptEditorProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  selectedModel: AIModelId;
  onModelChange: (model: AIModelId) => void;
  selectedType: ProjectType;
  onTypeChange: (type: ProjectType) => void;
  selectedPattern?: string;
  onPatternChange?: (pattern: string) => void;
  selectedDatabase?: string;
  onDatabaseChange?: (db: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  onPromptChange,
  selectedModel,
  onModelChange,
  selectedType,
  onTypeChange,
  selectedPattern = 'Event-Driven Microservices',
  onPatternChange,
  selectedDatabase = 'PostgreSQL (Drizzle ORM)',
  onDatabaseChange,
  onGenerate,
  isGenerating
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [patternDropdownOpen, setPatternDropdownOpen] = useState(false);
  const [dbDropdownOpen, setDbDropdownOpen] = useState(false);

  const currentModel = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  const projectTypes: { id: ProjectType; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'website',
      title: 'Website',
      desc: 'React 19, Tailwind CSS v4, Vite client-side SPA or responsive app',
      icon: <Globe className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'mobile',
      title: 'Mobile App',
      desc: 'React Native / Expo SDK 52 cross-platform iOS & Android layout',
      icon: <Smartphone className="w-5 h-5 text-purple-400" />
    },
    {
      id: 'fullstack',
      title: 'Full Stack App',
      desc: 'End-to-end React 19 frontend + Express 5 API + Drizzle SQL schema',
      icon: <Layers className="w-5 h-5 text-indigo-400" />
    }
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Configuration Toolbar: Model & Architecture Stack Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#0F172A]/70 border border-slate-800/80 backdrop-blur-md">
        
        {/* Model Selector Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-mono text-slate-400 mb-1">
            Active Reasoning Engine
          </label>
          <button
            type="button"
            onClick={() => {
              setModelDropdownOpen(!modelDropdownOpen);
              setPatternDropdownOpen(false);
              setDbDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-purple-500/50 text-slate-200 text-xs sm:text-sm font-medium transition-all shadow-sm"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="text-left truncate">
                <span className="font-semibold text-white truncate block">{currentModel.name}</span>
                <span className="text-[10px] text-slate-400 font-mono block">({currentModel.speed})</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {/* Model Dropdown Menu */}
          {modelDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 max-w-[90vw] rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl p-2 z-30 backdrop-blur-xl">
              <div className="text-[11px] font-mono text-slate-400 px-3 py-1.5 border-b border-slate-800">
                Select Model Archetype
              </div>
              <div className="mt-1 space-y-1">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 ${
                      selectedModel === model.id 
                        ? 'bg-purple-900/30 border border-purple-500/40 text-white' 
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {selectedModel === model.id ? (
                        <Check className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{model.name}</span>
                        {model.badge && (
                          <span className="text-[10px] text-cyan-400 font-mono">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {model.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Architecture Pattern Selector */}
        <div className="relative">
          <label className="block text-[11px] font-mono text-slate-400 mb-1">
            System Architecture Style
          </label>
          <button
            type="button"
            onClick={() => {
              setPatternDropdownOpen(!patternDropdownOpen);
              setModelDropdownOpen(false);
              setDbDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs sm:text-sm font-medium transition-all shadow-sm"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Network className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-left truncate">
                <span className="font-semibold text-white truncate block">{selectedPattern}</span>
                <span className="text-[10px] text-slate-400 font-mono block">Multi-Tier Pattern</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {/* Pattern Dropdown Menu */}
          {patternDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl p-2 z-30 backdrop-blur-xl">
              <div className="text-[11px] font-mono text-slate-400 px-3 py-1.5 border-b border-slate-800">
                Architectural Blueprint
              </div>
              <div className="mt-1 space-y-1">
                {ARCHITECTURE_PATTERNS.map((pat) => (
                  <button
                    key={pat.id}
                    onClick={() => {
                      onPatternChange?.(pat.id);
                      setPatternDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 ${
                      selectedPattern === pat.id 
                        ? 'bg-cyan-950/40 border border-cyan-500/40 text-white' 
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {selectedPattern === pat.id ? (
                        <Check className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-white">{pat.label}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{pat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Project Type Cards (Website, Mobile App, Full Stack App) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-medium text-slate-300">
            Select Project Target
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {selectedType === 'fullstack' ? 'Full Stack Repositories' : selectedType === 'website' ? 'Frontend Client SPA' : 'Mobile Framework'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {projectTypes.map((pt) => {
            const isSelected = selectedType === pt.id;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => onTypeChange(pt.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/25 border-purple-500/80 shadow-lg shadow-purple-950/50 ring-1 ring-purple-500/30'
                    : 'bg-[#0F172A]/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full pointer-events-none" />
                )}
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center">
                    {pt.icon}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/40 text-xs">
                      ✓
                    </div>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-200">
                  {pt.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {pt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Database Dialect Quick Selector */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Persistence Dialect:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DATABASE_DIALECTS.map((db) => (
            <button
              key={db}
              type="button"
              onClick={() => onDatabaseChange?.(db)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                selectedDatabase === db
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {db.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Large Multiline Prompt Editor */}
      <div className="relative rounded-3xl bg-[#0F172A]/90 border border-slate-800/90 shadow-2xl p-4 sm:p-5 focus-within:border-purple-500/60 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-slate-200">System Prompt & Functional Requirements</span>
          </div>
          <span className="font-mono text-slate-500">{prompt.length} chars</span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe your desired application in depth... Specify features, user roles, state management, API routes, database tables, and theme preferences."
          rows={6}
          className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm sm:text-base focus:outline-none resize-none font-normal leading-relaxed"
        />

        {/* Suggestion Chips */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-mono text-slate-400">
              Curated Prompt Blueprints:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onPromptChange(item.prompt)}
                className="text-xs px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-purple-950/40 border border-slate-700/60 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button Action Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Ready to generate code & system architecture</span>
          </div>

          <Button
            variant="gradient"
            size="lg"
            onClick={onGenerate}
            isLoading={isGenerating}
            rightIcon={<Wand2 className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-lg shadow-purple-600/30 px-8 py-3.5 cursor-pointer font-bold tracking-wide"
          >
            {isGenerating ? 'Synthesizing Architecture...' : 'Generate Code & Architecture'}
          </Button>
        </div>
      </div>

    </div>
  );
};
