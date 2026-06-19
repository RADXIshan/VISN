import React, { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Alexander Chen",
    role: "CEO, Neural Technologies",
    quote: "VISN transformed our cloud platform into an immersive digital experience. Their attention to micro-interactions is unmatched.",
    rating: 5,
  },
  {
    name: "Sofia Morales",
    role: "Creative Director, Eclipse Holdings",
    quote: "Working with VISN felt like collaborating with artists who code. They delivered a campaign system that exceeded every metric.",
    rating: 5,
  },
  {
    name: "James Whitfield",
    role: "Founder, CyberDock Protocol",
    quote: "The visual explorer they built for our Web3 platform is a masterpiece. Users spend 4x longer exploring transactions now.",
    rating: 5,
  },
  {
    name: "Aria Nakamura",
    role: "Head of Digital, Kinetic Art Gallery",
    quote: "They bridged the gap between physical art and digital interaction flawlessly. Our exhibit attendance doubled after launch.",
    rating: 5,
  },
  {
    name: "Marcus Webb",
    role: "VP Product, Stratos Finance",
    quote: "VISN doesn't just build websites — they engineer digital environments that make your brand feel alive and unforgettable.",
    rating: 5,
  },
  {
    name: "Elena Petrova",
    role: "Marketing Lead, Aether Studios",
    quote: "The scroll animations and typographic systems they designed gave our brand a premium identity we never thought possible.",
    rating: 5,
  },
  {
    name: "David Okonkwo",
    role: "CTO, Helix Robotics",
    quote: "Performance and aesthetics rarely coexist at this level. VISN delivered both with a 99 Lighthouse score and jaw-dropping visuals.",
    rating: 5,
  },
  {
    name: "Lena Schröder",
    role: "Brand Strategist, Meridian Labs",
    quote: "Every pixel feels intentional. VISN's design philosophy elevated our entire digital presence beyond what we imagined.",
    rating: 5,
  },
];

const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card shrink-0 w-[340px] md:w-[400px] p-6 md:p-8 rounded-2xl border border-obsidian/8 bg-dark-card/50 backdrop-blur-sm select-none">
    {/* Quote icon */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gold/10 border border-accent-gold/15">
        <Quote className="h-3.5 w-3.5 text-accent-gold-dark" />
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-accent-gold text-accent-gold" />
        ))}
      </div>
    </div>

    {/* Quote text */}
    <p className="text-xs md:text-sm text-obsidian/75 font-serif italic font-light leading-relaxed mb-6 whitespace-normal">
      "{testimonial.quote}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 border-t border-obsidian/8 pt-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-obsidian/5 border border-obsidian/10">
        <span className="text-[11px] font-bold text-obsidian/60">
          {testimonial.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div>
        <p className="text-xs font-bold text-obsidian tracking-wide">{testimonial.name}</p>
        <p className="text-[9px] text-obsidian/45 tracking-wider uppercase">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const rowLeftRef = useRef(null);
  const rowRightRef = useRef(null);

  // Duplicate testimonials for seamless looping
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  useEffect(() => {
    const container = containerRef.current;
    const header = headerRef.current;
    const rowLeft = rowLeftRef.current;
    const rowRight = rowRightRef.current;

    if (!container) return;

    // 1. Header fade-in and slide-up
    const headerTween = gsap.fromTo(header,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    // 2. Row wrappers fade-in and slide-up
    const rowsTween = gsap.fromTo([rowLeft, rowRight],
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );

    // 3. Horizontal parallax shift driven by scroll position
    const leftParallax = gsap.fromTo(rowLeft,
      { x: 80 },
      {
        x: -80,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2
        }
      }
    );

    const rightParallax = gsap.fromTo(rowRight,
      { x: -80 },
      {
        x: 80,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2
        }
      }
    );

    return () => {
      headerTween.kill();
      rowsTween.kill();
      leftParallax.kill();
      rightParallax.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="testimonials"
      className="relative w-full py-24 md:py-32 bg-transparent overflow-hidden z-10"
    >
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-accent-gold/4 blur-[120px] pointer-events-none" />

      {/* Section header */}
      <div ref={headerRef} className="mx-auto max-w-6xl px-6 md:px-12 mb-16 select-none">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_6px_#B59B75]" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian/50">
            TESTIMONIALS
          </h2>
        </div>
        <h3 className="text-3xl md:text-5xl font-serif font-bold leading-tight uppercase text-obsidian">
          WHAT CLIENTS <br />
          <span className="text-accent-gold italic font-normal">SAY</span>
        </h3>
      </div>

      {/* Row 1 — moves left */}
      <div className="mb-6 overflow-hidden">
        <div ref={rowLeftRef} style={{ willChange: 'transform' }}>
          <div className="testimonial-row-left flex gap-6 w-max">
            {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
              <TestimonialCard key={`r1-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 — moves right */}
      <div className="overflow-hidden">
        <div ref={rowRightRef} style={{ willChange: 'transform' }}>
          <div className="testimonial-row-right flex gap-6 w-max">
            {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
              <TestimonialCard key={`r2-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
