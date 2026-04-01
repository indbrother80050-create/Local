import { Router } from 'express';
import { getCharities, createCharity, updateCharity, selectCharity } from './charity.controller.js';
import { authenticate, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getCharities);
router.post('/', authenticate, requireAdmin, createCharity);
router.put('/:id', authenticate, requireAdmin, updateCharity);

router.post('/select', authenticate, selectCharity);

export default router;
