import { z } from 'zod';
export declare const UserRole: z.ZodEnum<["USER", "ADMIN"]>;
export declare const TaskDifficulty: z.ZodEnum<["EASY", "MEDIUM", "HARD"]>;
export declare const StatCategory: z.ZodEnum<["INTELLIGENCE", "STRENGTH", "DISCIPLINE", "WEALTH"]>;
export declare const HabitFrequency: z.ZodEnum<["DAILY", "WEEKLY"]>;
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    timezone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    timezone?: string | undefined;
}, {
    email: string;
    password: string;
    name: string;
    timezone?: string | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const CreateTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<["INTELLIGENCE", "STRENGTH", "DISCIPLINE", "WEALTH"]>;
    difficulty: z.ZodEnum<["EASY", "MEDIUM", "HARD"]>;
    estimatedMinutes: z.ZodNumber;
    isHabit: z.ZodDefault<z.ZodBoolean>;
    habitFrequency: z.ZodOptional<z.ZodEnum<["DAILY", "WEEKLY"]>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    category: "INTELLIGENCE" | "STRENGTH" | "DISCIPLINE" | "WEALTH";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    estimatedMinutes: number;
    isHabit: boolean;
    description?: string | undefined;
    habitFrequency?: "DAILY" | "WEEKLY" | undefined;
    tags?: string[] | undefined;
}, {
    title: string;
    category: "INTELLIGENCE" | "STRENGTH" | "DISCIPLINE" | "WEALTH";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    estimatedMinutes: number;
    description?: string | undefined;
    isHabit?: boolean | undefined;
    habitFrequency?: "DAILY" | "WEEKLY" | undefined;
    tags?: string[] | undefined;
}>;
export declare const UpdateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    category: z.ZodOptional<z.ZodEnum<["INTELLIGENCE", "STRENGTH", "DISCIPLINE", "WEALTH"]>>;
    difficulty: z.ZodOptional<z.ZodEnum<["EASY", "MEDIUM", "HARD"]>>;
    estimatedMinutes: z.ZodOptional<z.ZodNumber>;
    isHabit: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    habitFrequency: z.ZodOptional<z.ZodOptional<z.ZodEnum<["DAILY", "WEEKLY"]>>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    category?: "INTELLIGENCE" | "STRENGTH" | "DISCIPLINE" | "WEALTH" | undefined;
    difficulty?: "EASY" | "MEDIUM" | "HARD" | undefined;
    estimatedMinutes?: number | undefined;
    isHabit?: boolean | undefined;
    habitFrequency?: "DAILY" | "WEEKLY" | undefined;
    tags?: string[] | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    category?: "INTELLIGENCE" | "STRENGTH" | "DISCIPLINE" | "WEALTH" | undefined;
    difficulty?: "EASY" | "MEDIUM" | "HARD" | undefined;
    estimatedMinutes?: number | undefined;
    isHabit?: boolean | undefined;
    habitFrequency?: "DAILY" | "WEEKLY" | undefined;
    tags?: string[] | undefined;
}>;
export declare const CompleteTaskSchema: z.ZodObject<{
    actualMinutes: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    actualMinutes: number;
    notes?: string | undefined;
}, {
    actualMinutes: number;
    notes?: string | undefined;
}>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof CompleteTaskSchema>;
