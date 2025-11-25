'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './page-toggle.module.css';

interface PageLink {
  label: string;
  href: string;
}

const mainPages: PageLink[] = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Insights', href: '/dashboard/insights' },
  { label: 'Journal', href: '/dashboard/journal' },
  { label: 'Settings', href: '/dashboard/profile' },
];

const PageToggle: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav 
      style={{
        display: 'flex',
        gap: '32px',
        padding: '16px 24px',
        marginTop: '8px',
        borderBottom: '2px solid #e4ddd3',
        background: '#f5f2eb',
        minHeight: '60px',
        alignItems: 'center',
      }}
    >
      {mainPages.map((page) => {
        const isActive = pathname === page.href;
        return (
          <Link
            key={page.href}
            href={page.href}
            style={{
              position: 'relative',
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#a0522d' : '#6a6866',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              display: 'inline-block',
            }}
          >
            {page.label}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background: '#a0522d',
                  borderRadius: '2px',
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default PageToggle;

