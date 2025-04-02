import { z } from "zod";

export const addTaskFormSchema = z.object({
  title: z.string().min(5, 'Title is too short').trim(),
});

export type AddTaskFormData = z.infer<typeof addTaskFormSchema>;
export type AddTaskFormErrors = Partial<Record<keyof AddTaskFormData, string>>;
