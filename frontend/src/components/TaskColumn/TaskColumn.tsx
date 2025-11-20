import { useState, type DragEvent } from 'react';
import type { EnrichedTask, TaskStatus } from '../../types/task';
import { TaskCard } from '../TaskCard/TaskCard';
import { useUpdateTask } from '../../hooks/useTasks';
import { useDrag } from '../../contexts/DragContext';
import './TaskColumn.css';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: EnrichedTask[];
  title: string;
  icon: string;
  columnClass: string;
}

export function TaskColumn({ status, tasks, title, icon, columnClass }: TaskColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { draggedTaskId } = useDrag();
  const updateTask = useUpdateTask();

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (draggedTaskId !== null) {
      updateTask.mutate({
        id: draggedTaskId,
        data: { status },
      });
    }
  };

  return (
    <div className={`task-column ${columnClass}`}>
      <div className="column-header">
        <div className="column-title">
          <span className="status-icon"></span>
          {title}
        </div>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div
        className={`tasks-container column-drop-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{icon}</div>
            <div>
              {status === 'TODO' && 'No tasks to do'}
              {status === 'DOING' && 'No tasks in progress'}
              {status === 'DONE' && 'No completed tasks'}
            </div>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
