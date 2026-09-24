import React from 'react';
import { Database, ArrowDown, FileCode, CheckCircle2, Layers, HardDrive } from 'lucide-react';
import { DatabaseArchitecture } from '../../types/github';

interface DatabaseExplorerProps {
  database: DatabaseArchitecture;
  onSelectSchemaFile?: (filePath: string) => void;
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({ database, onSelectSchemaFile }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Database & Persistence Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Scanned ORM definitions, schema migrations, and relational entities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold">
            {database.type || 'PostgreSQL'}
          </span>
          {database.orm && (
            <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
              ORM: {database.orm}
            </span>
          )}
        </div>
      </div>

      {/* Database Architecture Flow Diagram */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
          Persistence Architecture Pipeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {database.flow.map((step, idx) => (
            <div
              key={idx}
              className="relative p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2 group hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                {idx + 1}
              </div>
              <span className="text-xs font-semibold text-white font-mono">{step}</span>
              <span className="text-[10px] text-slate-500 font-mono">Layer {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Schemas & Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Discovered Models / Tables */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Entities & Tables ({database.models?.length || 0})
            </h4>
            <span className="text-[11px] font-mono text-slate-500">Relational Schema</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {database.models && database.models.length > 0 ? (
              database.models.map((model, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{model}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 font-mono">No explicit models scanned</div>
            )}
          </div>
        </div>

        {/* Schema & Migration Files */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              Schema & Migration Files
            </h4>
            <span className="text-[11px] font-mono text-slate-500">Sources</span>
          </div>

          <div className="space-y-2 pt-1">
            {database.schemaFiles && database.schemaFiles.length > 0 ? (
              database.schemaFiles.map((file, i) => (
                <div
                  key={i}
                  onClick={() => onSelectSchemaFile && onSelectSchemaFile(file)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 font-mono text-xs text-cyan-300 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{file}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">View</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 font-mono">Standard ORM schema files</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
