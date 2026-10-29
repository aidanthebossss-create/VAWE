'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { scrollState } from '@/lib/scroll-state';
import { useMotionAllowed } from '@/lib/motion-pref';

// Weighted, momentum scrolling for the whole page. Also publishes the scroll
// velocity that drives the stretchy type. Skipped entirely when motion is
// off (OS setting or the footer toggle), so those visitors get native scrolling.
export default function SmoothScroll() {
  const allowed = useMotionAllowed();

  useEffect(() => {
    if (!allowed) return;

    const lenis = new Lenis({
      duration: 1.15,
      autoRaf: true,
      anchors: { offset: -72 },
    });
    scrollState.lenis = lenis;
    lenis.on('scroll', (l: Lenis) => {
      scrollState.velocity = l.velocity;
    });

    return () => {
      lenis.destroy();
      scrollState.lenis = null;
      scrollState.velocity = 0;
    };
  }, [allowed]);

  return null;
}
