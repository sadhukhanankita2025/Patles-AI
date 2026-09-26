import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeviceMode } from './DevicePreviewToggle';
import { BuilderPreviewTab, BuilderToolbar } from './BuilderToolbar';
import { BrowserPreview } from './BrowserPreview';
import { ArchitectureCanvas } from './ArchitectureCanvas';
import { CodePreviewPanel } from './CodePreviewPanel';
import { ApiExplorer } from './ApiExplorer';
import { SchemaViewer } from './SchemaViewer';
import { SnapshotTimeline, SnapshotItem } from './SnapshotTimeline';
import { ProjectTreeFile } from './GeneratedProjectTree';

interface LivePreviewPanelProps {
  activeTab: BuilderPreviewTab;
  onTabChange: (tab: BuilderPreviewTab) => void;
  device: DeviceMode;
  onDeviceChange: (device: DeviceMode) => void;
  project: any;
  files: ProjectTreeFile[];
  selectedFilePath: string;
  onSelectFile: (path: string) => void;
  isGenerating: boolean;
  hasGenerated: boolean;
  snapshots: SnapshotItem[];
  onSaveSnapshot: (name: string) => Promise<void>;
  onRestoreSnapshot: (id: string) => Promise<void>;
  onSaveFile?: (path: string, content: string) => Promise<void>;
  onOpenWorkspace: () => void;
  onExportZip: () => void;
  onExportReadme: () => void;
  onExportSql: () => void;
  onExportArchitecture: () => void;
  onExportApiDocs: () => void;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  activeTab,
  onTabChange,
  device,
  onDeviceChange,
  project,
  files,
  selectedFilePath,
  onSelectFile,
  isGenerating,
  hasGenerated,
  snapshots,
  onSaveSnapshot,
  onRestoreSnapshot,
  onSaveFile,
  onOpenWorkspace,
  onExportZip,
  onExportReadme,
  onExportSql,
  onExportArchitecture,
  onExportApiDocs
}) => {
  return (
    <div className="h-full flex flex-col bg-[#020617] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
      {/* Top Browser & Tab Bar */}
      <BuilderToolbar
        activeTab={activeTab}
        onTabChange={onTabChange}
        device={device}
        onDeviceChange={onDeviceChange}
        onExportZip={onExportZip}
        onExportReadme={onExportReadme}
        onExportSql={onExportSql}
        onExportArchitecture={onExportArchitecture}
        onExportApiDocs={onExportApiDocs}
        onOpenWorkspace={onOpenWorkspace}
      />

      {/* Main Content Area based on Tab */}
      <div className="flex-1 p-3 sm:p-4 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'visual' && (
            <motion.div
              key="visual"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <BrowserPreview
                device={device}
                project={project}
                isGenerating={isGenerating}
                hasGenerated={hasGenerated}
                onOpenWorkspace={onOpenWorkspace}
                onSelectFile={(path) => {
                  onSelectFile(path);
                  onTabChange('code');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <CodePreviewPanel
                projectId={project?.id}
                files={files}
                selectedFilePath={selectedFilePath}
                onSelectFile={onSelectFile}
                projectName={project?.name || project?.projectName || 'HealthcareConnect'}
                onSaveFile={onSaveFile}
                openInWorkspace={onOpenWorkspace}
              />
            </motion.div>
          )}

          {activeTab === 'architecture' && (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ArchitectureCanvas
                project={project}
                architectureData={project?.architecture}
              />
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ApiExplorer
                projectId={project?.id}
                projectName={project?.name || project?.projectName || 'HealthcareConnect'}
              />
            </motion.div>
          )}

          {activeTab === 'schema' && (
            <motion.div
              key="schema"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <SchemaViewer
                projectId={project?.id}
                projectName={project?.name || project?.projectName || 'HealthcareConnect'}
              />
            </motion.div>
          )}

          {activeTab === 'snapshots' && (
            <motion.div
              key="snapshots"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <SnapshotTimeline
                projectId={project?.id || 'proj_healthcare_connect'}
                snapshots={snapshots}
                onSaveSnapshot={onSaveSnapshot}
                onRestoreSnapshot={onRestoreSnapshot}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
