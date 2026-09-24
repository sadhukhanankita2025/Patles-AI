import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  label, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-12 h-12 border-3'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        {/* Ambient glow behind loader */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 blur-md opacity-50 animate-pulse" />
        
        {/* Spinning gradient ring */}
        <div 
          className={`${sizeClasses[size]} rounded-full border-transparent border-t-purple-400 border-r-cyan-400 animate-spin relative`} 
          style={{ animationDuration: '0.8s' }}
        />
      </div>
      {label && (
        <span className="text-xs font-medium text-slate-300 tracking-wide animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};
