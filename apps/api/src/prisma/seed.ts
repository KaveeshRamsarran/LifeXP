import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@lifexp.app';
  const password = 'DemoPass123!';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: 'Demo User',
      xp: 150,
      level: 2,
      title: 'Wandering Potato',
      statIntelligence: 5,
      statStrength: 3,
      statDiscipline: 2,
      statWealth: 1,
    },
  });

  console.log({ user });

  // Create some tasks
  await prisma.task.createMany({
    data: [
      {
        userId: user.id,
        title: 'Read a book chapter',
        category: 'INTELLIGENCE',
        difficulty: 'EASY',
        estimatedMinutes: 30,
        isHabit: true,
        streakCurrent: 5,
        streakLongest: 5,
        lastCompletedAt: new Date(), // Today
      },
      {
        userId: user.id,
        title: 'Gym Workout',
        category: 'STRENGTH',
        difficulty: 'HARD',
        estimatedMinutes: 60,
        isHabit: true,
        streakCurrent: 2,
        streakLongest: 10,
        lastCompletedAt: new Date(Date.now() - 86400000), // Yesterday
      },
      {
        userId: user.id,
        title: 'Review Budget',
        category: 'WEALTH',
        difficulty: 'MEDIUM',
        estimatedMinutes: 15,
        isHabit: false,
      },
    ],
  });

  console.log('Seeded tasks');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
