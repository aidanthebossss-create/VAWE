'use client';

import { createElement, useEffect, useRef, type ReactNode } from 'react';
import { scrollState } from '@/lib/scroll-state';
import { useMotionAllowed } from '@/lib/motion-pref';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

type Props = {
  /** One string per line. Wrap words in *asterisks* to give them `accentClassName`. */
  lines: string[];
  as?: Tag;
  className?: string;
  accentClassName?: string;
  /** Resting width on the font's wdth axis (75 = condensed, 100 = normal). */
  min?: number;
  max?: number;
  /** How far from the cursor (px) letters still feel the pull. */
  radius?: number;
  /** Slide each line up from behind a mask when it first scrolls in. */
  reveal?: boolean;
  /** Run a wave of width through the letters when the text first scrolls in. */
  sweep?: boolean;
  /** How much fast scrolling widens every letter, in wdth units. Off by
   *  default: reflowing text on every scroll frame reads as jitter. */
  momentum?: number;
};

type Seg = { text: string; accent: boolean };

function parse(line: string): Seg[] {
  return line
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((s) =>
      s.startsWith('*') && s.endsWith('*')
        ? { text: s.slice(1, -1), accent: true }
        : { text: s, accent: false },
    );
}

// Text whose letters stretch on the variable font's width axis: near the
// cursor (like water pushing through), in a wave when the text scrolls into
// view, and all together with scroll momentum. Screen readers get the plain
// string; the per-letter spans are hidden from them.
export default function StretchText({
  lines,
  as = 'h2',
  className = '',
  accentClassName = '',
  min = 78,
  max = 100,
  radius = 110,
  sweep = true,
  momentum = 0,
  reveal = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const allowed = useMotionAllowed();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const chars = Array.from(root.querySelectorAll<HTMLSpanElement>('[data-ch]'));
    const n = chars.length;
    if (!n) return;
    const reduce = !allowed;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const cur = new Float32Array(n).fill(min);
    chars.forEach((c) => (c.style.fontVariationSettings = `'wdth' ${min}`));
    if (reduce) return;

    let px = -9999, py = -9999;
    let inView = false;
    let sweepStart = -1;
    let swept = !sweep;
    let raf = 0;
    const span = max - min;

    const tick = (now: number) => {
      raf = 0;
      const box = root.getBoundingClientRect();
      const near =
        fine &&
        px > box.left - radius && px < box.right + radius &&
        py > box.top - radius && py < box.bottom + radius;
      const boost = Math.min(1, Math.abs(scrollState.velocity) / 40) * momentum;
      let sweepP = -1;
      if (sweepStart >= 0) {
        sweepP = (now - sweepStart) / 1300;
        if (sweepP > 1) { sweepStart = -1; sweepP = -1; }
      }

      const rects = near ? chars.map((c) => c.getBoundingClientRect()) : null;
      let moving = false;
      for (let i = 0; i < n; i++) {
        let target = min + boost;
        if (rects) {
          const r = rects[i];
          const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
          target += span * Math.max(0, 1 - d / radius) ** 1.6;
        }
        if (sweepP >= 0) {
          const x = i / Math.max(1, n - 1) - (sweepP * 1.3 - 0.15);
          target += span * 0.85 * Math.exp(-(x * x) * 60);
        }
        target = Math.min(max, target);
        const next = cur[i] + (target - cur[i]) * 0.16;
        if (Math.abs(next - cur[i]) > 0.05) {
          moving = true;
          cur[i] = next;
          chars[i].style.fontVariationSettings = `'wdth' ${next.toFixed(1)}`;
        }
      }
      if (inView && (moving || near || boost > 0.05 || sweepStart >= 0)) {
        raf = requestAnimationFrame(tick);
      }
    };
    const kick = () => {
      if (!raf && inView) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      kick();
    };
    const onScroll = () => kick();
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !swept) {
          swept = true;
          // Let the line reveal land before the width wave rolls through.
          sweepStart = performance.now() + (reveal ? 700 : 150);
        }
        kick();
      },
      { rootMargin: '-8% 0px' },
    );
    io.observe(root);
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [min, max, radius, sweep, momentum, allowed, reveal]);

  const plain = lines.map((l) => l.replace(/\*/g, '')).join(' ');
  let key = 0;

  const visual: ReactNode = lines.map((line, li) => (
    <span key={li} className="rv-line">
      <span className="rv-in" style={{ '--i': li } as React.CSSProperties}>
      {parse(line).map((seg) =>
        seg.text.split(/(\s+)/).map((word) => {
          if (!word) return null;
          if (/^\s+$/.test(word)) return <span key={key++}> </span>;
          return (
            <span key={key++} className={`inline-block whitespace-nowrap ${seg.accent ? accentClassName : ''}`}>
              {Array.from(word).map((ch) => (
                <span key={key++} data-ch="" className="inline-block">
                  {ch}
                </span>
              ))}
            </span>
          );
        }),
      )}
      </span>
    </span>
  ));

  return createElement(
    as,
    { ref, className: `stretch-text ${className}`, ...(reveal ? { 'data-reveal': 'lines' } : {}) },
    <span className="sr-only">{plain}</span>,
    <span aria-hidden="true">{visual}</span>,
  );
}
