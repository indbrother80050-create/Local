import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../utils/prisma.js';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn('STRIPE_SECRET_KEY is missing. Using mock Stripe client.');
      // Return a mock object for preview purposes
      return {
        checkout: {
          sessions: {
            create: async () => ({ url: 'https://checkout.stripe.com/mock' }),
          },
        },
      } as any;
    }
    stripeClient = new Stripe(key, { apiVersion: '2025-02-24.acacia' as any });
  }
  return stripeClient;
}

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { plan } = z.object({ plan: z.enum(['MONTHLY', 'YEARLY']) }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const stripe = getStripe();
    
    // Mock price IDs
    const priceId = plan === 'MONTHLY' ? 'price_monthly_mock' : 'price_yearly_mock';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.APP_URL}/dashboard?canceled=true`,
      client_reference_id: userId,
      customer_email: user.email,
    });

    res.json({ url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSubscriptionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    res.json(sub || { status: 'INACTIVE' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET is missing. Skipping webhook verification.');
    return res.status(200).send('Webhook received (unverified)');
  }

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      
      if (userId) {
        await prisma.subscription.upsert({
          where: { userId },
          update: { status: 'ACTIVE', stripeCustomerId: session.customer as string },
          create: {
            userId,
            status: 'ACTIVE',
            plan: 'MONTHLY',
            stripeCustomerId: session.customer as string,
          },
        });
      }
    }

    res.status(200).send('Webhook handled');
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
