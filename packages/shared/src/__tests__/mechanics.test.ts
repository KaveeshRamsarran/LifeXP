import { calculateTaskXp, calculateLevel } from '../game-mechanics';

describe('Game Mechanics', () => {
  test('calculateTaskXp returns correct base XP', () => {
    expect(calculateTaskXp('EASY', 15)).toBe(12); // 10 base + 2 duration (15/10 * 2 = 2)
    expect(calculateTaskXp('HARD', 60)).toBe(62); // 50 base + 12 duration (60/10 * 2 = 12)
  });

  test('calculateTaskXp applies streak bonus', () => {
    // Easy (10) + Duration (0) + Streak (10 * 0.5 = 5) = 15
    expect(calculateTaskXp('EASY', 0, 10)).toBe(15);
  });

  test('calculateLevel determines correct level', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    // Level 2 needs 100 XP. Level 3 needs 100 + 135 = 235 XP.
    expect(calculateLevel(235)).toBe(3);
  });
});
