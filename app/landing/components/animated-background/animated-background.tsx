'use client'

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Animated orange glow - moved to top right */}
      <motion.div
        className="absolute"
        style={{
          width: '3600px',
          height: '3600px',
          right: '-1800px',
          top: '-1800px',
          background: 'radial-gradient(circle, rgba(255, 102, 0, 0.4) 0%, rgba(255, 102, 0, 0.2) 30%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
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
          width: '2700px',
          height: '2700px',
          right: '-1350px',
          top: '-1350px',
          background: 'radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, rgba(255, 102, 0, 0.1) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 80, 0],
          y: [0, -60, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
    </div>
  );
}

