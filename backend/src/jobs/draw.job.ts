import cron from 'node-cron';
import { prisma } from '../utils/prisma.js';

// Run on the 1st of every month at 00:00
cron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly draw cron job...');
  try {
    const month = new Date();
    month.setDate(1);

    const draw = await prisma.draw.create({
      data: {
        month,
        totalPool: 5000, // In reality, this would be calculated from subscriptions
        status: 'COMPLETED',
      },
    });

    // Algorithmic weighting: more scores = higher chance
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
      // Create a weighted array
      const weightedUsers: typeof users[0][] = [];
      for (const user of users) {
        // Base weight is 1. Add 1 for every score they have.
        const weight = 1 + user.scores.length;
        for (let i = 0; i < weight; i++) {
          weightedUsers.push(user);
        }
      }

      // Select winner
      const winner = weightedUsers[Math.floor(Math.random() * weightedUsers.length)];
      
      await prisma.winner.create({
        data: {
          userId: winner.id,
          drawId: draw.id,
          prize: draw.totalPool * 0.4,
          status: 'PENDING',
        },
      });
      console.log(`Draw completed. Winner: ${winner.email}`);
    } else {
      console.log('No active users found for the draw.');
    }
  } catch (error) {
    console.error('Error running monthly draw:', error);
  }
});
