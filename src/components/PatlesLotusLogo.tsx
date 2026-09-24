import React from 'react';

export interface PatlesLotusLogoProps {
  variant?: 'horizontal' | 'icon' | 'vertical' | 'banner';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero' | number;
  theme?: 'dark' | 'light';
  glow?: boolean;
  showRing?: boolean;
  showDualRings?: boolean;
  showInnerCrystal?: boolean;
  showGalaxy?: boolean;
  showParticles?: boolean;
  animated?: boolean;
  className?: string;
  showTagline?: boolean;
  onClick?: () => void;
}

/**
 * Patles.ai Ultra-Premium Futuristic Cosmic Lotus Logo
 * Inspired by OpenAI × Linear × Cursor × Lovable × Vercel AI
 *
 * SPECIFICATIONS:
 * 1. Exactly 3 translucent glowing crystal glass petals
 *    - Left: Hot Pink → Rose Pink → Soft Magenta (#FF5DAF → #EC4899 → #FF7CC8)
 *    - Center (Tallest): Deep Violet → Royal Purple → Lavender Glow (#6D28D9 → #8B5CF6 → #C4B5FD)
 *    - Right: Cyan → Aqua → Electric Blue (#06E7F2 → #22D3EE → #2563EB)
 * 2. Inner AI Crystal Core:
 *    - Multi-faceted crystalline lotus nucleus in glowing purple energy (#C4B5FD / #8B5CF6)
 *    - White-lavender photon center (#FFFFFF / #E0E7FF)
 *    - Micro cosmic galaxy starlight nodes
 * 3. Two Thin Glowing Orbital Rings:
 *    - Ring 1: Diagonal Neon Purple light trail (-22°)
 *    - Ring 2: Diagonal Neon Cyan light trail (+24°)
 *    - Small stars & floating energy spheres in pink, purple, and cyan
 * 4. Wordmark:
 *    - "Patles" in metallic pearl white with soft blue glow
 *    - ".ai" in purple-to-cyan gradient (#8B5CF6 → #06E7F2)
 *    - Sleek kerning positioned intimately close to the emblem
 */
export const PatlesLotusLogo: React.FC<PatlesLotusLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'dark',
  glow = true,
  showRing = true,
  showDualRings = true,
  showInnerCrystal = true,
  showGalaxy = false,
  showParticles = true,
  animated = false,
  className = '',
  showTagline = false,
  onClick
}) => {
  // Compute pixel dimensions based on size prop (Enlarged Lotus Icon + Sleek Refined Typography)
  let iconSize = 60;
  let textClass = 'text-lg sm:text-xl font-bold';
  let taglineClass = 'text-[11px]';
  let isSmall = false;

  if (typeof size === 'number') {
    iconSize = size;
    isSmall = size <= 28;
    if (size <= 26) textClass = 'text-xs font-semibold';
    else if (size <= 38) textClass = 'text-sm sm:text-base font-bold';
    else if (size <= 56) textClass = 'text-base sm:text-lg font-bold';
    else if (size <= 78) textClass = 'text-xl sm:text-2xl font-extrabold';
    else if (size <= 116) textClass = 'text-3xl sm:text-4xl font-extrabold';
    else textClass = 'text-4xl sm:text-5xl font-black';
  } else {
    switch (size) {
      case 'xs':
        iconSize = 30;
        isSmall = true;
        textClass = 'text-xs font-semibold';
        taglineClass = 'text-[8px]';
        break;
      case 'sm':
        iconSize = 46;
        isSmall = false;
        textClass = 'text-sm sm:text-base font-bold';
        taglineClass = 'text-[9px]';
        break;
      case 'md':
        iconSize = 60;
        textClass = 'text-lg sm:text-xl font-bold';
        taglineClass = 'text-[11px]';
        break;
      case 'lg':
        iconSize = 84;
        textClass = 'text-2xl sm:text-3xl font-extrabold';
        taglineClass = 'text-xs font-mono';
        break;
      case 'xl':
        iconSize = 120;
        textClass = 'text-3xl sm:text-4xl font-extrabold';
        taglineClass = 'text-xs font-mono';
        break;
      case '2xl':
        iconSize = 176;
        textClass = 'text-4xl sm:text-5xl font-black';
        taglineClass = 'text-sm font-mono';
        break;
      case 'hero':
        iconSize = 250;
        textClass = 'text-5xl sm:text-6xl font-black';
        taglineClass = 'text-base font-mono';
        break;
    }
  }

  // Unique ID prefix to avoid SVG defs collision when multiple logos exist on page
  const uniqueId = React.useId().replace(/:/g, '_');

  // Text color based on theme
  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const taglineColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  // Micro-particles and orbital ring shouldn't clutter tiny favicon / tiny sizes
  const renderRings = (showRing || showDualRings) && !isSmall;
  const renderDual = showDualRings && !isSmall;
  const renderCrystal = showInnerCrystal && !isSmall;
  const renderParticles = showParticles && !isSmall;

  /**
   * The 3-Petal Cosmic Lotus Symbol Vector
   */
  const LotusSymbol = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-all duration-300 ${
        animated ? 'hover:scale-105 group-hover:scale-105' : ''
      }`}
      style={{ overflow: 'visible' }}
      aria-label="Patles.ai Cosmic Crystal Lotus"
    >
      <defs>
        {/* ========================================================
            EXACT GRADIENTS FROM SPEC
            ======================================================== */}
        {/* Left Petal: Hot Pink → Rose Pink → Soft Magenta (#FF5DAF → #EC4899 → #FF7CC8) */}
        <linearGradient id={`${uniqueId}_pink`} x1="15%" y1="5%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#FF7CC8" />
          <stop offset="40%" stopColor="#FF5DAF" />
          <stop offset="80%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>

        {/* Center Petal: Deep Violet → Royal Purple → Lavender Glow (#6D28D9 → #8B5CF6 → #C4B5FD) */}
        <linearGradient id={`${uniqueId}_purple`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="35%" stopColor="#8B5CF6" />
          <stop offset="75%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>

        {/* Right Petal: Cyan → Aqua → Electric Blue (#06E7F2 → #22D3EE → #2563EB) */}
        <linearGradient id={`${uniqueId}_cyan`} x1="15%" y1="5%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#06E7F2" />
          <stop offset="35%" stopColor="#22D3EE" />
          <stop offset="75%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Specular Highlight for Glossy Glass Depth */}
        <linearGradient id={`${uniqueId}_specular`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </linearGradient>

        {/* Glowing Edge Rim Highlights */}
        <linearGradient id={`${uniqueId}_rim`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#E0E7FF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.25" />
        </linearGradient>

        {/* Inner AI Crystal Facet Gradient (Royal Purple / Lavender / Diamond Light) */}
        <linearGradient id={`${uniqueId}_crystal_facet_l`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#C4B5FD" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id={`${uniqueId}_crystal_facet_r`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.85" />
        </linearGradient>

        {/* Ring 1 (Neon Purple Orbit): Lavender → Purple → Deep Violet */}
        <linearGradient id={`${uniqueId}_ring_purple`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${uniqueId}_ring_purple_back`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.35" />
        </linearGradient>

        {/* Ring 2 (Neon Cyan Orbit): Bright Cyan → Aqua → Electric Blue */}
        <linearGradient id={`${uniqueId}_ring_cyan`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06E7F2" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#22D3EE" stopOpacity="1" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${uniqueId}_ring_cyan_back`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06E7F2" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.35" />
        </linearGradient>

        {/* Soft Cosmic Bloom & Glow Filter */}
        {glow && (
          <filter id={`${uniqueId}_bloom`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="glow1" />
            <feGaussianBlur stdDeviation="6" result="glow2" />
            <feMerge>
              <feMergeNode in="glow2" opacity="0.45" />
              <feMergeNode in="glow1" opacity="0.8" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}

        {/* Dynamic GPU Keyframe Animations */}
        {animated && (
          <style>{`
            @keyframes orbit_dash_${uniqueId} {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 44; }
            }
            @keyframes pulse_core_${uniqueId} {
              0%, 100% { transform: scale(1); opacity: 0.92; }
              50% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 6px #C4B5FD); }
            }
            @keyframes twinkle_${uniqueId} {
              0%, 100% { opacity: 0.4; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.3); }
            }
            .${uniqueId}_ring1 {
              stroke-dasharray: 4 2.5;
              animation: orbit_dash_${uniqueId} 9s linear infinite;
            }
            .${uniqueId}_ring2 {
              stroke-dasharray: 4 2.5;
              animation: orbit_dash_${uniqueId} 7s linear infinite reverse;
            }
            .${uniqueId}_core {
              animation: pulse_core_${uniqueId} 3s ease-in-out infinite;
              transform-origin: 50px 53px;
            }
            .${uniqueId}_star {
              animation: twinkle_${uniqueId} 2.5s ease-in-out infinite;
              transform-origin: center;
            }
          `}</style>
        )}
      </defs>

      {/* ========================================================
          0. GALAXY SWIRL (Subtle cosmic nebula behind lotus)
          ======================================================== */}
      {showGalaxy && (
        <g opacity="0.65">
          <ellipse cx="50" cy="54" rx="42" ry="24" fill="#6D28D9" opacity="0.25" filter={`url(#${uniqueId}_bloom)`} />
          <ellipse cx="50" cy="54" rx="36" ry="16" fill="#06E7F2" opacity="0.2" filter={`url(#${uniqueId}_bloom)`} transform="rotate(-25 50 54)" />
        </g>
      )}

      {/* Base Group with Glow */}
      <g filter={glow ? `url(#${uniqueId}_bloom)` : undefined}>
        
        {/* ========================================================
            1. BACK OF DUAL ORBITAL RINGS (Behind the Lotus)
            ======================================================== */}
        {renderRings && (
          <>
            {/* Ring 1 (Neon Purple) - Angled at -22° */}
            <g transform="rotate(-22 50 56)">
              <path
                d="M 6 56 A 44 12 0 0 1 94 56"
                stroke={`url(#${uniqueId}_ring_purple_back)`}
                strokeWidth="1.2"
                strokeDasharray="3.5 2"
                strokeLinecap="round"
                fill="none"
                className={animated ? `${uniqueId}_ring1` : undefined}
              />
            </g>

            {/* Ring 2 (Neon Cyan) - Angled at +24° (Counter-diagonal) */}
            {renderDual && (
              <g transform="rotate(24 50 56)">
                <path
                  d="M 6 56 A 44 12 0 0 1 94 56"
                  stroke={`url(#${uniqueId}_ring_cyan_back)`}
                  strokeWidth="1.2"
                  strokeDasharray="3.5 2"
                  strokeLinecap="round"
                  fill="none"
                  className={animated ? `${uniqueId}_ring2` : undefined}
                />
              </g>
            )}
          </>
        )}

        {/* ========================================================
            2. PETAL 1 (LEFT): Hot Pink → Rose Pink → Soft Magenta
            Angled outward at -34° around base node (50, 84)
            ======================================================== */}
        <g transform="translate(50, 84) rotate(-34) translate(-50, -84)">
          {/* Main Translucent Glass Body */}
          <path
            d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z"
            fill={`url(#${uniqueId}_pink)`}
            fillOpacity="0.94"
          />
          {/* Glowing Outer Rim Highlight */}
          <path
            d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z"
            stroke={`url(#${uniqueId}_rim)`}
            strokeWidth="0.85"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
          {/* Glossy Specular Glass Ridge */}
          <path
            d="M 49.5 26 C 49.8 25.5 50.2 25.5 50.5 26 C 52.8 30 58 43 58 57 C 58 66 54 74 50 78"
            stroke={`url(#${uniqueId}_specular)`}
            strokeWidth="1.35"
            strokeLinecap="round"
            opacity="0.65"
            fill="none"
          />
        </g>

        {/* ========================================================
            3. PETAL 3 (RIGHT): Cyan → Aqua → Electric Blue
            Angled outward at +34° around base node (50, 84)
            ======================================================== */}
        <g transform="translate(50, 84) rotate(34) translate(-50, -84)">
          {/* Main Translucent Glass Body */}
          <path
            d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z"
            fill={`url(#${uniqueId}_cyan)`}
            fillOpacity="0.94"
          />
          {/* Glowing Outer Rim Highlight */}
          <path
            d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z"
            stroke={`url(#${uniqueId}_rim)`}
            strokeWidth="0.85"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
          {/* Glossy Specular Glass Ridge */}
          <path
            d="M 49.5 26 C 49.8 25.5 50.2 25.5 50.5 26 C 52.8 30 58 43 58 57 C 58 66 54 74 50 78"
            stroke={`url(#${uniqueId}_specular)`}
            strokeWidth="1.35"
            strokeLinecap="round"
            opacity="0.65"
            fill="none"
          />
        </g>

        {/* ========================================================
            4. PETAL 2 (CENTER - TALLEST): Deep Violet → Royal Purple → Lavender Glow
            Upright central petal with glassmorphism overlap & inner depth.
            ======================================================== */}
        <g>
          {/* Central Petal Body */}
          <path
            d="M 48.2 15 C 49.2 14 50.8 14 51.8 15 C 55.8 19.5 64 36 64 54.5 C 64 71 56.5 81.5 50 84 C 43.5 81.5 36 71 36 54.5 C 36 36 44.2 19.5 48.2 15 Z"
            fill={`url(#${uniqueId}_purple)`}
            fillOpacity="0.96"
          />
          {/* Glowing Edge Rim */}
          <path
            d="M 48.2 15 C 49.2 14 50.8 14 51.8 15 C 55.8 19.5 64 36 64 54.5 C 64 71 56.5 81.5 50 84 C 43.5 81.5 36 71 36 54.5 C 36 36 44.2 19.5 48.2 15 Z"
            stroke={`url(#${uniqueId}_rim)`}
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
          {/* Center Spine Specular Accent */}
          <path
            d="M 49.2 17 C 49.6 16.5 50.4 16.5 50.8 17 C 53.5 22 59.5 37 59.5 53 C 59.5 66 55 76 50 80"
            stroke={`url(#${uniqueId}_specular)`}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.75"
            fill="none"
          />

          {/* ========================================================
              INNER AI CRYSTAL NUCLEUS (Inside Center Petal)
              Layered crystalline geometry + bright photon energy core
              ======================================================== */}
          {renderCrystal && (
            <g opacity="0.95" className={animated ? `${uniqueId}_core` : undefined}>
              {/* Facet 1: Top Left */}
              <polygon
                points="50,42 43.5,53.5 50,52"
                fill={`url(#${uniqueId}_crystal_facet_l)`}
                opacity="0.88"
              />
              {/* Facet 2: Top Right */}
              <polygon
                points="50,42 56.5,53.5 50,52"
                fill={`url(#${uniqueId}_crystal_facet_r)`}
                opacity="0.95"
              />
              {/* Facet 3: Bottom Left */}
              <polygon
                points="43.5,53.5 50,67 50,52"
                fill="#8B5CF6"
                opacity="0.8"
              />
              {/* Facet 4: Bottom Right */}
              <polygon
                points="56.5,53.5 50,67 50,52"
                fill="#6D28D9"
                opacity="0.9"
              />
              {/* Crystal Outer Facet Edges */}
              <polygon
                points="50,42 56.5,53.5 50,67 43.5,53.5"
                stroke="#FFFFFF"
                strokeWidth="0.85"
                strokeLinejoin="round"
                fill="none"
                opacity="0.85"
              />
              {/* Center Diamond Photon AI Nucleus */}
              <circle cx="50" cy="53" r="2.4" fill="#FFFFFF" opacity="0.98" />
              <circle cx="50" cy="53" r="1.1" fill="#C4B5FD" opacity="0.9" />

              {/* Internal micro-stars / galaxy starlight */}
              <circle cx="48.5" cy="50" r="0.6" fill="#FFFFFF" opacity="0.9" className={animated ? `${uniqueId}_star` : undefined} />
              <circle cx="51.8" cy="56.5" r="0.6" fill="#06E7F2" opacity="0.9" className={animated ? `${uniqueId}_star` : undefined} />
            </g>
          )}
        </g>

        {/* ========================================================
            5. FRONT ARCS OF DUAL GLOWING ORBITAL RINGS
            Sweeping across the foreground with luminous neon trails!
            ======================================================== */}
        {renderRings && (
          <>
            {/* Ring 1 Front Arc (Neon Purple) - Angled at -22° */}
            <g transform="rotate(-22 50 56)">
              <path
                d="M 94 56 A 44 12 0 0 1 6 56"
                stroke={`url(#${uniqueId}_ring_purple)`}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.95"
                className={animated ? `${uniqueId}_ring1` : undefined}
              />
              {/* Floating energy spheres along orbit 1 */}
              <circle cx="91" cy="54" r="1.7" fill="#C4B5FD" opacity="0.98" className={animated ? `${uniqueId}_star` : undefined} />
              <circle cx="91" cy="54" r="0.8" fill="#FFFFFF" />
              <circle cx="9" cy="58" r="1.5" fill="#FF5DAF" opacity="0.9" className={animated ? `${uniqueId}_star` : undefined} />
            </g>

            {/* Ring 2 Front Arc (Neon Cyan) - Angled at +24° */}
            {renderDual && (
              <g transform="rotate(24 50 56)">
                <path
                  d="M 94 56 A 44 12 0 0 1 6 56"
                  stroke={`url(#${uniqueId}_ring_cyan)`}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.95"
                  className={animated ? `${uniqueId}_ring2` : undefined}
                />
                {/* Floating energy spheres along orbit 2 */}
                <circle cx="89" cy="58" r="1.7" fill="#06E7F2" opacity="0.98" className={animated ? `${uniqueId}_star` : undefined} />
                <circle cx="89" cy="58" r="0.8" fill="#FFFFFF" />
                <circle cx="11" cy="54" r="1.4" fill="#8B5CF6" opacity="0.9" className={animated ? `${uniqueId}_star` : undefined} />
              </g>
            )}
          </>
        )}

        {/* ========================================================
            6. SUBTLE GLOWING PARTICLES, SPARKS & ENERGY SPHERES
            ======================================================== */}
        {renderParticles && (
          <g opacity="0.9">
            {/* Spark 1 (Top left neon pink) */}
            <circle cx="15" cy="22" r="1.3" fill="#FF7CC8" className={animated ? `${uniqueId}_star` : undefined} />
            {/* Spark 2 (Top right electric cyan) */}
            <circle cx="85" cy="24" r="1.3" fill="#06E7F2" className={animated ? `${uniqueId}_star` : undefined} />
            {/* Spark 3 (Top center lavender aura) */}
            <circle cx="50" cy="6" r="1.2" fill="#C4B5FD" className={animated ? `${uniqueId}_star` : undefined} />
            {/* Spark 4 (Lower right blue particle) */}
            <circle cx="89" cy="70" r="1.1" fill="#2563EB" />
            {/* Spark 5 (Lower left hot pink sphere) */}
            <circle cx="11" cy="70" r="1.1" fill="#FF5DAF" />
          </g>
        )}

        {/* ========================================================
            7. CONFLUENCE SEED (Bottom Center convergence node)
            ======================================================== */}
        <circle cx="50" cy="83.5" r="2.2" fill="#FFFFFF" opacity="0.95" />
        <circle cx="50" cy="83.5" r="1.0" fill="#E0E7FF" opacity="1" />
      </g>
    </svg>
  );

  // Return ICON ONLY variant
  if (variant === 'icon') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center select-none ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        title="Patles.ai"
      >
        {LotusSymbol}
      </div>
    );
  }

  // Return VERTICAL / STACKED variant (Lotus centered above typography)
  if (variant === 'vertical') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center text-center select-none group ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        title="Patles.ai"
      >
        <div className="mb-1.5 sm:mb-2 flex items-center justify-center">
          {LotusSymbol}
        </div>
        <div className="flex flex-col items-center">
          <span
            className={`tracking-tight -tracking-[0.02em] font-['Sora',sans-serif] ${textClass} ${textColor} leading-none`}
            style={{
              textShadow: theme === 'dark' ? '0 0 24px rgba(129, 140, 248, 0.35)' : undefined
            }}
          >
            Patles
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              .ai
            </span>
          </span>
          {showTagline && (
            <span
              className={`mt-1 uppercase tracking-widest font-mono ${taglineClass} ${taglineColor}`}
            >
              AI Developer Platform
            </span>
          )}
        </div>
      </div>
    );
  }

  // Return BANNER variant with deep cosmic space background (#050816 + galaxy nebula)
  if (variant === 'banner') {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-purple-500/30 bg-[#050816] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(109, 40, 217, 0.25), inset 0 0 40px rgba(6, 231, 242, 0.08)'
        }}
      >
        {/* Cosmic galaxy swirl & nebula backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/25 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-[90px]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>

        {/* Left: Lotus and Wordmark */}
        <div className="relative z-10 flex items-center gap-4 sm:gap-5">
          {LotusSymbol}
          <div className="flex flex-col">
            <span
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-['Sora',sans-serif] leading-none"
              style={{ textShadow: '0 0 28px rgba(129, 140, 248, 0.45)' }}
            >
              Patles
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                .ai
              </span>
            </span>
            <span className="mt-2 text-xs uppercase tracking-widest font-mono text-cyan-300">
              Cosmic AI Developer Platform
            </span>
          </div>
        </div>

        {/* Right: Badge */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
            OpenAI × Linear Architecture
          </span>
        </div>
      </div>
    );
  }

  // Return HORIZONTAL variant (Lotus on left, perfectly centered "Patles.ai" text tight on right)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 sm:gap-2 select-none group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      title="Patles.ai"
    >
      <div className="flex items-center justify-center shrink-0">
        {LotusSymbol}
      </div>

      <div className="flex flex-col justify-center">
        <span
          className={`tracking-tight -tracking-[0.02em] font-['Sora',sans-serif] ${textClass} ${textColor} leading-none transition-colors`}
          style={{
            textShadow: theme === 'dark' ? '0 0 18px rgba(129, 140, 248, 0.3)' : undefined
          }}
        >
          Patles
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            .ai
          </span>
        </span>
        {showTagline && (
          <span
            className={`mt-0.5 uppercase tracking-wider font-mono ${taglineClass} ${taglineColor}`}
          >
            Developer Platform
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Utility export: Raw standalone SVG markup generator for downloads and 1-click copy.
 * Supports ultra-luxury standalone SVG with transparent or dark galaxy background.
 */
export const getPatlesLotusSvgString = (
  variant: 'icon' | 'horizontal' | 'cosmic-banner' = 'horizontal',
  theme: 'dark' | 'light' = 'dark',
  includeBackground: boolean = false
): string => {
  const textColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const bgMarkup = includeBackground
    ? `<rect width="100%" height="100%" fill="${theme === 'dark' ? '#050816' : '#FFFFFF'}"/>`
    : '';

  if (variant === 'icon') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024">
  <defs>
    <!-- Left Petal: Hot Pink -> Rose Pink -> Soft Magenta (#FF5DAF -> #EC4899 -> #FF7CC8) -->
    <linearGradient id="patles_pink" x1="15%" y1="5%" x2="85%" y2="95%">
      <stop offset="0%" stop-color="#FF7CC8"/>
      <stop offset="40%" stop-color="#FF5DAF"/>
      <stop offset="80%" stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#BE185D"/>
    </linearGradient>

    <!-- Center Petal: Deep Violet -> Royal Purple -> Lavender Glow (#6D28D9 -> #8B5CF6 -> #C4B5FD) -->
    <linearGradient id="patles_purple" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#C4B5FD"/>
      <stop offset="35%" stop-color="#8B5CF6"/>
      <stop offset="75%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#6D28D9"/>
    </linearGradient>

    <!-- Right Petal: Cyan -> Aqua -> Electric Blue (#06E7F2 -> #22D3EE -> #2563EB) -->
    <linearGradient id="patles_cyan" x1="15%" y1="5%" x2="85%" y2="95%">
      <stop offset="0%" stop-color="#06E7F2"/>
      <stop offset="35%" stop-color="#22D3EE"/>
      <stop offset="75%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>

    <!-- Specular Highlight -->
    <linearGradient id="patles_specular" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>

    <!-- Edge Rim -->
    <linearGradient id="patles_rim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#E0E7FF" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.25"/>
    </linearGradient>

    <!-- Inner AI Crystal Facets -->
    <linearGradient id="patles_cfacet_l" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#C4B5FD" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.75"/>
    </linearGradient>
    <linearGradient id="patles_cfacet_r" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E9D5FF" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#A855F7" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6D28D9" stop-opacity="0.85"/>
    </linearGradient>

    <!-- Ring 1 (Neon Purple) -->
    <linearGradient id="patles_rpurple" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#8B5CF6" stop-opacity="1"/>
      <stop offset="100%" stop-color="#6D28D9" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="patles_rpurple_back" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#8B5CF6" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#6D28D9" stop-opacity="0.35"/>
    </linearGradient>

    <!-- Ring 2 (Neon Cyan) -->
    <linearGradient id="patles_rcyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06E7F2" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#22D3EE" stop-opacity="1"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="patles_rcyan_back" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06E7F2" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#22D3EE" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0.35"/>
    </linearGradient>

    <!-- Bloom Filter -->
    <filter id="patles_glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2.5" result="b1"/>
      <feGaussianBlur stdDeviation="6" result="b2"/>
      <feMerge>
        <feMergeNode in="b2" opacity="0.45"/>
        <feMergeNode in="b1" opacity="0.8"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  ${bgMarkup}

  <g filter="url(#patles_glow)">
    <!-- Back of Ring 1 (Purple -22deg) -->
    <g transform="rotate(-22 50 56)">
      <path d="M 6 56 A 44 12 0 0 1 94 56" stroke="url(#patles_rpurple_back)" stroke-width="1.2" stroke-dasharray="3.5 2" stroke-linecap="round" fill="none"/>
    </g>
    <!-- Back of Ring 2 (Cyan +24deg) -->
    <g transform="rotate(24 50 56)">
      <path d="M 6 56 A 44 12 0 0 1 94 56" stroke="url(#patles_rcyan_back)" stroke-width="1.2" stroke-dasharray="3.5 2" stroke-linecap="round" fill="none"/>
    </g>

    <!-- Left Petal: Hot Pink -> Soft Magenta -->
    <g transform="translate(50, 84) rotate(-34) translate(-50, -84)">
      <path d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z" fill="url(#patles_pink)" fill-opacity="0.94"/>
      <path d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z" stroke="url(#patles_rim)" stroke-width="0.85" fill="none" opacity="0.65"/>
      <path d="M 49.5 26 C 49.8 25.5 50.2 25.5 50.5 26 C 52.8 30 58 43 58 57 C 58 66 54 74 50 78" stroke="url(#patles_specular)" stroke-width="1.35" stroke-linecap="round" opacity="0.65" fill="none"/>
    </g>

    <!-- Right Petal: Cyan -> Electric Blue -->
    <g transform="translate(50, 84) rotate(34) translate(-50, -84)">
      <path d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z" fill="url(#patles_cyan)" fill-opacity="0.94"/>
      <path d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z" stroke="url(#patles_rim)" stroke-width="0.85" fill="none" opacity="0.65"/>
      <path d="M 49.5 26 C 49.8 25.5 50.2 25.5 50.5 26 C 52.8 30 58 43 58 57 C 58 66 54 74 50 78" stroke="url(#patles_specular)" stroke-width="1.35" stroke-linecap="round" opacity="0.65" fill="none"/>
    </g>

    <!-- Center Petal: Tallest (Royal Purple -> Lavender Glow) -->
    <g>
      <path d="M 48.2 15 C 49.2 14 50.8 14 51.8 15 C 55.8 19.5 64 36 64 54.5 C 64 71 56.5 81.5 50 84 C 43.5 81.5 36 71 36 54.5 C 36 36 44.2 19.5 48.2 15 Z" fill="url(#patles_purple)" fill-opacity="0.96"/>
      <path d="M 48.2 15 C 49.2 14 50.8 14 51.8 15 C 55.8 19.5 64 36 64 54.5 C 64 71 56.5 81.5 50 84 C 43.5 81.5 36 71 36 54.5 C 36 36 44.2 19.5 48.2 15 Z" stroke="url(#patles_rim)" stroke-width="0.9" fill="none" opacity="0.75"/>
      <path d="M 49.2 17 C 49.6 16.5 50.4 16.5 50.8 17 C 53.5 22 59.5 37 59.5 53 C 59.5 66 55 76 50 80" stroke="url(#patles_specular)" stroke-width="1.4" stroke-linecap="round" opacity="0.75" fill="none"/>

      <!-- Inner AI Crystal Nucleus -->
      <g opacity="0.95">
        <polygon points="50,42 43.5,53.5 50,52" fill="url(#patles_cfacet_l)" opacity="0.88"/>
        <polygon points="50,42 56.5,53.5 50,52" fill="url(#patles_cfacet_r)" opacity="0.95"/>
        <polygon points="43.5,53.5 50,67 50,52" fill="#8B5CF6" opacity="0.8"/>
        <polygon points="56.5,53.5 50,67 50,52" fill="#6D28D9" opacity="0.9"/>
        <polygon points="50,42 56.5,53.5 50,67 43.5,53.5" stroke="#FFFFFF" stroke-width="0.85" stroke-linejoin="round" fill="none" opacity="0.85"/>
        <circle cx="50" cy="53" r="2.4" fill="#FFFFFF" opacity="0.98"/>
        <circle cx="50" cy="53" r="1.1" fill="#C4B5FD" opacity="0.9"/>
      </g>
    </g>

    <!-- Front Arc of Ring 1 (Purple -22deg) -->
    <g transform="rotate(-22 50 56)">
      <path d="M 94 56 A 44 12 0 0 1 6 56" stroke="url(#patles_rpurple)" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.95"/>
      <circle cx="91" cy="54" r="1.7" fill="#C4B5FD" opacity="0.98"/>
      <circle cx="91" cy="54" r="0.8" fill="#FFFFFF"/>
      <circle cx="9" cy="58" r="1.5" fill="#FF5DAF" opacity="0.9"/>
    </g>

    <!-- Front Arc of Ring 2 (Cyan +24deg) -->
    <g transform="rotate(24 50 56)">
      <path d="M 94 56 A 44 12 0 0 1 6 56" stroke="url(#patles_rcyan)" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.95"/>
      <circle cx="89" cy="58" r="1.7" fill="#06E7F2" opacity="0.98"/>
      <circle cx="89" cy="58" r="0.8" fill="#FFFFFF"/>
      <circle cx="11" cy="54" r="1.4" fill="#8B5CF6" opacity="0.9"/>
    </g>

    <!-- Floating Energy Spheres & Stars -->
    <g opacity="0.9">
      <circle cx="15" cy="22" r="1.3" fill="#FF7CC8"/>
      <circle cx="85" cy="24" r="1.3" fill="#06E7F2"/>
      <circle cx="50" cy="6" r="1.2" fill="#C4B5FD"/>
      <circle cx="89" cy="70" r="1.1" fill="#2563EB"/>
      <circle cx="11" cy="70" r="1.1" fill="#FF5DAF"/>
    </g>

    <!-- Confluence Seed Node -->
    <circle cx="50" cy="83.5" r="2.2" fill="#FFFFFF" opacity="0.95"/>
    <circle cx="50" cy="83.5" r="1.0" fill="#E0E7FF" opacity="1"/>
  </g>
</svg>`;
  }

  // Horizontal SVG with typography
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 80" width="1360" height="320">
  <defs>
    <!-- Left Petal: Hot Pink -> Soft Magenta -->
    <linearGradient id="patles_h_pink" x1="15%" y1="5%" x2="85%" y2="95%">
      <stop offset="0%" stop-color="#FF7CC8"/>
      <stop offset="40%" stop-color="#FF5DAF"/>
      <stop offset="80%" stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#BE185D"/>
    </linearGradient>

    <!-- Center Petal: Royal Purple -> Lavender Glow -->
    <linearGradient id="patles_h_purple" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#C4B5FD"/>
      <stop offset="35%" stop-color="#8B5CF6"/>
      <stop offset="75%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#6D28D9"/>
    </linearGradient>

    <!-- Right Petal: Cyan -> Electric Blue -->
    <linearGradient id="patles_h_cyan" x1="15%" y1="5%" x2="85%" y2="95%">
      <stop offset="0%" stop-color="#06E7F2"/>
      <stop offset="35%" stop-color="#22D3EE"/>
      <stop offset="75%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>

    <!-- Wordmark .ai Gradient -->
    <linearGradient id="patles_h_ai" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="50%" stop-color="#818CF8"/>
      <stop offset="100%" stop-color="#06E7F2"/>
    </linearGradient>

    <!-- Specular Highlight -->
    <linearGradient id="patles_h_spec" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="patles_h_rim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#E0E7FF" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.25"/>
    </linearGradient>

    <!-- Inner Crystal Facets -->
    <linearGradient id="patles_h_cfacet_l" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#C4B5FD" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.75"/>
    </linearGradient>
    <linearGradient id="patles_h_cfacet_r" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E9D5FF" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#A855F7" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6D28D9" stop-opacity="0.85"/>
    </linearGradient>

    <!-- Dual Rings -->
    <linearGradient id="patles_h_rpurple" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#8B5CF6" stop-opacity="1"/>
      <stop offset="100%" stop-color="#6D28D9" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="patles_h_rpurple_back" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#8B5CF6" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#6D28D9" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="patles_h_rcyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06E7F2" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#22D3EE" stop-opacity="1"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="patles_h_rcyan_back" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06E7F2" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#22D3EE" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0.35"/>
    </linearGradient>

    <filter id="patles_h_glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2.5" result="blur1"/>
      <feGaussianBlur stdDeviation="6" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur2" opacity="0.4"/>
        <feMergeNode in="blur1" opacity="0.75"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="patles_text_glow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="3" result="tBlur"/>
      <feMerge>
        <feMergeNode in="tBlur" opacity="0.35"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  ${bgMarkup}

  <!-- 3-Petal Lotus Symbol with Dual Orbital Rings & Inner Crystal -->
  <g transform="translate(6, 4) scale(0.76)" filter="url(#patles_h_glow)">
    <!-- Back of Ring 1 (Purple -22deg) -->
    <g transform="rotate(-22 50 56)">
      <path d="M 6 56 A 44 12 0 0 1 94 56" stroke="url(#patles_h_rpurple_back)" stroke-width="1.2" stroke-dasharray="3.5 2" stroke-linecap="round" fill="none"/>
    </g>
    <!-- Back of Ring 2 (Cyan +24deg) -->
    <g transform="rotate(24 50 56)">
      <path d="M 6 56 A 44 12 0 0 1 94 56" stroke="url(#patles_h_rcyan_back)" stroke-width="1.2" stroke-dasharray="3.5 2" stroke-linecap="round" fill="none"/>
    </g>

    <!-- Left Petal: Hot Pink -> Soft Magenta -->
    <g transform="translate(50, 84) rotate(-34) translate(-50, -84)">
      <path d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z" fill="url(#patles_h_pink)" fill-opacity="0.94"/>
      <path d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z" stroke="url(#patles_h_rim)" stroke-width="0.85" fill="none" opacity="0.65"/>
      <path d="M 49.5 26 C 49.8 25.5 50.2 25.5 50.5 26 C 52.8 30 58 43 58 57 C 58 66 54 74 50 78" stroke="url(#patles_h_spec)" stroke-width="1.35" stroke-linecap="round" opacity="0.65" fill="none"/>
    </g>

    <!-- Right Petal: Cyan -> Electric Blue -->
    <g transform="translate(50, 84) rotate(34) translate(-50, -84)">
      <path d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z" fill="url(#patles_h_cyan)" fill-opacity="0.94"/>
      <path d="M 48.5 24 C 49.3 23.1 50.7 23.1 51.5 24 C 55 28 62.5 43 62.5 59 C 62.5 73.5 55.5 82 50 84 C 44.5 82 37.5 73.5 37.5 59 C 37.5 43 45 28 48.5 24 Z" stroke="url(#patles_h_rim)" stroke-width="0.85" fill="none" opacity="0.65"/>
      <path d="M 49.5 26 C 49.8 25.5 50.2 25.5 50.5 26 C 52.8 30 58 43 58 57 C 58 66 54 74 50 78" stroke="url(#patles_h_spec)" stroke-width="1.35" stroke-linecap="round" opacity="0.65" fill="none"/>
    </g>

    <!-- Center Petal: Tallest (Royal Purple -> Lavender Glow) -->
    <g>
      <path d="M 48.2 15 C 49.2 14 50.8 14 51.8 15 C 55.8 19.5 64 36 64 54.5 C 64 71 56.5 81.5 50 84 C 43.5 81.5 36 71 36 54.5 C 36 36 44.2 19.5 48.2 15 Z" fill="url(#patles_h_purple)" fill-opacity="0.96"/>
      <path d="M 48.2 15 C 49.2 14 50.8 14 51.8 15 C 55.8 19.5 64 36 64 54.5 C 64 71 56.5 81.5 50 84 C 43.5 81.5 36 71 36 54.5 C 36 36 44.2 19.5 48.2 15 Z" stroke="url(#patles_h_rim)" stroke-width="0.9" fill="none" opacity="0.75"/>
      <path d="M 49.2 17 C 49.6 16.5 50.4 16.5 50.8 17 C 53.5 22 59.5 37 59.5 53 C 59.5 66 55 76 50 80" stroke="url(#patles_h_spec)" stroke-width="1.4" stroke-linecap="round" opacity="0.75" fill="none"/>

      <!-- Inner AI Crystal Nucleus -->
      <g opacity="0.95">
        <polygon points="50,42 43.5,53.5 50,52" fill="url(#patles_h_cfacet_l)" opacity="0.88"/>
        <polygon points="50,42 56.5,53.5 50,52" fill="url(#patles_h_cfacet_r)" opacity="0.95"/>
        <polygon points="43.5,53.5 50,67 50,52" fill="#8B5CF6" opacity="0.8"/>
        <polygon points="56.5,53.5 50,67 50,52" fill="#6D28D9" opacity="0.9"/>
        <polygon points="50,42 56.5,53.5 50,67 43.5,53.5" stroke="#FFFFFF" stroke-width="0.85" stroke-linejoin="round" fill="none" opacity="0.85"/>
        <circle cx="50" cy="53" r="2.4" fill="#FFFFFF" opacity="0.98"/>
        <circle cx="50" cy="53" r="1.1" fill="#C4B5FD" opacity="0.9"/>
      </g>
    </g>

    <!-- Front Arc of Ring 1 (Purple -22deg) -->
    <g transform="rotate(-22 50 56)">
      <path d="M 94 56 A 44 12 0 0 1 6 56" stroke="url(#patles_h_rpurple)" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.95"/>
      <circle cx="91" cy="54" r="1.7" fill="#C4B5FD" opacity="0.98"/>
      <circle cx="91" cy="54" r="0.8" fill="#FFFFFF"/>
      <circle cx="9" cy="58" r="1.5" fill="#FF5DAF" opacity="0.9"/>
    </g>

    <!-- Front Arc of Ring 2 (Cyan +24deg) -->
    <g transform="rotate(24 50 56)">
      <path d="M 94 56 A 44 12 0 0 1 6 56" stroke="url(#patles_h_rcyan)" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.95"/>
      <circle cx="89" cy="58" r="1.7" fill="#06E7F2" opacity="0.98"/>
      <circle cx="89" cy="58" r="0.8" fill="#FFFFFF"/>
      <circle cx="11" cy="54" r="1.4" fill="#8B5CF6" opacity="0.9"/>
    </g>

    <!-- Confluence Seed -->
    <circle cx="50" cy="83.5" r="2.2" fill="#FFFFFF" opacity="0.95"/>
  </g>

  <!-- Typography "Patles.ai" tight on the right with metallic pearl white & .ai gradient -->
  <g filter="${theme === 'dark' ? 'url(#patles_text_glow)' : undefined}">
    <text x="78" y="51" font-family="'Sora', 'Space Grotesk', 'Inter', -apple-system, sans-serif" font-size="28" font-weight="700" letter-spacing="-0.8">
      <tspan fill="${textColor}">Patles</tspan><tspan fill="url(#patles_h_ai)">.ai</tspan>
    </text>
  </g>
</svg>`;
};
