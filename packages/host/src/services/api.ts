const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api/v1';
const API_KEY = process.env.API_KEY || 'zephyr-dev-api-key-2024';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
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
  getProjects(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/projects${qs}`);
  },

  getProject(id: string) {
    return request<any>(`/projects/${id}`);
  },

  getProjectDeploys(id: string, params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/projects/${id}/deploys${qs}`);
  },

  getDeploys(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/deploys${qs}`);
  },

  getMetricsOverview(period = '30d') {
    return request<any>(`/metrics/overview?period=${period}`);
  },

  getProjectMetrics(id: string, period = '30d') {
    return request<any>(`/metrics/projects/${id}?period=${period}`);
  },
};
