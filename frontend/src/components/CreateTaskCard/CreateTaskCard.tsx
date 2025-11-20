import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TaskStatus } from '../../types/task';
import { UserSelector } from '../UserSelector/UserSelector';
import { useCreateTask } from '../../hooks/useTasks';
import { useUsers } from '../../hooks/useUsers';
import './CreateTaskCard.css';

export function CreateTaskCard() {
  const [description, setDescription] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');

  const createTask = useCreateTask();
  const { getUserByName } = useUsers();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !selectedUser) {
      return;
    }

    // Convert user name to userId
    const user = getUserByName(selectedUser);
    if (!user) {
      return;
    }

    createTask.mutate(
      {
        description: description.trim(),
        userId: user.id,
        status,
      },
      {
        onSuccess: () => {
          setDescription('');
          setSelectedUser('');
          setStatus('TODO');
        },
      }
    );
  };

  return (
    <div className="add-task-section">
      <form className="add-task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="taskDescription">Task Description</label>
          <input
            type="text"
            id="taskDescription"
            placeholder="Enter task description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="selectedUser">Assign To</label>
          <UserSelector value={selectedUser} onChange={setSelectedUser} />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            required
          >
            <option value="TODO">TODO</option>
            <option value="DOING">DOING</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
        <button type="submit" className="add-btn" disabled={createTask.isPending}>
          {createTask.isPending ? 'Adding...' : 'Add Task'}
        </button>
      </form>
      {createTask.isError && (
        <div className="error-message" style={{ marginTop: '12px' }}>
          Failed to create task. Please try again.
        </div>
      )}
    </div>
  );
}
