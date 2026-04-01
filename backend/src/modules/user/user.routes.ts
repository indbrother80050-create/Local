import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { prisma } from '../../utils/prisma.js';

const router = Router();

router.get('/me', authenticate, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, charityId: true, charityPercent: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
