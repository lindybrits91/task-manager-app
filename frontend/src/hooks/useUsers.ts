import { useTaskBoardContext } from './useTaskBoardContext';

/*
 * Hook to access users and user-related helper functions
 */
export function useUsers() {
  const { users, isUsersLoading, isUsersError, usersError, getUserById, getUserByName } =
    useTaskBoardContext();

  return {
    users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
    getUserById,
    getUserByName,
  };
}
