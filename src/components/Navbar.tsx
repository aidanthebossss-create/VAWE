'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { List, X } from '@phosphor-icons/react';

function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="relative px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-ocean-deep"
    >
      {children}
    </motion.a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)] border-b border-slate-200/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0e7490" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <path
                  d="M4,25 Q10,15 16,25 Q22,35 28,25 Q34,15 38,20"
                  fill="none"
                  stroke="url(#logoGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="group-hover:animate-[morphWave1_2s_ease-in-out]"
                />
                <path
                  d="M4,30 Q10,22 16,30 Q22,38 28,30 Q34,22 38,27"
                  fill="none"
                  stroke="url(#logoGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-ocean-deep">
              VAWES
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <MagneticButton href="#services">Services</MagneticButton>
            <MagneticButton href="#work">Work</MagneticButton>
            <MagneticButton href="#process">Process</MagneticButton>
            <MagneticButton href="#about">About</MagneticButton>
            <MagneticButton href="#pricing">Pricing</MagneticButton>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="ml-4 px-6 py-2.5 bg-ocean-deep text-white text-sm font-medium rounded-full
                         hover:bg-ocean-mid transition-colors shadow-[0_4px_16px_-4px_rgba(14,116,144,0.4)]"
            >
              Start a Project
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-700"
          >
            {mobileOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={mobileOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/50"
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {['Services', 'Work', 'Process', 'About', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium text-slate-700 hover:text-ocean-deep transition-colors"
            >
              {item}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-6 py-3 bg-ocean-deep text-white text-center font-medium rounded-full"
          >
            Start a Project
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
}
