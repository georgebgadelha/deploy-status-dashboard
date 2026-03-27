import { api } from '../services/api';
import { useApi } from './useApi';

export function useDeploys(projectId: string, params?: Record<string, string>) {
  return useApi(
    () => api.getProjectDeploys(projectId, params),
    [projectId, JSON.stringify(params)],
  );
}
