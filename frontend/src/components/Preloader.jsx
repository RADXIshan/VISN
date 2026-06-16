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
        className="absolute inset-0 h-full w-full fill-obsidian pointer-events-none"
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
        className="relative z-10 w-full h-full max-w-6xl mx-auto flex flex-col justify-between p-8 md:p-12 text-dark-bg select-none"
      >
        {/* Top Metadata row */}
        <div className="flex items-center justify-between text-[8px] md:text-[9px] font-bold tracking-[0.35em] text-dark-bg/40 uppercase">
          <span>VISN STUDIO // EST. 2026</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75] animate-pulse" />
            LOADING CREATIVE SUITE
          </span>
        </div>

        {/* Central Gallery Frame */}
        <div className="my-auto flex flex-col items-center justify-center gap-8">
          
          {/* Framed Artwork Display */}
          <div 
            ref={artworkFrameRef}
            className="relative h-60 w-60 md:h-72 md:w-72 rounded-2xl border border-accent-gold/20 bg-obsidian/30 overflow-hidden flex items-center justify-center shadow-2xl p-4"
          >
            {/* Fine framing lines */}
            <div className="absolute inset-2 border border-dark-bg/5 rounded-xl pointer-events-none" />
            
            {/* Generated Luxury Art Asset */}
            <img 
              src="/preloader-artwork.png" 
              alt="VISN Loading Artwork" 
              className="h-full w-full object-cover rounded-lg scale-105 animate-[pulse_6s_infinite_ease-in-out]"
            />
          </div>

          {/* Loader values */}
          <div className="flex flex-col items-center gap-2">
            {/* Rotating terms */}
            <span className="text-[10px] md:text-xs font-bold tracking-[0.32em] text-accent-gold uppercase h-4">
              {words[wordIdx]}
            </span>

            {/* Serif counter */}
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl md:text-5xl font-serif font-light tracking-tight text-dark-bg">
                {count.toString().padStart(3, '0')}
              </span>
              <span className="text-xs font-sans font-bold text-accent-gold % ml-1">%</span>
            </div>

            {/* Fine loading bar indicator */}
            <div className="w-32 h-px bg-dark-bg/10 mt-3 relative overflow-hidden rounded-full">
              <div 
                className="absolute top-0 left-0 h-full bg-accent-gold transition-all duration-150 ease-out"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Coordinates & Time */}
        <div className="flex items-center justify-between text-[8px] md:text-[9px] font-mono text-dark-bg/30 tracking-widest uppercase">
          <span>LAT: 37.7749° N // LON: 122.4194° W</span>
          <span>© 2026 // ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
