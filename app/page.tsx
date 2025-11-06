'use client'

import Navbar from './components/navbar/navbar';
import HeroOverlay from './components/landing-page/hero-overlay/hero-overlay';
import ScrollIndicator from './components/scroll-indicator/scroll-indicator';
import AnimatedBackground from './components/animated-background/animated-background';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollOpacity, setScrollOpacity] = useState({ section1: 1, section2: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollProgress = scrollPosition / windowHeight;

      // Fade out first section, fade in second section
      const section1Opacity = Math.max(0, 1 - scrollProgress);
      const section2Opacity = Math.min(1, scrollProgress);

      setScrollOpacity({
        section1: section1Opacity,
        section2: section2Opacity
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Fixed animated background */}
      <AnimatedBackground />
      
      <Navbar />
      <ScrollIndicator sections={2} />
      
      {/* Section 1 - Hero with fade out */}
      <div 
        style={{ 
          opacity: scrollOpacity.section1,
          transition: 'opacity 0.1s ease-out'
        }}
      >
        <HeroOverlay />
      </div>
      
      {/* Section 2 - Second page with fade in */}
      <div 
        className="w-full h-screen" 
        style={{ 
          opacity: scrollOpacity.section2,
          transition: 'opacity 0.1s ease-out'
        }}
      >
        {/* Content will go here */}
      </div>
    </div>
  );
}
