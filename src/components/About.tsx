'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: '47+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Retention' },
  { value: '4.9', label: 'Average Rating' },
  { value: '<2s', label: 'Avg Load Time' },
];

function AnimatedCounter({ value, delay }: { value: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, type: 'spring', stiffness: 100, damping: 20 }}
      className="text-3xl md:text-4xl font-bold tracking-tighter text-zinc-900"
    >
      {value}
    </motion.span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32 bg-ocean-foam/40">
      {/* Spinning wave decoration */}
      <motion.div
        style={{ rotate }}
        className="absolute top-20 right-10 md:right-20 opacity-[0.06] pointer-events-none"
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          <path
            d="M100,10 Q130,50 100,100 Q70,150 100,190"
            fill="none"
            stroke="#0e7490"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M10,100 Q50,70 100,100 Q150,130 190,100"
            fill="none"
            stroke="#0e7490"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
          {/* Left Content - 3 cols */}
          <div className="lg:col-span-3">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="inline-block text-sm font-medium text-ocean-mid tracking-wide uppercase mb-4"
            >
              About VAWES
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}
              className="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-900 leading-tight mb-8"
            >
              Two builders,
              <br />
              one <span className="text-ocean-mid">ocean</span> of ideas
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
              className="space-y-5 text-slate-500 leading-relaxed max-w-[60ch]"
            >
              <p>
                VAWES (Vuyo and Aidan Website Enterprises) was born from a shared
                belief: the web should move people. Not just inform them, not just
                look polished, but create a current they want to follow.
              </p>
              <p>
                We are a design-engineering duo based in South Africa, combining
                creative instinct with technical precision. Every project we touch
                is hand-crafted, rigorously tested, and built to perform under
                real-world conditions.
              </p>
              <p>
                The wave in our name is more than branding. It represents momentum,
                rhythm, and the natural pull of great design. We build websites
                that carry that energy from the first pixel to the final deploy.
              </p>
            </motion.div>

            {/* Team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100, damping: 20 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ocean-mid to-ocean-light
                                flex items-center justify-center text-white font-bold text-lg">
                  V
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 text-sm">Vuyo</div>
                  <div className="text-xs text-slate-400">Co-Founder & Creative</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900
                                flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 text-sm">Aidan</div>
                  <div className="text-xs text-slate-400">Co-Founder & Engineering</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right - Stats */}
          <div className="lg:col-span-2 flex items-center">
            <div className="grid grid-cols-2 gap-8 w-full">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1,
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                  }}
                  className="text-center p-6 rounded-[1.5rem] bg-white border border-slate-200/60
                             shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]"
                >
                  <AnimatedCounter value={stat.value} delay={i * 0.1 + 0.2} />
                  <div className="text-sm text-slate-400 mt-1 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
