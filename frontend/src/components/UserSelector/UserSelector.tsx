import { useUsers } from '../../hooks/useUsers';
import './UserSelector.css';

interface UserSelectorProps {
  value: string;
  onChange: (userName: string) => void;
  showAvatar?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

export function UserSelector({ value, onChange, showAvatar = false }: UserSelectorProps) {
  const { users, isLoading: isUsersLoading } = useUsers();
  const initials = value ? getInitials(value) : '';

  // Get user names from users list
  const userNames = users.map((user) => user.fullName);

  if (showAvatar) {
    return (
      <div className="task-user">
        <span className="user-avatar" data-initials={initials}>
          {initials}
        </span>
        <select
          className="user-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          disabled={isUsersLoading}
        >
          {isUsersLoading ? (
            <option>Loading...</option>
          ) : (
            userNames.map((userName) => (
              <option key={userName} value={userName}>
                {userName}
              </option>
            ))
          )}
        </select>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      disabled={isUsersLoading}
    >
      <option value="">Select user...</option>
      {isUsersLoading ? (
        <option>Loading...</option>
      ) : (
        userNames.map((userName) => (
          <option key={userName} value={userName}>
            {userName}
          </option>
        ))
      )}
    </select>
  );
}
