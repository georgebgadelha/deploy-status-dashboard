import { Router } from 'express';
import projectRoutes from './project.routes';
import deployRoutes from './deploy.routes';
import metricRoutes from './metric.routes';

const router = Router();

router.use('/projects', projectRoutes);
router.use('/deploys', deployRoutes);
router.use('/metrics', metricRoutes);

export default router;
