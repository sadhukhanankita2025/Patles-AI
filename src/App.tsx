import React, { useState, useEffect } from 'react';
import { PageView, AuthMode } from './types';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { PromptGeneratorPage } from './pages/PromptGeneratorPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubModulesPage } from './pages/SubModulesPage';
import { GitHubIntelligencePage } from './pages/GitHubIntelligencePage';
import { WorkflowPage } from './pages/WorkflowPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [workflowRepoId, setWorkflowRepoId] = useState<string | undefined>(undefined);

  // Sync with browser URL /github/:id/workflow
  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;
      const match = path.match(/^\/github\/([^/]+)\/workflow/);
      if (match && match[1]) {
        setWorkflowRepoId(match[1]);
        setCurrentPage('workflow');
      } else if (path === '/workflow') {
        setCurrentPage('workflow');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleStartWithPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setCurrentPage('ai-builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setCurrentPage('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNewProject = () => {
    setSelectedPrompt('');
    setCurrentPage('ai-builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine whether current page belongs to developer dashboard layout
  const isDashboardView = [
    'dashboard',
    'ai-builder',
    'workspace',
    'ai-chat',
    'code-review',
    'debugger',
    'deployment',
    'documentation',
    'github-import',
    'github',
    'workflow',
    'profile'
  ].includes(currentPage);

  if (isDashboardView) {
    return (
      <DashboardLayout
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'workflow' && workflowRepoId) {
            window.history.pushState({}, '', `/github/${workflowRepoId}/workflow`);
          } else if (page === 'workflow') {
            window.history.pushState({}, '', '/workflow');
          } else if (window.location.pathname.includes('/workflow')) {
            window.history.pushState({}, '', '/');
          }
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNewProject={handleOpenNewProject}
      >
        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenNewProject={handleOpenNewProject}
          />
        )}

        {currentPage === 'ai-builder' && (
          <PromptGeneratorPage
            initialPrompt={selectedPrompt}
            onOpenDeploy={(proj) => {
              setCurrentPage('deployment');
            }}
          />
        )}

        {(currentPage === 'github-import' || currentPage === 'github') && (
          <GitHubIntelligencePage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'workflow' && (
          <WorkflowPage
            repositoryId={workflowRepoId}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToRepo={() => {
              setCurrentPage('github');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage !== 'dashboard' && 
         currentPage !== 'ai-builder' && 
         currentPage !== 'github-import' && 
         currentPage !== 'github' && 
         currentPage !== 'workflow' && (
          <SubModulesPage
            page={currentPage}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenNewProject={handleOpenNewProject}
          />
        )}
      </DashboardLayout>
    );
  }

  // Public / Landing / Auth layout
  return (
    <MainLayout
      currentPage={currentPage}
      onNavigate={(page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      onOpenAuth={handleOpenAuth}
    >
      {currentPage === 'landing' && (
        <LandingPage
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onStartWithPrompt={handleStartWithPrompt}
        />
      )}

      {currentPage === 'auth' && (
        <AuthPage
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </MainLayout>
  );
}
