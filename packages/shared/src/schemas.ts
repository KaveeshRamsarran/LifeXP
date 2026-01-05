import { z } from 'zod';

export const UserRole = z.enum(['USER', 'ADMIN']);
export const TaskDifficulty = z.enum(['EASY', 'MEDIUM', 'HARD']);
export const StatCategory = z.enum(['INTELLIGENCE', 'STRENGTH', 'DISCIPLINE', 'WEALTH']);
export const HabitFrequency = z.enum(['DAILY', 'WEEKLY']);

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  timezone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: StatCategory,
  difficulty: TaskDifficulty,
  estimatedMinutes: z.number().min(1),
  isHabit: z.boolean().default(false),
  habitFrequency: HabitFrequency.optional(),
  tags: z.array(z.string()).optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const CompleteTaskSchema = z.object({
  actualMinutes: z.number().min(1),
  notes: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof CompleteTaskSchema>;
