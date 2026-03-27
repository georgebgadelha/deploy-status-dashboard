import { metricRepository } from '../repositories/metric.repository';
import { projectRepository } from '../repositories/project.repository';

export const metricService = {
  async getOverview(period: string = '30d') {
    return metricRepository.getOverview(period);
  },

  async getByProject(projectId: string, period: string = '30d') {
    const project = await projectRepository.findById(projectId);
    if (!project) return null;
    return metricRepository.getByProject(projectId, period);
  },
};
