'use client';
import { useAuthStore } from '../store/authStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/Button';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, checkAuth, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Life XP
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Lvl {user.level}</span>
                  <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-medium">
                    {user.title}
                  </span>
                </div>
                <Button variant="ghost" onClick={() => logout()}>Logout</Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login"><Button variant="ghost">Login</Button></Link>
                <Link href="/register"><Button>Sign Up</Button></Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
