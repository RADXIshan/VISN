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
        transformOrigin: "center center 20px",
        willChange: "transform, opacity"
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
  const transitionImgRef = useRef(null);      // Image inside card
  const transitionTextRef = useRef(null);     // Text overlay inside card

  // Hero refs for entrance animation
  const brandTitleRef = useRef(null);
  const tagLineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

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
    gsap.set(badgeRef.current, { opacity: 0, y: -20 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 20 });

    tl.to(badgeRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.15
    })
    .to(brandChars, {
      y: "0%",
      rotateX: 0,
      scale: 1,
      opacity: 1,
      duration: 1.45,
      stagger: 0.08,
      ease: "power4.out"
    }, "-=0.6")
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
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out"
    }, "-=0.65")
    .to(ctaRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.65,
      ease: "back.out(1.5)"
    }, "-=0.5")
    .to(scrollIndicatorRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");

  }, [isLoaded]);

  // 2. Scroll-triggered timeline (scrubbed coordinated page-up and clip-zoom)
  useEffect(() => {
    if (!isLoaded) return;

    const wrapper = scrollWrapperRef.current;
    const pinContainer = pinContainerRef.current;
    const transitionSlide = transitionSlideRef.current;
    const clipCard = clipCardRef.current;
    const transitionImg = transitionImgRef.current;
    const textEl = transitionTextRef.current;

    if (!wrapper || !pinContainer || !transitionSlide || !clipCard || !transitionImg || !textEl) return;

    const fadeItems = textEl.querySelectorAll('.fade-item');

    // Create coordinated timeline using ScrollTrigger pin
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: pinContainer,
        pinSpacing: true,
      }
    });

    // Phase 1: Slide-up the transition panel over the Hero
    scrollTl.fromTo(transitionSlide, 
      { y: '100%' },
      { y: '0%', ease: 'none', duration: 1 }
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

    // Counter-scale the image simultaneously with card zoom (parallax)
    scrollTl.fromTo(transitionImg, 
      { scale: 1.25 },
      { scale: 1.0, ease: 'none', duration: 1 },
      '<'
    ); 

    // Stagger fade-in the text overlays near the end of zoom
    scrollTl.fromTo(fadeItems,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, stagger: 0.1, ease: 'power2.out', duration: 0.6 },
      '-=0.45' 
    );

    return () => {
      if (scrollTl.scrollTrigger) scrollTl.scrollTrigger.kill();
      scrollTl.kill();
    };
  }, [isLoaded]);

  const handleScrollClick = (e) => {
    e.preventDefault();
    const target = document.querySelector('#contact');
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
        className="w-full h-screen overflow-hidden relative"
      >
        
        {/* Layer 1: The Centered Hero Slide (z-10) */}
        <div 
          ref={heroSlideRef}
          className="absolute inset-0 flex flex-col justify-between px-6 pt-36 pb-12 md:px-12 bg-transparent z-10"
        >
          {/* Champagne Glow */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-gold/5 blur-[130px] pointer-events-none" />
          {/* Grid background */}
          <div className="absolute inset-0 -z-20 bg-grid-pattern opacity-45 pointer-events-none" />

          {/* Top Row */}
          <div ref={badgeRef} className="w-full flex justify-center items-center">
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-obsidian/5 bg-obsidian/1">
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75] animate-pulse" />
              <span className="text-[9px] font-bold tracking-[0.32em] text-obsidian/60 uppercase select-none">
                VISN STUDIO // EDITION 2026
              </span>
            </div>
          </div>

          {/* Symmetrical Typography */}
          <div className="my-auto max-w-4xl mx-auto flex flex-col items-center text-center select-none">
            <div ref={tagLineRef} className="overflow-hidden mb-4 opacity-0">
              <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.4em] uppercase text-accent-gold">
                {splitLetters("CREATIVE DIRECTION & HIGH-END ENGINEERING")}
              </span>
            </div>

            <div className="overflow-hidden mb-6" style={{ perspective: "1200px" }}>
              <h1 
                ref={brandTitleRef}
                className="text-[18vw] sm:text-[15vw] md:text-[12vw] font-serif font-black leading-[0.8] tracking-wider uppercase text-obsidian select-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                {splitLetters("VISN")}
              </h1>
            </div>

            <p 
              ref={subtitleRef}
              className="max-w-2xl text-lg md:text-xl lg:text-2xl leading-relaxed text-obsidian/75 font-serif italic font-light tracking-wide px-4"
            >
              We translate complex logic into graceful digital experiences, custom high-performance interfaces, and branding systems that elevate products into pieces of luxury.
            </p>

            <div ref={ctaRef} className="mt-10 flex flex-col items-center gap-3">
              <Magnetic strength={0.25} range={55}>
                <a 
                  href="#contact"
                  onClick={handleScrollClick}
                  className="group flex h-16 w-16 items-center justify-center rounded-full bg-obsidian text-dark-bg hover:bg-accent-gold hover:text-white hover:shadow-[0_10px_25px_rgba(181,155,117,0.35)] transition-all duration-300 cursor-none"
                  data-cursor="magnetic"
                >
                  <ArrowDownRight className="h-6 w-6 group-hover:rotate-45 transition-transform duration-300" />
                </a>
              </Magnetic>
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-obsidian/50">
                Start a Project
              </span>
            </div>
          </div>

          {/* Bottom Row */}
          <div 
            ref={scrollIndicatorRef}
            className="flex w-full flex-col md:flex-row items-center justify-between gap-6 border-t border-obsidian/10 pt-8 max-w-6xl mx-auto"
          >
            <div className="flex justify-center gap-16 text-obsidian/50 select-none text-center md:text-left">
              <div>
                <p className="text-[9px] font-bold tracking-widest text-obsidian/40 uppercase">Focus Area</p>
                <p className="text-xs font-semibold text-obsidian mt-1 font-serif italic">Digital Engineering & Art</p>
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-widest text-obsidian/40 uppercase">Awards</p>
                <p className="text-xs font-semibold text-obsidian mt-1 font-serif italic">CSS Design nominee '26</p>
              </div>
            </div>

            <a 
              href="#manifesto"
              onClick={handleScrollClick}
              className="group flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-obsidian/50 hover:text-accent-gold-dark transition-colors cursor-none"
            >
              SCROLL TO DISCOVER
              <span className="inline-block animate-bounce text-accent-gold-dark font-black">↓</span>
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
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ 
                clipPath: 'inset(18% 22% 18% 22% round 24px)',
                willChange: 'clip-path'
              }}
            >
              {/* Transition Image asset - fits full screen perfectly, no layout shifts */}
              <img 
                ref={transitionImgRef}
                src="/hero-transition.png" 
                alt="VISN Transition" 
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                style={{ 
                  transform: 'scale(1.25)',
                  transformOrigin: 'center center',
                  willChange: 'transform'
                }}
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-obsidian/30 mix-blend-multiply z-10" />

              {/* Absolutely centered text elements to prevent alignment shifts */}
              <div 
                ref={transitionTextRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center text-center px-6 w-full max-w-2xl select-none"
              >
                <span className="fade-item text-[9px] font-sans font-bold tracking-[0.35em] text-accent-gold uppercase mb-3 block">
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
