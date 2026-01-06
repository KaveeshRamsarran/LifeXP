'use client';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { CrownIcon, StarIcon, SparklesIcon, TrophyIcon, ScrollIcon, SwordIcon, FlameIcon, TargetIcon } from './icons/GameIcons';
import AchievementsModal from './AchievementsModal';
import CharacterModal from './CharacterModal';
import WorldMapModal from './WorldMapModal';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, checkAuth, isLoading, updateUserStats, refreshUser } = useAuthStore();
  const { 
    currentMapNode, completedMapNodes, completeMapNode, setCurrentMapNode,
    addMysteryTask, totalTasksCompleted, currentStreak
  } = useGameStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('quests');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  // Calculate XP for level up
  const calculateXpForLevel = (level: number) => 100 + (level - 1) * 35;
  
  const xpForNextLevel = user ? calculateXpForLevel(user.level) : 0;
  
  // Calculate XP at start of current level
  let xpAtStartOfLevel = 0;
  if (user) {
    for (let i = 1; i < user.level; i++) {
      xpAtStartOfLevel += calculateXpForLevel(i);
    }
  }
  const currentLevelXp = user ? user.xp - xpAtStartOfLevel : 0;
  const canLevelUp = currentLevelXp >= xpForNextLevel;

  // Handle level up
  const handleLevelUp = useCallback(async () => {
    if (!user || !canLevelUp) return;
    
    // Calculate new XP (subtract the XP used for leveling)
    const newXp = user.xp; // Keep XP, just level up
    const newLevel = user.level + 1;
    
    // Optimistic update
    updateUserStats({ level: newLevel });
    
    // Sync with server
    await refreshUser();
  }, [user, canLevelUp, updateUserStats, refreshUser]);

  // Handle map node completion
  const handleCompleteMapNode = useCallback((nodeId: number, xpReward: number) => {
    completeMapNode(nodeId);
    if (user) {
      updateUserStats({ xp: user.xp + xpReward });
    }
  }, [completeMapNode, user, updateUserStats]);

  // Handle player move on map
  const handlePlayerMove = useCallback((nodeId: number) => {
    setCurrentMapNode(nodeId);
  }, [setCurrentMapNode]);

  // Handle mystery task from map
  const handleMysteryTask = useCallback((task: any) => {
    addMysteryTask(task);
  }, [addMysteryTask]);

  // Handle nav item click
  const handleNavClick = (itemId: string) => {
    setActiveTab(itemId);
    if (itemId === 'achievements') {
      setShowAchievements(true);
    } else if (itemId === 'stats') {
      setShowCharacter(true);
    } else if (itemId === 'map') {
      setShowWorldMap(true);
    }
  };

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

  const navItems = [
    { id: 'quests', label: 'Quest Log', icon: <ScrollIcon className="w-4 h-4" />, href: '/' },
    { id: 'map', label: 'World Map', icon: <TargetIcon className="w-4 h-4" />, href: '#map' },
    { id: 'achievements', label: 'Achievements', icon: <TrophyIcon className="w-4 h-4" />, href: '#achievements' },
    { id: 'stats', label: 'Character', icon: <SwordIcon className="w-4 h-4" />, href: '#stats' },
  ];

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

          {/* Desktop Navigation Links */}
          {user && (
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-medium transition-all
                    ${activeTab === item.id 
                      ? 'bg-amber-900/40 text-[#c9a227] border border-amber-700/50' 
                      : 'text-[#8b8b7a] hover:text-[#d7ceb2] hover:bg-stone-800/50'
                    }`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          )}
          
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

                {/* Mobile menu button */}
                <button 
                  className="lg:hidden p-2 text-[#8b8b7a] hover:text-[#d7ceb2]"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>

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

        {/* Mobile Navigation Menu */}
        {user && mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-700 bg-stone-900/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all
                    ${activeTab === item.id 
                      ? 'bg-amber-900/40 text-[#c9a227] border border-amber-700/50' 
                      : 'text-[#8b8b7a] hover:text-[#d7ceb2] hover:bg-stone-800/50'
                    }`}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        {children}
      </main>

      {/* Modals */}
      {user && (
        <>
          <AchievementsModal
            isOpen={showAchievements}
            onClose={() => setShowAchievements(false)}
            userLevel={user.level}
            userXp={user.xp}
            totalTasksCompleted={totalTasksCompleted}
            currentStreak={currentStreak}
          />
          <CharacterModal
            isOpen={showCharacter}
            onClose={() => setShowCharacter(false)}
            user={user}
            canLevelUp={canLevelUp}
            xpForNextLevel={xpForNextLevel}
            currentLevelXp={currentLevelXp}
            onLevelUp={handleLevelUp}
          />
          <WorldMapModal
            isOpen={showWorldMap}
            onClose={() => setShowWorldMap(false)}
            currentNodeId={currentMapNode}
            completedNodeIds={completedMapNodes}
            onMysteryTask={handleMysteryTask}
            onCompleteNode={handleCompleteMapNode}
            onPlayerMove={handlePlayerMove}
          />
        </>
      )}
    </div>
  );
}
