'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react';
import LiquidGlass from './fx/LiquidGlass';
import SectionHeading from './fx/SectionHeading';
import { waLink } from './fx/WhatsAppFab';
import { EASE_IN_OUT } from '@/lib/motion';

const EMAIL = 'info@vawes.site';

export const PACKAGE_EVENT = 'vawes:package';
const packages = ['Not sure yet', 'Spark · from R2,500', 'Presence · from R5,500', 'Growth · from R9,500', 'Commerce · from R16,500', 'Something else'];

const field =
  'w-full rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-4 text-white placeholder:text-white/40 backdrop-blur transition focus:border-light-cyan/70 focus:bg-white/[0.1] focus:outline-none';

const details = [
  { iconSrc: '/icons/sm/email.webp', text: EMAIL, href: `mailto:${EMAIL}` },
  { iconSrc: '/icons/sm/mobile.webp', text: '083 373 0269', href: 'tel:+27833730269' },
  { iconSrc: '/icons/sm/place.webp', text: 'South Africa · working nationwide' },
];

type Sent = { via: 'whatsapp' | 'email'; text: string; name: string } | null;

const mailto = (name: string, text: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(`Website enquiry from ${name || 'the VAWES site'}`)}&body=${encodeURIComponent(text)}`;

// The site is static, so instead of a form that posts nowhere, the visitor's
// message is handed straight to WhatsApp or their email app, ready to send.
export default function Contact() {
  const [sent, setSent] = useState<Sent>(null);
  const [pkg, setPkg] = useState(packages[0]);

  // Pricing cards pre-select the package they came from.
  useEffect(() => {
    const onPkg = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      const match = packages.find((p) => p.startsWith(name));
      if (match) setPkg(match);
      setSent(null);
    };
    window.addEventListener(PACKAGE_EVENT, onPkg);
    return () => window.removeEventListener(PACKAGE_EVENT, onPkg);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();
    const via = (e.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'email' ? 'email' : 'whatsapp';
    const text = [`Hi VAWES, I'm ${name}.`, `Package: ${pkg}`, message].filter(Boolean).join('\n');
    if (via === 'whatsapp') window.open(waLink(text), '_blank', 'noopener');
    else window.location.href = mailto(name, text);
    setSent({ via, text, name });
  };

  return (
    <section id="contact" className="sheet water-fallback grain isolate z-10 rounded-b-[28px] py-24 text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] md:rounded-b-[56px] md:py-36">
      {/* The hero's water resurfaces at the end of the page */}
      <LiquidGlass className="-z-20" quality={0.55} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-abyss/45" />

      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
        <div>
          <SectionHeading
            tone="dark"
            eyebrow="08 · Get in touch"
            lines={['Ready to make', '*waves* together?']}
            lede="Tell us a little about your business. We reply within 24 hours with a free consultation and a fixed quote."
          />
          <ul className="mt-10 grid gap-4">
            {details.map((d) => (
              <li key={d.text} className="flex items-center gap-3">
                <img src={d.iconSrc} alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10 object-contain" />
                {d.href ? (
                  <a href={d.href} className="wave-link text-white/85 hover:text-white">
                    {d.text}
                  </a>
                ) : (
                  <span className="text-white/85">{d.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            {!sent ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ clipPath: 'inset(0 0 0 100% round 32px)', opacity: 0.6 }}
                transition={{ duration: 0.7, ease: EASE_IN_OUT }}
                className="grid gap-5 rounded-[32px] border border-white/15 bg-abyss/35 p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] backdrop-blur-xl md:p-10"
              >
                <label className="grid gap-2 text-sm font-medium text-white/80">
                  Your name
                  <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="e.g. Thandi Mokoena" className={field} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-white/80">
                  Package you&apos;re interested in
                  <select id="contact-package" name="package" value={pkg} onChange={(e) => setPkg(e.target.value)} className={`${field} appearance-none`}>
                    {packages.map((p) => (
                      <option key={p} value={p} className="bg-abyss">
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-white/80">
                  <span>
                    About your business <span className="font-normal text-white/50">(optional)</span>
                  </span>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="What you do, what the site should achieve, any deadline..."
                    className={`${field} resize-none`}
                  />
                </label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <button type="submit" value="whatsapp" className="liquid-btn liquid-btn--cyan w-full">
                    <span className="liquid-btn__label">
                      <WhatsappLogo size={20} weight="fill" /> Send on WhatsApp
                    </span>
                  </button>
                  <button type="submit" value="email" className="liquid-btn liquid-btn--glass w-full">
                    <span className="liquid-btn__label">
                      <EnvelopeSimple size={20} weight="bold" /> Send by email
                    </span>
                  </button>
                </div>
                <p className="text-sm text-white/55">
                  Your message opens in WhatsApp or your email app, ready to send. Nothing is stored on this site.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="thanks"
                initial={{ clipPath: 'inset(0 100% 0 0 round 32px)' }}
                animate={{ clipPath: 'inset(0 0% 0 0 round 32px)' }}
                transition={{ duration: 0.7, ease: EASE_IN_OUT }}
                className="grid min-h-[26rem] content-center gap-5 rounded-[32px] border border-white/15 bg-abyss/35 p-8 backdrop-blur-xl md:p-12"
                role="status"
              >
                <p className="eyebrow text-light-cyan">Almost there</p>
                <p className="font-display text-4xl font-bold leading-tight tracking-tight [font-variation-settings:'wdth'_85] md:text-5xl">
                  {sent.via === 'whatsapp' ? 'Hit send in WhatsApp.' : 'Hit send in your email app.'}
                </p>
                <p className="max-w-[44ch] text-white/75">
                  Your message is written and waiting. Once it&apos;s sent, Liam or Aidan will reply within 24 hours.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                  {sent.via === 'whatsapp' ? (
                    <a href={mailto(sent.name, sent.text)} className="wave-link text-white/85 hover:text-white">
                      WhatsApp didn&apos;t open? Send by email instead
                    </a>
                  ) : (
                    <a href={waLink(sent.text)} target="_blank" rel="noopener noreferrer" className="wave-link text-white/85 hover:text-white">
                      Email didn&apos;t open? Send on WhatsApp instead
                    </a>
                  )}
                  <button type="button" onClick={() => setSent(null)} className="wave-link text-white/60 hover:text-white">
                    Edit message
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
