'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { List, X } from '@phosphor-icons/react';
import MagneticButton from './fx/MagneticButton';
import { EASE_OUT } from '@/lib/motion';

const links = ['Services', 'Work', 'Process', 'About', 'Pricing'];

// Transparent over the hero water, then contracts into a floating glass pill
// once the page scrolls.
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section the visitor is reading, so a long page never
  // leaves them wondering where they are.
  useEffect(() => {
    const ids = links.map((l) => l.toLowerCase()).concat('contact');
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const light = scrolled || open;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4"
    >
      <nav
        aria-label="Main"
        className={`mx-auto flex items-center justify-between rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          light
            ? 'max-w-[980px] border border-white/10 bg-[#071E33]/75 py-2 pl-5 pr-2 shadow-[0_14px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl'
            : 'max-w-[1400px] border border-transparent py-3 pl-2 pr-2 md:pl-4'
        }`}
      >
        <a href="#top" aria-label="VAWES, back to top" className="flex items-center">
          <img
            src="/logo/vawes-wordmark-sm.webp"
            width={585}
            height={144}
            alt="VAWES"
            className="h-8 w-auto brightness-0 invert md:h-10"
          />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              aria-current={active === l.toLowerCase() ? 'location' : undefined}
              className={`wave-link text-[15px] font-medium transition-colors aria-[current]:[background-size:20px_6px] ${
                'text-white/70 hover:text-white aria-[current]:text-white'
              }`}
            >
              <span className="sr-only">{l}</span>
              <span className="roll" aria-hidden="true">
                {[0, 1].map((row) => (
                  <span key={row} className="roll-row">
                    {Array.from(l).map((ch, c) => (
                      <span key={c} style={{ '--c': c } as React.CSSProperties}>
                        {ch}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <MagneticButton href="#contact" tone={light ? 'cyan' : 'glass'} className="!px-5 !py-2.5 !text-sm max-md:hidden">
            Get a quote
          </MagneticButton>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`grid h-11 w-11 place-items-center rounded-full md:hidden ${
              'bg-white/10 text-white backdrop-blur'
            }`}
          >
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="mx-auto mt-2 max-w-[980px] rounded-[28px] border border-white/10 bg-[#071E33]/95 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl md:hidden"
          >
            <ul className="grid gap-1">
              {links.map((l, i) => (
                <motion.li
                  key={l}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <a
                    href={`#${l.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="block py-1.5 font-display text-4xl font-bold tracking-tight text-white [font-variation-settings:'wdth'_80]"
                  >
                    {l}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-6 block rounded-full bg-light-cyan px-6 py-4 text-center font-semibold text-abyss"
            >
              Get a quote
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
