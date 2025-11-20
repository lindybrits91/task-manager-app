import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUsers } from './useUsers';
import * as TaskBoardContextModule from './useTaskBoardContext';
import type { TaskBoardContextValue } from '../contexts/TaskBoardContext';

describe('useUsers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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

  it('should return users data and loading state', () => {
    const mockContextValue = createMockContextValue({
      users: [
        { id: 1, fullName: 'John Doe' },
        { id: 2, fullName: 'Jane Smith' },
      ],
      isUsersLoading: false,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useUsers());

    expect(result.current.users).toHaveLength(2);
    expect(result.current.users[0]).toEqual({ id: 1, fullName: 'John Doe' });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return loading state when users are loading', () => {
    const mockContextValue = createMockContextValue({
      users: [],
      isUsersLoading: true,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useUsers());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.users).toEqual([]);
  });

  it('should return error state when fetch fails', () => {
    const mockError = new Error('Failed to fetch users');
    const mockContextValue = createMockContextValue({
      users: [],
      isUsersLoading: false,
      isUsersError: true,
      usersError: mockError,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useUsers());

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
  });

  it('should expose getUserById helper function', () => {
    const mockGetUserById = vi.fn((id: number) =>
      id === 1 ? { id: 1, fullName: 'John Doe' } : undefined
    );

    const mockContextValue = createMockContextValue({
      users: [{ id: 1, fullName: 'John Doe' }],
      getUserById: mockGetUserById,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useUsers());

    const user = result.current.getUserById(1);
    expect(user).toEqual({ id: 1, fullName: 'John Doe' });
    expect(mockGetUserById).toHaveBeenCalledWith(1);
  });

  it('should expose getUserByName helper function', () => {
    const mockGetUserByName = vi.fn((name: string) =>
      name === 'John Doe' ? { id: 1, fullName: 'John Doe' } : undefined
    );

    const mockContextValue = createMockContextValue({
      users: [{ id: 1, fullName: 'John Doe' }],
      getUserByName: mockGetUserByName,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useUsers());

    const user = result.current.getUserByName('John Doe');
    expect(user).toEqual({ id: 1, fullName: 'John Doe' });
    expect(mockGetUserByName).toHaveBeenCalledWith('John Doe');
  });

  it('should return empty array when no users exist', () => {
    const mockContextValue = createMockContextValue({
      users: [],
      isUsersLoading: false,
    });

    vi.spyOn(TaskBoardContextModule, 'useTaskBoardContext').mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useUsers());

    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
