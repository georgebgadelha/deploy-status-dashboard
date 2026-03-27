export const DEPLOY_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  IN_PROGRESS: 'in_progress',
  CANCELLED: 'cancelled',
} as const;

export type DeployStatus = typeof DEPLOY_STATUS[keyof typeof DEPLOY_STATUS];
