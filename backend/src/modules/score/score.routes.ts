import { Router } from 'express';
import { addScore, getScores } from './score.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.post('/', addScore);
router.get('/', getScores);

export default router;
