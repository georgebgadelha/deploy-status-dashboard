/**
 * Simplified configuration constants for the dashboard.
 * Uses Zephyr's ZE_PUBLIC_* system for environment variable management.
 * These variables can be overridden at runtime per-environment in Zephyr Cloud.
 */

const API_BASE_URL = process.env.ZE_PUBLIC_API_BASE_URL || 'https://zephyr-deploy-bff.onrender.com/api/v1';
const API_KEY = process.env.ZE_PUBLIC_API_KEY || 'zephyr-dev-api-key-2024';
const REMOTE_METRICS_URL = process.env.ZE_PUBLIC_REMOTE_METRICS_URL || 'http://localhost:3002/remoteEntry.js';

export const CONFIG = {
  API: {
    BASE_URL: API_BASE_URL,
    KEY: API_KEY,
    TIMEOUT_MS: 30000,
  },
  MODULE_FEDERATION: {
    REMOTE_METRICS_URL,
    SCOPE: 'remoteMetrics',
    MODULE: './MetricsWidget',
  },
  DEPLOY_SIMULATION: {
    SUCCESS_RATE: 0.85, // 85% success, 15% fail
    DURATION_MIN_MS: 3000,
    DURATION_MAX_MS: 7000,
  },
} as const;
