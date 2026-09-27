import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { PatlesLotusLogo } from './PatlesLotusLogo';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <PatlesLotusLogo variant="icon" size="lg" glow={true} animated={true} />
          <div className="flex items-center gap-2 text-sm text-purple-400 font-mono">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span>Verifying authenticated developer session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the Login page, preserving return route in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
