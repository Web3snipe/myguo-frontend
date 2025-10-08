import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';
import { fetchWalletBalance, fetchTransactionHistory } from '../services/blockchain';
import { generateWalletTag } from '../services/ai';
import { createPortfolioSnapshot } from '../services/portfolio';
import { generateAIInsights } from '../services/ai';

const router = Router();

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// Sync wallet data in background
async function syncPrimaryWallet(walletId: string, address: string, userId: string) {
  try {
    console.log(`🔄 Syncing primary wallet ${address}...`);

    // Fetch balance from blockchain
    const balance = await fetchWalletBalance(address);

    // Update wallet total value
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        totalValueUSD: balance.totalValueUSD,
        lastSync: new Date(),
      },
    });

    // Save assets
    for (const token of balance.tokens) {
      if (token.valueUSD > 0.01) {
        await prisma.asset.create({
          data: {
            walletId,
            tokenAddress: token.tokenAddress,
            symbol: token.symbol,
            name: token.name,
            balance: token.balance,
            valueUSD: token.valueUSD,
          },
        });
      }
    }

    // Fetch and save transactions
    const transactions = await fetchTransactionHistory(address, 20);
    
    for (const tx of transactions) {
      try {
        await prisma.transaction.create({
          data: {
            walletId,
            hash: tx.hash,
            type: tx.type,
            fromToken: tx.fromToken,
            toToken: tx.toToken,
            amount: tx.amount,
            valueUSD: tx.valueUSD,
            gasUsed: tx.gasUsed,
            gasPrice: tx.gasPrice,
            timestamp: tx.timestamp,
          },
        });
      } catch (error: any) {
        if (!error.message.includes('Unique constraint')) {
          console.error(`Error saving transaction:`, error);
        }
      }
    }

    // Generate AI tag
    await generateWalletTag(walletId);

    // Create initial snapshot
    await createPortfolioSnapshot(userId, walletId);

    // Generate AI insights
    await generateAIInsights(userId);

    console.log(`✅ Primary wallet ${address} synced successfully`);
  } catch (error) {
    console.error(`Error syncing primary wallet:`, error);
  }
}

// Middleware to verify Privy token
async function verifyPrivyToken(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);
    const claims = await privy.verifyAuthToken(token);
    req.userId = claims.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Login/Register - Create or retrieve user
router.post('/login', async (req, res) => {
  try {
    const { walletAddress, privyUserId } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Normalize wallet address
    const normalizedAddress = walletAddress.toLowerCase();

    // Check if wallet already exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { address: normalizedAddress },
      include: { user: true },
    });

    let user;
    
    if (existingWallet) {
      // Wallet exists, return the associated user
      user = await prisma.user.findUnique({
        where: { id: existingWallet.userId },
        include: {
          wallets: true,
          aiInsights: {
            where: { status: 'active' },
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } else {
      // Create new user with primary wallet
      user = await prisma.user.create({
        data: {
          primaryWalletAddress: normalizedAddress,
          wallets: {
            create: {
              address: normalizedAddress,
              isPrimary: true,
            },
          },
        },
        include: {
          wallets: true,
          aiInsights: true,
        },
      });

      // Sync wallet data in background
      const primaryWallet = user.wallets.find(w => w.isPrimary);
      if (primaryWallet) {
        syncPrimaryWallet(primaryWallet.id, normalizedAddress, user.id).catch(console.error);
      }
    }

    res.json({
      user: {
        id: user.id,
        primaryWalletAddress: user.primaryWalletAddress,
        wallets: user.wallets,
        aiInsights: user.aiInsights,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', verifyPrivyToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.userId },
      include: {
        wallets: true,
        aiInsights: {
          where: { status: 'active' },
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
export { verifyPrivyToken };

