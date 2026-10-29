'use client';

import { useEffect } from 'react';

// One observer for the whole site. Any element with data-reveal gets the
// class `is-in` the first time it scrolls into view; globals.css turns that
// into the masked line reveals, fades, wipes and unmasks. The hidden starting
// states only apply when JS is running and motion is allowed, so content is
// never stuck invisible.
export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    const scan = (root: ParentNode) =>
      root.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));

    scan(document);
    const mo = new MutationObserver((records) => {
      records.forEach((r) =>
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches('[data-reveal]:not(.is-in)')) io.observe(n);
          scan(n);
        }),
      );
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
