'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowDownRight, ArrowRight, WhatsappLogo } from '@phosphor-icons/react';
import { waLink } from './fx/WhatsAppFab';
import LiquidGlass from './fx/LiquidGlass';
import StretchText from './fx/StretchText';
import MagneticButton from './fx/MagneticButton';
import WaveLines from './fx/WaveLines';
import { useMotionAllowed } from '@/lib/motion-pref';
import { EASE_OUT } from '@/lib/motion';

const facts = ['Packages from R2,500', 'Live in 2 to 8 weeks', 'Replies within 24 hours'];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.9, ease: EASE_OUT },
        };

  return (
    <section
      ref={ref}
      id="top"
      className="water-fallback grain relative isolate flex min-h-[100svh] flex-col overflow-hidden text-white"
    >
      <LiquidGlass className="-z-20" />
      {/* Shade under the copy so it reads over the brightest water */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,30,51,0.6)_0%,rgba(7,30,51,0.2)_45%,transparent_70%),linear-gradient(0deg,rgba(7,30,51,0.55)_0%,transparent_45%)]"
      />
      <WaveLines
        delay={0.2}
        colors={['#BFEFF7', '#6CCCE0', '#3DAEC5']}
        className="pointer-events-none absolute left-[-5%] top-[18%] -z-10 h-[34vh] w-[110%] opacity-40 mix-blend-screen"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-24"
      >
        <motion.p {...rise(0.1)} className="eyebrow mb-6 text-light-cyan md:mb-8">
          Web design &amp; development studio · South Africa
        </motion.p>

        <StretchText
          as="h1"
          lines={['We craft', 'digital *waves.*']}
          className="display-1 text-white [text-shadow:0_2px_40px_rgba(4,18,32,0.35)]"
          accentClassName="text-light-cyan"
          min={75}
          max={100}
          radius={170}
        />

        <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
          <motion.p {...rise(0.35)} className="max-w-[46ch] text-lg leading-relaxed text-white/85 md:text-xl">
            Websites for South African businesses that look premium, load fast and bring in
            enquiries. Designed and built in-house by Liam and Aidan, from first sketch to launch.
          </motion.p>
          <motion.div {...rise(0.5)} className="flex flex-wrap gap-3">
            <MagneticButton href="#contact" tone="cyan">
              Get a free quote <ArrowRight size={18} weight="bold" />
            </MagneticButton>
            <MagneticButton href={waLink("Hi VAWES, I'd like to chat about a website.")} tone="glass" external>
              <WhatsappLogo size={20} weight="fill" /> WhatsApp us
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          {...rise(0.7)}
          className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-white/15 pt-5 md:mt-16"
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {facts.map((f) => (
              <li key={f} className="eyebrow text-white/70">
                {f}
              </li>
            ))}
          </ul>
          <a href="#work" className="eyebrow group flex items-center gap-2 text-white/70 transition-colors hover:text-white">
            See our work
            <ArrowDownRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
