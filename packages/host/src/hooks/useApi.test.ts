import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '../hooks/useApi';

describe('useApi', () => {
  it('starts in loading state', () => {
    const fetcher = () => new Promise<string>(() => {});
    const { result } = renderHook(() => useApi(fetcher));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('sets data on success', async () => {
    const fetcher = () => Promise.resolve({ items: [1, 2] });
    const { result } = renderHook(() => useApi(fetcher));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ items: [1, 2] });
    expect(result.current.error).toBeNull();
  });

  it('sets error on failure', async () => {
    const fetcher = () => Promise.reject(new Error('Network error'));
    const { result } = renderHook(() => useApi(fetcher));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
    expect(result.current.data).toBeNull();
  });
});
