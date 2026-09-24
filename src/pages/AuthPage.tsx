import React, { useState } from 'react';
import { Sparkles, Github, Mail, Lock, User, ArrowRight, CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AuthMode, PageView } from '../types';
import { PatlesLotusLogo } from '../components/PatlesLotusLogo';

interface AuthPageProps {
  initialMode?: AuthMode;
  onSuccess: () => void;
  onNavigate: (page: PageView) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
  onNavigate
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & loading
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!loginEmail || !loginPassword) {
      setFormError('Please enter both your email address and password.');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthSuccessMsg('Authentication successful! Initializing your workspace...');
      setTimeout(() => {
        onSuccess();
      }, 900);
    }, 800);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!fullName || !signupEmail || !signupPassword || !confirmPassword) {
      setFormError('Please complete all fields to create your account.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setFormError('Passwords do not match. Please verify your entries.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthSuccessMsg('Account created successfully! Welcome to Patles.ai.');
      setTimeout(() => {
        onSuccess();
      }, 900);
    }, 800);
  };

  const handleSocialAuth = (provider: 'Google' | 'GitHub') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthSuccessMsg(`Connected via ${provider}! Redirecting to Dashboard...`);
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Card */}
        <div className="text-center mb-8">
          <button 
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center group focus:outline-none mb-4 transition-transform hover:scale-105"
            aria-label="Patles.ai"
          >
            <PatlesLotusLogo variant="vertical" size="xl" glow={true} animated={true} showTagline={true} />
          </button>
          
          <h2 className="text-xl font-bold text-white tracking-tight mt-2">
            {mode === 'login' ? 'Sign in to your developer console' : 'Create your developer account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' 
              ? 'Access your synthesized repositories and deployment runs.' 
              : 'Join to build, review, and ship AI-powered code.'}
          </p>
        </div>

        {/* Auth Glass Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/85 border border-slate-800/90 shadow-2xl backdrop-blur-xl">
          
          {/* Mode Segmented Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setFormError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setFormError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback banners */}
          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {formError}
            </div>
          )}

          {authSuccessMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialAuth('Google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('GitHub')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <Github className="w-4 h-4 text-slate-200" />
              <span>GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-[#0F172A] px-3 text-[11px] font-mono text-slate-400 absolute">
              or continue with email
            </span>
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="developer@patles.ai"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-white focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500/20"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to registered email address.')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="md"
                fullWidth
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mt-2"
              >
                Login to Console
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                required
              />

              <Input
                label="Work Email"
                type="email"
                placeholder="alex@company.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-white focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <Button
                type="submit"
                variant="gradient"
                size="md"
                fullWidth
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mt-2"
              >
                Create Account
              </Button>
            </form>
          )}

          {/* Terms Footer */}
          <p className="mt-6 text-[11px] text-center text-slate-400 leading-relaxed">
            By signing in, you agree to our{' '}
            <span className="text-slate-300 underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-slate-300 underline cursor-pointer">Privacy Policy</span>.
          </p>

        </div>

      </div>
    </div>
  );
};
