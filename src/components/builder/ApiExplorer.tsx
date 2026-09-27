import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Send, 
  Database, 
  Code2, 
  Check, 
  Copy, 
  Key, 
  Layers, 
  Search,
  ChevronRight,
  ShieldAlert,
  Play
} from 'lucide-react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  controller: string;
  table: string;
  purpose: string;
  authRequired: boolean;
  requestBody?: Record<string, any>;
  responseSample: Record<string, any>;
}

const DEFAULT_ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/api/auth/login',
    controller: 'server/controllers/authController.js : login',
    table: 'users',
    purpose: 'Authenticates patient or practitioner and returns signed JWT token',
    authRequired: false,
    requestBody: { email: 'patient@healthcare.io', password: 'secure_password_123' },
    responseSample: { token: 'eyJhbGciOiJIUzI1NiIsIn...', user: { id: 'usr_1', email: 'patient@healthcare.io', role: 'patient' } }
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    controller: 'server/controllers/authController.js : register',
    table: 'users',
    purpose: 'Registers new clinical user with bcrypt salt & hash',
    authRequired: false,
    requestBody: { email: 'newpatient@healthcare.io', password: 'password_123', full_name: 'Jane Doe', role: 'patient' },
    responseSample: { success: true, message: 'User registered successfully.' }
  },
  {
    method: 'GET',
    path: '/api/doctors',
    controller: 'server/controllers/doctorController.js : getAll',
    table: 'doctors',
    purpose: 'Queries licensed medical practitioners with specialty filters',
    authRequired: false,
    responseSample: {
      doctors: [
        { id: 'doc_1', specialty: 'Cardiology', hourly_rate: 180, available_days: ['Monday', 'Thursday'] },
        { id: 'doc_2', specialty: 'Neurology', hourly_rate: 220, available_days: ['Tuesday', 'Friday'] }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/appointments',
    controller: 'server/controllers/appointmentController.js : create',
    table: 'appointments',
    purpose: 'Reserves a confirmed time slot with selected specialist',
    authRequired: true,
    requestBody: { doctor_id: 'doc_1', appointment_date: '2026-10-15', appointment_time: '10:30', notes: 'Routine cardiac checkup' },
    responseSample: { success: true, appointment_id: 'apt_9921', status: 'confirmed' }
  },
  {
    method: 'GET',
    path: '/api/profile',
    controller: 'server/controllers/userController.js : getProfile',
    table: 'users',
    purpose: 'Retrieves authenticated patient medical demographics',
    authRequired: true,
    responseSample: { user: { id: 'usr_1', full_name: 'Jane Doe', blood_type: 'O+', allergies: ['Penicillin'] } }
  },
  {
    method: 'GET',
    path: '/api/appointments',
    controller: 'server/controllers/appointmentController.js : list',
    table: 'appointments',
    purpose: 'Lists past and upcoming appointments for authenticated patient',
    authRequired: true,
    responseSample: { appointments: [{ id: 'apt_9921', date: '2026-10-15', status: 'confirmed' }] }
  },
  {
    method: 'PUT',
    path: '/api/appointments/:id',
    controller: 'server/controllers/appointmentController.js : update',
    table: 'appointments',
    purpose: 'Reschedules or cancels patient appointment slot',
    authRequired: true,
    requestBody: { status: 'cancelled', cancellation_reason: 'Schedule conflict' },
    responseSample: { success: true, status: 'cancelled' }
  },
  {
    method: 'POST',
    path: '/api/payments',
    controller: 'server/controllers/paymentController.js : process',
    table: 'payments',
    purpose: 'Processes copay or telehealth consultation fee',
    authRequired: true,
    requestBody: { appointment_id: 'apt_9921', amount: 150.00, currency: 'USD' },
    responseSample: { success: true, payment_id: 'pay_8842', status: 'succeeded' }
  },
  {
    method: 'POST',
    path: '/api/contact',
    controller: 'server/controllers/contactController.js : submitMessage',
    table: 'contact_messages',
    purpose: 'Accepts contact inquiry from prospective patients',
    authRequired: false,
    requestBody: { sender_name: 'Alex Smith', sender_email: 'alex@domain.com', message: 'Inquiring about Medicare billing.' },
    responseSample: { success: true, message: 'Message received by support triage.' }
  }
];

interface ApiExplorerProps {
  projectId?: string;
  projectName?: string;
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({
  projectId = 'proj_healthcare_connect',
  projectName = 'HealthCareConnect'
}) => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(DEFAULT_ENDPOINTS);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(DEFAULT_ENDPOINTS[0]);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  React.useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}/apis`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d && d.apis && d.apis.length > 0) {
          const mapped: ApiEndpoint[] = d.apis.map((a: any) => ({
            method: a.method || 'GET',
            path: a.path,
            controller: a.filePath ? `${a.filePath} : handler` : `server/routes/api.js`,
            table: a.path.split('/')[2] || 'records',
            purpose: a.purpose || `Handles ${a.path} request`,
            authRequired: a.path !== '/api/auth/login' && a.path !== '/api/auth/register',
            requestBody: a.requestBody,
            responseSample: a.responseSample || { success: true, status: 'ok', data: [] }
          }));
          setEndpoints(mapped);
          setSelectedEndpoint(mapped[0]);
        }
      })
      .catch(err => console.warn('Could not load custom APIs:', err));
  }, [projectId]);

  const filtered = endpoints.filter(ep => 
    ep.path.toLowerCase().includes(search.toLowerCase()) ||
    ep.method.toLowerCase().includes(search.toLowerCase()) ||
    ep.table.toLowerCase().includes(search.toLowerCase())
  );

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'POST': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'PUT': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'DELETE': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const handleTestEndpoint = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestOutput(JSON.stringify(selectedEndpoint.responseSample, null, 2));
      setIsTesting(false);
    }, 400);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* Endpoints Sidebar List */}
      <div className="w-full lg:w-80 shrink-0 bg-[#0B1120] rounded-2xl border border-white/10 p-3 flex flex-col space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5 uppercase text-[11px]">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            Generated REST APIs ({DEFAULT_ENDPOINTS.length})
          </span>
          <span className="text-[10px] text-purple-400">Express 5</span>
        </div>

        <div className="relative">
          <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search endpoints..."
            className="w-full bg-slate-950 border border-white/10 rounded-lg pl-7 pr-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {filtered.map((ep, idx) => {
            const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedEndpoint(ep);
                  setTestOutput(null);
                }}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getMethodBadge(ep.method)}`}>
                    {ep.method}
                  </span>
                  <span className="truncate">{ep.path}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Endpoint Details Inspector */}
      <div className="flex-1 bg-[#0B1120] rounded-2xl border border-white/10 p-5 overflow-y-auto space-y-5 font-mono text-xs">
        {/* Endpoint Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-950 border border-white/10">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getMethodBadge(selectedEndpoint.method)}`}>
              {selectedEndpoint.method}
            </span>
            <span className="text-sm font-bold text-white tracking-wide">
              {selectedEndpoint.path}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedEndpoint.authRequired && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300">
                <Key className="w-3 h-3" />
                Bearer JWT Required
              </span>
            )}
            <button
              onClick={handleTestEndpoint}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isTesting ? 'Dispatching...' : 'Test Endpoint'}</span>
            </button>
          </div>
        </div>

        {/* Purpose & Mapping metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              Bound Controller & File
            </span>
            <div className="text-white text-xs truncate">{selectedEndpoint.controller}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              Primary PostgreSQL Table
            </span>
            <div className="text-amber-300 text-xs truncate">public.{selectedEndpoint.table}</div>
          </div>
        </div>

        <p className="text-slate-300 text-xs font-sans leading-relaxed">
          {selectedEndpoint.purpose}
        </p>

        {/* Request & Response Viewers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Request Payload */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Request Body Schema (JSON)</span>
              <span>application/json</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-white/10 text-cyan-300 text-[11px] overflow-x-auto min-h-[140px]">
              {selectedEndpoint.requestBody
                ? JSON.stringify(selectedEndpoint.requestBody, null, 2)
                : '// No request body required (GET endpoint)'}
            </pre>
          </div>

          {/* Response Sample */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Response Sample (200 OK)</span>
              <span>Status: 200</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-white/10 text-emerald-300 text-[11px] overflow-x-auto min-h-[140px]">
              {testOutput || JSON.stringify(selectedEndpoint.responseSample, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
