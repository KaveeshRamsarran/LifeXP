'use client';
import { useState } from 'react';
import { CrownIcon, StarIcon, SwordIcon, ShieldIcon, ScrollIcon, FlameIcon, LightningIcon } from './icons/GameIcons';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    level: number;
    xp: number;
    title: string;
    statIntelligence: number;
    statStrength: number;
    statDiscipline: number;
    statWealth: number;
  };
  canLevelUp: boolean;
  xpForNextLevel: number;
  currentLevelXp: number;
  onLevelUp?: () => void;
}

// Player sprite component for character display - using custom image
function CharacterSprite() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Glow effect under player */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gold/40 rounded-full blur-xl" />
      
      {/* Player image - larger for character screen */}
      <img 
        src="/male.png"
        alt="Player character"
        className="w-32 h-32 object-contain drop-shadow-2xl"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
        }}
      />
    </div>
  );
}

export default function CharacterModal({ 
  isOpen, 
  onClose, 
  user,
  canLevelUp,
  xpForNextLevel,
  currentLevelXp,
  onLevelUp,
}: CharacterModalProps) {
  const [showLevelUpConfirm, setShowLevelUpConfirm] = useState(false);

  if (!isOpen) return null;

  const stats = [
    { 
      name: 'Intelligence', 
      value: user.statIntelligence, 
      icon: <ScrollIcon className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/40',
      borderColor: 'border-blue-600/50',
      description: 'Mental acuity and learning speed',
    },
    { 
      name: 'Strength', 
      value: user.statStrength, 
      icon: <SwordIcon className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-900/40',
      borderColor: 'border-red-600/50',
      description: 'Physical power and endurance',
    },
    { 
      name: 'Discipline', 
      value: user.statDiscipline, 
      icon: <ShieldIcon className="w-5 h-5" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-900/40',
      borderColor: 'border-amber-600/50',
      description: 'Willpower and consistency',
    },
    { 
      name: 'Wealth', 
      value: user.statWealth, 
      icon: <CrownIcon className="w-5 h-5" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-900/40',
      borderColor: 'border-emerald-600/50',
      description: 'Financial wisdom and growth',
    },
  ];

  const totalPower = Math.round((user.statIntelligence + user.statStrength + user.statDiscipline + user.statWealth) * 10);

  const handleLevelUp = () => {
    if (onLevelUp) {
      onLevelUp();
      setShowLevelUpConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-stone-900 to-stone-950 border-2 border-[#c9a227]/30 rounded-lg shadow-2xl animate-scale-in">
        {/* Header - Elden Ring style */}
        <div className="relative p-6 border-b border-[#c9a227]/20 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-elden font-bold text-[#c9a227]">Character Status</h2>
              <p className="text-sm text-[#8b8b7a]">Level Up Menu</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#8b8b7a] hover:text-[#d7ceb2] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Character display */}
            <div className="flex flex-col items-center">
              {/* Character sprite */}
              <div className="relative p-8 bg-gradient-to-b from-stone-800/50 to-stone-900/50 rounded-lg border border-[#c9a227]/20 mb-4">
                <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 to-transparent rounded-lg" />
                <CharacterSprite />
              </div>

              {/* Character name and title */}
              <div className="text-center">
                <h3 className="text-xl font-elden font-bold text-[#d7ceb2]">{user.name}</h3>
                <p className="text-sm text-[#c9a227]">{user.title}</p>
              </div>

              {/* Level display */}
              <div className="mt-4 flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs text-[#8b8b7a] uppercase tracking-wider">Level</div>
                  <div className="text-4xl font-elden font-bold text-[#c9a227]">{user.level}</div>
                </div>
                <div className="h-12 w-px bg-[#c9a227]/30" />
                <div className="text-center">
                  <div className="text-xs text-[#8b8b7a] uppercase tracking-wider">Power</div>
                  <div className="text-4xl font-elden font-bold text-purple-400">{totalPower}</div>
                </div>
              </div>

              {/* XP Bar */}
              <div className="w-full mt-4 p-3 bg-stone-800/50 rounded border border-stone-700">
                <div className="flex justify-between text-xs text-[#8b8b7a] mb-1">
                  <span>Experience Points</span>
                  <span>{Math.floor(currentLevelXp)} / {xpForNextLevel}</span>
                </div>
                <div className="h-3 bg-stone-900 rounded-full overflow-hidden border border-stone-700">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      canLevelUp 
                        ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 animate-pulse' 
                        : 'bg-gradient-to-r from-amber-700 to-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (currentLevelXp / xpForNextLevel) * 100)}%` }}
                  />
                </div>
                
                {/* Level Up Button */}
                {canLevelUp && (
                  <button
                    onClick={() => setShowLevelUpConfirm(true)}
                    className="mt-3 w-full py-3 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-white font-elden font-bold rounded border-2 border-amber-500 shadow-lg shadow-amber-500/30 transition-all animate-pulse hover:animate-none"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <LightningIcon className="w-5 h-5" />
                      LEVEL UP
                      <LightningIcon className="w-5 h-5" />
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Right side - Stats */}
            <div className="space-y-4">
              <h4 className="text-lg font-elden font-bold text-[#d7ceb2] border-b border-[#c9a227]/20 pb-2">
                Attributes
              </h4>
              
              {stats.map((stat) => (
                <div 
                  key={stat.name}
                  className={`p-4 rounded-lg ${stat.bgColor} border ${stat.borderColor} transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={stat.color}>{stat.icon}</span>
                      <span className="font-elden font-bold text-[#d7ceb2]">{stat.name}</span>
                    </div>
                    <span className={`text-2xl font-elden font-bold ${stat.color}`}>
                      {stat.value.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-[#8b8b7a]">{stat.description}</p>
                  <div className="mt-2 h-1.5 bg-stone-900/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color.replace('text-', 'bg-').replace('-400', '-500')}`}
                      style={{ width: `${Math.min(100, stat.value * 10)}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Total stats summary */}
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-600/50">
                <div className="flex items-center justify-between">
                  <span className="font-elden text-purple-300">Total Power Rating</span>
                  <span className="text-3xl font-elden font-bold text-purple-400">{totalPower}</span>
                </div>
                <p className="text-xs text-purple-400/70 mt-1">
                  Combined strength of all attributes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Up Confirmation Modal */}
        {showLevelUpConfirm && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
            <div className="bg-gradient-to-br from-stone-800 to-stone-900 p-6 rounded-lg border-2 border-amber-500 shadow-xl animate-scale-in max-w-sm mx-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-900/50 flex items-center justify-center border-2 border-amber-500">
                  <LightningIcon className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-elden font-bold text-[#c9a227] mb-2">Level Up?</h3>
                <p className="text-[#8b8b7a] mb-4">
                  Advance to Level {user.level + 1}?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLevelUpConfirm(false)}
                    className="flex-1 py-2 bg-stone-700 hover:bg-stone-600 text-[#d7ceb2] rounded border border-stone-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLevelUp}
                    className="flex-1 py-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold rounded border border-amber-500 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
