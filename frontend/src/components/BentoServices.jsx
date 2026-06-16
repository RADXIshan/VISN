import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Eye, Compass, Megaphone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const BentoServices = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // States to count up statistical indicators
  const [stats, setStats] = useState({ speed: 0, conversion: 0 });

  // Canvas interaction inside Interactive Development Bento Box
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
        this.vx = (Math.random() - 0.5) * 1.6;
        this.vy = (Math.random() - 0.5) * 1.6;
        this.radius = Math.random() * 1.8 + 0.8;
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
        ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha * 0.4})`;
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
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 55) * 0.12})`;
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
    const tween = gsap.to(statsObj, {
      speed: 99,
      conversion: 260,
      duration: 2.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 65%"
      },
      onUpdate: () => {
        setStats({
          speed: Math.floor(statsObj.speed),
          conversion: Math.floor(statsObj.conversion)
        });
      }
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="services"
      className="relative min-h-screen w-full px-6 py-28 md:px-12 bg-transparent z-10"
    >
      <div className="mx-auto max-w-6xl">
        {/* Title and stats summary */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-16 select-none">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_8px_#00f0ff]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                CAPABILITIES
              </h2>
            </div>
            <h3 className="text-3xl md:text-5xl font-display font-black leading-tight uppercase text-white">
              WHAT WE DO <br />
              <span className="text-stroke-glow text-glow-cyan">BEST</span>
            </h3>
          </div>
          <p className="max-w-xs text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
            By combining high-performance code engineering and digital art, we forge websites that look like custom awards.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Interactive Dev */}
          <div 
            className="md:col-span-2 relative min-h-[300px] flex flex-col justify-between rounded-3xl border border-white/4 bg-[#070707]/40 p-8 overflow-hidden group select-none"
            style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.01)' }}
          >
            {/* Hover Canvas particle mesh */}
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 h-full w-full opacity-60 z-0 cursor-none"
            />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/6 text-white">
                <Code className="h-5 w-5 text-accent-cyan" />
              </div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">[ DEV // LABS ]</span>
            </div>

            <div className="relative z-10 mt-16">
              <h4 className="text-lg md:text-xl font-display font-black text-white mb-2 uppercase tracking-wide">
                INTERACTIVE DEVELOPMENT
              </h4>
              <p className="max-w-md text-xs text-neutral-400 font-light leading-relaxed">
                We craft fluid React websites, interactive Canvas apps, and high-performance layouts that load instantly. Hover and move your mouse above this panel to test connection physics.
              </p>
            </div>
          </div>

          {/* Card 2: Branding */}
          <div 
            className="relative min-h-[300px] flex flex-col justify-between rounded-3xl border border-white/4 bg-[#070707]/40 p-8 overflow-hidden group select-none"
            style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.01)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/6 text-white">
                <Compass className="h-5 w-5 text-purple-400" />
              </div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">[ IDENTITY // ART ]</span>
            </div>

            {/* Rotating SVG orbits layout */}
            <div className="my-5 flex items-center justify-center relative h-24">
              <div className="absolute h-20 w-20 rounded-full border border-white/5 flex items-center justify-center animate-[spin_16s_linear_infinite]" />
              <div className="absolute h-14 w-14 rounded-full border border-accent-cyan/15 flex items-center justify-center animate-[spin_10s_linear_infinite_reverse]">
                <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan absolute top-0 shadow-[0_0_8px_#00f0ff]" />
              </div>
              <div className="absolute h-8 w-8 rounded-full border border-purple-500/20 animate-[spin_6s_linear_infinite]" />
            </div>

            <div>
              <h4 className="text-lg font-display font-black text-white mb-2 uppercase tracking-wide">
                BRANDING & IDENTITY
              </h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Responsive design systems, typography blueprints, and high-contrast digital interfaces engineered to build immediate digital authority.
              </p>
            </div>
          </div>

          {/* Card 3: Campaigns */}
          <div 
            className="relative min-h-[300px] flex flex-col justify-between rounded-3xl border border-white/4 bg-[#070707]/40 p-8 overflow-hidden group select-none"
            style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.01)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/6 text-white">
                <Megaphone className="h-5 w-5 text-rose-400" />
              </div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">[ GROWTH // CODE ]</span>
            </div>

            {/* Live metric counters */}
            <div className="my-5 flex items-end gap-6 h-20">
              <div>
                <p className="text-3xl font-display font-black text-white">{stats.speed}%</p>
                <p className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1">Page Speed</p>
              </div>
              <div className="h-10 w-px bg-white/5" />
              <div>
                <p className="text-3xl font-display font-black text-accent-cyan text-glow-cyan">+{stats.conversion}%</p>
                <p className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1">Conversion</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-display font-black text-white mb-2 uppercase tracking-wide">
                MARKETING SYSTEMS
              </h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Tailored search engine index automation, data funnels, user conversion pathways, and strategy.
              </p>
            </div>
          </div>

          {/* Card 4: Creative Direction */}
          <div 
            className="md:col-span-2 relative min-h-[300px] flex flex-col justify-between rounded-3xl border border-white/4 bg-[#070707]/40 p-8 overflow-hidden group select-none"
            style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.01)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/6 text-white">
                <Eye className="h-5 w-5 text-accent-cyan" />
              </div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">[ CREATIVE // ART ]</span>
            </div>

            {/* CSS Marquee Loops */}
            <div className="my-6 overflow-hidden flex flex-col gap-2 pointer-events-none opacity-20 select-none">
              <div className="marquee-wrapper flex whitespace-nowrap gap-4 text-[10px] font-black uppercase tracking-widest">
                <span className="animate-[marquee_20s_linear_infinite]">Art Direction • UI Design • Copywriting • motion concepts • concept board • Art Direction • UI Design • Copywriting • motion concepts • concept board •</span>
              </div>
              <div className="marquee-wrapper flex whitespace-nowrap gap-4 text-[10px] font-black uppercase tracking-widest text-stroke text-white/30">
                <span className="animate-[marquee_15s_linear_infinite_reverse]">Photoreal renders • audio soundscapes • VFX styling • video reels • Photoreal renders • audio soundscapes • VFX styling • video reels •</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg md:text-xl font-display font-black text-white mb-2 uppercase tracking-wide">
                CREATIVE DIRECTION
              </h4>
              <p className="max-w-md text-xs text-neutral-400 font-light leading-relaxed">
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
