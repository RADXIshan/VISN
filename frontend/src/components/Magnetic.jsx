import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Magnetic = ({ children, range = 50, strength = 0.3 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      // Mouse distance vectors from element center
      const deltaX = e.clientX - elCenterX;
      const deltaY = e.clientY - elCenterY;

      // Hypotenuse distance
      const distance = Math.hypot(deltaX, deltaY);
      
      if (distance < range) {
        // Magnetically attract element toward cursor vector
        gsap.to(el, {
          x: deltaX * strength,
          y: deltaY * strength,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
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
      window.removeEventListener('mousemove', handleMouseMove);
      if (el) {
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [range, strength]);

  return React.cloneElement(children, { ref });
};

export default Magnetic;
