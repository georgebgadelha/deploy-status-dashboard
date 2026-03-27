import type { DeployStatus } from '../constants/deploy-status';
import type { Environment } from '../constants/environments';

export interface Deploy {
  _id: string;
  projectId: string;
  environment: Environment;
  status: DeployStatus;
  branch: string;
  commitHash: string;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
}
