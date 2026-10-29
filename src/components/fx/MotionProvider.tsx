'use client';

import { MotionConfig } from 'framer-motion';
import SmoothScroll from './SmoothScroll';
import RevealObserver from './RevealObserver';
import { useMotionAllowed } from '@/lib/motion-pref';

// Applies the site-wide motion preference to every framer-motion animation
// (transforms are skipped when motion is off) and runs smooth scrolling.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const allowed = useMotionAllowed();
  return (
    <MotionConfig reducedMotion={allowed ? 'user' : 'always'}>
      <SmoothScroll />
      <RevealObserver />
      {children}
    </MotionConfig>
  );
}
