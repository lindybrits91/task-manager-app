import type { User } from '../types/user';
import type { RawUser } from './types';
import { API_BASE_URL, handleResponse } from './apiUtils';

/*
 * Transform RawUser to User
 */
function transformRawUser(rawUser: RawUser): User {
  return {
    id: rawUser.id,
    fullName: `${rawUser.first_name} ${rawUser.last_name}`,
  };
}

export const userApi = {
  /*
   * Get all users - fetches raw users and transforms them
   */
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    const rawUsers = await handleResponse<RawUser[]>(response);
    return rawUsers.map(transformRawUser);
  },
};
