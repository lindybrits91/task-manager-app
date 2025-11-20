import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../apis/taskApi';
import { ApiError } from '../apis/apiUtils';
import { useTaskBoardContext } from './useTaskBoardContext';
import { TASKS_QUERY_KEY } from '../constants/queryKeys';
import type { CreateTaskData, UpdateTaskData } from '../types/task';

/**
 * Hook to access tasks with enriched user information
 */
export function useTasks() {
  const {
    tasks,
    isTasksLoading,
    isUsersLoading,
    isTasksError,
    isUsersError,
    tasksError,
    usersError,
  } = useTaskBoardContext();

  return {
    data: tasks,
    isLoading: isTasksLoading || isUsersLoading,
    isError: isTasksError || isUsersError,
    error: tasksError || usersError,
  };
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => {
      return taskApi.createTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      console.error('Failed to create task:', error.message);
    },
  });
}

/**
 * Hook to update an existing task
 * Handles merging partial updates with current task data
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { getTaskById } = useTaskBoardContext();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UpdateTaskData> }) => {
      // Get current task to fill in missing fields
      const currentTask = getTaskById(id);
      if (!currentTask) {
        throw new ApiError(`Task with id ${id} not found`, 404);
      }

      // Build complete update data
      const updateData: UpdateTaskData = {
        description: data.description ?? currentTask.description,
        userId: data.userId ?? currentTask.userId,
        status: data.status ?? currentTask.status,
      };

      return taskApi.updateTask(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      console.error('Failed to update task:', error.message);
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      console.error('Failed to delete task:', error.message);
    },
  });
}
