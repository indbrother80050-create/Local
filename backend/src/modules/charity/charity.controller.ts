import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../utils/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';

const charitySchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
});

export const getCharities = async (req: AuthRequest, res: Response) => {
  try {
    const charities = await prisma.charity.findMany({
      where: { active: true },
    });
    res.json(charities);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCharity = async (req: AuthRequest, res: Response) => {
  try {
    const data = charitySchema.parse(req.body);
    const charity = await prisma.charity.create({ data });
    res.status(201).json(charity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCharity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = charitySchema.partial().parse(req.body);
    const charity = await prisma.charity.update({
      where: { id },
      data,
    });
    res.json(charity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const selectCharity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { charityId, charityPercent } = z.object({
      charityId: z.string(),
      charityPercent: z.number().min(10).max(100).optional(),
    }).parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        charityId,
        ...(charityPercent !== undefined && { charityPercent }),
      },
    });

    res.json({ charityId: user.charityId, charityPercent: user.charityPercent });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
