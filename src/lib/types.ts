import { z } from "zod";

export const taskStatus = ["To Do", "In Progress", "Completed"] as const;

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  status: z.enum(taskStatus),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskSchema.shape.status>;
