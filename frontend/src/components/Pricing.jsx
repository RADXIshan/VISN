import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, ShieldCheck, PenTool, CheckCircle, HelpCircle, ArrowRight, X } from 'lucide-react';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

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
    const s1El = step1Ref.current;
    const s2El = step2Ref.current;
    const s3El = step3Ref.current;

    // Initial hidden state
    gsap.set([titleEl, s1El, s2El, s3El], { opacity: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    tl.to(titleEl, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out'
    })
    .to(s1El, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .to(s2El, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .to(s3El, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5');

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
      className="relative min-h-screen w-full px-6 py-28 md:px-12 bg-transparent z-10 border-t border-obsidian/5"
    >
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div ref={titleRef} className="flex flex-col md:flex-row items-start justify-between gap-6 mb-20 select-none">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
                INVESTMENT MODEL
              </h2>
            </div>
            <h3 className="text-3xl md:text-5xl font-serif font-bold leading-tight uppercase text-obsidian">
              TRANSPARENT <br />
              <span className="text-accent-gold italic font-normal">PRICING</span>
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
              className={`flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 rounded-2xl border transition-all duration-500 cursor-pointer select-none ${
                foundation === '02 – 05 Pages'
                  ? 'bg-dark-card/60 border-obsidian/20 shadow-sm'
                  : 'bg-white/80 border-obsidian/5 hover:border-obsidian/15'
              }`}
            >
              <div className="flex items-center gap-6 md:w-[380px] md:shrink-0 pr-4 md:pr-8 w-full">
                {/* Custom radio indicator */}
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  foundation === '02 – 05 Pages' ? 'border-obsidian bg-transparent' : 'border-obsidian/20'
                }`}>
                  <div className={`h-3 w-3 rounded-full bg-obsidian transition-all duration-300 ${
                    foundation === '02 – 05 Pages' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} />
                </div>
                <span className="text-xl md:text-2xl font-serif font-bold text-obsidian tracking-tight">
                  02 – 05 Pages
                </span>
              </div>
              
              <div className="flex-1 py-4 md:py-0 md:px-8 border-t md:border-t-0 md:border-l border-obsidian/10 mt-4 md:mt-0 w-full">
                <p className="text-sm font-serif font-medium text-obsidian mb-1">Ideal for portfolio sites.</p>
                <p className="text-xs text-obsidian/75 leading-relaxed font-light font-serif italic max-w-lg">
                  A simple, elegant website to showcase your work and make a strong first impression.
                </p>
              </div>

              <div className="md:min-w-[180px] md:pl-8 border-t md:border-t-0 md:border-l border-obsidian/10 pt-4 md:pt-0 flex flex-col justify-center w-full md:w-auto">
                <span className="text-[9px] font-bold tracking-widest text-obsidian/40 uppercase mb-0.5 font-sans">
                  STARTING AT
                </span>
                <span className="text-2xl font-serif font-bold text-obsidian tracking-tight">
                  {formatPrice(prices.foundation['02 – 05 Pages'])}
                </span>
              </div>
            </div>

            {/* Foundation option 2 */}
            <div 
              onClick={() => setFoundation('05+ Pages')}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 rounded-2xl border transition-all duration-500 cursor-pointer select-none ${
                foundation === '05+ Pages'
                  ? 'bg-dark-card/60 border-obsidian/20 shadow-sm'
                  : 'bg-white/80 border-obsidian/5 hover:border-obsidian/15'
              }`}
            >
              <div className="flex items-center gap-6 md:w-[380px] md:shrink-0 pr-4 md:pr-8 w-full">
                {/* Custom radio indicator */}
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  foundation === '05+ Pages' ? 'border-obsidian bg-transparent' : 'border-obsidian/20'
                }`}>
                  <div className={`h-3 w-3 rounded-full bg-obsidian transition-all duration-300 ${
                    foundation === '05+ Pages' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} />
                </div>
                <span className="text-xl md:text-2xl font-serif font-bold text-obsidian tracking-tight">
                  05+ Pages
                </span>
              </div>
              
              <div className="flex-1 py-4 md:py-0 md:px-8 border-t md:border-t-0 md:border-l border-obsidian/10 mt-4 md:mt-0 w-full">
                <p className="text-sm font-serif font-medium text-obsidian mb-1">Ideal for e-commerce and business websites.</p>
                <p className="text-xs text-obsidian/75 leading-relaxed font-light font-serif italic max-w-lg">
                  More space, more flexibility. Perfect for growing businesses and online stores.
                </p>
              </div>

              <div className="md:min-w-[180px] md:pl-8 border-t md:border-t-0 md:border-l border-obsidian/10 pt-4 md:pt-0 flex flex-col justify-center w-full md:w-auto">
                <span className="text-[9px] font-bold tracking-widest text-obsidian/40 uppercase mb-0.5 font-sans">
                  STARTING AT
                </span>
                <span className="text-2xl font-serif font-bold text-obsidian tracking-tight">
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
              className={`flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 rounded-2xl border transition-all duration-500 cursor-pointer select-none ${
                addons.backend
                  ? 'bg-dark-card/60 border-obsidian/20 shadow-sm'
                  : 'bg-white/80 border-obsidian/5 hover:border-obsidian/15'
              }`}
            >
              <div className="flex items-center gap-6 md:w-[380px] md:shrink-0 pr-4 md:pr-8 w-full">
                {/* Custom circular checkbox */}
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  addons.backend ? 'border-obsidian bg-transparent' : 'border-obsidian/20'
                }`}>
                  <div className={`h-3 w-3 rounded-full bg-obsidian transition-all duration-300 ${
                    addons.backend ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} />
                </div>
                <span className="text-xl md:text-2xl font-serif font-bold text-obsidian tracking-tight">
                  Backend + Dynamic Site
                </span>
              </div>
              
              <div className="flex-1 py-4 md:py-0 md:px-8 border-t md:border-t-0 md:border-l border-obsidian/10 mt-4 md:mt-0 w-full flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-serif font-medium text-obsidian mb-1">Add a powerful backend to manage your content, products, and data easily.</p>
                  <p className="text-xs text-obsidian/75 leading-relaxed font-light font-serif italic max-w-lg">
                    Perfect if you need forms, user logins, bookings or any dynamic features.
                  </p>
                </div>
                {/* Tooltip trigger */}
                <div 
                  className="relative shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setActiveTooltip(activeTooltip === 'backend' ? null : 'backend')}
                    onMouseEnter={() => setActiveTooltip('backend')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    className="h-7 w-7 rounded-full bg-obsidian/5 border border-obsidian/10 flex items-center justify-center text-obsidian/60 hover:text-obsidian hover:bg-obsidian/10 transition-colors"
                    title="Learn more"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  
                  {activeTooltip === 'backend' && (
                    <div className="absolute right-0 md:left-1/2 md:-translate-x-1/2 bottom-full mb-3 w-64 bg-obsidian text-dark-bg p-4 rounded-xl shadow-xl border border-accent-gold/20 text-xs z-30 transition-all duration-300 pointer-events-none">
                      <p className="font-serif italic font-light leading-relaxed">{tooltips.backend}</p>
                      <div className="absolute top-full left-[85%] md:left-1/2 md:-translate-x-1/2 w-3 h-3 bg-obsidian border-b border-r border-accent-gold/20 rotate-45 -mt-1.5" />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:min-w-[180px] md:pl-8 border-t md:border-t-0 md:border-l border-obsidian/10 pt-4 md:pt-0 flex flex-col justify-center w-full md:w-auto">
                <span className="text-2xl font-serif font-bold text-obsidian tracking-tight">
                  + {formatPrice(prices.addons.backend)}
                </span>
              </div>
            </div>

            {/* Addon 2 */}
            <div 
              onClick={() => toggleAddon('branding')}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 rounded-2xl border transition-all duration-500 cursor-pointer select-none ${
                addons.branding
                  ? 'bg-dark-card/60 border-obsidian/20 shadow-sm'
                  : 'bg-white/80 border-obsidian/5 hover:border-obsidian/15'
              }`}
            >
              <div className="flex items-center gap-6 md:w-[380px] md:shrink-0 pr-4 md:pr-8 w-full">
                {/* Custom circular checkbox */}
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  addons.branding ? 'border-obsidian bg-transparent' : 'border-obsidian/20'
                }`}>
                  <div className={`h-3 w-3 rounded-full bg-obsidian transition-all duration-300 ${
                    addons.branding ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} />
                </div>
                <span className="text-xl md:text-2xl font-serif font-bold text-obsidian tracking-tight">
                  Branding + Marketing
                </span>
              </div>
              
              <div className="flex-1 py-4 md:py-0 md:px-8 border-t md:border-t-0 md:border-l border-obsidian/10 mt-4 md:mt-0 w-full flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-serif font-medium text-obsidian mb-1">Build a strong brand presence and reach the right audience.</p>
                  <p className="text-xs text-obsidian/75 leading-relaxed font-light font-serif italic max-w-lg">
                    Includes brand identity, SEO setup, and marketing strategy to grow your business.
                  </p>
                </div>
                {/* Tooltip trigger */}
                <div 
                  className="relative shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setActiveTooltip(activeTooltip === 'branding' ? null : 'branding')}
                    onMouseEnter={() => setActiveTooltip('branding')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    className="h-7 w-7 rounded-full bg-obsidian/5 border border-obsidian/10 flex items-center justify-center text-obsidian/60 hover:text-obsidian hover:bg-obsidian/10 transition-colors"
                    title="Learn more"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  
                  {activeTooltip === 'branding' && (
                    <div className="absolute right-0 md:left-1/2 md:-translate-x-1/2 bottom-full mb-3 w-64 bg-obsidian text-dark-bg p-4 rounded-xl shadow-xl border border-accent-gold/20 text-xs z-30 transition-all duration-300 pointer-events-none">
                      <p className="font-serif italic font-light leading-relaxed">{tooltips.branding}</p>
                      <div className="absolute top-full left-[85%] md:left-1/2 md:-translate-x-1/2 w-3 h-3 bg-obsidian border-b border-r border-accent-gold/20 rotate-45 -mt-1.5" />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:min-w-[180px] md:pl-8 border-t md:border-t-0 md:border-l border-obsidian/10 pt-4 md:pt-0 flex flex-col justify-center w-full md:w-auto">
                <span className="text-[9px] font-bold tracking-widest text-obsidian/40 uppercase mb-0.5 font-sans">
                  STARTING AT
                </span>
                <span className="text-2xl font-serif font-bold text-obsidian tracking-tight">
                  {formatPrice(prices.addons.branding)} <span className="text-sm font-normal text-obsidian/50">/ month</span>
                </span>
              </div>
            </div>

            {/* Addon 3 */}
            <div 
              onClick={() => toggleAddon('animation')}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 rounded-2xl border transition-all duration-500 cursor-pointer select-none ${
                addons.animation
                  ? 'bg-dark-card/60 border-obsidian/20 shadow-sm'
                  : 'bg-white/80 border-obsidian/5 hover:border-obsidian/15'
              }`}
            >
              <div className="flex items-center gap-6 md:w-[380px] md:shrink-0 pr-4 md:pr-8 w-full">
                {/* Custom circular checkbox */}
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  addons.animation ? 'border-obsidian bg-transparent' : 'border-obsidian/20'
                }`}>
                  <div className={`h-3 w-3 rounded-full bg-obsidian transition-all duration-300 ${
                    addons.animation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} />
                </div>
                <span className="text-xl md:text-2xl font-serif font-bold text-obsidian tracking-tight">
                  Web Animation
                </span>
              </div>
              
              <div className="flex-1 py-4 md:py-0 md:px-8 border-t md:border-t-0 md:border-l border-obsidian/10 mt-4 md:mt-0 w-full flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-serif font-medium text-obsidian mb-1">Bring your website to life with smooth, engaging animations.</p>
                  <p className="text-xs text-obsidian/75 leading-relaxed font-light font-serif italic max-w-lg">
                    Enhances user experience and leaves a lasting impression.
                  </p>
                </div>
                {/* Tooltip trigger */}
                <div 
                  className="relative shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setActiveTooltip(activeTooltip === 'animation' ? null : 'animation')}
                    onMouseEnter={() => setActiveTooltip('animation')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    className="h-7 w-7 rounded-full bg-obsidian/5 border border-obsidian/10 flex items-center justify-center text-obsidian/60 hover:text-obsidian hover:bg-obsidian/10 transition-colors"
                    title="Learn more"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  
                  {activeTooltip === 'animation' && (
                    <div className="absolute right-0 md:left-1/2 md:-translate-x-1/2 bottom-full mb-3 w-64 bg-obsidian text-dark-bg p-4 rounded-xl shadow-xl border border-accent-gold/20 text-xs z-30 transition-all duration-300 pointer-events-none">
                      <p className="font-serif italic font-light leading-relaxed">{tooltips.animation}</p>
                      <div className="absolute top-full left-[85%] md:left-1/2 md:-translate-x-1/2 w-3 h-3 bg-obsidian border-b border-r border-accent-gold/20 rotate-45 -mt-1.5" />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:min-w-[180px] md:pl-8 border-t md:border-t-0 md:border-l border-obsidian/10 pt-4 md:pt-0 flex flex-col justify-center w-full md:w-auto">
                <span className="text-2xl font-serif font-bold text-obsidian tracking-tight">
                  + {formatPrice(prices.addons.animation)}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* STEP 3: COST ESTIMATOR & INCLUSIONS */}
        <div ref={step3Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Everything You Need Built In */}
          <div className="lg:col-span-7 bg-white/40 border border-obsidian/5 rounded-3xl p-8 backdrop-blur-sm select-none">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-obsidian/5">
              
              {/* Feature 1 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-obsidian tracking-wide">24/7 Support</h5>
                  <p className="text-[10px] text-obsidian/45 uppercase tracking-wide">Reliable Assistance</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-obsidian tracking-wide">02 Months</h5>
                  <p className="text-[10px] text-obsidian/45 uppercase tracking-wide">Free Maintenance</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center text-purple-600">
                  <PenTool className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-obsidian tracking-wide">Up to 03</h5>
                  <p className="text-[10px] text-obsidian/45 uppercase tracking-wide">Free Revisions</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-600">
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
          <div className="lg:col-span-5 bg-dark-card/40 border border-obsidian/10 rounded-3xl p-8 flex flex-col justify-between min-h-[280px]">
            <div>
              <span className="text-[10px] font-serif font-bold tracking-widest text-obsidian/40 uppercase block mb-1">
                ESTIMATED COST
              </span>
              <div className="flex flex-wrap items-baseline gap-2 mb-2">
                <h4 className="text-4xl md:text-5xl font-serif font-bold text-obsidian tracking-tight">
                  {formatPrice(totalOneTime)}
                </h4>
                {addons.branding && (
                  <span className="text-sm font-medium text-obsidian/60 bg-accent-gold/10 px-2 py-0.5 rounded-md font-serif">
                    + {formatPrice(recurringCost)} / mo
                  </span>
                )}
              </div>
              <p className="text-[10px] text-obsidian/45 font-sans font-light">
                Excludes taxes and domain/hosting.
              </p>
            </div>

            <div className="mt-8">
              <Magnetic strength={0.15} range={30}>
                <button
                  onClick={handleBookMeeting}
                  className="w-full flex items-center justify-center gap-4 py-4 rounded-full bg-obsidian text-dark-bg font-sans font-bold text-xs uppercase tracking-[0.25em] hover:bg-accent-gold hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_12px_30px_rgba(181,155,117,0.25)]"
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
