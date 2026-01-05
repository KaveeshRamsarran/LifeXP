'use client';
import { useAuthStore } from '@/store/authStore';
import Dashboard from '@/components/Dashboard';
import Landing from '@/components/Landing';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted || isLoading) {
    return null;
  }

  return user ? <Dashboard /> : <Landing />;
}
