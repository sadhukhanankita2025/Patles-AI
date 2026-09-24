import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor?: string;
  isGlowOrb?: boolean;
  hasOrbitRing?: boolean;
  isMicroDust?: boolean;
  orbitRadius?: number;
  orbitAngle?: number;
  orbitSpeed?: number;
  pulsePhase: number;
  pulseSpeed: number;
  alpha: number;
}

export const CosmicPlexusBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate fixed random coordinates for floating Framer Motion ambient stardust nodes
  const floatingStardust = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${(i * 3.7 + 2) % 96}%`,
      top: `${(i * 7.1 + 5) % 94}%`,
      size: i % 4 === 0 ? 3.5 : i % 3 === 0 ? 2.5 : 1.8,
      color:
        i % 4 === 0
          ? '#E879F9' // bright magenta
          : i % 3 === 0
          ? '#06E7F2' // neon cyan
          : i % 2 === 0
          ? '#C084FC' // lavender
          : '#FFFFFF', // starlight white
      duration: 12 + (i % 8) * 2.5,
      delay: (i % 6) * 1.2,
      driftY: -25 - (i % 5) * 8,
      driftX: ((i % 2 === 0 ? 1 : -1) * (15 + (i % 4) * 6)),
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Patles.ai Brand Color Spectrum:
    // Hot Pink / Magenta (#FF5DAF, #EC4899, #D946EF)
    // Deep Violet / Lavender (#6D28D9, #8B5CF6, #C084FC)
    // Cyan / Aqua (#06E7F2, #22D3EE, #38BDF8)
    const colors = [
      '#C084FC', // Lavender glow
      '#D946EF', // Bright magenta
      '#38BDF8', // Cyan / electric sky
      '#8B5CF6', // Royal purple
      '#EC4899', // Rose pink
      '#06E7F2', // Neon cyan
      '#A855F7', // Vivid purple
      '#FF7CC8', // Soft hot pink
    ];

    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, active: false };

    const initParticles = () => {
      particles = [];
      // Substantially increased density: ~80-120 particles on desktop, ~45 on mobile
      const count = Math.min(125, Math.max(48, Math.floor((width * height) / 14000)));

      for (let i = 0; i < count; i++) {
        // Specialize 6 prominent glowing spheres (like user image bright purple/magenta orbs)
        const isGlowOrb = i % 18 === 0 || i === 1;
        // Specialize 5 particles with orbital rings (like user image hollow circle with orbiting satellite)
        const hasOrbitRing = !isGlowOrb && (i % 20 === 3 || i === 4);
        // Specialize 35% as free-floating unlinked micro-dust particles
        const isMicroDust = !isGlowOrb && !hasOrbitRing && i % 3 === 0;

        const color = isGlowOrb
          ? i % 2 === 0 ? '#E879F9' : '#C084FC'
          : hasOrbitRing
          ? i % 2 === 0 ? '#A855F7' : '#06E7F2'
          : colors[i % colors.length];

        const baseRadius = isGlowOrb
          ? 5.8
          : hasOrbitRing
          ? 2.8
          : isMicroDust
          ? Math.random() * 1.4 + 0.8
          : Math.random() * 2.2 + 1.2;

        const speedMultiplier = isMicroDust ? 0.3 : 0.45;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speedMultiplier,
          vy: (Math.random() - 0.5) * speedMultiplier,
          radius: baseRadius,
          baseRadius,
          color,
          glowColor: isGlowOrb ? 'rgba(232, 121, 249, 0.95)' : undefined,
          isGlowOrb,
          hasOrbitRing,
          isMicroDust,
          orbitRadius: hasOrbitRing ? (Math.random() * 14 + 18) : undefined,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitSpeed: (Math.random() * 0.018 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.025 + 0.012,
          alpha: isMicroDust ? Math.random() * 0.4 + 0.35 : Math.random() * 0.3 + 0.7,
        });
      }
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw connecting constellation lines between proximate network nodes (excluding pure micro dust)
      const maxDistance = 145;
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].isMicroDust) continue;

        for (let j = i + 1; j < particles.length; j++) {
          if (particles[j].isMicroDust) continue;

          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.26;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            // Subtle violet-to-cyan line styling matching reference
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // 2. Interactive mouse constellation connection
      if (mouse.active) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.38;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.strokeStyle = `rgba(6, 231, 242, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 3. Update & render all particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders smoothly
        if (p.x < -35) p.x = width + 35;
        else if (p.x > width + 35) p.x = -35;

        if (p.y < -35) p.y = height + 35;
        else if (p.y > height + 35) p.y = -35;

        // Pulse factor
        p.pulsePhase += p.pulseSpeed;
        const pulseFactor = Math.sin(p.pulsePhase) * 0.25 + 1;
        const currentRadius = p.radius * pulseFactor;

        // If particle is a prominent Glowing Orb (exact match to user image's large glowing purple sphere)
        if (p.isGlowOrb) {
          // Large outer ambient halo
          const haloGrad = ctx.createRadialGradient(
            p.x, p.y, currentRadius * 0.5,
            p.x, p.y, currentRadius * 7.5
          );
          haloGrad.addColorStop(0, 'rgba(232, 121, 249, 0.55)');
          haloGrad.addColorStop(0.3, 'rgba(168, 85, 247, 0.28)');
          haloGrad.addColorStop(0.7, 'rgba(124, 58, 237, 0.08)');
          haloGrad.addColorStop(1, 'rgba(124, 58, 237, 0)');

          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 7.5, 0, Math.PI * 2);
          ctx.fillStyle = haloGrad;
          ctx.fill();

          // Intense core
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#F0ABFC';
          ctx.shadowColor = '#C084FC';
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        } else if (p.hasOrbitRing && p.orbitRadius) {
          // Orbital Ring (like user image hollow circle with orbiting satellite)
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.orbitRadius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.lineWidth = 1.1;
          ctx.stroke();

          // Center node
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Orbiting satellite dot
          if (p.orbitAngle !== undefined && p.orbitSpeed !== undefined) {
            p.orbitAngle += p.orbitSpeed;
            const satX = p.x + Math.cos(p.orbitAngle) * p.orbitRadius;
            const satY = p.y + Math.sin(p.orbitAngle) * p.orbitRadius;

            ctx.beginPath();
            ctx.arc(satX, satY, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#FF7CC8';
            ctx.shadowColor = '#FF5DAF';
            ctx.shadowBlur = 9;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        } else if (p.isMicroDust) {
          // Delicate floating stardust speck
          ctx.save();
          ctx.globalAlpha = p.alpha * (Math.sin(p.pulsePhase) * 0.3 + 0.7);
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        } else {
          // Standard constellation node with subtle neon glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 7;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Deep cosmic gradient matching the user's reference image */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 95% 75% at 50% 12%, #0e1236 0%, #080a1e 42%, #050611 100%)'
        }}
      />

      {/* ========================================================
          2. SLOW-MOVING ANIMATED GRADIENT BLOBS (FRAMER MOTION)
          Organic, morphing neon fluid gradients in Patles.ai colors
          ======================================================== */}
      
      {/* Blob 1: Royal Violet & Lavender Nebula (Top Left -> Center) */}
      <motion.div
        className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] sm:w-[850px] sm:h-[850px] rounded-full pointer-events-none opacity-60 mix-blend-screen blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.45) 0%, rgba(139, 92, 246, 0.25) 50%, rgba(192, 132, 252, 0.08) 75%, transparent 100%)',
        }}
        animate={{
          x: [0, 90, -70, 50, 0],
          y: [0, -80, 60, -40, 0],
          scale: [1, 1.25, 0.92, 1.18, 1],
          rotate: [0, 60, 160, 260, 360],
          borderRadius: [
            '45% 55% 70% 30% / 40% 60% 35% 65%',
            '60% 40% 45% 55% / 55% 45% 60% 40%',
            '40% 60% 65% 35% / 45% 55% 40% 60%',
            '55% 45% 35% 65% / 60% 40% 55% 45%',
            '45% 55% 70% 30% / 40% 60% 35% 65%',
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Blob 2: Electric Cyan & Aqua Aurora (Top Right -> Center) */}
      <motion.div
        className="absolute top-[5%] right-[-10%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none opacity-55 mix-blend-screen blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(6, 231, 242, 0.4) 0%, rgba(34, 211, 238, 0.22) 45%, rgba(37, 99, 235, 0.1) 75%, transparent 100%)',
        }}
        animate={{
          x: [0, -110, 50, -60, 0],
          y: [0, 90, -50, 70, 0],
          scale: [1, 0.88, 1.22, 0.95, 1],
          rotate: [0, -70, -170, -280, -360],
          borderRadius: [
            '60% 40% 50% 50% / 50% 60% 40% 50%',
            '45% 55% 60% 40% / 65% 35% 55% 45%',
            '55% 45% 35% 65% / 40% 60% 45% 55%',
            '40% 60% 55% 45% / 55% 45% 60% 40%',
            '60% 40% 50% 50% / 50% 60% 40% 50%',
          ],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Blob 3: Hot Pink & Neon Rose Cosmic Flare (Bottom Left / Center) */}
      <motion.div
        className="absolute bottom-[-10%] left-[10%] w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] rounded-full pointer-events-none opacity-50 mix-blend-screen blur-[150px]"
        style={{
          background: 'radial-gradient(circle, rgba(255, 93, 175, 0.38) 0%, rgba(236, 72, 153, 0.22) 50%, rgba(168, 85, 247, 0.1) 75%, transparent 100%)',
        }}
        animate={{
          x: [0, 80, -90, 60, 0],
          y: [0, -70, 80, -50, 0],
          scale: [1, 1.2, 0.88, 1.15, 1],
          rotate: [0, 80, 190, 290, 360],
          borderRadius: [
            '50% 50% 35% 65% / 60% 35% 65% 40%',
            '65% 35% 55% 45% / 45% 55% 40% 60%',
            '40% 60% 45% 55% / 55% 45% 60% 40%',
            '55% 45% 65% 35% / 40% 60% 50% 50%',
            '50% 50% 35% 65% / 60% 35% 65% 40%',
          ],
        }}
        transition={{
          duration: 23,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Blob 4: Deep Indigo & Galactic Violet Core (Center Deep Glow) */}
      <motion.div
        className="absolute top-[35%] left-[25%] w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full pointer-events-none opacity-45 mix-blend-screen blur-[160px]"
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.35) 0%, rgba(109, 40, 217, 0.2) 48%, rgba(6, 231, 242, 0.08) 80%, transparent 100%)',
        }}
        animate={{
          x: [0, -60, 70, -40, 0],
          y: [0, 60, -60, 40, 0],
          scale: [0.95, 1.18, 0.88, 1.12, 0.95],
          rotate: [0, -45, -120, -220, -360],
        }}
        transition={{
          duration: 33,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* ========================================================
          3. FRAMER MOTION FLOATING STARDUST & SPARKS (DEPTH LAYER)
          ======================================================== */}
      {floatingStardust.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
          }}
          animate={{
            y: [0, star.driftY, 0],
            x: [0, star.driftX, 0],
            opacity: [0.25, 0.85, 0.3],
            scale: [1, 1.35, 0.9],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: star.delay,
          }}
        />
      ))}

      {/* ========================================================
          4. INTERACTIVE CONSTELLATION PLEXUS CANVAS
          Dense floating nodes, orbital rings & connecting mesh lines
          ======================================================== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};
