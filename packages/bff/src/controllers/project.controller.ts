import type { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';
import { deployService } from '../services/deploy.service';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';

export const projectController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query as any);
      const status = req.query.status as string | undefined;

      const { data, total } = await projectService.list({ page, limit, status });
      const pagination = buildPaginationMeta(page, limit, total);

      sendPaginated(res, data, pagination);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getById(req.params.id as string);
      if (!project) {
        return sendError(res, 'NOT_FOUND', 'Project not found', 404);
      }
      sendSuccess(res, project);
    } catch (err) {
      next(err);
    }
  },

  async getDeploys(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const project = await projectService.getById(id);
      if (!project) {
        return sendError(res, 'NOT_FOUND', 'Project not found', 404);
      }

      const { page, limit } = parsePagination(req.query as any);
      const environment = req.query.env as string | undefined;
      const status = req.query.status as string | undefined;

      const { data, total } = await deployService.list({
        page,
        limit,
        environment,
        status,
        projectId: id,
      });

      const pagination = buildPaginationMeta(page, limit, total);
      sendPaginated(res, data, pagination);
    } catch (err) {
      next(err);
    }
  },
};
