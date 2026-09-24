import React, { useState } from 'react';
import { Play, Check, Copy, Send, Sparkles, Terminal } from 'lucide-react';

interface Endpoint {
  method: string;
  path: string;
  desc: string;
  sampleResponse?: string;
}

interface ApiPlaygroundProps {
  endpoints: Endpoint[];
  projectName: string;
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({ endpoints, projectName }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(endpoints[0] || {
    method: 'GET',
    path: '/api/v1/health',
    desc: 'Health check',
    sampleResponse: '{"status":"healthy"}'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [timing, setTiming] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExecute = () => {
    setIsLoading(true);
    setResponseOutput(null);
    setStatusCode(null);
    setTiming(null);

    const execTime = Math.floor(Math.random() * 25 + 8);

    setTimeout(() => {
      setIsLoading(false);
      setStatusCode(selectedEndpoint.method === 'POST' ? 201 : 200);
      setTiming(execTime);
      setResponseOutput(
        selectedEndpoint.sampleResponse || 
        JSON.stringify({
          success: true,
          endpoint: selectedEndpoint.path,
          timestamp: new Date().toISOString(),
          status: 'ok'
        }, null, 2)
      );
    }, 450);
  };

  const handleCopy = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(responseOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white">Live API Endpoint Sandbox</span>
        </div>
        <div className="text-[11px] font-mono text-cyan-400">
          Base: http://localhost:3000
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
        {/* Endpoint Selector List (5 Cols) */}
        <div className="md:col-span-5 space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {endpoints.map((ep, idx) => {
            const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedEndpoint(ep);
                  setResponseOutput(null);
                  setStatusCode(null);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/30 border-purple-500/60 shadow-md ring-1 ring-purple-500/30'
                    : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    ep.method === 'GET' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="text-xs font-mono text-slate-200 truncate">{ep.path}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{ep.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Execution & Response Inspector (7 Cols) */}
        <div className="md:col-span-7 flex flex-col rounded-2xl bg-[#0B1120] border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedEndpoint.method === 'GET' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'
              }`}>
                {selectedEndpoint.method}
              </span>
              <span className="text-white truncate">{selectedEndpoint.path}</span>
            </div>
            
            <button
              onClick={handleExecute}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
            </button>
          </div>

          {/* Response Payload */}
          <div className="flex-1 flex flex-col justify-between">
            {responseOutput ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">Status: {statusCode} OK</span>
                    <span className="text-slate-400">Time: {timing}ms</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-900 font-mono text-xs text-emerald-300 max-h-[220px] overflow-y-auto leading-relaxed">
                  <code>{responseOutput}</code>
                </pre>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 font-mono">
                Click <span className="text-cyan-400">"Send Request"</span> to test the mock API route and inspect JSON headers & payloads.
              </div>
            )}

            <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
              Headers: Content-Type: application/json; Authorization: Bearer &lt;JWT&gt;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
