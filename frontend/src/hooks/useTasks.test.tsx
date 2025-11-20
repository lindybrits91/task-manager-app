import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from './useTasks';
import * as TaskBoardContextModule from './useTaskBoardContext';
import * as taskApiModule from '../apis/taskApi';
import { ApiError } from '../apis/apiUtils';
import type { TaskBoardContextValue } from '../contexts/TaskBoardContext';
import type { ReactNode } from 'react';

/*
 * Helper to create a wrapper with QueryClient
 */
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const createMockContextValue = (
  overrides: Partial<TaskBoardContextValue> = {}
): TaskBoardContextValue => ({
  users: [],
  tasks: [],
  isUsersLoading: false,
  isTasksLoading: false,
  isUsersError: false,
  isTasksError: false,
  usersError: null,
  tasksError: null,
  getUserById: vi.fn(),
  getUserByName: vi.fn(),
  getTaskById: vi.fn(),
  ...overrides,
});

describe('useTasks', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return tasks data and loading state', () => {
    const mockContextValue = createMockContextValue({
      tasks: [
        {
          id: 1,
          description: 'Test task',
          status: 'TODO',
          userId: 1,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          user: { id: 1, fullName: 'John Doe' },
        },
      ],
      isTasksLoading: false,
      isUsersLoading: false,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useTasks());

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].description).toBe('Test task');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should return loading state when tasks are loading', () => {
    const mockContextValue = createMockContextValue({
      tasks: [],
      isTasksLoading: true,
      isUsersLoading: false,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useTasks());

    expect(result.current.isLoading).toBe(true);
  });

  it('should return loading state when users are loading', () => {
    const mockContextValue = createMockContextValue({
      tasks: [],
      isTasksLoading: false,
      isUsersLoading: true,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useTasks());

    expect(result.current.isLoading).toBe(true);
  });

  it('should return error state when tasks fetch fails', () => {
    const mockError = new Error('Failed to fetch tasks');
    const mockContextValue = createMockContextValue({
      tasks: [],
      isTasksError: true,
      tasksError: mockError,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useTasks());

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
  });

  it('should return error state when users fetch fails', () => {
    const mockError = new Error('Failed to fetch users');
    const mockContextValue = createMockContextValue({
      tasks: [],
      isUsersError: true,
      usersError: mockError,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useTasks());

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
  });
});

describe('useCreateTask', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a task successfully', async () => {
    const mockContextValue = createMockContextValue();
    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const mockTask = {
      id: 1,
      description: 'New task',
      status: 'TODO' as const,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    vi.spyOn(taskApiModule.taskApi, 'createTask').mockResolvedValue(mockTask);

    const { result } = renderHook(() => useCreateTask(), { wrapper: createWrapper() });

    result.current.mutate({
      description: 'New task',
      status: 'TODO',
      userId: 1,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(taskApiModule.taskApi.createTask).toHaveBeenCalledWith({
      description: 'New task',
      status: 'TODO',
      userId: 1,
    });
  });

  it('should handle create task error', async () => {
    const mockContextValue = createMockContextValue();
    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const mockError = new ApiError('Failed to create task', 400);
    vi.spyOn(taskApiModule.taskApi, 'createTask').mockRejectedValue(mockError);
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useCreateTask(), { wrapper: createWrapper() });

    result.current.mutate({
      description: 'New task',
      status: 'TODO',
      userId: 1,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(mockError);
  });
});

describe('useUpdateTask', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should update a task successfully with partial data', async () => {
    const mockGetTaskById = vi.fn(() => ({
      id: 1,
      description: 'Old description',
      status: 'TODO' as const,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      user: { id: 1, fullName: 'John Doe' },
    }));

    const mockContextValue = createMockContextValue({
      getTaskById: mockGetTaskById,
    });
    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const mockUpdatedTask = {
      id: 1,
      description: 'Updated description',
      status: 'TODO' as const,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
    };

    vi.spyOn(taskApiModule.taskApi, 'updateTask').mockResolvedValue(mockUpdatedTask);

    const { result } = renderHook(() => useUpdateTask(), { wrapper: createWrapper() });

    result.current.mutate({
      id: 1,
      data: { description: 'Updated description' },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(taskApiModule.taskApi.updateTask).toHaveBeenCalledWith(1, {
      description: 'Updated description',
      userId: 1,
      status: 'TODO',
    });
  });

  it('should throw error if task not found', async () => {
    const mockGetTaskById = vi.fn(() => undefined);

    const mockContextValue = createMockContextValue({
      getTaskById: mockGetTaskById,
    });
    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUpdateTask(), { wrapper: createWrapper() });

    result.current.mutate({
      id: 999,
      data: { description: 'Updated description' },
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect((result.current.error as ApiError).message).toContain('Task with id 999 not found');
  });

  it('should handle update task error', async () => {
    const mockGetTaskById = vi.fn(() => ({
      id: 1,
      description: 'Old description',
      status: 'TODO' as const,
      userId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      user: { id: 1, fullName: 'John Doe' },
    }));

    const mockContextValue = createMockContextValue({
      getTaskById: mockGetTaskById,
    });
    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const mockError = new ApiError('Failed to update task', 500);
    vi.spyOn(taskApiModule.taskApi, 'updateTask').mockRejectedValue(mockError);
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUpdateTask(), { wrapper: createWrapper() });

    result.current.mutate({
      id: 1,
      data: { description: 'Updated description' },
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(mockError);
  });
});

describe('useDeleteTask', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should delete a task successfully', async () => {
    const mockContextValue = createMockContextValue();
    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    vi.spyOn(taskApiModule.taskApi, 'deleteTask').mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteTask(), { wrapper: createWrapper() });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(taskApiModule.taskApi.deleteTask).toHaveBeenCalledWith(1);
  });

  it('should handle delete task error', async () => {
    const mockContextValue = createMockContextValue();
    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const mockError = new ApiError('Failed to delete task', 404);
    vi.spyOn(taskApiModule.taskApi, 'deleteTask').mockRejectedValue(mockError);
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useDeleteTask(), { wrapper: createWrapper() });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(mockError);
  });
});
