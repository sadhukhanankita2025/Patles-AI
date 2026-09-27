import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Key, 
  Link2, 
  Copy, 
  Check, 
  Layers, 
  Search, 
  ChevronRight,
  Shield,
  FileCode
} from 'lucide-react';

interface SchemaViewerProps {
  projectId?: string;
  sqlContent?: string;
  projectName?: string;
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({
  projectId = 'proj_healthcare_connect',
  sqlContent,
  projectName = 'HealthcareConnect'
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'er'>('er');
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [copied, setCopied] = useState(false);
  const [fetchedSql, setFetchedSql] = useState<string>('');
  const [tableList, setTableList] = useState<any[]>([]);

  React.useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}/schema`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d && d.sql) {
          setFetchedSql(d.sql);
          if (d.tables && d.tables.length > 0) {
            const generatedTables = d.tables.map((tblName: string) => ({
              name: tblName,
              description: `Entity table for ${tblName} in ${projectName}`,
              columns: [
                { name: 'id', type: 'UUID', pk: true, fk: null },
                { name: 'user_id', type: 'UUID', pk: false, fk: tblName !== 'users' ? 'users.id' : null },
                { name: tblName === 'users' ? 'email' : 'title', type: 'VARCHAR(255)', pk: false, fk: null, unique: tblName === 'users' },
                { name: 'status', type: 'VARCHAR(30)', pk: false, fk: null },
                { name: 'created_at', type: 'TIMESTAMPTZ', pk: false, fk: null }
              ]
            }));
            setTableList(generatedTables);
            setSelectedTable(d.tables[0]);
          }
        }
      })
      .catch(err => console.warn('Could not load custom schema:', err));
  }, [projectId, projectName]);

  const defaultSql = fetchedSql || sqlContent || `-- PostgreSQL Relational Schema for ${projectName}
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'patient',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  specialty VARCHAR(100) NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  biography TEXT,
  hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
  available_days TEXT[] DEFAULT ARRAY['Monday', 'Wednesday', 'Friday'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(30) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(30) DEFAULT 'succeeded',
  payment_method VARCHAR(50) DEFAULT 'card',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_name VARCHAR(100) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_payments_patient ON payments(patient_id);
`;

  const tables = [
    {
      name: 'users',
      description: 'Patient and physician identities, credentials & roles',
      columns: [
        { name: 'id', type: 'UUID', pk: true, fk: null },
        { name: 'email', type: 'VARCHAR(255)', pk: false, fk: null, unique: true },
        { name: 'password_hash', type: 'VARCHAR(255)', pk: false, fk: null },
        { name: 'full_name', type: 'VARCHAR(100)', pk: false, fk: null },
        { name: 'role', type: 'VARCHAR(20)', pk: false, fk: null },
        { name: 'created_at', type: 'TIMESTAMPTZ', pk: false, fk: null }
      ]
    },
    {
      name: 'doctors',
      description: 'Specialists, board certifications, rates & availability',
      columns: [
        { name: 'id', type: 'UUID', pk: true, fk: null },
        { name: 'user_id', type: 'UUID', pk: false, fk: 'users.id' },
        { name: 'specialty', type: 'VARCHAR(100)', pk: false, fk: null },
        { name: 'license_number', type: 'VARCHAR(50)', pk: false, fk: null, unique: true },
        { name: 'hourly_rate', type: 'NUMERIC(10,2)', pk: false, fk: null },
        { name: 'available_days', type: 'TEXT[]', pk: false, fk: null }
      ]
    },
    {
      name: 'appointments',
      description: 'Clinical consultation schedule slots and status tracking',
      columns: [
        { name: 'id', type: 'UUID', pk: true, fk: null },
        { name: 'patient_id', type: 'UUID', pk: false, fk: 'users.id' },
        { name: 'doctor_id', type: 'UUID', pk: false, fk: 'doctors.id' },
        { name: 'appointment_date', type: 'DATE', pk: false, fk: null },
        { name: 'appointment_time', type: 'TIME', pk: false, fk: null },
        { name: 'status', type: 'VARCHAR(30)', pk: false, fk: null },
        { name: 'notes', type: 'TEXT', pk: false, fk: null }
      ]
    },
    {
      name: 'payments',
      description: 'Consultation transaction invoices and card charges',
      columns: [
        { name: 'id', type: 'UUID', pk: true, fk: null },
        { name: 'appointment_id', type: 'UUID', pk: false, fk: 'appointments.id' },
        { name: 'patient_id', type: 'UUID', pk: false, fk: 'users.id' },
        { name: 'amount', type: 'NUMERIC(10,2)', pk: false, fk: null },
        { name: 'currency', type: 'VARCHAR(10)', pk: false, fk: null },
        { name: 'status', type: 'VARCHAR(30)', pk: false, fk: null }
      ]
    },
    {
      name: 'contact_messages',
      description: 'Inquiries submitted from public landing portal',
      columns: [
        { name: 'id', type: 'UUID', pk: true, fk: null },
        { name: 'sender_name', type: 'VARCHAR(100)', pk: false, fk: null },
        { name: 'sender_email', type: 'VARCHAR(255)', pk: false, fk: null },
        { name: 'subject', type: 'VARCHAR(200)', pk: false, fk: null },
        { name: 'message', type: 'TEXT', pk: false, fk: null }
      ]
    }
  ];

  const handleCopySql = () => {
    navigator.clipboard.writeText(defaultSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeTables = tableList.length > 0 ? tableList : tables;
  const currentTable = activeTables.find(t => t.name === selectedTable) || activeTables[0];

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* View Switcher Bar */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-[#0B1120] border border-white/10">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('er')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              activeTab === 'er'
                ? 'bg-purple-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ER Diagram & Tables
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              activeTab === 'sql'
                ? 'bg-purple-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            PostgreSQL SQL DDL
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            Dialect: PostgreSQL 16
          </span>
          {activeTab === 'sql' && (
            <button
              onClick={handleCopySql}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ER DIAGRAM & TABLES VIEW */}
      {activeTab === 'er' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-[460px]">
          {/* Tables List */}
          <div className="w-full lg:w-64 bg-[#0B1120] rounded-2xl border border-white/10 p-3 flex flex-col space-y-2 font-mono text-xs">
            <span className="text-[11px] font-bold text-white uppercase flex items-center gap-1.5 pb-1 border-b border-white/10">
              <Table className="w-3.5 h-3.5 text-amber-400" />
              Relational Tables ({activeTables.length})
            </span>

            <div className="space-y-1">
              {activeTables.map(t => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTable(t.name)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                    selectedTable === t.name
                      ? 'bg-purple-950/40 border border-purple-500 text-white shadow-sm'
                      : 'bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Selected Table Columns Schema */}
          <div className="flex-1 bg-[#0B1120] rounded-2xl border border-white/10 p-5 overflow-y-auto space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Table className="w-4 h-4 text-cyan-400" />
                  Table: public.{currentTable.name}
                </h3>
                <p className="text-slate-400 font-sans text-xs mt-0.5">
                  {currentTable.description}
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-[11px]">
                {currentTable.columns.length} Columns
              </span>
            </div>

            {/* Columns Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-white/10 text-[11px] uppercase">
                  <tr>
                    <th className="p-3">Column</th>
                    <th className="p-3">Data Type</th>
                    <th className="p-3">Key / Constraint</th>
                    <th className="p-3">Foreign Relation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-900/60">
                  {currentTable.columns.map((col: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white flex items-center gap-1.5">
                        {col.pk && <Key className="w-3 h-3 text-amber-400" />}
                        <span>{col.name}</span>
                      </td>
                      <td className="p-3 text-cyan-300 font-mono">{col.type}</td>
                      <td className="p-3">
                        {col.pk ? (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                            PRIMARY KEY
                          </span>
                        ) : col.unique ? (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px]">
                            UNIQUE
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="p-3 text-purple-300 flex items-center gap-1">
                        {col.fk ? (
                          <>
                            <Link2 className="w-3 h-3 text-purple-400" />
                            <span>→ {col.fk}</span>
                          </>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RAW SQL VIEW */}
      {activeTab === 'sql' && (
        <div className="flex-1 bg-slate-950 rounded-2xl border border-white/10 p-4 font-mono text-xs text-amber-200 overflow-y-auto max-h-[500px]">
          <pre className="whitespace-pre leading-relaxed">
            {defaultSql}
          </pre>
        </div>
      )}
    </div>
  );
};
