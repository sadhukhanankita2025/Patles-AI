import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { PageView, AuthMode } from './types';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubModulesPage } from './pages/SubModulesPage';
import { GitHubIntelligencePage } from './pages/GitHubIntelligencePage';
import { WorkflowPage } from './pages/WorkflowPage';
import { ScrollToTop } from './components/ScrollToTop';
import { BuilderPage } from './pages/BuilderPage';
import { ProtectedRoute } from './components/ProtectedRoute';

const WorkflowParamWrapper = ({ onNavigate }: { onNavigate: (page: PageView) => void }) => {
  const { repoId } = useParams<{ repoId: string }>();
  return (
    <WorkflowPage
      repositoryId={repoId}
      onNavigate={onNavigate}
      onBackToRepo={() => onNavigate('github')}
    />
  );
};

export default function App() {
  const navigate = useNavigate();
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  const handleNavigate = (page: PageView) => {
    if (page === 'landing') navigate('/');
    else if (page === 'auth') navigate('/login');
    else navigate(`/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: AuthMode = 'login') => {
    navigate(`/${mode === 'signup' ? 'signup' : 'login'}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartWithPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    navigate('/ai-builder');
  };

  const handleOpenNewProject = () => {
    setSelectedPrompt('');
    navigate('/ai-builder');
  };

  // Handle OAuth callback redirect if present
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('oauth') === 'success') {
      window.history.replaceState({}, '', '/dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const protectedSubPages: PageView[] = [
    'workspace',
    'my-projects',
    'ai-chat',
    'code-review',
    'debugger',
    'deployment',
    'documentation',
    'profile'
  ];

  return (
    <>
      <Routes>
        {/* Public Landing Page */}
        <Route
          path="/"
          element={
            <MainLayout
              currentPage="landing"
              onNavigate={handleNavigate}
              onOpenAuth={handleOpenAuth}
            >
              <LandingPage
                onNavigate={handleNavigate}
                onStartWithPrompt={handleStartWithPrompt}
              />
            </MainLayout>
          }
        />

        {/* Public Authentication Pages */}
        <Route
          path="/login"
          element={
            <MainLayout
              currentPage="auth"
              onNavigate={handleNavigate}
              onOpenAuth={handleOpenAuth}
            >
              <AuthPage
                initialMode="login"
                onNavigate={handleNavigate}
              />
            </MainLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <MainLayout
              currentPage="auth"
              onNavigate={handleNavigate}
              onOpenAuth={handleOpenAuth}
            >
              <AuthPage
                initialMode="signup"
                onNavigate={handleNavigate}
              />
            </MainLayout>
          }
        />

        <Route
          path="/auth"
          element={
            <MainLayout
              currentPage="auth"
              onNavigate={handleNavigate}
              onOpenAuth={handleOpenAuth}
            >
              <AuthPage
                initialMode="login"
                onNavigate={handleNavigate}
              />
            </MainLayout>
          }
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout
                currentPage="dashboard"
                onNavigate={handleNavigate}
                onOpenNewProject={handleOpenNewProject}
              >
                <DashboardPage
                  onNavigate={handleNavigate}
                  onOpenNewProject={handleOpenNewProject}
                />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected AI Builder Route */}
        <Route
          path="/ai-builder"
          element={
            <ProtectedRoute>
              <DashboardLayout
                currentPage="ai-builder"
                onNavigate={handleNavigate}
                onOpenNewProject={handleOpenNewProject}
              >
                <BuilderPage
                  initialPrompt={selectedPrompt}
                  onNavigate={handleNavigate}
                />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected GitHub Intelligence Routes */}
        <Route
          path="/github"
          element={
            <ProtectedRoute>
              <DashboardLayout
                currentPage="github"
                onNavigate={handleNavigate}
                onOpenNewProject={handleOpenNewProject}
              >
                <GitHubIntelligencePage
                  onNavigate={handleNavigate}
                />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/github-import"
          element={
            <ProtectedRoute>
              <DashboardLayout
                currentPage="github-import"
                onNavigate={handleNavigate}
                onOpenNewProject={handleOpenNewProject}
              >
                <GitHubIntelligencePage
                  onNavigate={handleNavigate}
                />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Workflow Routes */}
        <Route
          path="/workflow"
          element={
            <ProtectedRoute>
              <DashboardLayout
                currentPage="workflow"
                onNavigate={handleNavigate}
                onOpenNewProject={handleOpenNewProject}
              >
                <WorkflowPage
                  onNavigate={handleNavigate}
                  onBackToRepo={() => handleNavigate('github')}
                />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/github/:repoId/workflow"
          element={
            <ProtectedRoute>
              <DashboardLayout
                currentPage="workflow"
                onNavigate={handleNavigate}
                onOpenNewProject={handleOpenNewProject}
              >
                <WorkflowParamWrapper onNavigate={handleNavigate} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Submodule Routes */}
        {protectedSubPages.map((subPage) => (
          <Route
            key={subPage}
            path={`/${subPage}`}
            element={
              <ProtectedRoute>
                <DashboardLayout
                  currentPage={subPage}
                  onNavigate={handleNavigate}
                  onOpenNewProject={handleOpenNewProject}
                >
                  <SubModulesPage
                    page={subPage}
                    onNavigate={handleNavigate}
                    onOpenNewProject={handleOpenNewProject}
                  />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ScrollToTop />
    </>
  );
}
