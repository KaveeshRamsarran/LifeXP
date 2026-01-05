import prisma from '../config/db';
import { calculateLevel, getTitleForLevel, STAT_GAINS } from '@life-xp/shared';

export const awardXpAndStats = async (
  userId: string,
  xpAmount: number,
  category: 'INTELLIGENCE' | 'STRENGTH' | 'DISCIPLINE' | 'WEALTH',
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const newXp = user.xp + xpAmount;
  const newLevel = calculateLevel(newXp);
  const newTitle = getTitleForLevel(newLevel);
  
  const statGain = STAT_GAINS[difficulty];
  
  const updateData: any = {
    xp: newXp,
    level: newLevel,
    title: newTitle,
  };
  
  // Update specific stat
  if (category === 'INTELLIGENCE') updateData.statIntelligence = user.statIntelligence + statGain;
  if (category === 'STRENGTH') updateData.statStrength = user.statStrength + statGain;
  if (category === 'DISCIPLINE') updateData.statDiscipline = user.statDiscipline + statGain;
  if (category === 'WEALTH') updateData.statWealth = user.statWealth + statGain;

  // Optional: Small discipline boost for consistency
  updateData.statDiscipline = (updateData.statDiscipline || user.statDiscipline) + 0.25;

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
  
  return { newXp, newLevel, newTitle, statGain };
};
