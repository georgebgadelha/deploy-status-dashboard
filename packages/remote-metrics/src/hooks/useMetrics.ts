import { api } from '../services/api';
import { useApi } from './useApi';

export function useMetricsOverview(period = '30d') {
  return useApi(() => api.getOverview(period), [period]);
}

export function useProjectMetrics(projectId: string, period = '30d') {
  return useApi(() => api.getProjectMetrics(projectId, period), [projectId, period]);
}
