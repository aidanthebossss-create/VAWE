'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { PaperPlaneTilt, EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react';

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32 bg-zinc-950 overflow-hidden">
      {/* Morphing wave decoration */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none rotate-180">
        <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path
            fill="#f8fafb"
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1440,40 1440,40 L1440,0 L0,0 Z"
            style={{ animation: 'morphWave2 8s ease-in-out infinite' }}
          />
        </svg>
      </div>

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-[400px] h-[400px] animate-morph-blob opacity-10"
          style={{
            background: 'linear-gradient(135deg, #22d3ee, #0e7490)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-[350px] h-[350px] animate-morph-blob opacity-10"
          style={{
            background: 'linear-gradient(225deg, #0e7490, #67e8f9)',
            filter: 'blur(100px)',
            animationDelay: '-4s',
          }}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="inline-block text-sm font-medium text-ocean-light tracking-wide uppercase mb-4"
            >
              Get in Touch
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}
              className="text-3xl md:text-5xl font-bold tracking-tighter text-white leading-tight mb-6"
            >
              Ready to make
              <br />
              <span className="text-ocean-light">waves</span> together?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
              className="text-slate-400 leading-relaxed max-w-[45ch] mb-10"
            >
              Tell us about your project. We respond to every inquiry
              within 24 hours with a free consultation and estimate.
            </motion.p>

            {/* Contact details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100, damping: 20 }}
              className="space-y-4"
            >
              {[
                { icon: EnvelopeSimple, text: 'hello@vawes.co.za' },
                { icon: Phone, text: '+27 (0) 82 394 7128' },
                { icon: MapPin, text: 'South Africa' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <item.icon size={18} weight="duotone" className="text-ocean-light" />
                  </div>
                  <span className="text-slate-300 text-sm">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, type: 'spring', stiffness: 80, damping: 20 }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 md:p-10 rounded-[2rem] bg-white/5 border border-white/10
                         backdrop-blur-sm"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white
                               placeholder:text-slate-500 focus:outline-none focus:border-ocean-light/50
                               focus:ring-1 focus:ring-ocean-light/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white
                               placeholder:text-slate-500 focus:outline-none focus:border-ocean-light/50
                               focus:ring-1 focus:ring-ocean-light/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Type
                  </label>
                  <select
                    className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300
                               focus:outline-none focus:border-ocean-light/50
                               focus:ring-1 focus:ring-ocean-light/20 transition-all appearance-none"
                  >
                    <option value="" className="bg-zinc-900">Select a service</option>
                    <option value="design" className="bg-zinc-900">Web Design</option>
                    <option value="development" className="bg-zinc-900">Development</option>
                    <option value="ecommerce" className="bg-zinc-900">E-Commerce</option>
                    <option value="redesign" className="bg-zinc-900">Site Redesign</option>
                    <option value="other" className="bg-zinc-900">Something Else</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tell us about your project
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Budget range, timeline, goals..."
                    className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white
                               placeholder:text-slate-500 focus:outline-none focus:border-ocean-light/50
                               focus:ring-1 focus:ring-ocean-light/20 transition-all resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-8 bg-gradient-to-r from-ocean-deep to-ocean-mid text-white font-semibold
                             rounded-xl flex items-center justify-center gap-2
                             shadow-[0_8px_32px_-8px_rgba(14,116,144,0.5)]
                             hover:shadow-[0_12px_40px_-8px_rgba(14,116,144,0.6)]
                             transition-shadow"
                >
                  {submitted ? (
                    <span>Message Sent!</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <PaperPlaneTilt size={18} weight="bold" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
