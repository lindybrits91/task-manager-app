/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../apis/taskApi';
import { userApi } from '../apis/userApi';
import type { EnrichedTask } from '../types/task';
import type { User } from '../types/user';
import { TASKS_QUERY_KEY, USERS_QUERY_KEY } from '../constants/queryKeys';

export interface TaskBoardContextValue {
  // Enriched tasks with user information
  tasks: EnrichedTask[];
  users: User[];

  // Loading states
  isTasksLoading: boolean;
  isUsersLoading: boolean;
  isTasksError: boolean;
  isUsersError: boolean;
  tasksError: Error | null;
  usersError: Error | null;

  // Helper functions
  getUserById: (userId: number) => User | undefined;
  getUserByName: (fullName: string) => User | undefined;
  getTaskById: (taskId: number) => EnrichedTask | undefined;
}

export const TaskBoardContext = createContext<TaskBoardContextValue | undefined>(undefined);

export function TaskBoardProvider({ children }: { children: ReactNode }) {
  const {
    data: tasksFromApi = [],
    isLoading: isTasksLoading,
    isError: isTasksError,
    error: tasksError,
  } = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: taskApi.getTasks,
    retry: 1,
  });

  // Fetch users
  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: userApi.getUsers,
    retry: 1,
  });

  // Enrich tasks with user information
  const tasks: EnrichedTask[] = tasksFromApi.map((task) => {
    const user = users.find((user) => user.id === task.userId);

    return {
      ...task,
      user,
    };
  });

  // Helper functions
  const getUserById = (userId: number): User | undefined => {
    return users.find((user) => user.id === userId);
  };

  const getUserByName = (fullName: string): User | undefined => {
    return users.find((user) => user.fullName === fullName);
  };

  const getTaskById = (taskId: number): EnrichedTask | undefined => {
    return tasks.find((task) => task.id === taskId);
  };

  const value: TaskBoardContextValue = {
    // Data
    tasks,
    users,

    // Loading states
    isTasksLoading,
    isUsersLoading,
    isTasksError,
    isUsersError,
    tasksError: tasksError as Error | null,
    usersError: usersError as Error | null,

    // Helpers
    getUserById,
    getUserByName,
    getTaskById,
  };

  return <TaskBoardContext.Provider value={value}>{children}</TaskBoardContext.Provider>;
}
