import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CosmicPlexusBackground } from '../components/CosmicPlexusBackground';
import { PageView } from '../types';

interface MainLayoutProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
  children
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050611] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 relative">
      {/* High-Tech Cosmic Plexus & Constellation Canvas */}
      <CosmicPlexusBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          currentPage={currentPage}
          onNavigate={onNavigate}
          onOpenAuth={onOpenAuth}
        />
        <main className="flex-1">
          {children}
        </main>
        <Footer 
          onNavigate={onNavigate} 
        />
      </div>
    </div>
  );
};

