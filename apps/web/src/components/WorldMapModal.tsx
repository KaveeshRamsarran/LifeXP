'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TargetIcon } from './icons/GameIcons';

// Dynamically import QuestMap to avoid SSR issues
const QuestMap = dynamic(() => import('./QuestMap'), { ssr: false });

interface MysteryTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xpReward: number;
  isCompleted: boolean;
}

interface WorldMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNodeId: number;
  completedNodeIds: number[];
  onMysteryTask: (task: MysteryTask) => void;
  onCompleteNode: (nodeId: number, reward: number) => void;
  onPlayerMove: (nodeId: number) => void;
}

export default function WorldMapModal({
  isOpen,
  onClose,
  currentNodeId,
  completedNodeIds,
  onMysteryTask,
  onCompleteNode,
  onPlayerMove,
}: WorldMapModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-7xl max-h-[90vh] bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border border-[#c9a227]/30 rounded-lg shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#c9a227]/20 bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-900/50 border border-amber-700/50">
              <TargetIcon className="w-6 h-6 text-[#c9a227]" />
            </div>
            <div>
              <h2 className="text-xl font-cinzel font-bold text-[#c9a227]">World Map</h2>
              <p className="text-sm text-[#8b8b7a]">Your journey through the realm</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-[#8b8b7a] hover:text-[#d7ceb2] hover:bg-stone-800 rounded transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Map Content */}
        <div className="overflow-auto max-h-[calc(90vh-80px)]">
          <QuestMap
            currentNodeId={currentNodeId}
            completedNodeIds={completedNodeIds}
            onMysteryTask={onMysteryTask}
            onCompleteNode={onCompleteNode}
            onPlayerMove={onPlayerMove}
          />
        </div>
      </div>
    </div>
  );
}
