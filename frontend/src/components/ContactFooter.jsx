import React, { useRef } from 'react';
import Magnetic from './Magnetic';
import { ArrowUp, Send } from 'lucide-react';

const ContactFooter = () => {
  const formRef = useRef(null);

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

  return (
    <section 
      id="contact"
      className="relative w-full bg-transparent pt-24 pb-12 px-6 md:px-12 overflow-hidden z-10"
    >
      <div className="absolute top-[80%] left-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-accent-gold/5 blur-[100px] pointer-events-none" />
      


      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          
          {/* Left Column - Typographic Luxury Contact Info */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-between select-none">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
                  CONNECT WITH US
                </h2>
              </div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold uppercase leading-[1.05] tracking-tight text-obsidian mb-8">
                START A <br />
                <span className="text-accent-gold italic font-normal">PROJECT</span>
              </h3>
              <p className="max-w-md text-base text-obsidian/75 font-serif italic font-light leading-relaxed mb-12">
                Have an ambitious concept? Need a developer-artist team to build your next monument? Share your coordinates below, and let's craft digital art.
              </p>
            </div>

            {/* Direct details formatted cleanly using typography */}
            <div className="flex flex-col gap-8 text-obsidian/80">
              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-bold tracking-[0.25em] text-accent-gold uppercase">[ INQUIRIES ]</span>
                <a href="mailto:hello@visn.agency" className="text-lg font-serif font-light text-obsidian hover:text-accent-gold transition-colors cursor-none inline-block">hello@visn.agency</a>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-bold tracking-[0.25em] text-accent-gold uppercase">[ HOTLINE ]</span>
                <a href="tel:+15559092026" className="text-lg font-serif font-light text-obsidian hover:text-accent-gold transition-colors cursor-none inline-block">+1 (555) 909-2026</a>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-bold tracking-[0.25em] text-accent-gold uppercase">[ CODES & ORIGIN ]</span>
                <span className="text-lg font-serif font-light italic text-obsidian/75">Silicon Valley, California</span>
              </div>
            </div>
          </div>

          {/* Right Column - Frameless Input Grid */}
          <div className="col-span-1 lg:col-span-7 rounded-3xl border border-obsidian/10 bg-dark-card/35 p-8 md:p-12 backdrop-blur-md shadow-sm">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              {/* Form Input 1 */}
              <div className="group relative flex flex-col gap-2 w-full border-b border-obsidian/15 focus-within:border-accent-gold transition-colors duration-500 pb-2">
                <label className="text-[9px] font-bold tracking-[0.3em] text-accent-gold uppercase">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-transparent py-1 text-sm font-sans font-light text-obsidian placeholder-obsidian/20 focus:outline-none rounded-none"
                />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:w-full" />
              </div>

              {/* Form Input 2 */}
              <div className="group relative flex flex-col gap-2 w-full border-b border-obsidian/15 focus-within:border-accent-gold transition-colors duration-500 pb-2">
                <label className="text-[9px] font-bold tracking-[0.3em] text-accent-gold uppercase">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. john@example.com"
                  className="w-full bg-transparent py-1 text-sm font-sans font-light text-obsidian placeholder-obsidian/20 focus:outline-none rounded-none"
                />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:w-full" />
              </div>

              {/* Form Input 3 */}
              <div className="group relative flex flex-col gap-2 w-full border-b border-obsidian/15 focus-within:border-accent-gold transition-colors duration-500 pb-2">
                <label className="text-[9px] font-bold tracking-[0.3em] text-accent-gold uppercase">Brief Description</label>
                <textarea 
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
        <div className="border-t border-obsidian/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 select-none">
          <p className="text-[10px] font-mono text-obsidian/45 tracking-wider text-center md:text-left">
            © {new Date().getFullYear()} VISN AGENCY INC. ALL RIGHTS RESERVED // CODED WITH ART
          </p>

          {/* Socials - Awwwards removed */}
          <div className="flex items-center gap-8">
            {['DRIBBBLE', 'TWITTER', 'LINKEDIN'].map((social) => (
              <Magnetic key={social} strength={0.2} range={25}>
                <a 
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[10px] font-bold tracking-widest text-obsidian/50 hover:text-accent-gold-dark transition-colors cursor-none"
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
              className="text-[8px] font-bold tracking-[0.3em] text-obsidian/45 hover:text-accent-gold transition-colors duration-300 uppercase cursor-none"
            >
              BACK TO TOP
            </button>
          </div>
        </div>

        {/* Giant footer wordmark (Editorial Serif) */}
        <div className="w-full flex items-center justify-center mt-20 select-none pointer-events-none">
          <h2 className="text-[18vw] font-serif font-bold leading-none uppercase tracking-tighter text-obsidian/3 text-center">
            VISN<span className="text-accent-gold">.</span>
          </h2>
        </div>

      </div>
    </section>
  );
};

export default ContactFooter;
