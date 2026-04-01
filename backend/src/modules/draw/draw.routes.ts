import { Router } from 'express';
import { getDraws, runDraw } from './draw.controller.js';
import { authenticate, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getDraws);
router.post('/run', authenticate, requireAdmin, runDraw);

export default router;
