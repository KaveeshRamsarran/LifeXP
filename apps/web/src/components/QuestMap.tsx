'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  StarIcon, 
  CrownIcon, 
  TrophyIcon, 
  FlameIcon,
  LightningIcon,
  SparklesIcon,
  SwordIcon,
  ShieldIcon,
  ScrollIcon,
  CoinIcon,
  DragonIcon
} from './icons/GameIcons';

// Quest node types
type QuestNodeType = 'start' | 'battle' | 'treasure' | 'rest' | 'boss' | 'mystery' | 'shop';

interface QuestNode {
  id: number;
  type: QuestNodeType;
  x: number;
  y: number;
  completed: boolean;
  locked: boolean;
  reward: number;
  title: string;
  description: string;
}

interface QuestPath {
  from: number;
  to: number;
}

// Player sprite component
function PlayerSprite({ x, y, isMoving }: { x: number; y: number; isMoving: boolean }) {
  return (
    <div 
      className="player-sprite absolute z-20 transition-all duration-700 ease-out"
      style={{ 
        left: x - 20, 
        top: y - 45,
      }}
    >
      {/* Glow effect under player */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-gold/40 rounded-full blur-sm animate-pulse" />
      
      {/* Player body */}
      <div className={`relative ${isMoving ? 'animate-bounce' : 'animate-float'}`}>
        {/* Cape */}
        <div className="absolute -right-1 top-4 w-4 h-8 bg-gradient-to-b from-crimson to-crimson/60 rounded-br-lg transform origin-top-left animate-cape" />
        
        {/* Body */}
        <div className="relative w-10 h-12 bg-gradient-to-b from-azure to-azure-light rounded-t-lg rounded-b-md border-2 border-azure/50">
          {/* Belt */}
          <div className="absolute bottom-3 left-0 right-0 h-1.5 bg-gold" />
          {/* Buckle */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-2 h-2.5 bg-gold-dark rounded-sm" />
        </div>
        
        {/* Head */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full border-2 border-amber-400/50">
          {/* Eyes */}
          <div className="absolute top-2.5 left-1.5 w-1.5 h-2 bg-slate-800 rounded-full" />
          <div className="absolute top-2.5 right-1.5 w-1.5 h-2 bg-slate-800 rounded-full" />
          {/* Smile */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-1 border-b-2 border-slate-800 rounded-full" />
        </div>
        
        {/* Helmet */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-5 bg-gradient-to-b from-slate-400 to-slate-500 rounded-t-full border-2 border-slate-300">
          {/* Helmet plume */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-5 bg-gradient-to-t from-crimson to-ember rounded-full" />
        </div>
        
        {/* Shield (left hand) */}
        <div className="absolute top-3 -left-4 w-5 h-6 bg-gradient-to-br from-gold to-gold-dark rounded-md border border-gold-light transform -rotate-12">
          <div className="absolute inset-1 border border-gold-light/50 rounded-sm" />
        </div>
        
        {/* Sword (right hand) */}
        <div className="absolute top-1 -right-5 transform rotate-45 origin-bottom-left">
          {/* Blade */}
          <div className="w-1.5 h-8 bg-gradient-to-t from-slate-300 to-white rounded-t-full" />
          {/* Guard */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-gold rounded-full" />
          {/* Handle */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-amber-800 rounded-b-sm" />
        </div>
      </div>
      
      {/* Player name tag */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-bold text-gold bg-background/80 px-2 py-0.5 rounded-full border border-gold/30">
          You
        </span>
      </div>
    </div>
  );
}

// Node icon based on type
function NodeIcon({ type, completed }: { type: QuestNodeType; completed: boolean }) {
  const iconClass = `w-6 h-6 ${completed ? 'text-jade' : 'text-white'}`;
  
  switch (type) {
    case 'start':
      return <FlameIcon className={iconClass} />;
    case 'battle':
      return <SwordIcon className={iconClass} />;
    case 'treasure':
      return <CoinIcon className={iconClass} />;
    case 'rest':
      return <ShieldIcon className={iconClass} />;
    case 'boss':
      return <DragonIcon className={iconClass} />;
    case 'mystery':
      return <ScrollIcon className={iconClass} />;
    case 'shop':
      return <CrownIcon className={iconClass} />;
    default:
      return <StarIcon className={iconClass} />;
  }
}

// Get node background color based on type
function getNodeColor(type: QuestNodeType, completed: boolean, locked: boolean) {
  if (locked) return 'from-slate-600 to-slate-700 border-slate-500';
  if (completed) return 'from-jade to-jade-light border-jade';
  
  switch (type) {
    case 'start':
      return 'from-ember to-ember-light border-ember';
    case 'battle':
      return 'from-crimson to-red-500 border-crimson';
    case 'treasure':
      return 'from-gold to-gold-light border-gold';
    case 'rest':
      return 'from-azure to-azure-light border-azure';
    case 'boss':
      return 'from-mystic to-mystic-light border-mystic';
    case 'mystery':
      return 'from-violet-600 to-violet-400 border-violet-500';
    case 'shop':
      return 'from-amber-600 to-amber-400 border-amber-500';
    default:
      return 'from-slate-600 to-slate-500 border-slate-400';
  }
}

// Quest map data
const questNodes: QuestNode[] = [
  { id: 0, type: 'start', x: 80, y: 300, completed: true, locked: false, reward: 0, title: 'The Beginning', description: 'Your adventure starts here' },
  { id: 1, type: 'battle', x: 180, y: 250, completed: true, locked: false, reward: 15, title: 'First Challenge', description: 'Complete 3 daily tasks' },
  { id: 2, type: 'treasure', x: 280, y: 200, completed: true, locked: false, reward: 25, title: 'Hidden Treasure', description: 'Maintain a 3-day streak' },
  { id: 3, type: 'rest', x: 380, y: 250, completed: false, locked: false, reward: 10, title: 'Rest Stop', description: 'Take a break and reflect' },
  { id: 4, type: 'mystery', x: 320, y: 350, completed: false, locked: false, reward: 30, title: 'Mystery Quest', description: 'Complete a random challenge' },
  { id: 5, type: 'battle', x: 480, y: 200, completed: false, locked: true, reward: 20, title: 'Dragon\'s Test', description: 'Complete 5 hard tasks' },
  { id: 6, type: 'shop', x: 450, y: 320, completed: false, locked: true, reward: 15, title: 'Merchant\'s Rest', description: 'Unlock new abilities' },
  { id: 7, type: 'treasure', x: 580, y: 280, completed: false, locked: true, reward: 40, title: 'Golden Chest', description: 'Earn 100 total XP' },
  { id: 8, type: 'boss', x: 680, y: 200, completed: false, locked: true, reward: 100, title: 'The Grand Challenge', description: 'Complete the weekly quest' },
];

const questPaths: QuestPath[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 6 },
  { from: 5, to: 7 },
  { from: 6, to: 7 },
  { from: 7, to: 8 },
];

interface QuestMapProps {
  currentNodeId?: number;
  onNodeClick?: (node: QuestNode) => void;
}

export default function QuestMap({ currentNodeId = 3, onNodeClick }: QuestMapProps) {
  const [playerPosition, setPlayerPosition] = useState({ x: 380, y: 250 });
  const [isMoving, setIsMoving] = useState(false);
  const [selectedNode, setSelectedNode] = useState<QuestNode | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  // Update player position when current node changes
  useEffect(() => {
    const node = questNodes.find(n => n.id === currentNodeId);
    if (node) {
      setIsMoving(true);
      setTimeout(() => {
        setPlayerPosition({ x: node.x, y: node.y });
        setTimeout(() => setIsMoving(false), 700);
      }, 100);
    }
  }, [currentNodeId]);

  // Create particles effect
  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      color,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  }, []);

  const handleNodeClick = (node: QuestNode) => {
    if (node.locked) return;
    
    setSelectedNode(node);
    createParticles(node.x, node.y, node.completed ? '#00d98b' : '#ffd700');
    
    if (!node.completed && onNodeClick) {
      onNodeClick(node);
    }
  };

  return (
    <div className="quest-map-container relative">
      {/* Map header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-cinzel font-bold text-gold flex items-center gap-2">
          <ScrollIcon className="w-6 h-6" />
          Quest Journey
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted">Progress:</span>
          <span className="text-jade font-bold">
            {questNodes.filter(n => n.completed).length}/{questNodes.length}
          </span>
        </div>
      </div>

      {/* Map container */}
      <div className="relative w-full h-[400px] bg-gradient-to-br from-surface/80 to-background rounded-2xl border border-gold/20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-16 h-16 rounded-full bg-jade/30 blur-xl" />
          <div className="absolute top-40 right-40 w-24 h-24 rounded-full bg-mystic/30 blur-xl" />
          <div className="absolute bottom-20 left-1/3 w-20 h-20 rounded-full bg-ember/30 blur-xl" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Paths between nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {questPaths.map((path, index) => {
            const fromNode = questNodes.find(n => n.id === path.from);
            const toNode = questNodes.find(n => n.id === path.to);
            if (!fromNode || !toNode) return null;
            
            const isCompleted = fromNode.completed && toNode.completed;
            const isActive = fromNode.completed && !toNode.completed && !toNode.locked;
            
            return (
              <g key={index}>
                {/* Path shadow */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Main path */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isCompleted ? '#00d98b' : isActive ? 'url(#pathGradient)' : '#4a5568'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={toNode.locked ? '8 8' : 'none'}
                  filter={isActive ? 'url(#glow)' : 'none'}
                  className={isActive ? 'animate-pulse' : ''}
                />
              </g>
            );
          })}
        </svg>

        {/* Quest nodes */}
        {questNodes.map((node) => (
          <button
            key={node.id}
            className={`
              absolute z-10 transform -translate-x-1/2 -translate-y-1/2
              w-12 h-12 rounded-full 
              bg-gradient-to-br ${getNodeColor(node.type, node.completed, node.locked)}
              border-2 shadow-lg
              flex items-center justify-center
              transition-all duration-300
              ${node.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 hover:shadow-xl'}
              ${selectedNode?.id === node.id ? 'ring-2 ring-gold ring-offset-2 ring-offset-background scale-110' : ''}
              ${!node.locked && !node.completed ? 'animate-pulse-subtle' : ''}
            `}
            style={{ left: node.x, top: node.y }}
            onClick={() => handleNodeClick(node)}
            disabled={node.locked}
          >
            <NodeIcon type={node.type} completed={node.completed} />
            
            {/* Completion checkmark */}
            {node.completed && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-jade rounded-full flex items-center justify-center border-2 border-background">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {/* Lock icon */}
            {node.locked && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center border-2 border-background">
                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {/* Reward badge */}
            {!node.locked && node.reward > 0 && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-gold text-background text-[10px] font-bold rounded-full whitespace-nowrap">
                +{node.reward} XP
              </div>
            )}
          </button>
        ))}

        {/* Player sprite */}
        <PlayerSprite x={playerPosition.x} y={playerPosition.y} isMoving={isMoving} />

        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-particle pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              boxShadow: `0 0 6px ${particle.color}`,
            }}
          />
        ))}

        {/* Map legend */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[10px]">
          {[
            { type: 'battle', label: 'Battle', color: 'bg-crimson' },
            { type: 'treasure', label: 'Treasure', color: 'bg-gold' },
            { type: 'rest', label: 'Rest', color: 'bg-azure' },
            { type: 'boss', label: 'Boss', color: 'bg-mystic' },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-1 px-1.5 py-0.5 bg-background/80 rounded">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected node info */}
      {selectedNode && (
        <div className="mt-4 p-4 fantasy-card animate-scale-in">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getNodeColor(selectedNode.type, selectedNode.completed, selectedNode.locked)}`}>
              <NodeIcon type={selectedNode.type} completed={selectedNode.completed} />
            </div>
            <div className="flex-1">
              <h3 className="font-cinzel font-bold text-gold">{selectedNode.title}</h3>
              <p className="text-sm text-muted mt-1">{selectedNode.description}</p>
              {selectedNode.completed ? (
                <span className="inline-flex items-center gap-1 mt-2 text-sm text-jade">
                  <TrophyIcon className="w-4 h-4" /> Completed!
                </span>
              ) : !selectedNode.locked && (
                <button className="fantasy-btn mt-3 text-sm">
                  <LightningIcon className="w-4 h-4" />
                  Start Quest
                </button>
              )}
            </div>
            {selectedNode.reward > 0 && (
              <div className="text-right">
                <div className="text-xs text-muted">Reward</div>
                <div className="text-lg font-bold text-gold flex items-center gap-1">
                  <StarIcon className="w-5 h-5" />
                  {selectedNode.reward} XP
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
