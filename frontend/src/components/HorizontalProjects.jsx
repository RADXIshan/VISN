import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Cpu, Layers, Radio, Orbit, Briefcase, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "01",
    number: "01 / 04",
    title: "Neural Net",
    category: "AI Platform / Strategy",
    year: "2026",
    cardTagline: "CLOUD AUTOMATION",
    tagline: "Building neural intelligence tools for enterprise cloud systems.",
    icon: <Cpu className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-accent-gold/20 to-accent-gold-dark/5",
    image: "/images/neural-net.png",
    service: "AI Platform Development",
    outcome: "+43% Cloud Efficiency",
    mobileTheme: {
      bg: "bg-linear-to-b from-stone-900 to-black",
      logo: "NN",
      tagline: "Neural intelligence tools for cloud systems.",
      cta: "EXPLORE PLATFORM"
    }
  },
  {
    id: "02",
    number: "02 / 04",
    title: "Kinetic Labs",
    category: "Interactive Brand",
    year: "2025",
    cardTagline: "PHYSICAL-DIGITAL DUALITY",
    tagline: "Sculpting immersive physical-digital brand experiences.",
    icon: <Orbit className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-accent-gold-dark/20 to-stone-400/5",
    image: "/images/kinetic-labs.png",
    service: "WebSocket & 3D Interactive Design",
    outcome: "Real-time 3D Syncing",
    mobileTheme: {
      bg: "bg-linear-to-b from-amber-955 via-stone-900 to-stone-950",
      logo: "KL",
      tagline: "Sculpting immersive physical-digital experiences.",
      cta: "ENTER EXHIBIT"
    }
  },
  {
    id: "03",
    number: "03 / 04",
    title: "Eclipse Corp",
    category: "Creative Campaign",
    year: "2026",
    cardTagline: "NEURAL FEED MARKETING",
    tagline: "Generating explosive viral campaigns across neural feeds.",
    icon: <Radio className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-amber-600/15 to-accent-gold/5",
    image: "/images/eclipse-corp.png",
    service: "Viral Funnels & Content Strategy",
    outcome: "+260% Viral Reach",
    mobileTheme: {
      bg: "bg-linear-to-b from-[#2c1a04] to-[#0a0500]",
      logo: "EC",
      tagline: "Generating explosive viral campaigns across feeds.",
      cta: "VIEW FUNNELS"
    }
  },
  {
    id: "04",
    number: "04 / 04",
    title: "Cyber Dock",
    category: "Web3 Platform",
    year: "2026",
    cardTagline: "SMART CONTRACT EXPLORATION",
    tagline: "Forging next-generation smart contract visual explorers.",
    icon: <Layers className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-stone-500/15 to-accent-gold-dark/5",
    image: "/images/cyber-dock.png",
    service: "Web3 Contract Explorer UI",
    outcome: "Topographic Node Topology",
    mobileTheme: {
      bg: "bg-linear-to-b from-slate-900 to-zinc-950",
      logo: "CD",
      tagline: "Next-gen smart contract visual explorers.",
      cta: "LAUNCH APP"
    }
  }
];

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

const HorizontalProjects = () => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const progressFillRef = useRef(null);
  const headingRef = useRef(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const container = containerRef.current;
    const progressFill = progressFillRef.current;
    if (!scrollContainer || !container || !progressFill) return;

    // Shift width is: element total width minus browser viewport width
    const getScrollWidth = () => scrollContainer.scrollWidth - window.innerWidth;
    const getScrollLimit = () => Math.max(0, getScrollWidth());

    // Smooth horizontal scroll with refined easing for a buttery experience
    const scrollTween = gsap.to(scrollContainer, {
      x: () => -getScrollLimit(),
      ease: "none",
      force3D: true,
      scrollTrigger: {
        id: "projects-pin",
        trigger: container,
        pin: true,
        scrub: 3,
        anticipatePin: 1,
        start: "top top",
        end: () => `+=${getScrollLimit()}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.to(progressFill, {
            scaleX: self.progress,
            duration: 0.1,
            ease: "none",
            overwrite: "auto"
          });
          const idx = Math.round(self.progress * (projects.length - 1));
          setCurrentCardIndex(idx);
        },
        onToggle: (self) => {
          const nav = document.querySelector('nav');
          if (nav) {
            if (self.isActive) {
              nav.setAttribute('data-hidden-by-project', 'true');
            } else {
              nav.removeAttribute('data-hidden-by-project');
            }
          }
        }
      }
    });

    // Subtle card velocity skew
    const cards = scrollContainer.querySelectorAll('.project-card');
    cards.forEach((card) => {
      gsap.fromTo(card, 
        { skewX: 0 },
        {
          skewX: -0.2,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: "left right",
            end: "left center",
            scrub: 1.5
          }
        }
      );
    });

    // Split text animation for the section header
    const headerTitle = headingRef.current;
    const headerSection = headerTitle ? headerTitle.parentElement : null;
    const headerMeta = headerSection ? headerSection.querySelectorAll('.reveal-meta') : [];
    
    if (headerTitle) {
      const chars = headerTitle.querySelectorAll('.char-span');
      gsap.set(chars, { y: "115%", opacity: 0 });
      gsap.set(headerMeta, { opacity: 0, y: 15 });

      const headerTween = gsap.timeline({
        scrollTrigger: {
          trigger: headerTitle,
          start: "top 95%",
          toggleActions: "play reverse play reverse"
        }
      });

      headerTween.to(chars, {
        y: "0%",
        opacity: 1,
        duration: 0.6,
        stagger: 0.01,
        ease: "power3.out"
      });

      headerTween.to(headerMeta, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out"
      }, "-=0.45");
    }

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.id === "projects-pin" || t.trigger === container || t.trigger === headingRef.current) t.kill();
      });
      // Restore navbar state on unmount
      const nav = document.querySelector('nav');
      if (nav) {
        nav.removeAttribute('data-hidden-by-project');
      }
    };
  }, []);

  const scrollToCard = (index) => {
    if (!window.lenis) return;
    const trigger = ScrollTrigger.getById("projects-pin");
    if (!trigger) return;
    const start = trigger.start;
    const end = trigger.end;
    const step = (end - start) / (projects.length - 1);
    const targetScroll = start + step * index;
    window.lenis.scrollTo(targetScroll, { duration: 1.2 });
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      scrollToCard(currentCardIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < projects.length - 1) {
      scrollToCard(currentCardIndex + 1);
    }
  };

  const handleViewAllClick = (e) => {
    e.preventDefault();
    const target = document.querySelector('#contact');
    if (target && window.lenis) {
      window.lenis.scrollTo(target, { offset: -60, duration: 1.8 });
    }
  };

  return (
    <div className="w-full">
      {/* 1. Header Section - Normal document scroll flow */}
      <div className="w-full relative overflow-hidden bg-linear-to-b from-[#12100d] via-[#1c1813] to-[#131313] pt-24 pb-8 md:pt-32 md:pb-10 flex flex-col items-center text-center px-6">
        {/* Subtle warm golden background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-3xl aspect-2/1 rounded-full bg-accent-gold/2.5 blur-[100px] pointer-events-none -z-10" />

        <span className="reveal-meta text-[10px] font-sans font-bold tracking-[0.25em] text-accent-gold-dark uppercase">
          FEATURED WORK
        </span>
        <h2 
          ref={headingRef}
          className="split-header text-4xl md:text-5xl lg:text-6xl font-serif font-black text-obsidian mt-2 select-none"
        >
          <span className="inline-block overflow-hidden pb-1">
            {splitText("Work That Speaks For Itself")}
          </span>
          <span className="inline-block overflow-hidden pb-1 text-accent-gold-dark">
            {splitText(".")}
          </span>
        </h2>
        <p className="reveal-meta text-xs md:text-sm text-stone-500 font-sans mt-3">
          A selection of recent projects we’re proud of.
        </p>
        <button 
          onClick={handleViewAllClick}
          className="reveal-meta mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full border border-obsidian/15 hover:border-accent-gold text-[10px] font-sans font-bold tracking-wider text-obsidian hover:text-accent-gold-dark uppercase transition-all duration-300 hover:bg-accent-gold/5 cursor-pointer"
        >
          View All Works <ArrowRight className="h-3 w-3 text-accent-gold-dark" />
        </button>
      </div>

      {/* 2. Pinned Horizontal Track - Full-screen layout */}
      <div 
        ref={containerRef}
        id="projects"
        className="relative h-screen w-full overflow-hidden bg-[#131313]"
      >
        {/* Horizontal Scroll Track Wrapper */}
        <div 
          ref={scrollRef}
          className="absolute top-0 left-0 flex h-full items-center"
          style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
        >
          {/* Full Screen Project Cards */}
          {projects.map((project, idx) => (
            <div 
              key={project.id}
              className="project-card relative shrink-0 w-screen h-screen flex flex-col md:flex-row justify-between bg-[#131313] pt-24 pb-24 md:pt-32 md:pb-28 px-8 md:px-24 overflow-hidden group select-none cursor-default border-r border-white/5"
              style={{ 
                opacity: idx === currentCardIndex ? 1 : 0.4,
                scale: idx === currentCardIndex ? 1 : 0.98,
                transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), scale 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform, opacity"
              }}
            >
              {/* Elegant champagne background shadows */}
              <div className={`absolute -right-32 -bottom-32 -z-10 h-96 w-96 rounded-full bg-linear-to-tr ${project.color} blur-[100px] group-hover:scale-110 transition-transform duration-1000`} />
              
              {/* Left Column: Information */}
              <div className="w-full md:w-[45%] flex flex-col justify-start h-full whitespace-normal mt-4 md:mt-10">
                <div className="text-[12px] font-sans font-bold tracking-wider text-accent-gold-dark mb-4">
                  {project.number}
                </div>
                
                {/* One-Line Classy Serif Title */}
                <h4 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black leading-tight text-white uppercase tracking-wide group-hover:text-accent-gold transition-colors duration-350 whitespace-nowrap overflow-hidden text-ellipsis">
                  {project.title}
                </h4>

                <div className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-accent-gold mt-2 block">
                  {project.cardTagline}
                </div>

                {/* Thin gold divider */}
                <div className="w-14 h-[1.5px] bg-accent-gold/30 my-6" />

                <p className="max-w-md text-xs md:text-sm text-stone-400 font-sans leading-relaxed font-light">
                  {project.tagline}
                </p>

                {/* Specs block inside card */}
                <div className="my-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-accent-gold">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[8px] font-sans font-bold tracking-widest text-stone-500 uppercase">
                        SERVICE
                      </span>
                      <span className="text-xs md:text-sm font-serif italic text-white/90 font-light">
                        {project.service}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-accent-gold">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[8px] font-sans font-bold tracking-widest text-stone-500 uppercase">
                        OUTCOME
                      </span>
                      <span className="text-xs md:text-sm font-serif italic text-accent-gold font-normal">
                        {project.outcome}
                      </span>
                    </div>
                  </div>
                </div>

                {/* VIEW PROJECT Outline Pill Button with Direct Hover Actions */}
                <div className="mt-5 flex">
                  <button className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 group-hover:border-accent-gold group-hover:bg-accent-gold/10 text-[9px] md:text-[10px] font-sans font-bold tracking-widest text-white group-hover:text-accent-gold uppercase transition-all duration-300 hover:bg-accent-gold! hover:text-black! hover:border-accent-gold! hover:scale-105 hover:shadow-[0_0_15px_rgba(212,175,55,0.45)] active:scale-95 cursor-pointer">
                    View Project <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 group-hover/btn:translate-x-2" />
                  </button>
                </div>
              </div>

              {/* Right Column: Immersive Large CSS Mockups */}
              <div className="w-full md:w-[55%] h-full relative flex items-start justify-center p-6 select-none mt-6 md:mt-0 pt-8 md:pt-16">
                <div className="relative w-full max-w-[420px] md:max-w-[560px] aspect-16/10 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden group-hover:scale-[1.01] transition-transform duration-700">
                  {/* Screen Bezel */}
                  <div className="relative flex-1 bg-black p-1.5 pb-2.5 flex flex-col overflow-hidden">
                    <div className="w-full h-full relative rounded-md overflow-hidden bg-zinc-950">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover object-center"
                      />
                      {/* Subtle glare reflection */}
                      <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                    </div>
                  </div>
                  {/* Laptop Lip / Base */}
                  <div className="h-[7px] bg-zinc-800 border-t border-zinc-700 rounded-b-xl w-full flex items-center justify-center relative">
                    <div className="w-16 h-[3px] bg-zinc-900 rounded-full" />
                  </div>
                </div>

                {/* Overlapping mobile phone mockup */}
                <div className="absolute left-[5%] md:left-[10%] bottom-[12%] md:bottom-[10%] w-[110px] sm:w-[130px] md:w-[150px] aspect-9/19.5 bg-zinc-950 rounded-[20px] md:rounded-[26px] border-[2.5px] md:border-[3.5px] border-zinc-800 shadow-2xl overflow-hidden z-20 flex flex-col group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500">
                  {/* Dynamic island notches */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[35%] h-2.5 bg-black rounded-full z-30" />
                  
                  {/* Custom rendered app style view */}
                  <div className={`relative flex-1 flex flex-col justify-between p-3 select-none text-white ${project.mobileTheme.bg}`}>
                    {/* Mini-app Header */}
                    <div className="flex items-center justify-between text-[6px] font-sans font-bold tracking-widest opacity-80 pt-0.5">
                      <span className="font-serif italic font-black text-[8.5px] text-accent-gold">{project.mobileTheme.logo}</span>
                      <div className="flex flex-col gap-0.5 w-3.5 items-end">
                        <div className="h-[1.5px] w-full bg-white rounded-full" />
                        <div className="h-[1.5px] w-2/3 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Mini-app content */}
                    <div className="my-auto flex flex-col items-center text-center">
                      <div className="text-[5.5px] font-sans tracking-[0.2em] uppercase text-accent-gold mb-0.5">{project.cardTagline}</div>
                      <h5 className="font-serif text-[10px] font-bold leading-tight tracking-wide mb-0.5 uppercase">{project.title}</h5>
                      <div className="w-3 h-[0.5px] bg-accent-gold/40 my-0.5" />
                      <p className="text-[5px] font-sans text-stone-300 max-w-[95%] leading-relaxed">{project.mobileTheme.tagline}</p>
                    </div>

                    {/* Mini-app action */}
                    <div className="mt-auto pt-1 flex justify-center">
                      <div className="w-full py-0.5 text-center bg-white text-black font-sans font-bold text-[4.5px] tracking-widest uppercase rounded-full shadow-md">
                        {project.mobileTheme.cta}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Symmetrical Left/Right Floating Navigation Arrows */}
        {currentCardIndex > 0 && (
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-6 md:left-12 top-[46%] md:top-[42%] -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-dark-card/90 border border-obsidian/10 text-obsidian shadow-lg hover:bg-accent-gold/10 hover:border-accent-gold hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer pointer-events-auto"
          >
            <ChevronLeft className="h-6 w-6 text-current" />
          </button>
        )}

        {currentCardIndex < projects.length - 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-6 md:left-auto md:right-12 top-[46%] md:top-[42%] -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-dark-card/90 border border-obsidian/10 text-obsidian shadow-lg hover:bg-accent-gold/10 hover:border-accent-gold hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer pointer-events-auto"
          >
            <ChevronRight className="h-6 w-6 text-current" />
          </button>
        )}

        {/* Symmetrical Luxury Bottom Progress Bar */}
        <div className="absolute bottom-10 left-6 md:left-24 right-6 md:right-24 z-20 flex items-center gap-4 select-none">
          <span className="font-mono text-[9px] text-white/50">[ 01 ]</span>
          <div className="flex-1 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
            <div 
              ref={progressFillRef}
              className="absolute top-0 left-0 h-full w-full bg-accent-gold origin-left scale-x-0"
            />
          </div>
          <span className="font-mono text-[9px] text-white/50">[ {projects.length.toString().padStart(2, '0')} ]</span>
        </div>
      </div>
    </div>
  );
};

export default HorizontalProjects;
