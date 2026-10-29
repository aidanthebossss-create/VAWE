'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion';
import SectionHeading from './fx/SectionHeading';
import StretchText from './fx/StretchText';
import WaveLines from './fx/WaveLines';
import { useMotionAllowed } from '@/lib/motion-pref';
import { EASE_OUT } from '@/lib/motion';

const manifesto =
  'VAWES started with a simple belief: the web should move people. We are a two-person design and engineering studio in South Africa, and every site we ship is hand-built, tested on real phones and made to bring in business.';

const founders = [
  {
    initial: 'L',
    name: 'Liam',
    role: 'Co-founder · Creative',
    focus: ['Brand identity', 'UI design', 'Art direction'],
    tone: 'from-[#2389A4] via-[#11426D] to-[#071E33]',
  },
  {
    initial: 'A',
    name: 'Aidan',
    role: 'Co-founder · Engineering',
    focus: ['Next.js & React', 'Performance', 'E-commerce'],
    tone: 'from-[#2A9D8F] via-[#0E3A4F] to-[#071E33]',
  },
];

const stats = [
  { prefix: '', value: 24, decimals: 0, suffix: 'h', label: 'Response time', note: 'How fast we reply' },
  { prefix: '', value: 98, decimals: 0, suffix: '%', label: 'Client retention', note: 'Clients who come back' },
  { prefix: '', value: 4.9, decimals: 1, suffix: '', label: 'Average rating', note: 'Across client reviews' },
  { prefix: '<', value: 2, decimals: 0, suffix: 's', label: 'Average load time', note: 'Typical page load' },
];

const principles = [
  { title: 'Hand-built, never templated', body: 'Every layout is designed for your business and coded from scratch, so it fits instead of almost fitting.' },
  { title: 'Fast by default', body: 'Speed is part of the design, not an afterthought. Lighter pages rank better and cost your visitors less data.' },
  { title: 'Straight answers', body: 'A fixed quote before we start, one person to talk to and plain-language updates the whole way through.' },
];

// Each word brightens as the reader scrolls through the statement.
function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [i / total, (i + 1) / total], [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{' '}
    </motion.span>
  );
}

function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const motionOk = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const words = manifesto.split(' ');
  return (
    <p
      ref={ref}
      className="max-w-[30ch] font-display text-[clamp(1.9rem,4vw,3.6rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-ink [font-variation-settings:'wdth'_88]"
    >
      {motionOk
        ? words.map((w, i) => <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />)
        : manifesto}
    </p>
  );
}

// Counts up like a tide marker rising when it first scrolls into view.
function Counter({ s }: { s: (typeof stats)[number] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const reduce = !useMotionAllowed();
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, s.value, { duration: 1.6, ease: EASE_OUT, onUpdate: setV });
    return () => c.stop();
  }, [inView, reduce, s.value]);

  return (
    <span ref={ref} className="tabular-nums">
      {s.prefix}
      {(reduce ? s.value : v).toFixed(s.decimals)}
      {s.suffix}
    </span>
  );
}

// A tall deep-water card per founder. The giant initial stretches toward the
// cursor; swap the gradient for a portrait once photos are ready.
function FounderCard({ f }: { f: (typeof founders)[number] }) {
  return (
    <article data-reveal="unmask" className="relative overflow-hidden rounded-[28px]">
      <div className={`grain relative flex min-h-[22rem] sm:aspect-[4/5] sm:min-h-[28rem] flex-col justify-between gap-6 overflow-hidden bg-gradient-to-br p-7 text-white md:p-9 ${f.tone}`}>
        <WaveLines
          onView
          colors={['rgba(191,239,247,0.5)', 'rgba(108,204,224,0.4)', 'rgba(61,174,197,0.35)']}
          className="pointer-events-none absolute -left-[20%] top-[38%] h-32 w-[140%] opacity-70"
        />
        <p className="eyebrow relative text-light-cyan/90">{f.role}</p>
        <StretchText
          as="p"
          lines={[f.initial]}
          reveal={false}
          min={75}
          max={100}
          radius={260}
          className="relative font-display text-[clamp(7rem,11vw,12rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-white/90"
        />
        <div className="relative">
          <h3 className="font-display text-4xl font-bold tracking-tight">{f.name}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {f.focus.map((x) => (
              <li key={x} className="rounded-full border border-white/20 bg-white/[0.08] px-3 py-1 text-sm text-white/85">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

// The studio: a statement that lights up as you read it, the two people
// behind the work, how we work, and the numbers.
export default function About() {
  return (
    <section id="about" className="sheet bg-paper-2 py-24 text-ink md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="05 · About VAWES" lines={['Two builders,', 'one *ocean* of ideas']} />
          <p data-reveal="wipe" className="eyebrow text-ink-soft">
            Web design &amp; development studio · South Africa
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          <div className="grid content-between gap-12">
            <Manifesto />
            <ol className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {principles.map((p, i) => (
                <li
                  key={p.title}
                  data-reveal="fade"
                  style={{ '--d': `${i * 90}ms` } as React.CSSProperties}
                  className="grid content-start gap-2 border-t border-ink/15 pt-5"
                >
                  <span className="font-mono text-xs text-ocean-teal">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-xl font-bold tracking-tight">{p.title}</h3>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid content-start items-start gap-5 sm:grid-cols-2 lg:sticky lg:top-28 lg:self-start">
            {founders.map((f) => (
              <FounderCard key={f.name} f={f} />
            ))}
          </div>
        </div>

        <dl data-reveal="fade" className="mt-20 grid grid-cols-2 rounded-[28px] border border-ink/10 bg-white/60 md:mt-28 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`grid gap-2 p-6 md:p-8 ${i % 2 === 1 ? 'border-l border-ink/10' : ''} ${
                i >= 2 ? 'border-t border-ink/10 lg:border-t-0' : ''
              } ${i === 2 ? 'lg:border-l' : ''}`}
            >
              <dt className="order-2 grid gap-0.5">
                <span className="text-sm font-semibold text-ink">{s.label}</span>
                <span className="text-xs text-ink-soft">{s.note}</span>
              </dt>
              <dd className="order-1 font-display text-[clamp(2.8rem,5vw,4.6rem)] font-bold leading-none tracking-[-0.04em] text-deep-navy [font-variation-settings:'wdth'_80]">
                <Counter s={s} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
