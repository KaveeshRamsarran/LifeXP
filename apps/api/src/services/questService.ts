import prisma from '../config/db';

const QUEST_TEMPLATES = [
  { title: 'Do 10 pushups', category: 'STRENGTH' as const, difficulty: 'EASY' as const },
  { title: 'Read 5 pages', category: 'INTELLIGENCE' as const, difficulty: 'EASY' as const },
  { title: 'Clean one small area', category: 'DISCIPLINE' as const, difficulty: 'EASY' as const },
  { title: 'Log one expense', category: 'WEALTH' as const, difficulty: 'EASY' as const },
  { title: 'Drink 2L water', category: 'STRENGTH' as const, difficulty: 'EASY' as const },
  { title: 'Meditate 5 mins', category: 'DISCIPLINE' as const, difficulty: 'EASY' as const },
  { title: 'Learn one new fact', category: 'INTELLIGENCE' as const, difficulty: 'EASY' as const },
  { title: 'Save $5', category: 'WEALTH' as const, difficulty: 'EASY' as const },
  { title: 'Go for a walk', category: 'STRENGTH' as const, difficulty: 'MEDIUM' as const },
  { title: 'Code for 30 mins', category: 'INTELLIGENCE' as const, difficulty: 'MEDIUM' as const },
];

export const generateDailyQuests = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.quest.findMany({
    where: {
      userId,
      date: today,
    },
  });

  if (existing.length > 0) return existing;

  // Generate 3 random quests
  const shuffled = [...QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  const quests = [];
  
  for (const template of selected) {
    const quest = await prisma.quest.create({
      data: {
        userId,
        date: today,
        title: template.title,
        category: template.category,
        difficulty: template.difficulty,
      },
    });
    quests.push(quest);
  }

  return quests;
};
