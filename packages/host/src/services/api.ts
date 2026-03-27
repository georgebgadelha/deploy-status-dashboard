import { CONFIG } from '../config/constants';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${CONFIG.API.BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CONFIG.API.KEY,
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error?.message || 'Request failed');
  }

  return json;
}

export const api = {
  async getProjects(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/projects${qs}`);
  },

  async getProject(id: string) {
    return request<any>(`/projects/${id}`);
  },

  async getProjectDeploys(id: string, params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/projects/${id}/deploys${qs}`);
  },

  async getDeploys(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/deploys${qs}`);
  },

  async getMetricsOverview(period = '30d') {
    return request<any>(`/metrics/overview?period=${period}`);
  },

  async getProjectMetrics(id: string, period = '30d') {
    return request<any>(`/metrics/projects/${id}?period=${period}`);
  },

  async createDeploy(projectId: string, environment: string, branch: string) {
    return request<any>('/deploys', {
      method: 'POST',
      body: JSON.stringify({ projectId, environment, branch }),
    });
  },

  async updateDeployStatus(id: string, status: string) {
    return request<any>(`/deploys/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
