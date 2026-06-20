import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, ShieldCheck, PenTool, CheckCircle, HelpCircle, ArrowRight, X } from 'lucide-react';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

const splitText = (text) => {
  return text.split("").map((char, index) => (
    <span 
      key={index} 
      className="char-span inline-block"
      style={{ 
        display: char === " " ? "inline" : "inline-block",
        willChange: "transform, opacity"
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const Pricing = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);

  // Pricing calculator state
  const [foundation, setFoundation] = useState('05+ Pages'); // '02 – 05 Pages' or '05+ Pages'
  const [addons, setAddons] = useState({
    backend: false,
    branding: false,
    animation: false
  });

  // Tooltip helper state
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Prices definitions
  const prices = {
    foundation: {
      '02 – 05 Pages': 25000,
      '05+ Pages': 40000
    },
    addons: {
      backend: 30000,
      branding: 12000, // Monthly recurring
      animation: 10000
    }
  };

  // Compute total estimated cost
  const baseCost = prices.foundation[foundation];
  const dynamicAddonCost = (addons.backend ? prices.addons.backend : 0) + 
                            (addons.animation ? prices.addons.animation : 0);
  const totalOneTime = baseCost + dynamicAddonCost;
  const recurringCost = addons.branding ? prices.addons.branding : 0;

  // Formats price into INR format (e.g. ₹25,000)
  const formatPrice = (value) => {
    return '₹' + value.toLocaleString('en-IN');
  };

  // Entrance scroll-trigger reveal effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const titleEl = titleRef.current;
    const headerTitle = titleEl ? titleEl.querySelector('.split-header') : null;
    const chars = headerTitle ? headerTitle.querySelectorAll('.char-span') : [];
    const titleMeta = titleEl ? titleEl.querySelectorAll('h2, p, .header-dot') : [];

    const s1El = step1Ref.current;
    const s2El = step2Ref.current;
    const s3El = step3Ref.current;

    // Initial hidden state
    gsap.set(chars, { y: "115%", opacity: 0 });
    gsap.set(titleMeta, { opacity: 0, y: 20 });
    gsap.set([s1El, s2El, s3El], { opacity: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play reverse play reverse'
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

    // Animate header meta
    tl.to(titleMeta, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out"
    }, "-=0.45");

    tl.to(s1El, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.45')
    .to(s2El, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.45')
    .to(s3El, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.45');

    return () => {
      tl.kill();
    };
  }, []);

  // Handler for booking meeting: scrolls to contact form and pre-fills selections
  const handleBookMeeting = (e) => {
    e.preventDefault();
    
    // Construct pre-filled description text
    const selectedAddons = [];
    if (addons.backend) selectedAddons.push('Backend + Dynamic Site (₹30,000)');
    if (addons.branding) selectedAddons.push('Branding + Marketing (₹12,000/month)');
    if (addons.animation) selectedAddons.push('Web Animation (₹10,000)');

    const addonsText = selectedAddons.length > 0 
      ? `Modules: ${selectedAddons.join(', ')}` 
      : 'Modules: None selected';

    const recurringText = addons.branding ? ` + ${formatPrice(recurringCost)}/month` : '';
    const message = `Hi VISN! I'd like to book a meeting to discuss my website project.\n\nConfiguration:\n- Foundation: ${foundation} (${formatPrice(baseCost)})\n- ${addonsText}\n- Estimated Cost: ${formatPrice(totalOneTime)}${recurringText}`;

    // Prefill the text area
    const messageTextarea = document.getElementById('contact-message');
    if (messageTextarea) {
      messageTextarea.value = message;
      // Trigger native textarea change in case any event handler listens to it
      const event = new Event('input', { bubbles: true });
      messageTextarea.dispatchEvent(event);
    }

    // Scroll to the contact footer component
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      if (window.lenis) {
        window.lenis.scrollTo(contactSection, { offset: -60, duration: 1.5 });
      } else {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Tooltip data
  const tooltips = {
    backend: 'Setup database instances, admin panel portals, dynamic forms, secure login flows, and robust backend server capabilities.',
    branding: 'Includes custom typography kits, logo systems, guidelines documentation, asset packaging, and automated search engine optimization (SEO) scaling strategies.',
    animation: 'Engages users with rich GSAP ScrollTrigger timelines, custom Canvas/WebGL mouse tracking networks, page transitions, and fluid creative reveals.'
  };

  // Toggles an addon checkbox selection
  const toggleAddon = (key) => {
    setAddons(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <section 
      ref={containerRef}
      id="pricing"
      className="relative min-h-screen w-full px-6 py-28 md:px-12 bg-linear-to-b from-[#100f0d] via-[#14120f] to-[#12100d] z-10 overflow-hidden border-t border-obsidian/5"
    >
      {/* Subtle neutral background glow */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-accent-gold/1 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div ref={titleRef} className="flex flex-col md:flex-row items-start justify-between gap-6 mb-20 select-none">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="header-dot h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
                INVESTMENT MODEL
              </h2>
            </div>
            <h3 className="split-header text-3xl md:text-5xl font-serif font-bold leading-tight uppercase text-obsidian">
              <span className="inline-block overflow-hidden pb-1">
                {splitText("TRANSPARENT")}
              </span>
              <br />
              <span className="inline-block overflow-hidden pb-1 pr-4 text-accent-gold italic font-normal">
                {splitText("PRICING")}
              </span>
            </h3>
          </div>
          <p className="max-w-xs text-xs md:text-sm text-obsidian/70 font-serif italic font-light leading-relaxed">
            Tailor the scale and features of your project dynamically. Select a structural foundation, layer optional modules, and calculate your investment.
          </p>
        </div>

        {/* STEP 1: CHOOSE YOUR FOUNDATION */}
        <div ref={step1Ref} className="mb-16">
          <div className="mb-6 select-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold font-sans block mb-1">
              STEP 01
            </span>
            <h4 className="text-xl md:text-2xl font-serif font-semibold text-obsidian mb-1">
              Choose Your Foundation
            </h4>
            <p className="text-xs text-obsidian/70 font-serif italic font-light">
              Pick the perfect starting point for your website.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            
            {/* Foundation option 1 */}
            <div 
              onClick={() => setFoundation('02 – 05 Pages')}
              className={`group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-3xl border transition-all duration-500 cursor-pointer select-none relative overflow-hidden w-full gap-6 ${
                foundation === '02 – 05 Pages'
                  ? 'bg-linear-to-b from-[#1c1a17] to-[#0f0e0c] border-accent-gold shadow-[0_0_35px_rgba(181,155,117,0.12),inset_0_1px_1px_rgba(255,255,255,0.03)]'
                  : 'bg-linear-to-b from-[#161512]/50 to-[#100f0d]/50 border-accent-gold/15 hover:border-accent-gold/45 hover:from-[#1a1916]/70 hover:to-[#12110e]/70 hover:shadow-[0_0_25px_rgba(181,155,117,0.05)]'
              }`}
            >
              {/* Ambient radial glow */}
              <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${
                foundation === '02 – 05 Pages' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
              }`} style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(181, 155, 117, 0.03), transparent 70%)'
              }} />

              {/* Glowing top gold edge line */}
              <div className={`absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-accent-gold/60 to-transparent transition-all duration-500 ${
                foundation === '02 – 05 Pages' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-60 group-hover:scale-100'
              }`} />

              <div className="flex items-center gap-6 md:w-1/4 shrink-0 z-10">
                {/* Custom radio indicator */}
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  foundation === '02 – 05 Pages' 
                    ? 'border-accent-gold bg-accent-gold/5 shadow-[0_0_12px_rgba(181,155,117,0.4)]' 
                    : 'border-accent-gold/25 group-hover:border-accent-gold/50 bg-transparent'
                }`}>
                  <div className={`h-2.5 w-2.5 rounded-full bg-accent-gold transition-all duration-300 ${
                    foundation === '02 – 05 Pages' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} />
                </div>
                <span className={`text-lg md:text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                  foundation === '02 – 05 Pages' ? 'text-accent-gold text-glow-gold' : 'text-obsidian'
                }`}>
                  02 – 05 Pages
                </span>
              </div>

              {/* Vertical Separator 1 */}
              <div className="hidden md:block h-12 w-px bg-accent-gold/15 shrink-0 z-10" />

              {/* Description */}
              <div className="flex-1 z-10">
                <p className="text-xs md:text-sm font-semibold text-obsidian/90 mb-1">Ideal for portfolio sites.</p>
                <p className="text-[11px] md:text-xs text-obsidian/60 leading-relaxed font-light font-serif italic">
                  A simple, elegant website to showcase your work and make a strong first impression.
                </p>
              </div>

              {/* Vertical Separator 2 */}
              <div className="hidden md:block h-12 w-px bg-accent-gold/15 shrink-0 z-10" />

              {/* Price */}
              <div className="flex flex-col items-start md:items-end md:w-1/4 shrink-0 z-10">
                <span className="text-[8px] font-bold tracking-widest text-accent-gold-dark uppercase mb-0.5 font-sans">
                  STARTING AT
                </span>
                <span className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                  foundation === '02 – 05 Pages' ? 'text-accent-gold text-glow-gold' : 'text-obsidian group-hover:text-accent-gold'
                }`}>
                  {formatPrice(prices.foundation['02 – 05 Pages'])}
                </span>
              </div>
            </div>

            {/* Foundation option 2 */}
            <div 
              onClick={() => setFoundation('05+ Pages')}
              className={`group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-3xl border transition-all duration-500 cursor-pointer select-none relative overflow-hidden w-full gap-6 ${
                foundation === '05+ Pages'
                  ? 'bg-linear-to-b from-[#1c1a17] to-[#0f0e0c] border-accent-gold shadow-[0_0_35px_rgba(181,155,117,0.12),inset_0_1px_1px_rgba(255,255,255,0.03)]'
                  : 'bg-linear-to-b from-[#161512]/50 to-[#100f0d]/50 border-accent-gold/15 hover:border-accent-gold/45 hover:from-[#1a1916]/70 hover:to-[#12110e]/70 hover:shadow-[0_0_25px_rgba(181,155,117,0.05)]'
              }`}
            >
              {/* Ambient radial glow */}
              <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${
                foundation === '05+ Pages' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
              }`} style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(181, 155, 117, 0.03), transparent 70%)'
              }} />

              {/* Glowing top gold edge line */}
              <div className={`absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-accent-gold/60 to-transparent transition-all duration-500 ${
                foundation === '05+ Pages' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-60 group-hover:scale-100'
              }`} />

              <div className="flex items-center gap-6 md:w-1/4 shrink-0 z-10">
                {/* Custom radio indicator */}
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  foundation === '05+ Pages' 
                    ? 'border-accent-gold bg-accent-gold/5 shadow-[0_0_12px_rgba(181,155,117,0.4)]' 
                    : 'border-accent-gold/25 group-hover:border-accent-gold/50 bg-transparent'
                }`}>
                  <div className={`h-2.5 w-2.5 rounded-full bg-accent-gold transition-all duration-300 ${
                    foundation === '05+ Pages' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} />
                </div>
                <span className={`text-lg md:text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                  foundation === '05+ Pages' ? 'text-accent-gold text-glow-gold' : 'text-obsidian'
                }`}>
                  05+ Pages
                </span>
              </div>

              {/* Vertical Separator 1 */}
              <div className="hidden md:block h-12 w-px bg-accent-gold/15 shrink-0 z-10" />

              {/* Description */}
              <div className="flex-1 z-10">
                <p className="text-xs md:text-sm font-semibold text-obsidian/90 mb-1">Ideal for e-commerce and business websites.</p>
                <p className="text-[11px] md:text-xs text-obsidian/60 leading-relaxed font-light font-serif italic">
                  More space, more flexibility. Perfect for growing businesses and online stores.
                </p>
              </div>

              {/* Vertical Separator 2 */}
              <div className="hidden md:block h-12 w-px bg-accent-gold/15 shrink-0 z-10" />

              {/* Price */}
              <div className="flex flex-col items-start md:items-end md:w-1/4 shrink-0 z-10">
                <span className="text-[8px] font-bold tracking-widest text-accent-gold-dark uppercase mb-0.5 font-sans">
                  STARTING AT
                </span>
                <span className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                  foundation === '05+ Pages' ? 'text-accent-gold text-glow-gold' : 'text-obsidian group-hover:text-accent-gold'
                }`}>
                  {formatPrice(prices.foundation['05+ Pages'])}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* STEP 2: ENHANCE THE SYSTEM */}
        <div ref={step2Ref} className="mb-16">
          <div className="mb-6 select-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold font-sans block mb-1">
              STEP 02
            </span>
            <h4 className="text-xl md:text-2xl font-serif font-semibold text-obsidian mb-1">
              Enhance The System
            </h4>
            <p className="text-xs text-obsidian/70 font-serif italic font-light">
              Add optional modules to extend functionality.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            
            {/* Addon 1 */}
            <div 
              onClick={() => toggleAddon('backend')}
              className={`group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-3xl border transition-all duration-500 cursor-pointer select-none h-full relative overflow-hidden w-full gap-6 ${
                addons.backend
                  ? 'bg-linear-to-b from-[#1c1a17] to-[#0f0e0c] border-accent-gold shadow-[0_0_35px_rgba(181,155,117,0.12),inset_0_1px_1px_rgba(255,255,255,0.03)]'
                  : 'bg-linear-to-b from-[#161512]/50 to-[#100f0d]/50 border-accent-gold/15 hover:border-accent-gold/45 hover:from-[#1a1916]/70 hover:to-[#12110e]/70 hover:shadow-[0_0_25px_rgba(181,155,117,0.05)]'
              }`}
            >
              {/* Ambient radial glow */}
              <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${
                addons.backend ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
              }`} style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(181, 155, 117, 0.03), transparent 70%)'
              }} />

              {/* Glowing top gold edge line */}
              <div className={`absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-accent-gold/60 to-transparent transition-all duration-500 ${
                addons.backend ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-60 group-hover:scale-100'
              }`} />

              <div className="flex items-center gap-6 md:w-1/4 shrink-0 z-10">
                {/* Custom circular checkbox */}
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  addons.backend 
                    ? 'border-accent-gold bg-accent-gold/5 shadow-[0_0_12px_rgba(181,155,117,0.4)]' 
                    : 'border-accent-gold/25 group-hover:border-accent-gold/50 bg-transparent'
                }`}>
                  <div className={`h-2.5 w-2.5 rounded-full bg-accent-gold transition-all duration-300 ${
                    addons.backend ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} />
                </div>
                <span className={`text-lg md:text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                  addons.backend ? 'text-accent-gold text-glow-gold' : 'text-obsidian'
                }`}>
                  Backend + Dynamic Site
                </span>
              </div>

              {/* Vertical Separator 1 */}
              <div className="hidden md:block h-12 w-px bg-accent-gold/15 shrink-0 z-10" />

              {/* Description & Tooltip */}
              <div className="flex-1 flex items-center justify-between gap-4 z-10">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-obsidian/90 mb-1 leading-tight">
                    Add a powerful backend to manage your content, products, and data easily.
                  </p>
                  <p className="text-[11px] md:text-xs text-obsidian/60 leading-relaxed font-light font-serif italic">
                    Perfect if you need forms, user logins, bookings or any dynamic features.
                  </p>
                </div>
                <div 
                  className="relative shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setActiveTooltip(activeTooltip === 'backend' ? null : 'backend')}
                    onMouseEnter={() => setActiveTooltip('backend')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    className="h-6 w-6 rounded-full bg-obsidian/5 border border-obsidian/10 flex items-center justify-center text-obsidian/60 hover:text-accent-gold hover:border-accent-gold/40 transition-colors"
                    title="Learn more"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                  </button>
                  
                  {activeTooltip === 'backend' && (
                    <div 
                      className="absolute right-0 bottom-full mb-3 w-64 bg-obsidian text-dark-bg p-4 rounded-xl border border-accent-gold/40 text-xs z-30 transition-all duration-300 pointer-events-none"
                      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}
                    >
                      <p className="font-serif italic font-light leading-relaxed">{tooltips.backend}</p>
                      <div className="absolute top-full right-2.5 w-3 h-3 bg-obsidian border-b border-r border-accent-gold/40 rotate-45 -mt-1.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Separator 2 */}
              <div className="hidden md:block h-12 w-px bg-accent-gold/15 shrink-0 z-10" />

              {/* Price */}
              <div className="flex flex-col items-start md:items-end md:w-1/4 shrink-0 z-10">
                <span className={`text-lg font-serif font-bold transition-colors duration-300 ${
                  addons.backend ? 'text-accent-gold text-glow-gold' : 'text-obsidian group-hover:text-accent-gold'
                }`}>
                  + {formatPrice(prices.addons.backend)}
                </span>
              </div>
            </div>

            {/* Addon 2 */}
            <div 
              onClick={() => toggleAddon('branding')}
              className={`group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-3xl border transition-all duration-500 cursor-pointer select-none h-full relative overflow-hidden w-full gap-6 ${
                addons.branding
                  ? 'bg-linear-to-b from-[#1c1a17] to-[#0f0e0c] border-accent-gold shadow-[0_0_35px_rgba(181,155,117,0.12),inset_0_1px_1px_rgba(255,255,255,0.03)]'
                  : 'bg-linear-to-b from-[#161512]/50 to-[#100f0d]/50 border-accent-gold/15 hover:border-accent-gold/45 hover:from-[#1a1916]/70 hover:to-[#12110e]/70 hover:shadow-[0_0_25px_rgba(181,155,117,0.05)]'
              }`}
            >
              {/* Ambient radial glow */}
              <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${
                addons.branding ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
              }`} style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(181, 155, 117, 0.03), transparent 70%)'
              }} />

              {/* Glowing top gold edge line */}
              <div className={`absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-accent-gold/60 to-transparent transition-all duration-500 ${
                addons.branding ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-60 group-hover:scale-100'
              }`} />

              <div className="flex items-center gap-6 md:w-1/4 shrink-0 z-10">
                {/* Custom circular checkbox */}
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  addons.branding 
                    ? 'border-accent-gold bg-accent-gold/5 shadow-[0_0_12px_rgba(181,155,117,0.4)]' 
                    : 'border-accent-gold/25 group-hover:border-accent-gold/50 bg-transparent'
                }`}>
                  <div className={`h-2.5 w-2.5 rounded-full bg-accent-gold transition-all duration-300 ${
                    addons.branding ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} />
                </div>
                <span className={`text-lg md:text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                  addons.branding ? 'text-accent-gold text-glow-gold' : 'text-obsidian'
                }`}>
                  Branding + Marketing
                </span>
              </div>

              {/* Vertical Separator 1 */}
              <div className="hidden md:block h-12 w-px bg-accent-gold/15 shrink-0 z-10" />

              {/* Description & Tooltip */}
              <div className="flex-1 flex items-center justify-between gap-4 z-10">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-obsidian/90 mb-1 leading-tight">
                    Build a strong brand presence and reach the right audience.
                  </p>
                  <p className="text-[11px] md:text-xs text-obsidian/60 leading-relaxed font-light font-serif italic">
                    Includes brand identity, SEO setup, and marketing strategy to grow your business.
                  </p>
                </div>
                <div 
                  className="relative shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setActiveTooltip(activeTooltip === 'branding' ? null : 'branding')}
                    onMouseEnter={() => setActiveTooltip('branding')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    className="h-6 w-6 rounded-full bg-obsidian/5 border border-obsidian/10 flex items-center justify-center text-obsidian/60 hover:text-accent-gold hover:border-accent-gold/40 transition-colors"
                    title="Learn more"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                  </button>
                  
                  {activeTooltip === 'branding' && (
                    <div 
                      className="absolute right-0 bottom-full mb-3 w-64 bg-obsidian text-dark-bg p-4 rounded-xl border border-accent-gold/40 text-xs z-30 transition-all duration-300 pointer-events-none"
                      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}
                    >
                      <p className="font-serif italic font-light leading-relaxed">{tooltips.branding}</p>
                      <div className="absolute top-full right-2.5 w-3 h-3 bg-obsidian border-b border-r border-accent-gold/40 rotate-45 -mt-1.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Separator 2 */}
              <div className="hidden md:block h-12 w-px bg-accent-gold/15 shrink-0 z-10" />

              {/* Price */}
              <div className="flex flex-col items-start md:items-end md:w-1/4 shrink-0 z-10">
                <span className="text-[8px] font-bold tracking-widest text-accent-gold-dark uppercase mb-0.5 font-sans">
                  STARTING AT
                </span>
                <span className={`text-lg font-serif font-bold transition-colors duration-300 ${
                  addons.branding ? 'text-accent-gold text-glow-gold' : 'text-obsidian group-hover:text-accent-gold'
                }`}>
                  {formatPrice(prices.addons.branding)} <span className="text-[10px] font-normal text-obsidian/50">/ mo</span>
                </span>
              </div>
            </div>

            {/* Addon 3 */}
            <div 
              onClick={() => toggleAddon('animation')}
              className={`group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-3xl border transition-all duration-500 cursor-pointer select-none h-full relative overflow-hidden w-full gap-6 ${
                addons.animation
                  ? 'bg-linear-to-b from-[#1c1a17] to-[#0f0e0c] border-accent-gold shadow-[0_0_35px_rgba(181,155,117,0.12),inset_0_1px_1px_rgba(255,255,255,0.03)]'
                  : 'bg-linear-to-b from-[#161512]/50 to-[#100f0d]/50 border-accent-gold/15 hover:border-accent-gold/45 hover:from-[#1a1916]/70 hover:to-[#12110e]/70 hover:shadow-[0_0_25px_rgba(181,155,117,0.05)]'
              }`}
            >
              {/* Ambient radial glow */}
              <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${
                addons.animation ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
              }`} style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(181, 155, 117, 0.03), transparent 70%)'
              }} />

              {/* Glowing top gold edge line */}
              <div className={`absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-accent-gold/60 to-transparent transition-all duration-500 ${
                addons.animation ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-60 group-hover:scale-100'
              }`} />

              <div className="flex items-center gap-6 md:w-1/4 shrink-0 z-10">
                {/* Custom circular checkbox */}
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  addons.animation 
                    ? 'border-accent-gold bg-accent-gold/5 shadow-[0_0_12px_rgba(181,155,117,0.4)]' 
                    : 'border-accent-gold/25 group-hover:border-accent-gold/50 bg-transparent'
                }`}>
                  <div className={`h-2.5 w-2.5 rounded-full bg-accent-gold transition-all duration-300 ${
                    addons.animation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} />
                </div>
                <span className={`text-lg md:text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                  addons.animation ? 'text-accent-gold text-glow-gold' : 'text-obsidian'
                }`}>
                  Web Animation
                </span>
              </div>

              {/* Vertical Separator 1 */}
              <div className="hidden md:block h-12 w-px bg-accent-gold/15 shrink-0 z-10" />

              {/* Description & Tooltip */}
              <div className="flex-1 flex items-center justify-between gap-4 z-10">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-obsidian/90 mb-1 leading-tight">
                    Bring your website to life with smooth, engaging animations.
                  </p>
                  <p className="text-[11px] md:text-xs text-obsidian/60 leading-relaxed font-light font-serif italic">
                    Enhances user experience and leaves a lasting impression.
                  </p>
                </div>
                <div 
                  className="relative shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setActiveTooltip(activeTooltip === 'animation' ? null : 'animation')}
                    onMouseEnter={() => setActiveTooltip('animation')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    className="h-6 w-6 rounded-full bg-obsidian/5 border border-obsidian/10 flex items-center justify-center text-obsidian/60 hover:text-accent-gold hover:border-accent-gold/40 transition-colors"
                    title="Learn more"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                  </button>
                  
                  {activeTooltip === 'animation' && (
                    <div 
                      className="absolute right-0 bottom-full mb-3 w-64 bg-obsidian text-dark-bg p-4 rounded-xl border border-accent-gold/40 text-xs z-30 transition-all duration-300 pointer-events-none"
                      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}
                    >
                      <p className="font-serif italic font-light leading-relaxed">{tooltips.animation}</p>
                      <div className="absolute top-full right-2.5 w-3 h-3 bg-obsidian border-b border-r border-accent-gold/40 rotate-45 -mt-1.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Separator 2 */}
              <div className="hidden md:block h-12 w-px bg-accent-gold/15 shrink-0 z-10" />

              {/* Price */}
              <div className="flex flex-col items-start md:items-end md:w-1/4 shrink-0 z-10">
                <span className={`text-lg font-serif font-bold transition-colors duration-300 ${
                  addons.animation ? 'text-accent-gold text-glow-gold' : 'text-obsidian group-hover:text-accent-gold'
                }`}>
                  + {formatPrice(prices.addons.animation)}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* STEP 3: COST ESTIMATOR & INCLUSIONS */}
        <div ref={step3Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Everything You Need Built In */}
          <div className="lg:col-span-7 bg-linear-to-b from-[#181613]/30 to-[#100f0d]/30 border border-obsidian/10 rounded-3xl p-8 backdrop-blur-sm select-none relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none" style={{
              background: 'radial-gradient(circle at 0% 100%, rgba(181, 155, 117, 0.02), transparent 50%)'
            }} />
            
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold font-sans block mb-1">
              STEP 03
            </span>
            <h4 className="text-xl md:text-2xl font-serif font-semibold text-obsidian mb-2">
              Everything You Need. Built In.
            </h4>
            <p className="text-xs text-obsidian/70 font-serif italic font-light leading-relaxed mb-8 max-w-xl">
              Every project includes the essentials to ensure your website runs smoothly and your experience is effortless.
            </p>

            {/* Grid of features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-accent-gold/10">
              
              {/* Feature 1 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-obsidian tracking-wide">24/7 Support</h5>
                  <p className="text-[10px] text-obsidian/45 uppercase tracking-wide">Reliable Assistance</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-obsidian tracking-wide">02 Months</h5>
                  <p className="text-[10px] text-obsidian/45 uppercase tracking-wide">Free Maintenance</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold">
                  <PenTool className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-obsidian tracking-wide">Up to 03</h5>
                  <p className="text-[10px] text-obsidian/45 uppercase tracking-wide">Free Revisions</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-obsidian tracking-wide">Guidance &</h5>
                  <p className="text-[10px] text-obsidian/45 uppercase tracking-wide">Handover</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Panel: Estimated Cost Card */}
          <div className="lg:col-span-5 bg-linear-to-b from-[#1c1a17] to-[#0f0e0c] border border-[#2e2e2e]/30 rounded-3xl p-8 flex flex-col justify-between min-h-[280px] shadow-[0_0_35px_rgba(181,155,117,0.06)] relative overflow-hidden group">
            {/* Ambient radial glow */}
            <div className="absolute inset-0 rounded-3xl opacity-60 pointer-events-none" style={{
              background: 'radial-gradient(circle at 100% 0%, rgba(181, 155, 117, 0.02), transparent 60%)'
            }} />
            
            <div className="z-10">
              <span className="text-[10px] font-serif font-bold tracking-widest text-accent-gold-dark uppercase block mb-1">
                ESTIMATED INVESTMENT
              </span>
              <div className="flex flex-wrap items-baseline gap-2 mb-2">
                <h4 className="text-4xl md:text-5xl font-serif font-bold text-accent-gold text-glow-gold tracking-tight">
                  {formatPrice(totalOneTime)}
                </h4>
                {addons.branding && (
                  <span className="text-xs font-medium text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-md font-serif">
                    + {formatPrice(recurringCost)} / mo
                  </span>
                )}
              </div>
              <p className="text-[10px] text-obsidian/45 font-sans font-light">
                Excludes taxes and domain/hosting.
              </p>
            </div>

            <div className="mt-8 z-10">
              <Magnetic strength={0.15} range={30}>
                <button
                  onClick={handleBookMeeting}
                  className="w-full flex items-center justify-center gap-4 py-4 rounded-full bg-obsidian text-dark-bg font-sans font-bold text-xs uppercase tracking-[0.25em] hover:bg-accent-gold hover:text-dark-bg transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow,opacity] duration-300 cursor-pointer shadow-sm hover:shadow-[0_12px_30px_rgba(181,155,117,0.25)]"
                >
                  BOOK A MEETING
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Magnetic>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Pricing;
