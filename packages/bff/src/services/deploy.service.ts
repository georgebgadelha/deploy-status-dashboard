import { deployRepository } from '../repositories/deploy.repository';
import { projectRepository } from '../repositories/project.repository';
import { DEPLOY_STATUS } from '@zephyr-deploy/shared';
import type { DeployStatus } from '@zephyr-deploy/shared';

interface ListOptions {
  page: number;
  limit: number;
  environment?: string;
  status?: string;
  projectId?: string;
}

interface CreateDeployInput {
  projectId: string;
  environment: string;
  branch: string;
}

const validTransitions: Record<string, DeployStatus[]> = {
  [DEPLOY_STATUS.IN_PROGRESS]: [DEPLOY_STATUS.SUCCESS, DEPLOY_STATUS.FAILED, DEPLOY_STATUS.CANCELLED],
  [DEPLOY_STATUS.FAILED]: [DEPLOY_STATUS.IN_PROGRESS],
};

function randomCommitHash(): string {
  return Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
}

export const deployService = {
  async list(options: ListOptions) {
    return deployRepository.findAll(options);
  },

  async getById(id: string) {
    return deployRepository.findById(id);
  },

  async create({ projectId, environment, branch }: CreateDeployInput) {
    const project = await projectRepository.findById(projectId);
    if (!project) return { error: 'PROJECT_NOT_FOUND' as const };

    const deploy = await deployRepository.create({
      projectId: project._id,
      environment: environment as any,
      status: DEPLOY_STATUS.IN_PROGRESS,
      branch,
      commitHash: randomCommitHash(),
      duration: null,
    });

    return { data: deploy };
  },

  async updateStatus(id: string, status: DeployStatus) {
    const deploy = await deployRepository.findById(id);
    if (!deploy) return { error: 'DEPLOY_NOT_FOUND' as const };

    const allowed = validTransitions[deploy.status];
    if (!allowed || !allowed.includes(status)) {
      return { error: 'INVALID_TRANSITION' as const };
    }

    const updated = await deployRepository.updateStatus(id, status);
    return { data: updated };
  },
};
