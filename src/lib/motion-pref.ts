'use client';

import { useSyncExternalStore } from 'react';

// Site-wide motion preference. Motion is off when the operating system asks
// for reduced motion, or when the visitor switches it off with the toggle in
// the footer (remembered in localStorage). Every ambient animation reads this,
// which also gives WCAG 2.2.2 a single "pause everything" control.

const KEY = 'vawes-motion';
const listeners = new Set<() => void>();
let userOff: boolean | null = null;

function readUserOff() {
  if (userOff !== null) return userOff;
  try {
    userOff = window.localStorage.getItem(KEY) === 'off';
  } catch {
    userOff = false;
  }
  return userOff;
}

function osReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function motionAllowed() {
  if (typeof window === 'undefined') return true;
  return !osReduced() && !readUserOff();
}

export function setMotionOff(off: boolean) {
  userOff = off;
  try {
    window.localStorage.setItem(KEY, off ? 'off' : 'on');
  } catch {
    /* storage blocked: the choice still applies for this visit */
  }
  document.documentElement.dataset.motion = off ? 'off' : 'on';
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener('change', cb);
  };
}

/** True when ambient and decorative motion may run. */
export function useMotionAllowed() {
  return useSyncExternalStore(subscribe, motionAllowed, () => true);
}

/** True when the visitor (not the OS) has switched motion off. */
export function useUserMotionOff() {
  return useSyncExternalStore(subscribe, () => readUserOff(), () => false);
}

/** Skip heavy WebGL on Data Saver or very low-memory phones. */
export function lowPowerDevice() {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  return Boolean(nav.connection?.saveData) || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2);
}
