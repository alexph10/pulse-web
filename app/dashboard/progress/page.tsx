'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../../components/layouts/DashboardLayout';

export default function Progress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  return (
    <DashboardLayout isLoading={loading}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '6px',
          fontFamily: 'var(--font-family-satoshi)'
        }}>
          Progress & Analytics
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-family-switzer)'
        }}>
          Coming soon - Track your journey and identify patterns
        </p>
      </div>
    </DashboardLayout>
  );
}
