import prisma from '../config/db';

interface TaskWithStreak {
  id: string;
  lastCompletedAt: Date | null;
  streakCurrent: number;
  streakLongest: number;
  isHabit: boolean;
}

export const calculateDecayedStreak = (task: TaskWithStreak): number => {
  if (!task.lastCompletedAt) return 0;
  
  const now = new Date();
  const last = new Date(task.lastCompletedAt);
  
  // Reset time to midnight for day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDate = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // If completed today, streak is current
  if (diffDays === 0) return task.streakCurrent;
  
  // If completed yesterday (diffDays = 1), streak is intact
  if (diffDays === 1) return task.streakCurrent;
  
  // If missed days > 1, decay
  // Missed days = diffDays - 1
  // Example: Last completed Jan 1. Today Jan 3. Diff = 2. Missed Jan 2.
  // Decay = 1.
  const missedDays = diffDays - 1;
  
  // Decay logic: streak decays by 1 per missed scheduled day
  // Assuming DAILY frequency for now as per simplification
  const decay = missedDays;
  
  const newStreak = Math.max(0, task.streakCurrent - decay);
  
  return newStreak;
};

export const updateTaskStreak = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || !task.isHabit) return;
  
  const currentDecayed = calculateDecayedStreak(task);
  
  // If completed today already, don't double count? 
  // The controller should check if already completed today if we want to enforce once-per-day.
  // But for streak calculation, if we complete it, we add 1 to the decayed value.
  
  const newStreak = currentDecayed + 1;
  const newLongest = Math.max(task.streakLongest, newStreak);
  
  await prisma.task.update({
    where: { id: taskId },
    data: {
      streakCurrent: newStreak,
      streakLongest: newLongest,
      lastCompletedAt: new Date(),
    },
  });
  
  return newStreak;
};
