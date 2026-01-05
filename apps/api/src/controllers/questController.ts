import { Request, Response } from 'express';
import prisma from '../config/db';
import { generateDailyQuests } from '../services/questService';
import { calculateTaskXp } from '@life-xp/shared';
import { awardXpAndStats } from '../services/gameService';

export const getTodayQuests = async (req: any, res: Response) => {
  const quests = await generateDailyQuests(req.user.id);
  res.json(quests);
};

export const completeQuest = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const quest = await prisma.quest.findUnique({ where: { id, userId: req.user.id } });
    if (!quest) return res.status(404).json({ error: 'Quest not found' });
    if (quest.isCompleted) return res.status(400).json({ error: 'Already completed' });

    // Calculate XP (Quests usually don't have duration, assume 15 mins or 0 for bonus)
    const xpEarned = calculateTaskXp(quest.difficulty as 'EASY' | 'MEDIUM' | 'HARD', 15, 0, true);
    
    await prisma.quest.update({
      where: { id },
      data: { isCompleted: true },
    });

    await prisma.completion.create({
      data: {
        userId: req.user.id,
        questId: quest.id,
        actualMinutes: 15,
        xpEarned,
        notes: 'Daily Quest',
      },
    });

    const result = await awardXpAndStats(req.user.id, xpEarned, quest.category as 'INTELLIGENCE' | 'STRENGTH' | 'DISCIPLINE' | 'WEALTH', quest.difficulty as 'EASY' | 'MEDIUM' | 'HARD');

    res.json({ ...result, xpEarned });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
