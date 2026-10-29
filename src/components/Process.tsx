'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeading from './fx/SectionHeading';
import StretchText from './fx/StretchText';
import { useMotionAllowed } from '@/lib/motion-pref';
import { EASE_OUT } from '@/lib/motion';

const phases = [
  {
    title: 'Discovery',
    color: '#6CCCE0',
    body: 'We dig into your goals, audience and brand. A short questionnaire and a call become a clear plan, a sitemap and a fixed quote.',
    gets: ['Discovery questionnaire', 'Proposal & fixed quote', 'Sitemap'],
  },
  {
    title: 'Design',
    color: '#3DAEC5',
    body: 'Wireframes grow into full mockups. We refine them with you until every page reflects your brand and every interaction feels obvious.',
    gets: ['Wireframes', 'High-fidelity mockups', 'Revision rounds'],
  },
  {
    title: 'Develop',
    color: '#2389A4',
    body: 'Clean, semantic code brings the design to life, with speed, accessibility and room to grow built in from the start.',
    gets: ['Next.js or Shopify build', 'CMS you can edit', 'Speed & SEO tuning'],
  },
  {
    title: 'Launch',
    color: '#2A9D8F',
    body: 'We test on real phones and browsers, then go live, monitor and keep tuning once real visitors arrive.',
    gets: ['Cross-device testing', 'Domain, hosting & SSL', 'Handover & training'],
  },
];

// Typical schedules per package, in weeks: [start, end] for each phase.
// They match the delivery times on the pricing cards.
const plans = [
  { name: 'Spark', weeks: 2, spans: [[0, 0.3], [0.3, 1], [0.8, 1.8], [1.8, 2]] },
  { name: 'Presence', weeks: 4, spans: [[0, 0.5], [0.5, 1.8], [1.5, 3.5], [3.5, 4]] },
  { name: 'Growth', weeks: 6, spans: [[0, 0.75], [0.75, 2.5], [2, 5.25], [5.25, 6]] },
  { name: 'Commerce', weeks: 8, spans: [[0, 1], [1, 3], [2.5, 7], [7, 8]] },
] as const;

/** A phase length in working days or weeks, e.g. "3 days", "2 wks". */
const duration = (w: number) => {
  const days = Math.round(w * 5);
  if (days < 5) return `${days} days`;
  const weeks = Math.round(w * 2) / 2;
  return `${weeks} wk${weeks === 1 ? '' : 's'}`;
};

// The project plan: a week-by-week chart of how a build actually runs, so a
// visitor sees exactly how long it takes and when they're involved.
export default function Process() {
  const [planIdx, setPlanIdx] = useState(1);
  const chart = useRef<HTMLDivElement>(null);
  const inView = useInView(chart, { once: true, margin: '-20% 0px' });
  const motionOk = useMotionAllowed();
  const shown = inView || !motionOk;
  const plan = plans[planIdx];
  const pct = (w: number) => `${(w / plan.weeks) * 100}%`;

  const milestones = [
    { at: 0, label: 'Kick-off call', align: 'start' },
    { at: plan.spans[1][1], label: 'Design sign-off', align: 'center' },
    { at: plan.weeks, label: 'Launch day', align: 'end' },
  ] as const;

  return (
    <section id="process" className="sheet bg-[#05232E] py-24 text-white md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_10%,rgba(42,157,143,0.14),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end">
          <SectionHeading tone="dark" eyebrow="04 · Our process" lines={['From first wave', 'to *full tide*']} />
          <p
            data-reveal="fade"
            style={{ '--d': '300ms' } as React.CSSProperties}
            className="max-w-[44ch] text-lg leading-relaxed text-white/65 md:justify-self-end"
          >
            Four clear stages and a fixed timeline. Pick a package to see how long it really takes, and when we need you.
          </p>
        </div>

        {/* Package switcher */}
        <div
          role="tablist"
          aria-label="Show the timeline for a package"
          className="mt-14 inline-flex flex-wrap gap-1 rounded-[22px] border border-white/10 bg-white/[0.04] p-1"
        >
          {plans.map((p, i) => (
            <button
              key={p.name}
              type="button"
              role="tab"
              aria-selected={i === planIdx}
              onClick={() => setPlanIdx(i)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                i === planIdx ? 'text-abyss' : 'text-white/65 hover:text-white'
              }`}
            >
              {i === planIdx && (
                <motion.span
                  layoutId="plan-pill"
                  className="absolute inset-0 rounded-full bg-light-cyan"
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                />
              )}
              <span className="relative">
                {p.name} <span className={i === planIdx ? 'text-abyss/60' : 'text-white/35'}>· {p.weeks} wks</span>
              </span>
            </button>
          ))}
        </div>

        {/* The chart */}
        <div ref={chart} className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-8">
          <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[170px_minmax(0,1fr)] md:gap-x-6">
            {/* Week ruler */}
            <div className="hidden md:block" />
            <div className="mb-2 flex h-6 font-mono text-[11px] text-white/40">
              {Array.from({ length: plan.weeks }, (_, w) => (
                <span key={`${plan.name}-${w}`} className="flex-1 border-l border-white/10 pl-2">
                  W{w + 1}
                </span>
              ))}
            </div>

            {phases.map((ph, i) => {
              const [a, b] = plan.spans[i];
              return (
                <div key={ph.title} className="contents">
                  <div className="mt-4 flex items-baseline gap-3 md:mt-0 md:h-14 md:items-center">
                    <span className="font-mono text-xs text-light-cyan">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-lg font-semibold">{ph.title}</span>
                    <span className="font-mono text-xs text-white/45 md:hidden">· {duration(b - a)}</span>
                  </div>
                  <div className="relative mt-2 h-11 md:mt-0 md:h-14">
                    <div aria-hidden="true" className="absolute inset-0 flex">
                      {Array.from({ length: plan.weeks }, (_, w) => (
                        <span key={w} className="flex-1 border-l border-white/[0.06]" />
                      ))}
                    </div>
                    <motion.div
                      className="absolute inset-y-1.5 md:inset-y-2.5"
                      initial={false}
                      animate={{ left: pct(a), width: pct(b - a) }}
                      transition={{ duration: 0.7, ease: EASE_OUT }}
                    >
                      <motion.div
                        className="flex h-full origin-left items-center justify-end overflow-hidden rounded-lg px-3"
                        style={{ background: `linear-gradient(90deg, ${ph.color}bb, ${ph.color})` }}
                        initial={motionOk ? { scaleX: 0 } : false}
                        animate={{ scaleX: shown ? 1 : 0 }}
                        transition={{ duration: 0.9, delay: 0.15 + i * 0.18, ease: EASE_OUT }}
                      >
                        <span className="hidden whitespace-nowrap font-mono text-[11px] font-medium text-abyss md:inline">
                          {duration(b - a)}
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              );
            })}

            {/* Milestones */}
            <div className="hidden md:block" />
            <div className="relative mt-6 h-6 border-t border-white/10 md:h-14">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.label}
                  className={`absolute top-0 flex flex-col ${
                    m.align === 'start' ? 'items-start' : m.align === 'end' ? 'items-end' : 'items-center'
                  }`}
                  initial={false}
                  animate={{ left: pct(m.at), opacity: shown ? 1 : 0 }}
                  transition={{ duration: 0.7, delay: shown ? 0.9 + i * 0.12 : 0, ease: EASE_OUT }}
                  style={{ x: m.align === 'start' ? '0%' : m.align === 'end' ? '-100%' : '-50%' }}
                >
                  <span className="-mt-[7px] h-3 w-3 rotate-45 bg-white" />
                  <span className="mt-2 hidden whitespace-nowrap text-xs text-white/60 md:block">{m.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-white/55 md:hidden">
            ◆ Kick-off call · ◆ Design sign-off in week {Math.ceil(plan.spans[1][1])} · ◆ Launch at the end of week {plan.weeks}
          </p>
        </div>

        {/* What happens in each phase */}
        <ol className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {phases.map((ph, i) => (
            <li
              key={ph.title}
              data-reveal="fade"
              style={{ '--d': `${i * 90}ms` } as React.CSSProperties}
              className="grid content-start gap-4 border-t border-white/10 pt-6"
            >
              <span className="h-1 w-10 rounded-full" style={{ background: ph.color }} />
              <p className="font-mono text-sm text-white/45">
                {String(i + 1).padStart(2, '0')} · {duration(plan.spans[i][1] - plan.spans[i][0])}
              </p>
              <StretchText
                as="h3"
                lines={[ph.title]}
                className="font-display text-[clamp(2rem,2.6vw,2.6rem)] font-bold leading-none tracking-[-0.03em] text-white"
              />
              <p className="leading-relaxed text-white/65">{ph.body}</p>
              <ul className="flex flex-wrap gap-2">
                {ph.gets.map((g) => (
                  <li key={g} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/75">
                    {g}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
