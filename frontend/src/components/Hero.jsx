import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';
import { ArrowDownRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const splitLetters = (text, className = "") => {
  return text.split("").map((char, index) => (
    <span 
      key={index} 
      className={`char-span inline-block ${className}`}
      style={{ 
        display: char === " " ? "inline" : "inline-block",
        transformOrigin: "center center 20px"
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const Hero = ({ isLoaded }) => {
  const scrollWrapperRef = useRef(null);      // h-[280vh] wrapper
  const pinContainerRef = useRef(null);       // h-screen relative pinned
  const heroSlideRef = useRef(null);          // Hero section z-10
  const transitionSlideRef = useRef(null);    // Transition section z-20 y-full
  const clipCardRef = useRef(null);           // Card container inside transition section
  const transitionLogoRef = useRef(null);     // Logo container inside card
  const transitionTextRef = useRef(null);     // Text overlay inside card

  // Hero refs for entrance animation
  const brandTitleRef = useRef(null);
  const tagLineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const bottomAuraRef = useRef(null);

  // 1. Entrance animation (runs once on load)
  useEffect(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline();

    const brandChars = brandTitleRef.current.querySelectorAll('.char-span');
    const tagChars = tagLineRef.current.querySelectorAll('.char-span');

    // Initial starting states for Hero elements
    gsap.set(brandChars, { 
      y: "140%", 
      rotateX: -70,
      scale: 0.8,
      opacity: 0 
    });
    gsap.set(tagChars, { 
      y: "100%", 
      opacity: 0 
    });
    gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
    gsap.set(ctaRef.current, { scale: 0.8, opacity: 0 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 20 });
    gsap.set(bottomAuraRef.current, {
      y: "120%",
      scaleY: 0.3,
      scaleX: 0.6,
      opacity: 0,
      transformOrigin: "bottom center"
    });

    tl.to(brandChars, {
      y: "0%",
      rotateX: 0,
      scale: 1,
      opacity: 1,
      duration: 1.45,
      stagger: 0.08,
      ease: "power4.out",
      delay: 0.15
    })
    .to(tagLineRef.current, {
      opacity: 1,
      duration: 0.5
    }, "-=0.9")
    .to(tagChars, {
      y: "0%",
      opacity: 1,
      duration: 0.85,
      stagger: 0.02,
      ease: "power3.out"
    }, "-=0.85")
    .to(bottomAuraRef.current, {
      y: "0%",
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      duration: 2.2,
      ease: "power3.out"
    }, "-=1.3")
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out"
    }, "-=1.4")
    .to(ctaRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.65,
      ease: "back.out(1.5)"
    }, "-=0.75")
    .to(scrollIndicatorRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, [isLoaded]);

  // 2. Scroll-triggered timeline (scrubbed coordinated page-up and clip-zoom)
  useEffect(() => {
    if (!isLoaded) return;

    const wrapper = scrollWrapperRef.current;
    const pinContainer = pinContainerRef.current;
    const transitionSlide = transitionSlideRef.current;
    const clipCard = clipCardRef.current;
    const transitionLogo = transitionLogoRef.current;
    const textEl = transitionTextRef.current;

    if (!wrapper || !pinContainer || !transitionSlide || !clipCard || !transitionLogo || !textEl) return;

    const fadeItems = textEl.querySelectorAll('.fade-item');

    // Create coordinated timeline using ScrollTrigger pin
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        pin: pinContainer,
        pinSpacing: true,
      }
    });

    // Phase 1: Slide-up the transition panel over the Hero
    scrollTl.fromTo(transitionSlide, 
      { y: '100%' },
      { y: '0%', ease: 'none', duration: 1, force3D: true }
    );

    // Phase 2: Zoom in the clip-card (inset card to full-screen)
    scrollTl.fromTo(clipCard, 
      { clipPath: 'inset(18% 22% 18% 22% round 24px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'none',
        duration: 1
      }, 
      '+=0.05'
    );

    // Zoom in and rotate the eye logo simultaneously with card zoom
    scrollTl.fromTo(transitionLogo, 
      { scale: 1.0, rotate: 0, opacity: 1 },
      { 
        scale: 45.0, 
        rotate: 360, 
        opacity: 0.0, 
        ease: 'power1.in', 
        duration: 1.0, 
        force3D: true 
      },
      '<'
    ); 

    // Stagger fade-in the text overlays near the end of zoom
    scrollTl.fromTo(fadeItems,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, stagger: 0.1, ease: 'power2.out', duration: 0.6, force3D: true },
      '-=0.45' 
    );

    return () => {
      if (scrollTl.scrollTrigger) scrollTl.scrollTrigger.kill();
      scrollTl.kill();
    };
  }, [isLoaded]);

  const handleScrollClick = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const target = document.querySelector(href);
    if (target && window.lenis) {
      window.lenis.scrollTo(target, { offset: -60, duration: 1.8 });
    }
  };

  return (
    <div 
      ref={scrollWrapperRef}
      id="hero"
      className="relative w-full h-[280vh] bg-transparent"
    >
      {/* Viewport Pinned Box */}
      <div 
        ref={pinContainerRef}
        className="w-full h-screen overflow-hidden relative bg-dark-bg"
      >
        
        {/* Layer 1: The Centered Hero Slide (z-10) */}
        <div 
          ref={heroSlideRef}
          className="absolute inset-0 flex flex-col justify-between px-6 pt-20 md:pt-24 pb-12 md:px-12 bg-transparent z-10"
        >
          {/* Glowing bottom aura (inspired by green image but in gold/champagne color scheme) */}
          <div 
            ref={bottomAuraRef}
            className="absolute bottom-0 left-0 right-0 h-[50vh] -z-10 pointer-events-none select-none"
          >
            {/* Main wide glow band */}
            <div className="absolute bottom-[-15vh] left-1/2 -translate-x-1/2 w-[140vw] sm:w-[120vw] h-[45vh] rounded-[100%] bg-linear-to-t from-dark-bg via-accent-green/45 to-accent-green/0 blur-[130px] opacity-95" />
            {/* Left corner accent glow */}
            <div className="absolute bottom-[-10vh] left-[5%] w-[60vw] h-[35vh] rounded-full bg-accent-green/25 blur-[130px] opacity-85" />
            {/* Right corner accent glow */}
            <div className="absolute bottom-[-10vh] right-[5%] w-[60vw] h-[35vh] rounded-full bg-accent-green/25 blur-[130px] opacity-85" />
          </div>
          {/* Grid background in light mode */}
          <div className="absolute inset-0 -z-20 bg-grid-pattern-light opacity-25 pointer-events-none" />

          {/* Symmetrical Typography */}
          <div className="my-auto max-w-4xl mx-auto flex flex-col items-center text-center select-none">
            <div ref={tagLineRef} className="overflow-hidden mb-4 opacity-0">
              <span className="text-xs md:text-sm font-sans font-bold tracking-[0.4em] uppercase text-accent-green">
                {splitLetters("CREATIVE DIRECTION & HIGH-END ENGINEERING")}
              </span>
            </div>

            <div className="overflow-hidden mb-6" style={{ perspective: "1200px" }}>
              <h1 
                ref={brandTitleRef}
                className="text-[20vw] sm:text-[17vw] md:text-[14vw] font-serif font-black leading-[0.8] tracking-wider uppercase text-obsidian select-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                {splitLetters("VISN")}
              </h1>
            </div>

            <p 
              ref={subtitleRef}
              className="max-w-2xl text-xl md:text-2xl lg:text-3xl leading-relaxed text-obsidian/85 font-serif italic font-light tracking-widest px-4"
            >
              Design. Engineering. Growth.
            </p>

            <div ref={ctaRef} className="mt-10 flex flex-col items-center gap-3">
              <Magnetic strength={0.25} range={55}>
                <a 
                  href="#contact"
                  onClick={handleScrollClick}
                  className="group flex h-16 w-16 items-center justify-center rounded-full bg-dark-bg text-obsidian hover:bg-accent-green hover:text-white hover:shadow-[0_10px_25px_rgba(16,185,129,0.35)] transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow,opacity] duration-300 cursor-none"
                  data-cursor="magnetic"
                >
                  <ArrowDownRight className="h-6 w-6 group-hover:rotate-45 transition-transform duration-300" />
                </a>
              </Magnetic>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-obsidian/60">
                Start a Project
              </span>
            </div>
          </div>

          {/* Bottom Row */}
          <div 
            ref={scrollIndicatorRef}
            className="flex w-full justify-center max-w-6xl mx-auto"
          >
            <a 
              href="#why-visn"
              onClick={handleScrollClick}
              className="group flex items-center gap-3 text-xs font-bold tracking-[0.3em] uppercase text-obsidian/50 hover:text-accent-green transition-colors cursor-none"
            >
              SCROLL TO DISCOVER
              <span className="inline-block animate-bounce text-accent-green font-black">↓</span>
            </a>
          </div>
        </div>

        {/* Layer 2: The Transition Zoom Slide (z-20) */}
        <div 
          ref={transitionSlideRef}
          className="absolute inset-0 z-20 bg-dark-bg overflow-hidden"
          style={{ 
            transform: 'translateY(100%)',
            willChange: 'transform' 
          }}
        >
          {/* Subtle grid pattern inside transition container */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

          {/* Card shadow wrapper using filter to follow clip-path shape */}
          <div className="absolute inset-0 w-full h-full filter drop-shadow-[0_22px_50px_rgba(21,21,21,0.14)]">
            {/* Centered card that expands via clip-path */}
            <div 
              ref={clipCardRef}
              className="absolute inset-0 w-full h-full overflow-hidden bg-linear-to-tr from-dark-card via-dark-card to-dark-bg"
              style={{ 
                clipPath: 'inset(18% 22% 18% 22% round 24px)',
                willChange: 'clip-path'
              }}
            >
              {/* Luxury green radial glow ornament */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-accent-green/18 blur-[120px] pointer-events-none" />

              {/* Symmetrical Luxury Grid Content / Logo Container */}
              <div 
                ref={transitionLogoRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10"
                style={{
                  transformOrigin: 'center center',
                  willChange: 'transform'
                }}
              >
                <svg 
                  className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] text-white" 
                  viewBox="0 0 100 100" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    filter: "drop-shadow(0 0 35px rgba(16, 185, 129, 0.45))",
                  }}
                >
                  {/* Outer Green Orbit */}
                  <circle cx="50" cy="50" r="44" stroke="#10B981" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6" />
                  
                  {/* Precision Axis Lines */}
                  <line x1="50" y1="6" x2="50" y2="94" stroke="#10B981" strokeWidth="0.25" strokeDasharray="1 2" opacity="0.35" />
                  <line x1="6" y1="50" x2="94" y2="50" stroke="#10B981" strokeWidth="0.25" strokeDasharray="1 2" opacity="0.35" />

                  {/* Symmetrical Outer Lens (The Eye) */}
                  <path d="M 22 50 C 37 25, 63 25, 78 50 C 63 75, 37 75, 22 50 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  
                  {/* Secondary Inner Lens Path (Green Accent) */}
                  <path d="M 28 50 C 40 32, 60 32, 72 50 C 60 68, 40 68, 28 50 Z" stroke="#10B981" strokeWidth="0.75" opacity="0.8" />

                  {/* Iris Green Circle */}
                  <circle cx="50" cy="50" r="11" fill="#10B981" />

                  {/* Pupil (4-pointed star in current color) */}
                  <path d="M 50 43 L 52 48.5 L 57.5 50 L 52 51.5 L 50 57 L 48 51.5 L 42.5 50 L 48 48.5 Z" fill="currentColor" />
                </svg>
              </div>

              {/* Absolutely centered text elements to prevent alignment shifts */}
              <div 
                ref={transitionTextRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center text-center px-6 w-full max-w-2xl select-none"
              >
                <span className="fade-item text-[9px] font-sans font-bold tracking-[0.35em] text-accent-green uppercase mb-3 block">
                  [ SEC. 01 // MANIFESTO ]
                </span>
                <h2 className="fade-item text-3xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-white leading-[1.1] mb-4">
                  engineering tactile digital monuments
                </h2>
                <p className="fade-item text-xs font-sans font-light tracking-widest text-white/70 max-w-md uppercase">
                  Combining high-performance frontend logic with luxury design paradigms.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
