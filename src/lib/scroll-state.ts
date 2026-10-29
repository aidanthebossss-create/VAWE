import type Lenis from 'lenis';

// Shared, mutable scroll state written by <SmoothScroll /> and read inside
// animation loops (StretchText, Marquee). Kept outside React so reading it
// every frame never triggers a render.
export const scrollState: { velocity: number; lenis: Lenis | null } = {
  velocity: 0,
  lenis: null,
};

