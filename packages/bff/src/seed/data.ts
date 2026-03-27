import { DEPLOY_STATUS, ENVIRONMENTS } from '@zephyr-deploy/shared';
import type { DeployStatus, Environment } from '@zephyr-deploy/shared';

export interface ProjectSeed {
  name: string;
  description: string;
  repository: string;
}

export interface DeploySeed {
  environment: Environment;
  status: DeployStatus;
  branch: string;
  commitHash: string;
  duration: number | null;
  createdAt: Date;
}

export const projects: ProjectSeed[] = [
  {
    name: 'zephyr-dashboard',
    description: 'React dashboard for deploy monitoring and analytics',
    repository: 'https://github.com/acme/zephyr-dashboard',
  },
  {
    name: 'api-gateway',
    description: 'Node.js API gateway handling request routing and auth',
    repository: 'https://github.com/acme/api-gateway',
  },
  {
    name: 'auth-service',
    description: 'Authentication microservice with JWT and OAuth2 support',
    repository: 'https://github.com/acme/auth-service',
  },
];

const branches = ['main', 'develop', 'feature/user-auth', 'feature/deploy-list', 'feature/metrics-widget'];

const environments = Object.values(ENVIRONMENTS) as Environment[];

const statusWeights: { status: DeployStatus; weight: number }[] = [
  { status: DEPLOY_STATUS.SUCCESS, weight: 70 },
  { status: DEPLOY_STATUS.FAILED, weight: 15 },
  { status: DEPLOY_STATUS.IN_PROGRESS, weight: 5 },
  { status: DEPLOY_STATUS.CANCELLED, weight: 10 },
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCommitHash(): string {
  return Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
}

function pickWeighted(weights: { status: DeployStatus; weight: number }[]): DeployStatus {
  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  let rand = Math.random() * total;
  for (const { status, weight } of weights) {
    rand -= weight;
    if (rand <= 0) return status;
  }
  return weights[0].status;
}

function randomDate(daysBack: number): Date {
  const now = Date.now();
  const past = now - daysBack * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

function buildDuration(env: Environment, status: DeployStatus): number | null {
  if (status === DEPLOY_STATUS.IN_PROGRESS) return null;
  if (status === DEPLOY_STATUS.CANCELLED) return randomInt(5, 30);

  const base = env === ENVIRONMENTS.PRODUCTION ? 60 : 15;
  const ceiling = env === ENVIRONMENTS.PRODUCTION ? 180 : 120;
  return randomInt(base, ceiling);
}

export function generateDeploys(count: number): DeploySeed[] {
  return Array.from({ length: count }, () => {
    const environment = environments[randomInt(0, environments.length - 1)];
    const status = pickWeighted(statusWeights);
    return {
      environment,
      status,
      branch: branches[randomInt(0, branches.length - 1)],
      commitHash: randomCommitHash(),
      duration: buildDuration(environment, status),
      createdAt: randomDate(30),
    };
  }).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}
