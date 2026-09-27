import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface DevicePreviewToggleProps {
  device: DeviceMode;
  onChange: (d: DeviceMode) => void;
}

export const DevicePreviewToggle: React.FC<DevicePreviewToggleProps> = ({
  device,
  onChange
}) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-white/10">
      <button
        type="button"
        onClick={() => onChange('desktop')}
        title="Desktop View (100% full width)"
        className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
          device === 'desktop'
            ? 'bg-purple-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Desktop</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('tablet')}
        title="Tablet View (768px)"
        className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
          device === 'tablet'
            ? 'bg-purple-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Tablet className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Tablet</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('mobile')}
        title="Mobile View (375px)"
        className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
          device === 'mobile'
            ? 'bg-purple-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Mobile</span>
      </button>
    </div>
  );
};
