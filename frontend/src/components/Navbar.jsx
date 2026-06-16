import React, { useState, useEffect, useRef } from 'react';
import Magnetic from './Magnetic';
import gsap from 'gsap';

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const isFirstRender = useRef(true);

  // Scroll visibility handler for the header bar
  useEffect(() => {
    const handleScroll = () => {
      // If menu is open, keep navbar visible
      if (menuOpen) {
        setVisible(true);
        return;
      }
      
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 80) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false); // Scroll down
      } else {
        setVisible(true); // Scroll up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, menuOpen]);

  // Live ticking clock for SF time (America/Los_Angeles timezone)
  useEffect(() => {
    if (!menuOpen) return;
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [menuOpen]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const navItems = [
    { name: 'Manifesto', href: '#manifesto', num: '01', tag: 'Ideology' },
    { name: 'Services', href: '#services', num: '02', tag: 'Expertise' },
    { name: 'Projects', href: '#projects', num: '03', tag: 'Case Studies' },
    { name: 'Labs', href: '#playground', num: '04', tag: 'Experiments' },
    { name: 'Contact', href: '#contact', num: '05', tag: 'Inquiries' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      if (window.lenis) {
        // Stop scroll restriction first
        window.lenis.start();
        window.lenis.scrollTo(element, { offset: -60, duration: 1.5 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // GSAP animations for Menu Overlay open/close transition
  useEffect(() => {
    const overlay = document.querySelector('#menu-overlay');
    const navLinks = document.querySelectorAll('.menu-nav-link');
    const metaItems = document.querySelectorAll('.menu-meta-item');
    const borderLines = document.querySelectorAll('.menu-border-line');

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Initialize hidden state via GSAP to avoid flashes
      gsap.set(overlay, { clipPath: 'circle(0% at calc(100% - 60px) 45px)', y: '0%', opacity: 1 });
      return;
    }

    if (menuOpen) {
      // Lock Lenis scroll
      if (window.lenis) {
        window.lenis.stop();
      }

      const tl = gsap.timeline();

      // Ensure menu starts from correct closed position before animating in
      gsap.killTweensOf([overlay, navLinks, metaItems, borderLines]);

      tl.to(overlay, {
        clipPath: 'circle(150% at calc(100% - 60px) 45px)',
        duration: 0.95,
        ease: 'power3.inOut',
      });

      tl.fromTo(navLinks,
        { y: 60, opacity: 0, rotateX: -15 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.75, stagger: 0.06, ease: 'power3.out' },
        '-=0.65'
      );

      tl.fromTo(borderLines,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, stagger: 0.05, ease: 'power3.inOut' },
        '-=0.75'
      );

      tl.fromTo(metaItems,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' },
        '-=0.55'
      );
    } else {
      // Release Lenis scroll
      if (window.lenis) {
        window.lenis.start();
      }

      const tl = gsap.timeline();

      gsap.killTweensOf([overlay, navLinks, metaItems, borderLines]);

      tl.to(metaItems, {
        y: 15,
        opacity: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: 'power2.in'
      });

      tl.to(borderLines, {
        scaleX: 0,
        duration: 0.35,
        stagger: 0.02,
        ease: 'power2.inOut'
      }, '-=0.2');

      tl.to(navLinks, {
        y: -30,
        opacity: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: 'power2.in'
      }, '-=0.25');

      tl.to(overlay, {
        clipPath: 'circle(0% at calc(100% - 60px) 45px)',
        duration: 0.75,
        ease: 'power3.inOut'
      }, '-=0.2');
    }
  }, [menuOpen]);

  return (
    <>
      {/* Borderless navbar row containing ONLY logo & menu toggle */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-12 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          {/* Creative Serif Logo */}
          <Magnetic strength={0.3} range={50}>
            <a 
              href="#hero" 
              onClick={(e) => handleNavClick(e, '#hero')}
              className={`flex items-center text-2xl font-serif font-bold tracking-wider group select-none relative z-50 transition-colors duration-500 ${
                menuOpen ? 'text-dark-bg' : 'text-obsidian'
              }`}
              data-cursor="magnetic"
            >
              VISN<span className="text-accent-gold group-hover:animate-pulse inline-block ml-0.5 select-none font-bold">.</span>
            </a>
          </Magnetic>

          {/* Action pill triggers */}
          <div className="flex items-center gap-4 relative z-50">
            {/* Magnetic Menu Toggle */}
            <Magnetic strength={0.2} range={35}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`px-5 py-2.5 rounded-full border flex items-center gap-3 cursor-none text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group overflow-hidden ${
                  menuOpen 
                    ? 'bg-dark-bg text-obsidian border-dark-bg shadow-inner' 
                    : 'border-obsidian/10 text-obsidian hover:bg-obsidian hover:text-dark-bg hover:border-obsidian'
                }`}
                data-cursor="magnetic"
              >
                {/* Custom animated lines */}
                <div className="flex flex-col justify-center items-center gap-1 w-3.5 h-3.5">
                  <span className={`block h-[1.2px] w-3.5 bg-current rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'rotate-45 translate-y-[2.6px]' : ''}`} />
                  <span className={`block h-[1.2px] w-3.5 bg-current rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? '-rotate-45 -translate-y-[2.6px]' : ''}`} />
                </div>
                
                {/* Text sliding label */}
                <span className="relative z-10 flex h-3 overflow-hidden">
                  <span className={`transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? '-translate-y-full' : 'translate-y-0'}`}>
                    MENU
                  </span>
                  <span className={`absolute left-0 transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    CLOSE
                  </span>
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* Redesigned Luxury Dark Menu Overlay */}
      <div 
        id="menu-overlay"
        className={`fixed inset-0 z-40 bg-obsidian flex flex-col justify-between pt-32 pb-12 px-6 md:px-16 overflow-y-auto pointer-events-none`}
        style={{ clipPath: 'circle(0% at calc(100% - 60px) 45px)' }}
      >
        {/* Dynamic decorative luxury glow orb in background */}
        <div className="absolute top-[25%] left-[25%] -z-10 h-[500px] w-[500px] rounded-full bg-accent-gold/5 blur-[120px] pointer-events-none" />

        {/* Content Grid */}
        <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative z-10">
          
          {/* Left Panel: Luxury serif Navigation Links */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center">
            <span className="menu-meta-item text-[8px] font-bold tracking-[0.35em] uppercase text-accent-gold mb-4 block">
              [ INDEX DIRECTORY ]
            </span>
            <div className="flex flex-col w-full">
              {navItems.map((item, index) => (
                <div key={item.name} className="overflow-hidden w-full relative">
                  {/* Underline line animation */}
                  <div className="menu-border-line absolute bottom-0 left-0 w-full h-[1px] bg-dark-bg/10 origin-left" />
                  
                  <a 
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="menu-nav-link group flex items-baseline py-4 md:py-6 cursor-none w-full text-left"
                    data-cursor="magnetic"
                    style={{ perspective: "1000px" }}
                  >
                    {/* Double-digit indicator */}
                    <span className="text-[10px] font-mono tracking-widest text-dark-bg/35 mr-4 md:mr-6 group-hover:text-accent-gold transition-colors duration-300">
                      {item.num}
                    </span>
                    
                    {/* Big luxury serif text */}
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-dark-bg/90 group-hover:text-accent-gold group-hover:italic transition-all duration-300 transform group-hover:translate-x-2 inline-block">
                      {item.name}
                    </span>
                    
                    {/* Micro-hover tag reveal */}
                    <span className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[8px] font-bold tracking-[0.25em] text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-full uppercase ml-4 md:ml-6 relative -top-1 sm:-top-2 select-none">
                      {item.tag}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Metadata & Interactive Directory Preview */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-center gap-10 lg:pl-10 border-t lg:border-t-0 lg:border-l border-dark-bg/10 pt-10 lg:pt-0">
            
            {/* Interactive Preview Box */}
            <div className="menu-meta-item hidden lg:block relative h-48 w-full rounded-2xl border border-dark-bg/10 bg-dark-bg/[0.02] overflow-hidden">
              {/* Idle State */}
              <div className={`absolute inset-0 p-5 flex flex-col justify-between transition-opacity duration-300 ${hoveredIndex === null ? 'opacity-100' : 'opacity-0'}`}>
                <div>
                  <span className="text-[8px] font-bold tracking-widest text-accent-gold uppercase block mb-1">
                    CURRENT STATUS
                  </span>
                  <h4 className="text-sm font-semibold text-dark-bg">VISN Studio — Design & Engineering</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-dark-bg/40 font-light">
                  Hover over the index directory links on the left to preview our focus points and design segments.
                </p>
              </div>

              {/* Manifesto preview */}
              <div className={`absolute inset-0 p-5 flex flex-col justify-between transition-all duration-500 transform ${hoveredIndex === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div>
                  <span className="text-[8px] font-bold tracking-widest text-accent-gold uppercase block mb-1">
                    01 // ETHOS
                  </span>
                  <h4 className="text-sm font-semibold text-dark-bg">We Build Digital Monuments</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-dark-bg/65 font-light">
                  Discarding boring templates to craft interactive web experiences that blend extreme styling with bold art.
                </p>
              </div>

              {/* Services preview */}
              <div className={`absolute inset-0 p-5 flex flex-col justify-between transition-all duration-500 transform ${hoveredIndex === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div>
                  <span className="text-[8px] font-bold tracking-widest text-accent-gold uppercase block mb-1">
                    02 // EXPERTISE
                  </span>
                  <h4 className="text-sm font-semibold text-dark-bg">Engineering & Creative Systems</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-dark-bg/65 font-light">
                  WebGL particle fields, high-performance logic, and tactile layout structures engineered to elevate premium products.
                </p>
              </div>

              {/* Projects preview */}
              <div className={`absolute inset-0 p-5 flex flex-col justify-between transition-all duration-500 transform ${hoveredIndex === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div>
                  <span className="text-[8px] font-bold tracking-widest text-accent-gold uppercase block mb-1">
                    03 // ARCHIVE
                  </span>
                  <h4 className="text-sm font-semibold text-dark-bg">Case Studies & Curation</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-dark-bg/65 font-light">
                  A premium collection of high-fidelity digital interfaces, luxury portfolios, and campaign narratives.
                </p>
              </div>

              {/* Labs preview */}
              <div className={`absolute inset-0 p-5 flex flex-col justify-between transition-all duration-500 transform ${hoveredIndex === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div>
                  <span className="text-[8px] font-bold tracking-widest text-accent-gold uppercase block mb-1">
                    04 // EXPERIMENTS
                  </span>
                  <h4 className="text-sm font-semibold text-dark-bg">Creative Playground</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-dark-bg/65 font-light">
                  Where math, physics, canvas rendering, and interaction collide. Interactive canvas modules and prototypes.
                </p>
              </div>

              {/* Contact preview */}
              <div className={`absolute inset-0 p-5 flex flex-col justify-between transition-all duration-500 transform ${hoveredIndex === 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div>
                  <span className="text-[8px] font-bold tracking-widest text-accent-gold uppercase block mb-1">
                    05 // INQUIRY
                  </span>
                  <h4 className="text-sm font-semibold text-dark-bg">Construct Your Monument</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-dark-bg/65 font-light">
                  Let's partner. Selectively scheduling engagements for Late Q3 / Q4 2026. Accept design & code inquiries.
                </p>
              </div>
            </div>

            {/* Live Clock Widget */}
            <div className="menu-meta-item">
              <span className="text-[9px] font-bold tracking-[0.3em] text-dark-bg/40 uppercase mb-2 block">
                STUDIO LOCAL TIME // SF
              </span>
              <p className="text-2xl font-serif font-light text-dark-bg tracking-wide">
                {formatTime(time)} <span className="text-xs font-sans font-bold text-accent-gold ml-1">PST</span>
              </p>
            </div>

            {/* Availability Box */}
            <div className="menu-meta-item p-5 rounded-2xl border border-dark-bg/10 bg-dark-bg/[0.015] flex items-start gap-4">
              <span className="relative flex h-2 w-2 mt-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <div>
                <span className="text-[9px] font-bold tracking-widest text-dark-bg/50 uppercase block mb-1">
                  AVAILABILITY STATUS
                </span>
                <p className="text-[11px] leading-relaxed text-dark-bg/60 font-light">
                  Accepting design and frontend inquiries. Scheduled consultations open for late Q3 / Q4 2026.
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="menu-meta-item">
              <span className="text-[9px] font-bold tracking-[0.3em] text-dark-bg/40 uppercase mb-2.5 block">
                INQUIRIES & DEPT
              </span>
              <a 
                href="mailto:hello@visn.studio"
                className="text-base font-semibold text-dark-bg hover:text-accent-gold transition-colors duration-300 border-b border-dark-bg/15 pb-0.5 cursor-none"
              >
                hello@visn.studio
              </a>
              <p className="text-[11px] text-dark-bg/40 mt-2 font-light">
                San Francisco, California.
              </p>
            </div>

            {/* Social Links */}
            <div className="menu-meta-item">
              <span className="text-[9px] font-bold tracking-[0.3em] text-dark-bg/40 uppercase mb-3 block">
                CONNECTIVITY
              </span>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: 'Instagram', href: '#' },
                  { name: 'LinkedIn', href: '#' },
                  { name: 'Behance', href: '#' },
                  { name: 'Twitter', href: '#' }
                ].map((social) => (
                  <Magnetic key={social.name} strength={0.15} range={20}>
                    <a 
                      href={social.href}
                      className="px-3.5 py-1.5 rounded-full border border-dark-bg/15 text-[8px] font-bold tracking-widest uppercase text-dark-bg/75 hover:bg-dark-bg hover:text-obsidian hover:border-dark-bg transition-all duration-300 cursor-none"
                    >
                      {social.name}
                    </a>
                  </Magnetic>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Row in Menu Overlay */}
        <div className="menu-meta-item w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between border-t border-dark-bg/10 pt-6 mt-8 text-[9px] font-mono text-dark-bg/35 tracking-wider gap-4">
          <p>© 2026 VISN. ALL RIGHTS RESERVED.</p>
          <p>37.7749° N, 122.4194° W</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
