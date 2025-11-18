'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import styles from './navbar.module.css';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
   const [activeItem, setActiveItem] = useState<string>('');

   const navItems = [
      { label: 'Collections', href: '/collections' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Freebies', href: '/freebies' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Request', href: '/request' },
   ];
   
   return (
     <nav className={`${styles.navbar} ${transparent ? styles.transparent : ''}`}>
       <div className={styles.navbarBackground}>
         <div className={styles.container}>

           {/* Navigation Links - Center */}
           <div className={styles.navLinks}>
             {navItems.map((item) => (
               <Link
                 key={item.label}
                 href={item.href}
                 className={`${styles.navItem} ${
                   activeItem === item.label ? styles.active : ''
                 }`}
               >
                 {item.label}
               </Link>
             ))}
           </div>
           
           {/* CTA - Right */}
           <Link href="/login" className={styles.ctaLink}>
             <span className={styles.ctaText}>Sign Up / Log In</span>
           </Link>
         </div>
       </div>
     </nav>
   );
};
export default Navbar;