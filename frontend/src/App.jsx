import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import bespoke creative components
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Hero from './components/Hero';
import TextReveal from './components/TextReveal';
import DuoGlideGallery from './components/DuoGlideGallery';
import HorizontalProjects from './components/HorizontalProjects';
import BentoServices from './components/BentoServices';
import Testimonials from './components/Testimonials';
import ContactFooter from './components/ContactFooter';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      infinite: false,
    });

    window.lenis = lenis;

    // 2. Synchronize ScrollTrigger with Lenis ticker events
    lenis.on('scroll', ScrollTrigger.update);

    const handleRaf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(handleRaf);
    gsap.ticker.lagSmoothing(0);

    let refreshTimer;

    // 3. Freeze scroll lifecycle until preloader resolves
    if (!isLoaded) {
      lenis.stop();
    } else {
      lenis.start();
      // Recalculate ScrollTrigger offsets once the preloader resolves and layout is visible
      refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1200);
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(handleRaf);
      window.lenis = null;
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, [isLoaded]);

  return (
    <>
      {/* Screen Percentage preloader wipe */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      {/* Main landing layout structure */}
      <div 
        className={`relative z-10 transition-opacity duration-1000 ease-out ${
          isLoaded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ScrollProgress />
        <Navbar />
        <Hero isLoaded={isLoaded} />
        <TextReveal />
        <DuoGlideGallery />
        <HorizontalProjects />
        <BentoServices />
        <Testimonials />
        <ContactFooter />
      </div>
    </>
  );
};

export default App;