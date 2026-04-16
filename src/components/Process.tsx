'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  ChatDots,
  PencilSimple,
  Code,
  RocketLaunch,
} from '@phosphor-icons/react';

const steps = [
  {
    number: '01',
    icon: ChatDots,
    title: 'Discovery',
    description: 'We dive deep into your goals, audience, and brand. Through collaborative workshops we map out the strategy that will guide every design decision.',
    color: 'text-ocean-mid',
    bg: 'bg-ocean-foam',
  },
  {
    number: '02',
    icon: PencilSimple,
    title: 'Design',
    description: 'Wireframes evolve into high-fidelity mockups. We iterate until every pixel reflects your vision and every interaction feels intuitive.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    number: '03',
    icon: Code,
    title: 'Develop',
    description: 'Clean, semantic code brings the design to life. We build with performance, accessibility, and scalability baked in from the start.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    number: '04',
    icon: RocketLaunch,
    title: 'Launch',
    description: 'Rigorous testing across devices and browsers. Then we deploy, monitor, and continue optimizing for peak performance.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        delay: index * 0.15,
        type: 'spring',
        stiffness: 80,
        damping: 20,
      }}
      className="relative group"
    >
      <div className="flex gap-6 md:gap-10 items-start">
        {/* Number + Line */}
        <div className="flex flex-col items-center flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center
                         shadow-[0_4px_12px_-4px_rgba(0,0,0,0.06)]
                         group-hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)]
                         transition-shadow duration-300`}
          >
            <Icon size={24} weight="duotone" className={step.color} />
          </motion.div>
          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.6, ease: 'easeOut' }}
              className="w-px h-24 bg-gradient-to-b from-slate-200 to-transparent origin-top mt-3"
            />
          )}
        </div>

        {/* Content */}
        <div className="pb-12">
          <span className={`text-xs font-mono font-bold ${step.color} tracking-widest`}>
            {step.number}
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mt-1 mb-3">
            {step.title}
          </h3>
          <p className="text-slate-500 leading-relaxed max-w-[45ch]">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const waveX = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section id="process" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Decorative wave in background */}
      <motion.div
        style={{ x: waveX }}
        className="absolute top-1/2 -translate-y-1/2 right-0 opacity-[0.03] pointer-events-none"
      >
        <svg width="800" height="600" viewBox="0 0 800 600">
          <path
            d="M0,300 Q200,100 400,300 Q600,500 800,300"
            fill="none"
            stroke="#0e7490"
            strokeWidth="120"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left - Header */}
          <div className="lg:sticky lg:top-32">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="inline-block text-sm font-medium text-ocean-mid tracking-wide uppercase mb-4"
            >
              Our Process
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}
              className="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-900 leading-tight mb-6"
            >
              From first wave
              <br />
              to <span className="text-ocean-mid">full tide</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
              className="text-slate-500 leading-relaxed max-w-[45ch]"
            >
              Our four-step process ensures every project flows
              smoothly from concept to launch. No surprises,
              no hidden currents.
            </motion.p>
          </div>

          {/* Right - Steps */}
          <div className="space-y-0">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
