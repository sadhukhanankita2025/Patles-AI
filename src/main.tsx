import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ProjectProvider } from './context/ProjectContext';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProjectProvider } from './context/ProjectContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

