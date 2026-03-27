import type { Request, Response, NextFunction } from 'express';
import { deployService } from '../services/deploy.service';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';

export const deployController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query as any);
      const environment = req.query.env as string | undefined;
      const status = req.query.status as string | undefined;

      const { data, total } = await deployService.list({ page, limit, environment, status });
      const pagination = buildPaginationMeta(page, limit, total);

      sendPaginated(res, data, pagination);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const deploy = await deployService.getById(req.params.id as string);
      if (!deploy) {
        return sendError(res, 'NOT_FOUND', 'Deploy not found', 404);
      }
      sendSuccess(res, deploy);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, environment, branch } = req.body;
      const result = await deployService.create({ projectId, environment, branch });

      if ('error' in result && result.error) {
        return sendError(res, result.error, result.error.replace(/_/g, ' ').toLowerCase(), 400);
      }

      sendSuccess(res, result.data, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deployService.updateStatus(req.params.id as string, req.body.status);

      if ('error' in result && result.error) {
        const statusCode = result.error === 'DEPLOY_NOT_FOUND' ? 404 : 400;
        return sendError(res, result.error, result.error.replace(/_/g, ' ').toLowerCase(), statusCode);
      }

      sendSuccess(res, result.data);
    } catch (err) {
      next(err);
    }
  },
};
