import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const textContainerRef = useRef(null);
  const counterRef = useRef(null);
  
  const words = [
    "DECODING IMAGINATION",
    "ENGINEERING ART",
    "AMPLIFYING VISION",
    "SCULPTING DIGITAL",
    "VISN STUDIO"
  ];
  const [wordIdx, setWordIdx] = useState(0);

  // Cycle through creative action verbs/statements
  useEffect(() => {
    if (count >= 100) return;
    const interval = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % words.length);
    }, 450);
    return () => clearInterval(interval);
  }, [count]);

  // Animate values up from 0 to 100
  useEffect(() => {
    const loaderObj = { val: 0 };
    gsap.to(loaderObj, {
      val: 100,
      duration: 2.5,
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

    // 1. Shrink and push typography out of screen
    tl.to(textContainer, {
      opacity: 0,
      y: -80,
      scale: 0.95,
      duration: 0.5,
      ease: "power3.in"
    });

    // 2. Animate bottom of SVG up, bending curve (elastic liquid look)
    tl.to(path, {
      attr: { d: "M0 0 L100 0 L100 70 Q50 35 0 70 Z" },
      duration: 0.4,
      ease: "power2.in"
    }, "-=0.25");

    // 3. Complete slide-out to zero height
    tl.to(path, {
      attr: { d: "M0 0 L100 0 L100 0 Q50 0 0 0 Z" },
      duration: 0.6,
      ease: "power4.out"
    });

    // 4. Hide overall preloader container
    tl.to(container, {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.1
    }, "-=0.4");
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-99999 flex items-center justify-center bg-transparent"
    >
      {/* SVG Canvas to do liquid curves */}
      <svg 
        className="absolute inset-0 h-full w-full fill-[#070707] pointer-events-none"
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path 
          ref={pathRef}
          d="M0 0 L100 0 L100 100 Q50 100 0 100 Z" 
        />
      </svg>

      {/* Main loading typography */}
      <div 
        ref={textContainerRef}
        className="relative z-10 flex flex-col items-center justify-center text-white select-none"
      >
        {/* Loading percentage text */}
        <h1 
          ref={counterRef}
          className="text-8xl sm:text-[10rem] md:text-[14rem] font-extrabold tracking-tighter font-display text-stroke mb-4 text-glow-cyan text-white/5"
          style={{ lineHeight: 1 }}
        >
          {count.toString().padStart(3, '0')}
        </h1>
        
        {/* Rotating actions */}
        <div className="h-6 overflow-hidden flex flex-col items-center justify-center">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-accent-cyan text-glow-cyan">
            {words[wordIdx]}
          </span>
        </div>
        
        {/* Sleek loading wireframe */}
        <div className="mt-8 w-32 h-px bg-white/10 relative overflow-hidden rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-accent-cyan text-glow-cyan shadow-[0_0_8px_#00f0ff]"
            style={{ width: `${count}%`, transition: 'width 0.1s ease-out' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
