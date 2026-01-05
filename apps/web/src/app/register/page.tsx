'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SwordIcon, SparklesIcon, CrownIcon } from '@/components/icons/GameIcons';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({ email, password, name });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="fantasy-card w-full max-w-md p-8 animate-scale-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-surface/50 border border-ember/30 relative">
              <SwordIcon className="w-12 h-12 text-ember" />
              <SparklesIcon className="w-5 h-5 text-gold absolute -top-1 -right-1 animate-float" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gold">Begin Your Legend</h1>
          <p className="text-sm text-muted mt-2">Create your hero and start the adventure</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-muted mb-2 block">Hero Name</label>
            <input
              className="fantasy-input w-full"
              placeholder="Sir Productive"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted mb-2 block">Email</label>
            <input
              type="email"
              className="fantasy-input w-full"
              placeholder="hero@adventure.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted mb-2 block">Password</label>
            <input
              type="password"
              className="fantasy-input w-full"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-crimson/10 border border-crimson/30 text-crimson text-sm">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="hero-btn-primary w-full justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="fantasy-spinner w-5 h-5 border-2"></div>
            ) : (
              <>
                <CrownIcon className="w-5 h-5" />
                Create Hero
              </>
            )}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-background text-xs text-muted">Starting bonuses</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-3 rounded-lg bg-surface/30 border border-gold/20">
              <span className="text-gold font-bold">Level 1</span>
              <p className="text-muted mt-1">Novice rank</p>
            </div>
            <div className="p-3 rounded-lg bg-surface/30 border border-jade/20">
              <span className="text-jade font-bold">0 XP</span>
              <p className="text-muted mt-1">Ready to earn</p>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted pt-4">
            Already a hero?{' '}
            <Link href="/login" className="text-gold hover:text-gold-light transition-colors font-medium">
              Continue quest
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
