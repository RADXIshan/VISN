import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';

const words = [
  "CURATING DIGITAL FORM",
  "SCULPTING CYBER SPACE",
  "VISUAL INTELLIGENCE",
  "EDITORIAL DESIGN",
  "VISN STUDIO"
];

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const textContainerRef = useRef(null);
  const artworkFrameRef = useRef(null);
  
  const [wordIdx, setWordIdx] = useState(0);

  const triggerExitAnimation = useCallback(() => {
    const path = pathRef.current;
    const container = containerRef.current;
    const textContainer = textContainerRef.current;
    
    if (!path || !container || !textContainer) {
      if (onComplete) onComplete();
      return;
    }

    // Snappy transition: trigger Hero entrance IMMEDIATELY as the exit timeline starts
    if (onComplete) onComplete();

    const tl = gsap.timeline();

    // 1. Fade out preloader content
    tl.to(textContainer, {
      opacity: 0,
      y: -50,
      scale: 0.96,
      duration: 0.45,
      ease: "power3.in"
    });

    // 2. Liquid curtain wipe upwards (reveals the cream content behind)
    tl.to(path, {
      attr: { d: "M0 0 L100 0 L100 65 Q50 30 0 65 Z" },
      duration: 0.45,
      ease: "power2.in"
    }, "-=0.25");

    tl.to(path, {
      attr: { d: "M0 0 L100 0 L100 0 Q50 0 0 0 Z" },
      duration: 0.6,
      ease: "power4.out"
    });

    // 3. Hide preloader overlay
    tl.to(container, {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.1
    }, "-=0.4");
  }, [onComplete]);

  // Cycle words
  useEffect(() => {
    if (count >= 100) return;
    const interval = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % words.length);
    }, 400);
    return () => clearInterval(interval);
  }, [count]);

  // Animate counter and load trigger
  useEffect(() => {
    const loaderObj = { val: 0 };
    gsap.to(loaderObj, {
      val: 100,
      duration: 1.8, // Brisk loading timeline
      ease: "power2.out",
      onUpdate: () => {
        const newVal = Math.floor(loaderObj.val);
        setCount(prev => (prev >= 100 ? prev : Math.min(newVal, 100)));
      },
      onComplete: () => {
        triggerExitAnimation();
      }
    });
  }, [triggerExitAnimation]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-99999 flex items-center justify-center bg-transparent"
    >
      {/* SVG Liquid morph wipe (Colored in Obsidian dark mode curtain) */}
      <svg 
        className="absolute inset-0 h-full w-full fill-dark-bg pointer-events-none"
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path 
          ref={pathRef}
          d="M0 0 L100 0 L100 100 Q50 100 0 100 Z" 
        />
      </svg>

      {/* Symmetrical Luxury Grid Content */}
      <div 
        ref={textContainerRef}
        className="relative z-10 w-full h-full max-w-6xl mx-auto flex flex-col justify-between p-8 md:p-12 text-obsidian select-none"
      >
        {/* Subtle warm golden background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-accent-green/7 blur-[120px] pointer-events-none" />

        {/* Top Metadata row */}
        <div className="flex items-center justify-between text-[8px] md:text-[9px] font-bold tracking-[0.35em] text-obsidian/40 uppercase">
          <span>VISN STUDIO // EST. 2026</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green shadow-[0_0_6px_#10B981] animate-pulse" />
            LOADING CREATIVE SUITE
          </span>
        </div>

        {/* Central Gallery Frame */}
        <div className="my-auto flex flex-col items-center justify-center gap-8">
          
          {/* Framed Artwork Display */}
          <div 
            ref={artworkFrameRef}
            className="relative h-60 w-60 md:h-72 md:w-72 rounded-2xl border border-accent-green/20 bg-dark-card/40 overflow-hidden flex items-center justify-center shadow-2xl p-4"
          >
            {/* Fine framing lines */}
            <div className="absolute inset-2 border border-obsidian/5 rounded-xl pointer-events-none" />
            
            {/* Premium Brand SVG Logo with dynamic assembly & glow */}
            <svg 
              className="h-4/5 w-4/5 text-obsidian transition-all duration-300 ease-out"
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                filter: "drop-shadow(0 0 15px rgba(16, 185, 129, 0.45))",
                transform: `scale(${0.9 + (count * 0.1) / 100})`,
                opacity: count >= 5 ? 1 : 0
              }}
            >
              {/* Outer Golden Orbit (draws itself as count increments) */}
              <circle 
                cx="50" 
                cy="50" 
                r="44" 
                stroke="#10B981" 
                strokeWidth="1.5" 
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * count) / 100}
                strokeLinecap="round"
                style={{ 
                  transform: 'rotate(-90deg)', 
                  transformOrigin: 'center',
                  transition: 'stroke-dashoffset 150ms ease-out'
                }}
              />
              
              {/* Inner Dotted Orbit (fades in) */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="#10B981" 
                strokeWidth="0.5" 
                strokeDasharray="2 2" 
                style={{
                  opacity: Math.max(0, (count - 20) / 80 * 0.6),
                  transition: 'opacity 300ms ease-out'
                }}
              />
              
              {/* Precision Axis Lines (fade in) */}
              <line 
                x1="50" y1="6" x2="50" y2="94" 
                stroke="#10B981" 
                strokeWidth="0.25" 
                strokeDasharray="1 2" 
                style={{
                  opacity: Math.max(0, (count - 30) / 70 * 0.4),
                  transition: 'opacity 300ms ease-out'
                }}
              />
              <line 
                x1="6" y1="50" x2="94" y2="50" 
                stroke="#10B981" 
                strokeWidth="0.25" 
                strokeDasharray="1 2" 
                style={{
                  opacity: Math.max(0, (count - 30) / 70 * 0.4),
                  transition: 'opacity 300ms ease-out'
                }}
              />
              
              {/* Symmetrical Outer Lens (The Eye) (assembles and fades in) */}
              <path 
                d="M 22 50 C 37 25, 63 25, 78 50 C 63 75, 37 75, 22 50 Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinejoin="round"
                style={{
                  opacity: Math.max(0, (count - 40) / 60),
                  transition: 'opacity 300ms ease-out'
                }}
              />
              
              {/* Secondary Inner Lens Path (Gold Accent) */}
              <path 
                d="M 28 50 C 40 32, 60 32, 72 50 C 60 68, 40 68, 28 50 Z" 
                stroke="#10B981" 
                strokeWidth="0.75" 
                style={{
                  opacity: Math.max(0, (count - 50) / 50 * 0.8),
                  transition: 'opacity 300ms ease-out'
                }}
              />

              {/* Iris Gold Circle (grows in center) */}
              <circle 
                cx="50" 
                cy="50" 
                r={Math.max(0, Math.min(11, ((count - 60) / 40) * 11))} 
                fill="#10B981" 
                style={{
                  transition: 'r 300ms ease-out'
                }}
              />

              {/* Pupil (4-pointed star in Obsidian dark/background) */}
              <path 
                d="M 50 43 L 52 48.5 L 57.5 50 L 52 51.5 L 50 57 L 48 51.5 L 42.5 50 L 48 48.5 Z" 
                fill="#08080a" 
                style={{
                  opacity: Math.max(0, (count - 80) / 20),
                  transition: 'opacity 300ms ease-out'
                }}
              />
            </svg>
          </div>

          {/* Loader values */}
          <div className="flex flex-col items-center gap-2">
            {/* Rotating terms */}
            <span className="text-[10px] md:text-xs font-bold tracking-[0.32em] text-accent-green uppercase h-4">
              {words[wordIdx]}
            </span>

            {/* Serif counter */}
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl md:text-5xl font-serif font-light tracking-tight text-obsidian">
                {count.toString().padStart(3, '0')}
              </span>
              <span className="text-xs font-sans font-bold text-accent-green % ml-1">%</span>
            </div>

            {/* Fine loading bar indicator */}
            <div className="w-32 h-px bg-obsidian/10 mt-3 relative overflow-hidden rounded-full">
              <div 
                className="absolute top-0 left-0 h-full bg-accent-green transition-all duration-150 ease-out"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Coordinates & Time */}
        <div className="flex items-center justify-between text-[8px] md:text-[9px] font-mono text-obsidian/30 tracking-widest uppercase">
          <span>LAT: 37.7749° N // LON: 122.4194° W</span>
          <span>© 2026 // ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
