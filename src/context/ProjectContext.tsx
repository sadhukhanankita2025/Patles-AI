import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ProjectSummary {
  id: string;
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
      const res = await fetch('/api/projects');
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
      console.warn('Failed to load projects list:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [activeProjectId, setActiveProjectId]);

  const refreshActiveProject = useCallback(async () => {
    if (!activeProjectId) return;
    try {
      const res = await fetch(`/api/projects/${activeProjectId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveProject(data.project);
      }
    } catch (err) {
      console.warn('Failed to load active project:', err);
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
