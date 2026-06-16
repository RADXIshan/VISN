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
    icon: <Cpu className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-accent-gold/15 to-accent-gold-dark/5",
    image: "/images/neural-net.png"
  },
  {
    id: "02",
    title: "KINETIC LABS",
    category: "Interactive Brand",
    year: "2025",
    tagline: "Sculpting immersive physical-digital brand experiences.",
    icon: <Orbit className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-accent-gold-dark/15 to-stone-400/5",
    image: "/images/kinetic-labs.png"
  },
  {
    id: "03",
    title: "ECLIPSE CORP",
    category: "Creative Campaign",
    year: "2026",
    tagline: "Generating explosive viral campaigns across neural feeds.",
    icon: <Radio className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-amber-600/10 to-accent-gold/5",
    image: "/images/eclipse-corp.png"
  },
  {
    id: "04",
    title: "CYBER DOCK",
    category: "Web3 Platform",
    year: "2026",
    tagline: "Forging next-generation smart contract visual explorers.",
    icon: <Layers className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-stone-500/10 to-accent-gold-dark/5",
    image: "/images/cyber-dock.png"
  }
];

const HorizontalProjects = () => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const progressFillRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const container = containerRef.current;
    const progressFill = progressFillRef.current;
    if (!scrollContainer || !container || !progressFill) return;

    // Shift width is: element total width minus browser viewport width
    const getScrollWidth = () => scrollContainer.scrollWidth - window.innerWidth;
    const getScrollLimit = () => Math.max(0, getScrollWidth() - window.innerWidth * 0.08);

    const scrollTween = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1.2,
        start: "top top",
        end: () => `+=${getScrollLimit()}`,
        invalidateOnRefresh: true
      }
    });

    scrollTween.to(scrollContainer, {
      x: () => -getScrollLimit(),
      ease: "power2.inOut",
    }, 0);

    scrollTween.fromTo(progressFill,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "power2.inOut",
      },
      0
    );

    // Parallax on images inside horizontal sliding cards
    const images = scrollContainer.querySelectorAll('.project-image');
    images.forEach((img) => {
      gsap.fromTo(img, 
        { xPercent: -15 },
        {
          xPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest('.project-card'),
            containerAnimation: scrollTween,
            start: "left right",
            end: "right left",
            scrub: 1.2
          }
        }
      );
    });

    // Subtle card velocity skew
    const cards = scrollContainer.querySelectorAll('.project-card');
    cards.forEach((card) => {
      gsap.to(card, {
        skewX: -1.0,
        ease: "power1.out",
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween,
          start: "left right",
          end: "right left",
          scrub: 1.2
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
          scrub: 1.2
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
      className="relative h-screen w-full overflow-hidden bg-transparent"
    >
      <div 
        ref={scrollRef}
        className="absolute top-0 left-0 flex h-full items-center pl-6 md:pl-24 pr-[15vw] gap-10 md:gap-16 whitespace-nowrap"
      >
        {/* Introduction Slide */}
        <div className="shrink-0 flex h-[50vh] w-[300px] md:w-[420px] flex-col justify-between whitespace-normal select-none pr-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
                SELECTED WORKS
              </h2>
            </div>
            <h3 className="text-4xl md:text-5xl font-serif font-bold leading-tight uppercase text-obsidian">
              CRAFTING <br />
              <span className="text-accent-gold italic font-normal">DIGITAL</span> <br />
              INSTALLATIONS
            </h3>
          </div>
          <p className="text-xs md:text-sm text-obsidian/70 font-serif italic font-light max-w-xs leading-relaxed">
            Scroll down or swipe to traverse our physical-digital installations. Hovering exposes detail coordinates.
          </p>
        </div>

        {/* Dynamic Project Cards */}
        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={handleLinkClick}
            className="project-card relative shrink-0 flex h-[68vh] w-[75vw] sm:w-[50vw] md:w-[34vw] flex-col justify-between rounded-3xl border border-obsidian/10 bg-dark-card/50 p-6 md:p-8 backdrop-blur-md overflow-hidden group select-none cursor-none transition-[background-color,border-color,box-shadow,color] duration-300"
            data-cursor="view"
            style={{ 
              boxShadow: `inset 0 0 30px rgba(0,0,0,0.01), 0 15px 35px rgba(0,0,0,0.03)`,
              willChange: "transform"
            }}
          >
            {/* Elegant champagne background shadows */}
            <div className={`absolute -right-24 -bottom-24 -z-10 h-64 w-64 rounded-full bg-linear-to-tr ${project.color} blur-[60px] group-hover:scale-125 transition-transform duration-750`} />
            
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian/5 border border-obsidian/10 text-obsidian">
                {project.icon}
              </div>
              <span className="font-mono text-[9px] text-obsidian/45 tracking-wider">
                [ {project.year} ]
              </span>
            </div>

            {/* Parallax Image Frame */}
            <div className="w-full h-[28vh] overflow-hidden rounded-2xl relative border border-obsidian/10 bg-stone-100 my-4">
              <img 
                src={project.image} 
                alt={project.title}
                className="project-image absolute top-0 left-[-15%] w-[130%] h-full object-cover object-center"
                style={{ willChange: "transform" }}
              />
            </div>

            {/* Core titles */}
            <div className="my-2 whitespace-normal">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-accent-gold-dark mb-1 block">
                {project.category}
              </span>
              <h4 className="text-xl md:text-2xl font-serif font-bold leading-none uppercase tracking-wide text-obsidian mb-2 group-hover:text-accent-gold-dark transition-all duration-300">
                {project.title}
              </h4>
              <p className="max-w-xs text-xs text-obsidian/75 font-serif italic font-light leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Bottom links */}
            <div className="flex items-center justify-between border-t border-obsidian/10 pt-4">
              <span className="font-serif italic font-medium text-[11px] tracking-wide text-obsidian">
                CASE STUDY
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-obsidian/5 border border-obsidian/10 group-hover:bg-obsidian group-hover:text-dark-bg transition-all duration-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Symmetrical Luxury Bottom Progress Bar */}
      <div className="absolute bottom-10 left-6 md:left-24 right-6 md:right-24 z-20 flex items-center gap-4 select-none">
        <span className="font-mono text-[9px] text-obsidian/45">[ 01 ]</span>
        <div className="flex-1 h-[2px] bg-obsidian/10 relative overflow-hidden rounded-full">
          <div 
            ref={progressFillRef}
            className="absolute top-0 left-0 h-full w-full bg-accent-gold origin-left scale-x-0"
          />
        </div>
        <span className="font-mono text-[9px] text-obsidian/45">[ {projects.length.toString().padStart(2, '0')} ]</span>
      </div>
    </div>
  );
};

export default HorizontalProjects;
