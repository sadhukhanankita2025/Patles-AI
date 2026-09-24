import React from 'react';
import { Github, ExternalLink, Mail } from 'lucide-react';
import { PageView } from '../types';
import { PatlesLotusLogo } from './PatlesLotusLogo';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#0B1120] border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <button
              onClick={() => onNavigate('landing')}
              className="text-left group focus:outline-none transition-transform hover:scale-[1.02]"
            >
              <PatlesLotusLogo variant="horizontal" size="md" glow={true} animated={true} showTagline={true} />
            </button>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              AI developer platform delivering instant type-safe web and mobile architectures. Powered by IBM Granite and advanced reasoning models.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-slate-700/60"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.ibm.com/granite"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors border border-slate-700/60 font-mono"
                aria-label="IBM Granite AI"
              >
                <span>IBM Granite AI</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('ai-builder')} className="hover:text-white transition-colors">
                  AI Website Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Developer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Code Understanding
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Pre-flight Validator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Templates */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Templates
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Healthcare & Telehealth
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Headless E-Commerce
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Interactive STEM Education
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Quantitative Finance Terminal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Developer Portfolio
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Contact & Community
            </h4>
            <div className="text-xs space-y-2">
              <p className="text-slate-400">
                Questions or enterprise deployments?
              </p>
              <a
                href="mailto:contact@patles.ai"
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>contact@patles.ai</span>
              </a>
              <p className="text-[11px] text-slate-500 pt-1">
                San Francisco, CA & Global Remote
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© 2026 Patles.ai Inc. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>Day 1 Production UI</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#status" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>All Systems Operational</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
