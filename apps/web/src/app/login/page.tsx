'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldIcon, SparklesIcon } from '@/components/icons/GameIcons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="fantasy-card w-full max-w-md p-8 animate-scale-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-surface/50 border border-gold/30">
              <ShieldIcon className="w-12 h-12 text-gold" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gold">Continue Your Quest</h1>
          <p className="text-sm text-muted mt-2">Welcome back, adventurer!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Your secret spell..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
                <SparklesIcon className="w-5 h-5" />
                Enter the Realm
              </>
            )}
          </button>
          
          <p className="text-center text-sm text-muted">
            New to this realm?{' '}
            <Link href="/register" className="text-gold hover:text-gold-light transition-colors font-medium">
              Create your hero
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
