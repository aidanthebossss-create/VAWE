'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function WaveDivider({
  flip = false,
  fromColor = '#f8fafb',
  toColor = '#18181b',
}: {
  flip?: boolean;
  fromColor?: string;
  toColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const morphProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden pointer-events-none ${flip ? 'rotate-180' : ''}`}
      style={{ marginTop: '-1px', marginBottom: '-1px' }}
    >
      <svg
        viewBox="0 0 1440 140"
        className="w-full block"
        preserveAspectRatio="none"
        style={{ height: '80px' }}
      >
        <path
          fill={toColor}
          style={{ animation: 'morphWave1 7s ease-in-out infinite' }}
          d="M0,60 C240,120 480,20 720,80 C960,140 1200,40 1440,80 L1440,140 L0,140 Z"
        />
        <path
          fill={toColor}
          fillOpacity="0.6"
          style={{ animation: 'morphWave2 9s ease-in-out infinite' }}
          d="M0,80 C240,40 480,120 720,60 C960,20 1200,100 1440,60 L1440,140 L0,140 Z"
        />
      </svg>
    </div>
  );
}
