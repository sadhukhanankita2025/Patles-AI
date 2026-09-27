import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  threshold?: number;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  containerRef,
  threshold = 280
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      let currentScroll = 0;
      let maxScroll = 1;

      if (containerRef?.current) {
        currentScroll = containerRef.current.scrollTop;
        maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      } else if (typeof window !== 'undefined') {
        currentScroll = window.scrollY || document.documentElement.scrollTop;
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      }

      setIsVisible(currentScroll > threshold);
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;
      setScrollProgress(progress);
    };

    if (containerRef?.current) {
      const el = containerRef.current;
      el.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => el.removeEventListener('scroll', handleScroll);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [containerRef, threshold]);

  const scrollToTop = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Circular progress calculations for SVG ring
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-purple-500/60 shadow-xl shadow-purple-950/40 backdrop-blur-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {/* Circular Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 40 40"
            >
              <circle
                cx="20"
                cy="20"
                r={radius}
                className="text-slate-800"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r={radius}
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-cyan-400 transition-all duration-150"
                stroke="url(#scrollGradient)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="50%" stopColor="#06E7F2" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            <ArrowUp className="w-4 h-4 text-cyan-300 group-hover:text-white transition-transform group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
