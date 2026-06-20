import React, { useRef, useEffect } from 'react';
import Magnetic from './Magnetic';
import { ArrowUp, Send } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text) => {
  return text.split("").map((char, index) => (
    <span 
      key={index} 
      className="char-span inline-block"
      style={{ 
        display: char === " " ? "inline" : "inline-block",
        willChange: "transform, opacity"
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const ContactFooter = () => {
  const formRef = useRef(null);
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const bottomBarRef = useRef(null);
  const wordmarkRef = useRef(null);

  const handleScrollTop = (e) => {
    e.preventDefault();
    if (window.lenis) {
      window.lenis.scrollTo('#hero', { duration: 1.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Project details received. We will shape your vision soon.');
    e.target.reset();
  };

  useEffect(() => {
    const container = containerRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const bottomBar = bottomBarRef.current;
    const wordmark = wordmarkRef.current;

    if (!container) return;

    // Elements inside left column
    const leftTitle = leftCol.querySelector('.contact-title');
    const leftHeader = leftCol.querySelector('.split-header');
    const chars = leftHeader ? leftHeader.querySelectorAll('.char-span') : [];
    const leftParagraph = leftCol.querySelector('p');
    const leftLinks = leftCol.querySelectorAll('.contact-block');

    // Initial hidden state for left column
    gsap.set(chars, { y: "115%", opacity: 0 });
    gsap.set([leftTitle, leftParagraph], { opacity: 0, y: 30 });
    gsap.set(leftLinks, { opacity: 0, y: 25 });

    // Initial hidden state for right column form card
    gsap.set(rightCol, { opacity: 0, y: 40 });

    // Form inputs and button
    const formFields = rightCol.querySelectorAll('.form-field');
    const submitBtn = rightCol.querySelector('button[type="submit"]');
    gsap.set(formFields, { opacity: 0, y: 20 });
    gsap.set(submitBtn, { opacity: 0, scale: 0.95 });

    // Initial hidden state for bottom bar elements
    const bottomItems = bottomBar.children;
    gsap.set(bottomItems, { opacity: 0, y: 15 });

    // 1. Entrance animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    tl.to(leftTitle, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });

    if (chars.length) {
      tl.to(chars, {
        y: "0%",
        opacity: 1,
        duration: 0.95,
        stagger: 0.02,
        ease: "power3.out"
      }, "-=0.55");
    }

    tl.to(leftParagraph, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .to(leftLinks, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" }, "-=0.5")
      .to(rightCol, { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" }, "-=0.8")
      .to(formFields, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" }, "-=0.6")
      .to(submitBtn, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" }, "-=0.3")
      .to(bottomItems, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.4");

    // 2. Parallax effect for the giant wordmark (slides horizontally as we scroll)
    const wordmarkTween = gsap.fromTo(wordmark,
      { x: -50 },
      {
        x: 50,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.0
        }
      }
    );

    return () => {
      tl.kill();
      wordmarkTween.kill();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="contact"
      className="relative w-full bg-transparent pt-24 pb-12 px-6 md:px-12 overflow-hidden z-10"
    >
      <div className="absolute top-[80%] left-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-accent-gold/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          
          {/* Left Column - Typographic Luxury Contact Info */}
          <div ref={leftColRef} className="col-span-1 lg:col-span-5 flex flex-col justify-between select-none">
            <div>
              <div className="contact-title flex items-center gap-3 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
                <h2 className="text-[10px] font-serif font-bold uppercase tracking-[0.3em] text-obsidian/50">
                  CONNECT WITH US
                </h2>
              </div>
              <h3 className="split-header text-4xl md:text-5xl lg:text-6xl font-serif font-bold uppercase leading-[1.05] tracking-tight text-obsidian mb-8">
                <span className="inline-block overflow-hidden pb-1">
                  {splitText("START")}
                </span>
                <br />
                <span className="inline-block overflow-hidden pb-1 text-accent-gold italic font-normal">
                  {splitText("PROJECT")}
                </span>
              </h3>
              <p className="max-w-md text-base text-obsidian/75 font-serif italic font-light leading-relaxed mb-12">
                Have an ambitious concept? Need a developer-artist team to build your next monument? Share your coordinates below, and let's craft digital art.
              </p>
            </div>

            {/* Direct details formatted cleanly using typography */}
            <div className="flex flex-col gap-8 text-obsidian/80">
              <div className="contact-block flex flex-col gap-1.5">
                <span className="text-[8px] font-serif font-bold tracking-[0.25em] text-accent-gold uppercase">[ INQUIRIES ]</span>
                <a href="mailto:hello@visn.agency" className="text-lg font-serif font-light text-obsidian hover:text-accent-gold transition-colors cursor-none inline-block">ishanroy3118107@gmail.com</a>
              </div>
              <div className="contact-block flex flex-col gap-1.5">
                <span className="text-[8px] font-serif font-bold tracking-[0.25em] text-accent-gold uppercase">[ HOTLINE ]</span>
                <a href="tel:+15559092026" className="text-lg font-serif font-light text-obsidian hover:text-accent-gold transition-colors cursor-none inline-block">+91 84201 39900</a>
              </div>
              <div className="contact-block flex flex-col gap-1.5">
                <span className="text-[8px] font-serif font-bold tracking-[0.25em] text-accent-gold uppercase">[ CODES & ORIGIN ]</span>
                <span className="text-lg font-serif font-light italic text-obsidian/75">Kolkata, West Bengal</span>
              </div>
            </div>
          </div>

          {/* Right Column - Frameless Input Grid */}
          <div ref={rightColRef} className="col-span-1 lg:col-span-7 rounded-3xl border border-obsidian/10 bg-dark-card/35 p-8 md:p-12 backdrop-blur-md shadow-sm">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              {/* Form Input 1 */}
              <div className="form-field group relative flex flex-col gap-2 w-full border-b border-obsidian/15 focus-within:border-accent-gold transition-colors duration-500 pb-2">
                <label className="text-[9px] font-serif font-bold tracking-[0.3em] text-accent-gold uppercase">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-transparent py-1 text-sm font-sans font-light text-obsidian placeholder-obsidian/20 focus:outline-none rounded-none"
                />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:w-full" />
              </div>

              {/* Form Input 2 */}
              <div className="form-field group relative flex flex-col gap-2 w-full border-b border-obsidian/15 focus-within:border-accent-gold transition-colors duration-500 pb-2">
                <label className="text-[9px] font-serif font-bold tracking-[0.3em] text-accent-gold uppercase">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. john@example.com"
                  className="w-full bg-transparent py-1 text-sm font-sans font-light text-obsidian placeholder-obsidian/20 focus:outline-none rounded-none"
                />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:w-full" />
              </div>

              {/* Form Input 3 */}
              <div className="form-field group relative flex flex-col gap-2 w-full border-b border-obsidian/15 focus-within:border-accent-gold transition-colors duration-500 pb-2">
                <label className="text-[9px] font-serif font-bold tracking-[0.3em] text-accent-gold uppercase">Brief Description</label>
                <textarea 
                  id="contact-message"
                  rows="4"
                  required
                  placeholder="Tell us about your digital vision..."
                  className="w-full bg-transparent py-1 text-sm font-sans font-light text-obsidian placeholder-obsidian/20 focus:outline-none resize-none rounded-none"
                />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:w-full" />
              </div>
              
              <Magnetic strength={0.12} range={30}>
                <button
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center gap-3 py-4 rounded-full bg-obsidian text-dark-bg font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-accent-gold hover:text-white hover:shadow-[0_12px_30px_rgba(181,155,117,0.3)] transition-all duration-300 cursor-none"
                >
                  SEND MISSION DECK
                  <Send className="h-3.5 w-3.5" />
                </button>
              </Magnetic>
            </form>
          </div>
        </div>

        {/* Bottom Socials & Back to top */}
        <div ref={bottomBarRef} className="border-t border-obsidian/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 select-none">
          <p className="text-[10px] font-serif font-bold text-obsidian/45 tracking-wider text-center md:text-left">
            © {new Date().getFullYear()} VISN AGENCY INC. ALL RIGHTS RESERVED // CODED WITH ART
          </p>

          {/* Socials */}
          <div className="flex items-center gap-8">
            {['DRIBBBLE', 'TWITTER', 'LINKEDIN'].map((social) => (
              <Magnetic key={social} strength={0.2} range={25}>
                <a 
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[10px] font-serif font-bold tracking-widest text-obsidian/50 hover:text-accent-gold-dark transition-colors cursor-none"
                >
                  {social}
                </a>
              </Magnetic>
            ))}
          </div>

          {/* Back to top stacked vertically with text label */}
          <div className="flex flex-col items-center gap-2">
            <Magnetic strength={0.25} range={35}>
              <button
                onClick={handleScrollTop}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-obsidian text-dark-bg hover:bg-accent-gold hover:text-white hover:shadow-[0_10px_20px_rgba(181,155,117,0.25)] transition-all duration-300 cursor-none"
                title="Scroll to Top"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </Magnetic>
            <button 
              onClick={handleScrollTop}
              className="text-[8px] font-serif font-bold tracking-[0.3em] text-obsidian/45 hover:text-accent-gold transition-colors duration-300 uppercase cursor-none"
            >
              BACK TO TOP
            </button>
          </div>
        </div>

        {/* Giant footer wordmark (Editorial Serif) */}
        <div className="w-full flex items-center justify-center mt-20 select-none pointer-events-none">
          <h2 ref={wordmarkRef} className="text-[18vw] font-serif font-bold leading-none uppercase tracking-tighter text-obsidian/3 text-center">
            VISN<span className="text-accent-gold">.</span>
          </h2>
        </div>

      </div>
    </section>
  );
};

export default ContactFooter;
