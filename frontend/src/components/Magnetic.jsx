import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Magnetic = ({ children, range = 50, strength = 0.3 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let absoluteCenterX = 0;
    let absoluteCenterY = 0;
    let lastUpdate = 0;
    let isAttracted = false;

    const updateCenter = () => {
      const rect = el.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      absoluteCenterX = rect.left + scrollX + rect.width / 2;
      absoluteCenterY = rect.top + scrollY + rect.height / 2;
    };

    // Initial calculation
    updateCenter();

    // Recalculate on resize
    window.addEventListener('resize', updateCenter);

    const handleMouseMove = (e) => {
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      // Throttled recalculation of element center to handle layout shifts dynamically
      const now = performance.now();
      if (now - lastUpdate > 500) {
        lastUpdate = now;
        const rect = el.getBoundingClientRect();
        absoluteCenterX = rect.left + scrollX + rect.width / 2;
        absoluteCenterY = rect.top + scrollY + rect.height / 2;
      }

      const mouseX = e.clientX + scrollX;
      const mouseY = e.clientY + scrollY;

      const deltaX = mouseX - absoluteCenterX;
      const deltaY = mouseY - absoluteCenterY;
      const distance = Math.hypot(deltaX, deltaY);
      
      if (distance < range) {
        isAttracted = true;
        // Magnetically attract element toward cursor vector
        gsap.to(el, {
          x: deltaX * strength,
          y: deltaY * strength,
          duration: 0.3,
          ease: "power2.out"
        });
      } else if (isAttracted) {
        isAttracted = false;
        // Reset element position if cursor wanders out of range
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        });
      }
    };

    const handleMouseLeave = () => {
      if (isAttracted) {
        isAttracted = false;
      }
      // Return smoothly to center anchor
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', updateCenter);
      window.removeEventListener('mousemove', handleMouseMove);
      if (el) {
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [range, strength]);

  return React.cloneElement(children, { ref });
};

export default Magnetic;
