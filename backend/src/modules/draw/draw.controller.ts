import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../utils/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

export const getDraws = async (req: AuthRequest, res: Response) => {
  try {
    const draws = await prisma.draw.findMany({
      orderBy: { month: 'desc' },
      include: { results: true },
    });
    res.json(draws);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const runDraw = async (req: AuthRequest, res: Response) => {
  try {
    const { mode } = z.object({ mode: z.enum(['RANDOM', 'ALGORITHM']) }).parse(req.body);

    // Basic logic for running a draw
    const month = new Date();
    month.setDate(1); // First day of current month

    let draw = await prisma.draw.findFirst({
      where: { month: { gte: month }, status: 'PENDING' },
    });

    if (!draw) {
      draw = await prisma.draw.create({
        data: {
          month,
          totalPool: 1000, // Mock pool
          status: 'COMPLETED',
        },
      });
    } else {
      draw = await prisma.draw.update({
        where: { id: draw.id },
        data: { status: 'COMPLETED' },
      });
    }

    // Algorithmic weighting
    const users = await prisma.user.findMany({
      where: {
        subscription: {
          status: 'ACTIVE',
        },
      },
      include: {
        scores: true,
      }
    });
    
    if (users.length > 0) {
      const weightedUsers: typeof users[0][] = [];
      for (const user of users) {
        const weight = 1 + user.scores.length;
        for (let i = 0; i < weight; i++) {
          weightedUsers.push(user);
        }
      }

      const winner = weightedUsers[Math.floor(Math.random() * weightedUsers.length)];
      
      await prisma.winner.create({
        data: {
          userId: winner.id,
          drawId: draw.id,
          prize: draw.totalPool * 0.4,
          status: 'PENDING',
        },
      });
    }

    res.json({ message: 'Draw completed', draw });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
