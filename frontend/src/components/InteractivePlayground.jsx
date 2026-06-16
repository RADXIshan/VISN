import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import Magnetic from './Magnetic';

const InteractivePlayground = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [theme, setTheme] = useState('cyan');
  const [mode, setMode] = useState('orbit');
  const [speed, setSpeed] = useState('flow');

  const settingsRef = useRef({ theme, mode, speed });

  useEffect(() => {
    settingsRef.current = { theme, mode, speed };
  }, [theme, mode, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = 460);
    let animationId;
    let particles = [];
    const mouse = { x: -1000, y: -1000, active: false };

    class PlaygroundParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        
        const angle = Math.random() * Math.PI * 2;
        const velocityMagnitude = Math.random() * 2.2 + 0.8;
        this.vx = Math.cos(angle) * velocityMagnitude;
        this.vy = Math.sin(angle) * velocityMagnitude;
        
        this.radius = Math.random() * 3 + 1;
        this.life = Math.random() * 90 + 70;
        this.maxLife = this.life;
        
        const themeColor = settingsRef.current.theme;
        if (themeColor === 'cyan') {
          this.color = `rgba(0, 240, 255, ${Math.random() * 0.4 + 0.6})`;
          this.glow = '#00f0ff';
        } else if (themeColor === 'purple') {
          this.color = `rgba(112, 0, 255, ${Math.random() * 0.4 + 0.6})`;
          this.glow = '#7000ff';
        } else {
          this.color = `rgba(244, 63, 94, ${Math.random() * 0.4 + 0.6})`;
          this.glow = '#f43f5e';
        }
      }

      update() {
        const currentSettings = settingsRef.current;
        
        // Physics logic mapping
        if (currentSettings.mode === 'gravity') {
          this.vy += 0.08; // Gravity drop
        } else if (currentSettings.mode === 'orbit') {
          if (mouse.active) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.hypot(dx, dy) || 1;
            const force = 0.4;
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
          }
        } else {
          this.vy -= 0.04; // Elevating float
        }

        // Warp speed calculation
        let speedMult = 1.0;
        if (currentSettings.speed === 'slow') speedMult = 0.4;
        if (currentSettings.speed === 'warp') speedMult = 2.4;

        this.x += this.vx * speedMult;
        this.y += this.vy * speedMult;

        // Friction dampening
        this.vx *= 0.975;
        this.vy *= 0.975;

        this.life--;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.radius * 2.5;
        ctx.shadowColor = this.glow;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset canvas shadows
      }
    }

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight || 460;
      }
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // Spawn particles
      for (let i = 0; i < 2; i++) {
        particles.push(new PlaygroundParticle(mouse.x, mouse.y));
      }
      
      // Limit count
      if (particles.length > 350) {
        particles.splice(0, 2);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
        
        for (let i = 0; i < 2; i++) {
          particles.push(new PlaygroundParticle(mouse.x, mouse.y));
        }
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const loop = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.16)'; // Trails fade out
      ctx.fillRect(0, 0, width, height);

      for (let idx = particles.length - 1; idx >= 0; idx--) {
        const p = particles[idx];
        p.update();
        p.draw();
        
        // Remove dead particles
        if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          particles.splice(idx, 1);
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    window.clearLabParticles = () => {
      particles = [];
    };

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="playground"
      className="relative min-h-[85vh] w-full px-6 py-28 md:px-12 bg-transparent z-10"
    >
      <div className="mx-auto max-w-6xl">
        
        {/* Title elements */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-12 select-none">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                LAB PLAYGROUND
              </h2>
            </div>
            <h3 className="text-3xl md:text-5xl font-display font-black leading-tight uppercase text-white">
              EXPERIMENT <br />
              <span className="text-stroke-glow text-glow-cyan">WITH CODE</span>
            </h3>
          </div>
          <p className="max-w-xs text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
            Drag or hover inside the interactive grid field to draw. Use the custom panel options to modify physics vectors in real-time.
          </p>
        </div>

        {/* Board and control layouts */}
        <div className="relative rounded-3xl border border-white/5 bg-dark-bg/75 overflow-hidden flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          
          {/* Active Canvas Board */}
          <div className="w-full md:w-3/4 min-h-[460px] relative bg-neutral-950/20">
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 h-full w-full block cursor-crosshair touch-none"
            />
            
            <div className="absolute top-6 left-6 pointer-events-none select-none flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent-cyan animate-pulse" />
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
                STATUS: SIMULATION ACTIVE
              </span>
            </div>
          </div>

          {/* Control Panel Dashboard */}
          <div className="w-full md:w-1/4 border-t md:border-t-0 md:border-l border-white/5 p-8 flex flex-col justify-between bg-[#070707]/90 backdrop-blur-md select-none">
            <div className="flex flex-col gap-6">
              
              {/* Option 1: Spectral color */}
              <div>
                <h5 className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase mb-3">
                  1. SPECTRAL THEME
                </h5>
                <div className="flex gap-2">
                  {['cyan', 'purple', 'pink'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setTheme(col)}
                      className={`text-[9px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full border transition-all ${
                        theme === col
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Physics Mode */}
              <div>
                <h5 className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase mb-3">
                  2. VECTOR FIELD SOLVER
                </h5>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'gravity', label: 'GRAVITATIONAL FALL' },
                    { id: 'orbit', label: 'ORBIT ATTRACTOR' },
                    { id: 'float', label: 'ANTIGRAVITY FLOAT' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setMode(p.id)}
                      className={`text-left text-[9px] font-bold uppercase tracking-wider py-2 px-4 rounded-xl border transition-all ${
                        mode === p.id
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Dilation Speeds */}
              <div>
                <h5 className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase mb-3">
                  3. TEMPORAL DILATION
                </h5>
                <div className="flex gap-2">
                  {['slow', 'flow', 'warp'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`text-[9px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full border transition-all ${
                        speed === s
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Reset wipe */}
            <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between">
              <span className="text-[9px] font-mono text-neutral-500 uppercase">[ SIM v2.6 ]</span>
              <Magnetic strength={0.25} range={30}>
                <button
                  onClick={() => window.clearLabParticles && window.clearLabParticles()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-rose-500 hover:text-rose-500 transition-colors cursor-none"
                  title="Reset Board"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Magnetic>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default InteractivePlayground;
