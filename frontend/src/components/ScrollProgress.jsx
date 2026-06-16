import React, { useEffect, useState } from 'react';

const sections = [
  { id: 'hero', num: '01', name: 'INTRO' },
  { id: 'manifesto', num: '02', name: 'MANIFESTO' },
  { id: 'projects', num: '03', name: 'PORTFOLIO' },
  { id: 'services', num: '04', name: 'SERVICES' },
  { id: 'playground', num: '05', name: 'LABS' },
  { id: 'contact', num: '06', name: 'CONTACT' }
];

const ScrollProgress = () => {
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate overall scroll percentage
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollHeight > 0) {
        setProgress(window.scrollY / totalScrollHeight);
      }

      // 2. Locate active viewport section
      let currentActive = sections[0];
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Active threshold is if section top reaches 45% height of window
          if (rect.top <= window.innerHeight * 0.45) {
            currentActive = sec;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially to calibrate positions
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-4 select-none pointer-events-none">
      {/* Editorial active section number */}
      <span className="text-[11px] font-serif italic text-accent-gold-dark font-medium leading-none transition-all duration-300">
        {activeSection.num}
      </span>
      
      {/* Thin baseline line with sliding progress marker */}
      <div className="h-28 w-px bg-obsidian/10 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full bg-accent-gold transition-transform duration-75"
          style={{ 
            height: '32px',
            transform: `translateY(${progress * (112 - 32)}px)` // scale bounds (112px height minus 32px bar height)
          }}
        />
      </div>

      {/* Rotating vertical text tracker */}
      <span 
        className="text-[7.5px] font-bold tracking-[0.3em] text-obsidian/35 uppercase mt-2 font-sans transition-all duration-300"
        style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
      >
        {activeSection.name}
      </span>
    </div>
  );
};

export default ScrollProgress;
