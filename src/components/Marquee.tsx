'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-200, 0]);

  const items = [
    'Web Design', 'Development', 'Branding', 'UI/UX', 'E-Commerce',
    'SEO', 'Hosting', 'Maintenance', 'Web Apps', 'Strategy',
  ];

  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <section ref={ref} className="relative py-16 md:py-24 overflow-hidden">
      <div className="space-y-4">
        {/* Row 1 - moves left on scroll */}
        <motion.div style={{ x: x1 }} className="flex gap-4 whitespace-nowrap">
          {repeatedItems.map((item, i) => (
            <div
              key={`r1-${i}`}
              className="flex items-center gap-4 px-6 py-3 rounded-full border border-slate-200/60
                         bg-white hover:border-ocean-mid/40 hover:shadow-[0_4px_16px_-4px_rgba(14,116,144,0.15)]
                         transition-all duration-300 cursor-default group"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-ocean-mid opacity-40 group-hover:opacity-100 transition-opacity" fill="none">
                <path d="M2,14 Q6,8 10,14 Q14,20 18,14 Q22,8 24,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-medium text-slate-600 group-hover:text-ocean-deep transition-colors">
                {item}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Row 2 - moves right on scroll */}
        <motion.div style={{ x: x2 }} className="flex gap-4 whitespace-nowrap">
          {[...repeatedItems].reverse().map((item, i) => (
            <div
              key={`r2-${i}`}
              className="flex items-center gap-4 px-6 py-3 rounded-full border border-slate-200/60
                         bg-white hover:border-ocean-mid/40 hover:shadow-[0_4px_16px_-4px_rgba(14,116,144,0.15)]
                         transition-all duration-300 cursor-default group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-ocean-light/60 group-hover:bg-ocean-mid transition-colors" />
              <span className="text-sm font-medium text-slate-600 group-hover:text-ocean-deep transition-colors">
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
