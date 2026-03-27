import { Router } from 'express';
import v1Routes from './v1';
import { auth } from '../middlewares/auth';
import { globalLimiter } from '../middlewares/rate-limiter';

const router = Router();

router.use('/api/v1', auth, globalLimiter, v1Routes);

export default router;
