import { Router } from 'express';
import { deployController } from '../../controllers/deploy.controller';
import { writeLimiter } from '../../middlewares/rate-limiter';
import {
  validateDeployFilters,
  validateCreateDeploy,
  validateUpdateStatus,
} from '../../middlewares/validator';

const router = Router();

router.get('/', validateDeployFilters, deployController.list);
router.get('/:id', deployController.getById);
router.post('/', writeLimiter, validateCreateDeploy, deployController.create);
router.patch('/:id/status', writeLimiter, validateUpdateStatus, deployController.updateStatus);

export default router;
