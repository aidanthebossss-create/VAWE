'use client';

import { useRef, type ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  tone?: 'navy' | 'cyan' | 'glass';
  className?: string;
  external?: boolean;
};

// A pill link that leans toward the cursor and fills with water from the
// exact point the cursor entered (styles live in globals.css: .liquid-btn).
export default function MagneticButton({ href, children, tone = 'navy', className = '', external }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const setOrigin = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
    if (inner.current) inner.current.style.transform = `translate(${dx * 0.1}px, ${dy * 0.15}px)`;
  };

  const onLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    setOrigin(e);
    if (ref.current) ref.current.style.transform = '';
    if (inner.current) inner.current.style.transform = '';
  };

  return (
    <a
      ref={ref}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onPointerEnter={setOrigin}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`liquid-btn liquid-btn--${tone} ${className}`}
    >
      <span ref={inner} className="liquid-btn__label">
        {children}
      </span>
    </a>
  );
}
