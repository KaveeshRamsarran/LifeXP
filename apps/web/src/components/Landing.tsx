'use client';
import Link from 'next/link';
import { Button } from './ui/Button';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        Level Up Your Life
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl">
        Turn your daily tasks into an RPG. Earn XP, gain levels, unlock titles, and build habits with Life XP.
      </p>
      <div className="flex gap-4">
        <Link href="/register">
          <Button size="lg" className="text-lg px-8">Start Your Adventure</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg" className="text-lg px-8">Login</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-xl font-bold mb-2 text-primary">Track Stats</h3>
          <p className="text-slate-400">Gain Intelligence, Strength, Discipline, and Wealth by completing real-world tasks.</p>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-xl font-bold mb-2 text-secondary">Daily Quests</h3>
          <p className="text-slate-400">Complete randomly generated daily quests to earn bonus XP and keep things fresh.</p>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-xl font-bold mb-2 text-accent">Build Streaks</h3>
          <p className="text-slate-400">Maintain habit streaks with a forgiving decay system. Missing a day doesn't mean starting over.</p>
        </div>
      </div>
    </div>
  );
}
