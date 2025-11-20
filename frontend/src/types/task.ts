import type { User } from './user.ts';

export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

export interface Task {
  id: number;
  description: string;
  status: TaskStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnrichedTask extends Task {
  user?: User;
}

export interface CreateTaskData {
  description: string;
  userId: number;
  status: TaskStatus;
}

export interface UpdateTaskData {
  description: string;
  userId: number;
  status: TaskStatus;
}
