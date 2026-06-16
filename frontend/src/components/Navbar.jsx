import React, { useState, useEffect, useRef } from 'react';
import Magnetic from './Magnetic';
import gsap from 'gsap';

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrolled, setScrolled] = useState(typeof window !== 'undefined' ? window.scrollY > 20 : false);

  const isFirstRender = useRef(true);
  const buttonRef = useRef(null);

  const getButtonCenter = () => {
    if (!buttonRef.current) return { x: window.innerWidth - 60, y: 45 };
    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    return { x, y };
  };

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

      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
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
    { name: 'Contact', href: '#contact', num: '04', tag: 'Inquiries' },
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

    const { x, y } = getButtonCenter();

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Initialize hidden state via GSAP to avoid flashes
      gsap.set(overlay, { clipPath: `circle(0% at ${x}px ${y}px)`, y: '0%', opacity: 1 });
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
        clipPath: `circle(150% at ${x}px ${y}px)`,
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
        clipPath: `circle(0% at ${x}px ${y}px)`,
        duration: 0.75,
        ease: 'power3.inOut'
      }, '-=0.2');
    }
  }, [menuOpen]);

  return (
    <>
      {/* Borderless navbar row containing ONLY logo & menu toggle */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled && !menuOpen 
            ? 'bg-dark-bg/75 backdrop-blur-md border-b border-obsidian/[0.03] shadow-[0_4px_30px_rgba(0,0,0,0.01)]' 
            : 'bg-transparent'
        }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Creative Serif Logo */}
          <Magnetic strength={0.3} range={50}>
            <a 
              href="#hero" 
              onClick={(e) => handleNavClick(e, '#hero')}
              className={`flex items-center text-2xl font-serif font-bold tracking-wider group select-none relative z-50 transition-colors duration-500 pb-1 ${
                menuOpen ? 'text-dark-bg' : 'text-obsidian'
              }`}
              data-cursor="magnetic"
            >
              VISN
              <span className="text-accent-gold group-hover:animate-pulse inline-block ml-0.5 select-none font-bold">.</span>
              <span className={`absolute left-1/2 bottom-0 w-0 h-[1.5px] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full ${
                menuOpen ? 'bg-dark-bg' : 'bg-accent-gold'
              }`} />
            </a>
          </Magnetic>

          {/* Action pill triggers */}
          <div className="flex items-center gap-4 relative z-50">
            {/* Magnetic Menu Toggle */}
            <Magnetic strength={0.2} range={35}>
              <button
                ref={buttonRef}
                onClick={() => setMenuOpen(!menuOpen)}
                className={`px-5 py-2.5 rounded-full border flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative group overflow-hidden ${
                  menuOpen 
                    ? 'bg-dark-bg text-obsidian border-dark-bg shadow-inner' 
                    : 'border-obsidian/10 text-obsidian hover:text-dark-bg hover:border-accent-gold'
                }`}
                data-cursor="magnetic"
              >
                {/* Radial golden background fill on hover (only when closed) */}
                {!menuOpen && (
                  <span className="absolute top-1/2 left-1/2 w-[150%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-gold scale-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 -z-0" />
                )}

                {/* Custom animated lines */}
                <div className="relative z-10 flex flex-col justify-center items-center gap-1 w-3.5 h-3.5">
                  <span className={`block h-[1.2px] w-3.5 bg-current rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'rotate-45 translate-y-[2.6px]' : ''}`} />
                  <span className={`block h-[1.2px] w-3.5 bg-current rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? '-rotate-45 -translate-y-[2.6px]' : ''}`} />
                </div>
                
                {/* Text sliding label */}
                <span className="relative z-10 block h-3 w-14 overflow-hidden text-left">
                  <span className={`absolute left-0 top-0 transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? '-translate-y-full' : 'translate-y-0'}`}>
                    MENU
                  </span>
                  <span className={`absolute left-0 top-0 transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
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
        className={`fixed inset-0 z-40 bg-obsidian flex items-center justify-center px-6 md:px-16 overflow-y-auto ${
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{ clipPath: 'circle(0% at 100% 0%)' }}
      >
        {/* Dynamic decorative luxury glow orb in background */}
        <div className="absolute top-[25%] left-[25%] -z-10 h-[500px] w-[500px] rounded-full bg-accent-gold/5 blur-[120px] pointer-events-none" />

        {/* Content Grid */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative z-10 py-16 md:py-24">
          
          {/* Left Panel: Luxury serif Navigation Links */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center">
            <span className="menu-meta-item text-[8px] font-bold tracking-[0.35em] uppercase text-accent-gold mb-6 block">
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
                    className="menu-nav-link group flex items-baseline py-4 md:py-6 w-full text-left"
                    data-cursor="magnetic"
                    style={{ perspective: "1000px" }}
                  >
                    {/* Double-digit indicator */}
                    <span className="text-[10px] font-mono tracking-widest text-dark-bg/35 mr-4 md:mr-6 group-hover:text-accent-gold transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      {item.num}
                    </span>
                    
                    {/* Big luxury serif text (Italicized spacing expansion) */}
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-dark-bg/90 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-accent-gold group-hover:tracking-wider transform group-hover:translate-x-3 inline-block">
                      {item.name}
                    </span>
                    
                    {/* Micro-hover tag reveal */}
                    <span className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-[8px] font-bold tracking-[0.25em] text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-full uppercase ml-4 md:ml-6 relative -top-1 sm:-top-2 select-none">
                      {item.tag}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Clean Contacts & Links with lots of whitespace */}
          <div className="col-span-1 lg:col-span-4 lg:col-start-9 flex flex-col justify-center gap-14 lg:pl-12 border-t lg:border-t-0 lg:border-l border-dark-bg/10 pt-10 lg:pt-0">
            {/* Contact Details */}
            <div className="menu-meta-item">
              <span className="text-[9px] font-bold tracking-[0.3em] text-dark-bg/40 uppercase mb-3 block">
                INQUIRIES
              </span>
              <a 
                href="mailto:hello@visn.studio"
                className="relative text-2xl font-serif font-light text-dark-bg hover:text-accent-gold transition-colors duration-300 pb-1 group/mail inline-block"
              >
                hello@visn.studio
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-accent-gold scale-x-0 origin-left transition-transform duration-300 ease-out group-hover/mail:scale-x-100" />
              </a>
              <p className="text-[11px] text-dark-bg/40 mt-2 font-light">
                San Francisco, California.
              </p>
            </div>

            {/* Social Links */}
            <div className="menu-meta-item">
              <span className="text-[9px] font-bold tracking-[0.3em] text-dark-bg/40 uppercase mb-4 block">
                CONNECTIVITY
              </span>
              <div className="flex flex-col gap-3 items-start">
                {[
                  { name: 'Instagram', href: '#' },
                  { name: 'LinkedIn', href: '#' },
                  { name: 'Behance', href: '#' },
                  { name: 'Twitter', href: '#' }
                ].map((social) => (
                  <Magnetic key={social.name} strength={0.15} range={20}>
                    <a 
                      href={social.href}
                      className="relative text-xs font-serif font-light tracking-wide text-dark-bg/75 hover:text-accent-gold transition-colors duration-300 pb-0.5 group/social"
                    >
                      {social.name}
                      <span className="absolute left-0 bottom-0 w-full h-[1px] bg-accent-gold scale-x-0 origin-left transition-transform duration-300 ease-out group-hover/social:scale-x-100" />
                    </a>
                  </Magnetic>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
