import { Router } from 'express';
import { createCheckoutSession, getSubscriptionStatus } from './subscription.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.post('/create-checkout-session', createCheckoutSession);
router.get('/status', getSubscriptionStatus);

export default router;
