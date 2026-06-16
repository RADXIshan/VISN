import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const textEl = textRef.current;
    if (!dot || !ring) return;

    // Set initial offsets
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const setRingX = gsap.quickSetter(ring, "x", "px");
    const setRingY = gsap.quickSetter(ring, "y", "px");

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Smooth movement logic using GSAP ticker
    const ticker = () => {
      // Dot moves instantly with mouse
      setDotX(mouse.x);
      setDotY(mouse.y);

      // Ring follows with a lag (GSAP property getter to check current coordinates)
      const ringX = gsap.getProperty(ring, "x") || mouse.x;
      const ringY = gsap.getProperty(ring, "y") || mouse.y;
      
      const nextRingX = ringX + (mouse.x - ringX) * 0.15;
      const nextRingY = ringY + (mouse.y - ringY) * 0.15;
      
      setRingX(nextRingX);
      setRingY(nextRingY);
    };

    gsap.ticker.add(ticker);

    // Hover state management
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      const isClickable = e.target.closest('a, button, [role="button"], input, textarea, select');

      if (target) {
        const mode = target.getAttribute('data-cursor');
        
        if (mode === 'view') {
          setCursorText('VIEW');
          gsap.to(ring, { 
            width: 70, 
            height: 70, 
            backgroundColor: 'rgba(255, 255, 255, 1)', 
            borderColor: 'transparent',
            mixBlendMode: 'difference',
            duration: 0.3 
          });
          gsap.to(dot, { scale: 0, duration: 0.2 });
          gsap.to(textEl, { opacity: 1, scale: 1, color: '#000000', duration: 0.3 });
        } else if (mode === 'drag') {
          setCursorText('DRAG');
          gsap.to(ring, { 
            width: 70, 
            height: 70, 
            backgroundColor: 'rgba(255, 255, 255, 1)', 
            borderColor: 'transparent',
            mixBlendMode: 'difference',
            duration: 0.3 
          });
          gsap.to(dot, { scale: 0, duration: 0.2 });
          gsap.to(textEl, { opacity: 1, scale: 1, color: '#000000', duration: 0.3 });
        } else if (mode === 'magnetic') {
          gsap.to(ring, { 
            width: 44, 
            height: 44, 
            borderColor: '#00f0ff', 
            borderWidth: 2, 
            scale: 1.15,
            mixBlendMode: 'normal',
            duration: 0.3 
          });
          gsap.to(dot, { scale: 1.5, backgroundColor: '#00f0ff', duration: 0.2 });
        }
      } else if (isClickable) {
        gsap.to(ring, { 
          width: 40, 
          height: 40, 
          borderColor: '#00f0ff', 
          backgroundColor: 'rgba(0, 240, 255, 0.1)',
          scale: 1.1, 
          mixBlendMode: 'normal',
          duration: 0.25 
        });
        gsap.to(dot, { scale: 0.5, backgroundColor: '#00f0ff', duration: 0.2 });
      }
    };

    const handleMouseOut = (e) => {
      // If we are leaving the current hovered target
      const target = e.target.closest('[data-cursor]');
      const isClickable = e.target.closest('a, button, [role="button"], input, textarea, select');
      
      if (target || isClickable) {
        setCursorText('');
        gsap.to(ring, { 
          width: 28, 
          height: 28, 
          backgroundColor: 'transparent', 
          borderColor: 'rgba(255, 255, 255, 0.5)', 
          borderWidth: 1, 
          mixBlendMode: 'normal',
          scale: 1, 
          duration: 0.3 
        });
        gsap.to(dot, { scale: 1, backgroundColor: '#00f0ff', duration: 0.3 });
        gsap.to(textEl, { opacity: 0, scale: 0.5, duration: 0.2 });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Hide/Show when mouse leaves browser window
    const handleMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, scale: 0, duration: 0.3 });
    };
    const handleMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, scale: 1, duration: 0.3 });
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(ticker);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div className="custom-cursor pointer-events-none fixed top-0 left-0 z-9999 hidden md:block">
      {/* Outer Ring */}
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-transparent transition-[opacity,transform] duration-75 pointer-events-none"
        style={{ transform: 'translate3d(-50%, -50%, 0)' }}
      >
        <span 
          ref={textRef}
          className="text-[9px] font-extrabold tracking-widest text-black opacity-0 scale-50 font-sans"
        >
          {cursorText}
        </span>
      </div>
      
      {/* Inner Dot */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-accent-cyan transition-transform duration-75 pointer-events-none"
        style={{ transform: 'translate3d(-50%, -50%, 0)' }}
      />
    </div>
  );
};

export default CustomCursor;
