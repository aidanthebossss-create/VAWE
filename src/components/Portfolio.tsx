'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from './fx/SectionHeading';
import WaveLines from './fx/WaveLines';
import { scrollState } from '@/lib/scroll-state';
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion';
import { PROJECT_EVENT } from './Testimonials';

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  url: string;
  image: string;
  tags: string[];
  gradient: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: 'U TIME Beauty by Demi',
    category: 'Beauty Salon',
    description:
      'A polished site for a Port Elizabeth nail studio. Service pages, gallery, and contact woven into a calm, premium aesthetic that mirrors the in salon experience.',
    url: 'https://utimebeauty.co.za/index.html',
    image: '/mock-shots/1.webp',
    tags: ['Service Pages', 'Gallery', 'Contact'],
    gradient: 'from-[#11426D] to-[#0a2a45]',
  },
  {
    id: 2,
    title: 'CDC Diving Ops Dashboard',
    category: 'Commercial Diving',
    description:
      'An internal operations dashboard concept for a commercial diving outfit. Live job tracking, crew assignments, equipment compliance, and at a glance metrics built for the people running the dive deck.',
    url: '/mock-cdc/index.html',
    image: '/mock-shots/2.webp',
    tags: ['Dashboard', 'Internal Tool', 'Data Viz'],
    gradient: 'from-[#0d1a3d] to-[#070d1c]',
  },
  {
    id: 3,
    title: 'Vexel AI',
    category: 'AI Platform',
    description:
      'A product site for a developer facing AI tool. A calm, technical landing page that explains a reasoning layer for production agents without the usual hype.',
    url: '/mock-vexel/index.html',
    image: '/mock-shots/3.webp',
    tags: ['SaaS', 'Developer Tools', 'Pricing'],
    gradient: 'from-[#1a1f3a] to-[#0a0e1f]',
  },
  {
    id: 4,
    title: 'Bloom',
    category: 'Consumer App',
    description:
      'A warm, friendly marketing site for a plant care app. Soft palette, illustrated touches, and clear feature stories aimed at hobbyist gardeners.',
    url: '/mock-bloom/index.html',
    image: '/mock-shots/4.webp',
    tags: ['Mobile App', 'Marketing', 'Lifestyle'],
    gradient: 'from-[#2d4a3a] to-[#0f2418]',
  },
  {
    id: 5,
    title: 'METRO/96',
    category: 'Audio Hardware',
    description:
      'A bold editorial style product page for a niche sound system. Heavy type, club poster energy, and a confident pitch aimed at music heads.',
    url: '/mock-metro96/index.html',
    image: '/mock-shots/5.webp',
    tags: ['Product', 'Editorial', 'Ecommerce'],
    gradient: 'from-[#1a1414] to-[#000000]',
  },
  {
    id: 6,
    title: 'NEXUS//OS',
    category: 'Developer Tools',
    description:
      'A dense, terminal flavoured marketing site for a security engineering shell. Built for the kind of audience that reads every line of the docs.',
    url: '/mock-nexus/index.html',
    image: '/mock-shots/6.webp',
    tags: ['Dev Tool', 'Security', 'Technical'],
    gradient: 'from-[#0a1418] to-[#000814]',
  },
  {
    id: 7,
    title: 'VESSEL Quarterly',
    category: 'Editorial',
    description:
      'A digital issue page for an independent quarterly publication. Magazine grade typography, large imagery, and a leisurely reading rhythm.',
    url: '/mock-vessel/index.html',
    image: '/mock-shots/7.webp',
    tags: ['Publication', 'Typography', 'Long form'],
    gradient: 'from-[#2a2418] to-[#14100a]',
  },
];

// The real site in a scaled iframe. Mounted fresh on every hover, so it
// always fades in only once it has actually loaded.
function LiveFrame({ url, title, transform }: { url: string; title: string; transform: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <iframe
      src={url}
      title={title}
      loading="lazy"
      scrolling="no"
      tabIndex={-1}
      aria-hidden="true"
      onLoad={() => setLoaded(true)}
      className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-300"
      style={{ width: '1280px', height: '800px', transform, opacity: loaded ? 1 : 0 }}
    />
  );
}

// Fills its parent edge-to-edge with a static screenshot (cheap <img>); on
// hover it fades in the real, scaled <iframe> over the top, then drops it
// again on mouse-leave. The iframe is cover-scaled in JS so any aspect
// ratio works without leaving whitespace.
function LivePreview({
  url,
  image,
  title,
  hovering = false,
}: {
  url: string;
  image: string;
  title: string;
  /** Set by the surrounding window, which owns the hover. */
  hovering?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const live = hovering;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const W = el.offsetWidth;
      const H = el.offsetHeight;
      const cover = Math.max(W / 1280, H / 800);
      setScale(cover);
      setOffset({
        x: (W - 1280 * cover) / 2,
        y: (H - 800 * cover) / 2,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full bg-white overflow-hidden"
    >
      <img
        src={image}
        alt={`${title} website preview`}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {live && <LiveFrame url={url} title={title} transform={`translate(${offset.x}px, ${offset.y}px) scale(${scale})`} />}

      {/* Pointer shim — stops the iframe from eating clicks meant for the
          enclosing <a>. */}
      <div className="absolute inset-0 z-10" aria-hidden />
    </div>
  );
}

// In-page big-screen viewer. Loads the project in a full, interactive
// <iframe> inside a modal so visitors can explore the work without ever
// leaving vawes.site. Closes on the X button, the backdrop, or Escape.
function ProjectViewer({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    scrollState.lenis?.stop();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      scrollState.lenis?.start();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — full preview`}
          data-lenis-prevent
          className="fixed inset-0 z-[60] bg-abyss/90 backdrop-blur-md flex items-center justify-center p-0 md:p-3"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full bg-white md:rounded-2xl overflow-hidden md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
          >
            {/* Header bar — project title + close button, floats over the
                top of the iframe so the project gets the full canvas. */}
            <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 bg-gradient-to-b from-deep-navy/90 via-deep-navy/40 to-transparent pointer-events-none">
              <div className="min-w-0 mr-3">
                <div className="text-[10px] md:text-xs font-semibold text-ocean-light tracking-[0.18em] uppercase truncate">
                  {project.category}
                </div>
                <div className="text-sm md:text-base font-bold text-white tracking-tight truncate">
                  {project.title}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="pointer-events-auto shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-full bg-white/20 hover:bg-white/35 active:bg-white/45 text-white flex items-center justify-center transition backdrop-blur-sm"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>

            {/* Fully-interactive iframe — visitors can scroll and click
                inside the project. Cross-origin sites can still block this
                via X-Frame-Options; in that case the iframe just renders
                blank, but for the projects in `projects` it loads fine. */}
            <iframe
              src={project.url}
              title={project.title}
              className="w-full h-full border-0 bg-white"
              loading="eager"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const isLive = (p: Project) => p.url.startsWith('http');
const address = (p: Project) =>
  isLive(p)
    ? new URL(p.url).host.replace(/^www\./, '')
    : `vawes.site/concepts/${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

// A light browser window around a project. On hover-capable screens the
// screenshot comes alive as the real site (see LivePreview).
function Frame({
  project,
  onOpen,
  media,
}: {
  project: Project;
  onOpen: () => void;
  /** Render the window's contents; receives whether a mouse is over it. */
  media?: (hovering: boolean) => React.ReactNode;
}) {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        // Only real hover devices load the live site; on phones a tap would
        // otherwise download a whole website over mobile data.
        if (window.matchMedia('(hover: hover)').matches) setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
      className="group relative overflow-hidden rounded-[22px] bg-white shadow-[0_50px_100px_-40px_rgba(7,30,51,0.45)] ring-1 ring-ink/10">
      <div className="flex h-9 items-center gap-2 border-b border-ink/[0.06] bg-[#F7FAFB] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="ml-4 flex h-6 min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-md bg-white px-3 font-mono text-[11px] text-ink-soft ring-1 ring-ink/[0.06]">
          <svg width="9" height="11" viewBox="0 0 10 12" aria-hidden="true" className="shrink-0"><rect x="1" y="5" width="8" height="6" rx="1.5" fill="currentColor" /><path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" fill="none" strokeWidth="1.4" /></svg>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={project.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="truncate"
            >
              {address(project)}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
        {media ? media(hovering) : (
          <img
            src={project.image}
            alt={`${project.title} website preview`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        )}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open ${project.title} full screen`}
          className="absolute inset-0 z-20 cursor-zoom-in"
        />
        <span className="pointer-events-none absolute bottom-4 right-4 z-30 rounded-full bg-abyss/80 px-3.5 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
          Click to explore full screen
        </span>
      </div>
    </div>
  );
}

// The window's contents: the active project wipes up over the last one.
function WindowMedia({ project, hovering }: { project: Project; hovering: boolean }) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={project.id}
        className="absolute inset-0"
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={{ opacity: 0, transition: { delay: 0.8, duration: 0.01 } }}
        transition={{ duration: 0.8, ease: EASE_IN_OUT }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          <LivePreview url={project.url} image={project.image} title={project.title} hovering={hovering} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectMeta({ p, i }: { p: Project; i: number }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-sm text-ocean-teal">{String(i + 1).padStart(2, '0')}</span>
      <span className="eyebrow text-ink-soft">{p.category}</span>
      <span
        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
          isLive(p) ? 'bg-emerald-green text-white' : 'border border-ink/15 text-ink-soft'
        }`}
      >
        {isLive(p) ? 'Live client site' : 'Concept build'}
      </span>
    </div>
  );
}

function ProjectActions({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <button type="button" onClick={onOpen} className="liquid-btn liquid-btn--navy !px-5 !py-3 text-sm">
        <span className="liquid-btn__label">Explore it here</span>
      </button>
      {isLive(p) && (
        <a href={p.url} target="_blank" rel="noopener noreferrer" className="wave-link text-sm font-medium text-ink">
          Visit the live site ↗
        </a>
      )}
    </div>
  );
}

// The exhibition. On large screens a browser window sits beside a compact
// index of every project: point at or tap a name and its site wipes into the
// window, with the details underneath. Everything fits on about one screen,
// so nobody has to scroll through the whole portfolio. Phones swipe sideways.
function Showcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [viewerId, setViewerId] = useState<number | null>(null);
  const [mobileActive, setMobileActive] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const viewerProject = viewerId != null ? projects.find((p) => p.id === viewerId) ?? null : null;
  const current = projects[active];

  // Testimonials can ask to show their project here.
  useEffect(() => {
    const onProject = (e: Event) => {
      const i = projects.findIndex((p) => p.id === (e as CustomEvent<number>).detail);
      if (i < 0) return;
      setActive(i);
      const card = row.current?.children[i] as HTMLElement | undefined;
      if (card && row.current) row.current.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' });
    };
    window.addEventListener(PROJECT_EVENT, onProject);
    return () => window.removeEventListener(PROJECT_EVENT, onProject);
  }, [projects]);

  // A short delay so sweeping the mouse down the list doesn't flicker
  // through every project on the way.
  const preview = (i: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(i), 140);
  };

  const onRowScroll = () => {
    const el = row.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const centre = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bestD = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centre);
      if (d < bestD) { bestD = d; best = i; }
    });
    setMobileActive(best);
  };

  return (
    <>
      {/* Large screens: window + index */}
      <div className="hidden gap-14 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-5">
          <Frame project={current} onOpen={() => setViewerId(current.id)} media={(h) => <WindowMedia project={current} hovering={h} />} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="grid gap-4"
            >
              <p className="max-w-[60ch] text-lg leading-relaxed text-ink-soft">{current.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <ul className="flex flex-wrap gap-2">
                  {current.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft">
                      {t}
                    </li>
                  ))}
                </ul>
                <ProjectActions p={current} onOpen={() => setViewerId(current.id)} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <ol className="self-start border-b border-line" onMouseLeave={() => window.clearTimeout(hoverTimer.current)}>
          {projects.map((p, i) => {
            const on = i === active;
            return (
              <li key={p.id} className="border-t border-line">
                <button
                  type="button"
                  onMouseEnter={() => preview(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 py-4 text-left"
                >
                  <span className={`font-mono text-sm transition-colors ${on ? 'text-ocean-teal' : 'text-ink/35'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block truncate font-display text-[clamp(1.4rem,2vw,2rem)] font-bold leading-tight tracking-[-0.02em] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        on ? 'translate-x-1 text-ink' : 'text-ink/40 group-hover:text-ink/70'
                      }`}
                    >
                      {p.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-soft">
                      {p.category} · {isLive(p) ? 'Live client site' : 'Concept build'}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`grid h-9 w-9 place-items-center rounded-full border transition-all duration-500 ${
                      on ? 'border-deep-navy bg-deep-navy text-white' : 'border-line text-ink/40 group-hover:border-ink/30'
                    }`}
                  >
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Phones and tablets: swipe through project cards */}
      <div className="lg:hidden">
        <div
          ref={row}
          onScroll={onRowScroll}
          className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p, i) => (
            <article key={p.id} className="grid w-[84vw] max-w-[560px] shrink-0 snap-center content-start gap-4">
              <Frame project={p} onOpen={() => setViewerId(p.id)} />
              <ProjectMeta p={p} i={i} />
              <h3 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-ink">{p.title}</h3>
              <p className="leading-relaxed text-ink-soft">{p.description}</p>
              <ProjectActions p={p} onOpen={() => setViewerId(p.id)} />
            </article>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-sm text-ink-soft">
            <span className="text-ocean-teal">{String(mobileActive + 1).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')}
          </span>
          <span className="eyebrow text-ink-soft/70">Swipe for more →</span>
        </div>
      </div>

      <ProjectViewer project={viewerProject} onClose={() => setViewerId(null)} />
    </>
  );
}

export default function Portfolio() {
  return (
    // The gallery wall: a bright, quiet room so the work is the only colour.
    <section id="work" className="sheet bg-paper py-24 text-ink md:py-36">
      <WaveLines
        onView
        colors={['#CFE1E8', '#9FCBDA', '#6CCCE0']}
        className="pointer-events-none absolute -right-[10%] top-10 h-40 w-[70%]"
      />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end">
          <SectionHeading eyebrow="03 · Selected work" lines={['Projects that', 'made a *splash*']} />
          <p data-reveal="fade" style={{ '--d': '300ms' } as React.CSSProperties} className="max-w-[44ch] text-lg leading-relaxed text-ink-soft md:justify-self-end">
            A live client site alongside concept builds that show our range. Pick a project to preview it,
            hover the window to bring it to life, or open it full screen.
          </p>
        </div>

        <div id="work-showcase" className="scroll-mt-28">
          <Showcase projects={projects} />
        </div>
      </div>
    </section>
  );
}
