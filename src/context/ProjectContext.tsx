import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ProjectSummary {
  id: string;
  user_id?: string;
  name: string;
  slug: string;
  description: string;
  prompt: string;
  project_type: string;
  frontend: string;
  backend: string;
  database_name: string;
  features: string[];
  status: string;
  stars: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectContextType {
  activeProjectId: string;
  activeProject: ProjectSummary | null;
  projects: ProjectSummary[];
  isLoadingProjects: boolean;
  setActiveProjectId: (id: string) => void;
  refreshProjects: () => Promise<void>;
  refreshActiveProject: () => Promise<void>;
}

export const DEFAULT_DEMO_PROJECT: ProjectSummary = {
  id: 'proj_healthcare_connect',
  user_id: 'usr_developer',
  name: 'HealthCareConnect',
  slug: 'healthcare-connect',
  description: 'Patient-centric medical platform with secure authentication, appointment scheduling, doctor discovery, and digital clinical records.',
  prompt: 'Create a healthcare website with login and appointment booking.',
  project_type: 'fullstack',
  frontend: 'React 19',
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
  updated_at: '2026-09-27T12:00:00Z'
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => {
    return localStorage.getItem('patles_active_project_id') || 'proj_healthcare_connect';
  });
  const [activeProject, setActiveProject] = useState<ProjectSummary | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);

  const setActiveProjectId = useCallback((id: string) => {
    setActiveProjectIdState(id);
    localStorage.setItem('patles_active_project_id', id);
  }, []);

  const refreshProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch('/api/projects', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        
        // If current active is invalid or empty, pick the first
        if (data.projects && data.projects.length > 0) {
          const currentExists = data.projects.some((p: any) => p.id === activeProjectId);
          if (!currentExists) {
            setActiveProjectId(data.projects[0].id);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load projects list (using offline fallback):', err);
      setProjects([DEFAULT_DEMO_PROJECT]);
      if (!activeProject) {
        setActiveProject(DEFAULT_DEMO_PROJECT);
      }
    } finally {
      setIsLoadingProjects(false);
    }
  }, [activeProjectId, setActiveProjectId, activeProject]);

  const refreshActiveProject = useCallback(async () => {
    if (!activeProjectId) return;
    try {
      const res = await fetch(`/api/projects/${activeProjectId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setActiveProject(data.project);
      } else {
        setActiveProject(DEFAULT_DEMO_PROJECT);
      }
    } catch (err) {
      console.warn('Failed to load active project (using offline fallback):', err);
      setActiveProject(DEFAULT_DEMO_PROJECT);
    }
  }, [activeProjectId]);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  useEffect(() => {
    refreshActiveProject();
  }, [activeProjectId, refreshActiveProject]);

  return (
    <ProjectContext.Provider
      value={{
        activeProjectId,
        activeProject,
        projects,
        isLoadingProjects,
        setActiveProjectId,
        refreshProjects,
        refreshActiveProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    return {
      activeProjectId: 'proj_healthcare_connect',
      activeProject: null,
      projects: [],
      isLoadingProjects: false,
      setActiveProjectId: () => {},
      refreshProjects: async () => {},
      refreshActiveProject: async () => {}
    };
  }
  return ctx;
};
