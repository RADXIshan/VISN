import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Eye, Compass, Megaphone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

const BentoServices = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // States to count up statistical indicators
  const [stats, setStats] = useState({ speed: 0, conversion: 0 });

  // Canvas interaction inside Interactive Development Bento Box (Champagne theme)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = 200);

    const particles = [];
    const maxParticles = 40;

    class MiniParticle {
      constructor(x, y) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 1.6 + 0.6;
        this.alpha = 1;
        this.life = Math.random() * 50 + 50;
        this.maxLife = this.life;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        this.alpha = this.life / this.maxLife;
        this.life--;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 242, 235, ${this.alpha * 0.4})`; // Neutral obsidian particles
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new MiniParticle());
    }

    let animationId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();
        
        if (p1.life <= 0) {
          particles[i] = new MiniParticle();
        }

        // Connect node neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 55) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 242, 235, ${(1 - dist / 55) * 0.14})`; // Neutral lines
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Inject particle tracking on cursor vector
      if (particles.length > 0) {
        particles.shift();
        particles.push(new MiniParticle(x, y));
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Stats counting ScrollTrigger
  useEffect(() => {
    const statsObj = { speed: 0, conversion: 0 };
    const tween = gsap.fromTo(statsObj, 
      { speed: 0, conversion: 0 },
      {
        speed: 99,
        conversion: 260,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
          toggleActions: "restart none play none"
        },
        onUpdate: () => {
          setStats({
            speed: Math.floor(statsObj.speed),
            conversion: Math.floor(statsObj.conversion)
          });
        }
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  // Bento Grid entrance reveal animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const titleEl = container.querySelector('.bento-title-section');
    const headerTitle = container.querySelector('.split-header');
    const chars = headerTitle ? headerTitle.querySelectorAll('.char-span') : [];
    const titleMeta = titleEl ? titleEl.querySelectorAll('h2, .bento-desc, .header-dot') : [];
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current].filter(Boolean);

    // Initial hidden state
    gsap.set(chars, { y: "115%", opacity: 0 });
    gsap.set(titleMeta, { opacity: 0, y: 20 });
    gsap.set(cards, { 
      opacity: 0, 
      y: 80, 
      rotateX: 8, 
      skewY: 2, 
      transformOrigin: "center top" 
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 78%",
        toggleActions: "play reverse play reverse"
      }
    });

    // Animate letters
    if (chars.length) {
      tl.to(chars, {
        y: "0%",
        opacity: 1,
        duration: 0.6,
        stagger: 0.01,
        ease: "power3.out"
      });
    }

    // Animate title meta (description & category tags)
    tl.to(titleMeta, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out"
    }, "-=0.45");

    // Animate cards
    tl.to(cards, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      skewY: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power4.out"
    }, "-=0.5");

    return () => {
      tl.kill();
    };
  }, []);

  // 3D Card Hover Tilts and Offset handlers using optimized gsap.quickTo
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);
  const cardTweens = useRef({});

  const getCardTweens = (cardId, card) => {
    if (!cardTweens.current[cardId]) {
      const icon = card.querySelector('.bento-icon');
      const text = card.querySelector('.bento-text');
      cardTweens.current[cardId] = {
        rotateY: gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" }),
        rotateX: gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" }),
        iconX: icon ? gsap.quickTo(icon, "x", { duration: 0.4, ease: "power2.out" }) : null,
        iconY: icon ? gsap.quickTo(icon, "y", { duration: 0.4, ease: "power2.out" }) : null,
        textX: text ? gsap.quickTo(text, "x", { duration: 0.4, ease: "power2.out" }) : null,
        textY: text ? gsap.quickTo(text, "y", { duration: 0.4, ease: "power2.out" }) : null,
      };
      gsap.set(card, { transformPerspective: 1000 });
    }
    return cardTweens.current[cardId];
  };

  const handleCardMouseMove = (e, ref, cardId) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc; // value between -1 and 1
    const dy = (y - yc) / yc; // value between -1 and 1
    
    const tweens = getCardTweens(cardId, card);
    tweens.rotateY(dx * 6);
    tweens.rotateX(-dy * 6);
    if (tweens.iconX) {
      tweens.iconX(dx * 8);
      tweens.iconY(dy * 8);
    }
    if (tweens.textX) {
      tweens.textX(dx * 4);
      tweens.textY(dy * 4);
    }
  };

  const handleCardMouseLeave = (ref, cardId) => {
    const card = ref.current;
    if (!card) return;

    const tweens = cardTweens.current[cardId];
    if (tweens) {
      tweens.rotateY(0);
      tweens.rotateX(0);
      if (tweens.iconX) {
        tweens.iconX(0);
        tweens.iconY(0);
      }
      if (tweens.textX) {
        tweens.textX(0);
        tweens.textY(0);
      }
    } else {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        ease: "power3.out",
        duration: 0.7
      });
      const icon = card.querySelector('.bento-icon');
      if (icon) {
        gsap.to(icon, { x: 0, y: 0, ease: "power3.out", duration: 0.7 });
      }
      const text = card.querySelector('.bento-text');
      if (text) {
        gsap.to(text, { x: 0, y: 0, ease: "power3.out", duration: 0.7 });
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      id="services"
      className="relative min-h-screen w-full px-6 py-28 md:px-12 bg-linear-to-b from-[#12100d] via-[#14120f] to-[#100f0d] z-10 overflow-hidden"
    >
      {/* Subtle neutral background glow */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-accent-gold/1 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        {/* Title and description */}
        <div className="bento-title-section flex flex-col md:flex-row items-start justify-between gap-6 mb-16 select-none">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="header-dot h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
                CAPABILITIES
              </h2>
            </div>
            <h3 className="split-header text-3xl md:text-5xl font-serif font-bold leading-tight uppercase text-obsidian">
              <span className="inline-block overflow-hidden pb-1">
                {splitText("WHAT WE DO")}
              </span>
              <br />
              <span className="inline-block overflow-hidden pb-1 text-accent-gold">
                {splitText("BEST")}
              </span>
            </h3>
          </div>
          <p className="bento-desc max-w-xs text-xs md:text-sm text-obsidian/70 font-serif italic font-light leading-relaxed">
            By combining high-performance code engineering and editorial visual layout, we form websites that define your brand.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Interactive Dev */}
          <div 
            ref={card1Ref}
            onMouseMove={(e) => handleCardMouseMove(e, card1Ref, 1)}
            onMouseLeave={() => handleCardMouseLeave(card1Ref, 1)}
            className="md:col-span-2 relative min-h-[300px] flex flex-col justify-between rounded-3xl border border-obsidian/10 bg-[#1a1815]/45 p-8 overflow-hidden group select-none transition-shadow duration-300"
            style={{ 
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.01)',
              transformStyle: "preserve-3d"
            }}
          >
            {/* Hover Canvas particle mesh */}
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 h-full w-full opacity-60 z-0 cursor-none"
            />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="bento-icon flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian/5 border border-obsidian/10 text-accent-gold-dark">
                <Code className="h-5 w-5" />
              </div>
              <span className="font-mono text-[9px] text-obsidian/45 tracking-wider">[ DEV // LABS ]</span>
            </div>

            <div className="bento-text relative z-10 mt-16">
              <h4 className="text-lg md:text-xl font-serif font-bold text-obsidian mb-2 uppercase tracking-wide">
                INTERACTIVE DEVELOPMENT
              </h4>
              <p className="max-w-md text-xs text-obsidian/75 font-serif italic font-light leading-relaxed">
                We craft fluid React websites, interactive Canvas apps, and high-performance layouts that load instantly. Hover and move your mouse above this panel to test interactive particle physics.
              </p>
            </div>
          </div>

          {/* Card 2: Branding */}
          <div 
            ref={card2Ref}
            onMouseMove={(e) => handleCardMouseMove(e, card2Ref, 2)}
            onMouseLeave={() => handleCardMouseLeave(card2Ref, 2)}
            className="relative min-h-[300px] flex flex-col justify-between rounded-3xl border border-obsidian/10 bg-[#1a1815]/45 p-8 overflow-hidden group select-none transition-shadow duration-300"
            style={{ 
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.01)',
              transformStyle: "preserve-3d"
            }}
          >
            <div className="flex items-center justify-between">
              <div className="bento-icon flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian/5 border border-obsidian/10 text-accent-gold-dark">
                <Compass className="h-5 w-5" />
              </div>
              <span className="font-mono text-[9px] text-obsidian/45 tracking-wider">[ IDENTITY // ART ]</span>
            </div>

            {/* Rotating SVG orbits layout */}
            <div className="my-5 flex items-center justify-center relative h-24 pointer-events-none">
              <div className="absolute h-20 w-20 rounded-full border border-obsidian/5 flex items-center justify-center animate-[spin_16s_linear_infinite]" />
              <div className="absolute h-14 w-14 rounded-full border border-accent-gold/20 flex items-center justify-center animate-[spin_10s_linear_infinite_reverse]">
                <div className="h-1.5 w-1.5 rounded-full bg-accent-gold absolute top-0 shadow-[0_0_6px_#B59B75]" />
              </div>
              <div className="absolute h-8 w-8 rounded-full border border-obsidian/10 animate-[spin_6s_linear_infinite]" />
            </div>

            <div className="bento-text">
              <h4 className="text-lg font-serif font-bold text-obsidian mb-2 uppercase tracking-wide">
                BRANDING & IDENTITY
              </h4>
              <p className="text-xs text-obsidian/75 font-serif italic font-light leading-relaxed">
                Responsive design systems, typography blueprints, and high-contrast digital interfaces engineered to build immediate digital authority.
              </p>
            </div>
          </div>

          {/* Card 3: Campaigns */}
          <div 
            ref={card3Ref}
            onMouseMove={(e) => handleCardMouseMove(e, card3Ref, 3)}
            onMouseLeave={() => handleCardMouseLeave(card3Ref, 3)}
            className="relative min-h-[300px] flex flex-col justify-between rounded-3xl border border-obsidian/10 bg-[#1a1815]/45 p-8 overflow-hidden group select-none transition-shadow duration-300"
            style={{ 
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.01)',
              transformStyle: "preserve-3d"
            }}
          >
            <div className="flex items-center justify-between">
              <div className="bento-icon flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian/5 border border-obsidian/10 text-accent-gold-dark">
                <Megaphone className="h-5 w-5" />
              </div>
              <span className="font-mono text-[9px] text-obsidian/45 tracking-wider">[ GROWTH // CODE ]</span>
            </div>

            {/* Live metric counters */}
            <div className="my-5 flex items-end gap-6 h-20 pointer-events-none">
              <div>
                <p className="text-3xl font-serif font-bold text-obsidian">{stats.speed}%</p>
                <p className="text-[9px] text-obsidian/45 tracking-wider mt-1">Page Speed</p>
              </div>
              <div className="h-10 w-px bg-obsidian/10" />
              <div>
                <p className="text-3xl font-serif font-bold text-accent-gold-dark">+{stats.conversion}%</p>
                <p className="text-[9px] text-obsidian/45 tracking-wider mt-1">Conversion</p>
              </div>
            </div>

            <div className="bento-text">
              <h4 className="text-lg font-serif font-bold text-obsidian mb-2 uppercase tracking-wide">
                MARKETING SYSTEMS
              </h4>
              <p className="text-xs text-obsidian/75 font-serif italic font-light leading-relaxed">
                Tailored search engine index automation, data funnels, user conversion pathways, and strategy.
              </p>
            </div>
          </div>

          {/* Card 4: Creative Direction */}
          <div 
            ref={card4Ref}
            onMouseMove={(e) => handleCardMouseMove(e, card4Ref, 4)}
            onMouseLeave={() => handleCardMouseLeave(card4Ref, 4)}
            className="md:col-span-2 relative min-h-[300px] flex flex-col justify-between rounded-3xl border border-obsidian/10 bg-[#1a1815]/45 p-8 overflow-hidden group select-none transition-shadow duration-300"
            style={{ 
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.01)',
              transformStyle: "preserve-3d"
            }}
          >
            <div className="flex items-center justify-between">
              <div className="bento-icon flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian/5 border border-obsidian/10 text-accent-gold-dark">
                <Eye className="h-5 w-5" />
              </div>
              <span className="font-mono text-[9px] text-obsidian/45 tracking-wider">[ CREATIVE // ART ]</span>
            </div>

            {/* CSS Marquee Loops */}
            <div className="my-6 overflow-hidden flex flex-col gap-2 pointer-events-none opacity-30 select-none">
              <div className="marquee-wrapper flex whitespace-nowrap gap-4 text-[10px] font-bold uppercase tracking-widest text-obsidian/70">
                <span className="animate-[marquee_20s_linear_infinite]">Art Direction • UI Design • Copywriting • motion concepts • concept board • Art Direction • UI Design • Copywriting • motion concepts • concept board •</span>
              </div>
              <div className="marquee-wrapper flex whitespace-nowrap gap-4 text-[10px] font-bold uppercase tracking-widest text-obsidian/25">
                <span className="animate-[marquee_15s_linear_infinite_reverse]">Photoreal renders • audio soundscapes • VFX styling • video reels • Photoreal renders • audio soundscapes • VFX styling • video reels •</span>
              </div>
            </div>

            <div className="bento-text">
              <h4 className="text-lg md:text-xl font-serif font-bold text-obsidian mb-2 uppercase tracking-wide">
                CREATIVE DIRECTION
              </h4>
              <p className="max-w-md text-xs text-obsidian/75 font-serif italic font-light leading-relaxed">
                We blueprint modern visual languages, responsive video mockups, structural design grids, and sound effects to unify creative software projects.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BentoServices;
