import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 420);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-purple-400/40 bg-slate-900/90 text-slate-100 shadow-lg shadow-purple-950/40 backdrop-blur transition hover:-translate-y-1 hover:border-purple-300 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#050816]"
      aria-label="Scroll back to top"
      title="Back to top"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};
