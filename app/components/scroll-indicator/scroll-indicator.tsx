'use client'

import React, { useState, useEffect } from 'react';
import styles from './scroll-indicator.module.css';

interface ScrollIndicatorProps {
  sections: number;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentSection = Math.floor(scrollPosition / windowHeight);
      setActiveSection(Math.min(currentSection, sections - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (index: number) => {
    window.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className={styles.scrollIndicator}>
      {Array.from({ length: sections }).map((_, index) => (
        <button
          key={index}
          className={`${styles.dot} ${index === activeSection ? styles.active : ''}`}
          onClick={() => scrollToSection(index)}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ScrollIndicator;
