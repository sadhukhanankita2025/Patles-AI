import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  Search, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Clock 
} from 'lucide-react';
import { GeneratedProjectStructure } from '../types';

interface LiveUiSandboxProps {
  project: GeneratedProjectStructure;
}

interface SandboxItem {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'synced' | 'pending';
  value: string;
  timestamp: string;
}

export const LiveUiSandbox: React.FC<LiveUiSandboxProps> = ({ project }) => {
  const [deviceFrame, setDeviceFrame] = useState<'desktop' | 'mobile'>('desktop');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [items, setItems] = useState<SandboxItem[]>([
    { id: '1', name: `${project.projectName} Primary Service`, category: 'Compute', status: 'active', value: '99.98% SLA', timestamp: 'Active now' },
    { id: '2', name: 'Edge Ingress Relay', category: 'Network', status: 'synced', value: '4.2ms RTT', timestamp: 'Synced 1m ago' },
    { id: '3', name: 'PostgreSQL Relational Pool', category: 'Storage', status: 'active', value: '12 active conn', timestamp: 'Active now' },
    { id: '4', name: 'BullMQ Worker Daemon', category: 'Background', status: 'pending', value: '0 backlog', timestamp: 'Idle' },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddItem = () => {
    const newItem: SandboxItem = {
      id: String(Date.now()),
      name: `Instance-${Math.floor(Math.random() * 900 + 100)}`,
      category: 'Microservice',
      status: 'active',
      value: `${Math.floor(Math.random() * 15 + 3)}ms`,
      timestamp: 'Just now'
    };
    setItems(prev => [newItem, ...prev]);
    showToast(`Provisioned new node: ${newItem.name}`);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3 font-sans">
      {/* Sandbox Controller Bar */}
      <div className="p-3 bg-[#0B1120] border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-white font-semibold">{project.projectName} Interactive Sandbox</span>
          <span className="text-slate-500">|</span>
          <span className="text-[11px] font-mono text-cyan-400">{project.architecture?.pattern || 'Microservices'}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport switch: Desktop vs Mobile */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceFrame('desktop')}
              className={`p-1.5 rounded transition-colors ${
                deviceFrame === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop Viewport"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceFrame('mobile')}
              className={`p-1.5 rounded transition-colors ${
                deviceFrame === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile Viewport"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setItems([
                { id: '1', name: `${project.projectName} Primary Service`, category: 'Compute', status: 'active', value: '99.98% SLA', timestamp: 'Active now' },
                { id: '2', name: 'Edge Ingress Relay', category: 'Network', status: 'synced', value: '4.2ms RTT', timestamp: 'Synced 1m ago' },
                { id: '3', name: 'PostgreSQL Relational Pool', category: 'Storage', status: 'active', value: '12 active conn', timestamp: 'Active now' },
              ]);
              showToast('Reset sandbox state');
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Reset Sandbox State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex justify-center p-2 sm:p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
        <div 
          className={`transition-all duration-300 w-full rounded-2xl bg-[#090D16] border border-slate-800 p-4 sm:p-6 shadow-2xl relative overflow-hidden ${
            deviceFrame === 'mobile' ? 'max-w-sm border-2 border-slate-700' : 'max-w-full'
          }`}
        >
          {/* Toast Notification */}
          {toastMessage && (
            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-purple-600/90 text-white text-xs font-mono shadow-xl border border-purple-400/40 animate-fade-in flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* App Header Inside Sandbox */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs">
                  {project.projectName.charAt(0)}
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{project.projectName}</h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {project.summary}
              </p>
            </div>

            <button
              onClick={handleAddItem}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Record</span>
            </button>
          </div>

          {/* Simulated Realtime Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Cluster State</span>
              </div>
              <div className="text-xs font-bold text-emerald-400 font-mono mt-1">HEALTHY</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Latency</span>
              </div>
              <div className="text-xs font-bold text-purple-300 font-mono mt-1">8.4ms</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-amber-400" />
                <span>CPU Load</span>
              </div>
              <div className="text-xs font-bold text-amber-300 font-mono mt-1">14.2%</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Security</span>
              </div>
              <div className="text-xs font-bold text-cyan-300 font-mono mt-1">Zero-Trust</div>
            </div>
          </div>

          {/* Interactive Search & Live List */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Filter live state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto font-mono text-xs">
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === 'active' ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`} />
                    <div>
                      <div className="font-semibold text-slate-200 text-[11px]">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{item.category} · {item.timestamp}</div>
                    </div>
                  </div>

                  <span className="text-[11px] text-cyan-400">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
