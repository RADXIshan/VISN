import React, { useEffect, useRef } from 'react';

const InteractiveCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track cursor location and push radius
    const mouse = { x: -1000, y: -1000, radius: 150, active: false };

    // Node representing individual grid intersections
    class Node {
      constructor(x, y) {
        this.anchorX = x;
        this.anchorY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.size = 1;
        this.color = 'rgba(255, 255, 255, 0.12)';
      }

      update() {
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            // Push intensity drops off linearly
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            
            // Push vector target
            const targetX = this.x - Math.cos(angle) * force * 55;
            const targetY = this.y - Math.sin(angle) * force * 55;

            // Shift velocity toward target
            this.vx += (targetX - this.x) * 0.12;
            this.vy += (targetY - this.y) * 0.12;
          }
        }

        // Hooke's Law spring back force to return nodes home
        const ax = (this.anchorX - this.x) * 0.06;
        const ay = (this.anchorY - this.y) * 0.06;
        
        this.vx += ax;
        this.vy += ay;
        
        // Apply friction drag to stabilize spring oscillation
        this.vx *= 0.8;
        this.vy *= 0.8;

        this.x += this.vx;
        this.y += this.vy;

        // Visual coloring shifts based on offset
        const displacement = Math.hypot(this.x - this.anchorX, this.y - this.anchorY);
        if (displacement > 4) {
          this.color = `rgba(0, 240, 255, ${Math.min(0.12 + displacement / 40, 0.7)})`;
          this.size = 1.25;
        } else {
          this.color = 'rgba(255, 255, 255, 0.08)';
          this.size = 0.75;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    let nodes = [];
    const spacing = 50;

    const initGrid = () => {
      nodes = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          nodes.push(new Node(c * spacing, r * spacing));
        }
      }
    };

    initGrid();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrid();
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      ctx.lineWidth = 0.5;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const idx = c * rows + r;
          const node = nodes[idx];
          if (!node) continue;

          node.update();
          node.draw();

          // Connect horizontally
          if (c < cols - 1) {
            const rightNode = nodes[(c + 1) * rows + r];
            if (rightNode) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(rightNode.x, rightNode.y);
              
              const disp = Math.max(
                Math.hypot(node.x - node.anchorX, node.y - node.anchorY),
                Math.hypot(rightNode.x - rightNode.anchorX, rightNode.y - rightNode.anchorY)
              );
              
              // Shift color to glowing cyan if grid is distorted
              ctx.strokeStyle = disp > 4 
                ? `rgba(0, 240, 255, ${Math.min(0.015 + disp / 200, 0.15)})`
                : 'rgba(255, 255, 255, 0.015)';
              ctx.stroke();
            }
          }

          // Connect vertically
          if (r < rows - 1) {
            const bottomNode = nodes[c * rows + (r + 1)];
            if (bottomNode) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(bottomNode.x, bottomNode.y);
              
              const disp = Math.max(
                Math.hypot(node.x - node.anchorX, node.y - node.anchorY),
                Math.hypot(bottomNode.x - bottomNode.anchorX, bottomNode.y - bottomNode.anchorY)
              );
              
              // Shift color to glowing purple on vertical distortion
              ctx.strokeStyle = disp > 4 
                ? `rgba(112, 0, 255, ${Math.min(0.015 + disp / 200, 0.15)})`
                : 'rgba(255, 255, 255, 0.015)';
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full bg-[#030303] pointer-events-none"
    />
  );
};

export default InteractiveCanvas;
