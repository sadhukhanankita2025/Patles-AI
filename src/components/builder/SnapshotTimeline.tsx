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
  Sparkles
} from 'lucide-react';

export interface SnapshotItem {
  id: string;
  name: string;
  description?: string;
  files_count: number;
  created_at: string;
}

interface SnapshotTimelineProps {
  projectId: string;
  snapshots: SnapshotItem[];
  onSaveSnapshot: (name: string) => Promise<void>;
  onRestoreSnapshot: (id: string) => Promise<void>;
}

export const SnapshotTimeline: React.FC<SnapshotTimelineProps> = ({
  projectId,
  snapshots,
  onSaveSnapshot,
  onRestoreSnapshot
}) => {
  const [snapshotName, setSnapshotName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotName.trim()) return;

    setIsSaving(true);
    try {
      await onSaveSnapshot(snapshotName.trim());
      setSnapshotName('');
      setNotification('Snapshot saved successfully!');
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification(`Failed to save snapshot: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestore = async (id: string, name: string) => {
    setRestoringId(id);
    try {
      await onRestoreSnapshot(id);
      setNotification(`Restored project state to "${name}"`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification(`Restore failed: ${err.message}`);
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 p-5 bg-[#0B1120] rounded-2xl border border-white/10 font-mono text-xs">
      {/* Header & Save Form */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-purple-400" />
            Project Snapshot & Version Checkpoints
          </h3>
          <p className="text-slate-400 font-sans text-xs mt-0.5">
            Store immutable snapshots of full code files and restore past project states instantly.
          </p>
        </div>

        <form onSubmit={handleCreate} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            placeholder="Checkpoint name (e.g. Added JWT Auth)"
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 w-full sm:w-64"
          />
          <button
            type="submit"
            disabled={isSaving || !snapshotName.trim()}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0 disabled:opacity-40"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Save Snapshot</span>
          </button>
        </form>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Snapshots Timeline List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {snapshots.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Camera className="w-8 h-8 mx-auto mb-2 opacity-40 text-purple-400" />
            <p>No snapshots saved yet. Create one above to preserve your generated project state.</p>
          </div>
        ) : (
          snapshots.map((snap, idx) => (
            <div
              key={snap.id || idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-white/5 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{snap.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-cyan-300">
                    {snap.files_count || 24} files preserved
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{new Date(snap.created_at).toLocaleString()}</span>
                  <span>•</span>
                  <span>ID: {snap.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestore(snap.id, snap.name)}
                  disabled={restoringId === snap.id}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {restoringId === snap.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                  )}
                  <span>{restoringId === snap.id ? 'Restoring...' : 'Restore State'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
