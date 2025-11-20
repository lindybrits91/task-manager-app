import { useContext } from 'react';
import { TaskBoardContext } from '../contexts/TaskBoardContext';

/**
 * Hook to access task board context
 */
export function useTaskBoardContext() {
  const context = useContext(TaskBoardContext);
  if (context === undefined) {
    throw new Error('useTaskBoardContext must be used within a TaskBoardProvider');
  }
  return context;
}
