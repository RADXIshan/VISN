import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
    image: "/images/neural-net.png",
    description: "Neural Net is a cutting-edge artificial intelligence platform designed to automate enterprise cloud scaling and optimization. By leveraging advanced deep learning models, it predicts infrastructure bottlenecks before they occur, reducing server overhead by up to 43% and ensuring 99.999% uptime for global systems.",
    specs: [
      { label: "Client", value: "Neural Technologies Inc." },
      { label: "Role", value: "Creative Direction & Frontend" },
      { label: "Stack", value: "React, GSAP, Tailwind, Node.js" },
      { label: "Deliverable", value: "Cloud Dashboard & Design System" }
    ]
  },
  {
    id: "02",
    title: "KINETIC LABS",
    category: "Interactive Brand",
    year: "2025",
    tagline: "Sculpting immersive physical-digital brand experiences.",
    icon: <Orbit className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-accent-gold-dark/15 to-stone-400/5",
    image: "/images/kinetic-labs.png",
    description: "Kinetic Labs is a physical-digital experimental installation showcasing interactive kinetic sculptures. Our frontend engineering integrates live WebSockets and physical sensors to mirror mechanical motions in high-fidelity 3D browser canvases in real-time, creating a fully synchronized dual-sensory experience.",
    specs: [
      { label: "Client", value: "Kinetic Art Gallery" },
      { label: "Role", value: "Creative Direction" },
      { label: "Stack", value: "React, Three.js, WebSockets, GSAP" },
      { label: "Deliverable", value: "Immersive Exhibit & Frontend" }
    ]
  },
  {
    id: "03",
    title: "ECLIPSE CORP",
    category: "Creative Campaign",
    year: "2026",
    tagline: "Generating explosive viral campaigns across neural feeds.",
    icon: <Radio className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-amber-600/10 to-accent-gold/5",
    image: "/images/eclipse-corp.png",
    description: "Eclipse Corp is a digital marketing ecosystem automating high-density search index scaling and content distribution. Our implementation features self-optimizing semantic funnels and interactive data boards, increasing viral reach by 260% across decentralized networks.",
    specs: [
      { label: "Client", value: "Eclipse Holdings" },
      { label: "Role", value: "UX Strategy & Development" },
      { label: "Stack", value: "Astro, GSAP, Serverless Functions" },
      { label: "Deliverable", value: "Marketing Funnels & Analytics" }
    ]
  },
  {
    id: "04",
    title: "CYBER DOCK",
    category: "Web3 Platform",
    year: "2026",
    tagline: "Forging next-generation smart contract visual explorers.",
    icon: <Layers className="h-5 w-5 text-accent-gold-dark" />,
    color: "from-stone-500/10 to-accent-gold-dark/5",
    image: "/images/cyber-dock.png",
    description: "Cyber Dock is a Web3 visual explorer and analytics dashboard for smart contracts. By transforming raw cryptographic transactions into flowing node topologies, users can inspect transaction histories, state mutations, and contract dependencies with unprecedented visual clarity.",
    specs: [
      { label: "Client", value: "CyberDock Protocol" },
      { label: "Role", value: "UI/UX Engineering" },
      { label: "Stack", value: "Next.js, Three.js, Solidity, Tailwind" },
      { label: "Deliverable", value: "Visual Block Explorer" }
    ]
  }
];

const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!project) return;

    const tl = gsap.timeline();
    
    gsap.set(backdropRef.current, { opacity: 0 });
    gsap.set(boxRef.current, { opacity: 0, y: 50, scale: 0.95 });

    tl.to(backdropRef.current, {
      opacity: 1,
      duration: 0.45,
      ease: "power2.out"
    })
    .to(boxRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: "back.out(1.2)"
    }, "-=0.25");

    return () => {
      tl.kill();
    };
  }, [project]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose
    });

    tl.to(boxRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.96,
      duration: 0.35,
      ease: "power2.in"
    })
    .to(backdropRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    }, "-=0.2");
  };

  return (
    <div 
      ref={modalRef} 
      className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10 select-none"
    >
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-dark-bg/60 backdrop-blur-2xl" 
        onClick={handleClose}
      />
      
      <div 
        ref={boxRef}
        className="relative w-full max-w-5xl h-[85vh] md:h-[75vh] bg-dark-card border border-obsidian/10 rounded-[32px] overflow-hidden flex flex-col md:flex-row z-10 shadow-2xl"
      >
        <div className="w-full md:w-1/2 h-[30vh] md:h-full overflow-hidden relative border-b md:border-b-0 md:border-r border-obsidian/10">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-obsidian/20 via-transparent to-transparent" />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between overflow-y-auto bg-dark-card">
          <div>
            <div className="flex items-center justify-between mb-4 md:mb-6 pr-12">
              <span className="text-[10px] font-bold tracking-[0.25em] text-accent-gold-dark uppercase">
                {project.category}
              </span>
              <span className="font-mono text-[10px] text-obsidian/45 tracking-wider">
                [ {project.year} ]
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-serif font-black uppercase text-obsidian tracking-wide mb-3 md:mb-4">
              {project.title}
            </h2>

            <p className="text-xs md:text-sm font-serif italic text-accent-gold-dark mb-4 md:mb-6 leading-relaxed">
              {project.tagline}
            </p>

            <p className="text-xs md:text-sm text-obsidian/75 font-serif italic font-light leading-relaxed mb-6 md:mb-8">
              {project.description}
            </p>

            <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4 pt-4 md:pt-6 border-t border-obsidian/10">
              {project.specs.map((spec, index) => (
                <div key={index}>
                  <span className="block text-[8px] font-bold tracking-widest text-obsidian/40 uppercase mb-1">
                    {spec.label}
                  </span>
                  <span className="text-xs font-serif italic text-obsidian font-medium">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-obsidian/10 flex items-center justify-between">
            <span className="font-mono text-[9px] text-obsidian/45 uppercase">[ CASE STUDY // DEPT ]</span>
            <button 
              onClick={handleClose}
              className="flex h-10 px-6 items-center justify-center rounded-full bg-obsidian text-dark-bg hover:bg-accent-gold hover:text-white transition-all duration-300 font-sans text-[10px] font-bold uppercase tracking-wider cursor-pointer"
            >
              Close Project
            </button>
          </div>
        </div>

          <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-obsidian/5 border border-obsidian/10 hover:bg-obsidian hover:text-dark-bg transition-all duration-300 text-obsidian cursor-pointer font-bold text-lg"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

const HorizontalProjects = () => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const progressFillRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.classList.add('modal-open');
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.classList.remove('modal-open');
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedProject]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const container = containerRef.current;
    const progressFill = progressFillRef.current;
    if (!scrollContainer || !container || !progressFill) return;

    // Shift width is: element total width minus browser viewport width
    const getScrollWidth = () => scrollContainer.scrollWidth - window.innerWidth;
    const getScrollLimit = () => Math.max(0, getScrollWidth() - window.innerWidth * 0.08);

    // Smooth horizontal scroll with refined easing for a buttery experience
    const scrollTween = gsap.to(scrollContainer, {
      x: () => -getScrollLimit(),
      // Using a subtle ease for smoother motion instead of a harsh linear feel
      ease: "power2.out",
      scrollTrigger: {
        trigger: container,
        pin: true,
        // Increased scrub duration for more fluid scrolling
        scrub: 2.5,
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
        }
      }
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
            onClick={() => setSelectedProject(project)}
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
                className="w-full h-full object-cover object-center"
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

      {selectedProject && createPortal(
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />,
        document.body
      )}
    </div>
  );
};

export default HorizontalProjects;
