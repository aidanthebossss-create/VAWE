'use client';

import {
  Check,
  Clock,
  Wrench,
  MagnifyingGlass,
  PencilLine,
  Palette,
  CloudArrowUp,
  Timer,
  SealCheck,
  Coins,
  Receipt,
} from '@phosphor-icons/react';
import SectionHeading from './fx/SectionHeading';
import { PACKAGE_EVENT } from './Contact';

const packages = [
  {
    name: 'Spark',
    price: '2,500',
    audience: 'Freelancers & personal brands',
    delivery: '2 weeks',
    iconSrc: '/icons/sm/spark.webp',
    features: ['Up to 4 pages', 'Mobile-responsive design', 'Contact form', 'Social media links', 'Basic on-page SEO', '2 revision rounds'],
  },
  {
    name: 'Presence',
    price: '5,500',
    audience: 'Small local businesses',
    delivery: '3–4 weeks',
    iconSrc: '/icons/sm/presence.webp',
    features: [
      'Up to 8 pages',
      'Custom branded design',
      'CMS: edit your own content',
      'Blog / news section',
      'Google Analytics setup',
      'SEO-optimised structure',
      '3 revision rounds',
    ],
  },
  {
    name: 'Growth',
    price: '9,500',
    audience: 'Startups & tech companies',
    delivery: '4–6 weeks',
    iconSrc: '/icons/sm/growth.webp',
    popular: true,
    features: [
      'Up to 15 pages',
      'Custom design + brand identity',
      'Advanced SEO + performance',
      'CMS, blog & landing pages',
      '3rd-party integrations (CRM etc.)',
      'Speed & Core Web Vitals tuning',
      'Priority support',
      '4 revision rounds',
    ],
  },
  {
    name: 'Commerce',
    price: '16,500',
    audience: 'E-commerce stores',
    delivery: '5–8 weeks',
    iconSrc: '/icons/sm/commerce.webp',
    features: [
      'Full online store setup',
      'Up to 50 products',
      'Payment gateway integration',
      'Custom checkout experience',
      'Inventory & order management',
      'Email marketing integration',
      'Product SEO & schema markup',
      '4 revision rounds',
    ],
  },
];

const addOns = [
  { name: 'Monthly maintenance', price: 'R450 – R750 / month', description: 'Updates, backups, security patches & uptime monitoring.', icon: Wrench },
  { name: 'SEO retainer', price: 'R1,200 – R1,800 / month', description: 'Ongoing keyword strategy, content & ranking reports.', icon: MagnifyingGlass },
  { name: 'Copywriting', price: 'R200 – R350 / page', description: 'Professional, conversion-focused copy for any page.', icon: PencilLine },
  { name: 'Logo & brand kit', price: 'R4,500 – R8,000 once-off', description: 'Logo, colour palette, typography & brand guidelines.', icon: Palette },
  { name: 'Hosting setup', price: 'R550 – R800 once-off', description: 'Domain registration, cloud hosting & SSL configuration.', icon: CloudArrowUp },
  { name: 'Rush delivery', price: '+20% on package price', description: 'Fast-tracked timeline for urgent launch deadlines.', icon: Timer },
];

const assurances = [
  { icon: SealCheck, title: 'Fixed quote first', body: 'You know the full price before any work starts.' },
  { icon: Coins, title: '50% deposit to begin', body: 'Required before work starts.' },
  { icon: Receipt, title: 'Prices in rand, excl. VAT', body: 'Starting rates; your quote depends on scope.' },
];

type Pkg = (typeof packages)[number];

function PricingCard({ pkg }: { pkg: Pkg }) {
  const popular = 'popular' in pkg && pkg.popular;
  return (
    <article
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:p-8 ${
        popular
          ? 'glow-border bg-[linear-gradient(170deg,#12476B_0%,#0B2E4A_55%,#0A2740_100%)] shadow-[0_40px_100px_-40px_rgba(108,204,224,0.45)] lg:-translate-y-4'
          : 'border border-white/10 bg-white/[0.035] hover:-translate-y-1 hover:border-white/20'
      }`}
    >
      {/* Light that follows the cursor across the glass */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(320px circle at var(--mx,50%) var(--my,0%), rgba(108,204,224,0.13), transparent 65%)' }}
      />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={pkg.iconSrc} alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10 object-contain" />
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">{pkg.name}</h3>
          </div>
          {popular ? (
            <span className="rounded-full bg-light-cyan px-3 py-1 text-[11px] font-semibold text-abyss">Most popular</span>
          ) : null}
        </div>
        <p className="mt-3 text-sm text-white/55">Best for {pkg.audience.toLowerCase()}</p>

        <div className="mt-8">
          <p className="eyebrow text-white/40">From</p>
          <p className="mt-1 flex items-start gap-1 font-display font-bold tracking-[-0.04em] text-white [font-variation-settings:'wdth'_80]">
            <span className="mt-2 text-2xl text-light-cyan">R</span>
            <span className="text-6xl leading-none tabular-nums">{pkg.price}</span>
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/70">
            <Clock size={14} weight="bold" className="text-light-cyan" /> Live in {pkg.delivery}
          </p>
        </div>

        <a
          href="#contact"
          onClick={() => window.dispatchEvent(new CustomEvent(PACKAGE_EVENT, { detail: pkg.name }))}
          className={`liquid-btn mt-8 w-full !py-3.5 text-sm ${popular ? 'liquid-btn--cyan' : 'liquid-btn--glass'}`}
        >
          <span className="liquid-btn__label">Get a quote for {pkg.name}</span>
        </a>

        <ul className="mt-8 grid content-start gap-0 border-t border-white/10">
          {pkg.features.map((f) => (
            <li key={f} className="flex items-start gap-3 border-b border-white/[0.06] py-2.5 text-sm leading-snug text-white/75">
              <Check size={15} weight="bold" className="mt-0.5 shrink-0 text-light-cyan" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

// The price list: deep navy glass. Prices are always visible, a real
// advantage over agencies that hide behind "contact us".
export default function Pricing() {
  return (
    <section id="pricing" className="sheet bg-[#0A2740] py-24 text-white md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_60%_0%,rgba(108,204,224,0.14),transparent_70%),radial-gradient(40%_30%_at_0%_100%,rgba(42,157,143,0.1),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end">
          <SectionHeading tone="dark" eyebrow="06 · Pricing" lines={['Packages for every', '*stage* of growth']} />
          <p
            data-reveal="fade"
            style={{ '--d': '300ms' } as React.CSSProperties}
            className="max-w-[44ch] text-lg leading-relaxed text-white/65 md:justify-self-end"
          >
            Clear starting prices from personal brands to full online stores. Every package is designed and built by us, never from a template.
          </p>
        </div>

        {/* Phones swipe sideways through the packages; larger screens see them all */}
        <div className="-mx-5 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-5 pb-6 pt-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {packages.map((pkg, i) => (
            <div
              key={pkg.name}
              data-reveal="fade"
              style={{ '--d': `${i * 90}ms` } as React.CSSProperties}
              className="w-[82vw] max-w-[360px] shrink-0 snap-center md:w-auto md:max-w-none"
            >
              <PricingCard pkg={pkg} />
            </div>
          ))}
        </div>
        <p className="eyebrow mt-2 text-white/40 md:hidden">Swipe for more packages →</p>

        {/* Reassurance */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[22px] border border-white/10 bg-white/10 sm:grid-cols-3">
          {assurances.map((a) => {
            const Icon = a.icon;
            return (
              <li key={a.title} className="flex items-start gap-4 bg-[#0A2740] p-6">
                <Icon size={24} weight="duotone" className="shrink-0 text-light-cyan" />
                <span>
                  <span className="block font-semibold">{a.title}</span>
                  <span className="text-sm text-white/55">{a.body}</span>
                </span>
              </li>
            );
          })}
        </ul>

        {/* Add-ons, always visible */}
        <div className="mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-3xl font-bold tracking-tight">Optional add-ons</h3>
            <p className="text-sm text-white/50">Add any of these to a package, now or later.</p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-[22px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((a, i) => {
              const Icon = a.icon;
              return (
                <li
                  key={a.name}
                  data-reveal="fade"
                  style={{ '--d': `${i * 60}ms` } as React.CSSProperties}
                  className="flex items-start gap-4 bg-[#0A2740] p-6 transition-colors hover:bg-[#0D2F4C]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06]">
                    <Icon size={20} weight="duotone" className="text-light-cyan" />
                  </span>
                  <span>
                    <span className="block font-semibold">{a.name}</span>
                    <span className="mt-0.5 block font-mono text-xs text-light-cyan">{a.price}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-white/55">{a.description}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
