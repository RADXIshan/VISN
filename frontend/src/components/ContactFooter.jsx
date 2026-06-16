import React, { useRef } from 'react';
import Magnetic from './Magnetic';
import { ArrowUp, Mail, Phone, MapPin, Send } from 'lucide-react';

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
      className="relative w-full bg-transparent pt-20 pb-8 px-6 md:px-12 overflow-hidden z-10"
    >
      <div className="absolute top-[80%] left-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-accent-gold/5 blur-[100px] pointer-events-none" />
      
      {/* Dynamic scrolling contact header */}
      <div className="w-full overflow-hidden border-y border-obsidian/10 py-6 mb-20 pointer-events-none select-none">
        <div className="flex whitespace-nowrap gap-8 text-[4vw] md:text-[3vw] font-serif font-light uppercase tracking-widest text-stroke text-obsidian/10">
          <span className="animate-[marquee_25s_linear_infinite]">
            LET'S WORK TOGETHER • SHAPE A DIGITAL FUTURE • ENGAGE CREATIVE CODE • LET'S WORK TOGETHER • SHAPE A DIGITAL FUTURE • ENGAGE CREATIVE CODE •
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-20">
          
          {/* Left Column */}
          <div className="flex flex-col justify-between select-none">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
                  CONNECT WITH US
                </h2>
              </div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold uppercase leading-tight text-obsidian mb-6">
                START A <br />
                <span className="text-stroke-glow text-glow-gold">PROJECT</span>
              </h3>
              <p className="max-w-md text-sm text-obsidian/70 font-serif italic font-light leading-relaxed mb-8">
                Have an ambitious concept? Need a developer-artist setup that wins awards? Fill out the details, and let's craft digital art.
              </p>
            </div>

            {/* Direct details */}
            <div className="flex flex-col gap-6 text-obsidian/70">
              <div className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian/5 border border-obsidian/10 text-accent-gold-dark">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:hello@visn.agency" className="text-sm hover:text-accent-gold-dark transition-colors cursor-none">hello@visn.agency</a>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian/5 border border-obsidian/10 text-accent-gold-dark">
                  <Phone className="h-4 w-4" />
                </div>
                <a href="tel:+15559092026" className="text-sm hover:text-accent-gold-dark transition-colors cursor-none">+1 (555) 909-2026</a>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian/5 border border-obsidian/10 text-accent-gold-dark">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-serif italic">Silicon Valley, California</span>
              </div>
            </div>
          </div>

          {/* Right Column (Minimal Form with Editorial Lines) */}
          <div className="rounded-3xl border border-obsidian/10 bg-dark-card/45 p-8 md:p-10 backdrop-blur-md shadow-sm">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-obsidian/45 uppercase">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-transparent border-b border-obsidian/20 py-2.5 text-sm text-obsidian placeholder-obsidian/30 focus:outline-none focus:border-accent-gold transition-colors rounded-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-obsidian/45 uppercase">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. john@example.com"
                  className="w-full bg-transparent border-b border-obsidian/20 py-2.5 text-sm text-obsidian placeholder-obsidian/30 focus:outline-none focus:border-accent-gold transition-colors rounded-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-obsidian/45 uppercase">Brief Description</label>
                <textarea 
                  rows="4"
                  required
                  placeholder="Tell us about your digital vision..."
                  className="w-full bg-transparent border-b border-obsidian/20 py-2.5 text-sm text-obsidian placeholder-obsidian/30 focus:outline-none focus:border-accent-gold transition-colors resize-none rounded-none"
                />
              </div>
              
              <Magnetic strength={0.15} range={35}>
                <button
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center gap-3 py-3.5 rounded-full bg-obsidian text-dark-bg font-bold text-xs uppercase tracking-widest hover:bg-accent-gold hover:text-white hover:shadow-[0_10px_25px_rgba(181,155,117,0.35)] transition-all duration-300 cursor-none"
                >
                  SEND MISSION DECK
                  <Send className="h-3.5 w-3.5" />
                </button>
              </Magnetic>
            </form>
          </div>
        </div>

        {/* Bottom Socials & Back to top */}
        <div className="border-t border-obsidian/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 select-none">
          <p className="text-[10px] font-mono text-obsidian/40 tracking-wider text-center md:text-left">
            © {new Date().getFullYear()} VISN AGENCY INC. ALL RIGHTS RESERVED // CODED WITH ART
          </p>

          <div className="flex items-center gap-6">
            {['AWWWARDS', 'DRIBBBLE', 'TWITTER', 'LINKEDIN'].map((social) => (
              <Magnetic key={social} strength={0.25} range={25}>
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

          <Magnetic strength={0.3} range={40}>
            <button
              onClick={handleScrollTop}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-obsidian text-dark-bg hover:bg-accent-gold hover:text-white hover:shadow-[0_10px_20px_rgba(181,155,117,0.35)] transition-all duration-300 cursor-none"
              title="Scroll to Top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </Magnetic>
        </div>

        {/* Giant footer wordmark (Editorial Serif) */}
        <div className="w-full flex items-center justify-center mt-20 select-none pointer-events-none">
          <h2 className="text-[18vw] font-serif font-bold leading-none uppercase tracking-tighter text-stroke text-obsidian/5 text-center">
            VISN<span className="text-accent-gold text-stroke-glow text-glow-gold">.</span>
          </h2>
        </div>

      </div>
    </section>
  );
};

export default ContactFooter;
