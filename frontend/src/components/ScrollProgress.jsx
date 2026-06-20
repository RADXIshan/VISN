import React, { useEffect, useState } from 'react';

const sections = [
  { id: 'hero', num: '01', name: 'INTRO' },
  { id: 'manifesto', num: '02', name: 'MANIFESTO' },
  { id: 'projects', num: '03', name: 'PORTFOLIO' },
  { id: 'services', num: '04', name: 'SERVICES' },
  { id: 'contact', num: '05', name: 'CONTACT' }
];

const ScrollProgress = () => {
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Calculate scroll progress percentage (lightweight scroll check)
    const handleScroll = () => {
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollHeight > 0) {
        setProgress(window.scrollY / totalScrollHeight);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Locate active viewport section using IntersectionObserver to avoid layout thrashing
    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px -55% 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sec = sections.find((s) => s.id === entry.target.id);
          if (sec) {
            setActiveSection(sec);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="fixed left-8 top-[44%] -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-4 select-none pointer-events-none">
      {/* Editorial active section number */}
      <span className={`text-[11px] font-serif italic font-medium leading-none transition-all duration-300 ${
        activeSection.id === 'projects' ? 'text-accent-gold' : 'text-accent-gold-dark'
      }`}>
        {activeSection.num}
      </span>
      
      {/* Thin baseline line with sliding progress marker */}
      <div className={`h-28 w-px transition-colors duration-300 ${
        activeSection.id === 'projects' ? 'bg-white/10' : 'bg-obsidian/10'
      } relative overflow-hidden`}>
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
        className={`text-[7.5px] font-bold tracking-[0.3em] uppercase mt-2 font-sans transition-all duration-300 ${
          activeSection.id === 'projects' ? 'text-white' : 'text-obsidian'
        }`}
        style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
      >
        {activeSection.name}
      </span>
    </div>
  );
};

export default ScrollProgress;
