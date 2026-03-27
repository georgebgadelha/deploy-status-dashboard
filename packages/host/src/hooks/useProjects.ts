import { api } from '../services/api';
import { useApi } from './useApi';

export function useProjects(params?: Record<string, string>) {
  return useApi(() => api.getProjects(params), [JSON.stringify(params)]);
}

export function useProject(id: string) {
  return useApi(() => api.getProject(id), [id]);
}
