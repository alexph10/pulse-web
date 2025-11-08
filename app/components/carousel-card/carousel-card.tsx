'use client'

import React from 'react';
import { motion } from 'motion/react';
import styles from './carousel-card.module.css';

interface CarouselCardProps {
  variant?: 'lavaLamp' | 'dualWave' | 'spiral' | 'pulse';
}

const CarouselCard: React.FC<CarouselCardProps> = ({ variant = 'lavaLamp' }) => {
  // Animation configs for different patterns
  const animations = {
    lavaLamp: {
      layer1: {
        animate: {
          x: [0, 150, -100, 0],
          y: [0, -80, 120, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 90, 180, 360],
        },
        transition: { duration: 20, repeat: Infinity, ease: "easeInOut" as const }
      },
      layer2: {
        animate: {
          x: [0, -120, 100, 0],
          y: [0, 100, -90, 0],
          scale: [1, 0.9, 1.3, 1],
          rotate: [0, -120, -240, -360],
        },
        transition: { duration: 25, repeat: Infinity, ease: "easeInOut" as const }
      },
      layer3: {
        animate: {
          x: [0, -80, 60, 0],
          y: [0, -120, 80, 0],
          scale: [1, 1.15, 0.95, 1],
          rotate: [0, 60, 120, 180],
        },
        transition: { duration: 22, repeat: Infinity, ease: "easeInOut" as const }
      }
    },
    dualWave: {
      layer1: {
        animate: {
          x: [0, 200, 0],
          y: [0, -150, 0],
          scale: [1, 1.5, 1],
        },
        transition: { duration: 15, repeat: Infinity, ease: "easeInOut" as const }
      },
      layer2: {
        animate: {
          x: [0, -200, 0],
          y: [0, 150, 0],
          scale: [1, 1.5, 1],
        },
        transition: { duration: 15, repeat: Infinity, ease: "easeInOut" as const }
      },
      layer3: {
        animate: {
          scale: [1, 1.2, 1],
          opacity: [0.55, 0.7, 0.55],
        },
        transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as const }
      }
    },
    spiral: {
      layer1: {
        animate: {
          rotate: [0, 360],
          scale: [1, 1.3, 1],
        },
        transition: { duration: 30, repeat: Infinity, ease: "linear" as const }
      },
      layer2: {
        animate: {
          rotate: [360, 0],
          scale: [1, 1.4, 1],
        },
        transition: { duration: 35, repeat: Infinity, ease: "linear" as const }
      },
      layer3: {
        animate: {
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        },
        transition: { duration: 25, repeat: Infinity, ease: "linear" as const }
      }
    },
    pulse: {
      layer1: {
        animate: {
          scale: [1, 1.4, 1],
          opacity: [0.6, 0.8, 0.6],
        },
        transition: { duration: 10, repeat: Infinity, ease: "easeInOut" as const }
      },
      layer2: {
        animate: {
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.7, 0.5],
        },
        transition: { duration: 12, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }
      },
      layer3: {
        animate: {
          scale: [1, 1.5, 1],
          opacity: [0.55, 0.75, 0.55],
        },
        transition: { duration: 14, repeat: Infinity, ease: "easeInOut" as const, delay: 2 }
      }
    }
  };

  const config = animations[variant];

  return (
    <div className={styles.cardContainer}>
      {/* SVG Noise Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.9" 
            numOctaves="4" 
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0"/>
        </filter>
      </svg>
      
      {/* Animated Gradient Layers */}
      <motion.div
        className={styles.gradientLayer1}
        animate={config.layer1.animate}
        transition={config.layer1.transition}
      />
      <motion.div
        className={styles.gradientLayer2}
        animate={config.layer2.animate}
        transition={config.layer2.transition}
      />
      <motion.div
        className={styles.gradientLayer3}
        animate={config.layer3.animate}
        transition={config.layer3.transition}
      />
      
      {/* Noise Overlay */}
      <div className={styles.noiseOverlay}></div>
    </div>
  );
};

export default CarouselCard;
