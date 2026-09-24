import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, Copy, Check } from 'lucide-react';

interface VirtualTerminalProps {
  projectName: string;
  installCmd: string;
  runCmd: string;
}

export const VirtualTerminal: React.FC<VirtualTerminalProps> = ({
  projectName,
  installCmd,
  runCmd
}) => {
  const [logs, setLogs] = useState<string[]>([
    `[patles-shell ~] Ready. Project environment "${projectName}" initialized.`,
    `[patles-shell ~] Type or click quick commands below to simulate execution.`
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  const executeCommand = (cmd: string) => {
    if (!cmd.trim() || isExecuting) return;
    setIsExecuting(true);
    const cleanCmd = cmd.trim();

    setLogs(prev => [...prev, `$ ${cleanCmd}`]);

    setTimeout(() => {
      let output: string[] = [];

      if (cleanCmd.includes('npm run dev') || cleanCmd.includes('dev')) {
        output = [
          '  VITE v8.3.0  ready in 142 ms',
          '  ➜  Local:   http://localhost:3000/',
          '  ➜  Network: use --host to expose',
          '  [server] Express 5 API running at http://0.0.0.0:3000',
          '  [db] PostgreSQL Drizzle connection pool active (3 idle / 1 active)',
          '  [cache] Redis cluster ping: 0.8ms'
        ];
      } else if (cleanCmd.includes('drizzle') || cleanCmd.includes('migrate')) {
        output = [
          '  drizzle-kit: v0.24.0',
          '  Reading schema from src/db/schema.ts...',
          '  ✓ 4 tables detected',
          '  ✓ Generated migration SQL diff in 18ms',
          '  Applying migration to PostgreSQL database...',
          '  ✓ CREATE TABLE IF NOT EXISTS items (...);',
          '  ✓ CREATE TABLE IF NOT EXISTS activities (...);',
          '  Migration executed successfully! [100% sync]'
        ];
      } else if (cleanCmd.includes('test')) {
        output = [
          '  ✓ src/test/auth.test.ts (3 tests) 28ms',
          '  ✓ src/test/api.test.ts (6 tests) 42ms',
          '  ✓ src/test/schema.test.ts (2 tests) 14ms',
          '  Test Files  3 passed (3)',
          '  Tests       11 passed (11)',
          '  Duration    340ms (transform 48ms, setup 10ms, collect 38ms, tests 84ms)'
        ];
      } else if (cleanCmd.includes('curl') || cleanCmd.includes('health')) {
        output = [
          'HTTP/1.1 200 OK',
          'Content-Type: application/json; charset=utf-8',
          'Date: ' + new Date().toUTCString(),
          '{',
          '  "status": "healthy",',
          '  "architecture": "Event-Driven Microservices",',
          '  "uptime": "99.99%",',
          '  "database": "connected"',
          '}'
        ];
      } else if (cleanCmd.includes('git')) {
        output = [
          'On branch main',
          'Your branch is up to date with \'origin/main\'.',
          'Changes to be committed:',
          '  (use "git restore --staged <file>..." to unstage)',
          '	new file:   src/App.tsx',
          '	new file:   src/server/routes.ts',
          '	new file:   src/db/schema.ts',
          '	new file:   README.md'
        ];
      } else {
        output = [
          `Command executed: ${cleanCmd}`,
          '✓ Exit code 0 (success)'
        ];
      }

      setLogs(prev => [...prev, ...output]);
      setIsExecuting(false);
      setCommandInput('');
    }, 400);
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setLogs([`[patles-shell ~] Cleared terminal.`]);
  };

  return (
    <div className="rounded-2xl bg-[#0B1120] border border-slate-800 overflow-hidden font-mono text-xs shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="p-3 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-400 ml-2 font-semibold">patles-dev-sandbox (bash)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Terminal Log Output Window */}
      <div className="p-4 bg-slate-950 text-slate-300 min-h-[260px] max-h-[380px] overflow-y-auto space-y-1 select-text">
        {logs.map((log, i) => (
          <div 
            key={i} 
            className={`leading-relaxed ${
              log.startsWith('$') 
                ? 'text-cyan-300 font-bold' 
                : log.includes('✓') 
                ? 'text-emerald-400' 
                : log.includes('HTTP/1.1 200') 
                ? 'text-purple-300' 
                : log.startsWith('[patles-shell')
                ? 'text-slate-500 italic'
                : 'text-slate-300'
            }`}
          >
            {log}
          </div>
        ))}
        {isExecuting && (
          <div className="text-cyan-400 animate-pulse flex items-center gap-2">
            <span>Executing...</span>
          </div>
        )}
      </div>

      {/* Quick Command Suggestions */}
      <div className="p-2.5 bg-[#0F172A] border-t border-slate-800 flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-slate-500 uppercase">Quick Run:</span>
        <button
          onClick={() => executeCommand('npm run dev')}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] transition-colors cursor-pointer"
        >
          npm run dev
        </button>
        <button
          onClick={() => executeCommand('npx drizzle-kit push')}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] transition-colors cursor-pointer"
        >
          npx drizzle-kit push
        </button>
        <button
          onClick={() => executeCommand('curl http://localhost:3000/api/v1/health')}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] transition-colors cursor-pointer"
        >
          curl /health
        </button>
        <button
          onClick={() => executeCommand('npm test')}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] transition-colors cursor-pointer"
        >
          npm test
        </button>
        <button
          onClick={() => executeCommand('git status')}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] transition-colors cursor-pointer"
        >
          git status
        </button>
      </div>

      {/* Command Input Prompt */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          executeCommand(commandInput);
        }}
        className="p-3 bg-black flex items-center gap-2 border-t border-slate-800"
      >
        <span className="text-emerald-400 font-bold">$</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Enter shell command (e.g. npm run build, docker ps)..."
          className="flex-1 bg-transparent text-slate-200 placeholder:text-slate-600 focus:outline-none text-xs"
        />
        <button
          type="submit"
          disabled={!commandInput.trim() || isExecuting}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded text-xs transition-colors cursor-pointer"
        >
          Run
        </button>
      </form>
    </div>
  );
};
