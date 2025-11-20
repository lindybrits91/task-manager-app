import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { taskApi } from './taskApi';
import { ApiError } from './apiUtils';
import type { RawTask } from './types';
import type { CreateTaskData, UpdateTaskData } from '../types/task';

describe('taskApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getTasks', () => {
    it('should fetch and transform tasks successfully', async () => {
      const mockRawTasks: RawTask[] = [
        {
          id: 1,
          description: 'Test task',
          status: 'TODO',
          user_id: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockRawTasks,
        } as Response)
      );

      const tasks = await taskApi.getTasks();

      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toEqual({
        id: 1,
        description: 'Test task',
        status: 'TODO',
        userId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/tasks'));
    });

    it('should handle empty task list', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => [],
        } as Response)
      );

      const tasks = await taskApi.getTasks();

      expect(tasks).toEqual([]);
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createData: CreateTaskData = {
        description: 'New task',
        status: 'TODO',
        userId: 1,
      };

      const mockRawTask: RawTask = {
        id: 1,
        description: 'New task',
        status: 'TODO',
        user_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => mockRawTask,
        } as Response)
      );

      const task = await taskApi.createTask(createData);

      expect(task).toEqual({
        id: 1,
        description: 'New task',
        status: 'TODO',
        userId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: 'New task',
            status: 'TODO',
            user_id: 1,
          }),
        })
      );
    });

    it('should throw ApiError when creation fails', async () => {
      const createData: CreateTaskData = {
        description: 'New task',
        status: 'TODO',
        userId: 1,
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: async () => ({ detail: 'Bad request' }),
        } as Response)
      );

      try {
        await taskApi.createTask(createData);
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Bad request');
        expect((error as ApiError).statusCode).toBe(400);
      }
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updateData: UpdateTaskData = {
        description: 'Updated task',
        status: 'DOING',
        userId: 1,
      };

      const mockRawTask: RawTask = {
        id: 1,
        description: 'Updated task',
        status: 'DOING',
        user_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockRawTask,
        } as Response)
      );

      const task = await taskApi.updateTask(1, updateData);

      expect(task.description).toBe('Updated task');
      expect(task.status).toBe('DOING');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks/1'),
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: 'Updated task',
            status: 'DOING',
            user_id: 1,
          }),
        })
      );
    });

    it('should throw ApiError when update fails', async () => {
      const updateData: UpdateTaskData = {
        description: 'Updated task',
        status: 'DOING',
        userId: 1,
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ detail: 'Task not found' }),
        } as Response)
      );

      try {
        await taskApi.updateTask(999, updateData);
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Task not found');
        expect((error as ApiError).statusCode).toBe(404);
      }
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          status: 204,
        } as Response)
      );

      await expect(taskApi.deleteTask(1)).resolves.toBeUndefined();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should throw ApiError when delete fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ detail: 'Task not found' }),
        } as Response)
      );

      try {
        await taskApi.deleteTask(999);
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Task not found');
        expect((error as ApiError).statusCode).toBe(404);
      }
    });
  });
});
