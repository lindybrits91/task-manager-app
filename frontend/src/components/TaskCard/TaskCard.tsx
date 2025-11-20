import { useRef, type KeyboardEvent, type DragEvent } from 'react';
import type { EnrichedTask } from '../../types/task';
import { UserSelector } from '../UserSelector/UserSelector';
import { useUpdateTask, useDeleteTask } from '../../hooks/useTasks';
import { useDrag } from '../../contexts/DragContext';
import { useUsers } from '../../hooks/useUsers';
import './TaskCard.css';

const MAX_DESCRIPTION_LENGTH = 500;

interface TaskCardProps {
  task: EnrichedTask;
}

export function TaskCard({ task }: TaskCardProps) {
  const descriptionRef = useRef<HTMLDivElement>(null);

  const { setDraggedTaskId } = useDrag();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { getUserByName } = useUsers();

  const handleDescriptionInput = () => {
    const currentDescription = descriptionRef.current?.textContent || '';
    if (currentDescription.length > MAX_DESCRIPTION_LENGTH) {
      // Truncate to max length
      const truncated = currentDescription.substring(0, MAX_DESCRIPTION_LENGTH);
      if (descriptionRef.current) {
        descriptionRef.current.textContent = truncated;
        // Move cursor to end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(descriptionRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  };

  const handleDescriptionBlur = () => {
    const currentDescription = descriptionRef.current?.textContent || '';
    const trimmedDescription = currentDescription.trim();

    if (trimmedDescription === '') {
      if (descriptionRef.current) {
        descriptionRef.current.textContent = task.description;
      }
      return;
    }

    if (trimmedDescription !== task.description) {
      updateTask.mutate({
        id: task.id,
        data: { description: trimmedDescription },
      });
    }
  };

  const handleDescriptionKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      descriptionRef.current?.blur();
    }
  };

  const handleUserChange = (userName: string) => {
    // Convert user name to userId
    const user = getUserByName(userName);
    if (!user) {
      return;
    }

    updateTask.mutate({
      id: task.id,
      data: { userId: user.id },
    });
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id);
  };

  const handleDragStart = (e: DragEvent) => {
    setDraggedTaskId(task.id);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: DragEvent) => {
    setDraggedTaskId(null);
    e.currentTarget.classList.remove('dragging');
  };

  return (
    <div className="task-card" draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        ref={descriptionRef}
        className="task-description"
        contentEditable
        suppressContentEditableWarning
        onInput={handleDescriptionInput}
        onBlur={handleDescriptionBlur}
        onKeyDown={handleDescriptionKeyDown}
        data-max-length={MAX_DESCRIPTION_LENGTH}
      >
        {task.description}
      </div>
      <div className="task-meta">
        <UserSelector value={task.user?.fullName || 'Unassigned'} onChange={handleUserChange} showAvatar />
      </div>
      <div className="task-actions">
        <button className="task-action-btn delete-btn" onClick={handleDelete} title="Delete task">
          ×
        </button>
      </div>
    </div>
  );
}
