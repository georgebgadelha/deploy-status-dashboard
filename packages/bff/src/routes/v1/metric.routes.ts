import { Router } from 'express';
import { metricController } from '../../controllers/metric.controller';
import { validatePeriod } from '../../middlewares/validator';

const router = Router();

router.get('/overview', validatePeriod, metricController.getOverview);
router.get('/projects/:id', validatePeriod, metricController.getByProject);

export default router;
