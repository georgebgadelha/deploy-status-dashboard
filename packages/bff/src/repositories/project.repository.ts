import { ProjectModel, IProject } from '../models/project.model';
import type { FilterQuery } from 'mongoose';

interface FindAllOptions {
  page: number;
  limit: number;
  status?: string;
}

export const projectRepository = {
  async findAll({ page, limit, status }: FindAllOptions) {
    const filter: FilterQuery<IProject> = {};
    if (status) filter.status = status;

    const [data, total] = await Promise.all([
      ProjectModel.find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ProjectModel.countDocuments(filter),
    ]);

    return { data, total };
  },

  async findById(id: string) {
    return ProjectModel.findById(id).lean();
  },

  async count() {
    return ProjectModel.countDocuments();
  },
};
