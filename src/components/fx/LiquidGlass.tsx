'use client';

import { useEffect, useRef } from 'react';
import { lowPowerDevice, useMotionAllowed } from '@/lib/motion-pref';

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0., 1.); }`;

// Domain-warped noise in the brand palette, with the logo's triple-stroke
// lines drawn as contour lines through it. The pointer bulges the water and
// a quick flick (V) makes it swell and glint.
const FRAG = `#version 300 es
precision highp float;
uniform vec2 R;
uniform float T;
uniform vec2 M;
uniform float V;
out vec4 o;

float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0., a = .5;
  for (int i = 0; i < 5; i++) { v += a * n(p); p = p * 2.03 + vec2(1.7, 9.2); a *= .5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - .5 * R) / R.y;
  vec2 m = (M - .5 * R) / R.y;
  vec2 dm = p - m;
  float d2 = dot(dm, dm);
  p += dm * exp(-d2 * 9.) * (.25 + V * 1.4);

  float t = T * .06;
  vec2 q = vec2(fbm(p * 1.3 + vec2(0., t)), fbm(p * 1.3 + vec2(5.2, 1.3) - t));
  vec2 w = vec2(fbm(p * 1.5 + 1.8 * q + vec2(1.7, 9.2) + t * 1.3),
                fbm(p * 1.5 + 1.8 * q + vec2(8.3, 2.8) - t * 1.1));
  float f = fbm(p * 1.1 + 2.2 * w);

  vec3 abyss = vec3(.027, .118, .2);
  vec3 navy  = vec3(.067, .259, .427);
  vec3 teal  = vec3(.137, .537, .643);
  vec3 cyan  = vec3(.424, .8, .878);
  vec3 em    = vec3(.165, .616, .561);

  vec3 c = mix(abyss, navy, smoothstep(.15, .55, f));
  c = mix(c, teal, smoothstep(.45, .85, f + w.x * .25));
  c = mix(c, em, smoothstep(.7, 1., w.y) * .3);
  c = mix(c, cyan, smoothstep(.74, 1., f + q.y * .2) * .75);

  float b = f * 18.;
  float fw = fwidth(b);
  float ln = 1. - smoothstep(0., fw * 1.3, abs(fract(b) - .5) - .02);
  ln *= step(mod(floor(b + .5), 7.), 2.5);
  ln *= 1. - smoothstep(.25, .6, fw);
  float mask = smoothstep(.48, .78, fbm(p * .7 - t * .6 + 3.));
  c = mix(c, vec3(.86, .97, 1.), ln * mask * .6);

  c += vec3(.5, .85, .95) * exp(-d2 * 30.) * (.06 + V * .25);
  c *= 1. - .3 * length(gl_FragCoord.xy / R - .5);
  o = vec4(c, 1.);
}`;

type Props = {
  className?: string;
  /** Render resolution relative to CSS pixels (capped at 1.5x DPR). */
  quality?: number;
  /** Drop to ~30fps once the visitor has scrolled past the first screen. */
  calmBelowFold?: boolean;
};

// A full-bleed WebGL water surface. It sits behind content, fades in after
// its first frame (so text is always the first thing painted), sleeps when
// off-screen or in a background tab, and freezes on a single frame for
// reduced-motion visitors. Without WebGL2 the parent's CSS gradient shows.
export default function LiquidGlass({ className = '', quality = 0.7, calmBelowFold = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const allowed = useMotionAllowed();

  useEffect(() => {
    const canvas = ref.current;
    // Data Saver and very low-memory phones keep the CSS gradient instead.
    if (!canvas || lowPowerDevice()) return;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, 'R');
    const uT = gl.getUniformLocation(prog, 'T');
    const uM = gl.getUniformLocation(prog, 'M');
    const uV = gl.getUniformLocation(prog, 'V');

    const reduce = !allowed;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const q = coarse ? quality * 0.7 : quality;

    let k = 1;
    let mx = 0, my = 0, tx = 0, ty = 0, vel = 0;
    let inView = true;
    let raf = 0;
    let shown = false;
    let lastDraw = 0;
    const t0 = performance.now() - 9000;

    const size = () => {
      k = Math.min(window.devicePixelRatio || 1, 1.5) * q;
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(r.width * k));
      canvas.height = Math.max(2, Math.round(r.height * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (!mx && !my) {
        tx = mx = canvas.width * 0.7;
        ty = my = canvas.height * 0.45;
      }
      if (reduce) draw(performance.now());
    };

    const onMove = (e: PointerEvent) => {
      if (!inView) return;
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - r.left) * k;
      const ny = (r.height - (e.clientY - r.top)) * k;
      vel = Math.min(1, vel + Math.hypot(nx - tx, ny - ty) / (canvas.height * 0.6));
      tx = nx;
      ty = ny;
    };

    const draw = (now: number) => {
      mx += (tx - mx) * 0.12;
      my += (ty - my) * 0.12;
      vel *= 0.94;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uM, mx, my);
      gl.uniform1f(uV, vel);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.style.opacity = '1';
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (calmBelowFold && window.scrollY > window.innerHeight && now - lastDraw < 32) return;
      lastDraw = now;
      draw(now);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (!reduce && inView && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pointermove', onMove, { passive: true });

    size();
    draw(performance.now());
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
    };
  }, [quality, allowed, calmBelowFold]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`absolute inset-0 block h-full w-full opacity-0 transition-opacity duration-[1400ms] ${className}`}
    />
  );
}
