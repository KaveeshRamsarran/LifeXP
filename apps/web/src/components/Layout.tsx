'use client';
import { useAuthStore } from '../store/authStore';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CrownIcon, StarIcon, SparklesIcon } from './icons/GameIcons';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, checkAuth, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fantasy-bg"></div>
        <div className="flex flex-col items-center gap-4">
          <div className="fantasy-spinner"></div>
          <span className="text-gold font-cinzel animate-pulse">Loading your adventure...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans relative">
      {/* Animated fantasy background */}
      <div className="fantasy-bg"></div>
      
      {/* Navigation */}
      <nav className="fantasy-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/favicon.svg" 
              alt="Life XP" 
              width={32} 
              height={32} 
              className="app-logo"
            />
            <span className="text-xl font-cinzel font-bold bg-gradient-to-r from-gold via-ember to-gold bg-clip-text text-transparent">
              Life XP
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 border border-gold/30">
                    <CrownIcon className="w-4 h-4 text-gold" />
                    <span className="text-sm font-bold text-gold">Lvl {user.level}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 border border-mystic/30">
                    <StarIcon className="w-4 h-4 text-mystic" />
                    <span className="text-xs font-medium text-mystic-light">{user.title}</span>
                  </div>
                </div>
                <button 
                  onClick={() => logout()}
                  className="fantasy-nav-link text-sm font-medium px-4 py-2 hover:bg-surface/30 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/login">
                  <button className="fantasy-nav-link text-sm font-medium px-4 py-2 hover:bg-surface/30 rounded-lg transition-all">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="fantasy-btn text-sm">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
