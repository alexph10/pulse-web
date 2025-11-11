'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import { Inter, EB_Garamond } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const ebGaramond = EB_Garamond({ subsets: ['latin'] });

interface NavItem {
   label: string;
   href: string;
}

const Navbar: React.FC = () => {
   const [navItems, setNavItems] = useState<NavItem[]>([
      { label: 'About', href: '/about' },
      { label: 'Products', href: '/products' },
   ]);
   const [activeItem, setActiveItem] = useState<string>('');
   const [isLogoHovered, setIsLogoHovered] = useState(false);
   const [logoClickCount, setLogoClickCount] = useState(0);
   const [pulseAnimation, setPulseAnimation] = useState(false);

   // Handle logo interactions
   const handleLogoClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setLogoClickCount(prev => prev + 1);
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
      
      // Navigate after animation
      setTimeout(() => {
         window.location.href = '/';
      }, 300);
   };

   const handleLogoEnter = () => {
      setIsLogoHovered(true);
   };

   const handleLogoLeave = () => {
      setIsLogoHovered(false);
   };
   
   return (
     <nav className={styles.navbar}>
       <div className={styles.navbarBackground}>
         <div className={styles.container}>
           {/* Logo */}
           <Link 
             href="/" 
             className={styles.logo}
             onMouseEnter={handleLogoEnter}
             onMouseLeave={handleLogoLeave}
             onClick={handleLogoClick}
           >
             <div className={`${styles.logoContainer} ${pulseAnimation ? styles.pulseEffect : ''}`}>
               <div className={`${styles.squareTopLeft} ${isLogoHovered ? styles.squareAnimated : ''} ${pulseAnimation ? styles.squarePulse : ''}`} />
               <span className={`${styles.logoText} ${logoClickCount > 0 ? styles.logoGlow : ''}`}>Pulse</span>
               <div className={`${styles.squareBottomRight} ${isLogoHovered ? styles.squareAnimated : ''} ${pulseAnimation ? styles.squarePulse : ''}`} />
               {/* Orbital rings */}
               <div className={`${styles.orbitalRing} ${isLogoHovered ? styles.orbitalActive : ''}`} />
               <div className={`${styles.orbitalRing} ${styles.orbitalRingDelay} ${isLogoHovered ? styles.orbitalActive : ''}`} />
             </div>
           </Link>

           {/* Navigation Links */}
           <div className={styles.navLinks}>
             {navItems.map((item) => (
               <Link
                 key={item.label}
                 href={item.href}
                 className={`${styles.navItem} ${
                   activeItem === item.label ? styles.active : ''
                 }`}
                 onMouseEnter={() => setActiveItem(item.label)}
                 onMouseLeave={() => setActiveItem('')}
               >
                 {item.label}
               </Link>
             ))}
           </div>
           
           {/* CTA Link */}
           <Link 
             href="/onboarding"
             className={styles.ctaLink}
           >
             Sign up / Log in
           </Link>
         </div>
       </div>
     </nav>
   );
};
export default Navbar;