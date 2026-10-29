'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Shape of one entry in /demos/manifest.json. Only `slug` and `title` are
// truly required; everything else is optional and degrades gracefully.
type Demo = {
  slug: string;
  title: string;
  client?: string;
  status?: string;
  note?: string;
  tags?: string[];
  updated?: string;
  // Optional override. Defaults to `/demos/<slug>/` when omitted.
  url?: string;
};

// Status pill styling — palette colours only (see brand palette memory).
// Unknown statuses fall back to a neutral ocean-teal chip.
const STATUS: Record<string, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-light-cyan/15 text-light-cyan ring-light-cyan/30',
  },
  review: {
    label: 'In review',
    className: 'bg-sky-teal/20 text-sky-teal ring-sky-teal/40',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-green/20 text-emerald-green ring-emerald-green/40',
  },
};

function statusOf(status?: string) {
  if (!status) return null;
  return (
    STATUS[status.toLowerCase()] ?? {
      label: status,
      className: 'bg-ocean-teal/20 text-light-cyan ring-ocean-teal/40',
    }
  );
}

function demoUrl(d: Demo) {
  return d.url ?? `/demos/${d.slug}/`;
}

// Renders a demo at a fixed desktop viewport (1280×800) then cover-scales it
// to fill its parent, so any responsive demo produces a clean thumbnail with
// no letterboxing. Pointer-events are disabled — the whole card is the click
// target. The iframe is lazy and fades in once loaded.
function Thumb({ url, title }: { url: string; title: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const W = el.offsetWidth;
      const H = el.offsetHeight;
      const cover = Math.max(W / 1280, H / 800);
      setScale(cover);
      setOffset({ x: (W - 1280 * cover) / 2, y: (H - 800 * cover) / 2 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 bg-white overflow-hidden">
      <iframe
        src={url}
        title={`${title} preview`}
        loading="lazy"
        scrolling="no"
        tabIndex={-1}
        aria-hidden="true"
        onLoad={() => setLoaded(true)}
        className="absolute top-0 left-0 origin-top-left pointer-events-none border-0 transition-opacity duration-500"
        style={{
          width: '1280px',
          height: '800px',
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          opacity: loaded ? 1 : 0,
        }}
      />
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center bg-deep-navy/5">
          <div className="h-6 w-6 rounded-full border-2 border-ocean-teal/30 border-t-ocean-teal animate-spin" />
        </div>
      )}
    </div>
  );
}

// Full-screen, fully-interactive viewer for presenting a demo. Loads the demo
// in a real iframe so it can be scrolled and clicked. Closes on the X, the
// backdrop, or Escape.
function Viewer({ demo, onClose }: { demo: Demo | null; onClose: () => void }) {
  useEffect(() => {
    if (!demo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [demo, onClose]);

  return (
    <AnimatePresence>
      {demo && (
        <motion.div
          key={demo.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${demo.title} — full preview`}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-0 md:p-3"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full bg-white md:rounded-2xl overflow-hidden md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
          >
            <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between gap-3 px-4 md:px-6 py-3 bg-gradient-to-b from-deep-navy/90 via-deep-navy/40 to-transparent">
              <div className="min-w-0">
                {demo.client && (
                  <div className="text-[10px] md:text-xs font-semibold text-light-cyan tracking-[0.18em] uppercase truncate">
                    {demo.client}
                  </div>
                )}
                <div className="text-sm md:text-base font-bold text-white tracking-tight truncate">
                  {demo.title}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={demoUrl(demo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white text-xs font-semibold px-3 h-9 md:h-10 transition backdrop-blur-sm"
                >
                  New tab
                  <ExternalIcon />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close preview"
                  className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition backdrop-blur-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="6" y1="18" x2="18" y2="6" />
                  </svg>
                </button>
              </div>
            </div>
            <iframe
              src={demoUrl(demo)}
              title={demo.title}
              className="w-full h-full border-0 bg-white"
              loading="eager"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function DemoCard({ demo, onOpen }: { demo: Demo; onOpen: () => void }) {
  const [copied, setCopied] = useState(false);
  const status = statusOf(demo.status);

  const copyLink = useCallback(async () => {
    const abs =
      typeof window !== 'undefined'
        ? new URL(demoUrl(demo), window.location.origin).href
        : demoUrl(demo);
    try {
      await navigator.clipboard.writeText(abs);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (insecure context / denied). Fall back to a
      // prompt so the user can still grab the link manually.
      window.prompt('Copy this demo link:', abs);
    }
  }, [demo]);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-deep-navy/40 ring-1 ring-white/10 hover:ring-light-cyan/40 transition shadow-[0_20px_50px_-25px_rgba(0,0,0,0.6)]">
      {/* Preview — click to open the full viewer. */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${demo.title}`}
        className="relative block w-full aspect-[16/10] overflow-hidden cursor-zoom-in"
      >
        <Thumb url={demoUrl(demo)} title={demo.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 rounded-full bg-light-cyan text-deep-navy text-xs font-bold px-3 py-1.5 shadow-lg transition-all duration-300">
          Preview
        </span>
        {status && (
          <span className={`absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 backdrop-blur-sm ${status.className}`}>
            {status.label}
          </span>
        )}
      </button>

      {/* Meta */}
      <div className="flex flex-1 flex-col p-5">
        {demo.client && (
          <div className="text-[11px] font-semibold text-light-cyan tracking-[0.16em] uppercase mb-1">
            {demo.client}
          </div>
        )}
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
          {demo.title}
        </h3>
        {demo.note && (
          <p className="mt-2 text-sm text-slate-400 leading-relaxed line-clamp-3">
            {demo.note}
          </p>
        )}

        {demo.tags && demo.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {demo.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center gap-2">
          <a
            href={demoUrl(demo)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-ocean-teal hover:bg-sky-teal text-white text-sm font-semibold px-4 py-2 transition"
          >
            Open
            <ExternalIcon />
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/15 text-white/90 text-sm font-semibold px-4 py-2 transition"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy link
              </>
            )}
          </button>
          {demo.updated && (
            <span className="ml-auto text-[11px] text-white/35">
              {demo.updated}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DemoHub() {
  const [demos, setDemos] = useState<Demo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [viewer, setViewer] = useState<Demo | null>(null);

  useEffect(() => {
    let alive = true;
    // Cache-bust so freshly-uploaded manifests show up without a hard reload.
    fetch(`/demos/manifest.json?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        const list: Demo[] = Array.isArray(data) ? data : data.demos ?? [];
        setDemos(list.filter((d) => d && d.slug && d.title));
      })
      .catch((e) => {
        if (alive) setError(String(e));
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!demos) return [];
    const q = query.trim().toLowerCase();
    if (!q) return demos;
    return demos.filter((d) =>
      [d.title, d.client, d.note, d.status, ...(d.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [demos, query]);

  return (
    <main className="min-h-screen bg-deep-navy text-white">
      {/* Subtle dotted texture, matching the Portfolio section. */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-12 md:py-16">
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/vawes-wordmark.png"
                alt="VAWES"
                className="h-7 w-auto"
                draggable={false}
              />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/15 px-2.5 py-1 text-[11px] font-semibold text-light-cyan">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Private — unlisted
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight">
              Client <span className="text-light-cyan">demos</span>
            </h1>
            <p className="mt-3 max-w-[55ch] text-slate-400 leading-relaxed">
              Work-in-progress site previews. Open one to present it live, or
              copy its link to share directly with a client. This page isn’t
              linked or indexed anywhere.
            </p>
          </div>

          {/* Search — only worth showing once there are a few demos. */}
          {demos && demos.length > 3 && (
            <div className="relative w-full md:w-72">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search demos…"
                aria-label="Search demos"
                className="w-full rounded-full bg-white/5 ring-1 ring-white/15 focus:ring-light-cyan/60 focus:outline-none pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 transition"
              />
            </div>
          )}
        </header>

        {/* Body */}
        <div className="mt-10 md:mt-14">
          {error && (
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-8 text-center">
              <p className="font-semibold text-white">Couldn’t load the demo list.</p>
              <p className="mt-1 text-sm text-slate-400">
                Make sure <code className="text-light-cyan">/demos/manifest.json</code> exists. ({error})
              </p>
            </div>
          )}

          {!error && !demos && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[16/10] rounded-2xl bg-white/5 ring-1 ring-white/10 animate-pulse"
                />
              ))}
            </div>
          )}

          {!error && demos && filtered.length === 0 && (
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-10 text-center">
              <p className="font-semibold text-white">
                {demos.length === 0 ? 'No demos yet.' : 'No demos match your search.'}
              </p>
              {demos.length === 0 && (
                <p className="mt-2 text-sm text-slate-400">
                  Add a folder under <code className="text-light-cyan">public/demos/</code> and list it in{' '}
                  <code className="text-light-cyan">public/demos/manifest.json</code>.
                </p>
              )}
            </div>
          )}

          {!error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((demo) => (
                <DemoCard
                  key={demo.slug}
                  demo={demo}
                  onOpen={() => setViewer(demo)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Viewer demo={viewer} onClose={() => setViewer(null)} />
    </main>
  );
}
