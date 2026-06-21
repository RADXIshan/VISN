import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text) => {
  return text.split(" ").map((word, wordIndex, wordArr) => (
    <React.Fragment key={wordIndex}>
      <span className="inline-block whitespace-nowrap">
        {word.split("").map((char, charIndex) => (
          <span 
            key={charIndex} 
            className="char-span inline-block"
            style={{ 
              willChange: "transform, opacity"
            }}
          >
            {char}
          </span>
        ))}
      </span>
      {wordIndex < wordArr.length - 1 && " "}
    </React.Fragment>
  ));
};

const DuoGlideGallery = () => {
  const containerRef = useRef(null);
  const colARef = useRef(null);
  const colBRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const colA = colARef.current;
    const colB = colBRef.current;
    if (!container || !colA || !colB) return;

    // Col A shifts upwards, Col B shifts downwards on page scroll
    const scrollAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.8,
        invalidateOnRefresh: true,
      }
    });

    scrollAnimation.fromTo(colA, 
      { y: "10%" },
      { y: "-10%", ease: "none", force3D: true },
      0
    );

    scrollAnimation.fromTo(colB, 
      { y: "-10%" },
      { y: "10%", ease: "none", force3D: true },
      0
    );

    // Split text animation for the section header
    const headerTitle = container.querySelector('.split-header');
    if (headerTitle) {
      const chars = headerTitle.querySelectorAll('.char-span');
      gsap.fromTo(chars,
        { y: "115%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.6,
          stagger: 0.01,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerTitle,
            start: "top 82%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container || (headerTitle && t.trigger === headerTitle)) t.kill();
      });
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="manifesto-gallery"
      className="relative min-h-[140vh] w-full px-6 py-32 md:px-12 bg-linear-to-b from-dark-bg via-dark-card to-dark-bg overflow-hidden flex flex-col justify-center select-none z-10"
    >
      {/* Background radial highlight */}
      <div className="absolute top-[40%] right-[20%] -z-10 h-[600px] w-[600px] rounded-full bg-accent-green/2.0 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left column: Sticky manifesto text */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:pr-8">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green shadow-[0_0_6px_#10B981]" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
              02 // MANIFESTO & GLIDE
            </h2>
          </div>
          
          <h3 className="split-header text-3xl md:text-4xl lg:text-5xl font-serif font-bold uppercase text-obsidian leading-tight">
            <span className="inline-block overflow-hidden pb-1">
              {splitText("THE ART OF")}
            </span>
            <br />
            <span className="inline-block overflow-hidden pb-1 text-accent-green">
              {splitText("CONTRAST")}
            </span>
          </h3>
          
          <p className="text-xs md:text-sm text-obsidian/70 font-serif italic font-light leading-relaxed">
            In our world, speed and beauty coexist. We align structural grids with flowing ribbons; binary code matrices with editorial proportions. The glide collage captures our duality.
          </p>

          <div className="border-t border-obsidian/10 pt-6 mt-4 hidden lg:block">
            <p className="text-[8.5px] font-mono text-obsidian/40 uppercase tracking-widest">[ VISUAL METRICS ]</p>
            <p className="text-[11px] font-serif italic text-accent-green-dark mt-2 font-medium">
              Gliding ratio: 1.15x counter-parallax
            </p>
          </div>
        </div>

        {/* Right column: Counter scrolling dual columns */}
        <div className="lg:col-span-8 grid grid-cols-2 gap-4 md:gap-8 h-screen lg:h-[110vh] overflow-hidden items-center relative">
          
          {/* Column A: Moving upwards */}
          <div ref={colARef} className="flex flex-col gap-4 md:gap-8 will-change-transform" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
            
            {/* Plate A1: Architectural blueprint */}
            <div className="rounded-3xl border border-obsidian/10 bg-dark-card/30 p-4 md:p-6 backdrop-blur-md flex flex-col justify-between h-[280px] md:h-[360px]">
              <div className="flex items-center justify-between text-[8px] font-mono text-obsidian/40 uppercase tracking-wider">
                <span>[ BLUEPRINT ]</span>
                <span>GRID 01</span>
              </div>
              
              <div className="my-auto flex items-center justify-center">
                <svg className="w-32 h-32 md:w-44 md:h-44 text-obsidian/85" viewBox="0 0 100 100" fill="none">
                  {/* Grid layout */}
                  <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 2" />
                  <circle cx="50" cy="50" r="30" stroke="#10B981" strokeWidth="0.8" />
                  <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.4" />
                  <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.4" />
                  {/* Golden Ratio squares */}
                  <rect x="20" y="20" width="60" height="60" stroke="#10B981" strokeWidth="0.3" strokeDasharray="1 1" />
                  <circle cx="50" cy="50" r="1.5" fill="#10B981" />
                  {/* Typography marker */}
                  <text x="14" y="22" className="text-[3px] font-mono fill-obsidian/40 tracking-widest">PROP: 1.618</text>
                  <text x="14" y="86" className="text-[3px] font-serif italic fill-accent-green-dark font-black">VISN</text>
                </svg>
              </div>

              <div className="text-[9px] font-bold tracking-[0.2em] text-accent-green-dark uppercase mt-2">
                STRUCTURE // SCALE
              </div>
            </div>

            {/* Plate A2: Golden Spiral */}
            <div className="rounded-3xl border border-obsidian/10 bg-dark-card/30 p-4 md:p-6 backdrop-blur-md flex flex-col justify-between h-[280px] md:h-[360px]">
              <div className="flex items-center justify-between text-[8px] font-mono text-obsidian/40 uppercase tracking-wider">
                <span>[ FIBONACCI ]</span>
                <span>CURVE 02</span>
              </div>
              
              <div className="my-auto flex items-center justify-center">
                <svg className="w-32 h-32 md:w-44 md:h-44 text-accent-green-dark" viewBox="0 0 100 100" fill="none">
                  {/* Golden Spiral Path */}
                  <path d="M 50,50 A 2,2 0 0,0 48,50 A 4,4 0 0,0 52,50 A 8,8 0 0,0 44,50 A 16,16 0 0,0 60,50 A 32,32 0 0,0 28,50 A 64,64 0 0,0 92,50" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
                  {/* Cosmic coordinates */}
                  <circle cx="92" cy="50" r="2" fill="#151515" />
                  <circle cx="28" cy="50" r="1" fill="#151515" />
                  <line x1="50" y1="50" x2="92" y2="50" stroke="#151515" strokeWidth="0.2" />
                  <text x="45" y="47" className="text-[3px] font-mono fill-obsidian/35">C_0</text>
                </svg>
              </div>

              <div className="text-[9px] font-bold tracking-[0.2em] text-accent-green-dark uppercase mt-2">
                NATURAL GROWTH
              </div>
            </div>

            {/* Plate A3: Deconstructed Text Grid */}
            <div className="rounded-3xl border border-obsidian/10 bg-dark-card/30 p-4 md:p-6 backdrop-blur-md hidden md:flex flex-col justify-between h-[280px] md:h-[360px]">
              <div className="flex items-center justify-between text-[8px] font-mono text-obsidian/40 uppercase tracking-wider">
                <span>[ TYPOGRAPHY ]</span>
                <span>BLU 03</span>
              </div>

              <div className="my-auto flex flex-col gap-4">
                <div className="text-[52px] font-serif font-black text-obsidian leading-none">V</div>
                <div className="w-full h-px bg-obsidian/10" />
                <p className="text-[8px] font-serif italic text-obsidian/60 leading-relaxed">
                  Every glyph is aligned to our master screen metrics. We maintain baseline grid rules to structure layout density.
                </p>
              </div>

              <div className="text-[9px] font-bold tracking-[0.2em] text-accent-green-dark uppercase mt-2">
                SERIF SYSTEM
              </div>
            </div>

          </div>

          {/* Column B: Moving downwards */}
          <div ref={colBRef} className="flex flex-col gap-4 md:gap-8 will-change-transform mt-[-40px] lg:mt-[-80px]" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
            
            {/* Plate B1: Minimalist silhouette */}
            <div className="rounded-3xl border border-obsidian/10 bg-dark-card/30 p-4 md:p-6 backdrop-blur-md flex flex-col justify-between h-[280px] md:h-[360px]">
              <div className="flex items-center justify-between text-[8px] font-mono text-obsidian/40 uppercase tracking-wider">
                <span>[ SKETCH ]</span>
                <span>ART 01</span>
              </div>
              
              <div className="my-auto flex items-center justify-center">
                <svg className="w-32 h-32 md:w-44 md:h-44 text-obsidian" viewBox="0 0 100 100" fill="none">
                  {/* Geometric body contours */}
                  <path d="M25,85 C30,65 35,45 45,35 C55,25 65,30 70,20 C72,15 70,10 65,10" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" />
                  <path d="M45,35 C42,48 38,62 35,85" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1 1.5" />
                  {/* Decorative background sun */}
                  <circle cx="68" cy="22" r="12" fill="#10B981" fillOpacity="0.12" stroke="#10B981" strokeWidth="0.4" />
                  <line x1="68" y1="5" x2="68" y2="40" stroke="#10B981" strokeWidth="0.25" strokeDasharray="2 2" />
                </svg>
              </div>

              <div className="text-[9px] font-bold tracking-[0.2em] text-accent-green-dark uppercase mt-2">
                HUMAN CONTOUR
              </div>
            </div>

            {/* Plate B2: Geometric orbits */}
            <div className="rounded-3xl border border-obsidian/10 bg-dark-card/30 p-4 md:p-6 backdrop-blur-md flex flex-col justify-between h-[280px] md:h-[360px]">
              <div className="flex items-center justify-between text-[8px] font-mono text-obsidian/40 uppercase tracking-wider">
                <span>[ ORBITS ]</span>
                <span>MATH 02</span>
              </div>
              
              <div className="my-auto flex items-center justify-center">
                <svg className="w-32 h-32 md:w-44 md:h-44 text-obsidian" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.35" />
                  <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
                  <circle cx="50" cy="50" r="16" stroke="#10B981" strokeWidth="0.6" />
                  {/* Orbits vectors */}
                  <line x1="12" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="0.3" />
                  <line x1="50" y1="12" x2="50" y2="88" stroke="currentColor" strokeWidth="0.3" />
                  <circle cx="50" cy="12" r="2.5" fill="#10B981" />
                  <circle cx="78" cy="50" r="2" fill="currentColor" />
                  <circle cx="50" cy="66" r="1.5" fill="#10B981" />
                </svg>
              </div>

              <div className="text-[9px] font-bold tracking-[0.2em] text-accent-green-dark uppercase mt-2">
                ORBITAL VECTORS
              </div>
            </div>

            {/* Plate B3: Celestial Chart */}
            <div className="rounded-3xl border border-obsidian/10 bg-dark-card/30 p-4 md:p-6 backdrop-blur-md hidden md:flex flex-col justify-between h-[280px] md:h-[360px]">
              <div className="flex items-center justify-between text-[8px] font-mono text-obsidian/40 uppercase tracking-wider">
                <span>[ CONSTELLATION ]</span>
                <span>STR 03</span>
              </div>
              
              <div className="my-auto flex items-center justify-center">
                <svg className="w-32 h-32 md:w-44 md:h-44 text-accent-green-dark" viewBox="0 0 100 100" fill="none">
                  {/* Star nodes */}
                  <g stroke="#151515" strokeWidth="0.4">
                    <line x1="20" y1="20" x2="45" y2="35" />
                    <line x1="45" y1="35" x2="70" y2="25" />
                    <line x1="45" y1="35" x2="50" y2="70" />
                    <line x1="50" y1="70" x2="80" y2="80" />
                    <line x1="20" y1="20" x2="15" y2="60" />
                  </g>
                  {/* Stars circles */}
                  <circle cx="20" cy="20" r="2.5" fill="#10B981" />
                  <circle cx="45" cy="35" r="3" fill="#151515" />
                  <circle cx="70" cy="25" r="2" fill="#10B981" />
                  <circle cx="50" cy="70" r="3.5" fill="#10B981" />
                  <circle cx="80" cy="80" r="2.5" fill="#151515" />
                  <circle cx="15" cy="60" r="1.5" fill="#10B981" />
                </svg>
              </div>

              <div className="text-[9px] font-bold tracking-[0.2em] text-accent-green-dark uppercase mt-2">
                CELESTIAL CHART
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default DuoGlideGallery;
