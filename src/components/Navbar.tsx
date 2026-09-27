import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles, LogOut, User } from 'lucide-react';
import { Button } from './Button';
import { PageView } from '../types';
import { PatlesLotusLogo } from './PatlesLotusLogo';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', page: 'landing' as PageView, href: '#' },
    { label: 'Features', page: 'landing' as PageView, href: '#features' },
    { label: 'Templates', page: 'landing' as PageView, href: '#templates' },
    { label: 'AI Builder', page: 'ai-builder' as PageView, href: '#' },
    { label: 'Dashboard', page: 'dashboard' as PageView, href: '#' },
  ];

  const handleNavClick = (page: PageView, href?: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    if (href && href.startsWith('#') && href !== '#') {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-2xl bg-[#060a16]/92 border-b border-purple-500/25 shadow-xl shadow-[#02040b]/70 py-0'
          : 'backdrop-blur-md bg-[#0B1120]/70 border-b border-slate-800/80 py-0'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'h-16' : 'h-20'
      }`}>
        
        {/* Zone 1: Official Patles.ai 3-Petal Lotus Brand Wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-xl p-1.5 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          aria-label="Patles.ai Home"
        >
          <PatlesLotusLogo variant="horizontal" size="md" glow={true} animated={true} />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300" aria-label="Main Navigation">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.page, item.href)}
              className={`hover:text-white transition-colors duration-150 py-1 relative cursor-pointer ${
                currentPage === item.page && (!item.href || item.href === '#') 
                  ? 'text-white font-semibold' 
                  : 'text-slate-400'
              }`}
            >
              {item.label}
              {currentPage === item.page && (!item.href || item.href === '#') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-200 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white text-[10px]">
                  {(user?.name || user?.email || 'D').charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-white max-w-[120px] truncate">
                  {user?.name || user?.email?.split('@')[0] || 'Console'}
                </span>
              </button>

              <Button
                variant="gradient"
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className="text-xs"
              >
                Dashboard
              </Button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenAuth('login')}
                className="text-slate-300 hover:text-white"
              >
                Login
              </Button>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => onNavigate('ai-builder')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Start Building
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="gradient"
            size="sm"
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'ai-builder')}
            className="text-xs px-2.5 py-1.5"
          >
            {isAuthenticated ? 'Console' : 'Build'}
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0F172A]/95 backdrop-blur-2xl px-5 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.page, item.href)}
                className="text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-slate-500 text-xs">→</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="text-xs text-slate-400 px-3 py-1 font-mono">
                  Signed in as <span className="text-purple-300">{user?.email}</span>
                </div>
                <Button
                  variant="gradient"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('dashboard');
                  }}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                >
                  Sign In to Patles
                </Button>
                <Button
                  variant="gradient"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                >
                  Create Account
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
