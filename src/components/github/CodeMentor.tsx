import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  FileCode, 
  ArrowRight, 
  Lightbulb, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../Button';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  referencedFiles?: string[];
  timestamp: string;
}

interface CodeMentorProps {
  repositoryId: string;
  repoName: string;
  onSelectFile?: (filePath: string) => void;
}

export const CodeMentor: React.FC<CodeMentorProps> = ({
  repositoryId,
  repoName,
  onSelectFile
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I am **Patles Code Mentor**, your AI repository specialist. I have indexed the source files, APIs, and database schema for **${repoName}**. Ask me any question about the architecture, security, or implementation details!`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    'Explain how authentication works in this project.',
    'Where is the database connection created?',
    'Which file handles login & sessions?',
    'How does the frontend communicate with the backend?',
    'Find the API responsible for user actions.'
  ];

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || input).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/github/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repositoryId,
          question: q,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to query Patles Code Mentor');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.answer || 'Analysis complete.',
        referencedFiles: data.referencedFiles || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I encountered an issue querying the model: ${err.message || 'Network error'}. Please retry shortly.`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-[#0F172A]/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Mentor Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Patles Code Mentor</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">Contextual Q&A grounded in {repoName}</p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/40">
          Gemini 3.8 Flash
        </span>
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 min-w-max">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-500 text-[11px] mr-1">Quick prompts:</span>
          {suggestedQuestions.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors text-[11px] cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Chat Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg, idx) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                isAssistant ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl space-y-2 ${
                  isAssistant
                    ? 'bg-slate-900/90 border border-slate-800 text-slate-200'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {msg.content}
                </div>

                {/* File Citations */}
                {msg.referencedFiles && msg.referencedFiles.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-slate-800 space-y-1 font-mono text-[11px]">
                    <span className="text-slate-400 block font-semibold text-[10px]">
                      REFERENCED SOURCE FILES:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.referencedFiles.map((file, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => onSelectFile && onSelectFile(file)}
                          className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <FileCode className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[200px]">{file}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] font-mono ${
                    isAssistant ? 'text-slate-500' : 'text-purple-200'
                  } text-right`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5 font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pl-2">
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Patles Code Mentor reasoning through repository AST...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${repoName}...`}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono"
        />

        <Button
          type="submit"
          variant="gradient"
          size="md"
          isLoading={isLoading}
          rightIcon={<Send className="w-3.5 h-3.5" />}
          className="px-5 py-3 text-xs font-semibold cursor-pointer"
        >
          Ask Mentor
        </Button>
      </form>
    </div>
  );
};
