'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  Lightning,
  Storefront,
  RocketLaunch,
  ShoppingBag,
  Star,
  Check,
  CaretDown,
  Wrench,
  MagnifyingGlass,
  PencilLine,
  Palette,
  CloudArrowUp,
  Timer,
} from '@phosphor-icons/react';

const packages = [
  {
    name: 'Spark',
    price: 'R2,500',
    audience: 'Freelancers & personal brands',
    icon: Lightning,
    color: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(251, 191, 36, 0.15)',
    borderColor: 'hover:border-amber-300/50',
    features: [
      'Up to 4 pages',
      'Mobile-responsive design',
      'Contact form',
      'Social media links',
      'Basic on-page SEO',
      '2 revision rounds',
      'Delivered in 2 weeks',
    ],
  },
  {
    name: 'Presence',
    price: 'R5,500',
    audience: 'Small local businesses',
    icon: Storefront,
    color: 'from-ocean-mid to-ocean-light',
    glowColor: 'rgba(14, 116, 144, 0.15)',
    borderColor: 'hover:border-ocean-light/50',
    features: [
      'Up to 8 pages',
      'Custom branded design',
      'CMS — client can edit content',
      'Blog / news section',
      'Google Analytics setup',
      'SEO-optimised structure',
      '3 revision rounds',
      'Delivered in 3–4 weeks',
    ],
  },
  {
    name: 'Growth',
    price: 'R9,500',
    audience: 'Startups & tech companies',
    icon: RocketLaunch,
    popular: true,
    color: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'hover:border-violet-300/50',
    features: [
      'Up to 15 pages',
      'Custom design + brand identity',
      'Advanced SEO + performance',
      'CMS, blog & landing pages',
      '3rd-party integrations (CRM etc.)',
      'Speed & Core Web Vitals tuning',
      'Priority support',
      '4 revision rounds',
      'Delivered in 4–6 weeks',
    ],
  },
  {
    name: 'Commerce',
    price: 'R16,500',
    audience: 'E-commerce stores',
    icon: ShoppingBag,
    color: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'hover:border-emerald-300/50',
    features: [
      'Full online store setup',
      'Up to 50 products',
      'Payment gateway integration',
      'Custom checkout experience',
      'Inventory & order management',
      'Email marketing integration',
      'Product SEO & schema markup',
      '4 revision rounds',
      'Delivered in 5–8 weeks',
    ],
  },
];

const addOns = [
  {
    name: 'Monthly maintenance',
    price: 'R450 – R750 / month',
    description: 'Updates, backups, security patches & uptime monitoring.',
    icon: Wrench,
  },
  {
    name: 'SEO retainer',
    price: 'R1,200 – R1,800 / month',
    description: 'Ongoing keyword strategy, content & ranking reports.',
    icon: MagnifyingGlass,
  },
  {
    name: 'Copywriting',
    price: 'R200 – R350 / page',
    description: 'Professional, conversion-focused copy for any page.',
    icon: PencilLine,
  },
  {
    name: 'Logo & brand kit',
    price: 'R4,500 – R8,000 once-off',
    description: 'Logo, colour palette, typography & brand guidelines.',
    icon: Palette,
  },
  {
    name: 'Hosting setup',
    price: 'R550 – R800 once-off',
    description: 'Domain registration, cloud hosting & SSL configuration.',
    icon: CloudArrowUp,
  },
  {
    name: 'Rush delivery',
    price: '+20% on package price',
    description: 'Fast-tracked timeline for urgent launch deadlines.',
    icon: Timer,
  },
];

function PricingCard({
  pkg,
  index,
}: {
  pkg: (typeof packages)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = pkg.icon;
  const isPopular = 'popular' in pkg && pkg.popular;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 8 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotateX: 0 }
          : {}
      }
      transition={{
        delay: index * 0.12,
        type: 'spring',
        stiffness: 80,
        damping: 20,
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative flex flex-col rounded-[2rem] border backdrop-blur-sm
                   transition-all duration-500 cursor-default overflow-hidden
                   ${
                     isPopular
                       ? 'bg-zinc-900 border-violet-500/40 shadow-[0_0_60px_-15px_rgba(139,92,246,0.3)]'
                       : 'bg-white border-slate-200/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]'
                   }
                   ${isPopular ? '' : pkg.borderColor}`}
      style={{ perspective: '1000px' }}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="flex justify-center -translate-y-px">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold px-5 py-1.5 rounded-b-xl flex items-center gap-1.5 shadow-lg">
              <Star size={14} weight="fill" />
              Most Popular
            </div>
          </div>
        </div>
      )}

      {/* Morphing glow blob behind card on hover */}
      <div
        className="absolute -inset-4 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none animate-morph-blob"
        style={{
          background: `radial-gradient(ellipse at center, ${pkg.glowColor}, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 flex flex-col flex-1 p-8 pt-10">
        {/* Icon + Name */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center
                         group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
          >
            <Icon size={22} weight="duotone" className="text-white" />
          </div>
          <h3
            className={`text-xl font-bold tracking-tight ${
              isPopular ? 'text-white' : 'text-zinc-900'
            }`}
          >
            {pkg.name}
          </h3>
        </div>

        {/* Price */}
        <div className="mb-1">
          <span className="text-sm text-slate-400 font-medium">From</span>
          <div
            className={`text-4xl font-extrabold tracking-tighter ${
              isPopular ? 'text-white' : 'text-zinc-900'
            }`}
          >
            {pkg.price}
          </div>
        </div>

        {/* Audience */}
        <p
          className={`text-sm mb-6 ${
            isPopular ? 'text-zinc-400' : 'text-slate-400'
          }`}
        >
          {pkg.audience}
        </p>

        {/* Divider */}
        <div
          className={`h-px mb-6 ${
            isPopular
              ? 'bg-gradient-to-r from-transparent via-violet-500/30 to-transparent'
              : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'
          }`}
        />

        {/* Features */}
        <ul className="flex-1 space-y-3 mb-8">
          {pkg.features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.12 + i * 0.04, duration: 0.3 }}
              className="flex items-start gap-2.5"
            >
              <div
                className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                             bg-gradient-to-br ${pkg.color}`}
              >
                <Check size={12} weight="bold" className="text-white" />
              </div>
              <span
                className={`text-sm leading-snug ${
                  isPopular ? 'text-zinc-300' : 'text-slate-600'
                }`}
              >
                {feature}
              </span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href="#contact"
          className={`w-full py-3.5 rounded-xl text-center text-sm font-semibold tracking-wide
                       transition-all duration-300 block
                       ${
                         isPopular
                           ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-[0_8px_30px_-5px_rgba(139,92,246,0.5)] hover:scale-[1.02]'
                           : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-lg hover:scale-[1.02]'
                       }`}
        >
          Get Started
        </a>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const addOnsRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });
  const isAddOnsInView = useInView(addOnsRef, { once: true, margin: '-60px' });
  const [addOnsOpen, setAddOnsOpen] = useState(false);

  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const blobY1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [-80, 120]);
  const blobY3 = useTransform(scrollYProgress, [0, 1], [60, -140]);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Parallax morphing background blobs */}
      <motion.div
        className="absolute top-20 -left-40 w-[500px] h-[500px] animate-morph-blob opacity-[0.07] pointer-events-none"
        style={{
          y: blobY1,
          background: 'linear-gradient(135deg, #22d3ee, #0e7490)',
          filter: 'blur(80px)',
        }}
      />
      <motion.div
        className="absolute top-1/2 -right-32 w-[400px] h-[400px] animate-morph-blob opacity-[0.06] pointer-events-none"
        style={{
          y: blobY2,
          background: 'linear-gradient(225deg, #8b5cf6, #6d28d9)',
          filter: 'blur(80px)',
          animationDelay: '-3s',
        }}
      />
      <motion.div
        className="absolute bottom-32 left-1/3 w-[350px] h-[350px] animate-morph-blob opacity-[0.05] pointer-events-none"
        style={{
          y: blobY3,
          background: 'linear-gradient(180deg, #f43f5e, #fb923c)',
          filter: 'blur(90px)',
          animationDelay: '-6s',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(14,116,144,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14,116,144,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="inline-block text-sm font-medium text-ocean-mid tracking-wide uppercase mb-4"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.1,
              type: 'spring',
              stiffness: 100,
              damping: 20,
            }}
            className="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-900 leading-tight mb-4"
          >
            Packages for every
            <br />
            <span className="text-ocean-mid">stage of growth</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 100,
              damping: 20,
            }}
            className="text-slate-500 text-lg leading-relaxed"
          >
            Professional website solutions — from personal brands to full
            e-commerce stores. All prices in ZAR, excl. VAT.
          </motion.p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {packages.map((pkg, i) => (
            <PricingCard key={pkg.name} pkg={pkg} index={i} />
          ))}
        </div>

        {/* Add-ons section */}
        <div ref={addOnsRef} className="max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={isAddOnsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            onClick={() => setAddOnsOpen(!addOnsOpen)}
            className="w-full group flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-200/60
                       hover:border-ocean-light/40 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]
                       transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-mid/10 to-ocean-light/10 flex items-center justify-center">
                <span className="text-lg">+</span>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                  Optional Add-ons
                </h3>
                <p className="text-sm text-slate-400">
                  Enhance your package with extras
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: addOnsOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <CaretDown
                size={20}
                className="text-slate-400 group-hover:text-ocean-mid transition-colors"
              />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {addOnsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {addOns.map((addon, i) => {
                    const AddonIcon = addon.icon;
                    return (
                      <motion.div
                        key={addon.name}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                        whileHover={{ y: -3 }}
                        className="group/addon p-5 rounded-xl bg-white border border-slate-200/60
                                   hover:border-ocean-light/40 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ocean-mid/10 to-ocean-light/10 flex items-center justify-center flex-shrink-0
                                          group-hover/addon:scale-110 transition-transform duration-300">
                            <AddonIcon
                              size={18}
                              weight="duotone"
                              className="text-ocean-mid"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-zinc-900 mb-0.5">
                              {addon.name}
                            </h4>
                            <p className="text-xs font-medium text-ocean-mid mb-1.5">
                              {addon.price}
                            </p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {addon.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fine print */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isAddOnsInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center text-xs text-slate-400 mt-8 leading-relaxed"
          >
            All prices are quoted in South African Rand (ZAR) and exclude VAT.
            Prices shown are starting rates — final quotes depend on project
            scope. A 50% deposit is required to commence work.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
