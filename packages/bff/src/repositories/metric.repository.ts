import { DeployModel } from '../models/deploy.model';
import { DEPLOY_STATUS } from '@zephyr-deploy/shared';
import { Types, type PipelineStage } from 'mongoose';

function periodFilter(period: string): Date {
  const days = period === '7d' ? 7 : 30;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export const metricRepository = {
  async getOverview(period: string) {
    const since = periodFilter(period);

    const pipeline: PipelineStage[] = [
      { $match: { createdAt: { $gte: since } } },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalDeploys: { $sum: 1 },
                successCount: {
                  $sum: { $cond: [{ $eq: ['$status', DEPLOY_STATUS.SUCCESS] }, 1, 0] },
                },
                totalDuration: {
                  $sum: { $cond: [{ $ne: ['$duration', null] }, '$duration', 0] },
                },
                durationCount: {
                  $sum: { $cond: [{ $ne: ['$duration', null] }, 1, 0] },
                },
              },
            },
          ],
          byEnvironment: [{ $group: { _id: '$environment', count: { $sum: 1 } } }],
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          today: [
            {
              $match: {
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ];

    const [result] = await DeployModel.aggregate(pipeline);

    const totals = result.totals[0] || {
      totalDeploys: 0,
      successCount: 0,
      totalDuration: 0,
      durationCount: 0,
    };

    const byEnvironment: Record<string, number> = {};
    for (const item of result.byEnvironment) {
      byEnvironment[item._id] = item.count;
    }

    const byStatus: Record<string, number> = {};
    for (const item of result.byStatus) {
      byStatus[item._id] = item.count;
    }

    return {
      totalDeploys: totals.totalDeploys,
      successRate: totals.totalDeploys > 0
        ? Math.round((totals.successCount / totals.totalDeploys) * 100 * 100) / 100
        : 0,
      avgBuildTime: totals.durationCount > 0
        ? Math.round((totals.totalDuration / totals.durationCount) * 100) / 100
        : 0,
      deploysToday: result.today[0]?.count || 0,
      byEnvironment,
      byStatus,
    };
  },

  async getByProject(projectId: string, period: string) {
    const since = periodFilter(period);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new Types.ObjectId(projectId),
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: null,
          totalDeploys: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', DEPLOY_STATUS.SUCCESS] }, 1, 0] },
          },
          totalDuration: {
            $sum: { $cond: [{ $ne: ['$duration', null] }, '$duration', 0] },
          },
          durationCount: {
            $sum: { $cond: [{ $ne: ['$duration', null] }, 1, 0] },
          },
        },
      },
    ];

    const [result] = await DeployModel.aggregate(pipeline);

    if (!result) {
      return { totalDeploys: 0, successRate: 0, avgBuildTime: 0, deploysToday: 0 };
    }

    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const deploysToday = await DeployModel.countDocuments({
      projectId,
      createdAt: { $gte: todayStart },
    });

    return {
      totalDeploys: result.totalDeploys,
      successRate: result.totalDeploys > 0
        ? Math.round((result.successCount / result.totalDeploys) * 100 * 100) / 100
        : 0,
      avgBuildTime: result.durationCount > 0
        ? Math.round((result.totalDuration / result.durationCount) * 100) / 100
        : 0,
      deploysToday,
    };
  },
};
