import React, { useState, useEffect } from 'react';
import Magnetic from './Magnetic';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at top. Hide when scrolling down, show when scrolling up
      if (currentScrollY < 80) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false); // Scroll down
      } else {
        setVisible(true); // Scroll up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: 'Manifesto', href: '#manifesto' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Labs', href: '#playground' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      if (window.lenis) {
        window.lenis.scrollTo(element, { offset: -60, duration: 1.5 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between rounded-full border border-white/6 bg-black/60 px-6 py-3.5 backdrop-blur-xl">
        {/* Creative Brand Logo */}
        <Magnetic strength={0.3} range={50}>
          <a 
            href="#hero" 
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center text-xl font-display font-black tracking-widest text-white group select-none"
            data-cursor="magnetic"
          >
            VISN<span className="text-accent-cyan group-hover:animate-ping inline-block ml-0.5 select-none">.</span>
          </a>
        </Magnetic>

        {/* Navigation Elements */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Magnetic key={item.name} strength={0.25} range={40}>
              <a 
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-400 hover:text-white transition-colors duration-300 relative py-1.5 group"
                data-cursor="magnetic"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent-cyan transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#00f0ff]" />
              </a>
            </Magnetic>
          ))}
        </div>

        {/* CTA Launch Project */}
        <div className="hidden md:block">
          <Magnetic strength={0.2} range={40}>
            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="px-6 py-2.5 rounded-full bg-white text-black font-extrabold text-[10px] uppercase tracking-widest hover:bg-accent-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300 cursor-none"
            >
              Start Project
            </a>
          </Magnetic>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-accent-cyan transition-colors p-1"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Glassmorphic Card) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[84px] left-4 right-4 z-40 rounded-3xl border border-white/8 bg-black/95 p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300">
          <div className="flex flex-col gap-6 text-center">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-base font-display font-medium tracking-widest text-neutral-300 hover:text-accent-cyan transition-colors py-2 border-b border-white/5"
              >
                {item.name}
              </a>
            ))}
            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="mt-4 block w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-accent-cyan transition-all duration-300"
            >
              Start Project
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
