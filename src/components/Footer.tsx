import StretchText from './fx/StretchText';
import MotionToggle from './fx/MotionToggle';

const nav = ['Services', 'Work', 'Process', 'About', 'Pricing', 'Contact'];
const services = ['Web Design', 'Development', 'E-Commerce', 'SEO', 'Maintenance'];

export default function Footer() {
  return (
    // A curtain footer on large screens: it waits, pinned underneath, and the
    // contact section lifts away to reveal it. Only where the whole footer fits
    // on screen; elsewhere it simply follows the page.
    <footer className="relative -mt-14 bg-abyss pt-14 text-white [@media(min-width:1024px)_and_(min-height:760px)]:sticky [@media(min-width:1024px)_and_(min-height:760px)]:bottom-0 [@media(min-width:1024px)_and_(min-height:760px)]:-z-10">
      <div className="mx-auto max-w-[1400px] px-5 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
          <div className="grid content-start gap-4">
            <p className="max-w-[34ch] text-lg leading-relaxed text-white/70">
              A two-person web studio crafting digital waves from South Africa.
            </p>
            <a href="mailto:info@vawes.site" className="wave-link justify-self-start font-display text-2xl font-semibold text-light-cyan">
              info@vawes.site
            </a>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-5 text-white/45">Navigate</p>
            <ul className="grid gap-2.5">
              {nav.map((n) => (
                <li key={n}>
                  <a href={`#${n.toLowerCase()}`} className="wave-link text-white/75 hover:text-white">
                    {n}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-5 text-white/45">Services</p>
            <ul className="grid gap-2.5 text-white/75">
              {services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark that stretches like a reflection under the cursor */}
      <div className="mt-12 select-none px-3 md:mt-16">
        <StretchText
          as="p"
          lines={['VAWES']}
          reveal={false}
          sweep={false}
          min={75}
          max={100}
          radius={320}
          className="text-center font-display text-[19vw] font-extrabold leading-[0.78] tracking-[-0.06em] bg-gradient-to-b from-light-cyan via-ocean-teal to-deep-navy bg-clip-text text-transparent"
        />
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 border-t border-white/10 px-5 py-6 text-xs text-white/45 md:flex-row md:px-10">
        <p>&copy; {new Date().getFullYear()} VAWES. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <MotionToggle />
          <a href="#top" className="wave-link eyebrow text-white/60 hover:text-white">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
