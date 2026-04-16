'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Star } from '@phosphor-icons/react';

const testimonials = [
  {
    name: 'Thandi Mokoena',
    role: 'Founder, Kelp & Co',
    text: 'VAWES transformed our online presence completely. The site they built for us loads in under a second and our conversion rate tripled within the first month.',
    rating: 5,
  },
  {
    name: 'Marco Delport',
    role: 'CTO, Prism Analytics',
    text: 'Working with Vuyo and Aidan felt like having senior engineers on our team. They built a complex dashboard that our users genuinely enjoy using.',
    rating: 5,
  },
  {
    name: 'Fatima Hassan',
    role: 'Director, Meridian Architecture',
    text: 'They understood our aesthetic immediately. The parallax galleries and scroll animations they created perfectly showcase our architectural work.',
    rating: 5,
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.15,
        type: 'spring',
        stiffness: 80,
        damping: 20,
      }}
      className="relative p-8 md:p-10 rounded-[2rem] bg-white border border-slate-200/60
                 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)]
                 transition-shadow duration-500"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={16} weight="fill" className="text-amber-400" />
        ))}
      </div>

      <p className="text-slate-600 leading-relaxed mb-8 text-[15px]">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-mid/20 to-ocean-light/20
                        flex items-center justify-center">
          <span className="text-sm font-bold text-ocean-deep">
            {testimonial.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-900">{testimonial.name}</div>
          <div className="text-xs text-slate-400">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="inline-block text-sm font-medium text-ocean-mid tracking-wide uppercase mb-4"
          >
            Client Words
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}
            className="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-900"
          >
            Riding the same <span className="text-ocean-mid">wave</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
