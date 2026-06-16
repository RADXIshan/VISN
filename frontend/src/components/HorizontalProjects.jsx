import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Cpu, Layers, Radio, Orbit } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "01",
    title: "NEURAL NET",
    category: "AI Platform / Strategy",
    year: "2026",
    tagline: "Building neural intelligence tools for enterprise cloud systems.",
    icon: <Cpu className="h-5 w-5 text-accent-cyan text-glow-cyan" />,
    color: "from-accent-cyan/15 to-blue-600/5"
  },
  {
    id: "02",
    title: "KINETIC LABS",
    category: "Interactive Brand",
    year: "2025",
    tagline: "Sculpting immersive physical-digital brand experiences.",
    icon: <Orbit className="h-5 w-5 text-purple-400 text-glow-purple" />,
    color: "from-[#7000ff]/15 to-pink-600/5"
  },
  {
    id: "03",
    title: "ECLIPSE CORP",
    category: "Creative Campaign",
    year: "2026",
    tagline: "Generating explosive viral campaigns across neural feeds.",
    icon: <Radio className="h-5 w-5 text-rose-400" />,
    color: "from-rose-500/15 to-orange-600/5"
  },
  {
    id: "04",
    title: "CYBER DOCK",
    category: "Web3 Platform",
    year: "2026",
    tagline: "Forging next-generation smart contract visual explorers.",
    icon: <Layers className="h-5 w-5 text-emerald-400" />,
    color: "from-emerald-500/15 to-teal-600/5"
  }
];

const HorizontalProjects = () => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const container = containerRef.current;
    if (!scrollContainer || !container) return;

    // Shift width is: element total width minus browser viewport width
    const getScrollWidth = () => scrollContainer.scrollWidth - window.innerWidth;

    const scrollTween = gsap.to(scrollContainer, {
      x: () => -getScrollWidth(),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 0.5,
        start: "top top",
        end: () => `+=${getScrollWidth()}`,
        invalidateOnRefresh: true
      }
    });

    // Subtle card velocity skew
    const cards = scrollContainer.querySelectorAll('.project-card');
    cards.forEach((card) => {
      gsap.to(card, {
        skewX: -1.5,
        ease: "power1.out",
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween,
          start: "left right",
          end: "right left",
          scrub: true
        }
      });
      
      gsap.to(card, {
        skewX: 0,
        ease: "power1.out",
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween,
          start: "right left",
          end: "right left",
          scrub: true
        }
      });
    });

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container) t.kill();
      });
    };
  }, []);

  const handleLinkClick = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      ref={containerRef}
      id="projects"
      className="relative h-screen bg-transparent"
    >
      <div 
        ref={scrollRef}
        className="absolute top-0 left-0 flex h-full items-center pl-6 md:pl-24 pr-[15vw] gap-10 md:gap-16 whitespace-nowrap"
      >
        {/* Introduction Slide */}
        <div className="flex h-[55vh] w-[300px] md:w-[420px] flex-col justify-between whitespace-normal select-none pr-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_8px_#00f0ff]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                SELECTED WORKS
              </h2>
            </div>
            <h3 className="text-4xl md:text-5xl font-display font-black leading-tight uppercase text-white">
              CRAFTING <br />
              <span className="text-stroke-glow text-glow-cyan">DIGITAL</span> <br />
              ARTWORK
            </h3>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 font-light max-w-xs leading-relaxed">
            Scroll down or swipe to traverse our digital installations. Hovering exposes specialized detail panels.
          </p>
        </div>

        {/* Dynamic Project Nodes */}
        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={handleLinkClick}
            className="project-card relative flex h-[60vh] w-[80vw] sm:w-[55vw] md:w-[40vw] flex-col justify-between rounded-3xl border border-white/4 bg-[#070707]/60 p-8 md:p-10 backdrop-blur-md overflow-hidden group select-none cursor-none transition-all duration-300"
            data-cursor="view"
            style={{ 
              boxShadow: `inset 0 0 30px rgba(255,255,255,0.01), 0 20px 40px rgba(0,0,0,0.5)`
            }}
          >
            {/* Color flares */}
            <div className={`absolute -right-24 -bottom-24 -z-10 h-64 w-64 rounded-full bg-linear-to-tr ${project.color} blur-[70px] group-hover:scale-125 transition-transform duration-750`} />
            
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/6 text-white">
                {project.icon}
              </div>
              <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                [ {project.year} ]
              </span>
            </div>

            {/* Core titles */}
            <div className="my-auto whitespace-normal">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-accent-cyan mb-1.5 block">
                {project.category}
              </span>
              <h4 className="text-2xl md:text-4xl font-display font-black leading-none uppercase tracking-tighter text-white mb-3 group-hover:text-accent-cyan transition-all duration-300">
                {project.title}
              </h4>
              <p className="max-w-xs text-xs text-neutral-400 font-light leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Bottom links */}
            <div className="flex items-center justify-between border-t border-white/5 pt-5">
              <span className="font-display font-bold text-[10px] tracking-[0.3em] text-white">
                CASE STUDY
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/5 group-hover:bg-white group-hover:text-black transition-all duration-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalProjects;
