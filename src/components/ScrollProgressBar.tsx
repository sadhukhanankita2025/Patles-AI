import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollProgressBarProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ containerRef }) => {
  const { scrollYProgress } = useScroll(
    containerRef ? { container: containerRef as React.RefObject<HTMLElement> } : {}
  );

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[3px] bg-slate-900/30">
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500"
        style={{
          scaleX,
          boxShadow: '0 0 14px rgba(6, 231, 242, 0.7), 0 0 6px rgba(168, 85, 247, 0.9)'
        }}
      />
    </div>
  );
};
