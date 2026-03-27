import type { DeployStatus } from '../constants/deploy-status';

const STATUS_COLORS: Record<DeployStatus, string> = {
  success: '#22c55e',
  failed: '#ef4444',
  in_progress: '#f59e0b',
  cancelled: '#6b7280',
};

export function getStatusColor(status: DeployStatus): string {
  return STATUS_COLORS[status] ?? '#6b7280';
}
