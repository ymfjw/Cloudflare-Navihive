import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PreferencesAPI } from '../preferences';

describe('PreferencesAPI - User Preferences Methods', () => {
  let mockDb: D1Database;
  let api: PreferencesAPI;

  beforeEach(() => {
    mockDb = {
      prepare: vi.fn(),
      batch: vi.fn(),
    };
    api = new PreferencesAPI(mockDb);
  });

  describe('getPreferences', () => {
    it('should return null when no preferences exist', async () => {
      const mockPrepare = {
        bind: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(null),
      };
      mockDb.prepare.mockReturnValue(mockPrepare);

      const result = await api.getPreferences('user123');

      expect(result).toBeNull();
      expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM user_preferences WHERE user_id = ?');
      expect(mockPrepare.bind).toHaveBeenCalledWith('user123');
    });

    it('should return preferences with parsed custom_colors', async () => {
      const mockPrefs = {
        user_id: 'user123',
        view_mode: 'card',
        theme_mode: 'dark',
        custom_colors: '{"primary":"#5eead4","secondary":"#fb923c"}',
        updated_at: '2024-01-15T10:30:00Z',
      };

      const mockPrepare = {
        bind: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(mockPrefs),
      };
      mockDb.prepare.mockReturnValue(mockPrepare);

      const result = await api.getPreferences('user123');

      expect(result).toEqual({
        user_id: 'user123',
        view_mode: 'card',
        theme_mode: 'dark',
        custom_colors: { primary: '#5eead4', secondary: '#fb923c' },
        updated_at: '2024-01-15T10:30:00Z',
      });
    });

    it('should handle invalid JSON in custom_colors', async () => {
      const mockPrefs = {
        user_id: 'user123',
        view_mode: 'card',
        theme_mode: 'light',
        custom_colors: 'invalid-json',
        updated_at: '2024-01-15T10:30:00Z',
      };

      const mockPrepare = {
        bind: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(mockPrefs),
      };
      mockDb.prepare.mockReturnValue(mockPrepare);

      const result = await api.getPreferences('user123');

      expect(result?.custom_colors).toBeNull();
    });

    it('should handle null custom_colors', async () => {
      const mockPrefs = {
        user_id: 'user123',
        view_mode: 'list',
        theme_mode: 'light',
        custom_colors: null,
        updated_at: '2024-01-15T10:30:00Z',
      };

      const mockPrepare = {
        bind: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(mockPrefs),
      };
      mockDb.prepare.mockReturnValue(mockPrepare);

      const result = await api.getPreferences('user123');

      expect(result?.custom_colors).toBeNull();
    });
  });

  describe('updatePreferences', () => {
    it('should update view_mode only', async () => {
      const mockPrepare = {
        bind: vi.fn().mockReturnThis(),
        run: vi.fn().mockResolvedValue({ success: true }),
      };
      mockDb.prepare.mockReturnValue(mockPrepare);

      await api.updatePreferences('user123', { view_mode: 'list' });

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_preferences (user_id, view_mode)')
      );
      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('ON CONFLICT(user_id) DO UPDATE SET')
      );
      expect(mockPrepare.bind).toHaveBeenCalledWith('user123', 'list');
    });

    it('should update theme_mode only', async () => {
      const mockPrepare = {
        bind: vi.fn().mockReturnThis(),
        run: vi.fn().mockResolvedValue({ success: true }),
      };
      mockDb.prepare.mockReturnValue(mockPrepare);

      await api.updatePreferences('user123', { theme_mode: 'dark' });

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_preferences (user_id, theme_mode)')
      );
      expect(mockPrepare.bind).toHaveBeenCalledWith('user123', 'dark');
    });

    it('should update multiple fields', async () => {
      const mockPrepare = {
        bind: vi.fn().mockReturnThis(),
        run: vi.fn().mockResolvedValue({ success: true }),
      };
      mockDb.prepare.mockReturnValue(mockPrepare);

      await api.updatePreferences('user123', {
        view_mode: 'card',
        theme_mode: 'light',
      });

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_preferences (user_id, view_mode, theme_mode)')
      );
      expect(mockPrepare.bind).toHaveBeenCalledWith('user123', 'card', 'light');
    });

    it('should serialize custom_colors to JSON', async () => {
      const mockPrepare = {
        bind: vi.fn().mockReturnThis(),
        run: vi.fn().mockResolvedValue({ success: true }),
      };
      mockDb.prepare.mockReturnValue(mockPrepare);

      const customColors = { primary: '#5eead4', secondary: '#fb923c' };
      await api.updatePreferences('user123', {
        custom_colors: customColors as unknown as string,
      });

      expect(mockPrepare.bind).toHaveBeenCalledWith('user123', JSON.stringify(customColors));
    });

    it('should handle null custom_colors', async () => {
      const mockPrepare = {
        bind: vi.fn().mockReturnThis(),
        run: vi.fn().mockResolvedValue({ success: true }),
      };
      mockDb.prepare.mockReturnValue(mockPrepare);

      await api.updatePreferences('user123', { custom_colors: null });

      expect(mockPrepare.bind).toHaveBeenCalledWith('user123', null);
    });

    it('should use upsert with ON CONFLICT', async () => {
      const mockPrepare = {
        bind: vi.fn().mockReturnThis(),
        run: vi.fn().mockResolvedValue({ success: true }),
      };
      mockDb.prepare.mockReturnValue(mockPrepare);

      await api.updatePreferences('user123', { view_mode: 'list' });

      const sqlQuery = mockDb.prepare.mock.calls[0][0];
      expect(sqlQuery).toContain('ON CONFLICT(user_id) DO UPDATE SET');
      expect(sqlQuery).toContain('view_mode = excluded.view_mode');
      expect(sqlQuery).toContain('updated_at = CURRENT_TIMESTAMP');
    });
  });
});
