'use client';

import { ArrowUpRight } from '@phosphor-icons/react';
import SectionHeading from './fx/SectionHeading';
import { scrollState } from '@/lib/scroll-state';

/** Fired to show a project in the Work section's preview window. */
export const PROJECT_EVENT = 'vawes:project';

const testimonials = [
  {
    name: 'Demi Roach',
    role: 'Owner, U TIME Beauty by Demi',
    text: 'The site captures the calm, premium feel we wanted clients to experience before they even walk in. Bookings are up and the gallery does the heavy lifting.',
    projectId: 1,
    project: 'U TIME Beauty by Demi',
    image: '/mock-shots/1.webp',
  },
  {
    name: 'Raymond Taylor',
    role: 'CEO, CDC Diving',
    text: 'The ops dashboard turned a stack of spreadsheets into something the dive team actually opens every morning. Compliance and crew assignments finally live in one place.',
    projectId: 2,
    project: 'CDC Diving Ops Dashboard',
    image: '/mock-shots/2.webp',
  },
  {
    name: 'Lucas Pereira',
    role: 'Founder, Vexel AI',
    text: 'A landing page that respects developers. No hype, just signal. Trial signups doubled in the first two weeks after launch.',
    projectId: 3,
    project: 'Vexel AI',
    image: '/mock-shots/3.webp',
  },
];

type T = (typeof testimonials)[number];

const initials = (n: string) => n.split(' ').map((p) => p[0]).join('');

// Jump to the Work section with this project already in the window.
function showProject(id: number) {
  window.dispatchEvent(new CustomEvent(PROJECT_EVENT, { detail: id }));
  const target = document.getElementById('work-showcase') ?? document.getElementById('work');
  if (!target) return;
  if (scrollState.lenis) scrollState.lenis.scrollTo(target, { offset: -110 });
  else target.scrollIntoView({ behavior: 'smooth' });
}

function ProjectLink({ t, tone }: { t: T; tone: 'light' | 'dark' }) {
  return (
    <button
      type="button"
      onClick={() => showProject(t.projectId)}
      className={`wave-link inline-flex items-center gap-1.5 justify-self-start text-sm font-medium ${
        tone === 'dark' ? 'text-white/80 hover:text-white' : 'text-ink'
      }`}
    >
      See the project <ArrowUpRight size={14} weight="bold" />
    </button>
  );
}

function Person({ t, tone }: { t: T; tone: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <figcaption className="flex items-center gap-4">
      <span
        aria-hidden="true"
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-base font-bold ${
          dark ? 'bg-white/10 text-light-cyan ring-1 ring-white/15' : 'bg-deep-navy text-light-cyan'
        }`}
      >
        {initials(t.name)}
      </span>
      <span>
        <span className={`block font-semibold ${dark ? 'text-white' : 'text-ink'}`}>{t.name}</span>
        <span className={`text-sm ${dark ? 'text-white/55' : 'text-ink-soft'}`}>{t.role}</span>
      </span>
    </figcaption>
  );
}

// Proof, not decoration: one featured quote from the live client site in a
// deep-water card, two supporting quotes, and every quote linked to the work.
export default function Testimonials() {
  const [featured, ...rest] = testimonials;
  return (
    <section aria-label="Client testimonials" className="sheet bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="07 · Client words" lines={['Riding the', 'same *wave*']} />
          <p
            data-reveal="fade"
            style={{ '--d': '300ms' } as React.CSSProperties}
            className="max-w-[36ch] text-lg leading-relaxed text-ink-soft"
          >
            What the people we&apos;ve built for say, next to the work itself.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:mt-20 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          {/* Featured quote */}
          <figure data-reveal="unmask" className="relative overflow-hidden rounded-[32px]">
            <div className="grain relative grid h-full content-between gap-10 overflow-hidden bg-[linear-gradient(160deg,#11426D_0%,#0B2A45_55%,#071E33_100%)] p-8 text-white md:p-12">
              <div className="relative grid gap-6">
                <span aria-hidden="true" className="font-display text-7xl font-extrabold leading-[0.5] text-light-cyan">
                  &ldquo;
                </span>
                <blockquote className="max-w-[26ch] font-display text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.12] tracking-[-0.02em] [font-variation-settings:'wdth'_88]">
                  {featured.text}
                </blockquote>
              </div>
              <div className="relative flex flex-wrap items-end justify-between gap-6">
                <div className="grid gap-4">
                  <Person t={featured} tone="dark" />
                  <ProjectLink t={featured} tone="dark" />
                </div>
                <button
                  type="button"
                  onClick={() => showProject(featured.projectId)}
                  aria-label={`See ${featured.project}`}
                  className="group w-48 overflow-hidden rounded-xl ring-1 ring-white/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:w-56"
                >
                  <span className="flex h-5 items-center gap-1 bg-white/10 px-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  </span>
                  <img
                    src={featured.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </button>
              </div>
            </div>
          </figure>

          {/* Supporting quotes */}
          <div className="grid gap-5">
            {rest.map((t, i) => (
              <figure
                key={t.name}
                data-reveal="fade"
                style={{ '--d': `${150 + i * 120}ms` } as React.CSSProperties}
                className="group grid content-start gap-6 rounded-[28px] border border-line bg-white/70 p-6 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-35px_rgba(7,30,51,0.35)] md:p-7"
              >
                <button
                  type="button"
                  onClick={() => showProject(t.projectId)}
                  aria-label={`See ${t.project}`}
                  className="overflow-hidden rounded-xl ring-1 ring-ink/10"
                >
                  <img
                    src={t.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[16/6] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </button>
                <blockquote className="font-display text-[clamp(1.2rem,1.6vw,1.45rem)] font-semibold leading-[1.25] tracking-[-0.01em] text-ink [font-variation-settings:'wdth'_92]">
                  <span className="text-ocean-teal">&ldquo;</span>
                  {t.text}
                  <span className="text-ocean-teal">&rdquo;</span>
                </blockquote>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Person t={t} tone="light" />
                  <ProjectLink t={t} tone="light" />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
