import React, { useState } from 'react';
import { PageView } from '../types';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { GitHubIntelligencePage } from './GitHubIntelligencePage';
import { 
  FolderGit2, 
  MessageSquare, 
  ShieldCheck, 
  Bug, 
  Server, 
  FileCode2, 
  Github, 
  User, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Terminal, 
  RefreshCw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2
} from 'lucide-react';

interface SubModulesPageProps {
  page: PageView;
  onNavigate: (page: PageView) => void;
  onOpenNewProject: () => void;
}

export const SubModulesPage: React.FC<SubModulesPageProps> = ({
  page,
  onNavigate,
  onOpenNewProject
}) => {
  // State for AI Chat
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Hello Alex! I am your Patles.ai Architect. Ask me anything about systems design, database schemas, or refactoring with IBM Granite 3.0.',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // State for Debugger
  const [stackTrace, setStackTrace] = useState(
    'TypeError: Cannot read properties of undefined (reading "sessionToken")\n    at AuthService.validateToken (/src/server/auth.ts:48:22)\n    at Layer.handle [as handle_request] (/node_modules/express/lib/router/layer.js:95:5)'
  );
  const [debuggerPatched, setDebuggerPatched] = useState(false);

  // State for GitHub import
  const [repoUrl, setRepoUrl] = useState('https://github.com/organization/react-express-microservices');
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'completed'>('idle');

  // Handle chat submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'Just now' }]);
    setChatInput('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Analyzed your request: "${userMsg}". Recommended pattern: Implement optimistic UI updates with an idempotency key header on the API route to prevent duplicate mutations.`,
          time: 'Just now'
        }
      ]);
    }, 600);
  };

  // Handle GitHub Import
  const handleImportRepo = (e: React.FormEvent) => {
    e.preventDefault();
    setImportStatus('importing');
    setTimeout(() => {
      setImportStatus('completed');
    }, 1200);
  };

  /* Render Sub-Views */
  switch (page) {
    case 'workspace':
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white">Active Workspaces</h1>
              <p className="text-xs text-slate-400 mt-0.5">Isolated runtime environments and persistent branches</p>
            </div>
            <Button variant="gradient" size="sm" onClick={onOpenNewProject}>
              + Create Workspace
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">production-cluster-01</span>
                <span className="text-xs text-emerald-400 font-mono">Running (Node 22)</span>
              </div>
              <p className="text-xs text-slate-400">Hosting 4 active microservices with PostgreSQL replication.</p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>CPU: 18% · RAM: 2.1 GB</span>
                <span className="text-cyan-400 cursor-pointer">Configure →</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">staging-sandbox-beta</span>
                <span className="text-xs text-cyan-400 font-mono">Idle (Hot-Standby)</span>
              </div>
              <p className="text-xs text-slate-400">Ephemeral branch testing for pull requests.</p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>CPU: 4% · RAM: 820 MB</span>
                <span className="text-cyan-400 cursor-pointer">Configure →</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'ai-chat':
      return (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <span>AI Architecture Assistant</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Converse with IBM Granite 3.0 regarding architecture choices and optimizations</p>
          </div>

          <div className="rounded-3xl bg-[#0F172A]/80 border border-slate-800 h-[480px] flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none font-mono'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className="text-[10px] text-slate-400 block mt-1 text-right">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-[#0B1120] border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about system design, schema migration, or concurrency handling..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
              <Button type="submit" variant="gradient" size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      );

    case 'code-review':
      return (
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>Automated PR Code Review</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">Semantic security audit and bug prevention powered by AI</p>
            </div>
            <Button variant="outline" size="sm">
              Scan Open PRs (3)
            </Button>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400">PR #142 · branch feature/auth-jwt</span>
                <h3 className="text-base font-bold text-white mt-1">Refactor JWT token verification to prevent algorithm confusion attack</h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Audited by IBM Granite
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-emerald-400">✔ CWE-327: Broken or Risky Cryptographic Algorithm check passed</div>
              <div className="text-emerald-400">✔ OWASP Top 10 A01: Broken Access Control check passed</div>
              <div className="text-slate-400">Found 0 security vulnerabilities. Ready for auto-merge.</div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="gradient" size="sm">
                Approve & Merge PR
              </Button>
            </div>
          </div>
        </div>
      );

    case 'debugger':
      return (
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bug className="w-6 h-6 text-rose-400" />
              <span>AI Debugger & Auto-Remediation</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Paste stack traces or unhandled promises to generate instant remediation patches</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Exception Stack Trace</h3>
              <Textarea
                rows={6}
                value={stackTrace}
                onChange={(e) => setStackTrace(e.target.value)}
                className="font-mono text-xs"
              />
              <Button
                variant="gradient"
                size="md"
                fullWidth
                onClick={() => setDebuggerPatched(true)}
              >
                Analyze & Patch Bug
              </Button>
            </div>

            <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">AI Diagnostic & Solution</h3>
              {debuggerPatched ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    Root Cause Identified: sessionToken undefined due to missing Bearer prefix stripping.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 text-slate-300">
                    <div className="text-slate-500">// Generated Patch:</div>
                    <div className="text-red-400">- const token = req.headers.authorization;</div>
                    <div className="text-emerald-400">+ const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');</div>
                  </div>
                  <Button variant="outline" size="sm" fullWidth>
                    Apply Patch to Git Branch
                  </Button>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-500 font-mono">
                  Click "Analyze & Patch Bug" to generate zero-config remediation.
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 'deployment':
      return (
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Server className="w-6 h-6 text-blue-400" />
              <span>Deployment & Pre-flight Validator</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Inspect build containers, environment secrets, and edge clusters</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">US-East Cluster</div>
              <div className="text-xl font-bold text-white font-mono mt-1">Healthy</div>
              <span className="text-[11px] text-emerald-400 font-mono">99.99% Uptime</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">EU-Central Cluster</div>
              <div className="text-xl font-bold text-white font-mono mt-1">Healthy</div>
              <span className="text-[11px] text-emerald-400 font-mono">99.98% Uptime</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">AP-Southeast Cluster</div>
              <div className="text-xl font-bold text-white font-mono mt-1">Healthy</div>
              <span className="text-[11px] text-emerald-400 font-mono">100% Uptime</span>
            </div>
          </div>
        </div>
      );

    case 'documentation':
      return (
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-6 h-6 text-indigo-400" />
              <span>Automated Documentation Generator</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">OpenAPI 3.1 specifications and typed Markdown documentation synced with your codebase</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-mono text-xs text-cyan-400">openapi-spec.json (v3.1.0)</span>
              <Button variant="outline" size="sm">Export Swagger</Button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-300">
              <div>openapi: 3.1.0</div>
              <div>info: Patles REST API</div>
              <div>paths:</div>
              <div className="pl-4">/api/v1/health: [GET] 200 OK</div>
              <div className="pl-4">/api/v1/records: [POST, GET] 201 Created</div>
            </div>
          </div>
        </div>
      );

    case 'github-import':
    case 'github':
      return <GitHubIntelligencePage onNavigate={onNavigate} />;

    case 'profile':
      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-purple-400" />
              <span>Developer Profile & Credentials</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Manage subscription, model permissions, and API secrets</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xl">
                A
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Alex Chen</h3>
                <p className="text-xs text-slate-400 font-mono">sadhukhanankita80@gmail.com</p>
                <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Pro Plan Active</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">API Key:</span>
                <p className="text-slate-200 mt-1">pk_live_••••••••••••••••</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">Model Quota:</span>
                <p className="text-emerald-400 mt-1">Unlimited Pro Tier</p>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
