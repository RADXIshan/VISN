import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import Magnetic from './Magnetic';

const InteractivePlayground = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [theme, setTheme] = useState('gold');
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
    let ribbons = [];
    const mouse = { x: -1000, y: -1000, active: false };

    class SatinRibbon {
      constructor(x, y) {
        this.points = [];
        const numPoints = 25;
        for (let i = 0; i < numPoints; i++) {
          this.points.push({ x, y, vx: 0, vy: 0 });
        }
        
        this.life = Math.random() * 80 + 80;
        this.maxLife = this.life;
        
        const themeColor = settingsRef.current.theme;
        if (themeColor === 'gold') {
          this.color = 'rgba(181, 155, 117, 1)';
          this.glow = '#B59B75';
        } else if (themeColor === 'bronze') {
          this.color = 'rgba(163, 138, 94, 1)';
          this.glow = '#A38A5E';
        } else {
          this.color = 'rgba(21, 21, 21, 1)';
          this.glow = '#151515';
        }
      }

      update() {
        const currentSettings = settingsRef.current;
        let speedMult = 1.0;
        if (currentSettings.speed === 'slow') speedMult = 0.4;
        if (currentSettings.speed === 'warp') speedMult = 2.2;

        const time = Date.now() * 0.001;

        // Head point (points[0]) moves based on selected mode
        const head = this.points[0];
        if (currentSettings.mode === 'gravity') {
          head.vy += 0.28 * speedMult;
          head.vx += Math.sin(time * 2) * 0.15;
        } else if (currentSettings.mode === 'orbit') {
          if (mouse.active) {
            const dx = mouse.x - head.x;
            const dy = mouse.y - head.y;
            const dist = Math.hypot(dx, dy) || 1;
            const force = 0.55 * speedMult;
            head.vx += (dx / dist) * force;
            head.vy += (dy / dist) * force;
          } else {
            // Idle movement if mouse not active
            head.vx += Math.cos(time) * 0.15;
            head.vy += Math.sin(time) * 0.15;
          }
        } else {
          // Antigravity float: float upwards
          head.vy -= 0.18 * speedMult;
          head.vx += Math.cos(time * 2) * 0.15;
        }

        // Apply friction and boundary bounce to head
        head.vx *= 0.92;
        head.vy *= 0.92;
        head.x += head.vx;
        head.y += head.vy;

        if (head.x < 0) { head.x = 0; head.vx *= -0.5; }
        if (head.x > width) { head.x = width; head.vx *= -0.5; }
        if (head.y < 0) { head.y = 0; head.vy *= -0.5; }
        if (head.y > height) { head.y = height; head.vy *= -0.5; }

        // Child segments follow parent segments sequentially with spring stiffness
        for (let i = 1; i < this.points.length; i++) {
          const p = this.points[i];
          const parent = this.points[i - 1];
          
          const dx = parent.x - p.x;
          const dy = parent.y - p.y;
          
          p.vx += dx * 0.16 * speedMult;
          p.vy += dy * 0.16 * speedMult;
          
          // Apply flow field noise vector to simulate silky waves
          const noiseAngle = (p.x * 0.003 + p.y * 0.003 + time) * Math.PI;
          p.vx += Math.cos(noiseAngle) * 0.04 * speedMult;
          p.vy += Math.sin(noiseAngle) * 0.04 * speedMult;

          p.vx *= 0.76;
          p.vy *= 0.76;
          
          p.x += p.vx;
          p.y += p.vy;
        }

        this.life--;
      }

      draw() {
        if (this.points.length < 3) return;

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        // Standard smooth quadratic curves mapping
        for (let i = 1; i < this.points.length - 2; i++) {
          const xc = (this.points[i].x + this.points[i + 1].x) / 2;
          const yc = (this.points[i].y + this.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
        }

        ctx.quadraticCurveTo(
          this.points[this.points.length - 2].x,
          this.points[this.points.length - 2].y,
          this.points[this.points.length - 1].x,
          this.points[this.points.length - 1].y
        );

        const alpha = (this.life / this.maxLife) * 0.7;
        const mainStroke = this.color.replace('1)', `${alpha})`);

        ctx.strokeStyle = mainStroke;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.glow;
        ctx.stroke();

        // Secondary overlaid offset line for silky look
        ctx.beginPath();
        ctx.moveTo(this.points[0].x + 2, this.points[0].y + 2);
        for (let i = 1; i < this.points.length - 2; i++) {
          const xc = (this.points[i].x + 2 + this.points[i + 1].x + 2) / 2;
          const yc = (this.points[i].y + 2 + this.points[i + 1].y + 2) / 2;
          ctx.quadraticCurveTo(this.points[i].x + 2, this.points[i].y + 2, xc, yc);
        }
        ctx.quadraticCurveTo(
          this.points[this.points.length - 2].x + 2,
          this.points[this.points.length - 2].y + 2,
          this.points[this.points.length - 1].x + 2,
          this.points[this.points.length - 1].y + 2
        );
        ctx.strokeStyle = this.color.replace('1)', `${alpha * 0.35})`);
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.shadowBlur = 0;
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

      // Spawn ribbon on mouse movements (limit rate slightly)
      if (ribbons.length < 35 && Math.random() < 0.35) {
        ribbons.push(new SatinRibbon(mouse.x, mouse.y));
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
        
        if (ribbons.length < 35 && Math.random() < 0.35) {
          ribbons.push(new SatinRibbon(mouse.x, mouse.y));
        }
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Keep some base ribbons floating in background when idle
    const baseInterval = setInterval(() => {
      if (!mouse.active && ribbons.length < 5) {
        ribbons.push(new SatinRibbon(Math.random() * width, Math.random() * height));
      }
    }, 1200);

    const loop = () => {
      // Fade trails towards Warm Linen (#FAF8F5) background
      ctx.fillStyle = 'rgba(250, 248, 245, 0.18)';
      ctx.fillRect(0, 0, width, height);

      for (let idx = ribbons.length - 1; idx >= 0; idx--) {
        const r = ribbons[idx];
        r.update();
        r.draw();
        
        if (r.life <= 0) {
          ribbons.splice(idx, 1);
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    window.clearLabParticles = () => {
      ribbons = [];
    };

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(baseInterval);
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
        
        {/* Title details */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-12 select-none">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
                LAB PLAYGROUND
              </h2>
            </div>
            <h3 className="text-3xl md:text-5xl font-serif font-bold leading-tight uppercase text-obsidian">
              EXPERIMENT <br />
              <span className="text-stroke-glow text-glow-gold">WITH CODE</span>
            </h3>
          </div>
          <p className="max-w-xs text-xs md:text-sm text-obsidian/70 font-serif italic font-light leading-relaxed">
            Drag or hover inside the interactive grid field to draw. Use the custom panel options to modify physics vectors in real-time.
          </p>
        </div>

        {/* Board and control dashboard */}
        <div className="relative rounded-3xl border border-obsidian/10 bg-dark-bg overflow-hidden flex flex-col md:flex-row shadow-sm">
          
          {/* Active Canvas Board */}
          <div className="w-full md:w-3/4 min-h-[460px] relative bg-dark-bg/20">
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 h-full w-full block cursor-crosshair touch-none"
            />
            
            <div className="absolute top-6 left-6 pointer-events-none select-none flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent-gold-dark animate-pulse" />
              <span className="text-[9px] font-mono tracking-widest text-obsidian/45 uppercase">
                STATUS: SIMULATION ACTIVE
              </span>
            </div>
          </div>

          {/* Control Panel Dashboard (Parchment colored card) */}
          <div className="w-full md:w-1/4 border-t md:border-t-0 md:border-l border-obsidian/10 p-8 flex flex-col justify-between bg-dark-card/90 backdrop-blur-md select-none">
            <div className="flex flex-col gap-6">
              
              {/* Option 1: Spectral color */}
              <div>
                <h5 className="text-[9px] font-bold tracking-widest text-obsidian/45 uppercase mb-3">
                  1. EDITORIAL ACCENT
                </h5>
                <div className="flex gap-2">
                  {[['gold', 'GOLD'], ['bronze', 'BRONZE'], ['charcoal', 'SLATE']].map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setTheme(id)}
                      className={`text-[9px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full border transition-all ${
                        theme === id
                          ? 'bg-obsidian text-dark-bg border-obsidian'
                          : 'bg-transparent text-obsidian/60 border-obsidian/10 hover:border-obsidian/30'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Physics Mode */}
              <div>
                <h5 className="text-[9px] font-bold tracking-widest text-obsidian/45 uppercase mb-3">
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
                          ? 'bg-obsidian text-dark-bg border-obsidian'
                          : 'bg-transparent text-obsidian/60 border-obsidian/10 hover:border-obsidian/30'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Dilations */}
              <div>
                <h5 className="text-[9px] font-bold tracking-widest text-obsidian/45 uppercase mb-3">
                  3. TEMPORAL DILATION
                </h5>
                <div className="flex gap-2">
                  {['slow', 'flow', 'warp'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`text-[9px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full border transition-all ${
                        speed === s
                          ? 'bg-obsidian text-dark-bg border-obsidian'
                          : 'bg-transparent text-obsidian/60 border-obsidian/10 hover:border-obsidian/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Reset Board */}
            <div className="mt-8 border-t border-obsidian/5 pt-6 flex items-center justify-between">
              <span className="text-[9px] font-mono text-obsidian/45 uppercase">[ SIM v2.6 ]</span>
              <Magnetic strength={0.25} range={30}>
                <button
                  onClick={() => window.clearLabParticles && window.clearLabParticles()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-obsidian/5 border border-obsidian/10 hover:border-rose-500 hover:text-rose-500 transition-colors cursor-none text-obsidian"
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
