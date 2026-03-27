// Webpack injects process object with env vars via DefinePlugin
const API_BASE_URL = (typeof process !== 'undefined' && process.env?.ZE_PUBLIC_API_BASE_URL) 
  || 'https://zephyr-deploy-bff.onrender.com/api/v1';
const API_KEY = (typeof process !== 'undefined' && process.env?.ZE_PUBLIC_API_KEY) 
  || 'zephyr-dev-api-key-2024';

if (typeof globalThis !== 'undefined') {
  console.log('[RemoteMetrics API] Initialized with:', { 
    API_BASE_URL, 
    API_KEY: API_KEY ? '***' : 'fallback',
    processAvailable: typeof process !== 'undefined'
  });
}

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
  async getOverview(period = '30d') {
    return request<any>(`/metrics/overview?period=${period}`);
  },

  async getProjectMetrics(id: string, period = '30d') {
    return request<any>(`/metrics/projects/${id}?period=${period}`);
  },
};
