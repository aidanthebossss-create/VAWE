'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from '@phosphor-icons/react';

function TextScramble({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*';

  useEffect(() => {
    let frame = 0;
    const totalFrames = text.length * 3;

    const interval = setInterval(() => {
      const progress = frame / totalFrames;
      const resolved = Math.floor(progress * text.length);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < resolved) {
          result += text[i];
        } else if (i < resolved + 3) {
          result += chars[Math.floor(Math.random() * chars.length)];
        } else {
          result += ' ';
        }
      }
      setDisplayed(result);
      frame++;

      if (frame > totalFrames) {
        setDisplayed(text);
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayed}</span>;
}

function MorphingWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 1440 320"
        className="w-full h-auto block"
        preserveAspectRatio="none"
        style={{ minHeight: '120px' }}
      >
        <path
          fill="#0e7490"
          fillOpacity="0.08"
          style={{ animation: 'morphWave1 8s ease-in-out infinite' }}
          d="M0,160 C320,220 640,100 960,180 C1280,260 1440,140 1440,140 L1440,320 L0,320 Z"
        />
        <path
          fill="#0e7490"
          fillOpacity="0.05"
          style={{ animation: 'morphWave2 10s ease-in-out infinite' }}
          d="M0,200 C320,260 640,180 960,240 C1280,180 1440,220 1440,220 L1440,320 L0,320 Z"
        />
        <path
          fill="#0e7490"
          fillOpacity="0.03"
          style={{ animation: 'morphWave3 6s ease-in-out infinite' }}
          d="M0,250 C320,280 640,240 960,270 C1280,240 1440,260 1440,260 L1440,320 L0,320 Z"
        />
      </svg>
    </div>
  );
}

function MeshGradientBlob() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] animate-morph-blob opacity-20"
        style={{
          background: 'linear-gradient(135deg, #22d3ee 0%, #0e7490 40%, #67e8f9 70%, #ecfeff 100%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute -bottom-48 -left-32 w-[500px] h-[500px] animate-morph-blob opacity-15"
        style={{
          background: 'linear-gradient(225deg, #0e7490 0%, #22d3ee 50%, #67e8f9 100%)',
          filter: 'blur(90px)',
          animationDelay: '-4s',
          animationDuration: '12s',
        }}
      />
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      <MeshGradientBlob />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-24 md:pt-0">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocean-foam border border-ocean-light/30 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-ocean-mid" style={{ animation: 'pulse-ring 2s ease-in-out infinite' }} />
              <span className="text-sm font-medium text-ocean-deep">Web Design Studio</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 80, damping: 20 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-zinc-900 mb-6"
            >
              <TextScramble text="We craft" className="block" />
              <span className="block mt-1">
                digital{' '}
                <span className="relative inline-block">
                  <span
                    className="bg-gradient-to-r from-ocean-deep via-ocean-mid to-ocean-light bg-clip-text text-transparent animate-gradient-flow"
                    style={{ backgroundSize: '300% 100%' }}
                  >
                    waves
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path
                      d="M0,6 Q50,0 100,6 Q150,12 200,6"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ animation: 'morphWave3 3s ease-in-out infinite' }}
                    />
                  </svg>
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 80, damping: 20 }}
              className="text-lg text-slate-500 leading-relaxed max-w-[50ch] mb-10"
            >
              VAWES builds high-performance websites that move audiences.
              From concept to code, we deliver digital experiences that
              stand apart from the tide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 80, damping: 20 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-ocean-deep text-white font-semibold rounded-full
                           shadow-[0_8px_32px_-8px_rgba(14,116,144,0.5)]
                           hover:shadow-[0_12px_40px_-8px_rgba(14,116,144,0.6)]
                           transition-shadow"
              >
                Get a Free Quote
              </motion.a>
              <motion.a
                href="#work"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 border border-slate-200 text-slate-700 font-semibold rounded-full
                           hover:border-ocean-mid hover:text-ocean-deep transition-colors"
              >
                View Our Work
              </motion.a>
            </motion.div>
          </div>

          {/* Right - Animated visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 60, damping: 20 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-square max-w-[520px] mx-auto">
              {/* Browser mockup */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-8 bg-white rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(14,116,144,0.2)]
                           border border-slate-200/60 overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
                  <div className="w-3 h-3 rounded-full bg-rose-400/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
                  <div className="flex-1 mx-4 h-6 rounded-lg bg-slate-50 flex items-center px-3">
                    <span className="text-[10px] text-slate-400 font-mono">vawes.co.za</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-5 w-3/4 rounded-md bg-gradient-to-r from-ocean-deep/10 to-ocean-light/10 animate-shimmer"
                       style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(14,116,144,0.1) 50%, transparent 100%)' }} />
                  <div className="h-4 w-full rounded-md bg-slate-100" />
                  <div className="h-4 w-5/6 rounded-md bg-slate-50" />
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="h-20 rounded-xl bg-gradient-to-br from-ocean-foam to-ocean-light/20" />
                    <div className="h-20 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100" />
                  </div>
                  <div className="h-8 w-32 rounded-full bg-ocean-deep/80 mt-4" />
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-4 right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-ocean-mid to-ocean-light
                           shadow-[0_12px_32px_-8px_rgba(14,116,144,0.4)] flex items-center justify-center"
              >
                <span className="text-white text-2xl font-bold">&lt;/&gt;</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute bottom-12 left-0 px-4 py-2 rounded-xl bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)]
                           border border-slate-100 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 text-sm font-bold">97</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Performance</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Lighthouse Score</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <MorphingWaves />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={24} weight="bold" className="text-ocean-mid/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
