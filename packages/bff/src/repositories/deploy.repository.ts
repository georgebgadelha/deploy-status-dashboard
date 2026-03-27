import { DeployModel, IDeploy } from '../models/deploy.model';
import type { FilterQuery } from 'mongoose';

interface FindAllOptions {
  page: number;
  limit: number;
  environment?: string;
  status?: string;
  projectId?: string;
}

export const deployRepository = {
  async findAll({ page, limit, environment, status, projectId }: FindAllOptions) {
    const filter: FilterQuery<IDeploy> = {};
    if (environment) filter.environment = environment;
    if (status) filter.status = status;
    if (projectId) filter.projectId = projectId;

    const [data, total] = await Promise.all([
      DeployModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      DeployModel.countDocuments(filter),
    ]);

    return { data, total };
  },

  async findById(id: string) {
    return DeployModel.findById(id).lean();
  },

  async create(data: Partial<IDeploy>) {
    const deploy = await DeployModel.create(data);
    return deploy.toObject();
  },

  async updateStatus(id: string, status: string) {
    return DeployModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    ).lean();
  },

  async countByProject(projectId: string) {
    return DeployModel.countDocuments({ projectId });
  },
};
