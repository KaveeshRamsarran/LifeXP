"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteTaskSchema = exports.UpdateTaskSchema = exports.CreateTaskSchema = exports.LoginSchema = exports.RegisterSchema = exports.HabitFrequency = exports.StatCategory = exports.TaskDifficulty = exports.UserRole = void 0;
const zod_1 = require("zod");
exports.UserRole = zod_1.z.enum(['USER', 'ADMIN']);
exports.TaskDifficulty = zod_1.z.enum(['EASY', 'MEDIUM', 'HARD']);
exports.StatCategory = zod_1.z.enum(['INTELLIGENCE', 'STRENGTH', 'DISCIPLINE', 'WEALTH']);
exports.HabitFrequency = zod_1.z.enum(['DAILY', 'WEEKLY']);
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(2),
    timezone: zod_1.z.string().optional(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.CreateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    category: exports.StatCategory,
    difficulty: exports.TaskDifficulty,
    estimatedMinutes: zod_1.z.number().min(1),
    isHabit: zod_1.z.boolean().default(false),
    habitFrequency: exports.HabitFrequency.optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.UpdateTaskSchema = exports.CreateTaskSchema.partial();
exports.CompleteTaskSchema = zod_1.z.object({
    actualMinutes: zod_1.z.number().min(1),
    notes: zod_1.z.string().optional(),
});
