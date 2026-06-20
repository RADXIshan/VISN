import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Activity, Rocket, Laptop, PenTool, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    title: "24/7 Feedback",
    icon: MessageCircle,
    visnBold: "We're always here.",
    visnLight: "Anytime, anywhere.",
    otherBold: "Slow to respond.",
    otherLight: "You're left waiting."
  },
  {
    id: 2,
    title: "Hands-On With Periodic Updates",
    icon: Activity,
    visnBold: "Regular updates at every step",
    visnLight: "so you're always in the loop.",
    otherBold: "You're often left",
    otherLight: "in the dark."
  },
  {
    id: 3,
    title: "Super Fast Site Deployment",
    icon: Rocket,
    visnBold: "Streamlined workflow for",
    visnLight: "lightning-fast launches.",
    otherBold: "Weeks or even months",
    otherLight: "to go live."
  },
  {
    id: 4,
    title: "Easy Handover Process",
    icon: Laptop,
    visnBold: "Smooth, simple, and",
    visnLight: "zero confusion.",
    otherBold: "Complicated processes",
    otherLight: "and vague handovers."
  },
  {
    id: 5,
    title: "3 Unlimited Revision Rounds",
    icon: PenTool,
    visnBold: "Refine until it's exactly",
    visnLight: "how you want it.",
    otherBold: "Limited revisions.",
    otherLight: "Extra charges for changes."
  },
  {
    id: 6,
    title: "2 Months Free Maintenance",
    icon: ShieldCheck,
    visnBold: "We've got your back",
    visnLight: "after launch.",
    otherBold: "No post-launch support.",
    otherLight: "You're on your own."
  }
];

const WhyChooseUs = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Select header items
    const headerItems = container.querySelectorAll('.why-reveal-item');
    
    // Select table grid / cards
    const tableEl = container.querySelector('.desktop-table');
    const mobileCards = container.querySelectorAll('.mobile-cards-container > div');
    const doodles = container.querySelectorAll('.decorative-doodle');
    
    // Set initial styles for entrance animation
    gsap.set(headerItems, { opacity: 0, y: 40 });
    gsap.set(doodles, { opacity: 0, scale: 0.7 });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    // Animate Header
    tl.to(headerItems, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      stagger: 0.12,
      ease: "power3.out"
    });

    // Animate Doodles
    tl.to(doodles, {
      opacity: 1,
      scale: 1,
      duration: 1.0,
      stagger: 0.1,
      ease: "back.out(1.5)"
    }, "-=0.6");

    // Animate Table on Desktop or cards on Mobile
    if (window.innerWidth >= 1024) {
      if (tableEl) {
        gsap.set(tableEl, { opacity: 0, y: 50 });
        const rows = tableEl.querySelectorAll('.comparison-row');
        const highlightCol = tableEl.querySelector('.visn-column-highlight');
        
        tl.to(tableEl, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out"
        }, "-=0.8");
        
        if (rows.length) {
          gsap.set(rows, { opacity: 0, y: 20 });
          tl.to(rows, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out"
          }, "-=0.5");
        }
        
        if (highlightCol) {
          gsap.set(highlightCol, { scaleY: 0.95, opacity: 0 });
          tl.to(highlightCol, {
            scaleY: 1,
            opacity: 1,
            duration: 1.0,
            ease: "power4.out"
          }, "-=0.6");
        }
      }
    } else {
      if (mobileCards.length) {
        gsap.set(mobileCards, { opacity: 0, y: 40, scale: 0.98 });
        tl.to(mobileCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.8");
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container) t.kill();
      });
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="why-visn"
      className="relative min-h-screen w-full px-6 py-32 md:px-12 bg-transparent z-10 overflow-hidden"
    >
      {/* Background radial highlight */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-accent-gold/5 blur-[150px] pointer-events-none" />

      {/* Hairline top border in light mode */}
      <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-obsidian/10 to-transparent" />

      <div className="mx-auto max-w-6xl relative">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-24 select-none relative">
          
          {/* Top Left Doodle */}
          <div className="decorative-doodle absolute -left-12 top-4 hidden md:block">
            <svg viewBox="0 0 40 40" className="w-10 h-10 text-accent-gold stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 10,25 Q 15,15 25,10" />
              <path d="M 20,30 Q 25,22 35,20" />
              <path d="M 8,15 Q 18,12 22,2" />
            </svg>
          </div>

          {/* Top Right Doodle */}
          <div className="decorative-doodle absolute -right-16 top-16 hidden md:block">
            <svg viewBox="0 0 60 40" className="w-16 h-10 text-obsidian/20 stroke-current" fill="none" strokeWidth="1.5" strokeLinecap="round">
              <path d="M 5,20 C 25,-5 45,5 35,25 C 25,45 55,25 55,15" />
            </svg>
          </div>

          <div className="flex items-center gap-3 mb-4 why-reveal-item">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
              WHY CHOOSE VISN
            </h2>
          </div>

          <h3 className="why-reveal-item text-4xl sm:text-5xl lg:text-6xl font-serif font-black leading-tight uppercase text-obsidian mb-6">
            Everything You Need, <br />
            <span className="text-accent-gold">Nothing You Have To Chase.</span>
          </h3>

          <p className="why-reveal-item max-w-xl text-sm md:text-base text-obsidian/70 font-serif italic font-light leading-relaxed">
            We make the process simple, transparent, and stress-free so you can focus on what matters—growing your business.
          </p>
        </div>

        {/* Table container for Desktop */}
        <div className="desktop-table hidden lg:block relative mt-12 bg-white/20 backdrop-blur-sm rounded-3xl border border-obsidian/10 shadow-xs overflow-hidden">
          
          {/* 3 Column Grid Header */}
          <div className="grid grid-cols-12 border-b border-obsidian/10 py-7 items-center bg-dark-card/10">
            {/* Category Header (Empty) */}
            <div className="col-span-4" />
            
            {/* VISN Header */}
            <div className="col-span-4 text-center px-4 flex flex-col items-center">
              <div className="px-6 py-2 rounded-full bg-accent-gold/10 border border-accent-gold text-accent-gold-dark font-sans text-xs font-bold uppercase tracking-[0.2em] select-none scale-100 shadow-[0_0_15px_rgba(181,155,117,0.1)]">
                VISN.
              </div>
            </div>
            
            {/* Other Agencies Header */}
            <div className="col-span-4 text-center px-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-obsidian/40">
              OTHER WEB AGENCIES
            </div>
          </div>

          {/* Grid rows */}
          <div className="relative">
            
            {/* Vertical HIGHLIGHT visual overlay for VISN column */}
            <div className="visn-column-highlight absolute top-0 bottom-0 left-[33.33%] w-[33.33%] border-l border-r border-accent-gold/25 bg-accent-gold/1.5 -z-10 shadow-[inset_0_0_40px_rgba(181,155,117,0.01)] transition-all duration-700" />

            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={cat.id} 
                  className="comparison-row grid grid-cols-12 border-b last:border-0 border-obsidian/5 py-10 items-center hover:bg-obsidian/1 transition-colors"
                >
                  {/* Feature Title and Icon */}
                  <div className="col-span-4 pl-10 pr-6 flex items-center gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-obsidian/5 border border-obsidian/10 text-accent-gold-dark">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-obsidian">
                      {cat.title}
                    </h4>
                  </div>

                  {/* VISN cell */}
                  <div className="col-span-4 px-10 flex items-start gap-4">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-gold text-white shadow-[0_2px_8px_rgba(181,155,117,0.3)] mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-sans font-semibold text-obsidian text-[13px] leading-tight block">
                        {cat.visnBold}
                      </span>
                      <span className="font-sans font-light text-obsidian/60 text-[12px] leading-normal block mt-0.5">
                        {cat.visnLight}
                      </span>
                    </div>
                  </div>

                  {/* Other Web Agencies cell */}
                  <div className="col-span-4 px-10 flex items-start gap-4 opacity-50">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-obsidian/30 text-obsidian/60 bg-transparent mt-0.5">
                      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-sans font-semibold text-obsidian text-[13px] leading-tight block">
                        {cat.otherBold}
                      </span>
                      <span className="font-sans font-light text-obsidian/60 text-[12px] leading-normal block mt-0.5">
                        {cat.otherLight}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>

        {/* Table container for Mobile/Tablet */}
        <div className="mobile-cards-container lg:hidden flex flex-col gap-8 mt-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.id} 
                className="rounded-3xl border border-obsidian/10 bg-white/20 backdrop-blur-sm p-7 flex flex-col gap-5 shadow-xs"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 border-b border-obsidian/5 pb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-obsidian/5 border border-obsidian/10 text-accent-gold-dark">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-obsidian">
                    {cat.title}
                  </h4>
                </div>

                {/* VISN Block (Highlighted) */}
                <div className="rounded-2xl border border-accent-gold/30 bg-accent-gold/2 p-5 flex items-start gap-3 shadow-[0_4px_15px_rgba(181,155,117,0.02)]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-gold text-white mt-0.5 shadow-[0_2px_8px_rgba(181,155,117,0.25)]">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <span className="text-[9px] font-sans font-bold tracking-[0.15em] text-accent-gold-dark uppercase block mb-1">
                      VISN
                    </span>
                    <span className="font-sans font-semibold text-obsidian text-[13px] leading-tight block">
                      {cat.visnBold}
                    </span>
                    <span className="font-sans font-light text-obsidian/60 text-[12px] leading-normal block mt-0.5">
                      {cat.visnLight}
                    </span>
                  </div>
                </div>

                {/* Other Agencies Block */}
                <div className="rounded-2xl border border-obsidian/10 bg-transparent p-5 flex items-start gap-3 opacity-60">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-obsidian/25 text-obsidian/60 bg-transparent mt-0.5">
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <div>
                    <span className="text-[9px] font-sans font-bold tracking-[0.15em] text-obsidian/40 uppercase block mb-1">
                      OTHER WEB AGENCIES
                    </span>
                    <span className="font-sans font-semibold text-obsidian text-[13px] leading-tight block">
                      {cat.otherBold}
                    </span>
                    <span className="font-sans font-light text-obsidian/60 text-[12px] leading-normal block mt-0.5">
                      {cat.otherLight}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Left Doodle */}
        <div className="decorative-doodle absolute -left-14 -bottom-10 hidden md:block">
          <svg viewBox="0 0 50 50" className="w-12 h-12 text-accent-gold stroke-current opacity-70" fill="none" strokeWidth="2" strokeLinecap="round">
            <path d="M 15,20 L 15,28 M 11,24 L 19,24" />
            <path d="M 35,15 L 35,21 M 32,18 L 38,18" />
            <path d="M 25,35 L 25,43 M 21,39 L 29,39" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Bottom Right Doodle with curvature */}
        <div className="decorative-doodle absolute right-6 -bottom-16 hidden md:block select-none pointer-events-none">
          <svg viewBox="0 0 80 50" className="w-20 h-12 text-accent-gold-dark/45 stroke-current" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 70,10 Q 55,45 25,35" />
            <path d="M 32,41 L 23,35 L 31,29" />
          </svg>
        </div>

      </div>

      {/* Hairline bottom border in light mode */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-linear-to-r from-transparent via-obsidian/10 to-transparent" />
    </section>
  );
};

export default WhyChooseUs;
