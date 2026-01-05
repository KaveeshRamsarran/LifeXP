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
type QuestNodeType = 'start' | 'battle' | 'treasure' | 'rest' | 'boss' | 'mystery' | 'shop' | 'checkpoint';
type PlayerGender = 'male' | 'female';

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
  oneTime?: boolean; // For one-time quests that can't be repeated
}

interface QuestPath {
  from: number;
  to: number;
}

// Random challenge tasks for mystery quests
const mysteryChallengeTasks = [
  { title: "Cold Shower Challenge", description: "Take a cold shower for 2 minutes", category: "DISCIPLINE", difficulty: "HARD" },
  { title: "Gratitude List", description: "Write down 10 things you're grateful for", category: "INTELLIGENCE", difficulty: "EASY" },
  { title: "No Phone Hour", description: "Go 1 hour without checking your phone", category: "DISCIPLINE", difficulty: "MEDIUM" },
  { title: "Random Act of Kindness", description: "Do something nice for a stranger", category: "DISCIPLINE", difficulty: "EASY" },
  { title: "Plank Challenge", description: "Hold a plank for 2 minutes total", category: "STRENGTH", difficulty: "HARD" },
  { title: "Learn Something New", description: "Watch an educational video and take notes", category: "INTELLIGENCE", difficulty: "MEDIUM" },
  { title: "Declutter Challenge", description: "Throw away or donate 5 items you don't need", category: "DISCIPLINE", difficulty: "EASY" },
  { title: "Wall Sit", description: "Hold a wall sit for 90 seconds", category: "STRENGTH", difficulty: "MEDIUM" },
  { title: "Meditation Session", description: "Meditate for 15 minutes", category: "DISCIPLINE", difficulty: "MEDIUM" },
  { title: "Speed Clean", description: "Clean one room in under 15 minutes", category: "DISCIPLINE", difficulty: "EASY" },
  { title: "Push-up Challenge", description: "Do 30 push-ups (can break into sets)", category: "STRENGTH", difficulty: "HARD" },
  { title: "Budget Review", description: "Review your spending from last week", category: "WEALTH", difficulty: "MEDIUM" },
  { title: "Stretch Routine", description: "Complete a 20-minute stretching session", category: "STRENGTH", difficulty: "EASY" },
  { title: "Memory Challenge", description: "Memorize 10 new vocabulary words", category: "INTELLIGENCE", difficulty: "HARD" },
  { title: "Savings Challenge", description: "Transfer $5 to savings", category: "WEALTH", difficulty: "EASY" },
];

interface MysteryTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xpReward: number;
  isCompleted: boolean;
}

// Player sprite component - smaller and with gender option
function PlayerSprite({ x, y, isMoving, gender = 'male' }: { x: number; y: number; isMoving: boolean; gender?: PlayerGender }) {
  const isFemale = gender === 'female';
  
  return (
    <div 
      className="player-sprite absolute z-20 transition-all duration-700 ease-out"
      style={{ 
        left: x - 14, 
        top: y - 32,
        transform: 'scale(0.7)',
      }}
    >
      {/* Glow effect under player */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-gold/40 rounded-full blur-sm animate-pulse" />
      
      {/* Player body */}
      <div className={`relative ${isMoving ? 'animate-bounce' : 'animate-float'}`}>
        {/* Cape */}
        <div className={`absolute -right-1 top-3 w-3 h-6 bg-gradient-to-b ${isFemale ? 'from-pink-600 to-pink-800' : 'from-crimson to-crimson/60'} rounded-br-lg transform origin-top-left animate-cape`} />
        
        {/* Body */}
        <div className={`relative w-8 h-10 bg-gradient-to-b ${isFemale ? 'from-purple-600 to-purple-700' : 'from-azure to-azure-light'} rounded-t-lg rounded-b-md border-2 ${isFemale ? 'border-purple-400/50' : 'border-azure/50'}`}>
          {/* Belt */}
          <div className="absolute bottom-2.5 left-0 right-0 h-1 bg-gold" />
          {/* Buckle */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-gold-dark rounded-sm" />
        </div>
        
        {/* Head */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full border-2 border-amber-400/50">
          {/* Eyes */}
          <div className="absolute top-2 left-1 w-1 h-1.5 bg-slate-800 rounded-full" />
          <div className="absolute top-2 right-1 w-1 h-1.5 bg-slate-800 rounded-full" />
          {/* Smile */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-0.5 border-b border-slate-800 rounded-full" />
          
          {/* Hair for female */}
          {isFemale && (
            <>
              <div className="absolute -top-1 left-0 w-7 h-3 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-full" />
              <div className="absolute top-2 -left-1 w-2 h-5 bg-gradient-to-b from-amber-700 to-amber-800 rounded-b-full" />
              <div className="absolute top-2 -right-1 w-2 h-5 bg-gradient-to-b from-amber-700 to-amber-800 rounded-b-full" />
            </>
          )}
        </div>
        
        {/* Helmet (male) or Tiara (female) */}
        {isFemale ? (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-3 flex items-end justify-center">
            <div className="w-5 h-2 bg-gradient-to-t from-gold to-gold-light rounded-t-full border border-gold-light" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-pink-400 rounded-t-full" />
          </div>
        ) : (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-slate-400 to-slate-500 rounded-t-full border-2 border-slate-300">
            {/* Helmet plume */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-gradient-to-t from-crimson to-ember rounded-full" />
          </div>
        )}
        
        {/* Shield (left hand) */}
        <div className={`absolute top-2 -left-3 w-4 h-5 bg-gradient-to-br ${isFemale ? 'from-pink-400 to-pink-600' : 'from-gold to-gold-dark'} rounded-md border border-gold-light transform -rotate-12`}>
          <div className="absolute inset-0.5 border border-gold-light/50 rounded-sm" />
        </div>
        
        {/* Sword (right hand) - smaller for female, staff option */}
        <div className="absolute top-0 -right-4 transform rotate-45 origin-bottom-left">
          {isFemale ? (
            <>
              {/* Magic staff */}
              <div className="w-1 h-6 bg-gradient-to-t from-amber-800 to-amber-600 rounded-full" />
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50" />
            </>
          ) : (
            <>
              {/* Blade */}
              <div className="w-1 h-6 bg-gradient-to-t from-slate-300 to-white rounded-t-full" />
              {/* Guard */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-gold rounded-full" />
              {/* Handle */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-amber-800 rounded-b-sm" />
            </>
          )}
        </div>
      </div>
      
      {/* Player name tag */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[10px] font-bold text-gold bg-background/80 px-1.5 py-0.5 rounded-full border border-gold/30">
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

// Get node background color based on type - Elden Ring colors
function getNodeColor(type: QuestNodeType, completed: boolean, locked: boolean) {
  if (locked) return 'from-stone-700 to-stone-800 border-stone-600';
  if (completed) return 'from-emerald-900 to-emerald-950 border-emerald-700';
  
  switch (type) {
    case 'start':
      return 'from-amber-800 to-amber-900 border-amber-600';
    case 'battle':
      return 'from-red-900 to-red-950 border-red-700';
    case 'treasure':
      return 'from-yellow-700 to-yellow-800 border-yellow-600';
    case 'rest':
      return 'from-blue-900 to-blue-950 border-blue-700';
    case 'boss':
      return 'from-purple-900 to-purple-950 border-purple-700';
    case 'mystery':
      return 'from-violet-900 to-violet-950 border-violet-700';
    case 'shop':
      return 'from-orange-800 to-orange-900 border-orange-600';
    case 'checkpoint':
      return 'from-cyan-900 to-cyan-950 border-cyan-700';
    default:
      return 'from-stone-600 to-stone-700 border-stone-500';
  }
}

// Expanded quest map data - Much longer journey with mixed RPG references!
const questNodes: QuestNode[] = [
  // ACT 1: The Beginning (Tutorial Zone)
  { id: 0, type: 'start', x: 50, y: 350, completed: true, locked: false, reward: 0, title: 'The Awakening', description: 'Your journey begins here, Adventurer', oneTime: true },
  { id: 1, type: 'battle', x: 120, y: 300, completed: true, locked: false, reward: 15, title: 'First Blood', description: 'Complete 3 daily tasks', oneTime: true },
  { id: 2, type: 'treasure', x: 180, y: 250, completed: true, locked: false, reward: 25, title: 'Treasure Chest', description: 'Maintain a 3-day streak', oneTime: true },
  { id: 3, type: 'rest', x: 250, y: 220, completed: false, locked: false, reward: 10, title: 'Inn Rest', description: 'Take a moment to reflect' },
  { id: 4, type: 'mystery', x: 200, y: 320, completed: false, locked: false, reward: 30, title: 'Strange Portal', description: 'Accept a random challenge' },
  { id: 5, type: 'battle', x: 320, y: 260, completed: false, locked: false, reward: 20, title: 'Goblin Camp', description: 'Complete 5 tasks in one day', oneTime: true },
  
  // ACT 2: Castle Siege (Zelda/Dark Souls vibes)
  { id: 6, type: 'checkpoint', x: 390, y: 200, completed: false, locked: true, reward: 50, title: 'Castle Gates', description: 'Reach Level 3', oneTime: true },
  { id: 7, type: 'shop', x: 350, y: 320, completed: false, locked: true, reward: 15, title: 'Traveling Merchant', description: 'Unlock new abilities' },
  { id: 8, type: 'battle', x: 450, y: 160, completed: false, locked: true, reward: 25, title: 'Dark Knight', description: 'Complete 3 hard tasks', oneTime: true },
  { id: 9, type: 'mystery', x: 420, y: 280, completed: false, locked: true, reward: 35, title: 'Secret Passage', description: 'Discover a secret challenge' },
  { id: 10, type: 'treasure', x: 500, y: 220, completed: false, locked: true, reward: 40, title: 'Royal Treasury', description: 'Earn 200 total XP', oneTime: true },
  { id: 11, type: 'boss', x: 580, y: 180, completed: false, locked: true, reward: 100, title: 'The Warden', description: 'Complete weekly quest', oneTime: true },
  
  // ACT 3: Mage Academy (Final Fantasy/Skyrim vibes)
  { id: 12, type: 'rest', x: 650, y: 220, completed: false, locked: true, reward: 20, title: 'Crystal Sanctuary', description: 'Maintain a 7-day streak' },
  { id: 13, type: 'battle', x: 700, y: 280, completed: false, locked: true, reward: 30, title: 'Arcane Trial', description: 'Learn something new', oneTime: true },
  { id: 14, type: 'mystery', x: 620, y: 320, completed: false, locked: true, reward: 40, title: 'Ethereal Realm', description: 'Secret questline awaits' },
  { id: 15, type: 'treasure', x: 760, y: 240, completed: false, locked: true, reward: 50, title: 'Legendary Tome', description: 'Accumulate 500 XP', oneTime: true },
  { id: 16, type: 'shop', x: 720, y: 350, completed: false, locked: true, reward: 25, title: 'Mystic Enchanter', description: 'Upgrade your skills' },
  { id: 17, type: 'boss', x: 830, y: 200, completed: false, locked: true, reward: 150, title: 'Archmage', description: 'Reach Level 7', oneTime: true },
  
  // ACT 4: Dragon Lands (Monster Hunter/Skyrim vibes)
  { id: 18, type: 'checkpoint', x: 880, y: 280, completed: false, locked: true, reward: 75, title: 'Dragon Gate', description: 'Prove your worth', oneTime: true },
  { id: 19, type: 'battle', x: 920, y: 180, completed: false, locked: true, reward: 40, title: 'Wyvern Nest', description: 'Complete 10 hard tasks', oneTime: true },
  { id: 20, type: 'mystery', x: 960, y: 320, completed: false, locked: true, reward: 50, title: 'Cursed Shrine', description: 'Face your fears' },
  { id: 21, type: 'treasure', x: 1000, y: 240, completed: false, locked: true, reward: 60, title: 'Dragon Hoard', description: 'Earn 1000 XP', oneTime: true },
  { id: 22, type: 'boss', x: 1080, y: 200, completed: false, locked: true, reward: 200, title: 'Elder Dragon', description: 'Complete the month challenge', oneTime: true },
  
  // ACT 5: Final Summit (Epic conclusion)
  { id: 23, type: 'rest', x: 1150, y: 280, completed: false, locked: true, reward: 30, title: 'Summit Bonfire', description: '30-day streak required' },
  { id: 24, type: 'battle', x: 1200, y: 180, completed: false, locked: true, reward: 50, title: 'Titan Guardian', description: 'Complete 50 total tasks', oneTime: true },
  { id: 25, type: 'mystery', x: 1250, y: 320, completed: false, locked: true, reward: 75, title: 'Realm Rift', description: 'Ultimate random challenge' },
  { id: 26, type: 'treasure', x: 1300, y: 240, completed: false, locked: true, reward: 100, title: 'Infinity Stone', description: 'Master all stat categories', oneTime: true },
  { id: 27, type: 'boss', x: 1400, y: 200, completed: false, locked: true, reward: 500, title: 'Final Boss', description: 'Become the ultimate hero', oneTime: true },
];

const questPaths: QuestPath[] = [
  // Act 1 paths
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 7 },
  { from: 5, to: 6 },
  // Act 2 paths
  { from: 6, to: 8 },
  { from: 7, to: 9 },
  { from: 8, to: 10 },
  { from: 9, to: 10 },
  { from: 10, to: 11 },
  // Act 3 paths
  { from: 11, to: 12 },
  { from: 12, to: 13 },
  { from: 12, to: 14 },
  { from: 13, to: 15 },
  { from: 14, to: 16 },
  { from: 15, to: 17 },
  { from: 16, to: 17 },
  // Act 4 paths
  { from: 17, to: 18 },
  { from: 18, to: 19 },
  { from: 18, to: 20 },
  { from: 19, to: 21 },
  { from: 20, to: 21 },
  { from: 21, to: 22 },
  // Act 5 paths
  { from: 22, to: 23 },
  { from: 23, to: 24 },
  { from: 23, to: 25 },
  { from: 24, to: 26 },
  { from: 25, to: 26 },
  { from: 26, to: 27 },
];

interface QuestMapProps {
  currentNodeId?: number;
  completedNodeIds?: number[];
  playerGender?: PlayerGender;
  onNodeClick?: (node: QuestNode) => void;
  onMysteryTask?: (task: MysteryTask) => void;
  onCompleteNode?: (nodeId: number, reward: number) => void;
  onPlayerMove?: (nodeId: number) => void;
  onGenderChange?: (gender: PlayerGender) => void;
}

export default function QuestMap({ 
  currentNodeId = 0, 
  completedNodeIds = [],
  playerGender = 'male',
  onNodeClick, 
  onMysteryTask,
  onCompleteNode,
  onPlayerMove,
  onGenderChange,
}: QuestMapProps) {
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 350 });
  const [isMoving, setIsMoving] = useState(false);
  const [selectedNode, setSelectedNode] = useState<QuestNode | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [completedQuestIds, setCompletedQuestIds] = useState<Set<number>>(() => {
    // Load from localStorage to persist one-time quest completions
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('completedQuestIds');
      return saved ? new Set(JSON.parse(saved)) : new Set([0]);
    }
    return new Set([0]);
  });
  const [mysteryTasks, setMysteryTasks] = useState<MysteryTask[]>([]);
  const [showMysteryModal, setShowMysteryModal] = useState(false);
  const [currentMysteryTask, setCurrentMysteryTask] = useState<MysteryTask | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  // Merge local completed IDs with passed-in completedNodeIds
  const allCompletedIds = new Set([...completedQuestIds, ...completedNodeIds]);

  // Save completed quests to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedQuestIds', JSON.stringify([...completedQuestIds]));
    }
  }, [completedQuestIds]);

  // Check if a quest is completed (including one-time tracking)
  const isQuestCompleted = useCallback((node: QuestNode) => {
    return node.completed || allCompletedIds.has(node.id);
  }, [allCompletedIds]);

  // Determine which nodes are unlocked based on completed nodes
  const isNodeUnlocked = useCallback((nodeId: number) => {
    if (nodeId === 0) return true; // Start is always unlocked
    
    // Find paths that lead to this node
    const incomingPaths = questPaths.filter(p => p.to === nodeId);
    
    // Node is unlocked if any of its predecessor nodes are completed
    return incomingPaths.some(path => allCompletedIds.has(path.from));
  }, [allCompletedIds]);

  // Find the furthest completed node for player position
  const getFurthestCompletedNode = useCallback(() => {
    let furthest = 0;
    for (const nodeId of allCompletedIds) {
      if (nodeId > furthest) {
        furthest = nodeId;
      }
    }
    return furthest;
  }, [allCompletedIds]);

  // Update player position when current node changes or on mount
  useEffect(() => {
    const targetNodeId = currentNodeId || getFurthestCompletedNode();
    const node = questNodes.find(n => n.id === targetNodeId);
    if (node) {
      setIsMoving(true);
      setTimeout(() => {
        setPlayerPosition({ x: node.x, y: node.y });
        // Auto-scroll to player position
        const newScroll = Math.max(0, Math.min(1000, node.x - 300));
        setScrollPosition(newScroll);
        setTimeout(() => setIsMoving(false), 700);
      }, 100);
    }
  }, [currentNodeId, getFurthestCompletedNode]);

  // Generate a random mystery task
  const generateMysteryTask = useCallback(() => {
    const randomChallenge = mysteryChallengeTasks[Math.floor(Math.random() * mysteryChallengeTasks.length)];
    const difficultyXp = { EASY: 15, MEDIUM: 25, HARD: 40 };
    const newTask: MysteryTask = {
      id: `mystery-${Date.now()}`,
      title: randomChallenge.title,
      description: randomChallenge.description,
      category: randomChallenge.category,
      difficulty: randomChallenge.difficulty,
      xpReward: difficultyXp[randomChallenge.difficulty as keyof typeof difficultyXp] || 20,
      isCompleted: false,
    };
    return newTask;
  }, []);

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
    // Check if node is unlocked
    if (!isNodeUnlocked(node.id)) return;
    
    // Check if this is a one-time quest that's already completed
    if (node.oneTime && allCompletedIds.has(node.id)) {
      setSelectedNode({ ...node, completed: true });
      return;
    }
    
    setSelectedNode(node);
    createParticles(node.x, node.y, isQuestCompleted(node) ? '#2d5a27' : '#c9a227');
    
    if (!isQuestCompleted(node) && onNodeClick) {
      onNodeClick(node);
    }
  };

  // Handle starting a mystery quest
  const handleStartMystery = () => {
    if (!selectedNode || selectedNode.type !== 'mystery') return;
    
    const newTask = generateMysteryTask();
    setCurrentMysteryTask(newTask);
    setShowMysteryModal(true);
    setMysteryTasks(prev => [...prev, newTask]);
    
    // Notify parent component
    if (onMysteryTask) {
      onMysteryTask(newTask);
    }
  };

  // Handle completing a quest node and moving player
  const handleCompleteQuestNode = (nodeId: number) => {
    const node = questNodes.find(n => n.id === nodeId);
    if (!node || allCompletedIds.has(nodeId)) return;
    
    // Mark as completed
    setCompletedQuestIds(prev => new Set([...prev, nodeId]));
    
    // Show reward animation
    setRewardAmount(node.reward);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);
    
    // Create celebration particles
    createParticles(node.x, node.y, '#c9a227');
    createParticles(node.x, node.y, '#2d5a27');
    
    // Move player to the completed node
    setIsMoving(true);
    setPlayerPosition({ x: node.x, y: node.y });
    setTimeout(() => setIsMoving(false), 700);
    
    // Notify parent
    if (onCompleteNode) {
      onCompleteNode(nodeId, node.reward);
    }
    if (onPlayerMove) {
      onPlayerMove(nodeId);
    }
    
    // Close the selection panel
    setSelectedNode(null);
  };

  // Handle completing a quest (one-time prevention) - legacy
  const handleCompleteQuest = (nodeId: number) => {
    const node = questNodes.find(n => n.id === nodeId);
    if (node?.oneTime) {
      setCompletedQuestIds(prev => new Set([...prev, nodeId]));
    }
  };

  return (
    <div className="quest-map-container relative">
      {/* Reward popup */}
      {showReward && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-br from-amber-900 to-amber-950 border-2 border-amber-500 rounded-lg p-6 text-center shadow-2xl">
            <StarIcon className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-spin" />
            <div className="text-3xl font-elden font-bold text-amber-300">+{rewardAmount} XP</div>
            <div className="text-sm text-amber-200/70 mt-1">Quest Complete!</div>
          </div>
        </div>
      )}

      {/* Map header */}
      <div className="flex items-center justify-between mb-4" id="map">
        <h2 className="text-xl font-elden font-bold text-[#c9a227] flex items-center gap-2">
          <ScrollIcon className="w-6 h-6" />
          World Map
        </h2>
        <div className="flex items-center gap-4 text-sm">
          {/* Gender picker */}
          <div className="relative">
            <button
              onClick={() => setShowGenderPicker(!showGenderPicker)}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-[#d7ceb2] text-sm rounded transition-colors flex items-center gap-2"
            >
              {playerGender === 'female' ? '👩' : '🧑'} Character
            </button>
            {showGenderPicker && (
              <div className="absolute top-full mt-1 right-0 bg-stone-900 border border-stone-600 rounded-lg p-2 z-30 shadow-xl">
                <button
                  onClick={() => {
                    onGenderChange?.('male');
                    setShowGenderPicker(false);
                  }}
                  className={`w-full px-4 py-2 text-left rounded flex items-center gap-2 ${playerGender === 'male' ? 'bg-amber-900/50 text-amber-300' : 'hover:bg-stone-800 text-[#d7ceb2]'}`}
                >
                  🧑 Knight (Male)
                </button>
                <button
                  onClick={() => {
                    onGenderChange?.('female');
                    setShowGenderPicker(false);
                  }}
                  className={`w-full px-4 py-2 text-left rounded flex items-center gap-2 ${playerGender === 'female' ? 'bg-purple-900/50 text-purple-300' : 'hover:bg-stone-800 text-[#d7ceb2]'}`}
                >
                  👩 Mage (Female)
                </button>
              </div>
            )}
          </div>
          <span className="text-[#8b8b7a]">Progress:</span>
          <span className="text-[#2d5a27] font-bold">
            {allCompletedIds.size}/{questNodes.length}
          </span>
        </div>
      </div>

      {/* Scroll controls */}
      <div className="flex gap-2 mb-2">
        <button 
          className="px-3 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-[#d7ceb2] text-sm rounded transition-colors"
          onClick={() => setScrollPosition(Math.max(0, scrollPosition - 300))}
          disabled={scrollPosition <= 0}
        >
          ← West
        </button>
        <button 
          className="px-3 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-[#d7ceb2] text-sm rounded transition-colors"
          onClick={() => setScrollPosition(Math.min(1000, scrollPosition + 300))}
          disabled={scrollPosition >= 1000}
        >
          East →
        </button>
        <span className="text-xs text-[#8b8b7a] ml-auto self-center">Drag or use arrows to explore</span>
      </div>

      {/* Map container with horizontal scroll */}
      <div 
        className="relative w-full h-[450px] bg-gradient-to-br from-stone-900/95 to-stone-950/95 rounded border border-[#c9a227]/20 overflow-hidden"
        style={{ cursor: 'grab' }}
      >
        {/* Scrollable inner container */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ 
            width: '1500px',
            transform: `translateX(-${scrollPosition}px)`,
          }}
        >
          {/* Elden Ring style fog background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-40 w-32 h-32 rounded-full bg-amber-900/20 blur-3xl" />
            <div className="absolute top-60 right-60 w-48 h-48 rounded-full bg-purple-900/20 blur-3xl" />
            <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full bg-red-900/15 blur-3xl" />
            <div className="absolute top-20 right-1/4 w-36 h-36 rounded-full bg-emerald-900/15 blur-3xl" />
          </div>

          {/* Grid pattern - weathered stone */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#c9a227" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

        {/* Paths between nodes - Elden Ring golden paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c9a227" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b7119" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="graceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f4e4a6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#c9a227" stopOpacity="0.6" />
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
            
            const isCompleted = allCompletedIds.has(fromNode.id) && allCompletedIds.has(toNode.id);
            const isActive = allCompletedIds.has(fromNode.id) && !allCompletedIds.has(toNode.id) && isNodeUnlocked(toNode.id);
            const isLocked = !isNodeUnlocked(toNode.id);
            
            return (
              <g key={index}>
                {/* Path shadow */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Main path */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isCompleted ? '#2d5a27' : isActive ? 'url(#graceGradient)' : '#3d3d3d'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={isLocked ? '6 6' : 'none'}
                  filter={isActive ? 'url(#glow)' : 'none'}
                  className={isActive ? 'animate-pulse' : ''}
                />
              </g>
            );
          })}
        </svg>

        {/* Quest nodes */}
        {questNodes.map((node) => {
          const completed = allCompletedIds.has(node.id);
          const unlocked = isNodeUnlocked(node.id);
          const isLocked = !unlocked;
          
          return (
          <button
            key={node.id}
            className={`
              absolute z-10 transform -translate-x-1/2 -translate-y-1/2
              w-11 h-11 rounded-sm
              bg-gradient-to-br ${getNodeColor(node.type, completed, isLocked)}
              border-2 shadow-lg
              flex items-center justify-center
              transition-all duration-300
              ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110 hover:shadow-xl'}
              ${selectedNode?.id === node.id ? 'ring-2 ring-[#f4e4a6] ring-offset-2 ring-offset-stone-900 scale-110' : ''}
              ${!isLocked && !completed ? 'animate-pulse-subtle' : ''}
            `}
            style={{ left: node.x, top: node.y }}
            onClick={() => handleNodeClick(node)}
            disabled={isLocked}
          >
            <NodeIcon type={node.type} completed={completed} />
            
            {/* Completion checkmark - Grace marker style */}
            {completed && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-800 rounded-sm flex items-center justify-center border border-emerald-600">
                <svg className="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {/* One-time badge */}
            {node.oneTime && !completed && !isLocked && (
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-700 rounded-sm flex items-center justify-center border border-amber-500 text-[8px] font-bold text-amber-200">
                1
              </div>
            )}
            
            {/* Lock icon */}
            {isLocked && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-stone-700 rounded-sm flex items-center justify-center border border-stone-500">
                <svg className="w-3 h-3 text-stone-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {/* Reward badge - XP style */}
            {!isLocked && node.reward > 0 && !completed && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-stone-800 text-[#c9a227] text-[9px] font-bold rounded-sm border border-[#c9a227]/40 whitespace-nowrap">
                +{node.reward}
              </div>
            )}
          </button>
          );
        })}

        {/* Player sprite */}
        <PlayerSprite x={playerPosition.x} y={playerPosition.y} isMoving={isMoving} gender={playerGender} />

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

        {/* Map legend - RPG style */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[9px]">
          {[
            { type: 'battle', label: 'Battle', color: 'bg-red-800' },
            { type: 'treasure', label: 'Treasure', color: 'bg-yellow-700' },
            { type: 'rest', label: 'Rest', color: 'bg-blue-800' },
            { type: 'boss', label: 'Boss', color: 'bg-purple-800' },
            { type: 'mystery', label: 'Mystery', color: 'bg-violet-800' },
            { type: 'checkpoint', label: 'Checkpoint', color: 'bg-cyan-800' },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-1 px-1.5 py-0.5 bg-stone-900/90 rounded-sm border border-stone-700">
              <div className={`w-2 h-2 rounded-sm ${item.color}`} />
              <span className="text-[#8b8b7a]">{item.label}</span>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Selected node info - RPG style panel */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-gradient-to-br from-stone-900/95 to-stone-950/95 border border-[#c9a227]/20 rounded animate-scale-in">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded bg-gradient-to-br ${getNodeColor(selectedNode.type, allCompletedIds.has(selectedNode.id), !isNodeUnlocked(selectedNode.id))}`}>
              <NodeIcon type={selectedNode.type} completed={allCompletedIds.has(selectedNode.id)} />
            </div>
            <div className="flex-1">
              <h3 className="font-elden font-bold text-[#c9a227] text-lg">{selectedNode.title}</h3>
              <p className="text-sm text-[#8b8b7a] mt-1">{selectedNode.description}</p>
              {selectedNode.oneTime && !allCompletedIds.has(selectedNode.id) && (
                <span className="inline-flex items-center gap-1 mt-2 text-xs text-amber-500 bg-amber-900/30 px-2 py-0.5 rounded-sm">
                  ⚠ One-time quest - Cannot be repeated
                </span>
              )}
              {allCompletedIds.has(selectedNode.id) ? (
                <span className="inline-flex items-center gap-1 mt-2 text-sm text-emerald-500">
                  <TrophyIcon className="w-4 h-4" /> Completed
                </span>
              ) : isNodeUnlocked(selectedNode.id) && (
                <div className="mt-3 flex gap-2">
                  {selectedNode.type === 'mystery' ? (
                    <button 
                      className="px-4 py-2 bg-gradient-to-r from-violet-900 to-violet-800 hover:from-violet-800 hover:to-violet-700 text-violet-200 font-elden text-sm rounded-sm border border-violet-600 transition-all flex items-center gap-2"
                      onClick={handleStartMystery}
                    >
                      <SparklesIcon className="w-4 h-4" />
                      Accept Random Challenge
                    </button>
                  ) : (
                    <button 
                      className="px-4 py-2 bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-emerald-200 font-elden text-sm rounded-sm border border-emerald-600 transition-all flex items-center gap-2"
                      onClick={() => handleCompleteQuestNode(selectedNode.id)}
                    >
                      <TrophyIcon className="w-4 h-4" />
                      Complete Quest (+{selectedNode.reward} XP)
                    </button>
                  )}
                </div>
              )}
            </div>
            {selectedNode.reward > 0 && !allCompletedIds.has(selectedNode.id) && (
              <div className="text-right">
                <div className="text-xs text-[#8b8b7a]">XP Reward</div>
                <div className="text-xl font-elden font-bold text-[#c9a227] flex items-center gap-1">
                  <StarIcon className="w-5 h-5" />
                  {selectedNode.reward}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mystery Task Modal */}
      {showMysteryModal && currentMysteryTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowMysteryModal(false)}>
          <div 
            className="bg-gradient-to-br from-stone-900 to-stone-950 border-2 border-violet-600 rounded p-6 max-w-md w-full animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-violet-900/50 rounded-sm border border-violet-600">
                <SparklesIcon className="w-8 h-8 text-violet-400" />
              </div>
              <div>
                <h3 className="font-elden text-xl text-violet-300">Mystery Challenge!</h3>
                <p className="text-sm text-[#8b8b7a]">A random trial has been bestowed upon you</p>
              </div>
            </div>
            
            <div className="bg-stone-800/50 rounded-sm p-4 mb-4 border border-stone-600">
              <h4 className="font-elden text-lg text-[#c9a227] mb-2">{currentMysteryTask.title}</h4>
              <p className="text-[#d7ceb2] text-sm mb-3">{currentMysteryTask.description}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2 py-1 bg-stone-700 rounded-sm text-[#8b8b7a]">
                  {currentMysteryTask.category}
                </span>
                <span className={`px-2 py-1 rounded-sm ${
                  currentMysteryTask.difficulty === 'HARD' ? 'bg-red-900/50 text-red-300' :
                  currentMysteryTask.difficulty === 'MEDIUM' ? 'bg-amber-900/50 text-amber-300' :
                  'bg-emerald-900/50 text-emerald-300'
                }`}>
                  {currentMysteryTask.difficulty}
                </span>
                <span className="ml-auto text-[#c9a227] font-bold">
                  +{currentMysteryTask.xpReward} XP
                </span>
              </div>
            </div>
            
            <p className="text-xs text-[#8b8b7a] mb-4 italic">
              This challenge has been added to your quest log. Complete it to earn XP!
            </p>
            
            <button 
              className="w-full py-3 bg-gradient-to-r from-violet-800 to-violet-700 hover:from-violet-700 hover:to-violet-600 text-violet-100 font-elden rounded-sm border border-violet-500 transition-all"
              onClick={() => setShowMysteryModal(false)}
            >
              Accept Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
