import { z } from "zod";
import { STATUSES_VALIDATION } from "~/types";

export const addTaskFormSchema = z.object({
  client: z.string({ required_error: 'Client is required' }).nonempty('Client is not selected'),
  dateStart: z.string({ required_error: 'Start date is required' }).date(),
  dateEnd: z.string().date().optional(),
  description: z.string().trim().optional(),
  hours: z.number().nonnegative().max(1000, 'Too many working hours'),
  priceStart: z.number().nonnegative().max(1000000, 'Prepaid price is too high').optional(),
  priceEnd: z.number().nonnegative().max(1000000, 'Payment price is too high').optional(),
  status: z.enum(STATUSES_VALIDATION, { required_error: 'Status is required' }),
  title: z.string({ required_error: 'Title is required '}).min(5, 'Title is too short').trim(),
});

export const editTaskFormSchema = addTaskFormSchema;

export type AddTaskFormData = z.infer<typeof addTaskFormSchema>;
export type AddTaskFormErrors = Partial<Record<keyof AddTaskFormData, string>>;
export type EditTaskFormData = z.infer<typeof editTaskFormSchema>;
export type EditTaskFormErrors = Partial<Record<keyof EditTaskFormData, string>>;
