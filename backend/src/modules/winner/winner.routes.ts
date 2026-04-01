import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middlewares/auth.middleware.js';
import { prisma } from '../../utils/prisma.js';

const router = Router();

// Get current user's winnings
router.get('/', authenticate, async (req: any, res) => {
  try {
    const winners = await prisma.winner.findMany({
      where: { userId: req.user.id },
    });
    res.json(winners);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload proof
router.post('/:id/proof', authenticate, async (req: any, res) => {
  try {
    const { proofUrl } = req.body;
    const winner = await prisma.winner.findUnique({ where: { id: req.params.id } });
    if (!winner || winner.userId !== req.user.id) {
      return res.status(404).json({ error: 'Winner not found' });
    }
    const updated = await prisma.winner.update({
      where: { id: req.params.id },
      data: { proofUrl, status: 'APPROVED' },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all winners
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const winners = await prisma.winner.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(winners);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Mark winner as paid
router.post('/:id/pay', authenticate, requireAdmin, async (req, res) => {
  try {
    const winner = await prisma.winner.update({
      where: { id: req.params.id },
      data: { status: 'PAID' },
    });
    res.json(winner);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
