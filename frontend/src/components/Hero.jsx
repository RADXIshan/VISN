import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Magnetic from './Magnetic';
import { ArrowDownRight } from 'lucide-react';

const Hero = ({ isLoaded }) => {
  const containerRef = useRef(null);
  const titleLine1Ref = useRef(null);
  const titleLine2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    if (!isLoaded) return;

    // Create entrance animation timeline
    const tl = gsap.timeline();

    // Set layout elements to starting positions
    gsap.set([titleLine1Ref.current, titleLine2Ref.current], { y: "110%" });
    gsap.set(subtitleRef.current, { opacity: 0, y: 35 });
    gsap.set(ctaRef.current, { scale: 0.8, opacity: 0 });
    gsap.set(badgeRef.current, { opacity: 0, x: -30 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 25 });

    tl.to([titleLine1Ref.current, titleLine2Ref.current], {
      y: "0%",
      duration: 1.3,
      stagger: 0.12,
      ease: "power4.out",
      delay: 0.3
    })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out"
    }, "-=0.75")
    .to(ctaRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.8)"
    }, "-=0.55")
    .to([badgeRef.current, scrollIndicatorRef.current], {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out"
    }, "-=0.5");

  }, [isLoaded]);

  const handleScrollClick = (e) => {
    e.preventDefault();
    const target = document.querySelector('#manifesto');
    if (target && window.lenis) {
      window.lenis.scrollTo(target, { offset: -60, duration: 1.5 });
    }
  };

  return (
    <section 
      ref={containerRef}
      id="hero"
      className="relative flex min-h-screen w-full flex-col justify-between px-6 pt-32 pb-10 md:px-12 bg-transparent overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute top-[35%] left-[50%] -z-10 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-purple/10 blur-[130px] pointer-events-none" />
      
      {/* Background grid */}
      <div className="absolute inset-0 -z-20 bg-grid-pattern opacity-[0.25] pointer-events-none" />

      {/* Top Section */}
      <div className="flex w-full items-start justify-between">
        <div ref={badgeRef} className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_8px_#00f0ff] animate-pulse" />
          <span className="text-[9px] font-bold tracking-[0.35em] text-neutral-400">
            VISN STUDIO // BEYOND DIGITAL CODE
          </span>
        </div>
        <div className="hidden sm:block text-right select-none">
          <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">SF CORP // 2026</p>
          <p className="text-[9px] font-mono text-neutral-500">40.7128° N, 74.0060° W</p>
        </div>
      </div>

      {/* Main Kinetic Typography Header */}
      <div className="my-auto max-w-5xl select-none">
        <div className="overflow-hidden mb-1">
          <h1 
            ref={titleLine1Ref}
            className="text-[9vw] sm:text-[8vw] md:text-[6.5vw] font-display font-black leading-[0.95] tracking-tighter uppercase text-white"
          >
            ARCHITECTS OF
          </h1>
        </div>
        <div className="overflow-hidden mb-6 md:mb-8">
          <h1 
            ref={titleLine2Ref}
            className="text-[10vw] sm:text-[9vw] md:text-[7vw] font-display font-black leading-[0.95] tracking-tighter uppercase text-stroke text-white/5 inline-flex items-center gap-3"
          >
            DIGITAL <span className="text-white text-stroke-glow text-glow-cyan">VISN</span>
          </h1>
        </div>

        {/* Descriptive Manifesto line */}
        <p 
          ref={subtitleRef}
          className="max-w-xl text-sm md:text-[17px] leading-relaxed text-neutral-400 font-light"
        >
          We engineer high-fidelity digital interfaces, interactive web experiences, and immersive branding setups that turn complex code into fluid visual art.
        </p>

        {/* Circular Action Loop */}
        <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-5">
          <Magnetic strength={0.25} range={55}>
            <a 
              href="#projects"
              onClick={handleScrollClick}
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-white text-black hover:bg-accent-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300 cursor-none"
              data-cursor="magnetic"
            >
              <ArrowDownRight className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
            </a>
          </Magnetic>
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-400">
            Explore Portfolio
          </span>
        </div>
      </div>

      {/* Bottom Grid stats */}
      <div 
        ref={scrollIndicatorRef}
        className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5 pt-8"
      >
        <div className="flex gap-12 text-neutral-400 select-none">
          <div>
            <p className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">Core Capability</p>
            <p className="text-xs font-semibold text-white mt-1">Creative Code & Strategy</p>
          </div>
          <div>
            <p className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">Agency Status</p>
            <p className="text-xs font-semibold text-white mt-1">Awwwards Nominee '26</p>
          </div>
        </div>

        <a 
          href="#manifesto"
          onClick={handleScrollClick}
          className="group flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 hover:text-accent-cyan transition-colors cursor-none"
        >
          SCROLL TO DISCOVER
          <span className="inline-block animate-bounce text-accent-cyan font-black">↓</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
