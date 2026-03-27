import { Router } from 'express';
import { projectController } from '../../controllers/project.controller';
import { validateProjectFilters, validateDeployFilters } from '../../middlewares/validator';

const router = Router();

router.get('/', validateProjectFilters, projectController.list);
router.get('/:id', projectController.getById);
router.get('/:id/deploys', validateDeployFilters, projectController.getDeploys);

export default router;
