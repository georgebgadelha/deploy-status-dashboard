import type { Request, Response, NextFunction } from 'express';
import { metricService } from '../services/metric.service';
import { sendSuccess, sendError } from '../utils/response';

export const metricController = {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const period = (req.query.period as string) || '30d';
      const data = await metricService.getOverview(period);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getByProject(req: Request, res: Response, next: NextFunction) {
    try {
      const period = (req.query.period as string) || '30d';
      const data = await metricService.getByProject(req.params.id as string, period);

      if (!data) {
        return sendError(res, 'NOT_FOUND', 'Project not found', 404);
      }

      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },
};
