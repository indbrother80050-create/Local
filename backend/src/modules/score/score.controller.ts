import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../utils/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

const scoreSchema = z.object({
  value: z.number().int().min(1).max(45),
  date: z.string().datetime().optional(),
});

export const addScore = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { value, date } = scoreSchema.parse(req.body);

    // Add new score
    const newScore = await prisma.score.create({
      data: {
        userId,
        value,
        date: date ? new Date(date) : new Date(),
      },
    });

    // Keep only the latest 5 scores
    const userScores = await prisma.score.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { id: true },
    });

    if (userScores.length > 5) {
      const scoresToDelete = userScores.slice(5).map(s => s.id);
      await prisma.score.deleteMany({
        where: { id: { in: scoresToDelete } },
      });
    }

    res.status(201).json(newScore);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getScores = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const scores = await prisma.score.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
