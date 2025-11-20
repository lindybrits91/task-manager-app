import type { TaskStatus } from '../types/task.ts';

export interface RawUser {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface RawTask {
  id: number;
  description: string;
  status: TaskStatus;
  user_id: number;
  created_at: string;
  updated_at: string;
}
