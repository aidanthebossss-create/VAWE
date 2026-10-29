'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WhatsappLogo } from '@phosphor-icons/react';
import { EASE_OUT } from '@/lib/motion';

export const WHATSAPP_NUMBER = '27833730269';
export const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Floating WhatsApp shortcut, the way most South Africans prefer to reach a
// business. It waits until the visitor has left the hero (which has its own
// buttons) and steps aside while the contact section is on screen.
export default function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    const contact = document.getElementById('contact');
    if (!hero || !contact) return;
    let pastHero = false;
    let atContact = false;
    const update = () => setShow(pastHero && !atContact);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === contact) atContact = e.isIntersecting;
      });
      update();
    });
    io.observe(hero);
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={waLink("Hi VAWES, I'd like to chat about a website.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with VAWES on WhatsApp"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 items-center gap-2 rounded-full bg-[#128C4A] pl-4 pr-5 font-semibold text-white shadow-[0_14px_40px_-12px_rgba(7,30,51,0.6)] transition-colors hover:bg-[#0E7A3E] md:right-6"
        >
          <WhatsappLogo size={26} weight="fill" />
          <span className="text-sm">WhatsApp us</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
