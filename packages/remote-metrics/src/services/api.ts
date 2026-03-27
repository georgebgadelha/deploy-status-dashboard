const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api/v1';
const API_KEY = process.env.API_KEY || 'zephyr-dev-api-key-2024';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error?.message || 'Request failed');
  }

  return json;
}

export const api = {
  getOverview(period = '30d') {
    return request<any>(`/metrics/overview?period=${period}`);
  },

  getProjectMetrics(id: string, period = '30d') {
    return request<any>(`/metrics/projects/${id}?period=${period}`);
  },
};
