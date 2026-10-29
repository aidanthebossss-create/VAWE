// The VAWES motion system. Every animation draws its rhythm from here (and
// from the matching CSS variables in globals.css), so changing one curve
// changes the feel of the whole site.

/** Reveals and arrivals: fast start, long soft landing (≈ expo.out). */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Wipes and masks that travel across the screen (≈ expo.inOut). */
export const EASE_IN_OUT = [0.87, 0, 0.13, 1] as const;

export const DUR = {
  /** Hover and press feedback: keep under half a second. */
  hover: 0.3,
  /** Panels, toggles, small entrances. */
  ui: 0.5,
  /** Section reveals. */
  reveal: 0.9,
} as const;

/** Delay between siblings in a staggered reveal, in seconds. */
export const STAGGER = 0.08;
