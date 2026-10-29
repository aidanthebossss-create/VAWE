'use client';

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  animate,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import StretchText from './fx/StretchText';
import { scrollState } from '@/lib/scroll-state';
import { useMotionAllowed } from '@/lib/motion-pref';
import { EASE_OUT } from '@/lib/motion';

const stages = [
  {
    title: 'Web Design',
    body: 'We start with structure, then dress it in your colours and type until it feels unmistakably yours.',
  },
  {
    title: 'Development',
    body: 'Clean, fast code on Next.js and React, with a CMS so you can change your own content.',
  },
  {
    title: 'Performance',
    body: 'Image optimisation, caching and Core Web Vitals tuning. Under two seconds to load, 90+ on Lighthouse.',
  },
  {
    title: 'SEO Strategy',
    body: 'Technical SEO, structured data and content that help customers find you first when they search.',
  },
  {
    title: 'E-Commerce',
    body: 'Shopify, WooCommerce or custom storefronts with secure local payments and stock management.',
  },
  {
    title: 'Maintenance',
    body: 'Updates, security patches, backups and uptime monitoring, so the site keeps running while you work.',
  },
];

const N = stages.length;
const ease = EASE_OUT;

// The demo client's own palette. Deliberately not VAWES colours: the point is
// that the finished site becomes *theirs*.
const site = {
  bg: '#F4F2EC',
  ink: '#1A2420',
  soft: '#6B746E',
  accent: '#2F6B4F',
  pill: '#DDD8CC',
  img: 'linear-gradient(135deg,#E8D9B5 0%,#8DB48E 48%,#2F5E48 100%)',
  wire: 'rgba(108,204,224,0.6)',
};

const overlayCard = 'rounded-2xl border border-white/10 bg-[#0B2235]/95 text-white shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)]';

/* ---------- pieces inside the 800×520 browser canvas ---------- */

function Block({
  x, y, w, h, painted, fill, radius = 8, delay = 0, children,
}: {
  x: number; y: number; w: number; h: number; painted: boolean; fill: string;
  radius?: number; delay?: number; children?: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute overflow-hidden border"
      style={{ left: x, top: y, width: w, height: h, borderRadius: radius }}
      initial={false}
      animate={{
        background: painted ? fill : 'rgba(108,204,224,0.04)',
        borderColor: painted ? 'rgba(0,0,0,0)' : site.wire,
      }}
      transition={{ duration: 0.8, delay: painted ? delay : 0, ease }}
    >
      <AnimatePresence>
        {painted && children && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.25 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Ring({ value, label, delay }: { value: number; label: string; delay: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const c = animate(0, value, { duration: 1.4, delay, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [value, delay]);
  const r = 30, c = 2 * Math.PI * r;
  return (
    <div className="grid justify-items-center gap-2">
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} fill="rgba(61,220,132,0.08)" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <motion.circle
          cx="38" cy="38" r={r} fill="none" stroke="#3DDC84" strokeWidth="5" strokeLinecap="round"
          transform="rotate(-90 38 38)" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.4, delay, ease }}
        />
        <text x="38" y="44" textAnchor="middle" fontSize="20" fontWeight="600" fill="#3DDC84" fontFamily="var(--font-mono)">{n}</text>
      </svg>
      <span className="text-[12px] text-white/60">{label}</span>
    </div>
  );
}

function CodePanel() {
  const code: [string, string][][] = [
    [['#C792EA', 'export default '], ['#82AAFF', 'function '], ['#FFCB6B', 'Home'], ['#E6EDF3', '() {']],
    [['#E6EDF3', '  '], ['#C792EA', 'return '], ['#E6EDF3', '(']],
    [['#E6EDF3', '    <'], ['#F07178', 'Hero']],
    [['#E6EDF3', '      '], ['#FFCB6B', 'title'], ['#E6EDF3', '='], ['#C3E88D', '"Fresh juice, squeezed daily"']],
    [['#E6EDF3', '      '], ['#FFCB6B', 'cta'], ['#E6EDF3', '='], ['#C3E88D', '"Order now"']],
    [['#E6EDF3', '    />']],
    [['#E6EDF3', '    <'], ['#F07178', 'Menu '], ['#FFCB6B', 'items'], ['#E6EDF3', '={juices} />']],
    [['#E6EDF3', '  );']],
    [['#E6EDF3', '}']],
  ];
  return (
    <motion.div
      className={`absolute left-6 top-[196px] w-[430px] overflow-hidden font-mono text-[13px] leading-[22px] ${overlayCard}`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-[11px] text-white/50">
        <span className="h-2 w-2 rounded-full bg-light-cyan" /> app/page.tsx
      </div>
      <div className="px-4 py-3">
        {code.map((line, i) => (
          <motion.div
            key={i}
            className="whitespace-pre"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.35, delay: 0.3 + i * 0.14, ease: 'linear' }}
          >
            <span className="mr-4 inline-block w-4 text-right text-white/25">{i + 1}</span>
            {line.map(([c, t], k) => (
              <span key={k} style={{ color: c }}>{t}</span>
            ))}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="flex items-center gap-2 border-t border-white/10 px-4 py-2 text-[11px] text-[#7EE2A8]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
      >
        ✓ Compiled · deployed to yourbrand.co.za
      </motion.div>
    </motion.div>
  );
}

function SearchPanel() {
  const [ranked, setRanked] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setRanked(true), 900);
    return () => clearTimeout(id);
  }, []);
  const ours = (
    <motion.li layout key="ours" transition={{ duration: 0.8, ease }} className="rounded-lg bg-white/[0.06] p-3 ring-1 ring-light-cyan/30">
      <div className="text-[11px] text-white/60">yourbrand.co.za › menu</div>
      <div className="text-[16px] font-medium text-[#8AB4F8]">Fresh juice, squeezed daily | Your Brand</div>
      <div className="mt-0.5 text-[11px] text-[#FDD663]">★★★★★ <span className="text-white/50">4.9 · 212 reviews · Open now</span></div>
    </motion.li>
  );
  const other = (k: string, w: string) => (
    <motion.li layout key={k} transition={{ duration: 0.8, ease }} className="grid gap-1.5 p-3">
      <div className="h-2 w-28 rounded bg-white/10" />
      <div className={`h-3 rounded bg-[#8AB4F8]/30 ${w}`} />
      <div className="h-2 w-4/5 rounded bg-white/[0.07]" />
    </motion.li>
  );
  return (
    <motion.div
      className={`absolute left-1/2 top-[70px] w-[470px] -translate-x-1/2 p-5 ${overlayCard}`}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="mb-4 flex items-center gap-3 rounded-full bg-white/[0.07] px-4 py-2.5 ring-1 ring-white/10">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AA0A6" strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="text-[14px] text-white/85">fresh juice near me</span>
      </div>
      <div className="mb-2 flex items-center justify-between text-[11px] text-white/45">
        <span>About 1,240 results</span>
        <motion.span
          key={ranked ? 'one' : 'nine'}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-full bg-[#3DDC84]/15 px-2 py-0.5 font-semibold text-[#3DDC84]"
        >
          {ranked ? 'Position #1' : 'Position #9'}
        </motion.span>
      </div>
      <LayoutGroup>
        <ul className="grid gap-1">
          {ranked ? [ours, other('a', 'w-3/5'), other('b', 'w-1/2')] : [other('a', 'w-3/5'), other('b', 'w-1/2'), ours]}
        </ul>
      </LayoutGroup>
    </motion.div>
  );
}

function StatusBar() {
  const items = ['Uptime 99.98%', 'Backup 2h ago', 'Security patches applied', 'SSL valid'];
  return (
    <motion.div
      className={`absolute inset-x-6 bottom-5 flex items-center gap-5 !rounded-full px-5 py-3 text-[12px] ${overlayCard}`}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <span className="flex items-center gap-2 font-semibold">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#3DDC84] opacity-70" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-[#3DDC84]" />
        </span>
        All systems normal
      </span>
      <svg width="90" height="22" viewBox="0 0 90 22" aria-hidden="true">
        <motion.path
          d="M0 11 H28 L33 3 L39 19 L44 7 L48 11 H90"
          fill="none" stroke="#6CCCE0" strokeWidth="1.6" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      {items.map((t, i) => (
        <motion.span key={t} className="text-white/65" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.15 }}>
          {t}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ---------- one browser window, frozen at a stage of the build ---------- */

function Browser({ stage, active }: { stage: number; active: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [designDone, setDesignDone] = useState(false);
  const [cartRaw, setCart] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 800));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The design window shows the work happening: blueprint first, then paint.
  useEffect(() => {
    if (stage !== 0 || !active) return;
    const id = setTimeout(() => setDesignDone(true), 1200);
    return () => {
      clearTimeout(id);
      setDesignDone(false);
    };
  }, [stage, active]);

  // The shop window fills its cart one juice at a time.
  useEffect(() => {
    if (stage !== 4 || !active) return;
    const ids = [600, 1100, 1600].map((ms, i) => setTimeout(() => setCart(i + 1), ms));
    return () => {
      ids.forEach(clearTimeout);
      setCart(0);
    };
  }, [stage, active]);

  const painted = stage > 0 || designDone;
  const shop = stage >= 4;
  const cart = stage === 4 && active ? cartRaw : stage > 4 ? 3 : 0;
  const play = active ? 'on' : 'off';
  const products = [
    { name: 'Sunrise', price: 'R65', g: 'linear-gradient(135deg,#F2D28B,#D98A4E)' },
    { name: 'Green Wave', price: 'R72', g: 'linear-gradient(135deg,#B5D19A,#4E8A5E)' },
    { name: 'Berry Swell', price: 'R68', g: 'linear-gradient(135deg,#E3A1B4,#8E3B5E)' },
  ];

  return (
    <div
      ref={box}
      className="relative w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#0B2235] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.75)]"
      style={{ aspectRatio: '800 / 520' }}
    >
      <div className="absolute left-0 top-0 h-[520px] w-[800px] origin-top-left" style={{ transform: `scale(${scale})` }}>
        {/* Chrome */}
        <div className="absolute inset-x-0 top-0 flex h-10 items-center gap-2 border-b border-white/10 bg-[#0E2A40] px-4">
          <span className="h-3 w-3 rounded-full bg-white/20" />
          <span className="h-3 w-3 rounded-full bg-white/20" />
          <span className="h-3 w-3 rounded-full bg-white/20" />
          <span className="ml-6 flex h-6 flex-1 items-center gap-2 rounded-md bg-white/[0.06] px-3 font-mono text-[12px] text-white/60">
            <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><rect x="1" y="5" width="8" height="6" rx="1.5" fill="currentColor" /><path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" fill="none" strokeWidth="1.4" /></svg>
            yourbrand.co.za
          </span>
        </div>

        {/* The client site: blueprint until it's painted */}
        <motion.div
          className="absolute inset-x-0 bottom-0 top-10"
          initial={false}
          animate={{ backgroundColor: painted ? site.bg : '#0B2A45' }}
          transition={{ duration: 0.9 }}
          style={{
            backgroundImage: painted
              ? 'none'
              : 'linear-gradient(rgba(108,204,224,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(108,204,224,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <Block x={32} y={18} w={150} h={28} painted={painted} fill="transparent" radius={6}>
            <span className="flex h-full items-center gap-2 whitespace-nowrap font-display text-[17px] font-bold" style={{ color: site.ink }}>
              <span className="h-5 w-5 rounded-full" style={{ background: site.img }} /> Your Brand
            </span>
          </Block>
          {[0, 1, 2].map((i) => (
            <Block key={i} x={430 + i * 78} y={26} w={56} h={12} painted={painted} fill={site.pill} radius={6} delay={0.05 * i} />
          ))}
          <Block x={672} y={16} w={96} h={32} painted={painted} fill={site.ink} radius={16} delay={0.15}>
            <span className="flex h-full items-center justify-center gap-1.5 text-[12px] font-semibold text-white">
              {shop ? 'Cart' : 'Visit us'}
              {shop && (
                <motion.span
                  key={cart}
                  initial={{ scale: 1.6 }}
                  animate={{ scale: 1 }}
                  className="grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px]"
                  style={{ background: site.accent }}
                >
                  {cart}
                </motion.span>
              )}
            </span>
          </Block>

          <Block x={32} y={86} w={360} h={96} painted={painted} fill="transparent" radius={8} delay={0.1}>
            <p className="font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em]" style={{ color: site.ink }}>
              Fresh juice, squeezed daily.
            </p>
          </Block>
          <Block x={32} y={196} w={300} h={40} painted={painted} fill="transparent" radius={6} delay={0.2}>
            <p className="text-[14px] leading-snug" style={{ color: site.soft }}>
              Cold-pressed fruit and veg from local farms, ready before your morning surf.
            </p>
          </Block>
          <Block x={32} y={252} w={130} h={40} painted={painted} fill={site.accent} radius={20} delay={0.3}>
            <span className="flex h-full items-center justify-center text-[13px] font-semibold text-white">Order now</span>
          </Block>
          <Block x={430} y={78} w={338} h={214} painted={painted} fill={site.img} radius={18} delay={0.2}>
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-white/20" />
            <div className="absolute bottom-5 left-5 h-24 w-16 rounded-b-[20px] rounded-t-md bg-white/85" />
            <div className="absolute bottom-5 left-24 h-20 w-14 rounded-b-[18px] rounded-t-md bg-white/60" />
          </Block>

          {products.map((p, i) => (
            <Block key={p.name} x={32 + i * 250} y={318} w={236} h={142} painted={painted} fill="#FFFFFF" radius={14} delay={0.35 + i * 0.08}>
              <div className="flex h-full gap-3 p-3 ring-1 ring-black/5" style={{ borderRadius: 14 }}>
                <div className="h-full w-[88px] rounded-[10px]" style={{ background: shop ? p.g : '#ECE8DF' }} />
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div>
                    <p className="font-display text-[16px] font-bold" style={{ color: site.ink }}>{shop ? p.name : 'Our story'}</p>
                    <p className="mt-1 text-[11px] leading-snug" style={{ color: site.soft }}>
                      {shop ? 'Cold-pressed, 500ml' : 'Local farms, every morning'}
                    </p>
                  </div>
                  {shop ? (
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[14px] font-semibold" style={{ color: site.ink }}>{p.price}</span>
                      <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-white" style={{ background: site.accent }}>Add</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-semibold" style={{ color: site.accent }}>Read more →</span>
                  )}
                </div>
              </div>
            </Block>
          ))}
        </motion.div>

        {/* Each window's signature overlay. Keyed by `play` so it replays
            whenever the window slides into the centre. */}
        {stage === 0 && (
          <motion.div
            key={`design-${play}`}
            className={`absolute bottom-6 right-6 flex items-center gap-3 p-3 ${overlayCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.08] font-display text-[22px] font-bold">Aa</span>
            {['#F4F2EC', '#E8D9B5', '#8DB48E', '#2F6B4F', '#1A2420'].map((c, i) => (
              <motion.span
                key={c}
                className="h-10 w-10 rounded-full ring-1 ring-white/20"
                style={{ background: c }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 300, damping: 18 }}
              />
            ))}
          </motion.div>
        )}
        {stage === 0 && active && (
          <motion.svg
            key="cursor"
            width="22" height="22" viewBox="0 0 24 24"
            className="absolute drop-shadow-md"
            initial={{ left: 560, top: 420, opacity: 1 }}
            animate={{ left: [560, 200, 520, 120], top: [420, 160, 200, 300], opacity: [1, 1, 1, 0] }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          >
            <path d="M4 2l16 9-7 2-3 7z" fill="#6CCCE0" stroke="#0B2235" strokeWidth="1.5" />
          </motion.svg>
        )}
        {stage === 1 && <CodePanel key={`code-${play}`} />}
        {stage === 2 && (
          <motion.div
            key={`perf-${play}`}
            className={`absolute left-1/2 top-[120px] grid -translate-x-1/2 gap-4 px-8 py-6 ${overlayCard}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex gap-7">
              <Ring value={100} label="Performance" delay={0.2} />
              <Ring value={98} label="Accessibility" delay={0.35} />
              <Ring value={100} label="Best practices" delay={0.5} />
              <Ring value={100} label="SEO" delay={0.65} />
            </div>
            <p className="text-center font-mono text-[12px] text-white/55">Largest paint 0.9s · Layout shift 0</p>
          </motion.div>
        )}
        {stage === 3 && <SearchPanel key={`seo-${play}`} />}
        {stage === 4 && (
          <motion.div
            key={`paid-${play}`}
            className={`absolute right-6 top-[58px] flex items-center gap-3 px-4 py-3 ${overlayCard}`}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: active ? 1.8 : 0, ease }}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#3DDC84]/15 text-[#3DDC84]">✓</span>
            <span>
              <span className="block text-[13px] font-semibold">Order #1042 paid</span>
              <span className="text-[11px] text-white/55">3 juices · R205 · card</span>
            </span>
          </motion.div>
        )}
        {stage === 5 && <StatusBar key={`status-${play}`} />}
      </div>
    </div>
  );
}

/* ---------- section ---------- */

const desktopQuery = '(min-width: 1024px)';
function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia(desktopQuery);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function Caption({ i, active }: { i: number; active: boolean }) {
  const s = stages[i];
  return (
    <div className="grid content-center gap-4">
      <p className="font-mono text-sm text-light-cyan">
        {String(i + 1).padStart(2, '0')} <span className="text-white/30">/ {String(N).padStart(2, '0')}</span>
      </p>
      <StretchText
        as="h3"
        lines={[s.title]}
        sweep={active}
        className="font-display text-[clamp(2.2rem,3.6vw,3.6rem)] font-bold leading-[0.95] tracking-[-0.035em] text-white"
      />
      <p className="max-w-[34ch] text-base leading-relaxed text-white/65 lg:text-lg">{s.body}</p>
    </div>
  );
}

function Intro() {
  return (
    <div className="grid content-center gap-6">
      <p className="eyebrow text-light-cyan">02 · What we do</p>
      <StretchText as="h2" lines={['One site,', 'six *services*']} accentClassName="text-light-cyan" className="display-2 text-white" />
      <p className="max-w-[36ch] text-lg leading-relaxed text-white/65">
        Watch a website come together, from first sketch to a shop that takes orders and a site that looks after itself.
      </p>
    </div>
  );
}

// The drafting table. On desktop, scrolling down slides a row of browser
// windows sideways, each frozen at one stage of building a site; the one in
// the centre plays its step. Phones get a native swipe row instead of a pin.
export default function Services() {
  const desktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(desktopQuery).matches, () => true);
  return (
    <section id="services" aria-label="What we do" className="sheet bg-[#081F33] text-white">
      {/* Blueprint grid, fading toward the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(108,204,224,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(108,204,224,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
      />
      {desktop ? <DesktopTrack /> : <MobileTrack />}
    </section>
  );
}

function DesktopTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [active, setActive] = useState(-1);
  const reduce = !useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (p) => -p * dist);

  useLayoutEffect(() => {
    const t = track.current;
    if (!t) return;
    const measure = () => setDist(Math.max(0, t.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    return () => ro.disconnect();
  }, []);

  // The panel nearest the centre of the screen is the one that plays.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const t = track.current;
    if (!t) return;
    const centre = p * dist + window.innerWidth / 2;
    const panels = Array.from(t.querySelectorAll<HTMLElement>('[data-panel]'));
    let best = -1, bestD = Infinity;
    panels.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centre);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActive(bestD < window.innerWidth * 0.45 ? best : -1);
  });

  const skip = () => {
    const next = document.getElementById('work');
    if (!next) return;
    if (scrollState.lenis) scrollState.lenis.scrollTo(next, { offset: -88 });
    else next.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    // The row travels ~2.4x faster than the page scrolls, so the whole build
    // takes under three screens of scrolling.
    <div ref={ref} style={{ height: `calc(100svh + ${Math.round(dist / 2.4)}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex h-full w-max items-center gap-[5vw] pl-[8vw] pr-[10vw] will-change-transform">
          <div className="w-[34vw] shrink-0">
            <Intro />
          </div>
          {stages.map((s, i) => (
            <div
              key={s.title}
              data-panel
              className="grid w-[60vw] shrink-0 grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] items-center gap-[3vw] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: active === i ? 1 : 0.35, transform: `scale(${active === i ? 1 : 0.94})` }}
            >
              <Browser stage={i} active={active === i} />
              <Caption i={i} active={active === i} />
            </div>
          ))}
        </motion.div>

        {/* Progress rail */}
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] items-center gap-8 px-10 pb-8 pr-56">
          <button type="button" onClick={skip} className="wave-link shrink-0 text-sm text-white/60 hover:text-white">
            Skip to our work ↓
          </button>
          <ol className="grid flex-1 grid-cols-6 gap-3">
            {stages.map((s, i) => (
              <li key={s.title} className="grid gap-2">
                <span className="relative h-px bg-white/15">
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-light-cyan"
                    initial={false}
                    animate={{ width: active >= i ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease }}
                  />
                </span>
                <span className={`text-xs transition-colors ${active === i ? 'text-white' : 'text-white/40'}`}>{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function MobileTrack() {
  const row = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = row.current;
    if (!el) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>('[data-panel]'));
    const centre = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bestD = Infinity;
    panels.forEach((p, i) => {
      const d = Math.abs(p.offsetLeft + p.offsetWidth / 2 - centre);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActive(best);
  };

  return (
    <div className="relative py-20">
      <div className="px-5">
        <Intro />
        <p className="eyebrow mt-6 text-white/45">Swipe to see each step →</p>
      </div>
      <div
        ref={row}
        onScroll={onScroll}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {stages.map((s, i) => (
          <div key={s.title} data-panel className="grid w-[86vw] max-w-[520px] shrink-0 snap-center gap-6">
            <Browser stage={i} active={active === i} />
            <Caption i={i} active={active === i} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
        {stages.map((s, i) => (
          <span key={s.title} className={`h-1.5 rounded-full transition-all ${active === i ? 'w-6 bg-light-cyan' : 'w-1.5 bg-white/25'}`} />
        ))}
      </div>
    </div>
  );
}
