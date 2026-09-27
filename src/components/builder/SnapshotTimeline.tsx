import React, { useState } from 'react';
import { 
  Camera, 
  RotateCcw, 
  Clock, 
  GitBranch, 
  Check, 
  FileText, 
  Loader2, 
  AlertCircle,
  Plus,
  Layers,
  Sparkles,
  Trash2,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Search,
  Code2,
  CheckCircle2,
  FileCode,
  Shield,
  HelpCircle,
  Tag
} from 'lucide-react';
import JSZip from 'jszip';
import { Modal } from '../Modal';

export interface SnapshotItem {
  id: string;
  project_id?: string;
  name: string;
  description?: string;
  files_count: number;
  prompt?: string;
  architecture_summary?: string;
  created_at: string;
}

export interface SnapshotDetailFile {
  id: string;
  path: string;
  file_name: string;
  language: string;
  size: number;
  content: string;
}

interface SnapshotTimelineProps {
  projectId: string;
  snapshots: SnapshotItem[];
  onSaveSnapshot: (name: string, description?: string) => Promise<void>;
  onRestoreSnapshot: (id: string) => Promise<void>;
  onDeleteSnapshot?: (id: string) => Promise<void>;
}

export const SnapshotTimeline: React.FC<SnapshotTimelineProps> = ({
  projectId,
  snapshots,
  onSaveSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot
}) => {
  const [snapshotName, setSnapshotName] = useState('');
  const [snapshotDescription, setSnapshotDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Expandable inspection of files per snapshot
  const [expandedSnapshotId, setExpandedSnapshotId] = useState<string | null>(null);
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(null);
  const [snapshotFilesCache, setSnapshotFilesCache] = useState<Record<string, SnapshotDetailFile[]>>({});

  // File Preview Modal
  const [previewFile, setPreviewFile] = useState<{ path: string; language: string; content: string } | null>(null);

  // Restore Confirmation Modal
  const [confirmRestoreSnap, setConfirmRestoreSnap] = useState<SnapshotItem | null>(null);

  const quickPresets = [
    'Baseline Scaffold',
    'Pre-Refactor',
    'Working Auth & APIs',
    'Database Migrated',
    'Production Ready'
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotName.trim()) return;

    setIsSaving(true);
    try {
      await onSaveSnapshot(snapshotName.trim(), snapshotDescription.trim() || undefined);
      setSnapshotName('');
      setSnapshotDescription('');
      setNotification({
        type: 'success',
        text: `Snapshot "${snapshotName.trim()}" created successfully! Checkpoint preserved.`
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: `Failed to save snapshot: ${err.message || 'Unknown error'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyPreset = (preset: string) => {
    setSnapshotName(preset);
  };

  const handleFetchSnapshotDetails = async (snapId: string) => {
    if (expandedSnapshotId === snapId) {
      setExpandedSnapshotId(null);
      return;
    }

    setExpandedSnapshotId(snapId);

    // Check cache first
    if (snapshotFilesCache[snapId]) return;

    setLoadingDetailsId(snapId);
    try {
      const res = await fetch(`/api/projects/${projectId}/snapshots/${snapId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.snapshot && data.snapshot.files) {
          setSnapshotFilesCache(prev => ({
            ...prev,
            [snapId]: data.snapshot.files
          }));
        }
      }
    } catch (err) {
      console.warn('Could not load snapshot file details:', err);
    } finally {
      setLoadingDetailsId(null);
    }
  };

  const handleExecuteRestore = async (snap: SnapshotItem) => {
    setConfirmRestoreSnap(null);
    setRestoringId(snap.id);
    try {
      await onRestoreSnapshot(snap.id);
      setNotification({
        type: 'success',
        text: `Project reverted to checkpoint "${snap.name}". Editor & preview updated.`
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: `Failed to restore snapshot: ${err.message || 'Revert error'}`
      });
    } finally {
      setRestoringId(null);
    }
  };

  const handleDelete = async (snapId: string, snapName: string) => {
    if (!confirm(`Are you sure you want to delete snapshot "${snapName}"?`)) return;

    setDeletingId(snapId);
    try {
      if (onDeleteSnapshot) {
        await onDeleteSnapshot(snapId);
      } else {
        const res = await fetch(`/api/projects/${projectId}/snapshots/${snapId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
      }
      setNotification({
        type: 'info',
        text: `Snapshot "${snapName}" removed.`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: `Failed to delete snapshot: ${err.message}`
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadZip = async (snapId: string, snapName: string) => {
    setDownloadingId(snapId);
    try {
      let files = snapshotFilesCache[snapId];
      if (!files) {
        const res = await fetch(`/api/projects/${projectId}/snapshots/${snapId}`);
        if (res.ok) {
          const data = await res.json();
          files = data.snapshot?.files || [];
        }
      }

      if (!files || files.length === 0) {
        throw new Error('No files found in snapshot archive.');
      }

      const zip = new JSZip();
      for (const file of files) {
        zip.file(file.path, file.content || '');
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${snapName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_checkpoint.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setNotification({
        type: 'success',
        text: `Downloaded archive for "${snapName}"`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: `Download failed: ${err.message}`
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredSnapshots = snapshots.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
  });

  return (
    <div className="h-full flex flex-col space-y-4 p-5 bg-[#0B1120] rounded-2xl border border-white/10 font-mono text-xs">
      
      {/* Header & Save Form */}
      <div className="flex flex-col space-y-3 border-b border-white/10 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Camera className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Project Snapshot & Version Checkpoints
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-[10px] text-purple-300 font-bold">
                {snapshots.length} {snapshots.length === 1 ? 'Checkpoint' : 'Checkpoints'}
              </span>
            </div>
            <p className="text-slate-400 font-sans text-xs mt-1">
              Store immutable snapshots of full multi-tier code trees and revert to previous generated states anytime.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="hidden lg:flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Quick:
            </span>
            {quickPresets.slice(0, 3).map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-purple-400/50 transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Save Snapshot Form */}
        <form onSubmit={handleCreate} className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-5">
            <input
              type="text"
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="Checkpoint name (e.g. Added JWT Auth)"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="sm:col-span-4">
            <input
              type="text"
              value={snapshotDescription}
              onChange={(e) => setSnapshotDescription(e.target.value)}
              placeholder="Optional notes or changelog..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isSaving || !snapshotName.trim()}
              className="w-full h-full py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-900/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Save Snapshot</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 animate-in fade-in duration-200 ${
          notification.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : notification.type === 'error'
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            : 'bg-purple-950/40 border-purple-500/40 text-purple-200'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {notification.type === 'info' && <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span>{notification.text}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter & Toolbar */}
      {snapshots.length > 0 && (
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search checkpoints..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400/50"
            />
          </div>
          <span className="text-[11px] text-slate-500">
            Showing {filteredSnapshots.length} of {snapshots.length}
          </span>
        </div>
      )}

      {/* Snapshots Timeline List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {snapshots.length === 0 ? (
          <div className="text-center py-14 px-4 rounded-2xl bg-slate-950/40 border border-dashed border-white/10 text-slate-500 space-y-3">
            <Camera className="w-10 h-10 mx-auto opacity-40 text-purple-400" />
            <div className="space-y-1">
              <p className="text-white font-semibold text-sm">No checkpoints saved yet</p>
              <p className="text-xs max-w-md mx-auto text-slate-400">
                Snapshots allow you to experiment fearlessly. Create a checkpoint above to preserve your generated project code and revert changes at any time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSnapshotName('Baseline Code');
                setSnapshotDescription('Initial full-stack scaffold');
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs transition-colors cursor-pointer"
            >
              Fill Sample Checkpoint
            </button>
          </div>
        ) : filteredSnapshots.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <p>No snapshots matching &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          filteredSnapshots.map((snap) => {
            const isExpanded = expandedSnapshotId === snap.id;
            const detailFiles = snapshotFilesCache[snap.id] || [];
            const isRestoring = restoringId === snap.id;
            const isDeleting = deletingId === snap.id;
            const isDownloading = downloadingId === snap.id;

            return (
              <div
                key={snap.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'bg-slate-950/90 border-purple-500/50 shadow-lg shadow-purple-950/30'
                    : 'bg-slate-950/60 border-white/10 hover:border-purple-500/30'
                }`}
              >
                {/* Main Snapshot Header Card */}
                <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-white text-xs sm:text-sm truncate">
                        {snap.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono">
                        {snap.files_count || 14} files preserved
                      </span>
                      {snap.id.includes('seed') && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-300 border border-purple-500/40">
                          Initial Baseline
                        </span>
                      )}
                    </div>

                    {snap.description && (
                      <p className="text-slate-300 text-xs font-sans line-clamp-2">
                        {snap.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-slate-400 text-[11px] font-sans flex-wrap">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(snap.created_at).toLocaleString()}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                        {snap.id}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Inspect files button */}
                    <button
                      type="button"
                      onClick={() => handleFetchSnapshotDetails(snap.id)}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isExpanded
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                          : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]'
                      }`}
                      title="Inspect Preserved Files"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isExpanded ? 'Hide Files' : 'Inspect'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Download ZIP */}
                    <button
                      type="button"
                      onClick={() => handleDownloadZip(snap.id, snap.name)}
                      disabled={isDownloading}
                      className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                      title="Export Snapshot as ZIP Archive"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span className="hidden sm:inline">Export</span>
                    </button>

                    {/* Restore State Button */}
                    <button
                      type="button"
                      onClick={() => setConfirmRestoreSnap(snap)}
                      disabled={isRestoring}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-cyan-900/30 transition-all cursor-pointer disabled:opacity-50"
                      title="Revert project code to this checkpoint"
                    >
                      {isRestoring ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5 text-white" />
                      )}
                      <span>{isRestoring ? 'Reverting...' : 'Restore State'}</span>
                    </button>

                    {/* Delete Snapshot */}
                    <button
                      type="button"
                      onClick={() => handleDelete(snap.id, snap.name)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-xl bg-white/[0.02] hover:bg-rose-950/40 border border-white/5 hover:border-rose-500/40 text-slate-500 hover:text-rose-300 transition-colors cursor-pointer disabled:opacity-40"
                      title="Delete Checkpoint"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded File Inspection Drawer */}
                {isExpanded && (
                  <div className="border-t border-white/10 p-4 bg-slate-950/80 rounded-b-2xl space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-purple-400" />
                        Files Saved in this Checkpoint:
                      </span>
                      <span>Click file to view code</span>
                    </div>

                    {loadingDetailsId === snap.id ? (
                      <div className="py-6 text-center text-slate-500 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                        <span>Loading preserved file tree...</span>
                      </div>
                    ) : detailFiles.length === 0 ? (
                      <p className="text-slate-500 py-3 text-center">No detailed files found for this snapshot.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                        {detailFiles.map((file) => (
                          <button
                            key={file.id || file.path}
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            className="p-2 rounded-xl bg-slate-900/80 border border-white/5 hover:border-cyan-400/40 hover:bg-slate-900 transition-all text-left flex items-center justify-between gap-2 group cursor-pointer"
                          >
                            <div className="min-w-0">
                              <p className="text-slate-200 text-xs font-mono truncate group-hover:text-cyan-300 transition-colors">
                                {file.path}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {file.language} • {Math.round(file.size / 1024 * 10) / 10} KB
                              </span>
                            </div>
                            <Eye className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 shrink-0 transition-colors" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Restore Confirmation Dialog Modal */}
      {confirmRestoreSnap && (
        <Modal
          isOpen={!!confirmRestoreSnap}
          onClose={() => setConfirmRestoreSnap(null)}
          title="Confirm Codebase Reversion"
          description={`Reverting to snapshot: ${confirmRestoreSnap.name}`}
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Restore Checkpoint Warning</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Restoring this snapshot will replace all current files in the active project with the {confirmRestoreSnap.files_count} files stored in checkpoint <strong>&quot;{confirmRestoreSnap.name}&quot;</strong>.
              </p>
            </div>

            <div className="text-xs text-slate-400 font-mono space-y-1">
              <div>Created: {new Date(confirmRestoreSnap.created_at).toLocaleString()}</div>
              <div>Snapshot ID: {confirmRestoreSnap.id}</div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmRestoreSnap(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleExecuteRestore(confirmRestoreSnap)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm & Revert Files</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Snapshot Preserved File Preview Modal */}
      {previewFile && (
        <Modal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          title={`File Preview: ${previewFile.path}`}
          description={`Preserved checkpoint content (${previewFile.language})`}
          maxWidth="4xl"
        >
          <div className="space-y-3 pt-2">
            <div className="max-h-[460px] overflow-auto rounded-2xl bg-black/80 border border-white/10 p-4 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre">
              {previewFile.content}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
              <span>Path: {previewFile.path}</span>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
