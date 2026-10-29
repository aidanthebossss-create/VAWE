import StretchText from './StretchText';

type Props = {
  eyebrow: string;
  lines: string[];
  lede?: string;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
};

// Eyebrow label, stretchy display heading and an optional intro line. Used
// at the top of every section so headings share one motion language.
export default function SectionHeading({
  eyebrow,
  lines,
  lede,
  tone = 'light',
  align = 'left',
  className = '',
}: Props) {
  const dark = tone === 'dark';
  return (
    <div className={`grid gap-5 ${align === 'center' ? 'justify-items-center text-center' : ''} ${className}`}>
      <p data-reveal="wipe" className={`eyebrow ${dark ? 'text-light-cyan' : 'text-ocean-teal'}`}>{eyebrow}</p>
      <StretchText
        lines={lines}
        className={`display-2 ${dark ? 'text-white' : 'text-ink'}`}
        accentClassName={dark ? 'text-light-cyan' : 'text-ocean-teal'}
      />
      {lede && (
        <p
          data-reveal="fade"
          style={{ '--d': '250ms' } as React.CSSProperties}
          className={`max-w-[56ch] text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-ink-soft'}`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
