'use client';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CrownIcon, 
  SwordIcon, 
  ShieldIcon, 
  FlameIcon, 
  BrainIcon, 
  MuscleIcon, 
  TargetIcon, 
  CoinIcon,
  StarIcon,
  DragonIcon,
  LightningIcon,
  ScrollIcon,
  SparklesIcon,
  TrophyIcon
} from './icons/GameIcons';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-10 left-10 animate-float float-delay-1 opacity-30">
        <SwordIcon className="w-12 h-12 text-gold" />
      </div>
      <div className="absolute top-20 right-20 animate-float float-delay-2 opacity-30">
        <ShieldIcon className="w-10 h-10 text-azure" />
      </div>
      <div className="absolute bottom-40 left-20 animate-float float-delay-3 opacity-30">
        <StarIcon className="w-8 h-8 text-ember" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float float-delay-4 opacity-30">
        <CrownIcon className="w-10 h-10 text-gold" />
      </div>
      <div className="absolute top-1/3 left-5 animate-float float-delay-2 opacity-20">
        <TrophyIcon className="w-6 h-6 text-mystic" />
      </div>
      <div className="absolute top-1/2 right-5 animate-float float-delay-1 opacity-20">
        <ScrollIcon className="w-8 h-8 text-jade" />
      </div>

      {/* Hero Section */}
      <div className="animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="relative group">
            {/* Favicon Logo with glow effect */}
            <div className="app-logo logo-animated p-3 bg-gradient-to-br from-surface/80 to-background rounded-2xl border border-gold/30">
              <Image 
                src="/favicon.svg" 
                alt="Life XP Logo" 
                width={80} 
                height={80}
                className="drop-shadow-lg"
                priority
              />
            </div>
            {/* Sparkles around logo */}
            <SparklesIcon className="w-6 h-6 text-gold absolute -top-2 -right-2 animate-sparkle" />
            <StarIcon className="w-4 h-4 text-ember absolute -bottom-1 -left-1 animate-sparkle float-delay-2" />
            <SparklesIcon className="w-5 h-5 text-mystic absolute top-0 -left-3 animate-sparkle float-delay-3" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-cinzel font-bold tracking-tight">
          <span className="gradient-text-animated">
            Level Up
          </span>
          <br />
          <span className="text-white">Your Life</span>
        </h1>
        
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold"></div>
          <DragonIcon className="w-8 h-8 text-ember animate-pulse" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold"></div>
        </div>
      </div>

      <p className="text-xl text-muted max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
        Transform your daily tasks into an <span className="text-ember font-semibold">epic adventure</span>. 
        Earn XP, gain levels, unlock legendary titles, and forge unbreakable habits.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <Link href="/register">
          <button className="hero-btn-primary group ripple-effect">
            <SwordIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Start Your Adventure
            <SparklesIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </Link>
        <Link href="/login">
          <button className="hero-btn-secondary group">
            <ShieldIcon className="w-5 h-5" />
            Continue Quest
          </button>
        </Link>
      </div>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 text-left w-full max-w-5xl">
        <div className="feature-card card-shine hover-lift stagger-item">
          <div className="feature-icon feature-icon-intelligence">
            <BrainIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-cinzel font-bold mb-2 text-azure">Track Stats</h3>
          <p className="text-sm text-muted">
            Build <span className="text-azure">Intelligence</span>, <span className="text-crimson">Strength</span>, 
            <span className="text-mystic"> Discipline</span>, and <span className="text-jade">Wealth</span> 
            through real quests.
          </p>
          <div className="flex gap-2 mt-3">
            <BrainIcon className="w-5 h-5 text-azure" />
            <MuscleIcon className="w-5 h-5 text-crimson" />
            <TargetIcon className="w-5 h-5 text-mystic" />
            <CoinIcon className="w-5 h-5 text-jade" />
          </div>
        </div>

        <div className="feature-card card-shine hover-lift stagger-item">
          <div className="feature-icon feature-icon-quest">
            <LightningIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-cinzel font-bold mb-2 text-ember">Daily Quests</h3>
          <p className="text-sm text-muted">
            Tackle randomly generated daily challenges for bonus XP and epic rewards.
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-gold">
            <ScrollIcon className="w-4 h-4" />
            <span>New quests every day</span>
          </div>
        </div>

        <div className="feature-card card-shine hover-lift stagger-item">
          <div className="feature-icon feature-icon-streak">
            <FlameIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-cinzel font-bold mb-2 text-ember">Build Streaks</h3>
          <p className="text-sm text-muted">
            Maintain habit streaks with a forgiving decay system. One day off doesn't end your journey.
          </p>
          <div className="flex items-center gap-1 mt-3">
            <FlameIcon className="w-5 h-5 text-ember streak-flame" />
            <span className="text-ember font-bold">7</span>
            <span className="text-xs text-muted ml-1">day streak</span>
          </div>
        </div>

        <div className="feature-card card-shine hover-lift stagger-item">
          <div className="feature-icon feature-icon-level">
            <CrownIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-cinzel font-bold mb-2 text-gold">Level Up</h3>
          <p className="text-sm text-muted">
            Earn XP, unlock powerful titles, and watch your character grow stronger each day.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="mini-xp-bar">
              <div className="mini-xp-fill" style={{ width: '65%' }}></div>
            </div>
            <span className="text-xs text-gold">Lvl 12</span>
          </div>
        </div>
      </div>

      {/* New Feature: Quest Map Preview */}
      <div className="mt-16 w-full max-w-3xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="fantasy-card p-6 card-shine">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-mystic/20 border border-mystic/40">
              <ScrollIcon className="w-6 h-6 text-mystic" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-gold">Quest Journey Map</h3>
              <p className="text-xs text-muted">Navigate your adventure</p>
            </div>
          </div>
          
          {/* Mini map preview */}
          <div className="relative h-32 bg-gradient-to-br from-surface/50 to-background rounded-xl border border-gold/10 overflow-hidden">
            {/* Decorative path */}
            <svg className="absolute inset-0 w-full h-full opacity-60">
              <path 
                d="M 40 80 Q 100 40, 160 70 T 280 50 T 400 80 T 520 40" 
                fill="none" 
                stroke="url(#previewGradient)" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeDasharray="8 4"
              />
              <defs>
                <linearGradient id="previewGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="50%" stopColor="#ff6b35" />
                  <stop offset="100%" stopColor="#9d4edd" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Preview nodes */}
            <div className="absolute top-16 left-8 w-6 h-6 rounded-full bg-jade flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute top-8 left-32 w-6 h-6 rounded-full bg-jade flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute top-14 left-56 w-6 h-6 rounded-full bg-gold animate-pulse flex items-center justify-center">
              <StarIcon className="w-3 h-3 text-background" />
            </div>
            <div className="absolute top-20 left-80 w-6 h-6 rounded-full bg-slate-600 opacity-50" />
            <div className="absolute top-8 right-20 w-6 h-6 rounded-full bg-mystic opacity-50 flex items-center justify-center">
              <DragonIcon className="w-3 h-3 text-white" />
            </div>
            
            {/* "Coming Soon" badge */}
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-gold/20 border border-gold/40 rounded-full">
              <span className="text-[10px] text-gold font-bold">NEW FEATURE</span>
            </div>
          </div>
          
          <p className="text-sm text-muted mt-3 text-center">
            Journey through an interactive quest map and unlock achievements along the way!
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <p className="text-muted text-sm mb-4">Join thousands of adventurers leveling up</p>
        <div className="flex justify-center gap-4 items-center">
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full bg-gradient-to-br from-surface to-background border-2 border-gold/30 flex items-center justify-center"
              >
                <StarIcon className="w-4 h-4 text-gold" />
              </div>
            ))}
          </div>
          <span className="text-gold font-semibold">2,500+ heroes</span>
        </div>
      </div>
    </div>
  );
}
