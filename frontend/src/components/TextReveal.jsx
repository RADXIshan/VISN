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
      { opacity: 0.12, y: 3 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
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
      {/* Hairline top border in light mode */}
      <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-obsidian/10 to-transparent" />
      
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row gap-10 md:gap-20">
        
        {/* Left column metadata */}
        <div className="w-full md:w-1/4 flex flex-col justify-start select-none">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
              OUR MANIFESTO
            </h2>
          </div>
          <p className="text-[9px] font-mono text-obsidian/40 tracking-wider">
            [ SEC. 01 // CORE ETHOS ]
          </p>
        </div>

        {/* Right column text reveal */}
        <div className="w-full md:w-3/4">
          <p 
            ref={textRef} 
            className="text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] font-serif font-light leading-relaxed tracking-normal text-obsidian flex flex-wrap gap-x-2 gap-y-1.5 select-none"
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
      
      {/* Hairline bottom border in light mode */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-linear-to-r from-transparent via-obsidian/10 to-transparent" />
    </section>
  );
};

export default TextReveal;
