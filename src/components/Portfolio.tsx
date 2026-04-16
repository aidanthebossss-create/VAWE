'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { ArrowUpRight, X } from '@phosphor-icons/react';

const projects = [
  {
    id: 1,
    title: 'Meridian Architecture',
    category: 'Design & Development',
    description: 'A bold portfolio for an award-winning architecture firm. Horizontal scroll galleries, dramatic typography, and immersive project showcases.',
    color: '#1a1d23',
    gradient: 'from-zinc-800 to-zinc-900',
    tags: ['Next.js', 'GSAP', 'Tailwind'],
    mockupBg: 'bg-gradient-to-br from-amber-50 to-orange-100',
  },
  {
    id: 2,
    title: 'Kelp & Co Organics',
    category: 'E-Commerce',
    description: 'Sustainable skincare brand with an ocean-inspired aesthetic. Custom Shopify theme with micro-animations and smooth cart interactions.',
    color: '#0f766e',
    gradient: 'from-teal-700 to-emerald-800',
    tags: ['Shopify', 'React', 'Motion'],
    mockupBg: 'bg-gradient-to-br from-teal-50 to-emerald-100',
  },
  {
    id: 3,
    title: 'Prism Analytics',
    category: 'Web Application',
    description: 'Real-time data visualization dashboard. Complex charts, live data streams, and a command palette for power users.',
    color: '#6d28d9',
    gradient: 'from-violet-700 to-purple-800',
    tags: ['React', 'D3.js', 'WebSocket'],
    mockupBg: 'bg-gradient-to-br from-violet-50 to-purple-100',
  },
  {
    id: 4,
    title: 'Nomad Coffee Roasters',
    category: 'Branding & Web',
    description: 'Artisanal coffee brand from Cape Town. Warm earth tones, parallax storytelling, and an integrated ordering system.',
    color: '#92400e',
    gradient: 'from-amber-800 to-orange-900',
    tags: ['Next.js', 'Sanity', 'Stripe'],
    mockupBg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
  },
];

function ParallaxTiltCard({
  project,
  index,
  onClick,
}: {
  project: typeof projects[0];
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <motion.div
      ref={ref}
      style={{ y: parallaxY }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 80, damping: 20 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        onClick={onClick}
        className="group cursor-pointer"
      >
        {/* Card */}
        <div
          className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${project.gradient}
                       shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]
                       group-hover:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.3)]
                       transition-shadow duration-500`}
        >
          {/* Spotlight effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.08), transparent 60%)`,
            }}
          />

          <div className="p-8 md:p-10">
            {/* Category */}
            <span className="inline-block text-sm font-medium text-white/50 mb-4 tracking-wide uppercase">
              {project.category}
            </span>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
              {project.title}
            </h3>

            <p className="text-white/60 text-[15px] leading-relaxed max-w-[45ch] mb-6">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium text-white/70 border border-white/15
                             backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Browser mockup */}
            <div className={`${project.mockupBg} rounded-2xl overflow-hidden
                              group-hover:scale-[1.02] transition-transform duration-700 ease-out`}>
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/60 backdrop-blur-sm border-b border-black/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
              <div className="p-6 space-y-3">
                <div className="h-4 w-2/3 rounded bg-black/8" />
                <div className="h-3 w-full rounded bg-black/5" />
                <div className="h-3 w-4/5 rounded bg-black/4" />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="h-16 rounded-xl bg-black/5" />
                  <div className="h-16 rounded-xl bg-black/3" />
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                          group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
            <ArrowUpRight size={18} weight="bold" className="text-white" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: typeof projects[0];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/70 backdrop-blur-sm"
    >
      <motion.div
        layoutId={`project-${project.id}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        {/* Header with gradient */}
        <div className={`bg-gradient-to-br ${project.gradient} p-8 md:p-10`}>
          <span className="text-sm font-medium text-white/50 uppercase tracking-wide">
            {project.category}
          </span>
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mt-2">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium text-white/70 border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <p className="text-slate-600 leading-relaxed mb-6">{project.description}</p>

          <div className={`${project.mockupBg} rounded-2xl overflow-hidden`}>
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/60 border-b border-black/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <div className="p-8 space-y-3">
              <div className="h-5 w-1/2 rounded bg-black/8" />
              <div className="h-3 w-full rounded bg-black/5" />
              <div className="h-3 w-4/5 rounded bg-black/4" />
              <div className="h-3 w-3/5 rounded bg-black/3" />
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="h-20 rounded-xl bg-black/5" />
                <div className="h-20 rounded-xl bg-black/4" />
                <div className="h-20 rounded-xl bg-black/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm
                     flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X size={18} weight="bold" className="text-white" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="work" className="relative py-24 md:py-32 bg-zinc-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="inline-block text-sm font-medium text-ocean-light tracking-wide uppercase mb-4"
            >
              Selected Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}
              className="text-3xl md:text-5xl font-bold tracking-tighter text-white leading-tight"
            >
              Projects that made
              <br />
              <span className="text-ocean-light">a splash</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
            className="text-slate-400 max-w-[40ch] leading-relaxed"
          >
            Every project is a chance to push boundaries. Here are some of the waves
            we have ridden with our clients.
          </motion.p>
        </div>

        {/* Asymmetric grid of projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - offset down */}
          <div className="space-y-8 lg:pt-16">
            <ParallaxTiltCard
              project={projects[0]}
              index={0}
              onClick={() => setSelectedProject(projects[0])}
            />
            <ParallaxTiltCard
              project={projects[2]}
              index={2}
              onClick={() => setSelectedProject(projects[2])}
            />
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <ParallaxTiltCard
              project={projects[1]}
              index={1}
              onClick={() => setSelectedProject(projects[1])}
            />
            <ParallaxTiltCard
              project={projects[3]}
              index={3}
              onClick={() => setSelectedProject(projects[3])}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
