import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ZoomParallaxSection = () => {
  const containerRef = useRef(null);
  const clipContainerRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const clipContainer = clipContainerRef.current;
    const image = imageRef.current;
    const textEl = textRef.current;

    if (!container || !clipContainer || !image || !textEl) return;

    const fadeItems = textEl.querySelectorAll('.fade-item');

    // Setup scrub timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    // Animate clip-path to cover full screen and counter-scale the image (parallax)
    tl.to(clipContainer, {
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      ease: 'none',
    })
    .to(image, {
      scale: 1.0,
      ease: 'none',
    }, 0)
    .fromTo(fadeItems, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, ease: 'power2.out' },
      0.35
    );

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[160vh] bg-transparent"
    >
      {/* Sticky Fullscreen viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center z-20">
        
        {/* Centered card that expands to fill screen */}
        <div 
          ref={clipContainerRef}
          className="relative w-[65vw] h-[40vw] md:w-[50vw] md:h-[30vw] overflow-hidden shadow-[0_25px_60px_rgba(21,21,21,0.25)] flex items-center justify-center"
          style={{ 
            clipPath: 'inset(18% 22% 18% 22% round 24px)',
            willChange: 'clip-path'
          }}
        >
          {/* Parallax background transition image */}
          <img 
            ref={imageRef}
            src="/hero-transition.png" 
            alt="VISN Transition" 
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{ 
              transform: 'scale(1.35)',
              willChange: 'transform'
            }}
          />

          {/* Dark scrim to enhance text legibility */}
          <div className="absolute inset-0 bg-obsidian/30 mix-blend-multiply z-10" />

          {/* Content Overlay */}
          <div 
            ref={textRef}
            className="relative z-20 flex flex-col items-center text-center px-6 max-w-2xl select-none"
          >
            <span className="fade-item text-[9px] font-sans font-bold tracking-[0.35em] text-accent-gold uppercase mb-3 block">
              [ SEC. 01 // MANIFESTO ]
            </span>
            <h2 className="fade-item text-3xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-white leading-[1.1] mb-4">
              engineering tactile digital monuments
            </h2>
            <p className="fade-item text-xs font-sans font-light tracking-[0.1em] text-white/70 max-w-md uppercase">
              Combining high-performance frontend logic with luxury design paradigms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomParallaxSection;
