export interface ProjectRow {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string;
  prompt: string;
  project_type: 'website' | 'webapp' | 'mobile' | 'api' | 'fullstack';
  frontend: string;
  backend: string;
  database_name: string;
  features: string[];
  status: 'Ready' | 'Building' | 'Live' | 'Failed';
  stars: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectFileRow {
  id: string;
  project_id: string;
  path: string;
  file_name: string;
  language: string;
  size: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectAnalysisRow {
  id: string;
  project_id: string;
  technology_stack: Array<{ name: string; category: string; version?: string }>;
  frameworks: string[];
  apis: Array<{
    method: string;
    path: string;
    filePath: string;
    purpose: string;
    requestBody?: Record<string, any>;
    responseSample?: Record<string, any>;
  }>;
  components: Array<{
    name: string;
    path: string;
    type: string;
    dependencies: string[];
  }>;
  database: {
    type: string;
    orm: string;
    schemaFile: string;
    tables: string[];
    models: string[];
  };
  authentication: {
    type: string;
    mechanisms: string[];
    protectedRoutes: string[];
  };
  architecture: {
    pattern: string;
    description: string;
    nodes: Array<{
      id: string;
      name: string;
      category: string;
      tech: string;
      description: string;
      connections: string[];
    }>;
  };
  health: {
    overallScore: number;
    codeQuality: { score: number; details: string[] };
    security: { score: number; details: string[] };
    architecture: { score: number; details: string[] };
    documentation: { score: number; details: string[] };
    deployment: { score: number; details: string[] };
    testing: { score: number; details: string[] };
  };
  environment: {
    configured: string[];
    missing: string[];
    variables: Array<{ name: string; status: 'configured' | 'missing' | 'warning'; description: string }>;
  };
  updated_at: string;
}

export interface CodeReviewFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'security' | 'code_quality' | 'performance' | 'best_practices';
  file: string;
  line: number;
  title: string;
  description: string;
  recommendation: string;
  suggestedFix?: string;
}

export interface CodeReviewRow {
  id: string;
  project_id: string;
  quality_score: number;
  security_score: number;
  findings: CodeReviewFinding[];
  summary: string;
  created_at: string;
}

export interface DebugSessionRow {
  id: string;
  project_id: string;
  error_input: string;
  log_input?: string;
  root_cause: string;
  affected_file: string;
  affected_line: number;
  explanation: string;
  suggested_fix: string;
  corrected_code: string;
  code_diff: {
    original: string;
    fixed: string;
  };
  prevention: string;
  applied: boolean;
  created_at: string;
}

export interface DeploymentCheckRow {
  id: string;
  project_id: string;
  readiness_score: number;
  platforms: Array<{
    name: 'Vercel' | 'Netlify' | 'Railway' | 'Render' | 'Docker' | 'GitHub Actions';
    status: 'ready' | 'warning' | 'needs_config';
    configFiles: string[];
    notes: string;
  }>;
  env_checks: Array<{
    name: string;
    status: 'configured' | 'missing' | 'warning';
    description: string;
  }>;
  checks: Array<{
    name: string;
    category: 'frontend' | 'backend' | 'database' | 'security' | 'docker';
    status: 'pass' | 'warning' | 'fail';
    detail: string;
  }>;
  recommendations: string[];
  created_at: string;
}

export interface ActivityLogRow {
  id: string;
  project_id: string;
  user_id: string;
  action: string;
  target: string;
  details?: string;
  timestamp: string;
}

export interface ProjectSnapshotRow {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  files: ProjectFileRow[];
  files_count: number;
  prompt?: string;
  architecture_summary?: string;
  created_at: string;
}

class ProjectStore {
  private projects: Map<string, ProjectRow> = new Map();
  private files: Map<string, ProjectFileRow[]> = new Map(); // projectId -> files
  private analyses: Map<string, ProjectAnalysisRow> = new Map(); // projectId -> analysis
  private reviews: Map<string, CodeReviewRow[]> = new Map(); // projectId -> reviews
  private debugSessions: Map<string, DebugSessionRow[]> = new Map(); // projectId -> debug sessions
  private deploymentChecks: Map<string, DeploymentCheckRow> = new Map(); // projectId -> deploy check
  private activities: Map<string, ActivityLogRow[]> = new Map(); // projectId -> activities
  private snapshots: Map<string, ProjectSnapshotRow[]> = new Map(); // projectId -> snapshots

  constructor() {
    this.seedDefaultProject();
  }

  private seedDefaultProject() {
    const defaultProjectId = 'proj_healthcare_connect';
    const healthcareProject: ProjectRow = {
      id: defaultProjectId,
      user_id: 'usr_developer',
      name: 'HealthCareConnect',
      slug: 'healthcare-connect',
      description: 'Patient-centric medical platform with secure authentication, appointment scheduling, doctor discovery, and digital clinical records.',
      prompt: 'Create a healthcare website with login and appointment booking.',
      project_type: 'fullstack',
      frontend: 'React',
      backend: 'Node.js + Express',
      database_name: 'PostgreSQL',
      features: [
        'JWT Patient & Practitioner Authentication',
        'Real-Time Appointment Scheduling & Slot Booking',
        'Doctor Directory & Specialty Filtering',
        'Medical Records & Prescription Access',
        'PostgreSQL Relational Storage with Audit Trail'
      ],
      status: 'Ready',
      stars: 38,
      created_at: '2026-02-10T12:00:00Z',
      updated_at: new Date().toISOString()
    };

    this.projects.set(defaultProjectId, healthcareProject);

    const defaultFiles: ProjectFileRow[] = [
      {
        id: `f_${defaultProjectId}_1`,
        project_id: defaultProjectId,
        path: 'src/pages/Login.jsx',
        file_name: 'Login.jsx',
        language: 'javascript',
        size: 3850,
        content: `import React, { useState } from 'react';
import { api } from '../services/api';

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response && response.token) {
        localStorage.setItem('auth_token', response.token);
        if (onLoginSuccess) onLoginSuccess(response.user);
      } else {
        setError('Authentication token not received.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Patient Portal Sign In</h2>
        <p className="text-sm text-slate-400 mb-6">Enter your clinical credentials to access your appointments.</p>
        
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
              placeholder="patient@healthcare.org"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_2`,
        project_id: defaultProjectId,
        path: 'src/pages/Appointments.jsx',
        file_name: 'Appointments.jsx',
        language: 'javascript',
        size: 4620,
        content: `import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AppointmentCard } from '../components/AppointmentCard';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/api/appointments');
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await api.get('/api/doctors');
      setDoctors(data.doctors || []);
      if (data.doctors && data.doctors[0]) {
        setSelectedDoctorId(data.doctors[0].id);
      }
    } catch (err) {
      console.error('Failed to load doctors', err);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await api.post('/api/appointments', {
        doctorId: selectedDoctorId,
        date: bookingDate,
        time: bookingTime,
        symptoms: symptoms
      });

      setMessage({ type: 'success', text: 'Appointment booked successfully!' });
      setBookingDate('');
      setBookingTime('');
      setSymptoms('');
      loadAppointments();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to book appointment' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Book Medical Appointment</h1>
          <p className="text-sm text-slate-400 mt-1">Schedule consultations with board-certified physicians</p>
        </div>
      </div>

      {message && (
        <div className={\`p-4 rounded-xl text-sm font-semibold \${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
        }\`}>
          {message.text}
        </div>
      )}

      {/* Booking Form */}
      <form onSubmit={handleBookAppointment} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white">Schedule New Consultation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Physician</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
              required
            >
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Consultation Date</label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Time Slot</label>
            <input
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Visit / Symptoms</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
            placeholder="Describe clinical symptoms or checkup purpose..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Confirming Appointment...' : 'Confirm Appointment Booking'}
        </button>
      </form>

      {/* Existing Appointments List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Your Scheduled Consultations</h2>
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            No upcoming appointments booked. Use the form above to schedule your first visit.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(app => (
              <AppointmentCard key={app.id} appointment={app} onRefresh={loadAppointments} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Appointments;`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_3`,
        project_id: defaultProjectId,
        path: 'src/services/api.js',
        file_name: 'api.js',
        language: 'javascript',
        size: 1980,
        content: `const BASE_URL = '';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
    ...options.headers,
  };

  const response = await fetch(\`\${BASE_URL}\${endpoint}\`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred with your request.';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // Non-JSON response
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  get: (endpoint, headers) => request(endpoint, { method: 'GET', headers }),
  post: (endpoint, body, headers) => request(endpoint, { method: 'POST', body: JSON.stringify(body), headers }),
  put: (endpoint, body, headers) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), headers }),
  delete: (endpoint, headers) => request(endpoint, { method: 'DELETE', headers }),
};`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_4`,
        project_id: defaultProjectId,
        path: 'src/components/AppointmentCard.jsx',
        file_name: 'AppointmentCard.jsx',
        language: 'javascript',
        size: 2150,
        content: `import React from 'react';

export const AppointmentCard = ({ appointment, onRefresh }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
            {appointment.status || 'Confirmed'}
          </span>
          <h3 className="text-lg font-bold text-white mt-1">Dr. {appointment.doctor_name || 'Sarah Chen'}</h3>
          <p className="text-xs text-slate-400">{appointment.specialty || 'General Cardiology'}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-cyan-400">{appointment.time || '10:30 AM'}</div>
          <div className="text-xs text-slate-400">{appointment.date || '2026-03-15'}</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300">
        <span className="text-slate-500 font-semibold">Chief Complaint: </span>
        {appointment.symptoms || 'Annual cardiovascular wellness evaluation and prescription refill.'}
      </div>
    </div>
  );
};`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_5`,
        project_id: defaultProjectId,
        path: 'server/routes/authRoutes.js',
        file_name: 'authRoutes.js',
        language: 'javascript',
        size: 2400,
        content: `import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', verifyToken, authController.getCurrentUser);
router.post('/logout', verifyToken, authController.logout);

export default router;`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_6`,
        project_id: defaultProjectId,
        path: 'server/routes/appointmentRoutes.js',
        file_name: 'appointmentRoutes.js',
        language: 'javascript',
        size: 2800,
        content: `import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, appointmentController.listAppointments);
router.post('/', verifyToken, appointmentController.createAppointment);
router.get('/:id', verifyToken, appointmentController.getAppointmentDetails);
router.put('/:id/cancel', verifyToken, appointmentController.cancelAppointment);

export default router;`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_7`,
        project_id: defaultProjectId,
        path: 'server/controllers/authController.js',
        file_name: 'authController.js',
        language: 'javascript',
        size: 3450,
        content: `import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'healthcare_jwt_super_secret_key_2026';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Patient lookup mock
    const user = {
      id: 'usr_patient_001',
      email,
      name: 'Eleanor Vance',
      role: 'patient',
      medicalRecordNumber: 'MRN-84920'
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ error: 'Authentication service encountered an error.' });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const user = {
      id: \`usr_\${Date.now()}\`,
      email,
      name,
      role: 'patient',
      medicalRecordNumber: \`MRN-\${Math.floor(10000 + Math.random() * 90000)}\`
    };

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create patient account.' });
  }
};

export const getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};

export const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_8`,
        project_id: defaultProjectId,
        path: 'server/controllers/appointmentController.js',
        file_name: 'appointmentController.js',
        language: 'javascript',
        size: 3800,
        content: `import { appointmentService } from '../services/appointmentService.js';

export const listAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointmentsForUser(req.user.id);
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve appointments.' });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, symptoms } = req.body;
    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: 'Doctor, consultation date, and time slot are required.' });
    }

    const appointment = await appointmentService.createAppointment({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      symptoms: symptoms || 'General Medical Consultation'
    });

    res.status(201).json({ appointment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to book appointment.' });
  }
};

export const getAppointmentDetails = async (req, res) => {
  try {
    const appointment = await appointmentService.getById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });
    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load appointment.' });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const updated = await appointmentService.cancel(req.params.id, req.user.id);
    res.json({ appointment: updated, message: 'Appointment cancelled.' });
  } catch (err) {
    res.status(500).json({ error: 'Cancellation failed.' });
  }
};`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_9`,
        project_id: defaultProjectId,
        path: 'server/services/appointmentService.js',
        file_name: 'appointmentService.js',
        language: 'javascript',
        size: 2900,
        content: `const appointmentsDb = [
  {
    id: 'apt_101',
    patient_id: 'usr_patient_001',
    doctor_id: 'doc_01',
    doctor_name: 'Dr. Sarah Chen, MD',
    specialty: 'Cardiovascular Medicine',
    date: '2026-04-12',
    time: '10:00 AM',
    symptoms: 'Cardiovascular checkup & blood pressure telemetry review',
    status: 'Confirmed'
  },
  {
    id: 'apt_102',
    patient_id: 'usr_patient_001',
    doctor_id: 'doc_02',
    doctor_name: 'Dr. Marcus Reynolds, MD',
    specialty: 'Neurology & Sleep Medicine',
    date: '2026-04-20',
    time: '02:30 PM',
    symptoms: 'Recurring migraine and sleep architecture analysis',
    status: 'Confirmed'
  }
];

export const appointmentService = {
  getAppointmentsForUser: async (userId) => {
    return appointmentsDb.filter(a => a.patient_id === userId);
  },
  createAppointment: async (data) => {
    const newApt = {
      id: \`apt_\${Date.now()}\`,
      patient_id: data.patientId,
      doctor_id: data.doctorId,
      doctor_name: data.doctorId === 'doc_02' ? 'Dr. Marcus Reynolds, MD' : 'Dr. Sarah Chen, MD',
      specialty: data.doctorId === 'doc_02' ? 'Neurology' : 'Cardiology',
      date: data.date,
      time: data.time,
      symptoms: data.symptoms,
      status: 'Confirmed'
    };
    appointmentsDb.push(newApt);
    return newApt;
  },
  getById: async (id) => appointmentsDb.find(a => a.id === id),
  cancel: async (id, userId) => {
    const item = appointmentsDb.find(a => a.id === id && a.patient_id === userId);
    if (item) item.status = 'Cancelled';
    return item;
  }
};`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_10`,
        project_id: defaultProjectId,
        path: 'server/middleware/authMiddleware.js',
        file_name: 'authMiddleware.js',
        language: 'javascript',
        size: 1600,
        content: `import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'healthcare_jwt_super_secret_key_2026';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
};`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_11`,
        project_id: defaultProjectId,
        path: 'database/schema.sql',
        file_name: 'schema.sql',
        language: 'sql',
        size: 3200,
        content: `-- PostgreSQL Schema for HealthCareConnect

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(32) DEFAULT 'patient',
  medical_record_number VARCHAR(64) UNIQUE,
  phone VARCHAR(32),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(128) NOT NULL,
  license_number VARCHAR(64) UNIQUE NOT NULL,
  bio TEXT,
  hourly_rate NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(64) PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
  appointment_date DATE NOT NULL,
  time_slot VARCHAR(32) NOT NULL,
  symptoms TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'Confirmed',
  clinical_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_12`,
        project_id: defaultProjectId,
        path: 'package.json',
        file_name: 'package.json',
        language: 'json',
        size: 1400,
        content: `{
  "name": "healthcare-connect",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "node server.js",
    "lint": "eslint src/"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "express": "^4.21.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.13.0",
    "lucide-react": "^0.450.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "tailwindcss": "^4.0.0"
  }
}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_13`,
        project_id: defaultProjectId,
        path: '.env.example',
        file_name: '.env.example',
        language: 'shell',
        size: 450,
        content: `PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/healthcare_db
JWT_SECRET=healthcare_jwt_super_secret_key_2026
API_URL=http://localhost:3000
AI_API_KEY=your_ai_api_key_here`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `f_${defaultProjectId}_14`,
        project_id: defaultProjectId,
        path: 'README.md',
        file_name: 'README.md',
        language: 'markdown',
        size: 3400,
        content: `# HealthCareConnect

Production-ready clinical appointment booking and patient telemetry platform built with React, Node.js/Express, and PostgreSQL.

## Features
- **HIPAA-Compliant Patient Sign-in**: Secure JWT token generation and role authorization.
- **Appointment Scheduling**: Real-time consultation slot booking with specialty physician matching.
- **Relational PostgreSQL Storage**: Relational schemas for patients, clinicians, and medical appointments.
- **Clean Architecture**: Decoupled controllers, services, middleware, and frontend API client.

## Getting Started

### Installation
\`\`\`bash
npm install
\`\`\`

### Environment Setup
Copy the environment template:
\`\`\`bash
cp .env.example .env
\`\`\`

### Database Migration
\`\`\`bash
psql -U postgres -d healthcare_db -f database/schema.sql
\`\`\`

### Running Locally
\`\`\`bash
npm run dev
\`\`\`

## API Documentation
- \`POST /api/auth/login\`: Patient authentication and JWT session token generation.
- \`POST /api/appointments\`: Create new consultation booking.
- \`GET /api/appointments\`: Retrieve all scheduled appointments for authenticated patient.
`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    this.files.set(defaultProjectId, defaultFiles);

    // Seed analysis for default project
    const defaultAnalysis: ProjectAnalysisRow = {
      id: `analysis_${defaultProjectId}`,
      project_id: defaultProjectId,
      technology_stack: [
        { name: 'React', category: 'frontend', version: '^19.0.0' },
        { name: 'Node.js', category: 'backend' },
        { name: 'Express', category: 'backend', version: '^4.21.2' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'JWT', category: 'security' },
        { name: 'Tailwind CSS', category: 'frontend' }
      ],
      frameworks: ['React', 'Express'],
      apis: [
        {
          method: 'POST',
          path: '/api/auth/login',
          filePath: 'server/routes/authRoutes.js',
          purpose: 'Authenticate patient and issue signed session JWT'
        },
        {
          method: 'POST',
          path: '/api/auth/register',
          filePath: 'server/routes/authRoutes.js',
          purpose: 'Register new patient with medical record number'
        },
        {
          method: 'GET',
          path: '/api/appointments',
          filePath: 'server/routes/appointmentRoutes.js',
          purpose: 'List scheduled consultations for authenticated user'
        },
        {
          method: 'POST',
          path: '/api/appointments',
          filePath: 'server/routes/appointmentRoutes.js',
          purpose: 'Book new medical consultation with specified doctor'
        }
      ],
      components: [
        { name: 'Login', path: 'src/pages/Login.jsx', type: 'page', dependencies: ['api'] },
        { name: 'Appointments', path: 'src/pages/Appointments.jsx', type: 'page', dependencies: ['api', 'AppointmentCard'] },
        { name: 'AppointmentCard', path: 'src/components/AppointmentCard.jsx', type: 'component', dependencies: [] }
      ],
      database: {
        type: 'PostgreSQL',
        orm: 'Raw SQL / Native pg Driver',
        schemaFile: 'database/schema.sql',
        tables: ['users', 'doctors', 'appointments'],
        models: ['User', 'Doctor', 'Appointment']
      },
      authentication: {
        type: 'JWT Bearer Authentication',
        mechanisms: ['Authorization Header', 'JWT Expiry (7d)', 'Bcrypt Password Hashing'],
        protectedRoutes: ['/api/appointments', '/api/appointments/:id', '/api/auth/me']
      },
      architecture: {
        pattern: 'Layered Client-Server Architecture',
        description: 'Decoupled React SPA communicating via authenticated REST API with Express business controllers and relational PostgreSQL store.',
        nodes: [
          {
            id: 'client-ui',
            name: 'React 19 SPA',
            category: 'client',
            tech: 'React 19, Tailwind CSS',
            description: 'Patient portal rendering login views and booking interfaces',
            connections: ['api-gateway']
          },
          {
            id: 'api-gateway',
            name: 'Express API Router',
            category: 'gateway',
            tech: 'Express 4.21 Router',
            description: 'Dispatches incoming clinical requests through authMiddleware',
            connections: ['auth-service', 'appointment-service']
          },
          {
            id: 'auth-service',
            name: 'Authentication Controller',
            category: 'service',
            tech: 'JWT & Bcrypt',
            description: 'Manages user sessions, MRN assignment, and token verification',
            connections: ['db-postgres']
          },
          {
            id: 'appointment-service',
            name: 'Appointment Controller',
            category: 'service',
            tech: 'Appointment Service Logic',
            description: 'Validates doctor availability, schedules time slots, and creates consultation records',
            connections: ['db-postgres']
          },
          {
            id: 'db-postgres',
            name: 'PostgreSQL Relational DB',
            category: 'database',
            tech: 'PostgreSQL 16',
            description: 'Persistent tables for users, doctors, and appointment logs',
            connections: []
          }
        ]
      },
      health: {
        overallScore: 92,
        codeQuality: {
          score: 95,
          details: ['Strict modular separation between routes, controllers, and services', 'Clean error handling with consistent HTTP status codes']
        },
        security: {
          score: 90,
          details: ['Bearer token validation enforced on all appointment endpoints', 'Parameterized query design prevents SQL injection']
        },
        architecture: {
          score: 94,
          details: ['Decoupled frontend service layer prevents direct DOM-to-network coupling', 'Clean database foreign key constraints']
        },
        documentation: {
          score: 88,
          details: ['Detailed README with setup, install, and run commands', 'Full REST API endpoint specifications documented']
        },
        deployment: {
          score: 85,
          details: ['Environment variables template (.env.example) configured', 'Standard Node/Vite build scripts defined in package.json']
        },
        testing: {
          score: 75,
          details: ['Linting configured; automated test suite recommended for clinical compliance']
        }
      },
      environment: {
        configured: ['PORT', 'DATABASE_URL', 'JWT_SECRET'],
        missing: ['AI_API_KEY'],
        variables: [
          { name: 'DATABASE_URL', status: 'configured', description: 'PostgreSQL connection string' },
          { name: 'JWT_SECRET', status: 'configured', description: 'Cryptographic secret for signing patient tokens' },
          { name: 'API_URL', status: 'configured', description: 'API backend origin' },
          { name: 'AI_API_KEY', status: 'warning', description: 'AI assistant service credentials' }
        ]
      },
      updated_at: new Date().toISOString()
    };

    this.analyses.set(defaultProjectId, defaultAnalysis);

    // Seed activity
    this.activities.set(defaultProjectId, [
      {
        id: 'act_1',
        project_id: defaultProjectId,
        user_id: 'usr_developer',
        action: 'Project generated',
        target: 'HealthCareConnect',
        details: 'Generated 14 files across frontend, backend, and database schema',
        timestamp: '2026-02-10T12:00:00Z'
      }
    ]);
  }

  // --- Projects CRUD ---
  async getAllProjects(userId?: string): Promise<ProjectRow[]> {
    const list = Array.from(this.projects.values());
    if (userId) {
      return list.filter(p => p.user_id === userId || p.user_id === 'usr_developer');
    }
    return list;
  }

  async getProjectById(id: string): Promise<ProjectRow | null> {
    return this.projects.get(id) || null;
  }

  async saveProject(project: ProjectRow): Promise<void> {
    this.projects.set(project.id, project);
  }

  async createProject(project: ProjectRow): Promise<ProjectRow> {
    this.projects.set(project.id, project);
    return project;
  }

  async deleteProject(id: string): Promise<boolean> {
    this.projects.delete(id);
    this.files.delete(id);
    this.analyses.delete(id);
    this.reviews.delete(id);
    this.debugSessions.delete(id);
    this.deploymentChecks.delete(id);
    this.activities.delete(id);
    return true;
  }

  // --- Files CRUD ---
  async getFiles(projectId: string): Promise<ProjectFileRow[]> {
    return this.files.get(projectId) || [];
  }

  async getFileByPath(projectId: string, filePath: string): Promise<ProjectFileRow | null> {
    const files = this.files.get(projectId) || [];
    const normalized = filePath.replace(/^\/+/, '').replace(/\\/g, '/');
    return files.find(f => f.path.replace(/^\/+/, '').replace(/\\/g, '/') === normalized) || null;
  }

  async saveFile(projectId: string, filePath: string, content: string): Promise<ProjectFileRow> {
    const files = this.files.get(projectId) || [];
    const normalized = filePath.replace(/^\/+/, '').replace(/\\/g, '/');
    const existingIndex = files.findIndex(f => f.path.replace(/^\/+/, '').replace(/\\/g, '/') === normalized);

    const ext = normalized.includes('.') ? normalized.split('.').pop() || 'text' : 'text';
    const fileName = normalized.split('/').pop() || normalized;
    const now = new Date().toISOString();

    let savedFile: ProjectFileRow;

    if (existingIndex >= 0) {
      savedFile = {
        ...files[existingIndex],
        content,
        size: Buffer.byteLength(content, 'utf8'),
        updated_at: now
      };
      files[existingIndex] = savedFile;
    } else {
      savedFile = {
        id: `f_${projectId}_${Date.now()}`,
        project_id: projectId,
        path: normalized,
        file_name: fileName,
        language: ext,
        size: Buffer.byteLength(content, 'utf8'),
        content,
        created_at: now,
        updated_at: now
      };
      files.push(savedFile);
    }

    this.files.set(projectId, files);
    this.logActivity(projectId, 'File edited', normalized);

    return savedFile;
  }

  async deleteFile(projectId: string, filePath: string): Promise<boolean> {
    const files = this.files.get(projectId) || [];
    const normalized = filePath.replace(/^\/+/, '').replace(/\\/g, '/');
    const filtered = files.filter(f => f.path.replace(/^\/+/, '').replace(/\\/g, '/') !== normalized);
    this.files.set(projectId, filtered);
    this.logActivity(projectId, 'File deleted', normalized);
    return true;
  }

  // --- Analysis ---
  async getAnalysis(projectId: string): Promise<ProjectAnalysisRow | null> {
    return this.analyses.get(projectId) || null;
  }

  async saveAnalysis(analysis: ProjectAnalysisRow): Promise<void> {
    this.analyses.set(analysis.project_id, analysis);
  }

  // --- Code Reviews ---
  async getReviews(projectId: string): Promise<CodeReviewRow[]> {
    return this.reviews.get(projectId) || [];
  }

  async saveReview(review: CodeReviewRow): Promise<void> {
    const list = this.reviews.get(review.project_id) || [];
    list.unshift(review);
    this.reviews.set(review.project_id, list);
    this.logActivity(review.project_id, 'Review completed', `Found ${review.findings.length} findings`);
  }

  // --- Debug Sessions ---
  async getDebugSessions(projectId: string): Promise<DebugSessionRow[]> {
    return this.debugSessions.get(projectId) || [];
  }

  async saveDebugSession(session: DebugSessionRow): Promise<void> {
    const list = this.debugSessions.get(session.project_id) || [];
    list.unshift(session);
    this.debugSessions.set(session.project_id, list);
    this.logActivity(session.project_id, 'Bug analyzed', session.affected_file);
  }

  async markDebugApplied(projectId: string, sessionId: string): Promise<void> {
    const list = this.debugSessions.get(projectId) || [];
    const target = list.find(s => s.id === sessionId);
    if (target) {
      target.applied = true;
      this.logActivity(projectId, 'Fix applied', target.affected_file);
    }
  }

  // --- Deployment Checks ---
  async getDeploymentCheck(projectId: string): Promise<DeploymentCheckRow | null> {
    return this.deploymentChecks.get(projectId) || null;
  }

  async saveDeploymentCheck(check: DeploymentCheckRow): Promise<void> {
    this.deploymentChecks.set(check.project_id, check);
    this.logActivity(check.project_id, 'Deployment checked', `Score: ${check.readiness_score}%`);
  }

  // --- Snapshots ---
  async getSnapshots(projectId: string): Promise<ProjectSnapshotRow[]> {
    return this.snapshots.get(projectId) || [];
  }

  async createSnapshot(projectId: string, name?: string, description?: string): Promise<ProjectSnapshotRow> {
    const project = this.projects.get(projectId);
    const currentFiles = this.files.get(projectId) || [];
    const analysis = this.analyses.get(projectId);

    // Deep copy files
    const copiedFiles: ProjectFileRow[] = currentFiles.map(f => ({ ...f }));
    const now = new Date().toISOString();
    const snapshotName = name && name.trim() !== '' 
      ? name.trim() 
      : `Snapshot v${(this.snapshots.get(projectId)?.length || 0) + 1} (${new Date().toLocaleTimeString()})`;

    const snapshot: ProjectSnapshotRow = {
      id: `snap_${projectId}_${Date.now()}`,
      project_id: projectId,
      name: snapshotName,
      description: description || `Preserved state with ${copiedFiles.length} files`,
      files: copiedFiles,
      files_count: copiedFiles.length,
      prompt: project?.prompt || '',
      architecture_summary: analysis?.architecture?.pattern || 'Full-Stack Architecture',
      created_at: now
    };

    const list = this.snapshots.get(projectId) || [];
    list.unshift(snapshot);
    this.snapshots.set(projectId, list);

    this.logActivity(projectId, 'Snapshot created', snapshot.name, `${copiedFiles.length} files saved`);
    return snapshot;
  }

  async restoreSnapshot(projectId: string, snapshotId: string): Promise<boolean> {
    const list = this.snapshots.get(projectId) || [];
    const target = list.find(s => s.id === snapshotId);
    if (!target) return false;

    // Restore files deep copy
    const restoredFiles: ProjectFileRow[] = target.files.map(f => ({ ...f }));
    this.files.set(projectId, restoredFiles);

    this.logActivity(projectId, 'Snapshot restored', target.name, `Restored ${restoredFiles.length} files`);
    return true;
  }

  // --- Activity History ---
  async getActivities(projectId: string): Promise<ActivityLogRow[]> {
    return this.activities.get(projectId) || [];
  }

  logActivity(projectId: string, action: string, target: string, details?: string, userId: string = 'usr_developer') {
    const list = this.activities.get(projectId) || [];
    list.unshift({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      project_id: projectId,
      user_id: userId,
      action,
      target,
      details,
      timestamp: new Date().toISOString()
    });
    this.activities.set(projectId, list.slice(0, 30));
  }
}

export const projectStore = new ProjectStore();
export default projectStore;
