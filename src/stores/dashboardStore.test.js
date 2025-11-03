import { describe, it, expect, vi } from 'vitest';
import { act } from '@testing-library/react';
import useDashboardStore from './dashboardStore';

describe('dashboardStore', () => {
  it('should update statistics', () => {
    const store = useDashboardStore.getState();
    const newStats = {
      totalUsers: 100,
      activeUsers: 50,
      pendingRequests: 10
    };

    act(() => {
      store.setStatistics(newStats);
    });

    expect(useDashboardStore.getState().statistics).toEqual(newStats);
  });

  it('should handle loading state', () => {
    const store = useDashboardStore.getState();

    act(() => {
      store.setLoading(true);
    });

    expect(useDashboardStore.getState().loading).toBe(true);
  });

  it('should handle errors', () => {
    const store = useDashboardStore.getState();
    const error = 'Test error';

    act(() => {
      store.setError(error);
    });

    expect(useDashboardStore.getState().error).toBe(error);
  });

  it('should reset state', () => {
    const store = useDashboardStore.getState();
    const initialState = {
      statistics: {
        totalUsers: 0,
        activeUsers: 0,
        pendingRequests: 0
      },
      loading: false,
      error: null
    };

    // Primero modificamos el estado
    act(() => {
      store.setStatistics({ totalUsers: 100, activeUsers: 50, pendingRequests: 10 });
      store.setError('Test error');
    });

    // Luego reseteamos
    act(() => {
      store.reset();
    });

    expect(useDashboardStore.getState()).toEqual(expect.objectContaining(initialState));
  });
});