import { useMemo } from 'react';
import type { TaskStatus } from '../../types/task';
import { TaskColumn } from '../TaskColumn/TaskColumn';
import { CreateTaskCard } from '../CreateTaskCard/CreateTaskCard';
import { useTasks } from '../../hooks/useTasks';
import './TaskBoard.css';

export function TaskBoard() {
  const { data: tasks, isLoading, isError, error } = useTasks();

  const tasksByStatus = useMemo(() => {
    if (!tasks) return { TODO: [], DOING: [], DONE: [] };

    return tasks.reduce(
      (acc, task) => {
        acc[task.status].push(task);
        return acc;
      },
      { TODO: [], DOING: [], DONE: [] } as Record<TaskStatus, typeof tasks>
    );
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="container">
        <h1>Task Management Board</h1>
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          Loading tasks...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container">
        <h1>Task Management Board</h1>
        <div className="error-message">
          Failed to load tasks: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Task Management Board</h1>

      <CreateTaskCard />

      <div className="task-board">
        <TaskColumn
          status="TODO"
          tasks={tasksByStatus.TODO}
          title="TODO"
          icon="📝"
          columnClass="todo-column"
        />
        <TaskColumn
          status="DOING"
          tasks={tasksByStatus.DOING}
          title="DOING"
          icon="⚡"
          columnClass="doing-column"
        />
        <TaskColumn
          status="DONE"
          tasks={tasksByStatus.DONE}
          title="DONE"
          icon="✅"
          columnClass="done-column"
        />
      </div>
    </div>
  );
}
