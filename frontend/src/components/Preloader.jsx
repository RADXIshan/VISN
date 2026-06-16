import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const textContainerRef = useRef(null);
  const counterRef = useRef(null);
  
  const words = [
    "CURATING DIGITAL FORM",
    "SCULPTING CYBER SPACE",
    "VISUAL INTELLIGENCE",
    "EDITORIAL DESIGN",
    "VISN STUDIO"
  ];
  const [wordIdx, setWordIdx] = useState(0);

  // Cycle through creative terms
  useEffect(() => {
    if (count >= 100) return;
    const interval = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % words.length);
    }, 450);
    return () => clearInterval(interval);
  }, [count]);

  // Animate progress value
  useEffect(() => {
    const loaderObj = { val: 0 };
    gsap.to(loaderObj, {
      val: 100,
      duration: 2.3,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.floor(loaderObj.val));
      },
      onComplete: () => {
        triggerExitAnimation();
      }
    });
  }, []);

  const triggerExitAnimation = () => {
    const path = pathRef.current;
    const container = containerRef.current;
    const textContainer = textContainerRef.current;
    
    if (!path || !container || !textContainer) {
      if (onComplete) onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // 1. Fade out preloader typography
    tl.to(textContainer, {
      opacity: 0,
      y: -60,
      scale: 0.98,
      duration: 0.5,
      ease: "power3.in"
    });

    // 2. Liquid morph wipe upwards (colored in soft parchment)
    tl.to(path, {
      attr: { d: "M0 0 L100 0 L100 70 Q50 35 0 70 Z" },
      duration: 0.45,
      ease: "power2.in"
    }, "-=0.25");

    tl.to(path, {
      attr: { d: "M0 0 L100 0 L100 0 Q50 0 0 0 Z" },
      duration: 0.65,
      ease: "power4.out"
    });

    // 4. Hide overall container
    tl.to(container, {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.1
    }, "-=0.45");
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-99999 flex items-center justify-center bg-transparent"
    >
      {/* SVG Canvas to do liquid curves (Soft Parchment colored curtain) */}
      <svg 
        className="absolute inset-0 h-full w-full fill-[#F3F1ED] pointer-events-none"
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path 
          ref={pathRef}
          d="M0 0 L100 0 L100 100 Q50 100 0 100 Z" 
        />
      </svg>

      {/* Editorial loader text UI */}
      <div 
        ref={textContainerRef}
        className="relative z-10 flex flex-col items-center justify-center text-obsidian select-none"
      >
        {/* Classy Serif loader numerals */}
        <h1 
          ref={counterRef}
          className="text-8xl sm:text-[10rem] md:text-[13rem] font-serif font-light tracking-tighter text-obsidian/10 mb-2"
          style={{ lineHeight: 1 }}
        >
          {count.toString().padStart(3, '0')}
        </h1>
        
        {/* Rotating actions */}
        <div className="h-6 overflow-hidden flex flex-col items-center justify-center">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase text-accent-gold-dark">
            {words[wordIdx]}
          </span>
        </div>
        
        {/* Elegant Gold Progress Wireframe */}
        <div className="mt-8 w-28 h-px bg-obsidian/10 relative overflow-hidden rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-accent-gold"
            style={{ width: `${count}%`, transition: 'width 0.1s ease-out' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
