'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  PaintBrush,
  Code,
  Rocket,
  MagnifyingGlass,
  ShoppingCart,
  Wrench,
} from '@phosphor-icons/react';

const services = [
  {
    icon: PaintBrush,
    title: 'Web Design',
    description: 'Custom designs that capture your brand identity. We create pixel-perfect layouts that convert visitors into customers.',
    accent: 'from-rose-500/10 to-orange-500/10',
    borderAccent: 'hover:border-rose-300/50',
    iconColor: 'text-rose-500',
  },
  {
    icon: Code,
    title: 'Development',
    description: 'Clean, performant code built with modern frameworks. Fast loading speeds and smooth interactions guaranteed.',
    accent: 'from-ocean-mid/10 to-ocean-light/10',
    borderAccent: 'hover:border-ocean-light/50',
    iconColor: 'text-ocean-mid',
  },
  {
    icon: Rocket,
    title: 'Performance',
    description: 'Core Web Vitals optimization, lazy loading, and CDN configuration. Your site will score 90+ on Lighthouse.',
    accent: 'from-violet-500/10 to-purple-500/10',
    borderAccent: 'hover:border-violet-300/50',
    iconColor: 'text-violet-500',
  },
  {
    icon: MagnifyingGlass,
    title: 'SEO Strategy',
    description: 'Technical SEO, structured data, and content optimization. We help you rank higher and drive organic traffic.',
    accent: 'from-emerald-500/10 to-teal-500/10',
    borderAccent: 'hover:border-emerald-300/50',
    iconColor: 'text-emerald-500',
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce',
    description: 'Shopify, WooCommerce, or custom storefronts. Secure payment processing and inventory management built in.',
    accent: 'from-amber-500/10 to-yellow-500/10',
    borderAccent: 'hover:border-amber-300/50',
    iconColor: 'text-amber-500',
  },
  {
    icon: Wrench,
    title: 'Maintenance',
    description: 'Ongoing support, security updates, and content changes. We keep your site running smoothly so you can focus on growth.',
    accent: 'from-slate-400/10 to-zinc-400/10',
    borderAccent: 'hover:border-slate-300/50',
    iconColor: 'text-slate-500',
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      whileHover={{ y: -4 }}
      className={`group relative p-8 rounded-[2rem] bg-white border border-slate-200/60
                   ${service.borderAccent}
                   shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]
                   hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]
                   transition-all duration-500 cursor-default`}
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.accent} flex items-center justify-center mb-6
                         group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} weight="duotone" className={service.iconColor} />
        </div>

        <h3 className="text-xl font-semibold text-zinc-900 tracking-tight mb-3">
          {service.title}
        </h3>

        <p className="text-slate-500 leading-relaxed text-[15px]">
          {service.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="mb-16 md:mb-20 max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="inline-block text-sm font-medium text-ocean-mid tracking-wide uppercase mb-4"
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}
            className="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-900 leading-tight"
          >
            Services built for the
            <br />
            <span className="text-ocean-mid">modern web</span>
          </motion.h2>
        </div>

        {/* Asymmetric grid - NOT 3 equal columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Row 1: large + small */}
          <div className="md:row-span-1">
            <ServiceCard service={services[0]} index={0} />
          </div>
          <div className="md:row-span-1">
            <ServiceCard service={services[1]} index={1} />
          </div>

          {/* Row 2: small + large */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <ServiceCard service={services[2]} index={2} />
              <ServiceCard service={services[3]} index={3} />
              <ServiceCard service={services[4]} index={4} />
            </div>
          </div>

          {/* Full width */}
          <div className="md:col-span-2">
            <ServiceCard service={services[5]} index={5} />
          </div>
        </div>
      </div>
    </section>
  );
}
