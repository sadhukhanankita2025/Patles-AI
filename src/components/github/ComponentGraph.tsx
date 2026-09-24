import React, { useState } from 'react';
import { Layers, ArrowRight, Code2, CheckCircle2, ChevronRight, FileCode } from 'lucide-react';
import { ComponentNode } from '../../types/github';

interface ComponentGraphProps {
  components: ComponentNode[];
  onSelectComponent?: (comp: ComponentNode) => void;
}

export const ComponentGraph: React.FC<ComponentGraphProps> = ({
  components = [],
  onSelectComponent
}) => {
  const [activeComponent, setActiveComponent] = useState<ComponentNode | null>(components[0] || null);

  const handleComponentClick = (comp: ComponentNode) => {
    setActiveComponent(comp);
    if (onSelectComponent) onSelectComponent(comp);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Component Relationship Hierarchy
            </h2>
            <p className="text-xs text-slate-400">
              Interactive visual graph of frontend components, sub-modules, and import dependencies
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60">
          {components.length} Components Scanned
        </span>
      </div>

      {components.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500 font-mono">
          No frontend React or Vue components detected in this repository.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Component List */}
          <div className="lg:col-span-5 space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {components.map((comp, idx) => {
              const isSelected = activeComponent?.name === comp.name;
              return (
                <div
                  key={idx}
                  onClick={() => handleComponentClick(comp)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between font-mono text-xs ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500/50 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Code2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-bold truncate">{comp.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {comp.dependencies.length} deps
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Component Dependency Inspector */}
          <div className="lg:col-span-7">
            {activeComponent ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-bold text-white text-sm">
                      {activeComponent.name}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 truncate max-w-xs">
                    {activeComponent.path}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 block font-semibold text-[11px]">
                    IMPORTED SUB-COMPONENTS & DEPENDENCIES ({activeComponent.dependencies.length})
                  </span>

                  {activeComponent.dependencies.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-xs">
                      Leaf component (No local sub-components imported directly)
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeComponent.dependencies.map((dep, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{dep}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-slate-300 font-sans text-xs">
                  <span className="font-bold font-mono text-purple-300 block mb-1">Architecture Note:</span>
                  This component integrates with parent view controllers and renders state-driven interfaces.
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 font-mono text-xs">
                Select a component from the list to view its dependencies.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
