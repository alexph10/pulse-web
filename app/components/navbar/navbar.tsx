'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import { Inter, EB_Garamond } from 'next/font/google';
import SignupModal from '../signup-modal/signup-modal';

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
   const [isModalOpen, setIsModalOpen] = useState(false);
   
   return (
     <>
       <nav className={styles.navbar}>
         <div className={styles.navbarBackground}>
           <div className={styles.container}>
             {/* Logo */}
             <Link href="/" className={styles.logo}>
               <span className={styles.logoText}>Pulse</span>
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
             <button 
               onClick={() => setIsModalOpen(true)}
               className={styles.ctaLink}
             >
               Sign up / Log in
             </button>
           </div>
         </div>
       </nav>
       
       <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
     </>
   );
};
export default Navbar;