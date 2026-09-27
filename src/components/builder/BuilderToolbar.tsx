import React, { useState } from 'react';
import { 
  Eye, 
  Code2, 
  Layers, 
  Download, 
  ExternalLink, 
  FileArchive, 
  FileText, 
  Database, 
  FileJson,
  Check,
  ChevronDown
} from 'lucide-react';
import { DeviceMode, DevicePreviewToggle } from './DevicePreviewToggle';

export type BuilderPreviewTab = 'visual' | 'code' | 'architecture' | 'api' | 'schema' | 'snapshots';

interface BuilderToolbarProps {
  activeTab: BuilderPreviewTab;
  onTabChange: (tab: BuilderPreviewTab) => void;
  device: DeviceMode;
  onDeviceChange: (device: DeviceMode) => void;
  onExportZip: () => void;
  onExportReadme: () => void;
  onExportSql: () => void;
  onExportArchitecture: () => void;
  onExportApiDocs: () => void;
  onOpenWorkspace: () => void;
}

export const BuilderToolbar: React.FC<BuilderToolbarProps> = ({
  activeTab,
  onTabChange,
  device,
  onDeviceChange,
  onExportZip,
  onExportReadme,
  onExportSql,
  onExportArchitecture,
  onExportApiDocs,
  onOpenWorkspace
}) => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0B1120] border-b border-white/10 rounded-2xl">
      {/* Left: Mode Tabs (Visual, Code, Architecture, API, Schema, Snapshots) */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onTabChange('visual')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'visual'
              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-300" />
          <span>Visual Preview</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('code')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'code'
              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-purple-300" />
          <span>Code Editor</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('architecture')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-300" />
          <span>Architecture</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('api')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'api'
              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>APIs</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('schema')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'schema'
              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span>SQL Schema</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('snapshots')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'snapshots'
              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Snapshots</span>
        </button>
      </div>

      {/* Right Controls: Device Toggles & Export & Workspace */}
      <div className="flex items-center gap-2">
        {/* Device toggle only visible on visual preview */}
        {activeTab === 'visual' && (
          <DevicePreviewToggle device={device} onChange={onDeviceChange} />
        )}

        {/* Export dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {exportMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0F172A] border border-white/10 shadow-2xl p-2 z-50 font-mono text-xs space-y-1">
              <button
                onClick={() => { onExportZip(); setExportMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-left text-slate-200 hover:bg-purple-600 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileArchive className="w-3.5 h-3.5 text-purple-400" />
                <span>Download ZIP Bundle</span>
              </button>

              <button
                onClick={() => { onExportReadme(); setExportMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-left text-slate-200 hover:bg-purple-600 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download README.md</span>
              </button>

              <button
                onClick={() => { onExportSql(); setExportMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-left text-slate-200 hover:bg-purple-600 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Download SQL Schema</span>
              </button>

              <button
                onClick={() => { onExportArchitecture(); setExportMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-left text-slate-200 hover:bg-purple-600 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileJson className="w-3.5 h-3.5 text-blue-400" />
                <span>Download Architecture JSON</span>
              </button>

              <button
                onClick={() => { onExportApiDocs(); setExportMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-left text-slate-200 hover:bg-purple-600 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download API Docs (Postman)</span>
              </button>
            </div>
          )}
        </div>

        {/* Open in Workspace Button */}
        <button
          type="button"
          onClick={onOpenWorkspace}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition-all cursor-pointer"
          title="Open in Full IDE Workspace"
        >
          <span>Open Workspace</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
