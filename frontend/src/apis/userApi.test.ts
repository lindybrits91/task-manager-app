import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { userApi } from './userApi';
import { ApiError } from './apiUtils';
import type { RawUser } from './types';

describe('userApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getUsers', () => {
    it('should fetch and transform users successfully', async () => {
      const mockRawUsers: RawUser[] = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          created_at: '2024-01-02T00:00:00Z',
        },
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockRawUsers,
        } as Response)
      );

      const users = await userApi.getUsers();

      expect(users).toHaveLength(2);
      expect(users[0]).toEqual({
        id: 1,
        fullName: 'John Doe',
      });
      expect(users[1]).toEqual({
        id: 2,
        fullName: 'Jane Smith',
      });

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/users'));
    });

    it('should throw ApiError when fetch fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => ({ detail: 'Internal server error' }),
        } as Response)
      );

      try {
        await userApi.getUsers();
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Internal server error');
        expect((error as ApiError).statusCode).toBe(500);
      }
    });

    it('should handle empty user list', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => [],
        } as Response)
      );

      const users = await userApi.getUsers();

      expect(users).toEqual([]);
    });
  });
});
