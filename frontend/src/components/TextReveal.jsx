import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TextReveal = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  const manifestoText = 
    "We believe in digital art that functions flawlessly. We discard the boring templates and standard solutions. Our vision is to combine creative expression, high-performance web engineering, and aggressive visual storytelling to elevate brands beyond standard code. We don't just build websites; we design interactive digital monuments.";

  const words = manifestoText.split(' ');

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl) return;

    const wordSpans = textEl.querySelectorAll('.reveal-word');
    
    gsap.fromTo(wordSpans, 
      { opacity: 0.12, y: 4 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 55%",
          scrub: true
        }
      }
    );
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="manifesto"
      className="relative flex min-h-[85vh] w-full flex-col justify-center px-6 py-28 md:px-12 bg-transparent z-10"
    >
      {/* Visual separators */}
      <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row gap-10 md:gap-20">
        {/* Metadata tag label */}
        <div className="w-full md:w-1/4 flex flex-col justify-start select-none">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-2 w-2 rounded-full bg-accent-purple shadow-[0_0_8px_#7000ff]" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
              OUR MANIFESTO
            </h2>
          </div>
          <p className="text-[9px] font-mono text-neutral-500 tracking-wider">
            [ SECTION 01 // CRITICAL THINKING ]
          </p>
        </div>

        {/* Kinetic sentence */}
        <div className="w-full md:w-3/4">
          <p 
            ref={textRef} 
            className="text-2xl sm:text-3xl md:text-[38px] lg:text-[44px] font-display font-bold leading-relaxed tracking-tight text-white flex flex-wrap gap-x-2.5 gap-y-2 select-none"
          >
            {words.map((word, index) => (
              <span 
                key={index} 
                className="reveal-word inline-block"
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>
      
      <div className="absolute left-0 right-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default TextReveal;
