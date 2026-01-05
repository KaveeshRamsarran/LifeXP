"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_mechanics_1 = require("../game-mechanics");
describe('Game Mechanics', () => {
    test('calculateTaskXp returns correct base XP', () => {
        expect((0, game_mechanics_1.calculateTaskXp)('EASY', 15)).toBe(12); // 10 base + 2 duration (15/10 * 2 = 2)
        expect((0, game_mechanics_1.calculateTaskXp)('HARD', 60)).toBe(62); // 50 base + 12 duration (60/10 * 2 = 12)
    });
    test('calculateTaskXp applies streak bonus', () => {
        // Easy (10) + Duration (0) + Streak (10 * 0.5 = 5) = 15
        expect((0, game_mechanics_1.calculateTaskXp)('EASY', 0, 10)).toBe(15);
    });
    test('calculateLevel determines correct level', () => {
        expect((0, game_mechanics_1.calculateLevel)(0)).toBe(1);
        expect((0, game_mechanics_1.calculateLevel)(99)).toBe(1);
        expect((0, game_mechanics_1.calculateLevel)(100)).toBe(2);
        // Level 2 needs 100 XP. Level 3 needs 100 + 135 = 235 XP.
        expect((0, game_mechanics_1.calculateLevel)(235)).toBe(3);
    });
});
