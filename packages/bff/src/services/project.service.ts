import { projectRepository } from '../repositories/project.repository';

interface ListOptions {
  page: number;
  limit: number;
  status?: string;
}

export const projectService = {
  async list({ page, limit, status }: ListOptions) {
    return projectRepository.findAll({ page, limit, status });
  },

  async getById(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) return null;
    return project;
  },
};
