'use client';

import { motion } from 'framer-motion';
import { useMotionAllowed } from '@/lib/motion-pref';
import { EASE_IN_OUT } from '@/lib/motion';

type Props = {
  className?: string;
  colors?: [string, string, string];
  delay?: number;
  /** Draw on first view instead of on mount. */
  onView?: boolean;
};

// The logo's signature: three parallel wave strokes with trailing dots.
// The strokes draw themselves in, then the dots drop off the ends.
export default function WaveLines({
  className = '',
  colors = ['#6CCCE0', '#3DAEC5', '#2389A4'],
  delay = 0,
  onView = false,
}: Props) {
  const reduce = !useMotionAllowed();
  const d = (o: number) =>
    `M ${-20} ${70 + o} C 140 ${-10 + o}, 260 ${-10 + o}, 380 ${80 + o} S 620 ${170 + o}, 760 ${80 + o} S 980 ${-10 + o}, 1220 ${70 + o}`;
  const offsets = [0, 18, 36];
  const anim = onView
    ? { whileInView: { pathLength: 1, opacity: 1 }, viewport: { once: true, margin: '-10%' } }
    : { animate: { pathLength: 1, opacity: 1 } };

  return (
    <svg viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true" className={className}>
      {offsets.map((o, i) => (
        <motion.path
          key={o}
          d={d(o)}
          fill="none"
          stroke={colors[i]}
          strokeWidth={2.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          {...anim}
          transition={{ duration: 1.4, delay: delay + i * 0.12, ease: EASE_IN_OUT }}
        />
      ))}
      {offsets.map((o, i) => (
        <motion.circle
          key={`d${o}`}
          cx={1180 - i * 16}
          cy={o + 58}
          r={3.2}
          fill={colors[i]}
          initial={reduce ? false : { opacity: 0, y: -14 }}
          {...(onView
            ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-10%' } }
            : { animate: { opacity: 1, y: 0 } })}
          transition={{ duration: 0.5, delay: delay + 1.3 + i * 0.1, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}
