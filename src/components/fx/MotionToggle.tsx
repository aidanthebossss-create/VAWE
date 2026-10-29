'use client';

import { setMotionOff, useUserMotionOff } from '@/lib/motion-pref';

// Lets any visitor pause all ambient motion (water, wave of words, stretchy
// type, smooth scrolling). The choice is remembered on this device.
export default function MotionToggle({ className = '' }: { className?: string }) {
  const off = useUserMotionOff();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!off}
      onClick={() => setMotionOff(!off)}
      className={`group inline-flex items-center gap-3 text-xs text-white/60 transition-colors hover:text-white ${className}`}
    >
      <span className="eyebrow">Animations</span>
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 rounded-full transition-colors ${off ? 'bg-white/20' : 'bg-ocean-teal'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-[left] ${off ? 'left-0.5' : 'left-[18px]'}`}
        />
      </span>
      <span className="w-6 text-left">{off ? 'Off' : 'On'}</span>
    </button>
  );
}
