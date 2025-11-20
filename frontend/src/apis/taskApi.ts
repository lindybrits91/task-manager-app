import type { CreateTaskData, UpdateTaskData, Task } from '../types/task';
import type { RawTask } from './types';
import { API_BASE_URL, handleResponse } from './apiUtils';

/*
 * Transform RawTask to Task
 */
function transformRawTask(rawTask: RawTask): Task {
  return {
    id: rawTask.id,
    description: rawTask.description,
    status: rawTask.status,
    userId: rawTask.user_id,
    createdAt: rawTask.created_at,
    updatedAt: rawTask.updated_at,
  };
}

export const taskApi = {
  /*
   * Get all tasks - fetches raw tasks and transforms them
   */
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`);
    const rawTasks = await handleResponse<RawTask[]>(response);
    return rawTasks.map(transformRawTask);
  },

  /*
   * Create a new task
   */
  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: data.description,
        status: data.status,
        user_id: data.userId,
      }),
    });
    const rawTask = await handleResponse<RawTask>(response);
    return transformRawTask(rawTask);
  },

  /*
   * Update a task
   */
  async updateTask(id: number, data: UpdateTaskData): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: data.description,
        status: data.status,
        user_id: data.userId,
      }),
    });
    const rawTask = await handleResponse<RawTask>(response);
    return transformRawTask(rawTask);
  },

  /*
   * Delete a task
   */
  async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};
