import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import scoreRoutes from '../modules/score/score.routes.js';
import charityRoutes from '../modules/charity/charity.routes.js';
import subscriptionRoutes from '../modules/subscription/subscription.routes.js';
import drawRoutes from '../modules/draw/draw.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import winnerRoutes from '../modules/winner/winner.routes.js';
import uploadRoutes from '../modules/upload/upload.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/scores', scoreRoutes);
router.use('/charities', charityRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/draws', drawRoutes);
router.use('/admin', adminRoutes);
router.use('/winners', winnerRoutes);
router.use('/upload', uploadRoutes);

export default router;
