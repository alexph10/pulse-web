'use client'

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--background) 90%, black) 0%, color-mix(in srgb, var(--background-secondary) 80%, transparent) 35%, color-mix(in srgb, var(--accent-subtle) 35%, var(--background)) 65%, color-mix(in srgb, var(--accent-primary) 25%, var(--background)) 100%)',
        }}
      />

      <motion.div
        className="absolute"
        style={{
          width: '2800px',
          height: '2800px',
          right: '-1400px',
          top: '-1400px',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent-secondary) 45%, transparent) 0%, color-mix(in srgb, var(--accent-muted) 25%, transparent) 40%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Secondary glow for depth */}
      <motion.div
        className="absolute"
        style={{
          width: '2200px',
          height: '2200px',
          right: '-1100px',
          top: '-1100px',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 30%, transparent) 0%, color-mix(in srgb, var(--chart-sand) 25%, transparent) 40%, transparent 72%)',
          filter: 'blur(120px)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -45, 0],
          scale: [1, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
    </div>
  );
}

